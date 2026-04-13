# Minifig Price Tracker

A Next.js web application for LEGO minifigure collectors to track their collection and monitor pricing data from BrickLink.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.19.0-2D3748)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Complete LEGO Catalog** - All themes: Star Wars, Harry Potter, Marvel/DC, Ninjago, City, and more!
- **Real-time Pricing** - Live pricing data from BrickLink API with smart 24-hour caching
- **Smart Search** - Search by name or item number (e.g., "Luke Skywalker" or "sw0004", "Harry Potter" or "hp001")
- **Price Tracking** - Current market average, quantity-weighted average, lowest listing, and suggested sell price
- **Inventory Management** - Track quantity, condition (new/used), and total collection value
- **Beautiful UI** - Apple-inspired design with smooth animations
- **Monthly Updates** - Automatic catalog updates for new minifig releases
- **Responsive** - Works on desktop, tablet, and mobile
- **Multi-user** - Authentication with NextAuth (email or Google sign-in)

## Live Demo

Coming soon! See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [NextAuth v5](https://authjs.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/) (SQLite for local dev)
- **Styling**: Inline styles with Apple-inspired design
- **APIs**: [BrickLink API](https://www.bricklink.com/v3/api.page) with smart caching
- **Search**: [Fuse.js](https://fusejs.io/) for fuzzy search
- **Deployment**: [Vercel](https://vercel.com) (free tier)

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- BrickLink API credentials ([get them here](https://www.bricklink.com/v3/api/register_consumer.page))
- For local dev: SQLite (built-in)
- For production: PostgreSQL (Vercel Postgres free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/minifig-price-tracker.git
   cd minifig-price-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your BrickLink credentials:
   ```env
   BRICKLINK_CONSUMER_KEY=your_key
   BRICKLINK_CONSUMER_SECRET=your_secret
   BRICKLINK_TOKEN_VALUE=your_token
   BRICKLINK_TOKEN_SECRET=your_token_secret
   DATABASE_URL="file:./dev.db"
   AUTH_SECRET=your_random_secret  # Generate with: openssl rand -base64 32
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Search for Minifigures

Search by name or BrickLink item number:
- Name: `Luke Skywalker`, `Harry Potter`, `Spider-Man`, `Batman`
- Item number: `sw0004`, `hp001`, `sh001`, `tlm001`

### Add to Collection

1. Click on a search result to expand
2. Set quantity and condition (new/used)
3. Click "Add to Collection"
4. Pricing updates automatically from BrickLink

### Update Catalog

**Monthly incremental update** (fast - only checks new IDs):
```bash
npm run update-catalog
```
Takes 2-3 minutes, finds new minifigures released since last update.

**Yearly full re-enumeration** (slow - checks all 10,000+ IDs):
```bash
npm run update-catalog:full
```
Takes 30-40 minutes, recommended once per year to catch any missed items.

**Discover new LEGO themes** (when BrickLink adds new lines):
```bash
npm run discover-themes
```
Auto-detects new theme prefixes and suggests adding them to enumeration.

GitHub Actions runs the **incremental update** automatically on the 1st of every month!

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

**Quick deploy:**
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Connect Vercel Postgres
5. Done!

## Monthly Catalog Updates

The catalog automatically updates on the 1st of every month via GitHub Actions. New minifigures are automatically added to the search catalog.

**Manual update:**
```bash
npm run enumerate-catalog
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run update-catalog` - Incremental catalog update (fast, ~2-3 min)
- `npm run update-catalog:full` - Full catalog re-enumeration (slow, ~30-40 min)
- `npm run discover-themes` - Auto-discover new LEGO theme prefixes
- `npm run check-api-usage` - Check BrickLink API usage stats
- `npm run db:push` - Push Prisma schema to database
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
minifig-price-tracker/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── collection/       # Collection CRUD
│   │   └── minifigs/search/  # Search endpoint
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── SearchBar.tsx
│   ├── SearchResults.tsx
│   ├── CollectionList.tsx
│   └── PricingCard.tsx
├── lib/                      # Utilities
│   ├── bricklink.ts          # BrickLink API wrapper
│   ├── database.ts           # Prisma client
│   └── minifig-catalog.ts    # Complete catalog (1,567 minifigs)
├── prisma/                   # Database schema
│   └── schema.prisma
├── scripts/                  # Automation scripts
│   └── enumerate-catalog.ts  # Catalog builder
└── .github/workflows/        # GitHub Actions
    └── update-catalog.yml    # Monthly update automation
```

## API Endpoints

- `GET /api/minifigs/search?q={query}` - Search minifigures
- `GET /api/inventory` - Get user's inventory
- `POST /api/inventory` - Add item to inventory
- `PATCH /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Remove from inventory
- `POST /api/inventory/refresh-pricing` - Refresh all prices (smart cache-aware)
- `POST /api/inventory/:id/refresh-pricing` - Refresh single item pricing

## Roadmap

- [x] Multi-user support with authentication
- [x] Smart price caching (24-hour TTL)
- [x] Real-time BrickLink pricing
- [x] All LEGO themes (Star Wars, Harry Potter, Marvel, DC, etc.)
- [ ] Price history charts
- [ ] Export inventory to CSV
- [ ] Wishlist feature
- [ ] Price alerts (email notifications)
- [ ] Amazon affiliate link integration
- [ ] Mobile app (React Native)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [BrickLink](https://www.bricklink.com/) for their comprehensive API
- The LEGO community for inspiration
- [Vercel](https://vercel.com) for hosting

## Support

Questions or issues? Open an issue on GitHub.

---

Built with ❤️ for LEGO minifig collectors and sellers
