type ProductPricingProps = {
  price: string;
  salePrice?: string | null;
  regularPrice?: string | null;
};

export function ProductPricing({
  price,
  salePrice,
  regularPrice,
}: ProductPricingProps) {
  return (
    <div className="mt-3">
      <h2 className="sr-only">Product information</h2>
      <div className="flex items-center gap-3">
        <p className="text-3xl tracking-tight text-gray-900">
          {salePrice ?? price}
        </p>
        {salePrice && regularPrice && (
          <p className="text-lg font-medium text-gray-400 line-through">
            {regularPrice}
          </p>
        )}
      </div>
    </div>
  );
}
