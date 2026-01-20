import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import * as Sentry from "@sentry/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/error-boundary.tsx";
import "./index.css";

// Initialize Sentry only in production with a configured DSN
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
if (SENTRY_DSN && import.meta.env.MODE === 'production') {
  try {
    Sentry.init({
      dsn: SENTRY_DSN,
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
    console.info('Sentry initialized');
  } catch (err) {
    console.warn('Sentry initialization error:', err);
  }
} else {
  console.info('Sentry disabled in non-production or missing DSN');
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

// In development, filter noisy console.error messages (konfhub monitoring 429, invalid preload href)
if (import.meta.env.MODE !== 'production') {
  const originalConsoleError = console.error;
  console.error = function(...args: any[]) {
    try {
      const hasKonfhub = args.some(a => typeof a === 'string' && a.includes('konfhub.com/monitoring'));
      const hasPreloadInvalid = args.some(a => typeof a === 'string' && a.includes("invalid `href`"));
      if (hasKonfhub || hasPreloadInvalid) return;
    } catch (e) {
      // nothing
    }
    originalConsoleError.apply(console, args);
  };
}

window.addEventListener('error', (event) => {
  // Suppress moment.js warnings
  if (event.message && event.message.includes('moment construction falls back to js Date')) {
    event.preventDefault();
    return false;
  }
  
  // Do not suppress React errors here — surface them in development for debugging
  
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
  
  // Allow React errors to surface so developers see full stack in dev.
  
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

// Enable global lazy-loading for images and picture elements
function enableGlobalImageLazyLoading() {
  if (typeof window === 'undefined' || !('MutationObserver' in window)) return;
  try {
    const setLazy = (img: HTMLImageElement) => {
      try {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
      } catch (e) {
        // ignore
      }
    };

    // Apply to existing images
    document.querySelectorAll('img').forEach((el) => setLazy(el as HTMLImageElement));
    // Apply to images inside <picture>
    document.querySelectorAll('picture').forEach((p) => p.querySelectorAll('img').forEach((i) => setLazy(i as HTMLImageElement)));

    // Observe future DOM additions
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          try {
            if (node instanceof HTMLImageElement) setLazy(node);
            else if (node instanceof HTMLElement) {
              node.querySelectorAll && node.querySelectorAll('img').forEach((i) => setLazy(i as HTMLImageElement));
            }
          } catch (e) {
            // ignore per-node errors
          }
        });
      }
    });

    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  } catch (err) {
    // Do not break app if lazyload setup fails
    console.warn('Global image lazyload setup failed:', err);
  }
}

enableGlobalImageLazyLoading();
