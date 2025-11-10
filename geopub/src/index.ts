import app from "./app.ts";
import "./logging.ts";
import { initDatabase } from "./database.ts";

await initDatabase();

app.listen(8000, () => {
  console.log("Server started at http://localhost:8000");
});
