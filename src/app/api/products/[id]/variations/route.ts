import { NextResponse } from "next/server";
import {
  Variation,
  fetchProductVariations,
} from "@/lib/woo-api/products";

const normalize = (value: string | null) =>
  (value ?? "").trim().toLowerCase();

const normalizeValue = (value: string) => value.trim().toLowerCase();

const toAttributeMap = (variation: Variation) =>
  variation.attributes.reduce<Record<string, string>>((acc, attr) => {
    if (!attr.name || !attr.option) return acc;
    acc[normalize(attr.name)] = attr.option;
    return acc;
  }, {});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url);
  const color = normalize(searchParams.get("color"));
  const material = normalize(searchParams.get("material"));

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId) || productId <= 0) {
    return NextResponse.json(
      { error: "Invalid product id" },
      { status: 400 }
    );
  }

  const variations = await fetchProductVariations(productId);
  const filtered = variations.filter((variation) => {
    const attrMap = toAttributeMap(variation);
    if (color && normalize(attrMap["color"]) !== color) return false;
    if (material && normalize(attrMap["material"]) !== material) return false;
    return true;
  });

  const availableAttributes = filtered.reduce(
    (acc, variation) => {
      const attrMap = toAttributeMap(variation);
      const foundColor = attrMap["color"];
      const foundMaterial = attrMap["material"];
      if (
        foundColor &&
        !acc.colors.some(
          (entry) => normalizeValue(entry) === normalizeValue(foundColor)
        )
      ) {
        acc.colors.push(foundColor);
      }
      if (
        foundMaterial &&
        !acc.materials.some(
          (entry) => normalizeValue(entry) === normalizeValue(foundMaterial)
        )
      ) {
        acc.materials.push(foundMaterial);
      }
      return acc;
    },
    { colors: [] as string[], materials: [] as string[] }
  );

  return NextResponse.json({
    data: filtered,
    availableAttributes,
    count: filtered.length,
  });
}
