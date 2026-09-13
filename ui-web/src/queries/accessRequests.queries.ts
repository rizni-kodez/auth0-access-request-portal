import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createAccessRequest,
	deleteAccessRequest,
	fetchAccessRequests,
	updateAccessRequest
} from "../api/accessRequestsApi";
import type {
	AccessRequestFilters,
	CreateAccessRequestPayload,
	UpdateAccessRequestPayload
} from "../types/accessRequest.types";

const ACCESS_REQUESTS_QUERY_KEY = ["access-requests"] as const;

export function useAccessRequests(auth0UserId: string | undefined, filters: AccessRequestFilters) {
	return useQuery({
		queryKey: [...ACCESS_REQUESTS_QUERY_KEY, auth0UserId, filters],
		queryFn: () => fetchAccessRequests(filters),
		enabled: Boolean(auth0UserId)
	});
}

export function useCreateAccessRequest(auth0UserId: string | undefined) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateAccessRequestPayload) => createAccessRequest(payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [...ACCESS_REQUESTS_QUERY_KEY, auth0UserId]
			});
		}
	});
}

export function useUpdateAccessRequest(auth0UserId: string | undefined) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateAccessRequestPayload }) =>
			updateAccessRequest(id, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [...ACCESS_REQUESTS_QUERY_KEY, auth0UserId]
			});
		}
	});
}

export function useDeleteAccessRequest(auth0UserId: string | undefined) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteAccessRequest(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [...ACCESS_REQUESTS_QUERY_KEY, auth0UserId]
			});
		}
	});
}
