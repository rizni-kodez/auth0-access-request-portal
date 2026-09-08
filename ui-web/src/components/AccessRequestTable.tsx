import type { AccessRequest } from "../types/accessRequest.types";
import { formatCreatedDate } from "../utils/formatters";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

interface AccessRequestTableProps {
	requests: AccessRequest[];
	onEdit: (request: AccessRequest) => void;
	onDelete: (request: AccessRequest) => void;
	busyRequestId?: string;
}

export default function AccessRequestTable({
	requests,
	onEdit,
	onDelete,
	busyRequestId
}: AccessRequestTableProps): JSX.Element {
	return (
		<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-slate-200 text-left text-sm">
					<thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
						<tr>
							<th className="px-4 py-3">Requester</th>
							<th className="px-4 py-3">Application</th>
							<th className="px-4 py-3">Access Level</th>
							<th className="px-4 py-3">Priority</th>
							<th className="px-4 py-3">Status</th>
							<th className="px-4 py-3">Created Date</th>
							<th className="px-4 py-3 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 bg-white">
						{requests.map((request) => {
							const isBusy = busyRequestId === request.id;
							return (
								<tr key={request.id} className="align-top hover:bg-slate-50/60">
									<td className="px-4 py-3">
										<p className="font-medium text-slate-900">{request.requesterName}</p>
										<p className="text-xs text-slate-500">{request.requesterEmail}</p>
									</td>
									<td className="px-4 py-3 text-slate-700">{request.applicationName}</td>
									<td className="px-4 py-3 text-slate-700">{request.accessLevel}</td>
									<td className="px-4 py-3">
										<PriorityBadge priority={request.priority} />
									</td>
									<td className="px-4 py-3">
										<StatusBadge status={request.status} />
									</td>
									<td className="px-4 py-3 text-slate-600">{formatCreatedDate(request.createdAt)}</td>
									<td className="px-4 py-3">
										<div className="flex justify-end gap-2">
											<button
												type="button"
												onClick={() => onEdit(request)}
												className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
											>
												Edit / Status
											</button>
											<button
												type="button"
												onClick={() => onDelete(request)}
												disabled={isBusy}
												className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
											>
												{isBusy ? "Deleting..." : "Delete"}
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</section>
	);
}
