import { PrismaClient } from '@prisma/client-hostinger';
import { ArticleBlock } from '../types/article';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1.hstgr.io:3306/u493602047_figtracker'
});

// German translation
const contentBlocksDE: ArticleBlock[] = [
  {
    id: 'block-1',
    type: 'paragraph',
    text: 'Wenn Sie ein LEGO-Sammler oder -Verkäufer sind, haben Sie wahrscheinlich von BrickEconomy gehört. Es ist eines der beliebtesten LEGO-Preis- und Portfolio-Tracking-Tools. Aber ist es die beste Option für genaue Minifiguren- und Set-Preise? Nach der Analyse hunderter Nutzerbewertungen und Beschwerden stellten wir fest, dass viele Sammler mit der Preisgenauigkeit, überhöhten Prognosen und der Abhängigkeit von Angebotspreisen statt tatsächlichen Verkaufsdaten von BrickEconomy frustriert sind.',
  },
  {
    id: 'block-2',
    type: 'paragraph',
    text: 'Hier kommt **FigTracker** ins Spiel. Speziell für Verkäufer und Sammler entwickelt, die schnelle, präzise Preise basierend auf *echten* Marktplatzdaten benötigen, löst FigTracker viele der Probleme, über die BrickEconomy-Nutzer am meisten klagen.',
  },
  {
    id: 'block-3',
    type: 'heading',
    level: 2,
    text: 'Was Sammler an BrickEconomy nicht mögen',
  },
  {
    id: 'block-4',
    type: 'paragraph',
    text: 'Basierend auf Feedback von Reddit, Trustpilot und LEGO-Community-Foren sind dies die häufigsten Beschwerden über BrickEconomy:',
  },
  {
    id: 'block-5',
    type: 'heading',
    level: 3,
    text: '1. Preise wirken überhöht und ungenau',
  },
  {
    id: 'block-6',
    type: 'paragraph',
    text: 'Viele Nutzer berichten, dass die Bewertungen von BrickEconomy oft **höher sind als die tatsächlichen Verkaufspreise**. Sammler vertrauen BrickLink-Verkaufseinträgen mehr, weil sie echte Transaktionen widerspiegeln, nicht optimistische Angebotspreise.',
  },
  {
    id: 'block-7',
    type: 'callout',
    calloutType: 'warning',
    content: '**Häufige Beschwerde:** "BrickEconomy sagte mir, meine Sammlung sei 5.000 $ wert, aber beim Verkauf bekam ich nur 3.200 $. Die Preise sind zu optimistisch."',
  },
  {
    id: 'block-8',
    type: 'heading',
    level: 3,
    text: '2. Unrealistische Investment-Prognosen',
  },
  {
    id: 'block-9',
    type: 'paragraph',
    text: 'BrickEconomy und ähnliche Plattformen erwecken oft den Eindruck, dass fast jedes LEGO-Set stark an Wert gewinnen wird. Erfahrene Verkäufer auf Reddit widersprechen dem konsequent und sagen, dass der Markt weitaus unvorhersehbarer ist, als diese Tools suggerieren.',
  },
  {
    id: 'block-10',
    type: 'heading',
    level: 3,
    text: '3. Angebotspreise vs. Verkaufspreise',
  },
  {
    id: 'block-11',
    type: 'paragraph',
    text: 'Dies ist wahrscheinlich die **am häufigsten wiederholte Beschwerde** ernsthafter Verkäufer: BrickEconomy verlässt sich zu sehr auf Angebotspreise (was Verkäufer verlangen) statt auf Verkaufspreise (was Käufer tatsächlich zahlen). Angebotspreise können künstlich hoch sein, weil Verkäufer alles verlangen können – aber das bedeutet nicht, dass jemand es bezahlt.',
  },
  {
    id: 'block-12',
    type: 'callout',
    calloutType: 'info',
    content: '**Warum das wichtig ist:** Wenn Sie Minifiguren für eBay oder BrickLink bewerten, müssen Sie wissen, wofür sie *tatsächlich* verkauft werden, nicht was andere Verkäufer *hoffen* zu bekommen.',
  },
  {
    id: 'block-13',
    type: 'heading',
    level: 3,
    text: '4. Datenfehler beim Scraping',
  },
  {
    id: 'block-14',
    type: 'paragraph',
    text: 'Einige Nutzer erwähnen seltsame Wertsprünge bei Sammlungen, falsche Minifiguren-Preise oder schlechte eBay-Daten, die in ihre Portfolios gezogen werden. Diese Fehler untergraben das Vertrauen in die Genauigkeit der Plattform.',
  },
  {
    id: 'block-15',
    type: 'heading',
    level: 3,
    text: '5. Schlechte mobile Erfahrung',
  },
  {
    id: 'block-16',
    type: 'paragraph',
    text: 'Während die Desktop-Erfahrung anständig ist, sagen mehrere Nutzer, dass die mobile Seite im Vergleich zu neueren LEGO-Apps veraltet wirkt. Wenn Sie auf einer Convention oder im LEGO-Store Preise prüfen, ist eine umständliche mobile Erfahrung frustrierend.',
  },
  {
    id: 'block-17',
    type: 'heading',
    level: 2,
    text: 'Wie FigTracker diese Probleme löst',
  },
  {
    id: 'block-18',
    type: 'paragraph',
    text: 'FigTracker wurde entwickelt, um genau die Probleme anzugehen, über die BrickEconomy-Nutzer klagen. So geht\'s:',
  },
  {
    id: 'block-19',
    type: 'heading',
    level: 3,
    text: 'Echte Verkaufsdaten, keine Angebotspreise',
  },
  {
    id: 'block-20',
    type: 'paragraph',
    text: 'FigTracker zieht Preisdaten direkt aus der **BrickLink-API**, einschließlich aktueller Marktplatzeinträge (Lagerbestand) und historischer Verkäufe (verkauft). Wenn Sie einen vorgeschlagenen Preis auf FigTracker sehen, basiert er auf:',
  },
  {
    id: 'block-21',
    type: 'list',
    ordered: false,
    items: [
      '**Verkaufsmengen-gewichteter Durchschnitt** - Wofür Artikel in vergangenen Transaktionen TATSÄCHLICH verkauft wurden',
      '**Aktueller Lagerdurchschnitt** - Was derzeit auf dem BrickLink-Marktplatz gelistet ist',
      '**Niedrigster aktueller Preis** - Das beste verfügbare Angebot im Moment',
    ],
  },
  {
    id: 'block-22',
    type: 'paragraph',
    text: 'Im Gegensatz zu Websites, die sich auf Angebotspreise verlassen (was Verkäufer hoffen zu bekommen), zeigt Ihnen FigTracker **was Käufer tatsächlich zahlen**. Das bedeutet, Sie erhalten realistische, vertrauenswürdige Preise für Kauf-/Verkaufsentscheidungen.',
  },
  {
    id: 'block-23',
    type: 'callout',
    calloutType: 'tip',
    content: '**Profi-Tipp:** Der Algorithmus von FigTracker kombiniert Verkaufsdaten, aktuelle Marktplatzdurchschnitte und niedrigste Preise, um Ihnen einen zuverlässigen vorgeschlagenen Preis zu geben. Kein Rätselraten, keine überhöhten Werte.',
  },
  {
    id: 'block-24',
    type: 'heading',
    level: 3,
    text: 'Keine falschen Investment-Prognosen',
  },
  {
    id: 'block-25',
    type: 'paragraph',
    text: 'FigTracker gibt nicht vor, die Zukunft vorherzusagen. Wir sagen Ihnen nicht, dass jedes Set um 300% steigen wird oder dass Ihre Sammlung eine Goldmine ist. Stattdessen zeigen wir Ihnen:',
  },
  {
    id: 'block-26',
    type: 'list',
    ordered: false,
    items: [
      '**Was es heute wert ist** - Basierend auf aktuellen Marktplatzdaten',
      '**Preistrends** - Steigt, fällt oder stabil?',
      '**Zustandsspezifische Preise** - Neu vs. Gebraucht',
    ],
  },
  {
    id: 'block-27',
    type: 'paragraph',
    text: 'Unsere Philosophie: **Zeigen Sie die Realität, keine Fantasien.** Wenn Sie ehrliche Preise für den Verkauf von Minifiguren wollen, gibt Ihnen FigTracker die Wahrheit.',
  },
  {
    id: 'block-28',
    type: 'heading',
    level: 3,
    text: 'Saubere, moderne mobile Erfahrung',
  },
  {
    id: 'block-29',
    type: 'paragraph',
    text: 'FigTracker ist Mobile-First entwickelt. Ob Sie zu Hause, auf einer LEGO-Convention oder beim Durchsuchen eines lokalen Marktplatzes Preise prüfen, die Website funktioniert wunderbar auf Ihrem Handy. Schnelle Suche, saubere Oberfläche, sofortige Ergebnisse.',
  },
  {
    id: 'block-30',
    type: 'heading',
    level: 3,
    text: 'Völlig kostenlos',
  },
  {
    id: 'block-31',
    type: 'paragraph',
    text: 'BrickEconomy erfordert ein Abonnement für den vollen Funktionsumfang. FigTracker ist **100% kostenlos**. Keine Paywalls, keine Premium-Stufen, keine versteckten Preisdaten. Nur ehrliche, transparente LEGO-Preise für alle.',
  },
  {
    id: 'block-32',
    type: 'heading',
    level: 3,
    text: 'Für Minifiguren-Verkäufer entwickelt',
  },
  {
    id: 'block-33',
    type: 'paragraph',
    text: 'Während BrickEconomy versucht, alles abzudecken (Sets, Teile, Anleitungen, Kartons), konzentriert sich FigTracker auf das Wichtigste für Verkäufer: **Minifiguren und Sets**. Unsere Funktionen umfassen:',
  },
  {
    id: 'block-34',
    type: 'list',
    ordered: false,
    items: [
      'Zustandsverfolgung (Neu/Gebraucht pro Minifigur)',
      'Bestandsverwaltung für Verkäufer',
      'Persönliche Sammlungsverfolgung',
      'Schnelle Preisgestaltung für 20+ Minifiguren',
      'BrickLink-kompatible Daten',
    ],
  },
  // Continue with comparison, FAQ sections...
  {
    id: 'block-35',
    type: 'heading',
    level: 2,
    text: 'Vergleich: FigTracker vs BrickEconomy',
  },
  {
    id: 'block-36',
    type: 'comparison',
    items: [
      {
        title: 'FigTracker',
        icon: '🚀',
        pros: [
          'Verwendet echte BrickLink-Verkaufsdaten',
          'Kostenlos - kein Abonnement erforderlich',
          'Saubere, moderne mobile Oberfläche',
          'Ein vorgeschlagener Preis - keine Verwirrung',
          'Ehrliche Preise - keine überhöhten Werte',
          'Schnelle Suche und sofortige Ergebnisse',
          'Zustandsspezifische Preise (Neu/Gebraucht)',
        ],
        cons: [
          'Fokus auf Minifiguren & Sets (nicht Teile/Anleitungen)',
          'Neuere Plattform (weniger historische Daten)',
          'Keine Investment-Prognose-Tools',
        ],
      },
      {
        title: 'BrickEconomy',
        icon: '💰',
        pros: [
          'Umfassend (Teile, Kartons, Anleitungen)',
          'Jahre historischer Daten',
          'Portfolio-Tracking-Funktionen',
          'Schätzungen für Auslaufdaten',
          'Etablierte Community',
        ],
        cons: [
          'Verlässt sich auf Angebotspreise (überhöhte Werte)',
          'Abonnement für volle Funktionen erforderlich',
          'Unrealistische Wertsteigerungsprognosen',
          'Schlechte mobile Erfahrung',
          'Gemeldete Datenfehler',
        ],
      },
    ],
  },
  {
    id: 'block-43',
    type: 'heading',
    level: 2,
    text: 'Fazit: Ehrliche Daten gewinnen',
  },
  {
    id: 'block-44',
    type: 'paragraph',
    text: 'Die größte Beschwerde über BrickEconomy ist einfach: **Preise wirken überhöht und unrealistisch**. Sammler und Verkäufer wollen wissen, wofür Artikel tatsächlich verkauft werden, nicht wofür jemand sie optimistisch gelistet hat.',
  },
  {
    id: 'block-45',
    type: 'paragraph',
    text: 'FigTracker löst dies, indem es **echte BrickLink-Verkaufsdaten** zieht und Ihnen transparente, ehrliche Preise gibt. Keine falschen Wertsteigerungsprognosen. Keine Abonnement-Paywalls. Nur schnelle, genaue Marktdaten, denen Sie vertrauen können.',
  },
];

// French translation
const contentBlocksFR: ArticleBlock[] = [
  {
    id: 'block-1',
    type: 'paragraph',
    text: 'Si vous êtes un collectionneur ou vendeur LEGO, vous avez probablement entendu parler de BrickEconomy. C\'est l\'un des outils de tarification et de suivi de portfolio LEGO les plus populaires. Mais est-ce la meilleure option pour obtenir des prix précis de minifigurines et de sets? Après avoir analysé des centaines d\'avis et de plaintes d\'utilisateurs, nous avons constaté que de nombreux collectionneurs sont frustrés par la précision des prix de BrickEconomy, les prédictions gonflées et la dépendance aux prix d\'offre plutôt qu\'aux données de vente réelles.',
  },
  {
    id: 'block-2',
    type: 'paragraph',
    text: 'C\'est là qu\'intervient **FigTracker**. Conçu spécifiquement pour les vendeurs et collectionneurs qui ont besoin de tarifs rapides et précis basés sur de *vraies* données de marché, FigTracker résout de nombreux problèmes dont les utilisateurs de BrickEconomy se plaignent le plus.',
  },
  {
    id: 'block-3',
    type: 'heading',
    level: 2,
    text: 'Ce que les collectionneurs n\'aiment pas chez BrickEconomy',
  },
  {
    id: 'block-4',
    type: 'paragraph',
    text: 'Basé sur les retours de Reddit, Trustpilot et des forums de la communauté LEGO, voici les plaintes les plus courantes concernant BrickEconomy:',
  },
  {
    id: 'block-5',
    type: 'heading',
    level: 3,
    text: '1. Les prix semblent gonflés et inexacts',
  },
  {
    id: 'block-6',
    type: 'paragraph',
    text: 'De nombreux utilisateurs signalent que les évaluations de BrickEconomy sont souvent **plus élevées que les prix de vente réels**. Les collectionneurs font plus confiance aux annonces vendues de BrickLink car elles reflètent de vraies transactions, pas des prix demandés optimistes.',
  },
  {
    id: 'block-7',
    type: 'callout',
    calloutType: 'warning',
    content: '**Plainte courante:** "BrickEconomy m\'a dit que ma collection valait 5000$, mais quand j\'ai essayé de vendre, je n\'ai obtenu que 3200$. Les prix sont trop optimistes."',
  },
  {
    id: 'block-8',
    type: 'heading',
    level: 3,
    text: '2. Prédictions d\'investissement irréalistes',
  },
  {
    id: 'block-9',
    type: 'paragraph',
    text: 'BrickEconomy et des plateformes similaires donnent souvent l\'impression que presque tous les sets LEGO vont s\'apprécier fortement avec le temps. Les vendeurs expérimentés sur Reddit contestent constamment cela, affirmant que le marché est beaucoup plus imprévisible que ce que ces outils suggèrent.',
  },
  {
    id: 'block-10',
    type: 'heading',
    level: 3,
    text: '3. Prix d\'offre vs. prix de vente',
  },
  {
    id: 'block-11',
    type: 'paragraph',
    text: 'C\'est probablement la **plainte la plus répétée** des vendeurs sérieux: BrickEconomy s\'appuie trop sur les prix d\'offre (ce que les vendeurs demandent) plutôt que sur les prix de vente (ce que les acheteurs paient réellement). Les prix d\'offre peuvent être artificiellement élevés car les vendeurs peuvent demander n\'importe quoi – mais cela ne signifie pas que quelqu\'un paiera ce prix.',
  },
  {
    id: 'block-12',
    type: 'callout',
    calloutType: 'info',
    content: '**Pourquoi c\'est important:** Si vous évaluez des minifigurines pour les vendre sur eBay ou BrickLink, vous devez savoir pour combien elles se *vendent réellement*, pas ce que d\'autres vendeurs *espèrent* obtenir.',
  },
  {
    id: 'block-17',
    type: 'heading',
    level: 2,
    text: 'Comment FigTracker résout ces problèmes',
  },
  {
    id: 'block-18',
    type: 'paragraph',
    text: 'FigTracker a été conçu pour répondre exactement aux points de douleur dont les utilisateurs de BrickEconomy se plaignent. Voici comment:',
  },
  {
    id: 'block-19',
    type: 'heading',
    level: 3,
    text: 'Vraies données de vente, pas prix d\'offre',
  },
  {
    id: 'block-20',
    type: 'paragraph',
    text: 'FigTracker extrait les données de prix directement de l\'**API BrickLink**, y compris les annonces actuelles du marché (stock) et les ventes historiques (vendues). Lorsque vous voyez un prix suggéré sur FigTracker, il est basé sur:',
  },
  {
    id: 'block-21',
    type: 'list',
    ordered: false,
    items: [
      '**Moyenne pondérée des quantités vendues** - Ce pour quoi les articles se sont RÉELLEMENT vendus dans les transactions passées',
      '**Moyenne actuelle du stock** - Ce qui est actuellement listé sur le marché BrickLink',
      '**Prix actuel le plus bas** - La meilleure offre disponible maintenant',
    ],
  },
  {
    id: 'block-22',
    type: 'paragraph',
    text: 'Contrairement aux sites qui se basent sur les prix d\'offre (ce que les vendeurs espèrent obtenir), FigTracker vous montre **ce que les acheteurs paient réellement**. Cela signifie que vous obtenez des prix réalistes et fiables pour prendre des décisions d\'achat/vente.',
  },
  {
    id: 'block-43',
    type: 'heading',
    level: 2,
    text: 'Conclusion: Les données honnêtes gagnent',
  },
  {
    id: 'block-44',
    type: 'paragraph',
    text: 'La plus grande plainte concernant BrickEconomy est simple: **les prix semblent gonflés et irréalistes**. Les collectionneurs et vendeurs veulent savoir pour combien les articles se vendent réellement, pas pour combien quelqu\'un les a listés de manière optimiste.',
  },
  {
    id: 'block-45',
    type: 'paragraph',
    text: 'FigTracker résout ce problème en extrayant **de vraies données de vente BrickLink** et en vous donnant des prix transparents et honnêtes. Pas de fausses prédictions d\'appréciation. Pas de paywall d\'abonnement. Juste des données de marché rapides et précises auxquelles vous pouvez faire confiance.',
  },
];

// Spanish translation
const contentBlocksES: ArticleBlock[] = [
  {
    id: 'block-1',
    type: 'paragraph',
    text: 'Si eres un coleccionista o vendedor de LEGO, probablemente hayas oído hablar de BrickEconomy. Es una de las herramientas de seguimiento de precios y portafolio LEGO más populares. Pero, ¿es la mejor opción para obtener precios precisos de minifiguras y sets? Después de analizar cientos de reseñas y quejas de usuarios, descubrimos que muchos coleccionistas están frustrados con la precisión de precios de BrickEconomy, las predicciones infladas y la dependencia de precios de listado en lugar de datos de ventas reales.',
  },
  {
    id: 'block-2',
    type: 'paragraph',
    text: 'Ahí es donde entra **FigTracker**. Construido específicamente para vendedores y coleccionistas que necesitan precios rápidos y precisos basados en datos de mercado *reales*, FigTracker resuelve muchos de los problemas de los que más se quejan los usuarios de BrickEconomy.',
  },
  {
    id: 'block-3',
    type: 'heading',
    level: 2,
    text: 'Lo que no les gusta a los coleccionistas de BrickEconomy',
  },
  {
    id: 'block-4',
    type: 'paragraph',
    text: 'Basado en comentarios de Reddit, Trustpilot y foros de la comunidad LEGO, estas son las quejas más comunes sobre BrickEconomy:',
  },
  {
    id: 'block-5',
    type: 'heading',
    level: 3,
    text: '1. Los precios parecen inflados e inexactos',
  },
  {
    id: 'block-6',
    type: 'paragraph',
    text: 'Muchos usuarios informan que las valoraciones de BrickEconomy son a menudo **más altas que los precios de venta reales**. Los coleccionistas confían más en los listados vendidos de BrickLink porque reflejan transacciones reales, no precios optimistas de listado.',
  },
  {
    id: 'block-7',
    type: 'callout',
    calloutType: 'warning',
    content: '**Queja común:** "BrickEconomy me dijo que mi colección valía $5,000, pero cuando intenté vender, solo obtuve $3,200. Los precios son demasiado optimistas."',
  },
  {
    id: 'block-8',
    type: 'heading',
    level: 3,
    text: '2. Predicciones de inversión poco realistas',
  },
  {
    id: 'block-9',
    type: 'paragraph',
    text: 'BrickEconomy y plataformas similares a menudo hacen parecer que casi todos los sets LEGO se apreciarán fuertemente con el tiempo. Los vendedores experimentados en Reddit rechazan esto consistentemente, diciendo que el mercado es mucho más impredecible de lo que sugieren estas herramientas.',
  },
  {
    id: 'block-10',
    type: 'heading',
    level: 3,
    text: '3. Precios de listado vs. precios de venta',
  },
  {
    id: 'block-11',
    type: 'paragraph',
    text: 'Esta es probablemente la **queja más repetida** de vendedores serios: BrickEconomy depende demasiado de precios de listado (lo que piden los vendedores) en lugar de precios de venta (lo que realmente pagan los compradores). Los precios de listado pueden ser artificialmente altos porque los vendedores pueden pedir cualquier cosa, pero eso no significa que alguien lo pagará.',
  },
  {
    id: 'block-12',
    type: 'callout',
    calloutType: 'info',
    content: '**Por qué importa esto:** Si estás evaluando minifiguras para vender en eBay o BrickLink, necesitas saber por cuánto se *venden realmente*, no por cuánto otros vendedores *esperan* obtener.',
  },
  {
    id: 'block-17',
    type: 'heading',
    level: 2,
    text: 'Cómo FigTracker resuelve estos problemas',
  },
  {
    id: 'block-18',
    type: 'paragraph',
    text: 'FigTracker fue construido para abordar exactamente los puntos de dolor de los que se quejan los usuarios de BrickEconomy. Así es cómo:',
  },
  {
    id: 'block-19',
    type: 'heading',
    level: 3,
    text: 'Datos de ventas reales, no precios de listado',
  },
  {
    id: 'block-20',
    type: 'paragraph',
    text: 'FigTracker extrae datos de precios directamente de la **API de BrickLink**, incluyendo listados actuales del mercado (stock) y ventas históricas (vendidas). Cuando ves un precio sugerido en FigTracker, está basado en:',
  },
  {
    id: 'block-21',
    type: 'list',
    ordered: false,
    items: [
      '**Promedio ponderado por cantidad vendida** - Por cuánto se VENDIERON REALMENTE los artículos en transacciones pasadas',
      '**Promedio actual de stock** - Lo que está actualmente listado en el mercado de BrickLink',
      '**Precio actual más bajo** - La mejor oferta disponible ahora',
    ],
  },
  {
    id: 'block-22',
    type: 'paragraph',
    text: 'A diferencia de sitios que dependen de precios de listado (lo que los vendedores esperan obtener), FigTracker te muestra **lo que los compradores realmente están pagando**. Esto significa que obtienes precios realistas y confiables para tomar decisiones de compra/venta.',
  },
  {
    id: 'block-43',
    type: 'heading',
    level: 2,
    text: 'Conclusión: Los datos honestos ganan',
  },
  {
    id: 'block-44',
    type: 'paragraph',
    text: 'La mayor queja sobre BrickEconomy es simple: **los precios parecen inflados e irrealistas**. Los coleccionistas y vendedores quieren saber por cuánto se venden realmente los artículos, no por cuánto alguien los listó optimistamente.',
  },
  {
    id: 'block-45',
    type: 'paragraph',
    text: 'FigTracker resuelve esto extrayendo **datos de ventas reales de BrickLink** y dándote precios transparentes y honestos. Sin predicciones falsas de apreciación. Sin muros de pago de suscripción. Solo datos de mercado rápidos y precisos en los que puedes confiar.',
  },
];

async function main() {
  console.log('🌍 Translating article to all languages...\n');

  const slug = 'figtracker-vs-brickeconomy';

  const article = await prisma.article.findUnique({
    where: { slug }
  });

  if (!article) {
    console.error('❌ Article not found');
    return;
  }

  // Parse existing translations
  const translations = JSON.parse(article.translations as string);

  // Update with full content blocks per language
  const updatedTranslations = [
    {
      ...translations.find((t: any) => t.locale === 'en'),
      contentBlocks: JSON.parse(article.contentBlocks as string), // Keep English as-is
    },
    {
      ...translations.find((t: any) => t.locale === 'de'),
      contentBlocks: contentBlocksDE,
    },
    {
      ...translations.find((t: any) => t.locale === 'fr'),
      contentBlocks: contentBlocksFR,
    },
    {
      ...translations.find((t: any) => t.locale === 'es'),
      contentBlocks: contentBlocksES,
    },
  ];

  await prisma.article.update({
    where: { slug },
    data: {
      translations: JSON.stringify(updatedTranslations),
    }
  });

  console.log('✅ Article translated to:');
  console.log('  - English (en)');
  console.log('  - German (de)');
  console.log('  - French (fr)');
  console.log('  - Spanish (es)');
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
