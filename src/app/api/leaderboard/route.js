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

    // Format the time in the response
    const formattedLeaderboard = leaderboard.map((record) => ({
      ...record,
      formattedTime: formatTimeFromSeconds(
        parseInt(record.totalTimeTaken) || 0,
      ),
    }))

    return NextResponse.json(
      {
        success: true,
        leaderboard: formattedLeaderboard,
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
    console.log('Received data:', body)

    // Input validation
    if (!name || !email || name.trim().length < 3) {
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
        data: { name: name.trim(), email: email.trim().toLowerCase() },
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

    // Ensure numeric values - store time as seconds
    const numLevel = parseInt(level) || 1
    const numScore = parseInt(score) || 0
    const numMoves = parseInt(moves) || 0
    const numTimeTaken = parseInt(totalTimeTaken) || 0 // Store as integer seconds

    if (gameRecord) {
      // Only update fields if the new data is better
      const updates = {}

      if (numLevel > gameRecord.level) {
        updates.level = numLevel
        updates.totalPointsScored = numScore
        updates.moves = numMoves
        updates.totalTimeTaken = numTimeTaken
      } else if (numLevel === gameRecord.level) {
        // At the same level, update if score is higher
        if (numScore > gameRecord.totalPointsScored) {
          updates.totalPointsScored = numScore
          updates.moves = numMoves
          updates.totalTimeTaken = numTimeTaken
        }
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
          totalTimeTaken: numTimeTaken,
          totalPointsScored: numScore,
        },
      })
    }

    // Add formatted time to the response
    const gameRecordWithFormattedTime = {
      ...gameRecord,
      formattedTime: formatTimeFromSeconds(numTimeTaken),
    }

    // Return updated data
    return NextResponse.json({
      success: true,
      user,
      gameRecord: gameRecordWithFormattedTime,
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

// Helper function to format seconds into HH:MM:SS
function formatTimeFromSeconds(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':')
}
