import { getToken, removeToken } from "@/lib/utils";
import type { Team } from "@/types/team";
import type { User } from "@/types/user";
import { type StateCreator } from "zustand";

export type AuthSliceState = {
  user: User | null;
  currentTeam?: Team | null;
  isAuthenticated: boolean;
};

export type AuthSliceActions = {
  setUser: (user: User) => void;
  setCurrentTeam: (team: Team) => void;
  signout: () => void;
};

export type AuthSlice = AuthSliceState & AuthSliceActions;

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  isAuthenticated: Boolean(getToken()),
  currentTeam: null,
  setCurrentTeam: (team: Team) => set({ currentTeam: team }),
  setUser: (user) => set({ user, isAuthenticated: true }),
  signout: () => {
    set({ user: null, isAuthenticated: false, currentTeam: null });
    removeToken();
  },
});
