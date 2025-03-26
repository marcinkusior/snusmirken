import { create } from "zustand";

type MinesweepurrrWindowStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

// Create the store with typed state and actions
export const useMinesweepurrrWindowStore = create<MinesweepurrrWindowStore>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  }),
);
