"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { Product } from "@/api/products";

type ProductsListProps = {
  initialProducts: Product[];
  initialHasMore: boolean;
  perPage: number;
  initialPage?: number;
};

export default function ProductsList({
  initialProducts,
  initialHasMore,
  initialPage = 1,
  perPage,
}: ProductsListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["products", perPage],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/products?page=${pageParam}&perPage=${perPage}`
      );
      if (!res.ok) {
        throw new Error(`Failed to load products (${res.status})`);
      }
      const body = await res.json();
      return {
        products: (body?.data as Product[]) ?? [],
        hasMore: Boolean(body?.hasMore),
        page: Number(pageParam),
      };
    },
    initialPageParam: initialPage,
    initialData: {
      pageParams: [initialPage],
      pages: [
        {
          products: initialProducts,
          hasMore: initialHasMore,
          page: initialPage,
        },
      ],
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasMore) return undefined;
      return (lastPage.page ?? 1) + 1;
    },
  });
  console.log({ data, isFetchingNextPage, hasNextPage, isError, error });

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data]
  );

  const uniqueProducts = useMemo(() => {
    const seen = new Set<string>();
    return products.filter((product) => {
      if (seen.has(`${product.id} + ${product.parent_id}`)) return false;
      seen.add(`${product.id} + ${product.parent_id}`);
      return true;
    });
  }, [products]);

  const nextPageNumber = (data?.pages?.[data.pages.length - 1]?.page ?? 1) + 1;
  const nextPageHref = `/shop?page=${nextPageNumber}`;

  return (
    <div className="bg-white">
      <div className="mx-auto w-full px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Lista Produse
        </h2>

        <InfiniteScroll
          dataLength={uniqueProducts.length}
          next={() => !isFetchingNextPage && fetchNextPage()}
          hasMore={Boolean(hasNextPage)}
          loader={
            <div className="mt-10 flex justify-center">
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          }
          endMessage={
            uniqueProducts.length > 0 ? (
              <p className="mt-10 text-center text-sm text-gray-500">
                You&apos;ve reached the end.
              </p>
            ) : null
          }
          scrollThreshold={0.9}
        >
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {uniqueProducts.map((product) => (
              <div
                key={`${product.id} + ${product.parent_id}`}
                className="group relative"
              >
                <Image
                  width={500}
                  height={400}
                  alt={product.images[0]?.alt ?? product.name}
                  src={
                    product.images[0]?.src ??
                    "https://via.placeholder.com/500?text=No+Image"
                  }
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link
                        href={`${product.slug ?? product.permalink ?? "#"}`}
                      >
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
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

          {hasNextPage && (
            <div className="mt-8 text-center">
              <Link
                href={nextPageHref}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Next page ({nextPageNumber})
              </Link>
            </div>
          )}
        </InfiniteScroll>

        {isError && (
          <div className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {(error as Error)?.message ?? "Unable to load more products"}
          </div>
        )}
      </div>
    </div>
  );
}
