import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser } from "@/helpers/user";
import { log } from "console";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  log("Token in /user/me:", token);
  const userId = cookieStore.get("userId")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "User must be logged in" },
      { status: 401 }
    );
  }
  const user = await getUser(userId ?? "");
  return NextResponse.json({ user });
}
