"use client";

import { Post, TripFragment } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import Loading from "~/app/_components/loading";
import { NiceButton } from "~/app/_components/niceButton/NiceButton";
import { type FlyToCoordinatesFunction } from "~/app/_components/Map/Map";
import { api } from "~/trpc/react";
import "./tripContainer.css";
import { Taskbar } from "~/app/_components/Taskbar/Taskbar";
import { Minesweeper } from "~/components/minesweeper/Minesweeper";
import { BasicWindow } from "~/app/_components/window/BasicWindow";
import { MapWindow } from "~/app/_components/Map/MapWindow";
import { DesktopIcons } from "~/app/_components/DesktopIcon/DesktopIcons";
import { PhotoFinderWindow } from "~/app/_components/PhotoFinder/PhotoFinderWindow";
import { MinesweeperWindow } from "~/components/minesweeper/MinesweeperWindow";

const TripPage = () => {
  const [flyToCoordinates, setFlyToCoordinates] =
    React.useState<FlyToCoordinatesFunction>();
  const [selectedTripFragment, setSelectedTripFragment] = useState<null | {
    name: string;
    id: number;
  }>(null);
  const [isMapOpen, setIsMapOpen] = useState(true);

  const { id: tripId } = useParams();

  const {
    data: posts,
    isLoading,
    error,
  } = api.post.getByTripId.useQuery(parseInt(tripId), {
    enabled: !!tripId,
  });

  const {
    data: tripFragmentPosts,
    isLoading: isLoadingTripFragmentPosts,
    error: errorTripFragmentPosts,
  } = api.post.getByTripFragmentId.useQuery(
    parseInt(selectedTripFragment?.id as number),
    {
      enabled: !!selectedTripFragment,
    },
  );

  const { data: tripFragments, isLoading: isLoadingTripFragments } =
    api.tripFragment.getByTripId.useQuery(parseInt(tripId), {
      enabled: !!tripId,
    });

  const onPostClick = (post: Post) => {
    flyToCoordinates?.({
      latitude: post.latitude,
      longitude: post.longitude,
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  const updatTripFragment = (tripFragmentid: TripFragment) => {
    setSelectedTripFragment((prev) =>
      prev?.id === tripFragmentid.id ? null : tripFragmentid,
    );
  };

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
        }}
        className="mx-auto h-[100vh]"
      >
        <DesktopIcons />

        <div>
          <div className="minesweeper-window-card">
            <MinesweeperWindow />
          </div>
          <div className="map-window-card">
            <MapWindow posts={posts} />
          </div>
          <div className="photo-finder-window-card">
            <PhotoFinderWindow />
          </div>
        </div>
      </div>
      <Taskbar />
    </>
  );
};

export default TripPage;
