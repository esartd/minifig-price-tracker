import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// FIXED Minecraft minifigure descriptions - corrected min001/min002 swap
const batch = [
  {
    minifigure_no: 'min001',
    name: 'Micromob Creeper - Tall',
    description_en: 'Creeper the explosive mob struck fear into Minecraft players everywhere. Its green pixelated body and distinctive sad face became instantly recognizable. Creepers silently approached before detonating and destroying builds. This minifigure captured gaming\'s most famous enemy that turned "ssssss" into a warning.',
    description_de: 'Creeper der explosive Mob verbreitete Angst bei Minecraft-Spielern überall. Sein grüner pixeliger Körper und charakteristisches trauriges Gesicht wurden sofort erkennbar. Creepers näherten sich leise, bevor sie detonierten und Bauten zerstörten. Diese Minifigur erfasste den berühmtesten Feind des Gamings, der "ssssss" zu einer Warnung machte.',
    description_fr: 'Creeper le mob explosif sema la peur chez les joueurs Minecraft partout. Son corps vert pixelisé et visage triste distinctif devinrent instantanément reconnaissables. Les Creepers s\'approchaient silencieusement avant de détoner et détruire les constructions. Cette minifigurine capturait l\'ennemi le plus célèbre du jeu qui transforma "ssssss" en avertissement.',
    description_es: 'Creeper el mob explosivo infundía miedo en jugadores de Minecraft en todas partes. Su cuerpo verde pixelado y distintiva cara triste se volvieron instantáneamente reconocibles. Los Creepers se acercaban silenciosamente antes de detonar y destruir construcciones. Esta minifigura capturaba al enemigo más famoso de los videojuegos que convirtió "ssssss" en advertencia.'
  },
  {
    minifigure_no: 'min002',
    name: 'Micromob Steve - Tall',
    description_en: 'Steve the default Minecraft player character represented every player\'s journey. His blocky form and reddish brown hair became iconic in the gaming world. Steve\'s ability to mine, craft, and build created endless possibilities. This minifigure captured the spirit of creativity and survival in the cubic universe.',
    description_de: 'Steve die Standard-Minecraft-Spielerfigur repräsentierte die Reise jedes Spielers. Seine blockige Form und rötlichbraune Haare wurden ikonisch in der Spielewelt. Steves Fähigkeit zu graben, zu basteln und zu bauen schuf endlose Möglichkeiten. Diese Minifigur erfasste den Geist von Kreativität und Überleben im kubischen Universum.',
    description_fr: 'Steve le personnage joueur par défaut de Minecraft représentait le voyage de chaque joueur. Sa forme cubique et cheveux brun rougeâtre devinrent emblématiques dans le monde du jeu. La capacité de Steve à miner, fabriquer et construire créa des possibilités infinies. Cette minifigurine capturait l\'esprit de créativité et de survie dans l\'univers cubique.',
    description_es: 'Steve el personaje jugador predeterminado de Minecraft representaba el viaje de cada jugador. Su forma cúbica y cabello castaño rojizo se volvieron icónicos en el mundo de los videojuegos. La habilidad de Steve de minar, fabricar y construir creaba posibilidades infinitas. Esta minifigura capturaba el espíritu de creatividad y supervivencia en el universo cúbico.'
  },
  {
    minifigure_no: 'min004',
    name: 'Micromob Villager - Tall',
    description_en: 'Villager the peaceful NPC traded valuable items with players. Its brown robe and distinctive large nose made it recognizable. Villagers lived in communities and offered emeralds for goods. This minifigure captured Minecraft\'s friendly merchant characters.',
    description_de: 'Villager der friedliche NPC handelte wertvolle Gegenstände mit Spielern. Seine braune Robe und charakteristische große Nase machten ihn erkennbar. Villager lebten in Gemeinschaften und boten Smaragde für Waren. Diese Minifigur erfasste Minecrafts freundliche Händler-Charaktere.',
    description_fr: 'Villageois le PNJ pacifique échangeait des objets précieux avec les joueurs. Sa robe brune et nez large distinctif le rendaient reconnaissable. Les villageois vivaient en communautés et offraient des émeraudes pour des biens. Cette minifigurine capturait les personnages marchands amicaux de Minecraft.',
    description_es: 'Aldeano el NPC pacífico intercambiaba objetos valiosos con jugadores. Su túnica marrón y distintiva nariz grande lo hacían reconocible. Los aldeanos vivían en comunidades y ofrecían esmeraldas por bienes. Esta minifigura capturaba a los personajes comerciantes amigables de Minecraft.'
  },
  {
    minifigure_no: 'min005',
    name: 'Micromob Zombie - Tall',
    description_en: 'Zombie the undead mob emerged at night threatening players and villagers. Its green decaying flesh and tattered cyan shirt created classic horror. Zombies shambled slowly but attacked relentlessly in groups. This minifigure captured Minecraft\'s most common hostile mob lurking in darkness.',
    description_de: 'Zombie der untote Mob tauchte nachts auf und bedrohte Spieler und Dorfbewohner. Sein grünes verwesendes Fleisch und zerrissenes türkises Hemd schufen klassischen Horror. Zombies taumelten langsam, griffen aber unerbittlich in Gruppen an. Diese Minifigur erfasste Minecrafts häufigsten feindlichen Mob, der in Dunkelheit lauerte.',
    description_fr: 'Zombie le mob mort-vivant émergeait la nuit menaçant joueurs et villageois. Sa chair verte en décomposition et chemise cyan en lambeaux créaient une horreur classique. Les zombies titubaient lentement mais attaquaient sans relâche en groupe. Cette minifigurine capturait le mob hostile le plus commun de Minecraft tapi dans l\'obscurité.',
    description_es: 'Zombie el mob no-muerto emergía de noche amenazando a jugadores y aldeanos. Su carne verde en descomposición y camisa cyan andrajosa creaban horror clásico. Los zombis se tambaleaban lentamente pero atacaban implacablemente en grupos. Esta minifigura capturaba al mob hostil más común de Minecraft acechando en la oscuridad.'
  },
  {
    minifigure_no: 'min006',
    name: 'Micromob Ghast',
    description_en: 'Ghast the floating ghost mob haunted the Nether with explosive fireballs. Its large white cube body with tentacles and crying face made it unmistakable. Ghasts\' mournful sounds echoed through the dangerous dimension. This minifigure captured the Nether\'s most iconic flying threat.',
    description_de: 'Ghast der schwebende Geist-Mob heimsuchte den Nether mit explosiven Feuerbällen. Sein großer weißer Würfelkörper mit Tentakeln und weinendem Gesicht machte ihn unverwechselbar. Ghasts traurige Geräusche hallten durch die gefährliche Dimension. Diese Minifigur erfasste die ikonischste fliegende Bedrohung des Nethers.',
    description_fr: 'Ghast le mob fantôme flottant hantait le Nether avec des boules de feu explosives. Son grand corps cubique blanc avec tentacules et visage pleurant le rendait impossible à confondre. Les sons lugubres des Ghasts résonnaient à travers la dimension dangereuse. Cette minifigurine capturait la menace volante la plus emblématique du Nether.',
    description_es: 'Ghast el mob fantasma flotante acechaba el Nether con bolas de fuego explosivas. Su gran cuerpo cúbico blanco con tentáculos y cara llorando lo hacía inconfundible. Los sonidos lúgubres de los Ghasts resonaban por la dimensión peligrosa. Esta minifigura capturaba la amenaza voladora más icónica del Nether.'
  },
  {
    minifigure_no: 'min007',
    name: 'Micromob Zombie Pigman',
    description_en: 'Zombie Pigman the Nether inhabitant remained neutral unless provoked. Its golden sword and pig-like zombie appearance made it unique. Attacking one zombie pigman angered the entire group nearby. This minifigure captured the dangerous neutral mob from Minecraft\'s hellish dimension.',
    description_de: 'Zombie Pigman der Nether-Bewohner blieb neutral, bis er provoziert wurde. Sein goldenes Schwert und schweineartiges Zombie-Erscheinungsbild machten ihn einzigartig. Einen Zombie Pigman anzugreifen erzürnte die gesamte Gruppe in der Nähe. Diese Minifigur erfasste den gefährlichen neutralen Mob aus Minecrafts höllischer Dimension.',
    description_fr: 'Zombie Pigman l\'habitant du Nether restait neutre sauf si provoqué. Son épée dorée et apparence de zombie-cochon le rendaient unique. Attaquer un zombie pigman énervait tout le groupe à proximité. Cette minifigurine capturait le mob neutre dangereux de la dimension infernale de Minecraft.',
    description_es: 'Zombie Pigman el habitante del Nether permanecía neutral a menos que fuera provocado. Su espada dorada y apariencia de zombi-cerdo lo hacían único. Atacar a un zombie pigman enfurecía a todo el grupo cercano. Esta minifigura capturaba al mob neutral peligroso de la dimensión infernal de Minecraft.'
  },
  {
    minifigure_no: 'min008',
    name: 'Micromob Enderman',
    description_en: 'Enderman the tall mysterious creature teleported instantly when provoked. Its black body with purple eyes created an alien appearance. Endermen moved blocks randomly and attacked if looked at directly. This minifigure captured Minecraft\'s most unsettling mob that taught players fear of eye contact.',
    description_de: 'Enderman die große mysteriöse Kreatur teleportierte sofort, wenn provoziert. Sein schwarzer Körper mit lila Augen schuf ein außerirdisches Erscheinungsbild. Endermen bewegten Blöcke zufällig und griffen an, wenn direkt angesehen. Diese Minifigur erfasste Minecrafts verstörendsten Mob, der Spielern Angst vor Augenkontakt beibrachte.',
    description_fr: 'Enderman la grande créature mystérieuse se téléportait instantanément quand provoquée. Son corps noir avec yeux violets créait une apparence alien. Les Endermen déplaçaient des blocs aléatoirement et attaquaient si regardés directement. Cette minifigurine capturait le mob le plus troublant de Minecraft qui enseigna aux joueurs la peur du contact visuel.',
    description_es: 'Enderman la criatura alta misteriosa se teletransportaba instantáneamente cuando era provocada. Su cuerpo negro con ojos púrpura creaba una apariencia alienígena. Los Endermen movían bloques aleatoriamente y atacaban si se les miraba directamente. Esta minifigura capturaba al mob más inquietante de Minecraft que enseñó a jugadores miedo al contacto visual.'
  }
];

async function updateDescriptions() {
  console.log(`Fixing Minecraft minifigure descriptions (corrected Steve/Creeper swap + added more mobs)...`);
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

  console.log(`\n✅ Minecraft descriptions fix complete!`);
  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
