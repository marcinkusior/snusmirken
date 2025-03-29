import { Post } from "@prisma/client";
import { useState } from "react";
import {
  type FlyToCoordinatesFunction,
  MapComponent,
} from "~/app/_components/Map/Map";
import { Window } from "../window/Window";
import { useMapWindowStore } from "~/app/stores/mapWindowStore";
import React from "react";
import { MapIcon } from "lucide-react";

export const MapWindow = ({ posts }: { posts: Post[] }) => {
  const [flyToCoordinates, setFlyToCoordinates] =
    React.useState<FlyToCoordinatesFunction>();

  const isMapOpen = useMapWindowStore((state) => state.isOpen);
  const closeMap = useMapWindowStore((state) => state.close);

  const minimizeMap = useMapWindowStore((state) => state.minimize);
  const isMinimized = useMapWindowStore((state) => state.isMinimized);

  return (
    <Window
      title="Map.exe"
      defaultPosition={{ x: 35, y: 100 }}
      defaultSize={{ width: 400, height: 440 }}
      onClose={() => closeMap()}
      icon={<MapIcon size={22} strokeWidth={2} fill="white" />}
      isOpen={isMapOpen}
      minimize={minimizeMap}
      isMinimized={isMinimized}
    >
      <MapComponent
        setFlyToCoordinates={setFlyToCoordinates}
        posts={posts}
        latitude={35.30889}
        longitude={139.55028}
      />
    </Window>
  );
};
