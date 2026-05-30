import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Marvel minifigure descriptions - Batch 2: Extended Avengers roster and villains
const batch = [
  {
    minifigure_no: 'sh0078',
    name: 'Loki - Helmet with Horns, Trans-Bright Green Tesseract',
    description_en: 'Loki the God of Mischief wielded the Tesseract as his key to power. His horned helmet symbolized Asgardian royalty twisted by ambition. Though capable of tremendous destruction, Loki\'s complex relationship with Thor revealed deeper motivations. This variant captured Loki during his attack on New York with the Chitauri army.',
    description_de: 'Loki der Gott des Schabernacks führte den Tesserakt als seinen Schlüssel zur Macht. Sein gehörnter Helm symbolisierte asgardische Königlichkeit, verdreht durch Ehrgeiz. Obwohl zu enormer Zerstörung fähig, offenbarte Lokis komplexe Beziehung zu Thor tiefere Motivationen. Diese Variante erfasste Loki während seines Angriffs auf New York mit der Chitauri-Armee.',
    description_fr: 'Loki le Dieu de la Malice maniait le Tesseract comme sa clé du pouvoir. Son casque à cornes symbolisait la royauté asgardienne tordue par l\'ambition. Bien que capable d\'une destruction énorme, la relation complexe de Loki avec Thor révélait des motivations plus profondes. Cette variante capturait Loki pendant son attaque sur New York avec l\'armée Chitauri.',
    description_es: 'Loki el Dios del Engaño blandía el Teseracto como su llave al poder. Su casco con cuernos simbolizaba la realeza asgardiana retorcida por la ambición. Aunque capaz de tremenda destrucción, la compleja relación de Loki con Thor revelaba motivaciones más profundas. Esta variante capturaba a Loki durante su ataque a Nueva York con el ejército Chitauri.'
  },
  {
    minifigure_no: 'sh0167',
    name: 'Thanos - Infinity Gauntlet, Gold Armor',
    description_en: 'Thanos the Mad Titan sought the Infinity Stones to reshape reality itself. His golden armor and Infinity Gauntlet made him the most dangerous threat the universe had faced. Despite overwhelming power, Thanos believed his genocidal plan would save civilization. This variant represented the moment Thanos achieved ultimate power.',
    description_de: 'Thanos der Verrückte Titan suchte die Infinity-Steine, um die Realität selbst umzugestalten. Seine goldene Rüstung und der Infinity-Handschuh machten ihn zur gefährlichsten Bedrohung, der das Universum je gegenüberstand. Trotz überwältigender Macht glaubte Thanos, sein völkermörderischer Plan würde die Zivilisation retten. Diese Variante repräsentierte den Moment, als Thanos ultimative Macht erlangte.',
    description_fr: 'Thanos le Titan Fou cherchait les Pierres d\'Infinité pour remodeler la réalité elle-même. Son armure dorée et le Gantelet d\'Infinité firent de lui la menace la plus dangereuse que l\'univers ait jamais affrontée. Malgré un pouvoir écrasant, Thanos croyait que son plan génocidaire sauverait la civilisation. Cette variante représentait le moment où Thanos atteignit le pouvoir ultime.',
    description_es: 'Thanos el Titán Loco buscaba las Gemas del Infinito para remodelar la realidad misma. Su armadura dorada y Guantelete del Infinito lo convirtieron en la amenaza más peligrosa que el universo había enfrentado. A pesar del poder abrumador, Thanos creía que su plan genocida salvaría la civilización. Esta variante representaba el momento en que Thanos logró el poder definitivo.'
  },
  {
    minifigure_no: 'sh0195',
    name: 'Doctor Strange - Blue Cape, Eye of Agamotto',
    description_en: 'Doctor Strange the Sorcerer Supreme mastered the mystic arts after a career-ending accident. The Eye of Agamotto and blue Cloak of Levitation became his signature mystical artifacts. Stephen\'s analytical mind made him approach magic like medicine. This variant captured Strange as Earth\'s mystical protector against dimensional threats.',
    description_de: 'Doctor Strange der Oberste Zauberer meisterte die mystischen Künste nach einem karrierebeendenden Unfall. Das Auge von Agamotto und der blaue Schwebende Umhang wurden seine charakteristischen mystischen Artefakte. Stephens analytischer Verstand ließ ihn Magie wie Medizin angehen. Diese Variante erfasste Strange als Erdens mystischen Beschützer gegen dimensionale Bedrohungen.',
    description_fr: 'Docteur Strange le Sorcier Suprême maîtrisa les arts mystiques après un accident mettant fin à sa carrière. L\'Œil d\'Agamotto et la Cape de Lévitation bleue devinrent ses artefacts mystiques signature. L\'esprit analytique de Stephen le fit aborder la magie comme la médecine. Cette variante capturait Strange comme protecteur mystique de la Terre contre les menaces dimensionnelles.',
    description_es: 'Doctor Strange el Hechicero Supremo dominó las artes místicas después de un accidente que terminó su carrera. El Ojo de Agamotto y Capa de Levitación azul se convirtieron en sus artefactos místicos característicos. La mente analítica de Stephen lo hizo abordar la magia como medicina. Esta variante capturaba a Strange como protector místico de la Tierra contra amenazas dimensionales.'
  },
  {
    minifigure_no: 'sh0204',
    name: 'Scarlet Witch - Red Outfit, Dark Red Hair',
    description_en: 'Scarlet Witch wielded reality-warping chaos magic with devastating power. Wanda\'s red outfit and dark red hair reflected her mystical energy. Despite tragic losses, Wanda\'s determination to protect others never wavered. This variant showed Scarlet Witch as a powerful Avenger learning to control her abilities.',
    description_de: 'Scarlet Witch führte realitätsverzerrende Chaosmagie mit verheerender Kraft. Wandas rotes Outfit und dunkelrotes Haar spiegelten ihre mystische Energie wider. Trotz tragischer Verluste schwankte Wandas Entschlossenheit, andere zu schützen, nie. Diese Variante zeigte Scarlet Witch als mächtige Avenger, die lernte, ihre Fähigkeiten zu kontrollieren.',
    description_fr: 'Sorcière Rouge maniait la magie du chaos déformant la réalité avec un pouvoir dévastateur. La tenue rouge et les cheveux rouge foncé de Wanda reflétaient son énergie mystique. Malgré des pertes tragiques, la détermination de Wanda à protéger les autres ne faiblit jamais. Cette variante montrait Sorcière Rouge comme une Avenger puissante apprenant à contrôler ses capacités.',
    description_es: 'Bruja Escarlata manejaba magia del caos que deformaba la realidad con poder devastador. El atuendo rojo y cabello rojo oscuro de Wanda reflejaban su energía mística. A pesar de pérdidas trágicas, la determinación de Wanda de proteger a otros nunca flaqueó. Esta variante mostraba a Bruja Escarlata como una Vengadora poderosa aprendiendo a controlar sus habilidades.'
  },
  {
    minifigure_no: 'sh0205',
    name: 'Vision - Mind Stone, Red Cape',
    description_en: 'Vision the synthezoid possessed the Mind Stone embedded in his forehead. His red cape and vibranium-infused body made him unique among the Avengers. Despite being artificial, Vision developed genuine emotions and wisdom. This variant captured Vision as a philosophical being seeking to understand humanity.',
    description_de: 'Vision der Synthezoid besaß den Gedankenstein in seiner Stirn eingebettet. Sein roter Umhang und vibraniumdurchsetzter Körper machten ihn einzigartig unter den Avengers. Trotz künstlicher Natur entwickelte Vision echte Emotionen und Weisheit. Diese Variante erfasste Vision als philosophisches Wesen, das versuchte, die Menschheit zu verstehen.',
    description_fr: 'Vision le synthézoïde possédait la Pierre de l\'Esprit enchâssée dans son front. Sa cape rouge et son corps infusé de vibranium le rendaient unique parmi les Avengers. Malgré son artificialité, Vision développa de vraies émotions et sagesse. Cette variante capturait Vision comme un être philosophique cherchant à comprendre l\'humanité.',
    description_es: 'Visión el sintezoide poseía la Gema de la Mente incrustada en su frente. Su capa roja y cuerpo infundido con vibranium lo hacían único entre los Vengadores. A pesar de ser artificial, Visión desarrolló emociones y sabiduría genuinas. Esta variante capturaba a Visión como un ser filosófico buscando entender la humanidad.'
  },
  {
    minifigure_no: 'sh0234',
    name: 'War Machine - Dark Bluish Gray Armor, Shoulder Cannons',
    description_en: 'War Machine represented James Rhodes as Iron Man\'s military counterpart. His dark gray armor with shoulder-mounted cannons emphasized heavy firepower over sleek design. Rhodey\'s military discipline complemented Tony\'s genius. This variant captured War Machine as the armored soldier fighting alongside the Avengers.',
    description_de: 'War Machine repräsentierte James Rhodes als Iron Mans militärisches Gegenstück. Seine dunkelgraue Rüstung mit schultermontierten Kanonen betonte schwere Feuerkraft über elegantes Design. Rhodeys militärische Disziplin ergänzte Tonys Genie. Diese Variante erfasste War Machine als gepanzerten Soldaten, der an der Seite der Avengers kämpfte.',
    description_fr: 'War Machine représentait James Rhodes comme la contrepartie militaire d\'Iron Man. Son armure gris foncé avec canons montés sur les épaules mettait l\'accent sur la puissance de feu lourde plutôt que le design élégant. La discipline militaire de Rhodey complétait le génie de Tony. Cette variante capturait War Machine comme le soldat blindé combattant aux côtés des Avengers.',
    description_es: 'War Machine representaba a James Rhodes como la contraparte militar de Iron Man. Su armadura gris oscuro con cañones montados en hombros enfatizaba potencia de fuego pesada sobre diseño elegante. La disciplina militar de Rhodey complementaba el genio de Tony. Esta variante capturaba a War Machine como el soldado blindado luchando junto a los Vengadores.'
  },
  {
    minifigure_no: 'sh0246',
    name: 'Falcon - Wings, Red Flight Suit',
    description_en: 'Falcon soared through the sky with his advanced wing pack technology. Sam Wilson\'s red flight suit and military training made him a valuable Avenger. Despite lacking superpowers, Sam\'s courage and tactical skill proved his worth. This variant captured Falcon as the high-flying hero who would eventually carry Captain America\'s legacy.',
    description_de: 'Falcon schwebte durch den Himmel mit seiner fortgeschrittenen Flügelpack-Technologie. Sam Wilsons roter Fluganzug und militärische Ausbildung machten ihn zu einem wertvollen Avenger. Trotz fehlender Superkräfte bewiesen Sams Mut und taktische Fertigkeit seinen Wert. Diese Variante erfasste Falcon als hochfliegenden Helden, der schließlich Captain Americas Vermächtnis tragen würde.',
    description_fr: 'Faucon planait dans le ciel avec sa technologie de pack d\'ailes avancée. Le costume de vol rouge et l\'entraînement militaire de Sam Wilson firent de lui un Avenger précieux. Malgré l\'absence de superpouvoirs, le courage et les compétences tactiques de Sam prouvèrent sa valeur. Cette variante capturait Faucon comme le héros volant haut qui porterait finalement l\'héritage de Captain America.',
    description_es: 'Falcon se elevaba por el cielo con su tecnología avanzada de paquete de alas. El traje de vuelo rojo y entrenamiento militar de Sam Wilson lo convirtieron en un Vengador valioso. A pesar de carecer de superpoderes, el coraje y habilidad táctica de Sam demostraron su valor. Esta variante capturaba a Falcon como el héroe que vuela alto que eventualmente llevaría el legado de Capitán América.'
  },
  {
    minifigure_no: 'sh0248',
    name: 'Winter Soldier - Metal Arm, Tactical Vest',
    description_en: 'Winter Soldier represented Bucky Barnes as a brainwashed assassin. His metal arm and tactical gear made him a formidable opponent. Despite decades of mind control, Bucky\'s friendship with Steve Rogers eventually broke through. This variant captured the Winter Soldier during his transition from weapon to hero.',
    description_de: 'Winter Soldier repräsentierte Bucky Barnes als einer gehirngewaschener Attentäter. Sein Metallarm und taktische Ausrüstung machten ihn zu einem beeindruckenden Gegner. Trotz jahrzehntelanger Gedankenkontrolle durchbrach Buckys Freundschaft mit Steve Rogers schließlich. Diese Variante erfasste den Winter Soldier während seines Übergangs von Waffe zu Held.',
    description_fr: 'Soldat de l\'Hiver représentait Bucky Barnes comme un assassin sous contrôle mental. Son bras métallique et équipement tactique firent de lui un adversaire redoutable. Malgré des décennies de contrôle mental, l\'amitié de Bucky avec Steve Rogers finit par percer. Cette variante capturait le Soldat de l\'Hiver pendant sa transition d\'arme à héros.',
    description_es: 'Soldado de Invierno representaba a Bucky Barnes como un asesino con lavado de cerebro. Su brazo metálico y equipo táctico lo convertían en un oponente formidable. A pesar de décadas de control mental, la amistad de Bucky con Steve Rogers eventualmente atravesó. Esta variante capturaba al Soldado de Invierno durante su transición de arma a héroe.'
  }
];

async function updateDescriptions() {
  console.log(`Starting Marvel minifigure description updates (Batch 2)...`);
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

  console.log(`\n✅ Marvel Batch 2 descriptions update complete!`);
  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
