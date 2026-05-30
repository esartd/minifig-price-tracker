# Hostinger DNS Configuration - Step-by-Step Guide

## Step 1: Log in to Hostinger

1. Go to: https://hpanel.hostinger.com/
2. Enter your Hostinger credentials
3. Log in

## Step 2: Access DNS Zone Editor

1. From the Hostinger dashboard, click **"Domains"** in the left sidebar
2. Find **"ericksu.com"** in your domain list
3. Click on **"ericksu.com"**
4. Click the **"DNS / Name Servers"** tab or **"DNS Zone Editor"** button

## Step 3: Add CNAME Records

You'll see a section with existing DNS records. You need to add 9 new CNAME records.

### For Each Language Subdomain:

Click the **"Add Record"** or **"Add New Record"** button and fill in:

---

### Record 1: German
```
Type: CNAME
Name: de.figtracker
Points to: cname.vercel-dns.com
TTL: 14400 (or leave default)
```
Click **"Add Record"** or **"Save"**

---

### Record 2: French
```
Type: CNAME
Name: fr.figtracker
Points to: cname.vercel-dns.com
TTL: 14400
```
Click **"Add Record"** or **"Save"**

---

### Record 3: Spanish
```
Type: CNAME
Name: es.figtracker
Points to: cname.vercel-dns.com
TTL: 14400
```
Click **"Add Record"** or **"Save"**

---

### Record 4: Italian
```
Type: CNAME
Name: it.figtracker
Points to: cname.vercel-dns.com
TTL: 14400
```
Click **"Add Record"** or **"Save"**

---

### Record 5: Dutch
```
Type: CNAME
Name: nl.figtracker
Points to: cname.vercel-dns.com
TTL: 14400
```
Click **"Add Record"** or **"Save"**

---

### Record 6: Polish
```
Type: CNAME
Name: pl.figtracker
Points to: cname.vercel-dns.com
TTL: 14400
```
Click **"Add Record"** or **"Save"**

---

### Record 7: Portuguese
```
Type: CNAME
Name: pt.figtracker
Points to: cname.vercel-dns.com
TTL: 14400
```
Click **"Add Record"** or **"Save"**

---

### Record 8: Swedish
```
Type: CNAME
Name: sv.figtracker
Points to: cname.vercel-dns.com
TTL: 14400
```
Click **"Add Record"** or **"Save"**

---

### Record 9: Japanese
```
Type: CNAME
Name: ja.figtracker
Points to: cname.vercel-dns.com
TTL: 14400
```
Click **"Add Record"** or **"Save"**

---

## Step 4: Verify Records

After adding all 9 records, you should see them listed in your DNS Zone Editor:

```
de.figtracker.ericksu.com  CNAME  cname.vercel-dns.com  14400
fr.figtracker.ericksu.com  CNAME  cname.vercel-dns.com  14400
es.figtracker.ericksu.com  CNAME  cname.vercel-dns.com  14400
it.figtracker.ericksu.com  CNAME  cname.vercel-dns.com  14400
nl.figtracker.ericksu.com  CNAME  cname.vercel-dns.com  14400
pl.figtracker.ericksu.com  CNAME  cname.vercel-dns.com  14400
pt.figtracker.ericksu.com  CNAME  cname.vercel-dns.com  14400
sv.figtracker.ericksu.com  CNAME  cname.vercel-dns.com  14400
ja.figtracker.ericksu.com  CNAME  cname.vercel-dns.com  14400
```

## Important Notes:

- **Name field**: Some Hostinger panels want just `de.figtracker`, others want the full `de.figtracker.ericksu.com`. Try `de.figtracker` first.
- **Points to / Target / Value**: This is where you enter `cname.vercel-dns.com`
- **TTL**: Can be left at default or set to 14400 (4 hours)
- **Don't add trailing dot**: Enter `cname.vercel-dns.com` NOT `cname.vercel-dns.com.`

## Troubleshooting:

**"Record already exists"**: Check if there's an existing record with that name and delete it first

**Can't find DNS Zone Editor**: Look for:
- "DNS Settings"
- "Name Servers"
- "Advanced DNS"
- "Manage DNS"

**Wrong format error**: Try entering just the subdomain part without the base domain:
- Use: `de.figtracker`
- Not: `de.figtracker.ericksu.com`

---

✅ Once all 9 records are added, proceed to Vercel configuration (see VERCEL_DOMAINS_GUIDE.md)
