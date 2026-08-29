# FoodHub

> A full-stack online food ordering web application built with the MERN stack.

**Status:** Project complete — Backend API and React Frontend are fully implemented.

## Tech Stack

| Layer      | Technologies                          |
|------------|---------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS, Zustand |
| Backend    | Node.js, Express.js                   |
| Database   | MongoDB, Mongoose                     |
| Auth       | JWT, bcrypt                           |

## Project Structure

```
FoodHub/
├── client/          # React frontend
└── server/          # Express API
    ├── config/      # Database configuration
    ├── controllers/ # Route logic
    ├── models/      # Mongoose schemas
    ├── middleware/  # Auth, validation, upload, errors
    ├── routes/      # API endpoints
    ├── seed/        # Database seeding script
    └── server.js    # Entry point
```

## Setup Instructions

### 1. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI if needed
npm install
npm run seed  # Populates database with dummy restaurants, foods, coupons, and admin user
npm run dev
```

The server runs on `http://localhost:5000`. API docs available at `/api/docs`.

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The React app runs on `http://localhost:5173`.

### 3. Demo Credentials

The `npm run seed` command creates an admin user:
- **Email:** `admin@foodhub.com`
- **Password:** `Admin@123456`

You can use the coupon code `WELCOME50` or `FLAT100` during checkout.

## License

MIT — see [LICENSE](./LICENSE).
