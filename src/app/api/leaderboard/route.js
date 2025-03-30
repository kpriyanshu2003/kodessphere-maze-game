import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const leaderboard = await prisma.gameRecord.findMany({
      include: { user: true },
      orderBy: [
        { level: "desc" },
        { totalPointsScored: "desc" },
        { totalTimeTaken: "asc" },
      ],
    });
    console.log("Leaderboard", leaderboard);

    return NextResponse.json(
      {
        success: true,
        leaderboard,
        message: "Leaderboard fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name, email, level, score, moves, totalTimeTaken } =
      await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and Email are required" },
        { status: 400 }
      );
    }

    if (email.split("@")[1] !== "kiit.ac.in") {
      return NextResponse.json(
        { success: false, message: "Invalid Email" },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({ where: { email } });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: { name, email },
      });
    }

    // Check if the user already has a game record
    let leaderboard = await prisma.gameRecord.findFirst({
      where: { userId: user.id },
    });

    if (leaderboard) {
      // Update the existing game record
      leaderboard = await prisma.gameRecord.update({
        where: { id: leaderboard.id }, // Use the unique ID
        data: {
          level: level ?? 1,
          moves: moves ?? 0,
          totalTimeTaken: totalTimeTaken ?? "",
          totalPointsScored: score ?? leaderboard.totalPointsScored,
        },
      });
    } else {
      // Create a new game record if it doesn't exist
      leaderboard = await prisma.gameRecord.create({
        data: {
          userId: user.id,
          level: 1,
          moves: 0,
          totalTimeTaken: "",
          totalPointsScored: score ?? 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      user,
      leaderboard,
      message: "Leaderboard updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
