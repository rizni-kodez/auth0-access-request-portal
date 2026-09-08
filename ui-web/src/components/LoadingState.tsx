export default function LoadingState(): JSX.Element {
	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
			<div className="mx-auto flex w-full max-w-md flex-col items-center gap-4">
				<div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
				<p className="text-sm text-slate-600">Loading access requests...</p>
			</div>
		</section>
	);
}
