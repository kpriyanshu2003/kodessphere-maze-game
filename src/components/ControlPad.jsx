import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

export default function ControlPad({ movePlayer }) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-xs mb-6 sm:hidden mt-10">
      <div></div>
      <button
        onClick={() => movePlayer(-1, 0)}
        className="bg-blue-700 text-white p-3 rounded-lg flex justify-center hover:bg-blue-600 active:scale-95 transition border-2 border-blue-500"
      >
        <ArrowUp size={24} />
      </button>
      <div></div>

      <button
        onClick={() => movePlayer(0, -1)}
        className="bg-blue-700 text-white p-3 rounded-lg flex justify-center hover:bg-blue-600 active:scale-95 transition border-2 border-blue-500"
      >
        <ArrowLeft size={24} />
      </button>

      <button
        onClick={() => movePlayer(1, 0)}
        className="bg-blue-700 text-white p-3 rounded-lg flex justify-center hover:bg-blue-600 active:scale-95 transition border-2 border-blue-500"
      >
        <ArrowDown size={24} />
      </button>

      <button
        onClick={() => movePlayer(0, 1)}
        className="bg-blue-700 text-white p-3 rounded-lg flex justify-center hover:bg-blue-600 active:scale-95 transition border-2 border-blue-500"
      >
        <ArrowRight size={24} />
      </button>
    </div>
  );
}
