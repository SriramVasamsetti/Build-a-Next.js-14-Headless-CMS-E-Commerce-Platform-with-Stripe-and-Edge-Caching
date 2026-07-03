# E-Commerce Platform

A production-grade e-commerce platform built with Next.js 14 App Router, JavaScript, Tailwind CSS, Prisma, PostgreSQL, Stripe Checkout, Sanity CMS, and Docker.

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Architecture](#architecture)
3.  [Setup](#setup)
4.  [Docker Usage](#docker-usage)
5.  [CMS Integration (Sanity)](#cms-integration-sanity)
6.  [Stripe Integration](#stripe-integration)
7.  [ISR and Cache Tags](#isr-and-cache-tags)
8.  [Revalidation API](#revalidation-api)
9.  [Test Credentials](#test-credentials)
10. [Environment Variables](#environment-variables)
11. [Deployment Steps](#deployment-steps)
12. [Security Considerations](#security-considerations)
13. [Folder Structure](#folder-structure)
14. [Common Troubleshooting](#common-troubleshooting)

## 1. Project Overview

This project is a full-featured e-commerce platform designed for high performance, SEO, and scalability. It leverages modern web technologies to provide a seamless shopping experience.

**Key Features:**

*   Product listing and detail pages
*   Shopping cart functionality with Zustand
*   Secure checkout process with Stripe
*   Order management
*   Content management with Sanity CMS
*   User authentication with NextAuth (credentials provider)
*   Optimized for SEO and Lighthouse scores
*   Containerized with Docker for easy deployment

## 2. Architecture

The platform follows a modern full-stack architecture:

*   **Frontend:** Next.js 14 App Router (Server Components for data fetching, Client Components for interactivity), Tailwind CSS for styling.
*   **Backend:** Next.js API Routes and Server Actions for handling business logic, authentication, and API interactions.
*   **Database:** PostgreSQL, managed by Prisma ORM.
*   **CMS:** Sanity.io for product content management.
*   **Payments:** Stripe for secure payment processing.
*   **State Management:** Zustand for client-side cart state.
*   **Containerization:** Docker and Docker Compose for development and production environments.

## 3. Setup

To get the project running locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ecommerce-platform.git
    cd ecommerce-platform
    ```

2.  **Install pnpm:**
    ```bash
    npm install -g pnpm
    ```

3.  **Install dependencies:**
    ```bash
    pnpm install
    ```

4.  **Configure Environment Variables:**
    Copy the `.env.example` file to `.env.local` and fill in the values.

    ```bash
    cp .env.example .env.local
    ```

    *   `DATABASE_URL`: Your PostgreSQL connection string. When using Docker Compose, this will be `postgresql://user:password@db:5432/mydb?schema=public`.
    *   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (e.g., `pk_test_...`).
    *   `STRIPE_SECRET_KEY`: Your Stripe secret key (e.g., `sk_test_...`).
    *   `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret for verifying webhook events (e.g., `whsec_...`).
    *   `CMS_API_URL`: Your Sanity GraphQL API endpoint (e.g., `https://<project-id>.sanity.studio/api/2023-08-01/graphql/production/default`).
    *   `CMS_API_KEY`: A Sanity read token (if your dataset is private).
    *   `CMS_WEBHOOK_SECRET`: A secret for Sanity webhooks to trigger revalidation.
    *   `NEXTAUTH_SECRET`: A long, random string for NextAuth session encryption. Generate one with `openssl rand -base64 32`.
    *   `NEXTAUTH_URL`: The base URL of your application (e.g., `http://localhost:3000`).

5.  **Database Setup (without Docker):**
    If you're not using Docker Compose for the database, ensure you have a PostgreSQL instance running and update `DATABASE_URL` in `.env.local`.
    Then, run Prisma migrations and seed the database:
    ```bash
    npx prisma migrate deploy
    npx prisma db seed
    ```

6.  **Run the development server:**
    ```bash
    pnpm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 4. Docker Usage

The project includes `Dockerfile` and `docker-compose.yml` for easy setup and deployment.

1.  **Build and run the Docker containers:**
    ```bash
    docker compose up --build
    ```
    This command will:
    *   Build the `app` image.
    *   Start the `db` (PostgreSQL) service.
    *   Wait for the `db` service to be healthy.
    *   Run Prisma migrations (`npx prisma migrate deploy`).
    *   Seed the database (`npx prisma db seed`).
    *   Start the Next.js application.

2.  **Access the application:**
    The application will be available at [http://localhost:3000](http://localhost:3000).

3.  **Stop the containers:**
    ```bash
    docker compose down
    ```

## 5. CMS Integration (Sanity)

This platform integrates with Sanity.io for managing product content.

**Sanity Schema:**
Ensure your Sanity project has a `product` schema with the following fields:

*   `name` (string)
*   `description` (text)
*   `price` (number)
*   `stock` (number)
*   `images` (array of image)
*   `variants` (array of objects, e.g., `[{ type: 'color', value: 'red' }]`)
*   `slug` (slug, unique)

The `lib/cms.js` file contains the Sanity client configuration and example GraphQL queries to fetch product data.

## 6. Stripe Integration

Stripe is used for processing payments.

*   **Checkout Session:** When a user proceeds to checkout, a Stripe Checkout Session is created via the `/api/checkout` API route. This redirects the user to a secure Stripe-hosted page to complete the payment.
*   **Webhooks:** After a successful payment, Stripe sends a `checkout.session.completed` webhook event to `/api/webhooks/stripe`. This webhook is crucial for:
    *   Verifying the Stripe signature to ensure the request is legitimate.
    *   Creating an `Order` and `OrderItem` in your PostgreSQL database.
    *   Updating product stock.

**Important:** For local development, you'll need a tool like `stripe listen` or `ngrok` to expose your local webhook endpoint to Stripe.

## 7. ISR and Cache Tags

*   **Incremental Static Regeneration (ISR):** Product detail pages (`/products/[slug]`) use ISR with `export const revalidate = 60`. This means the page will be re-generated at most every 60 seconds if a request comes in.
*   **Next.js Cache Tags:** The `lib/cache.js` utility uses `unstable_cache` and `revalidateTag` to manage data caching. Product data fetched from the CMS is tagged with `'products'`. This allows for on-demand revalidation.

## 8. Revalidation API

A dedicated API route `/api/revalidate` is available to trigger on-demand revalidation of cached data.

*   **Endpoint:** `POST /api/revalidate`
*   **Body:**
    ```json
    {
      "secret": "ecommerce-secret",
      "tag": "products"
    }
    ```
*   **Authentication:** The `secret` in the request body must match `CMS_WEBHOOK_SECRET` in your environment variables.
*   **Functionality:** If the secret is valid, `revalidateTag(tag)` is called, clearing the cache for the specified tag (e.g., 'products'). This is useful for triggering revalidation from your CMS whenever product data changes.

## 9. Test Credentials

For testing authentication:

*   **Email:** `test.user@example.com`
*   **Password:** `Password123!`

These credentials are automatically seeded into the database when Docker Compose starts or when `npx prisma db seed` is run.

## 10. Environment Variables

Ensure the following environment variables are set in your `.env.local` file:

```ini
DATABASE_URL="postgresql://user:password@db:5432/mydb?schema=public"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
CMS_API_URL=https://your-sanity-project-id.sanity.studio/api/2023-08-01/graphql/production/default
CMS_API_KEY=your_sanity_read_token
CMS_WEBHOOK_SECRET=ecommerce-secret
NEXTAUTH_SECRET=your_nextauth_secret_long_random_string
NEXTAUTH_URL=http://localhost:3000
```

## 11. Deployment Steps

1.  **Set up your PostgreSQL database:** Ensure you have a production-ready PostgreSQL instance.
2.  **Configure Sanity CMS:** Set up your Sanity project and populate it with product data.
3.  **Configure Stripe:** Obtain your publishable key, secret key, and webhook secret.
4.  **Environment Variables:** Set all required environment variables in your deployment platform (Vercel, Netlify, Docker host, etc.).
5.  **Build:** Run `pnpm run build` to create the optimized production build.
6.  **Run:** Start the application using `pnpm start`. If deploying with Docker, ensure your Docker environment is configured to use the `Dockerfile` and `docker-compose.yml` (or equivalent Kubernetes manifests).
7.  **Webhooks:** Configure Stripe and Sanity webhooks to point to your deployed application's webhook URLs (`/api/webhooks/stripe` and `/api/revalidate`).

## 12. Security Considerations

*   **Environment Variables:** Never commit sensitive keys (`STRIPE_SECRET_KEY`, `NEXTAUTH_SECRET`, `CMS_API_KEY`) directly into your codebase. Use `.env.local` for local development and your deployment platform's secret management for production.
*   **Password Hashing:** User passwords are hashed using `bcrypt` before being stored in the database.
*   **Stripe Webhook Verification:** The Stripe webhook handler verifies the `Stripe-Signature` header to prevent spoofing.
*   **Revalidation Secret:** The `/api/revalidate` endpoint requires a secret to prevent unauthorized cache clearing.
*   **Security Headers:** `next.config.js` is configured with essential security headers (CSP, X-Content-Type-Options, Strict-Transport-Security, X-Frame-Options) to mitigate common web vulnerabilities.
*   **Input Validation:** Implement robust input validation on all forms and API endpoints to prevent injection attacks and other vulnerabilities. (Basic validation is included, but should be expanded for complex forms).

## 13. Folder Structure

```
ecommerce-platform/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── next.config.js
├── package.json
├── README.md
├── submission.json
│
├── reports/
│   └── lighthouse.json
│
├── prisma/
│   ├── schema.prisma
│   └── seed.js
│
├── app/
│   │
│   ├── layout.js             # Root layout, includes Navbar, AuthProvider, ZustandProvider
│   ├── page.js               # Homepage
│   ├── sitemap.js            # Dynamic sitemap generation
│   │
│   ├── products/
│   │   ├── page.js           # Product grid listing
│   │   └── [slug]/
│   │          page.js        # Product detail page (ISR)
│   │
│   ├── checkout/
│   │      page.js            # Checkout page
│   │
│   └── api/
│        ├── auth/
│        │      [...nextauth]/
│        │          route.js  # NextAuth API route
│        │
│        ├── cart/
│        │      route.js      # GET/POST for cart operations
│        │
│        ├── checkout/
│        │      route.js      # Creates Stripe checkout session
│        │
│        ├── revalidate/
│        │      route.js      # On-demand revalidation API
│        │
│        └── webhooks/
│              └── stripe/
│                    route.js # Stripe webhook handler
│
├── components/
│      Navbar.jsx             # Main navigation bar
│      ProductCard.jsx        # Individual product card for grid
│      ProductGrid.jsx        # Container for product cards
│      ProductGallery.jsx     # Image gallery for product detail
│      AddToCartButton.jsx    # Client component to add items to cart
│      CartIndicator.jsx      # Client component to display cart item count
│      CheckoutForm.jsx       # Client component for checkout details
│      AuthButtons.jsx        # Login/Logout buttons
│      SessionProvider.jsx    # NextAuth session provider
│      ZustandProvider.jsx    # Zustand context provider
│
├── lib/
│      prisma.js              # Prisma client instance
│      stripe.js              # Stripe client instance
│      cms.js                 # Sanity CMS client and data fetching
│      cache.js               # Custom caching utilities (unstable_cache, revalidateTag)
│      auth.js                # NextAuth configuration
│      utils.js               # Utility functions (cn, etc.)
│
├── services/
│      cartService.js         # Business logic for cart operations
│      productService.js      # Business logic for product data
│      orderService.js        # Business logic for order creation/management
│
├── store/
│      cartStore.js           # Zustand store for cart state
│
└── public/
       images/                # Static images (e.g., placeholder, logo)
```

## 14. Common Troubleshooting

*   **`DATABASE_URL` connection issues:**
    *   Ensure your PostgreSQL database is running.
    *   Verify the `DATABASE_URL` in `.env.local` is correct, especially the host, port, user, and password.
    *   If using Docker Compose, ensure the `db` service is healthy before the `app` service starts.
*   **Prisma migration errors:**
    *   If you've changed your `schema.prisma`, you might need to create a new migration: `npx prisma migrate dev --name <migration-name>`.
    *   Ensure your database is accessible and has the correct permissions.
*   **Stripe webhook not received:**
    *   Check your Stripe dashboard for webhook event logs.
    *   Ensure your webhook endpoint is publicly accessible (e.g., using `stripe listen` or `ngrok` for local development).
    *   Verify `STRIPE_WEBHOOK_SECRET` matches the secret configured in Stripe.
*   **Sanity data not loading:**
    *   Check `CMS_API_URL` and `CMS_API_KEY` in `.env.local`.
    *   Ensure your Sanity project is deployed and has the correct schema.
    *   Verify network connectivity to Sanity API.
*   **NextAuth authentication issues:**
    *   Ensure `NEXTAUTH_SECRET` is a long, random string.
    *   Check the console for any errors related to session or credentials.
    *   Verify the test user exists in the database with the correct hashed password.
*   **Lighthouse score below 95:**
    *   Review image optimizations (`next/image`).
    *   Ensure server components are used effectively to reduce client-side JavaScript.
    *   Minimize third-party scripts.
    *   Optimize CSS and JavaScript delivery.
