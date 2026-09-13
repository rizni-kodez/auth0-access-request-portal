import { useAuth0 } from "@auth0/auth0-react";

export default function LoginButton(): JSX.Element {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <button
      type="button"
      onClick={() => {
        void loginWithRedirect();
      }}
      disabled={isLoading}
      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
    >
      Log in
    </button>
  );
}
