"use client";

import { useState, useEffect, useRef } from "react";
import { MazeSolver } from "@/lib/maze-solver";
import RulesModal from "@/components/RulesModal";
import StartScreen from "@/components/StartScreen";
import GameBoard from "@/components/GameBoard";
import PauseScreen from "@/components/PauseScreen";
import LevelCompleteScreen from "@/components/LevelCompleteScreen";
import GameOverScreen from "@/components/GameOverScreen";

export default function MazeGame({ user }) {
  // Game states
  const [gameState, setGameState] = useState("start"); // start, playing, paused, completed, gameover
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showRules, setShowRules] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [hasKey, setHasKey] = useState(false);
  const [maze, setMaze] = useState(null);
  const [timer, setTimer] = useState(60); // Level 1 starts with 60 seconds
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [optimalPath, setOptimalPath] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0); // New state for elapsed time counter

  const timerRef = useRef(null);
  const elapsedTimerRef = useRef(null); // Separate ref for elapsed time counter
  const mazeRef = useRef(null);

  // Level configurations
  const levels = {
    1: { size: 5, time: 60, name: "Novice" },
    2: { size: 8, time: 90, name: "Explorer" },
    3: { size: 12, time: 120, name: "Master" },
  };

  // Initialize the game
  useEffect(() => {
    if (gameState === "playing") {
      initializeLevel(currentLevel);
      // Reset elapsed time when starting a new level
      setElapsedTime(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, [gameState, currentLevel]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== "playing") return;

      switch (e.key) {
        case "ArrowUp":
          movePlayer(-1, 0);
          break;
        case "ArrowDown":
          movePlayer(1, 0);
          break;
        case "ArrowLeft":
          movePlayer(0, -1);
          break;
        case "ArrowRight":
          movePlayer(0, 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, playerPosition, maze, hasKey]);

  // Timer counter (counting up only)
  useEffect(() => {
    if (gameState === "playing") {
      // Elapsed time counter (counting up)
      elapsedTimerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      // Clear timer when not playing
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    }

    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, [gameState]);

  const initializeLevel = (level) => {
    const levelConfig = levels[level];
    const mazeSolver = new MazeSolver(levelConfig.size, levelConfig.size);

    setMaze(mazeSolver.maze);
    setPlayerPosition(mazeSolver.start);
    setHasKey(false);
    setTimer(levelConfig.time);
    setMoves(0);

    // Calculate optimal path for scoring
    const pathToKey = mazeSolver.solveMaze(mazeSolver.start, mazeSolver.key);
    const pathToGoal = mazeSolver.solveMaze(mazeSolver.key, mazeSolver.goal);
    setOptimalPath([...pathToKey, ...pathToGoal]);

    mazeRef.current = mazeSolver;
  };

  const movePlayer = (dx, dy) => {
    if (!maze) return;

    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    // Check if the move is valid
    if (
      newX >= 0 &&
      newX < maze.length &&
      newY >= 0 &&
      newY < maze[0].length &&
      !maze[newX][newY].isBlocked
    ) {
      setPlayerPosition({ x: newX, y: newY });
      setMoves((prev) => prev + 1);

      // Check if player reached the key
      if (maze[newX][newY].isKey) {
        setHasKey(true);
      }

      // Check if player reached the goal with the key
      if (maze[newX][newY].isGoal && hasKey) {
        levelCompleted();
      }
    }
  };

  const levelCompleted = () => {
    clearInterval(timerRef.current);
    clearInterval(elapsedTimerRef.current); // Clear elapsed timer when level is completed

    // Calculate score based on time left and moves
    const timeBonus = timer * 5;
    const movePenalty = Math.max(0, moves - optimalPath.length) * 10;
    const levelScore = 500 + timeBonus - movePenalty;

    setScore((prev) => prev + levelScore);

    if (currentLevel < 3) {
      setGameState("completed");
    } else {
      // Game finished - add to leaderboard
      setGameState("gameover");
    }
  };

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setCurrentLevel(1);
  };

  const nextLevel = () => {
    setCurrentLevel((prev) => prev + 1);
    setGameState("playing");
  };

  const restartGame = () => {
    setGameState("start");
    setScore(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Render game screens based on state
  const renderGameScreen = () => {
    switch (gameState) {
      case "start":
        return (
          <StartScreen
            levels={levels}
            startGame={startGame}
            setShowRules={setShowRules}
          />
        );
      case "playing":
        return (
          <GameBoard
            currentLevel={currentLevel}
            levels={levels}
            timer={timer}
            elapsedTime={elapsedTime}
            formatTime={formatTime}
            setShowRules={setShowRules}
            hasKey={hasKey}
            maze={maze}
            playerPosition={playerPosition}
            movePlayer={movePlayer}
          />
        );
      case "paused":
        return (
          <PauseScreen
            score={score}
            currentLevel={currentLevel}
            levels={levels}
            timer={timer}
            elapsedTime={elapsedTime}
            formatTime={formatTime}
            setGameState={setGameState}
            restartGame={restartGame}
          />
        );
      case "completed":
        return (
          <LevelCompleteScreen
            user={user}
            currentLevel={currentLevel}
            timer={timer}
            moves={moves}
            optimalPath={optimalPath}
            elapsedTime={elapsedTime}
            formatTime={formatTime}
            score={score}
            nextLevel={nextLevel}
          />
        );
      case "gameover":
        return (
          <GameOverScreen
            user={user}
            moves={moves}
            timer={timer}
            score={score}
            currentLevel={currentLevel}
            levels={levels}
            elapsedTime={elapsedTime}
            formatTime={formatTime}
            restartGame={restartGame}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {renderGameScreen()}
        <RulesModal showRules={showRules} setShowRules={setShowRules} />
      </div>
    </div>
  );
}
