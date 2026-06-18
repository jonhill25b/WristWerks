# Wrist Werks

Tactical paracord bracelet e-commerce platform — handcrafted gear, built to last.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Products](#products)
  - [Orders](#orders)
  - [Users (Admin)](#users-admin)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Admin Access](#admin-access)
- [License](#license)

---

## Overview

Wrist Werks is a full-stack e-commerce application for a paracord bracelet business. Customers can browse pre-made bracelets, build custom orders, manage their cart, and track order history. Admins get a full dashboard to manage products, orders, and users.

The frontend is a React SPA with dark/light theme support. The backend is a REST API built with Express and Prisma ORM on PostgreSQL. The project is configured for deployment to Vercel.

## Tech Stack

| Layer       | Technology                                          |
|-------------|-----------------------------------------------------|
| Frontend    | React 19, TypeScript, Vite 6, Tailwind CSS v4       |
| Backend     | Node.js, Express 4, TypeScript (tsx)                |
| Database    | PostgreSQL via Prisma 6 ORM                         |
| Auth        | JWT (jsonwebtoken), bcryptjs password hashing       |
| State       | Zustand (cart), React Context (auth, theme)         |
| Validation  | Zod schemas on all input routes                     |
| File Upload | Multer (product images, 5 MB max, jpg/png/webp/gif) |
| Email       | Resend API (optional, for password reset)           |
| Deployment  | Vercel (frontend as static build, backend as Node)  |

## Features

**Customer-facing:**
- Browse pre-made paracord bracelets with category and search filtering
- Product detail pages with image gallery
- Custom bracelet builder (colors, weave style, charms)
- Shopping cart with add/remove/quantity controls
- Checkout with shipping info and payment method selection
- Order history and order detail tracking
- User registration and login with JWT auth
- Dark/light theme toggle (persisted to localStorage)
- Fully responsive layout with mobile hamburger menu

**Admin dashboard:**
- Product management: create, edit, delete products with image uploads
- Order management: view all orders, update status (Pending → Processing → Shipped → Delivered / Cancelled)
- User management: list, view, edit roles, delete users
- Role-based access control (CUSTOMER vs ADMIN)

## Project Structure

```
Wrist_Werks/
├── package.json              # Root scripts: dev (concurrently), build, db:push, db:seed
├── vercel.json               # Vercel deployment config (routes + builds)
├── .env.example              # Environment variable template
├── .gitignore
├── WristWerks_Logo.jpg       # Brand logo
│
├── backend/
│   ├── package.json          # Express, Prisma, bcryptjs, jsonwebtoken, multer, zod, resend
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma     # Database models: User, Product, Order, OrderItem, PasswordReset
│   │   └── seed.ts           # Seeds admin user + 6 sample products
│   ├── src/
│   │   ├── index.ts          # Express app entry point, route mounting, health check
│   │   ├── lib/
│   │   │   └── prisma.ts     # Singleton PrismaClient
│   │   ├── middleware/
│   │   │   ├── auth.ts       # JWT sign/verify, authMiddleware, adminMiddleware
│   │   │   └── upload.ts     # Multer config for image uploads
│   │   └── routes/
│   │       ├── auth.ts       # POST /register, /login, GET /me
│   │       ├── products.ts   # CRUD with image upload, public listing
│   │       ├── orders.ts     # Create, list, get, update status
│   │       └── users.ts      # Admin-only user management
│   └── uploads/              # Product image uploads (served statically)
│
└── frontend/
    ├── package.json          # React 19, Vite 6, Tailwind v4, react-router-dom v7, zustand
    ├── vite.config.ts        # Dev proxy: /api → :3001, /uploads → :3001
    ├── tsconfig.json
    ├── index.html
    ├── vercel.json
    ├── public/
    │   ├── favicon.svg
    │   └── logo.png
    └── src/
        ├── main.tsx          # React root mount
        ├── App.tsx           # Route definitions (17 routes)
        ├── index.css         # Tailwind imports + custom theme CSS variables
        ├── components/
        │   └── Layout.tsx    # Navbar, footer, theme toggle, cart badge
        ├── context/
        │   ├── AuthContext.tsx   # Login, register, logout, auto-restore session
        │   └── ThemeContext.tsx  # Dark/light mode with localStorage persistence
        ├── store/
        │   └── cart.ts      # Zustand cart store (add, remove, updateQty, clear)
        ├── lib/
        │   └── api.ts       # Typed fetch wrapper for all API endpoints
        └── pages/
            ├── Home.tsx
            ├── Shop.tsx
            ├── ProductDetail.tsx
            ├── CustomBuilder.tsx
            ├── Cart.tsx
            ├── Checkout.tsx
            ├── Orders.tsx
            ├── OrderDetail.tsx
            ├── Login.tsx
            ├── Register.tsx
            ├── Contact.tsx
            └── admin/
                ├── Dashboard.tsx
                ├── Products.tsx
                ├── Orders.tsx
                └── Users.tsx
```

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** 14+ (local instance or hosted — e.g., Neon, Supabase, Railway)

### Installation

```bash
# Clone the repository
git clone https://github.com/jonhill25b/wrist-werks.git
cd wrist-werks

# Install all dependencies (root, frontend, backend)
npm install
```

This installs the root `concurrently` dev dependency, plus triggers `postinstall` which runs `npx prisma generate` in the backend.

### Database Setup

1. Create a PostgreSQL database (e.g., `wristwerks`).
2. Copy the environment template and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/wristwerks"
JWT_SECRET="a-long-random-secret-string"
```

3. Push the schema to your database:

```bash
npm run db:push
```

4. (Optional) Seed the database with an admin user and sample products:

```bash
npm run db:seed
```

This creates:
- Admin user: `admin@wristwerks.com` / `admin123`
- 6 sample paracord bracelet products
- 1 "Custom Bracelet" placeholder product for the builder

### Running Locally

```bash
npm run dev
```

This starts both servers concurrently:

| Service   | URL                   |
|-----------|-----------------------|
| Frontend  | http://localhost:5173 |
| Backend   | http://localhost:3001 |

The Vite dev server proxies `/api` and `/uploads` to the backend, so no CORS issues in development.

**Frontend only:** `npm run dev:frontend`
**Backend only:** `npm run dev:backend`

## Environment Variables

### Backend (`backend/.env`)

| Variable            | Required | Description                                      |
|---------------------|----------|--------------------------------------------------|
| `DATABASE_URL`      | Yes      | PostgreSQL connection string                     |
| `JWT_SECRET`        | Yes      | Secret key for signing JWT tokens                 |
| `CORS_ORIGIN`       | No       | Allowed CORS origin (default: `http://localhost:5173`) |
| `PORT`              | No       | Server port (default: `3001`)                     |
| `RESEND_API_KEY`    | No       | Resend API key for password reset emails          |
| `EMAIL_FROM`        | No       | Sender address for outgoing emails                |

### Frontend (`frontend/.env`)

| Variable            | Required | Description                                      |
|---------------------|----------|--------------------------------------------------|
| `VITE_API_URL`      | No       | API base URL (default: `""` — uses Vite proxy)   |

> **Note:** Do NOT set `VITE_API_URL` during development. The Vite proxy handles it. Only set it for production builds if the API is on a different origin.

## API Reference

All authenticated endpoints require a `Bearer` token in the `Authorization` header.

### Authentication

| Method | Path             | Auth | Description                     |
|--------|------------------|------|---------------------------------|
| POST   | `/api/auth/register` | No  | Create account. Body: `{ email, password, firstName, lastName }` |
| POST   | `/api/auth/login`    | No  | Login. Body: `{ email, password }`. Returns `{ token, user }` |
| GET    | `/api/auth/me`       | Yes | Get current user profile |

### Products

| Method | Path                | Auth | Description                     |
|--------|---------------------|------|---------------------------------|
| GET    | `/api/products`     | No   | List active products. Query: `?category=pre-made&search=black` |
| GET    | `/api/products/:id` | No   | Get single product by ID        |
| POST   | `/api/products`     | Admin | Create product. Multipart form: `name`, `description`, `price`, `stock`, `category`, `active`, `images[]` (max 5) |
| PATCH  | `/api/products/:id` | Admin | Update product. Same multipart format. |
| DELETE | `/api/products/:id` | Admin | Delete product                  |

### Orders

| Method | Path              | Auth | Description                     |
|--------|-------------------|------|---------------------------------|
| POST   | `/api/orders`     | Yes  | Create order. Body: `{ items: [{ productId?, quantity, name, price }], shippingName, shippingAddress, shippingCity, shippingState, shippingZip, paymentMethod?, note?, isCustomOrder?, customConfig? }` |
| GET    | `/api/orders`     | Yes  | List orders. Customers see own orders; admins see all. |
| GET    | `/api/orders/:id` | Yes  | Get order detail. Customers can only view their own. |
| PATCH  | `/api/orders/:id` | Admin | Update order status. Body: `{ status }` — valid: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED` |

### Users (Admin)

| Method | Path              | Auth | Description                     |
|--------|-------------------|------|---------------------------------|
| GET    | `/api/users`      | Admin | List all users                  |
| GET    | `/api/users/:id`  | Admin | Get single user                 |
| PATCH  | `/api/users/:id`  | Admin | Update user (`firstName`, `lastName`, `role`) |
| DELETE | `/api/users/:id`  | Admin | Delete user                     |

## Database Schema

**User** — `id`, `email` (unique), `passwordHash`, `firstName`, `lastName`, `role` (CUSTOMER | ADMIN), timestamps

**PasswordReset** — `id`, `token` (unique), `expiresAt`, `used`, `userId` (FK → User)

**Product** — `id`, `name`, `description`, `price`, `images` (string array), `stock`, `category` (default: "pre-made"), `active`, timestamps

**Order** — `id`, `status` (PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED), `total`, `paymentMethod` (default: "cashapp"), shipping fields (`shippingName`, `shippingAddress`, `shippingCity`, `shippingState`, `shippingZip`), `note`, `isCustomOrder`, `customConfig` (JSON), `userId` (FK → User), timestamps

**OrderItem** — `id`, `quantity`, `price`, `name`, `orderId` (FK → Order), `productId` (FK → Product, optional)

Relationships:
- User → Orders (one-to-many)
- User → PasswordResets (one-to-many)
- Order → OrderItems (one-to-many)
- Product → OrderItems (one-to-many, optional)

## Deployment

The project is configured for **Vercel** deployment via the root `vercel.json`:

- **Frontend** is built as a static site (`@vercel/static-build`) with output to `frontend/dist`.
- **Backend** runs as a Node.js serverless function (`@vercel/node`).
- Routes: `/api/*` and `/uploads/*` → backend; everything else → frontend static files.

### Deploy steps:

1. Push your code to GitHub.
2. Import the repo in Vercel.
3. Set environment variables in Vercel project settings:
   - `DATABASE_URL` — your production PostgreSQL URL
   - `JWT_SECRET` — a strong random string
4. Deploy.

> **Note:** The `backend/uploads/` directory uses local disk storage via Multer. On Vercel's serverless functions, the filesystem is ephemeral. For production, consider switching to cloud storage (e.g., AWS S3, Cloudinary) and updating the upload middleware accordingly.

## Admin Access

After seeding the database:

- **Email:** `admin@wristwerks.com`
- **Password:** `admin123`

Navigate to `/admin` in the app (visible in the navbar when logged in as admin) to access the dashboard.

## License

This project is for portfolio and demonstration purposes. All rights reserved.
