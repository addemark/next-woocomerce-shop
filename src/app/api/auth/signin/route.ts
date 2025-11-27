import { NextResponse } from "next/server";
import { env } from "@/env.mjs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${env.API_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);

      return NextResponse.json(
        { error: errorBody?.message ?? "Invalid credentials" },
        { status: response.status }
      );
    }

    const data = await response.json();
    let userId: number | null = null;

    try {
      const meResponse = await fetch(`${env.API_URL}/wp-json/wp/v2/users/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      if (meResponse.ok) {
        const me = await meResponse.json();
        userId = me?.id ?? null;
      } else {
        console.warn("failed to fetch user id:", meResponse.status);
      }
    } catch (meError) {
      console.warn("error fetching user id:", meError);
    }

    return NextResponse.json({
      token: data.token,
      user: data.user_email,
      userId,
    });
  } catch (error: any) {
    console.error("signin error:", error);
    return NextResponse.json(
      { error: "Unable to sign in right now" },
      { status: 500 }
    );
  }
}
