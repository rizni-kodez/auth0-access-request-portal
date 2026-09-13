import { Auth0Provider } from "@auth0/auth0-react";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { setAccessTokenGetter } from "../api/apiClient";
import { appConfig } from "../configs/env";
import { useAuthToken } from "./useAuthToken";

interface AuthProviderProps {
  children: ReactNode;
}

interface RedirectAppState {
  returnTo?: string;
}

function AuthTokenRegistrar(): null {
  const getAccessToken = useAuthToken();

  useEffect(() => {
    setAccessTokenGetter(getAccessToken);

    return () => {
      setAccessTokenGetter(null);
    };
  }, [getAccessToken]);

  return null;
}

export default function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <Auth0Provider
      domain={appConfig.auth0Domain}
      clientId={appConfig.auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: appConfig.auth0Audience,
        scope: "openid profile email"
      }}
      useRefreshTokens
      onRedirectCallback={(appState) => {
        const targetPath = (appState as RedirectAppState | undefined)?.returnTo ?? "/dashboard";
        navigate(targetPath, { replace: true });
      }}
    >
      <AuthTokenRegistrar />
      {children}
    </Auth0Provider>
  );
}
