import type {
	AccessRequestPriority,
	AccessRequestStatus
} from "../types/accessRequest.types";

export const ALL_FILTER_VALUE = "all" as const;

export type StatusFilterValue = AccessRequestStatus | typeof ALL_FILTER_VALUE;
export type PriorityFilterValue = AccessRequestPriority | typeof ALL_FILTER_VALUE;
export type ApplicationFilterValue = string | typeof ALL_FILTER_VALUE;

export const STATUS_LABELS: Record<AccessRequestStatus, string> = {
	pending: "Pending",
	in_review: "In Review",
	approved: "Approved",
	rejected: "Rejected"
};

export const PRIORITY_LABELS: Record<AccessRequestPriority, string> = {
	low: "Low",
	medium: "Medium",
	high: "High",
	urgent: "Urgent"
};

export const APPLICATION_OPTIONS = [
	"GitHub",
	"Azure DevOps",
	"Confluence",
	"Jira",
	"Kodez Connect",
	"Pulse",
	"Other"
] as const;

export const STATUS_FILTER_OPTIONS: Array<{ label: string; value: StatusFilterValue }> = [
	{ label: "All Status", value: ALL_FILTER_VALUE },
	{ label: "Pending", value: "pending" },
	{ label: "In Review", value: "in_review" },
	{ label: "Approved", value: "approved" },
	{ label: "Rejected", value: "rejected" }
];

export const PRIORITY_FILTER_OPTIONS: Array<{ label: string; value: PriorityFilterValue }> = [
	{ label: "All Priorities", value: ALL_FILTER_VALUE },
	{ label: "Low", value: "low" },
	{ label: "Medium", value: "medium" },
	{ label: "High", value: "high" },
	{ label: "Urgent", value: "urgent" }
];

export const APPLICATION_FILTER_OPTIONS: Array<{
	label: string;
	value: ApplicationFilterValue;
}> = [
	{ label: "All Applications", value: ALL_FILTER_VALUE },
	...APPLICATION_OPTIONS.map((name) => ({ label: name, value: name }))
];
