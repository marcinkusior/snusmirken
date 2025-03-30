import { MapIcon, Bomb, Folder } from "lucide-react";
import { usePhotoFinderStore } from "~/app/stores/photoFinderStore";
import { useMapWindowStore } from "~/app/stores/mapWindowStore";
import { useMinesweepurrrWindowStore } from "~/app/stores/minesweepurrrWindowStore";
import { TaskbarButton } from "./TaskbarButton";
import { useEffect, useState } from "react";

type Program = {
  id: string;
  icon: JSX.Element;
  text: string;
  onClick: () => void;
  isMinimized: boolean;
};

let orderCounter = 0;

export const ActivePrograms = () => {
  const isPhotoFinderOpen = usePhotoFinderStore((state) => state.isOpen);
  const isMapOpen = useMapWindowStore((state) => state.isOpen);
  const isMinesweeperOpen = useMinesweepurrrWindowStore(
    (state) => state.isOpen,
  );
  const selectedTripFragment = usePhotoFinderStore(
    (state) => state.selectedTripFragment,
  );

  const isPhotoFinderMinimized = usePhotoFinderStore(
    (state) => state.isMinimized,
  );
  const toggleMinimizePhotoFinder = usePhotoFinderStore(
    (state) => state.toggleMinimize,
  );

  const isMapMinimized = useMapWindowStore((state) => state.isMinimized);
  const toggleMinimizeMap = useMapWindowStore((state) => state.toggleMinimize);

  const isMinesweeperMinimized = useMinesweepurrrWindowStore(
    (state) => state.isMinimized,
  );
  const toggleMinimizeMinesweepurrr = useMinesweepurrrWindowStore(
    (state) => state.toggleMinimize,
  );

  useEffect(() => {
    orderCounter++;
  }, [isMapOpen, isMinesweeperOpen, isPhotoFinderOpen]);

  return (
    <div className="flex gap-2">
      {isMapOpen && (
        <TaskbarButton
          icon={
            <MapIcon
              size={16}
              strokeWidth={2}
              fill="#3d04fc"
              stroke="#3d04fc"
            />
          }
          text="Map.exe"
          onClick={toggleMinimizeMap}
          isMinimized={isMapMinimized}
          initialOrder={orderCounter}
          id="map-taskbar-button"
        />
      )}

      {isMinesweeperOpen && (
        <TaskbarButton
          icon={
            <Bomb size={16} strokeWidth={2} fill="#3d04fc" stroke="#3d04fc" />
          }
          text="Minesweepurrr.exe"
          initialOrder={orderCounter}
          onClick={toggleMinimizeMinesweepurrr}
          isMinimized={isMinesweeperMinimized}
          id="minesweeper-taskbar-button"
        />
      )}

      {isPhotoFinderOpen && (
        <TaskbarButton
          icon={
            <Folder size={16} strokeWidth={2} fill="#3d04fc" stroke="#3d04fc" />
          }
          text={selectedTripFragment?.name ?? ""}
          initialOrder={orderCounter}
          isMinimized={isPhotoFinderMinimized}
          onClick={toggleMinimizePhotoFinder}
          id="photo-finder-taskbar-button"
        />
      )}
    </div>
  );
};
