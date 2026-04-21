# Local Testing Guide - LEGO Sets Implementation

This guide shows you how to test the LEGO sets feature locally before deploying.

## ✅ What's Been Completed So Far

### Phase 1-4: Backend Foundation
- ✅ **Database Schema**: New tables `SetInventoryItem` and `SetPersonalCollectionItem`
- ✅ **Type Definitions**: TypeScript interfaces for sets
- ✅ **Catalog Service**: `lib/boxes-data.ts` with 21,340 LEGO sets
- ✅ **Database Service**: Full CRUD operations in `lib/database.ts`

### Test Results
```
📦 Total boxes loaded: 21,340
📅 Recent boxes (last 3 years): 2,045
🏆 Top themes:
   1. Holiday & Event: 356 sets
   2. Super Heroes: 127 sets
   3. Town: 126 sets
   4. Star Wars: 118 sets
   5. NINJAGO: 113 sets
   6. Friends: 107 sets
```

## 🚀 Next Steps to Complete

### Phase 5: Pricing Service (BrickLink API)
- Extend `lib/bricklink.ts` to fetch pricing for sets
- Update `PriceCache` queries to use `item_type: 'SET'`

### Phase 6: API Routes
Create these endpoints:
```
/api/set-inventory           - GET, POST
/api/set-inventory/[id]      - GET, PATCH, DELETE
/api/set-personal-collection - GET, POST
/api/set-personal-collection/[id] - GET, PATCH, DELETE
/api/boxes/search            - GET (search sets)
/api/boxes/themes            - GET (popular themes)
```

### Phase 7-8: UI Pages & Components
- `/app/sets-inventory/page.tsx` - Sets for Sale page
- `/app/sets-collection/page.tsx` - Sets to Keep page
- `/app/sets/browse/page.tsx` - Browse sets page
- Components: `SetInventoryList`, `SetPersonalCollectionList`, `SetGrid`, `SetCard`

### Phase 9: Navigation
- Update `components/header-client.tsx`
- Add "Browse" dropdown (Minifigures | Sets)
- Add "Your LEGO" dropdown (4 collection pages)

## 🧪 Local Testing Steps

### Step 1: Database Migration

**IMPORTANT**: Run this only when you're ready to update your local database.

```bash
cd "/Users/erickkosysu/Code Projects/FigTracker"

# Create and apply the migration
npx prisma migrate dev --name add_sets_support

# Expected output:
# - Creates SetInventoryItem table
# - Creates SetPersonalCollectionItem table
# - Modifies PriceCache table (adds item_type field)
```

**Verify migration:**
```bash
npx prisma studio
# Check that SetInventoryItem and SetPersonalCollectionItem tables exist
# Check that PriceCache has item_no and item_type fields
```

### Step 2: Test Catalog Service

```bash
# Already tested - working! ✅
npx tsx scripts/test-sets-implementation.ts
```

### Step 3: Start Development Server

```bash
npm run dev
# Server will start on http://localhost:3000
```

### Step 4: Manual Testing Checklist

Once API routes and UI pages are built, test this flow:

#### Browse Experience
- [ ] Navigate to Browse dropdown → Sets
- [ ] Search for "Star Wars" sets
- [ ] Filter by "Friends" theme
- [ ] Click on a set to see details

#### Add to Inventory
- [ ] From browse page, click "Add to Inventory" on a set
- [ ] Set quantity (e.g., 2)
- [ ] Select condition (new/used)
- [ ] Submit form
- [ ] Verify set appears in "Your LEGO" → Sets for Sale

#### Inventory Management
- [ ] Open Sets for Sale page
- [ ] Verify pricing appears (or "Loading..." then updates)
- [ ] Edit quantity
- [ ] Change condition
- [ ] Sort by price (high to low)
- [ ] Filter by condition (new only)

#### Move to Collection
- [ ] From Sets for Sale page, click "Move to Collection" on a set
- [ ] Move partial quantity (e.g., move 1 of 2)
- [ ] Verify set appears in "Your LEGO" → Sets to Keep
- [ ] Verify inventory quantity reduced

#### Collection Management
- [ ] Open Sets to Keep page
- [ ] Add notes to a set
- [ ] Set acquisition date
- [ ] Set display location
- [ ] Move set back to inventory

#### Navigation
- [ ] Browse dropdown shows both Minifigures and Sets
- [ ] Your LEGO dropdown shows all 4 pages
- [ ] Mobile menu works correctly
- [ ] Dropdowns close on click outside

## 🔧 Troubleshooting

### Database Migration Fails
**Issue**: `the URL must start with the protocol postgresql://`
**Solution**: Check `.env` file has valid `DATABASE_URL`

### Prisma Client Errors
**Issue**: Type errors after schema changes
**Solution**: 
```bash
npx prisma generate
```

### Images Not Loading
**Issue**: Set images return 404
**Solution**: Check `box.image_url` format in catalog. Should be:
```
https://img.bricklink.com/ItemImage/ON/0/75192-1.png
```

### Pricing Shows $0.00
**Issue**: No BrickLink API credentials
**Solution**: Pricing will show as "N/A" without credentials. This is expected for local testing.

## 📊 Current Status

### ✅ Backend Complete
- Database schema designed
- Type definitions added
- Catalog service working (21,340 sets loaded)
- Database service with full CRUD

### 🚧 In Progress
- Pricing service extension
- API routes
- UI pages and components
- Navigation updates

### ⏳ Not Started
- End-to-end testing
- Production deployment

## 🎯 Quick Test Commands

```bash
# Test catalog loading
npx tsx scripts/test-sets-implementation.ts

# Generate Prisma client after schema changes
npx prisma generate

# Create migration (when ready)
npx prisma migrate dev --name add_sets_support

# Open Prisma Studio (database GUI)
npx prisma studio

# Start dev server
npm run dev

# Check TypeScript errors
npm run type-check
```

## 📝 Notes

- **Migration timing**: The database migration creates new tables but doesn't affect existing minifigure data
- **Prisma Client**: Already generated with new schema types
- **Catalog data**: boxes.json (21,340 sets) already in place and loading correctly
- **Testing order**: Backend first (done), then API routes, then UI, then navigation

## 🎨 What You'll See

Once everything is built, you'll have:

1. **Browse page**: Clean grid of LEGO sets with search and theme filters
2. **Sets for Sale page**: Your inventory with pricing, sorting, filtering
3. **Sets to Keep page**: Personal collection with notes and acquisition dates
4. **Navigation dropdowns**: Professional dual-dropdown navigation
5. **Mobile experience**: Full mobile menu with all links

Ready to continue building? Next up: **Phase 5 - Pricing Service Extension**
