import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const leaderboard = await prisma.gameRecord.findMany({
      include: { user: true, level: true },
      orderBy: [{ levelId: 'desc' }, { timeTaken: 'asc' }, { moves: 'asc' }],
    })

    return NextResponse.json(
      {
        success: true,
        leaderboard,
        message: 'Leaderboard fetched successfully',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: 'Server Error' },
      { status: 500 },
    )
  }
}
