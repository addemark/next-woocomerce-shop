import { fetchProductBySlug } from "@/lib/woo-api/products";
import { notFound } from "next/navigation";
import { ColorSelector } from "@/components/productPage/color-selector";
import { DetailAccordion } from "@/components/productPage/detail-accordion";
import { ProductDescription } from "@/components/productPage/product-description";
import { ProductGallery } from "@/components/productPage/product-gallery";
import { ProductPricing } from "@/components/productPage/product-pricing";
import { PurchaseActions } from "@/components/productPage/purchase-actions";
import { RatingSummary } from "@/components/productPage/rating-summary";
import { MaterialSelector } from "@/components/productPage/material-selector";
import { DetailSection, GalleryImage } from "@/components/productPage/types";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

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
  const materials =
    product.attributes?.find((attr) => attr.name.toLowerCase() === "material")
      ?.options ?? [];

  const detailSections: DetailSection[] = [
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

  const galleryImages: GalleryImage[] =
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
          <ProductGallery images={galleryImages} name={product.name} />

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <ProductPricing
              price={`${product.price} RON`}
              salePrice={salePrice}
              regularPrice={regularPrice}
            />

            {/* Reviews */}
            <RatingSummary
              ratingValue={ratingValue}
              ratingCount={product.rating_count}
            />

            <ProductDescription html={descriptionHtml} />

            <ColorSelector colors={colors} />
            <MaterialSelector materials={materials} />

            <PurchaseActions />

            <DetailAccordion sections={detailSections} />
          </div>
        </div>
      </div>
    </div>
  );
}
