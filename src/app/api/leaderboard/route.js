import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Fetch Leaderboard
export async function GET() {
  try {
    const leaderboard = await prisma.gameRecord.findMany({
      include: { user: true },
      orderBy: [
        { level: 'desc' },
        { totalPointsScored: 'desc' },
        { totalTimeTaken: 'asc' },
      ],
      take: 100, // Limit to top 100 to prevent large data transfers
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
    console.error('❌ Server Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch leaderboard',
        error: error.message,
      },
      { status: 500 },
    )
  }
}

// Update Leaderboard
export async function POST(req) {
  try {
    // Parse request body and validate required fields
    const body = await req.json()
    const { name, email, level, score, moves, totalTimeTaken } = body

    // Input validation
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and Email are required' },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 },
      )
    }

    // Validate KIIT domain
    if (email.split('@')[1] !== 'kiit.ac.in') {
      return NextResponse.json(
        { success: false, message: 'Only KIIT email addresses are allowed' },
        { status: 403 },
      )
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      user = await prisma.user.create({
        data: { name, email },
      })
    } else if (user.name !== name) {
      // Update name if it has changed
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name },
      })
    }

    // Find existing game record
    let gameRecord = await prisma.gameRecord.findFirst({
      where: { userId: user.id },
    })

    // Ensure numeric values
    const numLevel = parseInt(level) || 1
    const numScore = parseInt(score) || 0
    const numMoves = parseInt(moves) || 0
    const strTimeTaken = String(totalTimeTaken || '') // Ensure it's a string

    if (gameRecord) {
      // Only update fields if the new data is better
      const updates = {}

      if (numLevel > gameRecord.level) {
        updates.level = numLevel
      }

      if (numScore > gameRecord.totalPointsScored) {
        updates.totalPointsScored = numScore
      }

      // Only update moves if level is higher or score is higher at same level
      if (
        numLevel > gameRecord.level ||
        (numLevel === gameRecord.level &&
          numScore > gameRecord.totalPointsScored)
      ) {
        updates.moves = numMoves
      }

      // Only update time if provided and if level is higher or score is higher at same level
      if (
        strTimeTaken &&
        (numLevel > gameRecord.level ||
          (numLevel === gameRecord.level &&
            numScore > gameRecord.totalPointsScored))
      ) {
        updates.totalTimeTaken = strTimeTaken
      }

      // Only perform update if there are changes
      if (Object.keys(updates).length > 0) {
        gameRecord = await prisma.gameRecord.update({
          where: { id: gameRecord.id },
          data: updates,
        })
      }
    } else {
      // Create a new game record
      gameRecord = await prisma.gameRecord.create({
        data: {
          userId: user.id,
          level: numLevel,
          moves: numMoves,
          totalTimeTaken: strTimeTaken,
          totalPointsScored: numScore,
        },
      })
    }

    // Return updated data
    return NextResponse.json({
      success: true,
      user,
      gameRecord,
      message: 'Leaderboard updated successfully',
    })
  } catch (error) {
    console.error('❌ Server Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update leaderboard',
        error: error.message,
      },
      { status: 500 },
    )
  }
}
