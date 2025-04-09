import { Bomb, FileIcon, Folder, MapIcon, Play } from "lucide-react";
import { DesktopIcon } from "./DesktopIcon";
import { useParams } from "next/navigation";
import { useMapWindowStore } from "~/app/stores/mapWindowStore";
import { usePhotoFinderStore } from "~/app/stores/photoFinderStore";
import { api } from "~/trpc/react";
import { TripFragment } from "@prisma/client";
import { useMinesweepurrrWindowStore } from "~/app/stores/minesweepurrrWindowStore";
import { FolderIcon } from "~/components/icons/FolderIcon";
import { useMusicPlayerWindowStore } from "~/app/stores/MusicPlayerWindowStore";

const useDesktopIcons = (tripFragments: TripFragment[]) => {
  const openMap = useMapWindowStore((state) => state.open);
  const unMinimizeMap = useMapWindowStore((state) => state.unMinimize);

  const openPhotoFinder = usePhotoFinderStore((state) => state.open);
  const unMinimizePhotoFinder = usePhotoFinderStore(
    (state) => state.unMinimize,
  );

  const setSelectedTripFragment = usePhotoFinderStore().setSelectedTripFragment;
  const openMinesweepurrr = useMinesweepurrrWindowStore().open;
  const unMinimizeMinesweepurrr = useMinesweepurrrWindowStore(
    (state) => state.unMinimize,
  );

  const openMusicPlayer = useMusicPlayerWindowStore().open;
  const unMinimizeMusicPlayer = useMusicPlayerWindowStore(
    (state) => state.unMinimize,
  );

  return [
    {
      name: "Map.exe",
      icon: <MapIcon size={60} strokeWidth={1.5} fill="white" />,
      onDoubleClick: () => {
        openMap();
        unMinimizeMap();
      },
    },

    {
      name: "Minesweepurrr.exe",
      icon: <FileIcon size={70} fill="white" strokeWidth={1} />,
      onDoubleClick: () => {
        openMinesweepurrr();
        unMinimizeMinesweepurrr();
      },
    },

    {
      name: "Music Player.exe",
      icon: <Play size={70} fill="white" strokeWidth={1} />,
      onDoubleClick: () => {
        openMusicPlayer();
        unMinimizeMusicPlayer();
      },
    },
    ...tripFragments.map((tripFragment) => ({
      name: tripFragment.name,
      // icon: <Folder size={60} strokeWidth={1.5} fill="white" />,
      icon: <FolderIcon />,
      onDoubleClick: () => {
        openPhotoFinder();
        unMinimizePhotoFinder();
        setSelectedTripFragment(tripFragment);
      },
    })),
  ];
};

export const DesktopIcons = () => {
  const { id: tripId } = useParams();

  const { data: tripFragments, isLoading: isLoadingTripFragments } =
    api.tripFragment.getByTripId.useQuery(parseInt(tripId), {
      enabled: !!tripId,
    });

  const desktopIcons = useDesktopIcons(tripFragments || []);

  return desktopIcons.map((desktopIcon, index) => (
    <DesktopIcon
      initialPosition={{ x: 15, y: 20 + index * 125 }}
      key={desktopIcon.name}
      icon={desktopIcon.icon}
      label={desktopIcon.name}
      onDoubleClick={desktopIcon.onDoubleClick}
    />
  ));
};
