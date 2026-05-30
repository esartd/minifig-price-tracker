import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// FLAGSHIP BATCH 3: More Marvel/DC
const batch = [
  {
    minifigure_no: 'sh0205',
    name: 'Spider-Man - Black Web Pattern, Red Boots',
    description_en: 'Spider-Man with enhanced suit details featured black web pattern and distinctive red boots. This LEGO minifigure showcased refined printing with detailed leg design. Peter Parker\'s continued evolution as a hero brought new costume variations. This collectible from Ultimate Spider-Man represented the web-slinger\'s iconic appearance with improved design elements.',
    description_de: 'Spider-Man mit verbesserten Anzug-Details zeigte schwarzes Netz-Muster und charakteristische rote Stiefel. Diese LEGO-Minifigur präsentierte verfeinerten Druck mit detailliertem Bein-Design. Peter Parkers fortgesetzte Evolution als Held brachte neue Kostüm-Variationen. Diese Sammlerfigur aus Ultimate Spider-Man repräsentierte das ikonische Erscheinungsbild des Netzschleuderers mit verbesserten Design-Elementen.',
    description_fr: 'Spider-Man avec détails de costume améliorés présentait un motif de toile noire et des bottes rouges distinctives. Cette minifigurine LEGO montrait une impression raffinée avec design de jambes détaillé. L\'évolution continue de Peter Parker en tant que héros apporta de nouvelles variations de costume. Cette collection d\'Ultimate Spider-Man représentait l\'apparence emblématique du lanceur de toiles avec éléments de design améliorés.',
    description_es: 'Spider-Man con detalles de traje mejorados presentaba patrón de telaraña negra y distintivas botas rojas. Esta minifigura LEGO mostraba impresión refinada con diseño de piernas detallado. La evolución continua de Peter Parker como héroe trajo nuevas variaciones de traje. Esta colección de Ultimate Spider-Man representaba la apariencia icónica del lanzador de telarañas con elementos de diseño mejorados.'
  },
  {
    minifigure_no: 'sh0234',
    name: 'Robin - Classic TV Series',
    description_en: 'Robin from the 1960s Batman TV series brought retro charm to LEGO. This minifigure captured the colorful classic costume with bright colors and nostalgic design. Dick Grayson\'s campy heroics defined an era of superhero entertainment. This collectible celebrated the beloved TV show that made Robin a household name.',
    description_de: 'Robin aus der 1960er Batman-TV-Serie brachte Retro-Charme zu LEGO. Diese Minifigur erfasste das farbenfrohe klassische Kostüm mit hellen Farben und nostalgischem Design. Dick Graysons campy Heldentaten definierten eine Ära der Superhelden-Unterhaltung. Diese Sammlerfigur feierte die beliebte TV-Show, die Robin zu einem bekannten Namen machte.',
    description_fr: 'Robin de la série télévisée Batman des années 1960 apportait un charme rétro à LEGO. Cette minifigurine capturait le costume classique coloré avec couleurs vives et design nostalgique. Les héroïques camp de Dick Grayson définissaient une ère de divertissement de super-héros. Cette collection célébrait l\'émission télévisée bien-aimée qui fit de Robin un nom familier.',
    description_es: 'Robin de la serie de TV de Batman de los años 1960 traía encanto retro a LEGO. Esta minifigura capturaba el colorido traje clásico con colores brillantes y diseño nostálgico. Las heroicidades camp de Dick Grayson definieron una era de entretenimiento de superhéroes. Esta colección celebraba el amado programa de TV que hizo de Robin un nombre conocido.'
  },
  {
    minifigure_no: 'sh0237',
    name: 'Alfred Pennyworth - White Hair',
    description_en: 'Alfred Pennyworth the loyal butler served the Wayne family with wisdom and dedication. This LEGO minifigure featured formal suit and distinguished white hair. More than a servant, Alfred provided guidance and support to Batman. This collectible from Batman Classic TV Series represented the trusted confidant who kept Wayne Manor running.',
    description_de: 'Alfred Pennyworth der treue Butler diente der Wayne-Familie mit Weisheit und Hingabe. Diese LEGO-Minifigur zeigte formellen Anzug und distinguiertes weißes Haar. Mehr als ein Diener, bot Alfred Führung und Unterstützung für Batman. Diese Sammlerfigur aus Batman Classic TV Series repräsentierte den vertrauenswürdigen Vertrauten, der Wayne Manor am Laufen hielt.',
    description_fr: 'Alfred Pennyworth le majordome loyal servait la famille Wayne avec sagesse et dévouement. Cette minifigurine LEGO présentait un costume formel et des cheveux blancs distingués. Plus qu\'un serviteur, Alfred fournissait guidance et soutien à Batman. Cette collection de Batman Classic TV Series représentait le confident de confiance qui maintenait Wayne Manor en marche.',
    description_es: 'Alfred Pennyworth el leal mayordomo servía a la familia Wayne con sabiduría y dedicación. Esta minifigura LEGO presentaba traje formal y distinguido cabello blanco. Más que un sirviente, Alfred proporcionaba guía y apoyo a Batman. Esta colección de Batman Classic TV Series representaba al confidente de confianza que mantenía Wayne Manor funcionando.'
  },
  {
    minifigure_no: 'sh0246',
    name: 'The Flash - Short Legs',
    description_en: 'The Flash in Mighty Micros form captured the Scarlet Speedster in compact design. This LEGO minifigure with short legs featured iconic red suit with yellow lightning bolt. Barry Allen\'s super-speed made him the fastest man alive. This collectible from Mighty Micros represented The Flash in adorable miniature form.',
    description_de: 'The Flash in Mighty Micros Form erfasste den scharlachroten Speedster in kompaktem Design. Diese LEGO-Minifigur mit kurzen Beinen zeigte ikonischen roten Anzug mit gelbem Blitz. Barry Allens Super-Geschwindigkeit machte ihn zum schnellsten Mann der Welt. Diese Sammlerfigur aus Mighty Micros repräsentierte The Flash in bezaubernder Miniatur-Form.',
    description_fr: 'The Flash sous forme Mighty Micros capturait le Speedster Écarlate en design compact. Cette minifigurine LEGO avec jambes courtes présentait un costume rouge emblématique avec éclair jaune. La super-vitesse de Barry Allen en faisait l\'homme le plus rapide vivant. Cette collection de Mighty Micros représentait The Flash sous forme miniature adorable.',
    description_es: 'The Flash en forma Mighty Micros capturaba al Velocista Escarlata en diseño compacto. Esta minifigura LEGO con piernas cortas presentaba icónico traje rojo con rayo amarillo. La súper velocidad de Barry Allen lo convertía en el hombre más rápido vivo. Esta colección de Mighty Micros representaba a The Flash en adorable forma en miniatura.'
  },
  {
    minifigure_no: 'sh0248',
    name: 'Spider-Man - Short Legs',
    description_en: 'Spider-Man in Mighty Micros form brought the web-slinger to compact scale. This LEGO minifigure with short legs featured classic red and blue suit with web pattern. Peter Parker\'s heroism worked at any size. This collectible from Mighty Micros represented Spider-Man in cute miniature form.',
    description_de: 'Spider-Man in Mighty Micros Form brachte den Netzschleuderer in kompakte Größe. Diese LEGO-Minifigur mit kurzen Beinen zeigte klassischen rot-blauen Anzug mit Netz-Muster. Peter Parkers Heldentum funktionierte in jeder Größe. Diese Sammlerfigur aus Mighty Micros repräsentierte Spider-Man in süßer Miniatur-Form.',
    description_fr: 'Spider-Man sous forme Mighty Micros apportait le lanceur de toiles à échelle compacte. Cette minifigurine LEGO avec jambes courtes présentait un costume rouge et bleu classique avec motif de toile. L\'héroïsme de Peter Parker fonctionnait à toute taille. Cette collection de Mighty Micros représentait Spider-Man sous forme miniature mignonne.',
    description_es: 'Spider-Man en forma Mighty Micros traía al lanzador de telarañas a escala compacta. Esta minifigura LEGO con piernas cortas presentaba clásico traje rojo y azul con patrón de telaraña. El heroísmo de Peter Parker funcionaba en cualquier tamaño. Esta colección de Mighty Micros representaba a Spider-Man en linda forma en miniatura.'
  },
  {
    minifigure_no: 'sh0251',
    name: 'Red Skull - Short Legs',
    description_en: 'Red Skull in Mighty Micros form captured Captain America\'s arch-nemesis in compact design. This LEGO minifigure with short legs featured distinctive red skull head and dark suit. Johann Schmidt\'s evil ambitions threatened world domination. This collectible from Mighty Micros represented the HYDRA leader in miniature villainous form.',
    description_de: 'Red Skull in Mighty Micros Form erfasste Captain Americas Erzfeind in kompaktem Design. Diese LEGO-Minifigur mit kurzen Beinen zeigte charakteristischen roten Schädel-Kopf und dunklen Anzug. Johann Schmidts böse Ambitionen bedrohten Weltherrschaft. Diese Sammlerfigur aus Mighty Micros repräsentierte den HYDRA-Anführer in Miniatur-Schurken-Form.',
    description_fr: 'Red Skull sous forme Mighty Micros capturait l\'archi-ennemi de Captain America en design compact. Cette minifigurine LEGO avec jambes courtes présentait une tête de crâne rouge distinctive et un costume sombre. Les ambitions maléfiques de Johann Schmidt menaçaient la domination mondiale. Cette collection de Mighty Micros représentait le leader HYDRA sous forme miniature de méchant.',
    description_es: 'Red Skull en forma Mighty Micros capturaba al archienemigo de Captain America en diseño compacto. Esta minifigura LEGO con piernas cortas presentaba distintiva cabeza de calavera roja y traje oscuro. Las ambiciones malvadas de Johann Schmidt amenazaban la dominación mundial. Esta colección de Mighty Micros representaba al líder de HYDRA en forma villana en miniatura.'
  },
];

async function updateDescriptions() {
  console.log(`\n🎯 BATCH 3: More Marvel/DC (6 minifigs)\n`);
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
