import { PostFormValues } from "~/app/_types/PostFormValues";

export const Gallery: React.FC<{ posts: PostFormValues[] }> = ({ posts }) => {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-y-5 overflow-y-scroll bg-windowBackgroundColor py-3">
      {posts.map((post, index) => (
        <div
          className="flex-grow-1 flex flex-col items-center justify-center"
          key={index}
        >
          <img
            height={20}
            width={"88%"}
            className="photo-img max-w-[200px] overflow-hidden rounded-[4px]"
            src={post.imageUrl}
            alt=""
          />
          {/* {post.name} */}
        </div>
      ))}
    </div>
  );
};
