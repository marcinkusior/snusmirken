"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { type PostFormValues, postSchema } from "~/app/_types/PostFormValues";
import { UploadButton } from "~/components/uploadThing/UploadThing";

const NewPostForm: React.FC = () => {
  const router = useRouter();
  const utils = api.useUtils();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { data: trips, isLoading: isLoadingTrips } = api.trip.getAll.useQuery();
  const { data: tripFragments, isLoading: isLoadingTripFragments } =
    api.tripFragment.getAll.useQuery();

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
    createPost.mutate({ ...data, imageUrl: imageUrl });
  };

  return (
    <div className="flex max-h-screen items-center justify-center overflow-scroll">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded bg-white p-6 shadow-md"
      >
        <h2 className="mb-4 text-2xl font-bold">Add New Post</h2>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-xs font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-xs"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="latitude"
            className="block text-xs font-medium text-gray-700"
          >
            Latitude
          </label>
          <input
            id="latitude"
            type="number"
            step="any"
            {...register("latitude", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-xs"
          />
          {errors.latitude && (
            <p className="mt-1 text-xs text-red-500">
              {errors.latitude.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="longitude"
            className="block text-xs font-medium text-gray-700"
          >
            Longitude
          </label>
          <input
            id="longitude"
            type="number"
            step="any"
            {...register("longitude", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-xs"
          />
          {errors.longitude && (
            <p className="mt-1 text-xs text-red-500">
              {errors.longitude.message}
            </p>
          )}
        </div>

        {/* <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-xs font-medium text-gray-700"
          >
            Date
          </label>
          <input
            id="date"
            type="datetime-local"
            {...register("date")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-xs"
          />
          {errors.date && (
            <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>
          )}
        </div> */}

        <div className="mb-4">
          <label
            htmlFor="tripId"
            className="block text-xs font-medium text-gray-700"
          >
            Trip
          </label>

          <select
            disabled={isLoadingTrips}
            id="tripId"
            {...register("tripId", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-xs"
          >
            {trips?.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </select>
          {errors.tripId && (
            <p className="mt-1 text-xs text-red-500">{errors.tripId.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="tripFragmentId"
            className="block text-xs font-medium text-gray-700"
          >
            TripFragment
          </label>

          <select
            disabled={isLoadingTripFragments}
            id="tripFragmentId"
            {...register("tripFragmentId", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-xs"
          >
            {tripFragments?.map((tripFragment) => (
              <option key={tripFragment.id} value={tripFragment.id}>
                {tripFragment.name}
              </option>
            ))}
          </select>
          {errors.tripFragmentId && (
            <p className="mt-1 text-xs text-red-500">
              {errors.tripFragmentId.message}
            </p>
          )}
        </div>

        <div>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setImageUrl(res[0]?.ufsUrl);
              alert("Upload Completed");
            }}
            onBeforeUploadBegin={(files) => {
              console.log("files", files);
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
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
