import { NextResponse } from "next/server";
import { env } from "@/env.mjs";
import { wc } from "@/lib/wo-client-base";

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

    return NextResponse.json({ token: data.token, user: data.user_email });
  } catch (error: any) {
    console.error("signin error:", error);
    return NextResponse.json(
      { error: "Unable to sign in right now" },
      { status: 500 }
    );
  }
}
