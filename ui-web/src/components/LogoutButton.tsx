import { useAuth0 } from "@auth0/auth0-react";
import { useQueryClient } from "@tanstack/react-query";
import { setAccessTokenGetter } from "../api/apiClient";

export default function LogoutButton(): JSX.Element {
  const { logout } = useAuth0();
  const queryClient = useQueryClient();

  return (
    <button
      type="button"
      onClick={() => {
        queryClient.clear();
        setAccessTokenGetter(null);
        logout({
          logoutParams: {
            returnTo: window.location.origin
          }
        });
      }}
      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
    >
      Logout
    </button>
  );
}
