# FoodHub Client

The React/Vite frontend for the FoodHub food-ordering platform.

## Run it

From the repository root:

```bash
npm run install:all
```

Copy `client/.env.example` to `client/.env`, then start the frontend and backend together:

```bash
npm run dev
```

The frontend runs at <http://localhost:5173> and proxies `/api` requests to the backend at port 5000.

## Useful commands

```bash
npm run dev
npm run build
npm run lint
npm test
```

See the [root README](../README.md) for database setup, seed data, API documentation, and demo credentials.
