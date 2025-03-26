import { Bomb, Folder, MapIcon } from "lucide-react";
import { DesktopIcon } from "./DesktopIcon";
import { useParams } from "next/navigation";
import { useMapWindowStore } from "~/app/stores/mapWindowStore";
import { usePhotoFinderStore } from "~/app/stores/photoFinderStore";
import { api } from "~/trpc/react";
import { TripFragment } from "@prisma/client";
import { useMinesweepurrrWindowStore } from "~/app/stores/minesweepurrrWindowStore";

const useDesktopIcons = (tripFragments: TripFragment[]) => {
  const openMap = useMapWindowStore((state) => state.open);
  const openPhotoFinder = usePhotoFinderStore((state) => state.open);
  const setSelectedTripFragment = usePhotoFinderStore().setSelectedTripFragment;
  const openMinesweepurrr = useMinesweepurrrWindowStore().open;

  return [
    {
      name: "Map.exe",
      icon: <MapIcon size={60} strokeWidth={1.5} fill="white" />,
      onDoubleClick: openMap,
    },

    {
      name: "Minesweepurrr.exe",
      icon: <Bomb size={60} strokeWidth={1.5} fill="white" />,
      onDoubleClick: openMinesweepurrr,
    },

    ...tripFragments.map((tripFragment) => ({
      name: tripFragment.name,
      icon: <Folder size={60} strokeWidth={1.5} fill="white" />,
      onDoubleClick: () => {
        openPhotoFinder();
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
      initialPosition={{ x: 20 + index * 105, y: 20 }}
      key={desktopIcon.name}
      icon={desktopIcon.icon}
      label={desktopIcon.name}
      onDoubleClick={desktopIcon.onDoubleClick}
    />
  ));
};
