import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

    const tokenResponse = await fetch(
      `${env.API_URL}/wp-json/jwt-auth/v1/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.json().catch(() => null);

      return NextResponse.json(
        { error: errorBody?.message ?? "Invalid credentials" },
        { status: tokenResponse.status }
      );
    }

    const data = await tokenResponse.json();
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

    const response = NextResponse.json({
      token: data.token,
      user: data.user_email,
      userId,
    });

    (response as any).cookies.set("token", data.token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("signin error:", error);
    return NextResponse.json(
      { error: "Unable to sign in right now" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { valid: false, error: "No token provided" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${env.API_URL}/wp-json/jwt-auth/v1/token/validate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json(
        { valid: false, error: "Invalid token" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("token validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Validation failed" },
      { status: 500 }
    );
  }
}
