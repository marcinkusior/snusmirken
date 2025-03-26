import { create } from "zustand";

type MapWindowStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

// Create the store with typed state and actions
export const useMapWindowStore = create<MapWindowStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
