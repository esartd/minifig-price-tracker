import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Batman/DC minifigure descriptions - Batch 2: Justice League heroes
const batch = [
  {
    minifigure_no: 'sh0020',
    name: 'Superman - Dark Blue Suit, Red Cape',
    description_en: 'Superman represented hope as the Last Son of Krypton protecting Earth. His dark blue suit with red cape became the symbol of heroism. Despite godlike powers, Clark Kent remained humble and compassionate. This variant captured Superman as the ultimate superhero inspiring humanity.',
    description_de: 'Superman repräsentierte Hoffnung als der Letzte Sohn von Krypton, der die Erde schützte. Sein dunkelblauer Anzug mit rotem Umhang wurde zum Symbol des Heroismus. Trotz gottgleicher Kräfte blieb Clark Kent bescheiden und mitfühlend. Diese Variante erfasste Superman als den ultimativen Superhelden, der die Menschheit inspirierte.',
    description_fr: 'Superman représentait l\'espoir comme le Dernier Fils de Krypton protégeant la Terre. Son costume bleu foncé avec cape rouge devint le symbole de l\'héroïsme. Malgré des pouvoirs divins, Clark Kent restait humble et compatissant. Cette variante capturait Superman comme le super-héros ultime inspirant l\'humanité.',
    description_es: 'Superman representaba esperanza como el Último Hijo de Krypton protegiendo la Tierra. Su traje azul oscuro con capa roja se convirtió en el símbolo del heroísmo. A pesar de poderes divinos, Clark Kent permanecía humilde y compasivo. Esta variante capturaba a Superman como el superhéroe definitivo inspirando a la humanidad.'
  },
  {
    minifigure_no: 'sh0021',
    name: 'Wonder Woman - Red Bustier, Blue Skirt, Tiara',
    description_en: 'Wonder Woman brought Amazonian strength and wisdom as Diana Prince. Her red bustier, blue skirt, and golden tiara reflected her warrior princess heritage. Diana\'s Lasso of Truth compelled honesty and justice. This variant captured Wonder Woman as the bridge between gods and humanity.',
    description_de: 'Wonder Woman brachte amazonische Stärke und Weisheit als Diana Prince. Ihr rotes Bustier, blauer Rock und goldene Tiara spiegelten ihr Krieger-Prinzessinnen-Erbe wider. Dianas Lasso der Wahrheit erzwang Ehrlichkeit und Gerechtigkeit. Diese Variante erfasste Wonder Woman als Brücke zwischen Göttern und Menschheit.',
    description_fr: 'Wonder Woman apportait force et sagesse amazoniennes comme Diana Prince. Son bustier rouge, jupe bleue et tiare dorée reflétaient son héritage de princesse guerrière. Le Lasso de Vérité de Diana imposait honnêteté et justice. Cette variante capturait Wonder Woman comme le pont entre dieux et humanité.',
    description_es: 'Wonder Woman traía fuerza y sabiduría amazónica como Diana Prince. Su bustier rojo, falda azul y tiara dorada reflejaban su herencia de princesa guerrera. El Lazo de la Verdad de Diana obligaba honestidad y justicia. Esta variante capturaba a Wonder Woman como el puente entre dioses y humanidad.'
  },
  {
    minifigure_no: 'sh0022',
    name: 'The Flash - Red Suit with Yellow Lightning Bolt',
    description_en: 'The Flash moved at superhuman speed as Barry Allen connected to the Speed Force. His red suit with yellow lightning bolt symbolized his velocity. Despite incredible power, Barry\'s forensic scientist mind valued patience and precision. This variant captured the Fastest Man Alive protecting Central City.',
    description_de: 'The Flash bewegte sich mit übermenschlicher Geschwindigkeit als Barry Allen, verbunden mit der Speed Force. Sein roter Anzug mit gelbem Blitz symbolisierte seine Geschwindigkeit. Trotz unglaublicher Kraft schätzte Barrys forensischer Wissenschaftler-Verstand Geduld und Präzision. Diese Variante erfasste den Schnellsten Mann der Welt beim Schutz von Central City.',
    description_fr: 'Flash se déplaçait à vitesse surhumaine comme Barry Allen connecté à la Force de Vitesse. Son costume rouge avec éclair jaune symbolisait sa vélocité. Malgré un pouvoir incroyable, l\'esprit de scientifique forensique de Barry valorisait patience et précision. Cette variante capturait l\'Homme le Plus Rapide du Monde protégeant Central City.',
    description_es: 'Flash se movía a velocidad sobrehumana como Barry Allen conectado a la Fuerza de Velocidad. Su traje rojo con rayo amarillo simbolizaba su velocidad. A pesar del poder increíble, la mente de científico forense de Barry valoraba paciencia y precisión. Esta variante capturaba al Hombre Más Rápido del Mundo protegiendo Central City.'
  },
  {
    minifigure_no: 'sh0023',
    name: 'Green Lantern - Hal Jordan, Power Ring',
    description_en: 'Green Lantern wielded the power ring fueled by willpower as Hal Jordan. His green suit and ring could create anything his imagination conceived. Despite being a test pilot, Hal\'s fearless nature made him the greatest Green Lantern. This variant captured the guardian of Sector 2814 protecting Earth.',
    description_de: 'Green Lantern führte den von Willenskraft angetriebenen Power Ring als Hal Jordan. Sein grüner Anzug und Ring konnten alles erschaffen, was seine Vorstellungskraft konzipierte. Trotz Testpilot-Dasein machte Hals furchtlose Natur ihn zum größten Green Lantern. Diese Variante erfasste den Wächter von Sektor 2814 beim Schutz der Erde.',
    description_fr: 'Green Lantern maniait l\'anneau de pouvoir alimenté par la volonté comme Hal Jordan. Son costume vert et anneau pouvaient créer tout ce que son imagination concevait. Malgré son statut de pilote d\'essai, la nature intrépide de Hal fit de lui le plus grand Green Lantern. Cette variante capturait le gardien du Secteur 2814 protégeant la Terre.',
    description_es: 'Green Lantern blandía el anillo de poder alimentado por fuerza de voluntad como Hal Jordan. Su traje verde y anillo podían crear cualquier cosa que su imaginación concibiera. A pesar de ser piloto de pruebas, la naturaleza intrépida de Hal lo convirtió en el mayor Green Lantern. Esta variante capturaba al guardián del Sector 2814 protegiendo la Tierra.'
  },
  {
    minifigure_no: 'sh0024',
    name: 'Aquaman - Orange Shirt, Green Pants',
    description_en: 'Aquaman ruled Atlantis as King of the Seven Seas. His orange shirt and green pants reflected his connection to ocean life. Arthur Curry\'s ability to communicate with sea creatures made him invaluable. This variant captured Aquaman as the bridge between surface world and underwater kingdoms.',
    description_de: 'Aquaman herrschte über Atlantis als König der Sieben Meere. Sein oranges Hemd und grüne Hose spiegelten seine Verbindung zum Meeresleben wider. Arthur Currys Fähigkeit, mit Meereskreaturen zu kommunizieren, machte ihn unschätzbar. Diese Variante erfasste Aquaman als Brücke zwischen Oberflächenwelt und Unterwasser-Königreichen.',
    description_fr: 'Aquaman régnait sur l\'Atlantide comme Roi des Sept Mers. Sa chemise orange et pantalon vert reflétaient sa connexion à la vie océanique. La capacité d\'Arthur Curry à communiquer avec les créatures marines le rendait inestimable. Cette variante capturait Aquaman comme le pont entre le monde de surface et les royaumes sous-marins.',
    description_es: 'Aquaman gobernaba Atlantis como Rey de los Siete Mares. Su camisa naranja y pantalones verdes reflejaban su conexión con la vida marina. La habilidad de Arthur Curry de comunicarse con criaturas marinas lo hacía invaluable. Esta variante capturaba a Aquaman como el puente entre el mundo superficial y reinos submarinos.'
  },
  {
    minifigure_no: 'sh0279',
    name: 'Cyborg - Metallic Body, Red Eye',
    description_en: 'Cyborg represented Victor Stone as a fusion of man and machine. His metallic body with red eye showcased advanced technology keeping him alive. Despite losing most of his human body, Vic never lost his humanity. This variant captured Cyborg as the technological heart of the Justice League.',
    description_de: 'Cyborg repräsentierte Victor Stone als Fusion von Mensch und Maschine. Sein metallischer Körper mit rotem Auge zeigte fortschrittliche Technologie, die ihn am Leben hielt. Trotz Verlust des größten Teils seines menschlichen Körpers verlor Vic nie seine Menschlichkeit. Diese Variante erfasste Cyborg als das technologische Herz der Justice League.',
    description_fr: 'Cyborg représentait Victor Stone comme une fusion d\'homme et de machine. Son corps métallique avec œil rouge présentait la technologie avancée le maintenant en vie. Malgré la perte de la majeure partie de son corps humain, Vic ne perdit jamais son humanité. Cette variante capturait Cyborg comme le cœur technologique de la Justice League.',
    description_es: 'Cyborg representaba a Victor Stone como una fusión de hombre y máquina. Su cuerpo metálico con ojo rojo mostraba tecnología avanzada manteniéndolo vivo. A pesar de perder la mayor parte de su cuerpo humano, Vic nunca perdió su humanidad. Esta variante capturaba a Cyborg como el corazón tecnológico de la Liga de la Justicia.'
  },
  {
    minifigure_no: 'sh0257',
    name: 'Lex Luthor - Business Suit, Bald',
    description_en: 'Lex Luthor embodied genius-level intellect twisted by jealousy of Superman. His business suit reflected his corporate power and respectability. Despite lacking superpowers, Lex\'s brilliance and resources made him Superman\'s greatest threat. This variant captured Luthor as the billionaire villain believing humanity needed no alien savior.',
    description_de: 'Lex Luthor verkörperte Genie-Intellekt, verdreht durch Eifersucht auf Superman. Sein Geschäftsanzug spiegelte seine Unternehmensmacht und Respektabilität wider. Trotz fehlender Superkräfte machten Lex\' Brillanz und Ressourcen ihn zu Supermans größter Bedrohung. Diese Variante erfasste Luthor als Milliardär-Bösewicht, der glaubte, die Menschheit brauche keinen außerirdischen Retter.',
    description_fr: 'Lex Luthor incarnait un intellect de niveau génie tordu par la jalousie de Superman. Son costume d\'affaires reflétait son pouvoir corporatif et sa respectabilité. Malgré l\'absence de superpouvoirs, la brillance et les ressources de Lex firent de lui la plus grande menace de Superman. Cette variante capturait Luthor comme le milliardaire méchant croyant que l\'humanité n\'avait besoin d\'aucun sauveur alien.',
    description_es: 'Lex Luthor encarnaba intelecto de nivel genio retorcido por celos de Superman. Su traje de negocios reflejaba su poder corporativo y respetabilidad. A pesar de carecer de superpoderes, la brillantez y recursos de Lex lo convirtieron en la mayor amenaza de Superman. Esta variante capturaba a Luthor como el villano multimillonario creyendo que la humanidad no necesitaba salvador extraterrestre.'
  },
  {
    minifigure_no: 'sh0256',
    name: 'Catwoman - Black Catsuit, Goggles, Whip',
    description_en: 'Catwoman walked the line between hero and thief as Selina Kyle. Her black catsuit with goggles and whip enabled acrobatic burglary. Despite criminal activities, Selina\'s moral code and romance with Batman complicated her villainy. This variant captured Catwoman as Gotham\'s most captivating anti-hero.',
    description_de: 'Catwoman balancierte auf der Grenze zwischen Heldin und Diebin als Selina Kyle. Ihr schwarzer Catsuit mit Brille und Peitsche ermöglichte akrobatischen Einbruch. Trotz krimineller Aktivitäten komplizierten Selinas moralischer Code und Romanze mit Batman ihre Bösewichtigkeit. Diese Variante erfasste Catwoman als Gothams fesselndste Anti-Heldin.',
    description_fr: 'Catwoman marchait sur la ligne entre héroïne et voleuse comme Selina Kyle. Son catsuit noir avec lunettes et fouet permettait le cambriolage acrobatique. Malgré les activités criminelles, le code moral de Selina et sa romance avec Batman compliquaient sa vilenie. Cette variante capturait Catwoman comme l\'anti-héroïne la plus captivante de Gotham.',
    description_es: 'Catwoman caminaba la línea entre heroína y ladrona como Selina Kyle. Su traje de gato negro con gafas y látigo permitían robo acrobático. A pesar de actividades criminales, el código moral de Selina y romance con Batman complicaban su villanía. Esta variante capturaba a Catwoman como la anti-heroína más cautivadora de Gotham.'
  }
];

async function updateDescriptions() {
  console.log(`Starting Batman/DC minifigure description updates (Batch 2)...`);
  console.log(`Total minifigures: ${batch.length}\n`);

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
      console.log(`✅ Updated ${minifig.minifigure_no} - ${minifig.name}`);
    } catch (error) {
      console.error(`❌ Error updating ${minifig.minifigure_no}:`, error);
    }
  }

  console.log(`\n✅ Batman/DC Batch 2 descriptions update complete!`);
  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
