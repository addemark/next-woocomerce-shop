import { NextRequest, NextResponse } from "next/server";
import { createOrder, fetchOrderById, Order } from "@/lib/woo-api/orders";
import { da } from "zod/v4/locales";

export async function GET(request: NextRequest) {
  try {
    const orderIdCookie = request.cookies.get("orderId")?.value;
    if (!orderIdCookie) {
      return NextResponse.json({ data: {} }, { status: 200 });
    }

    if (orderIdCookie) {
      const existingOrder = await fetchOrderById(Number(orderIdCookie));
      if (existingOrder) {
        return NextResponse.json({ data: existingOrder }, { status: 200 });
      }
    }
  } catch (error: any) {
    console.error("Error ensuring order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    const newOrder = await createOrder(orderData as Partial<Order>);
    if (!newOrder) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }
    const response = NextResponse.json({ data: newOrder }, { status: 201 });
    response.cookies.set("orderId", newOrder.id.toString());
    return response;
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
