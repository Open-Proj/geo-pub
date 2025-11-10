# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

geo-pub is a Geospatial ActivityPub implementation combining:
- **Backend (geopub/)**: Node.js/TypeScript server using Fedify for ActivityPub federation
- **Frontend (frontend/)**: React + Vite application with Leaflet for mapping
- **Database**: PostGIS/PostgreSQL for geospatial data storage

## Architecture

### Backend Structure (geopub/)
The backend is built on the Fedify framework for ActivityPub federation:
- **geopub/src/index.ts**: Entry point, starts Express server on port 8000
- **geopub/src/app.ts**: Express app configuration with Fedify integration
- **geopub/src/federation.ts**: Fedify federation setup with PostgreSQL storage
  - Uses `PostgresKvStore` for key-value storage
  - Uses `PostgresMessageQueue` for message queuing
  - Actor dispatcher at `/users/{identifier}` route
- **geopub/src/logging.ts**: LogTape logging configuration

### Frontend Structure (frontend/)
Standard Vite + React application:
- **frontend/src/main.tsx**: Application entry point
- **frontend/src/App.tsx**: Main app component (currently template code)
- **frontend/src/components/Map/Map.tsx**: Leaflet map component (in progress)

### Database
PostGIS-enabled PostgreSQL database configured in docker-compose.yaml:
- Image: `postgis/postgis:18-3.6-alpine`
- Default dev credentials: `geo-pub-dev:geo-pub-dev`
- Database name: `geo_pub_dev`
- Port: 5432

## Development Commands

### Backend (geopub/)
```bash
cd geopub
npm run dev    # Development with hot reload (tsx watch)
npm run prod   # Production mode
```
Both commands use `dotenvx` to load environment variables from `.env`.

### Frontend (frontend/)
```bash
cd frontend
npm run dev      # Start Vite dev server
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Database
```bash
# Start PostgreSQL with PostGIS
docker compose up -d

# Stop database
docker compose down
```

## Environment Variables

Backend requires `DATABASE_URL` in `geopub/.env`:
```
DATABASE_URL=postgresql://geo-pub-dev:geo-pub-dev@localhost:5432/geo_pub_dev
```

## Code Style

### Backend (geopub/)
- **Formatter**: Biome with 2-space indentation
- **Linter**: Biome with recommended rules enabled
- **Config**: geopub/biome.json
- Import organization is enabled

### Frontend (frontend/)
- **Linter**: ESLint with TypeScript and React plugins
- React Hooks and React Refresh plugins enabled

## TypeScript Configuration

### Backend
- Target: ESNext
- Module: NodeNext with NodeNext resolution
- Allows importing `.ts` extensions
- Strict mode enabled
- No emit (runtime via tsx)

### Frontend
- Project references split into app and node configs
- Standard Vite + React TypeScript setup

## Technology Stack

### Backend
- Fedify: ActivityPub framework
- Express: Web server
- PostgreSQL/PostGIS: Database with geospatial extensions
- LogTape: Logging
- tsx: TypeScript execution

### Frontend
- React 19
- Vite: Build tool and dev server
- Leaflet: Map visualization library
- TypeScript

## Development Workflow

1. Start database: `docker compose up -d`
2. Start backend: `cd geopub && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Backend runs at http://localhost:8000
5. Frontend runs at Vite's default port (typically 5173)
