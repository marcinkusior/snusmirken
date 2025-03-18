"use client";

import { Post, TripFragment } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { Photo } from "~/app/_components/Photo";
import Loading from "~/app/_components/loading";
import { NiceButton } from "~/app/_components/niceButton/NiceButton";
import {
  type FlyToCoordinatesFunction,
  MapComponent,
} from "~/components/map/Map";
import { api } from "~/trpc/react";
import "./tripContainer.css";
import { Window } from "~/app/_components/window/Window";

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
      <div className="mx-auto h-[100vh]">
        <div className="absolute left-10 top-10 flex translate-y-[-50%] flex-row gap-[2px]">
          <div className="pr-10">
            <NiceButton
              onClick={() => {
                setIsMapOpen((prev) => !prev);
              }}
              highlight={isMapOpen}
              text="Map"
            />
          </div>

          {tripFragments?.map((tripFragment) => (
            <NiceButton
              onClick={() => {
                updatTripFragment(tripFragment);
              }}
              key={tripFragment.id}
              highlight={selectedTripFragment?.id === tripFragment.id}
              text={tripFragment.name}
            />
          ))}
        </div>

        {isMapOpen && (
          <Window
            title="Map"
            defaultPosition={{ x: 35, y: 100 }}
            defaultSize={{ width: 400, height: 440 }}
            onClose={() => setIsMapOpen(false)}
          >
            <MapComponent
              setFlyToCoordinates={setFlyToCoordinates}
              posts={posts}
              latitude={35.30889}
              longitude={139.55028}
            />
          </Window>
        )}

        {selectedTripFragment && (
          <Window
            defaultPosition={{ x: 460, y: 100 }}
            defaultSize={{ width: 1100, height: 600 }}
            title={selectedTripFragment?.name}
            onClose={() => setSelectedTripFragment(null)}
          >
            <div
              id="trip-container"
              className="relative flex h-[70vh] flex-grow"
            >
              {isLoadingTripFragmentPosts && <Loading />}

              <div className="relative flex flex-row flex-wrap gap-10 overflow-y-scroll">
                {tripFragmentPosts?.map((post, index) => (
                  <Photo
                    key={post.id}
                    text={post.name}
                    imageUrl={post.imageUrl}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </Window>
        )}
      </div>
    </>
  );
};

export default TripPage;
