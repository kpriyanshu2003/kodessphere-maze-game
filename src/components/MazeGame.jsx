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
  const [gameState, setGameState] = useState("start"); // start, playing, paused, completed, gameover
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isSelected, setIsSelected] = useState(1);
  const [showRules, setShowRules] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [hasKey, setHasKey] = useState(false);
  const [maze, setMaze] = useState(null);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [optimalPath, setOptimalPath] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [levelScore, setLevelScore] = useState(0);

  const timerRef = useRef(null);
  const elapsedTimerRef = useRef(null);
  const mazeRef = useRef(null);

  const levels = {
    1: { size: 8, name: "Novice", time: 20 },
    2: { size: 10, name: "Explorer", time: 30 },
    3: { size: 15, name: "Master", time: 60 },
    4: { size: 25, name: "Impossible", time: 120 },
  };

  // Clear all timers when component unmounts or gameState changes
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(elapsedTimerRef.current);
    };
  }, []);

  // Initialize level when playing state is entered
  useEffect(() => {
    // Clear any existing timers when game state changes
    clearInterval(timerRef.current);
    clearInterval(elapsedTimerRef.current);

    if (gameState === "playing") {
      initializeLevel(currentLevel);
      setElapsedTime(0); // Reset level time

      // Start both timers only when in playing state
      startTimers();
    }
  }, [gameState, currentLevel]);

  // Start both countdown and elapsed timers
  const startTimers = () => {
    // Start the countdown timer
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(elapsedTimerRef.current);
          setGameState("gameover");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start the elapsed time counter
    elapsedTimerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
      setTotalElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  // Keyboard controls
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

  const initializeLevel = (level) => {
    const levelConfig = levels[level];
    const mazeSolver = new MazeSolver(levelConfig.size, levelConfig.size);

    setMaze(mazeSolver.maze);
    setPlayerPosition(mazeSolver.start);
    setHasKey(false);
    setTimer(levelConfig.time);
    setMoves(0);

    const pathToKey = mazeSolver.solveMaze(mazeSolver.start, mazeSolver.key);
    const pathToGoal = mazeSolver.solveMaze(mazeSolver.key, mazeSolver.goal);
    setOptimalPath([...pathToKey, ...pathToGoal]);

    mazeRef.current = mazeSolver;
  };

  const movePlayer = (dx, dy) => {
    if (!maze) return;

    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (
      newX >= 0 &&
      newX < maze.length &&
      newY >= 0 &&
      newY < maze[0].length &&
      !maze[newX][newY].isBlocked
    ) {
      setPlayerPosition({ x: newX, y: newY });
      setMoves((prev) => prev + 1);

      if (maze[newX][newY].isKey) {
        setHasKey(true);
      }

      if (maze[newX][newY].isGoal && hasKey) {
        levelCompleted();
      }
    }
  };

  const levelCompleted = () => {
    // Stop all timers immediately when level is completed
    clearInterval(timerRef.current);
    clearInterval(elapsedTimerRef.current);

    const timeBonus = (timer % 10) * 5;
    const movePenalty = Math.max(0, moves - optimalPath.length) * 10;
    const levelScore = 500 + timeBonus - movePenalty;

    setLevelScore(levelScore);
    setScore((prev) => prev + levelScore);

    if (currentLevel < 4) {
      setGameState("completed");
    } else {
      setGameState("gameover");
    }
  };

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setCurrentLevel(isSelected);
    setTotalElapsedTime(0); // Reset total time when starting a new game
  };

  const nextLevel = () => {
    setCurrentLevel((prev) => prev + 1);
    setGameState("playing");
  };

  const restartGame = () => {
    setGameState("start");
    setScore(0);
    setCurrentLevel(1);
    setTimer(levels[1].time);
    setTotalElapsedTime(0); // Reset total time when restarting
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const renderGameScreen = () => {
    switch (gameState) {
      case "start":
        return (
          <StartScreen
            isSelected={isSelected}
            setIsSelected={setIsSelected}
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
        return isSelected < 4 ? (
          <LevelCompleteScreen
            user={user}
            currentLevel={currentLevel}
            moves={moves}
            optimalPath={optimalPath}
            elapsedTime={elapsedTime}
            totalElapsedTime={totalElapsedTime}
            formatTime={formatTime}
            score={score}
            nextLevel={nextLevel}
            levelScore={levelScore}
          />
        ) : (
          <GameOverScreen
            user={user}
            moves={moves}
            timer={timer}
            score={score}
            currentLevel={isSelected}
            levels={levels}
            elapsedTime={elapsedTime}
            totalElapsedTime={totalElapsedTime}
            formatTime={formatTime}
            restartGame={restartGame}
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
            totalElapsedTime={totalElapsedTime}
            formatTime={formatTime}
            restartGame={restartGame}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen min-w-screen grid place-items-center bg-[#040404] p-4">
      {renderGameScreen()}
      <RulesModal showRules={showRules} setShowRules={setShowRules} />
    </div>
  );
}
