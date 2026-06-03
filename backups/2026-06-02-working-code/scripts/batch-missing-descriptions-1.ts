import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0098',
    name: 'Luke Skywalker (Hoth)',
    description_en: 'Luke Skywalker wore insulated Hoth gear during the Battle of Hoth defending Echo Base. This variant features his orange pilot suit under winter jacket. Luke nearly died in the freezing wasteland before Han Solo rescued him. His recovery in the medical center was interrupted by the Empire\'s devastating assault.',
    description_de: 'Luke Skywalker trug isolierte Hoth-Ausrüstung während der Schlacht von Hoth zur Verteidigung der Echo-Basis. Diese Variante zeigt seinen orangefarbenen Pilotenanzug unter Winterjacke. Luke wäre fast in der gefrorenen Einöde gestorben, bevor Han Solo ihn rettete. Seine Genesung im medizinischen Zentrum wurde durch den verheerenden Angriff des Imperiums unterbrochen.',
    description_fr: 'Luke Skywalker portait un équipement Hoth isolé pendant la Bataille de Hoth défendant la Base Echo. Cette variante présente sa combinaison de pilote orange sous veste d\'hiver. Luke a failli mourir dans le désert gelé avant que Han Solo ne le sauve. Sa récupération dans le centre médical a été interrompue par l\'assaut dévastateur de l\'Empire.',
    description_es: 'Luke Skywalker usaba equipo aislado de Hoth durante la Batalla de Hoth defendiendo Base Eco. Esta variante presenta su traje de piloto naranja bajo chaqueta de invierno. Luke casi muere en el páramo helado antes de que Han Solo lo rescatara. Su recuperación en el centro médico fue interrumpida por el asalto devastador del Imperio.'
  },
  {
    minifigure_no: 'sw0112',
    name: 'Snowtrooper',
    description_en: 'Imperial Snowtroopers were specialized cold assault troops deployed on Hoth. Their white armor included heating systems and terrain equipment for arctic operations. These elite soldiers led the devastating ground assault on Echo Base. Snowtroopers represented the Empire\'s environment-specific military forces.',
    description_de: 'Imperiale Snowtrooper waren spezialisierte Kälte-Angriffstruppen, die auf Hoth eingesetzt wurden. Ihre weiße Rüstung umfasste Heizsysteme und Geländeausrüstung für arktische Operationen. Diese Elite-Soldaten führten den verheerenden Bodenangriff auf Echo Base an. Snowtrooper repräsentierten die umweltspezifischen Militärkräfte des Imperiums.',
    description_fr: 'Les Snowtroopers Impériaux étaient des troupes d\'assaut par temps froid spécialisées déployées sur Hoth. Leur armure blanche incluait des systèmes de chauffage et équipement de terrain pour opérations arctiques. Ces soldats d\'élite ont mené l\'assaut terrestre dévastateur sur la Base Echo. Les Snowtroopers représentaient les forces militaires spécifiques à l\'environnement de l\'Empire.',
    description_es: 'Los Snowtroopers Imperiales eran tropas de asalto en frío especializadas desplegadas en Hoth. Su armadura blanca incluía sistemas de calefacción y equipo de terreno para operaciones árticas. Estos soldados de élite lideraron el asalto terrestre devastador en Base Eco. Los Snowtroopers representaban las fuerzas militares específicas de entorno del Imperio.'
  },
  {
    minifigure_no: 'sw0119',
    name: 'Astromech Droid, R7-D4',
    description_en: 'R7-D4 was a red and white astromech droid serving Rebel starfighter pilots. These droids provided navigation, repair, and technical support during combat missions. Astromechs were essential companions for X-wing and Y-wing pilots. Their diverse color schemes helped identify different units and squadrons.',
    description_de: 'R7-D4 war ein rot-weißer Astromech-Droide, der Rebellen-Sternjägerpiloten diente. Diese Droiden boten Navigation, Reparatur und technische Unterstützung während Kampfmissionen. Astromechs waren essentielle Begleiter für X-Wing- und Y-Wing-Piloten. Ihre vielfältigen Farbschemata halfen, verschiedene Einheiten und Staffeln zu identifizieren.',
    description_fr: 'R7-D4 était un droïde astromech rouge et blanc servant les pilotes de chasseurs stellaires rebelles. Ces droïdes fournissaient navigation, réparation et support technique pendant les missions de combat. Les astromechs étaient des compagnons essentiels pour les pilotes de X-wing et Y-wing. Leurs schémas de couleurs divers aidaient à identifier différentes unités et escadrons.',
    description_es: 'R7-D4 era un droide astromech rojo y blanco sirviendo a pilotos de cazas estelares rebeldes. Estos droides proporcionaban navegación, reparación y soporte técnico durante misiones de combate. Los astromechs eran compañeros esenciales para pilotos de X-wing y Y-wing. Sus esquemas de color diversos ayudaban a identificar diferentes unidades y escuadrones.'
  },
  {
    minifigure_no: 'sw0185',
    name: 'Bespin Guard',
    description_en: 'Bespin Guards were security forces protecting Cloud City under Lando Calrissian\'s administration. Their blue uniforms and helmets distinguished them from Imperial troops. These guards maintained order in the tibanna gas mining facility. Imperial occupation forced them to assist in capturing Han Solo and friends.',
    description_de: 'Bespin-Wachen waren Sicherheitskräfte, die Cloud City unter Lando Calrissians Verwaltung schützten. Ihre blauen Uniformen und Helme unterschieden sie von imperialen Truppen. Diese Wachen hielten Ordnung in der Tibanna-Gas-Bergbauanlage. Die imperiale Besatzung zwang sie, bei der Gefangennahme von Han Solo und Freunden zu helfen.',
    description_fr: 'Les Gardes Bespin étaient des forces de sécurité protégeant la Cité des Nuages sous l\'administration de Lando Calrissian. Leurs uniformes bleus et casques les distinguaient des troupes impériales. Ces gardes maintenaient l\'ordre dans l\'installation minière de gaz tibanna. L\'occupation impériale les a forcés à aider à capturer Han Solo et ses amis.',
    description_es: 'Los Guardias Bespin eran fuerzas de seguridad protegiendo Ciudad Nube bajo la administración de Lando Calrissian. Sus uniformes azules y cascos los distinguían de tropas imperiales. Estos guardias mantenían orden en la instalación minera de gas tibanna. La ocupación imperial los obligó a ayudar en capturar a Han Solo y amigos.'
  },
  {
    minifigure_no: 'sw0186',
    name: 'Dengar',
    description_en: 'Dengar was a dangerous bounty hunter hired by Darth Vader to track the Millennium Falcon. His wrapped head bandages concealed cybernetic implants from injuries. Dengar competed with Boba Fett and other hunters for Imperial bounties. His ruthless reputation made him feared across the galaxy.',
    description_de: 'Dengar war ein gefährlicher Kopfgeldjäger, der von Darth Vader angeheuert wurde, um den Millennium Falcon zu verfolgen. Seine gewickelten Kopfbandagen verbargen kybernetische Implantate von Verletzungen. Dengar konkurrierte mit Boba Fett und anderen Jägern um imperiale Kopfgelder. Sein rücksichtsloser Ruf machte ihn in der ganzen Galaxis gefürchtet.',
    description_fr: 'Dengar était un chasseur de primes dangereux engagé par Dark Vador pour traquer le Faucon Millenium. Ses bandages de tête enroulés cachaient des implants cybernétiques de blessures. Dengar était en compétition avec Boba Fett et d\'autres chasseurs pour les primes impériales. Sa réputation impitoyable le rendait craint dans toute la galaxie.',
    description_es: 'Dengar era un peligroso cazarrecompensas contratado por Darth Vader para rastrear el Halcón Milenario. Sus vendajes de cabeza envueltos ocultaban implantes cibernéticos de lesiones. Dengar competía con Boba Fett y otros cazadores por recompensas imperiales. Su reputación despiadada lo hacía temido por toda la galaxia.'
  },
  {
    minifigure_no: 'sw0216',
    name: 'EV-A4-D without Sticker',
    description_en: 'EV-A4-D was a medical droid working in Cloud City\'s medical facilities. This variant appears without stickers showing the base droid design. Medical droids like EV-A4-D treated injuries and performed surgical procedures. These droids represented essential medical technology throughout the galaxy.',
    description_de: 'EV-A4-D war ein Medizin-Droide, der in Cloud Citys medizinischen Einrichtungen arbeitete. Diese Variante erscheint ohne Aufkleber und zeigt das Basis-Droiden-Design. Medizinische Droiden wie EV-A4-D behandelten Verletzungen und führten chirurgische Eingriffe durch. Diese Droiden repräsentierten essentielle medizinische Technologie in der ganzen Galaxis.',
    description_fr: 'EV-A4-D était un droïde médical travaillant dans les installations médicales de la Cité des Nuages. Cette variante apparaît sans autocollants montrant le design de base du droïde. Les droïdes médicaux comme EV-A4-D traitaient les blessures et effectuaient des procédures chirurgicales. Ces droïdes représentaient une technologie médicale essentielle dans toute la galaxie.',
    description_es: 'EV-A4-D era un droide médico trabajando en instalaciones médicas de Ciudad Nube. Esta variante aparece sin calcomanías mostrando el diseño base del droide. Los droides médicos como EV-A4-D trataban lesiones y realizaban procedimientos quirúrgicos. Estos droides representaban tecnología médica esencial por toda la galaxia.'
  },
  {
    minifigure_no: 'sw0226',
    name: 'Nahdar Vebb',
    description_en: 'Nahdar Vebb was a Mon Calamari Jedi Knight trained by Kit Fisto during the Clone Wars. His aquatic species gave him advantages in water environments. Vebb tracked General Grievous to his lair but was killed by the cyborg general. His death demonstrated Grievous\'s deadly combat prowess.',
    description_de: 'Nahdar Vebb war ein Mon-Calamari-Jedi-Ritter, der während der Klonkriege von Kit Fisto trainiert wurde. Seine aquatische Spezies gab ihm Vorteile in Wasserumgebungen. Vebb verfolgte General Grievous zu seinem Versteck, wurde aber vom Cyborg-General getötet. Sein Tod demonstrierte Grievous\' tödliche Kampffähigkeiten.',
    description_fr: 'Nahdar Vebb était un Chevalier Jedi Mon Calamari formé par Kit Fisto pendant les Guerres des Clones. Son espèce aquatique lui donnait des avantages dans les environnements aquatiques. Vebb a traqué le Général Grievous jusqu\'à son repaire mais a été tué par le général cyborg. Sa mort a démontré la redoutable prouesse au combat de Grievous.',
    description_es: 'Nahdar Vebb era un Caballero Jedi Mon Calamari entrenado por Kit Fisto durante las Guerras Clon. Su especie acuática le daba ventajas en entornos acuáticos. Vebb rastreó al General Grievous hasta su guarida pero fue asesinado por el general cyborg. Su muerte demostró la mortal destreza en combate de Grievous.'
  },
  {
    minifigure_no: 'sw0227',
    name: 'Rocket Battle Droid Commander',
    description_en: 'Rocket Battle Droid Commanders led Separatist droid forces with enhanced mobility through jetpack systems. These commanders coordinated tactical operations on the battlefield. The rocket pack allowed aerial assault capabilities. Enhanced droids represented the Separatists\' technological military advantages.',
    description_de: 'Raketen-Kampfdroiden-Kommandanten führten Separatisten-Droiden-Streitkräfte mit verbesserter Mobilität durch Jetpack-Systeme an. Diese Kommandanten koordinierten taktische Operationen auf dem Schlachtfeld. Das Raketenpaket ermöglichte Luftangriffsfähigkeiten. Verbesserte Droiden repräsentierten die technologischen militärischen Vorteile der Separatisten.',
    description_fr: 'Les Commandants de Droïdes de Combat à Roquettes dirigeaient les forces droïdes séparatistes avec une mobilité améliorée grâce à des systèmes de jetpack. Ces commandants coordonnaient les opérations tactiques sur le champ de bataille. Le pack de fusée permettait des capacités d\'assaut aérien. Les droïdes améliorés représentaient les avantages militaires technologiques des Séparatistes.',
    description_es: 'Los Comandantes de Droides de Batalla con Cohetes lideraban fuerzas de droides separatistas con movilidad mejorada mediante sistemas de jet pack. Estos comandantes coordinaban operaciones tácticas en el campo de batalla. El paquete de cohete permitía capacidades de asalto aéreo. Los droides mejorados representaban las ventajas militares tecnológicas de los Separatistas.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for missing descriptions (part 1)...');

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

  console.log('Batch complete! 8 minifigs saved.');
  await prisma.$disconnect();
}

saveBatch();
