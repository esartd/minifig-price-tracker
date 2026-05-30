import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Minecraft minifigure descriptions - Core characters and mobs
const batch = [
  {
    minifigure_no: 'min001',
    name: 'Steve - Minecraft Skin, Reddish Brown Hair',
    description_en: 'Steve the default Minecraft player character represented every player\'s journey. His blocky form and reddish brown hair became iconic in the gaming world. Steve\'s ability to mine, craft, and build created endless possibilities. This minifigure captured the spirit of creativity and survival in the cubic universe.',
    description_de: 'Steve die Standard-Minecraft-Spielerfigur repräsentierte die Reise jedes Spielers. Seine blockige Form und rötlichbraune Haare wurden ikonisch in der Spielewelt. Steves Fähigkeit zu graben, zu basteln und zu bauen schuf endlose Möglichkeiten. Diese Minifigur erfasste den Geist von Kreativität und Überleben im kubischen Universum.',
    description_fr: 'Steve le personnage joueur par défaut de Minecraft représentait le voyage de chaque joueur. Sa forme cubique et cheveux brun rougeâtre devinrent emblématiques dans le monde du jeu. La capacité de Steve à miner, fabriquer et construire créa des possibilités infinies. Cette minifigurine capturait l\'esprit de créativité et de survie dans l\'univers cubique.',
    description_es: 'Steve el personaje jugador predeterminado de Minecraft representaba el viaje de cada jugador. Su forma cúbica y cabello castaño rojizo se volvieron icónicos en el mundo de los videojuegos. La habilidad de Steve de minar, fabricar y construir creaba posibilidades infinitas. Esta minifigura capturaba el espíritu de creatividad y supervivencia en el universo cúbico.'
  },
  {
    minifigure_no: 'min002',
    name: 'Creeper',
    description_en: 'Creeper the explosive mob struck fear into Minecraft players everywhere. Its green pixelated body and distinctive sad face became instantly recognizable. Creepers silently approached before detonating and destroying builds. This minifigure captured gaming\'s most famous enemy that turned "ssssss" into a warning.',
    description_de: 'Creeper der explosive Mob verbreitete Angst bei Minecraft-Spielern überall. Sein grüner pixeliger Körper und charakteristisches trauriges Gesicht wurden sofort erkennbar. Creepers näherten sich leise, bevor sie detonierten und Bauten zerstörten. Diese Minifigur erfasste den berühmtesten Feind des Gamings, der "ssssss" zu einer Warnung machte.',
    description_fr: 'Creeper le mob explosif sema la peur chez les joueurs Minecraft partout. Son corps vert pixelisé et visage triste distinctif devinrent instantanément reconnaissables. Les Creepers s\'approchaient silencieusement avant de détoner et détruire les constructions. Cette minifigurine capturait l\'ennemi le plus célèbre du jeu qui transforma "ssssss" en avertissement.',
    description_es: 'Creeper el mob explosivo infundía miedo en jugadores de Minecraft en todas partes. Su cuerpo verde pixelado y distintiva cara triste se volvieron instantáneamente reconocibles. Los Creepers se acercaban silenciosamente antes de detonar y destruir construcciones. Esta minifigura capturaba al enemigo más famoso de los videojuegos que convirtió "ssssss" en advertencia.'
  },
  {
    minifigure_no: 'min004',
    name: 'Zombie',
    description_en: 'Zombie the undead mob emerged at night threatening players and villagers. Its green decaying flesh and tattered cyan shirt created classic horror. Zombies shambled slowly but attacked relentlessly in groups. This minifigure captured Minecraft\'s most common hostile mob lurking in darkness.',
    description_de: 'Zombie der untote Mob tauchte nachts auf und bedrohte Spieler und Dorfbewohner. Sein grünes verwesendes Fleisch und zerrissenes türkises Hemd schufen klassischen Horror. Zombies taumelten langsam, griffen aber unerbittlich in Gruppen an. Diese Minifigur erfasste Minecrafts häufigsten feindlichen Mob, der in Dunkelheit lauerte.',
    description_fr: 'Zombie le mob mort-vivant émergeait la nuit menaçant joueurs et villageois. Sa chair verte en décomposition et chemise cyan en lambeaux créaient une horreur classique. Les zombies titubaient lentement mais attaquaient sans relâche en groupe. Cette minifigurine capturait le mob hostile le plus commun de Minecraft tapi dans l\'obscurité.',
    description_es: 'Zombie el mob no-muerto emergía de noche amenazando a jugadores y aldeanos. Su carne verde en descomposición y camisa cyan andrajosa creaban horror clásico. Los zombis se tambaleaban lentamente pero atacaban implacablemente en grupos. Esta minifigura capturaba al mob hostil más común de Minecraft acechando en la oscuridad.'
  },
  {
    minifigure_no: 'min005',
    name: 'Skeleton',
    description_en: 'Skeleton the ranged attacker wielded a bow with deadly accuracy. Its white bones and empty eye sockets created an eerie presence. Skeletons shot arrows from distance forcing players to adapt tactics. This minifigure captured the undead archer that made nighttime exploration dangerous.',
    description_de: 'Skeleton der Fernkämpfer führte einen Bogen mit tödlicher Genauigkeit. Seine weißen Knochen und leeren Augenhöhlen schufen eine unheimliche Präsenz. Skelette schossen Pfeile aus der Distanz und zwangen Spieler, Taktiken anzupassen. Diese Minifigur erfasste den untoten Bogenschützen, der nächtliche Erkundung gefährlich machte.',
    description_fr: 'Squelette l\'attaquant à distance maniait un arc avec précision mortelle. Ses os blancs et orbites vides créaient une présence inquiétante. Les squelettes tiraient des flèches à distance forçant les joueurs à adapter leurs tactiques. Cette minifigurine capturait l\'archer mort-vivant qui rendit l\'exploration nocturne dangereuse.',
    description_es: 'Esqueleto el atacante a distancia blandía un arco con precisión mortal. Sus huesos blancos y cuencas vacías creaban una presencia espeluznante. Los esqueletos disparaban flechas desde la distancia forzando a jugadores a adaptar tácticas. Esta minifigura capturaba al arquero no-muerto que hacía peligrosa la exploración nocturna.'
  },
  {
    minifigure_no: 'min006',
    name: 'Enderman',
    description_en: 'Enderman the tall mysterious creature teleported instantly when provoked. Its black body with purple eyes created an alien appearance. Endermen moved blocks randomly and attacked if looked at directly. This minifigure captured Minecraft\'s most unsettling mob that taught players fear of eye contact.',
    description_de: 'Enderman die große mysteriöse Kreatur teleportierte sofort, wenn provoziert. Sein schwarzer Körper mit lila Augen schuf ein außerirdisches Erscheinungsbild. Endermen bewegten Blöcke zufällig und griffen an, wenn direkt angesehen. Diese Minifigur erfasste Minecrafts verstörendsten Mob, der Spielern Angst vor Augenkontakt beibrachte.',
    description_fr: 'Enderman la grande créature mystérieuse se téléportait instantanément quand provoquée. Son corps noir avec yeux violets créait une apparence alien. Les Endermen déplaçaient des blocs aléatoirement et attaquaient si regardés directement. Cette minifigurine capturait le mob le plus troublant de Minecraft qui enseigna aux joueurs la peur du contact visuel.',
    description_es: 'Enderman la criatura alta misteriosa se teletransportaba instantáneamente cuando era provocada. Su cuerpo negro con ojos púrpura creaba una apariencia alienígena. Los Endermen movían bloques aleatoriamente y atacaban si se les miraba directamente. Esta minifigura capturaba al mob más inquietante de Minecraft que enseñó a jugadores miedo al contacto visual.'
  },
  {
    minifigure_no: 'min007',
    name: 'Alex - Minecraft Skin, Orange Hair',
    description_en: 'Alex the alternate player character offered different representation in Minecraft. Her orange hair and unique skin design appealed to diverse players. Like Steve, Alex could mine, craft, and build without limits. This minifigure captured the second iconic player character expanding Minecraft\'s inclusivity.',
    description_de: 'Alex die alternative Spielerfigur bot unterschiedliche Repräsentation in Minecraft. Ihr oranges Haar und einzigartiges Skin-Design sprachen diverse Spieler an. Wie Steve konnte Alex ohne Grenzen graben, basteln und bauen. Diese Minifigur erfasste die zweite ikonische Spielerfigur, die Minecrafts Inklusivität erweiterte.',
    description_fr: 'Alex le personnage joueur alternatif offrait une représentation différente dans Minecraft. Ses cheveux orange et design de peau unique attiraient des joueurs divers. Comme Steve, Alex pouvait miner, fabriquer et construire sans limites. Cette minifigurine capturait le deuxième personnage joueur emblématique élargissant l\'inclusivité de Minecraft.',
    description_es: 'Alex el personaje jugador alternativo ofrecía diferente representación en Minecraft. Su cabello naranja y diseño de skin único atraía a jugadores diversos. Como Steve, Alex podía minar, fabricar y construir sin límites. Esta minifigura capturaba al segundo personaje jugador icónico expandiendo la inclusividad de Minecraft.'
  },
  {
    minifigure_no: 'min008',
    name: 'Iron Golem',
    description_en: 'Iron Golem the village protector defended villagers from hostile mobs. Its massive iron body and vine-covered arms showed strength and nature. Iron Golems offered flowers to villager children when not fighting. This minifigure captured the gentle giant that symbolized protection and community.',
    description_de: 'Iron Golem der Dorf-Beschützer verteidigte Dorfbewohner vor feindlichen Mobs. Sein massiver Eisenkörper und mit Ranken bedeckte Arme zeigten Stärke und Natur. Iron Golems boten Dorfkindern Blumen an, wenn sie nicht kämpften. Diese Minifigur erfasste den sanften Riesen, der Schutz und Gemeinschaft symbolisierte.',
    description_fr: 'Golem de Fer le protecteur du village défendait les villageois contre les mobs hostiles. Son corps de fer massif et bras couverts de vignes montraient force et nature. Les Golems de Fer offraient des fleurs aux enfants villageois quand ils ne combattaient pas. Cette minifigurine capturait le géant gentil symbolisant protection et communauté.',
    description_es: 'Gólem de Hierro el protector de la aldea defendía a aldeanos de mobs hostiles. Su cuerpo de hierro masivo y brazos cubiertos de enredaderas mostraban fuerza y naturaleza. Los Gólems de Hierro ofrecían flores a niños aldeanos cuando no peleaban. Esta minifigura capturaba al gigante gentil que simbolizaba protección y comunidad.'
  },
  {
    minifigure_no: 'min009',
    name: 'Spider',
    description_en: 'Spider the eight-legged mob climbed walls and attacked at night. Its red eyes glowed menacingly in darkness. Spiders became neutral in daylight but remained dangerous obstacles. This minifigure captured the arachnid enemy that taught players to look up when exploring.',
    description_de: 'Spider der achtbeinige Mob kletterte Wände und griff nachts an. Seine roten Augen glühten bedrohlich in Dunkelheit. Spinnen wurden bei Tageslicht neutral, blieben aber gefährliche Hindernisse. Diese Minifigur erfasste den Spinnentier-Feind, der Spielern beibrachte, beim Erkunden nach oben zu schauen.',
    description_fr: 'Araignée le mob à huit pattes grimpait les murs et attaquait la nuit. Ses yeux rouges brillaient menaçant dans l\'obscurité. Les araignées devenaient neutres en journée mais restaient des obstacles dangereux. Cette minifigurine capturait l\'ennemi arachnide qui enseigna aux joueurs à regarder en haut lors de l\'exploration.',
    description_es: 'Araña el mob de ocho patas trepaba paredes y atacaba de noche. Sus ojos rojos brillaban amenazadoramente en la oscuridad. Las arañas se volvían neutrales con luz del día pero permanecían como obstáculos peligrosos. Esta minifigura capturaba al enemigo arácnido que enseñó a jugadores a mirar hacia arriba al explorar.'
  }
];

async function updateDescriptions() {
  console.log(`Starting Minecraft minifigure description updates...`);
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

  console.log(`\n✅ Minecraft descriptions update complete!`);
  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
