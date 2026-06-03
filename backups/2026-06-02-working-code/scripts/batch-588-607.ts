import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0588',
    name: 'Spy Droid',
    description_en: 'Imperial Spy Droids conducted covert surveillance and reconnaissance operations throughout occupied territories. These small hovering probes gathered intelligence for Imperial forces. Their compact design allowed infiltration of Rebel facilities. Spy droids represented the Empire\'s extensive surveillance network.',
    description_de: 'Imperiale Spionage-Droiden führten verdeckte Überwachungs- und Aufklärungsoperationen in besetzten Territorien durch. Diese kleinen schwebenden Sonden sammelten Informationen für imperiale Streitkräfte. Ihr kompaktes Design ermöglichte Infiltration von Rebelleneinrichtungen. Spionage-Droiden repräsentierten das umfangreiche Überwachungsnetzwerk des Imperiums.',
    description_fr: 'Les Droïdes Espions Impériaux menaient des opérations de surveillance secrète et de reconnaissance dans les territoires occupés. Ces petites sondes flottantes recueillaient des renseignements pour les forces impériales. Leur conception compacte permettait l\'infiltration des installations rebelles. Les droïdes espions représentaient le vaste réseau de surveillance de l\'Empire.',
    description_es: 'Los Droides Espía Imperiales realizaban operaciones de vigilancia encubierta y reconocimiento en territorios ocupados. Estas pequeñas sondas flotantes recopilaban inteligencia para fuerzas imperiales. Su diseño compacto permitía infiltración de instalaciones rebeldes. Los droides espía representaban la extensa red de vigilancia del Imperio.'
  },
  {
    minifigure_no: 'sw0589',
    name: 'Astromech Droid, R1-G4, Decorated Truncated Cone',
    description_en: 'R1-G4 was a distinctive astromech droid with decorated truncated cone design. These utility droids served starfighter pilots throughout the galaxy. Astromechs provided navigation, repair, and technical support during missions. Their unique color schemes and markings identified different units and owners.',
    description_de: 'R1-G4 war ein markanter Astromech-Droide mit dekoriertem gekürztem Kegel-Design. Diese Nutzdroi den dienten Sternjägerpiloten in der ganzen Galaxis. Astromechs boten Navigation, Reparatur und technische Unterstützung während Missionen. Ihre einzigartigen Farbschemata und Markierungen identifizierten verschiedene Einheiten und Besitzer.',
    description_fr: 'R1-G4 était un droïde astromech distinctif avec conception de cône tronqué décoré. Ces droïdes utilitaires servaient les pilotes de chasseurs stellaires dans toute la galaxie. Les astromechs fournissaient navigation, réparation et support technique pendant les missions. Leurs schémas de couleurs et marquages uniques identifiaient différentes unités et propriétaires.',
    description_es: 'R1-G4 era un droide astromech distintivo con diseño de cono truncado decorado. Estos droides utilitarios servían a pilotos de cazas estelares por toda la galaxia. Los astromechs proporcionaban navegación, reparación y soporte técnico durante misiones. Sus esquemas de color y marcas únicos identificaban diferentes unidades y propietarios.'
  },
  {
    minifigure_no: 'sw0590',
    name: 'Jawa with Gold Badge',
    description_en: 'This Jawa variant features a distinctive gold badge showing clan or trade status. Jawas scavenged the Tatooine deserts collecting technology for resale. Their organized scavenging operations were surprisingly sophisticated. The gold badge indicated leadership or specialized trader role within Jawa society.',
    description_de: 'Diese Jawa-Variante zeigt ein markantes goldenes Abzeichen, das Clan- oder Handelsstatus zeigt. Jawas plünderten die Tatooine-Wüsten und sammelten Technologie zum Weiterverkauf. Ihre organisierten Plünderungsoperationen waren überraschend ausgeklügelt. Das goldene Abzeichen zeigte Führung oder spezialisierte Händlerrolle innerhalb der Jawa-Gesellschaft.',
    description_fr: 'Cette variante Jawa présente un badge doré distinctif montrant le statut de clan ou de commerce. Les Jawas récupéraient dans les déserts de Tatooine collectant de la technologie pour la revente. Leurs opérations de récupération organisées étaient étonnamment sophistiquées. Le badge doré indiquait un leadership ou un rôle de commerçant spécialisé au sein de la société Jawa.',
    description_es: 'Esta variante Jawa presenta una insignia dorada distintiva mostrando estatus de clan o comercio. Los Jawas recolectaban en los desiertos de Tatooine recopilando tecnología para reventa. Sus operaciones de recolección organizadas eran sorprendentemente sofisticadas. La insignia dorada indicaba liderazgo o rol de comerciante especializado dentro de la sociedad Jawa.'
  },
  {
    minifigure_no: 'sw0591',
    name: 'PK-4 Droid',
    description_en: 'PK-4 worker droids performed menial labor throughout Imperial facilities and installations. These simple utility droids handled loading, cleaning, and basic maintenance tasks. Their cylindrical design made them efficient for repetitive work. Worker droids represented the lowest tier of droid society.',
    description_de: 'PK-4-Arbeiter-Droiden führten niedere Arbeit in imperialen Einrichtungen und Installationen durch. Diese einfachen Nutzdroi den erledigten Lade-, Reinigungs- und grundlegende Wartungsaufgaben. Ihr zylindrisches Design machte sie effizient für sich wiederholende Arbeit. Arbeiter-Droiden repräsentierten die unterste Ebene der Droiden-Gesellschaft.',
    description_fr: 'Les droïdes ouvriers PK-4 effectuaient des travaux subalternes dans les installations et facilités impériales. Ces droïdes utilitaires simples géraient le chargement, le nettoyage et les tâches de maintenance de base. Leur conception cylindrique les rendait efficaces pour le travail répétitif. Les droïdes ouvriers représentaient le niveau le plus bas de la société droïde.',
    description_es: 'Los droides trabajadores PK-4 realizaban trabajo servil en instalaciones y facilidades imperiales. Estos droides utilitarios simples manejaban carga, limpieza y tareas de mantenimiento básico. Su diseño cilíndrico los hacía eficientes para trabajo repetitivo. Los droides trabajadores representaban el nivel más bajo de la sociedad droide.'
  },
  {
    minifigure_no: 'sw0592',
    name: 'Obi-Wan Kenobi (Young, Printed Legs)',
    description_en: 'Young Obi-Wan Kenobi with printed legs represented his Jedi Knight years during the Clone Wars. As Anakin\'s master, Obi-Wan tried guiding his impulsive Padawan. His tactical brilliance and diplomatic skills made him a crucial Republic general. Obi-Wan\'s failure to prevent Anakin\'s fall haunted him forever.',
    description_de: 'Der junge Obi-Wan Kenobi mit bedruckten Beinen repräsentierte seine Jedi-Ritter-Jahre während der Klonkriege. Als Anakins Meister versuchte Obi-Wan, seinen impulsiven Padawan zu führen. Seine taktische Brillanz und diplomatischen Fähigkeiten machten ihn zu einem entscheidenden Republik-General. Obi-Wans Versagen, Anakins Fall zu verhindern, verfolgte ihn für immer.',
    description_fr: 'Le jeune Obi-Wan Kenobi avec jambes imprimées représentait ses années de Chevalier Jedi pendant les Guerres des Clones. En tant que maître d\'Anakin, Obi-Wan essayait de guider son Padawan impulsif. Son génie tactique et ses compétences diplomatiques en faisaient un général de la République crucial. L\'échec d\'Obi-Wan à empêcher la chute d\'Anakin l\'a hanté pour toujours.',
    description_es: 'El joven Obi-Wan Kenobi con piernas impresas representaba sus años de Caballero Jedi durante las Guerras Clon. Como maestro de Anakin, Obi-Wan intentaba guiar a su Padawan impulsivo. Su brillantez táctica y habilidades diplomáticas lo convirtieron en un general crucial de la República. El fracaso de Obi-Wan para prevenir la caída de Anakin lo persiguió para siempre.'
  },
  {
    minifigure_no: 'sw0593',
    name: 'Qui-Gon Jinn (Printed Legs)',
    description_en: 'Qui-Gon Jinn with printed legs showed the maverick Jedi Master who discovered Anakin Skywalker. His unorthodox methods and connection to the living Force set him apart. Qui-Gon\'s belief in Anakin as the Chosen One proved tragically correct. His death at Maul\'s hands left Anakin\'s training incomplete.',
    description_de: 'Qui-Gon Jinn mit bedruckten Beinen zeigte den eigensinnigen Jedi-Meister, der Anakin Skywalker entdeckte. Seine unorthodoxen Methoden und Verbindung zur lebenden Macht zeichneten ihn aus. Qui-Gons Glaube an Anakin als den Auserwählten erwies sich als tragisch richtig. Sein Tod durch Mauls Hand ließ Anakins Training unvollständig.',
    description_fr: 'Qui-Gon Jinn avec jambes imprimées montrait le Maître Jedi non-conformiste qui a découvert Anakin Skywalker. Ses méthodes peu orthodoxes et sa connexion à la Force vivante le distinguaient. La croyance de Qui-Gon en Anakin comme l\'Élu s\'est avérée tragiquement correcte. Sa mort aux mains de Maul a laissé la formation d\'Anakin incomplète.',
    description_es: 'Qui-Gon Jinn con piernas impresas mostraba al Maestro Jedi inconformista que descubrió a Anakin Skywalker. Sus métodos poco ortodoxos y conexión con la Fuerza viviente lo distinguían. La creencia de Qui-Gon en Anakin como el Elegido resultó trágicamente correcta. Su muerte a manos de Maul dejó el entrenamiento de Anakin incompleto.'
  },
  {
    minifigure_no: 'sw0594',
    name: 'Naboo Security Guard',
    description_en: 'Naboo Security Guards protected the peaceful planet during the Trade Federation occupation. Their distinctive helmets and uniforms represented Naboo\'s volunteer defense force. These guards fought bravely alongside Jedi to liberate their homeworld. Their loyalty to Queen Amidala never wavered during the crisis.',
    description_de: 'Naboo-Sicherheitswachen schützten den friedlichen Planeten während der Handelsföderation-Besatzung. Ihre markanten Helme und Uniformen repräsentierten Naboos freiwillige Verteidigungskraft. Diese Wachen kämpften tapfer an der Seite von Jedi, um ihre Heimatwelt zu befreien. Ihre Loyalität zu Königin Amidala wankte während der Krise nie.',
    description_fr: 'Les Gardes de Sécurité de Naboo protégeaient la planète paisible pendant l\'occupation de la Fédération du Commerce. Leurs casques et uniformes distinctifs représentaient la force de défense volontaire de Naboo. Ces gardes se sont battus courageusement aux côtés des Jedi pour libérer leur monde natal. Leur loyauté envers la Reine Amidala n\'a jamais faibli pendant la crise.',
    description_es: 'Los Guardias de Seguridad de Naboo protegían el planeta pacífico durante la ocupación de la Federación de Comercio. Sus cascos y uniformes distintivos representaban la fuerza de defensa voluntaria de Naboo. Estos guardias lucharon valientemente junto a Jedi para liberar su mundo natal. Su lealtad a la Reina Amidala nunca vaciló durante la crisis.'
  },
  {
    minifigure_no: 'sw0595',
    name: 'Emperor Palpatine - Tan Head, Tan Hands',
    description_en: 'Emperor Palpatine with tan head and hands showed the Sith Lord before his disfigurement. As Senator and Chancellor, he manipulated the Republic into the Empire. Palpatine\'s mastery of the dark side and political cunning made him the saga\'s ultimate villain. His transformation from politician to Emperor defined galactic tragedy.',
    description_de: 'Emperor Palpatine mit beigem Kopf und beigen Händen zeigte den Sith-Lord vor seiner Entstellung. Als Senator und Kanzler manipulierte er die Republik zum Imperium. Palpatines Beherrschung der dunklen Seite und politische List machten ihn zum ultimativen Bösewicht der Saga. Seine Verwandlung vom Politiker zum Imperator definierte galaktische Tragödie.',
    description_fr: 'L\'Empereur Palpatine avec tête et mains beiges montrait le Seigneur Sith avant sa défiguration. En tant que Sénateur et Chancelier, il a manipulé la République en Empire. La maîtrise du côté obscur et la ruse politique de Palpatine en faisaient le méchant ultime de la saga. Sa transformation de politicien en Empereur définissait la tragédie galactique.',
    description_es: 'El Emperador Palpatine con cabeza y manos beige mostraba al Señor Sith antes de su desfiguración. Como Senador y Canciller, manipuló la República en Imperio. El dominio del lado oscuro y astucia política de Palpatine lo convirtieron en el villano último de la saga. Su transformación de político a Emperador definió la tragedia galáctica.'
  },
  {
    minifigure_no: 'sw0596',
    name: 'Clone Trooper - Printed Legs, Santa Hat, Scowl',
    description_en: 'This festive Clone Trooper wears a Santa hat bringing holiday cheer to the galaxy far, far away. Holiday-themed Star Wars minifigures blend iconic characters with seasonal celebration. The scowling expression adds humor to the festive design. These special variants are highly sought by collectors.',
    description_de: 'Dieser festliche Klon-Truppen trägt eine Weihnachtsmannmütze und bringt Feiertagsstimmung in die weit, weit entfernte Galaxis. Feiertagsthematisierte Star-Wars-Minifiguren mischen ikonische Charaktere mit saisonaler Feier. Der mürrische Ausdruck fügt dem festlichen Design Humor hinzu. Diese speziellen Varianten sind bei Sammlern sehr begehrt.',
    description_fr: 'Ce Soldat Clone festif porte un bonnet de Père Noël apportant la joie des fêtes à la galaxie lointaine, très lointaine. Les minifigurines Star Wars sur le thème des vacances mélangent des personnages iconiques avec une célébration saisonnière. L\'expression renfrognée ajoute de l\'humour au design festif. Ces variantes spéciales sont très recherchées par les collectionneurs.',
    description_es: 'Este Soldado Clon festivo usa un gorro de Santa trayendo alegría navideña a la galaxia muy, muy lejana. Las minifiguras de Star Wars con tema festivo mezclan personajes icónicos con celebración estacional. La expresión ceñuda agrega humor al diseño festivo. Estas variantes especiales son muy buscadas por coleccionistas.'
  },
  {
    minifigure_no: 'sw0597',
    name: 'Snowspeeder Pilot - White Helmet, Headset',
    description_en: 'Snowspeeder pilots with white helmets and headsets defended Echo Base during the Battle of Hoth. These brave flyers used modified airspeeders against AT-AT walkers. Their innovative tow cable tactics proved effective against superior Imperial forces. Snowspeeder pilots bought crucial time for the Rebel evacuation.',
    description_de: 'Snowspeeder-Piloten mit weißen Helmen und Headsets verteidigten Echo Base während der Schlacht von Hoth. Diese mutigen Flieger benutzten modifizierte Luftgleiter gegen AT-AT-Walker. Ihre innovativen Abschleppseil-Taktiken erwiesen sich als effektiv gegen überlegene imperiale Streitkräfte. Snowspeeder-Piloten verschafften entscheidende Zeit für die Rebellenevakuierung.',
    description_fr: 'Les pilotes de Snowspeeder avec casques blancs et casques audio défendaient la Base Echo pendant la Bataille de Hoth. Ces braves pilotes utilisaient des speeders aériens modifiés contre les marcheurs AT-AT. Leurs tactiques innovantes de câble de remorquage se sont révélées efficaces contre les forces impériales supérieures. Les pilotes de Snowspeeder ont gagné un temps crucial pour l\'évacuation rebelle.',
    description_es: 'Los pilotos de Snowspeeder con cascos blancos y auriculares defendían Base Eco durante la Batalla de Hoth. Estos valientes pilotos usaban deslizadores aéreos modificados contra caminantes AT-AT. Sus tácticas innovadoras de cable de remolque resultaron efectivas contra fuerzas imperiales superiores. Los pilotos de Snowspeeder ganaron tiempo crucial para la evacuación rebelde.'
  },
  {
    minifigure_no: 'sw0598',
    name: 'Astromech Droid, Christmas',
    description_en: 'This festive Christmas astromech droid brings holiday decorations to the Star Wars universe. Holiday-themed droids combine beloved characters with seasonal traditions. Special edition minifigures like this are exclusive collectibles. Their limited availability makes them particularly valuable to collectors.',
    description_de: 'Dieser festliche Weihnachts-Astromech-Droide bringt Feiertagsdekorationen ins Star-Wars-Universum. Feiertagsthematisierte Droiden kombinieren geliebte Charaktere mit saisonalen Traditionen. Sonderausgaben-Minifiguren wie diese sind exklusive Sammlerstücke. Ihre begrenzte Verfügbarkeit macht sie für Sammler besonders wertvoll.',
    description_fr: 'Ce droïde astromech de Noël festif apporte des décorations de vacances à l\'univers Star Wars. Les droïdes sur le thème des vacances combinent des personnages bien-aimés avec des traditions saisonnières. Les minifigurines en édition spéciale comme celle-ci sont des objets de collection exclusifs. Leur disponibilité limitée les rend particulièrement précieuses pour les collectionneurs.',
    description_es: 'Este droide astromech navideño festivo trae decoraciones navideñas al universo de Star Wars. Los droides con tema festivo combinan personajes amados con tradiciones estacionales. Las minifiguras de edición especial como esta son coleccionables exclusivos. Su disponibilidad limitada los hace particularmente valiosos para coleccionistas.'
  },
  {
    minifigure_no: 'sw0599',
    name: 'Santa Darth Vader',
    description_en: 'Santa Darth Vader transforms the dark lord of the Sith into a jolly holiday figure. This humorous variant combines Vader\'s iconic appearance with Santa Claus elements. Holiday Star Wars minifigures are beloved for their whimsical crossover appeal. Collectors prize these limited seasonal releases.',
    description_de: 'Santa Darth Vader verwandelt den dunklen Lord der Sith in eine fröhliche Feiertagsfigur. Diese humorvolle Variante kombiniert Vaders ikonisches Erscheinungsbild mit Weihnachtsmann-Elementen. Feiertags-Star-Wars-Minifiguren sind beliebt für ihre skurrile Crossover-Anziehungskraft. Sammler schätzen diese begrenzten saisonalen Veröffentlichungen.',
    description_fr: 'Santa Dark Vador transforme le seigneur noir des Sith en une figure de vacances joyeuse. Cette variante humoristique combine l\'apparence iconique de Vador avec des éléments du Père Noël. Les minifigurines Star Wars de vacances sont adorées pour leur attrait de croisement fantaisiste. Les collectionneurs apprécient ces sorties saisonnières limitées.',
    description_es: 'Santa Darth Vader transforma al señor oscuro de los Sith en una figura festiva alegre. Esta variante humorística combina la apariencia icónica de Vader con elementos de Santa Claus. Las minifiguras festivas de Star Wars son amadas por su atractivo cruzado caprichoso. Los coleccionistas valoran estos lanzamientos estacionales limitados.'
  },
  {
    minifigure_no: 'sw0600',
    name: 'Security Battle Droid - Dark Red Torso with Tan Insignia, Angled Arm and Straight Arm',
    description_en: 'Security Battle Droids with dark red torsos and tan insignia served specialized protective roles. Their color scheme distinguished them from standard tan battle droids. These droids guarded important Separatist facilities and personnel. The mixed angled and straight arms showed manufacturing variations.',
    description_de: 'Sicherheits-Kampfdroiden mit dunklen roten Torsos und beigen Insignien dienten spezialisierten Schutzrollen. Ihr Farbschema unterschied sie von standardmäßigen beigen Kampfdroiden. Diese Droiden bewachten wichtige Separatisten-Einrichtungen und Personal. Die gemischten abgewinkelten und geraden Arme zeigten Herstellungsvariationen.',
    description_fr: 'Les Droïdes de Combat de Sécurité avec torses rouge foncé et insignes beiges servaient des rôles de protection spécialisés. Leur schéma de couleurs les distinguait des droïdes de combat beiges standard. Ces droïdes gardaient des installations et du personnel séparatistes importants. Les bras mixtes inclinés et droits montraient des variations de fabrication.',
    description_es: 'Los Droides de Batalla de Seguridad con torsos rojo oscuro e insignias beige servían roles protectores especializados. Su esquema de color los distinguía de droides de batalla beige estándar. Estos droides custodiaban instalaciones y personal separatista importantes. Los brazos mixtos angulados y rectos mostraban variaciones de fabricación.'
  },
  {
    minifigure_no: 'sw0601',
    name: 'Han Solo - Black Vest over Tan Shirt, Dark Blue Plain Legs',
    description_en: 'Han Solo in his classic smuggler outfit with black vest over tan shirt defined his roguish character. This iconic look appeared throughout the original trilogy. Han\'s transformation from selfish smuggler to Rebel hero became legendary. His practical vest-and-shirt combination suited his spacer lifestyle.',
    description_de: 'Han Solo in seinem klassischen Schmuggler-Outfit mit schwarzer Weste über beigem Hemd definierte seinen schelmischen Charakter. Dieser ikonische Look erschien während der gesamten Original-Trilogie. Hans Verwandlung vom egoistischen Schmuggler zum Rebellenhelden wurde legendär. Seine praktische Westen-und-Hemd-Kombination passte zu seinem Raumfahrer-Lebensstil.',
    description_fr: 'Han Solo dans sa tenue de contrebandier classique avec gilet noir sur chemise beige définissait son caractère roublard. Ce look iconique est apparu tout au long de la trilogie originale. La transformation de Han de contrebandier égoïste à héros rebelle est devenue légendaire. Sa combinaison pratique gilet-et-chemise convenait à son style de vie de voyageur spatial.',
    description_es: 'Han Solo en su atuendo clásico de contrabandista con chaleco negro sobre camisa beige definió su carácter pícaro. Esta apariencia icónica apareció a través de la trilogía original. La transformación de Han de contrabandista egoísta a héroe rebelde se volvió legendaria. Su combinación práctica de chaleco y camisa se adaptaba a su estilo de vida espacial.'
  },
  {
    minifigure_no: 'sw0602',
    name: 'Kanan Jarrus - Dark Brown Hair and Eyebrows',
    description_en: 'This Kanan Jarrus variant features dark brown hair and eyebrows from Star Wars Rebels. The Jedi Knight in hiding became Ezra\'s master and mentor. Kanan\'s journey from survivor to teacher restored his connection to the Force. His leadership of the Ghost crew inspired the growing Rebellion.',
    description_de: 'Diese Kanan-Jarrus-Variante zeigt dunkelbraune Haare und Augenbrauen aus Star Wars Rebels. Der Jedi-Ritter im Versteck wurde Ezras Meister und Mentor. Kanans Reise vom Überlebenden zum Lehrer stellte seine Verbindung zur Macht wieder her. Seine Führung der Ghost-Crew inspirierte die wachsende Rebellion.',
    description_fr: 'Cette variante de Kanan Jarrus présente des cheveux et des sourcils brun foncé de Star Wars Rebels. Le Chevalier Jedi caché est devenu le maître et mentor d\'Ezra. Le voyage de Kanan de survivant à enseignant a restauré sa connexion à la Force. Son leadership de l\'équipage du Ghost a inspiré la Rébellion grandissante.',
    description_es: 'Esta variante de Kanan Jarrus presenta cabello y cejas marrón oscuro de Star Wars Rebels. El Caballero Jedi escondido se convirtió en maestro y mentor de Ezra. El viaje de Kanan de sobreviviente a maestro restauró su conexión con la Fuerza. Su liderazgo de la tripulación del Ghost inspiró la Rebelión creciente.'
  },
  {
    minifigure_no: 'sw0603',
    name: 'Imperial Shadow Stormtrooper',
    description_en: 'Imperial Shadow Stormtroopers wore distinctive black armor for covert operations and elite missions. These specialized troops operated in darkness and stealth scenarios. Their black armor contrasted dramatically with standard white stormtroopers. Shadow troopers represented the Empire\'s special forces units.',
    description_de: 'Imperiale Shadow-Sturmtruppler trugen markante schwarze Rüstung für verdeckte Operationen und Elite-Missionen. Diese spezialisierten Truppen operierten in Dunkelheit und Stealth-Szenarien. Ihre schwarze Rüstung kontrastierte dramatisch mit standardmäßigen weißen Sturmtrupplern. Shadow-Truppen repräsentierten die Spezialeinheiten des Imperiums.',
    description_fr: 'Les Shadow Stormtroopers Impériaux portaient une armure noire distinctive pour les opérations secrètes et les missions d\'élite. Ces troupes spécialisées opéraient dans des scénarios d\'obscurité et de furtivité. Leur armure noire contrastait dramatiquement avec les stormtroopers blancs standard. Les shadow troopers représentaient les unités de forces spéciales de l\'Empire.',
    description_es: 'Los Shadow Stormtroopers Imperiales usaban armadura negra distintiva para operaciones encubiertas y misiones de élite. Estas tropas especializadas operaban en escenarios de oscuridad y sigilo. Su armadura negra contrastaba dramáticamente con stormtroopers blancos estándar. Los shadow troopers representaban las unidades de fuerzas especiales del Imperio.'
  },
  {
    minifigure_no: 'sw0604',
    name: 'Shadow Guard',
    description_en: 'Shadow Guards were elite Emperor\'s Royal Guards wearing distinctive black armor. These Force-sensitive warriors served as Palpatine\'s personal assassins and bodyguards. Their black armor and pike weapons made them fearsome opponents. Shadow Guards represented the darkest aspects of Imperial power.',
    description_de: 'Shadow-Wachen waren Elite-Imperiale-Leibwachen, die markante schwarze Rüstung trugen. Diese macht-empfindlichen Krieger dienten als Palpatines persönliche Assassinen und Leibwächter. Ihre schwarze Rüstung und Speer-Waffen machten sie zu furchterregenden Gegnern. Shadow-Wachen repräsentierten die dunkelsten Aspekte imperialer Macht.',
    description_fr: 'Les Shadow Guards étaient des Gardes Royaux de l\'Empereur d\'élite portant une armure noire distinctive. Ces guerriers sensibles à la Force servaient d\'assassins personnels et de gardes du corps de Palpatine. Leur armure noire et leurs armes de pique en faisaient des adversaires redoutables. Les Shadow Guards représentaient les aspects les plus sombres du pouvoir impérial.',
    description_es: 'Los Shadow Guards eran Guardias Reales del Emperador de élite usando armadura negra distintiva. Estos guerreros sensibles a la Fuerza servían como asesinos personales y guardaespaldas de Palpatine. Su armadura negra y armas de pica los convertían en oponentes temibles. Los Shadow Guards representaban los aspectos más oscuros del poder imperial.'
  },
  {
    minifigure_no: 'sw0605',
    name: 'Clone Airborne Trooper (Phase 2) - Geonosis Camouflage, Smirk',
    description_en: 'Clone Airborne Troopers with Geonosis camouflage specialized in aerial assault operations. This Phase 2 variant with smirk showed confident elite soldiers. Their desert camouflage pattern suited Geonosis terrain. Airborne troopers performed high-altitude drops and rapid deployment missions.',
    description_de: 'Klon-Luftlande-Truppen mit Geonosis-Tarnung spezialisierten sich auf Luft-Angriffs-Operationen. Diese Phase-2-Variante mit Grinsen zeigte selbstbewusste Elite-Soldaten. Ihr Wüsten-Tarnmuster passte zu Geonosis-Gelände. Luftlande-Truppen führten Hochhöhen-Abwürfe und schnelle Einsatzmissionen durch.',
    description_fr: 'Les Soldats Aéroportés Clones avec camouflage Geonosis se spécialisaient dans les opérations d\'assaut aérien. Cette variante Phase 2 avec sourire narquois montrait des soldats d\'élite confiants. Leur motif de camouflage désertique convenait au terrain de Geonosis. Les soldats aéroportés effectuaient des largages en haute altitude et des missions de déploiement rapide.',
    description_es: 'Los Soldados Aerotransportados Clon con camuflaje de Geonosis se especializaban en operaciones de asalto aéreo. Esta variante Fase 2 con sonrisa mostraba soldados de élite confiados. Su patrón de camuflaje desértico se adaptaba al terreno de Geonosis. Los soldados aerotransportados realizaban lanzamientos de gran altitud y misiones de despliegue rápido.'
  },
  {
    minifigure_no: 'sw0606',
    name: 'Clone Trooper (Phase 2) - Geonosis Camouflage, Scowl',
    description_en: 'Phase 2 Clone Troopers in Geonosis camouflage fought in the desert battlefields of the Clone Wars. This scowling variant showed battle-hardened determination. The red desert camouflage provided tactical advantage on Geonosis. These elite soldiers formed the backbone of Republic ground forces.',
    description_de: 'Phase-2-Klon-Truppen in Geonosis-Tarnung kämpften auf den Wüsten-Schlachtfeldern der Klonkriege. Diese mürrische Variante zeigte kampferprobte Entschlossenheit. Die rote Wüstentarnung bot taktischen Vorteil auf Geonosis. Diese Elite-Soldaten bildeten das Rückgrat der Republik-Bodentruppen.',
    description_fr: 'Les Soldats Clones Phase 2 en camouflage Geonosis se battaient dans les champs de bataille désertiques des Guerres des Clones. Cette variante renfrognée montrait une détermination endurcie au combat. Le camouflage désertique rouge fournissait un avantage tactique sur Geonosis. Ces soldats d\'élite formaient l\'épine dorsale des forces terrestres de la République.',
    description_es: 'Los Soldados Clon Fase 2 en camuflaje de Geonosis luchaban en los campos de batalla desérticos de las Guerras Clon. Esta variante ceñuda mostraba determinación curtida en batalla. El camuflaje desértico rojo proporcionaba ventaja táctica en Geonosis. Estos soldados de élite formaban la columna vertebral de fuerzas terrestres de la República.'
  },
  {
    minifigure_no: 'sw0607',
    name: 'Snowspeeder Pilot - Light Bluish Gray Helmet',
    description_en: 'Snowspeeder pilots with light bluish gray helmets flew T-47 airspeeders during the Battle of Hoth. These brave pilots faced overwhelming odds against AT-AT walkers. Their tow cable tactics proved effective despite being outgunned. Snowspeeder pilots became heroes of the Hoth evacuation.',
    description_de: 'Snowspeeder-Piloten mit hellbläulich-grauen Helmen flogen T-47-Luftgleiter während der Schlacht von Hoth. Diese mutigen Piloten standen überwältigenden Chancen gegen AT-AT-Walker gegenüber. Ihre Abschleppseil-Taktiken erwiesen sich als effektiv trotz Unterlegenheit. Snowspeeder-Piloten wurden zu Helden der Hoth-Evakuierung.',
    description_fr: 'Les pilotes de Snowspeeder avec casques gris bleuté clair pilotaient des speeders aériens T-47 pendant la Bataille de Hoth. Ces braves pilotes faisaient face à des chances écrasantes contre les marcheurs AT-AT. Leurs tactiques de câble de remorquage se sont révélées efficaces malgré l\'infériorité en armes. Les pilotes de Snowspeeder sont devenus des héros de l\'évacuation de Hoth.',
    description_es: 'Los pilotos de Snowspeeder con cascos gris azulado claro volaban deslizadores aéreos T-47 durante la Batalla de Hoth. Estos valientes pilotos enfrentaban probabilidades abrumadoras contra caminantes AT-AT. Sus tácticas de cable de remolque resultaron efectivas a pesar de estar superados en armas. Los pilotos de Snowspeeder se convirtieron en héroes de la evacuación de Hoth.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0588-sw0607...');

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

  console.log('Batch complete! 20 minifigs saved.');
  await prisma.$disconnect();
}

saveBatch();
