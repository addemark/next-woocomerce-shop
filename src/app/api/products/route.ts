import { NextResponse } from "next/server";
import { fetchProducts } from "@/lib/woo-api/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("perPage") ?? "10");

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;

  const { products, hasMore } = await fetchProducts(safePage, perPage);
  return NextResponse.json({ data: products, hasMore });
}
