import { PostFormValues } from "~/app/_types/PostFormValues";
import cx from "classnames";

export const Gallery: React.FC<{
  posts: PostFormValues[];
  visiblePostsIds: string[];
}> = ({ posts, visiblePostsIds }) => {
  return (
    <div
      className={cx(
        "flex flex-row flex-wrap items-center justify-center gap-y-5",
        "overflow-y-scroll bg-windowBackgroundColor py-3",
      )}
    >
      {posts.map((post, index) => (
        <div
          className={cx(
            "flex-grow-1",
            "flex flex-col items-center justify-center",
            {
              hidden: !visiblePostsIds.includes(post.id),
            },
          )}
          key={post.name}
        >
          <img
            height={20}
            width={"88%"}
            className={cx(
              "photo-img",
              "max-w-[200px] overflow-hidden rounded-[4px]",
            )}
            src={post.imageUrl}
            alt=""
          />
          {/* {post.name} */}
        </div>
      ))}
    </div>
  );
};
