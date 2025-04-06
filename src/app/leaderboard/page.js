'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard')
        const data = await response.json()
        console.log('Leaderboard data', data)
        setLeaderboard(data.leaderboard)
      } catch (err) {
        console.log(err)
      }
    }
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (timeStr) => {
    const totalSeconds = parseInt(timeStr, 10)
    if (isNaN(totalSeconds)) return '00:00:00'

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }

  return (
    <div className="min-h-screen bg-black bg-cover bg-center bg-fixed flex flex-col items-center p-4 sm:p-6 relative font-mono">
      {/* Top Right Logo */}
      <div className="absolute top-4 right-4 p-2 bg-white/40 rounded-lg">
        <Image
          src="/konnexions.png"
          alt="Konnexions Logo"
          className="h-12 sm:h-16 w-auto"
          height={100}
          width={200}
        />
      </div>

      <h1 className="text-yellow-300 text-3xl sm:text-5xl font-bold mt-18 sm:mt-10 text-center tracking-wide font-pacman">
        Kodesphere 2.0
      </h1>

      <div className="w-full max-w-5xl rounded-lg shadow-lg mt-3 md:mt-20 overflow-x-scroll">
        <table className="w-full min-w-[700px] border-collapse backdrop-blur-md">
          <thead>
            <tr className="text-white font-semibold text-lg border-b-2 border-[#2121DE]">
              <th className="p-4 text-center">Rank</th>
              <th className="p-4 text-center">UserId</th>
              <th className="p-4 text-center">Name</th>
              <th className="p-4 text-center">Level</th>
              <th className="p-4 text-center">Moves</th>
              <th className="p-4 text-center">Time Taken</th>
              <th className="p-4 text-center">Points Scored</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => {
              const rankStyles = [
                'text-yellow-300', // Rank 1 - Gold
                'text-gray-400', // Rank 2 - Silver
                'text-red-300', // Rank 3 - Bronze
              ]
              const rankStyle = rankStyles[index] || 'text-gray-300' // Default for ranks > 3

              return (
                <tr
                  key={player.user.id}
                  className={`${rankStyle} text-xl rounded-lg shadow-lg mt-2`}
                >
                  <td className="p-4 text-center font-bold">
                    <span className="">#{index + 1}</span>
                  </td>
                  <td className="p-4 text-center">{player.user.id}</td>
                  <td className="p-4 text-center">{player.user.name}</td>
                  <td className="p-4 text-center">{player.level}</td>
                  <td className="p-4 text-center">{player.moves}</td>
                  <td className="p-4 text-center">
                    {formatTime(player.totalTimeTaken)}
                  </td>
                  <td className="p-4 text-center">
                    {player.totalPointsScored}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
