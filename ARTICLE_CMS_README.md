# Article CMS - Usage Guide

## Overview

Your new Apple-style article CMS is ready! Create beautiful articles with a block-based editor directly in your browser.

## Features

✅ **Block-Based Editor** - Add headings, paragraphs, images, callouts, comparisons, lists, and dividers
✅ **Drag & Drop Images** - Upload images directly to Vercel Blob (CDN-backed)
✅ **Live Editing** - See changes as you type
✅ **Multilingual** - Write in EN, DE, FR, ES
✅ **Apple-Style Layout** - Clean, modern design inspired by Apple Newsroom
✅ **Draft & Publish** - Save drafts, publish when ready
✅ **Featured Articles** - Mark articles as featured for homepage

## Accessing the CMS

1. **Login** as admin (erickkosysu@gmail.com)
2. **Visit** `/admin/articles`
3. **Click** "New Article"

## Creating Your First Article

### 1. Article Metadata (Right Sidebar)

**Slug**: URL-friendly identifier (auto-generated from title)
- Example: `figtracker-vs-bricklink` → `/articles/figtracker-vs-bricklink`

**Category**: Group articles (Guide, Tutorial, News, etc.)

**Featured**: Mark as featured for homepage display

### 2. Translations (Right Sidebar)

Add title and description for each language:
- **EN** (English) - Required
- **DE** (German)
- **FR** (French)
- **ES** (Spanish)

Tip: Write English first, then translate

### 3. Content Blocks (Main Editor)

Click **"+ Add Block"** to choose block types:

#### Heading Block
- H1, H2, H3 options
- Use H2 for main sections
- Use H3 for subsections

#### Paragraph Block
- Regular text content
- Supports markdown: `**bold**` and `*italic*`
- Auto line breaks

#### Image Block
- Drag & drop or click to upload
- Max 5MB (PNG, JPG, WEBP)
- Add alt text (required for accessibility)
- Add caption (optional)
- Images auto-sized with 48px spacing (Apple-style)

#### List Block
- Bulleted or numbered
- Add/remove items dynamically
- Press "+ Add Item" to add more

#### Callout Block
- 3 types: Info (blue), Tip (green), Warning (yellow)
- Great for highlighting key points
- Example: "Pro Tip: Always check prices before buying!"

#### Comparison Block
- Side-by-side pros/cons
- Perfect for "vs" articles
- Add multiple comparison items
- Example: FigTracker vs BrickLink

#### Divider Block
- Horizontal line separator
- Use to break up long sections

### 4. Block Actions

Each block has controls (visible when selected):
- **↑ ↓** - Move block up/down
- **🗑** - Delete block
- **+ Add Block** - Add new block after this one

### 5. Saving & Publishing

**Save Draft**: Saves without publishing (only you can see it)
**Publish**: Makes article live on `/articles/[slug]`

## Best Practices (Apple Style)

### Structure
1. **Opening paragraph** - Hook readers immediately
2. **Hero image** - Add image after first paragraph
3. **3-5 main sections** - Break content with H2 headings
4. **Supporting images** - Every 3-4 paragraphs
5. **Conclusion** - Summarize key takeaways

### Images
- **Hero**: 1400px × 800px
- **Supporting**: 1400px wide
- **Format**: JPG for photos, PNG for screenshots
- **Compress**: Keep under 200KB per image

### Writing
- **Short paragraphs**: 3-5 sentences max
- **Active voice**: "FigTracker tracks prices" not "Prices are tracked"
- **Show, don't tell**: Use screenshots and examples
- **Clear headings**: Describe what's in the section

## Example Article Flow

```
[Heading H2] What is FigTracker?
[Paragraph] FigTracker is a free LEGO price tracker...
[Image] Screenshot of dashboard
[Paragraph] Unlike other tools...

[Heading H2] Key Features
[List]
• Real-time price data
• Collection tracking
• Inventory management

[Image] Feature comparison chart

[Heading H2] FigTracker vs BrickLink
[Comparison]
- FigTracker: Pros/Cons
- BrickLink: Pros/Cons

[Callout - Tip] Pro Tip: Use both tools together!

[Heading H2] Getting Started
[Paragraph] To start using FigTracker...
[Image] Sign-up flow

[Divider]

[Heading H2] Conclusion
[Paragraph] FigTracker makes LEGO collecting...
[Callout - Info] Ready to start? Visit /search to begin
```

## After Publishing

Your article will be available at:
- EN: `https://figtracker.ericksu.com/articles/[slug]`
- DE: `https://de.figtracker.ericksu.com/articles/[slug]`
- FR: `https://fr.figtracker.ericksu.com/articles/[slug]`
- ES: `https://es.figtracker.ericksu.com/articles/[slug]`

It will also appear on the `/articles` page automatically.

## Tips for Great Articles

1. **Start strong** - First paragraph should hook readers
2. **Use visuals** - Images every 3-4 paragraphs (like Apple)
3. **Break it up** - Use lists, callouts, comparisons for variety
4. **Be concise** - Every sentence should add value
5. **Add examples** - Real-world examples make concepts concrete
6. **End with CTA** - Tell readers what to do next

## Common Mistakes to Avoid

❌ Walls of text without images
❌ Generic stock photos instead of real screenshots
❌ Missing alt text on images
❌ Too many heading levels (stick to H2/H3)
❌ No clear conclusion or next steps
❌ Forgetting to translate all languages

## Troubleshooting

**Can't upload image?**
- Check file size (max 5MB)
- Check file type (PNG, JPG, WEBP only)
- Try again in a few seconds

**Slug already exists?**
- Change the slug to something unique
- Check existing articles at `/admin/articles`

**Article not showing?**
- Make sure status is "published" not "draft"
- Check you added English translation (required)
- Clear browser cache and refresh

## Database Migration (Important!)

⚠️ **Before deploying to production:**

1. The database schema has been updated (new tables added)
2. Run migration on production:
   ```bash
   npx prisma migrate deploy
   ```
3. Update admin user role:
   ```sql
   UPDATE "User" SET "role" = 'admin' WHERE "email" = 'erickkosysu@gmail.com';
   ```

## Support

Questions? Check:
- Apple Newsroom for inspiration: https://www.apple.com/newsroom/
- Existing FigTracker articles: `/articles`
- Component examples: `/app/articles/templates/example-article-template.tsx`

---

**Ready to create your first article?** Visit `/admin/articles` and click "New Article"!
