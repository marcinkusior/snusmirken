import React, { memo } from "react";
import { Flag, Bomb } from "lucide-react";
import { Cell as CellType } from "./types";

interface CellProps {
  cell: CellType;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

const numberColors = {
  1: "text-prettyBlue",
  2: "text-prettyBlue",
  3: "text-prettyBlue",
  4: "text-prettyBlue",
  5: "text-prettyBlue",
  6: "text-prettyBlue",
  7: "text-prettyBlue",
  8: "text-prettyBlue",
};

const Cell: React.FC<CellProps> = memo(({ cell, onClick, onRightClick }) => {
  const getCellContent = () => {
    if (cell.isRevealed) {
      if (cell.isMine) {
        return (
          <Bomb
            size={14}
            strokeWidth={3}
            className="fill-red-400 stroke-prettyBlue"
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
      return <Flag size={14} strokeWidth={3} className="text-prettyBlue" />;
    }

    return null;
  };

  const cellStyle = cell.isRevealed
    ? "w-7 h-7 flex items-center border-[1px] border-prettyBlue/25 justify-center bg-white rounded-[5px] text-sm font-bold"
    : "w-7 h-7 flex items-center border-[1px] shadow-sm border-prettyBlue justify-center bg-prettyBlue/10 rounded-[5px] text-sm font-bold";

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
