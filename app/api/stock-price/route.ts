import { NextResponse } from 'next/server';
import { fetchStockSnapshot } from '@/lib/stock/fetch';

export const revalidate = 300;

export async function GET() {
  const snapshot = await fetchStockSnapshot();

  if (!snapshot) {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }

  return NextResponse.json(snapshot);
}