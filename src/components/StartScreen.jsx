'use client'

import Link from 'next/link'
import { Info, Trophy } from 'lucide-react'

export default function StartScreen({ levels, startGame, setShowRules }) {
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
          <div key={i} className="w-2 h-2 rounded-full bg-yellow-300"></div>
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
                background: 'linear-gradient(135deg, #0000AA 0%, #0000FF 100%)',
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
            background: 'linear-gradient(135deg, #0000AA 0%, #0000DD 100%)',
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
            background: 'linear-gradient(135deg, #0000AA 0%, #0000DD 100%)',
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
          <div key={i} className="w-2 h-2 rounded-full bg-yellow-300"></div>
        ))}
      </div>
    </div>
  )
}
