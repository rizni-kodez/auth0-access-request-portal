import type { AccessRequestPriority } from "../types/accessRequest.types";
import { formatPriority } from "../utils/formatters";

interface PriorityBadgeProps {
	priority: AccessRequestPriority;
}

const priorityClassMap: Record<AccessRequestPriority, string> = {
	low: "bg-slate-100 text-slate-700",
	medium: "bg-cyan-100 text-cyan-800",
	high: "bg-orange-100 text-orange-800",
	urgent: "bg-red-100 text-red-800"
};

export default function PriorityBadge({ priority }: PriorityBadgeProps): JSX.Element {
	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${priorityClassMap[priority]}`}
		>
			{formatPriority(priority)}
		</span>
	);
}
