import type { AccessRequestStatus } from "../types/accessRequest.types";
import { formatStatus } from "../utils/formatters";

interface StatusBadgeProps {
	status: AccessRequestStatus;
}

const statusClassMap: Record<AccessRequestStatus, string> = {
	pending: "bg-amber-100 text-amber-800",
	in_review: "bg-sky-100 text-sky-800",
	approved: "bg-emerald-100 text-emerald-800",
	rejected: "bg-rose-100 text-rose-800"
};

export default function StatusBadge({ status }: StatusBadgeProps): JSX.Element {
	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassMap[status]}`}
		>
			{formatStatus(status)}
		</span>
	);
}
