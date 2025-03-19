import { Post } from "@prisma/client";
import { Photo } from "../Photo";
import Loading from "../loading";
import "./PhotoFinder.css";
import { useEffect, useState } from "react";
import { NiceButton } from "../niceButton/NiceButton";

// old photoFinder
{
  /* <div id="trip-container" className="relative flex h-[70vh] flex-grow">
{isLoading && <Loading />}

<div className="relative flex flex-row flex-wrap gap-10 overflow-y-scroll">
  {posts?.map((post, index) => (
    <Photo
      key={post.id}
      text={post.name}
      imageUrl={post.imageUrl}
      index={index}
    />
  ))}
</div>
</div> */
}

export const PhotoFinder = ({
  posts,
  isLoading,
}: {
  posts: Post[];
  isLoading: boolean;
}) => {
  const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined);

  useEffect(() => {
    if (!posts) return;
    setSelectedPost(posts[0]);
  }, [posts]);

  return (
    <div className="h-[100%] w-[100%]">
      {isLoading && <Loading />}

      {!isLoading && (
        <div className="photo-finder-grid h-[100%] w-[100%]">
          <div className="photo-finder-grid__main overflow-hidden">
            <div className="flex h-[100%] w-[100%] justify-center">
              <img
                className="h-[100%] w-[100%] object-contain"
                src={selectedPost?.imageUrl}
                alt={selectedPost?.name}
              />
            </div>
          </div>
          <div className="photo-finder-grid__sidebar border-l-2 border-slate-300 pl-5">
            <div className="flex-">{`${selectedPost?.name}.webp`}</div>
            <div className="text-xs text-slate-400">WebP Image - 204kB</div>
            <br />
            <div className="mb-[4px] text-sm text-slate-400">Information</div>

            <div className="mb-[4px] flex justify-between border-b border-slate-300 text-xs text-slate-400">
              <div>Created at</div>
              <div>NA</div>
            </div>

            <div className="mb-[4px] flex justify-between border-b border-slate-300 text-xs text-slate-400">
              <div>Modified at</div>
              <div>NA</div>
            </div>

            <div className="mb-[4px] flex justify-between border-b border-slate-300 text-xs text-slate-400">
              <div>Dimensions</div>
              <div>312x460</div>
            </div>

            <div className="mb-[4px] flex justify-between border-b border-slate-300 text-xs text-slate-400">
              <div>Colour Space</div>
              <div>RGB</div>
            </div>

            <div className="mb-[4px] flex justify-between border-b border-slate-300 text-xs text-slate-400">
              <div>Alpha Channel</div>
              <div>No</div>
            </div>

            <div className="mb-[4px] flex justify-between border-b border-slate-300 text-xs text-slate-400">
              <div>Extension</div>
              <div>webp</div>
            </div>

            <br />

            <button className="text-prettyBlue">Show on Map</button>
          </div>
          <div className="photo-finder-grid__selection overflow-y-hidden overflow-x-scroll">
            <div className="flex h-[100%] flex-row items-center">
              {posts.map((post, index) => (
                <div
                  onClick={() => setSelectedPost(post)}
                  className={`p flex-shrink-0 rounded-md border-2 p-1 ${post.id === selectedPost?.id ? "border-prettyBlue" : "border-transparent"}`}
                  key={post.id}
                >
                  <img
                    className="max-h-[70px] w-full rounded-md"
                    src={post.imageUrl}
                    alt={post.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
