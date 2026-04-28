import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from '@/i18n/request';
import Header from '@/components/header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen" style={{backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column'}}>
        <Header />
        <main style={{flex: 1}}>{children}</main>
        <Footer />
        <ScrollToTop />
      </div>
    </NextIntlClientProvider>
  );
}
