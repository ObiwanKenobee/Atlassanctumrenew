import {
  VercelDeploymentStatus,
  VercelBuildLog,
  VercelWebhookPayload,
  VercelWebhookEventType,
  VercelDeploymentTarget,
  VercelRuntimeErrorLog,
  EdgeHealthStats
} from '../types';

/**
 * Vercel API Service Layer
 * 
 * Safely communicates with Vercel API via server-side proxies,
 * preserving project-scoped tokens and providing fallback synthetic metrics
 * when running in standalone container mode.
 */
class VercelApiService {
  private localTokenKey = 'atlas_vercel_token';
  private localProjectKey = 'atlas_vercel_project_id';

  // Retrieve locally saved token if any
  getToken(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(this.localTokenKey) || '';
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.localTokenKey, token);
  }

  getProjectId(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(this.localProjectKey) || '';
  }

  setProjectId(id: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.localProjectKey, id);
  }

  clearCredentials(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.localTokenKey);
    localStorage.removeItem(this.localProjectKey);
  }

  /**
   * Fetch current deployment status and build logs
   */
  async getDeploymentStatus(token?: string, projectId?: string): Promise<VercelDeploymentStatus> {
    const activeToken = token || this.getToken();
    const activeProject = projectId || this.getProjectId();

    const params = new URLSearchParams();
    if (activeToken) params.append('token', activeToken);
    if (activeProject) params.append('projectId', activeProject);

    const url = `/api/deployment/status${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch deployment status: HTTP ${res.status}`);
    }
    return await res.json();
  }

  /**
   * Fetch real-time runtime serverless error logs
   */
  async getRuntimeErrorLogs(options?: { limit?: number; environment?: string }): Promise<VercelRuntimeErrorLog[]> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.environment) params.append('environment', options.environment);

    const token = this.getToken();
    const projectId = this.getProjectId();
    if (token) params.append('token', token);
    if (projectId) params.append('projectId', projectId);

    const url = `/api/vercel/runtime-errors${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch runtime error logs: HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.errors || [];
  }

  /**
   * Fetch edge functions health statistics
   */
  async getEdgeHealthStats(): Promise<EdgeHealthStats> {
    const res = await fetch('/api/vercel/edge-health');
    if (!res.ok) {
      throw new Error(`Failed to fetch edge health: HTTP ${res.status}`);
    }
    return await res.json();
  }

  /**
   * Fetch historical received webhook events
   */
  async getWebhookEvents(): Promise<VercelWebhookPayload[]> {
    const res = await fetch('/api/webhooks/vercel/events');
    if (!res.ok) {
      throw new Error(`Failed to fetch webhook events: HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.events || [];
  }

  /**
   * Simulate a Vercel Webhook Event (for testing real-time failure alerts)
   */
  async simulateWebhookEvent(
    type: VercelWebhookEventType,
    target: VercelDeploymentTarget = 'production',
    customError?: string
  ): Promise<VercelWebhookPayload> {
    const res = await fetch('/api/webhooks/vercel/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, target, customError }),
    });
    if (!res.ok) {
      throw new Error(`Failed to simulate webhook event: HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.event;
  }

  /**
   * Live ping to edge serverless functions
   */
  async testEdgePing(): Promise<{ latencyMs: number; region: string; status: number }> {
    const start = Date.now();
    const res = await fetch('/api/diagnostics/ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientTime: start }),
    });
    const latency = Date.now() - start;
    const data = await res.json().catch(() => ({}));
    return {
      latencyMs: latency,
      region: data.edgeRegion || 'local-dev',
      status: res.status,
    };
  }
}

export const vercelApi = new VercelApiService();
