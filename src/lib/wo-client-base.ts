import { env } from "@/env.mjs";
import WooCommerce from "@woocommerce/woocommerce-rest-api";

export const wc = new WooCommerce({
  url: env.API_URL,
  consumerKey: env.WC_CONSUMER_KEY,
  consumerSecret: env.WC_CONSUMER_SECRET,
  version: "wc/v2",
});
