import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
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
    // Log interno en consola únicamente para diagnóstico técnico
    console.error('[ErrorBoundary] Error capturado en el módulo:', error, errorInfo);
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
        <div className="min-h-[380px] flex items-center justify-center p-6 bg-white dark:bg-[#0F141C] rounded-2xl border border-surface-container-highest dark:border-[#1E2638] shadow-tactile my-6 animate-fade-in">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="inline-flex p-3.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl mb-1 shadow-soft">
              <AlertTriangle size={30} />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-h2 text-lg font-bold text-slate-900 dark:text-slate-100">
                {this.props.fallbackTitle || 'Módulo temporalmente no disponible'}
              </h2>
              <p className="font-subtitle text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed">
                {this.props.fallbackDescription ||
                  'Estamos actualizando las fuentes de datos y cotizaciones en tiempo real. Por favor, reintenta en unos instantes o regresa al panel principal.'}
              </p>
            </div>

            <div className="p-3 bg-surface-container-low dark:bg-[#131822] border border-surface-container-high dark:border-[#1E2638] rounded-xl text-xs text-on-surface-variant dark:text-slate-400">
              <span className="block font-medium">
                Tu sesión sigue activa y los demás módulos continúan funcionando con normalidad.
              </span>
            </div>

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
