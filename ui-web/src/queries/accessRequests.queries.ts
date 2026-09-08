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

export function useAccessRequests(filters: AccessRequestFilters) {
	return useQuery({
		queryKey: [...ACCESS_REQUESTS_QUERY_KEY, filters],
		queryFn: () => fetchAccessRequests(filters)
	});
}

export function useCreateAccessRequest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateAccessRequestPayload) => createAccessRequest(payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ACCESS_REQUESTS_QUERY_KEY
			});
		}
	});
}

export function useUpdateAccessRequest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateAccessRequestPayload }) =>
			updateAccessRequest(id, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ACCESS_REQUESTS_QUERY_KEY
			});
		}
	});
}

export function useDeleteAccessRequest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteAccessRequest(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ACCESS_REQUESTS_QUERY_KEY
			});
		}
	});
}
