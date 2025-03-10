"use client";

import { Post } from "@prisma/client";
import { useParams } from "next/navigation";
import React from "react";
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

  const onPostClick = (post: Post) => {
    flyToCoordinates?.({
      latitude: post.latitude,
      longitude: post.longitude,
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div>
        <MapComponent
          setFlyToCoordinates={setFlyToCoordinates}
          posts={posts}
          latitude={35.30889}
          longitude={139.55028}
        />
      </div>

      {tripFragments?.map((tripFragment) => (
        <div>
          <button
            className="m-2 rounded-full border-b-4 border-r-4 border-pink-500 bg-customSalmon px-6 py-2 text-center text-xl leading-8 text-pink-500"
            key={tripFragment.id}
          >
            <h2>{tripFragment.name}</h2>
          </button>

          <NiceButton key={tripFragment.id} text={tripFragment.name} />
        </div>
      ))}
    </div>
  );
};

export default TripPage;
