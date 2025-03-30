import { Clock, Info, Key } from "lucide-react";
import MazeRenderer from "./MazeRenderer";
import ControlPad from "./ControlPad";

export default function GameBoard({
  currentLevel,
  levels,
  timer,
  elapsedTime,
  formatTime,
  setShowRules,
  hasKey,
  maze,
  playerPosition,
  movePlayer,
}) {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-4 px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-blue-400">
            Level {currentLevel}
          </h2>
          <p className="text-sm text-blue-300">{levels[currentLevel].name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              timer < 10 ? "bg-red-500 animate-pulse" : "bg-blue-900"
            } text-white border border-blue-400`}
          >
            <Clock size={16} className="text-blue-300" />
            <span className="font-bold">
              Elapsed: {formatTime(elapsedTime)}
            </span>
          </div>
          <button
            onClick={() => setShowRules(true)}
            className="px-3 py-1 bg-blue-800 text-white rounded-full flex items-center space-x-1 hover:bg-blue-700 transition border border-blue-500"
          >
            <Info size={16} className="text-blue-300" />
            <span>Rules</span>
          </button>
        </div>
      </div>

      <div
        className="bg-black p-4 rounded-xl shadow-xl w-full"
        style={{ boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)" }}
      >
        <div className="flex justify-center ">
          {hasKey && (
            <div className="bg-black text-yellow-400 px-3 py-1 rounded-full flex items-center space-x-2 animate-pulse border border-yellow-500">
              <Key size={16} />
              <span className="font-bold">Key Found!</span>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <MazeRenderer
            maze={maze}
            playerPosition={playerPosition}
            hasKey={hasKey}
          />
        </div>
      </div>

      <ControlPad movePlayer={movePlayer} />
    </div>
  );
}
