import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'frontend',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  });
}