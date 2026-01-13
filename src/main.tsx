import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import * as Sentry from "@sentry/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/error-boundary.tsx";
import "./index.css";

// Initialize Sentry
let sentryInitialized = false;
try {
  // Test if Sentry can make requests - use a simple HEAD request
  fetch('https://o4510487277142016.ingest.de.sentry.io/api/4510493281747024/envelope/?sentry_version=7&sentry_key=f76345a28765c19bf814840320254294&sentry_client=sentry.javascript.react%2F10.29.0', {
    method: 'HEAD',
    mode: 'no-cors', // This should prevent CORS issues
  }).then(() => {
    // If fetch succeeds, initialize Sentry
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      sendDefaultPii: true,
      environment: import.meta.env.MODE,
    });
    sentryInitialized = true;
  }).catch(() => {
    console.warn('Sentry blocked by ad blocker or network issues, completely disabling Sentry');
    // Disable Sentry globally
    window.Sentry = null;
    window.__SENTRY__ = null;
  });
} catch (error) {
  console.warn('Sentry initialization failed, disabling Sentry:', error);
  // Disable Sentry globally
  window.Sentry = null;
  window.__SENTRY__ = null;
}

// Load Clerk key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Get root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Add global error handlers
const originalConsoleWarn = console.warn;
console.warn = function(...args) {
  // Suppress moment.js warnings
  if (args.some(arg => typeof arg === 'string' && arg.includes('moment construction falls back to js Date'))) {
    return;
  }
  
  // Suppress preload warnings
  if (args.some(arg => typeof arg === 'string' && arg.includes('preload but not used'))) {
    return;
  }

  // Suppress KonfHub monitoring errors
  if (args.some(arg => typeof arg === 'string' && arg.includes('konfhub.com/monitoring'))) {
    return;
  }
  
  // Call original console.warn
  originalConsoleWarn.apply(console, args);
};

window.addEventListener('error', (event) => {
  // Suppress moment.js warnings
  if (event.message && event.message.includes('moment construction falls back to js Date')) {
    event.preventDefault();
    return false;
  }
  
  // Suppress React hydration errors in production
  if (event.message && (event.message.includes('Minified React error #418') || event.message.includes('Minified React error #422'))) {
    console.warn('React hydration error suppressed:', event.message);
    event.preventDefault();
    return false;
  }
  
  // Log other errors but don't prevent them
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  // Suppress fetch rejections that are blocked
  if (event.reason && typeof event.reason === 'object' && event.reason.message) {
    if (event.reason.message.includes('ERR_BLOCKED_BY_CLIENT') || 
        event.reason.message.includes('blocked')) {
      event.preventDefault();
      console.warn('Request blocked by client (likely ad blocker):', event.reason.message);
      return false;
    }
  }

  // Suppress KonfHub monitoring rejections
  if (event.reason && typeof event.reason === 'object' && event.reason.message) {
    if (event.reason.message.includes('konfhub.com/monitoring') ||
        event.reason.message.includes('429')) {
      event.preventDefault();
      return false;
    }
  }
  
  // Suppress React errors
  if (event.reason && typeof event.reason === 'object' && event.reason.message) {
    if (event.reason.message.includes('Minified React error #418') || 
        event.reason.message.includes('Minified React error #422')) {
      event.preventDefault();
      console.warn('React error suppressed:', event.reason.message);
      return false;
    }
  }
  
  console.error('Unhandled promise rejection:', event.reason);
});

// Render App
const renderApp = () => {
  if (PUBLISHABLE_KEY) {
    // If Clerk key exists, wrap with ClerkProvider
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            <App />
            <SpeedInsights />
          </ClerkProvider>
        </ErrorBoundary>
      </StrictMode>
    );
  } else {
    // If Clerk key missing, render App directly
    // Clerk publishable key missing - rendering without authentication
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
          <SpeedInsights />
        </ErrorBoundary>
      </StrictMode>
    );
  }
};

// Execute render
renderApp();
