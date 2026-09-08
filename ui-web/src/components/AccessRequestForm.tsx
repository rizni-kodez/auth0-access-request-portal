import { useEffect, useMemo, useState } from "react";
import { APPLICATION_OPTIONS, PRIORITY_LABELS, STATUS_LABELS } from "../constants/accessRequest.constants";
import type {
	AccessRequest,
	AccessRequestFormValues,
	AccessRequestPriority,
	AccessRequestStatus
} from "../types/accessRequest.types";

interface AccessRequestFormProps {
	isOpen: boolean;
	mode: "create" | "edit";
	initialData?: AccessRequest;
	isSubmitting: boolean;
	submitError?: string | null;
	onClose: () => void;
	onSubmit: (values: AccessRequestFormValues) => void;
}

const defaultFormValues: AccessRequestFormValues = {
	requesterName: "",
	requesterEmail: "",
	applicationName: "GitHub",
	accessLevel: "",
	businessJustification: "",
	priority: "medium",
	status: "pending",
	notes: ""
};

function mapToFormValues(data?: AccessRequest): AccessRequestFormValues {
	if (!data) {
		return defaultFormValues;
	}

	return {
		requesterName: data.requesterName,
		requesterEmail: data.requesterEmail,
		applicationName: data.applicationName,
		accessLevel: data.accessLevel,
		businessJustification: data.businessJustification,
		priority: data.priority,
		status: data.status,
		notes: data.notes ?? ""
	};
}

export default function AccessRequestForm({
	isOpen,
	mode,
	initialData,
	isSubmitting,
	submitError,
	onClose,
	onSubmit
}: AccessRequestFormProps): JSX.Element | null {
	const [values, setValues] = useState<AccessRequestFormValues>(defaultFormValues);
	const [touched, setTouched] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setValues(mapToFormValues(initialData));
			setTouched(false);
		}
	}, [initialData, isOpen]);

	const title = mode === "create" ? "Create Access Request" : "Edit Access Request";

	const formErrors = useMemo(() => {
		const errors: Partial<Record<keyof AccessRequestFormValues, string>> = {};

		if (values.requesterName.trim().length < 2) {
			errors.requesterName = "Requester name must be at least 2 characters.";
		}
		if (!/\S+@\S+\.\S+/.test(values.requesterEmail.trim())) {
			errors.requesterEmail = "Enter a valid email address.";
		}
		if (values.applicationName.trim().length < 1) {
			errors.applicationName = "Application is required.";
		}
		if (values.accessLevel.trim().length < 2) {
			errors.accessLevel = "Access level must be at least 2 characters.";
		}
		if (values.businessJustification.trim().length < 10) {
			errors.businessJustification = "Business justification must be at least 10 characters.";
		}
		if (values.notes.trim().length > 1000) {
			errors.notes = "Notes cannot exceed 1000 characters.";
		}

		return errors;
	}, [values]);

	if (!isOpen) {
		return null;
	}

	function updateField<Key extends keyof AccessRequestFormValues>(
		field: Key,
		value: AccessRequestFormValues[Key]
	): void {
		setValues((prev) => ({ ...prev, [field]: value }));
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		setTouched(true);

		if (Object.keys(formErrors).length > 0) {
			return;
		}

		onSubmit(values);
	}

	const isEdit = mode === "edit";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
			<div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
				<div className="mb-4 flex items-start justify-between">
					<div>
						<h2 className="text-xl font-semibold text-slate-900">{title}</h2>
						<p className="mt-1 text-sm text-slate-600">
							{isEdit
								? "Update details, priority, or status for this request."
								: "Fill out the form to submit a new access request."}
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-slate-300 px-2.5 py-1 text-sm text-slate-700 hover:bg-slate-100"
					>
						Close
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<label className="flex flex-col gap-1 text-sm text-slate-700">
							Requester Name
							<input
								value={values.requesterName}
								onChange={(event) => updateField("requesterName", event.target.value)}
								className="h-10 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-500"
							/>
							{touched && formErrors.requesterName ? (
								<span className="text-xs text-rose-700">{formErrors.requesterName}</span>
							) : null}
						</label>

						<label className="flex flex-col gap-1 text-sm text-slate-700">
							Requester Email
							<input
								value={values.requesterEmail}
								onChange={(event) => updateField("requesterEmail", event.target.value)}
								className="h-10 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-500"
							/>
							{touched && formErrors.requesterEmail ? (
								<span className="text-xs text-rose-700">{formErrors.requesterEmail}</span>
							) : null}
						</label>

						<label className="flex flex-col gap-1 text-sm text-slate-700">
							Application Name
							<select
								value={values.applicationName}
								onChange={(event) => updateField("applicationName", event.target.value)}
								className="h-10 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-500"
							>
								{APPLICATION_OPTIONS.map((appName) => (
									<option key={appName} value={appName}>
										{appName}
									</option>
								))}
							</select>
							{touched && formErrors.applicationName ? (
								<span className="text-xs text-rose-700">{formErrors.applicationName}</span>
							) : null}
						</label>

						<label className="flex flex-col gap-1 text-sm text-slate-700">
							Access Level
							<input
								value={values.accessLevel}
								onChange={(event) => updateField("accessLevel", event.target.value)}
								placeholder="Repository read/write"
								className="h-10 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-500"
							/>
							{touched && formErrors.accessLevel ? (
								<span className="text-xs text-rose-700">{formErrors.accessLevel}</span>
							) : null}
						</label>

						<label className="flex flex-col gap-1 text-sm text-slate-700">
							Priority
							<select
								value={values.priority}
								onChange={(event) =>
									updateField("priority", event.target.value as AccessRequestPriority)
								}
								className="h-10 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-500"
							>
								{Object.entries(PRIORITY_LABELS).map(([value, label]) => (
									<option key={value} value={value}>
										{label}
									</option>
								))}
							</select>
						</label>

						<label className="flex flex-col gap-1 text-sm text-slate-700">
							Status
							<select
								value={values.status}
								onChange={(event) =>
									updateField("status", event.target.value as AccessRequestStatus)
								}
								className="h-10 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-500"
							>
								{Object.entries(STATUS_LABELS).map(([value, label]) => (
									<option key={value} value={value}>
										{label}
									</option>
								))}
							</select>
						</label>
					</div>

					<label className="flex flex-col gap-1 text-sm text-slate-700">
						Business Justification
						<textarea
							value={values.businessJustification}
							onChange={(event) => updateField("businessJustification", event.target.value)}
							rows={4}
							className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
						/>
						{touched && formErrors.businessJustification ? (
							<span className="text-xs text-rose-700">{formErrors.businessJustification}</span>
						) : null}
					</label>

					<label className="flex flex-col gap-1 text-sm text-slate-700">
						Notes
						<textarea
							value={values.notes}
							onChange={(event) => updateField("notes", event.target.value)}
							rows={3}
							className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
						/>
						{touched && formErrors.notes ? (
							<span className="text-xs text-rose-700">{formErrors.notes}</span>
						) : null}
					</label>

					{submitError ? (
						<p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</p>
					) : null}

					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{isSubmitting ? "Saving..." : isEdit ? "Update Request" : "Create Request"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
