# 🧱 Minifig Price Tracker

A web application for LEGO minifigure sellers to track their inventory and get real-time pricing data from Bricklink.

## Features

- 🔍 **Search Minifigures** - Search by item number or name
- 📊 **Live Pricing Data** - Get 6-month average, current average, and lowest prices from Bricklink
- 💰 **Price Suggestions** - Automatically calculates suggested selling prices
- 📦 **Inventory Management** - Track quantity and condition (new/used) of your minifigures
- 💾 **Persistent Storage** - Your collection is saved and accessible across devices
- 🔄 **Real-time Updates** - Pricing data refreshes on each view

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: JSON file storage (easily upgradable to PostgreSQL/Supabase)
- **API**: Bricklink API v1 with OAuth 1.0a authentication

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Bricklink Account** with API access

## Getting Started

### 1. Get Bricklink API Credentials

1. Log in to your Bricklink account at [bricklink.com](https://www.bricklink.com)
2. Go to your account settings
3. Look for "API" or "Developer" section
4. Register for API access (it's free)
5. You'll receive:
   - Consumer Key
   - Consumer Secret
   - Token Value
   - Token Secret

**Note**: If you can't find the API registration page, try:
- Searching "bricklink api" in the help section
- Contacting Bricklink support for API access
- Checking if your account type supports API access

### 2. Install Dependencies

```bash
cd minifig-price-tracker
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Bricklink API credentials:

```env
BRICKLINK_CONSUMER_KEY=your_consumer_key_here
BRICKLINK_CONSUMER_SECRET=your_consumer_secret_here
BRICKLINK_TOKEN_VALUE=your_token_value_here
BRICKLINK_TOKEN_SECRET=your_token_secret_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### Searching for Minifigures

1. **By Item Number** (Recommended):
   - Click "Search by Number"
   - Enter the Bricklink item number (e.g., `sw0001a` for Darth Vader)
   - Click "Search"

2. **By Name**:
   - Click "Search by Name"
   - Enter the minifigure name
   - Click "Search"
   - Note: Name search requires the exact Bricklink catalog name

### Adding to Collection

1. After searching, the minifigure details will appear
2. Set the quantity you own
3. Select condition (New or Used)
4. Click "Add to Collection"
5. Pricing data will automatically load

### Managing Your Collection

- **View Pricing**: Click on any item in your collection to see detailed pricing
- **Edit Item**: Click "Edit" to change quantity or condition
- **Delete Item**: Click "Delete" to remove from collection
- **Total Value**: The pricing card shows the total value based on quantity

### Understanding the Pricing

The app displays 4 key numbers:

1. **6-Month Average**: Historical market price over the last 6 months
2. **Current Average**: Current market average price
3. **Current Lowest**: The lowest current listing price
4. **Suggested Selling Price**: Average of the above three (your competitive price point)

All prices are in USD and reflect the US market.

## Project Structure

```
minifig-price-tracker/
├── app/
│   ├── api/
│   │   ├── collection/       # Collection CRUD endpoints
│   │   └── minifigs/         # Bricklink search endpoints
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main page
│   └── globals.css           # Global styles
├── components/
│   ├── SearchBar.tsx         # Search component
│   ├── CollectionList.tsx    # Collection display
│   └── PricingCard.tsx       # Pricing details
├── lib/
│   ├── bricklink.ts          # Bricklink API client
│   └── database.ts           # Database service
├── types/
│   └── index.ts              # TypeScript types
└── data/                     # Auto-created for storage
```

## Database

The app currently uses a JSON file (`data/collection.json`) for storage. This provides:
- ✅ No external dependencies
- ✅ Easy to backup
- ✅ Works across devices (if files are synced)

### Upgrading to PostgreSQL/Supabase

To scale up, you can easily migrate to a real database:

1. **Install Supabase client**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Create table** in Supabase:
   ```sql
   CREATE TABLE collection (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     minifigure_no TEXT NOT NULL,
     minifigure_name TEXT NOT NULL,
     quantity INTEGER NOT NULL,
     condition TEXT NOT NULL,
     image_url TEXT,
     pricing JSONB,
     date_added TIMESTAMP DEFAULT NOW(),
     last_updated TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Update `lib/database.ts`** to use Supabase client instead of file system

## API Endpoints

### Collection

- `GET /api/collection` - Get all collection items
- `POST /api/collection` - Add new item
- `GET /api/collection/[id]` - Get single item
- `PATCH /api/collection/[id]` - Update item
- `DELETE /api/collection/[id]` - Delete item

### Minifigures

- `GET /api/minifigs/search?no=[item_number]` - Search by number
- `GET /api/minifigs/search?q=[name]` - Search by name
- `GET /api/minifigs/[itemNo]/pricing?condition=[new|used]` - Get pricing data

## Troubleshooting

### "Minifigure not found"
- Make sure you're using the exact Bricklink item number (e.g., `sw0001a`)
- Try searching on Bricklink.com first to confirm the item number

### "Failed to fetch pricing"
- Check that your API credentials are correct in `.env.local`
- Verify your Bricklink account has API access enabled
- Check if you've hit API rate limits (Bricklink limits requests)

### Pricing shows $0.00
- The minifigure might not have recent sales data on Bricklink
- Try changing the condition (new vs used)
- Verify the item number is correct

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

**Note**: You'll need to upgrade the database to PostgreSQL/Supabase for production use.

## Future Enhancements

- [ ] Bulk import from CSV
- [ ] Export collection to Excel
- [ ] Price alerts when items increase in value
- [ ] Multi-user support with authentication
- [ ] Historical price charts
- [ ] Profit calculator (purchase price vs suggested price)
- [ ] Integration with eBay pricing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

**Happy Selling!** 🧱💰
