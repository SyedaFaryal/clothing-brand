# NOIR & CO — Full-Stack Clothing / Shoes / Makeup Store

A full-stack e-commerce project: **two separate React frontends** sharing
**one Express + MongoDB backend** (MVC pattern).

```
noir-co/
├── backend/           ← Express API, MVC (models / controllers / routes), MongoDB
├── frontend-store/     ← Customer-facing shop (React, port 5173)
└── frontend-admin/     ← Admin dashboard (React, port 5174)
```

## ⚠️ If products don't show up — read this first

The catalog now **auto-seeds on every server start** — as long as the backend
successfully connects to MongoDB and the product collection is empty, it
loads all 30 items automatically. No manual seed step is required anymore.

If the storefront still shows no products, it's almost always one of these:

1. **Backend isn't running.** Open `http://localhost:5000/api/health` in a
   browser — you should see `{"success":true,...}`. If it doesn't load, start
   the backend (`cd backend && npm run dev`) and check the terminal for errors.
2. **MongoDB isn't reachable.** See the connection options below — the
   backend will refuse to start if it can't connect.
3. **Frontend pointed at the wrong port.** The store/admin dev servers proxy
   `/api` to `http://localhost:5000` — make sure nothing else is using that
   port.

## 1. MongoDB — two ways to run this

**Option A — Zero config (fastest to try locally):** leave `MONGO_URI` unset
in `backend/.env`. The backend automatically starts a temporary in-memory
MongoDB (via `mongodb-memory-server`) on its own — nothing to install. Note:
this **downloads a MongoDB binary the first time** (needs internet access)
and **data resets every time you restart the server**. If your network
blocks that download, use Option B.

**Option B — Real MongoDB (recommended for anything beyond a quick look):**
install MongoDB locally, or create a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster, then set:
```
MONGO_URI=mongodb://127.0.0.1:27017/noirco
```
in `backend/.env`. Data persists normally across restarts.

## 2. Backend setup (do this first)

```bash
cd backend
npm install
cp .env.example .env      # edit MONGO_URI (see above) / JWT_SECRET
npm run dev                # http://localhost:5000
```

On first successful start you'll see the admin credentials printed in the
terminal, e.g.:
```
──────────────────────────────────────────────────
 ADMIN LOGIN CREATED
 Email:    admin@noirco.com
 Password: Admin@12345
 Use these at the frontend-admin login screen.
──────────────────────────────────────────────────
```
Change these ahead of time via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` if
you want different credentials from the start.

Need a clean-slate reseed later (e.g. after messing up products in the admin
panel)? Run:
```bash
npm run seed
```

### API overview

| Method | Route                     | Access        | Description |
|--------|----------------------------|---------------|--------------|
| POST   | /api/auth/register          | Public        | Create a customer account |
| POST   | /api/auth/login              | Public        | Login (customer or admin) → JWT |
| POST   | /api/auth/forgot-password      | Public        | Generate a password reset link |
| POST   | /api/auth/reset-password/:token | Public       | Set a new password with a valid reset token |
| GET    | /api/products                 | Public        | List products (`?category=`, `?search=`) |
| GET    | /api/products/:id              | Public        | Single product |
| POST   | /api/products                   | **Admin**     | Create product |
| PUT    | /api/products/:id                 | **Admin**     | Update product |
| DELETE | /api/products/:id                   | **Admin**     | Delete product |
| GET/POST/PATCH/DELETE | /api/cart              | Session       | Session-based shopping cart |
| POST   | /api/orders                          | Public        | Checkout — creates an Order record in MongoDB |
| GET    | /api/orders                            | **Admin**     | List every order |
| GET    | /api/admin/stats                         | **Admin**     | Dashboard totals (revenue, orders, low stock…) |
| GET    | /api/admin/sales?period=daily\|weekly\|monthly | **Admin** | Per-item sales report |
| GET    | /api/admin/users                            | **Admin**     | List registered customers |

MongoDB collections: **products**, **users**, **orders**. Every checkout
creates one Order document (with embedded line items) — a full record of
every sale, viewable from the admin Orders page.

## 3. Customer storefront (`frontend-store`)

```bash
cd frontend-store
npm install
npm run dev        # http://localhost:5173
```

- **30 products** across **Clothing, Shoes and Makeup** (10 each), filterable
  by category, each with multiple color options and sizes
- Product detail page: image gallery, color swatches, size picker
- **"+ Add to Cart" button directly on every product card** (hover to reveal)
- Slide-in cart drawer + full cart page
- Real checkout — collects name/email and creates a permanent Order in MongoDB

## 4. Admin dashboard (`frontend-admin`)

```bash
cd frontend-admin
npm install
npm run dev        # http://localhost:5174
```

- **Login** with the credentials printed by the backend on first start
- **Forgot Password / Reset Password** — since no email service is wired up
  in this demo, the reset link is shown directly on screen (and logged to
  the backend console) instead of being emailed. Swap in a real mail
  provider (SendGrid, SES, Nodemailer) in `authController.js` for production.
- **Dashboard** — total revenue, orders, products, customers; today/week/month
  revenue; low-stock alert table
- **Products** — full CRUD: add new items (name, price, category —
  Clothing/Shoes/Makeup, description, stock), dynamic color picker
  (name + hex swatch, add/remove any number), dynamic image URLs, dynamic
  sizes; edit or delete any existing product
- **Orders** — every order placed on the storefront, expandable to see each
  line item, customer, and total
- **Sales Reports** — toggle **daily / weekly / monthly**, see a revenue
  chart plus a per-item units-sold & revenue breakdown

## 5. Running everything together

Open 3 terminals:
```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend-store && npm run dev

# terminal 3
cd frontend-admin && npm run dev
```
Visit `http://localhost:5173` for the shop and `http://localhost:5174` for
the admin console.

## 6. Production build

```bash
cd frontend-store && npm run build   # → frontend-store/dist
cd frontend-admin && npm run build   # → frontend-admin/dist
```
Serve each `dist/` folder from any static host (or `express.static` from the
backend under separate paths), pointing `/api` at your deployed backend URL.
Set a real `MONGO_URI` (Atlas) in production — never rely on the in-memory
fallback outside local development.

## Notes

- Product images are placeholder Unsplash URLs — replace with your own CDN
  links from the admin Products page.
- Cart is kept in-memory per browser session (`x-session-id` header); orders,
  products and users are persisted in MongoDB.
- No payment gateway is wired up — `POST /api/orders` is a stand-in for a
  real payment step; connect Stripe/PayPal there when ready.
- JWT secret and admin bootstrap credentials live in `backend/.env` — change
  them before deploying anywhere public.
