"use client";

import MazeGame from "@/components/MazeGame";
import Register from "@/components/Register";
import { useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);
  return (
    <>{user ? <MazeGame user={user} /> : <Register setUser={setUser} />}</>
  );
}
