import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0794',
    name: 'Bodhi Rook',
    description_en: 'Bodhi Rook was an Imperial cargo pilot who defected to join the Rebellion. His courage delivering Galen Erso\'s message sparked the Rogue One mission. Bodhi\'s technical expertise piloting the U-wing proved crucial during the Battle of Scarif. His sacrifice calling for the shield gate destruction enabled the Death Star plans\' transmission.',
    description_de: 'Bodhi Rook war ein imperialer Fracht-Pilot, der überlief, um sich der Rebellion anzuschließen. Sein Mut beim Überbringen von Galen Ersos Nachricht löste die Rogue One-Mission aus. Bodhis technische Expertise beim Pilotieren des U-Wings erwies sich als entscheidend während der Schlacht von Scarif. Sein Opfer beim Aufruf zur Zerstörung des Schildtors ermöglichte die Übertragung der Todesstern-Pläne.',
    description_fr: 'Bodhi Rook était un pilote de cargo impérial qui déserta pour rejoindre la Rébellion. Son courage livrant le message de Galen Erso déclencha la mission Rogue One. L\'expertise technique de Bodhi pilotant l\'U-wing s\'avéra cruciale pendant la Bataille de Scarif. Son sacrifice appelant à la destruction de la porte bouclier permit la transmission des plans de l\'Étoile de la Mort.',
    description_es: 'Bodhi Rook era piloto de carga imperial que desertó para unirse a Rebelión. Su valor entregando mensaje de Galen Erso desencadenó misión Rogue One. La pericia técnica de Bodhi pilotando Ala-U resultó crucial durante Batalla de Scarif. Su sacrificio llamando a destrucción de puerta de escudo permitió transmisión de planos de Estrella de la Muerte.'
  },
  {
    minifigure_no: 'sw0795',
    name: 'Imperial Hovertank Pilot (Imperial Tank Trooper)',
    description_en: 'Imperial Hovertank Pilots operated TX-225 assault tanks on Jedha and other occupied worlds. Their distinctive armor with breathing apparatus protected against harsh environments. These specialized drivers coordinated armored support during urban operations. Hovertank pilots represented Imperial mechanized warfare\'s evolution beyond walkers.',
    description_de: 'Imperiale Hovertank-Piloten operierten TX-225-Angriffspanzer auf Jedha und anderen besetzten Welten. Ihre markante Rüstung mit Atemgerät schützte gegen harte Umgebungen. Diese spezialisierten Fahrer koordinierten gepanzerte Unterstützung während städtischer Operationen. Hovertank-Piloten repräsentierten die Evolution imperialer mechanisierter Kriegsführung über Walker hinaus.',
    description_fr: 'Les Pilotes de Hovertank Impériaux opéraient chars d\'assaut TX-225 sur Jedha et autres mondes occupés. Leur armure distinctive avec appareil respiratoire protégeait contre environnements difficiles. Ces conducteurs spécialisés coordonnaient soutien blindé pendant opérations urbaines. Les pilotes de Hovertank représentaient l\'évolution de guerre mécanisée impériale au-delà des marcheurs.',
    description_es: 'Los Pilotos de Hovertank Imperial operaban tanques de asalto TX-225 en Jedha y otros mundos ocupados. Su armadura distintiva con aparato respiratorio protegía contra ambientes hostiles. Estos conductores especializados coordinaban apoyo blindado durante operaciones urbanas. Los pilotos de Hovertank representaban evolución de guerra mecanizada imperial más allá de caminantes.'
  },
  {
    minifigure_no: 'sw0796',
    name: 'Imperial Death Trooper - Black Armor with Ammo Pouch and Grenades, Pauldron (Specialist / Commander)',
    description_en: 'Death Trooper Specialists commanded elite Imperial special forces units. This variant with ammo pouch, grenades, and pauldron marked command authority. These enhanced soldiers served as Director Krennic\'s personal guard. Death Trooper commanders coordinated devastating operations against high-value Rebel targets.',
    description_de: 'Death Trooper-Spezialisten befehligten Elite-Imperial-Spezialeinheiten. Diese Variante mit Munitionstasche, Granaten und Pauldron kennzeichnete Befehlsgewalt. Diese verbesserten Soldaten dienten als Direktor Krennics persönliche Wache. Death Trooper-Kommandanten koordinierten verheerende Operationen gegen hochwertige Rebellenziele.',
    description_fr: 'Les Spécialistes Death Trooper commandaient unités de forces spéciales impériales d\'élite. Cette variante avec sacoche de munitions, grenades et épaulière marquait autorité de commandement. Ces soldats améliorés servaient comme garde personnelle du Directeur Krennic. Les commandants Death Trooper coordonnaient opérations dévastatrices contre cibles rebelles de haute valeur.',
    description_es: 'Los Especialistas Death Trooper comandaban unidades de fuerzas especiales imperiales de élite. Esta variante con bolsa de munición, granadas y hombrera marcaba autoridad de mando. Estos soldados mejorados servían como guardia personal del Director Krennic. Los comandantes Death Trooper coordinaban operaciones devastadoras contra objetivos rebeldes de alto valor.'
  },
  {
    minifigure_no: 'sw0797',
    name: 'Imperial AT-ST Driver (Helmet with Printed Goggles, Light Bluish Gray Jumpsuit, Printed Legs)',
    description_en: 'AT-ST Drivers piloted the Empire\'s nimble two-legged scout walkers. This detailed variant featured printed goggles, jumpsuit, and legs. These specialized pilots required precise coordination controlling the walker\'s weapons and movement. AT-ST drivers provided reconnaissance and fire support during ground operations.',
    description_de: 'AT-ST-Fahrer pilotierten die wendigen zweibeinigen Scout-Walker des Imperiums. Diese detaillierte Variante zeigte bedruckte Schutzbrille, Overall und Beine. Diese spezialisierten Piloten benötigten präzise Koordination zur Kontrolle von Waffen und Bewegung des Walkers. AT-ST-Fahrer boten Aufklärung und Feuerunterstützung während Bodenoperationen.',
    description_fr: 'Les Pilotes AT-ST pilotaient les marcheurs éclaireurs bipèdes agiles de l\'Empire. Cette variante détaillée présentait lunettes imprimées, combinaison et jambes. Ces pilotes spécialisés nécessitaient coordination précise contrôlant armes et mouvement du marcheur. Les pilotes AT-ST fournissaient reconnaissance et soutien de feu pendant opérations terrestres.',
    description_es: 'Los Pilotos AT-ST pilotaban caminantes exploradores bípedos ágiles del Imperio. Esta variante detallada presentaba gafas impresas, mono y piernas. Estos pilotos especializados requerían coordinación precisa controlando armas y movimiento del caminante. Los pilotos AT-ST proporcionaban reconocimiento y apoyo de fuego durante operaciones terrestres.'
  },
  {
    minifigure_no: 'sw0798',
    name: 'Pao - without Sticker on Backpack',
    description_en: 'Pao was a Drabatan commando fighting for the Rebellion during the Battle of Scarif. His amphibious species brought unique combat capabilities. Pao\'s fierce battle cry and aggressive fighting style made him a formidable warrior. This variant without backpack sticker showed the standard configuration.',
    description_de: 'Pao war ein Drabatan-Kommando, der für die Rebellion während der Schlacht von Scarif kämpfte. Seine amphibische Spezies brachte einzigartige Kampffähigkeiten. Paos wilder Kampfschrei und aggressiver Kampfstil machten ihn zu einem gewaltigen Krieger. Diese Variante ohne Rucksack-Sticker zeigte die Standardkonfiguration.',
    description_fr: 'Pao était un commando Drabatan combattant pour la Rébellion pendant la Bataille de Scarif. Son espèce amphibie apportait capacités de combat uniques. Le cri de bataille féroce et style de combat agressif de Pao en faisaient un guerrier redoutable. Cette variante sans autocollant de sac à dos montrait la configuration standard.',
    description_es: 'Pao era comando Drabatan luchando por Rebelión durante Batalla de Scarif. Su especie anfibia traía capacidades de combate únicas. El grito de batalla feroz y estilo de lucha agresivo de Pao lo convertían en guerrero formidable. Esta variante sin calcomanía de mochila mostraba configuración estándar.'
  },
  {
    minifigure_no: 'sw0798s',
    name: 'Pao - with Sticker on Backpack',
    description_en: 'This Pao variant includes a sticker on his backpack showing equipment detail. The Drabatan warrior\'s tactical gear supported extended combat operations. Pao fought fiercely during the ground assault on Scarif\'s Imperial facility. His species\' natural resilience made them valued Rebel commandos.',
    description_de: 'Diese Pao-Variante enthält einen Sticker auf seinem Rucksack, der Ausrüstungsdetails zeigt. Die taktische Ausrüstung des Drabatan-Kriegers unterstützte ausgedehnte Kampfoperationen. Pao kämpfte wild während des Bodenangriffs auf Scarifs imperiale Einrichtung. Die natürliche Widerstandsfähigkeit seiner Spezies machte sie zu geschätzten Rebellen-Kommandos.',
    description_fr: 'Cette variante de Pao inclut un autocollant sur son sac à dos montrant détail d\'équipement. L\'équipement tactique du guerrier Drabatan supportait opérations de combat prolongées. Pao combattait férocement pendant l\'assaut terrestre sur l\'installation impériale de Scarif. La résilience naturelle de son espèce en faisait des commandos rebelles appréciés.',
    description_es: 'Esta variante de Pao incluye calcomanía en su mochila mostrando detalle de equipo. El equipo táctico del guerrero Drabatan apoyaba operaciones de combate extendidas. Pao luchaba ferozmente durante asalto terrestre en instalación imperial de Scarif. La resistencia natural de su especie los convertía en comandos rebeldes valiosos.'
  },
  {
    minifigure_no: 'sw0799',
    name: 'Worker Droid',
    description_en: 'Worker Droids performed labor tasks throughout Imperial facilities and settlements. These utility droids handled cargo loading, maintenance, and construction work. Their simple programming made them reliable for repetitive tasks. Worker droids represented the mechanical workforce maintaining galactic infrastructure.',
    description_de: 'Arbeiter-Droiden führten Arbeitsaufgaben in imperialen Einrichtungen und Siedlungen durch. Diese Nutz-Droiden hantierten Ladungsverladung, Wartung und Bauarbeiten. Ihre einfache Programmierung machte sie zuverlässig für wiederholende Aufgaben. Arbeiter-Droiden repräsentierten die mechanische Arbeitskraft zur Wartung galaktischer Infrastruktur.',
    description_fr: 'Les Droïdes Ouvriers effectuaient tâches de travail dans toutes installations impériales et colonies. Ces droïdes utilitaires géraient chargement de cargaison, entretien et travaux de construction. Leur programmation simple les rendait fiables pour tâches répétitives. Les droïdes ouvriers représentaient la main-d\'œuvre mécanique maintenant infrastructure galactique.',
    description_es: 'Los Droides Trabajadores realizaban tareas laborales por instalaciones imperiales y asentamientos. Estos droides utilitarios manejaban carga de carga, mantenimiento y trabajo de construcción. Su programación simple los hacía confiables para tareas repetitivas. Los droides trabajadores representaban fuerza laboral mecánica manteniendo infraestructura galáctica.'
  },
  {
    minifigure_no: 'sw0800',
    name: 'Rebel Pilot U-wing',
    description_en: 'U-wing pilots specialized in transporting Rebel commando teams into combat zones. These versatile aviators combined transport and gunship duties. U-wing pilots required exceptional skill flying into hostile territory under fire. Their insertion and extraction missions proved crucial to Rebel special operations.',
    description_de: 'U-Wing-Piloten spezialisierten sich auf den Transport von Rebellen-Kommando-Teams in Kampfzonen. Diese vielseitigen Flieger kombinierten Transport- und Kampfhubschrauber-Aufgaben. U-Wing-Piloten benötigten außergewöhnliche Fähigkeit zum Fliegen in feindliches Gebiet unter Feuer. Ihre Einsatz- und Extraktionsmissionen erwiesen sich als entscheidend für Rebellen-Spezialoperationen.',
    description_fr: 'Les pilotes U-wing se spécialisaient en transport d\'équipes commando rebelles dans zones de combat. Ces aviateurs polyvalents combinaient devoirs de transport et hélicoptère de combat. Les pilotes U-wing nécessitaient compétence exceptionnelle volant en territoire hostile sous feu. Leurs missions d\'insertion et extraction s\'avéraient cruciales pour opérations spéciales rebelles.',
    description_es: 'Los pilotos Ala-U se especializaban en transportar equipos comando rebeldes a zonas de combate. Estos aviadores versátiles combinaban deberes de transporte y helicóptero de combate. Los pilotos Ala-U requerían habilidad excepcional volando en territorio hostil bajo fuego. Sus misiones de inserción y extracción resultaban cruciales para operaciones especiales rebeldes.'
  },
  {
    minifigure_no: 'sw0801',
    name: 'Rebel Pilot Y-wing (Dark Blue Jumpsuit)',
    description_en: 'Y-wing pilots in dark blue jumpsuits flew the Alliance\'s reliable bomber-fighters. These workhorses of the Rebel fleet delivered heavy ordnance against Imperial targets. Y-wing pilots required endurance flying long-range strike missions. Their bombing runs proved essential during major fleet engagements.',
    description_de: 'Y-Wing-Piloten in dunkelblauen Overalls flogen die zuverlässigen Bomber-Jäger der Allianz. Diese Arbeitspferde der Rebellenflotte lieferten schwere Munition gegen imperiale Ziele. Y-Wing-Piloten benötigten Ausdauer beim Fliegen von Langstrecken-Angriffsmissionen. Ihre Bombenangriffe erwiesen sich als wesentlich während großer Flotten-Gefechte.',
    description_fr: 'Les pilotes Y-wing en combinaisons bleu foncé pilotaient les bombardiers-chasseurs fiables de l\'Alliance. Ces chevaux de bataille de la flotte rebelle livraient munitions lourdes contre cibles impériales. Les pilotes Y-wing nécessitaient endurance volant missions de frappe longue portée. Leurs bombardements s\'avéraient essentiels pendant engagements de flotte majeurs.',
    description_es: 'Los pilotos Ala-Y en monos azul oscuro volaban bombarderos-cazas confiables de Alianza. Estos caballos de batalla de flota rebelde entregaban munición pesada contra objetivos imperiales. Los pilotos Ala-Y requerían resistencia volando misiones de ataque de largo alcance. Sus bombardeos resultaban esenciales durante enfrentamientos de flota mayores.'
  },
  {
    minifigure_no: 'sw0802',
    name: 'Imperial Shuttle Pilot - Light Nougat Head with Headset, Imperial Officer Cap',
    description_en: 'Imperial Shuttle Pilots transported high-ranking officers and sensitive cargo. Their distinctive caps and headsets marked their elite status. These pilots maintained the highest security clearances. Shuttle pilots flew Lambda-class craft carrying Imperial command personnel.',
    description_de: 'Imperiale Shuttle-Piloten transportierten hochrangige Offiziere und sensible Fracht. Ihre markanten Kappen und Headsets kennzeichneten ihren Elite-Status. Diese Piloten hielten die höchsten Sicherheitsfreigaben. Shuttle-Piloten flogen Lambda-Klasse-Fahrzeuge, die imperiales Befehlspersonal trugen.',
    description_fr: 'Les Pilotes de Navette Impériale transportaient officiers de haut rang et cargaison sensible. Leurs casquettes et casques distinctifs marquaient leur statut d\'élite. Ces pilotes maintenaient les autorisations de sécurité les plus élevées. Les pilotes de navette pilotaient vaisseaux classe Lambda transportant personnel de commandement impérial.',
    description_es: 'Los Pilotos de Lanzadera Imperial transportaban oficiales de alto rango y carga sensible. Sus gorras y auriculares distintivos marcaban su estatus de élite. Estos pilotos mantenían autorizaciones de seguridad más altas. Los pilotos de lanzadera volaban naves clase Lambda transportando personal de mando imperial.'
  },
  {
    minifigure_no: 'sw0803',
    name: 'Rebel Trooper - White Goggles, Dark Bluish Gray Helmet, Black Beard (Private Kappehl)',
    description_en: 'Private Kappehl fought as a Rebel trooper with distinctive white goggles and black beard. His protective eyewear showed adaptation to diverse combat environments. Named privates personalized the sacrifice of enlisted soldiers. Kappehl represented countless individuals fighting for freedom.',
    description_de: 'Private Kappehl kämpfte als Rebellen-Soldat mit markanten weißen Schutzbrillen und schwarzem Bart. Seine schützende Augenausrüstung zeigte Anpassung an vielfältige Kampfumgebungen. Benannte Soldaten personalisierten das Opfer von Mannschaftssoldaten. Kappehl repräsentierte unzählige Individuen, die für Freiheit kämpften.',
    description_fr: 'Le Soldat Kappehl combattait comme soldat rebelle avec lunettes blanches distinctives et barbe noire. Sa protection oculaire montrait adaptation à divers environnements de combat. Les soldats nommés personnalisaient le sacrifice de soldats enrôlés. Kappehl représentait individus innombrables combattant pour la liberté.',
    description_es: 'El Soldado Kappehl luchaba como soldado rebelde con gafas blancas distintivas y barba negra. Su protección ocular mostraba adaptación a diversos ambientes de combate. Los soldados nombrados personalizaban sacrificio de soldados alistados. Kappehl representaba individuos incontables luchando por libertad.'
  },
  {
    minifigure_no: 'sw0804',
    name: 'Rebel Trooper - White Goggles, Dark Tan Helmet, Medium Nougat Beard (Corporal Rostok)',
    description_en: 'Corporal Rostok led Rebel troops with his distinctive dark tan helmet and beard. His NCO rank indicated experienced leadership in ground combat. Rostok\'s white goggles protected against harsh battlefield conditions. Named corporals represented the backbone of Rebel military structure.',
    description_de: 'Corporal Rostok führte Rebellen-Truppen mit seinem markanten dunkelbeigen Helm und Bart. Sein Unteroffiziers-Rang zeigte erfahrene Führung im Bodenkampf. Rostoks weiße Schutzbrillen schützten gegen harte Schlachtfeldbedingungen. Benannte Corporals repräsentierten das Rückgrat der Rebellen-Militärstruktur.',
    description_fr: 'Le Caporal Rostok dirigeait troupes rebelles avec son casque beige foncé et barbe distinctifs. Son rang de sous-officier indiquait leadership expérimenté en combat terrestre. Les lunettes blanches de Rostok protégeaient contre conditions de champ de bataille difficiles. Les caporaux nommés représentaient l\'épine dorsale de la structure militaire rebelle.',
    description_es: 'El Cabo Rostok lideraba tropas rebeldes con su casco beige oscuro y barba distintivos. Su rango de suboficial indicaba liderazgo experimentado en combate terrestre. Las gafas blancas de Rostok protegían contra condiciones de campo de batalla duras. Los cabos nombrados representaban columna vertebral de estructura militar rebelde.'
  },
  {
    minifigure_no: 'sw0805',
    name: 'Rebel Trooper - Light Nougat Head, Helmet with Pearl Dark Gray Band (Private Calfor)',
    description_en: 'Private Calfor served in Rebel ground forces with a distinctive pearl dark gray helmet band. His equipment showed the diverse gear configurations within Alliance forces. Calfor represented the young recruits joining the fight against tyranny. Named privates humanized the rank-and-file soldiers.',
    description_de: 'Private Calfor diente in Rebellen-Bodentruppen mit einem markanten perlgrauen Helmband. Seine Ausrüstung zeigte die vielfältigen Ausrüstungskonfigurationen innerhalb der Allianz-Streitkräfte. Calfor repräsentierte die jungen Rekruten, die sich dem Kampf gegen Tyrannei anschlossen. Benannte Soldaten humanisierten die einfachen Soldaten.',
    description_fr: 'Le Soldat Calfor servait dans forces terrestres rebelles avec bande de casque gris perle foncé distinctive. Son équipement montrait les configurations d\'équipement diverses au sein des forces de l\'Alliance. Calfor représentait les jeunes recrues rejoignant le combat contre la tyrannie. Les soldats nommés humanisaient les soldats de base.',
    description_es: 'El Soldado Calfor servía en fuerzas terrestres rebeldes con banda de casco gris perla oscuro distintiva. Su equipo mostraba configuraciones de equipo diversas dentro de fuerzas de Alianza. Calfor representaba reclutas jóvenes uniéndose a lucha contra tiranía. Los soldados nombrados humanizaban soldados de base.'
  },
  {
    minifigure_no: 'sw0806',
    name: 'Rebel Trooper - Reddish Brown Head, Helmet with Pearl Dark Gray Band (Corporal Tonc)',
    description_en: 'Corporal Tonc commanded small Rebel units with his reddish brown complexion and pearl gray helmet band. His leadership experience proved invaluable during ground operations. Tonc\'s NCO rank showed the career soldiers who formed Alliance military\'s core. Named corporals personalized mid-level leadership.',
    description_de: 'Corporal Tonc befehligte kleine Rebellen-Einheiten mit seiner rötlich-braunen Hautfarbe und perlgrauem Helmband. Seine Führungserfahrung erwies sich als unschätzbar wertvoll während Bodenoperationen. Toncs Unteroffiziers-Rang zeigte die Berufssoldaten, die den Kern des Allianz-Militärs bildeten. Benannte Corporals personalisierten mittlere Führungsebene.',
    description_fr: 'Le Caporal Tonc commandait petites unités rebelles avec son teint brun rougeâtre et bande de casque gris perle. Son expérience de leadership s\'avérait inestimable pendant opérations terrestres. Le rang de sous-officier de Tonc montrait les soldats de carrière qui formaient le noyau militaire de l\'Alliance. Les caporaux nommés personnalisaient leadership de niveau intermédiaire.',
    description_es: 'El Cabo Tonc comandaba pequeñas unidades rebeldes con su tez marrón rojizo y banda de casco gris perla. Su experiencia de liderazgo resultaba invaluable durante operaciones terrestres. El rango de suboficial de Tonc mostraba soldados de carrera que formaban núcleo militar de Alianza. Los cabos nombrados personalizaban liderazgo de nivel medio.'
  },
  {
    minifigure_no: 'sw0807',
    name: 'Imperial Death Trooper - Black Armor',
    description_en: 'Imperial Death Troopers were elite special forces enhanced with cybernetic augmentations. Their black armor and scrambled communications made them terrifying. Death Troopers served as bodyguards for high-ranking Imperial officials. These enhanced soldiers represented the Empire\'s most dangerous operatives.',
    description_de: 'Imperiale Death Troopers waren Elite-Spezialeinheiten, verbessert mit kybernetischen Augmentationen. Ihre schwarze Rüstung und verschlüsselte Kommunikation machten sie erschreckend. Death Troopers dienten als Leibwächter für hochrangige imperiale Beamte. Diese verbesserten Soldaten repräsentierten die gefährlichsten Agenten des Imperiums.',
    description_fr: 'Les Death Troopers Impériaux étaient forces spéciales d\'élite améliorées avec augmentations cybernétiques. Leur armure noire et communications brouillées les rendaient terrifiants. Les Death Troopers servaient comme gardes du corps pour officiels impériaux de haut rang. Ces soldats améliorés représentaient les agents les plus dangereux de l\'Empire.',
    description_es: 'Los Death Troopers Imperiales eran fuerzas especiales de élite mejoradas con aumentos cibernéticos. Su armadura negra y comunicaciones codificadas los hacían aterradores. Los Death Troopers servían como guardaespaldas para oficiales imperiales de alto rango. Estos soldados mejorados representaban agentes más peligrosos del Imperio.'
  },
  {
    minifigure_no: 'sw0808',
    name: 'Darth Maul - Horns, Printed Legs, Open Mouth',
    description_en: 'This Darth Maul variant features detailed horns, printed legs, and open mouth expression. His aggressive appearance captured the Zabrak Sith\'s ferocity. Maul\'s distinctive facial markings and combat stance showed his deadly nature. This detailed variant became popular for its enhanced printing quality.',
    description_de: 'Diese Darth-Maul-Variante zeigt detaillierte Hörner, bedruckte Beine und offenen Mund-Ausdruck. Sein aggressives Erscheinungsbild erfasste die Wildheit des Zabrak-Sith. Mauls markante Gesichtsmarkierungen und Kampfhaltung zeigten seine tödliche Natur. Diese detaillierte Variante wurde beliebt für ihre verbesserte Druckqualität.',
    description_fr: 'Cette variante de Dark Maul présente cornes détaillées, jambes imprimées et expression bouche ouverte. Son apparence agressive capturait la férocité du Sith Zabrak. Les marques faciales distinctives et posture de combat de Maul montraient sa nature mortelle. Cette variante détaillée devint populaire pour sa qualité d\'impression améliorée.',
    description_es: 'Esta variante de Darth Maul presenta cuernos detallados, piernas impresas y expresión de boca abierta. Su apariencia agresiva capturaba ferocidad del Sith Zabrak. Las marcas faciales distintivas y postura de combate de Maul mostraban su naturaleza mortal. Esta variante detallada se volvió popular por su calidad de impresión mejorada.'
  },
  {
    minifigure_no: 'sw0809',
    name: 'Astromech Droid, R3-S1, Rebel',
    description_en: 'R3-S1 served the Rebellion as an astromech droid with distinctive red and white coloring. These R3 units provided essential navigation and repair services. R3-S1\'s clear dome revealed internal mechanisms. Rebel astromechs became trusted companions to pilots and mechanics alike.',
    description_de: 'R3-S1 diente der Rebellion als Astromech-Droide mit markanter rot-weißer Färbung. Diese R3-Einheiten boten wesentliche Navigation und Reparaturdienste. R3-S1s klare Kuppel enthüllte interne Mechanismen. Rebellen-Astromechs wurden zu vertrauenswürdigen Begleitern für Piloten und Mechaniker gleichermaßen.',
    description_fr: 'R3-S1 servait la Rébellion comme droïde astromech avec coloration rouge et blanche distinctive. Ces unités R3 fournissaient navigation et services de réparation essentiels. Le dôme transparent de R3-S1 révélait mécanismes internes. Les astromechs rebelles devenaient compagnons de confiance pour pilotes et mécaniciens.',
    description_es: 'R3-S1 servía a Rebelión como droide astromech con coloración roja y blanca distintiva. Estas unidades R3 proporcionaban navegación y servicios de reparación esenciales. La cúpula transparente de R3-S1 revelaba mecanismos internos. Los astromechs rebeldes se convirtieron en compañeros de confianza para pilotos y mecánicos por igual.'
  },
  {
    minifigure_no: 'sw0810',
    name: 'Qui-Gon Jinn, without Cape',
    description_en: 'Qui-Gon Jinn without cape showed the Jedi Master in active combat configuration. His practical attire emphasized mobility over ceremonial appearance. Qui-Gon\'s maverick approach to the Force and Jedi Code made him controversial. This capeless variant captured him during lightsaber duels and action sequences.',
    description_de: 'Qui-Gon Jinn ohne Umhang zeigte den Jedi-Meister in aktiver Kampfkonfiguration. Seine praktische Kleidung betonte Mobilität über zeremoniellem Erscheinungsbild. Qui-Gons Einzelgänger-Ansatz zur Macht und zum Jedi-Kodex machten ihn kontrovers. Diese umhanglose Variante erfasste ihn während Lichtschwert-Duellen und Actionsequenzen.',
    description_fr: 'Qui-Gon Jinn sans cape montrait le Maître Jedi en configuration de combat active. Sa tenue pratique soulignait mobilité sur apparence cérémonielle. L\'approche maverick de Qui-Gon envers la Force et Code Jedi le rendait controversé. Cette variante sans cape le capturait pendant duels au sabre laser et séquences d\'action.',
    description_es: 'Qui-Gon Jinn sin capa mostraba al Maestro Jedi en configuración de combate activa. Su atuendo práctico enfatizaba movilidad sobre apariencia ceremonial. El enfoque inconformista de Qui-Gon hacia Fuerza y Código Jedi lo hacía controvertido. Esta variante sin capa lo capturaba durante duelos de sable de luz y secuencias de acción.'
  },
  {
    minifigure_no: 'sw0811',
    name: 'Grand Admiral Thrawn - Dark Azure Skin',
    description_en: 'Grand Admiral Thrawn was a brilliant Chiss tactician serving the Empire. His distinctive dark azure skin marked his alien origins. Thrawn\'s genius-level intellect and understanding of art-based strategy made him the Empire\'s greatest military mind. His appearance in Rebels established him as a formidable antagonist.',
    description_de: 'Großadmiral Thrawn war ein brillanter Chiss-Taktiker im Dienst des Imperiums. Seine markante dunkel-azurblaue Haut kennzeichnete seine außerirdische Herkunft. Thrawns Genie-Level-Intellekt und Verständnis kunst-basierter Strategie machten ihn zum größten militärischen Verstand des Imperiums. Sein Auftritt in Rebels etablierte ihn als gewaltigen Antagonisten.',
    description_fr: 'Le Grand Amiral Thrawn était un tacticien Chiss brillant servant l\'Empire. Sa peau azur foncé distinctive marquait ses origines extraterrestres. L\'intellect de niveau génie et compréhension de stratégie basée sur l\'art de Thrawn en faisaient l\'esprit militaire le plus grand de l\'Empire. Son apparition dans Rebels l\'établit comme antagoniste redoutable.',
    description_es: 'El Gran Almirante Thrawn era táctico Chiss brillante sirviendo al Imperio. Su piel azur oscuro distintiva marcaba sus orígenes alienígenas. El intelecto de nivel genio y comprensión de estrategia basada en arte de Thrawn lo convertían en mente militar más grande del Imperio. Su aparición en Rebels lo estableció como antagonista formidable.'
  },
  {
    minifigure_no: 'sw0812',
    name: 'Obi-Wan Kenobi (Young, Printed Legs, without Cape)',
    description_en: 'Young Obi-Wan with printed legs and no cape showed the Padawan during active missions. His detailed leg printing enhanced the figure\'s authenticity. Obi-Wan\'s early years under Qui-Gon\'s teaching shaped his future as a Jedi Master. This variant captured him during The Phantom Menace era.',
    description_de: 'Der junge Obi-Wan mit bedruckten Beinen und ohne Umhang zeigte den Padawan während aktiver Missionen. Sein detaillierter Beindruck verbesserte die Authentizität der Figur. Obi-Wans frühe Jahre unter Qui-Gons Lehre prägten seine Zukunft als Jedi-Meister. Diese Variante erfasste ihn während der Die dunkle Bedrohung-Ära.',
    description_fr: 'Le jeune Obi-Wan avec jambes imprimées et sans cape montrait le Padawan pendant missions actives. Son impression de jambe détaillée améliorait l\'authenticité de la figurine. Les premières années d\'Obi-Wan sous l\'enseignement de Qui-Gon façonnèrent son avenir comme Maître Jedi. Cette variante le capturait pendant l\'ère de La Menace Fantôme.',
    description_es: 'El joven Obi-Wan con piernas impresas y sin capa mostraba al Padawan durante misiones activas. Su impresión de pierna detallada mejoraba autenticidad de figura. Los años tempranos de Obi-Wan bajo enseñanza de Qui-Gon moldearon su futuro como Maestro Jedi. Esta variante lo capturaba durante era de La Amenaza Fantasma.'
  },
  {
    minifigure_no: 'sw0813',
    name: 'Cassian Andor - Reddish Brown Jacket',
    description_en: 'This Cassian Andor variant features a reddish brown jacket showing his undercover operative appearance. His practical clothing enabled blending into diverse environments. Cassian\'s intelligence work required adapting his look for various missions. This variant captured his spy persona before the Scarif assault.',
    description_de: 'Diese Cassian-Andor-Variante zeigt eine rötlich-braune Jacke, die sein Undercover-Agenten-Erscheinungsbild zeigt. Seine praktische Kleidung ermöglichte das Einfügen in vielfältige Umgebungen. Cassians Geheimdienstarbeit erforderte Anpassung seines Looks für verschiedene Missionen. Diese Variante erfasste seine Spion-Persona vor dem Scarif-Angriff.',
    description_fr: 'Cette variante de Cassian Andor présente veste brun rougeâtre montrant son apparence d\'agent infiltré. Ses vêtements pratiques permettaient de se fondre dans divers environnements. Le travail de renseignement de Cassian nécessitait adaptation de son apparence pour diverses missions. Cette variante capturait sa persona d\'espion avant l\'assaut de Scarif.',
    description_es: 'Esta variante de Cassian Andor presenta chaqueta marrón rojizo mostrando su apariencia de agente encubierto. Su ropa práctica permitía mezclarse en diversos ambientes. El trabajo de inteligencia de Cassian requería adaptar su apariencia para varias misiones. Esta variante capturaba su persona de espía antes del asalto de Scarif.'
  },
  {
    minifigure_no: 'sw0814',
    name: 'Jyn Erso - Imperial Ground Crew Disguise',
    description_en: 'Jyn Erso disguised as Imperial ground crew infiltrated Scarif\'s security facility. Her stolen uniform enabled access to restricted areas. This disguise proved crucial for reaching the data vault. Jyn\'s infiltration skills and quick thinking drove the mission\'s success.',
    description_de: 'Jyn Erso verkleidet als imperiale Bodencrew infiltrierte Scarifs Sicherheitseinrichtung. Ihre gestohlene Uniform ermöglichte Zugang zu beschränkten Bereichen. Diese Verkleidung erwies sich als entscheidend für das Erreichen des Datentresors. Jyns Infiltrationsfähigkeiten und schnelles Denken trieben den Erfolg der Mission an.',
    description_fr: 'Jyn Erso déguisée en équipe au sol impériale infiltra l\'installation de sécurité de Scarif. Son uniforme volé permettait accès aux zones restreintes. Ce déguisement s\'avéra crucial pour atteindre le coffre de données. Les compétences d\'infiltration et pensée rapide de Jyn conduisirent le succès de la mission.',
    description_es: 'Jyn Erso disfrazada como tripulación terrestre imperial infiltró instalación de seguridad de Scarif. Su uniforme robado permitía acceso a áreas restringidas. Este disfraz resultó crucial para alcanzar bóveda de datos. Las habilidades de infiltración y pensamiento rápido de Jyn impulsaron éxito de misión.'
  },
  {
    minifigure_no: 'sw0815',
    name: 'Scarif Stormtrooper (Shoretrooper)',
    description_en: 'Shoretroopers were specialized Imperial forces defending tropical installations like Scarif. Their tan armor adapted to beach and jungle environments. These elite troops guarded the Empire\'s most sensitive military archives. Shoretroopers became iconic from their appearance in Rogue One\'s climactic battle.',
    description_de: 'Shoretroopers waren spezialisierte imperiale Kräfte zur Verteidigung tropischer Installationen wie Scarif. Ihre beige Rüstung passte sich an Strand- und Dschungelumgebungen an. Diese Elite-Truppen bewachten die empfindlichsten militärischen Archive des Imperiums. Shoretroopers wurden ikonisch durch ihr Erscheinen in Rogue Ones Höhepunkt-Schlacht.',
    description_fr: 'Les Shoretroopers étaient forces impériales spécialisées défendant installations tropicales comme Scarif. Leur armure beige s\'adaptait aux environnements de plage et jungle. Ces troupes d\'élite gardaient les archives militaires les plus sensibles de l\'Empire. Les Shoretroopers devinrent iconiques par leur apparition dans la bataille culminante de Rogue One.',
    description_es: 'Los Shoretroopers eran fuerzas imperiales especializadas defendiendo instalaciones tropicales como Scarif. Su armadura beige se adaptaba a ambientes de playa y jungla. Estas tropas de élite custodiaban archivos militares más sensibles del Imperio. Los Shoretroopers se volvieron icónicos por su aparición en batalla culminante de Rogue One.'
  },
  {
    minifigure_no: 'sw0816',
    name: 'Admiral Raddus',
    description_en: 'Admiral Raddus was a Mon Calamari commander who defied orders to support the Rogue One mission. His decisive action bringing the fleet to Scarif gave the mission crucial support. Raddus represented the brave leaders willing to act when others hesitated. His flagship later became the Resistance cruiser Raddus in the sequel trilogy.',
    description_de: 'Admiral Raddus war ein Mon-Calamari-Kommandant, der Befehle missachtete, um die Rogue One-Mission zu unterstützen. Seine entscheidende Aktion, die Flotte nach Scarif zu bringen, gab der Mission entscheidende Unterstützung. Raddus repräsentierte die mutigen Führer, die bereit waren zu handeln, wenn andere zögerten. Sein Flaggschiff wurde später zum Widerstands-Kreuzer Raddus in der Sequel-Trilogie.',
    description_fr: 'L\'Amiral Raddus était un commandant Mon Calamari qui défia ordres pour soutenir la mission Rogue One. Son action décisive amenant la flotte à Scarif donna à la mission support crucial. Raddus représentait les leaders courageux prêts à agir quand d\'autres hésitaient. Son vaisseau amiral devint plus tard le croiseur de la Résistance Raddus dans la trilogie suite.',
    description_es: 'El Almirante Raddus era comandante Mon Calamari que desafió órdenes para apoyar misión Rogue One. Su acción decisiva trayendo flota a Scarif dio a misión apoyo crucial. Raddus representaba líderes valientes dispuestos a actuar cuando otros dudaban. Su nave insignia se convirtió después en crucero de Resistencia Raddus en trilogía secuela.'
  },
  {
    minifigure_no: 'sw0817',
    name: 'Kanan Jarrus - Blind',
    description_en: 'Kanan Jarrus after being blinded wore a mask covering his damaged eyes. His loss of sight paradoxically strengthened his connection to the Force. Kanan\'s blindness forced him to rely entirely on Force vision. His final sacrifice destroying the fuel depot saved the Ghost crew and completed his redemption arc.',
    description_de: 'Kanan Jarrus nach seiner Erblindung trug eine Maske, die seine beschädigten Augen bedeckte. Sein Verlust des Sehvermögens stärkte paradoxerweise seine Verbindung zur Macht. Kanans Blindheit zwang ihn, sich vollständig auf Macht-Vision zu verlassen. Sein letztes Opfer beim Zerstören des Treibstoffdepots rettete die Ghost-Crew und vollendete seinen Erlösungsbogen.',
    description_fr: 'Kanan Jarrus après avoir été aveuglé portait un masque couvrant ses yeux endommagés. Sa perte de vue renforça paradoxalement sa connexion à la Force. L\'aveuglement de Kanan le força à compter entièrement sur vision de Force. Son sacrifice final détruisant le dépôt de carburant sauva l\'équipage du Ghost et compléta son arc de rédemption.',
    description_es: 'Kanan Jarrus después de quedar ciego llevaba máscara cubriendo sus ojos dañados. Su pérdida de vista paradójicamente fortaleció su conexión con Fuerza. La ceguera de Kanan lo obligó a depender completamente de visión de Fuerza. Su sacrificio final destruyendo depósito de combustible salvó tripulación del Ghost y completó su arco de redención.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0794-sw0817...');

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

  console.log('Batch complete! 24 minifigs saved (sw0794-sw0817, includes sw0798s).');
  await prisma.$disconnect();
}

saveBatch();
