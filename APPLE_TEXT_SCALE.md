# Apple Text Scale Reference

Your site now uses Apple's official text sizing system for consistency and accessibility.

## Text Sizes (in pixels)

### Small Text
- **11px** - Fine print, legal text, captions
- **12px** - Secondary text, footnotes, disclaimers
- **14px** - Labels, secondary body text, form labels

### Body Text
- **17px** - Primary body text, form inputs (Apple's standard)
- **20px** - Large body text, feature descriptions

### Headlines
- **24px** - Subheadings
- **28px** - Section headings
- **32px** - Page headings
- **40px** - Hero headings (desktop)
- **48px** - Display headings

## Usage in Your App

### Form Fields
```tsx
// Label
className="text-[14px] font-medium"

// Input
className="text-[17px] h-12"  // 48px height

// Button
className="text-[17px] h-12"
```

### Headers
```tsx
// Page title
className="text-[32px] font-semibold"

// Hero title
className="text-[40px] font-semibold"

// Subtitle
className="text-[17px] text-gray-500"
```

### Body Content
```tsx
// Primary text
className="text-[17px]"

// Secondary text
className="text-[14px] text-gray-600"

// Fine print
className="text-[12px] text-gray-400"
```

### Feature Lists
```tsx
// Feature title
className="text-[17px] font-medium"

// Feature description
className="text-[14px] text-gray-600"
```

## Line Heights

Apple uses these line-height ratios:
- **Small text (11-14px)**: 1.4-1.5
- **Body text (17-20px)**: 1.5
- **Headlines (24px+)**: 1.2-1.3

In Tailwind:
```tsx
className="leading-tight"    // 1.25 for headlines
className="leading-normal"   // 1.5 for body
className="leading-relaxed"  // 1.625 for large text
```

## Font Weights

Apple uses:
- **400** - Regular (default body text)
- **500** - Medium (labels, emphasized text)
- **600** - Semibold (headings, buttons)

In Tailwind:
```tsx
className="font-normal"    // 400
className="font-medium"    // 500
className="font-semibold"  // 600
```

## Current Implementation

### Auth Pages
- **Page title**: 32px semibold
- **Subtitle**: 17px regular
- **Form labels**: 14px medium
- **Form inputs**: 17px regular, 48px height
- **Buttons**: 17px medium, 48px height
- **Links**: 14px medium
- **Fine print**: 12px regular

### Hero Section
- **Hero title**: 40px semibold
- **Hero subtitle**: 20px regular
- **Feature titles**: 17px medium
- **Feature descriptions**: 14px regular

## Why These Sizes?

1. **17px body text**: Apple's research shows this is optimal for reading on screens
2. **48px touch targets**: Meets Apple's minimum for comfortable tapping
3. **14px labels**: Large enough to read, small enough to distinguish from input text
4. **Even increments**: Easy to scale, maintain visual hierarchy

## Responsive Scaling

For smaller screens, consider:
```tsx
// Mobile: smaller, Desktop: larger
className="text-[14px] sm:text-[17px]"
className="text-[24px] sm:text-[32px]"
className="text-[32px] sm:text-[40px]"
```

## Quick Reference Table

| Use Case | Size | Weight | Tailwind Class |
|----------|------|--------|----------------|
| Fine print | 12px | Regular | `text-[12px]` |
| Form labels | 14px | Medium | `text-[14px] font-medium` |
| Body text | 17px | Regular | `text-[17px]` |
| Large body | 20px | Regular | `text-[20px]` |
| Subheading | 24px | Semibold | `text-[24px] font-semibold` |
| Page heading | 32px | Semibold | `text-[32px] font-semibold` |
| Hero heading | 40px | Semibold | `text-[40px] font-semibold` |
| Display | 48px | Semibold | `text-[48px] font-semibold` |

This scale ensures your app has the same polished, accessible feel as Apple's products.
