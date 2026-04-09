# Internal Tooling API

Backend API for the internal schema CRUD console.

## Run

From repo root:

```bash
node "Child Nutrition App/internal-tooling-api/server.js"
```

Open:

- `http://localhost:8787/` - internal tooling UI
- `http://localhost:8787/api/schema` - schema endpoint

## API

- `GET /api/schema`
- `GET /api/:entity`
- `POST /api/:entity`
- `PUT /api/:entity/:id`
- `DELETE /api/:entity/:id`
- `POST /api/reset`

Data is persisted in `Child Nutrition App/internal-tooling-api/db.json`.
