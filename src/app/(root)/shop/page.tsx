import Image from "next/image";
import { env } from "@/env.mjs";
import { fetchProducts, Product } from "@/api/products";
import HeroHeader from "@/components/hero/heroHeader";

export default async function Home() {
  let products: Product[] = [];
  try {
    products = await fetchProducts(1);
  } catch (error: any) {
    console.error("woocommerce error:", error?.response?.data ?? error.message);
  }

  return (
    <div className="bg-white">
      <HeroHeader />
      <div className="bg-white">
        <div className="mx-auto w-full px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Lista Produse
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <Image
                  width={500}
                  height={400}
                  alt={product.images[0].alt}
                  src={product.images[0].src}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.attributes
                        ?.find((attr) => attr.name === "Color")
                        ?.options.join(", ") || null}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.price} - RON
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
