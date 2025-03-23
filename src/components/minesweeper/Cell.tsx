import React, { memo } from "react";
import { Flag, Bomb } from "lucide-react";
import { Cell as CellType } from "./types";

interface CellProps {
  cell: CellType;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

const numberColors = {
  1: "text-blue-600",
  2: "text-green-600",
  3: "text-red-600",
  4: "text-blue-900",
  5: "text-red-900",
  6: "text-teal-600",
  7: "text-black",
  8: "text-gray-600",
};

const Cell: React.FC<CellProps> = memo(({ cell, onClick, onRightClick }) => {
  const getCellContent = () => {
    if (cell.isFlagged) {
      return <Flag size={14} className="text-red-600" />;
    }
    if (cell.isRevealed) {
      if (cell.isMine) {
        return <Bomb size={14} />;
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
    return null;
  };

  const cellStyle = cell.isRevealed
    ? "w-6 h-6 flex items-center justify-center bg-[#c0c0c0] border border-[#808080] text-sm font-bold"
    : "w-6 h-6 flex items-center justify-center bg-[#c0c0c0] border-t-[3px] border-l-[3px] border-[#ffffff] border-r-[3px] border-b-[3px] border-r-[#808080] border-b-[#808080] text-sm font-bold";

  return (
    <button
      className={cellStyle}
      onClick={onClick}
      onContextMenu={onRightClick}
    >
      {getCellContent()}
    </button>
  );
});

Cell.displayName = "Cell";

export { Cell };
