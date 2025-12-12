# Blues Music Shop

Laravel 12 + Inertia React storefront for browsing albums, managing a cart, checking out, and administering inventory.

## Stack
- Backend: Laravel 12 (PHP 8.4), MySQL/SQLite, queues + database sessions/cache
- Frontend: Inertia + React 19, Vite 7, Tailwind CSS 4
- Tooling: TypeScript 5, ESLint 9, Prettier 3, Pest/PHPUnit

## Prerequisites
- PHP 8.2+ with Composer
- Node.js 20+ with npm
- Database: MySQL (default) or SQLite

## Quick start
1) Install dependencies
```bash
composer install
npm install
```
2) Copy environment and set APP_URL + DB settings
```bash
cp .env.example .env
php artisan key:generate
```
- For SQLite: set `DB_CONNECTION=sqlite` and create `database/database.sqlite`.
- For MySQL: set `DB_HOST/DB_PORT/DB_DATABASE/DB_USERNAME/DB_PASSWORD`.
3) Run migrations (plus seed sample data)
```bash
php artisan migrate --seed
```
4) Start the app
- Backend + queue + logs + Vite concurrently
```bash
composer dev
```
- Or run separately in two shells: `php artisan serve` and `npm run dev`.
5) Open `http://localhost:8000` (or your APP_URL).

## Database & seed data
- Migrations live in `database/migrations` and create users, artists, genres, albums, products, orders, addresses, order items.
- Seeder (`database/seeders/DatabaseSeeder.php`) provisions sample genres/artists/albums/products and accounts:
  - Admin: `admin@admin.com` / `12345678`
  - User: `kenneyher@gmail.com` / `12345678`

## Application routes (high level)
- Public catalog: `/`, `/home`, `/shop`, `/product`, `/product/{id}`
- Cart: `/cart/index` (view), POST `/cart` (add), PATCH `/cart/{id}` (update), DELETE `/cart/{id}` (remove)
- Auth: `/login`, `/register`, POST `/logout`
- Orders (auth required): `/orders` (POST checkout), `/my-orders`, `/orders/{id}`
- Profile (auth): `/profile` plus address endpoints
- Admin (auth + role:admin): `/admin/dashboard`, `/admin/inventory` CRUD

## NPM scripts
- `npm run dev` – Vite dev server
- `npm run build` – production client build
- `npm run build:ssr` – client + SSR build
- `npm run lint` – ESLint
- `npm run types` – TypeScript noEmit check
- `npm run format` / `format:check` – Prettier

## Composer scripts
- `composer dev` – serve app + queue listener + pail log viewer + Vite via concurrently
- `composer test` – clear config cache then run test suite
- `composer setup` – install deps, create .env, key:generate, migrate --force, npm install, npm build

## Running tests
```bash
composer test        # PHP tests (Pest/PHPUnit)
npm run lint         # JS/TS lint
npm run types        # TypeScript check
npm run format:check # Formatting
```

## Building for production
```bash
npm run build
php artisan migrate --force
```
Serve the `public/` directory with a PHP-capable web server. Ensure `storage` and `bootstrap/cache` are writable and configure your web server to route all requests to `public/index.php`.

## Notes
- Sessions, cache, and queues default to database drivers; ensure tables are migrated.
- Tailwind CSS v4 uses the new `@tailwindcss/vite` plugin; no separate config file is needed.
- SSR support is available via `npm run build:ssr` and `composer dev:ssr` (adjust accordingly if you enable SSR runtime).
