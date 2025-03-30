"use client";

import Link from "next/link";
import { Info, Trophy } from "lucide-react";

export default function StartScreen({
  levels,
  startGame,
  setShowRules,
  isSelected,
  setIsSelected,
}) {
  return (
    <div className="w-6/12 h-7/12">
      <div
        className="border-2 border-[#2121DE] grid place-items-center w-full h-full p-6 rounded-xl text-white"
        // style={
        // {
        // background: "linear-gradient(180deg, #000033 0%, #000066 100%)",
        // boxShadow:
        // "0 0 30px rgba(255, 255, 0, 0.5), inset 0 0 20px rgba(0, 0, 255, 0.3)",
        // border: "4px solid #0000AA",
        // }
        // }
      >
        {/* Pac-Man dots decoration */}
        {/* <div className="absolute top-0 left-0 w-full h-8 flex justify-around items-center">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-yellow-300"></div>
          ))}
        </div> */}
        <h1
          className="text-5xl font-bold text-center text-yellow-300 font-pacman"
          // style={{
          //   textShadow:
          //     "0 0 10px rgba(255, 255, 0, 0.7), 0 0 20px rgba(255, 255, 0, 0.5)",
          // }}
        >
          MAZE <span className="text-white">ADVENTURE</span>
        </h1>
        <div className="grid grid-cols-3 w-8/12 gap-4 mt-12">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={`transition-all duration-300 flex items-center justify-center gap-4 border-2 rounded-lg py-3 border-[#2121DE] text-[#FFFF00] font-mono font-bold cursor-pointer ${
                isSelected === level &&
                "outline-offset-4 outline-red-500 outline-2"
              }`}
              // className="text-center p-3 rounded-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer relative overflow-hidden"
              // style={{
              //   background: "linear-gradient(135deg, #0000AA 0%, #0000FF 100%)",
              //   border: "3px solid #0000DD",
              //   boxShadow: "inset 0 0 10px rgba(0, 0, 255, 0.5)",
              // }}
              onClick={() => setIsSelected(level)}
            >
              <div className="text-2xl font-bold mb-1">{level}</div>
              <div>
                <div className="text-xs font-bold text-yellow-300">
                  {levels[level].name}
                </div>
                <div className="text-xs mt-1 text-blue-200">
                  {levels[level].size}×{levels[level].size}
                </div>
              </div>
              {/* Small Pac-Man icon next to the level */}
              {/* <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-300 rounded-full"></div> */}
            </div>
          ))}
        </div>
        <button
          className="border-2 rounded-lg font-mono px-6 py-4 flex gap-2 text-[#FFFF00] cursor-pointer w-8/12 justify-center"
          onClick={startGame}
          style={{ boxShadow: "0 0 15px rgba(255, 255, 0, 0.5)" }}
        >
          start game{" "}
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
        <div className="flex justify-between items-center gap-8 w-8/12 to-white font-mono font-bold">
          <button
            onClick={() => setShowRules(true)}
            className="border-2 border-[#2121DE] rounded-lg flex items-center gap-2 justify-center py-3 w-full cursor-pointer"
            // className="w-full px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:bg-blue-600"
            style={{
              // background: "linear-gradient(135deg, #0000AA 0%, #0000DD 100%)",
              // border: "2px solid #0000FF",
              boxShadow: "0 0 10px rgba(0, 0, 255, 0.5)",
            }}
          >
            <Info size={18} />
            <span>rules</span>
          </button>
          <Link
            href="/leaderboard"
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-[#2121de] rounded-lg "
            // className="px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:bg-blue-600"
            // style={{
            // background: "linear-gradient(135deg, #0000AA 0%, #0000DD 100%)",
            // border: "2px solid #0000FF",
            // boxShadow: "0 0 10px rgba(0, 0, 255, 0.5)",
            // }}
          >
            <Trophy size={18} />
            <span>leaderboard</span>
          </Link>
        </div>
        {/* Bottom Pac-Man dots decoration */}
        {/* <div className="absolute bottom-0 left-0 w-full h-8 flex justify-around items-center">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-yellow-300"></div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
