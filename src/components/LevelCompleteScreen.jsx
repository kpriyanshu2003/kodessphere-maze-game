'use client'

import { ChevronRight } from 'lucide-react'
import { useEffect } from 'react'

export default function LevelCompleteScreen({
  user,
  currentLevel,
  timer,
  moves,
  optimalPath,
  elapsedTime,
  formatTime,
  score,
  nextLevel,
}) {
  const updateLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          level: currentLevel,
          score,
          moves,
          totalTimeTaken: `${timer ?? ''}`,
          totalPointsScored: score,
        }),
      })
      const data = await response.json()
      console.log('data', data)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    updateLeaderboard()
  }, [user, currentLevel, score, moves, timer])
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
          <div key={i} className="w-2 h-2 rounded-full bg-yellow-300"></div>
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
            {500 + timer * 5 - Math.max(0, moves - optimalPath.length) * 10}
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
          <div key={i} className="w-2 h-2 rounded-full bg-yellow-300"></div>
        ))}
      </div>
    </div>
  )
}
