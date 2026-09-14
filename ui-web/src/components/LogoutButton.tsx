import { useAuth0 } from "@auth0/auth0-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { setAccessTokenGetter } from "../api/apiClient";
import ConfirmDialog from "./ConfirmDialog";

export default function LogoutButton(): JSX.Element {
  const { logout } = useAuth0();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function confirmLogout(): void {
    setIsLoggingOut(true);
    queryClient.clear();
    setAccessTokenGetter(null);
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Logout
      </button>

      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Log out?"
        message="You will need to sign in again to view your requests."
        confirmLabel="Log out"
        isConfirming={isLoggingOut}
        onCancel={closeDialog}
        onConfirm={confirmLogout}
      />
    </>
  );
}
