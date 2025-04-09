import React, { useRef, useState } from "react";
import { SplitPane } from "../SplitPane/SplitPane";
import { MapComponent } from "./Map";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import FileMenu from "~/components/FileMenu/FileMenu";
import { useMapWindowStore } from "~/app/stores/mapWindowStore";
import { Gallery } from "./Gallery";
import { NewMapComponent } from "./NewMap";
import { PostFormValues } from "~/app/_types/PostFormValues";

export const MapAndGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visiblePostsIds, setVisiblePostsIds] = useState<string[]>([]);
  const [selectedTripFragmentId, setSelectedTripFragmentId] = useState<
    number | null
  >(null);

  const { id: tripId } = useParams();

  const {
    data: posts,
    isLoading,
    error,
  } = api.post.getByTripId.useQuery(parseInt(tripId), {
    enabled: !!tripId,
  });

  const { data: tripFragments, isLoading: isLoadingTripFragments } =
    api.tripFragment.getByTripId.useQuery(parseInt(tripId), {
      enabled: !!tripId,
    });
  const closeMap = useMapWindowStore((state) => state.close);

  const menus = [
    {
      label: "Program",
      options: [{ label: "Exit", action: closeMap }],
    },
    {
      label: "Location",
      options: tripFragments?.map((tripFragment) => ({
        label: tripFragment.name,
        action: () => {
          setSelectedTripFragmentId(tripFragment.id);
        },
      })),
    },
  ];

  return (
    <div className="h-full w-full">
      <div className="relative z-10 w-full">
        <FileMenu menus={menus} />
      </div>

      <div className="flex h-[calc(100%-34px)] flex-row" ref={containerRef}>
        <NewMapComponent
          selectedTripFragmentId={selectedTripFragmentId}
          posts={posts}
        />
      </div>
    </div>
  );
};
