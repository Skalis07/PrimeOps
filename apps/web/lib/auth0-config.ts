export type Auth0FrontendConfig = {
  appUrl: string;
  apiUrl: string;
  audience: string;
  clientId: string;
  domain: string;
};

const readEnv = (value: string | undefined) => value?.trim() ?? "";

export const auth0FrontendConfig: Auth0FrontendConfig = {
  appUrl: readEnv(process.env.NEXT_PUBLIC_APP_URL),
  apiUrl: readEnv(process.env.NEXT_PUBLIC_API_URL),
  audience: readEnv(process.env.NEXT_PUBLIC_AUTH0_AUDIENCE),
  clientId: readEnv(process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID),
  domain: readEnv(process.env.NEXT_PUBLIC_AUTH0_DOMAIN),
};

export const isAuth0FrontendConfigured = Object.values(auth0FrontendConfig).every(
  Boolean,
);
