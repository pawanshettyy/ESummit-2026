/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_EVENT_DATE?: string;
  readonly VITE_KONFHUB_EVENT_ID?: string;
  readonly VITE_KONFHUB_BUTTON_ID?: string;
  readonly VITE_ADMIN_SECRET?: string;
  readonly MODE: 'development' | 'production';
  readonly PROD: boolean;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}