import { NextRequest, NextResponse } from "next/server";
import { createOrder, fetchOrderById, updateOrder } from "@/lib/woo-api/orders";

export async function POST(request: NextRequest) {
  try {
    const { productId, variationId, quantity = 1 } = await request.json();

    if (!productId || typeof productId !== "number") {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const safeQuantity =
      typeof quantity === "number" && quantity > 0 ? Math.floor(quantity) : 1;

    const orderIdCookie = request.cookies.get("orderId")?.value;
    const customerIdCookie = request.cookies.get("userId")?.value;
    let order =
      orderIdCookie && Number.isFinite(Number(orderIdCookie))
        ? await fetchOrderById(Number(orderIdCookie))
        : null;

    if (!order) {
      order = await createOrder({ status: "pending" });
    }

    if (!order) {
      return NextResponse.json(
        { error: "Failed to create or fetch order" },
        { status: 500 }
      );
    }

    const existingItems = order.line_items ?? [];
    let merged = false;

    const updatedItems =
      existingItems.length > 0
        ? existingItems.map((item) => {
            const sameProduct = item.product_id === productId;
            const existingVariation =
              item.variation_id && item.variation_id > 0
                ? item.variation_id
                : null;
            const incomingVariation =
              variationId && variationId > 0 ? variationId : null;
            const sameVariation = existingVariation === incomingVariation;

            if (sameProduct && sameVariation) {
              merged = true;
              const newQty = (Number(item.quantity) || 0) + safeQuantity;
              return {
                id: item.id,
                product_id: item.product_id,
                variation_id: item.variation_id || undefined,
                quantity: newQty,
              };
            }
            return {
              id: item.id,
              product_id: item.product_id,
              variation_id: item.variation_id || undefined,
              quantity: item.quantity,
            };
          })
        : [];

    if (!merged) {
      updatedItems.push({
        product_id: productId,
        variation_id: variationId ?? undefined,
        quantity: safeQuantity,
        id: undefined,
      });
    }

    const updatedOrder = await updateOrder(order.id, {
      customer_id: customerIdCookie ? Number(customerIdCookie) : undefined,
      line_items: updatedItems,
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    const totalItems = (updatedOrder.line_items ?? []).reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

    const response = NextResponse.json(
      { data: updatedOrder, totalItems },
      { status: order.id === updatedOrder.id ? 200 : 201 }
    );
    response.cookies.set("orderId", updatedOrder.id.toString());
    return response;
  } catch (error: any) {
    console.error("Error updating order items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
