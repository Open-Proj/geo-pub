import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

export async function initDatabase() {
  await sql`CREATE EXTENSION IF NOT EXISTS postgis`;

  await sql`
    CREATE TABLE IF NOT EXISTS ponderings (
      id SERIAL PRIMARY KEY,
      pondering TEXT NOT NULL,
      location GEOMETRY(POINT, 4326) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_ponderings_location ON ponderings USING GIST (location)`;
}

export async function createPondering(pondering: string, lat: number, lng: number) {
  const [result] = await sql`
    INSERT INTO ponderings (pondering, location)
    VALUES (${pondering}, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    RETURNING id, pondering, ST_Y(location) as lat, ST_X(location) as lng, created_at
  `;
  return result;
}

export async function getNearbyPonderings(lat: number, lng: number, radiusM: number) {
  return await sql`
    SELECT id, pondering, ST_Y(location) as lat, ST_X(location) as lng, created_at
    FROM ponderings
    WHERE ST_DWithin(
      location::geography, 
      ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)::geography, 
      ${radiusM}
    )
    ORDER BY created_at DESC
  `;
}

export { sql };