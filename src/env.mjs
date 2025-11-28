import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    WC_CONSUMER_KEY: z.string().min(1, "WC_CONSUMER_KEY is required"),
    WC_CONSUMER_SECRET: z.string().min(1, "WC_CONSUMER_SECRET is required"),
    API_URL: z.url().min(1, "API_URL must be a valid URL"),
    NODE_ENV: z.string().optional(),
    PER_PAGE: z.string().default(10),
  },
  client: {
    API_URL: z.url().optional(),
    NODE_ENV: z.string().optional(),
    PER_PAGE: z.string().default(10),
  },
  runtimeEnv: {
    WC_CONSUMER_KEY: process.env.WC_CONSUMER_KEY,
    WC_CONSUMER_SECRET: process.env.WC_CONSUMER_SECRET,
    API_URL: process.env.API_URL,
    NODE_ENV: process.env.NODE_ENV,
    PER_PAGE: process.env.PER_PAGE,
  },
});
