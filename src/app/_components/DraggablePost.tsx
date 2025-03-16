import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./DraggablePost";
import { get } from "http";

let zIndexCounter = 1;

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const DraggablePost = ({
  text,
  imageUrl,
  index,
  initialPosition,
}: {
  text: string;
  imageUrl: string;
  index?: number;
  initialPosition: { x: number; y: number };
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [positionX, setPositionX] = useState(() => getRandomNumber(2000, 3000));
  const [potisitionY, setPositionY] = useState(() => getRandomNumber(0, 500));
  const [tilt, setTilt] = useState(0);

  const [transition, setTransition] = useState(
    "transform 0.2s ease-in-out, top 800ms, left 800ms",
  );

  useEffect(() => {
    // const paddingX = 150;
    // const randomX =
    //   Math.floor(Math.random() * (window.innerWidth - paddingX * 2)) + paddingX;

    // const paddingY = 300;
    // const randomY =
    //   Math.floor(Math.random() * (window.innerHeight - paddingY * 2)) +
    //   paddingY;

    const positionX = initialPosition.x;
    const positionY = initialPosition.y;

    const delay = (index ?? 0) * 150;

    setTimeout(() => {
      setPositionX(positionX);
      setPositionY(positionY);
    }, delay);

    const randomTilt = Math.floor(Math.random() * 11) - 5; // Random tilt between -10 and 10 degrees
    setTilt(randomTilt);

    setTimeout(() => {
      setTransition("transform 0.2s ease-in-out");
    }, 1000 + delay);
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
    <div
      className="cursor-move"
      style={{
        top: potisitionY,
        left: positionX,
        transition: transition,
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`user-select-none draggable-post frame w-[400px] overflow-hidden ${
          isDragging ? "shadow-xl" : ""
        }`}
        style={{
          transform: `${isDragging ? "scale(1.06)" : "scale(1)"}`,
          transition: transition,
        }}
      >
        <div className="flex flex-col items-start justify-between gap-2">
          <p className="text-customPink border-b-customPink flex-1 border-b-4 p-1">
            {text}
          </p>

          <div className="relative">
            <img src={imageUrl} alt="" />
            <div className="absolute top-0 h-[100%] w-[100%] bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};
