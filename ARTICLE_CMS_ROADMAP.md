# Article CMS - Complete Feature Roadmap

## ✅ Currently Working (Demo Ready)
- [x] Block-based editor (7 block types)
- [x] Image upload (base64 for demo, Vercel Blob for production)
- [x] Live preview
- [x] Multilingual support (EN, DE, FR, ES)
- [x] Save draft / Publish workflow
- [x] Auto-generated slugs
- [x] Apple Newsroom-style layout

## 🚀 Phase 1: Essential Features (Next Priority)

### 1. Cover Images
**What:** Featured image for each article (shows on article cards, social shares)
**Where:**
- Upload in article editor sidebar
- Display on article detail page (before title)
- Show on article listing page cards
- Use for Open Graph social previews

**Implementation:**
- Add `coverImageId` field to Article model
- Add cover image uploader in sidebar
- Recommended size: 1200×630px (Open Graph standard)
- Auto-generate social preview cards

### 2. Category System
**What:** Organize articles into categories (Guides, Tutorials, News, Tips, etc.)
**Where:**
- Select/create categories in article editor
- Filter articles by category on /articles page
- Show category badge on article cards
- Category landing pages: /articles/category/guides

**Implementation:**
- Simple text field (start simple)
- Or: Separate Category model with slug, name, description
- Allow multiple categories per article (tags)
- Category colors for visual distinction

### 3. Related Articles
**What:** Show 3 recommended articles at bottom of each article
**Logic:**
- Same category first
- Similar tags/keywords
- Recent popular articles
- Manual selection (override)

**Implementation:**
```typescript
// Auto-suggest algorithm:
1. Articles in same category (max 3)
2. If < 3, add articles with similar keywords
3. If < 3, add most recent published articles
4. Exclude current article
```

**Design:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Continue Reading
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Card 1]  [Card 2]  [Card 3]
Image     Image     Image
Title     Title     Title
Desc      Desc      Desc
5 min     8 min     3 min
```

### 4. Auto-Generated Breadcrumbs
**What:** Navigation path at top of article
**Format:** Home / Articles / [Category] / Article Title

**Implementation:**
- Extract from URL structure
- Link each breadcrumb level
- Schema.org BreadcrumbList markup for SEO
- Already partially implemented, just needs category

## 🎯 Phase 2: SEO & Discovery (Week 2)

### 5. Full SEO Metadata
- [x] Meta title, description per language (partially done)
- [ ] Custom Open Graph images per article
- [ ] Twitter Card metadata
- [ ] JSON-LD structured data (Article schema)
- [ ] Canonical URLs
- [ ] Auto-generate meta descriptions from first paragraph if empty

### 6. Table of Contents
**What:** Auto-generated from H2/H3 headings
**Where:** Sticky sidebar on desktop, collapsible on mobile
**Features:**
- Smooth scroll to section
- Highlight current section while scrolling
- Show reading progress indicator

### 7. Read Time Calculation
**What:** Auto-calculate from content (already showing "5 min read")
**Formula:** 
```typescript
// Average reading speed: 200-250 words per minute
const words = countWords(contentBlocks);
const readTime = Math.ceil(words / 225);
```

### 8. Article Search
**What:** Search articles by title, content, category
**Where:** /articles page with search bar
**Implementation:**
- Client-side search (start simple)
- Later: Full-text search with database indexes
- Filter + search combination

## 🔧 Phase 3: Editor Enhancements (Week 3)

### 9. Rich Text Formatting
**Current:** Basic markdown (**bold**, *italic*)
**Add:**
- Inline code `code`
- Links with visual editor
- Subscript/superscript
- Highlight/mark text
- Text color options

### 10. More Block Types
- **Code Block** - Syntax highlighting (Prism.js)
- **Quote Block** - Pull quotes, testimonials
- **Video Embed** - YouTube, Vimeo
- **Tweet Embed** - Embedded tweets
- **Button/CTA** - Call-to-action buttons
- **Two-Column Layout** - Side-by-side content
- **Accordion/Collapsible** - FAQ style
- **Table** - Sortable data tables

### 11. Editor UX Improvements
- Keyboard shortcuts (Cmd+B for bold, etc.)
- Block drag & drop (visual drag handle)
- Duplicate block button
- Undo/Redo history
- Word count display
- Autosave every 30 seconds
- "Unsaved changes" warning when leaving

### 12. Image Management
- Image library (browse previously uploaded)
- Drag to resize images
- Image alignment (left, center, right, full-width)
- Image compression before upload
- Alt text suggestions (AI-powered)
- Lazy loading implementation

## 📊 Phase 4: Analytics & Insights (Week 4)

### 13. Article Analytics
**Track:**
- Page views
- Unique visitors
- Average time on page
- Scroll depth (% read)
- Exit rate
- Referral sources

**Dashboard:**
- Per-article stats
- Top performing articles
- Trending topics
- Best time to publish

### 14. Reading Progress
**What:** Progress bar at top showing % read
**Implementation:**
- Thin bar that fills as user scrolls
- Optional: Estimated time remaining
- Trigger "related articles" CTA at 80% scroll

## 👥 Phase 5: Engagement Features (Week 5)

### 15. Social Sharing
**Buttons:**
- Twitter/X share
- Facebook share
- LinkedIn share
- Copy link
- Email article
- WhatsApp (mobile)

**Smart Sharing:**
- Pre-filled text with article title
- Include via @FigTracker handle
- Track shares in analytics

### 16. Newsletter Integration
**What:** Subscribe to new articles
**Features:**
- Email capture at bottom of articles
- "New article" email notifications
- Weekly digest option
- Integration with email provider (SendGrid, Mailchimp)

### 17. Internal Linking
**What:** Suggest related articles while writing
**Features:**
- Type "@" to search and link to other articles
- Show "Articles that link here" in editor
- Broken link checker
- Link preview on hover

## 🔐 Phase 6: Author & Workflow (Week 6)

### 18. Author Profiles
**What:** Full author pages with bio, articles, social
**Features:**
- Author name, photo, bio
- Social media links
- List of articles by author
- Author archive page: /authors/[slug]

### 19. Article Versioning
**What:** Track changes over time
**Features:**
- Save version on each publish
- View version history
- Restore previous version
- Show "Last updated" date
- Compare versions (diff view)

### 20. Editorial Workflow
**States:**
- Draft → In Review → Scheduled → Published → Archived
**Features:**
- Assign reviewers
- Comments/feedback within editor
- Approval workflow
- Publishing checklist

### 21. Scheduled Publishing
**What:** Publish articles at specific date/time
**Implementation:**
- Date/time picker in editor
- Cron job to auto-publish
- Timezone handling
- Preview scheduled articles (admin only)

## 🎨 Phase 7: Reader Experience (Week 7)

### 22. Dark Mode
**What:** Toggle for dark theme
**Implementation:**
- Remember preference
- Respect system preference
- Smooth transition
- Proper contrast ratios

### 23. Font Size Adjustments
**What:** A- / A+ buttons for accessibility
**Options:**
- Small, Medium (default), Large, XL
- Save preference per user
- Respects browser settings

### 24. Print Optimization
**What:** Print-friendly version
**Features:**
- Remove navigation/footer
- Optimize images for print
- Page break handling
- Print-specific CSS

### 25. Bookmarking
**What:** Save articles to read later
**Features:**
- Bookmark button (logged in users)
- "My Saved Articles" page
- Bookmark counts (social proof)

### 26. Reading List
**What:** Queue of articles to read
**Features:**
- Add to reading list
- Reading history
- Resume where you left off
- Mark as read

## 🌍 Phase 8: Advanced Features (Week 8+)

### 27. Article Series
**What:** Multi-part article series
**Features:**
- Link articles in series
- Next/Previous navigation
- Series overview page
- Progress indicator (Part 2 of 5)

### 28. Guest Posts
**What:** Allow external authors
**Features:**
- Guest author profiles
- Submission workflow
- Bio and backlink
- Guest badge

### 29. Article Templates
**What:** Pre-built article structures
**Examples:**
- How-to Guide template
- Comparison template
- Listicle template
- News announcement template
- Tutorial template

### 30. AI Assistance
**What:** AI-powered writing help
**Features:**
- Generate article outline from title
- Suggest meta descriptions
- Grammar and style checking
- Readability score (Flesch-Kincaid)
- Keyword suggestions
- Tone analysis

### 31. Comments System
**What:** Reader comments on articles
**Options:**
- Custom-built with moderation
- Disqus integration
- Discourse integration
**Features:**
- Comment moderation queue
- Spam filtering
- Upvote/downvote
- Comment notifications

### 32. Content Calendar
**What:** Visual calendar of published/scheduled articles
**Features:**
- Monthly view
- Drag to reschedule
- Status indicators
- Publishing frequency insights

### 33. RSS Feed
**What:** RSS feed of latest articles
**URL:** /articles/feed.xml
**Features:**
- Full content in feed
- Filter by category
- Per-author feeds

### 34. AMP Version
**What:** Accelerated Mobile Pages for speed
**Why:** Better mobile SEO, instant loading
**Implementation:**
- Generate AMP HTML version
- Simplified styling
- amp-img, amp-video components

### 35. Multilingual Improvements
**Current:** Manual translation entry
**Add:**
- Translation status indicator (EN ✓, DE ✗)
- AI-assisted translation (DeepL API)
- Language switcher on articles
- Missing translation fallback to English

## 📋 Summary: What to Build Next

### Immediate (This Week)
1. ✅ Fix database migration (prerequisite for all)
2. **Cover image upload** - Essential for social sharing
3. **Category system** - Basic text field
4. **Related articles** - 3 cards at bottom
5. **Auto breadcrumbs** - Already 80% done

### Short-term (Next 2 Weeks)
6. Table of contents (auto from headings)
7. Read time calculation (auto)
8. Full SEO metadata per article
9. Social sharing buttons
10. Article search/filter on /articles

### Medium-term (Month 2)
11. More block types (code, quote, video embeds)
12. Editor improvements (autosave, undo/redo)
13. Analytics dashboard
14. Newsletter signup integration
15. Author profiles

### Long-term (Month 3+)
16. Comments system
17. Article versioning
18. Scheduled publishing
19. AI writing assistance
20. Content calendar

## 🎯 The "Seamless Experience" Checklist

For readers:
- [ ] Fast page load (<2s)
- [ ] Mobile-responsive (perfect on all devices)
- [ ] Easy navigation (breadcrumbs, related articles)
- [ ] Visual hierarchy (clear sections)
- [ ] Readable typography (proper line height, contrast)
- [ ] Images load fast (optimized, lazy loading)
- [ ] No layout shift while loading
- [ ] Share buttons (easy to spread)
- [ ] Print-friendly
- [ ] Accessible (WCAG 2.1 AA)

For you (author):
- [ ] Write articles in 10 minutes
- [ ] No code required
- [ ] Preview before publish
- [ ] Easy image uploads
- [ ] Auto-saves (never lose work)
- [ ] SEO handled automatically
- [ ] Schedule for later
- [ ] See analytics easily
- [ ] Update old articles easily
- [ ] Bulk operations (publish multiple)

For SEO:
- [ ] Proper meta tags
- [ ] Schema.org markup
- [ ] Fast Core Web Vitals
- [ ] Mobile-first
- [ ] Internal linking
- [ ] Image alt text
- [ ] Sitemap inclusion
- [ ] Social preview cards

---

## Next Steps

**Right now (database is ready):**
1. Apply database migration
2. Fix login/auth issues
3. Test full save/publish flow

**This week:**
1. Cover image upload
2. Category field
3. Related articles component
4. Breadcrumb completion

**Want me to start building any of these?** Let me know which features are highest priority!
