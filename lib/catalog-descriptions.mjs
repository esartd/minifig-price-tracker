/**
 * Catalog description templates, one set per locale.
 *
 * Plain JavaScript on purpose. The backfill has to run on the VPS, where
 * `npm install --production` means tsx and typescript are not installed --
 * so anything that needs a TypeScript runner cannot be run there at all. As
 * .mjs it runs under the node that is already on the box, and the Next app
 * imports the very same file, so there is still one copy of the wording.
 *
 * This used to be ten copy-pasted `let description_xx = ...` blocks inside
 * scripts/auto-generate-minifig-descriptions.ts -- four of them, because when
 * it was written the site had four languages. Six locales were added later and
 * nobody came back here, so it/ja/nl/pl/pt/sv served the ENGLISH meta
 * description on every minifig and set page.
 *
 * As a table, adding the eleventh locale is one entry rather than a
 * forty-line paste, which is the whole reason the gap opened.
 *
 * The strings are deliberately plain. These are meta descriptions built from a
 * name and a theme, read by a search engine and by whoever sees the snippet --
 * not marketing copy. What matters is that they are in the reader's language
 * and describe the item; a florid template repeated 18,000 times reads worse
 * than a flat one, not better.
 */

export const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'ja', 'nl', 'pl', 'pt', 'sv'];

/** Themes that get a closing clause; every other theme just ends the sentence. */

export const TEMPLATES = {
  en: {
    opening: (name, theme) => `${name} from the ${theme} theme`,
    outfit: ' features distinctive outfit details',
    accessory: ' comes with characteristic accessories',
    variant: (theme) => `. This minifigure represents a unique variant within the ${theme} collection`,
    variantSet: (theme) => `. This set is part of the ${theme} collection`,
    themed: {
      'Star Wars': ', capturing iconic characters and moments from the galaxy far, far away',
      'Super Heroes': ', bringing comic book heroes and villains to life',
      'Harry Potter': ', recreating magical moments from the wizarding world',
      NINJAGO: ', embodying ninja warriors and their adventures',
      City: ', depicting everyday heroes and community members',
      Castle: ', bringing medieval knights and fantasy to life',
    },
  },

  de: {
    opening: (name, theme) => `${name} aus dem ${theme}-Thema`,
    outfit: ' zeigt charakteristische Outfit-Details',
    accessory: ' kommt mit charakteristischem Zubehör',
    variant: (theme) => `. Diese Minifigur repräsentiert eine einzigartige Variante innerhalb der ${theme}-Kollektion`,
    variantSet: (theme) => `. Dieses Set gehört zur ${theme}-Kollektion`,
    themed: {
      'Star Wars': ', die ikonische Charaktere und Momente aus der weit, weit entfernten Galaxie einfängt',
      'Super Heroes': ', die Comic-Helden und Schurken zum Leben erweckt',
      'Harry Potter': ', die magische Momente aus der Zaubererwelt nachstellt',
      NINJAGO: ', die Ninja-Krieger und ihre Abenteuer verkörpert',
      City: ', die alltägliche Helden und Gemeindemitglieder darstellt',
      Castle: ', die mittelalterliche Ritter und Fantasie zum Leben erweckt',
    },
  },

  fr: {
    opening: (name, theme) => `${name} du thème ${theme}`,
    outfit: ' présente des détails de tenue distinctifs',
    accessory: ' vient avec des accessoires caractéristiques',
    variant: (theme) => `. Cette minifigurine représente une variante unique au sein de la collection ${theme}`,
    variantSet: (theme) => `. Ce set fait partie de la collection ${theme}`,
    themed: {
      'Star Wars': ', capturant des personnages et moments emblématiques de la galaxie lointaine, très lointaine',
      'Super Heroes': ', donnant vie aux héros et méchants de bandes dessinées',
      'Harry Potter': ', recréant des moments magiques du monde des sorciers',
      NINJAGO: ', incarnant les guerriers ninjas et leurs aventures',
      City: ', dépeignant les héros du quotidien et les membres de la communauté',
      Castle: ', donnant vie aux chevaliers médiévaux et à la fantasy',
    },
  },

  es: {
    opening: (name, theme) => `${name} del tema ${theme}`,
    outfit: ' presenta detalles distintivos de atuendo',
    accessory: ' viene con accesorios característicos',
    variant: (theme) => `. Esta minifigura representa una variante única dentro de la colección ${theme}`,
    variantSet: (theme) => `. Este set forma parte de la colección ${theme}`,
    themed: {
      'Star Wars': ', capturando personajes y momentos icónicos de la galaxia muy, muy lejana',
      'Super Heroes': ', dando vida a héroes y villanos de cómics',
      'Harry Potter': ', recreando momentos mágicos del mundo mágico',
      NINJAGO: ', encarnando guerreros ninja y sus aventuras',
      City: ', representando héroes cotidianos y miembros de la comunidad',
      Castle: ', dando vida a caballeros medievales y fantasía',
    },
  },

  it: {
    opening: (name, theme) => `${name} dal tema ${theme}`,
    outfit: ' presenta dettagli distintivi dell’abbigliamento',
    accessory: ' include accessori caratteristici',
    variant: (theme) => `. Questa minifigure rappresenta una variante unica all’interno della collezione ${theme}`,
    variantSet: (theme) => `. Questo set fa parte della collezione ${theme}`,
    themed: {
      'Star Wars': ', catturando personaggi e momenti iconici della galassia lontana, lontana',
      'Super Heroes': ', dando vita a eroi e cattivi dei fumetti',
      'Harry Potter': ', ricreando momenti magici del mondo dei maghi',
      NINJAGO: ', incarnando guerrieri ninja e le loro avventure',
      City: ', raffigurando eroi di tutti i giorni e membri della comunità',
      Castle: ', dando vita a cavalieri medievali e fantasia',
    },
  },

  // Japanese takes no spaces and closes on the noun rather than the verb, so
  // the fragments read as one sentence when concatenated.
  ja: {
    opening: (name, theme) => `${theme}テーマの${name}`,
    outfit: 'は、特徴的な衣装のディテールが施されています',
    accessory: 'には、特徴的なアクセサリーが付属します',
    variant: (theme) => `。このミニフィギュアは${theme}コレクションの中でも独自のバリエーションです`,
    variantSet: (theme) => `。このセットは${theme}コレクションの一つです`,
    themed: {
      'Star Wars': '。遠い昔、はるか彼方の銀河系の象徴的なキャラクターと名場面を再現しています',
      'Super Heroes': '。アメコミのヒーローとヴィランを立体化しています',
      'Harry Potter': '。魔法界の魔法のような場面を再現しています',
      NINJAGO: '。ニンジャの戦士たちとその冒険を表現しています',
      City: '。日常のヒーローや街の人々を描いています',
      Castle: '。中世の騎士とファンタジーの世界を表現しています',
    },
  },

  nl: {
    opening: (name, theme) => `${name} uit het thema ${theme}`,
    outfit: ' heeft kenmerkende kledingdetails',
    accessory: ' wordt geleverd met kenmerkende accessoires',
    variant: (theme) => `. Deze minifiguur is een unieke variant binnen de ${theme}-collectie`,
    variantSet: (theme) => `. Deze set maakt deel uit van de ${theme}-collectie`,
    themed: {
      'Star Wars': ', met iconische personages en momenten uit het sterrenstelsel ver, ver weg',
      'Super Heroes': ', die striphelden en schurken tot leven brengt',
      'Harry Potter': ', die magische momenten uit de tovenaarswereld naspeelt',
      NINJAGO: ', die ninjastrijders en hun avonturen verbeeldt',
      City: ', die alledaagse helden en buurtbewoners uitbeeldt',
      Castle: ', die middeleeuwse ridders en fantasie tot leven brengt',
    },
  },

  // Polish: "z serii <Theme>" avoids declining the English theme name, which
  // is what a naive template would get wrong.
  pl: {
    opening: (name, theme) => `${name} z serii ${theme}`,
    outfit: ' ma charakterystyczne detale stroju',
    accessory: ' zawiera charakterystyczne akcesoria',
    variant: (theme) => `. Ta minifigurka to wyjątkowy wariant w kolekcji ${theme}`,
    variantSet: (theme) => `. Ten zestaw należy do kolekcji ${theme}`,
    themed: {
      'Star Wars': ', oddający kultowe postacie i sceny z odległej galaktyki',
      'Super Heroes': ', ożywiający bohaterów i złoczyńców z komiksów',
      'Harry Potter': ', odtwarzający magiczne chwile ze świata czarodziejów',
      NINJAGO: ', przedstawiający wojowników ninja i ich przygody',
      City: ', ukazujący codziennych bohaterów i mieszkańców miasta',
      Castle: ', ożywiający średniowiecznych rycerzy i świat fantasy',
    },
  },

  pt: {
    opening: (name, theme) => `${name} do tema ${theme}`,
    outfit: ' apresenta detalhes distintos de vestuário',
    accessory: ' vem com acessórios característicos',
    variant: (theme) => `. Esta minifigura representa uma variante única dentro da coleção ${theme}`,
    variantSet: (theme) => `. Este conjunto faz parte da coleção ${theme}`,
    themed: {
      'Star Wars': ', capturando personagens e momentos icónicos da galáxia muito, muito distante',
      'Super Heroes': ', dando vida a heróis e vilões da banda desenhada',
      'Harry Potter': ', recriando momentos mágicos do mundo dos feiticeiros',
      NINJAGO: ', encarnando guerreiros ninja e as suas aventuras',
      City: ', retratando heróis do quotidiano e membros da comunidade',
      Castle: ', dando vida a cavaleiros medievais e à fantasia',
    },
  },

  sv: {
    opening: (name, theme) => `${name} från temat ${theme}`,
    outfit: ' har utmärkande klädddetaljer',
    accessory: ' levereras med karakteristiska tillbehör',
    variant: (theme) => `. Den här minifiguren är en unik variant inom ${theme}-kollektionen`,
    variantSet: (theme) => `. Det här setet ingår i ${theme}-kollektionen`,
    themed: {
      'Star Wars': ', som fångar ikoniska karaktärer och ögonblick från galaxen långt, långt borta',
      'Super Heroes': ', som ger liv åt seriehjältar och skurkar',
      'Harry Potter': ', som återskapar magiska ögonblick från trollkarlsvärlden',
      NINJAGO: ', som gestaltar ninjakrigare och deras äventyr',
      City: ', som skildrar vardagshjältar och invånare',
      Castle: ', som ger liv åt medeltida riddare och fantasy',
    },
  },
};

const COLOR = /\b(red|blue|green|yellow|black|white|orange|purple|pink|brown|gray|grey)\b/i;
const OUTFIT = /\b(suit|armor|uniform|robe|cape|dress|shirt|jacket|vest)\b/i;
const ACCESSORY = /\b(sword|shield|helmet|weapon|gun|staff|wand|bow|axe)\b/i;

/**
 * One description per locale, keyed `description_<locale>` so the result can go
 * straight into a Prisma update.
 *
 * Pass `{ isSet: true }` for SetsCatalog. One template served both catalogs at
 * first, and every set page in the backfilled locales ended up calling itself
 * a minifigure -- "Daffodils... Den har minifiguren ar en unik variant".
 */
export function buildDescriptions(name, theme, { isSet = false } = {}) {
  // The outfit and accessory clauses describe what a MINIFIGURE is wearing or
  // carrying. A set called "Police Station" is not wearing a uniform, so they
  // are skipped for sets rather than producing "features distinctive outfit
  // details" about a building.
  const hasOutfit = !isSet && COLOR.test(name) && OUTFIT.test(name);
  const hasAccessory = !isSet && ACCESSORY.test(name);
  const out = {};

  for (const locale of LOCALES) {
    const t = TEMPLATES[locale];
    let s = t.opening(name, theme);
    if (hasOutfit) s += t.outfit;
    else if (hasAccessory) s += t.accessory;
    s += isSet ? t.variantSet(theme) : t.variant(theme);
    s += t.themed[theme] ?? '';
    // Japanese uses the ideographic full stop, which the fragments already
    // carry; every other locale ends on a period.
    s += locale === 'ja' ? '。' : '.';
    out[`description_${locale}`] = s;
  }
  return out;
}

/* ------------------------------------------------------------------------- *
 * Enriched set descriptions
 * ------------------------------------------------------------------------- */

/**
 * buildDescriptions() above produces two clauses. For a set that is all it can
 * do, because it is given only a name and a theme -- which is why 8,550 set
 * pages carried a single 45-character sentence like "Tug from the Boat theme
 * was released in 1973." Google reads that as thin content, and at that length
 * it is hard to argue.
 *
 * This adds sentences built from facts the database already holds: the release
 * year, the sub-theme, and -- the one that actually makes each page unique --
 * the minifigures the set contains, by name.
 *
 * ## The rule this follows
 *
 * Every sentence here is a fact we hold. Nothing is inferred, estimated or
 * invented. In particular there is no piece count and no description of
 * features, because the catalogue does not carry either: the good hand-written
 * descriptions say "features 2,503 pieces recreating the Lambda-class T-4a
 * shuttle" because a person wrote them, and a template that guessed at that
 * would be fabricating product detail on 8,550 pages.
 *
 * A clause is omitted when its fact is missing rather than filled with a
 * placeholder -- that is the bug that put "released in ?" on 1,325 pages.
 *
 * ## What this cannot fix
 *
 * Set contents are known for 4,446 of the 8,550 thin sets. The rest get the
 * year and sub-theme sentences only, so they stay short. There is no honest way
 * to pad them; they need their contents fetched from BrickLink, which is a
 * rate-limited job and a separate decision.
 */

/** Longer than this and the list stops being readable. */
const MAX_LISTED_MINIFIGS = 6;

/**
 * Polish counts in three forms: 1, 2-4, and 5+ (and the teens go with 5+).
 * Getting this wrong is immediately obvious to a reader, and "Zawiera 5
 * minifigurki" is the kind of mistake that reads as machine-generated.
 */
function plPluralMinifig(n) {
  if (n === 1) return 'minifigurkę';
  const lastTwo = n % 100;
  const last = n % 10;
  if (lastTwo >= 12 && lastTwo <= 14) return 'minifigurek';
  if (last >= 2 && last <= 4) return 'minifigurki';
  return 'minifigurek';
}

export const SET_FACTS = {
  en: {
    year: (y) => `Released in ${y}.`,
    sub: (s) => `Part of the ${s} subtheme.`,
    figs: (n, list) => `Includes ${n} minifigure${n === 1 ? '' : 's'}: ${list}.`,
    more: (n) => ` and ${n} more`,
    cta: 'Track its current market value and add it to your collection on IntoBrick.',
  },
  de: {
    year: (y) => `Erschienen ${y}.`,
    sub: (s) => `Teil des Unterthemas ${s}.`,
    figs: (n, list) => `Enthält ${n} Minifigur${n === 1 ? '' : 'en'}: ${list}.`,
    more: (n) => ` und ${n} weitere`,
    cta: 'Verfolge den aktuellen Marktwert und füge das Set deiner Sammlung bei IntoBrick hinzu.',
  },
  fr: {
    year: (y) => `Sorti en ${y}.`,
    sub: (s) => `Fait partie du sous-thème ${s}.`,
    figs: (n, list) => `Comprend ${n} figurine${n === 1 ? '' : 's'} : ${list}.`,
    more: (n) => ` et ${n} autre${n === 1 ? '' : 's'}`,
    cta: 'Suivez sa valeur actuelle sur le marché et ajoutez-le à votre collection sur IntoBrick.',
  },
  es: {
    year: (y) => `Lanzado en ${y}.`,
    sub: (s) => `Forma parte del subtema ${s}.`,
    figs: (n, list) => `Incluye ${n} minifigura${n === 1 ? '' : 's'}: ${list}.`,
    more: (n) => ` y ${n} más`,
    cta: 'Sigue su valor de mercado actual y añádelo a tu colección en IntoBrick.',
  },
  it: {
    year: (y) => `Uscito nel ${y}.`,
    // "minifigure" is both singular and plural in Italian.
    sub: (s) => `Fa parte del sottotema ${s}.`,
    figs: (n, list) => `Include ${n} minifigure: ${list}.`,
    more: (n) => ` e altre ${n}`,
    cta: 'Segui il suo valore di mercato attuale e aggiungilo alla tua collezione su IntoBrick.',
  },
  ja: {
    year: (y) => `${y}年発売。`,
    sub: (s) => `${s}サブテーマの一部です。`,
    figs: (n, list) => `ミニフィグ${n}体を含みます：${list}。`,
    more: (n) => `他${n}体`,
    cta: '現在の市場価値を追跡し、IntoBrickでコレクションに追加できます。',
  },
  nl: {
    year: (y) => `Uitgebracht in ${y}.`,
    sub: (s) => `Onderdeel van het subthema ${s}.`,
    figs: (n, list) => `Bevat ${n} minifiguur${n === 1 ? '' : 'en'}: ${list}.`,
    more: (n) => ` en ${n} andere`,
    cta: 'Volg de actuele marktwaarde en voeg deze toe aan je collectie op IntoBrick.',
  },
  pl: {
    year: (y) => `Wydany w ${y} roku.`,
    sub: (s) => `Część podtematu ${s}.`,
    figs: (n, list) => `Zawiera ${n} ${plPluralMinifig(n)}: ${list}.`,
    more: (n) => ` i ${n} więcej`,
    // Locative of a -k stem takes -u: "w IntoBricku". See CLAUDE.md.
    cta: 'Śledź aktualną wartość rynkową i dodaj go do swojej kolekcji w IntoBricku.',
  },
  pt: {
    year: (y) => `Lançado em ${y}.`,
    sub: (s) => `Faz parte do subtema ${s}.`,
    figs: (n, list) => `Inclui ${n} minifigura${n === 1 ? '' : 's'}: ${list}.`,
    more: (n) => ` e ${n} mais`,
    // Brazilian Portuguese -- this locale is pt-BR, not pt-PT.
    cta: 'Acompanhe o valor de mercado atual e adicione-o à sua coleção no IntoBrick.',
  },
  sv: {
    year: (y) => `Släppt ${y}.`,
    sub: (s) => `Del av undertemat ${s}.`,
    figs: (n, list) => `Innehåller ${n} minifigur${n === 1 ? '' : 'er'}: ${list}.`,
    more: (n) => ` och ${n} fler`,
    cta: 'Följ det aktuella marknadsvärdet och lägg till det i din samling på IntoBrick.',
  },
};

/**
 * Compose an enriched description per locale.
 *
 * @param {string} name        Set name from the catalogue
 * @param {string} theme       Parent theme
 * @param {object} facts
 * @param {string|null} facts.year        Four-digit year, or null if unknown
 * @param {string|null} facts.subtheme    Sub-theme, or null
 * @param {string[]}    facts.minifigNames Names of contained minifigures
 * @returns {Record<string, string>} description_<locale> keys
 */
export function buildSetDescriptions(name, theme, { year = null, subtheme = null, minifigNames = [] } = {}) {
  const out = {};

  for (const locale of LOCALES) {
    const t = TEMPLATES[locale];
    const f = SET_FACTS[locale];
    const sep = locale === 'ja' ? '' : ' ';

    // Only the opening clause from TEMPLATES, plus its themed flourish -- not
    // buildDescriptions()' full output. That function also appends "This set is
    // part of the <theme> collection", which names the theme a second time in
    // two sentences: "Weetabix Castle from the LEGOLAND theme. This set is part
    // of the LEGOLAND collection." The sub-theme sentence below says the same
    // thing with more information in it.
    const opening =
      t.opening(name, theme) + (t.themed[theme] ?? '') + (locale === 'ja' ? '。' : '.');

    const parts = [opening];

    if (year) parts.push(f.year(year));
    if (subtheme) parts.push(f.sub(subtheme));

    if (minifigNames.length > 0) {
      // BrickLink names are "<character>, <variant details>" -- e.g. "Classic -
      // Knight, Shield Red/Gray, Light Gray Legs with Red Hips, Light Gray
      // Neck-Protector". Joining those raw with ", " produces a list nobody can
      // parse, because the separator also appears inside every item. The part
      // before the first comma is the character, which is the part a reader
      // wants and the part worth having on the page.
      const seen = new Set();
      const shortNames = [];
      for (const raw of minifigNames) {
        const short = raw.split(',')[0].trim();
        if (short && !seen.has(short)) {
          seen.add(short);
          shortNames.push(short);
        }
      }

      const shown = shortNames.slice(0, MAX_LISTED_MINIFIGS);
      const hidden = shortNames.length - shown.length;
      // Names stay in BrickLink's English across every locale: they are proper
      // nouns, and they match the titles of our own minifig pages.
      let list = shown.join(locale === 'ja' ? '、' : ', ');
      if (hidden > 0) list += f.more(hidden);
      // The count is the true number of minifigures in the set, which can
      // exceed the number of distinct characters listed when a set ships two of
      // the same figure.
      parts.push(f.figs(minifigNames.length, list));
    }

    parts.push(f.cta);
    out[`description_${locale}`] = parts.join(sep);
  }

  return out;
}
