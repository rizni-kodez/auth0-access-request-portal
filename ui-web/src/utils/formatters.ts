import { PRIORITY_LABELS, STATUS_LABELS } from "../constants/accessRequest.constants";
import type {
  AccessRequestPriority,
  AccessRequestStatus
} from "../types/accessRequest.types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric"
});

export function formatCreatedDate(value: string): string {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return dateFormatter.format(parsedDate);
}

export function formatStatus(status: AccessRequestStatus): string {
  return STATUS_LABELS[status];
}

export function formatPriority(priority: AccessRequestPriority): string {
  return PRIORITY_LABELS[priority];
}
