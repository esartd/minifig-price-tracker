import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0668',
    name: 'Resistance Soldier, Female',
    description_en: 'Female Resistance Soldiers served as ground troops defending freedom against First Order tyranny. These soldiers represented the diverse volunteers joining the Resistance cause. They participated in base defense, reconnaissance missions, and ground assaults. Collectors value female soldier figures for building diverse Resistance infantry displays.',
    description_de: 'Weibliche Widerstands-Soldaten dienten als Bodentruppen zur Verteidigung der Freiheit gegen Erste-Ordnung-Tyrannei. Diese Soldaten repräsentierten die vielfältigen Freiwilligen, die sich der Widerstands-Sache anschlossen. Sie nahmen an Basisverteidigung, Aufklärungsmissionen und Bodenangriffen teil. Sammler schätzen weibliche Soldatenfiguren für den Aufbau vielfältiger Widerstands-Infanterie-Displays.',
    description_fr: 'Les Soldats Féminins de la Résistance servaient comme troupes au sol défendant la liberté contre la tyrannie du Premier Ordre. Ces soldats représentaient les divers volontaires rejoignant la cause de la Résistance. Ils participaient à la défense de base, aux missions de reconnaissance et aux assauts terrestres. Les collectionneurs apprécient les figurines de soldats féminins pour construire des displays d\'infanterie de Résistance divers.',
    description_es: 'Las Soldados Femeninas de la Resistencia servían como tropas terrestres defendiendo la libertad contra la tiranía de la Primera Orden. Estas soldados representaban a los diversos voluntarios uniéndose a la causa de la Resistencia. Participaban en defensa de base, misiones de reconocimiento y asaltos terrestres. Los coleccionistas valoran figuras de soldados femeninas para construir exhibiciones diversas de infantería de la Resistencia.'
  },
  {
    minifigure_no: 'sw0669',
    name: 'Resistance Soldier, Male',
    description_en: 'Male Resistance Soldiers formed infantry units fighting the First Order across the galaxy. These generic troops allowed collectors to build diverse squadron rosters. They defended Resistance bases and participated in ground operations. Standard soldiers represented everyday heroes standing against tyranny.',
    description_de: 'Männliche Widerstands-Soldaten bildeten Infanterie-Einheiten, die die Erste Ordnung in der ganzen Galaxis bekämpften. Diese generischen Truppen ermöglichten es Sammlern, vielfältige Staffellisten aufzubauen. Sie verteidigten Widerstands-Basen und nahmen an Bodenoperationen teil. Standard-Soldaten repräsentierten alltägliche Helden, die gegen Tyrannei standen.',
    description_fr: 'Les Soldats Masculins de la Résistance formaient des unités d\'infanterie combattant le Premier Ordre à travers la galaxie. Ces troupes génériques permettaient aux collectionneurs de construire des listes d\'escadrons diverses. Ils défendaient les bases de la Résistance et participaient aux opérations terrestres. Les soldats standard représentaient des héros quotidiens luttant contre la tyrannie.',
    description_es: 'Los Soldados Masculinos de la Resistencia formaban unidades de infantería luchando contra la Primera Orden a través de la galaxia. Estas tropas genéricas permitían a coleccionistas construir listas diversas de escuadrones. Defendían bases de la Resistencia y participaban en operaciones terrestres. Los soldados estándar representaban héroes cotidianos enfrentando la tiranía.'
  },
  {
    minifigure_no: 'sw0670',
    name: 'First Order Officer (Lieutenant / Captain) - Male',
    description_en: 'Male First Order Officers commanded vessels and troops with rank insignia on black uniforms. Mid-level officers managed daily operations aboard Star Destroyers. They coordinated crew activities and tactical decisions. The black uniform with rank plaques identified command personnel.',
    description_de: 'Männliche Erste-Ordnung-Offiziere befehligten Schiffe und Truppen mit Rangabzeichen auf schwarzen Uniformen. Mittlere Offiziere verwalteten tägliche Operationen an Bord von Sternenzerstörern. Sie koordinierten Besatzungsaktivitäten und taktische Entscheidungen. Die schwarze Uniform mit Rangplaketten identifizierte Befehlspersonal.',
    description_fr: 'Les Officiers Masculins du Premier Ordre commandaient des vaisseaux et des troupes avec des insignes de rang sur des uniformes noirs. Les officiers de niveau intermédiaire géraient les opérations quotidiennes à bord des Destroyers Stellaires. Ils coordonnaient les activités de l\'équipage et les décisions tactiques. L\'uniforme noir avec plaques de rang identifiait le personnel de commandement.',
    description_es: 'Los Oficiales Masculinos de la Primera Orden comandaban naves y tropas con insignias de rango en uniformes negros. Los oficiales de nivel medio gestionaban operaciones diarias a bordo de Destructores Estelares. Coordinaban actividades de tripulación y decisiones tácticas. El uniforme negro con placas de rango identificaba personal de comando.'
  },
  {
    minifigure_no: 'sw0671',
    name: 'First Order Crew Member (Fleet Engineer / Gunner) - Light Nougat Head',
    description_en: 'This crew variant with light nougat head represents technical specialists manning First Order warships. Fleet engineers maintained weapons systems and spacecraft. Gunners operated turbolaser batteries during combat. The black uniform with red trim distinguished naval crew from army personnel.',
    description_de: 'Diese Crew-Variante mit hellem Nougat-Kopf repräsentiert technische Spezialisten, die Erste-Ordnung-Kriegsschiffe bemannen. Flotteningenieure warteten Waffensysteme und Raumschiffe. Kanoniere operierten Turbolaser-Batterien während des Kampfes. Die schwarze Uniform mit rotem Besatz unterschied Marinebesatzung von Armeepersonal.',
    description_fr: 'Cette variante d\'équipage avec tête nougat clair représente les spécialistes techniques opérant les vaisseaux de guerre du Premier Ordre. Les ingénieurs de flotte maintenaient les systèmes d\'armes et les vaisseaux spatiaux. Les artilleurs opéraient les batteries de turbolasers pendant le combat. L\'uniforme noir avec garniture rouge distinguait l\'équipage naval du personnel de l\'armée.',
    description_es: 'Esta variante de tripulación con cabeza beige claro representa especialistas técnicos operando naves de guerra de la Primera Orden. Los ingenieros de flota mantenían sistemas de armas y naves espaciales. Los artilleros operaban baterías de turboláser durante combate. El uniforme negro con ribete rojo distinguía a la tripulación naval del personal del ejército.'
  },
  {
    minifigure_no: 'sw0672',
    name: 'First Order TIE Fighter Pilot - Two White Lines on Helmet',
    description_en: 'First Order TIE pilots flew advanced TIE/fo fighters with updated systems. This variant shows two white lines on the helmet marking squadron designation. Elite pilots underwent intensive training in combat tactics. Their black flight suits contained essential life support for TIE operations.',
    description_de: 'Erste-Ordnung-TIE-Piloten flogen fortschrittliche TIE/fo-Jäger mit aktualisierten Systemen. Diese Variante zeigt zwei weiße Linien auf dem Helm, die Staffelbezeichnung markieren. Elite-Piloten durchliefen intensives Training in Kampftaktiken. Ihre schwarzen Fluganzüge enthielten wesentliche Lebenserhaltung für TIE-Operationen.',
    description_fr: 'Les pilotes TIE du Premier Ordre pilotaient des chasseurs TIE/fo avancés avec des systèmes mis à jour. Cette variante montre deux lignes blanches sur le casque marquant la désignation d\'escadron. Les pilotes d\'élite suivaient un entraînement intensif en tactiques de combat. Leurs combinaisons de vol noires contenaient un support vital essentiel pour les opérations TIE.',
    description_es: 'Los pilotos TIE de la Primera Orden volaban cazas TIE/fo avanzados con sistemas actualizados. Esta variante muestra dos líneas blancas en el casco marcando designación de escuadrón. Los pilotos de élite se sometían a entrenamiento intensivo en tácticas de combate. Sus trajes de vuelo negros contenían soporte vital esencial para operaciones TIE.'
  },
  {
    minifigure_no: 'sw0673',
    name: 'Kanjiklub Gang Member (Crokind Shand)',
    description_en: 'Kanjiklub was a criminal gang from the Nar Kanji system that confronted Han Solo over unpaid debts. Crokind Shand represented the gang\'s enforcers wearing distinctive armor. The gang specialized in protection rackets and smuggling operations. Their clash with Han aboard his freighter created dangerous complications.',
    description_de: 'Kanjiklub war eine kriminelle Bande aus dem Nar-Kanji-System, die Han Solo wegen unbezahlter Schulden konfrontierte. Crokind Shand repräsentierte die Vollstrecker der Bande mit markanter Rüstung. Die Bande spezialisierte sich auf Schutzgelderpressung und Schmuggeloperationen. Ihre Auseinandersetzung mit Han an Bord seines Frachters schuf gefährliche Komplikationen.',
    description_fr: 'Kanjiklub était un gang criminel du système Nar Kanji qui a confronté Han Solo pour des dettes impayées. Crokind Shand représentait les exécuteurs du gang portant une armure distinctive. Le gang se spécialisait dans les rackets de protection et les opérations de contrebande. Leur affrontement avec Han à bord de son cargo a créé des complications dangereuses.',
    description_es: 'Kanjiklub era una pandilla criminal del sistema Nar Kanji que confrontó a Han Solo por deudas impagadas. Crokind Shand representaba a los ejecutores de la pandilla usando armadura distintiva. La pandilla se especializaba en extorsión y operaciones de contrabando. Su enfrentamiento con Han a bordo de su carguero creó complicaciones peligrosas.'
  },
  {
    minifigure_no: 'sw0674',
    name: 'Tasu Leech',
    description_en: 'Tasu Leech led the Kanjiklub gang demanding Han Solo repay smuggling debts. This named character wore distinctive gang leader armor. His crew operated throughout the Outer Rim territories. Gang leaders like Leech filled power vacuums where galactic law was absent.',
    description_de: 'Tasu Leech führte die Kanjiklub-Bande an und forderte Han Solo auf, Schmuggelschulden zurückzuzahlen. Dieser benannte Charakter trug markante Bandenführer-Rüstung. Seine Crew operierte in den Äußeren-Rand-Territorien. Bandenführer wie Leech füllten Machtvakua, wo galaktisches Gesetz abwesend war.',
    description_fr: 'Tasu Leech dirigeait le gang Kanjiklub exigeant que Han Solo rembourse des dettes de contrebande. Ce personnage nommé portait une armure de chef de gang distinctive. Son équipage opérait dans les territoires de la Bordure Extérieure. Les chefs de gang comme Leech remplissaient les vides de pouvoir où la loi galactique était absente.',
    description_es: 'Tasu Leech lideraba la pandilla Kanjiklub exigiendo que Han Solo pagara deudas de contrabando. Este personaje nombrado usaba armadura distintiva de líder de pandilla. Su tripulación operaba por territorios del Borde Exterior. Los líderes de pandillas como Leech llenaban vacíos de poder donde la ley galáctica estaba ausente.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0668-sw0674...');

  for (const minifig of batch) {
    try {
      await prisma.minifigCatalog.update({
        where: { minifigure_no: minifig.minifigure_no },
        data: {
          description_en: minifig.description_en,
          description_de: minifig.description_de,
          description_fr: minifig.description_fr,
          description_es: minifig.description_es,
          description_generated_at: new Date(),
          description_status: 'generated'
        },
      });
      console.log(`✓ Saved ${minifig.minifigure_no}: ${minifig.name}`);
    } catch (error) {
      console.error(`✗ Error saving ${minifig.minifigure_no}:`, error);
    }
  }

  console.log('Batch complete! 7 minifigs saved.');
  await prisma.$disconnect();
}

saveBatch();
