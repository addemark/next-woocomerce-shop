import { NextResponse } from "next/server";
import { createUser } from "@/lib/woo-api/user";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    const user = await createUser({
      email,
      password,
      username,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Registration failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    console.error("signup error:", error);
    return NextResponse.json(
      { error: "Unable to register right now" },
      { status: 500 }
    );
  }
}
