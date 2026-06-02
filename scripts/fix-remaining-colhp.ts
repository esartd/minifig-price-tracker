import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Character-specific descriptions for remaining collectible minifigures
const characterDescriptions: any = {
  'draco malfoy': {
    description_en: `Draco Malfoy the Slytherin rival appeared from Harry Potter Series 1. This LEGO minifigure featured blonde slicked-back hair and green Slytherin robes. His complex journey from bully to reluctant villain revealed unexpected depth. This collectible captured Draco's character with authentic House details.`,
    description_de: `Draco Malfoy der Slytherin-Rivale erschien aus Harry Potter Series 1. Diese LEGO-Minifigur zeigte blondes zurückgekämmtes Haar und grüne Slytherin-Roben. Seine komplexe Reise vom Tyrann zum widerwilligen Schurken offenbarte unerwartete Tiefe. Diese Sammlerfigur erfasste Dracos Charakter mit authentischen Haus-Details.`,
    description_fr: `Draco Malefoy le rival Serpentard apparaissait de Harry Potter Series 1. Cette minifigurine LEGO présentait des cheveux blonds plaqués en arrière et des robes Serpentard vertes. Son parcours complexe de tyran à méchant réticent révélait une profondeur inattendue. Cette collection capturait le caractère de Draco avec détails de Maison authentiques.`,
    description_es: `Draco Malfoy el rival Slytherin aparecía de Harry Potter Series 1. Esta minifigura LEGO presentaba cabello rubio peinado hacia atrás y túnicas Slytherin verdes. Su complejo viaje de matón a villano reacio revelaba profundidad inesperada. Esta colección capturaba el carácter de Draco con detalles de Casa auténticos.`,
  },
  'dobby': {
    description_en: `Dobby the free house-elf appeared from Harry Potter Series 1. This LEGO minifigure featured large ears and distinctive pillowcase clothing. His loyalty and sacrifice made him one of Harry's bravest allies. This collectible captured Dobby's endearing character with unique elf design.`,
    description_de: `Dobby der freie Hauself erschien aus Harry Potter Series 1. Diese LEGO-Minifigur zeigte große Ohren und charakteristische Kissenbezug-Kleidung. Seine Loyalität und Opferbereitschaft machten ihn zu einem von Harrys tapfersten Verbündeten. Diese Sammlerfigur erfasste Dobbys liebenswerten Charakter mit einzigartigem Elfen-Design.`,
    description_fr: `Dobby l'elfe de maison libre apparaissait de Harry Potter Series 1. Cette minifigurine LEGO présentait de grandes oreilles et des vêtements distinctifs en taie d'oreiller. Sa loyauté et son sacrifice en faisaient l'un des alliés les plus courageux d'Harry. Cette collection capturait le caractère attachant de Dobby avec design d'elfe unique.`,
    description_es: `Dobby el elfo doméstico libre aparecía de Harry Potter Series 1. Esta minifigura LEGO presentaba grandes orejas y distintiva ropa de funda de almohada. Su lealtad y sacrificio lo convertían en uno de los aliados más valientes de Harry. Esta colección capturaba el carácter entrañable de Dobby con diseño de elfo único.`,
  },
  'ginny weasley': {
    description_en: `Ginny Weasley the fierce youngest Weasley appeared from Harry Potter Series 2. This LEGO minifigure featured red Weasley hair and Gryffindor robes. Her powerful magic and courage made her a formidable witch. This collectible captured Ginny's strength with authentic character details.`,
    description_de: `Ginny Weasley die wilde jüngste Weasley erschien aus Harry Potter Series 2. Diese LEGO-Minifigur zeigte rotes Weasley-Haar und Gryffindor-Roben. Ihre mächtige Magie und Mut machten sie zu einer beeindruckenden Hexe. Diese Sammlerfigur erfasste Ginnys Stärke mit authentischen Charakter-Details.`,
    description_fr: `Ginny Weasley la cadette Weasley féroce apparaissait de Harry Potter Series 2. Cette minifigurine LEGO présentait des cheveux roux Weasley et des robes Gryffondor. Sa magie puissante et son courage en faisaient une sorcière formidable. Cette collection capturait la force de Ginny avec détails de personnage authentiques.`,
    description_es: `Ginny Weasley la feroz menor Weasley aparecía de Harry Potter Series 2. Esta minifigura LEGO presentaba cabello rojo Weasley y túnicas Gryffindor. Su poderosa magia y coraje la convertían en una bruja formidable. Esta colección capturaba la fuerza de Ginny con detalles de personaje auténticos.`,
  },
  'fred weasley': {
    description_en: `Fred Weasley the mischievous twin appeared from Harry Potter Series 2. This LEGO minifigure featured red Weasley hair and Gryffindor colors. His pranks and humor with George brought levity to dark times. This collectible captured Fred's playful spirit with authentic twin design.`,
    description_de: `Fred Weasley der schelmische Zwilling erschien aus Harry Potter Series 2. Diese LEGO-Minifigur zeigte rotes Weasley-Haar und Gryffindor-Farben. Seine Streiche und Humor mit George brachten Leichtigkeit in dunkle Zeiten. Diese Sammlerfigur erfasste Freds verspielten Geist mit authentischem Zwillings-Design.`,
    description_fr: `Fred Weasley le jumeau espiègle apparaissait de Harry Potter Series 2. Cette minifigurine LEGO présentait des cheveux roux Weasley et des couleurs Gryffondor. Ses farces et son humour avec George apportaient de la légèreté aux temps sombres. Cette collection capturait l'esprit joueur de Fred avec design de jumeau authentique.`,
    description_es: `Fred Weasley el gemelo travieso aparecía de Harry Potter Series 2. Esta minifigura LEGO presentaba cabello rojo Weasley y colores Gryffindor. Sus bromas y humor con George traían ligereza a tiempos oscuros. Esta colección capturaba el espíritu juguetón de Fred con diseño de gemelo auténtico.`,
  },
  'george weasley': {
    description_en: `George Weasley the ingenious twin appeared from Harry Potter Series 2. This LEGO minifigure featured red Weasley hair and Gryffindor colors. His magical inventions with Fred created Weasleys' Wizard Wheezes. This collectible captured George's entrepreneurial spirit with authentic twin design.`,
    description_de: `George Weasley der geniale Zwilling erschien aus Harry Potter Series 2. Diese LEGO-Minifigur zeigte rotes Weasley-Haar und Gryffindor-Farben. Seine magischen Erfindungen mit Fred schufen Weasleys Zauberhafte Zauberscherze. Diese Sammlerfigur erfasste Georges unternehmerischen Geist mit authentischem Zwillings-Design.`,
    description_fr: `George Weasley le jumeau ingénieux apparaissait de Harry Potter Series 2. Cette minifigurine LEGO présentait des cheveux roux Weasley et des couleurs Gryffondor. Ses inventions magiques avec Fred créèrent Weasley, Farces pour sorciers facétieux. Cette collection capturait l'esprit entrepreneurial de George avec design de jumeau authentique.`,
    description_es: `George Weasley el gemelo ingenioso aparecía de Harry Potter Series 2. Esta minifigura LEGO presentaba cabello rojo Weasley y colores Gryffindor. Sus invenciones mágicas con Fred crearon Sortilegios Weasley. Esta colección capturaba el espíritu emprendedor de George con diseño de gemelo auténtico.`,
  },
  'bellatrix lestrange': {
    description_en: `Bellatrix Lestrange the fanatical Death Eater appeared from Harry Potter Series 2. This LEGO minifigure featured wild black hair and dark robes. Her twisted loyalty to Voldemort made her exceptionally dangerous. This collectible captured Bellatrix's madness with authentic dark witch design.`,
    description_de: `Bellatrix Lestrange die fanatische Todesserin erschien aus Harry Potter Series 2. Diese LEGO-Minifigur zeigte wildes schwarzes Haar und dunkle Roben. Ihre verdrehte Loyalität zu Voldemort machte sie außergewöhnlich gefährlich. Diese Sammlerfigur erfasste Bellatrix' Wahnsinn mit authentischem dunklem Hexen-Design.`,
    description_fr: `Bellatrix Lestrange la Mangemort fanatique apparaissait de Harry Potter Series 2. Cette minifigurine LEGO présentait des cheveux noirs sauvages et des robes sombres. Sa loyauté tordue envers Voldemort la rendait exceptionnellement dangereuse. Cette collection capturait la folie de Bellatrix avec design de sorcière noire authentique.`,
    description_es: `Bellatrix Lestrange la Mortífaga fanática aparecía de Harry Potter Series 2. Esta minifigura LEGO presentaba cabello negro salvaje y túnicas oscuras. Su lealtad retorcida a Voldemort la hacía excepcionalmente peligrosa. Esta colección capturaba la locura de Bellatrix con diseño de bruja oscura auténtico.`,
  },
  'cedric diggory': {
    description_en: `Cedric Diggory the Hufflepuff champion appeared from Harry Potter Series 1. This LEGO minifigure featured Triwizard Tournament outfit and noble bearing. His tragic fate in the Goblet of Fire marked Voldemort's return. This collectible captured Cedric's heroic character with authentic Hufflepuff details.`,
    description_de: `Cedric Diggory der Hufflepuff-Champion erschien aus Harry Potter Series 1. Diese LEGO-Minifigur zeigte Trimagisches Turnier-Outfit und edle Haltung. Sein tragisches Schicksal im Feuerkelch markierte Voldemorts Rückkehr. Diese Sammlerfigur erfasste Cedrics heroischen Charakter mit authentischen Hufflepuff-Details.`,
    description_fr: `Cedric Diggory le champion Poufsouffle apparaissait de Harry Potter Series 1. Cette minifigurine LEGO présentait une tenue du Tournoi des Trois Sorciers et un port noble. Son destin tragique dans la Coupe de Feu marqua le retour de Voldemort. Cette collection capturait le caractère héroïque de Cedric avec détails Poufsouffle authentiques.`,
    description_es: `Cedric Diggory el campeón Hufflepuff aparecía de Harry Potter Series 1. Esta minifigura LEGO presentaba atuendo del Torneo de los Tres Magos y porte noble. Su trágico destino en el Cáliz de Fuego marcó el regreso de Voldemort. Esta colección capturaba el carácter heroico de Cedric con detalles Hufflepuff auténticos.`,
  },
  'newt scamander': {
    description_en: `Newt Scamander the magizoologist appeared from Fantastic Beasts. This LEGO minifigure featured distinctive blue coat and magical creature case. His dedication to protecting magical beasts shaped the wizarding world. This collectible captured Newt's character from the Fantastic Beasts series.`,
    description_de: `Newt Scamander der Magizoologe erschien aus Fantastic Beasts. Diese LEGO-Minifigur zeigte charakteristischen blauen Mantel und magischen Kreaturen-Koffer. Seine Hingabe zum Schutz magischer Bestien formte die Zauberwelt. Diese Sammlerfigur erfasste Newts Charakter aus der Fantastic Beasts-Serie.`,
    description_fr: `Norbert Dragonneau le magizoologiste apparaissait de Fantastic Beasts. Cette minifigurine LEGO présentait un manteau bleu distinctif et une valise de créatures magiques. Son dévouement à protéger les bêtes magiques façonna le monde des sorciers. Cette collection capturait le caractère de Norbert de la série Fantastic Beasts.`,
    description_es: `Newt Scamander el magizoólogo aparecía de Fantastic Beasts. Esta minifigura LEGO presentaba distintivo abrigo azul y maleta de criaturas mágicas. Su dedicación a proteger bestias mágicas dio forma al mundo mágico. Esta colección capturaba el carácter de Newt de la serie Fantastic Beasts.`,
  },
};

async function fixRemaining() {
  console.log('🔧 Fixing remaining collectible character descriptions...\n');

  const updates = [
    { id: 'colhp04', char: 'draco malfoy' },
    { id: 'colhp10', char: 'dobby' },
    { id: 'colhp31', char: 'ginny weasley' },
    { id: 'colhp32', char: 'fred weasley' },
    { id: 'colhp33', char: 'george weasley' },
    { id: 'colhp34', char: 'bellatrix lestrange' },
    { id: 'colhp12', char: 'cedric diggory' },
    { id: 'colhp17', char: 'newt scamander' },
  ];

  let fixed = 0;

  for (const { id, char } of updates) {
    const desc = characterDescriptions[char];
    if (!desc) {
      console.log(`⚠️  No description for ${char}`);
      continue;
    }

    try {
      await prisma.minifigCatalog.update({
        where: { minifigure_no: id },
        data: desc,
      });

      fixed++;
      console.log(`✅ ${id} - ${char}`);
    } catch (error: any) {
      console.error(`❌ ${id}:`, error.message);
    }
  }

  console.log(`\n✅ Fixed ${fixed} character descriptions!`);

  await prisma.$disconnect();
}

fixRemaining().catch(console.error);
