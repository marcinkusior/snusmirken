import { useDraggable } from "@dnd-kit/core";

interface DraggablePostProps {
  onPostClick: (post: {
    imageUrl: string | null;
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    tripId: number | null;
    latitude: number | null;
    longitude: number | null;
    userId: string | null;
    date: bigint | null;
    tripFragmentId: number | null;
  }) => void;
  post: any;
}

export const DraggablePost = ({ onPostClick, post }: DraggablePostProps) => {
  return (
    <div>
      <div>
        <img
          src={post.imageUrl}
          alt={post.name}
          className="h-20 w-20 rounded-md"
        />
      </div>
      <div>
        <h1>{post.name}</h1>
        <button onClick={() => onPostClick(post)}>Show on map</button>
      </div>
    </div>
  );
};
