import { NextResponse } from "next/server";
import { fetchProducts } from "@/api/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;

  const { products, hasMore } = await fetchProducts(safePage);

  return NextResponse.json({ data: products, hasMore });
}
