/// <reference types="vite/client" />

// vite-env.d.ts
interface ImportMetaEnv {
    readonly REACT_APP_SUPABASE_URL: string;
    readonly REACT_APP_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}