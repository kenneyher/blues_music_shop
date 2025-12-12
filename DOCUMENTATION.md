# Blues Music Shop Documentation

## User Manual

### Overview
Blues Music Shop is a Laravel 12 + Inertia React storefront for browsing albums, adding items to a cart, checking out, and administering inventory.

### Access
- Default URL: `http://localhost:8000` (match your `APP_URL`).
- Sample users from seed data:
  - Admin: `admin@admin.com` / `12345678`
  - Customer: `kenneyher@gmail.com` / `12345678`
- Authentication flows: register at `/register`, login at `/login`, logout via header/menu action.

### Catalog and Product Pages
- Browse the catalog at `/shop` or `/home`; product detail pages are at `/product/{id}`.
- Use product cards to open detail pages and add items to the cart (select format/quantity when prompted).

### Cart
- Open the cart at `/cart/index`.
- Add items from product pages; quantities can be increased or decreased; remove items with the delete action.
- Line totals and cart subtotal update as quantities change.

### Checkout and Orders
- Checkout endpoint: POST `/orders` (UI flow starts from the cart when authenticated).
- You must be logged in to place an order. The app uses stored addresses for shipping/billing.
- After placing an order, you can view your orders at `/my-orders` and each order at `/orders/{id}`.

### Profile and Addresses
- Profile page: `/profile` (auth required).
- Add or update address via `/profile/address` endpoints (UI buttons in the profile page).
- Set a default address or delete an address from the profile.

### Admin Inventory (role: admin)
- Admin dashboard: `/admin/dashboard`.
- Inventory list: `/admin/inventory`; create: `/admin/inventory/create`; edit: `/admin/inventory/{id}/edit`.
- Admins can create, update, or delete products, including album links, format, price, quantity, and SKU.

### Running the App Locally (summary)
- Install dependencies: `composer install` and `npm install`.
- Configure `.env`, then generate key: `php artisan key:generate`.
- Migrate and seed: `php artisan migrate --seed`.
- Start dev stack: `composer dev` (serves app, queue listener, log viewer, and Vite) or run `php artisan serve` and `npm run dev` separately.

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
- PHP tests: `composer test` (runs `php artisan test` with Pest/PHPUnit).
- Frontend checks: `npm run lint`, `npm run types`, `npm run format:check`.
- Current run status: not executed in this environment; run the commands above after configuring `.env` and database.

### Data and Environment Notes
- Seed accounts and products are created by `php artisan migrate --seed` (see `database/seeders/DatabaseSeeder.php`).
- Default DB is MySQL in production; `.env.example` ships with SQLite for local use—set `DB_CONNECTION` accordingly.
- Sessions, cache, and queues default to database drivers; ensure migrations are applied before testing.
