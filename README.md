# Mini Logistics & Order Management System

Full-stack monorepo for a logistics order portal with JWT authentication, customer order management, admin order status control, and MongoDB persistence.

## Features

- Customer signup/login with JWT access token in the `Authorization` header.
- Admin signup protected by `x-admin-key`.
- Customers can create, view, paginate, and cancel eligible orders.
- Admins can view all orders, filter by status, search by order ID, and progress statuses forward only.
- React Router protected routes, session storage auth, axios interceptors, reusable UI components, and toast notifications.

## Prerequisites

- Node.js 22 LTS recommended
- MongoDB 6+
- npm

## Setup

1. Clone or open this repository.
2. Install backend dependencies:
   ```bash
   cd logistics-app/backend
   npm install
   ```
3. Create `backend/.env` from `backend/.env.example`.
4. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
5. Create `frontend/.env` from `frontend/.env.example`.
6. Ensure MongoDB is running.
7. Seed the database:
   ```bash
   cd ../backend
   npm run seed
   ```
8. Start the backend:
   ```bash
   npm run dev
   ```
9. Start the frontend in another terminal:
   ```bash
   cd logistics-app/frontend
   npm run dev
   ```

## Environment

Backend `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/logistics_db
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
ADMIN_SIGNUP_KEY=secret_admin_key
CLIENT_ORIGIN=http://localhost:5173
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000
```

## API Reference

| Method | Path | Role | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | Public | Create customer or admin account. Admin requires `x-admin-key`. |
| POST | `/api/auth/login` | Public | Log in and receive token plus user profile. |
| POST | `/api/orders` | Customer | Create a pending order. |
| GET | `/api/orders` | Customer/Admin | Customers see own orders; admins see all with status/search filters. |
| GET | `/api/orders/:id` | Customer/Admin | Fetch one order. Customers must own it. |
| PATCH | `/api/orders/:id/cancel` | Customer | Cancel pending or confirmed order. |
| PATCH | `/api/orders/:id/status` | Admin | Move status forward: `PENDING` to `CONFIRMED` to `SHIPPED` to `DELIVERED`. |

## Folder Structure

```text
logistics-app/
  backend/
    src/config/       Database connection and environment validation
    src/middleware/   Auth, role checks, validation, global errors
    src/modules/      Auth and order controllers, services, routes
    src/models/       Mongoose User and Order models
    scripts/          Seed script
  frontend/
    src/api/          Axios instance and endpoint functions
    src/components/   Button, Input, Badge, Table, Spinner, Modal, Pagination, Toast
    src/context/      Auth and toast providers
    src/pages/        Login, Signup, Dashboard, Orders, Create Order, Detail, Admin Orders
```

## Creating an Admin Account

Send `POST /api/auth/signup` with `role: "admin"` and a header matching your backend env value:

```http
x-admin-key: secret_admin_key
```

The frontend signup page shows an admin key field when `Admin` is selected.

## Default Seed Credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@logistics.com` | `Admin@123` |
| Customer | `customer@logistics.com` | `Customer@123` |

## Start Commands

- Backend: `npm run dev`
- Frontend: `npm run dev`

## Deployment

Recommended split deployment:

- Backend API: Render, Railway, or any Node.js web service.
- Frontend: Vercel, Netlify, or Render Static Site.
- Database: MongoDB Atlas.

### Backend Service

Use these settings:

```text
Root directory: backend
Build command: npm install
Start command: npm start
Node version: 22
```

Set these environment variables on the hosting provider:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=use_a_long_random_secret
JWT_EXPIRES_IN=7d
ADMIN_SIGNUP_KEY=use_a_private_admin_signup_key
CLIENT_ORIGIN=https://your-frontend-domain.com
```

You can use `backend/.env.production.example` as the production checklist. `CLIENT_ORIGIN` also accepts comma-separated frontend domains for preview deployments.

Do not set `PORT` unless the provider asks for it. Most Node hosts provide it automatically.

After deployment, test:

```text
https://your-backend-domain.com/health
```

It should return:

```json
{"status":"ok"}
```

### Frontend Site

Use these settings:

```text
Root directory: frontend
Build command: npm install && npm run build
Publish directory: dist
Node version: 22
```

Set this frontend environment variable:

```env
VITE_API_URL=https://your-backend-domain.com
```

You can use `frontend/.env.production.example` as the production checklist.

The frontend includes SPA routing config for Vercel (`vercel.json`), Netlify (`netlify.toml` and `public/_redirects`), so direct page refreshes on routes like `/orders` should work after deployment.

### Important Security Notes

- Never commit or share `backend/.env`; it contains real database credentials.
- Rotate the MongoDB password if the connection string has been exposed publicly.
- Keep `backend/.env.example` as placeholders only.

## Troubleshooting

- If you see `spawn EPERM` while starting Vite or the backend watcher on Windows, switch to Node.js 22 LTS and reinstall dependencies with `npm install` in both `backend` and `frontend`.
- If the backend logs `connect ECONNREFUSED ::1:27017`, the app is trying to use a local MongoDB server. Start MongoDB locally, or set `backend/.env` `MONGODB_URI` to your MongoDB Atlas connection string.
- If deployed frontend requests fail with CORS errors, make sure backend `CLIENT_ORIGIN` matches your frontend URL, including `https://`.
