# ✅ AUTOMATIC CATALOG UPDATES - FULLY AUTOMATED

Your BrickLink catalog now updates **automatically** twice per month!

---

## 🤖 What Happens Automatically

**Every 1st and 15th of the month at 2:00 AM:**

1. ✅ Downloads all 5 catalog files from BrickLink
2. ✅ Converts TXT files to JSON
3. ✅ Uploads JSON files to Hostinger CDN
4. ✅ Updates metadata with timestamp

**You don't need to do anything!**

---

## 📅 Schedule

| Date | Time | Action |
|------|------|--------|
| **1st of every month** | 2:00 AM | Auto-download, convert, upload |
| **15th of every month** | 2:00 AM | Auto-download, convert, upload |

---

## 📊 What Gets Updated

Every update downloads and uploads:
- **Minifigures.txt** → minifigs.json (18,732 items, ~8 MB)
- **Catalogs.txt** → sets.json (5,076 items, ~1.5 MB)
- **Parts.txt** → parts.json (93,973 items, ~31 MB)
- **Original Boxes.txt** → boxes.json (21,340 items, ~6.6 MB)
- **categories.txt** → categories.json (1,179 items, ~134 KB)
- **metadata.json** (timestamp, ~1 KB)

**Total:** ~47 MB uploaded automatically

---

## 🔍 How to Check if It's Working

### View Logs
```bash
# View latest update log
tail -f ~/Code\ Projects/FigTracker/logs/catalog-update.log

# View error log (if any)
tail -f ~/Code\ Projects/FigTracker/logs/catalog-update-error.log
```

### Check Last Update Time
```bash
curl https://figtracker.ericksu.com/catalog/metadata.json | grep lastUpdated
```

### Verify Schedule is Running
```bash
launchctl list | grep figtracker
```

You should see:
```
-	0	com.figtracker.catalog-update
```

---

## 🛠️ Manual Control (Optional)

### Run Update Manually (Without Waiting)
```bash
cd ~/Code\ Projects/FigTracker
./update-catalog-full.sh
```

### Stop Automatic Updates
```bash
launchctl unload ~/Library/LaunchAgents/com.figtracker.catalog-update.plist
```

### Start Automatic Updates Again
```bash
launchctl load ~/Library/LaunchAgents/com.figtracker.catalog-update.plist
```

### Change Schedule
Edit the plist file:
```bash
nano ~/Library/LaunchAgents/com.figtracker.catalog-update.plist
```

Then reload:
```bash
launchctl unload ~/Library/LaunchAgents/com.figtracker.catalog-update.plist
launchctl load ~/Library/LaunchAgents/com.figtracker.catalog-update.plist
```

---

## 📂 File Locations

### Scheduled Task
```
~/Library/LaunchAgents/com.figtracker.catalog-update.plist
```

### Download Location (Auto-created)
```
~/Code Projects/FigTracker/Bricklink Catalog txt/
├── 2026/
│   ├── 4/    ← April downloads
│   ├── 5/    ← May downloads (auto-created)
│   └── 6/    ← June downloads (auto-created)
```

### Logs
```
~/Code Projects/FigTracker/logs/
├── catalog-update.log        ← Success logs
└── catalog-update-error.log  ← Error logs (if any)
```

### CDN Output
```
https://figtracker.ericksu.com/catalog/
├── minifigs.json
├── sets.json
├── parts.json
├── boxes.json
├── categories.json
└── metadata.json
```

---

## ⚠️ Important Notes

1. **Your Mac must be on** at 2:00 AM on the 1st and 15th
   - If Mac is sleeping, the task will run when it wakes up
   - If Mac is off, the task will run at the next scheduled time

2. **Chrome must be available**
   - The script uses Chrome to download files from BrickLink
   - Chrome will open briefly and close automatically

3. **Internet connection required**
   - For downloading from BrickLink
   - For uploading to Hostinger CDN

4. **Logs are your friend**
   - Check logs if updates seem to fail
   - Logs show exactly what happened

---

## 🎯 Success Indicators

✅ **Everything is working if:**
- Logs show successful downloads
- `metadata.json` has recent `lastUpdated` timestamp
- No errors in error log
- Catalog files in date folders

❌ **Something is wrong if:**
- Error logs are not empty
- `metadata.json` timestamp is old
- No new date folders created

---

## 🚨 Troubleshooting

### "Chrome not found"
Install Google Chrome or edit script to use different browser

### "Permission denied"
```bash
chmod +x ~/Code\ Projects/FigTracker/update-catalog-full.sh
```

### "FTP upload failed"
Check `.env.catalog` has correct password

### Task not running
```bash
# Reload the schedule
launchctl unload ~/Library/LaunchAgents/com.figtracker.catalog-update.plist
launchctl load ~/Library/LaunchAgents/com.figtracker.catalog-update.plist
```

---

## 🎉 Summary

**Set it and forget it!**

Your catalog automatically updates twice per month. Just check the logs occasionally to make sure everything is running smoothly.

Next automatic update: **Check the 1st or 15th of next month at 2:00 AM**

---

**Last Setup:** April 2026  
**Update Frequency:** Automatic - 1st and 15th of every month at 2:00 AM  
**Your Involvement:** Zero! Just check logs occasionally
