import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

let zIndexCounter = 1;

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const Photo = ({
  text,
  imageUrl,
  index,
}: {
  text: string;
  imageUrl: string;
  index?: number;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [positionX, setPositionX] = useState(() => getRandomNumber(2000, 3000));
  const [potisitionY, setPositionY] = useState(() => getRandomNumber(0, 500));
  const [tilt, setTilt] = useState(0);

  return (
    <div>
      <div
        className={`user-select-none draggable-post w-[400px] overflow-hidden ${
          isDragging ? "shadow-xl" : ""
        }`}
      >
        <div className="flex flex-col items-start justify-between gap-2">
          <p className="text-customPink flex-1 p-1">{text}</p>

          <div className="relative">
            <img src={imageUrl} alt="" />
            <div className="absolute top-0 h-[100%] w-[100%] bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};
