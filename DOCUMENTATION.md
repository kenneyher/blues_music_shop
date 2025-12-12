# Blues Music Shop Documentation

## Overview
Blues Music Shop is a Laravel 12 + Inertia React storefront for browsing albums, adding items to a cart, checking out, and administering inventory.

## Prerequisites and Setup
- PHP 8.2+ with Composer, Node.js 20+, MySQL (or SQLite for local use).
- Copy `.env.example` to `.env`, set `APP_URL` and database settings, then run:
  - `php artisan key:generate`
  - `php artisan migrate --seed`
- Start locally: `composer dev` (serves app, queue listener, log viewer, Vite) or `php artisan serve` + `npm run dev` in separate shells.

## Roles and Access
- Guest: can browse catalog and view products.
- Customer (authenticated): can manage cart, checkout, view orders, manage addresses.
- Admin (role: admin): can access admin dashboard and inventory CRUD.
- Seeded accounts: admin `admin@admin.com` / `12345678`; customer `kenneyher@gmail.com` / `12345678`.

## User Manual

### Browsing and Product Details
- Visit `/shop` or `/home` to browse. Open any product to view album info, price, available formats, and add-to-cart options.

### Cart
- Access `/cart/index`. Quantities can be increased/decreased; items can be removed. Subtotals update immediately.

### Checkout and Orders
- You must be logged in. From the cart, proceed to checkout (POST `/orders`).
- Orders use saved addresses. After checkout, view history at `/my-orders` and details at `/orders/{id}`.

### Profile and Addresses
- Profile: `/profile` (auth required). Add/update/delete addresses and set one as default for checkout.

### Admin Inventory
- Admin dashboard: `/admin/dashboard`.
- Inventory: `/admin/inventory`; create `/admin/inventory/create`; edit `/admin/inventory/{id}/edit`.
- Admins can manage products (album link, format, price, quantity, SKU).

## Test Cases and Results

### Functional Test Cases (manual)
| ID | Scenario | Steps | Expected Result | Data | Status |
|----|----------|-------|-----------------|------|--------|
| TC-01 | Guest browses catalog | Visit `/shop`; open a product | Product cards load; detail view shows album info, price, and format | Seeded products | Not run (doc-only) |
| TC-02 | Add to cart | From product page add 2 units; open cart | Cart shows line item, quantity=2, subtotal updated | Any seeded product | Not run (doc-only) |
| TC-03 | Update cart quantity | In cart, change quantity to 1 | Line total and subtotal reflect new quantity | Existing cart item | Not run (doc-only) |
| TC-04 | Remove from cart | In cart, remove line item | Item disappears; subtotal updates to 0 if last item | Existing cart item | Not run (doc-only) |
| TC-05 | Register new user | Go to `/register`; submit valid info | User created; redirected as authenticated | New email/password | Not run (doc-only) |
| TC-06 | Login existing user | Go to `/login`; submit valid creds | Redirected to home; auth session active | `kenneyher@gmail.com` / `12345678` | Not run (doc-only) |
| TC-07 | Checkout | Login; ensure cart has item; proceed to checkout | Order created; cart cleared; redirected to confirmation/detail | Seeded product | Not run (doc-only) |
| TC-08 | View order history | Login; visit `/my-orders` then select an order | Orders list renders; detail shows items, totals, and status | Existing orders | Not run (doc-only) |
| TC-09 | Manage addresses | Login; go to `/profile`; add and set default address | Address stored; default flag set; default used at checkout | Valid address fields | Not run (doc-only) |
| TC-10 | Admin creates product | Login as admin; go to `/admin/inventory/create`; submit form | Product appears in inventory list with correct fields | New album/format data | Not run (doc-only) |
| TC-11 | Admin edits product | Login as admin; edit existing product; change price/qty | Inventory reflects updates; catalog shows new values | Existing product | Not run (doc-only) |

### Automated Tests
- Run backend tests: `composer test` (wraps `php artisan test` with Pest/PHPUnit).
- Frontend checks: `npm run lint`, `npm run types`, `npm run format:check`.
- Last run status: not executed in this document; run locally after configuring `.env` and the database.

### Data and Environment Notes
- Seed data created by `php artisan migrate --seed` (see `database/seeders/DatabaseSeeder.php`).
- `.env.example` defaults to SQLite; switch to MySQL by setting `DB_CONNECTION=mysql` and credentials.
- Sessions, cache, and queues use database drivers; ensure migrations run before testing.
