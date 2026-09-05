#!/usr/bin/env node
/**
 * Fill in article title/description translations for every supported locale.
 *
 * The Article.translations column already held a per-locale array, but only
 * de/es/fr were populated and only on four of the six articles. The other six
 * languages fell back to English on the articles index and, more importantly,
 * in the <meta name="description"> of every article page.
 *
 * Two English descriptions were also auto-generated excerpts truncated
 * mid-word at exactly 160 characters ("...Bricklink is th"). Those are
 * rewritten properly here, which fixes the English site as well.
 *
 * SCOPE: titles and descriptions only. The article bodies live in
 * contentBlocks — about 97,000 characters of English across the six articles —
 * and are untouched. Translating those is a content project, not a script.
 *
 * Safe to run more than once: existing entries for a locale are replaced,
 * nothing is duplicated, and the previous value of every row is written to a
 * timestamped backup file before anything changes.
 */

import { PrismaClient } from '@prisma/client';
import { writeFileSync } from 'fs';

const prisma = new PrismaClient();

const ARTICLES = {
  'most-valuable-lego-minifigures-2026': {
    en: ['Top 50 Most Valuable LEGO Minifigures in 2026', 'We analyzed 18,732 LEGO minifigures to find the most valuable collectibles. Discover which minifigs command the highest prices on Bricklink marketplace.'],
    de: ['Die 50 wertvollsten LEGO Minifiguren im Jahr 2026', 'Wir haben 18.732 LEGO Minifiguren analysiert, um die wertvollsten Sammlerstücke zu finden. Entdecken Sie, welche Minifiguren auf dem Bricklink-Marktplatz die höchsten Preise erzielen.'],
    fr: ['Les 50 minifigurines LEGO les plus précieuses en 2026', 'Nous avons analysé 18 732 minifigurines LEGO pour trouver les objets de collection les plus précieux. Découvrez quelles minifigurines atteignent les prix les plus élevés sur le marché Bricklink.'],
    es: ['Las 50 minifiguras LEGO más valiosas de 2026', 'Analizamos 18.732 minifiguras LEGO para encontrar los coleccionables más valiosos. Descubre qué minifiguras alcanzan los precios más altos en el mercado de Bricklink.'],
    it: ['Le 50 minifigure LEGO più preziose del 2026', 'Abbiamo analizzato 18.732 minifigure LEGO per individuare i pezzi da collezione più preziosi. Scopri quali minifigure raggiungono i prezzi più alti sul mercato Bricklink.'],
    nl: ['De 50 waardevolste LEGO-minifiguren van 2026', 'We analyseerden 18.732 LEGO-minifiguren om de waardevolste verzamelobjecten te vinden. Ontdek welke minifiguren de hoogste prijzen halen op de Bricklink-marktplaats.'],
    pl: ['50 najcenniejszych minifigurek LEGO w 2026 roku', 'Przeanalizowaliśmy 18 732 minifigurki LEGO, aby znaleźć najcenniejsze okazy kolekcjonerskie. Sprawdź, które minifigurki osiągają najwyższe ceny na rynku Bricklink.'],
    pt: ['As 50 minifiguras LEGO mais valiosas de 2026', 'Analisámos 18.732 minifiguras LEGO para encontrar as peças de coleção mais valiosas. Descubra que minifiguras atingem os preços mais altos no mercado Bricklink.'],
    sv: ['De 50 mest värdefulla LEGO-minifigurerna 2026', 'Vi analyserade 18 732 LEGO-minifigurer för att hitta de mest värdefulla samlarobjekten. Se vilka minifigurer som betingar de högsta priserna på Bricklink.'],
    ja: ['2026年に最も価値の高い LEGO ミニフィグ トップ50', '18,732体の LEGO ミニフィグを分析し、最も価値の高いコレクターズアイテムを特定しました。Bricklink マーケットプレイスで高値がつくミニフィグをご紹介します。'],
  },
  'figtracker-vs-bricklink': {
    // Was a 160-character excerpt cut mid-word: "...Bricklink is th"
    en: ['FigTracker vs Bricklink: Which Should You Use?', 'Compare FigTracker and Bricklink for LEGO minifigure pricing. Learn what each platform does best, when to reach for which, and how to use them together.'],
    de: ['FigTracker oder Bricklink: Was sollten Sie nutzen?', 'Vergleichen Sie FigTracker und Bricklink für die Preisermittlung von LEGO Minifiguren. Erfahren Sie, was jede Plattform am besten kann und wie Sie beide zusammen einsetzen.'],
    fr: ['FigTracker ou Bricklink : lequel utiliser ?', 'Comparez FigTracker et Bricklink pour évaluer les minifigurines LEGO. Découvrez les points forts de chaque plateforme et comment les utiliser ensemble.'],
    es: ['FigTracker o Bricklink: ¿cuál deberías usar?', 'Compara FigTracker y Bricklink para valorar minifiguras LEGO. Descubre en qué destaca cada plataforma, cuándo usar una u otra y cómo combinarlas.'],
    it: ['FigTracker o Bricklink: quale conviene usare?', 'Confronta FigTracker e Bricklink per la valutazione delle minifigure LEGO. Scopri i punti di forza di ciascuna piattaforma e come usarle insieme.'],
    nl: ['FigTracker of Bricklink: wat kun je het beste gebruiken?', 'Vergelijk FigTracker en Bricklink voor het prijzen van LEGO-minifiguren. Ontdek waar elk platform in uitblinkt en hoe je ze samen gebruikt.'],
    pl: ['FigTracker czy Bricklink: z czego korzystać?', 'Porównaj FigTracker i Bricklink pod kątem wyceny minifigurek LEGO. Dowiedz się, w czym każda platforma jest najlepsza i jak korzystać z obu naraz.'],
    pt: ['FigTracker ou Bricklink: qual deve usar?', 'Compare o FigTracker e a Bricklink para avaliar minifiguras LEGO. Saiba em que cada plataforma se destaca e como usá-las em conjunto.'],
    sv: ['FigTracker eller Bricklink: vilken ska du välja?', 'Jämför FigTracker och Bricklink för prissättning av LEGO-minifigurer. Lär dig vad respektive plattform är bäst på och hur du använder dem tillsammans.'],
    ja: ['FigTracker と Bricklink はどちらを使うべきか', 'LEGO ミニフィグの価格調査における FigTracker と Bricklink を比較します。それぞれの得意分野と、両方を併用する方法を解説します。'],
  },
  'figtracker-vs-brickeconomy': {
    // Also a truncated excerpt: "...tools available. B"
    en: ['FigTracker vs BrickEconomy: Which LEGO Pricing Tool is Better?', 'Compare FigTracker and BrickEconomy for LEGO pricing and portfolio tracking. See how their data, coverage and pricing approach differ, and which fits your collection.'],
    de: ['FigTracker oder BrickEconomy: Welches LEGO-Preistool ist besser?', 'Vergleichen Sie FigTracker und BrickEconomy für LEGO-Preise und Portfolio-Verwaltung. Sehen Sie, wie sich Daten, Abdeckung und Preislogik unterscheiden.'],
    fr: ['FigTracker ou BrickEconomy : quel outil de prix LEGO choisir ?', 'Comparez FigTracker et BrickEconomy pour les prix LEGO et le suivi de portefeuille. Voyez en quoi leurs données, leur couverture et leur approche diffèrent.'],
    es: ['FigTracker o BrickEconomy: ¿qué herramienta de precios LEGO es mejor?', 'Compara FigTracker y BrickEconomy para precios LEGO y seguimiento de cartera. Descubre en qué se diferencian sus datos, su cobertura y su enfoque de precios.'],
    it: ['FigTracker o BrickEconomy: quale strumento di prezzi LEGO è migliore?', 'Confronta FigTracker e BrickEconomy per i prezzi LEGO e il monitoraggio del portafoglio. Scopri come cambiano dati, copertura e approccio alla valutazione.'],
    nl: ['FigTracker of BrickEconomy: welke LEGO-prijstool is beter?', 'Vergelijk FigTracker en BrickEconomy voor LEGO-prijzen en portefeuillebeheer. Zie hoe hun gegevens, dekking en prijsaanpak verschillen.'],
    pl: ['FigTracker czy BrickEconomy: które narzędzie do wyceny LEGO jest lepsze?', 'Porównaj FigTracker i BrickEconomy pod kątem wyceny LEGO i śledzenia portfela. Zobacz, czym różnią się dane, zasięg i podejście do wyceny.'],
    pt: ['FigTracker ou BrickEconomy: qual a melhor ferramenta de preços LEGO?', 'Compare o FigTracker e o BrickEconomy para preços LEGO e gestão de carteira. Veja como diferem os dados, a cobertura e a abordagem aos preços.'],
    sv: ['FigTracker eller BrickEconomy: vilket LEGO-prisverktyg är bäst?', 'Jämför FigTracker och BrickEconomy för LEGO-priser och portföljbevakning. Se hur deras data, täckning och prissättning skiljer sig åt.'],
    ja: ['FigTracker と BrickEconomy はどちらの LEGO 価格ツールが優れているか', 'LEGO の価格調査とポートフォリオ管理における FigTracker と BrickEconomy を比較します。データ、収録範囲、価格の考え方の違いを解説します。'],
  },
  'how-to-price-lego-minifigures': {
    en: ['How to Price LEGO Minifigures: Complete Guide for Sellers', 'Learn the fundamentals of pricing LEGO minifigures using Bricklink marketplace data. Understand quantity-weighted averages, simple averages, and how to factor in condition.'],
    de: ['LEGO Minifiguren richtig bepreisen: Der komplette Leitfaden für Verkäufer', 'Lernen Sie die Grundlagen der Preisgestaltung für LEGO Minifiguren mit Bricklink-Marktdaten. Verstehen Sie mengengewichtete Durchschnitte, einfache Durchschnitte und wie man den Zustand berücksichtigt.'],
    fr: ['Comment évaluer les minifigurines LEGO : guide complet pour les vendeurs', "Apprenez les fondamentaux de l'évaluation des minifigurines LEGO à partir des données du marché Bricklink. Comprenez les moyennes pondérées, les moyennes simples et comment tenir compte de l'état."],
    es: ['Cómo valorar minifiguras LEGO: guía completa para vendedores', 'Aprende los fundamentos de valorar minifiguras LEGO usando datos del mercado de Bricklink. Entiende promedios ponderados por cantidad, promedios simples y cómo considerar la condición.'],
    it: ['Come valutare le minifigure LEGO: guida completa per i venditori', "Impara le basi della valutazione delle minifigure LEGO con i dati del mercato Bricklink. Comprendi le medie ponderate per quantità, le medie semplici e come tenere conto delle condizioni."],
    nl: ['LEGO-minifiguren prijzen: complete gids voor verkopers', 'Leer de basis van het prijzen van LEGO-minifiguren met marktgegevens van Bricklink. Begrijp gewogen gemiddelden, gewone gemiddelden en hoe je de staat meeweegt.'],
    pl: ['Jak wyceniać minifigurki LEGO: kompletny przewodnik dla sprzedawców', 'Poznaj podstawy wyceny minifigurek LEGO na podstawie danych rynkowych Bricklinka. Zrozum średnie ważone ilością, średnie proste i wpływ stanu przedmiotu.'],
    pt: ['Como avaliar minifiguras LEGO: guia completo para vendedores', 'Aprenda os fundamentos da avaliação de minifiguras LEGO com dados do mercado Bricklink. Perceba as médias ponderadas por quantidade, as médias simples e como pesar o estado.'],
    sv: ['Så prissätter du LEGO-minifigurer: komplett guide för säljare', 'Lär dig grunderna i att prissätta LEGO-minifigurer med marknadsdata från Bricklink. Förstå kvantitetsviktade medelvärden, enkla medelvärden och hur skicket vägs in.'],
    ja: ['LEGO ミニフィグの価格の付け方：出品者のための完全ガイド', 'Bricklink の市場データを用いた LEGO ミニフィグの価格設定の基本を学びます。数量加重平均と単純平均の違い、状態の織り込み方を解説します。'],
  },
  'selling-lego-on-bricklink': {
    en: ['Selling LEGO on Bricklink: Complete Guide for New Sellers', 'Complete guide to becoming a successful Bricklink seller. From creating your store to shipping best practices and customer service tips.'],
    de: ['LEGO auf Bricklink verkaufen: Der komplette Leitfaden für neue Verkäufer', 'Vollständiger Leitfaden, um ein erfolgreicher Bricklink-Verkäufer zu werden. Von der Erstellung Ihres Shops bis zu Best Practices für den Versand und Kundenservice-Tipps.'],
    fr: ['Vendre du LEGO sur Bricklink : guide complet pour les nouveaux vendeurs', "Guide complet pour devenir un vendeur Bricklink accompli. De la création de votre boutique aux bonnes pratiques d'expédition et aux conseils de service client."],
    es: ['Vender LEGO en Bricklink: guía completa para nuevos vendedores', 'Guía completa para convertirse en un vendedor exitoso de Bricklink. Desde crear tu tienda hasta mejores prácticas de envío y consejos de servicio al cliente.'],
    it: ['Vendere LEGO su Bricklink: guida completa per i nuovi venditori', 'Guida completa per diventare un venditore Bricklink di successo. Dalla creazione del negozio alle migliori pratiche di spedizione e ai consigli sul servizio clienti.'],
    nl: ['LEGO verkopen op Bricklink: complete gids voor nieuwe verkopers', 'Complete gids om een succesvolle Bricklink-verkoper te worden. Van het opzetten van je winkel tot verzendtips en klantenservice.'],
    pl: ['Sprzedaż LEGO na Bricklinku: kompletny przewodnik dla nowych sprzedawców', 'Kompletny przewodnik po tym, jak zostać skutecznym sprzedawcą na Bricklinku. Od założenia sklepu po dobre praktyki wysyłkowe i obsługę klienta.'],
    pt: ['Vender LEGO na Bricklink: guia completo para novos vendedores', 'Guia completo para se tornar um vendedor de sucesso na Bricklink. Desde criar a sua loja até às melhores práticas de envio e dicas de apoio ao cliente.'],
    sv: ['Sälja LEGO på Bricklink: komplett guide för nya säljare', 'Komplett guide till att bli en framgångsrik Bricklink-säljare. Från att skapa din butik till bästa praxis för frakt och tips om kundservice.'],
    ja: ['Bricklink で LEGO を売る：初めての出品者のための完全ガイド', 'Bricklink で成果を出す出品者になるための完全ガイド。ストアの開設から発送のベストプラクティス、顧客対応のコツまで解説します。'],
  },
  'how-to-grade-lego-condition': {
    en: ['How to Grade LEGO Condition for Selling: Complete Guide', 'Learn the professional standards for grading LEGO condition. Avoid disputes, price accurately, and build buyer trust with this comprehensive grading guide for sellers.'],
    de: ['LEGO-Zustand richtig bewerten: Der komplette Leitfaden für Verkäufer', 'Lernen Sie professionelle Standards zur Bewertung des LEGO-Zustands. Vermeiden Sie Streitigkeiten, bewerten Sie genau und bauen Sie Käufervertrauen auf.'],
    fr: ["Comment évaluer l'état du LEGO pour la vente : guide complet", "Apprenez les standards professionnels pour évaluer l'état du LEGO. Évitez les litiges, fixez des prix précis et gagnez la confiance des acheteurs."],
    es: ['Cómo evaluar la condición del LEGO para vender: guía completa', 'Aprende los estándares profesionales para evaluar la condición de LEGO. Evita disputas, fija precios precisos y genera confianza con esta guía completa para vendedores.'],
    it: ['Come valutare le condizioni dei LEGO per la vendita: guida completa', 'Impara gli standard professionali per valutare le condizioni dei LEGO. Evita contestazioni, applica prezzi corretti e conquista la fiducia degli acquirenti.'],
    nl: ['De staat van LEGO beoordelen voor verkoop: complete gids', 'Leer de professionele standaarden voor het beoordelen van de staat van LEGO. Voorkom geschillen, prijs nauwkeurig en bouw vertrouwen op bij kopers.'],
    pl: ['Jak ocenić stan LEGO przed sprzedażą: kompletny przewodnik', 'Poznaj profesjonalne standardy oceny stanu klocków LEGO. Unikaj sporów, wyceniaj trafnie i buduj zaufanie kupujących.'],
    pt: ['Como avaliar o estado do LEGO para venda: guia completo', 'Conheça os padrões profissionais para avaliar o estado do LEGO. Evite disputas, defina preços certeiros e conquiste a confiança dos compradores.'],
    sv: ['Så bedömer du LEGO-skick inför försäljning: komplett guide', 'Lär dig de professionella normerna för att bedöma LEGO-skick. Undvik tvister, sätt rätt pris och bygg köparnas förtroende.'],
    ja: ['販売のための LEGO の状態評価：完全ガイド', 'LEGO の状態を評価するための業界標準を学びます。トラブルを避け、適正な価格を付け、購入者の信頼を得るための出品者向けガイドです。'],
  },
};

const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'sv', 'ja'];

async function main() {
  const rows = await prisma.article.findMany({ select: { id: true, slug: true, translations: true } });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `/tmp/article-translations-backup-${stamp}.json`;
  writeFileSync(backupPath, JSON.stringify(rows, null, 2), 'utf8');
  console.log(`backup written: ${backupPath}\n`);

  for (const row of rows) {
    const wanted = ARTICLES[row.slug];
    if (!wanted) {
      console.log(`  ${row.slug}: no translations defined, left untouched`);
      continue;
    }

    let existing = [];
    try {
      const parsed = JSON.parse(row.translations);
      if (Array.isArray(parsed)) existing = parsed;
    } catch {
      console.log(`  ${row.slug}: existing translations unparseable, rebuilding`);
    }

    // Keep any locale we do not have copy for rather than dropping it.
    const byLocale = new Map(existing.map((e) => [e.locale, e]));
    for (const locale of LOCALES) {
      const entry = wanted[locale];
      if (!entry) continue;
      byLocale.set(locale, { locale, title: entry[0], description: entry[1] });
    }

    const next = LOCALES.filter((l) => byLocale.has(l)).map((l) => byLocale.get(l));
    const added = next.length - existing.length;

    await prisma.article.update({
      where: { id: row.id },
      data: { translations: JSON.stringify(next) },
    });

    console.log(`  ${row.slug}: ${next.length} locales (${added > 0 ? `+${added}` : 'no new'}), titles and descriptions refreshed`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
