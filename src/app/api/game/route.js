import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { userId, levelId, moves, timeTaken } = await req.json()

    if (!userId || !levelId || moves == null || timeTaken == null) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 },
      )
    }

    const record = await prisma.gameRecord.create({
      data: { userId, levelId, moves, timeTaken },
    })

    if (!record) {
      return NextResponse.json(
        { success: false, message: 'Failed to create record' },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { success: true, record, message: 'Record created successfully' },
      { status: 201 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: 'Server Error' },
      { status: 500 },
    )
  }
}
