# GeoPub
Geospatial Activity Pub backend.

# Table Of Contents
- [Development](#development)

# Development
## HTTP API
There is an auxiliary HTTP API which implements functionality which is not part of activity pub.

To view a Swagger docs page go to `/api/docs` (or `/api/openapi.json` for the machine readable file).

## Database
Postgres with PostGIS is run via Docker Compose. 

To initialize the Postgres instance run:

``` shell
deno run prisma:migrate
```

To regenerate just the Prisma Client run:

``` shell
deno run prisma:generate
```

To wipe your development database:

``` shell
deno run prisma:generate:reset
```

To create a new migration based on new model changes:

``` shell
deno run prisma:migrate:create
```
