"use client";

const getPhotosPositions = (photosQuantity: number) => {
  const container = document.getElementById("trip-container");
  if (!container) return;

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // Calculate the number of rows and columns for an even distribution
  const numCols = 5;
  const numRows = 1;
  const cellWidth = containerWidth / numCols;
  const cellHeight = containerHeight / numRows;

  // Calculate padding to keep photos away from edges
  const paddingX = cellWidth * 0.2;
  const paddingY = cellHeight * 0.2;

  const result = [];

  for (let index = 0; index < photosQuantity; index++) {
    // Determine the cell position (zigzag pattern)
    let row = Math.floor(index / numCols);
    let col = index % numCols;

    // Offset even rows to create a zigzag pattern
    if (row % 2 === 1) {
      col = numCols - 1 - col;
    }

    // Calculate base position within the cell
    const baseX = cellWidth * col + paddingX;
    const baseY = cellHeight * row + paddingY;

    // Add slight randomness while keeping photos within their cells
    const randomX = (Math.random() - 0.5) * (cellWidth - paddingX * 2) * 0.5;
    const randomY = (Math.random() - 0.5) * (cellHeight - paddingY * 2) * 0.5;

    result.push({ x: baseX + randomX, y: baseY + randomY });
  }

  return result;
};

import { Post } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { DraggablePost } from "~/app/_components/DraggablePost";
import Loading from "~/app/_components/loading";
import { NiceButton } from "~/app/_components/niceButton/NiceButton";
import {
  type FlyToCoordinatesFunction,
  MapComponent,
} from "~/components/map/Map";
import Navigation from "~/components/navigation/Navigation";
import { api } from "~/trpc/react";
import "./tripContainer.css";

const convertBigIntToDate = (bigintTimestamp) => {
  return new Date(Number(bigintTimestamp)).toLocaleString();
};

const TripPage = () => {
  const [flyToCoordinates, setFlyToCoordinates] =
    React.useState<FlyToCoordinatesFunction>();
  const [selectedTripFragment, setSelectedTripFragment] = useState<
    null | number
  >(null);

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
    parseInt(selectedTripFragment as number),
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

  const updatTripFragment = (tripFragmentid: string) => {
    setSelectedTripFragment((prev) =>
      prev === tripFragmentid ? null : tripFragmentid,
    );
  };

  const photoPositions = getPhotosPositions(posts.length);

  return (
    <>
      <div className="mx-auto h-[100vh] p-14">
        <div className="flex translate-y-[-50%] flex-row gap-[2px]">
          {tripFragments?.map((tripFragment) => (
            <NiceButton
              onClick={() => {
                updatTripFragment(tripFragment.id);
              }}
              key={tripFragment.id}
              highlight={selectedTripFragment === tripFragment.id}
              text={tripFragment.name}
            />
          ))}
        </div>

        <div className="flex-column flex gap-3">
          <div id="trip-container" className="relative flex h-[80vh] flex-grow">
            {isLoadingTripFragmentPosts && <Loading />}

            <div className="relative flex flex-row flex-wrap gap-10 overflow-y-scroll">
              {tripFragmentPosts?.map((post, index) => (
                <DraggablePost
                  key={post.id}
                  text={post.name}
                  imageUrl={post.imageUrl}
                  index={index}
                  initialPosition={photoPositions[index]}
                />
              ))}
            </div>
          </div>
          <div className="frame">
            <MapComponent
              setFlyToCoordinates={setFlyToCoordinates}
              posts={posts}
              latitude={35.30889}
              longitude={139.55028}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TripPage;
