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
  1: "text-borderColor",
  2: "text-borderColor",
  3: "text-borderColor",
  4: "text-borderColor",
  5: "text-borderColor",
  6: "text-borderColor",
  7: "text-borderColor",
  8: "text-borderColor",
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
      return <Flag size={14} strokeWidth={3} className="text-borderColor" />;
    }

    return null;
  };

  const cellStyle = cell.isRevealed
    ? "w-7 h-7 flex items-center border-[1px] border-borderColor/25 justify-center bg-windowBackgroundColor rounded-[5px] text-xs font-bold"
    : "w-7 h-7 flex items-center border-[1px] shadow-sm border-borderColor justify-center bg-borderColor/10 rounded-[5px] text-xs font-bold";

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
