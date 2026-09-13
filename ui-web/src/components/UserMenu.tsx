import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";

export default function UserMenu(): JSX.Element {
  const { user } = useAuth0();

  const displayName = user?.name?.trim() || user?.nickname?.trim() || "Authenticated User";
  const email = user?.email?.trim() || "";
  const avatarText = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      {user?.picture ? (
        <img
          src={user.picture}
          alt={displayName}
          className="h-9 w-9 rounded-full border border-slate-200 object-cover"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          {avatarText}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
        {email ? <p className="truncate text-xs text-slate-600">{email}</p> : null}
      </div>
      <LogoutButton />
    </div>
  );
}
