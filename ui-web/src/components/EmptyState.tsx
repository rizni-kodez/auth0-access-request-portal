interface EmptyStateProps {
	onCreateRequest?: () => void;
}

export default function EmptyState({ onCreateRequest }: EmptyStateProps): JSX.Element {
	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
			<h2 className="text-xl font-semibold text-slate-900">No access requests yet</h2>
			<p className="mt-2 text-sm text-slate-600">
				Create your first request to start tracking approvals and review flow.
			</p>
			{onCreateRequest ? (
				<button
					type="button"
					onClick={onCreateRequest}
					className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
				>
					Create request
				</button>
			) : null}
		</section>
	);
}
