'use client'

import { Clock, RotateCcw } from 'lucide-react'

export default function PauseScreen({
  score,
  currentLevel,
  levels,
  timer,
  elapsedTime,
  formatTime,
  setGameState,
  restartGame,
}) {
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
          <span className="text-yellow-300 font-bold text-xl">{score}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-blue-300">LEVEL:</span>
          <span className="text-white">
            {currentLevel} -{' '}
            <span className="text-yellow-300">{levels[currentLevel].name}</span>
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock size={14} className="text-blue-300 mr-2" />
            <span className="text-blue-300">TIME LEFT:</span>
          </div>
          <span className="text-white font-mono">{formatTime(timer)}</span>
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
          <div key={i} className="w-2 h-2 rounded-full bg-yellow-300"></div>
        ))}
      </div>
    </div>
  )
}
