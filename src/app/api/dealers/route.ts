import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const dealers = await prisma.dealer.findMany();
  return NextResponse.json(dealers);
}
