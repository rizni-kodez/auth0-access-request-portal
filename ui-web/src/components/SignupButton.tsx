import { useAuth0 } from "@auth0/auth0-react";

export default function SignupButton(): JSX.Element {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <button
      type="button"
      onClick={() => {
        void loginWithRedirect({
          authorizationParams: {
            screen_hint: "signup"
          }
        });
      }}
      disabled={isLoading}
      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
    >
      Sign up
    </button>
  );
}
