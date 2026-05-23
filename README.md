# Mensah

Mensah is a two-sided web application designed for tailors, seamstresses, and clothing sellers in West African fashion markets. It allows tailors to showcase their work through interactive 3D garment previews or high-quality photo galleries, while giving customers a modern, premium browsing and ordering experience.

## Tech Stack

- **React 18 & Vite**: For a fast, modern frontend.
- **Three.js & React Three Fiber**: Powers the interactive 3D garment viewer.
- **Framer Motion & Lottie**: Provides high-end cinematic animations and micro-interactions.
- **Vercel Serverless (Express)**: Unified backend API and frontend hosting.
- **Turso (SQLite)**: Serverless database for persistent storage of listings and orders.
- **Drizzle ORM**: Type-safe database interactions.
- **Cloudinary**: Direct-to-browser image storage for fabric swatches and photos.
- **Paystack**: Secure inline payments for the West African market.
- **Resend**: Automated email notifications for order confirmations.

## Prerequisites

- **Node.js**: Version 18 or later. [Download](https://nodejs.org/)
- **Turso CLI**: For database management. [Install](https://docs.turso.tech/cli)
- **Cloudinary Account**: For image hosting. [Sign Up](https://cloudinary.com/signup)
- **Paystack Account**: For payment processing. [Sign Up](https://dashboard.paystack.com/#/signup)
- **Resend Account**: For email delivery. [Sign Up](https://resend.com/signup)

## Local Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd Tailored
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env.local` and fill in all required keys:
   ```bash
   cp .env.example .env.local
   ```

4. **Initialize Database**:
   Login to Turso, create a database, and push the schema:
   ```bash
   turso auth login
   turso db create mensah
   npm run db:push
   ```

5. **Start Development**:
   Run the frontend and API:
   ```bash
   npm run dev
   # In another terminal
   vercel dev
   ```

## Codebase Structure

- `src/pages`: Application views (Guest Home, Viewer, Tailor Dashboard, etc.)
- `src/components`: Reusable UI elements, subdivided by feature (hero, viewer, listing, order, share).
- `src/db`: Drizzle schema definitions.
- `src/hooks`: Custom React hooks for 3D textures, Cloudinary, and Paystack.
- `api`: Express-based serverless functions for the backend.
- `public/models/garments`: 3D model files (.glb).

## Adding a New Garment Type

1. Add the `.glb` model to `public/models/garments/[id].glb`.
2. Add a configuration entry to `src/config/garmentConfig.json` (UV repeat/wrap settings).
3. Add the garment ID to the Zod validation schema in `api/index.js`.
4. The new garment will automatically appear in the Tailor's creation flow.

## Deploying to Vercel

1. Push your code to a GitHub repository.
2. Import the project into the [Vercel Dashboard](https://vercel.com/dashboard).
3. Add all environment variables from `.env.local` to the Vercel Project Settings.
4. Deploy. Vercel will handle the frontend build and the serverless functions in the `api` folder automatically.

## Known Limitations

- Vercel Hobby plan has a 10-15 second execution timeout for serverless functions.
- Turso free tier provides 9GB of storage and 1 billion row reads.
- Cloudinary free tier includes 25GB of storage/bandwidth.
- Resend free tier allows for 3,000 emails per month.
