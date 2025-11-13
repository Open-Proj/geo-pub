import { Hono } from "hono";
import { api as v0API } from "./v0/index.ts";
import { federation } from "../federation.ts";

export const api = new Hono();
api.route("/api/v0", v0API);
api.all("*", (c) => federation.fetch(c.req.raw, { contextData: undefined }));
