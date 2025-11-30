import { NextRequest, NextResponse } from "next/server";
import { fetchOrderById, updateOrder } from "@/lib/woo-api/orders";

export async function DELETE(
  request: NextRequest,
  params: { params: { orderId: string; lineItemId: string } }
) {
  try {
    const { orderId, lineItemId } = await params.params;

    if (
      !Number.isFinite(Number(orderId)) ||
      !Number.isFinite(Number(lineItemId))
    ) {
      return NextResponse.json(
        { error: "Valid orderId and lineItemId are required" },
        { status: 400 }
      );
    }

    const order = await fetchOrderById(Number(orderId));
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await updateOrder(Number(orderId), {
      line_items: [{ id: Number(lineItemId), quantity: 0 }],
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Failed to remove line item" },
        { status: 500 }
      );
    }

    const totalItems = (updatedOrder.line_items ?? []).reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

    const response = NextResponse.json(
      { data: updatedOrder, totalItems },
      { status: 200 }
    );
    response.cookies.set("orderId", updatedOrder.id.toString());
    return response;
  } catch (error: any) {
    console.error("Error removing order line item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
