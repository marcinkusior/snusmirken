import React, { memo } from "react";
import { GameState } from "./types";
import { NiceButton } from "~/app/_components/niceButton/NiceButton";

interface HeaderProps {
  mineCount: number;
  timeElapsed: number;
  gameState: GameState;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = memo(
  ({ mineCount, timeElapsed, gameState, onReset }) => {
    const formatNumber = (num: number): string => {
      if (num < 0) {
        const numAbs = Math.abs(num);
        return `-${numAbs.toString().padStart(2, "0")}`;
      }

      return num.toString().padStart(3, "0");
    };

    const getCatEmoji = () => {
      switch (gameState) {
        case "won":
          return "/cat-glasses.png";
        case "lost":
          return "/cat-dead.png";
        default:
          return "/cat-smile.png";
      }
    };

    return (
      <div className="mb-[15px] mt-[-5px] flex items-center justify-between bg-windowBackgroundColor">
        <div className="px-2 text-2xl text-borderColor">
          {formatNumber(mineCount)}
        </div>
        <NiceButton
          text=""
          onClick={onReset}
          className="box-shadow-none rounded-full border-2 border-borderColor p-[5px] text-2xl shadow-sm"
        >
          {/* {getFaceEmoji()} */}
          <img width={40} height={40} src={getCatEmoji()} alt="face" />
        </NiceButton>
        <div className="px-2 text-2xl text-borderColor">
          {formatNumber(Math.min(timeElapsed, 999))}
        </div>
      </div>
    );
  },
);

Header.displayName = "Header";

export { Header };
