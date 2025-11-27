import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Signed out successfully" });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return response;
}
