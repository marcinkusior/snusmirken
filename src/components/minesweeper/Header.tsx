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
      <div className="bg-windowBackgroundColor mb-[15px] mt-[-5px] flex items-center justify-between">
        <div className="text-primaryColor px-2 text-2xl">
          {formatNumber(mineCount)}
        </div>
        <button onClick={onReset} className="border-primaryColor text-2xl">
          {getFaceEmoji()}
        </button>
        <div className="text-primaryColor px-2 text-2xl">
          {formatNumber(Math.min(timeElapsed, 999))}
        </div>
      </div>
    );
  },
);

Header.displayName = "Header";

export { Header };
