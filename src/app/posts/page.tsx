// filepath: /Users/test/Documents/Projects/snufkin/src/app/posts/page.tsx
"use client";
import Link from "next/link";
import React from "react";
import { api } from "~/trpc/react";

const PostsPage = () => {
  const { data: posts, isLoading, error } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <Link
        href="/posts/new"
        className="border-customPurple text-customPurple hover:bg-customPurple mb-5 transform rounded-md border p-5 font-bold transition duration-300 ease-in-out hover:scale-105 hover:text-white"
      >
        + Create New Post
      </Link>
      {posts && posts.length > 0 ? (
        <ul className="mt-5 flex w-[300px] flex-col justify-center gap-2">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex max-w-xs flex-col gap-4 rounded-xl border border-gray-400 p-5"
            >
              <h2>{post.name}</h2>
              <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default PostsPage;
