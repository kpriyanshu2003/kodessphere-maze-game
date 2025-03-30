"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Register({ setUser }) {
  const [error, setError] = useState("");
  const [ghosts, setGhosts] = useState([]);
  const [success, setSuccess] = useState(false);
  const [pacmanPosition, setPacmanPosition] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    const newGhosts = [];
    for (let i = 0; i < 4; i++)
      newGhosts.push({
        id: i,
        top: Math.floor(Math.random() * 80) + 10,
        left: Math.floor(Math.random() * 80) + 10,
        color: ["red", "pink", "cyan", "orange"][i],
      });
    setGhosts(newGhosts);
  }, []);

  // Animate Pacman movement
  useEffect(() => {
    const interval = setInterval(
      () => setPacmanPosition((prev) => (prev + 1) % 100),
      100
    );
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.endsWith("@kiit.ac.in")) {
      setError("Email must be from @kiit.ac.in domain");
      return;
    }

    if (formData.name.length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }

    try {
      console.log("Sending");
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });

      const data = await response.json();
      console.log("data", data);

      if (!response.ok) throw new Error(data.message || "Something went wrong");
      if (data && data.user) setUser(data.user);

      setSuccess(true);
    } catch (error) {
      console.log("error", error);
      setError(error.message);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-black overflow-hidden">
      <div className="relative w-full h-screen bg-black">
        {/* Pacman Character */}
        <div
          className="absolute w-[30px] h-[30px] bg-yellow-400 rounded-full bottom-5 z-10"
          style={{
            left: `${pacmanPosition}%`,
            clipPath: "polygon(0 0, 100% 50%, 0 100%)",
            animation: "eat 0.3s infinite alternate",
          }}
        ></div>

        {/* Ghost Characters */}
        {ghosts.map((ghost) => (
          <div
            key={ghost.id}
            className="absolute w-[25px] h-[25px] rounded-t-full z-[4]"
            style={{
              top: `${ghost.top}%`,
              left: `${ghost.left}%`,
              backgroundColor: ghost.color,
              animation: "float 4s infinite ease-in-out",
            }}
          >
            <div
              className="absolute -bottom-[5px] left-0 w-full h-[5px]"
              style={{
                backgroundColor: ghost.color,
                clipPath: "polygon(0% 0%, 25% 100%, 50% 0%, 75% 100%, 100% 0%)",
              }}
            ></div>
          </div>
        ))}

        {/* Dots */}
        {Array(10)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="absolute w-[10px] h-[10px] bg-yellow-400 rounded-full bottom-[30px] animate-pulse"
              style={{ left: `${i * 10}%` }}
            ></div>
          ))}

        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] p-8 rounded-3xl z-10 overflow-hidden border-4 border-[#0000AA]"
          style={{
            background: "linear-gradient(180deg, #000033 0%, #000066 100%)",
            boxShadow:
              "0 0 30px rgba(255, 255, 0, 0.5), inset 0 0 20px rgba(0, 0, 255, 0.3)",
          }}
        >
          {/* Pac-Man dots decoration - top */}
          <div className="absolute top-0 left-0 w-full h-6 flex justify-around items-center">
            {Array(10)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-300"
                ></div>
              ))}
          </div>

          <h1
            className="text-yellow-300 text-center font-bold mb-8 text-4xl whitespace-nowrap"
            style={{ textShadow: "0 0 10px rgba(255, 255, 0, 0.7)" }}
          >
            MAZE ADVENTURE
          </h1>

          {success ? (
            <div className="text-center text-yellow-300 p-5 bg-black bg-opacity-60 rounded-lg border-2 border-blue-500">
              <div className="w-24 h-24 mx-auto mb-5 relative">
                <div
                  className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center animate-pulse"
                  style={{ boxShadow: "0 0 20px rgba(255, 255, 0, 0.7)" }}
                ></div>

                {/* Scared ghost */}
                <div className="absolute -top-2 -right-2 w-10 h-10 animate-bounce">
                  <div className="w-full h-8 bg-blue-400 rounded-t-full"></div>
                  <div className="flex w-full">
                    <div className="w-1/3 h-2 bg-blue-400"></div>
                    <div className="w-1/3 h-2 bg-blue-400"></div>
                    <div className="w-1/3 h-2 bg-blue-400"></div>
                  </div>
                  <div className="absolute top-4 left-2 w-1 h-1 bg-white rounded-full"></div>
                  <div className="absolute top-4 right-2 w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
              <h2
                className="mb-5 text-lg"
                style={{ textShadow: "0 0 10px rgba(255, 255, 0, 0.7)" }}
              >
                Registration Successful!
              </h2>
              <p className="mb-6">Welcome to the game, {formData.name}!</p>

              <div className="flex justify-center items-center w-full">
                <button
                  onClick={() => setSuccess(false)}
                  className="px-10 py-4 rounded-full text-black font-bold text-xl flex items-center justify-center gap-3 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-70"
                  style={{
                    background: "linear-gradient(to right, #FFFF00, #FFCC00)",
                    boxShadow: "0 0 15px rgba(255, 255, 0, 0.7)",
                    border: "3px solid #FFAA00",
                  }}
                >
                  <div className="w-6 h-6 bg-black rounded-full relative flex-shrink-0">
                    <div
                      className="absolute right-0 top-1/4"
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: "6px solid transparent",
                        borderBottom: "6px solid transparent",
                        borderRight: "12px solid black",
                      }}
                    ></div>
                  </div>
                  <Link href="/" className="text-black">
                    {" "}
                    <span>PLAY NOW</span>{" "}
                  </Link>
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 bg-black bg-opacity-60 rounded-lg p-4 border-2 border-blue-500"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-blue-300 text-sm">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="p-3 bg-[#000033] border-2 border-[#0055AA] rounded-lg text-white text-sm transition-all duration-300 focus:outline-none focus:shadow-[0_0_10px_rgba(0,100,255,0.7)] focus:border-[#0088FF]"
                  placeholder="name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-blue-300 text-sm">
                  Email (@kiit.ac.in)
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="p-3 bg-[#000033] border-2 border-[#0055AA] rounded-lg text-white text-sm transition-all duration-300 focus:outline-none focus:shadow-[0_0_10px_rgba(0,100,255,0.7)] focus:border-[#0088FF]"
                  placeholder="email@kiit.ac.in"
                />
              </div>

              {error && (
                <div className="text-white bg-red-500 bg-opacity-20 p-2.5 rounded text-center text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-300 to-yellow-400 text-black font-bold py-4 px-6 rounded-full border-3 border-yellow-600 flex items-center justify-center gap-2.5 mt-2.5 shadow-[0_0_15px_rgba(255,255,0,0.7)] animate-pulse transition-transform duration-300 hover:scale-105"
              >
                <div className="w-6 h-6 bg-black rounded-full relative">
                  <div
                    className="absolute right-0 top-1/4"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "6px solid transparent",
                      borderBottom: "6px solid transparent",
                      borderRight: "12px solid black",
                    }}
                  ></div>
                </div>
                {/* <span>REGISTER NOW</span> */}
                Register Now
              </button>
            </form>
          )}

          {/* Pac-Man dots decoration - bottom */}
          <div className="absolute bottom-0 left-0 w-full h-6 flex justify-around items-center">
            {Array(10)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-300"
                ></div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
