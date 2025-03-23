import { Cell } from "./types";

export const generateBoard = (
  rows: number,
  cols: number,
  mines: number,
): Cell[][] => {
  // Initialize empty board
  const board: Cell[][] = Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        })),
    );

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbor mines
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!board[row][col].isMine) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (
              row + i >= 0 &&
              row + i < rows &&
              col + j >= 0 &&
              col + j < cols
            ) {
              if (board[row + i][col + j].isMine) count++;
            }
          }
        }
        board[row][col].neighborMines = count;
      }
    }
  }

  return board;
};

export const revealCell = (
  board: Cell[][],
  row: number,
  col: number,
): Cell[][] => {
  const newBoard = JSON.parse(JSON.stringify(board));

  const reveal = (r: number, c: number) => {
    if (
      r < 0 ||
      r >= newBoard.length ||
      c < 0 ||
      c >= newBoard[0].length ||
      newBoard[r][c].isRevealed ||
      newBoard[r][c].isFlagged
    ) {
      return;
    }

    newBoard[r][c].isRevealed = true;

    if (newBoard[r][c].neighborMines === 0 && !newBoard[r][c].isMine) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          reveal(r + i, c + j);
        }
      }
    }
  };

  reveal(row, col);
  return newBoard;
};

export const flagCell = (
  board: Cell[][],
  row: number,
  col: number,
): [Cell[][], boolean] => {
  const newBoard = JSON.parse(JSON.stringify(board));

  if (newBoard[row][col].isRevealed) {
    return [newBoard, false];
  }

  newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
  return [newBoard, newBoard[row][col].isFlagged];
};

export const checkWin = (board: Cell[][]): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (!board[row][col].isMine && !board[row][col].isRevealed) {
        return false;
      }
    }
  }
  return true;
};
