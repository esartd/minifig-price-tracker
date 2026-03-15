# Minifig Price Tracker

A Next.js web application for LEGO minifigure collectors to track their collection and monitor pricing data from BrickLink.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.19.0-2D3748)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Complete Star Wars Catalog** - 1,567+ minifigures with auto-complete search
- **Real-time Pricing** - Live pricing data from BrickLink API
- **Smart Search** - Search by name or item number (e.g., "Luke Skywalker" or "sw0004")
- **Price Tracking** - 6-month average, current average, and suggested prices
- **Collection Management** - Track quantity and condition (new/used)
- **Beautiful UI** - Apple-inspired design with smooth animations
- **Monthly Updates** - Automatic catalog updates for new minifig releases
- **Responsive** - Works on desktop, tablet, and mobile

## Live Demo

[View Live Site](https://your-site.vercel.app) _(coming soon)_

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **APIs**: [BrickLink API](https://www.bricklink.com/v3/api.page)
- **Search**: [Fuse.js](https://fusejs.io/) for fuzzy search
- **Deployment**: [Vercel](https://vercel.com)

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- BrickLink API credentials ([get them here](https://www.bricklink.com/v3/api/register_consumer.page))
- PostgreSQL database (or use Vercel Postgres free tier)

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

   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your credentials:
   ```env
   BRICKLINK_CONSUMER_KEY=your_key
   BRICKLINK_CONSUMER_SECRET=your_secret
   BRICKLINK_TOKEN_VALUE=your_token
   BRICKLINK_TOKEN_SECRET=your_token_secret
   DATABASE_URL=file:./dev.db  # SQLite for local dev
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
- Name: `Luke Skywalker`, `Darth Vader`, `Boba Fett`
- Item number: `sw0004`, `sw1219`, `hp001`

### Add to Collection

1. Click on a search result to expand
2. Set quantity and condition (new/used)
3. Click "Add to Collection"
4. Pricing updates automatically from BrickLink

### Update Catalog

Run manually to add new minifigures:
```bash
npm run enumerate-catalog
```

Or let GitHub Actions do it automatically every month!

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
- `npm run enumerate-catalog` - Update minifig catalog from BrickLink
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
│   ├── bricklink-scraper.ts  # Web scraping for pricing
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
- `GET /api/collection` - Get user's collection
- `POST /api/collection` - Add item to collection
- `PATCH /api/collection/:id` - Update collection item
- `DELETE /api/collection/:id` - Remove from collection
- `POST /api/collection/:id/refresh-pricing` - Refresh pricing data

## Roadmap

- [ ] Add support for more themes (Harry Potter, Marvel, etc.)
- [ ] Price history charts
- [ ] Export collection to CSV
- [ ] Multi-user support with authentication
- [ ] Wishlist feature
- [ ] Set price alerts
- [ ] Mobile app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [BrickLink](https://www.bricklink.com/) for their comprehensive API
- The LEGO community for inspiration
- [Vercel](https://vercel.com) for hosting

## Support

If you find this project helpful, please give it a ⭐️ on GitHub!

For questions or issues, please [open an issue](https://github.com/YOUR_USERNAME/minifig-price-tracker/issues).

---

Built with ❤️ for the LEGO community
