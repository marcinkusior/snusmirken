import { TripFragment } from "@prisma/client";
import { create } from "zustand";

type PhotoFinderStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  selectedTripFragment: TripFragment | null;
  setSelectedTripFragment: (tripFragment: TripFragment) => void;
  isMinimized: boolean;
  minimize: () => void;
  unMinimize: () => void;
  toggleMinimize: () => void;
};

export const usePhotoFinderStore = create<PhotoFinderStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  isMinimized: false,
  minimize: () => set({ isMinimized: true }),
  unMinimize: () => set({ isMinimized: false }),
  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
  selectedTripFragment: null,
  setSelectedTripFragment: (tripFragment: TripFragment) =>
    set({ selectedTripFragment: tripFragment }),
}));
