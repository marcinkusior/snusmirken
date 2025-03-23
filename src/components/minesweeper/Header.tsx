import React, { memo } from "react";
import { GameState } from "./types";

interface HeaderProps {
  mineCount: number;
  timeElapsed: number;
  gameState: GameState;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = memo(
  ({ mineCount, timeElapsed, gameState, onReset }) => {
    const formatNumber = (num: number): string => {
      return num.toString().padStart(3, "0");
    };

    const getFaceEmoji = () => {
      switch (gameState) {
        case "won":
          return "😎";
        case "lost":
          return "😵";
        default:
          return "🙂";
      }
    };

    return (
      <div className="flex items-center justify-between border-b-[3px] border-l-[3px] border-r-[3px] border-t-[3px] border-[#808080] border-b-[#ffffff] border-r-[#ffffff] bg-[#c0c0c0] p-2">
        <div className="bg-black px-2 py-1 font-['Digital'] text-2xl text-red-600">
          {formatNumber(mineCount)}
        </div>
        <button
          onClick={onReset}
          className="flex h-10 w-10 items-center justify-center border-b-[3px] border-l-[3px] border-r-[3px] border-t-[3px] border-[#ffffff] border-b-[#808080] border-r-[#808080] bg-[#c0c0c0] text-2xl"
        >
          {getFaceEmoji()}
        </button>
        <div className="bg-black px-2 py-1 font-['Digital'] text-2xl text-red-600">
          {formatNumber(Math.min(timeElapsed, 999))}
        </div>
      </div>
    );
  },
);

Header.displayName = "Header";

export { Header };
