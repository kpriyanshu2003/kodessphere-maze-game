'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

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
  levelScore,
  totalElapsedTime, // New prop to track total time across all levels
}) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [totalScore, setTotalScore] = useState(score) // Initialize with current cumulative score

  // Function to update the leaderboard
  const updateLeaderboard = async () => {
    if (!user?.email) {
      console.error('User information is required')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          level: currentLevel,
          score: score,
          moves,
          totalTimeTaken: totalElapsedTime || elapsedTime, // Use total time if available
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update leaderboard')
      }

      setData(responseData)
      // Update the total score with the value from the server
      if (responseData.gameRecord?.totalPointsScored) {
        setTotalScore(responseData.gameRecord.totalPointsScored)
      }
    } catch (err) {
      console.error('Error updating leaderboard:', err)
      toast.error('Error updating leaderboard')
    } finally {
      setLoading(false)
    }
  }

  // Automatically update the leaderboard when the component mounts
  useEffect(() => {
    updateLeaderboard()
  }, []) // Only run once on mount

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 rounded-xl shadow-2xl max-w-md w-full mx-auto text-white relative overflow-hidden border-2 border-[#2121de]">
      <h2 className="text-3xl font-bold text-center text-yellow-300 font-pacman">
        LEVEL {currentLevel}
        <br />
        <span className="text-white">COMPLETE!</span>
      </h2>

      {/* Pac-Man eating animation */}
      <div className="relative mb-4">
        <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
          <div className="absolute w-0 h-0 right-1 border-t-[12px] border-b-[12px] border-r-[24px] border-t-transparent border-b-transparent border-r-black"></div>
        </div>
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400 rounded-t-full animate-bounce"></div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-cyan-400 rounded-t-full animate-bounce delay-300"></div>
      </div>

      <div className="w-full space-y-2 bg-black bg-opacity-60 rounded-lg p-4 font-mono">
        <div className="text-center mb-3 text-xl font-bold text-yellow-300">
          score breakdown
        </div>

        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-300 rounded-full mr-2"></div>
            <span className="text-blue-300">optimal path:</span>
          </div>
          <span className="text-white">{optimalPath.length} moves</span>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-300 rounded-full mr-2"></div>
            <span className="text-blue-300">your path:</span>
          </div>
          <span className="text-white">{moves} moves</span>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
            <span className="text-blue-300">penalty:</span>
          </div>
          <span className="text-red-400">
            - {Math.max(0, moves - optimalPath.length) * 10} pts
          </span>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-300 rounded-full mr-2"></div>
            <span className="text-blue-300">level time:</span>
          </div>
          <span className="text-white">{formatTime(elapsedTime)}</span>
        </div>

        {/* New: Total time elapsed across all levels */}
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
            <span className="text-blue-300">total time:</span>
          </div>
          <span className="text-white">
            {formatTime(totalElapsedTime || elapsedTime)}
          </span>
        </div>

        <div className="border-t-2 border-blue-700 my-3 pt-3 flex justify-between font-bold">
          <span className="text-yellow-300">level score:</span>
          <span className="text-yellow-300 text-xl">{levelScore}</span>
        </div>

        <div className="flex justify-between font-bold text-2xl text-yellow-300">
          <span>total score:</span>
          <span>
            {loading
              ? '...'
              : data?.gameRecord?.totalPointsScored || totalScore}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button
          onClick={nextLevel}
          className="whitespace-nowrap w-full cursor-pointer px-10 py-4 rounded-xl border-[#FFFF00] text-xl transform transition-all duration-300 flex items-center mt-4 text-white border-2 font-mono"
        >
          next level
        </button>
        <Link href={'/leaderboard'}>
          <button
            disabled={loading}
            onClick={updateLeaderboard}
            className="w-full cursor-pointer px-10 py-4 rounded-xl border-[#FFFF00] text-xl transform transition-all duration-300 flex items-center mt-4 text-white border-2 font-mono"
          >
            <span>{loading ? 'submitting' : 'submit'}</span>{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-pacman ml-2"
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
        </Link>
      </div>
    </div>
  )
}
