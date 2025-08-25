# Affiliate Tracking Task

A modern web application for managing affiliate campaigns, tracking clicks and conversions, and generating postback URLs. Built with Next.js, TypeScript, and Prisma.

## Features

- Affiliate dashboard with campaign and performance stats
- Campaign management
- Click and conversion tracking via API routes
- Postback URL generation for affiliates
- Modern UI components

## Tech Stack

- Next.js
- TypeScript
- Prisma (with PostgreSQL or other supported DB)
- Tailwind CSS (via PostCSS)
- pnpm for package management

## Getting Started

1. **Install dependencies:**

   ```
   pnpm install
   ```

2. **Set up environment variables:**

   - Copy `.env.example` to `.env` and update DB connection details.

3. **Run database migrations:**

   ```
   pnpm prisma migrate dev
   ```

4. **Start the development server:**

   ```
   pnpm dev
   ```

5. **Access the app:** - Open [http://localhost:3000](http://localhost:3000) in your browser. - In your frontend code, you can get the app's origin dynamically using:
   `js
		 const origin = window.location.origin;
		 `
   This will always provide the correct base URL, whether running locally or in production.

## Project Structure

- `src/app/` — Next.js app routes and pages
- `src/components/ui/` — Reusable UI components
- `src/lib/` — Utility functions and Prisma client
- `prisma/` — Prisma schema

## API Endpoints

- `/api/affiliates`
- `/api/campaigns`
- `/api/click`
- `/api/postback`
- `/api/getAffiliateData/[affiliate_id]/clicks`
- `/api/getAffiliateData/[affiliate_id]/conversions`

## Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm prisma migrate dev` — Run migrations

## License

MIT
