import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      preferredCurrency?: string | null;
      preferredCountryCode?: string | null;
      preferredRegion?: string | null;
      currencySymbol?: string | null;
      locale?: string | null;
    };
  }

  interface User {
    id: string;
    preferredCurrency?: string | null;
    preferredCountryCode?: string | null;
    preferredRegion?: string | null;
    currencySymbol?: string | null;
    locale?: string | null;
  }
}
