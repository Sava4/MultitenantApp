import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    UPSTREAM_API_URL: z
      .string()
      .url()
      .optional()
      .default("https://4y6vut7106.execute-api.us-east-1.amazonaws.com/v1/pipelines"),
  },
  client: {},
  runtimeEnv: {
    UPSTREAM_API_URL: process.env.UPSTREAM_API_URL,
  },
});
