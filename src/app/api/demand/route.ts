import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const demands = await prisma.demand.findMany();
  return NextResponse.json(demands);
}
