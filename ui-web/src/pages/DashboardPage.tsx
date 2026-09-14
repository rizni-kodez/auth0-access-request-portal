import { useAuth0 } from "@auth0/auth0-react";
import { useMemo, useState } from "react";
import AccessRequestForm from "../components/AccessRequestForm";
import AccessRequestTable from "../components/AccessRequestTable";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import FilterBar, { type DashboardFilters } from "../components/FilterBar";
import Header from "../components/Header";
import Layout from "../components/Layout";
import LoadingState from "../components/LoadingState";
import StatCard from "../components/StatCard";
import { ALL_FILTER_VALUE } from "../constants/accessRequest.constants";
import {
  useAccessRequests,
  useCreateAccessRequest,
  useDeleteAccessRequest,
  useUpdateAccessRequest
} from "../queries/accessRequests.queries";
import type {
  AccessRequest,
  AccessRequestFilters,
  AccessRequestFormValues,
  UpdateAccessRequestPayload
} from "../types/accessRequest.types";
import { getErrorMessage } from "../utils/getErrorMessage";

const defaultFilters: DashboardFilters = {
  search: "",
  status: ALL_FILTER_VALUE,
  priority: ALL_FILTER_VALUE,
  application: ALL_FILTER_VALUE
};

export default function DashboardPage(): JSX.Element {
  const { user } = useAuth0();
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | undefined>(undefined);
  const [activeDeleteId, setActiveDeleteId] = useState<string | undefined>(undefined);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const auth0UserId = user?.sub;

  const prefilledRequesterName = useMemo(() => {
    const givenName = user?.given_name?.trim() ?? "";
    const familyName = user?.family_name?.trim() ?? "";
    const fullNameFromParts = `${givenName} ${familyName}`.trim();

    if (fullNameFromParts) {
      return fullNameFromParts;
    }

    const name = user?.name?.trim() ?? "";
    const email = user?.email?.trim() ?? "";

    if (name && name.toLowerCase() !== email.toLowerCase()) {
      return name;
    }

    return "";
  }, [user]);

  const requesterProfile = useMemo(
    () => ({
      requesterName: prefilledRequesterName,
      requesterEmail: user?.email?.trim() || ""
    }),
    [prefilledRequesterName, user]
  );

  const queryFilters: AccessRequestFilters = useMemo(
    () => ({
      search: filters.search.trim() || undefined,
      status: filters.status === ALL_FILTER_VALUE ? undefined : filters.status,
      priority: filters.priority === ALL_FILTER_VALUE ? undefined : filters.priority,
      application: filters.application === ALL_FILTER_VALUE ? undefined : filters.application
    }),
    [filters]
  );

  const requestsQuery = useAccessRequests(auth0UserId, queryFilters);
  const createMutation = useCreateAccessRequest(auth0UserId);
  const updateMutation = useUpdateAccessRequest(auth0UserId);
  const deleteMutation = useDeleteAccessRequest(auth0UserId);

  const requests = requestsQuery.data ?? [];

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((item) => item.status === "pending").length;
    const inReview = requests.filter((item) => item.status === "in_review").length;
    const approved = requests.filter((item) => item.status === "approved").length;
    const rejected = requests.filter((item) => item.status === "rejected").length;
    return { total, pending, inReview, approved, rejected };
  }, [requests]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (!auth0UserId) {
    return <LoadingState />;
  }

  function openCreateForm(): void {
    setSubmitError(null);
    setSelectedRequest(undefined);
    setFormMode("create");
    setIsFormOpen(true);
  }

  function openEditForm(request: AccessRequest): void {
    setSubmitError(null);
    setSelectedRequest(request);
    setFormMode("edit");
    setIsFormOpen(true);
  }

  function closeForm(): void {
    setIsFormOpen(false);
    setSubmitError(null);
  }

  async function handleFormSubmit(values: AccessRequestFormValues): Promise<void> {
    setSubmitError(null);

    try {
      if (formMode === "create") {
        await createMutation.mutateAsync({
          requesterName: values.requesterName,
          requesterEmail: requesterProfile.requesterEmail,
          applicationName: values.applicationName,
          accessLevel: values.accessLevel,
          businessJustification: values.businessJustification,
          priority: values.priority,
          notes: values.notes || undefined
        });
      } else if (selectedRequest) {
        const payload: UpdateAccessRequestPayload = {
          requesterName: values.requesterName,
          requesterEmail: requesterProfile.requesterEmail,
          applicationName: values.applicationName,
          accessLevel: values.accessLevel,
          businessJustification: values.businessJustification,
          priority: values.priority,
          status: values.status,
          notes: values.notes
        };

        await updateMutation.mutateAsync({
          id: selectedRequest.id,
          payload
        });
      }

      closeForm();
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Failed to save access request"));
    }
  }

  async function handleDelete(request: AccessRequest): Promise<void> {
    setActiveDeleteId(request.id);
    try {
      await deleteMutation.mutateAsync(request.id);
    } catch {
      // Keep UI minimal in this phase; query error display remains available.
    } finally {
      setActiveDeleteId(undefined);
    }
  }

  return (
    <Layout header={<Header onCreateRequest={openCreateForm} />}>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Requests" value={stats.total} tone="slate" />
        <StatCard title="Pending" value={stats.pending} tone="amber" />
        <StatCard title="In Review" value={stats.inReview} tone="sky" />
        <StatCard title="Approved" value={stats.approved} tone="emerald" />
        <StatCard title="Rejected" value={stats.rejected} tone="rose" />
      </section>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(defaultFilters)}
      />

      {requestsQuery.isLoading ? <LoadingState /> : null}

      {requestsQuery.isError ? (
        <ErrorState
          message={getErrorMessage(requestsQuery.error, "Failed to fetch access requests")}
          onRetry={() => requestsQuery.refetch()}
        />
      ) : null}

      {!requestsQuery.isLoading && !requestsQuery.isError && requests.length === 0 ? (
        <EmptyState onCreateRequest={openCreateForm} />
      ) : null}

      {!requestsQuery.isLoading && !requestsQuery.isError && requests.length > 0 ? (
        <AccessRequestTable
          requests={requests}
          onEdit={openEditForm}
          onDelete={handleDelete}
          busyRequestId={activeDeleteId}
        />
      ) : null}

      <AccessRequestForm
        isOpen={isFormOpen}
        mode={formMode}
        initialData={selectedRequest}
        isSubmitting={isSubmitting}
        submitError={submitError}
        requesterName={requesterProfile.requesterName}
        requesterEmail={requesterProfile.requesterEmail}
        onClose={closeForm}
        onSubmit={(values) => {
          void handleFormSubmit(values);
        }}
      />
    </Layout>
  );
}
