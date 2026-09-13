import Header from "../components/Header";
import Layout from "../components/Layout";
import LoginButton from "../components/LoginButton";
import SignupButton from "../components/SignupButton";

export default function LandingPage(): JSX.Element {
  return (
    <Layout header={<Header />}>
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Secure Access Workflow
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Centralize Internal Access Requests
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Submit, track, and update application access requests in one place with Auth0-backed
          authentication and per-user request isolation.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <LoginButton />
          <SignupButton />
        </div>
      </section>
    </Layout>
  );
}
