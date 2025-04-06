'use client'

import Link from 'next/link'
import { Info, Trophy } from 'lucide-react'

export default function StartScreen({
  levels,
  startGame,
  setShowRules,
  isSelected,
  setIsSelected,
}) {
  return (
    <div className="w-full px-4 md:px-0 flex justify-center items-center">
      <div className="w-full max-w-3xl border-2 border-[#2121DE] grid place-items-center rounded-xl text-white py-8 px-4 sm:px-6 md:px-12">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-yellow-300 font-pacman mb-6">
          MAZE <span className="text-white">ADVENTURE</span>
        </h1>

        {/* Level Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-md mt-6">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              onClick={() => setIsSelected(level)}
              className={`transition-all duration-300 flex items-center justify-between sm:justify-center gap-4 border-2 rounded-lg px-4 py-3 border-[#2121DE] text-[#FFFF00] font-mono font-bold cursor-pointer ${
                isSelected === level &&
                'outline-offset-4 outline outline-red-500 outline-2'
              }`}
            >
              <div className="text-2xl font-bold">{level}</div>
              <div className="text-left sm:text-center">
                <div className="text-xs font-bold text-yellow-300">
                  {levels[level].name}
                </div>
                <div className="text-xs mt-1 text-blue-200">
                  {levels[level].size}×{levels[level].size}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Start Game Button */}
        <button
          onClick={startGame}
          className="mt-8 w-full max-w-sm border-2 border-yellow-400 rounded-lg font-mono px-6 py-4 flex justify-center items-center gap-2 text-[#FFFF00] shadow-lg hover:shadow-yellow-500 transition"
        >
          Start Game{' '}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-pacman"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#ff0"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5.636 5.636a9 9 0 0 1 13.397 .747l-5.619 5.617l5.619 5.617a9 9 0 1 1 -13.397 -11.981z" />
            <circle cx="11.5" cy="7.5" r="1" fill="currentColor" />
          </svg>
        </button>

        {/* Rules & Leaderboard Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 w-full max-w-sm mt-6 font-mono font-bold">
          <button
            onClick={() => setShowRules(true)}
            className="border-2 border-[#2121DE] rounded-lg flex items-center justify-center gap-2 py-3 w-full shadow-md hover:shadow-blue-500 transition"
          >
            <Info size={18} />
            <span>Rules</span>
          </button>

          <Link
            href="/leaderboard"
            className="border-2 border-[#2121DE] rounded-lg flex items-center justify-center gap-2 py-3 w-full shadow-md hover:shadow-blue-500 transition"
          >
            <Trophy size={18} />
            <span>Leaderboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
