export const MONOREPO_APPS = ["web", "api"] as const;

export type MonorepoApp = (typeof MONOREPO_APPS)[number];

export const APP_DISPLAY_NAMES: Record<MonorepoApp, string> = {
  web: "Frontend web",
  api: "Backend API",
};

export const LOCAL_DEFAULTS = {
  webUrl: "http://localhost:3000",
  apiUrl: "http://localhost:8000",
  apiPrefix: "/api/v1",
  appEnv: "local",
} as const;

export const ENV_FILE_CONVENTIONS = {
  web: "apps/web/.env.local",
  api: "apps/api/.env",
  apiExample: "apps/api/.env.example",
} as const;

export const SAFE_ENV_REFERENCE = {
  web: ["NEXT_PUBLIC_APP_URL", "NEXT_PUBLIC_API_URL"],
  api: ["APP_ENV", "APP_NAME", "API_BASE_URL", "FRONTEND_URL", "DATABASE_URL"],
} as const;
