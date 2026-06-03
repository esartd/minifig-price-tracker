import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0750',
    name: 'Commander Wolffe - Old',
    description_en: 'Commander Wolffe aged into a weathered veteran bearing his distinctive cybernetic eye. This elderly variant showed Wolffe decades after the Clone Wars serving the Rebellion. His gruff exterior and tactical expertise made him invaluable to Rex and the Ghost crew. Wolffe\'s survival alongside Rex connected clone trooper legacy to the Rebellion.',
    description_de: 'Commander Wolffe alterte zu einem verwitterten Veteranen mit seinem markanten kybernetischen Auge. Diese ältere Variante zeigte Wolffe Jahrzehnte nach den Klonkriegen im Dienst der Rebellion. Sein rauer Äußeres und taktische Expertise machten ihn unschätzbar wertvoll für Rex und die Ghost-Crew. Wolfes Überleben neben Rex verband das Erbe der Klonsoldaten mit der Rebellion.',
    description_fr: 'Le Commandant Wolffe vieillit en vétéran blanchi portant son œil cybernétique distinctif. Cette variante âgée montrait Wolffe décennies après la Guerre des Clones servant la Rébellion. Son extérieur bourru et expertise tactique le rendaient inestimable pour Rex et l\'équipage du Ghost. La survie de Wolffe aux côtés de Rex reliait l\'héritage des soldats clones à la Rébellion.',
    description_es: 'El Comandante Wolffe envejeció en veterano curtido portando su ojo cibernético distintivo. Esta variante anciana mostraba a Wolffe décadas tras Guerras Clon sirviendo a Rebelión. Su exterior rudo y pericia táctica lo hacían invaluable para Rex y tripulación del Ghost. La supervivencia de Wolffe junto a Rex conectaba legado de soldados clon con Rebelión.'
  },
  {
    minifigure_no: 'sw0751',
    name: 'Dengar - White Torso, Wrap',
    description_en: 'Dengar was a brutal bounty hunter who competed with Boba Fett for Imperial contracts. His distinctive head wrappings covered severe injuries from a racing accident. This variant with white torso showed his practical combat gear. Dengar\'s cybernetic enhancements and ruthless methods made him feared throughout the underworld.',
    description_de: 'Dengar war ein brutaler Kopfgeldjäger, der mit Boba Fett um imperiale Aufträge konkurrierte. Seine markanten Kopfwickel bedeckten schwere Verletzungen von einem Rennunfall. Diese Variante mit weißem Torso zeigte seine praktische Kampfausrüstung. Dengars kybernetische Verbesserungen und rücksichtslose Methoden machten ihn in der Unterwelt gefürchtet.',
    description_fr: 'Dengar était un chasseur de primes brutal qui rivalisait avec Boba Fett pour contrats impériaux. Ses bandages de tête distinctifs couvraient blessures graves d\'un accident de course. Cette variante avec torse blanc montrait son équipement de combat pratique. Les améliorations cybernétiques et méthodes impitoyables de Dengar le rendaient redouté dans tout le monde souterrain.',
    description_es: 'Dengar era cazarrecompensas brutal que competía con Boba Fett por contratos imperiales. Sus vendajes de cabeza distintivos cubrían lesiones graves de accidente de carreras. Esta variante con torso blanco mostraba su equipo de combate práctico. Las mejoras cibernéticas y métodos despiadados de Dengar lo hacían temido por todo submundo.'
  },
  {
    minifigure_no: 'sw0752',
    name: 'Naare',
    description_en: 'Naare was a Force-sensitive hunter working for the Empire in LEGO\'s Freemaker Adventures. Her dark side powers and deceptive nature made her a dangerous adversary. This character bridged canon Star Wars with LEGO\'s original storytelling. Naare\'s pursuit of Kyber Saber crystals drove the Freemaker Adventures narrative.',
    description_de: 'Naare war eine Macht-empfindliche Jägerin, die für das Imperium in LEGOs Freemaker Adventures arbeitete. Ihre dunkle Seiten-Kräfte und täuschende Natur machten sie zu einer gefährlichen Gegnerin. Diese Figur verband kanonisches Star Wars mit LEGOs ursprünglichem Storytelling. Naares Verfolgung von Kyber-Säbel-Kristallen trieb die Freemaker Adventures-Handlung an.',
    description_fr: 'Naare était une chasseuse sensible à la Force travaillant pour l\'Empire dans les Aventures Freemaker de LEGO. Ses pouvoirs du côté obscur et nature trompeuse en faisaient une adversaire dangereuse. Ce personnage reliait Star Wars canonique à la narration originale de LEGO. La poursuite des cristaux de Sabre Kyber par Naare conduisait le récit des Aventures Freemaker.',
    description_es: 'Naare era cazadora sensible a la Fuerza trabajando para Imperio en Aventuras Freemaker de LEGO. Sus poderes del lado oscuro y naturaleza engañosa la convertían en adversaria peligrosa. Este personaje conectaba Star Wars canónico con narrativa original de LEGO. La persecución de cristales de Sable Kyber por Naare impulsaba narrativa de Aventuras Freemaker.'
  },
  {
    minifigure_no: 'sw0753',
    name: 'Rowan - Yellow Jacket, Aviator Cap and Goggles',
    description_en: 'Rowan Freemaker was the Force-sensitive youngest member of the Freemaker family. His yellow jacket, aviator cap and goggles showed his mechanical aptitude and adventurous spirit. Rowan\'s connection to the Force and engineering skills made him the hero of Freemaker Adventures. His journey from scavenger to Jedi echoed classic Star Wars themes.',
    description_de: 'Rowan Freemaker war das Macht-empfindliche jüngste Mitglied der Freemaker-Familie. Seine gelbe Jacke, Fliegerkappe und Schutzbrille zeigten seine mechanische Begabung und abenteuerlichen Geist. Rowans Verbindung zur Macht und Ingenieurfähigkeiten machten ihn zum Helden der Freemaker Adventures. Seine Reise vom Plünderer zum Jedi spiegelte klassische Star Wars-Themen wider.',
    description_fr: 'Rowan Freemaker était le plus jeune membre sensible à la Force de la famille Freemaker. Sa veste jaune, casquette d\'aviateur et lunettes montraient son aptitude mécanique et esprit aventureux. La connexion de Rowan à la Force et compétences d\'ingénierie en faisaient le héros des Aventures Freemaker. Son voyage de récupérateur à Jedi faisait écho aux thèmes classiques de Star Wars.',
    description_es: 'Rowan Freemaker era miembro más joven sensible a la Fuerza de familia Freemaker. Su chaqueta amarilla, gorra de aviador y gafas mostraban su aptitud mecánica y espíritu aventurero. La conexión de Rowan con Fuerza y habilidades de ingeniería lo convertían en héroe de Aventuras Freemaker. Su viaje de carroñero a Jedi hacía eco de temas clásicos de Star Wars.'
  },
  {
    minifigure_no: 'sw0754',
    name: 'Zander - Sand Blue Jacket',
    description_en: 'Zander Freemaker was the charming pilot and eldest sibling of the Freemaker family. His sand blue jacket reflected his role as the family\'s starfighter ace. Zander\'s piloting skills and swagger brought Han Solo energy to Freemaker Adventures. His protective nature toward siblings showed family bonds central to the series.',
    description_de: 'Zander Freemaker war der charmante Pilot und älteste Geschwister der Freemaker-Familie. Seine sandblaue Jacke spiegelte seine Rolle als Sternjäger-Ass der Familie wider. Zanders Pilotenfähigkeiten und Selbstbewusstsein brachten Han Solo-Energie zu Freemaker Adventures. Seine beschützende Natur gegenüber Geschwistern zeigte Familienbande zentral für die Serie.',
    description_fr: 'Zander Freemaker était le pilote charmant et frère aîné de la famille Freemaker. Sa veste bleu sable reflétait son rôle d\'as de chasseur stellaire de la famille. Les compétences de pilotage et assurance de Zander apportaient l\'énergie de Han Solo aux Aventures Freemaker. Sa nature protectrice envers ses frères et sœurs montrait liens familiaux centraux à la série.',
    description_es: 'Zander Freemaker era piloto encantador y hermano mayor de familia Freemaker. Su chaqueta azul arena reflejaba su rol como as de caza estelar de familia. Las habilidades de pilotaje y confianza de Zander traían energía de Han Solo a Aventuras Freemaker. Su naturaleza protectora hacia hermanos mostraba lazos familiares centrales a serie.'
  },
  {
    minifigure_no: 'sw0755',
    name: 'Kordi - Sand Blue Legs',
    description_en: 'Kordi Freemaker was the business-minded middle sibling managing the family\'s starship salvage operation. Her sand blue legs matched the Freemaker color scheme. Kordi\'s negotiation skills and practical thinking balanced her brothers\' adventurous impulses. Her character represented the entrepreneurial spirit of the Outer Rim.',
    description_de: 'Kordi Freemaker war das geschäftstüchtige mittlere Geschwister, das den Raumschiff-Bergungsbetrieb der Familie verwaltete. Ihre sandblauen Beine passten zum Freemaker-Farbschema. Kordis Verhandlungsfähigkeiten und praktisches Denken balancierten die abenteuerlichen Impulse ihrer Brüder. Ihre Figur repräsentierte den unternehmerischen Geist des Äußeren Randes.',
    description_fr: 'Kordi Freemaker était la sœur du milieu orientée affaires gérant l\'opération de récupération de vaisseaux spatiaux de la famille. Ses jambes bleu sable correspondaient au schéma de couleurs Freemaker. Les compétences de négociation et pensée pratique de Kordi équilibraient les impulsions aventureuses de ses frères. Son personnage représentait l\'esprit entrepreneurial de la Bordure Extérieure.',
    description_es: 'Kordi Freemaker era hermana mediana orientada a negocios gestionando operación de salvamento de naves espaciales de familia. Sus piernas azul arena coincidían con esquema de color Freemaker. Las habilidades de negociación y pensamiento práctico de Kordi equilibraban impulsos aventureros de sus hermanos. Su personaje representaba espíritu emprendedor del Borde Exterior.'
  },
  {
    minifigure_no: 'sw0756',
    name: 'R0-GR (Roger)',
    description_en: 'R0-GR, nicknamed Roger, was the Freemakers\' refurbished battle droid serving as loyal companion and comic relief. His modified programming gave him personality despite battle droid origins. Roger\'s devotion to the Freemaker family contrasted with typical droid disposability. His evolution from weapon to family member explored droid sentience themes.',
    description_de: 'R0-GR, genannt Roger, war der aufgearbeitete Kampfdroide der Freemakers, der als treuer Begleiter und komische Erleichterung diente. Seine modifizierte Programmierung gab ihm Persönlichkeit trotz Kampfdroiden-Ursprungs. Rogers Hingabe an die Freemaker-Familie kontrastierte mit typischer Droiden-Wegwerfbarkeit. Seine Evolution von Waffe zu Familienmitglied erforschte Droiden-Empfindungsfähigkeits-Themen.',
    description_fr: 'R0-GR, surnommé Roger, était le droïde de combat rénové des Freemakers servant de compagnon loyal et soulagement comique. Sa programmation modifiée lui donnait personnalité malgré origines de droïde de combat. La dévotion de Roger à la famille Freemaker contrastait avec la jetabilité droïde typique. Son évolution d\'arme à membre de famille explorait thèmes de sentience droïde.',
    description_es: 'R0-GR, apodado Roger, era droide de batalla renovado de Freemakers sirviendo como compañero leal y alivio cómico. Su programación modificada le daba personalidad a pesar de orígenes de droide de batalla. La devoción de Roger a familia Freemaker contrastaba con desechabilidad droide típica. Su evolución de arma a miembro de familia exploraba temas de conciencia droide.'
  },
  {
    minifigure_no: 'sw0757',
    name: 'Rebel Pilot A-wing (Open Helmet, Red Jumpsuit)',
    description_en: 'Rebel A-wing pilots in red jumpsuits flew the Alliance\'s fastest interceptors. This pilot with open helmet showed the human face behind the advanced technology. A-wing pilots required exceptional reflexes and courage to handle such speed. Their hit-and-run tactics proved essential during major fleet engagements.',
    description_de: 'Rebellen-A-Wing-Piloten in roten Overalls flogen die schnellsten Abfangjäger der Allianz. Dieser Pilot mit offenem Helm zeigte das menschliche Gesicht hinter der fortschrittlichen Technologie. A-Wing-Piloten benötigten außergewöhnliche Reflexe und Mut, um solche Geschwindigkeit zu handhaben. Ihre Hit-and-Run-Taktiken erwiesen sich als wesentlich während großer Flotten-Gefechte.',
    description_fr: 'Les pilotes A-wing rebelles en combinaisons rouges pilotaient les intercepteurs les plus rapides de l\'Alliance. Ce pilote avec casque ouvert montrait le visage humain derrière la technologie avancée. Les pilotes A-wing nécessitaient réflexes exceptionnels et courage pour manier telle vitesse. Leurs tactiques de frappe et fuite se révélaient essentielles pendant engagements de flotte majeurs.',
    description_es: 'Los pilotos Ala-A rebeldes en monos rojos volaban interceptores más rápidos de Alianza. Este piloto con casco abierto mostraba rostro humano detrás de tecnología avanzada. Los pilotos Ala-A requerían reflejos excepcionales y valor para manejar tal velocidad. Sus tácticas de golpear y correr resultaban esenciales durante enfrentamientos de flota mayores.'
  },
  {
    minifigure_no: 'sw0758',
    name: 'Commander Sato',
    description_en: 'Commander Jun Sato led Phoenix Squadron providing crucial support to the Ghost crew during Star Wars Rebels. His tactical leadership coordinated Rebel fleet operations against the Empire. Sato\'s sacrifice destroying an Interdictor cruiser enabled the Rebellion\'s escape. His devotion to the cause exemplified selfless leadership.',
    description_de: 'Commander Jun Sato führte Phoenix Squadron und bot entscheidende Unterstützung für die Ghost-Crew während Star Wars Rebels. Seine taktische Führung koordinierte Rebellenflotten-Operationen gegen das Imperium. Satos Opfer beim Zerstören eines Interdictor-Kreuzers ermöglichte die Flucht der Rebellion. Seine Hingabe an die Sache verkörperte selbstlose Führung.',
    description_fr: 'Le Commandant Jun Sato dirigeait l\'Escadron Phoenix fournissant support crucial à l\'équipage du Ghost pendant Star Wars Rebels. Son leadership tactique coordonnait opérations de flotte rebelle contre l\'Empire. Le sacrifice de Sato détruisant un croiseur Interdictor permit l\'évasion de la Rébellion. Sa dévotion à la cause exemplifiait leadership altruiste.',
    description_es: 'El Comandante Jun Sato lideraba Escuadrón Phoenix proporcionando soporte crucial a tripulación del Ghost durante Star Wars Rebels. Su liderazgo táctico coordinaba operaciones de flota rebelde contra Imperio. El sacrificio de Sato destruyendo crucero Interdictor permitió escape de Rebelión. Su devoción a causa ejemplificaba liderazgo desinteresado.'
  },
  {
    minifigure_no: 'sw0759',
    name: 'Ahsoka Tano (Adult) - Dark Bluish Gray Vest, Tan Tunic, Plain Arms, Dark Brown Legs',
    description_en: 'Adult Ahsoka Tano emerged as Fulcrum, coordinating Rebel cells from the shadows. This variant with dark bluish gray vest showed her matured appearance years after leaving the Jedi Order. Ahsoka\'s dual white lightsabers and tactical brilliance made her invaluable to the Rebellion. Her confrontation with Darth Vader revealed her tragic connection to fallen Anakin.',
    description_de: 'Die erwachsene Ahsoka Tano tauchte als Fulcrum auf und koordinierte Rebellenzellen aus dem Schatten. Diese Variante mit dunkler bläulich-grauer Weste zeigte ihr gereiftes Erscheinungsbild Jahre nach Verlassen des Jedi-Ordens. Ahsokas doppelte weiße Lichtschwerter und taktische Brillanz machten sie für die Rebellion unschätzbar wertvoll. Ihre Konfrontation mit Darth Vader offenbarte ihre tragische Verbindung zum gefallenen Anakin.',
    description_fr: 'L\'adulte Ahsoka Tano émergea comme Fulcrum, coordonnant cellules rebelles depuis les ombres. Cette variante avec gilet gris bleuté foncé montrait son apparence mûrie années après avoir quitté l\'Ordre Jedi. Les doubles sabres laser blancs et génie tactique d\'Ahsoka la rendaient inestimable pour la Rébellion. Sa confrontation avec Dark Vador révéla sa connexion tragique à Anakin déchu.',
    description_es: 'La adulta Ahsoka Tano emergió como Fulcrum, coordinando células rebeldes desde sombras. Esta variante con chaleco gris azulado oscuro mostraba su apariencia madura años tras dejar Orden Jedi. Los sables de luz blancos dobles y brillantez táctica de Ahsoka la hacían invaluable para Rebelión. Su confrontación con Darth Vader reveló su conexión trágica con Anakin caído.'
  },
  {
    minifigure_no: 'sw0760',
    name: 'Hoth Rebel Trooper White Uniform (Moustache)',
    description_en: 'This Hoth Rebel Trooper with distinctive moustache represented the individual identities within Rebel forces. His white insulated uniform protected against Hoth\'s deadly temperatures. These brave soldiers held defensive positions knowing the Empire\'s overwhelming force approached. Their courage enabled the evacuation saving Rebel leadership.',
    description_de: 'Dieser Hoth-Rebellen-Soldat mit markanten Schnurrbart repräsentierte die individuellen Identitäten innerhalb der Rebellenstreitkräfte. Seine weiße isolierte Uniform schützte gegen Hoths tödliche Temperaturen. Diese tapferen Soldaten hielten Verteidigungspositionen, wissend dass die überwältigende Macht des Imperiums nahte. Ihr Mut ermöglichte die Evakuierung, die die Rebellenführung rettete.',
    description_fr: 'Ce Soldat Rebelle de Hoth avec moustache distinctive représentait les identités individuelles au sein des forces rebelles. Son uniforme blanc isolé protégeait contre les températures mortelles de Hoth. Ces soldats braves tenaient positions défensives sachant que la force écrasante de l\'Empire approchait. Leur courage permit l\'évacuation sauvant le leadership rebelle.',
    description_es: 'Este Soldado Rebelde de Hoth con bigote distintivo representaba identidades individuales dentro de fuerzas rebeldes. Su uniforme blanco aislado protegía contra temperaturas mortales de Hoth. Estos soldados valientes mantenían posiciones defensivas sabiendo que fuerza abrumadora del Imperio se acercaba. Su valor permitió evacuación salvando liderazgo rebelde.'
  },
  {
    minifigure_no: 'sw0761',
    name: 'Rebel Pilot - Zin Evalon',
    description_en: 'Zin Evalon served as a Rebel pilot during critical Alliance operations. His dedication to the Rebellion exemplified the countless heroes who fought for freedom. Evalon\'s piloting skills contributed to the Alliance\'s survival through numerous engagements. These named pilots represented the real individuals behind every Rebel victory.',
    description_de: 'Zin Evalon diente als Rebellen-Pilot während kritischer Allianz-Operationen. Seine Hingabe an die Rebellion verkörperte die unzähligen Helden, die für Freiheit kämpften. Evalons Pilotenfähigkeiten trugen zum Überleben der Allianz durch zahlreiche Gefechte bei. Diese benannten Piloten repräsentierten die echten Individuen hinter jedem Rebellensieg.',
    description_fr: 'Zin Evalon servait comme pilote rebelle pendant opérations critiques de l\'Alliance. Sa dédicace à la Rébellion exemplifiait les héros innombrables qui combattaient pour la liberté. Les compétences de pilotage d\'Evalon contribuaient à la survie de l\'Alliance à travers nombreux engagements. Ces pilotes nommés représentaient les individus réels derrière chaque victoire rebelle.',
    description_es: 'Zin Evalon servía como piloto rebelde durante operaciones críticas de Alianza. Su dedicación a Rebelión ejemplificaba héroes incontables que luchaban por libertad. Las habilidades de pilotaje de Evalon contribuían a supervivencia de Alianza a través de numerosos enfrentamientos. Estos pilotos nombrados representaban individuos reales detrás de cada victoria rebelde.'
  },
  {
    minifigure_no: 'sw0762',
    name: 'Bespin Guard - Light Nougat Head, Detailed Gold Trim, Furrowed Eyebrows',
    description_en: 'Bespin Guards protected Cloud City with distinctive uniforms featuring detailed gold trim. This guard\'s furrowed eyebrows suggested the tension during Imperial occupation. These security forces attempted to maintain order as Vader\'s presence threatened the city. Their loyalty to Lando was tested when Empire turned Cloud City into a trap.',
    description_de: 'Bespin-Wachen schützten Cloud City mit markanten Uniformen mit detaillierter Goldborte. Die gerunzelten Augenbrauen dieser Wache deuteten die Spannung während imperialer Besatzung an. Diese Sicherheitskräfte versuchten Ordnung aufrechtzuerhalten, als Vaders Präsenz die Stadt bedrohte. Ihre Loyalität zu Lando wurde getestet, als das Imperium Cloud City in eine Falle verwandelte.',
    description_fr: 'Les Gardes de Bespin protégeaient la Cité des Nuages avec uniformes distinctifs présentant bordure dorée détaillée. Les sourcils froncés de ce garde suggéraient la tension pendant occupation impériale. Ces forces de sécurité tentaient de maintenir l\'ordre alors que la présence de Vador menaçait la cité. Leur loyauté envers Lando fut testée quand l\'Empire transforma la Cité des Nuages en piège.',
    description_es: 'Los Guardias de Bespin protegían Ciudad Nube con uniformes distintivos presentando ribete dorado detallado. Las cejas fruncidas de este guardia sugerían tensión durante ocupación imperial. Estas fuerzas de seguridad intentaban mantener orden mientras presencia de Vader amenazaba ciudad. Su lealtad a Lando fue probada cuando Imperio convirtió Ciudad Nube en trampa.'
  },
  {
    minifigure_no: 'sw0763',
    name: 'Chewbacca - White (Snow / Christmas)',
    description_en: 'This festive white Chewbacca variant celebrates Star Wars holiday traditions with snow-covered appearance. The beloved Wookiee warrior sports seasonal coloring while maintaining his iconic bandolier. This novelty figure delights collectors who enjoy themed holiday releases. White Chewbacca brings whimsical galactic cheer to winter celebrations.',
    description_de: 'Diese festliche weiße Chewbacca-Variante feiert Star Wars-Feiertagstraditionen mit schneebedecktem Erscheinungsbild. Der geliebte Wookiee-Krieger trägt saisonale Färbung und behält seine ikonische Patronengurt bei. Diese Neuheitsfigur erfreut Sammler, die thematische Feiertagsveröffentlichungen genießen. Weißer Chewbacca bringt launische galaktische Freude zu Winterfeiern.',
    description_fr: 'Cette variante festive de Chewbacca blanc célèbre traditions de vacances Star Wars avec apparence couverte de neige. Le guerrier Wookiee bien-aimé arbore coloration saisonnière tout en maintenant sa bandoulière iconique. Cette figure de nouveauté ravit collectionneurs qui apprécient sorties de vacances thématiques. Le Chewbacca blanc apporte joie galactique fantaisiste aux célébrations hivernales.',
    description_es: 'Esta variante festiva de Chewbacca blanco celebra tradiciones navideñas de Star Wars con apariencia cubierta de nieve. El amado guerrero Wookiee luce coloración estacional mientras mantiene su bandolera icónica. Esta figura novedosa deleita a coleccionistas que disfrutan lanzamientos temáticos navideños. El Chewbacca blanco trae alegría galáctica caprichosa a celebraciones invernales.'
  },
  {
    minifigure_no: 'sw0764',
    name: 'Snowtrooper, Light Bluish Gray Hips, Light Bluish Gray Hands - Backpack attached to Neck Bracket with Plate, Modified w/ Clip Ring',
    description_en: 'Imperial Snowtroopers with detailed backpack attachments showed equipment evolution. This variant\'s modified neck bracket with clip ring demonstrated technical design improvements. Snowtroopers\' specialized cold weather gear enabled operations in arctic environments. Their insulated armor and heating systems kept Imperial forces effective in extreme conditions.',
    description_de: 'Imperiale Snowtrooper mit detaillierten Rucksack-Befestigungen zeigten Ausrüstungs-Evolution. Die modifizierte Halshalterung mit Klipring dieser Variante demonstrierte technische Design-Verbesserungen. Snowtroopers\' spezialisierte Kaltwetter-Ausrüstung ermöglichte Operationen in arktischen Umgebungen. Ihre isolierte Rüstung und Heizsysteme hielten imperiale Kräfte in extremen Bedingungen effektiv.',
    description_fr: 'Les Snowtroopers Impériaux avec fixations de sac à dos détaillées montraient évolution d\'équipement. Le support de cou modifié avec anneau de clip de cette variante démontrait améliorations de conception technique. L\'équipement spécialisé par temps froid des Snowtroopers permettait opérations dans environnements arctiques. Leur armure isolée et systèmes de chauffage maintenaient forces impériales efficaces dans conditions extrêmes.',
    description_es: 'Los Snowtroopers Imperiales con fijaciones de mochila detalladas mostraban evolución de equipo. El soporte de cuello modificado con anillo de clip de esta variante demostraba mejoras de diseño técnico. El equipo especializado para clima frío de Snowtroopers permitía operaciones en entornos árticos. Su armadura aislada y sistemas de calefacción mantenían fuerzas imperiales efectivas en condiciones extremas.'
  },
  {
    minifigure_no: 'sw0764b',
    name: 'Snowtrooper, Light Bluish Gray Hips, Light Bluish Gray Hands - Backpack Directly Attached to Neck Bracket',
    description_en: 'This Snowtrooper variant features direct backpack attachment to neck bracket showing alternate assembly. The streamlined connection represented practical field modifications. Imperial engineers constantly refined cold assault equipment based on combat experience. These subtle variations demonstrated attention to military hardware evolution.',
    description_de: 'Diese Snowtrooper-Variante zeigt direkte Rucksack-Befestigung an Halshalterung mit alternativer Montage. Die stromlinienförmige Verbindung repräsentierte praktische Feldmodifikationen. Imperiale Ingenieure verfeinerten ständig Kälteangriffs-Ausrüstung basierend auf Kampferfahrung. Diese subtilen Variationen demonstrierten Aufmerksamkeit für militärische Hardware-Evolution.',
    description_fr: 'Cette variante de Snowtrooper présente fixation directe de sac à dos au support de cou montrant assemblage alternatif. La connexion rationalisée représentait modifications de terrain pratiques. Les ingénieurs impériaux raffinaient constamment équipement d\'assaut par temps froid basé sur expérience de combat. Ces variations subtiles démontraient attention à évolution de matériel militaire.',
    description_es: 'Esta variante de Snowtrooper presenta fijación directa de mochila a soporte de cuello mostrando ensamblaje alternativo. La conexión simplificada representaba modificaciones prácticas de campo. Los ingenieros imperiales refinaban constantemente equipo de asalto en frío basado en experiencia de combate. Estas variaciones sutiles demostraban atención a evolución de hardware militar.'
  },
  {
    minifigure_no: 'sw0765',
    name: 'Hoth Rebel Trooper White Uniform (Tan Beard, without Backpack)',
    description_en: 'This Hoth Rebel Trooper variant without backpack showed lighter equipment loadout. His tan beard distinguished him among Echo Base defenders. Some troopers operated without backpacks for increased mobility in trench warfare. These variations reflected Rebel flexibility adapting to tactical needs.',
    description_de: 'Diese Hoth-Rebellen-Soldaten-Variante ohne Rucksack zeigte leichtere Ausrüstungsbeladung. Sein beiger Bart unterschied ihn unter Echo Base-Verteidigern. Einige Soldaten operierten ohne Rucksäcke für erhöhte Mobilität im Grabenkrieg. Diese Variationen spiegelten Rebellen-Flexibilität bei Anpassung an taktische Bedürfnisse wider.',
    description_fr: 'Cette variante de Soldat Rebelle de Hoth sans sac à dos montrait chargement d\'équipement plus léger. Sa barbe beige le distinguait parmi défenseurs de la Base Echo. Certains soldats opéraient sans sacs à dos pour mobilité accrue en guerre de tranchées. Ces variations reflétaient flexibilité rebelle s\'adaptant aux besoins tactiques.',
    description_es: 'Esta variante de Soldado Rebelde de Hoth sin mochila mostraba carga de equipo más ligera. Su barba beige lo distinguía entre defensores de Base Eco. Algunos soldados operaban sin mochilas para mayor movilidad en guerra de trincheras. Estas variaciones reflejaban flexibilidad rebelde adaptándose a necesidades tácticas.'
  },
  {
    minifigure_no: 'sw0766',
    name: 'Silver Protocol Droid (U-3PO)',
    description_en: 'U-3PO was a silver protocol droid serving Cloud City during the events of Empire Strikes Back. His distinctive silver plating contrasted with C-3PO\'s gold. Protocol droids like U-3PO provided translation and diplomatic services throughout the galaxy. Their presence in Cloud City reflected Bespin\'s cosmopolitan trading culture.',
    description_de: 'U-3PO war ein silberner Protokoll-Droide, der Cloud City während der Ereignisse von Das Imperium schlägt zurück diente. Seine markante silberne Plattierung kontrastierte mit C-3POs Gold. Protokoll-Droiden wie U-3PO boten Übersetzungs- und diplomatische Dienste in der ganzen Galaxis. Ihre Präsenz in Cloud City spiegelte Bespins kosmopolitische Handelskultur wider.',
    description_fr: 'U-3PO était un droïde de protocole argenté servant la Cité des Nuages pendant les événements de L\'Empire contre-attaque. Son placage argenté distinctif contrastait avec l\'or de C-3PO. Les droïdes de protocole comme U-3PO fournissaient traduction et services diplomatiques dans toute la galaxie. Leur présence dans la Cité des Nuages reflétait la culture commerciale cosmopolite de Bespin.',
    description_es: 'U-3PO era droide de protocolo plateado sirviendo a Ciudad Nube durante eventos de El Imperio Contraataca. Su enchapado plateado distintivo contrastaba con oro de C-3PO. Los droides de protocolo como U-3PO proporcionaban traducción y servicios diplomáticos por toda galaxia. Su presencia en Ciudad Nube reflejaba cultura comercial cosmopolita de Bespin.'
  },
  {
    minifigure_no: 'sw0767',
    name: 'Gonk Droid (GNK Power Droid), Reddish Brown',
    description_en: 'This reddish brown GNK Power Droid variant showed the ubiquitous walking power generators. Gonk droids waddled through settlements providing mobile energy sources. Their simple design made them reliable and easily maintained. The distinctive "gonk" sound gave these utility droids their nickname throughout the galaxy.',
    description_de: 'Diese rötlich-braune GNK-Energie-Droiden-Variante zeigte die allgegenwärtigen laufenden Energiegeneratoren. Gonk-Droiden watschelten durch Siedlungen und boten mobile Energiequellen. Ihr einfaches Design machte sie zuverlässig und leicht zu warten. Das markante "Gonk"-Geräusch gab diesen Nutz-Droiden ihren Spitznamen in der ganzen Galaxis.',
    description_fr: 'Cette variante de Droïde d\'Énergie GNK brun rougeâtre montrait les générateurs d\'énergie marchants omniprésents. Les droïdes Gonk se dandinaient dans les colonies fournissant sources d\'énergie mobiles. Leur conception simple les rendait fiables et faciles à entretenir. Le son distinctif "gonk" donnait à ces droïdes utilitaires leur surnom dans toute la galaxie.',
    description_es: 'Esta variante de Droide de Energía GNK marrón rojizo mostraba generadores de energía caminantes ubicuos. Los droides Gonk se bamboleaban por asentamientos proporcionando fuentes de energía móviles. Su diseño simple los hacía confiables y fáciles de mantener. El sonido distintivo "gonk" daba a estos droides utilitarios su apodo por toda galaxia.'
  },
  {
    minifigure_no: 'sw0768',
    name: 'Death Star Droid',
    description_en: 'MSE-6 series Death Star Droids scurried through Imperial facilities on repair and maintenance duties. Their mouse-like appearance earned them the nickname "mouse droids." These small utility droids navigated corridors delivering messages and performing technical tasks. Their presence throughout the Death Star highlighted the station\'s massive infrastructure needs.',
    description_de: 'MSE-6-Serie Todesstern-Droiden huschten durch imperiale Einrichtungen bei Reparatur- und Wartungsaufgaben. Ihr mausähnliches Erscheinungsbild brachte ihnen den Spitznamen "Maus-Droiden" ein. Diese kleinen Nutz-Droiden navigierten Korridore, überbrachten Nachrichten und führten technische Aufgaben aus. Ihre Präsenz im ganzen Todesstern hob die massiven Infrastrukturbedürfnisse der Station hervor.',
    description_fr: 'Les Droïdes de l\'Étoile de la Mort série MSE-6 couraient dans les installations impériales pour réparations et entretien. Leur apparence de souris leur valait le surnom "droïdes souris". Ces petits droïdes utilitaires naviguaient couloirs livrant messages et effectuant tâches techniques. Leur présence dans toute l\'Étoile de la Mort soulignait les besoins d\'infrastructure massifs de la station.',
    description_es: 'Los Droides de Estrella de la Muerte serie MSE-6 correteaban por instalaciones imperiales en tareas de reparación y mantenimiento. Su apariencia de ratón les ganó apodo "droides ratón". Estos pequeños droides utilitarios navegaban corredores entregando mensajes y realizando tareas técnicas. Su presencia por toda Estrella de la Muerte destacaba necesidades de infraestructura masivas de estación.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0750-sw0768...');

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

  console.log('Batch complete! 20 minifigs saved (sw0750-sw0768, includes sw0764b).');
  await prisma.$disconnect();
}

saveBatch();
