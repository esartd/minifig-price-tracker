/**
 * ARTICLE TEMPLATE
 *
 * Copy this file to create a new article.
 * Follow these steps:
 *
 * 1. Copy this file and rename it (e.g., "my-new-article.tsx")
 * 2. Upload your images to /public/images/articles/[article-slug]/
 * 3. Update the metadata at the top
 * 4. Write your article using the pre-styled components
 * 5. Add the article to lib/guides-data.ts
 *
 * Available components:
 * - ArticleHeading: Main section headings (h2)
 * - ArticleSubheading: Subsection headings (h3)
 * - ArticleParagraph: Body text paragraphs
 * - ArticleList: Unordered lists
 * - ArticleListItem: List items
 * - ArticleImage: Images with optional captions
 * - ArticleCallout: Highlighted boxes (info, tip, warning)
 * - ArticleComparison: Side-by-side comparison cards
 */

import {
  ArticleHeading,
  ArticleSubheading,
  ArticleParagraph,
  ArticleList,
  ArticleListItem,
  ArticleImage,
  ArticleCallout,
  ArticleComparison,
} from '@/components/article';

export default function ExampleArticle() {
  return (
    <>
      {/* Introduction - Start with a compelling opening paragraph */}
      <ArticleParagraph>
        This is your opening paragraph. Make it compelling and set the context for what readers will learn.
        Keep it concise but informative.
      </ArticleParagraph>

      {/* Featured Image - Use this early in the article */}
      <ArticleImage
        src="/images/articles/example/hero-image.jpg"
        alt="Descriptive alt text for accessibility"
        caption="Optional caption describing what's in the image"
        priority={true} // Set true for the first image (loads faster)
      />

      {/* Main Section 1 */}
      <ArticleHeading>
        Your First Main Section
      </ArticleHeading>

      <ArticleParagraph>
        Explain your first main point here. Use clear, conversational language.
        Break complex ideas into digestible paragraphs.
      </ArticleParagraph>

      {/* Callout Box - Use for important tips or warnings */}
      <ArticleCallout type="tip">
        <strong>Pro Tip:</strong> Use callouts to highlight important information
        that readers shouldn't miss. Choose from 'info', 'tip', or 'warning' types.
      </ArticleCallout>

      {/* Subsection */}
      <ArticleSubheading>
        A Subsection Within This Topic
      </ArticleSubheading>

      <ArticleParagraph>
        Break down complex topics into subsections for better readability.
      </ArticleParagraph>

      {/* Bulleted List */}
      <ArticleList>
        <ArticleListItem>First key point or benefit</ArticleListItem>
        <ArticleListItem>Second key point or benefit</ArticleListItem>
        <ArticleListItem>Third key point or benefit</ArticleListItem>
      </ArticleList>

      {/* Supporting Image */}
      <ArticleImage
        src="/images/articles/example/supporting-image.jpg"
        alt="Another descriptive alt text"
        caption="Use images every 3-4 paragraphs like Apple does"
      />

      {/* Main Section 2 */}
      <ArticleHeading>
        Your Second Main Section
      </ArticleHeading>

      <ArticleParagraph>
        Continue building on your topic. Each section should flow logically to the next.
      </ArticleParagraph>

      {/* Comparison Component - Perfect for vs. articles */}
      <ArticleComparison
        items={[
          {
            title: 'Option A',
            icon: '🎯',
            pros: [
              'First advantage of Option A',
              'Second advantage of Option A',
              'Third advantage of Option A',
            ],
            cons: [
              'First disadvantage of Option A',
              'Second disadvantage of Option A',
            ],
          },
          {
            title: 'Option B',
            icon: '⚡',
            pros: [
              'First advantage of Option B',
              'Second advantage of Option B',
            ],
            cons: [
              'First disadvantage of Option B',
              'Second disadvantage of Option B',
              'Third disadvantage of Option B',
            ],
          },
        ]}
      />

      {/* Main Section 3 */}
      <ArticleHeading>
        Your Third Main Section
      </ArticleHeading>

      <ArticleParagraph>
        Continue with additional main points. Aim for 3-5 major sections per article.
      </ArticleParagraph>

      <ArticleImage
        src="/images/articles/example/final-image.jpg"
        alt="Final image alt text"
      />

      {/* Conclusion Section */}
      <ArticleHeading>
        Conclusion
      </ArticleHeading>

      <ArticleParagraph>
        Wrap up your article by summarizing the key takeaways. End with a call-to-action
        or next steps for the reader.
      </ArticleParagraph>

      <ArticleCallout type="info">
        <strong>Ready to get started?</strong> Visit our{' '}
        <a href="/search" style={{ color: '#1a73e8', textDecoration: 'underline' }}>
          search page
        </a>{' '}
        to begin tracking your collection.
      </ArticleCallout>
    </>
  );
}
