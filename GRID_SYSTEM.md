# 12-Column Grid System (Apple-Inspired)

Your site now uses a consistent 12-column grid system inspired by Apple's design language.

## Grid Container Component

Use the `GridContainer` component for layouts that need a 12-column grid:

```tsx
import { GridContainer } from '@/components/grid-container';

<GridContainer>
  <div className="col-span-12 md:col-span-6">
    Left column (full width on mobile, half on desktop)
  </div>
  <div className="col-span-12 md:col-span-6">
    Right column
  </div>
</GridContainer>
```

## Container Sizes

Choose from three container sizes:

```tsx
<GridContainer size="sm">  {/* 980px max-width */}
<GridContainer size="md">  {/* 1200px max-width (default) */}
<GridContainer size="lg">  {/* 1400px max-width */}
```

## Simple Container (No Grid)

For single-column content without grid:

```tsx
import { Container } from '@/components/grid-container';

<Container>
  <h1>Your content here</h1>
  <p>Single column, centered, with responsive padding</p>
</Container>
```

## Grid Column Spans

The 12-column grid divides content into flexible layouts:

```tsx
{/* Full width */}
<div className="col-span-12">Full width</div>

{/* Half width */}
<div className="col-span-6">Half width</div>

{/* Third width */}
<div className="col-span-4">One third</div>

{/* Quarter width */}
<div className="col-span-3">Quarter width</div>

{/* Responsive: Full on mobile, half on tablet, third on desktop */}
<div className="col-span-12 md:col-span-6 lg:col-span-4">
  Responsive column
</div>
```

## Common Layout Patterns

### Two-Column Layout (50/50)
```tsx
<GridContainer>
  <div className="col-span-12 md:col-span-6">Left</div>
  <div className="col-span-12 md:col-span-6">Right</div>
</GridContainer>
```

### Three-Column Layout (33/33/33)
```tsx
<GridContainer>
  <div className="col-span-12 md:col-span-4">Column 1</div>
  <div className="col-span-12 md:col-span-4">Column 2</div>
  <div className="col-span-12 md:col-span-4">Column 3</div>
</GridContainer>
```

### Sidebar Layout (33/66)
```tsx
<GridContainer>
  <aside className="col-span-12 md:col-span-4">Sidebar</aside>
  <main className="col-span-12 md:col-span-8">Main content</main>
</GridContainer>
```

### Featured Content Layout (66/33)
```tsx
<GridContainer>
  <article className="col-span-12 md:col-span-8">Featured</article>
  <aside className="col-span-12 md:col-span-4">Related</aside>
</GridContainer>
```

### Offset Columns
```tsx
{/* Start at column 4, span 6 columns (centered) */}
<div className="col-span-12 md:col-start-4 md:col-span-6">
  Centered content
</div>
```

## Responsive Breakpoints

Tailwind's default breakpoints:
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1536px (extra large)

## Gap Spacing

The grid uses responsive gaps:
- Mobile: 1rem (16px)
- Tablet (sm): 1.5rem (24px)
- Desktop (lg): 2rem (32px)

## Example: Product Grid

```tsx
<GridContainer>
  {products.map(product => (
    <div
      key={product.id}
      className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
    >
      <ProductCard product={product} />
    </div>
  ))}
</GridContainer>
```

This creates:
- 1 column on mobile (col-span-12)
- 2 columns on tablet (col-span-6)
- 3 columns on medium screens (col-span-4)
- 4 columns on large screens (col-span-3)

## Nested Grids

You can nest grids for complex layouts:

```tsx
<GridContainer>
  <div className="col-span-12 md:col-span-8">
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-6">Nested column 1</div>
      <div className="col-span-6">Nested column 2</div>
    </div>
  </div>
  <div className="col-span-12 md:col-span-4">
    Sidebar
  </div>
</GridContainer>
```

## Apple-Style Design Principles

1. **Generous whitespace**: Use the built-in gaps and padding
2. **Responsive by default**: Always provide mobile, tablet, and desktop layouts
3. **Consistent alignment**: Use the grid to align elements across sections
4. **Visual hierarchy**: Vary column spans to emphasize important content
5. **Breathing room**: Don't fill every column - sometimes less is more

## Tips

- Always start with `col-span-12` for mobile-first design
- Use `md:` and `lg:` prefixes for larger screens
- Combine with padding utilities: `p-4`, `py-6`, etc.
- Use `gap-4`, `gap-6`, or `gap-8` to adjust spacing
- The container has responsive padding built-in (clamps based on viewport)

## Current Implementation

- **Header**: Uses 12-column grid with responsive layout
- **Main content**: Wrapped in responsive container
- **Auth pages**: Full-width with internal grids

You can now apply this grid system to any page or component for consistent, Apple-style layouts!
