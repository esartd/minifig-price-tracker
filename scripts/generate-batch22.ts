import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0097',
    name: 'Mon Mothma',
    description_en: 'Mon Mothma led the Rebel Alliance as its Supreme Commander, orchestrating the strategy that defeated the Empire. This minifigure features Mon Mothma\'s white senatorial robes, distinguished appearance, regal bearing, and calm leadership presence. Released in 2009, she represents the Rebellion\'s political and military leadership. Collectors value Mon Mothma for briefing the fleet before Endor and her pivotal role founding the New Republic. Her dignified courage inspired countless worlds to join the fight. Essential for Rebel command centers, Home One briefing rooms, and Alliance leadership displays.',
    description_de: 'Mon Mothma führte die Rebellenallianz als Oberbefehlshaberin und orchestrierte die Strategie, die das Imperium besiegte. Diese Minifigur zeigt Mon Mothmas weiße Senatsroben, distinguiertes Aussehen, königliche Haltung und ruhige Führungspräsenz. 2009 veröffentlicht, repräsentiert sie die politische und militärische Führung der Rebellion. Sammler schätzen Mon Mothma für das Briefing der Flotte vor Endor und ihre entscheidende Rolle bei der Gründung der Neuen Republik. Ihr würdevoller Mut inspirierte unzählige Welten, sich dem Kampf anzuschließen. Unverzichtbar für Rebellen-Kommandozentralen, Home-One-Briefingräume und Allianz-Führungs-Displays.',
    description_fr: 'Mon Mothma dirigeait l\'Alliance Rebelle en tant que Commandante Suprême, orchestrant la stratégie qui a vaincu l\'Empire. Cette minifigurine présente les robes sénatoriales blanches de Mon Mothma, une apparence distinguée, un maintien royal et une présence de leadership calme. Sortie en 2009, elle représente le leadership politique et militaire de la Rébellion. Les collectionneurs apprécient Mon Mothma pour avoir briefé la flotte avant Endor et son rôle pivot dans la fondation de la Nouvelle République. Son courage digne a inspiré d\'innombrables mondes à rejoindre le combat. Essentielle pour les centres de commandement Rebelles, les salles de briefing de Home One et les expositions de leadership de l\'Alliance.',
    description_es: 'Mon Mothma lideró la Alianza Rebelde como su Comandante Suprema, orquestando la estrategia que derrotó al Imperio. Esta minifigura presenta las túnicas senatoriales blancas de Mon Mothma, apariencia distinguida, porte regio y presencia de liderazgo calmada. Lanzada en 2009, representa el liderazgo político y militar de la Rebelión. Los coleccionistas valoran a Mon Mothma por informar a la flota antes de Endor y su papel fundamental fundando la Nueva República. Su digno coraje inspiró a incontables mundos a unirse a la lucha. Esencial para centros de comando Rebeldes, salas de briefing de Home One y exhibiciones de liderazgo de la Alianza.'
  },
  {
    minifigure_no: 'sw0098',
    name: 'Admiral Ackbar',
    description_en: 'Admiral Ackbar commanded the Rebel fleet at Endor and became famous for recognizing the Imperial trap. This minifigure features Ackbar\'s distinctive Mon Calamari salmon-colored head with large eyes, white admiral uniform with rank insignia, and tactical expertise. Released in 2009, his "It\'s a trap!" line became iconic. Collectors highly prize Ackbar for his military genius and leadership of Home One. His species\' contribution of star cruisers proved crucial to Rebellion survival. Essential for Mon Calamari cruiser bridges, Endor battle command scenes, and strategic planning displays.',
    description_de: 'Admiral Ackbar kommandierte die Rebellenflotte bei Endor und wurde berühmt dafür, die imperiale Falle zu erkennen. Diese Minifigur zeigt Ackbars charakteristischen Mon-Calamari-lachsfarbenen Kopf mit großen Augen, weiße Admiralsuniform mit Rangabzeichen und taktische Expertise. 2009 veröffentlicht, wurde seine "Es ist eine Falle!"-Zeile ikonisch. Sammler schätzen Ackbar sehr für sein militärisches Genie und die Führung von Home One. Der Beitrag seiner Spezies mit Sternenkreuzern erwies sich als entscheidend für das Überleben der Rebellion. Unverzichtbar für Mon-Calamari-Kreuzer-Brücken, Endor-Schlacht-Kommando-Szenen und strategische Planungs-Displays.',
    description_fr: 'L\'Amiral Ackbar commandait la flotte Rebelle à Endor et est devenu célèbre pour avoir reconnu le piège Impérial. Cette minifigurine présente la tête Mon Calamari saumon distinctive d\'Ackbar avec de grands yeux, un uniforme d\'amiral blanc avec insignes de rang et une expertise tactique. Sortie en 2009, sa ligne "C\'est un piège!" est devenue emblématique. Les collectionneurs apprécient grandement Ackbar pour son génie militaire et son leadership de Home One. La contribution de son espèce en croiseurs stellaires s\'est avérée cruciale pour la survie de la Rébellion. Essentiel pour les ponts de croiseurs Mon Calamari, les scènes de commandement de bataille d\'Endor et les expositions de planification stratégique.',
    description_es: 'El Almirante Ackbar comandó la flota Rebelde en Endor y se hizo famoso por reconocer la trampa Imperial. Esta minifigura presenta la distintiva cabeza Mon Calamari color salmón de Ackbar con ojos grandes, uniforme blanco de almirante con insignias de rango y experiencia táctica. Lanzado en 2009, su línea "¡Es una trampa!" se volvió icónica. Los coleccionistas valoran mucho a Ackbar por su genio militar y liderazgo de Home One. La contribución de su especie de cruceros estelares resultó crucial para la supervivencia de la Rebelión. Esencial para puentes de cruceros Mon Calamari, escenas de comando de batalla de Endor y exhibiciones de planificación estratégica.'
  },
  {
    minifigure_no: 'sw0099',
    name: 'Lando Calrissian (General)',
    description_en: 'Lando Calrissian redeemed himself as a Rebel general, leading the attack that destroyed the second Death Star. This minifigure features Lando in tan general\'s uniform with rank insignia, confident smile, and heroic bearing. Released in 2000, this captures Billy Dee Williams at his most heroic moment. Collectors value General Lando for piloting the Millennium Falcon into the Death Star\'s core and firing the shot that saved the galaxy. His journey from scoundrel to hero completed his arc. Essential for Millennium Falcon cockpit, Endor space battle, and Death Star destruction recreations.',
    description_de: 'Lando Calrissian erlöste sich als Rebellengeneral und führte den Angriff an, der den zweiten Todesstern zerstörte. Diese Minifigur zeigt Lando in beiger Generalsuniform mit Rangabzeichen, selbstbewusstem Lächeln und heroischer Haltung. 2000 veröffentlicht, erfasst dies Billy Dee Williams in seinem heroischsten Moment. Sammler schätzen General Lando dafür, den Millennium Falken in den Kern des Todessterns zu steuern und den Schuss abzugeben, der die Galaxis rettete. Seine Reise vom Gauner zum Helden vollendete seinen Bogen. Unverzichtbar für Millennium-Falken-Cockpit, Endor-Weltraumschlacht und Todesstern-Zerstörungs-Nachstellungen.',
    description_fr: 'Lando Calrissian s\'est racheté en tant que général Rebelle, dirigeant l\'attaque qui a détruit la seconde Étoile de la Mort. Cette minifigurine présente Lando en uniforme de général beige avec insignes de rang, sourire confiant et maintien héroïque. Sortie en 2000, cela capture Billy Dee Williams à son moment le plus héroïque. Les collectionneurs apprécient le Général Lando pour avoir piloté le Faucon Millenium dans le cœur de l\'Étoile de la Mort et tiré le coup qui a sauvé la galaxie. Son voyage de voyou à héros a complété son arc. Essentiel pour le cockpit du Faucon Millenium, la bataille spatiale d\'Endor et les recréations de destruction de l\'Étoile de la Mort.',
    description_es: 'Lando Calrissian se redimió como general Rebelde, liderando el ataque que destruyó la segunda Estrella de la Muerte. Esta minifigura presenta a Lando con uniforme de general beige con insignias de rango, sonrisa confiada y porte heroico. Lanzado en 2000, esto captura a Billy Dee Williams en su momento más heroico. Los coleccionistas valoran al General Lando por pilotar el Halcón Milenario al núcleo de la Estrella de la Muerte y disparar el tiro que salvó la galaxia. Su viaje de bribón a héroe completó su arco. Esencial para cabina del Halcón Milenario, batalla espacial de Endor y recreaciones de destrucción de la Estrella de la Muerte.'
  },
  {
    minifigure_no: 'sw0100',
    name: 'Nien Nunb',
    description_en: 'Nien Nunb co-piloted the Millennium Falcon with Lando during the Battle of Endor, helping destroy the Death Star. This minifigure features Nien\'s distinctive Sullustan face with large jowls, small eyes, Rebel flight suit, and capable demeanor. Released in 2015, he represents the diverse species fighting for freedom. Collectors appreciate Nien Nunb for his steady piloting and crucial role in the Falcon\'s trench run. His species\' navigational expertise made him invaluable. Essential for Millennium Falcon cockpit displays showing the two-pilot configuration during Endor.',
    description_de: 'Nien Nunb war Co-Pilot des Millennium Falken mit Lando während der Schlacht um Endor und half, den Todesstern zu zerstören. Diese Minifigur zeigt Niens charakteristisches sullustanisches Gesicht mit großen Wangen, kleinen Augen, Rebellen-Fluganzug und fähigem Auftreten. 2015 veröffentlicht, repräsentiert er die vielfältigen Spezies, die für Freiheit kämpfen. Sammler schätzen Nien Nunb für sein stetiges Fliegen und seine entscheidende Rolle im Schlucht-Lauf des Falken. Die Navigationsexpertise seiner Spezies machte ihn unschätzbar. Unverzichtbar für Millennium-Falken-Cockpit-Displays, die die Zwei-Piloten-Konfiguration während Endor zeigen.',
    description_fr: 'Nien Nunb était copilote du Faucon Millenium avec Lando pendant la Bataille d\'Endor, aidant à détruire l\'Étoile de la Mort. Cette minifigurine présente le visage Sullustan distinctif de Nien avec de grandes bajoues, de petits yeux, une combinaison de vol Rebelle et un comportement compétent. Sortie en 2015, il représente les diverses espèces luttant pour la liberté. Les collectionneurs apprécient Nien Nunb pour son pilotage stable et son rôle crucial dans la course dans la tranchée du Faucon. L\'expertise en navigation de son espèce l\'a rendu inestimable. Essentiel pour les expositions de cockpit du Faucon Millenium montrant la configuration à deux pilotes pendant Endor.',
    description_es: 'Nien Nunb copilotó el Halcón Milenario con Lando durante la Batalla de Endor, ayudando a destruir la Estrella de la Muerte. Esta minifigura presenta el distintivo rostro Sullustano de Nien con grandes papadas, ojos pequeños, traje de vuelo Rebelde y comportamiento capaz. Lanzado en 2015, representa a las diversas especies luchando por la libertad. Los coleccionistas aprecian a Nien Nunb por su pilotaje constante y papel crucial en la carrera de trinchera del Halcón. La experiencia de navegación de su especie lo hizo invaluable. Esencial para exhibiciones de cabina del Halcón Milenario mostrando la configuración de dos pilotos durante Endor.'
  },
  {
    minifigure_no: 'sw0101',
    name: 'B-Wing Pilot',
    description_en: 'B-Wing Pilots flew the Rebellion\'s heavy assault starfighters, designed to crack Imperial capital ships. This minifigure features the orange flight suit with Rebel insignia, specialized helmet, and combat-ready appearance. Released in 2012, B-Wing pilots represented elite strike capability. Collectors value these pilots for flying the unusual gyroscopic fighters at Endor. The B-Wing\'s devastating firepower complemented faster X-Wings and A-Wings. Essential for Rebel fleet diversity, Home One hangar bays, and Endor space battle scenes showcasing mixed fighter squadrons.',
    description_de: 'B-Flügelpiloten flogen die schweren Angriffs-Sternenjäger der Rebellion, entworfen um imperiale Großkampfschiffe zu knacken. Diese Minifigur zeigt den orangefarbenen Fluganzug mit Rebellenabzeichen, spezialisierten Helm und kampfbereites Aussehen. 2012 veröffentlicht, repräsentierten B-Flügelpiloten Elite-Angriffsfähigkeit. Sammler schätzen diese Piloten fürs Fliegen der ungewöhnlichen gyroskopischen Jäger bei Endor. Die verheerende Feuerkraft des B-Flügels ergänzte schnellere X-Flügel und A-Flügel. Unverzichtbar für Rebellenflotten-Diversität, Home-One-Hangarbuchten und Endor-Weltraumschlacht-Szenen, die gemischte Jägerstaffeln zeigen.',
    description_fr: 'Les Pilotes de B-Wing pilotaient les chasseurs stellaires d\'assaut lourds de la Rébellion, conçus pour percer les vaisseaux capitaux Impériaux. Cette minifigurine présente la combinaison de vol orange avec insigne Rebelle, un casque spécialisé et une apparence prête au combat. Sortis en 2012, les pilotes de B-Wing représentaient une capacité de frappe d\'élite. Les collectionneurs apprécient ces pilotes pour piloter les chasseurs gyroscopiques inhabituels à Endor. La puissance de feu dévastatrice du B-Wing complétait les X-Wings et A-Wings plus rapides. Essentiels pour la diversité de la flotte Rebelle, les baies de hangars de Home One et les scènes de bataille spatiale d\'Endor présentant des escadrons de chasseurs mixtes.',
    description_es: 'Los Pilotos de Ala-B volaron los cazas estelares de asalto pesado de la Rebelión, diseñados para agrietar naves capitales Imperiales. Esta minifigura presenta el traje de vuelo naranja con insignia Rebelde, casco especializado y apariencia lista para combate. Lanzados en 2012, los pilotos de Ala-B representaron capacidad de ataque de élite. Los coleccionistas valoran estos pilotos por volar los inusuales cazas giroscópicos en Endor. El devastador poder de fuego del Ala-B complementó Alas-X y Alas-A más rápidos. Esenciales para diversidad de flota Rebelde, bahías de hangar de Home One y escenas de batalla espacial de Endor mostrando escuadrones de cazas mixtos.'
  }
];

async function save() {
  console.log('💾 Batch 22 (sw0097-sw0101)...\n');
  for (const m of batch) {
    await prisma.minifigCatalog.upsert({
      where: { minifigure_no: m.minifigure_no },
      update: {
        description_en: m.description_en,
        description_de: m.description_de,
        description_fr: m.description_fr,
        description_es: m.description_es,
        description_generated_at: new Date(),
        description_status: 'generated'
      },
      create: {
        minifigure_no: m.minifigure_no,
        name: m.name,
        category_id: 1,
        category_name: 'Star Wars',
        search_name: m.name.toLowerCase(),
        description_en: m.description_en,
        description_de: m.description_de,
        description_fr: m.description_fr,
        description_es: m.description_es,
        description_generated_at: new Date(),
        description_status: 'generated'
      }
    });
    console.log(`  ✅ ${m.minifigure_no}`);
  }
  console.log('\n✨ 100 total (400 descriptions)\n');
  await prisma.$disconnect();
}

save().catch(console.error);
