import { Home, Key, Flag } from "lucide-react";

export default function MazeRenderer({
  maze,
  playerPosition,
  hasKey,
  visibilityRange = 2,
}) {
  if (!maze) return null;

  const minRowVisible = Math.max(0, playerPosition.x - visibilityRange);
  const maxRowVisible = Math.min(
    maze.length - 1,
    playerPosition.x + visibilityRange
  );
  const minColVisible = Math.max(0, playerPosition.y - visibilityRange);
  const maxColVisible = Math.min(
    maze[0].length - 1,
    playerPosition.y + visibilityRange
  );

  return (
    <div
      className="grid gap-0 w-full border-2 rounded-lg border-[#2121De] overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${maze[0].length}, 1fr)`,
        maxWidth: `${maze[0].length * 40}px`,
      }}
    >
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isPlayer =
            playerPosition.x === rowIndex && playerPosition.y === colIndex;
          const isVisible =
            rowIndex >= minRowVisible &&
            rowIndex <= maxRowVisible &&
            colIndex >= minColVisible &&
            colIndex <= maxColVisible;

          // Only show cells that are visible or are the player
          if (!isVisible && !isPlayer)
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="bg-black aspect-square"
              />
            );

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                relative aspect-square transition-all duration-200
                ${cell.isBlocked ? "bg-blue-700" : "bg-black"}
                ${cell.isStart ? "bg-black" : ""}
                ${cell.isKey ? "bg-black" : ""}
                ${cell.isGoal ? "bg-black" : ""}
              `}
              style={{
                boxSizing: "border-box",
                boxShadow: cell.isBlocked ? "inset 0 0 0 2px #0066cc" : "none",
                outline: cell.isBlocked ? "1px solid #0088ff" : "none",
                position: "relative",
                zIndex: cell.isBlocked ? 1 : 0,
              }}
            >
              {!cell.isBlocked &&
                !isPlayer &&
                !cell.isKey &&
                !cell.isGoal &&
                !cell.isStart && (
                  <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-blue-300 rounded-full opacity-50"></div>
                )}
              {cell.isStart && !isPlayer && (
                <Home
                  className="absolute inset-0 m-auto text-green-400"
                  size={18}
                />
              )}
              {cell.isKey && !hasKey && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Key
                    className="absolute inset-0 m-auto text-yellow-400"
                    size={14}
                  />
                </div>
              )}
              {cell.isGoal && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 bg-red-400 rounded-full"></div>
                  <Flag
                    className="absolute inset-0 m-auto text-red-800"
                    size={14}
                  />
                </div>
              )}
              {isPlayer && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-pacman translate-x-2 translate-y-2"
                  width="24"
                  height="24"
                  viewBox="-5 0 24 24"
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
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
