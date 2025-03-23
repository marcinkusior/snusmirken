import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Flag, Bomb } from "lucide-react";
import { generateBoard, revealCell, flagCell, checkWin } from "./gameLogic";
import { Cell, GameState } from "./types";
import { Header } from "./Header";
import { Board } from "./Board";

export const Minesweeper = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const initializeGame = useCallback(() => {
    const newBoard = generateBoard(9, 9, 10);
    setBoard(newBoard);
    setGameState("playing");
    setTimeElapsed(0);
    setFirstClick(true);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  useEffect(() => {
    initializeGame();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameState !== "playing") return;

      if (firstClick) {
        setFirstClick(false);
        const id = setInterval(() => {
          setTimeElapsed((prev) => prev + 1);
        }, 1000);
        setIntervalId(id);
      }

      setBoard((prevBoard) => {
        const newBoard = revealCell(prevBoard, row, col);

        if (newBoard[row][col].isMine) {
          if (intervalId) clearInterval(intervalId);
          setGameState("lost");
          return prevBoard.map((row) =>
            row.map((cell) =>
              cell.isMine ? { ...cell, isRevealed: true } : cell,
            ),
          );
        }

        if (checkWin(newBoard)) {
          if (intervalId) clearInterval(intervalId);
          setGameState("won");
        }

        return newBoard;
      });
    },
    [gameState, firstClick, intervalId],
  );

  const handleCellRightClick = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault();
      if (gameState !== "playing") return;

      setBoard((prevBoard) => {
        const [newBoard] = flagCell(prevBoard, row, col);
        return newBoard;
      });
    },
    [gameState],
  );

  const mineCount = useMemo(() => {
    let result = 0;
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.isFlagged) {
          result += 1;
        }
      });
    });
    return 10 - result;
  }, [board]);

  return (
    <div className="flex items-center justify-center">
      <div className="border-b-[3px] border-l-[3px] border-r-[3px] border-t-[3px] border-white">
        <div className="bg-white p-2">
          <Header
            mineCount={mineCount}
            timeElapsed={timeElapsed}
            gameState={gameState}
            onReset={initializeGame}
          />
          <Board
            board={board}
            onCellClick={handleCellClick}
            onCellRightClick={handleCellRightClick}
          />
        </div>
      </div>
    </div>
  );
};
