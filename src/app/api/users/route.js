import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { name } = await req.json()

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 },
      )
    }

    let user = await prisma.user.findUnique({ where: { name } })

    if (!user) {
      user = await prisma.user.create({ data: { name } })
    }

    return NextResponse.json(
      { success: true, user, message: 'User created successfully' },
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
