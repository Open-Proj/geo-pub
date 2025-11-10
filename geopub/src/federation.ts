import { createFederation, Person } from "@fedify/fedify";
import { getLogger } from "@logtape/logtape";
import { PostgresKvStore, PostgresMessageQueue } from "@fedify/postgres";
import postgres from "postgres";

const logger = getLogger("geopub");

const federation = createFederation({
  kv: new PostgresKvStore(postgres(process.env.DATABASE_URL)),
  queue: new PostgresMessageQueue(postgres(process.env.DATABASE_URL)),
});

federation.setActorDispatcher("/users/{identifier}", async (ctx, identifier) => {
  return new Person({
    id: ctx.getActorUri(identifier),
    preferredUsername: identifier,
    name: identifier,
  });
});

export default federation;
