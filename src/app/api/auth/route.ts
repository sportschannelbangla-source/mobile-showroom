import { NextRequest, NextResponse } from 'next/server';

const OWNER_PASSWORDS = ['balaji2026', 'admin123', '1234'];
const AUTH_COOKIE = 'sbe_owner_token';
const TOKEN_VALUE = 'sbe_authorized_owner_session_2026';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password or PIN is required' }, { status: 400 });
    }

    if (OWNER_PASSWORDS.includes(password.trim())) {
      const response = NextResponse.json({
        success: true,
        message: 'Owner authenticated successfully',
      });

      // Set cookie
      response.cookies.set(AUTH_COOKIE, TOKEN_VALUE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Incorrect Owner PIN or Password. Hint: Try balaji2026 or 1234' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (token === TOKEN_VALUE) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.delete(AUTH_COOKIE);
  return response;
}
