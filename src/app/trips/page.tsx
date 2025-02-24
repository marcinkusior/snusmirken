// filepath: /Users/test/Documents/Projects/snufkin/src/app/trips/trip.tsx
"use client";

import React from "react";
import { api } from "~/trpc/react";

const TripsPage = () => {
  const { data: trips, isLoading, error } = api.trip.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h1 className="mb-5 text-center text-3xl font-bold">All Trips</h1>
      {trips && trips.length > 0 ? (
        <ul className="mt-5 flex w-full max-w-2xl flex-col gap-4">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="flex flex-col gap-2 rounded-lg bg-white/10 p-4 shadow-md transition hover:bg-white/20"
            >
              <h2 className="text-xl font-semibold">{trip.name}</h2>
              <p>Created at: {new Date(trip.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No trips available.</p>
      )}
    </div>
  );
};

export default TripsPage;
