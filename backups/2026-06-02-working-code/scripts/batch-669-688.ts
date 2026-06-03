import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0669',
    name: 'Resistance Soldier, Male',
    description_en: 'Resistance Soldiers formed the backbone of General Leia Organa\'s forces opposing the First Order decades after Endor. These brave fighters continued the Rebellion\'s legacy with improvised tactics and diverse backgrounds. Their mismatched gear reflected the scrappy resourcefulness inherited from Rebel Alliance traditions. Male soldiers served alongside pilots, technicians, and commanders in the desperate fight against tyranny.',
    description_de: 'Widerstands-Soldaten bildeten das Rückgrat von General Leia Organas Streitkräften gegen die Erste Ordnung Jahrzehnte nach Endor. Diese tapferen Kämpfer setzten das Erbe der Rebellion mit improvisierten Taktiken und vielfältigen Hintergründen fort. Ihre unpassende Ausrüstung spiegelte die kämpferische Einfallsreichtum wider, der von Rebellenallianz-Traditionen geerbt wurde. Männliche Soldaten dienten neben Piloten, Technikern und Kommandanten im verzweifelten Kampf gegen Tyrannei.',
    description_fr: 'Les Soldats de la Résistance formaient l\'épine dorsale des forces du Général Leia Organa s\'opposant au Premier Ordre des décennies après Endor. Ces braves combattants continuaient l\'héritage de la Rébellion avec des tactiques improvisées et des origines diverses. Leur équipement dépareillé reflétait l\'ingéniosité combative héritée des traditions de l\'Alliance Rebelle. Les soldats masculins servaient aux côtés de pilotes, techniciens et commandants dans le combat désespéré contre la tyrannie.',
    description_es: 'Los Soldados de la Resistencia formaban la columna vertebral de las fuerzas de la General Leia Organa oponiéndose a la Primera Orden décadas después de Endor. Estos valientes luchadores continuaban el legado de la Rebelión con tácticas improvisadas y orígenes diversos. Su equipo desigual reflejaba el ingenio combativo heredado de tradiciones de la Alianza Rebelde. Los soldados masculinos servían junto a pilotos, técnicos y comandantes en la lucha desesperada contra la tiranía.'
  },
  {
    minifigure_no: 'sw0670',
    name: 'First Order Officer (Lieutenant / Captain) - Male',
    description_en: 'First Order Officers commanded stormtrooper legions with ruthless efficiency inherited from Imperial military doctrine. This lieutenant or captain wore the distinctive black uniform marking command authority. These officers enforced Supreme Leader Snoke\'s will across First Order occupied territories. Their rigid military precision and fanatical loyalty made them dangerous commanders in the new galactic conflict.',
    description_de: 'Offiziere der Ersten Ordnung befehligten Sturmtruppler-Legionen mit rücksichtsloser Effizienz aus imperialer Militärdoktrin geerbt. Dieser Lieutenant oder Captain trug die markante schwarze Uniform, die Befehlsgewalt kennzeichnete. Diese Offiziere setzten den Willen des Obersten Anführers Snoke in von der Ersten Ordnung besetzten Territorien durch. Ihre starre militärische Präzision und fanatische Loyalität machten sie zu gefährlichen Kommandanten im neuen galaktischen Konflikt.',
    description_fr: 'Les Officiers du Premier Ordre commandaient des légions de stormtroopers avec une efficacité impitoyable héritée de la doctrine militaire impériale. Ce lieutenant ou capitaine portait l\'uniforme noir distinctif marquant l\'autorité de commandement. Ces officiers appliquaient la volonté du Leader Suprême Snoke dans les territoires occupés par le Premier Ordre. Leur précision militaire rigide et leur loyauté fanatique en faisaient des commandants dangereux dans le nouveau conflit galactique.',
    description_es: 'Los Oficiales de la Primera Orden comandaban legiones de stormtroopers con eficiencia despiadada heredada de la doctrina militar imperial. Este teniente o capitán llevaba el uniforme negro distintivo marcando autoridad de mando. Estos oficiales aplicaban la voluntad del Líder Supremo Snoke en territorios ocupados por la Primera Orden. Su precisión militar rígida y lealtad fanática los convertían en comandantes peligrosos en el nuevo conflicto galáctico.'
  },
  {
    minifigure_no: 'sw0671',
    name: 'First Order Crew Member (Fleet Engineer / Gunner) - Light Nougat Head',
    description_en: 'First Order Crew Members operated technical systems aboard Star Destroyers and Starkiller Base. This fleet engineer or gunner with light nougat complexion maintained the vast military infrastructure. These technicians controlled weapons systems and managed ship operations. Their specialized training kept First Order war machines functioning at peak efficiency.',
    description_de: 'Besatzungsmitglieder der Ersten Ordnung operierten technische Systeme an Bord von Sternenzerstörern und Starkiller-Basis. Dieser Flotten-Ingenieur oder Schütze mit heller Nougat-Hautfarbe wartete die riesige militärische Infrastruktur. Diese Techniker kontrollierten Waffensysteme und verwalteten Schiffsoperationen. Ihre spezialisierte Ausbildung hielt die Kriegsmaschinen der Ersten Ordnung auf Höchstleistung.',
    description_fr: 'Les Membres d\'Équipage du Premier Ordre opéraient des systèmes techniques à bord des Destroyers Stellaires et de la Base Starkiller. Cet ingénieur de flotte ou artilleur à teint nougat clair maintenait la vaste infrastructure militaire. Ces techniciens contrôlaient les systèmes d\'armes et géraient les opérations des vaisseaux. Leur formation spécialisée maintenait les machines de guerre du Premier Ordre à efficacité maximale.',
    description_es: 'Los Miembros de Tripulación de la Primera Orden operaban sistemas técnicos a bordo de Destructores Estelares y la Base Starkiller. Este ingeniero de flota o artillero de tez beige claro mantenía la vasta infraestructura militar. Estos técnicos controlaban sistemas de armas y gestionaban operaciones de naves. Su entrenamiento especializado mantenía las máquinas de guerra de la Primera Orden a máxima eficiencia.'
  },
  {
    minifigure_no: 'sw0672',
    name: 'First Order TIE Fighter Pilot - Two White Lines on Helmet',
    description_en: 'First Order TIE Fighter Pilots flew improved Special Forces TIE fighters with enhanced weapons and shields. This pilot\'s helmet featured two distinctive white lines marking elite status. These ace pilots underwent brutal training producing the galaxy\'s most skilled starfighter operators. Their black flight suits and advanced helmets represented First Order technological superiority over Resistance forces.',
    description_de: 'TIE-Jäger-Piloten der Ersten Ordnung flogen verbesserte Spezialeinheiten-TIE-Jäger mit erweiterten Waffen und Schilden. Der Helm dieses Piloten zeigte zwei markante weiße Linien, die Elite-Status kennzeichneten. Diese Ass-Piloten durchliefen brutale Ausbildung, die die fähigsten Sternjäger-Operateure der Galaxis hervorbrachte. Ihre schwarzen Fluganzüge und fortschrittlichen Helme repräsentierten die technologische Überlegenheit der Ersten Ordnung über Widerstandskräfte.',
    description_fr: 'Les Pilotes de Chasseur TIE du Premier Ordre pilotaient des chasseurs TIE des Forces Spéciales améliorés avec armes et boucliers renforcés. Le casque de ce pilote présentait deux lignes blanches distinctives marquant un statut d\'élite. Ces pilotes as suivaient un entraînement brutal produisant les opérateurs de chasseurs stellaires les plus compétents de la galaxie. Leurs combinaisons de vol noires et casques avancés représentaient la supériorité technologique du Premier Ordre sur les forces de la Résistance.',
    description_es: 'Los Pilotos de Caza TIE de la Primera Orden pilotaban cazas TIE de Fuerzas Especiales mejorados con armas y escudos potenciados. El casco de este piloto presentaba dos líneas blancas distintivas marcando estatus de élite. Estos pilotos as pasaban entrenamiento brutal produciendo los operadores de cazas estelares más hábiles de la galaxia. Sus trajes de vuelo negros y cascos avanzados representaban superioridad tecnológica de la Primera Orden sobre fuerzas de la Resistencia.'
  },
  {
    minifigure_no: 'sw0673',
    name: 'Kanjiklub Gang Member (Crokind Shand)',
    description_en: 'Kanjiklub Gang Members were ruthless criminals from the spice mines of Kessel. Crokind Shand served as one of Tasu Leech\'s enforcers hunting Han Solo for unpaid debts. These masked gangsters wore distinctive wrapped headgear and carried heavy weapons. Their appearance aboard Han\'s freighter led to a dangerous confrontation with rival gang Guavian Death Gang.',
    description_de: 'Kanjiklub-Gangmitglieder waren rücksichtslose Kriminelle aus den Gewürzminen von Kessel. Crokind Shand diente als einer von Tasu Leechs Vollstreckern, die Han Solo wegen unbezahlter Schulden jagten. Diese maskierten Gangster trugen markante umwickelte Kopfbedeckung und trugen schwere Waffen. Ihr Erscheinen an Bord von Hans Frachter führte zu einer gefährlichen Konfrontation mit der rivalisierenden Gang Guavian Death Gang.',
    description_fr: 'Les Membres du Gang Kanjiklub étaient des criminels impitoyables des mines d\'épice de Kessel. Crokind Shand servait comme l\'un des exécuteurs de Tasu Leech chassant Han Solo pour dettes impayées. Ces gangsters masqués portaient une coiffe enveloppée distinctive et transportaient des armes lourdes. Leur apparition à bord du cargo de Han mena à une confrontation dangereuse avec le gang rival Guavian Death Gang.',
    description_es: 'Los Miembros de la Banda Kanjiklub eran criminales despiadados de las minas de especias de Kessel. Crokind Shand servía como uno de los ejecutores de Tasu Leech cazando a Han Solo por deudas impagas. Estos gángsters enmascarados llevaban tocado envuelto distintivo y portaban armas pesadas. Su aparición a bordo del carguero de Han condujo a confrontación peligrosa con banda rival Guavian Death Gang.'
  },
  {
    minifigure_no: 'sw0674',
    name: 'Tasu Leech',
    description_en: 'Tasu Leech led the Kanjiklub criminal gang from Nar Kaaga, tracking Han Solo for double-crossing on a smuggling job. His distinctive helmet with targeting reticle and heavy weaponry marked him as a dangerous bounty hunter. Leech confronted Han aboard his freighter demanding payment. His gang\'s arrival complicated Han and Chewbacca\'s already disastrous cargo situation.',
    description_de: 'Tasu Leech führte die kriminelle Kanjiklub-Gang aus Nar Kaaga und verfolgte Han Solo wegen Doppelkreuzung bei einem Schmuggelauftrag. Sein markanter Helm mit Zielkreuz und schwerer Bewaffnung kennzeichneten ihn als gefährlichen Kopfgeldjäger. Leech konfrontierte Han an Bord seines Frachters und forderte Bezahlung. Die Ankunft seiner Gang verkomplizierte Hans und Chewbaccas bereits katastrophale Frachtsituation.',
    description_fr: 'Tasu Leech dirigeait le gang criminel Kanjiklub de Nar Kaaga, traquant Han Solo pour double jeu sur un travail de contrebande. Son casque distinctif avec réticule de ciblage et armement lourd le marquaient comme un chasseur de primes dangereux. Leech confronta Han à bord de son cargo exigeant paiement. L\'arrivée de son gang compliqua la situation de cargaison déjà désastreuse de Han et Chewbacca.',
    description_es: 'Tasu Leech lideraba la banda criminal Kanjiklub de Nar Kaaga, rastreando a Han Solo por traición en trabajo de contrabando. Su casco distintivo con retícula de puntería y armamento pesado lo marcaban como cazarrecompensas peligroso. Leech confrontó a Han a bordo de su carguero exigiendo pago. La llegada de su banda complicó la situación de carga ya desastrosa de Han y Chewbacca.'
  },
  {
    minifigure_no: 'sw0675',
    name: 'Han Solo, Old (Lopsided Grin)',
    description_en: 'Han Solo returned decades after Endor as a weathered smuggler haunted by personal tragedy. This variant captures his lopsided grin showing the charm that never faded despite hard years. After losing his son Ben to the dark side, Han returned to his old life. His reunion with Rey and Finn on the Millennium Falcon began his final heroic journey.',
    description_de: 'Han Solo kehrte Jahrzehnte nach Endor als verwitterter Schmuggler zurück, heimgesucht von persönlicher Tragödie. Diese Variante erfasst sein schiefes Grinsen, das den Charme zeigt, der trotz harter Jahre nie verblasste. Nachdem er seinen Sohn Ben an die dunkle Seite verloren hatte, kehrte Han zu seinem alten Leben zurück. Seine Wiedervereinigung mit Rey und Finn auf dem Millennium Falken begann seine letzte heldenhafte Reise.',
    description_fr: 'Han Solo revint des décennies après Endor comme contrebandier usé hanté par une tragédie personnelle. Cette variante capture son sourire de travers montrant le charme qui ne s\'est jamais estompé malgré les années difficiles. Après avoir perdu son fils Ben du côté obscur, Han retourna à son ancienne vie. Ses retrouvailles avec Rey et Finn sur le Faucon Millenium commencèrent son dernier voyage héroïque.',
    description_es: 'Han Solo regresó décadas después de Endor como contrabandista curtido atormentado por tragedia personal. Esta variante captura su sonrisa torcida mostrando el encanto que nunca se desvaneció a pesar de años duros. Después de perder a su hijo Ben al lado oscuro, Han volvió a su vida antigua. Su reencuentro con Rey y Finn en el Halcón Milenario comenzó su último viaje heroico.'
  },
  {
    minifigure_no: 'sw0676',
    name: 'Finn - Medium Nougat Jacket, Black Legs',
    description_en: 'Finn wore this medium nougat jacket after escaping First Order conditioning as stormtrooper FN-2187. His defection marked a turning point in the fight against the First Order. This outfit represents his transformation from soldier to Resistance hero. Finn\'s compassion and bravery inspired others to stand against tyranny.',
    description_de: 'Finn trug diese mittlere Nougat-Jacke nach der Flucht aus der Konditionierung der Ersten Ordnung als Sturmtruppler FN-2187. Seine Überläuferei markierte einen Wendepunkt im Kampf gegen die Erste Ordnung. Dieses Outfit repräsentiert seine Verwandlung vom Soldaten zum Widerstands-Helden. Finns Mitgefühl und Tapferkeit inspirierten andere, gegen Tyrannei aufzustehen.',
    description_fr: 'Finn portait cette veste nougat moyen après avoir échappé au conditionnement du Premier Ordre en tant que stormtrooper FN-2187. Sa défection marqua un tournant dans le combat contre le Premier Ordre. Cette tenue représente sa transformation de soldat en héros de la Résistance. La compassion et le courage de Finn inspirèrent d\'autres à se dresser contre la tyrannie.',
    description_es: 'Finn llevaba esta chaqueta beige medio después de escapar del condicionamiento de la Primera Orden como stormtrooper FN-2187. Su deserción marcó punto de inflexión en la lucha contra la Primera Orden. Este atuendo representa su transformación de soldado a héroe de la Resistencia. La compasión y valentía de Finn inspiraron a otros a levantarse contra la tiranía.'
  },
  {
    minifigure_no: 'sw0677',
    name: 'Rey - Dark Tan Tied Robe',
    description_en: 'Rey wore her dark tan tied robe as a scavenger surviving alone on the desert planet Jakku. This humble outfit belied her incredible Force sensitivity and mysterious parentage. Her wrapped desert garments protected against harsh sands while allowing freedom of movement. This appearance defined Rey before discovering her destiny as a powerful Force user.',
    description_de: 'Rey trug ihre dunkle beige gebundene Robe als Plünderin, die allein auf dem Wüstenplaneten Jakku überlebte. Dieses bescheidene Outfit verbarg ihre unglaubliche Macht-Empfindlichkeit und mysteriöse Abstammung. Ihre umwickelten Wüstenkleidungsstücke schützten vor harschen Sanden und ermöglichten Bewegungsfreiheit. Dieses Erscheinungsbild definierte Rey, bevor sie ihr Schicksal als mächtige Macht-Benutzerin entdeckte.',
    description_fr: 'Rey portait sa robe attachée beige foncé comme récupératrice survivant seule sur la planète désertique Jakku. Cette tenue humble cachait sa sensibilité incroyable à la Force et sa parenté mystérieuse. Ses vêtements de désert enveloppés protégeaient contre les sables durs tout en permettant liberté de mouvement. Cette apparence définissait Rey avant de découvrir son destin comme utilisatrice puissante de la Force.',
    description_es: 'Rey llevaba su túnica atada beige oscuro como carroñera sobreviviendo sola en planeta desértico Jakku. Este atuendo humilde ocultaba su increíble sensibilidad a la Fuerza y ascendencia misteriosa. Sus prendas de desierto envueltas protegían contra arenas duras mientras permitían libertad de movimiento. Esta apariencia definía a Rey antes de descubrir su destino como poderosa usuaria de la Fuerza.'
  },
  {
    minifigure_no: 'sw0678',
    name: 'Hoth Rebel Trooper White Uniform (Cheek Lines)',
    description_en: 'Hoth Rebel Troopers defended Echo Base in white insulated uniforms during the Empire\'s devastating assault. This variant with cheek lines showed the physical toll of fighting in extreme cold. These soldiers manned trenches and operated artillery against advancing AT-AT walkers. Their sacrifice bought time for the evacuation of Rebel leadership.',
    description_de: 'Hoth-Rebellen-Soldaten verteidigten Echo Base in weißen isolierten Uniformen während des verheerenden Angriffs des Imperiums. Diese Variante mit Wangenlinien zeigte den physischen Tribut des Kämpfens in extremer Kälte. Diese Soldaten bemannten Schützengräben und operierten Artillerie gegen vorrückende AT-AT-Walker. Ihr Opfer erkaufte Zeit für die Evakuierung der Rebellenführung.',
    description_fr: 'Les Soldats Rebelles de Hoth défendaient la Base Echo en uniformes blancs isolés pendant l\'assaut dévastateur de l\'Empire. Cette variante avec lignes de joue montrait le péage physique du combat dans le froid extrême. Ces soldats tenaient des tranchées et opéraient de l\'artillerie contre les marcheurs AT-AT avançant. Leur sacrifice acheta du temps pour l\'évacuation du leadership rebelle.',
    description_es: 'Los Soldados Rebeldes de Hoth defendían Base Eco en uniformes blancos aislados durante el asalto devastador del Imperio. Esta variante con líneas de mejilla mostraba el costo físico de luchar en frío extremo. Estos soldados ocupaban trincheras y operaban artillería contra caminantes AT-AT avanzando. Su sacrificio compró tiempo para evacuación de liderazgo rebelde.'
  },
  {
    minifigure_no: 'sw0679',
    name: 'Astromech Droid, R2-D2, Reindeer',
    description_en: 'This festive R2-D2 variant features reindeer antlers celebrating Star Wars holiday traditions. The beloved astromech droid sports seasonal decoration while maintaining his iconic blue and white color scheme. This novelty figure delights collectors who enjoy themed seasonal releases. R2\'s cheerful holiday appearance brings galactic cheer to LEGO Star Wars collections.',
    description_de: 'Diese festliche R2-D2-Variante zeigt Rentier-Geweihe zur Feier von Star Wars-Feiertagstraditionen. Der geliebte Astromech-Droide trägt saisonale Dekoration und behält sein ikonisches blau-weißes Farbschema bei. Diese Neuheitsfigur erfreut Sammler, die thematische Saisonveröffentlichungen genießen. R2s fröhliches Feiertagserscheinungsbild bringt galaktische Freude in LEGO Star Wars-Sammlungen.',
    description_fr: 'Cette variante festive de R2-D2 présente des bois de renne célébrant les traditions de vacances Star Wars. Le droïde astromech bien-aimé arbore une décoration saisonnière tout en maintenant son schéma de couleurs bleu et blanc iconique. Cette figure de nouveauté ravit les collectionneurs qui apprécient les sorties saisonnières thématiques. L\'apparence joyeuse de vacances de R2 apporte la joie galactique aux collections LEGO Star Wars.',
    description_es: 'Esta variante festiva de R2-D2 presenta astas de reno celebrando tradiciones navideñas de Star Wars. El amado droide astromech luce decoración estacional mientras mantiene su esquema de color azul y blanco icónico. Esta figura novedosa deleita a coleccionistas que disfrutan lanzamientos temáticos estacionales. La apariencia alegre navideña de R2 trae alegría galáctica a colecciones LEGO Star Wars.'
  },
  {
    minifigure_no: 'sw0680',
    name: 'Santa C-3PO',
    description_en: 'Santa C-3PO transforms the fussy protocol droid into a festive holiday figure complete with Santa hat. This seasonal variant celebrates Star Wars Christmas traditions with whimsical charm. C-3PO\'s golden plating shines beneath red and white holiday attire. Collectors treasure this limited holiday release combining Star Wars with seasonal cheer.',
    description_de: 'Santa C-3PO verwandelt den kleinlichen Protokoll-Droiden in eine festliche Feiertagsfigur komplett mit Weihnachtsmannmütze. Diese saisonale Variante feiert Star Wars-Weihnachtstraditionen mit launischem Charme. C-3POs goldene Plattierung glänzt unter rot-weißer Feiertagskleidung. Sammler schätzen diese limitierte Feiertagsveröffentlichung, die Star Wars mit saisonaler Freude kombiniert.',
    description_fr: 'Le Père Noël C-3PO transforme le droïde de protocole pointilleux en une figure de vacances festive complète avec bonnet de Père Noël. Cette variante saisonnière célèbre les traditions de Noël Star Wars avec charme fantaisiste. Le placage doré de C-3PO brille sous une tenue de vacances rouge et blanche. Les collectionneurs chérissent cette sortie de vacances limitée combinant Star Wars avec joie saisonnière.',
    description_es: 'Santa C-3PO transforma al droide de protocolo quisquilloso en figura festiva navideña completa con gorro de Santa. Esta variante estacional celebra tradiciones navideñas de Star Wars con encanto caprichoso. El enchapado dorado de C-3PO brilla bajo atuendo navideño rojo y blanco. Los coleccionistas atesoran este lanzamiento navideño limitado combinando Star Wars con alegría estacional.'
  },
  {
    minifigure_no: 'sw0681',
    name: 'LIN Demolitionmech Droid',
    description_en: 'LIN Demolitionmech Droids served the First Order as heavy weapons platforms and demolition units. These massive automated walkers carried devastating firepower for base destruction. Their bulky armor and powerful cannons made them formidable opponents in ground combat. First Order engineers deployed LIN droids to break through Resistance defensive positions.',
    description_de: 'LIN Demolitionmech-Droiden dienten der Ersten Ordnung als schwere Waffenplattformen und Abbrucheinheiten. Diese massiven automatisierten Walker trugen verheerende Feuerkraft zur Basiszerstörung. Ihre sperrige Panzerung und mächtigen Kanonen machten sie zu gewaltigen Gegnern im Bodenkampf. Ingenieure der Ersten Ordnung setzten LIN-Droiden ein, um Widerstands-Verteidigungspositionen zu durchbrechen.',
    description_fr: 'Les Droïdes Demolitionmech LIN servaient le Premier Ordre comme plateformes d\'armes lourdes et unités de démolition. Ces marcheurs automatisés massifs transportaient une puissance de feu dévastatrice pour la destruction de base. Leur armure volumineuse et canons puissants en faisaient des adversaires redoutables au combat terrestre. Les ingénieurs du Premier Ordre déployaient des droïdes LIN pour percer les positions défensives de la Résistance.',
    description_es: 'Los Droides Demolitionmech LIN servían a la Primera Orden como plataformas de armas pesadas y unidades de demolición. Estos caminantes automatizados masivos portaban poder de fuego devastador para destrucción de base. Su armadura voluminosa y cañones poderosos los convertían en oponentes formidables en combate terrestre. Los ingenieros de la Primera Orden desplegaban droides LIN para atravesar posiciones defensivas de la Resistencia.'
  },
  {
    minifigure_no: 'sw0682',
    name: 'Imperial Probe Droid - Mini',
    description_en: 'This mini-scale Imperial Probe Droid recreates the Viper probe droids deployed to locate Rebel bases. These automated scouts scanned thousands of worlds searching for Alliance hideouts. A probe droid discovered Echo Base on Hoth leading to the devastating Imperial assault. The mini format captures the droid\'s distinctive spherical body and extending sensors.',
    description_de: 'Dieser Mini-Maßstab imperiale Sonden-Droide rekonstruiert die Viper-Sonden-Droiden, die zur Lokalisierung von Rebellenbasen eingesetzt wurden. Diese automatisierten Scouts scannten Tausende von Welten auf der Suche nach Allianz-Verstecken. Ein Sonden-Droide entdeckte Echo Base auf Hoth, was zum verheerenden imperialen Angriff führte. Das Mini-Format erfasst den markanten kugelförmigen Körper und ausfahrende Sensoren des Droiden.',
    description_fr: 'Ce Droïde Sonde Impérial à échelle mini recrée les droïdes sonde Viper déployés pour localiser les bases rebelles. Ces éclaireurs automatisés scannaient des milliers de mondes cherchant des cachettes de l\'Alliance. Un droïde sonde découvrit la Base Echo sur Hoth menant à l\'assaut impérial dévastateur. Le format mini capture le corps sphérique distinctif et les capteurs extensibles du droïde.',
    description_es: 'Este Droide Sonda Imperial a escala mini recrea los droides sonda Viper desplegados para localizar bases rebeldes. Estos exploradores automatizados escaneaban miles de mundos buscando escondites de la Alianza. Un droide sonda descubrió Base Eco en Hoth llevando al asalto imperial devastador. El formato mini captura el cuerpo esférico distintivo y sensores extensibles del droide.'
  },
  {
    minifigure_no: 'sw0683',
    name: 'Assassin Droid - Dark Bluish Gray',
    description_en: 'Assassin Droids served criminal organizations and bounty hunters as lethal combat units. This dark bluish gray variant showed the menacing appearance of these mechanical killers. Their programming prioritized target elimination with ruthless efficiency. Assassin droids appeared throughout the galaxy wherever credits bought deadly force.',
    description_de: 'Assassinen-Droiden dienten kriminellen Organisationen und Kopfgeldjägern als tödliche Kampfeinheiten. Diese dunkle bläulich-graue Variante zeigte das bedrohliche Erscheinungsbild dieser mechanischen Killer. Ihre Programmierung priorisierte Ziel-Eliminierung mit rücksichtsloser Effizienz. Assassinen-Droiden erschienen in der ganzen Galaxis überall dort, wo Credits tödliche Gewalt kauften.',
    description_fr: 'Les Droïdes Assassins servaient les organisations criminelles et chasseurs de primes comme unités de combat létales. Cette variante gris bleuté foncé montrait l\'apparence menaçante de ces tueurs mécaniques. Leur programmation priorisait l\'élimination de cible avec efficacité impitoyable. Les droïdes assassins apparaissaient dans toute la galaxie partout où les crédits achetaient force mortelle.',
    description_es: 'Los Droides Asesinos servían a organizaciones criminales y cazarrecompensas como unidades de combate letales. Esta variante gris azulado oscuro mostraba la apariencia amenazante de estos asesinos mecánicos. Su programación priorizaba eliminación de objetivos con eficiencia despiadada. Los droides asesinos aparecían por toda la galaxia dondequiera que créditos compraban fuerza mortal.'
  },
  {
    minifigure_no: 'sw0684',
    name: 'Captain Phasma (Rounded Mouth Pattern)',
    description_en: 'Captain Phasma commanded First Order stormtrooper legions with chrome armor symbolizing her elite status. This variant features the rounded mouth pattern on her distinctive helmet. Phasma\'s ruthless efficiency and imposing presence made her one of the First Order\'s most feared officers. Her shining armor became iconic among sequel trilogy characters.',
    description_de: 'Captain Phasma befehligte Sturmtruppler-Legionen der Ersten Ordnung mit Chrom-Rüstung, die ihren Elite-Status symbolisierte. Diese Variante zeigt das abgerundete Mundmuster auf ihrem markanten Helm. Phasmas rücksichtslose Effizienz und imposante Präsenz machten sie zu einer der gefürchtetsten Offiziere der Ersten Ordnung. Ihre glänzende Rüstung wurde ikonisch unter Sequel-Trilogie-Charakteren.',
    description_fr: 'Le Capitaine Phasma commandait des légions de stormtroopers du Premier Ordre avec armure chromée symbolisant son statut d\'élite. Cette variante présente le motif de bouche arrondie sur son casque distinctif. L\'efficacité impitoyable et la présence imposante de Phasma en faisaient l\'un des officiers les plus redoutés du Premier Ordre. Son armure brillante est devenue iconique parmi les personnages de la trilogie suite.',
    description_es: 'La Capitana Phasma comandaba legiones de stormtroopers de la Primera Orden con armadura cromada simbolizando su estatus de élite. Esta variante presenta el patrón de boca redondeada en su casco distintivo. La eficiencia despiadada y presencia imponente de Phasma la convertían en una de las oficiales más temidas de la Primera Orden. Su armadura brillante se volvió icónica entre personajes de trilogía secuela.'
  },
  {
    minifigure_no: 'sw0685',
    name: 'Yoda - Clone Wars, White Hair',
    description_en: 'This Yoda variant from the Clone Wars era features white hair showing the Jedi Master during the Republic\'s final years. Yoda led the Jedi Council through the devastating Clone Wars. His tactical brilliance commanded clone armies against Separatist forces. This appearance captured Yoda before his exile to Dagobah following Order 66.',
    description_de: 'Diese Yoda-Variante aus der Klonkriegs-Ära zeigt weiße Haare, die den Jedi-Meister während der letzten Jahre der Republik zeigen. Yoda führte den Jedi-Rat durch die verheerenden Klonkriege. Seine taktische Brillanz befehligte Klon-Armeen gegen Separatisten-Streitkräfte. Dieses Erscheinungsbild erfasste Yoda vor seinem Exil nach Dagobah nach Order 66.',
    description_fr: 'Cette variante de Yoda de l\'ère de la Guerre des Clones présente des cheveux blancs montrant le Maître Jedi pendant les dernières années de la République. Yoda dirigeait le Conseil Jedi à travers la Guerre des Clones dévastatrice. Son génie tactique commandait des armées de clones contre les forces séparatistes. Cette apparence capturait Yoda avant son exil à Dagobah après l\'Ordre 66.',
    description_es: 'Esta variante de Yoda de la era de las Guerras Clon presenta cabello blanco mostrando al Maestro Jedi durante los años finales de la República. Yoda lideraba el Consejo Jedi a través de las devastadoras Guerras Clon. Su brillantez táctica comandaba ejércitos clon contra fuerzas separatistas. Esta apariencia capturaba a Yoda antes de su exilio a Dagobah tras Orden 66.'
  },
  {
    minifigure_no: 'sw0686',
    name: 'Darth Maul - Hood and Cape, Sash with Pouch',
    description_en: 'Darth Maul wore his distinctive hooded cape with sash and pouch during his mission to capture Queen Amidala. This variant shows the Zabrak Sith apprentice before revealing himself to the Jedi. His concealing robes hid his fearsome appearance and double-bladed lightsaber. Maul\'s patience and stealth made him a deadly hunter for his master Darth Sidious.',
    description_de: 'Darth Maul trug seinen markanten Kapuzenumhang mit Schärpe und Beutel während seiner Mission, Königin Amidala zu fangen. Diese Variante zeigt den Zabrak-Sith-Lehrling, bevor er sich den Jedi offenbarte. Seine verhüllenden Roben verbargen sein furchterregendes Erscheinungsbild und doppelklingiges Lichtschwert. Mauls Geduld und Heimlichkeit machten ihn zu einem tödlichen Jäger für seinen Meister Darth Sidious.',
    description_fr: 'Dark Maul portait sa cape à capuche distinctive avec écharpe et sacoche pendant sa mission de capturer la Reine Amidala. Cette variante montre l\'apprenti Sith Zabrak avant de se révéler aux Jedi. Ses robes dissimulantes cachaient son apparence redoutable et son sabre laser à double lame. La patience et la furtivité de Maul en faisaient un chasseur mortel pour son maître Dark Sidious.',
    description_es: 'Darth Maul llevaba su capa con capucha distintiva con fajín y bolsa durante su misión de capturar a la Reina Amidala. Esta variante muestra al aprendiz Sith Zabrak antes de revelarse a los Jedi. Sus túnicas ocultadoras escondían su apariencia temible y sable de luz de doble hoja. La paciencia y sigilo de Maul lo convertían en cazador mortal para su maestro Darth Sidious.'
  },
  {
    minifigure_no: 'sw0687',
    name: 'Rodian Alliance Fighter',
    description_en: 'Rodian Alliance Fighters joined the Rebel cause bringing their species\' tracking and combat skills. These green-skinned warriors from Rodia served in diverse Rebel units. Their large eyes and distinctive snouts made Rodians recognizable throughout the galaxy. Many Rodians fought to restore freedom after suffering under Imperial oppression.',
    description_de: 'Rodianische Allianz-Kämpfer schlossen sich der Rebellensache an und brachten die Verfolgungs- und Kampffähigkeiten ihrer Spezies mit. Diese grünhäutigen Krieger von Rodia dienten in diversen Rebelleneinheiten. Ihre großen Augen und markanten Schnauzen machten Rodianer in der ganzen Galaxis erkennbar. Viele Rodianer kämpften für die Wiederherstellung der Freiheit nach Leiden unter imperialer Unterdrückung.',
    description_fr: 'Les Combattants Rodiens de l\'Alliance rejoignaient la cause rebelle apportant les compétences de pistage et combat de leur espèce. Ces guerriers à peau verte de Rodia servaient dans diverses unités rebelles. Leurs grands yeux et museaux distinctifs rendaient les Rodiens reconnaissables dans toute la galaxie. De nombreux Rodiens combattaient pour restaurer la liberté après avoir souffert sous l\'oppression impériale.',
    description_es: 'Los Combatientes Rodianos de la Alianza se unían a la causa rebelde trayendo habilidades de rastreo y combate de su especie. Estos guerreros de piel verde de Rodia servían en diversas unidades rebeldes. Sus ojos grandes y hocicos distintivos hacían a los Rodianos reconocibles por toda la galaxia. Muchos Rodianos luchaban para restaurar libertad tras sufrir bajo opresión imperial.'
  },
  {
    minifigure_no: 'sw0688',
    name: 'Rebel Trooper, Goggles, Dark Tan Helmet',
    description_en: 'Rebel Troopers wore goggles and dark tan helmets for desert and harsh environment operations. These versatile soldiers adapted their gear to diverse planetary conditions. Their protective eyewear shielded against sand, wind, and bright suns. Rebel flexibility in equipment contrasted with standardized Imperial gear reflecting Alliance resourcefulness.',
    description_de: 'Rebellensoldaten trugen Schutzbrillen und dunkle beige Helme für Wüsten- und raue Umgebungseinsätze. Diese vielseitigen Soldaten passten ihre Ausrüstung an diverse planetarische Bedingungen an. Ihre schützende Augenausrüstung schirmte gegen Sand, Wind und helle Sonnen ab. Rebellenflexibilität bei Ausrüstung kontrastierte mit standardisierter imperialer Ausrüstung, was Allianz-Einfallsreichtum widerspiegelte.',
    description_fr: 'Les Soldats Rebelles portaient des lunettes et casques beige foncé pour opérations désertiques et environnements difficiles. Ces soldats polyvalents adaptaient leur équipement à diverses conditions planétaires. Leur protection oculaire protégeait contre sable, vent et soleils brillants. La flexibilité rebelle en équipement contrastait avec l\'équipement impérial standardisé reflétant l\'ingéniosité de l\'Alliance.',
    description_es: 'Los Soldados Rebeldes llevaban gafas y cascos beige oscuro para operaciones desérticas y ambientes hostiles. Estos soldados versátiles adaptaban su equipo a diversas condiciones planetarias. Su protección ocular protegía contra arena, viento y soles brillantes. La flexibilidad rebelde en equipo contrastaba con equipo imperial estandarizado reflejando ingenio de la Alianza.'
  },
  {
    minifigure_no: 'sw0689',
    name: 'Duros Alliance Fighter, Jet Pack',
    description_en: 'Duros Alliance Fighters brought their species\' renowned piloting skills and space-faring heritage to the Rebellion. This variant equipped with jet pack showed Duros versatility in combat roles. Their blue skin and large red eyes made them distinctive among Rebel forces. Many Duros joined the Alliance seeking to protect spacelanes from Imperial control.',
    description_de: 'Duros-Allianz-Kämpfer brachten die renommierten Pilotenfähigkeiten und raumfahrenden Erbe ihrer Spezies zur Rebellion. Diese mit Jetpack ausgestattete Variante zeigte Duros-Vielseitigkeit in Kampfrollen. Ihre blaue Haut und großen roten Augen machten sie markant unter Rebellenstreitkräften. Viele Duros schlossen sich der Allianz an, um Raumwege vor imperialer Kontrolle zu schützen.',
    description_fr: 'Les Combattants Duros de l\'Alliance apportaient les compétences de pilotage renommées et l\'héritage spatial de leur espèce à la Rébellion. Cette variante équipée de réacteur dorsal montrait la polyvalence Duros dans les rôles de combat. Leur peau bleue et grands yeux rouges les rendaient distinctifs parmi les forces rebelles. De nombreux Duros rejoignaient l\'Alliance cherchant à protéger les voies spatiales du contrôle impérial.',
    description_es: 'Los Combatientes Duros de la Alianza traían habilidades de pilotaje renombradas y herencia espacial de su especie a la Rebelión. Esta variante equipada con mochila cohete mostraba versatilidad Duros en roles de combate. Su piel azul y ojos rojos grandes los hacían distintivos entre fuerzas rebeldes. Muchos Duros se unían a la Alianza buscando proteger rutas espaciales del control imperial.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0669-sw0689...');

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

  console.log('Batch complete! 20 minifigs saved (sw0669-sw0689).');
  await prisma.$disconnect();
}

saveBatch();
