import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0608',
    name: 'Clone Trooper Pilot (Phase 2) - Light Bluish Gray Arms and Legs, Light Nougat Head',
    description_en: 'Phase 2 Clone Trooper Pilots flew Republic starfighters with updated armor and equipment. This variant with light bluish gray limbs showed pilot-specific gear. These skilled aviators flew V-19 Torrents, ARC-170s, and Y-wings. Clone pilots provided crucial air support throughout the Clone Wars.',
    description_de: 'Phase-2-Klon-Truppen-Piloten flogen Republik-Sternjäger mit aktualisierter Rüstung und Ausrüstung. Diese Variante mit hellbläulich-grauen Gliedmaßen zeigte pilotenspezifische Ausrüstung. Diese geschickten Flieger flogen V-19 Torrents, ARC-170s und Y-Wings. Klon-Piloten boten entscheidende Luftunterstützung während der Klonkriege.',
    description_fr: 'Les Pilotes de Soldats Clones Phase 2 pilotaient des chasseurs stellaires de la République avec armure et équipement mis à jour. Cette variante avec membres gris bleuté clair montrait l\'équipement spécifique au pilote. Ces aviateurs qualifiés pilotaient des V-19 Torrents, ARC-170 et Y-wings. Les pilotes clones fournissaient un soutien aérien crucial tout au long des Guerres des Clones.',
    description_es: 'Los Pilotos de Soldados Clon Fase 2 volaban cazas estelares de la República con armadura y equipo actualizado. Esta variante con extremidades gris azulado claro mostraba equipo específico de piloto. Estos aviadores hábiles volaban V-19 Torrents, ARC-170s y Y-wings. Los pilotos clon proporcionaban soporte aéreo crucial a través de las Guerras Clon.'
  },
  {
    minifigure_no: 'sw0609',
    name: 'Clone Trooper Pilot (Phase 1) - Bright Light Orange Markings, Printed Legs, Scowl',
    description_en: 'Phase 1 Clone Pilots wore distinctive bright light orange markings during early Clone Wars operations. This scowling variant with printed legs showed battle-ready determination. Phase 1 armor predated the refined Phase 2 designs. These pilots flew dangerous missions protecting Republic forces.',
    description_de: 'Phase-1-Klon-Piloten trugen markante hellleuchtend orange Markierungen während früher Klonkrieg-Operationen. Diese mürrische Variante mit bedruckten Beinen zeigte kampfbereite Entschlossenheit. Phase-1-Rüstung kam vor den verfeinerten Phase-2-Designs. Diese Piloten flogen gefährliche Missionen zum Schutz der Republik-Streitkräfte.',
    description_fr: 'Les Pilotes Clones Phase 1 portaient des marques orange clair vif distinctives pendant les premières opérations des Guerres des Clones. Cette variante renfrognée avec jambes imprimées montrait une détermination prête au combat. L\'armure Phase 1 précédait les designs Phase 2 raffinés. Ces pilotes pilotaient des missions dangereuses protégeant les forces de la République.',
    description_es: 'Los Pilotos Clon Fase 1 usaban marcas naranja claro brillante distintivas durante operaciones tempranas de Guerras Clon. Esta variante ceñuda con piernas impresas mostraba determinación lista para batalla. La armadura Fase 1 precedía los diseños Fase 2 refinados. Estos pilotos volaban misiones peligrosas protegiendo fuerzas de la República.'
  },
  {
    minifigure_no: 'sw0610',
    name: 'Boba Fett - Pauldron, Helmet, Jet Pack, Printed Arms and Legs',
    description_en: 'Boba Fett with full equipment including pauldron, helmet, jet pack, and printed limbs represented the galaxy\'s most feared bounty hunter. His Mandalorian armor and weapons made him legendary. Boba\'s reputation for always getting his target made him invaluable to the Empire. His survival skills were unmatched.',
    description_de: 'Boba Fett mit voller Ausrüstung einschließlich Pauldron, Helm, Jetpack und bedruckten Gliedmaßen repräsentierte den gefürchtetsten Kopfgeldjäger der Galaxis. Seine mandalorianische Rüstung und Waffen machten ihn legendär. Bobas Ruf, immer sein Ziel zu bekommen, machte ihn für das Imperium unschätzbar. Seine Überlebensfähigkeiten waren unübertroffen.',
    description_fr: 'Boba Fett avec équipement complet incluant paulette, casque, jetpack et membres imprimés représentait le chasseur de primes le plus craint de la galaxie. Son armure et ses armes mandalorien le rendaient légendaire. La réputation de Boba pour toujours obtenir sa cible le rendait inestimable pour l\'Empire. Ses compétences de survie étaient inégalées.',
    description_es: 'Boba Fett con equipo completo incluyendo hombrera, casco, jet pack y extremidades impresas representaba al cazarrecompensas más temido de la galaxia. Su armadura y armas mandalorianas lo hicieron legendario. La reputación de Boba por siempre conseguir su objetivo lo hacía invaluable para el Imperio. Sus habilidades de supervivencia eran inigualables.'
  },
  {
    minifigure_no: 'sw0611',
    name: 'Bespin Guard - Light Nougat Head, Detailed Gold Trim, Neutral Expression',
    description_en: 'Bespin Guards with detailed gold trim protected Cloud City under Lando Calrissian\'s administration. This variant with neutral expression and light nougat head showed guard diversity. These security forces maintained order in the tibanna gas mining facility. Imperial occupation forced them into difficult positions.',
    description_de: 'Bespin-Wachen mit detailliertem Goldbesatz schützten Cloud City unter Lando Calrissians Verwaltung. Diese Variante mit neutralem Ausdruck und hellem Nougat-Kopf zeigte Wachen-Vielfalt. Diese Sicherheitskräfte hielten Ordnung in der Tibanna-Gas-Bergbauanlage. Die imperiale Besatzung zwang sie in schwierige Positionen.',
    description_fr: 'Les Gardes Bespin avec garniture dorée détaillée protégeaient la Cité des Nuages sous l\'administration de Lando Calrissian. Cette variante avec expression neutre et tête nougat clair montrait la diversité des gardes. Ces forces de sécurité maintenaient l\'ordre dans l\'installation minière de gaz tibanna. L\'occupation impériale les forçait dans des positions difficiles.',
    description_es: 'Los Guardias Bespin con ribete dorado detallado protegían Ciudad Nube bajo la administración de Lando Calrissian. Esta variante con expresión neutral y cabeza beige claro mostraba diversidad de guardias. Estas fuerzas de seguridad mantenían orden en la instalación minera de gas tibanna. La ocupación imperial los forzó a posiciones difíciles.'
  },
  {
    minifigure_no: 'sw0612',
    name: 'Han Solo - White Shirt with Wrinkles on Front, Reddish Brown Legs, Dual Sided Head, Cheek Lines',
    description_en: 'This detailed Han Solo features dual-sided head with cheek lines showing different expressions. His white shirt with wrinkles and reddish brown legs captured his practical smuggler style. The dual-sided head allowed display of confident or concerned expressions. This variant offered enhanced character detail.',
    description_de: 'Dieser detaillierte Han Solo zeigt doppelseitigen Kopf mit Wangenlinien, die verschiedene Ausdrücke zeigen. Sein weißes Hemd mit Falten und rotbraunen Beinen erfasste seinen praktischen Schmuggler-Stil. Der doppelseitige Kopf ermöglichte Anzeige selbstbewusster oder besorgter Ausdrücke. Diese Variante bot verbesserte Charakter-Details.',
    description_fr: 'Ce Han Solo détaillé présente une tête double face avec lignes de joues montrant différentes expressions. Sa chemise blanche avec plis et jambes brun rougeâtre capturait son style de contrebandier pratique. La tête double face permettait l\'affichage d\'expressions confiantes ou inquiètes. Cette variante offrait des détails de personnage améliorés.',
    description_es: 'Este Han Solo detallado presenta cabeza de doble cara con líneas de mejillas mostrando diferentes expresiones. Su camisa blanca con arrugas y piernas marrón rojizo capturaba su estilo de contrabandista práctico. La cabeza de doble cara permitía mostrar expresiones confiadas o preocupadas. Esta variante ofrecía detalle de personaje mejorado.'
  },
  {
    minifigure_no: 'sw0613',
    name: 'Senate Commando Captain - Printed Legs',
    description_en: 'Senate Commando Captains led elite security forces protecting the Galactic Senate. This variant with printed legs showed command authority. These highly trained soldiers defended Senators and Republic facilities. Their blue armor and specialized equipment marked them as elite troops.',
    description_de: 'Senate-Commando-Captains führten Elite-Sicherheitskräfte zum Schutz des Galaktischen Senats an. Diese Variante mit bedruckten Beinen zeigte Befehlsgewalt. Diese hochqualifizierten Soldaten verteidigten Senatoren und Republik-Einrichtungen. Ihre blaue Rüstung und spezialisierte Ausrüstung kennzeichneten sie als Elite-Truppen.',
    description_fr: 'Les Capitaines de Commando du Sénat dirigeaient des forces de sécurité d\'élite protégeant le Sénat Galactique. Cette variante avec jambes imprimées montrait l\'autorité de commandement. Ces soldats hautement qualifiés défendaient les Sénateurs et les installations de la République. Leur armure bleue et équipement spécialisé les marquaient comme troupes d\'élite.',
    description_es: 'Los Capitanes de Comando del Senado lideraban fuerzas de seguridad de élite protegiendo el Senado Galáctico. Esta variante con piernas impresas mostraba autoridad de comando. Estos soldados altamente entrenados defendían Senadores e instalaciones de la República. Su armadura azul y equipo especializado los marcaban como tropas de élite.'
  },
  {
    minifigure_no: 'sw0614',
    name: 'Senate Commando - Printed Legs',
    description_en: 'Senate Commandos were elite Republic security forces guarding government facilities. This variant with printed legs showed standard commando gear. These soldiers underwent extensive training in combat and protection protocols. Their blue armor distinguished them from standard clone troopers.',
    description_de: 'Senate-Commandos waren Elite-Republik-Sicherheitskräfte, die Regierungseinrichtungen bewachten. Diese Variante mit bedruckten Beinen zeigte Standard-Commando-Ausrüstung. Diese Soldaten durchliefen umfangreiches Training in Kampf- und Schutzprotokollen. Ihre blaue Rüstung unterschied sie von Standard-Klon-Truppen.',
    description_fr: 'Les Commandos du Sénat étaient des forces de sécurité de la République d\'élite gardant les installations gouvernementales. Cette variante avec jambes imprimées montrait l\'équipement de commando standard. Ces soldats suivaient une formation extensive en protocoles de combat et de protection. Leur armure bleue les distinguait des soldats clones standard.',
    description_es: 'Los Comandos del Senado eran fuerzas de seguridad de élite de la República custodiando instalaciones gubernamentales. Esta variante con piernas impresas mostraba equipo de comando estándar. Estos soldados se sometían a entrenamiento extenso en protocolos de combate y protección. Su armadura azul los distinguía de soldados clon estándar.'
  },
  {
    minifigure_no: 'sw0615',
    name: 'Asajj Ventress - White Torso',
    description_en: 'Asajj Ventress with white torso was a deadly Sith assassin and Dark Jedi. Her bald head and facial tattoos made her instantly recognizable. Ventress served Count Dooku during the Clone Wars before becoming a bounty hunter. Her twin lightsabers and Force abilities made her a fearsome opponent.',
    description_de: 'Asajj Ventress mit weißem Torso war eine tödliche Sith-Assassinin und Dunkle Jedi. Ihr kahler Kopf und Gesichtstattoos machten sie sofort erkennbar. Ventress diente Count Dooku während der Klonkriege, bevor sie Kopfgeldjägerin wurde. Ihre Zwillings-Lichtschwerter und Macht-Fähigkeiten machten sie zu einer furchteinflößenden Gegnerin.',
    description_fr: 'Asajj Ventress avec torse blanc était une assassin Sith mortelle et Jedi Noire. Sa tête chauve et ses tatouages faciaux la rendaient instantanément reconnaissable. Ventress a servi le Comte Dooku pendant les Guerres des Clones avant de devenir chasseuse de primes. Ses sabres laser jumeaux et ses capacités de Force en faisaient une adversaire redoutable.',
    description_es: 'Asajj Ventress con torso blanco era una asesina Sith mortal y Jedi Oscura. Su cabeza calva y tatuajes faciales la hacían instantáneamente reconocible. Ventress sirvió al Conde Dooku durante las Guerras Clon antes de convertirse en cazarrecompensas. Sus sables de luz gemelos y habilidades de Fuerza la convertían en una oponente temible.'
  },
  {
    minifigure_no: 'sw0616',
    name: 'Sabine Wren - Dark Blue Hair with Orange Highlights',
    description_en: 'Sabine Wren was a Mandalorian explosives expert and artist from Star Wars Rebels. This variant with dark blue hair and orange highlights captured her rebellious style. Sabine\'s artistic talents extended from graffiti to bomb design. Her Mandalorian heritage and creativity made her invaluable to the Ghost crew.',
    description_de: 'Sabine Wren war eine mandalorianische Sprengstoff-Expertin und Künstlerin aus Star Wars Rebels. Diese Variante mit dunkelblauen Haaren und orangen Highlights erfasste ihren rebellischen Stil. Sabines künstlerische Talente erstreckten sich von Graffiti bis Bomben-Design. Ihr mandalorianisches Erbe und Kreativität machten sie für die Ghost-Crew unschätzbar.',
    description_fr: 'Sabine Wren était une experte en explosifs mandalorienne et artiste de Star Wars Rebels. Cette variante avec cheveux bleu foncé et mèches orange capturait son style rebelle. Les talents artistiques de Sabine s\'étendaient du graffiti à la conception de bombes. Son héritage mandalorien et sa créativité la rendaient inestimable pour l\'équipage du Ghost.',
    description_es: 'Sabine Wren era una experta en explosivos mandaloriana y artista de Star Wars Rebels. Esta variante con cabello azul oscuro y reflejos naranjas capturaba su estilo rebelde. Los talentos artísticos de Sabine se extendían desde graffiti hasta diseño de bombas. Su herencia mandaloriana y creatividad la hacían invaluable para la tripulación del Ghost.'
  },
  {
    minifigure_no: 'sw0617',
    name: 'Imperial Stormtrooper - Printed Legs, Dark Azure Helmet Vents, Frown',
    description_en: 'This stormtrooper variant features printed legs, dark azure helmet vents, and frowning expression. Imperial shock troops enforced order throughout occupied territories. Their intimidating presence maintained control through fear. Mass-produced stormtroopers represented the Empire\'s vast military resources.',
    description_de: 'Diese Sturmtruppler-Variante zeigt bedruckte Beine, dunkelazurblaue Helm-Belüftungen und mürrischen Ausdruck. Imperiale Stoßtruppen setzten Ordnung in besetzten Territorien durch. Ihre einschüchternde Präsenz hielt Kontrolle durch Angst aufrecht. Massenproduzierte Sturmtruppler repräsentierten die riesigen militärischen Ressourcen des Imperiums.',
    description_fr: 'Cette variante de stormtrooper présente des jambes imprimées, des évents de casque azur foncé et une expression renfrognée. Les troupes de choc impériales appliquaient l\'ordre dans les territoires occupés. Leur présence intimidante maintenait le contrôle par la peur. Les stormtroopers produits en masse représentaient les vastes ressources militaires de l\'Empire.',
    description_es: 'Esta variante de stormtrooper presenta piernas impresas, ventilaciones de casco azul oscuro y expresión ceñuda. Las tropas de choque imperiales aplicaban orden en territorios ocupados. Su presencia intimidante mantenía control mediante miedo. Los stormtroopers producidos en masa representaban los vastos recursos militares del Imperio.'
  },
  {
    minifigure_no: 'sw0618',
    name: 'Anakin Skywalker (Clone Trooper Head)',
    description_en: 'Anakin Skywalker disguised with clone trooper helmet infiltrated enemy positions during Clone Wars missions. This unique variant showed his tactical versatility. Anakin\'s unconventional methods often succeeded despite breaking protocol. His ability to blend with clone troops demonstrated his combat creativity.',
    description_de: 'Anakin Skywalker verkleidet mit Klon-Truppen-Helm infiltrierte feindliche Positionen während Klonkrieg-Missionen. Diese einzigartige Variante zeigte seine taktische Vielseitigkeit. Anakins unkonventionelle Methoden hatten oft Erfolg trotz Protokollbruchs. Seine Fähigkeit, sich mit Klon-Truppen zu vermischen, demonstrierte seine Kampf-Kreativität.',
    description_fr: 'Anakin Skywalker déguisé avec casque de soldat clone infiltrait les positions ennemies pendant les missions des Guerres des Clones. Cette variante unique montrait sa polyvalence tactique. Les méthodes non conventionnelles d\'Anakin réussissaient souvent malgré la violation du protocole. Sa capacité à se fondre avec les soldats clones démontrait sa créativité au combat.',
    description_es: 'Anakin Skywalker disf razado con casco de soldado clon infiltraba posiciones enemigas durante misiones de Guerras Clon. Esta variante única mostraba su versatilidad táctica. Los métodos no convencionales de Anakin a menudo tenían éxito a pesar de romper protocolo. Su habilidad para mezclarse con tropas clon demostró su creatividad de combate.'
  },
  {
    minifigure_no: 'sw0619',
    name: 'T-16 Skyhopper Pilot - Light Bluish Gray Helmet',
    description_en: 'T-16 Skyhopper pilots flew civilian airspeeders on backwater planets like Tatooine. This pilot with light bluish gray helmet represented young adventurers. Luke Skywalker honed his piloting skills in his T-16 before joining the Rebellion. These civilian craft provided essential training for future starfighter pilots.',
    description_de: 'T-16-Skyhopper-Piloten flogen zivile Luftgleiter auf Hinterwäldler-Planeten wie Tatooine. Dieser Pilot mit hellbläulich-grauem Helm repräsentierte junge Abenteurer. Luke Skywalker verfeinerte seine Pilotenfähigkeiten in seinem T-16 vor dem Beitritt zur Rebellion. Diese Zivilfahrzeuge boten essentielles Training für zukünftige Sternjäger-Piloten.',
    description_fr: 'Les pilotes de T-16 Skyhopper pilotaient des speeders aériens civils sur des planètes arriérées comme Tatooine. Ce pilote avec casque gris bleuté clair représentait de jeunes aventuriers. Luke Skywalker a perfectionné ses compétences de pilotage dans son T-16 avant de rejoindre la Rébellion. Ces appareils civils fournissaient une formation essentielle pour les futurs pilotes de chasseurs stellaires.',
    description_es: 'Los pilotos de T-16 Skyhopper volaban deslizadores aéreos civiles en planetas atrasados como Tatooine. Este piloto con casco gris azulado claro representaba jóvenes aventureros. Luke Skywalker perfeccionó sus habilidades de pilotaje en su T-16 antes de unirse a la Rebelión. Estas naves civiles proporcionaban entrenamiento esencial para futuros pilotos de cazas estelares.'
  },
  {
    minifigure_no: 'sw0620',
    name: 'Tusken Raider - Dark Tan Head with Spikes, Crossed Belts, Printed Legs',
    description_en: 'Tusken Raiders with detailed dark tan heads and crossed belts terrorized Tatooine\'s wastes. These fierce nomads attacked moisture farmers and travelers. Their distinctive spiked masks and robes made them fearsome desert dwellers. Tusken culture revolved around survival in harsh desert conditions.',
    description_de: 'Tusken-Räuber mit detaillierten dunkel beigen Köpfen und gekreuzten Gürteln terrorisierten Tatooines Einöden. Diese wilden Nomaden griffen Feuchtigkeitsfarmer und Reisende an. Ihre markanten Stachel-Masken und Roben machten sie zu furchterregenden Wüstenbewohnern. Die Tusken-Kultur drehte sich um Überleben in rauen Wüstenbedingungen.',
    description_fr: 'Les Pillards Tusken avec têtes beiges foncées détaillées et ceintures croisées terrorisaient les déchets de Tatooine. Ces nomades féroces attaquaient les fermiers d\'humidité et les voyageurs. Leurs masques à pointes distinctifs et leurs robes en faisaient de redoutables habitants du désert. La culture Tusken tournait autour de la survie dans des conditions désertiques difficiles.',
    description_es: 'Los Asaltantes Tusken con cabezas beige oscuro detalladas y cinturones cruzados aterrorizaban los páramos de Tatooine. Estos nómadas feroces atacaban granjeros de humedad y viajeros. Sus máscaras con púas distintivas y túnicas los convertían en temibles habitantes del desierto. La cultura Tusken giraba en torno a la supervivencia en condiciones desérticas duras.'
  },
  {
    minifigure_no: 'sw0621',
    name: 'Imperial TIE Fighter Pilot - Rebels',
    description_en: 'Imperial TIE Fighter Pilots from Star Wars Rebels featured updated design details. These elite pilots flew TIE fighters enforcing Imperial control. Their black flight suits contained essential life support systems. TIE pilots represented the Empire\'s vast starfighter corps throughout the Rebels era.',
    description_de: 'Imperiale TIE-Fighter-Piloten aus Star Wars Rebels zeigten aktualisierte Design-Details. Diese Elite-Piloten flogen TIE-Fighter zur Durchsetzung imperialer Kontrolle. Ihre schwarzen Fluganzüge enthielten essentielle Lebenserhaltungssysteme. TIE-Piloten repräsentierten das riesige Sternjäger-Korps des Imperiums während der Rebels-Ära.',
    description_fr: 'Les Pilotes de Chasseurs TIE Impériaux de Star Wars Rebels présentaient des détails de conception mis à jour. Ces pilotes d\'élite pilotaient des chasseurs TIE appliquant le contrôle impérial. Leurs combinaisons de vol noires contenaient des systèmes de support vital essentiels. Les pilotes TIE représentaient le vaste corps de chasseurs stellaires de l\'Empire tout au long de l\'ère Rebels.',
    description_es: 'Los Pilotos de Cazas TIE Imperiales de Star Wars Rebels presentaban detalles de diseño actualizados. Estos pilotos de élite volaban cazas TIE aplicando control imperial. Sus trajes de vuelo negros contenían sistemas de soporte vital esenciales. Los pilotos TIE representaban el vasto cuerpo de cazas estelares del Imperio durante la era Rebels.'
  },
  {
    minifigure_no: 'sw0622',
    name: 'The Grand Inquisitor - Dark Bluish Gray Uniform',
    description_en: 'The Grand Inquisitor led the Empire\'s Jedi-hunting Inquisitorius in Star Wars Rebels. This Pau\'an Force user wore distinctive dark bluish gray uniform. His double-bladed spinning lightsaber and dark side abilities made him deadly. The Grand Inquisitor represented the Empire\'s systematic elimination of surviving Jedi.',
    description_de: 'Der Großinquisitor führte das Jedi-jagende Inquisitorius des Imperiums in Star Wars Rebels an. Dieser Pau\'an-Macht-Nutzer trug markante dunkle bläulich-graue Uniform. Sein doppelklingiges drehendes Lichtschwert und Fähigkeiten der dunklen Seite machten ihn tödlich. Der Großinquisitor repräsentierte die systematische Eliminierung überlebender Jedi durch das Imperium.',
    description_fr: 'Le Grand Inquisiteur dirigeait l\'Inquisitorius chasseur de Jedi de l\'Empire dans Star Wars Rebels. Cet utilisateur de la Force Pau\'an portait un uniforme gris bleuté foncé distinctif. Son sabre laser tournant à double lame et ses capacités du côté obscur le rendaient mortel. Le Grand Inquisiteur représentait l\'élimination systématique des Jedi survivants par l\'Empire.',
    description_es: 'El Gran Inquisidor lideraba el Inquisitorius cazador de Jedi del Imperio en Star Wars Rebels. Este usuario de la Fuerza Pau\'an usaba uniforme gris azulado oscuro distintivo. Su sable de luz giratorio de doble hoja y habilidades del lado oscuro lo hacían mortal. El Gran Inquisidor representaba la eliminación sistemática de Jedi supervivientes por el Imperio.'
  },
  {
    minifigure_no: 'sw0623',
    name: 'Imperial Officer (Captain / Commandant / Commander) - Dark Tan Uniform',
    description_en: 'Imperial Officers in dark tan uniforms commanded ground forces and installations. These mid-level commanders coordinated tactical operations. The tan uniform distinguished army officers from navy personnel in black. Officers enforced Imperial order through military discipline and control.',
    description_de: 'Imperiale Offiziere in dunklen beigen Uniformen befehligten Bodentruppen und Installationen. Diese mittleren Kommandanten koordinierten taktische Operationen. Die beige Uniform unterschied Armee-Offiziere von Marine-Personal in Schwarz. Offiziere setzten imperiale Ordnung durch militärische Disziplin und Kontrolle durch.',
    description_fr: 'Les Officiers Impériaux en uniformes beiges foncés commandaient les forces terrestres et les installations. Ces commandants de niveau intermédiaire coordonnaient les opérations tactiques. L\'uniforme beige distinguait les officiers de l\'armée du personnel de la marine en noir. Les officiers appliquaient l\'ordre impérial par la discipline et le contrôle militaires.',
    description_es: 'Los Oficiales Imperiales en uniformes beige oscuro comandaban fuerzas terrestres e instalaciones. Estos comandantes de nivel medio coordinaban operaciones tácticas. El uniforme beige distinguía oficiales del ejército de personal naval en negro. Los oficiales aplicaban orden imperial mediante disciplina y control militar.'
  },
  {
    minifigure_no: 'sw0624',
    name: 'AT-DP Pilot (Imperial Combat Driver - White Uniform)',
    description_en: 'AT-DP Pilots drove All Terrain Defense Pod walkers during Imperial occupation operations in Rebels. These drivers wore white uniforms with specialized equipment. The AT-DP provided mobile firepower for Imperial ground forces. Pilots required training to operate these bipedal combat vehicles.',
    description_de: 'AT-DP-Piloten fuhren All Terrain Defense Pod-Walker während imperialer Besatzungsoperationen in Rebels. Diese Fahrer trugen weiße Uniformen mit spezialisierter Ausrüstung. Der AT-DP bot mobile Feuerkraft für imperiale Bodentruppen. Piloten benötigten Training zur Bedienung dieser zweibeinigen Kampffahrzeuge.',
    description_fr: 'Les Pilotes AT-DP conduisaient des marcheurs All Terrain Defense Pod pendant les opérations d\'occupation impériale dans Rebels. Ces pilotes portaient des uniformes blancs avec équipement spécialisé. L\'AT-DP fournissait une puissance de feu mobile pour les forces terrestres impériales. Les pilotes nécessitaient une formation pour opérer ces véhicules de combat bipèdes.',
    description_es: 'Los Pilotos AT-DP conducían caminantes All Terrain Defense Pod durante operaciones de ocupación imperial en Rebels. Estos pilotos usaban uniformes blancos con equipo especializado. El AT-DP proporcionaba poder de fuego móvil para fuerzas terrestres imperiales. Los pilotos requerían entrenamiento para operar estos vehículos de combate bípedos.'
  },
  {
    minifigure_no: 'sw0625',
    name: 'Agent Alexsandr Kallus - Helmet',
    description_en: 'Agent Kallus with helmet was an Imperial ISB agent hunting the Ghost crew in Rebels. His tactical expertise and weapons training made him dangerous. Kallus eventually defected to the Rebellion after learning Imperial truth. His redemption arc showed the possibility of changing sides.',
    description_de: 'Agent Kallus mit Helm war ein imperialer ISB-Agent, der die Ghost-Crew in Rebels jagte. Seine taktische Expertise und Waffen-Training machten ihn gefährlich. Kallus desertierte schließlich zur Rebellion, nachdem er die imperiale Wahrheit erfuhr. Sein Erlösungsbogen zeigte die Möglichkeit, die Seiten zu wechseln.',
    description_fr: 'L\'Agent Kallus avec casque était un agent ISB impérial chassant l\'équipage du Ghost dans Rebels. Son expertise tactique et son entraînement aux armes le rendaient dangereux. Kallus a finalement déserté vers la Rébellion après avoir appris la vérité impériale. Son arc de rédemption montrait la possibilité de changer de camp.',
    description_es: 'El Agente Kallus con casco era un agente ISB imperial cazando a la tripulación del Ghost en Rebels. Su pericia táctica y entrenamiento en armas lo hacían peligroso. Kallus eventualmente desertó a la Rebelión después de aprender la verdad imperial. Su arco de redención mostró la posibilidad de cambiar de bando.'
  },
  {
    minifigure_no: 'sw0626',
    name: 'Wullffwarro',
    description_en: 'Wullffwarro was a Wookiee warrior and father of Wullf Yularen who fought against Imperial oppression. His brown fur and distinctive features showed Wookiee diversity. Wullffwarro participated in the liberation of Kashyyyk from Imperial control. His strength and loyalty exemplified Wookiee warrior culture.',
    description_de: 'Wullffwarro war ein Wookiee-Krieger und Vater von Wullf Yularen, der gegen imperiale Unterdrückung kämpfte. Sein braunes Fell und markante Züge zeigten Wookiee-Vielfalt. Wullffwarro nahm an der Befreiung von Kashyyyk von imperialer Kontrolle teil. Seine Stärke und Loyalität beispielhaft Wookiee-Kriegerkultur.',
    description_fr: 'Wullffwarro était un guerrier Wookiee et père de Wullf Yularen qui combattait l\'oppression impériale. Sa fourrure brune et ses traits distinctifs montraient la diversité Wookiee. Wullffwarro a participé à la libération de Kashyyyk du contrôle impérial. Sa force et sa loyauté exemplifiaient la culture guerrière Wookiee.',
    description_es: 'Wullffwarro era un guerrero Wookiee y padre de Wullf Yularen que luchó contra la opresión imperial. Su pelaje marrón y características distintivas mostraban diversidad Wookiee. Wullffwarro participó en la liberación de Kashyyyk del control imperial. Su fuerza y lealtad ejemplificaban la cultura guerrera Wookiee.'
  },
  {
    minifigure_no: 'sw0627',
    name: 'Wookiee - Reddish Brown with Dark Tan Fur, Printed Legs, Band on Left Arm',
    description_en: 'Wookiees with reddish brown fur and distinctive arm bands served the Republic and Rebellion. This variant with printed legs showed detailed design. Wookiee warriors brought strength and loyalty to the fight for freedom. Their fierce combat abilities made them valued allies throughout the saga.',
    description_de: 'Wookiees mit rotbraunem Fell und markanten Armbändern dienten der Republik und Rebellion. Diese Variante mit bedruckten Beinen zeigte detailliertes Design. Wookiee-Krieger brachten Stärke und Loyalität zum Kampf für Freiheit. Ihre wilden Kampffähigkeiten machten sie zu geschätzten Verbündeten während der gesamten Saga.',
    description_fr: 'Les Wookiees avec fourrure brun rougeâtre et bandes de bras distinctives servaient la République et la Rébellion. Cette variante avec jambes imprimées montrait un design détaillé. Les guerriers Wookiee apportaient force et loyauté à la lutte pour la liberté. Leurs féroces capacités de combat en faisaient des alliés précieux tout au long de la saga.',
    description_es: 'Los Wookiees con pelaje marrón rojizo y bandas de brazo distintivas servían a la República y Rebelión. Esta variante con piernas impresas mostraba diseño detallado. Los guerreros Wookiee traían fuerza y lealtad a la lucha por libertad. Sus feroces habilidades de combate los hacían aliados valiosos a través de la saga.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0608-sw0627...');

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
