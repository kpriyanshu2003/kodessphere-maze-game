import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'

const RulesModal = ({ showRules, setShowRules }) => {
  if (!showRules) return null

  return (
    <div className="fixed inset-0 bg-opacity-70 flex items-center justify-center z-50 p-4 bg-black font-mono">
      <div
        className="rounded-xl shadow-2xl md:w-4/6 p-6 max-h-[80vh] overflow-y-auto relative text-white border-2 border-[#2121DE]"
        style={
          {
            // background: "linear-gradient(180deg, #000033 0%, #000066 100%)",
            // boxShadow:
            //   "0 0 30px rgba(255, 255, 0, 0.5), inset 0 0 20px rgba(0, 0, 255, 0.3)",
            // border: "4px solid #0000AA",
          }
        }
      >
        {/* Close button - new addition */}
        <button
          onClick={() => setShowRules(false)}
          className="absolute top-5 cursor-pointer right-3 w-8 h-8 flex items-center justify-center rounded-full z-10 transition-all duration-200 transform border-2 border-yellow-300"
          style={
            {
              // background: "linear-gradient(to bottom, #FFFF00, #FFCC00)",
              // border: "2px solid #FFAA00",
              // boxShadow: "0 0 10px rgba(255, 255, 0, 0.5)",
            }
          }
        >
          <div className="relative w-4 h-4">
            <div className="absolute w-full h-0.5 bg-yellow-300 top-1/2 left-0 -translate-y-1/2 rotate-45"></div>
            <div className="absolute w-full h-0.5 bg-yellow-300 top-1/2 left-0 -translate-y-1/2 -rotate-45"></div>
          </div>
        </button>

        {/* Pac-Man dots decoration - top */}
        {/* <div className="absolute top-0 left-0 w-full h-6 flex justify-around items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-yellow-300"></div>
          ))}
        </div> */}

        <h2
          className="text-3xl font-bold mb-6 text-yellow-300 text-center font-pacman"
          // style={{ textShadow: "0 0 10px rgba(255, 255, 0, 0.7)" }}
        >
          Game Rules
        </h2>

        <div className="space-y-6 p-4">
          {/* Pacman icon */}
          {/* <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full relative">
              <div
                className="absolute right-2 top-1/3 w-0 h-0 
                  border-t-[8px] border-b-[8px] border-r-[16px] 
                  border-t-transparent border-b-transparent border-r-black"
              ></div>
            </div>
          </div> */}

          <div className="border-b-2 border-blue-700 pb-3">
            <h3 className="font-bold text-lg text-yellow-300 flex items-center">
              <div className="w-4 h-4 bg-yellow-300 rounded-full mr-2"></div>
              Objective
            </h3>
            <p className="text-blue-100 ml-6 text-sm">
              Navigate through the maze to collect the key and reach the goal
              within the time limit.
            </p>
          </div>

          <div className="border-b-2 border-blue-700 pb-3">
            <h3 className="font-bold text-lg text-yellow-300 flex items-center">
              <div className="w-4 h-4 bg-yellow-300 rounded-full mr-2"></div>
              Controls
            </h3>
            <p className="text-blue-100 ml-6">
              Use arrow keys or the on-screen buttons to move your character.
            </p>
            <div className="flex justify-center space-x-2 mt-2">
              <div className="w-8 h-8 bg-blue-700 flex items-center justify-center rounded border-2 border-blue-500">
                <ArrowUp size={20} className="text-white" />
              </div>
              <div className="w-8 h-8 bg-blue-700 flex items-center justify-center rounded border-2 border-blue-500">
                <ArrowLeft size={20} className="text-white" />
              </div>
              <div className="w-8 h-8 bg-blue-700 flex items-center justify-center rounded border-2 border-blue-500">
                <ArrowDown size={20} className="text-white" />
              </div>
              <div className="w-8 h-8 bg-blue-700 flex items-center justify-center rounded border-2 border-blue-500">
                <ArrowRight size={20} className="text-white" />
              </div>
            </div>
          </div>

          {/* FIXME Add Valid Levels */}
          <div className="border-b-2 border-blue-700 pb-3">
            <h3 className="font-bold text-lg text-yellow-300 flex items-center mb-2">
              <div className="w-4 h-4 bg-yellow-300 rounded-full mr-2"></div>
              Levels
            </h3>
            <ul className="ml-6 space-y-2 text-blue-100">
              <li className="flex items-start gap-2">
                <div className="w-3 h-3 bg-pink-400 rounded-t-full mt-1"></div>
                <div className="flex">
                  <span className="font-bold text-yellow-200 w-[70px]">
                    Level 1:
                  </span>
                  <span className="ml-2">10x10 maze, 1 minute</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-t-full mt-1"></div>
                <div className="flex">
                  <span className="font-bold text-yellow-200 w-[70px]">
                    Level 2:
                  </span>
                  <span className="ml-2">15x15 maze, 1:30 minutes</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-t-full mt-1"></div>
                <div className="flex">
                  <span className="font-bold text-yellow-200 w-[70px]">
                    Level 3:
                  </span>
                  <span className="ml-2">20x20 maze, 2 minutes</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="border-b-2 border-blue-700 pb-3">
            <h3 className="font-bold text-lg text-yellow-300 flex items-center">
              <div className="w-4 h-4 bg-yellow-300 rounded-full mr-2"></div>
              Scoring
            </h3>
            <ul className="ml-6 space-y-1 text-blue-100">
              <li className="flex items-center">
                <div className="w-3 h-3 bg-yellow-300 rounded-full mr-2"></div>
                <span>Base score: 500 points per level</span>
              </li>

              <li className="flex items-center">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                <span>Move penalty: -10 points per extra move</span>
              </li>
            </ul>
          </div>

          {/* <div className=" p-3 rounded-lg border border-blue-700"> */}
          <h3 className="font-bold text-lg text-yellow-300 flex items-center">
            <div className="w-6 h-6 bg-yellow-400 rounded-full mr-2 relative">
              <div
                className="absolute right-1 top-1/3 w-0 h-0 
                    border-t-[4px] border-b-[4px] border-r-[8px] 
                    border-t-transparent border-b-transparent border-r-black"
              ></div>
            </div>
            How To Play ?
          </h3>
          <ul className="ml-6 space-y-1 text-blue-100">
            <li className="flex items-center">
              <div className="w-3 h-3 bg-yellow-300 rounded-full  mr-2"></div>
              <span>Always collect the key before the goal</span>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 bg-yellow-300 rounded-full  mr-2"></div>
              <span>Find the shortest path for max score</span>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 bg-yellow-300 rounded-full  mr-2"></div>
              <span>Watch your time - the clock is ticking!</span>
            </li>
          </ul>

          {/* Ghost decorations */}
          {/* <div className="flex justify-end -mt-4">
            <div className="w-8 h-8">
              <div className="w-full h-6 bg-pink-400 rounded-t-full"></div>
              <div className="flex w-full">
                <div className="w-1/3 h-2 bg-pink-400"></div>
                <div className="w-1/3 h-2 bg-pink-400"></div>
                <div className="w-1/3 h-2 bg-pink-400"></div>
              </div>
            </div>
          </div> */}
          {/* </div> */}
        </div>

        <button
          onClick={() => setShowRules(false)}
          className="mt-6 w-full py-3 rounded-full cursor-pointer font-bold text-lg transform transition-all duration-300  flex items-center justify-center border-2 border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-black"
          style={{
            // background: "linear-gradient(to right, #FFFF00, #FFCC00)",
            ':hover': {
              boxShadow: '0 0 15px rgba(255, 255, 0, 0.7)',
            },

            // border: "3px solid #FFAA00",
          }}
        >
          GOT IT!
        </button>

        {/* Pac-Man dots decoration - bottom */}
        {/* <div className="absolute bottom-0 left-0 w-full h-6 flex justify-around items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-yellow-300"></div>
          ))}
        </div> */}
      </div>
    </div>
  )
}

export default RulesModal
