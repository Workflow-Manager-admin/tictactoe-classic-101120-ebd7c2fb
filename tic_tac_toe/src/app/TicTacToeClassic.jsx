import React, { useState } from "react";

/**
 * Main container for the TicTacToe Classic game.
 *
 * - 3x3 grid with two-player mode
 * - Turn indicator, win/draw/ongoing status
 * - Restart button
 * - Styled as per light theme with primary (#bcf41f), secondary (#FFFFFF), and accent (#ff00ea) colors
 */

// PUBLIC_INTERFACE
export default function TicTacToeClassic() {
  // Board is a flat array of 9 elements: '', 'X', or 'O'
  const [board, setBoard] = useState(Array(9).fill(""));
  const [xIsNext, setXIsNext] = useState(true); // true for X's turn, false for O's
  const [status, setStatus] = useState("ongoing"); // 'ongoing', 'win', 'draw'
  const [winner, setWinner] = useState(null); // 'X', 'O', or null

  // All possible win patterns (indices on the board)
  const winPatterns = [
    [0, 1, 2], // row 1
    [3, 4, 5], // row 2
    [6, 7, 8], // row 3
    [0, 3, 6], // col 1
    [1, 4, 7], // col 2
    [2, 5, 8], // col 3
    [0, 4, 8], // diag
    [2, 4, 6], // anti-diag
  ];

  // Handle click on a cell
  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    if (board[idx] !== "" || status !== "ongoing") return;

    const nextBoard = [...board];
    nextBoard[idx] = xIsNext ? "X" : "O";

    const maybeWinner = calculateWinner(nextBoard);
    let newStatus = "ongoing";
    let newWinner = null;

    if (maybeWinner) {
      newStatus = "win";
      newWinner = maybeWinner;
    } else if (nextBoard.every(cell => cell !== "")) {
      newStatus = "draw";
    }

    setBoard(nextBoard);
    setXIsNext(x => !x); // switch player after move
    setStatus(newStatus);
    setWinner(newWinner);
  }

  // Check board for a winner and return 'X', 'O', or null
  // PUBLIC_INTERFACE
  function calculateWinner(squares) {
    for (const [a, b, c] of winPatterns) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  // Reset the game
  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(""));
    setXIsNext(true);
    setStatus("ongoing");
    setWinner(null);
  }

  // UI helpers for text/status
  let turnDisplay = status === "ongoing"
    ? `Turn: ${xIsNext ? "X" : "O"}`
    : status === "win"
      ? `Winner: ${winner}`
      : "Draw!";

  // Themed colors
  const COLORS = {
    primary: "#bcf41f",    // moves highlight, X player
    secondary: "#FFFFFF",  // background, O player
    accent: "#ff00ea",     // status, win line, restart button
    border: "#C2C2C2",
    boardBg: "#fafaf7",
  };

  // Styling with inline style objects + classes for layout.
  // Use large, touch-friendly buttons.
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ background: COLORS.boardBg }}
      data-testid="ttt-classic-container"
    >
      <div
        className="py-4 px-6 rounded-lg shadow-xl"
        style={{
          background: COLORS.secondary,
          minWidth: 340,
          border: `2.5px solid ${COLORS.primary}`,
        }}
      >
        {/* Turn Indicator */}
        <div
          className="text-center text-2xl font-bold mb-4 select-none"
          style={{
            color: COLORS.accent,
            letterSpacing: 1.2,
          }}
        >
          {turnDisplay}
        </div>

        {/* Game Board */}
        <div
          className="grid grid-cols-3 grid-rows-3 gap-3 mx-auto mb-6"
          style={{ width: 300, height: 300 }}
        >
          {board.map((cell, idx) => (
            <button
              key={idx}
              className="flex items-center justify-center text-5xl font-extrabold rounded-[18px] shadow-md focus:outline-none"
              onClick={() => handleCellClick(idx)}
              disabled={cell !== "" || status !== "ongoing"}
              aria-label={`Cell ${idx} ${cell ? cell : ""}`}
              style={{
                width: 90,
                height: 90,
                background: cell === "X"
                  ? COLORS.primary
                  : cell === "O"
                    ? COLORS.secondary
                    : "#f5f5f5",
                border: `3px solid ${COLORS.primary}`,
                color: cell === "X"
                  ? "#222"
                  : cell === "O"
                    ? COLORS.accent
                    : "#999",
                transition: "background 0.15s, color 0.15s",
                cursor: cell === "" && status === "ongoing" ? "pointer" : "not-allowed"
              }}
              tabIndex={0}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Status and Restart */}
        <div className="flex flex-col items-center gap-3">
          {/* Game Status */}
          <div
            className={`font-semibold ${status === "win" ? "animate-pulse" : ""}`}
            style={{
              color:
                status === "win"
                  ? COLORS.accent
                  : status === "draw"
                  ? "#888"
                  : COLORS.primary,
              fontSize: 22,
              marginBottom: 4,
              minHeight: 28,
            }}
            aria-live="polite"
          >
            {status === "ongoing"
              ? "Game in Progress"
              : status === "win"
              ? `Player ${winner} wins!`
              : "It's a Draw!"}
          </div>

          {/* Restart Button */}
          <button
            onClick={handleRestart}
            className="rounded-lg px-6 py-3 font-bold mt-0"
            style={{
              background: COLORS.accent,
              color: "#fff",
              fontSize: 20,
              letterSpacing: 1.2,
              boxShadow: "0px 2px 8px #bcf41f35",
              border: `2.5px solid ${COLORS.primary}`,
              outline: "none",
              cursor: "pointer",
            }}
            tabIndex={0}
            aria-label="Restart Game"
          >
            Restart Game
          </button>
        </div>
      </div>
    </div>
  );
}
