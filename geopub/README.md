# GeoPub
Geospatial Activity Pub backend.

# Table Of Contents
- [Development](#development)

# Development
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
