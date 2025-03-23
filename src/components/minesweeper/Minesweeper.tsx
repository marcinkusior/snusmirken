import React, { useState, useEffect, useCallback } from "react";
import { Flag, Bomb } from "lucide-react";
import { generateBoard, revealCell, flagCell, checkWin } from "./gameLogic";
import { Cell, GameState } from "./types";
import { Header } from "./Header";
import { Board } from "./Board";

export const Minesweeper = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [mineCount, setMineCount] = useState(10);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const initializeGame = useCallback(() => {
    const newBoard = generateBoard(9, 9, 10);
    setBoard(newBoard);
    setGameState("playing");
    setMineCount(10);
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
        const [newBoard, flagged] = flagCell(prevBoard, row, col);
        setMineCount((prev) => (flagged ? prev - 1 : prev + 1));
        return newBoard;
      });
    },
    [gameState],
  );

  return (
    <div className="flex items-center justify-center">
      <div className="border-b-[3px] border-l-[3px] border-r-[3px] border-t-[3px] border-[#ffffff] border-b-[#808080] border-r-[#808080]">
        <div className="bg-[#c0c0c0] p-2">
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
