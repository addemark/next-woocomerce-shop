import { fetchProducts, Product } from "@/api/products";
import HeroHeader from "@/components/hero/heroHeader";
import ProductsList from "@/components/shop/productsList";

export default async function Home() {
  let products: Product[] = [];
  let hasMore = false;
  try {
    const result = await fetchProducts(1);
    products = result.products;
    hasMore = result.hasMore;
  } catch (error: any) {
    console.error("woocommerce error:", error?.response?.data ?? error.message);
  }

  return (
    <div className="bg-white">
      <HeroHeader />
      <ProductsList initialProducts={products} initialHasMore={hasMore} />
    </div>
  );
}
