import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 500 });
  }

  try {
    const match = await redis.get(`match:${id}`);
    if (!match) {
        return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    return NextResponse.json(match);
  } catch (error) {
    console.error('Redis GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch match' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const matchData = await request.json();

  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 500 });
  }

  try {
    await redis.set(`match:${id}`, matchData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Redis POST error:', error);
    return NextResponse.json({ error: 'Failed to save match' }, { status: 500 });
  }
}
