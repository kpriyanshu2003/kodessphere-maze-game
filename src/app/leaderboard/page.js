"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        const data = await response.json();
        console.log("Leaderboard data", data);
        setLeaderboard(data.leaderboard);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center p-4 sm:p-6 relative"
      style={{
        backgroundImage: "url('/background_image.jpg')",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backgroundBlendMode: "darken",
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

      <h1 className="text-white text-3xl sm:text-5xl font-bold mt-6 sm:mt-10 text-center tracking-wide">
        Kodesphere 2.0
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
            <span className="text-yellow-400">#2</span>{" "}
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
            <span className="text-yellow-400">#1</span>{" "}
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
            <span className="text-yellow-400">#3</span>{" "}
            <span className="text-white">{leaderboard[2]?.name}</span>
          </p>
        </div>
      </div>

      {/* Leaderboard (No Border, No Vertical Scrollbar) */}
      {/* Leaderboard Table */}
      <div className="w-full max-w-5xl rounded-lg shadow-lg mt-10">
        <div className="w-full overflow-x-auto">
          {/* Column Headers */}
          <div className="min-w-[700px] bg-black/50 backdrop-blur-md rounded-lg p-4 flex text-gray-200 font-semibold text-lg">
            {[
              "Rank",
              "UserId",
              "Name",
              "Level",
              "Moves",
              "Time Taken",
              "Points Scored",
            ].map((header, index) => (
              <div key={index} className="w-1/6 text-center">
                {header}
              </div>
            ))}
          </div>

          {/* Player Rows */}
          <div className="w-full">
            {leaderboard.map((player, index) => {
              const rankStyles = [
                "bg-yellow-500/80", // Rank 1 - Gold
                "bg-gray-400/80", // Rank 2 - Silver
                "bg-red-900/80", // Rank 3 - Bronze
              ];
              const bgColor = rankStyles[index] || "bg-black/30"; // Default for ranks > 3

              return (
                <div
                  key={player.user.id}
                  className={`min-w-[700px] ${bgColor} backdrop-blur-lg p-4 rounded-lg shadow-lg flex justify-between text-gray-300 mt-2`}
                >
                  <div className="w-1/12 text-center font-bold text-lg">
                    <span className="text-yellow-400">#{index + 1}</span>
                  </div>
                  {[
                    player.user.id,
                    player.user.name,
                    player.level,
                    player.moves,
                    player.totalTimeTaken || "00:00:00",
                    player.totalPointsScored,
                  ].map((value, idx) => (
                    <div
                      key={idx}
                      className="w-1/6 text-center text-sm sm:text-base"
                    >
                      {value}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
