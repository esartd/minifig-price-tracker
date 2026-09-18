/**
 * Pass-through layout for /themes/[theme].
 *
 * ## Why there is no generateMetadata here
 *
 * There was one, and every field it produced was overridden by the page's own
 * generateMetadata in `page.tsx` -- title, description, keywords, openGraph,
 * twitter and alternates are all set there, and a deeper segment wins. Checked
 * on production before removing it: /themes/star-wars serves the page's
 * og-image.png, not the BrickLink theme image this layout was building.
 *
 * So it was dead metadata, and expensive dead metadata. To compute a minifig
 * count it never got to use, it called `getAllCategories()` and then
 * `getAllMinifigs()` and filtered all ~19,000 rows -- on every request to every
 * theme page, in addition to the page doing its own work.
 *
 * It also built its canonical from `encodeURIComponent(themeName)`, the raw
 * requested segment, which is the pre-slug form that middleware.ts now 301s
 * away from. Had the page ever stopped setting `alternates`, this would have
 * quietly reintroduced the duplicate theme URLs that `canonicalThemePath` and
 * the redirects in next.config.js exist to collapse.
 *
 * If metadata is ever needed at this level again, note that `openGraph` is
 * replaced wholesale by the deeper segment rather than merged field-by-field --
 * that is what made the theme image here unreachable.
 */
export default function ThemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
