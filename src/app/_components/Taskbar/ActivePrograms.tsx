import { MapIcon, Bomb, Folder, Play } from "lucide-react";
import { usePhotoFinderStore } from "~/app/stores/photoFinderStore";
import { useMapWindowStore } from "~/app/stores/mapWindowStore";
import { useMinesweepurrrWindowStore } from "~/app/stores/minesweepurrrWindowStore";
import { TaskbarButton } from "./TaskbarButton";
import { useEffect, useState } from "react";
import { useMusicPlayerWindowStore } from "~/app/stores/MusicPlayerWindowStore";

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

  const isMusicPlayerOpen = useMusicPlayerWindowStore((state) => state.isOpen);
  const isMusicPlayerMinimized = useMusicPlayerWindowStore(
    (state) => state.isMinimized,
  );
  const toggleMinimizeMusicPlayer = useMusicPlayerWindowStore(
    (state) => state.toggleMinimize,
  );

  useEffect(() => {
    orderCounter++;
  }, [isMapOpen, isMinesweeperOpen, isPhotoFinderOpen]);

  return (
    <div className="flex">
      <TaskbarButton
        isOpen={isMapOpen}
        icon={
          <MapIcon
            size={16}
            strokeWidth={2}
            fill="var(--border-color)"
            stroke="var(--border-color)"
          />
        }
        text="Map.exe"
        onClick={toggleMinimizeMap}
        isMinimized={isMapMinimized}
        order={orderCounter}
        id="map-taskbar-button"
      />

      <TaskbarButton
        isOpen={isMinesweeperOpen}
        icon={
          <Bomb
            size={16}
            strokeWidth={2}
            fill="var(--border-color)"
            stroke="var(--border-color)"
          />
        }
        text="Minesweepurrr.exe"
        order={orderCounter}
        onClick={toggleMinimizeMinesweepurrr}
        isMinimized={isMinesweeperMinimized}
        id="minesweeper-taskbar-button"
      />

      <TaskbarButton
        isOpen={isPhotoFinderOpen}
        icon={
          <Folder
            size={16}
            strokeWidth={2}
            fill="var(--border-color)"
            stroke="var(--border-color)"
          />
        }
        text={selectedTripFragment?.name ?? ""}
        order={orderCounter}
        isMinimized={isPhotoFinderMinimized}
        onClick={toggleMinimizePhotoFinder}
        id="photo-finder-taskbar-button"
      />

      <TaskbarButton
        isOpen={isMusicPlayerOpen}
        icon={
          <Play
            size={16}
            strokeWidth={2}
            fill="var(--border-color)"
            stroke="var(--border-color)"
          />
        }
        text="Music Player.exe"
        order={orderCounter}
        isMinimized={isMusicPlayerMinimized}
        onClick={toggleMinimizeMusicPlayer}
        id="music-player-taskbar-button"
      />
    </div>
  );
};
