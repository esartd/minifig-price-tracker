import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      preferredCurrency?: string | null;
    currencyChosen?: boolean;
    emailConfirmed?: boolean;
      /** True once the user has picked a currency in settings. */
      currencyChosen?: boolean;
      /**
       * True once the address is confirmed. Google sign-ins are true on arrival.
       *
       * Named `emailConfirmed` and not `emailVerified` because NextAuth's own
       * AdapterUser already declares `emailVerified: Date`; augmenting the
       * same name with a boolean intersects to `Date & boolean`, which nothing
       * can satisfy.
       */
      emailConfirmed?: boolean;
      preferredCountryCode?: string | null;
      preferredRegion?: string | null;
      currencySymbol?: string | null;
      locale?: string | null;
      username?: string | null;
      profilePublic?: boolean | null;
      /**
       * The Google profile picture URL, held separately from `image` so that
       * picking a LEGO avatar does not destroy it. `image` is whatever the user
       * is currently showing; this is the standby.
       */
      googleImage?: string | null;
      /** Whether a Google account is linked -- gates the "use my Google photo"
       *  option in the avatar picker. */
      hasGoogle?: boolean;
    };
  }

  interface User {
    id: string;
    preferredCurrency?: string | null;
    preferredCountryCode?: string | null;
    preferredRegion?: string | null;
    currencySymbol?: string | null;
    locale?: string | null;
    username?: string | null;
    profilePublic?: boolean | null;
  }
}
