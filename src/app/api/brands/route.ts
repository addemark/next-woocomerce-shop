import { NextResponse } from "next/server";
import { fetchBrands } from "@/lib/woo-api/brands";

export async function GET() {
  try {
    const data = await fetchBrands();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("brands api error:", error);
    return NextResponse.json(
      { error: "Failed to load brands" },
      { status: 500 }
    );
  }
}
