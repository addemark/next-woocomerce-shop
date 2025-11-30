import { NextRequest, NextResponse } from "next/server";
import {
  createOrder,
  fetchOrderById,
  updateOrder,
} from "@/lib/woo-api/orders";

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
      typeof quantity === "number" && quantity > 0 ? quantity : 1;

    const orderIdCookie = request.cookies.get("orderId")?.value;
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

    const updatedOrder = await updateOrder(order.id, {
      line_items: [
        {
          product_id: productId,
          variation_id: variationId ?? undefined,
          quantity: safeQuantity,
        },
      ],
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      { data: updatedOrder },
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
