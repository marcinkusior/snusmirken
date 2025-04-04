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
      <div className="mt-2">
        <div
          className="grid-cols grid gap-1 bg-windowBackgroundColor"
          style={{ gridTemplateColumns: `repeat(${board[0]?.length}, 1fr)` }}
        >
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
