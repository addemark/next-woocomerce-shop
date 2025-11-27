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
    console.log("[user created:", user.id, user.email);
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
      console.log("[-fetch user-] No userId provided");
      return null;
    }
    const response = await wc.get(`customers/${userId}`);
    console.log("[-fetch user-]", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "woocommerce get user error:",
      error?.response?.data ?? error.message
    );
    return null;
  }
}
