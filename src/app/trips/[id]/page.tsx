"use client";

import { Post } from "@prisma/client";
import { useParams } from "next/navigation";
import React from "react";
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

  const onPostClick = (post: Post) => {
    flyToCoordinates?.({
      latitude: post.latitude,
      longitude: post.longitude,
    });
  };

  if (isLoading) return <div>Loading...</div>;
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

      {posts && posts.length > 0 ? (
        <ul className="flex flex-row space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="rounded border p-4 shadow"
              onClick={() => onPostClick(post)}
            >
              <h2 className="text-xl font-semibold">{post.name}</h2>
              <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
              <p>Latitude: {post.latitude}</p>
              <p>Longitude: {post.longitude}</p>
              <p>Date: {convertBigIntToDate(post.date)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts available for this trip.</p>
      )}
    </div>
  );
};

export default TripPage;
