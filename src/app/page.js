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

export default function MazeGame() {
  // Game states
  const [gameState, setGameState] = useState('start') // start, playing, paused, completed, gameover
  const [currentLevel, setCurrentLevel] = useState(1)
  const [showRules, setShowRules] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [hasKey, setHasKey] = useState(false)
  const [maze, setMaze] = useState(null)
  const [timer, setTimer] = useState(60) // Level 1 starts with 60 seconds
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [optimalPath, setOptimalPath] = useState([])
  const [leaderboard, setLeaderboard] = useState([
    { name: 'Alex', level: 3, score: 950 },
    { name: 'Taylor', level: 3, score: 920 },
    { name: 'Jordan', level: 2, score: 780 },
    { name: 'Casey', level: 2, score: 750 },
    { name: 'Riley', level: 1, score: 650 },
  ])

  const timerRef = useRef(null)
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
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameState, currentLevel])

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return

      switch (e.key) {
        case 'ArrowUp':
          movePlayer(0, -1)
          break
        case 'ArrowDown':
          movePlayer(0, 1)
          break
        case 'ArrowLeft':
          movePlayer(-1, 0)
          break
        case 'ArrowRight':
          movePlayer(1, 0)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, playerPosition, maze, hasKey])

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setGameState('gameover')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
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

    // Calculate score based on time left and moves
    const timeBonus = timer * 5
    const movePenalty = Math.max(0, moves - optimalPath.length) * 10
    const levelScore = 500 + timeBonus - movePenalty

    setScore((prev) => prev + levelScore)

    if (currentLevel < 3) {
      setGameState('completed')
    } else {
      // Game finished - add to leaderboard
      const newLeaderboard = [
        ...leaderboard,
        { name: 'You', level: 3, score: score + levelScore },
      ]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)

      setLeaderboard(newLeaderboard)
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
        className="grid gap-1 relative"
        style={{
          gridTemplateColumns: `repeat(${maze[0].length}, 1fr)`,
          width: '100%',
          maxWidth: `${maze[0].length * 40}px`,
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
                  relative aspect-square rounded-md transition-all duration-200
                  ${
                    cell.isBlocked
                      ? 'bg-purple-900 shadow-inner'
                      : 'bg-purple-100'
                  }
                  ${
                    cell.isStart ? 'bg-green-200 border-2 border-green-500' : ''
                  }
                  ${cell.isKey ? 'bg-yellow-200' : ''}
                  ${cell.isGoal ? 'bg-red-200' : ''}
                  ${isPlayer ? 'ring-4 ring-blue-500 ring-offset-2 z-10' : ''}
                `}
              >
                {cell.isStart && !isPlayer && (
                  <Home
                    className="absolute inset-0 m-auto text-green-600"
                    size={20}
                  />
                )}
                {cell.isKey && !hasKey && (
                  <Key
                    className="absolute inset-0 m-auto text-yellow-600"
                    size={20}
                  />
                )}
                {cell.isGoal && (
                  <Flag
                    className="absolute inset-0 m-auto text-red-600"
                    size={20}
                  />
                )}
                {isPlayer && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-blue-500 rounded-full animate-pulse"></div>
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
          <div className="flex flex-col items-center justify-center space-y-8 p-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl shadow-2xl max-w-md w-full mx-auto text-white">
            <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-500">
              Maze Adventure
            </h1>
            <div className="w-full max-w-xs">
              <div className="grid grid-cols-3 gap-2 mb-8">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className="text-center p-2 bg-purple-800 rounded-lg"
                  >
                    <div className="text-xl font-bold">{level}</div>
                    <div className="text-xs">{levels[level].name}</div>
                    <div className="text-xs mt-1">
                      {levels[level].size}×{levels[level].size}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold text-lg transform transition hover:scale-105 hover:shadow-lg flex items-center space-x-2"
            >
              <Play size={20} />
              <span>Start Game</span>
            </button>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowRules(true)}
                className="px-4 py-2 bg-indigo-700 rounded-lg flex items-center space-x-2 hover:bg-indigo-600 transition"
              >
                <Info size={16} />
                <span>Rules</span>
              </button>
              <button
                onClick={() => setShowLeaderboard(true)}
                className="px-4 py-2 bg-indigo-700 rounded-lg flex items-center space-x-2 hover:bg-indigo-600 transition"
              >
                <Trophy size={16} />
                <span>Leaderboard</span>
              </button>
            </div>
          </div>
        )

      case 'playing':
        return (
          <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            <div className="w-full flex justify-between items-center mb-4 px-4">
              <div className="flex items-center space-x-2 bg-purple-900 text-white px-3 py-1 rounded-full">
                <Star size={16} />
                <span className="font-bold">{score}</span>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold">Level {currentLevel}</h2>
                <p className="text-sm text-gray-600">
                  {levels[currentLevel].name}
                </p>
              </div>
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  timer < 10 ? 'bg-red-500 animate-pulse' : 'bg-purple-900'
                } text-white`}
              >
                <Clock size={16} />
                <span className="font-bold">{formatTime(timer)}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-100 to-purple-200 p-4 rounded-xl shadow-xl mb-6 w-full">
              <div className="flex justify-center mb-4">
                {hasKey && (
                  <div className="bg-yellow-300 text-yellow-800 px-3 py-1 rounded-full flex items-center space-x-2 animate-bounce">
                    <Key size={16} />
                    <span className="font-bold">Key Found!</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center">{renderMaze()}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full max-w-xs mb-6">
              <div></div>
              <button
                onClick={() => movePlayer(-1, 0)}
                className="bg-indigo-600 text-white p-3 rounded-lg flex justify-center hover:bg-indigo-700 active:scale-95 transition"
              >
                <ArrowUp size={24} />
              </button>
              <div></div>

              <button
                onClick={() => movePlayer(0, -1)}
                className="bg-indigo-600 text-white p-3 rounded-lg flex justify-center hover:bg-indigo-700 active:scale-95 transition"
              >
                <ArrowLeft size={24} />
              </button>

              <button
                onClick={() => movePlayer(1, 0)}
                className="bg-indigo-600 text-white p-3 rounded-lg flex justify-center hover:bg-indigo-700 active:scale-95 transition"
              >
                <ArrowDown size={24} />
              </button>

              <button
                onClick={() => movePlayer(0, 1)}
                className="bg-indigo-600 text-white p-3 rounded-lg flex justify-center hover:bg-indigo-700 active:scale-95 transition"
              >
                <ArrowRight size={24} />
              </button>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setGameState('paused')}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center space-x-2 hover:bg-gray-600 transition"
              >
                <Pause size={16} />
                <span>Pause</span>
              </button>
              <button
                onClick={() => setShowRules(true)}
                className="px-4 py-2 bg-indigo-700 text-white rounded-lg flex items-center space-x-2 hover:bg-indigo-600 transition"
              >
                <Info size={16} />
                <span>Rules</span>
              </button>
            </div>
          </div>
        )

      case 'paused':
        return (
          <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl shadow-2xl max-w-md w-full mx-auto text-white">
            <h2 className="text-3xl font-bold">Game Paused</h2>
            <p>Current Score: {score}</p>
            <p>
              Level: {currentLevel} - {levels[currentLevel].name}
            </p>
            <p>Time Remaining: {formatTime(timer)}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setGameState('playing')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center space-x-2 hover:from-green-600 hover:to-green-700 transition"
              >
                <Play size={20} />
                <span>Resume</span>
              </button>
              <button
                onClick={restartGame}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center space-x-2 hover:from-red-600 hover:to-red-700 transition"
              >
                <RotateCcw size={20} />
                <span>Restart</span>
              </button>
            </div>
          </div>
        )

      case 'completed':
        return (
          <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl shadow-2xl max-w-md w-full mx-auto text-white">
            <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-500">
              Level {currentLevel} Completed!
            </h2>
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <Star size={48} className="text-yellow-900" />
            </div>
            <div className="space-y-2 w-full">
              <div className="flex justify-between">
                <span>Time Bonus:</span>
                <span>{timer * 5} points</span>
              </div>
              <div className="flex justify-between">
                <span>Optimal Path:</span>
                <span>{optimalPath.length} moves</span>
              </div>
              <div className="flex justify-between">
                <span>Your Path:</span>
                <span>{moves} moves</span>
              </div>
              <div className="flex justify-between">
                <span>Move Penalty:</span>
                <span>
                  -{Math.max(0, moves - optimalPath.length) * 10} points
                </span>
              </div>
              <div className="border-t border-purple-700 my-2 pt-2 flex justify-between font-bold">
                <span>Level Score:</span>
                <span>
                  {500 +
                    timer * 5 -
                    Math.max(0, moves - optimalPath.length) * 10}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total Score:</span>
                <span>
                  {score +
                    500 +
                    timer * 5 -
                    Math.max(0, moves - optimalPath.length) * 10}
                </span>
              </div>
            </div>
            <button
              onClick={nextLevel}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold text-lg transform transition hover:scale-105 hover:shadow-lg flex items-center space-x-2"
            >
              <ChevronRight size={20} />
              <span>Next Level</span>
            </button>
          </div>
        )

      case 'gameover':
        return (
          <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl shadow-2xl max-w-md w-full mx-auto text-white">
            <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-500">
              {timer === 0 ? "Time's Up!" : 'Game Completed!'}
            </h2>

            {timer === 0 ? (
              <div className="w-24 h-24 bg-red-400 rounded-full flex items-center justify-center mb-4">
                <Clock size={48} className="text-red-900" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <Trophy size={48} className="text-yellow-900" />
              </div>
            )}

            <div className="text-center">
              <p className="text-xl mb-2">Final Score: {score}</p>
              <p>You reached Level {currentLevel}</p>
            </div>

            <button
              onClick={restartGame}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold text-lg transform transition hover:scale-105 hover:shadow-lg flex items-center space-x-2"
            >
              <RotateCcw size={20} />
              <span>Play Again</span>
            </button>

            <button
              onClick={() => setShowLeaderboard(true)}
              className="px-6 py-2 bg-indigo-700 rounded-lg flex items-center space-x-2 hover:bg-indigo-600 transition"
            >
              <Trophy size={16} />
              <span>View Leaderboard</span>
            </button>
          </div>
        )

      default:
        return null
    }
  }

  // Rules modal
  const renderRulesModal = () => {
    if (!showRules) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-purple-900">
            Game Rules
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Objective</h3>
              <p>
                Navigate through the maze to collect the key and reach the goal
                within the time limit.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg">Controls</h3>
              <p>
                Use arrow keys or the on-screen buttons to move your character.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg">Levels</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-bold">Level 1:</span> 5×5 maze, 1 minute
                  time limit
                </li>
                <li>
                  <span className="font-bold">Level 2:</span> 8×8 maze, 1:30
                  minutes time limit
                </li>
                <li>
                  <span className="font-bold">Level 3:</span> 12×12 maze, 2
                  minutes time limit
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg">Scoring</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Base score: 500 points per level</li>
                <li>Time bonus: 5 points for each second remaining</li>
                <li>
                  Move penalty: -10 points for each move beyond the optimal path
                </li>
              </ul>
            </div>

            <div className="bg-purple-100 p-3 rounded-lg">
              <h3 className="font-bold text-lg text-purple-900">Tips</h3>
              <ul className="list-disc pl-5 space-y-1 text-purple-900">
                <li>Always collect the key before heading to the goal</li>
                <li>Try to find the shortest path to maximize your score</li>
                <li>Watch your time - the clock is ticking!</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setShowRules(false)}
            className="mt-6 w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Got it!
          </button>
        </div>
      </div>
    )
  }

  // Leaderboard modal
  const renderLeaderboardModal = () => {
    if (!showLeaderboard) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-900 flex items-center">
            <Trophy className="mr-2 text-yellow-500" />
            Leaderboard
          </h2>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <tr
                    key={index}
                    className={entry.name === 'You' ? 'bg-yellow-50' : ''}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {entry.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {entry.level}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-purple-700">
                      {entry.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => setShowLeaderboard(false)}
            className="mt-6 w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {renderGameScreen()}
        {renderRulesModal()}
        {renderLeaderboardModal()}
      </div>
    </div>
  )
}
