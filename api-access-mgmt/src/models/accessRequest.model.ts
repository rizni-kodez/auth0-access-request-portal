import { z } from "zod";

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
	createdAt: Date;
	updatedAt: Date;
}

export interface AccessRequestRow {
	id: string;
	requester_name: string;
	requester_email: string;
	application_name: string;
	access_level: string;
	business_justification: string;
	priority: AccessRequestPriority;
	status: AccessRequestStatus;
	notes: string | null;
	created_at: Date;
	updated_at: Date;
}

export const accessRequestIdParamSchema = z.object({
	id: z.string().uuid("Invalid access request id")
});

export const accessRequestQuerySchema = z.object({
	status: z.enum(accessRequestStatuses).optional(),
	priority: z.enum(accessRequestPriorities).optional(),
	application: z.string().trim().min(1).max(80).optional(),
	search: z.string().trim().min(1).max(160).optional()
});

export const createAccessRequestSchema = z.object({
	requesterName: z.string().trim().min(2).max(120),
	requesterEmail: z.string().trim().email().max(160),
	applicationName: z.string().trim().min(1).max(80),
	accessLevel: z.string().trim().min(2).max(80),
	businessJustification: z.string().trim().min(10).max(1000),
	priority: z.enum(accessRequestPriorities).default("medium"),
	notes: z.string().trim().max(1000).optional()
});

export const updateAccessRequestSchema = z
	.object({
		requesterName: z.string().trim().min(2).max(120).optional(),
		requesterEmail: z.string().trim().email().max(160).optional(),
		applicationName: z.string().trim().min(1).max(80).optional(),
		accessLevel: z.string().trim().min(2).max(80).optional(),
		businessJustification: z.string().trim().min(10).max(1000).optional(),
		priority: z.enum(accessRequestPriorities).optional(),
		status: z.enum(accessRequestStatuses).optional(),
		notes: z.string().trim().max(1000).nullable().optional()
	})
	.refine((payload) => Object.keys(payload).length > 0, {
		message: "At least one field must be provided for update"
	});

export type AccessRequestQuery = z.infer<typeof accessRequestQuerySchema>;
export type CreateAccessRequestInput = z.infer<typeof createAccessRequestSchema>;
export type UpdateAccessRequestInput = z.infer<typeof updateAccessRequestSchema>;
