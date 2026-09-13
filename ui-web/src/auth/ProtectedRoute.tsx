import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import LoadingState from "../components/LoadingState";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading || isAuthenticated || isRedirecting) {
      return;
    }

    setIsRedirecting(true);
    void loginWithRedirect({
      appState: {
        returnTo: `${location.pathname}${location.search}${location.hash}`
      }
    });
  }, [isAuthenticated, isLoading, isRedirecting, location, loginWithRedirect]);

  if (isLoading || !isAuthenticated) {
    return <LoadingState />;
  }

  return <>{children}</>;
}
