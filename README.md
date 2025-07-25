# TrimSlots - Barber Booking System

A comprehensive booking system for barber shops with role-based access control.

## Features

- **Authentication**: Secure login and signup with JWT and NextAuth
- **Role-Based Access Control**: Four distinct roles:
  - **Admin**: Manage all businesses on the platform
  - **Business Owner**: Manage workers and clients
  - **Worker**: Manage schedule and appointments
  - **Client**: Book appointments and manage profile
- **PostgreSQL Database**: Robust data storage with Prisma ORM

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your environment variables in `.env` file
4. Initialize the database:
   ```
   npm run db:push
   ```
5. Seed the database with the super admin:
   ```
   npm run db:seed
   ```
6. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/barberbooking?schema=public"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL_INTERNAL=http://localhost:3000

# Super Admin
SUPERADMIN_EMAIL=admin@example.com
SUPERADMIN_PASSWORD=securepassword

# App Configuration
PORT=3001
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (if using payment processing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-publishable-key
STRIPE_SECRET_KEY=your-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
PLATFORM_FEE_PERCENTAGE=1
```

## Project Structure

- `/src/app`: Next.js app router pages
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and configurations
- `/src/prisma`: Prisma schema and client
- `/src/models`: TypeScript interfaces and types

## License

This project is licensed under the MIT License.
#   T r i m S l o t s  
 