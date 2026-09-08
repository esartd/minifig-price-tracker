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
