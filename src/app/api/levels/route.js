import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { name, optimalMoves } = await req.json()

    if (!name || !optimalMoves) {
      return NextResponse.json(
        { success: false, message: 'Name and optimalMoves are required' },
        { status: 400 },
      )
    }

    const level = await prisma.level.create({ data: { name, optimalMoves } })

    if (!level) {
      return NextResponse.json(
        { success: false, message: 'Failed to create level' },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { success: true, level, message: 'Level created successfully' },
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
