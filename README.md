# NPS Insurance Portal

NPS Insurance Portal is a premium, modern insurance comparison web application. It allows users to browse, compare, and request quotes for a wide range of insurance policies (Term, Health, Motor, Life, Travel, Home, and specialized subcategories) while providing administrators with a powerful control panel to manage leads, policies, providers, and blog posts.

---

## 🚀 Key Features

* **Complete Insurance Suite:** Dedicated pages for Term, Health, Motor, Life, Car, Bike, Travel, Home, and specialty plans.
* **Premium Explainer & FAQ System:** Categorized, dynamic policy highlights, target buyer personas, and interactive FAQs.
* **Stateless Message Central OTP Authentication:** Secure, mobile-number-based login and signup powered by Message Central CPaaS APIs (eliminating legacy Firebase dependencies).
* **Interactive Policy Tables:** Filterable and sortable policy tables ranked by claim settlement ratios.
* **Prisma ORM Backend:** Strongly-typed schemas mapping providers, policies, users, leads, due dates, FAQs, and testimonials.
* **Admin Dashboard:** Access-controlled control panel for lead management, policy/provider updates, and content generation.

---

## 🛠️ Technology Stack

* **Frontend:** [Next.js](https://nextjs.org/) (App Router, React 19), [Tailwind CSS](https://tailwindcss.com/) for modern animations and premium UI layouts.
* **Database & ORM:** [Prisma ORM](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/) (fully compatible with Neon, Aiven, Supabase, or AWS RDS).
* **SMS Gateway:** [Message Central CPaaS API](https://messagecentral.com/) for fast, secure OTP deliveries.
* **Icons:** [Lucide React](https://lucide.dev/) for crisp vector symbols.

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root of the project and populate it with the following configuration keys:

```env
# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://username:password@hostname:5432/dbname?sslmode=require"

# JWT Token Secret for Session Cookie Signatures
JWT_SECRET="your-32-character-random-jwt-secret-key"

# Message Central SMS Gateway Configuration
MESSAGE_CENTRAL_CUSTOMER_ID="your-customer-id"
MESSAGE_CENTRAL_AUTH_TOKEN="your-cpaas-auth-token"
```

---

## 💻 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database Tables
Apply the Prisma schema to your target PostgreSQL database instance:
```bash
npx prisma db push
```

### 3. Seed Initial Data
Populate the database with pre-configured insurance categories, top providers, and featured policy options:
```bash
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application.

---

## 🛡️ Database Management & Schema Changes

If you need to make changes to the database structure:
1. Edit the Prisma schema file located in `prisma/schema.prisma`.
2. Push the schema updates to your database:
   ```bash
   npx prisma db push
   ```
3. Generate the updated Prisma client files:
   ```bash
   npx prisma generate
   ```

---

## 🚀 Deployment Guide (Vercel & Cloud Databases)

1. **Database:** Create a managed PostgreSQL database instance using **Aiven** (highly recommended for a 1 GB free tier) or **Neon**.
2. **Environment Variables:** Inject the `.env` variables into the Vercel Dashboard project settings.
3. **Build Script:** Ensure the project's build command includes `prisma generate` (usually pre-configured as `prisma generate && next build`).
