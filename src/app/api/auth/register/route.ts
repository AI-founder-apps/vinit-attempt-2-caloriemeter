import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json();

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Please fill in all fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const db = getDb();
    
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);
    const result = db.prepare(
      'INSERT INTO users (email, name, password) VALUES (?, ?, ?)'
    ).run(email, name, hashedPassword);

    const user = { id: result.lastInsertRowid as number, email, name };
    const token = createToken(user);

    return NextResponse.json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}