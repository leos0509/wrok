import { getToken, removeToken } from "@/lib/utils";
import type { User } from "@/types/user";
import { type StateCreator } from "zustand";

export type AuthSliceState = {
  user: User | null;
  isAuthenticated: boolean;
}

export type AuthSliceActions = {
  setUser: (user: User) => void;
  signout: () => void;
}

export type AuthSlice = AuthSliceState & AuthSliceActions;

export const createAuthSlice: StateCreator<AuthSlice> = (
  set,
) => ({
  user: null,
  isAuthenticated: Boolean(getToken()),
  setUser: (user) => set({ user, isAuthenticated: true }),
  signout: () => {
    set({ user: null, isAuthenticated: false });
    removeToken();
  },
});
