import { NextRequest, NextResponse } from 'next/server';
import { getFestivalCampaign, updateFestivalCampaign } from '@/lib/db';

export async function GET() {
  try {
    const campaign = getFestivalCampaign();
    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = updateFestivalCampaign(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}
