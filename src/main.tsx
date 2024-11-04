import React from 'react';
import { createRoot } from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import App from './App';
import './index.css';

try {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element not found');
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to mount application:', error);
  document.body.innerHTML = `
    <div style="padding: 20px;">
      <h1 style="color: red;">Application Error</h1>
      <p>Failed to initialize the application. Please refresh the page.</p>
      <pre style="background: #f5f5f5; padding: 10px;">${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
}