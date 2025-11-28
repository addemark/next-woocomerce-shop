import { wc } from "@/lib/wo-client-base";
import { log } from "console";

export type User = {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  // Add other fields as needed
};

export async function createUser(userData: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}): Promise<User | null> {
  try {
    const response = await wc.post("customers", userData);
    const user = response.data;
    return user;
  } catch (error: any) {
    console.error(
      "woocommerce create user error:",
      error?.response?.data ?? error.message
    );
    return null;
  }
}
export async function getUser(userId: string): Promise<User | null> {
  try {
    if (!userId) {
      return null;
    }
    const response = await wc.get(`customers/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "woocommerce get user error:",
      error?.response?.data ?? error.message
    );
    return null;
  }
}
