import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch9 = [
  {
    minifigure_no: 'sw0037',
    name: 'Sebulba',
    description_en: 'Sebulba, the aggressive Dug podracer pilot, is one of the most distinctive alien characters from The Phantom Menace. This minifigure features Sebulba\'s unique inverted body design with arms as legs, distinctive facial features, and racing goggles. Released in 1999 with his iconic orange podracer, Sebulba represents Anakin\'s main rival in the Boonta Eve Classic. Collectors value this figure for its unusual construction and memorable role as the race\'s villain. Sebulba\'s cheating tactics and subsequent crash make him a character fans love to hate. Essential for recreating the thrilling podrace sequence from Tatooine\'s desert canyons.',
    description_de: 'Sebulba, der aggressive Dug-Podrenner-Pilot, ist einer der markantesten Alien-Charaktere aus Die dunkle Bedrohung. Diese Minifigur zeigt Sebulbas einzigartiges invertiertes Körperdesign mit Armen als Beinen, charakteristische Gesichtszüge und Rennbrille. 1999 mit seinem ikonischen orangefarbenen Podrenner veröffentlicht, repräsentiert Sebulba Anakins Hauptrivalen im Boonta-Eve-Classic. Sammler schätzen diese Figur für ihre ungewöhnliche Konstruktion und einprägsame Rolle als Bösewicht des Rennens. Sebulbas Betrugstaktiken und anschließender Absturz machen ihn zu einem Charakter, den Fans lieben zu hassen. Unverzichtbar für die Nachstellung der aufregenden Podrennen-Sequenz aus Tatooines Wüstenschluchten.',
    description_fr: 'Sebulba, le pilote de module de course Dug agressif, est l\'un des personnages aliens les plus distinctifs de La Menace Fantôme. Cette minifigurine présente le design de corps inversé unique de Sebulba avec des bras comme jambes, des traits faciaux distinctifs et des lunettes de course. Sortie en 1999 avec son module de course orange emblématique, Sebulba représente le principal rival d\'Anakin dans le Classique de Boonta Eve. Les collectionneurs apprécient cette figurine pour sa construction inhabituelle et son rôle mémorable en tant que méchant de la course. Les tactiques de triche de Sebulba et son crash subséquent en font un personnage que les fans adorent détester. Essentielle pour recréer la séquence de course de modules palpitante des canyons désertiques de Tatooine.',
    description_es: 'Sebulba, el agresivo piloto de corredor de vainas Dug, es uno de los personajes alienígenas más distintivos de La Amenaza Fantasma. Esta minifigura presenta el único diseño corporal invertido de Sebulba con brazos como piernas, rasgos faciales distintivos y gafas de carreras. Lanzado en 1999 con su icónico corredor de vainas naranja, Sebulba representa al principal rival de Anakin en el Clásico de Boonta Eve. Los coleccionistas valoran esta figura por su construcción inusual y memorable papel como villano de la carrera. Las tácticas de trampa de Sebulba y su posterior choque lo convierten en un personaje que los fans aman odiar. Esencial para recrear la emocionante secuencia de carrera de vainas de los cañones desérticos de Tatooine.'
  },
  {
    minifigure_no: 'sw0038',
    name: 'Watto',
    description_en: 'Watto, the Toydarian junk dealer who owned Anakin and Shmi Skywalker, represents a pivotal character in Star Wars history. This minifigure features Watto\'s distinctive blue skin, trunk-like nose, wings, and weathered appearance as a shrewd merchant. Released in 1999, Watto\'s role as Anakin\'s master on Tatooine makes him significant despite his minor screen time. Collectors appreciate this unique alien design and Watto\'s immunity to Jedi mind tricks. His shop in Mos Espa was where Qui-Gon first recognized Anakin\'s extraordinary Force potential. Essential for Tatooine market scenes and recreating the fateful bet that freed young Anakin.',
    description_de: 'Watto, der Toydarianer-Schrotthändler, der Anakin und Shmi Skywalker besaß, repräsentiert einen entscheidenden Charakter in der Star Wars Geschichte. Diese Minifigur zeigt Wattos charakteristische blaue Haut, rüsselartige Nase, Flügel und verwittertes Aussehen als gerissener Händler. 1999 veröffentlicht, macht Wattos Rolle als Anakins Meister auf Tatooine ihn trotz seiner geringen Bildschirmzeit bedeutsam. Sammler schätzen dieses einzigartige Alien-Design und Wattos Immunität gegen Jedi-Gedankentricks. Sein Laden in Mos Espa war der Ort, wo Qui-Gon erstmals Anakins außergewöhnliches Macht-Potenzial erkannte. Unverzichtbar für Tatooine-Marktszenen und die Nachstellung der schicksalhaften Wette, die den jungen Anakin befreite.',
    description_fr: 'Watto, le marchand de ferraille Toydarian qui possédait Anakin et Shmi Skywalker, représente un personnage pivot dans l\'histoire de Star Wars. Cette minifigurine présente la peau bleue distinctive de Watto, son nez en forme de trompe, ses ailes et son apparence usée de marchand rusé. Sortie en 1999, le rôle de Watto en tant que maître d\'Anakin sur Tatooine le rend significatif malgré son temps d\'écran limité. Les collectionneurs apprécient ce design alien unique et l\'immunité de Watto aux tours de l\'esprit Jedi. Sa boutique à Mos Espa était l\'endroit où Qui-Gon a d\'abord reconnu le potentiel de Force extraordinaire d\'Anakin. Essentiel pour les scènes de marché de Tatooine et recréer le pari fatidique qui a libéré le jeune Anakin.',
    description_es: 'Watto, el comerciante de chatarra Toydarian que era dueño de Anakin y Shmi Skywalker, representa un personaje fundamental en la historia de Star Wars. Esta minifigura presenta la distintiva piel azul de Watto, nariz parecida a una trompa, alas y apariencia desgastada como comerciante astuto. Lanzado en 1999, el papel de Watto como amo de Anakin en Tatooine lo hace significativo a pesar de su limitado tiempo en pantalla. Los coleccionistas aprecian este diseño alienígena único y la inmunidad de Watto a los trucos mentales Jedi. Su tienda en Mos Espa fue donde Qui-Gon reconoció por primera vez el extraordinario potencial de la Fuerza de Anakin. Esencial para escenas del mercado de Tatooine y recrear la fatídica apuesta que liberó al joven Anakin.'
  },
  {
    minifigure_no: 'sw0039',
    name: 'Boss Nass',
    description_en: 'Boss Nass, the leader of the Gungan Grand Army, represents the aquatic civilization that allied with Naboo against the Trade Federation. This minifigure features Boss Nass\'s distinctive large head with prominent jowls, Gungan facial features, and ceremonial robes befitting his leadership status. Released in 1999, Boss Nass played a crucial diplomatic role in uniting Gungans and Naboo humans. Collectors value this figure for representing Gungan authority and the moment when underwater isolation gave way to surface alliance. His commanding presence led thousands of Gungan warriors into battle. Essential for sacred place negotiations and Battle of Naboo command scenes.',
    description_de: 'Boss Nass, der Anführer der Großen Gungan-Armee, repräsentiert die aquatische Zivilisation, die sich mit Naboo gegen die Handelsföderation verbündete. Diese Minifigur zeigt Boss Nass\' charakteristischen großen Kopf mit prominenten Wangen, Gungan-Gesichtszügen und zeremoniellen Roben, die seinem Führungsstatus entsprechen. 1999 veröffentlicht, spielte Boss Nass eine entscheidende diplomatische Rolle bei der Vereinigung von Gungans und Naboo-Menschen. Sammler schätzen diese Figur für die Darstellung der Gungan-Autorität und des Moments, als die Unterwasser-Isolation einer Oberflächenallianz wich. Seine kommandierende Präsenz führte Tausende von Gungan-Kriegern in die Schlacht. Unverzichtbar für Verhandlungen am heiligen Ort und Schlacht-um-Naboo-Kommandoszenen.',
    description_fr: 'Boss Nass, le chef de la Grande Armée Gungan, représente la civilisation aquatique qui s\'est alliée avec Naboo contre la Fédération du Commerce. Cette minifigurine présente la grande tête distinctive de Boss Nass avec des bajoues proéminentes, des traits faciaux Gungan et des robes cérémonielles convenant à son statut de leader. Sortie en 1999, Boss Nass a joué un rôle diplomatique crucial dans l\'unification des Gungans et des humains de Naboo. Les collectionneurs apprécient cette figurine pour représenter l\'autorité Gungan et le moment où l\'isolement sous-marin a cédé la place à une alliance de surface. Sa présence commandante a mené des milliers de guerriers Gungans au combat. Essentielle pour les négociations au lieu sacré et les scènes de commandement de la Bataille de Naboo.',
    description_es: 'Boss Nass, el líder del Gran Ejército Gungan, representa a la civilización acuática que se alió con Naboo contra la Federación de Comercio. Esta minifigura presenta la distintiva cabeza grande de Boss Nass con papadas prominentes, rasgos faciales Gungan y túnicas ceremoniales acordes a su estatus de liderazgo. Lanzado en 1999, Boss Nass jugó un papel diplomático crucial al unir a Gungans y humanos de Naboo. Los coleccionistas valoran esta figura por representar la autoridad Gungan y el momento en que el aislamiento submarino dio paso a la alianza de superficie. Su presencia comandante llevó a miles de guerreros Gungan a la batalla. Esencial para negociaciones en el lugar sagrado y escenas de comando de la Batalla de Naboo.'
  },
  {
    minifigure_no: 'sw0040',
    name: 'Jar Jar Binks (Swimming)',
    description_en: 'Jar Jar Binks in swimming configuration represents the clumsy but well-meaning Gungan who inadvertently shaped galactic history. This variant features Jar Jar\'s distinctive long-eared head, orange and yellow coloring, and simplified design for underwater scenes. Released in 1999, this version captures Jar Jar\'s aquatic nature as an amphibious Gungan. Despite being a polarizing character, collectors recognize Jar Jar\'s importance to The Phantom Menace plot and his eventual role as Senator. His bumbling journey from outcast to Palpatine\'s enabler makes him historically significant. Perfect for Gungan city scenes and underwater Naboo displays.',
    description_de: 'Jar Jar Binks in Schwimmkonfiguration repräsentiert den tollpatschigen, aber gutmeinenden Gungan, der unbeabsichtigt die galaktische Geschichte formte. Diese Variante zeigt Jar Jars charakteristischen langohriger Kopf, orange-gelbe Färbung und vereinfachtes Design für Unterwasserszenen. 1999 veröffentlicht, erfasst diese Version Jar Jars aquatische Natur als amphibischer Gungan. Trotz seiner polarisierenden Wirkung erkennen Sammler Jar Jars Bedeutung für die Handlung von Die dunkle Bedrohung und seine spätere Rolle als Senator. Seine tollpatschige Reise vom Ausgestoßenen zu Palpatines Ermöglicher macht ihn historisch bedeutsam. Perfekt für Gungan-Stadtszenen und Unterwasser-Naboo-Displays.',
    description_fr: 'Jar Jar Binks en configuration de nage représente le Gungan maladroit mais bien intentionné qui a involontairement façonné l\'histoire galactique. Cette variante présente la tête distinctive de Jar Jar avec de longues oreilles, une coloration orange et jaune et un design simplifié pour les scènes sous-marines. Sortie en 1999, cette version capture la nature aquatique de Jar Jar en tant que Gungan amphibie. Malgré être un personnage polarisant, les collectionneurs reconnaissent l\'importance de Jar Jar pour l\'intrigue de La Menace Fantôme et son rôle éventuel en tant que Sénateur. Son voyage maladroit d\'exclu à facilitateur de Palpatine le rend historiquement significatif. Parfait pour les scènes de la cité Gungan et les expositions sous-marines de Naboo.',
    description_es: 'Jar Jar Binks en configuración de natación representa al torpe pero bien intencionado Gungan que inadvertidamente moldeó la historia galáctica. Esta variante presenta la distintiva cabeza de orejas largas de Jar Jar, coloración naranja y amarilla, y diseño simplificado para escenas submarinas. Lanzado en 1999, esta versión captura la naturaleza acuática de Jar Jar como Gungan anfibio. A pesar de ser un personaje polarizante, los coleccionistas reconocen la importancia de Jar Jar para la trama de La Amenaza Fantasma y su eventual papel como Senador. Su torpe viaje de paria a facilitador de Palpatine lo hace históricamente significativo. Perfecto para escenas de la ciudad Gungan y exhibiciones submarinas de Naboo.'
  },
  {
    minifigure_no: 'sw0041',
    name: 'Droideka (Destroyer Droid)',
    description_en: 'The Droideka, also known as Destroyer Droid, represents one of the Trade Federation\'s most formidable weapons. This specialized build features the distinctive bronze-colored sphere design that transforms into a tripod battle stance with twin blasters and energy shields. Released in 1999, Droidekas terrified audiences with their rolling entrance and near-invulnerability. Collectors value these unique constructions for their memorable "Master, Destroyers!" scene and intimidating presence. Their shield technology made them nearly unstoppable until Qui-Gon wisely suggested running away. Essential for Trade Federation displays and recreating tense corridor battles from The Phantom Menace.',
    description_de: 'Das Droideka, auch als Zerstörer-Droide bekannt, repräsentiert eine der furchteinflößendsten Waffen der Handelsföderation. Diese spezialisierte Konstruktion zeigt das charakteristische bronzefarbene Kugeldesign, das sich in eine Dreibein-Kampfhaltung mit Doppelblastern und Energieschilden verwandelt. 1999 veröffentlicht, erschreckten Droidekas das Publikum mit ihrem rollenden Auftritt und nahezu Unbesiegbarkeit. Sammler schätzen diese einzigartigen Konstruktionen für ihre einprägsame "Meister, Zerstörer!"-Szene und einschüchternde Präsenz. Ihre Schildtechnologie machte sie nahezu unaufhaltsam, bis Qui-Gon weise vorschlug wegzulaufen. Unverzichtbar für Handelsföderation-Displays und die Nachstellung spannender Korridorkämpfe aus Die dunkle Bedrohung.',
    description_fr: 'Le Droideka, également connu sous le nom de Droïde Destructeur, représente l\'une des armes les plus redoutables de la Fédération du Commerce. Cette construction spécialisée présente le design de sphère bronze distinctif qui se transforme en position de combat sur trépied avec des blasters jumeaux et des boucliers énergétiques. Sorti en 1999, les Droidekas ont terrifié le public avec leur entrée en roulant et leur quasi-invulnérabilité. Les collectionneurs apprécient ces constructions uniques pour leur scène mémorable "Maître, Destructeurs!" et leur présence intimidante. Leur technologie de bouclier les rendait presque inarrêtables jusqu\'à ce que Qui-Gon suggère sagement de fuir. Essentiels pour les expositions de la Fédération du Commerce et recréer les batailles de corridor tendues de La Menace Fantôme.',
    description_es: 'El Droideka, también conocido como Droide Destructor, representa una de las armas más formidables de la Federación de Comercio. Esta construcción especializada presenta el distintivo diseño esférico de color bronce que se transforma en una postura de batalla trípode con blásters gemelos y escudos de energía. Lanzados en 1999, los Droidekas aterrorizaron a las audiencias con su entrada rodante y casi invulnerabilidad. Los coleccionistas valoran estas construcciones únicas por su memorable escena "¡Maestro, Destructores!" y presencia intimidante. Su tecnología de escudo los hizo casi imparables hasta que Qui-Gon sabiamente sugirió huir. Esenciales para exhibiciones de la Federación de Comercio y recrear tensas batallas de corredores de La Amenaza Fantasma.'
  }
];

async function saveBatch() {
  console.log('💾 Saving batch 9 (sw0037-sw0041)...\n');
  
  for (const minifig of batch9) {
    await prisma.minifigCatalog.upsert({
      where: { minifigure_no: minifig.minifigure_no },
      update: {
        description_en: minifig.description_en,
        description_de: minifig.description_de,
        description_fr: minifig.description_fr,
        description_es: minifig.description_es,
        description_generated_at: new Date(),
        description_status: 'generated'
      },
      create: {
        minifigure_no: minifig.minifigure_no,
        name: minifig.name,
        category_id: 1,
        category_name: 'Star Wars',
        search_name: minifig.name.toLowerCase(),
        description_en: minifig.description_en,
        description_de: minifig.description_de,
        description_fr: minifig.description_fr,
        description_es: minifig.description_es,
        description_generated_at: new Date(),
        description_status: 'generated'
      }
    });
    console.log(`  ✅ ${minifig.minifigure_no}: ${minifig.name}`);
  }
  
  console.log('\n✨ Batch 9 complete! Total: 40 minifigs (160 descriptions)\n');
  await prisma.$disconnect();
}

saveBatch().catch(console.error);
