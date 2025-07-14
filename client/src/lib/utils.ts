import type { TaskPriority, TaskStatus } from "@/types/task";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getToken() {
  return localStorage.getItem("token") || null;
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function userShortName(firstName: string, lastName: string) {
  if (!firstName && !lastName) return "User";
  if (!firstName) return lastName.charAt(0).toUpperCase();
  if (!lastName) return firstName.charAt(0).toUpperCase();
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}

export function dateRangeToString(
  dateRange: DateRange | null | undefined,
): string {
  if (!dateRange) return "";
  if (!dateRange.from && !dateRange.to) return "";
  const from = dateRange.from ? format(new Date(dateRange.from), "MMM dd") : "";
  const to = dateRange.to ? format(new Date(dateRange.to), "MMM dd") : "";
  return `${from}${from && to ? " - " : ""}${to}`;
}

export function statusMapping(status: TaskStatus): string {
  switch (status) {
    case "TO_DO":
      return "To Do";
    case "IN_PROGRESS":
      return "In Progress";
    case "DONE":
      return "Done";
    default:
      return status;
  }
}

export function priorityMapping(priority: TaskPriority): string {
  switch (priority) {
    case "LOWEST":
      return "Lowest";
    case "LOW":
      return "Low";
    case "MEDIUM":
      return "Medium";
    case "HIGH":
      return "High";
    case "HIGHEST":
      return "Highest";
    default:
      return priority;
  }
}