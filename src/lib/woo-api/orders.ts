import { wc } from "@/lib/wo-client-base";

export type Order = {
  id: number;
  status: string;
  total: string;
  currency: string;
  date_created: string;
  customer_id?: number;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: {
    id?: number;
    name?: string;
    product_id?: number;
    variation_id?: number;
    quantity?: number;
    subtotal?: string;
    total?: string;
    sku?: string;
    image?: {
      src: string;
      alt: string;
    };
  }[];
};

export async function fetchOrders(
  page: number,
  perPage: number
): Promise<{
  orders: Order[];
  hasMore: boolean;
}> {
  let orders: Order[] = [];
  let hasMore = false;

  try {
    const response = await wc.get("orders", { per_page: perPage, page });
    orders = response.data;
    const totalPages = Number(
      response.headers?.["x-wp-totalpages"] ??
        response.headers?.["X-WP-TotalPages"]
    );
    hasMore = Number.isFinite(totalPages) ? page < totalPages : false;
  } catch (error: any) {
    console.error("woocommerce error:", error?.response?.data ?? error.message);
  }

  return { orders, hasMore };
}

export async function fetchOrderById(id: number): Promise<Order | null> {
  try {
    const response = await wc.get(`orders/${id}`);
    const order: Order = response.data;

    return order;
  } catch (error: any) {
    console.error("woocommerce error:", error?.response?.data ?? error.message);
    return null;
  }
}

export async function createOrder(
  orderData: Partial<Order>
): Promise<Order | null> {
  try {
    const response = await wc.post("orders", orderData);
    const order: Order = response.data;

    return order;
  } catch (error: any) {
    console.error("woocommerce error:", error?.response?.data ?? error.message);
    return null;
  }
}

export async function updateOrder(
  id: number,
  orderData: Partial<Order>
): Promise<Order | null> {
  try {
    const response = await wc.put(`orders/${id}`, orderData);
    const order: Order = response.data;

    return order;
  } catch (error: any) {
    console.error("woocommerce error:", error?.response?.data ?? error.message);
    return null;
  }
}
