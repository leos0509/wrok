import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getToken() {
  return localStorage.getItem("token") || null;
}

export function setToken(token: string) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
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
