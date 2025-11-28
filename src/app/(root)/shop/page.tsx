import { fetchProducts, Product } from "@/lib/woo-api/products";
import HeroHeader from "@/components/hero/heroHeader";
import ProductsList from "@/components/shop/productsList";
import { env } from "@/env.mjs";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams?.page ?? "1");
  const initialPage =
    Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1;
  const perPage = Number(env.PER_PAGE) || 10;

  let products: Product[] = [];
  let hasMore = false;
  try {
    const result = await fetchProducts(initialPage, perPage);
    products = result.products;
    hasMore = result.hasMore;
  } catch (error: any) {
    console.error("woocommerce error:", error?.response?.data ?? error.message);
  }

  return (
    <div className="bg-white">
      <HeroHeader />
      <ProductsList
        initialProducts={products}
        initialHasMore={hasMore}
        perPage={perPage}
        initialPage={initialPage}
      />
    </div>
  );
}
