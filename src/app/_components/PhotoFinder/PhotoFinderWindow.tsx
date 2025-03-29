import { useState } from "react";
import { Window } from "../window/Window";
import { api } from "~/trpc/react";
import { PhotoFinder } from "./PhotoFinder";
import { Post } from "@prisma/client";
import { usePhotoFinderStore } from "~/app/stores/photoFinderStore";
import { Folder } from "lucide-react";

export const PhotoFinderWindow = () => {
  const selectedTripFragment = usePhotoFinderStore(
    (state) => state.selectedTripFragment,
  );

  const isOpen = usePhotoFinderStore((state) => state.isOpen);
  const close = usePhotoFinderStore((state) => state.close);

  const isMinimized = usePhotoFinderStore((state) => state.isMinimized);
  const minimize = usePhotoFinderStore((state) => state.minimize);

  const { data: tripFragmentPosts, isLoading: isLoadingTripFragmentPosts } =
    api.post.getByTripFragmentId.useQuery(
      parseInt(selectedTripFragment?.id as number),
      {
        enabled: !!selectedTripFragment,
      },
    );

  return (
    <Window
      defaultPosition={{ x: 460, y: 100 }}
      defaultSize={{ width: 900, height: 600 }}
      title={selectedTripFragment?.name ?? ""}
      onClose={close}
      icon={<Folder size={22} strokeWidth={2} fill="white" />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      minimize={minimize}
      taskbarButtonId="photo-finder-taskbar-button"
    >
      <PhotoFinder
        posts={tripFragmentPosts as Post[]}
        isLoading={isLoadingTripFragmentPosts}
      />
    </Window>
  );
};
