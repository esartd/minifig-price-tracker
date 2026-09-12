import { CheckBadgeIcon } from '@heroicons/react/24/solid';

/**
 * The blue check next to a subscriber's name, in the shape people already know
 * from X and Facebook.
 *
 * What it does and does not claim: this marks someone who pays for Premium. It
 * is NOT identity verification, and the tooltip says "Premium subscriber" for
 * exactly that reason -- a check mark that reads as "this person is who they
 * say they are" would be a claim we have no way to stand behind, and collectors
 * trade with each other off the back of these profiles.
 *
 * Only ever fed a boolean. The APIs deliberately derive it server-side and send
 * `isSubscriber: true/false` rather than the Stripe status string: whether
 * someone is subscribed is already public the moment a badge is visible, but
 * "past_due" or "canceled" is their billing situation and is nobody else's
 * business.
 */

const BRAND_BLUE = '#3b82f6';

export default function SubscriberBadge({
  size = 16,
  label = 'Premium subscriber',
}: {
  size?: number;
  label?: string;
}) {
  return (
    <CheckBadgeIcon
      role="img"
      aria-label={label}
      // Native tooltip is right here: it is a passive hint on a decorative
      // glyph, not an interaction worth shipping a custom tooltip for.
      title={label}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        color: BRAND_BLUE,
        // Never let the badge be what gets squeezed when a long display name
        // runs out of room -- a half-clipped check looks like a rendering bug.
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'text-bottom',
      }}
    />
  );
}
