import { TripFragment } from "@prisma/client";
import { create } from "zustand";

type PhotoFinderStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  selectedTripFragment: TripFragment | null;
  setSelectedTripFragment: (tripFragment: TripFragment) => void;
};

export const usePhotoFinderStore = create<PhotoFinderStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  selectedTripFragment: null,
  setSelectedTripFragment: (tripFragment: TripFragment) =>
    set({ selectedTripFragment: tripFragment }),
}));
