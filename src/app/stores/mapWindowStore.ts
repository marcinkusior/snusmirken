import { RefObject } from "react";
import { create } from "zustand";

type MapWindowStore = {
  isOpen: boolean;
  isMinimized: boolean;
  open: () => void;
  close: () => void;
  minimize: () => void;
  unMinimize: () => void;
  toggleMinimize: () => void;
};

// Create the store with typed state and actions
export const useMapWindowStore = create<MapWindowStore>((set) => ({
  isOpen: false,
  isMinimized: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  minimize: () => set({ isMinimized: true }),
  unMinimize: () => set({ isMinimized: false }),
  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
}));
