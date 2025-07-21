// index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Performance monitoring (optional)
function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onINP(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
}

// Service Worker Registration (optional for PWA)
function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// Initialize app
function initializeApp() {
  const container = document.getElementById('root');
  
  if (!container) {
    throw new Error('Failed to find the root element. Make sure you have a div with id="root" in your HTML.');
  }

  const root = createRoot(container);

  // Render the app
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Enable performance monitoring in development
  if (process.env.NODE_ENV === 'development') {
    reportWebVitals(console.log);
  }

  // Register service worker for PWA functionality (optional)
  if (process.env.NODE_ENV === 'production') {
    registerSW();
  }
}

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // You can send this to your error reporting service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // You can send this to your error reporting service
});

// Initialize the application
try {
  initializeApp();
} catch (error) {
  console.error('Failed to initialize app:', error);
  
  // Fallback error display
  const container = document.getElementById('root');
  if (container) {
    container.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">
        <div style="
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          padding: 2rem;
          max-width: 500px;
        ">
          <h1 style="color: #dc2626; margin-bottom: 1rem;">
            Application Error
          </h1>
          <p style="color: #7f1d1d; margin-bottom: 1.5rem;">
            Sorry, something went wrong while loading the application. Please refresh the page or try again later.
          </p>
          <button 
            onclick="window.location.reload()" 
            style="
              background: #dc2626;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.375rem;
              cursor: pointer;
              font-size: 1rem;
            "
          >
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}