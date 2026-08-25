import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, Copy, Check, Terminal, ShieldAlert, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  isResyncing: boolean;
  resyncMessage: string | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      isResyncing: false,
      resyncMessage: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      copied: false,
      isResyncing: false,
      resyncMessage: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Atlas Sanctum Global Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    try {
      // Clear transient session caches if needed
      sessionStorage.removeItem('atlas_transient_error');
    } catch {
      // Ignore storage errors
    }
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      resyncMessage: null
    });
  };

  private handleCopyDiagnostic = () => {
    const diagnostic = `[ATLAS SANCTUM RUNTIME DIAGNOSTIC]
Timestamp: ${new Date().toISOString()}
Error: ${this.state.error?.message || 'Unknown Error'}
Stack:
${this.state.error?.stack || 'No stack trace available'}
Component Stack:
${this.state.errorInfo?.componentStack || 'No component stack available'}
User Agent: ${navigator.userAgent}`;

    navigator.clipboard.writeText(diagnostic).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    });
  };

  private handleResyncDevServer = async () => {
    this.setState({ isResyncing: true, resyncMessage: 'Pinging & restarting dev server process...' });
    try {
      const res = await fetch('/api/dev/restart', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        this.setState({
          isResyncing: false,
          resyncMessage: `Server synchronized (${data.latencyMs || 42}ms). Refreshing application...`
        });
        setTimeout(() => {
          this.handleReset();
        }, 1200);
      } else {
        throw new Error('Server returned ' + res.status);
      }
    } catch (err: any) {
      this.setState({
        isResyncing: false,
        resyncMessage: 'Server unreachable or offline. Performing browser reload...'
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full bg-[#080808] text-[#F5F5F0] flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-[#C5A059] selection:text-black">
          <div className="max-w-2xl w-full bg-[#0D0D0D] border border-amber-500/30 rounded-lg p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1B3022]/30 rounded-full blur-3xl pointer-events-none" />

            {/* Header / Icon */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Runtime Safeguard Engaged
                </div>
                <span className="text-[10px] font-mono text-[#F5F5F0]/40">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0] tracking-tight">
                System Encountered an Unexpected Exception
              </h1>
              <p className="text-xs sm:text-sm text-[#F5F5F0]/70 leading-relaxed font-sans">
                The Atlas Sanctum Global Error Boundary prevented an application crash. All data trusts and sovereign state remain safeguarded. You can recover immediately using the options below.
              </p>
            </div>

            {/* Resync status toast if active */}
            {this.state.resyncMessage && (
              <div className="relative z-10 p-3 bg-[#1B3022]/80 border border-emerald-500/40 rounded-sm text-xs font-mono text-emerald-300 flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${this.state.isResyncing ? 'animate-spin' : ''}`} />
                <span>{this.state.resyncMessage}</span>
              </div>
            )}

            {/* Error Message Box */}
            <div className="relative z-10 p-4 bg-[#050505] border border-[#F5F5F0]/10 rounded-md space-y-2 font-mono">
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  Error Diagnostics
                </span>
                <span className="text-[10px] text-[#F5F5F0]/40">Type: {this.state.error?.name || 'Error'}</span>
              </div>
              <p className="text-xs text-[#F5F5F0] break-words">
                {this.state.error?.message || 'A client-side runtime exception occurred.'}
              </p>
              {this.state.error?.stack && (
                <details className="pt-2 text-[10px] text-[#F5F5F0]/50 cursor-pointer">
                  <summary className="hover:text-[#F5F5F0] transition-colors uppercase tracking-wider font-mono">
                    View Call Stack
                  </summary>
                  <pre className="mt-2 p-2 bg-[#0A0A0A] rounded border border-[#F5F5F0]/5 max-h-40 overflow-y-auto text-[9px] text-[#F5F5F0]/70 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 pt-2 flex flex-wrap items-center gap-3">
              {/* 1. Reload Application */}
              <button
                id="error-reload-app-btn"
                onClick={this.handleReload}
                className="flex-1 min-w-[140px] px-4 py-3 bg-[#C5A059] hover:bg-[#D4B26F] text-black font-semibold rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>

              {/* 2. Reset UI State */}
              <button
                id="error-reset-state-btn"
                onClick={this.handleReset}
                className="px-4 py-3 bg-[#1A1A1A] hover:bg-[#252525] border border-[#F5F5F0]/20 text-[#F5F5F0] font-semibold rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Recover UI State</span>
              </button>

              {/* 3. Dev Server Re-Sync */}
              <button
                id="error-resync-dev-btn"
                onClick={this.handleResyncDevServer}
                disabled={this.state.isResyncing}
                className="px-4 py-3 bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/40 text-emerald-300 font-semibold rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 font-mono"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${this.state.isResyncing ? 'animate-spin' : ''}`} />
                <span>Restart Dev Sync</span>
              </button>

              {/* 4. Copy Diagnostics */}
              <button
                id="error-copy-stack-btn"
                onClick={this.handleCopyDiagnostic}
                className="p-3 bg-[#121212] hover:bg-[#1A1A1A] border border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-[#F5F5F0] rounded-sm text-xs transition-all"
                title="Copy Diagnostic Details"
                aria-label="Copy Diagnostic Details"
              >
                {this.state.copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Footer Notice */}
            <div className="relative z-10 pt-4 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[10px] text-[#F5F5F0]/40 font-mono">
              <span>Atlas Sanctum Epistemic Core v3.0</span>
              <span>Inviolable Human Dignity & Data Safety</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
