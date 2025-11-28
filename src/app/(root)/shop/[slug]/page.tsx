import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { fetchProductBySlug } from "@/lib/woo-api/products";
import { notFound } from "next/navigation";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const ratingValue = Math.max(
    0,
    Math.min(5, Math.round(Number(product.average_rating) || 0))
  );
  const colors =
    product.attributes?.find((attr) => attr.name.toLowerCase() === "color")
      ?.options ?? [];

  console.log("product", colors);
  const detailSections = [
    {
      name: "Attributes",
      items:
        product.attributes?.map(
          (attr) => `${attr.name}: ${attr.options.join(", ")}`
        ) ?? [],
    },
    {
      name: "Categories & Tags",
      items: [
        product.categories?.length
          ? `Categories: ${product.categories.map((cat) => cat.name).join(", ")}`
          : null,
        product.tags?.length
          ? `Tags: ${product.tags.map((tag) => tag.name).join(", ")}`
          : null,
      ].filter(Boolean) as string[],
    },
    {
      name: "Specs",
      items: [
        product.sku ? `SKU: ${product.sku}` : null,
        product.stock_status
          ? `Stock: ${product.stock_status.replaceAll("_", " ")}`
          : null,
        product.stock_quantity !== null
          ? `Quantity: ${product.stock_quantity}`
          : null,
        product.weight ? `Weight: ${product.weight}` : null,
        product.dimensions
          ? `Dimensions: ${[
              product.dimensions.length,
              product.dimensions.width,
              product.dimensions.height,
            ]
              .filter(Boolean)
              .join(" x ")}`
          : null,
      ].filter(Boolean) as string[],
    },
    {
      name: "Meta",
      items:
        product.meta_data
          ?.filter(
            (meta) => meta.key && !meta.key.startsWith("_") && meta.value
          )
          .map((meta) => `${meta.key}: ${meta.value}`)
          .filter(Boolean) ?? [],
    },
  ].filter((section) => section.items.length > 0);

  const galleryImages =
    product.images?.length > 0
      ? product.images
      : [
          {
            src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-01.jpg",
            alt: product.name,
          },
        ];
  const salePrice =
    product.on_sale && product.sale_price ? `${product.sale_price} RON` : null;
  const regularPrice =
    product.regular_price || product.price
      ? `${product.regular_price || product.price} RON`
      : null;

  const descriptionHtml =
    product.description || product.short_description || "";

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 overflow-y-scroll w-full max-w-2xl sm:block lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-6 px-5 py-5">
                {galleryImages.map((image, index) => (
                  <Tab
                    key={image.src ?? index}
                    className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 focus:ring-3 focus:ring-indigo-500/50 focus:ring-offset-4 focus:outline-hidden"
                  >
                    <span className="sr-only">{image.alt}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <Image
                        alt=""
                        src={image.src}
                        className="size-full object-cover"
                        fill
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-indigo-500"
                    />
                  </Tab>
                ))}
              </TabList>
            </div>

            <TabPanels>
              {galleryImages.map((image, index) => (
                <TabPanel key={image.src ?? index}>
                  <img
                    alt={image.alt || product.name}
                    src={image.src}
                    className="aspect-square w-full object-cover sm:rounded-lg"
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <div className="flex items-center gap-3">
                <p className="text-3xl tracking-tight text-gray-900">
                  {salePrice ?? `${product.price} RON`}
                </p>
                {salePrice && regularPrice && (
                  <p className="text-lg font-medium text-gray-400 line-through">
                    {regularPrice}
                  </p>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-3" aria-label="Product rating">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <StarIcon
                      key={star}
                      aria-hidden="true"
                      className={classNames(
                        ratingValue > star
                          ? "text-indigo-500"
                          : "text-gray-300",
                        "size-5 shrink-0"
                      )}
                    />
                  ))}
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  {product.rating_count > 0
                    ? `${ratingValue}/5 based on ${product.rating_count} review(s)`
                    : "No reviews yet"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                className="space-y-6 text-base text-gray-700"
              />
            </div>

            <div className="mt-6">
              {/* Colors */}
              {colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Color</h3>

                  <fieldset aria-label="Choose a color" className="mt-2">
                    <div className="flex flex-wrap items-center gap-3">
                      {colors.map((color, index) => (
                        <label
                          key={`${color}-${index}`}
                          className="flex items-center gap-2 rounded-full outline -outline-offset-1 outline-black/10 px-2 py-1"
                        >
                          <input
                            defaultValue={color}
                            defaultChecked={index === 0}
                            name="color"
                            type="radio"
                            aria-label={color}
                            className="size-8 appearance-none rounded-full forced-color-adjust-none checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm text-gray-700">{color}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}

              <div className="mt-10 flex">
                <button
                  type="button"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden sm:w-full"
                >
                  Add to bag
                </button>

                <button
                  type="button"
                  className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <HeartIcon aria-hidden="true" className="size-6 shrink-0" />
                  <span className="sr-only">Add to favorites</span>
                </button>
              </div>
            </div>

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              {detailSections.length > 0 && (
                <div className="divide-y divide-gray-200 border-t border-gray-200">
                  {detailSections.map((detail) => (
                    <Disclosure key={detail.name} as="div">
                      <h3>
                        <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span className="text-sm font-medium text-gray-900 group-data-open:text-indigo-600">
                            {detail.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon
                              aria-hidden="true"
                              className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-open:hidden"
                            />
                            <MinusIcon
                              aria-hidden="true"
                              className="hidden size-6 text-indigo-400 group-hover:text-indigo-500 group-data-open:block"
                            />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="pb-6">
                        <ul
                          role="list"
                          className="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300"
                        >
                          {detail.items.map((item) => (
                            <li key={item} className="pl-2">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </DisclosurePanel>
                    </Disclosure>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
