# 🛒 E-Commerce Platform

A production-ready full-stack e-commerce platform built with **Next.js 14**, **Prisma**, **PostgreSQL**, **Stripe Checkout**, **Sanity CMS**, and **Docker**.

> Designed for performance, scalability, SEO, and modern deployment workflows.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🛍 Product Catalog | Browse products with detailed pages |
| 🛒 Shopping Cart | Zustand-powered persistent cart |
| 💳 Payments | Secure Stripe Checkout integration |
| 🔐 Authentication | NextAuth credentials authentication |
| 📰 CMS | Product management using Sanity CMS |
| 🚀 Performance | ISR, Server Components, cache tags |
| 🐳 Docker | Fully containerized development |
| 📈 SEO | Optimized metadata and Lighthouse performance |

---

## 🛠 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | Next.js 14 App Router, React, Tailwind CSS |
| Backend | Next.js API Routes, Server Actions |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth |
| Payments | Stripe |
| CMS | Sanity CMS |
| State Management | Zustand |
| Containerization | Docker & Docker Compose |

---

## 🏗 Architecture

```text
                Client
                   │
                   ▼
          Next.js 14 App Router
         ┌─────────┼──────────┐
         ▼         ▼          ▼
     Prisma     NextAuth    Stripe
         │                     │
         ▼                     ▼
    PostgreSQL           Checkout API

               ▲
               │
           Sanity CMS
```

---

## 🚀 Quick Start

### Clone Repository

```bash
git clone https://github.com/your-username/ecommerce-platform.git
cd ecommerce-platform
```

### Install Dependencies

```bash
npm install -g pnpm
pnpm install
```

### Configure Environment

```bash
cp .env.example .env.local
```

Fill in the required environment variables.

### Run Development Server

```bash
pnpm dev
```

Visit **http://localhost:3000**

---

## 🐳 Docker

Start the complete application:

```bash
docker compose up --build
```

This will:

- Start PostgreSQL
- Build the application
- Run Prisma migrations
- Seed the database
- Launch Next.js

Stop containers:

```bash
docker compose down
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| NEXTAUTH_SECRET | NextAuth encryption secret |
| NEXTAUTH_URL | Application URL |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe publishable key |
| STRIPE_SECRET_KEY | Stripe secret key |
| STRIPE_WEBHOOK_SECRET | Stripe webhook secret |
| CMS_API_URL | Sanity GraphQL endpoint |
| CMS_API_KEY | Sanity access token |
| CMS_WEBHOOK_SECRET | Revalidation secret |

---

## 💳 Stripe Integration

- Secure Stripe Checkout
- Webhook verification
- Automatic order creation
- Inventory updates after successful payment

For local development:

```bash
stripe listen
```

---

## 📰 Sanity CMS

Product schema includes:

- Name
- Description
- Price
- Stock
- Images
- Variants
- Slug

Content updates automatically trigger cache revalidation.

---

## ⚡ ISR & Cache

- Product pages use Incremental Static Regeneration.
- Cache invalidation uses Next.js cache tags.
- `/api/revalidate` supports on-demand revalidation from Sanity webhooks.

Example request:

```json
{
  "secret":"ecommerce-secret",
  "tag":"products"
}
```

---

## 👤 Test Credentials

```
Email: test.user@example.com
Password: Password123!
```

---

## 🚀 Deployment

1. Configure PostgreSQL
2. Configure Stripe
3. Configure Sanity CMS
4. Set environment variables
5. Build

```bash
pnpm build
pnpm start
```

Configure Stripe and Sanity webhooks after deployment.

---

## 🔒 Security

- Environment secrets are never committed
- Passwords hashed with bcrypt
- Stripe webhook signature verification
- Protected cache revalidation endpoint
- Security headers enabled
- Input validation for APIs

---

## 📁 Folder Structure

```text
ecommerce-platform/
├── app/
├── components/
├── lib/
├── prisma/
├── public/
├── services/
├── store/
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🛠 Troubleshooting

<details>
<summary>Database Connection Issues</summary>

- Verify PostgreSQL is running.
- Check DATABASE_URL.
- Ensure Prisma migrations are applied.

</details>

<details>
<summary>Stripe Webhook Problems</summary>

- Verify STRIPE_WEBHOOK_SECRET.
- Run `stripe listen`.
- Check Stripe webhook logs.

</details>

<details>
<summary>Sanity CMS Issues</summary>

- Verify CMS_API_URL.
- Verify CMS_API_KEY.
- Confirm schema deployment.

</details>

<details>
<summary>Authentication Issues</summary>

- Check NEXTAUTH_SECRET.
- Verify seeded test user.
- Review server logs.

</details>

---

## 📄 License

This project is intended for educational and portfolio purposes.

