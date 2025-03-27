'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([])
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard')
        const data = await response.json()
        console.log('response', data)
        setLeaderboard(data.leaderboard)
      } catch (err) {
        console.log(err)
      }
    }
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 500000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center p-4 sm:p-6 relative"
      style={{
        backgroundImage: "url('/background_image.jpg')",
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backgroundBlendMode: 'darken',
      }}
    >
      {/* Top Right Logo */}
      <div className="absolute top-4 right-4 p-2 bg-white/40 rounded-lg">
        <img
          src="/konnexions.png"
          alt="Konnexions Logo"
          className="h-12 sm:h-16 w-auto"
        />
      </div>

      {/* Title */}
      <h1 className="text-white text-3xl sm:text-5xl font-bold mt-6 sm:mt-10 text-center tracking-wide">
        🏆 Kodesphere v_2.0 🏅
      </h1>

      {/* Medal Display */}
      <div className="flex flex-wrap items-center justify-center mt-6 gap-4 sm:gap-6">
        <div className="flex flex-col items-center">
          <img
            src="/second.webp"
            alt="Second Place"
            className="h-20 sm:h-28 w-auto"
          />
          <p className="text-lg sm:text-xl font-bold">
            <span className="text-yellow-400">#2</span>{' '}
            <span className="text-white">{leaderboard[1]?.name}</span>
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src="/first.webp"
            alt="First Place"
            className="h-24 sm:h-36 w-auto"
          />
          <p className="text-lg sm:text-xl font-bold">
            <span className="text-yellow-400">#1</span>{' '}
            <span className="text-white">{leaderboard[0]?.name}</span>
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src="/third.webp"
            alt="Third Place"
            className="h-20 sm:h-28 w-auto"
          />
          <p className="text-lg sm:text-xl font-bold">
            <span className="text-yellow-400">#3</span>{' '}
            <span className="text-white">{leaderboard[2]?.name}</span>
          </p>
        </div>
      </div>

      {/* Leaderboard (No Border, No Vertical Scrollbar) */}
      <div className="w-full max-w-5xl rounded-lg shadow-lg mt-10">
        {/* Scrollable Wrapper for Headings + Player Rows */}
        <div className="w-full overflow-x-auto">
          {/* Column Headers */}
          <div className="min-w-[700px] bg-black/50 backdrop-blur-md p-4 flex text-gray-200 font-semibold text-lg">
            <div className="w-1/12 text-center">Rank</div>
            <div className="w-1/6 text-center">UserId</div>
            <div className="w-1/6 text-center">Name</div>
            <div className="w-1/6 text-center">Level</div>
            <div className="w-1/6 text-center">Moves</div>
            <div className="w-1/6 text-center">Time_Taken</div>
            <div className="w-1/6 text-center">Points_Scored</div>
          </div>

          {/* Player Rows (Hover Effect Removed) */}
          <div className="w-full">
            {leaderboard.map((player, index) => {
              // Set custom styles for top 3 players
              let bgColor = 'bg-black/30' // Default background
              let textColor = 'text-gray-300' // Default text color

              if (index === 0) {
                bgColor = 'bg-yellow-500/80' // Golden background (Rank 1)
              } else if (index === 1) {
                bgColor = 'bg-gray-400/80' // Silver background (Rank 2)
              } else if (index === 2) {
                bgColor = 'bg-red-900/80' // Dark Red background (Rank 3)
              }

              return (
                <div
                  key={index}
                  className={`min-w-[700px] ${bgColor} backdrop-blur-lg p-4 rounded-lg shadow-lg flex justify-between ${textColor} mt-2`}
                >
                  <div className="w-1/12 text-center font-bold text-lg">
                    <span className="text-yellow-400">#{index + 1}</span>
                  </div>
                  <div className="w-1/6 text-center text-sm sm:text-base">
                    {player.user.id}
                  </div>
                  <div className="w-1/6 text-center text-sm sm:text-base">
                    {player.user.name}
                  </div>
                  <div className="w-1/6 text-center text-sm sm:text-base">
                    {player.level}
                  </div>
                  <div className="w-1/6 text-center text-sm sm:text-base">
                    {player.moves}
                  </div>
                  <div className="w-1/6 text-center text-sm sm:text-base">
                    {player.totalTimeTaken === ''
                      ? '00:00:00'
                      : player.totalTimeTaken}
                  </div>
                  <div className="w-1/6 text-center text-sm sm:text-base">
                    {player.totalPointsScored}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
