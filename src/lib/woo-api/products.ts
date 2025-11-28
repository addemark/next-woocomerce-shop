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

export type Variation = {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  attributes: { id?: number; name: string; option: string }[];
  image?: { src: string; alt?: string };
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

export async function fetchProductById(
  id: null | number
): Promise<Product | null> {
  try {
    const response = await wc.get("products", { id, per_page: 1 });
    const product: Product = response.data;

    return product;
  } catch (error: any) {
    console.error("woocommerce error:", error?.response?.data ?? error.message);
    return null;
  }
}

export async function fetchProductVariations(
  productId: number
): Promise<Variation[]> {
  try {
    const response = await wc.get(`products/${productId}/variations`, {
      per_page: 100,
    });
    return response.data ?? [];
  } catch (error: any) {
    console.error("woocommerce error:", error?.response?.data ?? error.message);
    return [];
  }
}

export async function fetchProductBySlug(
  slug: string
): Promise<Product | null> {
  try {
    const response = await wc.get("products", { slug, per_page: 1 });
    const [product] = response.data ?? [];
    if (!product?.id) return null;

    return product;
  } catch (error: any) {
    console.error("woocommerce error:", error?.response?.data ?? error.message);
    return null;
  }
}
