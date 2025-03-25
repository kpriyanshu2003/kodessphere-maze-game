'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = [
        { userid: 'U101', name: 'Askshat_Singh', level: 'Expert', moves: 36, time: 126, points: 4 },
        { userid: 'U102', name: 'Saumya_Sharma', level: 'Advanced', moves: 42, time: 156, points: 4 },
        { userid: 'U103', name: 'Khushi Pandey', level: 'Intermediate', moves: 28, time: 110, points: 3 },
        { userid: 'U104', name: 'Saket_Sarkaar', level: 'Advanced', moves: 33, time: 124, points: 3 },
        { userid: 'U105', name: 'Thala_fra_Reason', level: 'Intermediate', moves: 38, time: 135, points: 3 },
        { userid: 'U106', name: 'Virat_Kohli', level: 'Beginner', moves: 46, time: 176, points: 3 },
        { userid: 'U106', name: 'Virat_Kohli', level: 'Beginner', moves: 46, time: 176, points: 3 },
        { userid: 'U106', name: 'Virat_Kohli', level: 'Beginner', moves: 46, time: 176, points: 3 },
        { userid: 'U106', name: 'Virat_Kohli', level: 'Beginner', moves: 46, time: 176, points: 3 },
        { userid: 'U106', name: 'Virat_Kohli', level: 'Beginner', moves: 46, time: 176, points: 3 }
      ];
      setLeaderboard(data);
    };
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center p-6 relative"
      style={{
        backgroundImage: "url('/background_image.jpg')",
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backgroundBlendMode: 'darken'
      }}
    >
      {/* Top Right Logo with Lighter Background */}
      <div className="absolute top-4 right-4 p-2 bg-white/40 rounded-lg">
        <img
          src="/konnexions.png"
          alt="Konnexions Logo"
          className="h-16 w-auto"
        />
      </div>

      {/* Title */}
      <h1 className="text-white text-5xl font-bold mt-10 text-center tracking-wide">
        🏆 Kodesphere v_2.0 🏅
      </h1>


      {/* Medal Display */}
      <div className="flex items-center justify-center mt-6 gap-6">
        <div className="flex flex-col items-center">
          <img src="/second.png" alt="Second Place" className="h-24 md:h-28 lg:h-32 w-auto" />
          <p className="text-yellow-400 text-xl font-bold">#2 <span className="text-white text-lg">{leaderboard[1]?.name}</span></p>
          <p className="text-gray-300 text-sm">UserId: {leaderboard[1]?.userid}</p>
          <p className="text-white text-sm">Level: {leaderboard[1]?.level}</p>
          <p className="text-white text-sm">Moves: {leaderboard[1]?.moves}</p>
          <p className="text-white text-sm">Time: {leaderboard[1]?.time}</p>
          <p className="text-white text-sm">Points scored: {leaderboard[1]?.points}</p>
        </div>
        <div className="flex flex-col items-center">
          <img src="/first.png" alt="First Place" className="h-28 md:h-36 lg:h-44 w-auto" />
          <p className="text-yellow-400 text-xl font-bold">#1 <span className="text-white text-lg">{leaderboard[0]?.name}</span></p>
          <p className="text-gray-300 text-sm">UserId: {leaderboard[0]?.userid}</p>
          <p className="text-white text-sm">Level: {leaderboard[0]?.level}</p>
          <p className="text-white text-sm">Moves: {leaderboard[0]?.moves}</p>
          <p className="text-white text-sm">Time: {leaderboard[0]?.time}</p>
          <p className="text-white text-sm">Points scored: {leaderboard[0]?.points}</p>
        </div>
        <div className="flex flex-col items-center">
          <img src="/third.png" alt="Third Place" className="h-24 md:h-28 lg:h-32 w-auto" />
          <p className="text-yellow-400 text-xl font-bold">#3 <span className="text-white text-lg">{leaderboard[2]?.name}</span></p>
          <p className="text-gray-300 text-sm">UserId: {leaderboard[2]?.userid}</p>
          <p className="text-white text-sm">Level: {leaderboard[2]?.level}</p>
          <p className="text-white text-sm">Moves: {leaderboard[2]?.moves}</p>
          <p className="text-white text-sm">Time: {leaderboard[2]?.time}</p>
          <p className="text-white text-sm">Points scored: {leaderboard[2]?.points}</p>
        </div>
      </div>
      
      {/* Column Headers */}
      <div className="w-full max-w-5xl bg-black/35 backdrop-blur-md p-4 rounded-lg shadow-lg flex justify-between text-gray-200 font-semibold text-lg mt-10">
        <div className="w-1/12 text-center">Rank</div>
        <div className="w-1/6 text-center">UserId</div>
        <div className="w-1/6 text-center">Name</div>
        <div className="w-1/6 text-center">Level</div>
        <div className="w-1/6 text-center">Moves</div>
        <div className="w-1/6 text-center">Time_Taken</div>
        <div className="w-1/6 text-center">Points_Scored</div>
      </div>

      {/* Player Cards */}
      {leaderboard.slice(3).map((player, index) => (
        <div
          key={index}
          className="w-full max-w-5xl bg-black/30 backdrop-blur-lg p-4 rounded-lg shadow-lg flex justify-between text-gray-300 mt-4 transform hover:scale-105 transition-transform"
        >
          <div className="w-1/12 text-center font-bold text-yellow-400">#{index + 4}</div>
          <div className="w-1/6 text-center text-gray-300">{player.userid}</div>
          <div className="w-1/6 text-center">{player.name}</div>
          <div className="w-1/6 text-center">{player.level}</div>
          <div className="w-1/6 text-center">{player.moves}</div>
          <div className="w-1/6 text-center">{player.time}</div>
          <div className="w-1/6 text-center">{player.points}</div>
        </div>
      ))}
    </div>
  );
}
