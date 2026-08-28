import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import { AppProvider } from './app/providers/AppContext';
import { ErrorBoundary } from './core/ui/components/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary fallbackTitle="Error crítico en la aplicación">
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
