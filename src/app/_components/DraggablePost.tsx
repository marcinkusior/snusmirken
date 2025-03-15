import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./DraggablePost";

let zIndexCounter = 1;

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const DraggablePost = ({
  text,
  imageUrl,
}: {
  text: string;
  imageUrl: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [positionX, setPositionX] = useState(() => getRandomNumber(-600, -300));
  const [potisitionY, setPositionY] = useState(() => getRandomNumber(0, 500));
  const [tilt, setTilt] = useState(0);

  const [transition, setTransition] = useState(
    "transform 0.2s ease-in-out, top 800ms, left 800ms",
  );

  useEffect(() => {
    const padding = 300;
    const randomX =
      Math.floor(Math.random() * (window.innerWidth - padding * 2)) + padding;
    const randomY =
      Math.floor(Math.random() * (window.innerHeight - padding * 2)) + padding;

    setPositionX(randomX);
    setPositionY(randomY);

    const randomTilt = Math.floor(Math.random() * 11) - 5; // Random tilt between -10 and 10 degrees
    setTilt(randomTilt);

    setTimeout(() => {
      setTransition("transform 0.2s ease-in-out");
    }, 900);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();

    e.currentTarget.style.zIndex = String(zIndexCounter++);

    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;

    setPositionX(newX);
    setPositionY(newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div>
      <div
        className={`user-select-none draggable-post absolute w-[300px] cursor-move rounded-lg bg-white p-4 shadow-lg transition-shadow ${
          isDragging ? "shadow-xl" : ""
        }`}
        style={{
          top: potisitionY,
          left: positionX,
          transform: `${isDragging ? "scale(1.06)" : "scale(1)"} rotate(${tilt}deg)`,
          transition: transition,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex flex-col items-start justify-between gap-2">
          {/* <p className="flex-1 text-gray-800">{todo.text}</p> */}
          <div className="relative">
            <img src={imageUrl} alt="" />

            <div className="absolute top-0 h-[100%] w-[100%] bg-transparent" />
          </div>
          <p className="flex-1 text-gray-800">{text}</p>
        </div>
      </div>
    </div>
  );
};
