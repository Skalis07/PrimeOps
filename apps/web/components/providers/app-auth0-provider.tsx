"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import {
  auth0FrontendConfig,
  isAuth0FrontendConfigured,
} from "@/lib/auth0-config";

type AppAuth0ProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppAuth0Provider({ children }: AppAuth0ProviderProps) {
  if (!isAuth0FrontendConfigured) {
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      authorizationParams={{
        audience: auth0FrontendConfig.audience,
        redirect_uri: `${auth0FrontendConfig.appUrl}/auth/callback`,
      }}
      cacheLocation="localstorage"
      clientId={auth0FrontendConfig.clientId}
      domain={auth0FrontendConfig.domain}
    >
      {children}
    </Auth0Provider>
  );
}
