import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import { appConfig } from "../configs/env";

export function useAuthToken(): () => Promise<string> {
  const { getAccessTokenSilently } = useAuth0();

  return useCallback(() => {
    return getAccessTokenSilently({
      authorizationParams: {
        audience: appConfig.auth0Audience
      }
    });
  }, [getAccessTokenSilently]);
}
