import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Please log in first' }, { status: 401 });
    }

    const db = getDb();
    const scans = db.prepare(
      'SELECT * FROM scans WHERE user_id = ? ORDER BY created_at DESC'
    ).all(user.id) as any[];

    const formattedScans = scans.map((scan) => ({
      id: scan.id,
      food_name: scan.food_name,
      calories: scan.calories,
      protein: scan.protein,
      carbs: scan.carbs,
      fat: scan.fat,
      fiber: scan.fiber,
      sugar: scan.sugar,
      serving_size: scan.serving_size,
      items: scan.items_json ? JSON.parse(scan.items_json) : [],
      created_at: scan.created_at,
    }));

    return NextResponse.json({ scans: formattedScans });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json(
      { error: 'Could not load your history. Please try again.' },
      { status: 500 }
    );
  }
}