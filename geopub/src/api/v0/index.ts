import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createUser } from "../../repos/user.ts";

export const api = new Hono();

const createUserSchema = z.object({
  public_id: z.string(),
  name: z.string(),
  username: z.string(),
  summary: z.string(),
});

api.post("/users", zValidator("json", createUserSchema), async (c) => {
  const data = c.req.valid("json");

  return c.json(await createUser(data));
});
