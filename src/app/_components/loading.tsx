import React from "react";

const Loading = () => {
  return (
    <div className="loading-spinner absolute inset-0 flex h-[200px] w-[200px] flex-col items-center justify-center border border-solid border-gray-200 bg-white">
      <div>
        <img
          src="/catso.jpg"
          alt="Loading..."
          className="h-32 w-32 animate-interval-rotate"
        />
      </div>
      <div className="z-[10]">loading...</div>
    </div>
  );
};

export default Loading;
