'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Trophy,
  Info,
  Clock,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Star,
  Key,
  Home,
  Flag,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
} from 'lucide-react'

// Import the MazeSolver class
import { MazeSolver } from '@/lib/maze-solver'
import RulesModal from '@/components/RulesModal'
import Link from 'next/link'

export default function MazeGame() {
  // Game states
  const [gameState, setGameState] = useState('start') // start, playing, paused, completed, gameover
  const [currentLevel, setCurrentLevel] = useState(1)
  const [showRules, setShowRules] = useState(false)
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [hasKey, setHasKey] = useState(false)
  const [maze, setMaze] = useState(null)
  const [timer, setTimer] = useState(60) // Level 1 starts with 60 seconds
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [optimalPath, setOptimalPath] = useState([])
  const [elapsedTime, setElapsedTime] = useState(0) // New state for elapsed time counter

  const timerRef = useRef(null)
  const elapsedTimerRef = useRef(null) // Separate ref for elapsed time counter
  const mazeRef = useRef(null)

  // Level configurations
  const levels = {
    1: { size: 5, time: 60, name: 'Novice' },
    2: { size: 8, time: 90, name: 'Explorer' },
    3: { size: 12, time: 120, name: 'Master' },
  }

  // Initialize the game
  useEffect(() => {
    if (gameState === 'playing') {
      initializeLevel(currentLevel)
      // Reset elapsed time when starting a new level
      setElapsedTime(0)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
    }
  }, [gameState, currentLevel])

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return

      switch (e.key) {
        case 'ArrowUp':
          movePlayer(-1, 0)

          break
        case 'ArrowDown':
          movePlayer(1, 0)
          break
        case 'ArrowLeft':
          movePlayer(0, -1)

          break
        case 'ArrowRight':
          movePlayer(0, 1)

          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, playerPosition, maze, hasKey])

  // Timer counter (counting up only)
  useEffect(() => {
    if (gameState === 'playing') {
      // Elapsed time counter (counting up)
      elapsedTimerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    } else {
      // Clear timer when not playing
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
    }

    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
    }
  }, [gameState])

  const initializeLevel = (level) => {
    const levelConfig = levels[level]
    const mazeSolver = new MazeSolver(levelConfig.size, levelConfig.size)

    setMaze(mazeSolver.maze)
    setPlayerPosition(mazeSolver.start)
    setHasKey(false)
    setTimer(levelConfig.time)
    setMoves(0)

    // Calculate optimal path for scoring
    const pathToKey = mazeSolver.solveMaze(mazeSolver.start, mazeSolver.key)
    const pathToGoal = mazeSolver.solveMaze(mazeSolver.key, mazeSolver.goal)
    setOptimalPath([...pathToKey, ...pathToGoal])

    mazeRef.current = mazeSolver
  }

  const movePlayer = (dx, dy) => {
    if (!maze) return

    const newX = playerPosition.x + dx
    const newY = playerPosition.y + dy

    // Check if the move is valid
    if (
      newX >= 0 &&
      newX < maze.length &&
      newY >= 0 &&
      newY < maze[0].length &&
      !maze[newX][newY].isBlocked
    ) {
      setPlayerPosition({ x: newX, y: newY })
      setMoves((prev) => prev + 1)

      // Check if player reached the key
      if (maze[newX][newY].isKey) {
        setHasKey(true)
      }

      // Check if player reached the goal with the key
      if (maze[newX][newY].isGoal && hasKey) {
        levelCompleted()
      }
    }
  }

  const levelCompleted = () => {
    clearInterval(timerRef.current)
    clearInterval(elapsedTimerRef.current) // Clear elapsed timer when level is completed

    // Calculate score based on time left and moves
    const timeBonus = timer * 5
    const movePenalty = Math.max(0, moves - optimalPath.length) * 10
    const levelScore = 500 + timeBonus - movePenalty

    setScore((prev) => prev + levelScore)

    if (currentLevel < 3) {
      setGameState('completed')
    } else {
      // Game finished - add to leaderboard

      setGameState('gameover')
    }
  }

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setCurrentLevel(1)
  }

  const nextLevel = () => {
    setCurrentLevel((prev) => prev + 1)
    setGameState('playing')
  }

  const restartGame = () => {
    setGameState('start')
    setScore(0)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Render the maze
  const renderMaze = () => {
    if (!maze) return null

    return (
      <div
        className="grid gap-0 relative "
        style={{
          gridTemplateColumns: `repeat(${maze[0].length}, 1fr)`,
          width: '100%',
          maxWidth: `${maze[0].length * 40}px`,
          background: '#000',
          padding: '12px',
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(0, 162, 255, 0.5)',
          border: '4px solid #0066cc',
        }}
      >
        {maze.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isPlayer =
              playerPosition.x === rowIndex && playerPosition.y === colIndex

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  relative aspect-square transition-all duration-200
                  ${cell.isBlocked ? 'bg-blue-700' : 'bg-black'}
                  ${cell.isStart ? 'bg-black' : ''}
                  ${cell.isKey ? 'bg-black' : ''}
                  ${cell.isGoal ? 'bg-black' : ''}
                `}
                style={{
                  boxSizing: 'border-box',
                  boxShadow: cell.isBlocked
                    ? 'inset 0 0 0 2px #0066cc'
                    : 'none',
                  outline: cell.isBlocked ? '1px solid #0088ff' : 'none',
                  position: 'relative',
                  zIndex: cell.isBlocked ? 1 : 0,
                }}
              >
                {!cell.isBlocked &&
                  !isPlayer &&
                  !cell.isKey &&
                  !cell.isGoal &&
                  !cell.isStart && (
                    <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-blue-300 rounded-full opacity-50"></div>
                  )}

                {cell.isStart && !isPlayer && (
                  <Home
                    className="absolute inset-0 m-auto text-green-400"
                    size={18}
                  />
                )}
                {cell.isKey && !hasKey && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                    <Key
                      className="absolute inset-0 m-auto text-yellow-800"
                      size={14}
                    />
                  </div>
                )}
                {cell.isGoal && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 bg-red-400 rounded-full"></div>
                    <Flag
                      className="absolute inset-0 m-auto text-red-800"
                      size={14}
                    />
                  </div>
                )}
                {isPlayer && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            )
          }),
        )}
      </div>
    )
  }

  // Render game screens based on state
  const renderGameScreen = () => {
    switch (gameState) {
      case 'start':
        return (
          <div
            className="flex flex-col items-center justify-center space-y-8 p-8 rounded-xl shadow-2xl max-w-2xl w-full mx-auto text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #000033 0%, #000066 100%)',
              boxShadow:
                '0 0 30px rgba(255, 255, 0, 0.5), inset 0 0 20px rgba(0, 0, 255, 0.3)',
              border: '4px solid #0000AA',
            }}
          >
            {/* Pac-Man dots decoration */}
            <div className="absolute top-0 left-0 w-full h-8 flex justify-around items-center">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-300"
                ></div>
              ))}
            </div>

            <h1
              className="text-5xl font-bold text-center text-yellow-300"
              style={{
                textShadow:
                  '0 0 10px rgba(255, 255, 0, 0.7), 0 0 20px rgba(255, 255, 0, 0.5)',
                fontFamily: '"Press Start 2P", cursive, system-ui',
              }}
            >
              MAZE <span className="text-white">ADVENTURE</span>
            </h1>

            <div className="w-full max-w-sm">
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className="text-center p-3 rounded-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer relative overflow-hidden"
                    style={{
                      background:
                        'linear-gradient(135deg, #0000AA 0%, #0000FF 100%)',
                      border: '3px solid #0000DD',
                      boxShadow: 'inset 0 0 10px rgba(0, 0, 255, 0.5)',
                    }}
                  >
                    {/* Pac-Man maze pattern */}
                    <div className="absolute inset-0 opacity-10">
                      {[...Array(4)].map((_, row) => (
                        <div key={row} className="flex justify-between">
                          {[...Array(4)].map((_, col) => (
                            <div
                              key={col}
                              className="w-1 h-1 bg-yellow-300 m-1"
                            ></div>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="text-2xl font-bold mb-1">{level}</div>
                    <div className="text-xs font-bold text-yellow-300">
                      {levels[level].name}
                    </div>
                    <div className="text-xs mt-1 text-blue-200">
                      {levels[level].size}×{levels[level].size}
                    </div>

                    {/* Small Pac-Man icon next to the level */}
                    <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-300 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-10 py-4 rounded-full text-black font-bold text-xl transform transition-all duration-300 hover:scale-105 flex items-center space-x-3 animate-pulse"
              style={{
                background: 'linear-gradient(to right, #FFFF00, #FFCC00)',
                boxShadow: '0 0 15px rgba(255, 255, 0, 0.7)',
                border: '3px solid #FFAA00',
              }}
            >
              <div className="w-6 h-6 bg-black rounded-full relative">
                <div className="absolute right-0 top-1/4 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[12px] border-transparent border-r-black"></div>
              </div>
              <span>START GAME</span>
            </button>

            <div className="flex space-x-6 mt-4">
              <button
                onClick={() => setShowRules(true)}
                className="px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:bg-blue-600"
                style={{
                  background:
                    'linear-gradient(135deg, #0000AA 0%, #0000DD 100%)',
                  border: '2px solid #0000FF',
                  boxShadow: '0 0 10px rgba(0, 0, 255, 0.5)',
                }}
              >
                <Info size={18} className="text-yellow-300" />
                <span className="font-bold">RULES</span>
              </button>
              <Link
                href={'/leaderboard'}
                className="px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:bg-blue-600"
                style={{
                  background:
                    'linear-gradient(135deg, #0000AA 0%, #0000DD 100%)',
                  border: '2px solid #0000FF',
                  boxShadow: '0 0 10px rgba(0, 0, 255, 0.5)',
                }}
              >
                <Trophy size={18} className="text-yellow-300" />
                <span className="font-bold">HIGH SCORES</span>
              </Link>
            </div>

            {/* Bottom Pac-Man dots decoration */}
            <div className="absolute bottom-0 left-0 w-full h-8 flex justify-around items-center">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-300"
                ></div>
              ))}
            </div>
          </div>
        )

      case 'playing':
        return (
          <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            <div className="w-full flex justify-between items-center mb-4 px-4">
              <div className="text-center">
                <h2 className="text-xl font-bold text-blue-400">
                  Level {currentLevel}
                </h2>
                <p className="text-sm text-blue-300">
                  {levels[currentLevel].name}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                    timer < 10 ? 'bg-red-500 animate-pulse' : 'bg-blue-900'
                  } text-white border border-blue-400`}
                >
                  <Clock size={16} className="text-blue-300" />
                  <span className="font-bold">
                    Elapsed: {formatTime(elapsedTime)}
                  </span>
                </div>
                <button
                  onClick={() => setShowRules(true)}
                  className="px-3 py-1 bg-blue-800 text-white rounded-full flex items-center space-x-1 hover:bg-blue-700 transition border border-blue-500"
                >
                  <Info size={16} className="text-blue-300" />
                  <span>Rules</span>
                </button>
              </div>
            </div>

            <div
              className="bg-black p-4 rounded-xl shadow-xl w-full"
              style={{ boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)' }}
            >
              <div className="flex justify-center ">
                {hasKey && (
                  <div className="bg-black text-yellow-400 px-3 py-1 rounded-full flex items-center space-x-2 animate-pulse border border-yellow-500">
                    <Key size={16} />
                    <span className="font-bold">Key Found!</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center">{renderMaze()}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full max-w-xs mb-6 sm:hidden mt-10">
              <div></div>
              <button
                onClick={() => movePlayer(-1, 0)}
                className="bg-blue-700 text-white p-3 rounded-lg flex justify-center hover:bg-blue-600 active:scale-95 transition border-2 border-blue-500"
              >
                <ArrowUp size={24} />
              </button>
              <div></div>

              <button
                onClick={() => movePlayer(0, -1)}
                className="bg-blue-700 text-white p-3 rounded-lg flex justify-center hover:bg-blue-600 active:scale-95 transition border-2 border-blue-500"
              >
                <ArrowLeft size={24} />
              </button>

              <button
                onClick={() => movePlayer(1, 0)}
                className="bg-blue-700 text-white p-3 rounded-lg flex justify-center hover:bg-blue-600 active:scale-95 transition border-2 border-blue-500"
              >
                <ArrowDown size={24} />
              </button>

              <button
                onClick={() => movePlayer(0, 1)}
                className="bg-blue-700 text-white p-3 rounded-lg flex justify-center hover:bg-blue-600 active:scale-95 transition border-2 border-blue-500"
              >
                <ArrowRight size={24} />
              </button>
            </div>

            {/* Removed the Rules button from here */}
          </div>
        )

      case 'paused':
        return (
          <div
            className="flex flex-col items-center justify-center space-y-6 p-8 rounded-xl shadow-2xl max-w-md w-full mx-auto text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #000033 0%, #000066 100%)',
              boxShadow:
                '0 0 30px rgba(255, 255, 0, 0.5), inset 0 0 20px rgba(0, 0, 255, 0.3)',
              border: '4px solid #0000AA',
            }}
          >
            {/* Pac-Man dots decoration - top */}
            <div className="absolute top-0 left-0 w-full h-6 flex justify-around items-center">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-300"
                ></div>
              ))}
            </div>

            <h2
              className="text-4xl font-bold text-yellow-300 mb-2"
              style={{
                textShadow: '0 0 10px rgba(255, 255, 0, 0.7)',
                fontFamily: '"Press Start 2P", cursive, system-ui',
              }}
            >
              PAUSED
            </h2>

            <div className="w-full space-y-3 border-2 border-blue-500 rounded-lg p-4 bg-black bg-opacity-60">
              <div className="flex justify-between items-center border-b border-blue-800 pb-2">
                <span className="text-blue-300">SCORE:</span>
                <span className="text-yellow-300 font-bold text-xl">
                  {score}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-300">LEVEL:</span>
                <span className="text-white">
                  {currentLevel} -{' '}
                  <span className="text-yellow-300">
                    {levels[currentLevel].name}
                  </span>
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock size={14} className="text-blue-300 mr-2" />
                  <span className="text-blue-300">TIME LEFT:</span>
                </div>
                <span className="text-white font-mono">
                  {formatTime(timer)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock size={14} className="text-blue-300 mr-2" />
                  <span className="text-blue-300">ELAPSED:</span>
                </div>
                <span className="text-white font-mono">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>

            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setGameState('playing')}
                className="px-6 py-3 rounded-lg flex items-center space-x-2 transform hover:scale-105 transition-all"
                style={{
                  background: 'linear-gradient(to bottom, #FFFF00, #FFCC00)',
                  border: '3px solid #FFAA00',
                  boxShadow: '0 0 10px rgba(255, 255, 0, 0.5)',
                }}
              >
                <div className="w-5 h-5 bg-black rounded-full relative">
                  <div className="absolute left-1/2 top-1/4 w-0 h-0 border-t-[5px] border-b-[5px] border-l-[10px] border-transparent border-l-black"></div>
                </div>
                <span className="font-bold text-black">RESUME</span>
              </button>

              <button
                onClick={restartGame}
                className="px-6 py-3 rounded-lg flex items-center space-x-2 bg-blue-700 hover:bg-blue-600 transition-all border-2 border-blue-500"
                style={{
                  boxShadow: '0 0 10px rgba(0, 0, 255, 0.5)',
                }}
              >
                <RotateCcw size={20} className="text-yellow-300" />
                <span className="font-bold">RESTART</span>
              </button>
            </div>

            {/* Pac-Man dots decoration - bottom */}
            <div className="absolute bottom-0 left-0 w-full h-6 flex justify-around items-center">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-300"
                ></div>
              ))}
            </div>
          </div>
        )

      case 'completed':
        return (
          <div
            className="flex flex-col items-center justify-center space-y-6 p-8 rounded-xl shadow-2xl max-w-md w-full mx-auto text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #000033 0%, #000066 100%)',
              boxShadow:
                '0 0 30px rgba(255, 255, 0, 0.5), inset 0 0 20px rgba(0, 0, 255, 0.3)',
              border: '4px solid #0000AA',
            }}
          >
            {/* Pac-Man dots decoration - top */}
            <div className="absolute top-0 left-0 w-full h-6 flex justify-around items-center">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-300"
                ></div>
              ))}
            </div>

            <h2
              className="text-3xl font-bold text-center text-yellow-300"
              style={{
                textShadow: '0 0 10px rgba(255, 255, 0, 0.7)',
                fontFamily: '"Press Start 2P", cursive, system-ui',
              }}
            >
              LEVEL {currentLevel}
              <br />
              <span className="text-white">COMPLETE!</span>
            </h2>

            {/* Pac-Man eating animation */}
            <div className="relative mb-4">
              <div
                className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse"
                style={{ boxShadow: '0 0 20px rgba(255, 255, 0, 0.7)' }}
              >
                <div
                  className="absolute w-0 h-0 right-1 
                  border-t-[12px] border-b-[12px] border-r-[24px] 
                  border-t-transparent border-b-transparent border-r-black"
                ></div>
              </div>

              {/* Small ghosts fleeing */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400 rounded-t-full animate-bounce"></div>
              <div
                className="absolute -bottom-4 -left-4 w-8 h-8 bg-cyan-400 rounded-t-full animate-bounce"
                style={{ animationDelay: '0.3s' }}
              ></div>
            </div>

            <div
              className="w-full space-y-2 bg-black bg-opacity-60 rounded-lg p-4 border-2 border-blue-500"
              style={{ fontFamily: 'monospace' }}
            >
              <div className="text-center mb-3 text-xl font-bold text-yellow-300">
                SCORE BREAKDOWN
              </div>

              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full mr-2"></div>
                  <span className="text-blue-300">TIME BONUS:</span>
                </div>
                <span className="text-white">+ {timer * 5} PTS</span>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full mr-2"></div>
                  <span className="text-blue-300">OPTIMAL PATH:</span>
                </div>
                <span className="text-white">{optimalPath.length} MOVES</span>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full mr-2"></div>
                  <span className="text-blue-300">YOUR PATH:</span>
                </div>
                <span className="text-white">{moves} MOVES</span>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <span className="text-blue-300">MOVE PENALTY:</span>
                </div>
                <span className="text-red-400">
                  - {Math.max(0, moves - optimalPath.length) * 10} PTS
                </span>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full mr-2"></div>
                  <span className="text-blue-300">TIME ELAPSED:</span>
                </div>
                <span className="text-white">{formatTime(elapsedTime)}</span>
              </div>

              <div className="border-t-2 border-blue-700 my-3 pt-3 flex justify-between font-bold">
                <span className="text-yellow-300">LEVEL SCORE:</span>
                <span className="text-yellow-300 text-xl">
                  {500 +
                    timer * 5 -
                    Math.max(0, moves - optimalPath.length) * 10}
                </span>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span className="text-yellow-300">TOTAL SCORE:</span>
                <span
                  className="text-yellow-300 text-2xl"
                  style={{ textShadow: '0 0 5px rgba(255, 255, 0, 0.7)' }}
                >
                  {score +
                    500 +
                    timer * 5 -
                    Math.max(0, moves - optimalPath.length) * 10}
                </span>
              </div>
            </div>

            <button
              onClick={nextLevel}
              className="px-10 py-4 rounded-full text-black font-bold text-xl transform transition-all duration-300 hover:scale-105 flex items-center space-x-3 animate-pulse mt-4"
              style={{
                background: 'linear-gradient(to right, #FFFF00, #FFCC00)',
                boxShadow: '0 0 15px rgba(255, 255, 0, 0.7)',
                border: '3px solid #FFAA00',
              }}
            >
              <span>NEXT LEVEL</span>
              <ChevronRight size={24} className="text-black" />
            </button>

            {/* Pac-Man dots decoration - bottom */}
            <div className="absolute bottom-0 left-0 w-full h-6 flex justify-around items-center">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-300"
                ></div>
              ))}
            </div>
          </div>
        )

      case 'gameover':
        return (
          <div
            className="flex flex-col items-center justify-center space-y-6 p-8 rounded-xl shadow-2xl max-w-md w-full mx-auto text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #000033 0%, #000066 100%)',
              boxShadow:
                '0 0 30px rgba(255, 255, 0, 0.5), inset 0 0 20px rgba(0, 0, 255, 0.3)',
              border: '4px solid #0000AA',
            }}
          >
            {/* Pac-Man dots decoration - top */}
            <div className="absolute top-0 left-0 w-full h-6 flex justify-around items-center">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-300"
                ></div>
              ))}
            </div>

            <h2
              className="text-3xl font-bold text-center text-yellow-300"
              style={{
                textShadow: '0 0 10px rgba(255, 255, 0, 0.7)',
                fontFamily: '"Press Start 2P", cursive, system-ui',
              }}
            >
              {timer === 0 ? "TIME'S UP!" : 'GAME COMPLETE!'}
            </h2>

            {timer === 0 ? (
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-red-400 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <Clock size={48} className="text-red-900" />
                </div>

                {/* Sad ghosts */}
                <div className="absolute -top-2 -right-2 w-10 h-10">
                  <div className="w-full h-8 bg-pink-400 rounded-t-full"></div>
                  <div className="flex w-full">
                    <div className="w-1/3 h-2 bg-pink-400"></div>
                    <div className="w-1/3 h-2 bg-pink-400"></div>
                    <div className="w-1/3 h-2 bg-pink-400"></div>
                  </div>
                  <div className="absolute top-3 left-2 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute top-3 right-2 w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            ) : (
              <div className="relative mb-4">
                <div
                  className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-4 animate-pulse"
                  style={{ boxShadow: '0 0 20px rgba(255, 255, 0, 0.7)' }}
                >
                  <Trophy size={48} className="text-yellow-900" />
                  <div
                    className="absolute right-3 top-1/3 w-0 h-0 
                    border-t-[10px] border-b-[10px] border-r-[20px] 
                    border-t-transparent border-b-transparent border-r-black"
                  ></div>
                </div>

                {/* Scared ghosts */}
                <div className="absolute -top-2 -right-2 w-10 h-10 animate-bounce">
                  <div className="w-full h-8 bg-blue-400 rounded-t-full"></div>
                  <div className="flex w-full">
                    <div className="w-1/3 h-2 bg-blue-400"></div>
                    <div className="w-1/3 h-2 bg-blue-400"></div>
                    <div className="w-1/3 h-2 bg-blue-400"></div>
                  </div>
                  <div className="absolute top-4 left-2 w-1 h-1 bg-white rounded-full"></div>
                  <div className="absolute top-4 right-2 w-1 h-1 bg-white rounded-full"></div>
                </div>

                <div
                  className="absolute -bottom-2 -left-2 w-10 h-10 animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="w-full h-8 bg-blue-400 rounded-t-full"></div>
                  <div className="flex w-full">
                    <div className="w-1/3 h-2 bg-blue-400"></div>
                    <div className="w-1/3 h-2 bg-blue-400"></div>
                    <div className="w-1/3 h-2 bg-blue-400"></div>
                  </div>
                  <div className="absolute top-4 left-2 w-1 h-1 bg-white rounded-full"></div>
                  <div className="absolute top-4 right-2 w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            )}

            <div
              className="w-full space-y-2 bg-black bg-opacity-60 rounded-lg p-4 border-2 border-blue-500"
              style={{ fontFamily: 'monospace' }}
            >
              <div className="text-center mb-3 text-xl font-bold text-yellow-300">
                FINAL SCORE
              </div>

              <div className="flex justify-between items-center border-b border-blue-800 pb-2">
                <span className="text-blue-300">SCORE:</span>
                <span
                  className="text-yellow-300 font-bold text-2xl"
                  style={{ textShadow: '0 0 5px rgba(255, 255, 0, 0.7)' }}
                >
                  {score}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-300">LEVEL REACHED:</span>
                <span className="text-white">
                  {currentLevel} -{' '}
                  <span className="text-yellow-300">
                    {levels[currentLevel].name}
                  </span>
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock size={14} className="text-blue-300 mr-2" />
                  <span className="text-blue-300">TOTAL TIME:</span>
                </div>
                <span className="text-white font-mono">
                  {formatTime(elapsedTime)}
                </span>
              </div>

              {/* Pac-Man highscore decoration */}
              <div className="flex justify-center mt-3">
                {[...Array(score > 500 ? 3 : score > 300 ? 2 : 1)].map(
                  (_, i) => (
                    <div
                      key={i}
                      className="mx-1 w-5 h-5 bg-yellow-400 rounded-full"
                    ></div>
                  ),
                )}
              </div>
            </div>

            <button
              onClick={restartGame}
              className="px-10 py-4 rounded-full text-black font-bold text-xl transform transition-all duration-300 hover:scale-105 flex items-center space-x-3 animate-pulse mt-4"
              style={{
                background: 'linear-gradient(to right, #FFFF00, #FFCC00)',
                boxShadow: '0 0 15px rgba(255, 255, 0, 0.7)',
                border: '3px solid #FFAA00',
              }}
            >
              <div className="w-6 h-6 bg-black rounded-full relative">
                <div className="absolute right-0 top-1/4 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[12px] border-transparent border-r-black"></div>
              </div>
              <span>PLAY AGAIN</span>
            </button>

            <Link
              href="/leaderboard"
              className="px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:bg-blue-600"
              style={{
                background: 'linear-gradient(135deg, #0000AA 0%, #0000DD 100%)',
                border: '2px solid #0000FF',
                boxShadow: '0 0 10px rgba(0, 0, 255, 0.5)',
              }}
            >
              <Trophy size={18} className="text-yellow-300" />
              <span className="font-bold">HIGH SCORES</span>
            </Link>

            {/* Pac-Man dots decoration - bottom */}
            <div className="absolute bottom-0 left-0 w-full h-6 flex justify-around items-center">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-300"
                ></div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Rules modal

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {renderGameScreen()}
        <RulesModal showRules={showRules} setShowRules={setShowRules} />
      </div>
    </div>
  )
}
