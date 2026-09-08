export const accessRequestStatuses = [
	"pending",
	"in_review",
	"approved",
	"rejected"
] as const;

export const accessRequestPriorities = ["low", "medium", "high", "urgent"] as const;

export type AccessRequestStatus = (typeof accessRequestStatuses)[number];
export type AccessRequestPriority = (typeof accessRequestPriorities)[number];

export interface AccessRequest {
	id: string;
	requesterName: string;
	requesterEmail: string;
	applicationName: string;
	accessLevel: string;
	businessJustification: string;
	priority: AccessRequestPriority;
	status: AccessRequestStatus;
	notes: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface AccessRequestFilters {
	status?: AccessRequestStatus;
	priority?: AccessRequestPriority;
	application?: string;
	search?: string;
}

export interface AccessRequestFormValues {
	requesterName: string;
	requesterEmail: string;
	applicationName: string;
	accessLevel: string;
	businessJustification: string;
	priority: AccessRequestPriority;
	status: AccessRequestStatus;
	notes: string;
}

export interface CreateAccessRequestPayload {
	requesterName: string;
	requesterEmail: string;
	applicationName: string;
	accessLevel: string;
	businessJustification: string;
	priority: AccessRequestPriority;
	notes?: string;
}

export type UpdateAccessRequestPayload = Partial<AccessRequestFormValues>;
