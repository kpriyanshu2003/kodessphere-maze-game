"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Page({ setUser }) {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState({
    loading: false,
    message: "register",
  });
  const [pacmanPosition, setPacmanPosition] = useState(0);

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

    if (!formData.email || !formData.name) {
      toast.error("Please fill all fields");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (formData.name.length < 3) {
      toast.error("Name should be at least 3 characters");
      return;
    }
    if (!formData.email.endsWith("@kiit.ac.in")) {
      toast.error("Please use your kiit email");
      return;
    }
    try {
      setLoading({ loading: true, message: "registering..." });
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");
      if (data && data.user) toast.success("Registered successfully");

      setFormData({ name: "", email: "" });
      setInterval(
        () => setUser({ name: formData.name, email: formData.email }),
        1000
      );
    } catch (error) {
      console.log("error", error);
      toast.error(error.message);
      setLoading({ loading: false, message: "unknown error" });
    } finally {
      setTimeout(
        () => setLoading({ loading: false, message: "register" }),
        2000
      );
    }
  };
  return (
    <div className="bg-[#040404] h-screen w-screen grid place-items-center text-white">
      {/* Botton PacMan */}
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-pacman absolute bottom-5 z-10"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="#ff0"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          left: `${pacmanPosition}%`,
          animation: "eat 0.3s infinite alternate",
        }}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5.636 5.636a9 9 0 0 1 13.397 .747l-5.619 5.617l5.619 5.617a9 9 0 1 1 -13.397 -11.981z" />
        <circle cx="11.5" cy="7.5" r="1" fill="currentColor" />
      </svg> */}
      {/* {Array(50)
        .fill()
        .map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full bottom-8"
            style={{ left: `${i * 5}%` }}
          ></div>
        ))} */}

      {/* Form */}
      <div className="border-[3px] rounded-lg px-16 py-10 border-[#2121DE] h-6/12 w-5/12 flex flex-col justify-between">
        <div className="text-center font-pacman text-5xl">Maze Adventure</div>
        <div className="px-6 py-4 mt-4 grid place-items-center">
          <form className="flex flex-col gap-4 w-5/6" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border-2 border-[#2121DE] rounded-md p-3 placeholder:font-mono outline-none focus:border-[#0059ff]"
            />
            <input
              type="email"
              placeholder="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border-2 border-[#2121DE] rounded-md p-3 placeholder:font-mono outline-none focus:border-[#0059ff]"
            />
            <button
              className={`font-mono flex items-center gap-2 border-2 border-[#FFFF00] rounded-md justify-center py-3 ${
                loading.loading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              type="submit"
              disabled={loading.loading}
            >
              {loading.message}{" "}
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
