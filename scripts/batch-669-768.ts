import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0669',
    name: 'Resistance Soldier, Male',
    description_en: 'Resistance Soldiers formed the backbone of forces opposing the First Order. These brave fighters continued the Rebellion\'s legacy decades later. Their mismatched gear reflected the scrappy nature of the Resistance. Male soldiers served alongside diverse comrades fighting tyranny.',
    description_de: 'Widerstands-Soldaten bildeten das Rückgrat der Streitkräfte gegen die Erste Ordnung. Diese tapferen Kämpfer setzten das Erbe der Rebellion Jahrzehnte später fort. Ihre unpassende Ausrüstung spiegelte die kämpferische Natur des Widerstands wider. Männliche Soldaten dienten neben vielfältigen Kameraden im Kampf gegen Tyrannei.',
    description_fr: 'Les Soldats de la Résistance formaient l\'épine dorsale des forces opposées au Premier Ordre. Ces braves combattants continuaient l\'héritage de la Rébellion des décennies plus tard. Leur équipement dépareillé reflétait la nature combative de la Résistance. Les soldats masculins servaient aux côtés de camarades divers combattant la tyrannie.',
    description_es: 'Los Soldados de la Resistencia formaban la columna vertebral de fuerzas opuestas a la Primera Orden. Estos valientes luchadores continuaban el legado de la Rebelión décadas después. Su equipo desigual reflejaba la naturaleza combativa de la Resistencia. Los soldados masculinos servían junto a camaradas diversos luchando contra la tiranía.'
  },
  {
    minifigure_no: 'sw0670',
    name: 'First Order Officer (Lieutenant / Captain) - Male',
    description_en: 'First Order Officers commanded troops with ruthless efficiency inherited from Imperial doctrine. This lieutenant or captain wore the distinctive black uniform. These officers enforced Supreme Leader Snoke\'s will across occupied territories. Their military precision contrasted with Resistance improvisation.',
    description_de: 'Offiziere der Ersten Ordnung befehligten Truppen mit rücksichtsloser Effizienz aus imperialer Doktrin geerbt. Dieser Lieutenant oder Captain trug die markante schwarze Uniform. Diese Offiziere setzten den Willen des Obersten Anführers Snoke in besetzten Territorien durch. Ihre militärische Präzision kontrastierte mit Widerstands-Improvisation.',
    description_fr: 'Les Officiers du Premier Ordre commandaient des troupes avec une efficacité impitoyable héritée de la doctrine impériale. Ce lieutenant ou capitaine portait l\'uniforme noir distinctif. Ces officiers appliquaient la volonté du Chef Suprême Snoke dans les territoires occupés. Leur précision militaire contrastait avec l\'improvisation de la Résistance.',
    description_es: 'Los Oficiales de la Primera Orden comandaban tropas con eficiencia despiadada heredada de doctrina imperial. Este teniente o capitán usaba el uniforme negro distintivo. Estos oficiales aplicaban la voluntad del Líder Supremo Snoke en territorios ocupados. Su precisión militar contrastaba con improvisación de Resistencia.'
  },
  {
    minifigure_no: 'sw0671',
    name: 'First Order Crew Member (Fleet Engineer / Gunner) - Light Nougat Head',
    description_en: 'First Order Fleet Engineers and Gunners maintained the war machine aboard Star Destroyers. These technicians kept weapons systems operational. Their gray uniforms distinguished them from stormtroopers. Crew members formed the technical backbone of First Order naval power.',
    description_de: 'Flotten-Ingenieure und Schützen der Ersten Ordnung warteten die Kriegsmaschine an Bord von Sternenzerstörern. Diese Techniker hielten Waffensysteme betriebsbereit. Ihre grauen Uniformen unterschieden sie von Sturmtrupplern. Besatzungsmitglieder bildeten das technische Rückgrat der Marine-Macht der Ersten Ordnung.',
    description_fr: 'Les Ingénieurs de Flotte et Artilleurs du Premier Ordre maintenaient la machine de guerre à bord des Destroyers Stellaires. Ces techniciens maintenaient les systèmes d\'armes opérationnels. Leurs uniformes gris les distinguaient des stormtroopers. Les membres d\'équipage formaient l\'épine dorsale technique de la puissance navale du Premier Ordre.',
    description_es: 'Los Ingenieros de Flota y Artilleros de la Primera Orden mantenían la máquina de guerra a bordo de Destructores Estelares. Estos técnicos mantenían sistemas de armas operacionales. Sus uniformes grises los distinguían de stormtroopers. Los miembros de tripulación formaban la columna vertebral técnica del poder naval de la Primera Orden.'
  },
  {
    minifigure_no: 'sw0672',
    name: 'First Order TIE Fighter Pilot - Two White Lines on Helmet',
    description_en: 'First Order TIE Pilots flew advanced fighters with shields and hyperdrives. This variant with two white helmet lines showed pilot designation. Their improved training surpassed Imperial predecessors. These elite pilots represented First Order technological superiority.',
    description_de: 'TIE-Piloten der Ersten Ordnung flogen fortgeschrittene Jäger mit Schilden und Hyperantrieben. Diese Variante mit zwei weißen Helmlinien zeigte Pilotenbezeichnung. Ihre verbesserte Ausbildung übertraf imperiale Vorgänger. Diese Elite-Piloten repräsentierten technologische Überlegenheit der Ersten Ordnung.',
    description_fr: 'Les Pilotes TIE du Premier Ordre pilotaient des chasseurs avancés avec boucliers et hyperdrives. Cette variante avec deux lignes blanches sur le casque montrait la désignation de pilote. Leur formation améliorée surpassait les prédécesseurs impériaux. Ces pilotes d\'élite représentaient la supériorité technologique du Premier Ordre.',
    description_es: 'Los Pilotos TIE de la Primera Orden volaban cazas avanzados con escudos e hiperimpulsores. Esta variante con dos líneas blancas en casco mostraba designación de piloto. Su entrenamiento mejorado superaba a predecesores imperiales. Estos pilotos de élite representaban superioridad tecnológica de la Primera Orden.'
  },
  {
    minifigure_no: 'sw0673',
    name: 'Kanjiklub Gang Member (Crokind Shand)',
    description_en: 'Kanjiklub Gang Members operated as criminal enforcers in the galaxy\'s underworld. Crokind Shand wore distinctive armor and weaponry. These thugs pursued Han Solo over unpaid debts. Their confrontation aboard Han\'s freighter ended violently when creatures escaped.',
    description_de: 'Kanjiklub-Gangmitglieder operierten als kriminelle Vollstrecker in der Unterwelt der Galaxie. Crokind Shand trug markante Rüstung und Bewaffnung. Diese Schläger verfolgten Han Solo wegen unbezahlter Schulden. Ihre Konfrontation an Bord von Hans Frachter endete gewaltsam, als Kreaturen entkamen.',
    description_fr: 'Les Membres du Gang Kanjiklub opéraient comme exécuteurs criminels dans le monde souterrain de la galaxie. Crokind Shand portait une armure et des armes distinctives. Ces voyous poursuivaient Han Solo pour des dettes impayées. Leur confrontation à bord du cargo de Han s\'est terminée violemment lorsque des créatures se sont échappées.',
    description_es: 'Los Miembros de Pandilla Kanjiklub operaban como ejecutores criminales en el submundo de la galaxia. Crokind Shand usaba armadura y armamento distintivos. Estos matones perseguían a Han Solo por deudas impagadas. Su confrontación a bordo del carguero de Han terminó violentamente cuando criaturas escaparon.'
  },
  {
    minifigure_no: 'sw0674',
    name: 'Tasu Leech',
    description_en: 'Tasu Leech led the Kanjiklub gang with brutal authority. This crime lord tracked Han Solo demanding payment. His distinctive appearance and weaponry marked him as dangerous. Leech\'s confrontation with Han revealed the smuggler\'s mounting debts.',
    description_de: 'Tasu Leech führte die Kanjiklub-Gang mit brutaler Autorität an. Dieser Verbrechenslord verfolgte Han Solo und forderte Zahlung. Sein markantes Aussehen und Bewaffnung kennzeichneten ihn als gefährlich. Leechs Konfrontation mit Han enthüllte die wachsenden Schulden des Schmugglers.',
    description_fr: 'Tasu Leech dirigeait le gang Kanjiklub avec une autorité brutale. Ce seigneur du crime traquait Han Solo en exigeant le paiement. Son apparence distinctive et son armement le marquaient comme dangereux. La confrontation de Leech avec Han révélait les dettes croissantes du contrebandier.',
    description_es: 'Tasu Leech lideraba la pandilla Kanjiklub con autoridad brutal. Este señor del crimen rastreaba a Han Solo exigiendo pago. Su apariencia distintiva y armamento lo marcaban como peligroso. La confrontación de Leech con Han reveló las crecientes deudas del contrabandista.'
  },
  {
    minifigure_no: 'sw0675',
    name: 'Han Solo, Old (Lopsided Grin)',
    description_en: 'Older Han Solo with lopsided grin showed decades of smuggling and heartbreak. His weathered appearance reflected years since Return of the Jedi. Han\'s loss of Ben Solo to the dark side haunted him. This variant captured Han before his heroic sacrifice.',
    description_de: 'Der ältere Han Solo mit schiefem Grinsen zeigte Jahrzehnte des Schmuggelns und Herzschmerzes. Sein verwittertes Aussehen spiegelte Jahre seit Die Rückkehr der Jedi wider. Hans Verlust von Ben Solo zur dunklen Seite verfolgte ihn. Diese Variante erfasste Han vor seinem heroischen Opfer.',
    description_fr: 'Le Han Solo plus âgé avec sourire de travers montrait des décennies de contrebande et de chagrin. Son apparence usée reflétait des années depuis Le Retour du Jedi. La perte de Ben Solo du côté obscur hantait Han. Cette variante capturait Han avant son sacrifice héroïque.',
    description_es: 'El Han Solo mayor con sonrisa torcida mostraba décadas de contrabando y desamor. Su apariencia desgastada reflejaba años desde el Retorno del Jedi. La pérdida de Ben Solo al lado oscuro atormentaba a Han. Esta variante capturaba a Han antes de su sacrificio heroico.'
  },
  {
    minifigure_no: 'sw0676',
    name: 'Finn - Medium Nougat Jacket, Black Legs',
    description_en: 'Finn in medium nougat jacket represented his transition from stormtrooper to Resistance hero. His courage to defect from the First Order inspired others. Finn\'s friendship with Rey and Poe defined the sequel trilogy. This variant showed him embracing his new identity.',
    description_de: 'Finn in mittlerer Nougat-Jacke repräsentierte seinen Übergang vom Sturmtruppler zum Widerstands-Helden. Sein Mut, von der Ersten Ordnung abzufallen, inspirierte andere. Finns Freundschaft mit Rey und Poe definierte die Sequel-Trilogie. Diese Variante zeigte ihn, wie er seine neue Identität annahm.',
    description_fr: 'Finn en veste nougat moyen représentait sa transition de stormtrooper à héros de la Résistance. Son courage de déserter du Premier Ordre a inspiré d\'autres. L\'amitié de Finn avec Rey et Poe définissait la trilogie séquelle. Cette variante le montrait embrassant sa nouvelle identité.',
    description_es: 'Finn en chaqueta beige medio representaba su transición de stormtrooper a héroe de Resistencia. Su coraje de desertar de la Primera Orden inspiró a otros. La amistad de Finn con Rey y Poe definió la trilogía de secuelas. Esta variante lo mostraba abrazando su nueva identidad.'
  },
  {
    minifigure_no: 'sw0677',
    name: 'Rey - Dark Tan Tied Robe',
    description_en: 'Rey in dark tan tied robe showed her scavenger origins on Jakku. Her self-reliance and Force sensitivity marked her as special. Rey\'s journey from orphan to Jedi became the sequel trilogy\'s heart. This variant captured her before discovering her destiny.',
    description_de: 'Rey in dunkel-beiger gebundener Robe zeigte ihre Plünderer-Ursprünge auf Jakku. Ihre Selbstständigkeit und Macht-Empfindlichkeit kennzeichneten sie als besonders. Reys Reise von der Waise zur Jedi wurde das Herz der Sequel-Trilogie. Diese Variante erfasste sie vor der Entdeckung ihres Schicksals.',
    description_fr: 'Rey en robe attachée beige foncé montrait ses origines de récupératrice sur Jakku. Son autonomie et sa sensibilité à la Force la marquaient comme spéciale. Le voyage de Rey d\'orpheline à Jedi est devenu le cœur de la trilogie séquelle. Cette variante la capturait avant de découvrir son destin.',
    description_es: 'Rey en túnica atada beige oscuro mostraba sus orígenes como carroñera en Jakku. Su autosuficiencia y sensibilidad a la Fuerza la marcaban como especial. El viaje de Rey de huérfana a Jedi se convirtió en el corazón de la trilogía de secuelas. Esta variante la capturaba antes de descubrir su destino.'
  },
  {
    minifigure_no: 'sw0678',
    name: 'Hoth Rebel Trooper White Uniform (Cheek Lines)',
    description_en: 'Hoth Rebel Troopers in white uniforms with cheek lines defended Echo Base against Imperial assault. Their cold weather gear suited the ice planet\'s harsh conditions. These brave soldiers bought time for the evacuation. Their sacrifice allowed the Rebellion to survive.',
    description_de: 'Hoth-Rebellentruppen in weißen Uniformen mit Wangenlinien verteidigten Echo Base gegen imperiale Angriffe. Ihre Kaltwetter-Ausrüstung passte zu den harten Bedingungen des Eisplaneten. Diese tapferen Soldaten erkauften Zeit für die Evakuierung. Ihr Opfer erlaubte der Rebellion zu überleben.',
    description_fr: 'Les Soldats Rebelles de Hoth en uniformes blancs avec lignes de joue défendaient la Base Echo contre l\'assaut impérial. Leur équipement par temps froid convenait aux conditions difficiles de la planète de glace. Ces braves soldats gagnaient du temps pour l\'évacuation. Leur sacrifice a permis à la Rébellion de survivre.',
    description_es: 'Los Soldados Rebeldes de Hoth en uniformes blancos con líneas en mejillas defendían Base Echo contra asalto imperial. Su equipo de clima frío se adaptaba a condiciones duras del planeta de hielo. Estos valientes soldados ganaron tiempo para evacuación. Su sacrificio permitió a la Rebelión sobrevivir.'
  },
  {
    minifigure_no: 'sw0679',
    name: 'Astromech Droid, R2-D2, Reindeer',
    description_en: 'R2-D2 dressed as a reindeer brought holiday cheer to Star Wars collections. This festive variant showed the beloved droid in seasonal decoration. R2\'s personality shined through even holiday themes. Collectors cherish this whimsical seasonal release.',
    description_de: 'R2-D2 als Rentier verkleidet brachte Feiertags-Freude zu Star-Wars-Sammlungen. Diese festliche Variante zeigte den geliebten Droiden in saisonaler Dekoration. R2s Persönlichkeit strahlte selbst durch Feiertags-Themen. Sammler schätzen diese skurrile saisonale Veröffentlichung.',
    description_fr: 'R2-D2 déguisé en renne apportait la joie des fêtes aux collections Star Wars. Cette variante festive montrait le droïde bien-aimé en décoration saisonnière. La personnalité de R2 brillait même à travers les thèmes des fêtes. Les collectionneurs chérissent cette sortie saisonnière fantaisiste.',
    description_es: 'R2-D2 disfrazado de reno traía alegría festiva a colecciones de Star Wars. Esta variante festiva mostraba el droide querido en decoración de temporada. La personalidad de R2 brillaba incluso en temas festivos. Los coleccionistas aprecian este lanzamiento de temporada caprichoso.'
  },
  {
    minifigure_no: 'sw0680',
    name: 'Santa C-3PO',
    description_en: 'C-3PO dressed as Santa Claus created a delightful holiday crossover. This seasonal variant showed the protocol droid in festive attire. Threepio\'s fussy personality made the Santa costume amusing. Limited holiday releases like this become highly collectible.',
    description_de: 'C-3PO als Weihnachtsmann verkleidet schuf einen entzückenden Feiertags-Crossover. Diese saisonale Variante zeigte den Protokoll-Droiden in festlicher Kleidung. Threepios kleinliche Persönlichkeit machte das Weihnachtsmann-Kostüm amüsant. Limitierte Feiertags-Veröffentlichungen wie diese werden hochgradig sammelbar.',
    description_fr: 'C-3PO déguisé en Père Noël créait un croisement des fêtes délicieux. Cette variante saisonnière montrait le droïde de protocole en tenue festive. La personnalité pointilleuse de Threepio rendait le costume de Père Noël amusant. Les sorties limitées des fêtes comme celle-ci deviennent très collectionnables.',
    description_es: 'C-3PO disfrazado de Santa Claus creó un cruce festivo encantador. Esta variante de temporada mostraba el droide de protocolo en atuendo festivo. La personalidad quisquillosa de Threepio hacía el disfraz de Santa divertido. Lanzamientos festivos limitados como este se vuelven altamente coleccionables.'
  },
  {
    minifigure_no: 'sw0681',
    name: 'LIN Demolitionmech Droid',
    description_en: 'LIN Demolitionmech Droids specialized in destruction and mining operations. These industrial droids wielded powerful tools. Their rugged construction suited hazardous environments. Mining colonies across the galaxy employed these versatile machines.',
    description_de: 'LIN-Demolitionmech-Droiden spezialisierten sich auf Zerstörung und Bergbau-Operationen. Diese Industrie-Droiden führten mächtige Werkzeuge. Ihre robuste Konstruktion passte zu gefährlichen Umgebungen. Bergbau-Kolonien in der ganzen Galaxie beschäftigten diese vielseitigen Maschinen.',
    description_fr: 'Les Droïdes LIN Demolitionmech se spécialisaient dans la destruction et les opérations minières. Ces droïdes industriels maniaient des outils puissants. Leur construction robuste convenait aux environnements dangereux. Les colonies minières à travers la galaxie employaient ces machines polyvalentes.',
    description_es: 'Los Droides LIN Demolitionmech se especializaban en destrucción y operaciones mineras. Estos droides industriales manejaban herramientas poderosas. Su construcción robusta se adaptaba a entornos peligrosos. Las colonias mineras en toda la galaxia empleaban estas máquinas versátiles.'
  },
  {
    minifigure_no: 'sw0682',
    name: 'Imperial Probe Droid - Mini',
    description_en: 'Mini Imperial Probe Droids provided reconnaissance across hostile worlds. These compact versions showed the Empire\'s surveillance network. Probe droids discovered the Rebel base on Hoth. Their hovering design and sensors made them ideal scouts.',
    description_de: 'Mini-imperiale Sonden-Droiden boten Aufklärung über feindliche Welten. Diese kompakten Versionen zeigten das Überwachungsnetzwerk des Imperiums. Sonden-Droiden entdeckten die Rebellenbasis auf Hoth. Ihr schwebendes Design und Sensoren machten sie zu idealen Spähern.',
    description_fr: 'Les Mini Droïdes Sondes Impériaux fournissaient la reconnaissance à travers les mondes hostiles. Ces versions compactes montraient le réseau de surveillance de l\'Empire. Les droïdes sondes ont découvert la base rebelle sur Hoth. Leur conception flottante et leurs capteurs en faisaient des éclaireurs idéaux.',
    description_es: 'Los Mini Droides Sonda Imperiales proporcionaban reconocimiento a través de mundos hostiles. Estas versiones compactas mostraban la red de vigilancia del Imperio. Los droides sonda descubrieron la base rebelde en Hoth. Su diseño flotante y sensores los hacían exploradores ideales.'
  },
  {
    minifigure_no: 'sw0683',
    name: 'Assassin Droid - Dark Bluish Gray',
    description_en: 'Assassin Droids in dark bluish gray served criminal organizations and bounty hunters. These lethal machines specialized in terminating targets. Their humanoid design allowed infiltration. Assassin droids represented the galaxy\'s darkest technology.',
    description_de: 'Attentäter-Droiden in dunklem Blaugrau dienten kriminellen Organisationen und Kopfgeldjägern. Diese tödlichen Maschinen spezialisierten sich auf Zielelimination. Ihr humanoider Aufbau erlaubte Infiltration. Attentäter-Droiden repräsentierten die dunkelste Technologie der Galaxie.',
    description_fr: 'Les Droïdes Assassins en gris bleuté foncé servaient des organisations criminelles et des chasseurs de primes. Ces machines létales se spécialisaient dans l\'élimination de cibles. Leur conception humanoïde permettait l\'infiltration. Les droïdes assassins représentaient la technologie la plus sombre de la galaxie.',
    description_es: 'Los Droides Asesinos en gris azulado oscuro servían organizaciones criminales y cazarrecompensas. Estas máquinas letales se especializaban en eliminar objetivos. Su diseño humanoide permitía infiltración. Los droides asesinos representaban la tecnología más oscura de la galaxia.'
  },
  {
    minifigure_no: 'sw0684',
    name: 'Captain Phasma (Rounded Mouth Pattern)',
    description_en: 'Captain Phasma in distinctive chromium armor commanded First Order stormtroopers with ruthless efficiency. This variant with rounded mouth pattern showed design refinement. Her towering presence and loyalty to the First Order made her formidable. Phasma\'s survival instincts proved as strong as her combat skills.',
    description_de: 'Captain Phasma in markanter Chrom-Rüstung befehligte Sturmtruppler der Ersten Ordnung mit rücksichtsloser Effizienz. Diese Variante mit rundem Mund-Muster zeigte Design-Verfeinerung. Ihre imposante Präsenz und Loyalität zur Ersten Ordnung machten sie furchterregend. Phasmas Überlebensinstinkte erwiesen sich als stark wie ihre Kampffähigkeiten.',
    description_fr: 'Le Capitaine Phasma en armure de chrome distinctive commandait les stormtroopers du Premier Ordre avec une efficacité impitoyable. Cette variante avec motif de bouche arrondi montrait le raffinement du design. Sa présence imposante et sa loyauté envers le Premier Ordre la rendaient redoutable. Les instincts de survie de Phasma se sont révélés aussi forts que ses compétences au combat.',
    description_es: 'La Capitana Phasma en armadura de cromo distintivo comandaba stormtroopers de Primera Orden con eficiencia despiadada. Esta variante con patrón de boca redondeado mostraba refinamiento de diseño. Su presencia imponente y lealtad a la Primera Orden la hacían formidable. Los instintos de supervivencia de Phasma resultaron tan fuertes como sus habilidades de combate.'
  },
  {
    minifigure_no: 'sw0685',
    name: 'Yoda - Clone Wars, White Hair',
    description_en: 'Yoda during the Clone Wars with white hair led the Jedi Order through its darkest hour. His wisdom guided the Republic\'s war effort. This variant showed Yoda before Order 66\'s devastation. His failure to prevent Palpatine\'s rise haunted his exile.',
    description_de: 'Yoda während der Klonkriege mit weißem Haar führte den Jedi-Orden durch seine dunkelste Stunde. Seine Weisheit leitete die Kriegsanstrengungen der Republik. Diese Variante zeigte Yoda vor Order 66\'s Verwüstung. Sein Versagen, Palpatines Aufstieg zu verhindern, verfolgte sein Exil.',
    description_fr: 'Yoda pendant les Guerres des Clones avec cheveux blancs dirigeait l\'Ordre Jedi à travers son heure la plus sombre. Sa sagesse guidait l\'effort de guerre de la République. Cette variante montrait Yoda avant la dévastation de l\'Ordre 66. Son échec à empêcher l\'ascension de Palpatine hantait son exil.',
    description_es: 'Yoda durante las Guerras Clon con cabello blanco lideraba la Orden Jedi a través de su hora más oscura. Su sabiduría guiaba el esfuerzo de guerra de la República. Esta variante mostraba a Yoda antes de la devastación de la Orden 66. Su fracaso al prevenir el ascenso de Palpatine atormentaba su exilio.'
  },
  {
    minifigure_no: 'sw0686',
    name: 'Darth Maul - Hood and Cape, Sash with Pouch',
    description_en: 'Darth Maul with hood, cape, and sash represented the Sith\'s return after centuries. His double-bladed lightsaber and acrobatic combat style shocked the Jedi. Maul\'s survival after being cut in half fueled his revenge obsession. This variant captured his menacing appearance.',
    description_de: 'Darth Maul mit Kapuze, Umhang und Schärpe repräsentierte die Rückkehr der Sith nach Jahrhunderten. Sein doppelklingiges Lichtschwert und akrobatischer Kampfstil schockierten die Jedi. Mauls Überleben nach Halbierung nährte seine Rache-Obsession. Diese Variante erfasste sein bedrohliches Aussehen.',
    description_fr: 'Dark Maul avec capuche, cape et écharpe représentait le retour des Sith après des siècles. Son sabre laser à double lame et son style de combat acrobatique choquaient les Jedi. La survie de Maul après avoir été coupé en deux alimentait son obsession de vengeance. Cette variante capturait son apparence menaçante.',
    description_es: 'Darth Maul con capucha, capa y fajín representaba el regreso de los Sith después de siglos. Su sable de luz de doble hoja y estilo de combate acrobático conmocionaron a los Jedi. La supervivencia de Maul después de ser cortado por la mitad alimentó su obsesión de venganza. Esta variante capturaba su apariencia amenazante.'
  },
  {
    minifigure_no: 'sw0687',
    name: 'Rodian Alliance Fighter',
    description_en: 'Rodian Alliance Fighters brought their species\' martial traditions to the Rebellion. These green-skinned warriors from Rodia served as soldiers and pilots. Rodians\' hunting culture translated well to military service. Their contribution to the Alliance proved significant.',
    description_de: 'Rodianische Allianz-Kämpfer brachten die Kampftraditionen ihrer Spezies zur Rebellion. Diese grünhäutigen Krieger von Rodia dienten als Soldaten und Piloten. Die Jagdkultur der Rodianer übertrug sich gut auf Militärdienst. Ihr Beitrag zur Allianz erwies sich als bedeutend.',
    description_fr: 'Les Combattants Rodiens de l\'Alliance apportaient les traditions martiales de leur espèce à la Rébellion. Ces guerriers à peau verte de Rodia servaient comme soldats et pilotes. La culture de chasse des Rodiens se traduisait bien en service militaire. Leur contribution à l\'Alliance s\'est révélée significative.',
    description_es: 'Los Luchadores Rodianos de Alianza trajeron las tradiciones marciales de su especie a la Rebelión. Estos guerreros de piel verde de Rodia servían como soldados y pilotos. La cultura de caza de los Rodianos se traducía bien a servicio militar. Su contribución a la Alianza resultó significativa.'
  },
  {
    minifigure_no: 'sw0688',
    name: 'Rebel Trooper, Goggles, Dark Tan Helmet',
    description_en: 'Rebel Troopers with goggles and dark tan helmets fought across diverse battlefields. Their protective eyewear suited harsh environments. These soldiers represented the Alliance\'s adaptable forces. Varied gear showed the Rebellion\'s scrappy resourcefulness.',
    description_de: 'Rebellentruppen mit Schutzbrille und dunkel-beigem Helm kämpften über vielfältige Schlachtfelder. Ihre Schutzbrille passte zu harten Umgebungen. Diese Soldaten repräsentierten die anpassungsfähigen Streitkräfte der Allianz. Verschiedene Ausrüstung zeigte die kämpferische Einfallsreichtum der Rebellion.',
    description_fr: 'Les Soldats Rebelles avec lunettes et casques beiges foncés se battaient sur des champs de bataille divers. Leurs lunettes de protection convenaient aux environnements difficiles. Ces soldats représentaient les forces adaptables de l\'Alliance. L\'équipement varié montrait l\'ingéniosité combative de la Rébellion.',
    description_es: 'Los Soldados Rebeldes con gafas y cascos beige oscuro luchaban en diversos campos de batalla. Sus gafas protectoras se adaptaban a entornos duros. Estos soldados representaban las fuerzas adaptables de la Alianza. El equipo variado mostraba el ingenio combativo de la Rebelión.'
  },
  {
    minifigure_no: 'sw0689',
    name: 'Duros Alliance Fighter, Jet Pack',
    description_en: 'Duros Alliance Fighters with jet packs brought aerial mobility to Rebel operations. These blue-skinned spacefaring people excelled as pilots. Their natural navigation abilities served the Alliance well. Duros contributions to the Rebellion spanned from starfighters to special operations.',
    description_de: 'Duros-Allianz-Kämpfer mit Jet-Packs brachten Luftmobilität zu Rebellenoperationen. Diese blauhäutigen Raumfahrer zeichneten sich als Piloten aus. Ihre natürlichen Navigationsfähigkeiten dienten der Allianz gut. Duros-Beiträge zur Rebellion reichten von Sternjägern bis Spezialoperationen.',
    description_fr: 'Les Combattants Duros de l\'Alliance avec jetpacks apportaient la mobilité aérienne aux opérations rebelles. Ces gens voyageurs de l\'espace à peau bleue excellaient comme pilotes. Leurs capacités de navigation naturelles servaient bien l\'Alliance. Les contributions Duros à la Rébellion s\'étendaient des chasseurs stellaires aux opérations spéciales.',
    description_es: 'Los Luchadores Duros de Alianza con jet packs trajeron movilidad aérea a operaciones rebeldes. Estas personas viajeras espaciales de piel azul sobresalían como pilotos. Sus habilidades de navegación naturales servían bien a la Alianza. Las contribuciones Duros a la Rebelión abarcaban desde cazas estelares hasta operaciones especiales.'
  },
  {
    minifigure_no: 'sw0690',
    name: 'Rebel Trooper, Rebel Helmet, Jet Pack',
    description_en: 'Rebel Troopers with jet packs conducted aerial assaults and reconnaissance missions. Their mobility advantage compensated for limited resources. These airborne soldiers struck Imperial targets quickly. Jet pack troops represented the Rebellion\'s tactical innovation.',
    description_de: 'Rebellentruppen mit Jet-Packs führten Luft-Angriffe und Aufklärungsmissionen durch. Ihr Mobilitätsvorteil kompensierte begrenzte Ressourcen. Diese luftgestützten Soldaten schlugen imperiale Ziele schnell. Jet-Pack-Truppen repräsentierten die taktische Innovation der Rebellion.',
    description_fr: 'Les Soldats Rebelles avec jetpacks menaient des assauts aériens et des missions de reconnaissance. Leur avantage de mobilité compensait les ressources limitées. Ces soldats aéroportés frappaient rapidement les cibles impériales. Les troupes à jetpack représentaient l\'innovation tactique de la Rébellion.',
    description_es: 'Los Soldados Rebeldes con jet packs realizaban asaltos aéreos y misiones de reconocimiento. Su ventaja de movilidad compensaba recursos limitados. Estos soldados aerotransportados golpeaban objetivos imperiales rápidamente. Las tropas de jet pack representaban la innovación táctica de la Rebelión.'
  },
  {
    minifigure_no: 'sw0691',
    name: 'Imperial Jet Pack Trooper (Jumptrooper)',
    description_en: 'Imperial Jumptroopers with jet packs provided rapid response forces. These specialized soldiers conducted aerial assault operations. Their mobility made them effective at securing objectives quickly. Jumptroopers represented the Empire\'s elite airborne units.',
    description_de: 'Imperiale Jumptroopers mit Jet-Packs boten schnelle Reaktionskräfte. Diese spezialisierten Soldaten führten Luft-Angriffs-Operationen durch. Ihre Mobilität machte sie effektiv bei schneller Ziel-Sicherung. Jumptroopers repräsentierten die Elite-Luftlande-Einheiten des Imperiums.',
    description_fr: 'Les Jumptroopers Impériaux avec jetpacks fournissaient des forces de réaction rapide. Ces soldats spécialisés menaient des opérations d\'assaut aérien. Leur mobilité les rendait efficaces pour sécuriser rapidement les objectifs. Les Jumptroopers représentaient les unités aéroportées d\'élite de l\'Empire.',
    description_es: 'Los Jumptroopers Imperiales con jet packs proporcionaban fuerzas de respuesta rápida. Estos soldados especializados realizaban operaciones de asalto aéreo. Su movilidad los hacía efectivos para asegurar objetivos rápidamente. Los Jumptroopers representaban las unidades aerotransportadas de élite del Imperio.'
  },
  {
    minifigure_no: 'sw0692',
    name: 'Imperial Shock Trooper',
    description_en: 'Imperial Shock Troopers served as elite security forces on Coruscant. Their distinctive red markings designated their specialized role. These soldiers protected key Imperial facilities and officials. Shock Troopers maintained order in the Empire\'s capital.',
    description_de: 'Imperiale Shock-Truppen dienten als Elite-Sicherheitskräfte auf Coruscant. Ihre markanten roten Markierungen bezeichneten ihre spezialisierte Rolle. Diese Soldaten schützten wichtige imperiale Einrichtungen und Offizielle. Shock-Truppen hielten Ordnung in der Hauptstadt des Imperiums.',
    description_fr: 'Les Shock Troopers Impériaux servaient comme forces de sécurité d\'élite sur Coruscant. Leurs marques rouges distinctives désignaient leur rôle spécialisé. Ces soldats protégeaient les installations et officiels impériaux clés. Les Shock Troopers maintenaient l\'ordre dans la capitale de l\'Empire.',
    description_es: 'Los Shock Troopers Imperiales servían como fuerzas de seguridad de élite en Coruscant. Sus marcas rojas distintivas designaban su rol especializado. Estos soldados protegían instalaciones y oficiales imperiales clave. Los Shock Troopers mantenían orden en la capital del Imperio.'
  },
  {
    minifigure_no: 'sw0693',
    name: 'Imperial Crew - Black Cap, Closed Mouth',
    description_en: 'Imperial Crew members in black caps operated Star Destroyers and battle stations. Their closed-mouth expression showed military discipline. These technicians maintained the Empire\'s massive war machine. Crew efficiency kept Imperial fleets operational.',
    description_de: 'Imperiale Besatzungsmitglieder in schwarzen Kappen operierten Sternenzerstörer und Kampfstationen. Ihr geschlossener Mund-Ausdruck zeigte militärische Disziplin. Diese Techniker warteten die massive Kriegsmaschine des Imperiums. Besatzungseffizienz hielt imperiale Flotten betriebsbereit.',
    description_fr: 'Les Membres d\'Équipage Impériaux en casquettes noires opéraient les Destroyers Stellaires et stations de combat. Leur expression à bouche fermée montrait la discipline militaire. Ces techniciens maintenaient la machine de guerre massive de l\'Empire. L\'efficacité de l\'équipage maintenait les flottes impériales opérationnelles.',
    description_es: 'Los Miembros de Tripulación Imperiales en gorras negras operaban Destructores Estelares y estaciones de batalla. Su expresión de boca cerrada mostraba disciplina militar. Estos técnicos mantenían la máquina de guerra masiva del Imperio. La eficiencia de tripulación mantenía flotas imperiales operacionales.'
  },
  {
    minifigure_no: 'sw0694',
    name: 'First Order Crew Member (Officer Sumistu) - Cap with Insignia',
    description_en: 'Officer Sumistu served aboard First Order vessels with distinction. His cap with insignia marked his rank and position. These crew officers coordinated complex naval operations. Sumistu represented the dedicated personnel behind First Order military power.',
    description_de: 'Offizier Sumistu diente mit Auszeichnung an Bord von Schiffen der Ersten Ordnung. Seine Kappe mit Abzeichen kennzeichnete seinen Rang und Position. Diese Besatzungsoffiziere koordinierten komplexe Marine-Operationen. Sumistu repräsentierte das engagierte Personal hinter der Militärmacht der Ersten Ordnung.',
    description_fr: 'L\'Officier Sumistu servait à bord des vaisseaux du Premier Ordre avec distinction. Sa casquette avec insigne marquait son rang et sa position. Ces officiers d\'équipage coordonnaient des opérations navales complexes. Sumistu représentait le personnel dévoué derrière la puissance militaire du Premier Ordre.',
    description_es: 'El Oficial Sumistu servía a bordo de naves de Primera Orden con distinción. Su gorra con insignia marcaba su rango y posición. Estos oficiales de tripulación coordinaban operaciones navales complejas. Sumistu representaba el personal dedicado detrás del poder militar de Primera Orden.'
  },
  {
    minifigure_no: 'sw0695',
    name: 'First Order Heavy Assault Stormtrooper (Rounded Mouth Pattern)',
    description_en: 'First Order Heavy Assault Stormtroopers wielded powerful weapons for siege operations. This variant with rounded mouth pattern showed armor refinement. Their heavy weaponry broke through Resistance defensive positions. These specialists represented First Order overwhelming firepower doctrine.',
    description_de: 'Schwer-Angriffs-Sturmtruppler der Ersten Ordnung führten mächtige Waffen für Belagerungs-Operationen. Diese Variante mit rundem Mund-Muster zeigte Rüstungs-Verfeinerung. Ihre schweren Waffen durchbrachen Widerstands-Verteidigungspositionen. Diese Spezialisten repräsentierten die überwältigende Feuerkraft-Doktrin der Ersten Ordnung.',
    description_fr: 'Les Stormtroopers d\'Assaut Lourd du Premier Ordre maniaient des armes puissantes pour les opérations de siège. Cette variante avec motif de bouche arrondi montrait le raffinement de l\'armure. Leur armement lourd perçait les positions défensives de la Résistance. Ces spécialistes représentaient la doctrine de puissance de feu écrasante du Premier Ordre.',
    description_es: 'Los Stormtroopers de Asalto Pesado de Primera Orden manejaban armas poderosas para operaciones de asedio. Esta variante con patrón de boca redondeado mostraba refinamiento de armadura. Su armamento pesado atravesaba posiciones defensivas de Resistencia. Estos especialistas representaban la doctrina de poder de fuego abrumador de Primera Orden.'
  },
  {
    minifigure_no: 'sw0696',
    name: 'Resistance Trooper - Tan Jacket, Moustache',
    description_en: 'Resistance Troopers in tan jackets with moustaches showed the diverse volunteers fighting the First Order. Their varied appearances reflected grassroots recruitment. These soldiers brought unique skills and backgrounds. Resistance forces relied on individual initiative over uniformity.',
    description_de: 'Widerstands-Truppen in beigen Jacken mit Schnurrbärten zeigten die vielfältigen Freiwilligen im Kampf gegen die Erste Ordnung. Ihr verschiedenes Erscheinungsbild spiegelte Basis-Rekrutierung wider. Diese Soldaten brachten einzigartige Fähigkeiten und Hintergründe. Widerstandskräfte verließen sich auf individuelle Initiative über Einheitlichkeit.',
    description_fr: 'Les Soldats de la Résistance en vestes beiges avec moustaches montraient les volontaires divers combattant le Premier Ordre. Leurs apparences variées reflétaient le recrutement de base. Ces soldats apportaient des compétences et des origines uniques. Les forces de la Résistance comptaient sur l\'initiative individuelle plutôt que l\'uniformité.',
    description_es: 'Los Soldados de Resistencia en chaquetas beige con bigotes mostraban los diversos voluntarios luchando contra Primera Orden. Sus apariencias variadas reflejaban reclutamiento de base. Estos soldados traían habilidades y antecedentes únicos. Las fuerzas de Resistencia dependían de iniciativa individual sobre uniformidad.'
  },
  {
    minifigure_no: 'sw0697',
    name: 'Resistance Trooper - Dark Tan Jacket, Frown, Furrowed Eyebrows',
    description_en: 'Resistance Troopers with dark tan jackets and furrowed brows showed determination against overwhelming odds. Their frowning expressions reflected the serious stakes. These veterans understood the cost of fighting tyranny. Battle-hardened faces told stories of sacrifice.',
    description_de: 'Widerstands-Truppen mit dunklen beigen Jacken und gefurchten Brauen zeigten Entschlossenheit gegen überwältigende Chancen. Ihre mürrischen Ausdrücke spiegelten die ernsten Einsätze wider. Diese Veteranen verstanden die Kosten des Kampfes gegen Tyrannei. Kampferprobte Gesichter erzählten Geschichten von Opfern.',
    description_fr: 'Les Soldats de la Résistance avec vestes beiges foncées et sourcils froncés montraient la détermination contre des chances écrasantes. Leurs expressions renfrognées reflétaient les enjeux sérieux. Ces vétérans comprenaient le coût de la lutte contre la tyrannie. Les visages endurcis par la bataille racontaient des histoires de sacrifice.',
    description_es: 'Los Soldados de Resistencia con chaquetas beige oscuro y cejas fruncidas mostraban determinación contra probabilidades abrumadoras. Sus expresiones ceñudas reflejaban las apuestas serias. Estos veteranos entendían el costo de luchar contra tiranía. Los rostros curtidos en batalla contaban historias de sacrificio.'
  },
  {
    minifigure_no: 'sw0698',
    name: 'Resistance Trooper - Tan Jacket, Frown, Cheek Lines',
    description_en: 'Resistance Troopers with tan jackets and cheek lines showed weathered veterans. Their frowns reflected years of guerrilla warfare. These experienced soldiers trained new recruits. Battle scars and age marked the Resistance\'s core fighters.',
    description_de: 'Widerstands-Truppen mit beigen Jacken und Wangenlinien zeigten verwitterte Veteranen. Ihr Stirnrunzeln spiegelte Jahre Guerilla-Kriegsführung wider. Diese erfahrenen Soldaten trainierten neue Rekruten. Kampfnarben und Alter kennzeichneten die Kern-Kämpfer des Widerstands.',
    description_fr: 'Les Soldats de la Résistance avec vestes beiges et lignes de joue montraient des vétérans usés. Leurs froncements de sourcils reflétaient des années de guérilla. Ces soldats expérimentés formaient de nouvelles recrues. Les cicatrices de bataille et l\'âge marquaient les combattants principaux de la Résistance.',
    description_es: 'Los Soldados de Resistencia con chaquetas beige y líneas en mejillas mostraban veteranos desgastados. Sus ceños fruncidos reflejaban años de guerra de guerrillas. Estos soldados experimentados entrenaban nuevos reclutas. Las cicatrices de batalla y edad marcaban los luchadores centrales de Resistencia.'
  },
  {
    minifigure_no: 'sw0699',
    name: 'Resistance Officer - Headset',
    description_en: 'Resistance Officers with headsets coordinated operations from command centers. Their communication gear linked scattered forces. These leaders maintained operational cohesion despite limited resources. Tactical coordination proved essential to Resistance survival.',
    description_de: 'Widerstands-Offiziere mit Headsets koordinierten Operationen von Kommandozentralen. Ihre Kommunikationsausrüstung verband verstreute Streitkräfte. Diese Anführer erhielten operationale Kohäsion trotz begrenzter Ressourcen. Taktische Koordination erwies sich als wesentlich für Widerstands-Überleben.',
    description_fr: 'Les Officiers de la Résistance avec casques coordonnaient les opérations depuis les centres de commandement. Leur équipement de communication reliait les forces dispersées. Ces leaders maintenaient la cohésion opérationnelle malgré les ressources limitées. La coordination tactique s\'est révélée essentielle à la survie de la Résistance.',
    description_es: 'Los Oficiales de Resistencia con auriculares coordinaban operaciones desde centros de comando. Su equipo de comunicación vinculaba fuerzas dispersas. Estos líderes mantenían cohesión operacional a pesar de recursos limitados. La coordinación táctica resultó esencial para supervivencia de Resistencia.'
  },
  {
    minifigure_no: 'sw0700',
    name: 'C-3PO - Colorful Wires, Printed Legs',
    description_en: 'C-3PO with exposed colorful wires and printed legs showed damage from adventures. This variant revealed the protocol droid\'s complex internals. Threepio\'s tendency to get into trouble left him frequently damaged. His exposed wiring added character detail.',
    description_de: 'C-3PO mit freiliegenden bunten Drähten und bedruckten Beinen zeigte Schäden von Abenteuern. Diese Variante enthüllte die komplexen Interna des Protokoll-Droiden. Threepios Tendenz, in Schwierigkeiten zu geraten, ließ ihn häufig beschädigt. Seine freiliegenden Drähte fügten Charakter-Details hinzu.',
    description_fr: 'C-3PO avec fils colorés exposés et jambes imprimées montrait des dommages d\'aventures. Cette variante révélait les internes complexes du droïde de protocole. La tendance de Threepio à avoir des ennuis le laissait fréquemment endommagé. Son câblage exposé ajoutait des détails de personnage.',
    description_es: 'C-3PO con cables coloridos expuestos y piernas impresas mostraba daño de aventuras. Esta variante revelaba los internos complejos del droide de protocolo. La tendencia de Threepio a meterse en problemas lo dejaba frecuentemente dañado. Su cableado expuesto agregaba detalle de personaje.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0669-sw0768 (Part 1/3)...');

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

  console.log('Part 1 complete! Run part 2 next.');
  await prisma.$disconnect();
}

saveBatch();
