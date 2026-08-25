import { AuditEvent, RiskLevel, AgentPermission } from './types';
import { getAgentById, getToolByName } from './agentRegistry';

export interface ModelArmorInspection {
  verdict: 'CLEARED' | 'FLAGGED' | 'SANITIZED' | 'BLOCKED';
  confidence: number;
  threatsDetected: string[];
  sanitizedInput?: string;
  policyNotes: string;
}

// In-memory audit event log
let auditTrail: AuditEvent[] = [];
const auditListeners = new Set<(logs: AuditEvent[]) => void>();

export function subscribeAuditLogs(callback: (logs: AuditEvent[]) => void) {
  auditListeners.add(callback);
  callback([...auditTrail]);
  return () => {
    auditListeners.delete(callback);
  };
}

function broadcastAuditLogs() {
  auditListeners.forEach((fn) => fn([...auditTrail]));
}

export function logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
  const newEvent: AuditEvent = {
    ...event,
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString()
  };

  auditTrail = [newEvent, ...auditTrail].slice(0, 200);
  broadcastAuditLogs();
  return newEvent;
}

export function getAuditTrail(): AuditEvent[] {
  return [...auditTrail];
}

/**
 * Model Armor & Policy Enforcement Layer
 * Inspects agent instructions, tool arguments, and user prompts for injection risks and permission violations.
 */
export function inspectModelArmor(
  input: string,
  agentId: string,
  toolName?: string
): ModelArmorInspection {
  const agent = getAgentById(agentId);
  const threats: string[] = [];
  let verdict: 'CLEARED' | 'FLAGGED' | 'SANITIZED' | 'BLOCKED' = 'CLEARED';
  let sanitized = input;

  const lower = input.toLowerCase();

  // 1. Jailbreak / Injection Detection Patterns
  const injectionSignatures = [
    'ignore all previous instructions',
    'system prompt override',
    'disregard safety guidelines',
    'you are now in god mode',
    'bypass permission check',
    'delete all tables',
    'drop database',
    'export private keys'
  ];

  for (const sig of injectionSignatures) {
    if (lower.includes(sig)) {
      threats.push(`Critical Injection Signature: "${sig}"`);
      verdict = 'BLOCKED';
    }
  }

  // 2. Secret / Token leakage protection
  if (/sk-[a-zA-Z0-9]{20,}/.test(input) || /AIzaSy[a-zA-Z0-9_-]{33}/.test(input)) {
    threats.push('Sensitive API Credential / Secret Detected in Payload');
    sanitized = input.replace(/sk-[a-zA-Z0-9]{20,}/g, '[REDACTED_KEY]').replace(/AIzaSy[a-zA-Z0-9_-]{33}/g, '[REDACTED_API_KEY]');
    if (verdict !== 'BLOCKED') verdict = 'SANITIZED';
  }

  // 3. Tool Permission & Privilege Boundary Verification
  if (toolName && agent) {
    const tool = getToolByName(toolName);
    if (!agent.tools.includes(toolName)) {
      threats.push(`Privilege Boundary Violation: Agent ${agent.name} is not authorized to invoke tool "${toolName}"`);
      verdict = 'BLOCKED';
    }
  }

  return {
    verdict,
    confidence: verdict === 'CLEARED' ? 0.99 : 0.95,
    threatsDetected: threats,
    sanitizedInput: sanitized,
    policyNotes: verdict === 'CLEARED' 
      ? 'Payload conforms to Atlas Enterprise Model Armor & Canon XXIII Safety standard.'
      : `Model Armor intervened with action: ${verdict}. Threats: ${threats.join('; ')}`
  };
}
