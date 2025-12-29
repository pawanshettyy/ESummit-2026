import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";

// Initialize Sentry
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

// Load Clerk key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Get root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Render App
const renderApp = () => {
  if (PUBLISHABLE_KEY) {
    // If Clerk key exists, wrap with ClerkProvider
    createRoot(rootElement).render(
      <StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <App />
        </ClerkProvider>
      </StrictMode>
    );
  } else {
    // If Clerk key missing, render App directly
    // Clerk publishable key missing - rendering without authentication
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
};

// Execute render
renderApp();
