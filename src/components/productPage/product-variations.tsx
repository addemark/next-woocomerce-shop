"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColorSelector } from "./color-selector";
import { MaterialSelector } from "./material-selector";
import { PurchaseActions } from "./purchase-actions";
import type { Variation } from "@/lib/woo-api/products";

type ProductVariationsProps = {
  productId: number;
  colors: string[];
  materials: string[];
};

type VariationsResponse = {
  data: Variation[];
  availableAttributes: { colors: string[]; materials: string[] };
  count: number;
};

export function ProductVariations({
  productId,
  colors,
  materials,
}: ProductVariationsProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0] ?? "");

  useEffect(() => {
    setSelectedColor((current) =>
      colors.some((c) => c === current) ? current : (colors[0] ?? "")
    );
  }, [colors]);

  useEffect(() => {
    setSelectedMaterial((current) =>
      materials.some((m) => m === current) ? current : (materials[0] ?? "")
    );
  }, [materials]);

  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedColor) params.set("color", selectedColor);
    if (selectedMaterial) params.set("material", selectedMaterial);
    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  }, [selectedColor, selectedMaterial]);

  const { data, isFetching, isError, error } = useQuery<
    VariationsResponse,
    Error
  >({
    queryKey: [
      "product-variations",
      productId,
      selectedColor,
      selectedMaterial,
    ],
    queryFn: async () => {
      const response = await fetch(
        `/api/products/${productId}/variations${searchParams}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch variations (${response.statusText})`);
      }
      return response.json();
    },
    enabled: Boolean(productId),
  });

  const statusMessage = useMemo(() => {
    if (isFetching) return "Loading variations...";
    if (isError)
      return (error as Error)?.message ?? "Failed to load product variations";
    if (!data) return "No product variations found";
    if (data.count === 0) return "No product variations match this selection";
    return `${data.count} product variation(s) available`;
  }, [data, error, isError, isFetching]);

  const hasAvailableVariation = (data?.count ?? 0) > 0;
  const selectedVariation = data?.data?.[0];
  const selectedVariationId = selectedVariation?.id;

  return (
    <div className="mt-6 space-y-6">
      <ColorSelector
        colors={colors}
        value={selectedColor}
        onChange={setSelectedColor}
      />
      <MaterialSelector
        materials={materials}
        value={selectedMaterial}
        onChange={setSelectedMaterial}
      />

      <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
        <p className="font-medium text-gray-900">
          Product variations available
        </p>
        <p className="mt-1">{statusMessage}</p>
        {data?.availableAttributes && (
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
            {data.availableAttributes.colors.length > 0 && (
              <span>Colors: {data.availableAttributes.colors.join(", ")}</span>
            )}
            {data.availableAttributes.materials.length > 0 && (
              <span>
                Materials: {data.availableAttributes.materials.join(", ")}
              </span>
            )}
          </div>
        )}
      </div>

      <PurchaseActions
        disabled={!hasAvailableVariation}
        productId={productId}
        variationId={selectedVariationId}
      />
    </div>
  );
}
