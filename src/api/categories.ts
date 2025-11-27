import { wc } from "@/lib/wo-client-base";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: { src: string; alt: string };
};

export async function fetchCategories(): Promise<Category[]> {
  let categories: Category[] = [];

  try {
    const response = await wc.get("products/categories", { per_page: 100 });
    categories = response.data;
    console.log("categories loaded:", categories);
  } catch (error: any) {
    console.error("woocommerce error:", error?.response?.data ?? error.message);
  }
  return categories;
}
