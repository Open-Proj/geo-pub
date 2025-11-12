import { createFederation } from "@fedify/fedify";
import { PostgresKvStore, PostgresMessageQueue } from "@fedify/postgres";
import postgres from "postgres";

import { CFG } from "./config.ts";

export const federation = createFederation<void>({
  kv: new PostgresKvStore(postgres(CFG.POSTGRES_URI)),
  queue: new PostgresMessageQueue(postgres(CFG.POSTGRES_URI)),
});
