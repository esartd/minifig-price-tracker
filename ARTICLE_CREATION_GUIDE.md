# Article Creation Guide

This guide explains how to create new articles for FigTracker using the component-based template system.

## Quick Start

1. **Copy the template**
   ```bash
   cp app/articles/templates/example-article-template.tsx app/articles/templates/my-article.tsx
   ```

2. **Create an images folder**
   ```bash
   mkdir -p public/images/articles/my-article-slug
   ```

3. **Add your images**
   - Upload images to `/public/images/articles/my-article-slug/`
   - Use descriptive filenames (e.g., `comparison-chart.jpg`, `hero-image.jpg`)
   - Recommended size: 1400px wide (scales down automatically)
   - Format: JPG for photos, PNG for screenshots/diagrams

4. **Write your article**
   - Edit the template file with your content
   - Use the pre-styled components for consistency

5. **Register the article**
   - Add article metadata to `lib/guides-data.ts`

## Available Components

### Text Components

#### ArticleHeading
Main section headings (h2 level)
```tsx
<ArticleHeading>Your Section Title</ArticleHeading>
```

#### ArticleSubheading
Subsection headings (h3 level)
```tsx
<ArticleSubheading>Your Subsection Title</ArticleSubheading>
```

#### ArticleParagraph
Body text paragraphs
```tsx
<ArticleParagraph>
  Your paragraph text here. Can include <strong>bold text</strong> and links.
</ArticleParagraph>
```

#### ArticleList & ArticleListItem
Bulleted lists
```tsx
<ArticleList>
  <ArticleListItem>First point</ArticleListItem>
  <ArticleListItem>Second point</ArticleListItem>
</ArticleList>
```

### Image Component

#### ArticleImage
Images with automatic styling and optional captions
```tsx
<ArticleImage
  src="/images/articles/my-article/image.jpg"
  alt="Descriptive alt text for accessibility"
  caption="Optional caption text"
  priority={true} // Use for first image only (faster loading)
/>
```

**Best practices:**
- Always include descriptive alt text
- Use captions to provide context
- Set `priority={true}` only on the first image
- Place images every 3-4 paragraphs (like Apple does)

### Callout Component

#### ArticleCallout
Highlighted boxes for important information
```tsx
<ArticleCallout type="tip">
  <strong>Pro Tip:</strong> Your helpful tip here.
</ArticleCallout>
```

**Types:**
- `info` - Blue background (general information)
- `tip` - Green background (helpful tips)
- `warning` - Yellow background (warnings/cautions)

### Comparison Component

#### ArticleComparison
Side-by-side comparison cards (perfect for "vs" articles)
```tsx
<ArticleComparison
  items={[
    {
      title: 'FigTracker',
      icon: '🎯',
      pros: [
        'Free to use',
        'Modern interface',
        'Real-time prices',
      ],
      cons: [
        'Newer platform',
        'Smaller community',
      ],
    },
    {
      title: 'BrickLink',
      icon: '🧱',
      pros: [
        'Largest marketplace',
        'Established community',
      ],
      cons: [
        'Outdated interface',
        'Complex for beginners',
      ],
    },
  ]}
/>
```

## Article Structure Best Practices

### 1. Opening (1-2 paragraphs)
- Hook the reader immediately
- Clearly state what they'll learn
- Set context and expectations

### 2. Hero Image
- Use a compelling hero image early
- Set `priority={true}` on this image
- Include a descriptive caption

### 3. Main Content (3-5 sections)
- Break article into logical sections with `<ArticleHeading>`
- Use subsections with `<ArticleSubheading>` when needed
- Keep paragraphs short (3-5 sentences)
- Add images every 3-4 paragraphs

### 4. Visual Variety
- Mix text, images, lists, and callouts
- Use comparisons for "vs" articles
- Use callouts to highlight key points
- Break up text walls with images

### 5. Conclusion
- Summarize key takeaways
- Include a call-to-action
- Consider using a callout for the CTA

## Image Guidelines

### Image Sizes
- **Hero images**: 1400px × 800px
- **Supporting images**: 1400px wide (any height)
- **Comparison charts**: 1200px × 800px

### Image Optimization
Before uploading:
1. Resize to recommended dimensions
2. Compress (aim for under 200KB per image)
3. Use JPG for photos, PNG for text/diagrams
4. Use descriptive filenames

### Image Placement
- First image: After opening paragraph(s)
- Supporting images: Every 3-4 paragraphs
- Final image: Before conclusion (optional)

## Registering Your Article

After creating your article component, add it to `lib/guides-data.ts`:

```typescript
{
  slug: 'my-article-slug',
  title: {
    en: 'My Article Title',
    de: 'German Title',
    fr: 'French Title',
    es: 'Spanish Title',
  },
  description: {
    en: 'Short description for article card',
    de: 'German description',
    fr: 'French description',
    es: 'Spanish description',
  },
  author: 'FigTracker Team',
  date: '2026-05-10',
  readTime: '8 min read',
  status: 'published',
  component: 'my-article', // matches filename without .tsx
}
```

## Translation

For multilingual support:
1. Create separate template files per language (e.g., `my-article-en.tsx`, `my-article-de.tsx`)
2. Or use the translation system with translation keys
3. All metadata in `guides-data.ts` must include all 4 languages

## SEO Best Practices

1. **Title**: 50-60 characters, include main keyword
2. **Description**: 150-160 characters, compelling summary
3. **Alt text**: Descriptive, include keywords naturally
4. **Headings**: Use hierarchy properly (h2 → h3)
5. **Images**: Optimize file size and use descriptive names

## Example Article Workflow

```bash
# 1. Create article file
cp app/articles/templates/example-article-template.tsx \\
   app/articles/templates/lego-investment-guide.tsx

# 2. Create images folder
mkdir public/images/articles/lego-investment-guide

# 3. Add images
# Upload your images to the folder

# 4. Edit the article
# Write your content using the components

# 5. Register in guides-data.ts
# Add metadata entry

# 6. Test locally
npm run dev
# Visit http://localhost:3000/articles/lego-investment-guide

# 7. Commit and deploy
git add .
git commit -m "Add LEGO investment guide article"
git push
```

## Tips for Great Articles

1. **Write for your audience**: Assume readers are LEGO collectors, not experts
2. **Show, don't tell**: Use screenshots and images to demonstrate points
3. **Be concise**: Every sentence should add value
4. **Use examples**: Real-world examples make concepts concrete
5. **Add personality**: Write conversationally, not robotically
6. **Break it up**: Use lists, callouts, and images to create visual rhythm
7. **End strong**: Leave readers with clear next steps

## Common Mistakes to Avoid

- ❌ Walls of text without images
- ❌ Generic stock photos instead of relevant screenshots
- ❌ Missing alt text on images
- ❌ Inconsistent heading hierarchy
- ❌ No clear takeaways or conclusion
- ❌ Forgetting to translate all content
- ❌ Images that are too large (slow page load)

## Questions?

If you need help or have questions about creating articles, refer to:
- Apple Newsroom for inspiration: https://www.apple.com/newsroom/
- Existing articles in `/app/articles/templates/`
- Component source code in `/components/article/`
