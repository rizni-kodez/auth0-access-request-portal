interface StatCardProps {
	title: string;
	value: number;
	tone: "slate" | "amber" | "sky" | "emerald" | "rose";
}

const toneClasses: Record<StatCardProps["tone"], string> = {
	slate: "border-slate-200 bg-white",
	amber: "border-amber-200 bg-amber-50",
	sky: "border-sky-200 bg-sky-50",
	emerald: "border-emerald-200 bg-emerald-50",
	rose: "border-rose-200 bg-rose-50"
};

export default function StatCard({ title, value, tone }: StatCardProps): JSX.Element {
	return (
		<article className={`rounded-2xl border p-4 shadow-sm ${toneClasses[tone]}`}>
			<p className="text-sm font-medium text-slate-600">{title}</p>
			<p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
		</article>
	);
}
