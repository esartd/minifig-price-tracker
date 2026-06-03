import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0730',
    name: 'Wedge Antilles - Printed Legs',
    description_en: 'Wedge Antilles survived both Death Star assaults becoming one of the Rebellion\'s greatest pilots. This variant with printed legs showed detailed flight suit design. Wedge\'s skill and leadership made him Rogue Squadron\'s commander after Luke. His survival record and tactical brilliance earned legendary status among Rebel pilots.',
    description_de: 'Wedge Antilles überlebte beide Todesstern-Angriffe und wurde einer der größten Piloten der Rebellion. Diese Variante mit bedruckten Beinen zeigte detailliertes Fluganzug-Design. Wedges Fähigkeit und Führung machten ihn nach Luke zum Kommandanten der Rogue Squadron. Seine Überlebensrate und taktische Brillanz erlangten legendären Status unter Rebellen-Piloten.',
    description_fr: 'Wedge Antilles survécut aux deux assauts de l\'Étoile de la Mort devenant l\'un des plus grands pilotes de la Rébellion. Cette variante avec jambes imprimées montrait conception détaillée de combinaison de vol. La compétence et leadership de Wedge en firent commandant de l\'Escadron Rogue après Luke. Son record de survie et génie tactique gagnèrent statut légendaire parmi pilotes rebelles.',
    description_es: 'Wedge Antilles sobrevivió ambos asaltos a la Estrella de la Muerte convirtiéndose en uno de los mejores pilotos de la Rebelión. Esta variante con piernas impresas mostraba diseño detallado de traje de vuelo. La habilidad y liderazgo de Wedge lo convirtieron en comandante de Escuadrón Rogue tras Luke. Su récord de supervivencia y brillantez táctica ganaron estatus legendario entre pilotos rebeldes.'
  },
  {
    minifigure_no: 'sw0731',
    name: 'Luke Skywalker (Hoth, Face with Scars)',
    description_en: 'Luke Skywalker bore facial scars from his wampa attack on Hoth, marking a turning point in his journey. This variant captured Luke\'s appearance recovering in the medical center. The scars symbolized his growth from farm boy to hardened warrior. Luke\'s survival and recovery showed his increasing connection to the Force.',
    description_de: 'Luke Skywalker trug Gesichtsnarben von seinem Wampa-Angriff auf Hoth, die einen Wendepunkt in seiner Reise markierten. Diese Variante erfasste Lukes Erscheinungsbild bei der Genesung im medizinischen Zentrum. Die Narben symbolisierten sein Wachstum vom Farmjungen zum verhärteten Krieger. Lukes Überleben und Genesung zeigten seine zunehmende Verbindung zur Macht.',
    description_fr: 'Luke Skywalker portait cicatrices faciales de son attaque de wampa sur Hoth, marquant un tournant dans son voyage. Cette variante capturait l\'apparence de Luke récupérant au centre médical. Les cicatrices symbolisaient sa croissance de garçon de ferme à guerrier endurci. La survie et récupération de Luke montraient sa connexion croissante à la Force.',
    description_es: 'Luke Skywalker llevaba cicatrices faciales de su ataque de wampa en Hoth, marcando punto de inflexión en su viaje. Esta variante capturaba apariencia de Luke recuperándose en centro médico. Las cicatrices simbolizaban su crecimiento de chico de granja a guerrero endurecido. La supervivencia y recuperación de Luke mostraban su conexión creciente con la Fuerza.'
  },
  {
    minifigure_no: 'sw0734',
    name: 'Hoth Rebel Trooper White Uniform (Tan Beard, Backpack)',
    description_en: 'Hoth Rebel Troopers with backpacks carried additional supplies and communications equipment. This bearded variant with tan facial hair showed the diverse volunteers defending Echo Base. Their backpacks contained survival gear essential for Hoth\'s deadly environment. These prepared soldiers exemplified Rebel resourcefulness and adaptability.',
    description_de: 'Hoth-Rebellen-Soldaten mit Rucksäcken trugen zusätzliche Vorräte und Kommunikationsausrüstung. Diese bärtige Variante mit beigen Gesichtshaaren zeigte die vielfältigen Freiwilligen, die Echo Base verteidigten. Ihre Rucksäcke enthielten Überlebensausrüstung, die für Hoths tödliche Umgebung wesentlich war. Diese vorbereiteten Soldaten verkörperten Rebellen-Einfallsreichtum und Anpassungsfähigkeit.',
    description_fr: 'Les Soldats Rebelles de Hoth avec sacs à dos transportaient fournitures et équipement de communications supplémentaires. Cette variante barbue avec pilosité faciale beige montrait les volontaires divers défendant la Base Echo. Leurs sacs à dos contenaient équipement de survie essentiel pour l\'environnement mortel de Hoth. Ces soldats préparés exemplifiaient l\'ingéniosité et adaptabilité rebelles.',
    description_es: 'Los Soldados Rebeldes de Hoth con mochilas portaban suministros adicionales y equipo de comunicaciones. Esta variante barbuda con vello facial beige mostraba voluntarios diversos defendiendo Base Eco. Sus mochilas contenían equipo de supervivencia esencial para ambiente mortal de Hoth. Estos soldados preparados ejemplificaban ingenio y adaptabilidad rebelde.'
  },
  {
    minifigure_no: 'sw0735',
    name: 'Hoth Rebel Trooper Dark Tan Uniform (Frown)',
    description_en: 'Hoth Rebel Troopers in dark tan uniforms manned defensive positions against Imperial assault. This trooper\'s frown captured the grim determination facing overwhelming odds. Their darker uniform variant provided camouflage in trenches and bunkers. These defenders bought precious time for the evacuation despite knowing defeat was certain.',
    description_de: 'Hoth-Rebellen-Soldaten in dunklen beigen Uniformen bemannten Verteidigungspositionen gegen imperialen Angriff. Das Stirnrunzeln dieses Soldaten erfasste die düstere Entschlossenheit gegen überwältigende Chancen. Ihre dunklere Uniform-Variante bot Tarnung in Schützengräben und Bunkern. Diese Verteidiger erkauften kostbare Zeit für die Evakuierung, obwohl sie wussten, dass Niederlage sicher war.',
    description_fr: 'Les Soldats Rebelles de Hoth en uniformes beige foncé tenaient positions défensives contre assaut impérial. Le froncement de ce soldat capturait la détermination sombre face à chances écrasantes. Leur variante d\'uniforme plus sombre fournissait camouflage dans tranchées et bunkers. Ces défenseurs achetèrent temps précieux pour l\'évacuation malgré savoir que défaite était certaine.',
    description_es: 'Los Soldados Rebeldes de Hoth en uniformes beige oscuro ocupaban posiciones defensivas contra asalto imperial. El ceño fruncido de este soldado capturaba determinación sombría enfrentando probabilidades abrumadoras. Su variante de uniforme más oscuro proporcionaba camuflaje en trincheras y búnkeres. Estos defensores compraron tiempo precioso para evacuación a pesar de saber que derrota era segura.'
  },
  {
    minifigure_no: 'sw0736',
    name: 'Hoth Rebel Trooper Dark Tan Uniform (Brown Beard)',
    description_en: 'This Hoth Rebel Trooper with brown beard represented the experienced veterans defending Echo Base. His dark tan uniform marked him as part of the entrenched defensive forces. These seasoned soldiers held their positions allowing transports to escape. Their sacrifice ensured the Rebellion\'s survival to fight another day.',
    description_de: 'Dieser Hoth-Rebellen-Soldat mit braunem Bart repräsentierte die erfahrenen Veteranen, die Echo Base verteidigten. Seine dunkle beige Uniform kennzeichnete ihn als Teil der verschanzten Verteidigungskräfte. Diese erfahrenen Soldaten hielten ihre Positionen und ermöglichten Transportern die Flucht. Ihr Opfer sicherte das Überleben der Rebellion, um einen weiteren Tag zu kämpfen.',
    description_fr: 'Ce Soldat Rebelle de Hoth avec barbe brune représentait les vétérans expérimentés défendant la Base Echo. Son uniforme beige foncé le marquait comme partie des forces défensives retranchées. Ces soldats aguerris tenaient leurs positions permettant aux transports d\'échapper. Leur sacrifice assura la survie de la Rébellion pour combattre un autre jour.',
    description_es: 'Este Soldado Rebelde de Hoth con barba marrón representaba veteranos experimentados defendiendo Base Eco. Su uniforme beige oscuro lo marcaba como parte de fuerzas defensivas atrincheradas. Estos soldados experimentados mantuvieron sus posiciones permitiendo que transportes escaparan. Su sacrificio aseguró supervivencia de Rebelión para luchar otro día.'
  },
  {
    minifigure_no: 'sw0737',
    name: 'Poe Dameron (Medium Nougat Jacket, Hair)',
    description_en: 'Poe Dameron became the Resistance\'s best starfighter pilot leading daring missions against the First Order. This variant with medium nougat jacket and hair showed Poe in his casual appearance. His exceptional flying skills and unwavering courage inspired fellow Resistance fighters. Poe\'s friendship with Finn and Rey defined the sequel trilogy\'s heroic trio.',
    description_de: 'Poe Dameron wurde der beste Sternjäger-Pilot des Widerstands und führte waghalsige Missionen gegen die Erste Ordnung. Diese Variante mit mittlerer Nougat-Jacke und Haaren zeigte Poe in seiner lässigen Erscheinung. Seine außergewöhnlichen Flugfähigkeiten und unerschütterlicher Mut inspirierten Widerstands-Kämpfer. Poes Freundschaft mit Finn und Rey definierte das heroische Trio der Sequel-Trilogie.',
    description_fr: 'Poe Dameron devint le meilleur pilote de chasseur stellaire de la Résistance menant missions audacieuses contre le Premier Ordre. Cette variante avec veste nougat moyen et cheveux montrait Poe dans son apparence décontractée. Ses compétences de vol exceptionnelles et courage inébranlable inspiraient combattants de la Résistance. L\'amitié de Poe avec Finn et Rey définissait le trio héroïque de la trilogie suite.',
    description_es: 'Poe Dameron se convirtió en el mejor piloto de caza estelar de la Resistencia liderando misiones audaces contra la Primera Orden. Esta variante con chaqueta beige medio y cabello mostraba a Poe en su apariencia casual. Sus habilidades de vuelo excepcionales y valor inquebrantable inspiraban luchadores de la Resistencia. La amistad de Poe con Finn y Rey definía el trío heroico de trilogía secuela.'
  },
  {
    minifigure_no: 'sw0738',
    name: 'Lor San Tekka',
    description_en: 'Lor San Tekka was an explorer and historian who helped Luke Skywalker search for Jedi artifacts. His knowledge of Force lore made him invaluable to the Resistance. San Tekka\'s discovery of the map to Luke\'s location sparked The Force Awakens\' events. His murder by Kylo Ren demonstrated the First Order\'s ruthlessness.',
    description_de: 'Lor San Tekka war ein Entdecker und Historiker, der Luke Skywalker bei der Suche nach Jedi-Artefakten half. Sein Wissen über Macht-Überlieferung machte ihn für den Widerstand unschätzbar wertvoll. San Tekkas Entdeckung der Karte zu Lukes Standort löste die Ereignisse von Das Erwachen der Macht aus. Sein Mord durch Kylo Ren demonstrierte die Rücksichtslosigkeit der Ersten Ordnung.',
    description_fr: 'Lor San Tekka était un explorateur et historien qui aida Luke Skywalker à chercher artefacts Jedi. Sa connaissance de la tradition de Force le rendait inestimable pour la Résistance. La découverte par San Tekka de la carte vers l\'emplacement de Luke déclencha les événements du Réveil de la Force. Son meurtre par Kylo Ren démontra l\'impitoyabilité du Premier Ordre.',
    description_es: 'Lor San Tekka era explorador e historiador que ayudó a Luke Skywalker a buscar artefactos Jedi. Su conocimiento de tradición de Fuerza lo hacía invaluable para Resistencia. El descubrimiento de San Tekka del mapa a ubicación de Luke desencadenó eventos de El Despertar de la Fuerza. Su asesinato por Kylo Ren demostró despiadado de Primera Orden.'
  },
  {
    minifigure_no: 'sw0739',
    name: 'Unkar Plutt',
    description_en: 'Unkar Plutt controlled the scavenging trade on Jakku, exploiting desperate scavengers for profit. This corpulent junk boss hoarded resources while others starved. His unfair exchange rates kept Rey and others barely surviving. Plutt\'s greed epitomized the harsh economic reality of Jakku\'s post-war wasteland.',
    description_de: 'Unkar Plutt kontrollierte den Plünderungshandel auf Jakku und beutete verzweifelte Plünderer für Profit aus. Dieser korpulente Schrott-Boss hortete Ressourcen, während andere hungerten. Seine unfairen Wechselkurse hielten Rey und andere kaum am Überleben. Plutts Gier verkörperte die harte wirtschaftliche Realität von Jakkus Nachkriegs-Ödland.',
    description_fr: 'Unkar Plutt contrôlait le commerce de récupération sur Jakku, exploitant récupérateurs désespérés pour profit. Ce patron de ferraille corpulent accumulait ressources pendant que d\'autres mouraient de faim. Ses taux de change injustes maintenaient Rey et autres à peine survivants. L\'avidité de Plutt incarnait la réalité économique dure du désert d\'après-guerre de Jakku.',
    description_es: 'Unkar Plutt controlaba comercio de carroñeo en Jakku, explotando carroñeros desesperados por ganancia. Este jefe de chatarra corpulento acumulaba recursos mientras otros morían de hambre. Sus tasas de cambio injustas mantenían a Rey y otros apenas sobreviviendo. La codicia de Plutt personificaba realidad económica dura de páramo postguerra de Jakku.'
  },
  {
    minifigure_no: 'sw0740',
    name: 'Teedo',
    description_en: 'Teedo were scavengers native to Jakku who captured droids and travelers for profit. These diminutive beings rode luggabeasts across the desert hunting salvage. Their bandaged faces and crude equipment reflected harsh desert survival. Teedo\'s attempt to capture BB-8 demonstrated the lawless nature of Jakku\'s wastes.',
    description_de: 'Teedo waren Plünderer, die auf Jakku heimisch waren und Droiden und Reisende für Profit einfingen. Diese winzigen Wesen ritten Luggabeasts durch die Wüste auf der Jagd nach Bergung. Ihre verbundenen Gesichter und grobe Ausrüstung spiegelten hartes Wüsten-Überleben wider. Teedos Versuch, BB-8 zu fangen, demonstrierte die gesetzlose Natur von Jakkus Ödland.',
    description_fr: 'Les Teedo étaient récupérateurs natifs de Jakku qui capturaient droïdes et voyageurs pour profit. Ces êtres minuscules chevauchaient luggabeasts à travers le désert chassant récupération. Leurs visages bandés et équipement rudimentaire reflétaient survie désertique dure. La tentative de Teedo de capturer BB-8 démontrait la nature sans loi des déserts de Jakku.',
    description_es: 'Los Teedo eran carroñeros nativos de Jakku que capturaban droides y viajeros por ganancia. Estos seres diminutos montaban luggabeasts por desierto cazando salvamento. Sus caras vendadas y equipo tosco reflejaban supervivencia desértica dura. El intento de Teedo de capturar a BB-8 demostraba naturaleza sin ley de páramos de Jakku.'
  },
  {
    minifigure_no: 'sw0741',
    name: 'Grand Moff Wilhuff Tarkin - Dark Tan Uniform',
    description_en: 'Grand Moff Tarkin commanded the Death Star with ruthless efficiency, demonstrating Imperial doctrine through terror. This variant with dark tan uniform showed his distinctive officer appearance. Tarkin\'s destruction of Alderaan exemplified Imperial cruelty and absolute power. His tactical brilliance and cold calculation made him the Emperor\'s most trusted commander.',
    description_de: 'Großmoff Tarkin befehligte den Todesstern mit rücksichtsloser Effizienz und demonstrierte imperiale Doktrin durch Terror. Diese Variante mit dunkler beiger Uniform zeigte sein markantes Offiziers-Erscheinungsbild. Tarkins Zerstörung von Alderaan verkörperte imperiale Grausamkeit und absolute Macht. Seine taktische Brillanz und kalte Berechnung machten ihn zum vertrauenswürdigsten Kommandanten des Imperators.',
    description_fr: 'Le Grand Moff Tarkin commandait l\'Étoile de la Mort avec efficacité impitoyable, démontrant doctrine impériale par terreur. Cette variante avec uniforme beige foncé montrait son apparence d\'officier distinctive. La destruction d\'Alderaan par Tarkin exemplifiait cruauté impériale et pouvoir absolu. Son génie tactique et calcul froid en faisaient le commandant le plus fiable de l\'Empereur.',
    description_es: 'El Gran Moff Tarkin comandaba la Estrella de la Muerte con eficiencia despiadada, demostrando doctrina imperial mediante terror. Esta variante con uniforme beige oscuro mostraba su apariencia de oficial distintiva. La destrucción de Alderaan por Tarkin ejemplificaba crueldad imperial y poder absoluto. Su brillantez táctica y cálculo frío lo convertían en comandante más confiable del Emperador.'
  },
  {
    minifigure_no: 'sw0742',
    name: 'Sabine Wren - Bright Green and Dark Blue Hair',
    description_en: 'Sabine Wren was a Mandalorian warrior and explosives expert serving the Ghost crew in Star Wars Rebels. This variant with bright green and dark blue hair showed her distinctive artistic style. Her graffiti and custom armor reflected individuality and rebellion against Imperial conformity. Sabine\'s weapons expertise and Mandalorian heritage made her invaluable to the crew.',
    description_de: 'Sabine Wren war eine mandalorianische Kriegerin und Sprengstoff-Expertin, die der Ghost-Crew in Star Wars Rebels diente. Diese Variante mit hellgrünen und dunkelblauen Haaren zeigte ihren markanten künstlerischen Stil. Ihre Graffiti und maßgefertigte Rüstung spiegelten Individualität und Rebellion gegen imperiale Konformität wider. Sabines Waffen-Expertise und mandalorianisches Erbe machten sie für die Crew unschätzbar wertvoll.',
    description_fr: 'Sabine Wren était une guerrière mandalorienne et experte en explosifs servant l\'équipage du Ghost dans Star Wars Rebels. Cette variante avec cheveux vert vif et bleu foncé montrait son style artistique distinctif. Ses graffitis et armure personnalisée reflétaient individualité et rébellion contre conformité impériale. L\'expertise en armes et héritage mandalorienne de Sabine la rendaient inestimable pour l\'équipage.',
    description_es: 'Sabine Wren era guerrera mandaloriana y experta en explosivos sirviendo a tripulación del Ghost en Star Wars Rebels. Esta variante con cabello verde brillante y azul oscuro mostraba su estilo artístico distintivo. Su grafiti y armadura personalizada reflejaban individualidad y rebelión contra conformidad imperial. La pericia en armas y herencia mandaloriana de Sabine la hacían invaluable para tripulación.'
  },
  {
    minifigure_no: 'sw0743',
    name: 'Rebel Pilot A-wing (Open Helmet, Sand Blue Jumpsuit, Female)',
    description_en: 'Female Rebel pilots flew A-wing interceptors providing fast strike capability for the Alliance. This pilot with open helmet and sand blue jumpsuit showed the diverse composition of Rebel forces. A-wing pilots required exceptional skill handling the fastest starfighters in the fleet. Their speed and maneuverability enabled hit-and-run tactics against Imperial targets.',
    description_de: 'Weibliche Rebellen-Pilotinnen flogen A-Wing-Abfangjäger und boten schnelle Angriffsfähigkeit für die Allianz. Diese Pilotin mit offenem Helm und sandblauem Overall zeigte die vielfältige Zusammensetzung der Rebellenstreitkräfte. A-Wing-Piloten benötigten außergewöhnliche Fähigkeit zur Handhabung der schnellsten Sternjäger der Flotte. Ihre Geschwindigkeit und Manövrierfähigkeit ermöglichten Hit-and-Run-Taktiken gegen imperiale Ziele.',
    description_fr: 'Les pilotes rebelles féminines pilotaient intercepteurs A-wing fournissant capacité de frappe rapide pour l\'Alliance. Cette pilote avec casque ouvert et combinaison bleu sable montrait la composition diverse des forces rebelles. Les pilotes A-wing nécessitaient compétence exceptionnelle pour manier les chasseurs stellaires les plus rapides de la flotte. Leur vitesse et maniabilité permettaient tactiques de frappe et fuite contre cibles impériales.',
    description_es: 'Las pilotos rebeldes femeninas volaban interceptores Ala-A proporcionando capacidad de ataque rápido para Alianza. Esta piloto con casco abierto y mono azul arena mostraba composición diversa de fuerzas rebeldes. Los pilotos Ala-A requerían habilidad excepcional manejando cazas estelares más rápidos de flota. Su velocidad y maniobrabilidad permitían tácticas de golpear y correr contra objetivos imperiales.'
  },
  {
    minifigure_no: 'sw0744',
    name: 'Darth Vader (White Head, Rebels)',
    description_en: 'This Darth Vader variant from Star Wars Rebels features white head showing beneath his damaged mask. The glimpse of scarred flesh revealed the man Anakin Skywalker once was. Vader\'s appearance in Rebels terrorized the Ghost crew demonstrating Sith power. This variant captured key moments when his helmet sustained damage revealing his true nature.',
    description_de: 'Diese Darth-Vader-Variante aus Star Wars Rebels zeigt weißen Kopf unter seiner beschädigten Maske. Der Blick auf vernarbtes Fleisch offenbarte den Mann, der Anakin Skywalker einst war. Vaders Auftreten in Rebels terrorisierte die Ghost-Crew und demonstrierte Sith-Macht. Diese Variante erfasste Schlüsselmomente, als sein Helm Schaden erlitt und seine wahre Natur offenbarte.',
    description_fr: 'Cette variante de Dark Vador de Star Wars Rebels présente tête blanche montrant sous son masque endommagé. L\'aperçu de chair cicatrisée révélait l\'homme qu\'Anakin Skywalker était autrefois. L\'apparition de Vador dans Rebels terrorisait l\'équipage du Ghost démontrant pouvoir Sith. Cette variante capturait moments clés quand son casque subissait dommages révélant sa vraie nature.',
    description_es: 'Esta variante de Darth Vader de Star Wars Rebels presenta cabeza blanca mostrándose bajo su máscara dañada. El vistazo de carne cicatrizada revelaba al hombre que Anakin Skywalker fue alguna vez. La aparición de Vader en Rebels aterrorizaba a tripulación del Ghost demostrando poder Sith. Esta variante capturaba momentos clave cuando su casco sufría daño revelando su verdadera naturaleza.'
  },
  {
    minifigure_no: 'sw0745',
    name: 'Luminara Unduli - Dark Brown Headgear, Cape',
    description_en: 'Luminara Unduli was a Mirialan Jedi Master known for strict adherence to Jedi doctrine. Her dark brown headgear and cape marked traditional Mirialan style. Luminara\'s combat prowess and tactical mind made her a respected general during the Clone Wars. Her fate during Order 66 became a haunting story in the Rebels era.',
    description_de: 'Luminara Unduli war eine Mirialan-Jedi-Meisterin, bekannt für strikte Einhaltung der Jedi-Doktrin. Ihre dunkelbraune Kopfbedeckung und Cape kennzeichneten traditionellen Mirialan-Stil. Luminaras Kampffähigkeit und taktischer Verstand machten sie zu einer respektierten Generalin während der Klonkriege. Ihr Schicksal während Order 66 wurde zu einer eindringlichen Geschichte in der Rebels-Ära.',
    description_fr: 'Luminara Unduli était une Maître Jedi Mirialan connue pour adhésion stricte à la doctrine Jedi. Sa coiffure brun foncé et cape marquaient style Mirialan traditionnel. Les prouesses au combat et esprit tactique de Luminara en faisaient une générale respectée pendant la Guerre des Clones. Son sort pendant l\'Ordre 66 devint histoire hantante dans l\'ère Rebels.',
    description_es: 'Luminara Unduli era Maestra Jedi Mirialan conocida por adherencia estricta a doctrina Jedi. Su tocado marrón oscuro y capa marcaban estilo Mirialan tradicional. La destreza en combate y mente táctica de Luminara la convertían en general respetada durante Guerras Clon. Su destino durante Orden 66 se convirtió en historia inquietante en era Rebels.'
  },
  {
    minifigure_no: 'sw0746',
    name: 'Quinlan Vos - Printed Legs',
    description_en: 'Quinlan Vos was an unorthodox Jedi Master who walked the line between light and dark. This variant with printed legs showed his distinctive appearance and combat gear. Vos\'s maverick approach and psychometric abilities made him valuable for undercover missions. His complicated relationship with Asajj Ventress defined his journey through the Clone Wars.',
    description_de: 'Quinlan Vos war ein unorthodoxer Jedi-Meister, der auf der Linie zwischen Licht und Dunkel wandelte. Diese Variante mit bedruckten Beinen zeigte sein markantes Erscheinungsbild und Kampfausrüstung. Vos\' Einzelgänger-Ansatz und psychometrische Fähigkeiten machten ihn wertvoll für Undercover-Missionen. Seine komplizierte Beziehung mit Asajj Ventress definierte seine Reise durch die Klonkriege.',
    description_fr: 'Quinlan Vos était un Maître Jedi non-orthodoxe qui marchait sur la ligne entre lumière et obscurité. Cette variante avec jambes imprimées montrait son apparence distinctive et équipement de combat. L\'approche maverick et capacités psychométriques de Vos le rendaient précieux pour missions d\'infiltration. Sa relation compliquée avec Asajj Ventress définissait son voyage à travers la Guerre des Clones.',
    description_es: 'Quinlan Vos era Maestro Jedi poco ortodoxo que caminaba línea entre luz y oscuridad. Esta variante con piernas impresas mostraba su apariencia distintiva y equipo de combate. El enfoque inconformista y habilidades psicométricas de Vos lo hacían valioso para misiones encubiertas. Su relación complicada con Asajj Ventress definía su viaje por Guerras Clon.'
  },
  {
    minifigure_no: 'sw0747',
    name: 'Imperial Inquisitor Fifth Brother - Dark Bluish Gray Uniform',
    description_en: 'The Fifth Brother was an Imperial Inquisitor hunting surviving Jedi after Order 66. His dark bluish gray uniform and intimidating presence made him a fearsome hunter. This Inquisitor\'s brute strength complemented his lightsaber skills. The Fifth Brother pursued the Ghost crew relentlessly throughout Star Wars Rebels.',
    description_de: 'Der Fünfte Bruder war ein imperialer Inquisitor, der überlebende Jedi nach Order 66 jagte. Seine dunkle bläulich-graue Uniform und einschüchternde Präsenz machten ihn zu einem furchterregenden Jäger. Die rohe Stärke dieses Inquisitors ergänzte seine Lichtschwert-Fähigkeiten. Der Fünfte Bruder verfolgte die Ghost-Crew unerbittlich während Star Wars Rebels.',
    description_fr: 'Le Cinquième Frère était un Inquisiteur Impérial chassant Jedi survivants après l\'Ordre 66. Son uniforme gris bleuté foncé et présence intimidante en faisaient un chasseur redoutable. La force brute de cet Inquisiteur complétait ses compétences au sabre laser. Le Cinquième Frère poursuivait l\'équipage du Ghost sans relâche dans Star Wars Rebels.',
    description_es: 'El Quinto Hermano era Inquisidor Imperial cazando Jedi sobrevivientes tras Orden 66. Su uniforme gris azulado oscuro y presencia intimidante lo convertían en cazador temible. La fuerza bruta de este Inquisidor complementaba sus habilidades con sable de luz. El Quinto Hermano perseguía tripulación del Ghost incansablemente durante Star Wars Rebels.'
  },
  {
    minifigure_no: 'sw0748',
    name: 'Commander Gregor',
    description_en: 'Commander Gregor was a clone commando who survived Order 66 and lived to join the Rebellion. His distinctive armor marked him as an elite soldier. Gregor\'s amnesia and eventual recovery showed the lasting trauma of the Clone Wars. His sacrifice helping the Ghost crew escape demonstrated unwavering loyalty to freedom.',
    description_de: 'Commander Gregor war ein Klon-Kommando, der Order 66 überlebte und lebte, um sich der Rebellion anzuschließen. Seine markante Rüstung kennzeichnete ihn als Elite-Soldaten. Gregors Amnesie und eventuelle Genesung zeigten das anhaltende Trauma der Klonkriege. Sein Opfer beim Helfen der Ghost-Crew zu entkommen demonstrierte unerschütterliche Loyalität zur Freiheit.',
    description_fr: 'Le Commandant Gregor était un commando clone qui survécut à l\'Ordre 66 et vécut pour rejoindre la Rébellion. Son armure distinctive le marquait comme soldat d\'élite. L\'amnésie et récupération éventuelle de Gregor montraient le traumatisme durable de la Guerre des Clones. Son sacrifice aidant l\'équipage du Ghost à s\'échapper démontra loyauté inébranlable à la liberté.',
    description_es: 'El Comandante Gregor era comando clon que sobrevivió Orden 66 y vivió para unirse a Rebelión. Su armadura distintiva lo marcaba como soldado de élite. La amnesia y recuperación eventual de Gregor mostraban trauma duradero de Guerras Clon. Su sacrificio ayudando a tripulación del Ghost a escapar demostró lealtad inquebrantable a libertad.'
  },
  {
    minifigure_no: 'sw0749',
    name: 'Captain Rex - Old',
    description_en: 'Captain Rex aged into a grizzled veteran who removed his inhibitor chip and refused Order 66. This elderly variant showed Rex decades after the Clone Wars fighting for the Rebellion. His experience and tactical knowledge proved invaluable to the Ghost crew. Rex\'s survival connected the Clone Wars era to the original trilogy timeline.',
    description_de: 'Captain Rex alterte zu einem ergrauten Veteranen, der seinen Inhibitor-Chip entfernte und Order 66 verweigerte. Diese ältere Variante zeigte Rex Jahrzehnte nach den Klonkriegen im Kampf für die Rebellion. Seine Erfahrung und taktisches Wissen erwiesen sich als unschätzbar wertvoll für die Ghost-Crew. Rex\' Überleben verband die Klonkriegs-Ära mit der ursprünglichen Trilogie-Zeitlinie.',
    description_fr: 'Le Capitaine Rex vieillit en vétéran blanchi qui retira sa puce inhibitrice et refusa l\'Ordre 66. Cette variante âgée montrait Rex décennies après la Guerre des Clones combattant pour la Rébellion. Son expérience et connaissance tactique se révélaient inestimables pour l\'équipage du Ghost. La survie de Rex reliait l\'ère de la Guerre des Clones à la chronologie de la trilogie originale.',
    description_es: 'El Capitán Rex envejeció en veterano curtido que quitó su chip inhibidor y rechazó Orden 66. Esta variante anciana mostraba a Rex décadas tras Guerras Clon luchando por Rebelión. Su experiencia y conocimiento táctico resultaban invaluables para tripulación del Ghost. La supervivencia de Rex conectaba era de Guerras Clon con línea temporal de trilogía original.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0730-sw0749...');

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

  console.log('Batch complete! 18 minifigs saved (sw0730-sw0749, excluding sw0732-733).');
  await prisma.$disconnect();
}

saveBatch();
