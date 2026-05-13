import { PrismaClient as PrismaClientHostinger } from '@prisma/client-hostinger';

const prisma = new PrismaClientHostinger({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

const descriptions = [
  {
    minifigure_no: 'sw1326',
    description_en: "This female Imperial Stormtrooper with shoulder belts and medium brown head adds diversity to Imperial ground forces. The dual-molded helmet and shoulder belts suggest equipment-carrying roles. Her presence reflects canon acknowledgment of diverse Imperial military personnel. Essential for collectors building inclusive and realistic Imperial army displays.",
    description_de: "Diese weibliche imperiale Sturmtrupplerin mit Schultergurten und mittelbraunem Kopf fügt den imperialen Bodentruppen Vielfalt hinzu. Der dual-gegossene Helm und die Schultergurte suggerieren Ausrüstungstragende Rollen. Ihre Präsenz spiegelt kanonische Anerkennung vielfältigen imperialen Militärpersonals wider. Unverzichtbar für Sammler, die inklusive und realistische imperiale Armeeausstellungen bauen.",
    description_fr: "Ce Stormtrooper impérial féminin avec bandoulières et tête brun moyen ajoute de la diversité aux forces terrestres impériales. Le casque bi-moulé et les bandoulières suggèrent des rôles de port d'équipement. Sa présence reflète la reconnaissance canonique du personnel militaire impérial diversifié. Essentielle pour les collectionneurs construisant des présentoirs d'armée impériale inclusifs et réalistes.",
    description_es: "Esta Stormtrooper imperial femenina con correas de hombro y cabeza marrón medio añade diversidad a las fuerzas terrestres imperiales. El casco bi-moldeado y correas de hombro sugieren roles de transporte de equipo. Su presencia refleja reconocimiento canónico de personal militar imperial diverso. Esencial para coleccionistas construyendo exhibiciones de ejército imperial inclusivas y realistas."
  },
  {
    minifigure_no: 'sw1327',
    description_en: "This male Imperial Stormtrooper with shoulder belts and light nougat head represents standard Imperial infantry with equipment-carrying capabilities. The dual-molded helmet maintains authenticity while the shoulder belts add tactical detail. These versatile troopers form the backbone of Imperial ground operations. Perfect for army building diverse Imperial forces.",
    description_de: "Dieser männliche imperiale Sturmtruppler mit Schultergurten und hellbraunem Kopf repräsentiert Standard-Imperial-Infanterie mit Ausrüstungstragefähigkeiten. Der dual-gegossene Helm bewahrt Authentizität, während die Schultergurte taktische Details hinzufügen. Diese vielseitigen Truppler bilden das Rückgrat imperialer Bodenoperationen. Perfekt für Armeeaufbau vielfältiger imperialer Streitkräfte.",
    description_fr: "Ce Stormtrooper impérial masculin avec bandoulières et tête nougat clair représente l'infanterie impériale standard avec capacités de port d'équipement. Le casque bi-moulé maintient l'authenticité tandis que les bandoulières ajoutent des détails tactiques. Ces troupes polyvalentes forment l'épine dorsale des opérations terrestres impériales. Parfait pour construire des forces impériales diversifiées.",
    description_es: "Este Stormtrooper imperial masculino con correas de hombro y cabeza tono claro representa infantería imperial estándar con capacidades de transporte de equipo. El casco bi-moldeado mantiene autenticidad mientras las correas de hombro añaden detalle táctico. Estas tropas versátiles forman la columna vertebral de operaciones terrestres imperiales. Perfecto para construir ejércitos de fuerzas imperiales diversas."
  },
  {
    minifigure_no: 'sw1328',
    description_en: "Captain Antilles commands the Tantive IV during its fateful encounter with Darth Vader. His dark tan shirt with large rank badge identifies his command position. Antilles' brave but futile resistance to Vader's boarding made his death memorable in A New Hope's opening. Essential for collectors recreating the iconic corridor assault scene.",
    description_de: "Captain Antilles befehligt die Tantive IV während ihrer schicksalhaften Begegnung mit Darth Vader. Sein dunkelbraunes Hemd mit großem Rangabzeichen identifiziert seine Befehlsposition. Antilles' mutiger aber vergeblicher Widerstand gegen Vaders Enterung machte seinen Tod unvergesslich in der Eröffnung von Eine neue Hoffnung. Unverzichtbar für Sammler, die die ikonische Korridor-Angriffsszene nachstellen.",
    description_fr: "Le capitaine Antilles commande le Tantive IV lors de sa rencontre fatidique avec Dark Vador. Sa chemise brun foncé avec grande insigne de rang identifie sa position de commandement. La résistance courageuse mais futile d'Antilles à l'abordage de Vador a rendu sa mort mémorable dans l'ouverture d'Un nouvel espoir. Essentiel pour les collectionneurs recréant la scène emblématique d'assaut dans le couloir.",
    description_es: "El Capitán Antilles comanda el Tantive IV durante su fatídico encuentro con Darth Vader. Su camisa marrón oscuro con gran insignia de rango identifica su posición de comando. La valiente pero inútil resistencia de Antilles al abordaje de Vader hizo su muerte memorable en la apertura de Una Nueva Esperanza. Esencial para coleccionistas recreando la icónica escena de asalto en el corredor."
  },
  {
    minifigure_no: 'sw1329',
    description_en: "Clone ARC Trooper Fives serves as one of the 501st Legion's most loyal and heroic soldiers. His ARC trooper status and distinctive markings identify him as elite. Fives' discovery of Order 66 and tragic death made him one of The Clone Wars' most emotional characters. Essential for collectors of Clone Wars heroes and 501st Legion displays.",
    description_de: "Klon-ARC-Trooper Fives dient als einer der loyalsten und heldenhaftesten Soldaten der 501. Legion. Sein ARC-Trooper-Status und markante Kennzeichnungen identifizieren ihn als Elite. Fives' Entdeckung von Order 66 und tragischer Tod machten ihn zu einem der emotionalsten Charaktere von The Clone Wars. Unverzichtbar für Sammler von Klonkriege-Helden und 501.-Legion-Ausstellungen.",
    description_fr: "Le Clone ARC Trooper Fives sert comme l'un des soldats les plus loyaux et héroïques de la 501e Légion. Son statut de trooper ARC et ses marquages distinctifs l'identifient comme élite. La découverte de l'Ordre 66 par Fives et sa mort tragique en ont fait l'un des personnages les plus émotionnels de The Clone Wars. Essentiel pour les collectionneurs de héros des guerres des clones et de présentoirs de la 501e Légion.",
    description_es: "El Clon ARC Trooper Fives sirve como uno de los soldados más leales y heroicos de la Legión 501. Su estatus de trooper ARC y marcas distintivas lo identifican como élite. El descubrimiento de la Orden 66 por Fives y su trágica muerte lo hicieron uno de los personajes más emocionales de The Clone Wars. Esencial para coleccionistas de héroes de Guerras Clon y exhibiciones de Legión 501."
  },
  {
    minifigure_no: 'sw1330',
    description_en: "Darth Maul with 25 Years of LEGO Star Wars commemorative torso celebrates a quarter-century of the beloved theme. This special edition variant honors Maul's iconic status as the first LEGO Star Wars villain. The anniversary printing makes this highly collectible. Essential for collectors of milestone LEGO releases and anniversary editions.",
    description_de: "Darth Maul mit 25 Jahre LEGO Star Wars-Gedenk-Torso feiert ein Vierteljahrhundert des beliebten Themas. Diese Sonderausgaben-Variante ehrt Mauls ikonischen Status als erster LEGO Star Wars-Bösewicht. Die Jubiläums-Bedruckung macht dies sehr sammelwürdig. Unverzichtbar für Sammler von Meilenstein-LEGO-Veröffentlichungen und Jubiläumsausgaben.",
    description_fr: "Dark Maul avec torse commémoratif 25 ans de LEGO Star Wars célèbre un quart de siècle du thème bien-aimé. Cette variante en édition spéciale honore le statut emblématique de Maul en tant que premier méchant LEGO Star Wars. L'impression d'anniversaire la rend très collectionnable. Essentielle pour les collectionneurs de versions LEGO marquantes et d'éditions anniversaire.",
    description_es: "Darth Maul con torso conmemorativo de 25 Años de LEGO Star Wars celebra un cuarto de siglo del amado tema. Esta variante de edición especial honra el estatus icónico de Maul como el primer villano de LEGO Star Wars. La impresión de aniversario lo hace altamente coleccionable. Esencial para coleccionistas de lanzamientos LEGO hito y ediciones de aniversario."
  },
  {
    minifigure_no: 'sw1331',
    description_en: "The Imperial TIE Fighter/Interceptor Pilot with printed arms represents elite Imperial starfighter crews with enhanced detail. The printed arms eliminate sticker needs while adding authenticity. These skilled pilots operate the Empire's fastest interceptors. Essential for collectors seeking detailed pilot figures and completing TIE Interceptor vehicle crews.",
    description_de: "Der imperiale TIE-Jäger/Interceptor-Pilot mit bedruckten Armen repräsentiert Elite-Imperial-Sternenjäger-Besatzungen mit verbessertem Detail. Die bedruckten Arme eliminieren Aufkleber-Bedarf und fügen Authentizität hinzu. Diese erfahrenen Piloten bedienen die schnellsten Interceptor des Imperiums. Unverzichtbar für Sammler, die detaillierte Pilotenfiguren suchen und TIE-Interceptor-Fahrzeugbesatzungen vervollständigen.",
    description_fr: "Le pilote de chasseur/intercepteur TIE impérial avec bras imprimés représente des équipages de chasseurs stellaires impériaux d'élite avec détail amélioré. Les bras imprimés éliminent le besoin d'autocollants tout en ajoutant de l'authenticité. Ces pilotes qualifiés opèrent les intercepteurs les plus rapides de l'Empire. Essentiel pour les collectionneurs recherchant des figurines de pilotes détaillées et complétant les équipages de véhicules intercepteurs TIE.",
    description_es: "El Piloto de Caza/Interceptor TIE Imperial con brazos impresos representa tripulaciones de cazas estelares imperiales de élite con detalle mejorado. Los brazos impresos eliminan necesidad de calcomanías mientras añaden autenticidad. Estos pilotos hábiles operan los interceptores más rápidos del Imperio. Esencial para coleccionistas buscando figuras detalladas de pilotos y completando tripulaciones de vehículos Interceptor TIE."
  },
  {
    minifigure_no: 'sw1332',
    description_en: "Young Anakin Skywalker with short legs and thick messy hair captures the boy during his podracing days on Tatooine. This innocent version predates his fall to the dark side. The child-sized proportions and distinctive hair make this figure memorable. Essential for collectors recreating Anakin's origins and The Phantom Menace scenes.",
    description_de: "Der junge Anakin Skywalker mit kurzen Beinen und dickem zerzaustem Haar fängt den Jungen während seiner Podrennen-Tage auf Tatooine ein. Diese unschuldige Version datiert vor seinem Fall zur dunklen Seite. Die kindgerechten Proportionen und markante Haare machen diese Figur unvergesslich. Unverzichtbar für Sammler, die Anakins Ursprünge und Die dunkle Bedrohung-Szenen nachstellen.",
    description_fr: "Le jeune Anakin Skywalker avec jambes courtes et cheveux épais ébouriffés capture le garçon pendant ses jours de course de modules sur Tatooine. Cette version innocente précède sa chute vers le côté obscur. Les proportions de taille enfant et les cheveux distinctifs rendent cette figurine mémorable. Essentielle pour les collectionneurs recréant les origines d'Anakin et les scènes de La Menace Fantôme.",
    description_es: "El joven Anakin Skywalker con piernas cortas y cabello grueso despeinado captura al niño durante sus días de carreras de vainas en Tatooine. Esta versión inocente precede su caída al lado oscuro. Las proporciones de tamaño infantil y cabello distintivo hacen esta figura memorable. Esencial para coleccionistas recreando los orígenes de Anakin y escenas de La Amenaza Fantasma."
  },
  {
    minifigure_no: 'sw1333',
    description_en: "Darth Maul with horns, printed legs, and closed mouth represents the fearsome Sith apprentice in his prime. The detailed printing and distinctive facial features create an authentic appearance. This menacing variant captures Maul's deadly presence. Essential for collectors of Phantom Menace characters and Sith villain displays.",
    description_de: "Darth Maul mit Hörnern, bedruckten Beinen und geschlossenem Mund repräsentiert den furchteinflößenden Sith-Schüler in seiner Blütezeit. Die detaillierte Bedruckung und markanten Gesichtszüge schaffen ein authentisches Aussehen. Diese bedrohliche Variante fängt Mauls tödliche Präsenz ein. Unverzichtbar für Sammler von Phantom Menace-Charakteren und Sith-Bösewicht-Ausstellungen.",
    description_fr: "Dark Maul avec cornes, jambes imprimées et bouche fermée représente l'apprenti Sith redoutable dans sa prime. L'impression détaillée et les traits faciaux distinctifs créent une apparence authentique. Cette variante menaçante capture la présence mortelle de Maul. Essentielle pour les collectionneurs de personnages de La Menace Fantôme et de présentoirs de méchants Sith.",
    description_es: "Darth Maul con cuernos, piernas impresas y boca cerrada representa al temible aprendiz Sith en su apogeo. La impresión detallada y rasgos faciales distintivos crean una apariencia auténtica. Esta variante amenazante captura la presencia mortal de Maul. Esencial para coleccionistas de personajes de La Amenaza Fantasma y exhibiciones de villanos Sith."
  },
  {
    minifigure_no: 'sw1334',
    description_en: "Qui-Gon Jinn with dark brown legs and poncho represents the wise Jedi Master during field missions. The poncho suggests desert or rough terrain operations. Qui-Gon's unorthodox approach to the Force made him a memorable mentor. Essential for collectors of Phantom Menace characters and Jedi Master displays.",
    description_de: "Qui-Gon Jinn mit dunkelbraunen Beinen und Poncho repräsentiert den weisen Jedi-Meister während Feldeinsätzen. Der Poncho suggeriert Wüsten- oder raue Geländeoperationen. Qui-Gons unorthodoxer Ansatz zur Macht machte ihn zu einem unvergesslichen Mentor. Unverzichtbar für Sammler von Phantom Menace-Charakteren und Jedi-Meister-Ausstellungen.",
    description_fr: "Qui-Gon Jinn avec jambes brun foncé et poncho représente le sage Maître Jedi pendant les missions sur le terrain. Le poncho suggère des opérations dans le désert ou sur terrain accidenté. L'approche peu orthodoxe de Qui-Gon de la Force en a fait un mentor mémorable. Essentiel pour les collectionneurs de personnages de La Menace Fantôme et de présentoirs de Maîtres Jedi.",
    description_es: "Qui-Gon Jinn con piernas marrón oscuro y poncho representa al sabio Maestro Jedi durante misiones de campo. El poncho sugiere operaciones en desierto o terreno difícil. El enfoque poco ortodoxo de Qui-Gon hacia la Fuerza lo hizo un mentor memorable. Esencial para coleccionistas de personajes de La Amenaza Fantasma y exhibiciones de Maestros Jedi."
  },
  {
    minifigure_no: 'sw1335',
    description_en: "Saw Gerrera represents the extremist rebel leader whose methods blur ethical lines. His character spans Clone Wars, Rebels, Rogue One, and The Bad Batch. Saw's radicalization and tragic fate make him a complex figure in Rebel history. Essential for collectors of morally complex Rebellion characters and Rogue One connections.",
    description_de: "Saw Gerrera repräsentiert den extremistischen Rebellenführer, dessen Methoden ethische Grenzen verwischen. Sein Charakter erstreckt sich über Clone Wars, Rebels, Rogue One und The Bad Batch. Saws Radikalisierung und tragisches Schicksal machen ihn zu einer komplexen Figur in der Rebellengeschichte. Unverzichtbar für Sammler moralisch komplexer Rebellions-Charaktere und Rogue One-Verbindungen.",
    description_fr: "Saw Gerrera représente le chef rebelle extrémiste dont les méthodes brouillent les lignes éthiques. Son personnage s'étend sur Clone Wars, Rebels, Rogue One et The Bad Batch. La radicalisation et le destin tragique de Saw en font une figure complexe de l'histoire rebelle. Essentiel pour les collectionneurs de personnages de Rébellion moralement complexes et de connexions Rogue One.",
    description_es: "Saw Gerrera representa al líder rebelde extremista cuyos métodos difuminan líneas éticas. Su personaje abarca Clone Wars, Rebels, Rogue One y The Bad Batch. La radicalización y trágico destino de Saw lo hacen una figura compleja en la historia rebelde. Esencial para coleccionistas de personajes de Rebelión moralmente complejos y conexiones Rogue One."
  },
  {
    minifigure_no: 'sw1336',
    description_en: "Kelleran Beq, known as 'The Jedi Saboteur,' appears in The Mandalorian rescuing Grogu during Order 66. His heroic actions saved the Child from the Jedi Temple massacre. Beq's character connects Grogu's backstory to the fall of the Jedi Order. Essential for collectors of Mandalorian lore and Order 66 survivor stories.",
    description_de: "Kelleran Beq, bekannt als 'Der Jedi-Saboteur', erscheint in The Mandalorian und rettet Grogu während Order 66. Seine heroischen Taten retteten das Kind vor dem Jedi-Tempel-Massaker. Beqs Charakter verbindet Grogus Hintergrundgeschichte mit dem Fall des Jedi-Ordens. Unverzichtbar für Sammler von Mandalorian-Überlieferungen und Order 66-Überlebenden-Geschichten.",
    description_fr: "Kelleran Beq, connu sous le nom de 'Le Saboteur Jedi', apparaît dans The Mandalorian sauvant Grogu pendant l'Ordre 66. Ses actions héroïques ont sauvé l'Enfant du massacre du Temple Jedi. Le personnage de Beq connecte l'histoire de Grogu à la chute de l'Ordre Jedi. Essentiel pour les collectionneurs de traditions Mandalorian et d'histoires de survivants de l'Ordre 66.",
    description_es: "Kelleran Beq, conocido como 'El Saboteador Jedi', aparece en The Mandalorian rescatando a Grogu durante la Orden 66. Sus acciones heroicas salvaron al Niño de la masacre del Templo Jedi. El personaje de Beq conecta la historia de fondo de Grogu con la caída de la Orden Jedi. Esencial para coleccionistas de tradiciones Mandalorian e historias de supervivientes de Orden 66."
  },
  {
    minifigure_no: 'sw1337',
    description_en: "The 501st Legion Clone Trooper Phase 2 with white arms serves in Anakin Skywalker's elite battalion. The distinctive blue markings identify service under one of the Republic's greatest generals. These loyal clones fought in countless battles before Order 66. Essential for army building 501st forces and Clone Wars battle displays.",
    description_de: "Der 501. Legion Klon-Truppler Phase 2 mit weißen Armen dient in Anakin Skywalkers Elite-Bataillon. Die markanten blauen Kennzeichnungen identifizieren Dienst unter einem der größten Generäle der Republik. Diese treuen Klone kämpften in unzähligen Schlachten vor Order 66. Unverzichtbar für Armeeaufbau von 501.-Streitkräften und Klonkriegs-Schlacht-Ausstellungen.",
    description_fr: "Le Clone Trooper de la 501e Légion Phase 2 avec bras blancs sert dans le bataillon d'élite d'Anakin Skywalker. Les marquages bleus distinctifs identifient le service sous l'un des plus grands généraux de la République. Ces clones loyaux ont combattu dans d'innombrables batailles avant l'Ordre 66. Essentiel pour construire des forces de la 501e et des présentoirs de bataille des guerres des clones.",
    description_es: "El Clon Trooper de la Legión 501 Fase 2 con brazos blancos sirve en el batallón de élite de Anakin Skywalker. Las distintivas marcas azules identifican servicio bajo uno de los más grandes generales de la República. Estos clones leales lucharon en incontables batallas antes de la Orden 66. Esencial para construir ejércitos de fuerzas 501 y exhibiciones de batalla de Guerras Clon."
  },
  {
    minifigure_no: 'sw1338',
    description_en: "The Battle Droid Pilot in blue with tan insignia operates Separatist starfighters and vehicles. The distinctive blue coloring identifies pilot droids from standard infantry. The angled and straight arms allow for varied poses. Perfect for completing Separatist vehicle crews and creating droid starfighter squadrons.",
    description_de: "Der Kampfdroiden-Pilot in Blau mit hellbrauner Insignie bedient Sternenjäger und Fahrzeuge der Separatisten. Die markante blaue Färbung identifiziert Piloten-Droiden von Standard-Infanterie. Die abgewinkelten und geraden Arme ermöglichen variierte Posen. Perfekt zum Vervollständigen von Separatisten-Fahrzeugbesatzungen und die Schaffung von Droiden-Sternenjäger-Staffeln.",
    description_fr: "Le droïde de combat pilote en bleu avec insignes beiges opère les chasseurs stellaires et véhicules séparatistes. La coloration bleue distinctive identifie les droïdes pilotes de l'infanterie standard. Les bras angulés et droits permettent des poses variées. Parfait pour compléter les équipages de véhicules séparatistes et créer des escadrons de chasseurs stellaires droïdes.",
    description_es: "El Droide de Batalla Piloto en azul con insignia beige opera cazas estelares y vehículos separatistas. La distintiva coloración azul identifica droides piloto de la infantería estándar. Los brazos angulados y rectos permiten poses variadas. Perfecto para completar tripulaciones de vehículos separatistas y crear escuadrones de cazas estelares droides."
  },
  {
    minifigure_no: 'sw1339',
    description_en: "The Mouse Droid (MSE-6) with 2 clips scurries through Imperial installations performing menial tasks. These small utility droids became iconic despite minimal screen time. The compact design captures the droid's distinctive boxy appearance. Perfect for adding authentic background detail to Death Star and Star Destroyer interior displays.",
    description_de: "Der Maus-Droide (MSE-6) mit 2 Clips huscht durch imperiale Installationen und führt niedere Aufgaben aus. Diese kleinen Nutz-Droiden wurden trotz minimaler Bildschirmzeit ikonisch. Das kompakte Design fängt das markante kastenförmige Aussehen des Droiden ein. Perfekt zum Hinzufügen authentischer Hintergrunddetails zu Todesstern- und Sternenzerstörer-Innenraum-Ausstellungen.",
    description_fr: "Le droïde souris (MSE-6) avec 2 clips se précipite à travers les installations impériales effectuant des tâches subalternes. Ces petits droïdes utilitaires sont devenus emblématiques malgré un temps d'écran minimal. Le design compact capture l'apparence cubique distinctive du droïde. Parfait pour ajouter des détails de fond authentiques aux présentoirs d'intérieurs d'Étoile de la Mort et de Star Destroyer.",
    description_es: "El Droide Ratón (MSE-6) con 2 clips se apresura por instalaciones imperiales realizando tareas serviles. Estos pequeños droides utilitarios se volvieron icónicos a pesar de tiempo mínimo en pantalla. El diseño compacto captura la distintiva apariencia cuadrada del droide. Perfecto para añadir detalle auténtico de fondo a exhibiciones de interiores de Estrella de la Muerte y Destructor Estelar."
  },
  {
    minifigure_no: 'sw1340',
    description_en: "The Droideka (Destroyer Droid) with light bluish gray claws and dark bluish gray plate represents the Separatist's rolling battle droids. These shielded units provide devastating firepower. The distinctive design captures the droid's menacing wheel-to-walker transformation. Essential for collectors of Separatist forces and Phantom Menace battle scenes.",
    description_de: "Der Droideka (Zerstörer-Droide) mit hellblaugrauen Klauen und dunkelblaugrauer Platte repräsentiert die rollenden Kampfdroiden der Separatisten. Diese geschilderten Einheiten bieten verheerende Feuerkraft. Das markante Design fängt die bedrohliche Rad-zu-Läufer-Transformation des Droiden ein. Unverzichtbar für Sammler von Separatisten-Streitkräften und Phantom Menace-Kampfszenen.",
    description_fr: "Le Droideka (droïde destructeur) avec griffes gris bleuâtre clair et plaque gris bleuâtre foncé représente les droïdes de combat roulants des Séparatistes. Ces unités blindées fournissent une puissance de feu dévastatrice. Le design distinctif capture la transformation menaçante roue-à-marcheur du droïde. Essentiel pour les collectionneurs de forces séparatistes et de scènes de bataille de La Menace Fantôme.",
    description_es: "El Droideka (Droide Destructor) con garras gris azulado claro y placa gris azulado oscuro representa los droides de batalla rodantes de los Separatistas. Estas unidades con escudo proporcionan potencia de fuego devastadora. El diseño distintivo captura la amenazante transformación rueda-a-caminante del droide. Esencial para coleccionistas de fuerzas separatistas y escenas de batalla de La Amenaza Fantasma."
  },
  {
    minifigure_no: 'sw1341',
    description_en: "Paz Vizsla without backpack clip represents the heavy weapons specialist of Din's Mandalorian covert. His massive blue armor and dedication to the ancient Way made him a formidable warrior. Paz's sacrifice defending the covert made him heroic. Essential for collectors of Mandalorian characters and tribal warrior displays.",
    description_de: "Paz Vizsla ohne Rucksack-Clip repräsentiert den Schwerwaffenspezialisten von Dins mandalorianischem Geheimbund. Seine massive blaue Rüstung und Hingabe zum alten Weg machten ihn zu einem gewaltigen Krieger. Paz' Opfer bei der Verteidigung des Geheimbunds machte ihn heldenhaft. Unverzichtbar für Sammler von Mandalorian-Charakteren und Stammeskrieger-Ausstellungen.",
    description_fr: "Paz Vizsla sans clip de sac à dos représente le spécialiste des armes lourdes de la cellule mandalorienne de Din. Son armure bleue massive et son dévouement à l'ancienne Voie en ont fait un guerrier redoutable. Le sacrifice de Paz défendant la cellule l'a rendu héroïque. Essentiel pour les collectionneurs de personnages Mandalorian et de présentoirs de guerriers tribaux.",
    description_es: "Paz Vizsla sin clip de mochila representa al especialista en armas pesadas del enclave mandaloriano de Din. Su masiva armadura azul y dedicación al antiguo Camino lo hicieron un guerrero formidable. El sacrificio de Paz defendiendo el enclave lo hizo heroico. Esencial para coleccionistas de personajes Mandalorian y exhibiciones de guerreros tribales."
  },
  {
    minifigure_no: 'sw1342',
    description_en: "Moff Gideon in full combat armor with helmet and jet pack represents the Imperial warlord's warrior capabilities. This battle-ready variant shows Gideon as more than just a strategist. The beskar armor and jet pack demonstrate his willingness to fight personally. Essential for collectors of Mandalorian villains and armored Imperial commanders.",
    description_de: "Moff Gideon in voller Kampfrüstung mit Helm und Jet Pack repräsentiert die Kriegerfähigkeiten des imperialen Kriegsherrn. Diese kampfbereite Variante zeigt Gideon als mehr als nur einen Strategen. Die Beskar-Rüstung und Jet Pack demonstrieren seine Bereitschaft, persönlich zu kämpfen. Unverzichtbar für Sammler von Mandalorian-Bösewichten und gepanzerten imperialen Kommandanten.",
    description_fr: "Moff Gideon en armure de combat complète avec casque et réacteur dorsal représente les capacités de guerrier du seigneur de guerre impérial. Cette variante prête au combat montre Gideon comme plus qu'un simple stratège. L'armure beskar et le réacteur dorsal démontrent sa volonté de combattre personnellement. Essentiel pour les collectionneurs de méchants Mandalorian et de commandants impériaux blindés.",
    description_es: "Moff Gideon en armadura de combate completa con casco y jet pack representa las capacidades de guerrero del señor de la guerra imperial. Esta variante lista para batalla muestra a Gideon como más que solo un estratega. La armadura beskar y jet pack demuestran su disposición a luchar personalmente. Esencial para coleccionistas de villanos Mandalorian y comandantes imperiales blindados."
  },
  {
    minifigure_no: 'sw1343',
    description_en: "The Imperial Praetorian Guard serves as Supreme Leader Snoke's elite protectors with distinctive red armor. These silent warriors demonstrate lethal martial arts skills. The striking red design makes them visually memorable. Essential for collectors of Sequel Trilogy characters and First Order leadership displays.",
    description_de: "Die imperiale Prätorianergarde dient als Elite-Beschützer von Obersten Anführer Snoke mit markanter roter Rüstung. Diese stillen Krieger demonstrieren tödliche Kampfkunstfähigkeiten. Das auffällige rote Design macht sie visuell unvergesslich. Unverzichtbar für Sammler von Sequel-Trilogie-Charakteren und First Order-Führungs-Ausstellungen.",
    description_fr: "La garde prétorienne impériale sert de protecteurs d'élite du Leader Suprême Snoke avec armure rouge distinctive. Ces guerriers silencieux démontrent des compétences létales en arts martiaux. Le design rouge frappant les rend visuellement mémorables. Essentielle pour les collectionneurs de personnages de la trilogie suite et de présentoirs de leadership du Premier Ordre.",
    description_es: "La Guardia Pretoriana Imperial sirve como protectores de élite del Líder Supremo Snoke con distintiva armadura roja. Estos guerreros silenciosos demuestran habilidades letales de artes marciales. El llamativo diseño rojo los hace visualmente memorables. Esencial para coleccionistas de personajes de Trilogía Secuela y exhibiciones de liderazgo de la Primera Orden."
  },
  {
    minifigure_no: 'sw1344',
    description_en: "The Mandalorian Nite Owl serves in Bo-Katan's elite unit fighting to reclaim Mandalore. These skilled warriors wear distinctive blue and gray armor. The Nite Owls represent Mandalorian military tradition and honor. Perfect for army building Bo-Katan's forces and creating Mandalorian civil war displays.",
    description_de: "Die mandalorianische Nite Owl dient in Bo-Katans Elite-Einheit, die kämpft, um Mandalor zurückzufordern. Diese erfahrenen Krieger tragen markante blau-graue Rüstung. Die Nite Owls repräsentieren mandalorianische Militärtradition und Ehre. Perfekt für Armeeaufbau von Bo-Katans Streitkräften und die Schaffung mandalorianischer Bürgerkriegs-Ausstellungen.",
    description_fr: "Le Nite Owl mandalorien sert dans l'unité d'élite de Bo-Katan combattant pour récupérer Mandalore. Ces guerriers qualifiés portent une armure bleue et grise distinctive. Les Nite Owls représentent la tradition militaire et l'honneur mandaloriens. Parfait pour construire les forces de Bo-Katan et créer des présentoirs de guerre civile mandalorienne.",
    description_es: "El Nite Owl Mandaloriano sirve en la unidad de élite de Bo-Katan luchando para reclamar Mandalore. Estos guerreros hábiles llevan distintiva armadura azul y gris. Los Nite Owls representan tradición militar y honor mandaloriano. Perfecto para construir ejércitos de fuerzas de Bo-Katan y crear exhibiciones de guerra civil mandaloriana."
  },
  {
    minifigure_no: 'sw1345',
    description_en: "The Mandalorian Warrior represents the diverse fighters seeking to reclaim their homeworld. These warriors follow the ancient Way and Mandalorian traditions. Their distinctive armor allows for varied Mandalorian army displays. Essential for collectors building comprehensive Mandalorian forces across different factions and eras.",
    description_de: "Der mandalorianische Krieger repräsentiert die vielfältigen Kämpfer, die ihre Heimatwelt zurückfordern wollen. Diese Krieger folgen dem alten Weg und mandalorianischen Traditionen. Ihre markante Rüstung ermöglicht variierte mandalorianische Armee-Ausstellungen. Unverzichtbar für Sammler, die umfassende mandalorianische Streitkräfte über verschiedene Fraktionen und Epochen bauen.",
    description_fr: "Le guerrier mandalorien représente les combattants divers cherchant à récupérer leur monde natal. Ces guerriers suivent l'ancienne Voie et les traditions mandaloriennes. Leur armure distinctive permet des présentoirs d'armée mandalorienne variés. Essentiel pour les collectionneurs construisant des forces mandaloriennes complètes à travers différentes factions et époques.",
    description_es: "El Guerrero Mandaloriano representa a los diversos luchadores buscando reclamar su mundo natal. Estos guerreros siguen el antiguo Camino y tradiciones mandalorianas. Su distintiva armadura permite exhibiciones variadas de ejército mandaloriano. Esencial para coleccionistas construyendo fuerzas mandalorianas completas a través de diferentes facciones y eras."
  },
  {
    minifigure_no: 'sw1346',
    description_en: "The Imperial Commando represents elite special forces operating for the Empire's most sensitive missions. These highly trained soldiers undertake covert operations and high-value target elimination. The distinctive armor marks them as superior to standard Stormtroopers. Essential for collectors of Imperial special forces and elite unit displays.",
    description_de: "Der Imperial Commando repräsentiert Elite-Spezialeinheiten, die für die sensibelsten Missionen des Imperiums operieren. Diese hochtrainierten Soldaten unternehmen verdeckte Operationen und hochwertige Ziel-Eliminierung. Die markante Rüstung kennzeichnet sie als überlegen gegenüber Standard-Sturmtrupplern. Unverzichtbar für Sammler imperialer Spezialeinheiten und Elite-Einheiten-Ausstellungen.",
    description_fr: "Le commando impérial représente des forces spéciales d'élite opérant pour les missions les plus sensibles de l'Empire. Ces soldats hautement entraînés entreprennent des opérations secrètes et l'élimination de cibles de haute valeur. L'armure distinctive les marque comme supérieurs aux Stormtroopers standard. Essentiel pour les collectionneurs de forces spéciales impériales et de présentoirs d'unités d'élite.",
    description_es: "El Comando Imperial representa fuerzas especiales de élite operando para las misiones más sensibles del Imperio. Estos soldados altamente entrenados realizan operaciones encubiertas y eliminación de objetivos de alto valor. La distintiva armadura los marca como superiores a Stormtroopers estándar. Esencial para coleccionistas de fuerzas especiales imperiales y exhibiciones de unidades de élite."
  },
  {
    minifigure_no: 'sw1347',
    description_en: "The Mandalorian Fleet Commander with helmet leads naval operations for the Mandalorian forces. Her command position demonstrates leadership within the scattered Mandalorian military. The helmet variant allows for fully armored display configurations. Important for collectors building Mandalorian command structures and fleet command displays.",
    description_de: "Die mandalorianische Flottenkommandantin mit Helm führt Marineoperationen für die mandalorianischen Streitkräfte. Ihre Befehlsposition demonstriert Führung innerhalb des verstreuten mandalorianischen Militärs. Die Helm-Variante ermöglicht vollständig gepanzerte Display-Konfigurationen. Wichtig für Sammler, die mandalorianische Befehlsstrukturen und Flottenkommando-Ausstellungen bauen.",
    description_fr: "Le commandant de flotte mandalorien avec casque dirige les opérations navales pour les forces mandaloriennes. Sa position de commandement démontre le leadership au sein du militaire mandalorien dispersé. La variante avec casque permet des configurations d'affichage entièrement blindées. Important pour les collectionneurs construisant des structures de commandement mandaloriennes et des présentoirs de commandement de flotte.",
    description_es: "La Comandante de Flota Mandaloriana con casco lidera operaciones navales para las fuerzas mandalorianas. Su posición de comando demuestra liderazgo dentro del disperso militar mandaloriano. La variante con casco permite configuraciones de exhibición completamente blindadas. Importante para coleccionistas construyendo estructuras de comando mandalorianas y exhibiciones de comando de flota."
  },
  {
    minifigure_no: 'sw1348',
    description_en: "Young Princess Leia captures the future Rebel leader during her childhood on Alderaan. This innocent version predates her involvement in galactic conflict. The character appears in the Obi-Wan Kenobi series showing her early courage. Essential for collectors of Leia's complete life story and Obi-Wan series characters.",
    description_de: "Die junge Prinzessin Leia fängt die zukünftige Rebellenführerin während ihrer Kindheit auf Alderaan ein. Diese unschuldige Version datiert vor ihrer Beteiligung am galaktischen Konflikt. Der Charakter erscheint in der Obi-Wan Kenobi-Serie und zeigt ihren frühen Mut. Unverzichtbar für Sammler von Leias vollständiger Lebensgeschichte und Obi-Wan-Serien-Charakteren.",
    description_fr: "La jeune Princesse Leia capture la future chef rebelle pendant son enfance sur Alderaan. Cette version innocente précède son implication dans le conflit galactique. Le personnage apparaît dans la série Obi-Wan Kenobi montrant son courage précoce. Essentielle pour les collectionneurs de l'histoire de vie complète de Leia et de personnages de la série Obi-Wan.",
    description_es: "La joven Princesa Leia captura a la futura líder rebelde durante su infancia en Alderaan. Esta versión inocente precede su involucramiento en el conflicto galáctico. El personaje aparece en la serie Obi-Wan Kenobi mostrando su temprano coraje. Esencial para coleccionistas de la historia de vida completa de Leia y personajes de la serie Obi-Wan."
  },
  {
    minifigure_no: 'sw1349',
    description_en: "Wim appears as a young character in Star Wars: Skeleton Crew exploring the galaxy. This character introduces new young heroes to the Star Wars universe. The design appeals to younger audiences while expanding the character roster. Perfect for collectors of Skeleton Crew characters and next-generation Star Wars heroes.",
    description_de: "Wim erscheint als junger Charakter in Star Wars: Skeleton Crew und erkundet die Galaxie. Dieser Charakter führt neue junge Helden in das Star Wars-Universum ein. Das Design spricht jüngere Zuschauer an und erweitert das Charakter-Roster. Perfekt für Sammler von Skeleton Crew-Charakteren und Star Wars-Helden der nächsten Generation.",
    description_fr: "Wim apparaît comme un jeune personnage dans Star Wars: Skeleton Crew explorant la galaxie. Ce personnage introduit de nouveaux jeunes héros dans l'univers Star Wars. Le design séduit les jeunes publics tout en élargissant la liste de personnages. Parfait pour les collectionneurs de personnages Skeleton Crew et de héros Star Wars de nouvelle génération.",
    description_es: "Wim aparece como un joven personaje en Star Wars: Skeleton Crew explorando la galaxia. Este personaje introduce nuevos héroes jóvenes al universo Star Wars. El diseño atrae a audiencias más jóvenes mientras expande la lista de personajes. Perfecto para coleccionistas de personajes Skeleton Crew y héroes Star Wars de nueva generación."
  },
  {
    minifigure_no: 'sw1350',
    description_en: "Neel serves as a young character in Star Wars: Skeleton Crew on galactic adventures. This character helps introduce Star Wars storytelling to younger audiences. The distinctive alien design adds diversity to the character lineup. Essential for collectors of Skeleton Crew content and building complete series character rosters.",
    description_de: "Neel dient als junger Charakter in Star Wars: Skeleton Crew auf galaktischen Abenteuern. Dieser Charakter hilft, Star Wars-Erzählungen jüngeren Zuschauern vorzustellen. Das markante Außerirdischen-Design fügt Vielfalt zum Charakter-Lineup hinzu. Unverzichtbar für Sammler von Skeleton Crew-Inhalten und zum Aufbau vollständiger Serien-Charakter-Rosters.",
    description_fr: "Neel sert de jeune personnage dans Star Wars: Skeleton Crew dans des aventures galactiques. Ce personnage aide à introduire la narration Star Wars aux jeunes publics. Le design alien distinctif ajoute de la diversité à la gamme de personnages. Essentiel pour les collectionneurs de contenu Skeleton Crew et pour construire des listes de personnages de série complètes.",
    description_es: "Neel sirve como un joven personaje en Star Wars: Skeleton Crew en aventuras galácticas. Este personaje ayuda a introducir la narrativa de Star Wars a audiencias más jóvenes. El distintivo diseño alienígena añade diversidad a la alineación de personajes. Esencial para coleccionistas de contenido Skeleton Crew y construir listas completas de personajes de la serie."
  }
];

async function main() {
  console.log('Starting batch save for sw1326-sw1350...');

  for (const desc of descriptions) {
    await prisma.minifigCatalog.update({
      where: { minifigure_no: desc.minifigure_no },
      data: {
        description_en: desc.description_en,
        description_de: desc.description_de,
        description_fr: desc.description_fr,
        description_es: desc.description_es,
        description_generated_at: new Date(),
        description_status: 'completed'
      }
    });
    console.log(`✓ Saved ${desc.minifigure_no}: ${desc.minifigure_no}`);
  }

  await prisma.$disconnect();
  console.log(`Batch complete! ${descriptions.length} minifigs saved (sw1326-sw1350).`);
}

main().catch(console.error);
