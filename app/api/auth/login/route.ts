import { NextRequest, NextResponse } from 'next/server'
import { findUser } from '../../../../libs/userStore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // ✅ validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ find user (check both default admin and signed up users)
    const user = findUser(email)

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please signup first." },
        { status: 400 }
      );
    }

    // ✅ password check
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    // Create simple token
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString('base64')

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token
    })

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
