import { z } from "zod";

const envSchema = z.object({
  POSTGRES_URI: z.string().default("postgres://geo-pub-dev:geo-pub-dev@postgres/geo_pub_dev"),
});

export const CFG = envSchema.parse(Deno.env.toObject());
