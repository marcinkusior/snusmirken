"use client";

import { Post } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { DraggablePost } from "~/app/_components/DraggablePost/DraggablePost";
import Loading from "~/app/_components/loading";
import { NiceButton } from "~/app/_components/niceButton/NiceButton";
import {
  type FlyToCoordinatesFunction,
  MapComponent,
} from "~/components/map/Map";
import { api } from "~/trpc/react";

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

  console.log(tripFragmentPosts);

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

  return (
    <div className="container mx-auto p-14">
      <div className="gap- flex translate-y-[-50%] flex-row gap-[2px]">
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

      <div>
        {isLoadingTripFragmentPosts && <Loading />}

        <div className="flex flex-row gap-3">
          {tripFragmentPosts?.map((post) => (
            <div
              key={post.id}
              className="flex flex-row gap-3 rounded-md bg-gray-200 p-3"
            >
              <DraggablePost onPostClick={onPostClick} post={post} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <MapComponent
          setFlyToCoordinates={setFlyToCoordinates}
          posts={posts}
          latitude={35.30889}
          longitude={139.55028}
        />
      </div>
    </div>
  );
};

export default TripPage;
