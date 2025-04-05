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
    <div className="text-white w-1/2 h-1/2">
      <div className="flex justify-between w-full mb-4">
        <h2 className="text-xl font-bold font-pacman">
          Level {currentLevel} : {levels[currentLevel].name}
        </h2>

        <div className="flex items-center">
          <div className="flex items-center gap-2 px-3 py-1">
            <Clock size={16} />
            <span className="font-bold">{formatTime(elapsedTime)}</span>
          </div>
          <div className="h-full border-l border-white"></div>
          <button
            onClick={() => setShowRules(true)}
            className="flex items-center gap-2 px-3 py-1 cursor-pointer"
          >
            <Info size={16} />
            <span>rules</span>
          </button>{" "}
          {hasKey && (
            <>
              <div className="h-full border-l border-white"></div>
              <div className="bg-black text-yellow-400 px-3 py-1 flex items-center">
                <Key size={16} />
                &nbsp; key found
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full h-full grid place-items-center">
        <MazeRenderer
          maze={maze}
          playerPosition={playerPosition}
          hasKey={hasKey}
        />
      </div>

      <ControlPad movePlayer={movePlayer} />
    </div>
  );
}
