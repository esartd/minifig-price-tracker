import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0710',
    name: 'Ugnaught - Dark Blue Overalls and Short Legs',
    description_en: 'Ugnaughts were diminutive laborers who operated Cloud City\'s industrial facilities. This variant with dark blue overalls and short legs captured their distinctive appearance. These hardworking beings maintained Bespin\'s tibanna gas processing equipment. Ugnaughts became memorable from their role helping freeze Han Solo in carbonite.',
    description_de: 'Ugnaughts waren winzige Arbeiter, die Cloud Citys industrielle Anlagen betrieben. Diese Variante mit dunkelblauen Overalls und kurzen Beinen erfasste ihr markantes Erscheinungsbild. Diese fleißigen Wesen warteten Bespins Tibanna-Gas-Verarbeitungsausrüstung. Ugnaughts wurden unvergesslich durch ihre Rolle beim Einfrieren von Han Solo in Karbonit.',
    description_fr: 'Les Ugnaughts étaient des travailleurs minuscules qui opéraient les installations industrielles de la Cité des Nuages. Cette variante avec salopette bleue foncée et jambes courtes capturait leur apparence distinctive. Ces êtres travailleurs maintenaient l\'équipement de traitement de gaz tibanna de Bespin. Les Ugnaughts devinrent mémorables par leur rôle aidant à congeler Han Solo en carbonite.',
    description_es: 'Los Ugnaughts eran trabajadores diminutos que operaban instalaciones industriales de Ciudad Nube. Esta variante con overol azul oscuro y piernas cortas capturaba su apariencia distintiva. Estos seres trabajadores mantenían equipo de procesamiento de gas tibanna de Bespin. Los Ugnaughts se volvieron memorables por su rol ayudando a congelar a Han Solo en carbonita.'
  },
  {
    minifigure_no: 'sw0711',
    name: 'Boba Fett - Pauldron Cloth with Dark Orange Stripe Pattern',
    description_en: 'This Boba Fett variant features cloth pauldron with dark orange stripe pattern showing detail evolution. The legendary bounty hunter\'s distinctive shoulder armor marked his Mandalorian heritage. Boba Fett\'s weathered armor told stories of countless successful hunts. His reputation made him the most feared bounty hunter in the galaxy.',
    description_de: 'Diese Boba-Fett-Variante zeigt Stoff-Pauldron mit dunkelorangem Streifenmuster, das Detail-Evolution zeigt. Die markante Schulterpanzerung des legendären Kopfgeldjägers kennzeichnete sein mandalorianisches Erbe. Boba Fetts verwitterte Rüstung erzählte Geschichten von unzähligen erfolgreichen Jagden. Sein Ruf machte ihn zum gefürchtetsten Kopfgeldjäger der Galaxis.',
    description_fr: 'Cette variante de Boba Fett présente épaulière en tissu avec motif de rayures orange foncé montrant évolution des détails. L\'armure d\'épaule distinctive du chasseur de primes légendaire marquait son héritage mandalorienne. L\'armure altérée de Boba Fett racontait histoires de chasses réussies innombrables. Sa réputation en faisait le chasseur de primes le plus redouté de la galaxie.',
    description_es: 'Esta variante de Boba Fett presenta hombrera de tela con patrón de rayas naranja oscuro mostrando evolución de detalle. La armadura de hombro distintiva del cazarrecompensas legendario marcaba su herencia mandaloriana. La armadura desgastada de Boba Fett contaba historias de incontables cacerías exitosas. Su reputación lo convertía en el cazarrecompensas más temido de la galaxia.'
  },
  {
    minifigure_no: 'sw0712',
    name: 'Imperial Probe Droid - Dark Bluish Gray Sensors, Reddish Brown Round Plate Inside',
    description_en: 'Imperial Probe Droids scanned remote worlds searching for Rebel hideouts across the galaxy. This variant with dark bluish gray sensors and reddish brown internal plating showed technical detail. These automated scouts transmitted data before self-destructing when discovered. A probe droid\'s discovery of Echo Base triggered the Battle of Hoth.',
    description_de: 'Imperiale Sonden-Droiden scannten entfernte Welten auf der Suche nach Rebellenverstecken in der Galaxis. Diese Variante mit dunklen bläulich-grauen Sensoren und rötlich-brauner interner Plattierung zeigte technisches Detail. Diese automatisierten Scouts übertrugen Daten vor Selbstzerstörung bei Entdeckung. Die Entdeckung von Echo Base durch einen Sonden-Droiden löste die Schlacht von Hoth aus.',
    description_fr: 'Les Droïdes Sondes Impériaux scannaient mondes éloignés cherchant cachettes rebelles à travers la galaxie. Cette variante avec capteurs gris bleuté foncé et placage interne brun rougeâtre montrait détail technique. Ces éclaireurs automatisés transmettaient données avant auto-destruction lors de découverte. La découverte de la Base Echo par un droïde sonde déclencha la Bataille de Hoth.',
    description_es: 'Los Droides Sonda Imperial escaneaban mundos remotos buscando escondites rebeldes por la galaxia. Esta variante con sensores gris azulado oscuro y revestimiento interno marrón rojizo mostraba detalle técnico. Estos exploradores automatizados transmitían datos antes de autodestrucción al ser descubiertos. El descubrimiento de Base Eco por droide sonda desencadenó la Batalla de Hoth.'
  },
  {
    minifigure_no: 'sw0712a',
    name: 'Imperial Probe Droid - Dark Bluish Gray Sensors, Dark Bluish Gray Round Plate Inside',
    description_en: 'This probe droid variant features uniform dark bluish gray coloring for both sensors and internal plating. The Viper probe droids operated autonomously in hostile environments. Their repulsorlift technology enabled hovering over varied terrain while scanning. These mechanical scouts epitomized Imperial technological superiority in surveillance.',
    description_de: 'Diese Sonden-Droiden-Variante zeigt einheitliche dunkle bläulich-graue Färbung für Sensoren und interne Plattierung. Die Viper-Sonden-Droiden operierten autonom in feindlichen Umgebungen. Ihre Repulsorlift-Technologie ermöglichte Schweben über variiertem Terrain beim Scannen. Diese mechanischen Scouts verkörperten imperiale technologische Überlegenheit in Überwachung.',
    description_fr: 'Cette variante de droïde sonde présente coloration gris bleuté foncé uniforme pour capteurs et placage interne. Les droïdes sonde Viper opéraient de manière autonome dans environnements hostiles. Leur technologie répulseur permettait flottement sur terrain varié pendant scan. Ces éclaireurs mécaniques incarnaient supériorité technologique impériale en surveillance.',
    description_es: 'Esta variante de droide sonda presenta coloración gris azulado oscuro uniforme para sensores y revestimiento interno. Los droides sonda Viper operaban autónomamente en entornos hostiles. Su tecnología repulsora permitía flotar sobre terreno variado mientras escaneaban. Estos exploradores mecánicos personificaban superioridad tecnológica imperial en vigilancia.'
  },
  {
    minifigure_no: 'sw0713',
    name: 'Wookiee - Reddish Brown with Dark Tan Fur, Printed Legs, Plain Arms',
    description_en: 'Wookiees from Kashyyyk were mighty warriors known for strength and loyalty. This variant with reddish brown fur and printed legs showed diverse Wookiee appearances. These towering beings fought alongside Rebels using bowcasters and traditional weapons. Wookiees like Chewbacca proved invaluable allies combining raw power with technical skill.',
    description_de: 'Wookiees von Kashyyyk waren mächtige Krieger, bekannt für Stärke und Loyalität. Diese Variante mit rötlich-braunem Fell und bedruckten Beinen zeigte vielfältige Wookiee-Erscheinungen. Diese hoch aufragenden Wesen kämpften neben Rebellen mit Armbrüsten und traditionellen Waffen. Wookiees wie Chewbacca erwiesen sich als unschätzbare Verbündete, die rohe Kraft mit technischer Fähigkeit kombinierten.',
    description_fr: 'Les Wookiees de Kashyyyk étaient de puissants guerriers connus pour force et loyauté. Cette variante avec fourrure brun rougeâtre et jambes imprimées montrait apparences Wookiee diverses. Ces êtres imposants combattaient aux côtés des Rebelles utilisant arbalètes et armes traditionnelles. Les Wookiees comme Chewbacca se révélaient alliés inestimables combinant puissance brute avec compétence technique.',
    description_es: 'Los Wookiees de Kashyyyk eran guerreros poderosos conocidos por fuerza y lealtad. Esta variante con pelaje marrón rojizo y piernas impresas mostraba apariencias Wookiee diversas. Estos seres imponentes luchaban junto a Rebeldes usando ballestas y armas tradicionales. Los Wookiees como Chewbacca demostraron ser aliados invaluables combinando poder bruto con habilidad técnica.'
  },
  {
    minifigure_no: 'sw0714',
    name: 'Han Solo - White Shirt with Wrinkles on Front, Dark Brown Legs, Smooth Hair',
    description_en: 'This Han Solo variant captures his classic smuggler appearance with white shirt showing wrinkles and smooth hair. His casual attire reflected independence from military uniforms. The wrinkled shirt detailed Han\'s roguish, practical style. This iconic look defined the charismatic scoundrel throughout the original trilogy.',
    description_de: 'Diese Han-Solo-Variante erfasst sein klassisches Schmuggler-Erscheinungsbild mit weißem Hemd mit Falten und glattem Haar. Seine lässige Kleidung spiegelte Unabhängigkeit von Militäruniformen wider. Das zerknitterte Hemd detaillierte Hans spitzbübischen, praktischen Stil. Dieser ikonische Look definierte den charismatischen Schurken während der ursprünglichen Trilogie.',
    description_fr: 'Cette variante de Han Solo capture son apparence de contrebandier classique avec chemise blanche montrant plis et cheveux lisses. Sa tenue décontractée reflétait indépendance des uniformes militaires. La chemise froissée détaillait le style roublard et pratique de Han. Ce look iconique définissait le gredin charismatique tout au long de la trilogie originale.',
    description_es: 'Esta variante de Han Solo captura su apariencia clásica de contrabandista con camisa blanca mostrando arrugas y cabello liso. Su atuendo casual reflejaba independencia de uniformes militares. La camisa arrugada detallaba estilo pícaro y práctico de Han. Este look icónico definía al pícaro carismático a través de la trilogía original.'
  },
  {
    minifigure_no: 'sw0715',
    name: 'First Order General (Admiral)',
    description_en: 'First Order Generals and Admirals commanded vast military forces with ruthless efficiency. Their gray uniforms with rank insignia marked senior command authority. These strategic commanders planned campaigns to crush Resistance opposition. First Order leadership combined Imperial doctrine with fanatical devotion to Supreme Leader Snoke.',
    description_de: 'Generäle und Admiräle der Ersten Ordnung befehligten riesige Militärkräfte mit rücksichtsloser Effizienz. Ihre grauen Uniformen mit Rangabzeichen kennzeichneten hohe Befehlsgewalt. Diese strategischen Kommandanten planten Kampagnen zur Zerschlagung der Widerstands-Opposition. Die Führung der Ersten Ordnung kombinierte imperiale Doktrin mit fanatischer Hingabe an Obersten Anführer Snoke.',
    description_fr: 'Les Généraux et Amiraux du Premier Ordre commandaient vastes forces militaires avec efficacité impitoyable. Leurs uniformes gris avec insignes de rang marquaient autorité de commandement supérieur. Ces commandants stratégiques planifiaient campagnes pour écraser opposition de la Résistance. Le leadership du Premier Ordre combinait doctrine impériale avec dévotion fanatique au Leader Suprême Snoke.',
    description_es: 'Los Generales y Almirantes de la Primera Orden comandaban vastas fuerzas militares con eficiencia despiadada. Sus uniformes grises con insignias de rango marcaban autoridad de mando superior. Estos comandantes estratégicos planeaban campañas para aplastar oposición de la Resistencia. El liderazgo de la Primera Orden combinaba doctrina imperial con devoción fanática al Líder Supremo Snoke.'
  },
  {
    minifigure_no: 'sw0716',
    name: 'Finn - First Order Stormtrooper (FN-2187)',
    description_en: 'FN-2187 served as a First Order stormtrooper before his conscience drove him to defect. This variant captures Finn in full armor before removing his helmet and choosing freedom. His crisis of conscience during his first combat mission sparked his desertion. Finn\'s courage to abandon everything he knew made him a symbol of hope.',
    description_de: 'FN-2187 diente als Sturmtruppler der Ersten Ordnung, bevor sein Gewissen ihn zum Überlaufen trieb. Diese Variante erfasst Finn in voller Rüstung, bevor er seinen Helm abnahm und Freiheit wählte. Seine Gewissenskrise während seiner ersten Kampfmission löste seine Desertion aus. Finns Mut, alles aufzugeben, was er kannte, machte ihn zu einem Symbol der Hoffnung.',
    description_fr: 'FN-2187 servait comme stormtrooper du Premier Ordre avant que sa conscience le pousse à déserter. Cette variante capture Finn en armure complète avant de retirer son casque et choisir la liberté. Sa crise de conscience pendant sa première mission de combat déclencha sa désertion. Le courage de Finn d\'abandonner tout ce qu\'il connaissait en fit un symbole d\'espoir.',
    description_es: 'FN-2187 servía como stormtrooper de la Primera Orden antes de que su conciencia lo impulsara a desertar. Esta variante captura a Finn en armadura completa antes de quitar su casco y elegir libertad. Su crisis de conciencia durante su primera misión de combate desencadenó su deserción. El valor de Finn de abandonar todo lo que conocía lo convirtió en símbolo de esperanza.'
  },
  {
    minifigure_no: 'sw0717',
    name: 'Kylo Ren (Hair)',
    description_en: 'Kylo Ren with hair showing beneath his mask revealed Ben Solo\'s conflicted nature. The grandson of Darth Vader struggled between light and darkness. His volatile temperament and immense Force power made him Supreme Leader Snoke\'s prized apprentice. Kylo\'s obsession with his grandfather\'s legacy drove his descent into darkness.',
    description_de: 'Kylo Ren mit Haaren unter seiner Maske zeigte Ben Solos konfliktreiche Natur. Der Enkel von Darth Vader kämpfte zwischen Licht und Dunkelheit. Sein unbeständiges Temperament und immense Macht-Kraft machten ihn zu Obersten Anführer Snokes geschätztem Lehrling. Kylos Besessenheit mit dem Erbe seines Großvaters trieb seinen Abstieg in die Dunkelheit.',
    description_fr: 'Kylo Ren avec cheveux montrant sous son masque révélait la nature conflictuelle de Ben Solo. Le petit-fils de Dark Vador luttait entre lumière et obscurité. Son tempérament volatile et immense pouvoir de Force en faisaient l\'apprenti prisé du Leader Suprême Snoke. L\'obsession de Kylo pour l\'héritage de son grand-père conduisit sa descente dans l\'obscurité.',
    description_es: 'Kylo Ren con cabello mostrándose bajo su máscara revelaba naturaleza conflictiva de Ben Solo. El nieto de Darth Vader luchaba entre luz y oscuridad. Su temperamento volátil e inmenso poder de Fuerza lo convertían en aprendiz preciado del Líder Supremo Snoke. La obsesión de Kylo con legado de su abuelo impulsó su descenso a oscuridad.'
  },
  {
    minifigure_no: 'sw0718',
    name: 'General Leia',
    description_en: 'General Leia Organa led the Resistance against the First Order decades after defeating the Empire. Her distinguished service and diplomatic skills made her the natural leader opposing tyranny. Despite losing her son to darkness, Leia continued fighting for freedom. Her unwavering determination inspired a new generation of heroes.',
    description_de: 'General Leia Organa führte den Widerstand gegen die Erste Ordnung Jahrzehnte nach der Niederlage des Imperiums. Ihr ausgezeichneter Dienst und diplomatische Fähigkeiten machten sie zur natürlichen Führerin gegen Tyrannei. Trotz Verlust ihres Sohnes an die Dunkelheit kämpfte Leia weiter für Freiheit. Ihre unerschütterliche Entschlossenheit inspirierte eine neue Generation von Helden.',
    description_fr: 'Le Général Leia Organa dirigeait la Résistance contre le Premier Ordre des décennies après avoir vaincu l\'Empire. Son service distingué et compétences diplomatiques en faisaient le leader naturel s\'opposant à la tyrannie. Malgré la perte de son fils vers l\'obscurité, Leia continua à combattre pour la liberté. Sa détermination inébranlable inspira une nouvelle génération de héros.',
    description_es: 'La General Leia Organa lideraba la Resistencia contra la Primera Orden décadas después de derrotar al Imperio. Su servicio distinguido y habilidades diplomáticas la convertían en líder natural oponiéndose a tiranía. A pesar de perder a su hijo a oscuridad, Leia continuaba luchando por libertad. Su determinación inquebrantable inspiró nueva generación de héroes.'
  },
  {
    minifigure_no: 'sw0719',
    name: 'Admiral Ackbar - Medium Nougat Robe',
    description_en: 'Admiral Ackbar continued serving the Resistance in his elder years wearing medium nougat robes. The legendary Mon Calamari commander who led the Battle of Endor remained committed to fighting tyranny. His tactical brilliance and famous "It\'s a trap!" warning became iconic. Ackbar\'s presence connected the new struggle to the Alliance\'s legacy.',
    description_de: 'Admiral Ackbar diente weiter dem Widerstand in seinen älteren Jahren und trug mittlere Nougat-Roben. Der legendäre Mon-Calamari-Kommandant, der die Schlacht von Endor anführte, blieb dem Kampf gegen Tyrannei verpflichtet. Seine taktische Brillanz und berühmte "Es ist eine Falle!"-Warnung wurden ikonisch. Ackbars Präsenz verband den neuen Kampf mit dem Erbe der Allianz.',
    description_fr: 'L\'Amiral Ackbar continua à servir la Résistance dans ses années âgées portant robes nougat moyen. Le légendaire commandant Mon Calamari qui dirigea la Bataille d\'Endor resta engagé à combattre la tyrannie. Son génie tactique et célèbre avertissement "C\'est un piège!" devinrent iconiques. La présence d\'Ackbar reliait la nouvelle lutte à l\'héritage de l\'Alliance.',
    description_es: 'El Almirante Ackbar continuaba sirviendo a la Resistencia en sus años mayores llevando túnicas beige medio. El legendario comandante Mon Calamari que lideró la Batalla de Endor permanecía comprometido a luchar contra tiranía. Su brillantez táctica y famosa advertencia "¡Es una trampa!" se volvieron icónicos. La presencia de Ackbar conectaba nueva lucha con legado de la Alianza.'
  },
  {
    minifigure_no: 'sw0720',
    name: 'Resistance Trooper - Dark Tan Jacket, Frown, Cheek Lines',
    description_en: 'This Resistance Trooper\'s dark tan jacket and weathered features showed years of fighting against overwhelming odds. His cheek lines and frown captured the exhaustion of endless conflict. These veteran soldiers formed the experienced backbone of Resistance forces. Their determination kept hope alive despite suffering devastating losses.',
    description_de: 'Die dunkle beige Jacke und verwitterten Züge dieses Widerstands-Soldaten zeigten Jahre des Kampfes gegen überwältigende Chancen. Seine Wangenlinien und Stirnrunzeln erfassten die Erschöpfung endlosen Konflikts. Diese Veteranen-Soldaten bildeten das erfahrene Rückgrat der Widerstandskräfte. Ihre Entschlossenheit hielt Hoffnung am Leben trotz verheerender Verluste.',
    description_fr: 'La veste beige foncé et traits usés de ce Soldat de la Résistance montraient années de combat contre chances écrasantes. Ses lignes de joue et froncement capturaient l\'épuisement de conflit sans fin. Ces soldats vétérans formaient l\'épine dorsale expérimentée des forces de la Résistance. Leur détermination maintenait l\'espoir vivant malgré pertes dévastatrices.',
    description_es: 'La chaqueta beige oscuro y rasgos curtidos de este Soldado de la Resistencia mostraban años de lucha contra probabilidades abrumadoras. Sus líneas de mejilla y ceño fruncido capturaban agotamiento de conflicto interminable. Estos soldados veteranos formaban columna vertebral experimentada de fuerzas de la Resistencia. Su determinación mantenía esperanza viva a pesar de sufrir pérdidas devastadoras.'
  },
  {
    minifigure_no: 'sw0721',
    name: 'Resistance Trooper - Resistance Logo',
    description_en: 'This Resistance Trooper proudly displayed the Resistance logo symbolizing the fight against First Order tyranny. The phoenix-like emblem represented hope rising from the ashes of defeat. These soldiers wore their insignia as a badge of defiance against oppression. The logo connected them to the legacy of the Rebel Alliance.',
    description_de: 'Dieser Widerstands-Soldat trug stolz das Widerstands-Logo, das den Kampf gegen die Tyrannei der Ersten Ordnung symbolisierte. Das phönix-ähnliche Emblem repräsentierte Hoffnung, die aus der Asche der Niederlage aufsteigt. Diese Soldaten trugen ihr Abzeichen als Zeichen des Trotzes gegen Unterdrückung. Das Logo verband sie mit dem Erbe der Rebellenallianz.',
    description_fr: 'Ce Soldat de la Résistance arborait fièrement le logo de la Résistance symbolisant le combat contre la tyrannie du Premier Ordre. L\'emblème semblable au phénix représentait l\'espoir renaissant des cendres de la défaite. Ces soldats portaient leur insigne comme badge de défi contre l\'oppression. Le logo les reliait à l\'héritage de l\'Alliance Rebelle.',
    description_es: 'Este Soldado de la Resistencia mostraba orgullosamente el logo de la Resistencia simbolizando lucha contra tiranía de la Primera Orden. El emblema similar a fénix representaba esperanza surgiendo de cenizas de derrota. Estos soldados llevaban su insignia como distintivo de desafío contra opresión. El logo los conectaba con legado de la Alianza Rebelde.'
  },
  {
    minifigure_no: 'sw0722',
    name: 'First Order Heavy Assault Stormtrooper (Rounded Mouth Pattern) - Backpack, Ammo Pouch Print',
    description_en: 'First Order Heavy Assault Stormtroopers with backpack and ammo pouch specialized in sustained combat operations. Their additional equipment enabled prolonged battlefield presence. These heavily armed soldiers carried extra ammunition for extended firefights. The detailed printing showed First Order attention to specialized military equipment.',
    description_de: 'Schwere Angriffs-Sturmtruppler der Ersten Ordnung mit Rucksack und Munitionstasche spezialisierten sich auf anhaltende Kampfoperationen. Ihre zusätzliche Ausrüstung ermöglichte verlängerte Schlachtfeld-Präsenz. Diese schwer bewaffneten Soldaten trugen zusätzliche Munition für ausgedehnte Feuergefechte. Der detaillierte Druck zeigte die Aufmerksamkeit der Ersten Ordnung für spezialisierte Militärausrüstung.',
    description_fr: 'Les Stormtroopers d\'Assaut Lourd du Premier Ordre avec sac à dos et sacoche de munitions se spécialisaient en opérations de combat soutenues. Leur équipement supplémentaire permettait présence prolongée sur champ de bataille. Ces soldats lourdement armés transportaient munitions supplémentaires pour échanges de tirs prolongés. L\'impression détaillée montrait attention du Premier Ordre à équipement militaire spécialisé.',
    description_es: 'Los Stormtroopers de Asalto Pesado de la Primera Orden con mochila y bolsa de munición se especializaban en operaciones de combate sostenidas. Su equipo adicional permitía presencia prolongada en campo de batalla. Estos soldados fuertemente armados portaban munición extra para tiroteos prolongados. La impresión detallada mostraba atención de la Primera Orden a equipo militar especializado.'
  },
  {
    minifigure_no: 'sw0723',
    name: 'Unkar\'s Brute',
    description_en: 'Unkar\'s Brutes served as enforcers for the junk boss Unkar Plutt on Jakku. These thugs intimidated scavengers and maintained order in Unkar\'s territory. Their muscular builds and aggressive nature made them effective at collecting debts. These brutish henchmen represented the harsh survival economy of Jakku\'s scavenging underworld.',
    description_de: 'Unkars Schläger dienten als Vollstrecker für den Schrott-Boss Unkar Plutt auf Jakku. Diese Schläger schüchterten Plünderer ein und hielten Ordnung in Unkars Territorium. Ihre muskulösen Körperbauten und aggressive Natur machten sie effektiv beim Eintreiben von Schulden. Diese brutalen Handlanger repräsentierten die harte Überlebensökonomie von Jakkus Plünderungs-Unterwelt.',
    description_fr: 'Les Brutes d\'Unkar servaient comme exécuteurs pour le patron de ferraille Unkar Plutt sur Jakku. Ces voyous intimidaient récupérateurs et maintenaient l\'ordre sur le territoire d\'Unkar. Leurs corpulences musclées et nature agressive les rendaient efficaces pour collecter dettes. Ces sbires brutaux représentaient l\'économie de survie dure du monde souterrain de récupération de Jakku.',
    description_es: 'Los Brutos de Unkar servían como ejecutores para el jefe de chatarra Unkar Plutt en Jakku. Estos matones intimidaban carroñeros y mantenían orden en territorio de Unkar. Sus complexiones musculosas y naturaleza agresiva los hacían efectivos cobrando deudas. Estos secuaces brutales representaban economía de supervivencia dura del submundo de carroñeo de Jakku.'
  },
  {
    minifigure_no: 'sw0724',
    name: 'Astromech Droid, R3-A2',
    description_en: 'R3-A2 served as an astromech droid with distinctive red and white color scheme. These R3 units provided navigation, repair, and tactical support for starfighter pilots. R3 droids featured clear-dome heads revealing internal mechanisms. This droid continued the long tradition of loyal astromech companions throughout Star Wars.',
    description_de: 'R3-A2 diente als Astromech-Droide mit markanter rot-weißer Farbgebung. Diese R3-Einheiten boten Navigation, Reparatur und taktische Unterstützung für Sternjäger-Piloten. R3-Droiden zeigten klare Kuppelköpfe, die interne Mechanismen enthüllten. Dieser Droide setzte die lange Tradition treuer Astromech-Begleiter in Star Wars fort.',
    description_fr: 'R3-A2 servait comme droïde astromech avec schéma de couleurs rouge et blanc distinctif. Ces unités R3 fournissaient navigation, réparation et support tactique pour pilotes de chasseurs stellaires. Les droïdes R3 présentaient têtes à dôme transparent révélant mécanismes internes. Ce droïde continuait la longue tradition de compagnons astromech loyaux dans Star Wars.',
    description_es: 'R3-A2 servía como droide astromech con esquema de color rojo y blanco distintivo. Estas unidades R3 proporcionaban navegación, reparación y soporte táctico para pilotos de cazas estelares. Los droides R3 presentaban cabezas de cúpula transparente revelando mecanismos internos. Este droide continuaba larga tradición de compañeros astromech leales en Star Wars.'
  },
  {
    minifigure_no: 'sw0725',
    name: 'K-3PO - Printed Legs, Bright Light Yellow Eyes',
    description_en: 'K-3PO served as a protocol droid during the Rebellion with distinctive bright light yellow eyes. This K-series droid provided translation and diplomatic services. K-3PO\'s printed legs showed detailed mechanical construction. Protocol droids like K-3PO proved essential for communication across species and cultures.',
    description_de: 'K-3PO diente als Protokoll-Droide während der Rebellion mit markanten hell leuchtend gelben Augen. Dieser K-Serien-Droide bot Übersetzungs- und diplomatische Dienste. K-3POs bedruckte Beine zeigten detaillierte mechanische Konstruktion. Protokoll-Droiden wie K-3PO erwiesen sich als wesentlich für Kommunikation über Spezies und Kulturen.',
    description_fr: 'K-3PO servait comme droïde de protocole pendant la Rébellion avec yeux jaune clair vif distinctifs. Ce droïde série K fournissait traduction et services diplomatiques. Les jambes imprimées de K-3PO montraient construction mécanique détaillée. Les droïdes de protocole comme K-3PO se révélaient essentiels pour communication à travers espèces et cultures.',
    description_es: 'K-3PO servía como droide de protocolo durante la Rebelión con ojos amarillo claro brillante distintivos. Este droide serie K proporcionaba traducción y servicios diplomáticos. Las piernas impresas de K-3PO mostraban construcción mecánica detallada. Los droides de protocolo como K-3PO resultaban esenciales para comunicación entre especies y culturas.'
  },
  {
    minifigure_no: 'sw0726',
    name: 'Toryn Farr',
    description_en: 'Toryn Farr served as communications officer at Echo Base coordinating the evacuation during the Battle of Hoth. Her calm professionalism under pressure managed tactical communications as Imperial forces closed in. Farr\'s efficient coordination helped save Rebel personnel during the desperate retreat. Her role exemplified the unsung heroes keeping the Alliance functioning.',
    description_de: 'Toryn Farr diente als Kommunikationsoffizierin auf Echo Base und koordinierte die Evakuierung während der Schlacht von Hoth. Ihre ruhige Professionalität unter Druck verwaltete taktische Kommunikation, während imperiale Kräfte näher rückten. Farrs effiziente Koordination half, Rebellen-Personal während des verzweifelten Rückzugs zu retten. Ihre Rolle verkörperte die unbesungenen Helden, die die Allianz funktionsfähig hielten.',
    description_fr: 'Toryn Farr servait comme officier de communications à la Base Echo coordonnant l\'évacuation pendant la Bataille de Hoth. Son professionnalisme calme sous pression gérait communications tactiques alors que forces impériales se rapprochaient. La coordination efficace de Farr aida à sauver personnel rebelle pendant la retraite désespérée. Son rôle exemplifiait les héros méconnus maintenant l\'Alliance fonctionnelle.',
    description_es: 'Toryn Farr servía como oficial de comunicaciones en Base Eco coordinando evacuación durante Batalla de Hoth. Su profesionalismo calmado bajo presión gestionaba comunicaciones tácticas mientras fuerzas imperiales se acercaban. La coordinación eficiente de Farr ayudó a salvar personal rebelde durante retirada desesperada. Su rol ejemplificaba héroes no reconocidos manteniendo Alianza funcionando.'
  },
  {
    minifigure_no: 'sw0727',
    name: 'Han Solo (Hoth)',
    description_en: 'Han Solo\'s Hoth appearance showed the scoundrel turned hero braving deadly cold to rescue Luke. His courage venturing into Hoth\'s frozen wastes demonstrated his evolution from self-serving smuggler. This moment solidified Han\'s commitment to the Rebellion and his friends. The Hoth rescue became a defining act of loyalty.',
    description_de: 'Han Solos Hoth-Erscheinungsbild zeigte den Schurken als Held, der tödliche Kälte trotzte, um Luke zu retten. Sein Mut, sich in Hoths gefrorene Einöde zu wagen, demonstrierte seine Evolution vom eigennützigen Schmuggler. Dieser Moment festigte Hans Engagement für die Rebellion und seine Freunde. Die Hoth-Rettung wurde zu einer definierenden Tat der Loyalität.',
    description_fr: 'L\'apparence de Han Solo à Hoth montrait le gredin devenu héros bravant froid mortel pour sauver Luke. Son courage s\'aventurant dans les étendues gelées de Hoth démontrait son évolution de contrebandier égoïste. Ce moment solidifiait l\'engagement de Han envers la Rébellion et ses amis. Le sauvetage de Hoth devint acte définissant de loyauté.',
    description_es: 'La apariencia de Han Solo en Hoth mostraba al pícaro convertido en héroe desafiando frío mortal para rescatar a Luke. Su valor aventurándose en páramos congelados de Hoth demostraba su evolución de contrabandista egoísta. Este momento solidificó compromiso de Han con Rebelión y sus amigos. El rescate de Hoth se convirtió en acto definitorio de lealtad.'
  },
  {
    minifigure_no: 'sw0728',
    name: 'Rebel Officer',
    description_en: 'Rebel Officers coordinated operations across diverse Alliance units with limited resources. These tactical leaders managed everything from supply logistics to combat strategy. Their ability to improvise and adapt contrasted with rigid Imperial command structure. Rebel officers embodied the scrappy determination that kept the Alliance fighting.',
    description_de: 'Rebellenoffiziere koordinierten Operationen über diverse Allianz-Einheiten mit begrenzten Ressourcen. Diese taktischen Führer verwalteten alles von Versorgungslogistik bis Kampfstrategie. Ihre Fähigkeit zu improvisieren und sich anzupassen kontrastierte mit starrer imperialer Befehlsstruktur. Rebellenoffiziere verkörperten die kämpferische Entschlossenheit, die die Allianz am Kämpfen hielt.',
    description_fr: 'Les Officiers Rebelles coordonnaient opérations à travers diverses unités de l\'Alliance avec ressources limitées. Ces leaders tactiques géraient tout de la logistique d\'approvisionnement à la stratégie de combat. Leur capacité à improviser et s\'adapter contrastait avec structure de commandement impériale rigide. Les officiers rebelles incarnaient la détermination combative maintenant l\'Alliance combattante.',
    description_es: 'Los Oficiales Rebeldes coordinaban operaciones a través de diversas unidades de Alianza con recursos limitados. Estos líderes tácticos gestionaban todo desde logística de suministros hasta estrategia de combate. Su capacidad de improvisar y adaptarse contrastaba con estructura de mando imperial rígida. Los oficiales rebeldes encarnaban determinación combativa que mantenía Alianza luchando.'
  },
  {
    minifigure_no: 'sw0729',
    name: 'Wes Janson',
    description_en: 'Wes Janson served as Wedge Antilles\' gunner during the Battle of Hoth piloting a snowspeeder. His marksmanship helped bring down an AT-AT walker with tow cable tactics. Janson\'s skill and quick thinking exemplified Rogue Squadron\'s excellence. He continued serving as a respected pilot throughout the Galactic Civil War.',
    description_de: 'Wes Janson diente als Wedge Antilles\' Schütze während der Schlacht von Hoth beim Pilotieren eines Snowspeeders. Seine Schießfertigkeit half, einen AT-AT-Walker mit Schleppkabel-Taktiken zu Fall zu bringen. Jansons Fähigkeit und schnelles Denken verkörperten die Exzellenz der Rogue Squadron. Er diente weiter als respektierter Pilot während des Galaktischen Bürgerkriegs.',
    description_fr: 'Wes Janson servait comme artilleur de Wedge Antilles pendant la Bataille de Hoth pilotant un snowspeeder. Son tir d\'élite aida à abattre un marcheur AT-AT avec tactiques de câble de remorquage. La compétence et pensée rapide de Janson exemplifiaient l\'excellence de l\'Escadron Rogue. Il continua à servir comme pilote respecté durant toute la Guerre Civile Galactique.',
    description_es: 'Wes Janson servía como artillero de Wedge Antilles durante Batalla de Hoth pilotando snowspeeder. Su puntería ayudó a derribar caminante AT-AT con tácticas de cable de remolque. La habilidad y pensamiento rápido de Janson ejemplificaban excelencia de Escuadrón Rogue. Continuó sirviendo como piloto respetado durante toda Guerra Civil Galáctica.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0710-sw0729...');

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

  console.log('Batch complete! 20 minifigs saved (sw0710-sw0729).');
  await prisma.$disconnect();
}

saveBatch();
