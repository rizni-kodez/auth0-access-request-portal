interface HeaderProps {
	onCreateRequest: () => void;
}

export default function Header({ onCreateRequest }: HeaderProps): JSX.Element {
	return (
		<header className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
						Internal Access Management
					</p>
					<h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
						Access Request Portal
					</h1>
					<p className="mt-1 text-sm text-slate-600">
						Track, review, and maintain application access requests in one place.
					</p>
				</div>
				<button
					type="button"
					onClick={onCreateRequest}
					className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
				>
					New Request
				</button>
			</div>
		</header>
	);
}
