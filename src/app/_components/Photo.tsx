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
  return (
    <div>
      <div
        className={`user-select-none draggable-post w-[400px] overflow-hidden`}
      >
        <div className="flex flex-col items-start justify-between gap-2">
          <p className="text-prettyBlue flex-1 p-1">{text}</p>

          <div className="relative">
            <img src={imageUrl} alt="" />
            <div className="absolute top-0 h-[100%] w-[100%] bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};
