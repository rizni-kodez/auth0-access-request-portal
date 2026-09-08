import {
	ALL_FILTER_VALUE,
	APPLICATION_FILTER_OPTIONS,
	PRIORITY_FILTER_OPTIONS,
	STATUS_FILTER_OPTIONS,
	type ApplicationFilterValue,
	type PriorityFilterValue,
	type StatusFilterValue
} from "../constants/accessRequest.constants";

export interface DashboardFilters {
	search: string;
	status: StatusFilterValue;
	priority: PriorityFilterValue;
	application: ApplicationFilterValue;
}

interface FilterBarProps {
	filters: DashboardFilters;
	onChange: (filters: DashboardFilters) => void;
	onReset: () => void;
}

export default function FilterBar({ filters, onChange, onReset }: FilterBarProps): JSX.Element {
	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
			<div className="grid gap-3 md:grid-cols-4">
				<input
					type="search"
					value={filters.search}
					onChange={(event) => onChange({ ...filters, search: event.target.value })}
					placeholder="Search requester, email, app, access level"
					className="h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
				/>

				<select
					value={filters.status}
					onChange={(event) =>
						onChange({ ...filters, status: event.target.value as StatusFilterValue })
					}
					className="h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-800 outline-none transition focus:border-slate-500"
				>
					{STATUS_FILTER_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>

				<select
					value={filters.priority}
					onChange={(event) =>
						onChange({ ...filters, priority: event.target.value as PriorityFilterValue })
					}
					className="h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-800 outline-none transition focus:border-slate-500"
				>
					{PRIORITY_FILTER_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>

				<select
					value={filters.application}
					onChange={(event) =>
						onChange({ ...filters, application: event.target.value as ApplicationFilterValue })
					}
					className="h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-800 outline-none transition focus:border-slate-500"
				>
					{APPLICATION_FILTER_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			<div className="mt-3 flex justify-end">
				<button
					type="button"
					onClick={onReset}
					disabled={
						filters.search.length === 0 &&
						filters.status === ALL_FILTER_VALUE &&
						filters.priority === ALL_FILTER_VALUE &&
						filters.application === ALL_FILTER_VALUE
					}
					className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Reset filters
				</button>
			</div>
		</section>
	);
}
