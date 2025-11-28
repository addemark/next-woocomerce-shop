import { wc } from "@/lib/wo-client-base";

export type Brand = {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  image?: { src: string; alt?: string };
};

export async function fetchBrands(): Promise<Brand[]> {
  let brands: Brand[] = [];

  try {
    const response = await wc.get("products/brands", { per_page: 100 });
    brands = response.data;
  } catch (error: any) {
    console.error(
      "woocommerce brands error:",
      error?.response?.data ?? error.message
    );
  }

  return brands;
}
