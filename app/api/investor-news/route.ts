import { NextResponse } from 'next/server';
import { fetchInvestorNews } from '@/lib/news/fetch';

export const revalidate = 900;

export async function GET() {
  const items = await fetchInvestorNews();

  if (!items.length) {
    return NextResponse.json({ items: [], error: 'unavailable' }, { status: 503 });
  }

  return NextResponse.json({ items });
}