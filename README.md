
# Affiliate Tracking Task

## System Overview

This project is a working MVP for affiliate tracking. It allows affiliates to track clicks and conversions, view their dashboard, and set up postback URLs for conversion notifications.

### What is a Postback?
A postback is a server-to-server callback triggered when a conversion event occurs (e.g., a sale or signup). The system sends a request to the affiliate's postback URL, notifying them of the conversion in real time.

## Deliverables

- Click endpoint
- Postback endpoint
- Database schema (Postgres)
- Affiliate dashboard with conversions
- Affiliate postback URL display
- Clean commit history (Git)
- README.md with system overview, setup instructions, and example API requests

## Tech Stack

- Next.js (frontend & API routes)
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- pnpm

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YoAayush/affiliate-tracking-task.git
cd affiliate-tracking-task
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up PostgreSQL
- Install PostgreSQL and create a database (e.g., `affiliate_db`).
- Update `.env.example` with your DB credentials, then copy to `.env`:
   ```bash
   cp .env.example .env
   # Edit .env with your DB connection string
   ```

### 4. Run database migrations
```bash
pnpm prisma migrate dev
```

### 5. Start backend/frontend locally
```bash
pnpm dev
```

### 6. Access the app
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- In frontend code, use:
   ```js
   const origin = window.location.origin;
   ```
   to get the app's base URL dynamically.

## Database Schema

See `prisma/schema.prisma` for the full schema definition.

## Example API Requests

## API Details

### 1. Affiliates
**POST /api/affiliates**
Create a new affiliate.
Request body:
```json
{
   "affiliateName": "John Doe"
}
```
Response: Affiliate object

**GET /api/affiliates**
Fetch all affiliates.
Response: Array of affiliate objects

---

### 2. Campaigns
**POST /api/campaigns**
Create a new campaign.
Request body:
```json
{
   "campaignName": "Summer Sale"
}
```
Response: Campaign object

**GET /api/campaigns**
Fetch all campaigns.
Response: Array of campaign objects

---

### 3. Clicks
**GET /api/click?affiliate_id=...&campaign_id=...&click_id=...**
Track a click for an affiliate and campaign. `click_id` is optional (auto-generated if omitted).
Response: Click object

---

### 4. Postback (Conversion)
**GET /api/postback?affiliate_id=...&click_id=...&amount=...&currency=...**
Track a conversion for a click. `amount` and `currency` are optional.
Response: Conversion object, affiliate, and campaign details

---

### 5. Get Affiliate Clicks
**GET /api/getAffiliateData/[affiliate_id]/clicks**
Fetch all clicks for an affiliate.
Response: Array of click objects (with campaign info)

---

### 6. Get Affiliate Conversions
**GET /api/getAffiliateData/[affiliate_id]/conversions**
Fetch all conversions for an affiliate's clicks.
Response: Array of conversion objects

---

## Example API Requests

### Create Affiliate
```http
POST /api/affiliates
Content-Type: application/json

{
   "affiliateName": "John Doe"
}
```

### Create Campaign
```http
POST /api/campaigns
Content-Type: application/json

{
   "campaignName": "Summer Sale"
}
```

### Track Click
```http
GET /api/click?affiliate_id=123&campaign_id=456
```

### Track Conversion (Postback)
```http
GET /api/postback?affiliate_id=123&click_id=abc123&amount=10.00&currency=USD
```

### Get Affiliate Clicks
```http
GET /api/getAffiliateData/123/clicks
```

### Get Affiliate Conversions
```http
GET /api/getAffiliateData/123/conversions
```

## Project Structure

- `src/app/` — Next.js app routes and pages
- `src/components/ui/` — Reusable UI components
- `src/lib/` — Utility functions and Prisma client
- `prisma/` — Prisma schema

## Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm prisma migrate dev` — Run migrations

## License

MIT
