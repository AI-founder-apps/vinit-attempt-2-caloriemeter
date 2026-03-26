import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Please log in first' }, { status: 401 });
    }

    const scans = await prisma.scan.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const formattedScans = scans.map((scan) => ({
      id: scan.id,
      food_name: scan.foodName,
      calories: scan.calories,
      protein: scan.protein,
      carbs: scan.carbs,
      fat: scan.fat,
      fiber: scan.fiber,
      sugar: scan.sugar,
      serving_size: scan.servingSize,
      items: scan.itemsJson ? JSON.parse(scan.itemsJson) : [],
      created_at: scan.createdAt,
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
