import { NextRequest, NextResponse } from 'next/server'
import { addUser, findUser } from '../../../../libs/userStore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // ✅ validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // ✅ check user already exists
    const existingUser = findUser(email)
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // ✅ create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: password, // In real app, hash this password
      createdAt: new Date().toISOString()
    }

    addUser(user)

    // Create simple token
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString('base64')

    const response = NextResponse.json({
      success: true,
      message: "Signup successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token
    }, { status: 201 })

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response

  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
