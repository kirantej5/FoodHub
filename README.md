# FoodHub - MERN Stack Food Ordering App

![FoodHub Header](docs/screenshots/hero.jpg)

FoodHub is a complete, full-stack food ordering platform built using the MERN stack (MongoDB, Express, React, Node.js). It provides a seamless experience for users to browse restaurants, add foods to their cart, and place orders. 

## 🚀 Features

### User Features
*   **Authentication & Authorization:** JWT-based login and registration.
*   **Food Discovery:** Browse popular and featured foods.
*   **Restaurant Browsing:** View foods by specific restaurants.
*   **Shopping Cart:** Persistent cart state using Zustand.
*   **Checkout & Orders:** Place orders and track order history.
*   **Profile Management:** Manage user details and wishlist.

### Admin Features (API)
*   **Dashboard Statistics:** View total orders, users, and revenue.
*   **User Management:** View and manage registered users.
*   **Food & Menu Management:** Add, update, or remove foods.
*   **Order Management:** Track and update order statuses.

## 🛠️ Technology Stack

*   **Frontend:** React (Vite), React Router DOM, Zustand (State Management), TailwindCSS
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB, Mongoose
*   **Authentication:** JSON Web Tokens (JWT), bcryptjs
*   **Image Uploads:** Cloudinary (Optional/Supported), Multer

## 📦 Project Structure

\`\`\`
FoodHub/
├── client/          # React Frontend (Vite)
│   ├── src/
│   │   ├── api/     # Axios API configuration
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/   # Page components
│   │   ├── store/   # Zustand state stores
│   │   └── App.jsx
├── server/          # Express Backend
│   ├── config/      # DB and Swagger config
│   ├── controllers/ # Route handlers
│   ├── models/      # Mongoose schemas
│   ├── routes/      # Express routes
│   └── tests/       # API Tests
└── docs/            # Screenshots and documentation
\`\`\`

## ⚙️ Installation & Setup

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/kirantej5/FoodHub.git
   cd FoodHub
   \`\`\`

2. **Backend Setup:**
   \`\`\`bash
   cd server
   npm install
   cp .env.example .env  # Update variables in .env
   npm run seed          # Populates database with dummy data
   npm run dev
   \`\`\`

3. **Frontend Setup:**
   \`\`\`bash
   cd client
   npm install
   cp .env.example .env  # Update VITE_API_URL if needed
   npm run dev
   \`\`\`

4. **Demo Credentials**
   The `npm run seed` command creates an admin user:
   - **Email:** `admin@foodhub.com`
   - **Password:** `Admin@123456`

## 🧪 Testing

The backend includes tests powered by Jest.

\`\`\`bash
cd server
npm test
\`\`\`

## 🌐 API Documentation

Swagger API documentation is available when the server is running in development mode.
Navigate to: `http://localhost:5000/api-docs`

## 📄 License

This project is open-source and available under the MIT License.
