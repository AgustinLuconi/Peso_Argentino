import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Error no capturado en la aplicación:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-surface-container-lowest dark:bg-[#040914] rounded-2xl border border-surface-container-highest dark:border-[#1a2744] shadow-tactile my-6 animate-fade-in">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="inline-flex p-3.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-2xl mb-1 shadow-soft">
              <AlertTriangle size={32} />
            </div>

            <div>
              <h2 className="font-h2 text-lg text-primary dark:text-slate-100">
                {this.props.fallbackTitle || 'Se produjo un error inesperado en este módulo'}
              </h2>
              <p className="font-subtitle text-xs text-on-surface-variant dark:text-slate-300 mt-1.5 leading-relaxed">
                El sistema aisló el fallo para proteger la estabilidad del monitor. Puedes reintentar la operación o volver al inicio.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-surface-container-low dark:bg-[#071228] border border-surface-container-high dark:border-[#1a2744] rounded-xl text-left overflow-x-auto text-[11px] font-mono text-on-surface-variant dark:text-slate-400 max-h-32">
                {this.state.error.message || 'Error de renderizado de componente'}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={this.handleReload}
                icon={<RefreshCw size={14} />}
              >
                Reintentar Módulo
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={this.handleGoHome}
                icon={<Home size={14} />}
              >
                Ir al Inicio
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
