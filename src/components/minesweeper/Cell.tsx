import React, { memo } from "react";
import { Flag, Bomb } from "lucide-react";
import { Cell as CellType } from "./types";
import "./Cell.css";
interface CellProps {
  cell: CellType;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

const numberColors = {
  1: "text-primaryColor",
  2: "text-primaryColor",
  3: "text-primaryColor",
  4: "text-primaryColor",
  5: "text-primaryColor",
  6: "text-primaryColor",
  7: "text-primaryColor",
  8: "text-primaryColor",
};

const Cell: React.FC<CellProps> = memo(({ cell, onClick, onRightClick }) => {
  const getCellContent = () => {
    if (cell.isRevealed) {
      if (cell.isMine) {
        return (
          <Bomb
            size={14}
            strokeWidth={3}
            className="fill-red-400 stroke-red-400"
          />
        );
      }
      if (cell.neighborMines > 0) {
        return (
          <span
            className={
              numberColors[cell.neighborMines as keyof typeof numberColors]
            }
          >
            {cell.neighborMines}
          </span>
        );
      }
    }

    if (cell.isFlagged) {
      return <Flag size={14} strokeWidth={3} className="text-primaryColor" />;
    }

    return null;
  };

  const cellStyle = cell.isRevealed
    ? "w-7 h-7 flex items-center border-[1px] border-primaryColor/25 justify-center bg-windowBackgroundColor rounded-[5px] text-sm font-bold"
    : "w-7 h-7 flex items-center border-[1px] shadow-sm border-primaryColor justify-center bg-primaryColor/10 rounded-[5px] text-sm font-bold";

  return (
    <button
      className={`${cellStyle} cell`}
      onClick={onClick}
      onContextMenu={onRightClick}
    >
      {getCellContent()}
    </button>
  );
});

Cell.displayName = "Cell";

export { Cell };
