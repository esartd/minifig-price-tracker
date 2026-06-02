import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// FLAGSHIP BATCH 5: More DC & Marvel Characters
const batch = [
  {
    minifigure_no: 'sh0017',
    name: 'Wolverine',
    description_en: 'Wolverine the fierce X-Men hero brought adamantium claws and regenerative healing to LEGO. This minifigure featured iconic yellow and blue suit with distinctive mask design. Logan\'s berserker rage and adamantium skeleton made him nearly unstoppable. This collectible from X-Men represented the mutant warrior with animal instincts and an unbreakable spirit.',
    description_de: 'Wolverine der wilde X-Men-Held brachte Adamantium-Klauen und regenerative Heilung zu LEGO. Diese Minifigur zeigte ikonischen gelb-blauen Anzug mit charakteristischem Masken-Design. Logans Berserker-Wut und Adamantium-Skelett machten ihn fast unaufhaltsam. Diese Sammlerfigur aus X-Men repräsentierte den Mutanten-Krieger mit tierischen Instinkten und unbrechbarem Geist.',
    description_fr: 'Wolverine le héros féroce des X-Men apportait griffes d\'adamantium et guérison régénérative à LEGO. Cette minifigurine présentait un costume jaune et bleu emblématique avec design de masque distinctif. La rage berserker de Logan et son squelette d\'adamantium le rendaient presque imparable. Cette collection des X-Men représentait le guerrier mutant avec instincts animaux et esprit incassable.',
    description_es: 'Wolverine el feroz héroe de X-Men traía garras de adamantium y curación regenerativa a LEGO. Esta minifigura presentaba icónico traje amarillo y azul con distintivo diseño de máscara. La furia berserker de Logan y su esqueleto de adamantium lo hacían casi imparable. Esta colección de X-Men representaba al guerrero mutante con instintos animales y espíritu inquebrantable.'
  },
  {
    minifigure_no: 'sh0020',
    name: 'The Joker\'s Henchman - Lime Jacket',
    description_en: 'The Joker\'s henchman in lime jacket served Gotham\'s Clown Prince of Crime. This LEGO minifigure featured bright lime jacket with purple accents reflecting the Joker\'s chaotic style. Criminal thugs followed the Joker\'s mad schemes across Gotham City. This collectible from Batman sets represented the colorful gang members who brought mayhem to the streets.',
    description_de: 'Der Handlanger des Jokers in limetten Jacke diente Gothams Clown-Prinzen des Verbrechens. Diese LEGO-Minifigur zeigte helle limetten Jacke mit lila Akzenten, die den chaotischen Stil des Jokers widerspiegelte. Kriminelle Schläger folgten den verrückten Plänen des Jokers durch Gotham City. Diese Sammlerfigur aus Batman-Sets repräsentierte die bunten Gang-Mitglieder, die Chaos auf die Straßen brachten.',
    description_fr: 'L\'homme de main du Joker en veste lime servait le Prince Clown du Crime de Gotham. Cette minifigurine LEGO présentait une veste lime brillante avec accents violets reflétant le style chaotique du Joker. Les voyous criminels suivaient les plans fous du Joker à travers Gotham City. Cette collection des ensembles Batman représentait les membres de gang colorés qui apportaient le chaos dans les rues.',
    description_es: 'El secuaz del Joker en chaqueta lima servía al Príncipe Payaso del Crimen de Gotham. Esta minifigura LEGO presentaba brillante chaqueta lima con acentos morados reflejando el estilo caótico del Joker. Los matones criminales seguían los planes locos del Joker por Gotham City. Esta colección de sets de Batman representaba a los miembros de pandilla coloridos que traían caos a las calles.'
  },
  {
    minifigure_no: 'sh0021',
    name: 'Two-Face\'s Henchman - Beard',
    description_en: 'Two-Face\'s henchman with beard served Harvey Dent\'s criminal empire in Gotham. This LEGO minifigure featured rugged appearance with facial hair and split color scheme. Criminal enforcers followed Two-Face\'s coin-flip decisions in his quest for twisted justice. This collectible from Batman sets represented the loyal thugs who carried out Dent\'s dual nature operations.',
    description_de: 'Two-Faces Handlanger mit Bart diente Harvey Dents kriminellem Imperium in Gotham. Diese LEGO-Minifigur zeigte raues Erscheinungsbild mit Gesichtsbehaarung und geteiltem Farbschema. Kriminelle Vollstrecker folgten Two-Faces Münzwurf-Entscheidungen in seiner Suche nach verdrehter Gerechtigkeit. Diese Sammlerfigur aus Batman-Sets repräsentierte die loyalen Schläger, die Dents duale Natur-Operationen ausführten.',
    description_fr: 'L\'homme de main de Double-Face avec barbe servait l\'empire criminel de Harvey Dent à Gotham. Cette minifigurine LEGO présentait une apparence robuste avec pilosité faciale et schéma de couleurs divisé. Les exécuteurs criminels suivaient les décisions au pile ou face de Double-Face dans sa quête de justice tordue. Cette collection des ensembles Batman représentait les voyous loyaux qui exécutaient les opérations de nature duale de Dent.',
    description_es: 'El secuaz de Dos Caras con barba servía al imperio criminal de Harvey Dent en Gotham. Esta minifigura LEGO presentaba apariencia ruda con vello facial y esquema de color dividido. Los ejecutores criminales seguían las decisiones de lanzamiento de moneda de Dos Caras en su búsqueda de justicia retorcida. Esta colección de sets de Batman representaba a los matones leales que llevaban a cabo las operaciones de naturaleza dual de Dent.'
  },
  {
    minifigure_no: 'sh0022',
    name: 'Two-Face\'s Henchman - Sunglasses',
    description_en: 'Two-Face\'s henchman with sunglasses brought intimidating presence to Gotham\'s underworld. This LEGO minifigure featured dark sunglasses and split color scheme matching Two-Face\'s duality theme. Criminal muscle enforced Harvey Dent\'s twisted sense of justice. This collectible from Batman sets represented the street-level thugs who operated under the scarred villain\'s command.',
    description_de: 'Two-Faces Handlanger mit Sonnenbrille brachte einschüchternde Präsenz in Gothams Unterwelt. Diese LEGO-Minifigur zeigte dunkle Sonnenbrille und geteiltes Farbschema, das Two-Faces Dualitäts-Thema entsprach. Kriminelle Muskeln setzten Harvey Dents verdrehten Sinn für Gerechtigkeit durch. Diese Sammlerfigur aus Batman-Sets repräsentierte die Straßen-Schläger, die unter dem Befehl des vernarbten Schurken operierten.',
    description_fr: 'L\'homme de main de Double-Face avec lunettes de soleil apportait une présence intimidante au monde criminel de Gotham. Cette minifigurine LEGO présentait des lunettes de soleil sombres et un schéma de couleurs divisé correspondant au thème de dualité de Double-Face. Les muscles criminels appliquaient le sens de justice tordu de Harvey Dent. Cette collection des ensembles Batman représentait les voyous de rue qui opéraient sous le commandement du méchant balafré.',
    description_es: 'El secuaz de Dos Caras con gafas de sol traía presencia intimidante al submundo de Gotham. Esta minifigura LEGO presentaba gafas de sol oscuras y esquema de color dividido coincidiendo con el tema de dualidad de Dos Caras. El músculo criminal aplicaba el sentido retorcido de justicia de Harvey Dent. Esta colección de sets de Batman representaba a los matones callejeros que operaban bajo el mando del villano con cicatrices.'
  },
  {
    minifigure_no: 'sh0023',
    name: 'Guard',
    description_en: 'The security guard maintained order in LEGO\'s superhero universe. This minifigure featured standard uniform with cap and badge representing law enforcement. Guards protected banks, museums, and facilities from supervillain attacks. This collectible from Batman sets represented the brave everyday workers who stood between criminals and chaos.',
    description_de: 'Der Wachmann hielt Ordnung in LEGOs Superhelden-Universum. Diese Minifigur zeigte Standard-Uniform mit Mütze und Abzeichen, die Strafverfolgung repräsentierte. Wachmänner schützten Banken, Museen und Einrichtungen vor Superschurken-Angriffen. Diese Sammlerfigur aus Batman-Sets repräsentierte die tapferen Alltagsarbeiter, die zwischen Kriminellen und Chaos standen.',
    description_fr: 'Le garde de sécurité maintenait l\'ordre dans l\'univers des super-héros LEGO. Cette minifigurine présentait un uniforme standard avec casquette et badge représentant les forces de l\'ordre. Les gardes protégeaient les banques, musées et installations contre les attaques de super-vilains. Cette collection des ensembles Batman représentait les travailleurs courageux du quotidien qui se tenaient entre criminels et chaos.',
    description_es: 'El guardia de seguridad mantenía el orden en el universo de superhéroes de LEGO. Esta minifigura presentaba uniforme estándar con gorra y placa representando la aplicación de la ley. Los guardias protegían bancos, museos e instalaciones de ataques de supervillanos. Esta colección de sets de Batman representaba a los valientes trabajadores cotidianos que se interponían entre criminales y caos.'
  },
  {
    minifigure_no: 'sh0024',
    name: 'Harley Quinn',
    description_en: 'Harley Quinn the Joker\'s unpredictable partner brought chaos and humor to Gotham. This LEGO minifigure featured classic red and black jester costume with diamond pattern. Dr. Harleen Quinzel\'s transformation from psychiatrist to criminal showcased toxic love and madness. This collectible from Batman sets represented the acrobatic villain with a mallet and twisted sense of fun.',
    description_de: 'Harley Quinn die unberechenbare Partnerin des Jokers brachte Chaos und Humor nach Gotham. Diese LEGO-Minifigur zeigte klassisches rot-schwarzes Narren-Kostüm mit Diamant-Muster. Dr. Harleen Quinzels Transformation von Psychiaterin zu Krimineller zeigte toxische Liebe und Wahnsinn. Diese Sammlerfigur aus Batman-Sets repräsentierte die akrobatische Schurkin mit Hammer und verdrehtem Spaß-Sinn.',
    description_fr: 'Harley Quinn la partenaire imprévisible du Joker apportait chaos et humour à Gotham. Cette minifigurine LEGO présentait un costume de bouffon rouge et noir classique avec motif de diamant. La transformation du Dr. Harleen Quinzel de psychiatre à criminelle montrait l\'amour toxique et la folie. Cette collection des ensembles Batman représentait la méchante acrobatique avec maillet et sens de l\'amusement tordu.',
    description_es: 'Harley Quinn la impredecible compañera del Joker traía caos y humor a Gotham. Esta minifigura LEGO presentaba clásico traje de bufón rojo y negro con patrón de diamantes. La transformación de la Dra. Harleen Quinzel de psiquiatra a criminal mostraba amor tóxico y locura. Esta colección de sets de Batman representaba a la villana acrobática con mazo y sentido retorcido de diversión.'
  },
  {
    minifigure_no: 'sh0044',
    name: 'Jean Grey in Phoenix Costume',
    description_en: 'Jean Grey as Phoenix embodied cosmic power and tragedy in the X-Men saga. This LEGO minifigure featured iconic Phoenix costume with gold and red design. The Dark Phoenix Force transformed Jean from hero to one of Marvel\'s most powerful beings. This collectible from X-Men represented the mutant telepath whose immense power threatened the universe itself.',
    description_de: 'Jean Grey als Phoenix verkörperte kosmische Macht und Tragödie in der X-Men-Saga. Diese LEGO-Minifigur zeigte ikonisches Phoenix-Kostüm mit gold-rotem Design. Die Dark Phoenix Force verwandelte Jean von Heldin zu einem der mächtigsten Wesen Marvels. Diese Sammlerfigur aus X-Men repräsentierte die Mutanten-Telepathin, deren immense Macht das Universum selbst bedrohte.',
    description_fr: 'Jean Grey en tant que Phoenix incarnait puissance cosmique et tragédie dans la saga X-Men. Cette minifigurine LEGO présentait un costume Phoenix emblématique avec design or et rouge. La Force Dark Phoenix transforma Jean d\'héroïne en l\'un des êtres les plus puissants de Marvel. Cette collection des X-Men représentait la télépathe mutante dont le pouvoir immense menaçait l\'univers lui-même.',
    description_es: 'Jean Grey como Phoenix encarnaba poder cósmico y tragedia en la saga de X-Men. Esta minifigura LEGO presentaba icónico traje Phoenix con diseño dorado y rojo. La Fuerza Dark Phoenix transformó a Jean de heroína a uno de los seres más poderosos de Marvel. Esta colección de X-Men representaba a la telépata mutante cuyo inmenso poder amenazaba al universo mismo.'
  },
  {
    minifigure_no: 'sh0068',
    name: 'Pepper Potts',
    description_en: 'Pepper Potts the brilliant CEO and Tony Stark\'s closest confidant brought leadership to Stark Industries. This LEGO minifigure featured professional business attire reflecting her corporate role. Virginia "Pepper" Potts evolved from assistant to CEO while keeping Tony grounded. This collectible from Iron Man sets represented the capable executive who managed both company and hero with equal skill.',
    description_de: 'Pepper Potts die brillante CEO und Tony Starks engste Vertraute brachte Führung zu Stark Industries. Diese LEGO-Minifigur zeigte professionelle Geschäftskleidung, die ihre Unternehmensrolle widerspiegelte. Virginia "Pepper" Potts entwickelte sich von Assistentin zur CEO, während sie Tony geerdet hielt. Diese Sammlerfigur aus Iron Man-Sets repräsentierte die fähige Führungskraft, die sowohl Firma als auch Held mit gleicher Geschicklichkeit managte.',
    description_fr: 'Pepper Potts la brillante PDG et plus proche confidente de Tony Stark apportait leadership à Stark Industries. Cette minifigurine LEGO présentait une tenue d\'affaires professionnelle reflétant son rôle corporatif. Virginia "Pepper" Potts évolua d\'assistante à PDG tout en gardant Tony les pieds sur terre. Cette collection des ensembles Iron Man représentait la dirigeante compétente qui gérait à la fois entreprise et héros avec habileté égale.',
    description_es: 'Pepper Potts la brillante CEO y confidente más cercana de Tony Stark traía liderazgo a Stark Industries. Esta minifigura LEGO presentaba atuendo de negocios profesional reflejando su rol corporativo. Virginia "Pepper" Potts evolucionó de asistente a CEO mientras mantenía a Tony con los pies en la tierra. Esta colección de sets de Iron Man representaba a la ejecutiva capaz que manejaba tanto compañía como héroe con igual habilidad.'
  },
];

async function updateDescriptions() {
  console.log(`\n🎯 BATCH 5: More DC & Marvel Characters (8 minifigs)\n`);
  let updated = 0;
  for (const minifig of batch) {
    try {
      await prisma.minifigCatalog.update({
        where: { minifigure_no: minifig.minifigure_no },
        data: {
          description_en: minifig.description_en,
          description_de: minifig.description_de,
          description_fr: minifig.description_fr,
          description_es: minifig.description_es,
        },
      });
      updated++;
      console.log(`✅ ${minifig.minifigure_no}`);
    } catch (error: any) {
      console.error(`❌ ${minifig.minifigure_no}:`, error.message);
    }
  }
  console.log(`\n✅ Updated: ${updated}`);
  await prisma.$disconnect();
}

updateDescriptions().catch(console.error);
