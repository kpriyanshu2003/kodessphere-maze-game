'use client'

import { Clock, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function GameOverScreen({
  user,
  timer,
  score,
  currentLevel,
  levels,
  elapsedTime,
  formatTime,
  restartGame,
  moves,
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
            <span className="text-yellow-300">{levels[currentLevel].name}</span>
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
          {[...Array(score > 500 ? 3 : score > 300 ? 2 : 1)].map((_, i) => (
            <div
              key={i}
              className="mx-1 w-5 h-5 bg-yellow-400 rounded-full"
            ></div>
          ))}
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
          <div key={i} className="w-2 h-2 rounded-full bg-yellow-300"></div>
        ))}
      </div>
    </div>
  )
}
