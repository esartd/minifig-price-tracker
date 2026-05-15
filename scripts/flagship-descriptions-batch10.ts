import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// FLAGSHIP BATCH 10: Disney + Princesses
const batch = [
  {
    minifigure_no: 'dis012',
    name: 'Mickey Mouse',
    description_en: 'Mickey Mouse brought the iconic mascot to LEGO Disney form. This minifigure featured classic red shorts, yellow shoes, and round ears. The cheerful mouse started it all for Disney. This collectible from LEGO Disney represented the timeless character who became the most recognizable symbol in entertainment history.',
    description_de: 'Mickey Mouse brachte das ikonische Maskottchen in LEGO Disney Form. Diese Minifigur zeigte klassische rote Shorts, gelbe Schuhe und runde Ohren. Die fröhliche Maus begann alles für Disney. Diese Sammlerfigur aus LEGO Disney repräsentierte die zeitlose Figur, die zum erkennbarsten Symbol in der Unterhaltungsgeschichte wurde.',
    description_fr: 'Mickey Mouse apportait la mascotte emblématique en forme LEGO Disney. Cette minifigurine présentait short rouge classique, chaussures jaunes et oreilles rondes. La souris joyeuse a tout commencé pour Disney. Cette collection de LEGO Disney représentait le personnage intemporel qui devint le symbole le plus reconnaissable de l\'histoire du divertissement.',
    description_es: 'Mickey Mouse traía a la mascota icónica en forma LEGO Disney. Esta minifigura presentaba pantalones cortos rojos clásicos, zapatos amarillos y orejas redondas. El ratón alegre comenzó todo para Disney. Esta colección de LEGO Disney representaba al personaje atemporal que se convirtió en el símbolo más reconocible en la historia del entretenimiento.'
  },
  {
    minifigure_no: 'dis019',
    name: 'Mickey Mouse - Black Tuxedo',
    description_en: 'Mickey Mouse in black tuxedo brought formal elegance to LEGO Disney. This minifigure featured sophisticated suit with bow tie and tail coat. The dressed-up mouse attended special occasions. This collectible from LEGO Disney represented Mickey in his most refined appearance for celebrations and ceremonies.',
    description_de: 'Mickey Mouse im schwarzen Smoking brachte formelle Eleganz zu LEGO Disney. Diese Minifigur zeigte kultiviertes Anzug mit Fliege und Frack. Die herausgeputzte Maus besuchte besondere Anlässe. Diese Sammlerfigur aus LEGO Disney repräsentierte Mickey in seinem raffiniertesten Erscheinungsbild für Feiern und Zeremonien.',
    description_fr: 'Mickey Mouse en smoking noir apportait élégance formelle à LEGO Disney. Cette minifigurine présentait costume sophistiqué avec nœud papillon et queue-de-pie. La souris habillée assistait à des occasions spéciales. Cette collection de LEGO Disney représentait Mickey dans son apparence la plus raffinée pour célébrations et cérémonies.',
    description_es: 'Mickey Mouse con esmoquin negro traía elegancia formal a LEGO Disney. Esta minifigura presentaba traje sofisticado con corbatín y frac. El ratón vestido asistía a ocasiones especiales. Esta colección de LEGO Disney representaba a Mickey en su apariencia más refinada para celebraciones y ceremonias.'
  },
  {
    minifigure_no: 'dis020',
    name: 'Minnie Mouse - Red Polka Dot Dress',
    description_en: 'Minnie Mouse in red polka dot dress brought classic style to LEGO Disney. This minifigure featured signature outfit with matching bow and shoes. The fashionable mouse set trends for generations. This collectible from LEGO Disney represented Minnie\'s most iconic look that defined her character and timeless appeal.',
    description_de: 'Minnie Mouse im rot gepunkteten Kleid brachte klassischen Stil zu LEGO Disney. Diese Minifigur zeigte charakteristisches Outfit mit passender Schleife und Schuhen. Die modische Maus setzte Trends für Generationen. Diese Sammlerfigur aus LEGO Disney repräsentierte Minnies ikonischsten Look, der ihren Charakter und zeitlose Anziehungskraft definierte.',
    description_fr: 'Minnie Mouse en robe à pois rouges apportait style classique à LEGO Disney. Cette minifigurine présentait tenue signature avec nœud et chaussures assortis. La souris à la mode lançait des tendances pour générations. Cette collection de LEGO Disney représentait le look le plus emblématique de Minnie qui définissait son personnage et attrait intemporel.',
    description_es: 'Minnie Mouse con vestido de lunares rojos traía estilo clásico a LEGO Disney. Esta minifigura presentaba atuendo característico con lazo y zapatos a juego. La ratona de moda marcaba tendencias para generaciones. Esta colección de LEGO Disney representaba el look más icónico de Minnie que definía su personaje y atractivo atemporal.'
  },
  {
    minifigure_no: 'dp001',
    name: 'Ariel, Mermaid',
    description_en: 'Ariel as mermaid brought the underwater princess to LEGO form. This minifigure featured red hair, purple seashell top, and green tail piece. The curious mermaid dreamed of the human world. This collectible from LEGO Disney Princess represented the adventurous spirit who gave up her voice for love in The Little Mermaid.',
    description_de: 'Ariel als Meerjungfrau brachte die Unterwasser-Prinzessin in LEGO-Form. Diese Minifigur zeigte rotes Haar, lila Muschel-Oberteil und grünes Schwanz-Teil. Die neugierige Meerjungfrau träumte von der menschlichen Welt. Diese Sammlerfigur aus LEGO Disney Princess repräsentierte den abenteuerlichen Geist, der ihre Stimme für Liebe in Arielle die Meerjungfrau aufgab.',
    description_fr: 'Ariel en sirène apportait la princesse sous-marine en forme LEGO. Cette minifigurine présentait cheveux roux, haut coquillage violet et pièce de queue verte. La sirène curieuse rêvait du monde humain. Cette collection de LEGO Disney Princess représentait l\'esprit aventureux qui abandonna sa voix pour l\'amour dans La Petite Sirène.',
    description_es: 'Ariel como sirena traía a la princesa submarina en forma LEGO. Esta minifigura presentaba cabello rojo, top de concha morada y pieza de cola verde. La sirena curiosa soñaba con el mundo humano. Esta colección de LEGO Disney Princess representaba al espíritu aventurero que renunció a su voz por amor en La Sirenita.'
  },
  {
    minifigure_no: 'dp002',
    name: 'Merida',
    description_en: 'Merida brought the brave Scottish princess to LEGO form. This minifigure featured wild red curly hair, bow and arrow, and green dress. The skilled archer refused arranged marriage. This collectible from LEGO Disney Princess Brave represented the independent spirit who changed her fate and defied tradition.',
    description_de: 'Merida brachte die mutige schottische Prinzessin in LEGO-Form. Diese Minifigur zeigte wildes rotes lockiges Haar, Bogen und Pfeil und grünes Kleid. Die geschickte Bogenschützin verweigerte arrangierte Ehe. Diese Sammlerfigur aus LEGO Disney Princess Brave repräsentierte den unabhängigen Geist, der ihr Schicksal änderte und Tradition trotzte.',
    description_fr: 'Merida apportait la courageuse princesse écossaise en forme LEGO. Cette minifigurine présentait cheveux roux bouclés sauvages, arc et flèche et robe verte. L\'archère habile refusait le mariage arrangé. Cette collection de LEGO Disney Princess Brave représentait l\'esprit indépendant qui changea son destin et défia la tradition.',
    description_es: 'Merida traía a la valiente princesa escocesa en forma LEGO. Esta minifigura presentaba cabello rojo rizado salvaje, arco y flecha y vestido verde. La arquera hábil rechazaba matrimonio arreglado. Esta colección de LEGO Disney Princess Brave representaba al espíritu independiente que cambió su destino y desafió la tradición.'
  },
  {
    minifigure_no: 'dp003',
    name: 'Cinderella',
    description_en: 'Cinderella brought the classic fairy tale princess to LEGO form. This minifigure featured iconic blue ball gown, blonde hair, and elegant appearance. The kind-hearted girl found true love at the ball. This collectible from LEGO Disney Princess represented the timeless story of transformation and happily ever after.',
    description_de: 'Cinderella brachte die klassische Märchen-Prinzessin in LEGO-Form. Diese Minifigur zeigte ikonisches blaues Ballkleid, blondes Haar und elegantes Erscheinungsbild. Das gutmütige Mädchen fand wahre Liebe auf dem Ball. Diese Sammlerfigur aus LEGO Disney Princess repräsentierte die zeitlose Geschichte von Verwandlung und glücklich bis ans Ende.',
    description_fr: 'Cendrillon apportait la princesse de conte de fées classique en forme LEGO. Cette minifigurine présentait robe de bal bleue emblématique, cheveux blonds et apparence élégante. La jeune fille au bon cœur trouva le véritable amour au bal. Cette collection de LEGO Disney Princess représentait l\'histoire intemporelle de transformation et ils vécurent heureux.',
    description_es: 'Cenicienta traía a la princesa clásica de cuento de hadas en forma LEGO. Esta minifigura presentaba icónico vestido de gala azul, cabello rubio y apariencia elegante. La chica de buen corazón encontró amor verdadero en el baile. Esta colección de LEGO Disney Princess representaba la historia atemporal de transformación y felices para siempre.'
  },
  {
    minifigure_no: 'dp004',
    name: 'Ariel, Human',
    description_en: 'Ariel as human brought the transformed princess to LEGO form. This minifigure featured red hair, blue dress, and human legs. The former mermaid sacrificed her voice for love. This collectible from LEGO Disney Princess represented Ariel\'s dream fulfilled as she explored the world above the sea.',
    description_de: 'Ariel als Mensch brachte die verwandelte Prinzessin in LEGO-Form. Diese Minifigur zeigte rotes Haar, blaues Kleid und menschliche Beine. Die ehemalige Meerjungfrau opferte ihre Stimme für Liebe. Diese Sammlerfigur aus LEGO Disney Princess repräsentierte Ariels erfüllten Traum als sie die Welt über dem Meer erkundete.',
    description_fr: 'Ariel en humaine apportait la princesse transformée en forme LEGO. Cette minifigurine présentait cheveux roux, robe bleue et jambes humaines. L\'ancienne sirène sacrifia sa voix pour l\'amour. Cette collection de LEGO Disney Princess représentait le rêve accompli d\'Ariel alors qu\'elle explorait le monde au-dessus de la mer.',
    description_es: 'Ariel como humana traía a la princesa transformada en forma LEGO. Esta minifigura presentaba cabello rojo, vestido azul y piernas humanas. La ex sirena sacrificó su voz por amor. Esta colección de LEGO Disney Princess representaba el sueño cumplido de Ariel mientras exploraba el mundo sobre el mar.'
  },
  {
    minifigure_no: 'dp006',
    name: 'Rapunzel - Mini Doll',
    description_en: 'Rapunzel in mini doll format brought the long-haired princess to LEGO form. This figure featured incredibly long blonde hair, purple dress, and detailed design. The imprisoned princess used her magical hair. This collectible from LEGO Disney Princess Tangled represented the creative spirit who discovered her true identity beyond the tower.',
    description_de: 'Rapunzel im Mini-Puppen-Format brachte die langhaarige Prinzessin in LEGO-Form. Diese Figur zeigte unglaublich langes blondes Haar, lila Kleid und detailliertes Design. Die eingesperrte Prinzessin nutzte ihr magisches Haar. Diese Sammlerfigur aus LEGO Disney Princess Rapunzel repräsentierte den kreativen Geist, der ihre wahre Identität jenseits des Turms entdeckte.',
    description_fr: 'Raiponce au format mini poupée apportait la princesse aux cheveux longs en forme LEGO. Cette figurine présentait cheveux blonds incroyablement longs, robe violette et design détaillé. La princesse emprisonnée utilisait ses cheveux magiques. Cette collection de LEGO Disney Princess Raiponce représentait l\'esprit créatif qui découvrit sa véritable identité au-delà de la tour.',
    description_es: 'Rapunzel en formato mini muñeca traía a la princesa de cabello largo en forma LEGO. Esta figura presentaba cabello rubio increíblemente largo, vestido morado y diseño detallado. La princesa prisionera usaba su cabello mágico. Esta colección de LEGO Disney Princess Enredados representaba al espíritu creativo que descubrió su verdadera identidad más allá de la torre.'
  },
  {
    minifigure_no: 'dp008',
    name: 'Cinderella - Two-Colored Dress',
    description_en: 'Cinderella in two-colored dress showed the magical transformation moment. This minifigure featured dress changing from rags to riches design. The fairy godmother\'s magic enabled the ball attendance. This collectible from LEGO Disney Princess captured the iconic metamorphosis that defined Cinderella\'s story and sparked dreams worldwide.',
    description_de: 'Cinderella im zweifarbigen Kleid zeigte den magischen Verwandlungsmoment. Diese Minifigur zeigte Kleid das sich von Lumpen zu Reichtum-Design verwandelte. Die gute Fees Magie ermöglichte den Ball-Besuch. Diese Sammlerfigur aus LEGO Disney Princess erfasste die ikonische Metamorphose, die Cinderellas Geschichte definierte und weltweite Träume entfachte.',
    description_fr: 'Cendrillon en robe bicolore montrait le moment de transformation magique. Cette minifigurine présentait robe changeant de design haillons à richesse. La magie de la marraine fée permit la présence au bal. Cette collection de LEGO Disney Princess capturait la métamorphose emblématique qui définissait l\'histoire de Cendrillon et éveillait des rêves dans le monde entier.',
    description_es: 'Cenicienta con vestido bicolor mostraba el momento mágico de transformación. Esta minifigura presentaba vestido cambiando de harapos a diseño de riqueza. La magia del hada madrina permitió la asistencia al baile. Esta colección de LEGO Disney Princess capturaba la metamorfosis icónica que definía la historia de Cenicienta e inspiraba sueños mundialmente.'
  },
];

async function updateDescriptions() {
  console.log(`\n🎯 BATCH 10: Disney + Princesses (9 minifigs)\n`);
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
