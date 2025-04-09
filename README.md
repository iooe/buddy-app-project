# Study Buddy Platform

A web application for university students to find study partners, connect with peers taking the same courses, and collaborate on academic projects.

## Features

- Find study partners based on course matches and compatibility
- Message other students directly in the platform
- View detailed profiles of potential study partners
- Manage your courses and academic preferences

## Technologies

- Next.js (App Router)
- React
- Prisma ORM
- NextAuth.js for authentication
- Tailwind CSS for styling

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- PostgreSQL database (or other database supported by Prisma)

## Installation

1. Clone the repository.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with your database connection string:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/study_buddy_db?schema=public"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

## Database Setup

1. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

2. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

3. Seed the database with initial data:
   ```bash
   node prisma/seed.js
   ```

4. (Optional) Explore your database with Prisma Studio:
   ```bash
   npx prisma studio
   ```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## License

This project is licensed under the MIT License.