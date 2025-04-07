import React, { useRef, useState } from "react";
import { SplitPane } from "../SplitPane/SplitPane";
import { MapComponent } from "./Map";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import FileMenu from "~/components/FileMenu/FileMenu";
import { useMapWindowStore } from "~/app/stores/mapWindowStore";
import { Gallery } from "./Gallery";
import { NewMapComponent } from "./NewMap";

export const MapAndGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visiblePostsIds, setVisiblePostsIds] = useState<string[]>([]);

  const { id: tripId } = useParams();

  const {
    data: posts,
    isLoading,
    error,
  } = api.post.getByTripId.useQuery(parseInt(tripId), {
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
      options: [
        {
          label: `Tokyo`,
          action: () => {},
        },
        {
          label: `Kawaguchiko`,
          action: () => {},
        },
        {
          label: `Kamakura`,
          action: () => {},
        },
      ],
    },
  ];

  return (
    <div className="h-full w-full">
      <div className="relative z-10 w-full">
        <FileMenu menus={menus} />
      </div>

      <div className="flex h-[calc(100%-34px)] flex-row" ref={containerRef}>
        {/* <MapComponent
          posts={posts}
          onVisiblePostsChange={setVisiblePostsIds}
          latitude={35.30889}
          longitude={139.55028}
          setFlyToCoordinates={() => {}}
        /> */}

        <NewMapComponent posts={posts} />

        {/* <SplitPane
          initialLeftWidth={450}
          left={
            <MapComponent
              posts={posts}
              onVisiblePostsChange={setVisiblePostsIds}
              latitude={35.30889}
              longitude={139.55028}
              setFlyToCoordinates={() => {}}
            />
          }
          // right={<Gallery visiblePostsIds={visiblePostsIds} posts={posts} />}
          containerRef={containerRef}
        /> */}
      </div>
    </div>
  );
};
