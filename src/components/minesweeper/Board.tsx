import React, { memo } from "react";
import { Cell as CellType } from "./types";
import { Cell } from "./Cell";

interface BoardProps {
  board: CellType[][];
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (e: React.MouseEvent, row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = memo(
  ({ board, onCellClick, onCellRightClick }) => {
    return (
      <div className="mt-2 border-b-[3px] border-l-[3px] border-r-[3px] border-t-[3px] border-[#808080] border-b-[#ffffff] border-r-[#ffffff]">
        <div className="grid grid-cols-9 gap-0 bg-[#c0c0c0]">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                onClick={() => onCellClick(rowIndex, colIndex)}
                onRightClick={(e) => onCellRightClick(e, rowIndex, colIndex)}
              />
            )),
          )}
        </div>
      </div>
    );
  },
);

Board.displayName = "Board";
export { Board };
