# Quick Setup Guide

## Step-by-Step Setup (5 minutes)

### Step 1: Get Bricklink API Credentials

**Where to get them:**

1. Go to [bricklink.com](https://www.bricklink.com) and log in
2. Navigate to: **My Account → Settings**
3. Look for **"API"** or **"Developer"** section
4. Click **"Register for API Access"** or similar button
5. Fill out the registration form (usually asks for app name and purpose)
6. You'll receive 4 credentials:
   - Consumer Key (looks like: `ABC123DEF456...`)
   - Consumer Secret (looks like: `XYZ789GHI012...`)
   - Token Value (looks like: `TOKEN123...`)
   - Token Secret (looks like: `SECRET456...`)

**Can't find it?**
- Try searching "API" in Bricklink's help section
- Contact Bricklink support: support@bricklink.com
- Make sure your account is verified and in good standing

---

### Step 2: Install & Run

```bash
# 1. Navigate to project folder
cd minifig-price-tracker

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Edit .env.local and paste your credentials
# Use any text editor (VS Code, TextEdit, Notepad, etc.)
# Replace "your_consumer_key_here" with actual values

# 5. Start the app
npm run dev

# 6. Open in browser
# Go to: http://localhost:3000
```

---

### Step 3: Test It Out

1. **Search for a minifigure** by item number:
   - Try: `sw0001a` (Darth Vader)
   - Or: `hp001` (Harry Potter)
   - Or: `col001` (Collectible Minifigures)

2. **Set quantity and condition**
3. **Click "Add to Collection"**
4. **View pricing data** in the right panel

---

## Troubleshooting

### API not working?

**Check your credentials:**
```bash
# Open .env.local and verify:
# - No quotes around values
# - No spaces before or after =
# - All 4 credentials are filled in
```

**Example of correct format:**
```env
BRICKLINK_CONSUMER_KEY=A1B2C3D4E5F6
BRICKLINK_CONSUMER_SECRET=G7H8I9J0K1L2
BRICKLINK_TOKEN_VALUE=M3N4O5P6Q7R8
BRICKLINK_TOKEN_SECRET=S9T0U1V2W3X4
```

### Port 3000 already in use?

```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Module not found errors?

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

## How Bricklink Item Numbers Work

- Format: `[type][number][variant]`
- Examples:
  - `sw0001a` = Star Wars figure #1, variant A
  - `hp001` = Harry Potter figure #1
  - `col001` = Collectible Minifigures series, figure #1

**Where to find item numbers:**
1. Go to [bricklink.com](https://www.bricklink.com)
2. Search for a minifigure
3. Click on the result
4. Look for "Item No:" in the details

---

## Next Steps

Once you have it running:

1. **Build your collection** - Add all your minifigures
2. **Check pricing regularly** - Prices update in real-time
3. **Use suggested prices** - Set your listings based on the app's suggestions
4. **Track total value** - See your collection's worth

---

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Open an issue on GitHub
- Double-check your Bricklink API credentials

**Happy tracking!** 🧱
