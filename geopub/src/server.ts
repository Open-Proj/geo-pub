import { configure, getConsoleSink } from "@logtape/logtape";
import { Hono } from "hono";
import { federation } from "./federation.ts";
import { api } from "./api/index.ts";

// Configure logging
await configure({
  sinks: { console: getConsoleSink() },
  filters : {},
  loggers: [
    { category: "fedify",  sinks: ["console"], lowestLevel: "info" },
    { category: [ "logtape", "meta" ], sinks: ["console"], lowestLevel: "warning" },
  ],
});

// Run server
Deno.serve(api.fetch);
