import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { api as v0API } from "./v0/index.ts";
import { federation } from "../federation.ts";

export const api = new OpenAPIHono();

// Mount v0 API
api.route("/api/v0", v0API);

// OpenAPI spec endpoint
api.doc("/api/openapi.json", {
  openapi: "3.1.0",
  info: {
    title: "geo-pub API",
    version: "0.1.0",
    description: "Geospatial ActivityPub API",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Development server",
    },
  ],
});

// Swagger UI endpoint
api.get("/api/docs", swaggerUI({ url: "/api/openapi.json" }));

// Fedify fallback for ActivityPub routes
api.all("*", (c) => federation.fetch(c.req.raw, { contextData: undefined }));
