"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { type PostFormValues, postSchema } from "~/app/_types/PostFromValues";

const NewPostForm: React.FC = () => {
  const router = useRouter();
  const utils = api.useUtils();

  const { data: trips, isLoading: isLoadingTrips } = api.trip.getAll.useQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
  });

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      router.push("/posts");
    },
  });

  const onSubmit = (data: PostFormValues) => {
    createPost.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded bg-white p-6 shadow-md"
      >
        <h2 className="mb-4 text-2xl font-bold">Add New Post</h2>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-700"
          >
            Latitude
          </label>
          <input
            id="latitude"
            type="number"
            step="any"
            {...register("latitude", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {errors.latitude && (
            <p className="mt-1 text-sm text-red-500">
              {errors.latitude.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="longitude"
            className="block text-sm font-medium text-gray-700"
          >
            Longitude
          </label>
          <input
            id="longitude"
            type="number"
            step="any"
            {...register("longitude", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {errors.longitude && (
            <p className="mt-1 text-sm text-red-500">
              {errors.longitude.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="tripId"
            className="block text-sm font-medium text-gray-700"
          >
            Trip
          </label>

          <select
            disabled={isLoadingTrips}
            id="tripId"
            {...register("tripId", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {trips?.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </select>
          {errors.tripId && (
            <p className="mt-1 text-sm text-red-500">{errors.tripId.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Post
        </button>
      </form>
    </div>
  );
};

export default NewPostForm;
