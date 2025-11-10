import express from "express";
import { integrateFederation } from "@fedify/express";
import { getLogger } from "@logtape/logtape";
import federation from "./federation.ts";
import { createPondering, getNearbyPonderings } from "./database.ts";

const logger = getLogger("geopub");

export const app = express();

app.set("trust proxy", true);

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Custom routes with JSON parsing (before Fedify middleware)
const customRouter = express.Router();
customRouter.use(express.json());

customRouter.get("/", (req, res) => res.send("Hello, Fedify!"));

customRouter.post("/users/:identifier/ponder", async (req, res) => {
  const { identifier } = req.params;
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng required in request body" });
  }

  const visionText = "the orb sees nothing";

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const noteId = `${baseUrl}/users/${identifier}/posts/${Date.now()}`;

  await createPondering(visionText, lat, lng);

  logger.info(`${identifier} is pondering their orb at ${lat}, ${lng}...`);

  res.json({
    pondered: true,
    identifier,
    location: { lat, lng },
    vision: {
      "@context": [
        "https://www.w3.org/ns/activitystreams",
        {
          "toot": "http://joinmastodon.org/ns#",
          "emojiReactions": {
            "@id": "fedibird:emojiReactions",
            "@type": "@id"
          }
        }
      ],
      "id": noteId,
      "type": "Note",
      "attributedTo": `${baseUrl}/users/${identifier}`,
      "content": visionText,
    },
    timestamp: new Date().toISOString(),
  });
});

customRouter.get("/visions/near", async (req, res) => {
  const lat = Number.parseFloat(req.query.lat as string);
  const lng = Number.parseFloat(req.query.lng as string);
  const radius = Number.parseFloat(req.query.radius as string) || 50000; // default 50km

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ error: "lat and lng query parameters required" });
  }

  const visions = await getNearbyPonderings(lat, lng, radius);

  res.json({
    location: { lat, lng },
    radius,
    count: visions.length,
    visions,
  });
});

app.use(customRouter);

// Fedify middleware comes after custom routes
app.use(integrateFederation(federation, (_req) => undefined));

export default app;
