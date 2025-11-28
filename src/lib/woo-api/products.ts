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
  description: string;
  short_description: string;
  average_rating: string;
  rating_count: number;
  categories: { id: number; name: string; slug: string }[];
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  stock_quantity: number | null;
  weight: string;
  dimensions: { length: string; width: string; height: string };
  tags: { id: number; name: string; slug: string }[];
  meta_data: { id: number; key: string; value: string }[];
};

export async function fetchProducts(
  page: number,
  perPage: number
): Promise<{
  products: Product[];
  hasMore: boolean;
}> {
  let products: Product[] = [];
  let hasMore = false;

  try {
    const response = await wc.get("products", { per_page: perPage, page });
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
