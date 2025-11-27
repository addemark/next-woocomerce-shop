import { wc } from "@/lib/wo-client-base";

export type Product = {
  id: number;
  name: string;
  color: string;
  price: string;
  permalink: string;
  images: { src: string; alt: string }[];
  attributes?: { name: string; options: string[] }[];
  slug: string;
  sku: string;
  parent_id: number;
};

export async function fetchProducts(page: number): Promise<{
  products: Product[];
  hasMore: boolean;
}> {
  let products: Product[] = [];
  let hasMore = false;

  try {
    const response = await wc.get("products", { per_page: 8, page });
    products = response.data;
    const totalPages = Number(
      response.headers?.["x-wp-totalpages"] ??
        response.headers?.["X-WP-TotalPages"]
    );
    hasMore = Number.isFinite(totalPages) ? page < totalPages : false;
  } catch (error: any) {
    console.error("woocommerce error:", error?.response?.data ?? error.message);
  }
  return { products, hasMore };
}
