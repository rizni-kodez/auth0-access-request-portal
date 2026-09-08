import type {
	AccessRequest,
	AccessRequestQuery,
	AccessRequestRow,
	CreateAccessRequestInput,
	UpdateAccessRequestInput
} from "../models/accessRequest.model";
import pool from "../database/pool";
import { ApiError } from "../utils/ApiError";

function toAccessRequest(row: AccessRequestRow): AccessRequest {
	return {
		id: row.id,
		requesterName: row.requester_name,
		requesterEmail: row.requester_email,
		applicationName: row.application_name,
		accessLevel: row.access_level,
		businessJustification: row.business_justification,
		priority: row.priority,
		status: row.status,
		notes: row.notes,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}

export async function listAccessRequests(filters: AccessRequestQuery): Promise<AccessRequest[]> {
	const conditions: string[] = [];
	const values: unknown[] = [];

	if (filters.status) {
		values.push(filters.status);
		conditions.push(`status = $${values.length}`);
	}

	if (filters.priority) {
		values.push(filters.priority);
		conditions.push(`priority = $${values.length}`);
	}

	if (filters.application) {
		values.push(filters.application);
		conditions.push(`application_name = $${values.length}`);
	}

	if (filters.search) {
		values.push(`%${filters.search}%`);
		const index = values.length;
		conditions.push(`(
			requester_name ILIKE $${index}
			OR requester_email ILIKE $${index}
			OR application_name ILIKE $${index}
			OR access_level ILIKE $${index}
			OR business_justification ILIKE $${index}
		)`);
	}

	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

	const query = `
		SELECT
			id,
			requester_name,
			requester_email,
			application_name,
			access_level,
			business_justification,
			priority,
			status,
			notes,
			created_at,
			updated_at
		FROM access_requests
		${whereClause}
		ORDER BY created_at DESC;
	`;

	const result = await pool.query<AccessRequestRow>(query, values);
	return result.rows.map(toAccessRequest);
}

export async function createAccessRequest(
	payload: CreateAccessRequestInput
): Promise<AccessRequest> {
	const query = `
		INSERT INTO access_requests (
			requester_name,
			requester_email,
			application_name,
			access_level,
			business_justification,
			priority,
			notes
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING
			id,
			requester_name,
			requester_email,
			application_name,
			access_level,
			business_justification,
			priority,
			status,
			notes,
			created_at,
			updated_at;
	`;

	const values = [
		payload.requesterName,
		payload.requesterEmail,
		payload.applicationName,
		payload.accessLevel,
		payload.businessJustification,
		payload.priority,
		payload.notes ?? null
	];

	const result = await pool.query<AccessRequestRow>(query, values);
	return toAccessRequest(result.rows[0]);
}

export async function updateAccessRequest(
	id: string,
	payload: UpdateAccessRequestInput
): Promise<AccessRequest> {
	const fields: string[] = [];
	const values: unknown[] = [];

	const fieldMap: Record<keyof UpdateAccessRequestInput, string> = {
		requesterName: "requester_name",
		requesterEmail: "requester_email",
		applicationName: "application_name",
		accessLevel: "access_level",
		businessJustification: "business_justification",
		priority: "priority",
		status: "status",
		notes: "notes"
	};

	(Object.keys(payload) as Array<keyof UpdateAccessRequestInput>).forEach((key) => {
		const value = payload[key];
		if (value !== undefined) {
			values.push(value);
			fields.push(`${fieldMap[key]} = $${values.length}`);
		}
	});

	if (fields.length === 0) {
		throw new ApiError(400, "At least one field must be provided for update");
	}

	values.push(id);

	const query = `
		UPDATE access_requests
		SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
		WHERE id = $${values.length}
		RETURNING
			id,
			requester_name,
			requester_email,
			application_name,
			access_level,
			business_justification,
			priority,
			status,
			notes,
			created_at,
			updated_at;
	`;

	const result = await pool.query<AccessRequestRow>(query, values);

	if (result.rowCount === 0) {
		throw new ApiError(404, "Access request not found");
	}

	return toAccessRequest(result.rows[0]);
}

export async function deleteAccessRequest(id: string): Promise<void> {
	const result = await pool.query("DELETE FROM access_requests WHERE id = $1", [id]);

	if (result.rowCount === 0) {
		throw new ApiError(404, "Access request not found");
	}
}
