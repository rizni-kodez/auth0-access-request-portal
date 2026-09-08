import type { ReactNode } from "react";

interface LayoutProps {
	header: ReactNode;
	children: ReactNode;
}

export default function Layout({ header, children }: LayoutProps): JSX.Element {
	return (
		<div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
			<div className="pointer-events-none absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
			<div className="pointer-events-none absolute bottom-[-10rem] right-[-6rem] h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
			<div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
				{header}
				{children}
			</div>
		</div>
	);
}
