import { create } from "zustand";

type MinesweepurrrWindowStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isMinimized: boolean;
  minimize: () => void;
  unMinimize: () => void;
  toggleMinimize: () => void;
};

// Create the store with typed state and actions
export const useMinesweepurrrWindowStore = create<MinesweepurrrWindowStore>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    isMinimized: false,
    minimize: () => set({ isMinimized: true }),
    unMinimize: () => set({ isMinimized: false }),
    toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
  }),
);
