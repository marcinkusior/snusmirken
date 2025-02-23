// filepath: /Users/test/Documents/Projects/snufkin/src/app/posts/page.tsx
"use client";
import React from "react";
import { api } from "~/trpc/react";

const PostsPage = () => {
  const { data: posts, isLoading, error } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h1 className="text-center">All Posts</h1>
      {posts && posts.length > 0 ? (
        <ul className="mt-5 flex w-[300px] flex-col justify-center gap-2">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
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
