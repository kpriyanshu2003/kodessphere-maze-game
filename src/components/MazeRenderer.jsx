import { Home, Key, Flag } from 'lucide-react'

export default function MazeRenderer({ maze, playerPosition, hasKey }) {
  if (!maze) return null

  return (
    <div
      className="grid gap-0 relative "
      style={{
        gridTemplateColumns: `repeat(${maze[0].length}, 1fr)`,
        width: '100%',
        maxWidth: `${maze[0].length * 40}px`,
        background: '#000',
        padding: '12px',
        borderRadius: '12px',
        boxShadow: '0 0 20px rgba(0, 162, 255, 0.5)',
        border: '4px solid #0066cc',
      }}
    >
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isPlayer =
            playerPosition.x === rowIndex && playerPosition.y === colIndex

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                relative aspect-square transition-all duration-200
                ${cell.isBlocked ? 'bg-blue-700' : 'bg-black'}
                ${cell.isStart ? 'bg-black' : ''}
                ${cell.isKey ? 'bg-black' : ''}
                ${cell.isGoal ? 'bg-black' : ''}
              `}
              style={{
                boxSizing: 'border-box',
                boxShadow: cell.isBlocked ? 'inset 0 0 0 2px #0066cc' : 'none',
                outline: cell.isBlocked ? '1px solid #0088ff' : 'none',
                position: 'relative',
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
                  <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                  <Key
                    className="absolute inset-0 m-auto text-yellow-800"
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          )
        }),
      )}
    </div>
  )
}
