import { wc } from "@/lib/wo-client-base";

export type Product = {
  id: number;
  name: string;
  color: string;
  price: string;
  href: string;
  images: { src: string; alt: string }[];
  attributes?: { name: string; options: string[] }[];
};

export async function fetchProducts(): Promise<Product[]> {
  let products: Product[] = [];

  try {
    const response = await wc.get("products", { per_page: 100 });
    products = response.data;
  } catch (error: any) {
    console.error("woocommerce error:", error?.response?.data ?? error.message);
  }
  return products;
}
