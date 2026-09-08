interface ErrorStateProps {
	message: string;
	onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps): JSX.Element {
	return (
		<section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
			<h2 className="text-lg font-semibold text-rose-900">Unable to load data</h2>
			<p className="mt-1 text-sm text-rose-800">{message}</p>
			{onRetry ? (
				<button
					type="button"
					onClick={onRetry}
					className="mt-4 rounded-lg bg-rose-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
				>
					Try again
				</button>
			) : null}
		</section>
	);
}
