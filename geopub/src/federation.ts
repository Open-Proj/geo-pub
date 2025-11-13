import { createFederation, Person } from "@fedify/fedify";
import { PostgresKvStore, PostgresMessageQueue } from "@fedify/postgres";
import postgres from "postgres";
import { getUserByPublicID } from "./repos/user.ts";

import { CFG } from "./config.ts";

export const federation = createFederation<void>({
  kv: new PostgresKvStore(postgres(CFG.POSTGRES_URI)),
  queue: new PostgresMessageQueue(postgres(CFG.POSTGRES_URI)),
});

federation.setActorDispatcher("/users/{identifier}", async (ctx, identifier) => {
  const user = await getUserByPublicID(identifier);
  if (user === undefined) {
    return null;
  }

  return new Person({
    id: ctx.getActorUri(identifier),
    name: user.name,
    summary: user.summary,
    preferredUsername: user.username,
    url: new URL("/", ctx.url),
  });
});
