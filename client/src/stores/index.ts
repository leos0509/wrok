import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type AuthSlice, createAuthSlice } from "./slices/auth.slice";

type StoreState = AuthSlice;

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
    }),
    {
      name: "app-storage",
    },
  ),
);
