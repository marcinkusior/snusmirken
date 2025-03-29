import { RefObject } from "react";
import { create } from "zustand";

type MapWindowStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isMinimized: boolean;
  minimize: () => void;
  unMinimize: () => void;
  toggleMinimize: () => void;
};

// Create the store with typed state and actions
export const useMapWindowStore = create<MapWindowStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  isMinimized: false,
  minimize: () => set({ isMinimized: true }),
  unMinimize: () => set({ isMinimized: false }),
  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
}));
