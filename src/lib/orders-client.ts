import type { Order } from "@/lib/woo-api/orders";

export type OrderResponse = { data: Order };

export const fetchCurrentOrder = async (): Promise<Order> => {
  const response = await fetch("/api/orders");
  if (!response.ok) {
    throw new Error(`Failed to fetch order (${response.statusText})`);
  }
  const payload: OrderResponse = await response.json();
  if (!payload?.data) {
    throw new Error("Order response missing data");
  }
  return payload.data;
};
