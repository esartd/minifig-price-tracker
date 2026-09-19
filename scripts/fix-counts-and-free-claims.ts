/**
 * Refresh the catalogue counts and correct the "completely free" claims
 * across all ten locale files.
 *
 * ## The counts
 *
 * The UI says 18,000+ minifigures and 20,000+ sets. The catalogue now holds
 * 19,246 and 21,859 and grows twice a month, so both understate the site. They
 * appear in far more places than expected -- the FAQ, page metadata, the
 * marketplace page, price alerts, the support page, the May 4th deals CTA --
 * roughly 150 strings once multiplied across ten languages.
 *
 * Each language writes thousands differently and the files are not even
 * internally consistent about it: de/it/nl/pt use 18.000, fr/pl/sv use 18 000
 * (some with a non-breaking space), en/ja use 18,000, and es uses BOTH. So the
 * separator is detected per occurrence and preserved rather than assumed.
 *
 * Rounded down to 19,000 and 21,000 so they stay true as the catalogue grows,
 * instead of going stale again at the next BrickLink export.
 *
 * ## The free claims
 *
 * Premium launched at $4.99/month. The FAQ still answers "Is IntoBrick free to
 * use?" with "completely free ... without any payment required", and the signup
 * page says "100% Free". A reader disproves that by clicking Premium in the nav.
 *
 * The replacement is not weaker: pricing genuinely is free and needs no account,
 * and Premium only adds seller tooling. Saying so precisely is a better argument
 * than a blanket claim, because the reader can check it.
 *
 * ## Deliberately not touched
 *
 * guideArticles.*.content -- full English article bodies kept in the translation
 * files as a fallback for when an article is missing from the database. All six
 * are in the database, so this text does not render. Rewriting ~97,000
 * characters of dead fallback earns nothing.
 *
 *   npx tsx scripts/fix-counts-and-free-claims.ts          # dry run
 *   npx tsx scripts/fix-counts-and-free-claims.ts --apply
 */

import fs from 'fs';
import path from 'path';

const APPLY = process.argv.includes('--apply');
const DIR = 'translations-backup';
const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'sv', 'ja'] as const;
type Locale = (typeof LOCALES)[number];

/**
 * Old value -> new value. Order matters: 18,732 must be handled before the
 * generic 18-thousand rule, or it becomes "19,732".
 */
const COUNT_RULES: [RegExp, (sep: string) => string][] = [
  // The article's analysed-minifigure count, which has its own exact figure.
  [/18([.,\s ])732/g, (sep) => `19${sep}000`],
  [/18,732/g, () => '19,000'],
  // Catalogue sizes. The separator captured from the source is reused, so a
  // German "18.000" becomes "19.000" and a Swedish "18 000" becomes "19 000".
  [/18([.,\s ])000/g, (sep) => `19${sep}000`],
  [/20([.,\s ])000/g, (sep) => `21${sep}000`],
  // Unseparated forms, just in case.
  [/\b18000\b/g, () => '19000'],
  [/\b20000\b/g, () => '21000'],
];

/** The FAQ answer to "Is IntoBrick free to use?" -- faq.items[1].a */
const FREE_FAQ: Record<Locale, string> = {
  en: 'Yes. Searching and pricing is free — 19,000+ minifigures, 21,000+ LEGO sets, real-time pricing in 15+ currencies, and inventory tracking, with no card required. Premium ($4.99/month) adds seller tools like bulk listing and deal alerts.',
  de: 'Ja. Suchen und Preise abrufen ist kostenlos — über 19.000 Minifiguren, mehr als 21.000 LEGO-Sets, Echtzeitpreise in über 15 Währungen und Inventarverwaltung, ganz ohne Kreditkarte. Premium (4,99 $/Monat) ergänzt Verkäufer-Werkzeuge wie Massen-Listings und Deal-Benachrichtigungen.',
  fr: "Oui. La recherche et l'évaluation sont gratuites — plus de 19 000 minifigurines, plus de 21 000 sets LEGO, des prix en temps réel dans plus de 15 devises et le suivi d'inventaire, sans carte bancaire. Premium (4,99 $/mois) ajoute des outils pour les vendeurs : mise en vente groupée et alertes bons plans.",
  es: 'Sí. Buscar y consultar precios es gratis — más de 19.000 minifiguras, más de 21.000 sets LEGO, precios en tiempo real en más de 15 monedas y seguimiento de inventario, sin tarjeta. Premium (4,99 $/mes) añade herramientas para vendedores, como publicación masiva y alertas de ofertas.',
  it: 'Sì. Cercare e valutare è gratuito — oltre 19.000 minifigure, più di 21.000 set LEGO, prezzi in tempo reale in oltre 15 valute e gestione inventario, senza carta di credito. Premium (4,99 $/mese) aggiunge strumenti per venditori come la pubblicazione in blocco e gli avvisi sulle offerte.',
  nl: 'Ja. Zoeken en prijzen opvragen is gratis — ruim 19.000 minifiguren, meer dan 21.000 LEGO-sets, realtime prijzen in meer dan 15 valuta en voorraadbeheer, zonder creditcard. Premium ($4,99/maand) voegt verkopersfuncties toe, zoals bulk aanbieden en dealmeldingen.',
  pl: 'Tak. Wyszukiwanie i wycena są bezpłatne — ponad 19 000 minifigurek, ponad 21 000 zestawów LEGO, ceny w czasie rzeczywistym w ponad 15 walutach i śledzenie kolekcji, bez karty. Premium (4,99 $/miesiąc) dodaje narzędzia dla sprzedawców: masowe wystawianie i powiadomienia o okazjach.',
  pt: 'Sim. Pesquisar e consultar preços é grátis — mais de 19.000 minifiguras, mais de 21.000 sets LEGO, preços em tempo real em mais de 15 moedas e controle de estoque, sem precisar de cartão. O Premium (US$ 4,99/mês) acrescenta ferramentas para vendedores, como anúncios em massa e alertas de ofertas.',
  sv: 'Ja. Att söka och se priser är gratis — över 19 000 minifigurer, mer än 21 000 LEGO-set, realtidspriser i över 15 valutor och lagerhantering, utan kort. Premium (4,99 $/månad) lägger till säljverktyg som massannonsering och prisbevakning.',
  ja: 'はい。検索と価格確認は無料です。19,000体以上のミニフィグ、21,000点以上の LEGO セット、15以上の通貨でのリアルタイム価格、在庫管理まで、カード登録なしでご利用いただけます。Premium（月額4.99ドル）では一括出品やお得情報の通知といった出品者向け機能が追加されます。',
};

const SIGNUP_SUBTITLE: Record<Locale, string> = {
  en: 'One account. Unlimited items. Pricing stays free.',
  de: 'Ein Konto. Unbegrenzt viele Artikel. Preise bleiben kostenlos.',
  fr: 'Un compte. Articles illimités. Les prix restent gratuits.',
  es: 'Una cuenta. Artículos ilimitados. Los precios siguen siendo gratis.',
  it: 'Un account. Articoli illimitati. I prezzi restano gratuiti.',
  nl: 'Eén account. Onbeperkt items. Prijzen blijven gratis.',
  pl: 'Jedno konto. Nieograniczona liczba przedmiotów. Wyceny pozostają bezpłatne.',
  pt: 'Uma conta. Itens ilimitados. A consulta de preços continua grátis.',
  sv: 'Ett konto. Obegränsat antal föremål. Priser förblir gratis.',
  ja: 'アカウント1つ、アイテム数は無制限。価格確認はずっと無料です。',
};

const SIGNUP_BADGE: Record<Locale, string> = {
  en: 'Free to use • No credit card required',
  de: 'Kostenlos nutzbar • Keine Kreditkarte nötig',
  fr: 'Gratuit • Aucune carte bancaire requise',
  es: 'Gratis • Sin tarjeta de crédito',
  it: 'Gratuito • Nessuna carta di credito',
  nl: 'Gratis te gebruiken • Geen creditcard nodig',
  pl: 'Bezpłatnie • Bez karty kredytowej',
  pt: 'Grátis • Sem cartão de crédito',
  sv: 'Gratis att använda • Inget kort behövs',
  ja: '無料で利用可能 • クレジットカード不要',
};

/** Walk every string in the tree, applying fn. Arrays included. */
function mapStrings(node: any, fn: (s: string) => string): any {
  if (typeof node === 'string') return fn(node);
  if (Array.isArray(node)) return node.map((v) => mapStrings(v, fn));
  if (node && typeof node === 'object') {
    const out: any = {};
    for (const [k, v] of Object.entries(node)) out[k] = mapStrings(v, fn);
    return out;
  }
  return node;
}

function applyCounts(s: string): string {
  let out = s;
  for (const [re, make] of COUNT_RULES) {
    out = out.replace(re, (_m, sep: string | undefined) => make(sep ?? ''));
  }
  return out;
}

function main() {
  console.log(APPLY ? '\nUPDATING COUNTS AND FREE CLAIMS\n' : '\nDRY RUN (pass --apply to write)\n');

  let totalCounts = 0;
  let totalClaims = 0;

  for (const locale of LOCALES) {
    const file = path.join(DIR, `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));

    // 1. Counts everywhere, except the dead article-body fallback.
    const guideBodies: Record<string, string> = {};
    if (data.guideArticles) {
      for (const [slug, art] of Object.entries<any>(data.guideArticles)) {
        if (art && typeof art.content === 'string') guideBodies[slug] = art.content;
      }
    }

    let changed = 0;
    const updated = mapStrings(data, (s) => {
      const next = applyCounts(s);
      if (next !== s) changed++;
      return next;
    });

    // Put the untouched bodies back.
    for (const [slug, content] of Object.entries(guideBodies)) {
      if (updated.guideArticles?.[slug]) updated.guideArticles[slug].content = content;
    }

    // 2. The three claim strings.
    let claims = 0;
    if (updated.faq?.items?.[1]?.a) {
      updated.faq.items[1].a = FREE_FAQ[locale];
      claims++;
    }
    if (updated.auth?.signup) {
      updated.auth.signup.subtitle = SIGNUP_SUBTITLE[locale];
      updated.auth.signup.freeBadge = SIGNUP_BADGE[locale];
      claims += 2;
    }

    totalCounts += changed;
    totalClaims += claims;
    console.log(`  ${locale}: ${String(changed).padStart(3)} count strings, ${claims} claim strings`);

    if (APPLY) {
      fs.writeFileSync(file, JSON.stringify(updated, null, 2) + '\n', 'utf8');
    }
  }

  console.log(
    `\n${totalCounts} count strings and ${totalClaims} claim strings ${APPLY ? 'written' : 'staged'}.` +
      (APPLY ? '\n' : '\nNothing written.\n')
  );
}

main();
