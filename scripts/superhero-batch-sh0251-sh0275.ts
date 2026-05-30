import { PrismaClient as PrismaClientHostinger } from '@prisma/client-hostinger';

const prisma = new PrismaClientHostinger({
  datasources: {
    db: {
      url: "mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker"
    }
  }
});

const descriptions = [
  {
    minifigure_no: 'sh0251',
    description_en: "Red Skull with short legs brings Captain America's nemesis to junior format. This child-friendly design introduces younger collectors to the iconic Nazi villain. Perfect for age-appropriate Captain America adversary displays. A gateway villain piece for next-generation Marvel collections.",
    description_de: "Red Skull mit kurzen Beinen bringt Captain Americas Nemesis ins Junior-Format. Dieses kinderfreundliche Design führt jüngere Sammler zum ikonischen Nazi-Schurken ein. Perfekt für altersgerechte Captain America-Gegner-Displays. Ein Einstiegs-Schurken-Teil für Marvel-Sammlungen der nächsten Generation.",
    description_fr: "Red Skull avec jambes courtes apporte le némésis de Captain America au format junior. Ce design adapté aux enfants présente le méchant nazi emblématique aux jeunes collectionneurs. Parfait pour affichages d'adversaires Captain America adaptés à l'âge. Une pièce de méchant passerelle pour collections Marvel de nouvelle génération.",
    description_es: "Cráneo Rojo con piernas cortas trae al némesis del Capitán América al formato junior. Este diseño amigable para niños introduce a coleccionistas más jóvenes al villano nazi icónico. Perfecto para exhibiciones de adversarios del Capitán América apropiadas para edad. Una pieza de villano de entrada para colecciones Marvel de nueva generación."
  },
  {
    minifigure_no: 'sh0252',
    description_en: "Hulk minifigure with short legs provides junior collector accessibility. This child-friendly format maintains Bruce Banner's powerful alter ego. Perfect for introducing the Avengers to younger fans. An essential piece for family-oriented Marvel displays.",
    description_de: "Hulk-Minifigur mit kurzen Beinen bietet jüngeren Sammlern Zugänglichkeit. Dieses kinderfreundliche Format behält Bruce Banners mächtiges Alter Ego bei. Perfekt für die Vorstellung der Avengers bei jüngeren Fans. Ein unverzichtbares Teil für familienorientierte Marvel-Displays.",
    description_fr: "Figurine Hulk avec jambes courtes offre accessibilité aux jeunes collectionneurs. Ce format adapté aux enfants maintient l'alter ego puissant de Bruce Banner. Parfait pour présenter les Avengers aux jeunes fans. Une pièce essentielle pour affichages Marvel orientés famille.",
    description_es: "Minifigura de Hulk con piernas cortas proporciona accesibilidad para coleccionistas junior. Este formato amigable para niños mantiene el poderoso alter ego de Bruce Banner. Perfecto para presentar a los Vengadores a fans más jóvenes. Una pieza esencial para exhibiciones Marvel orientadas a familia."
  },
  {
    minifigure_no: 'sh0253',
    description_en: "Ultron with short legs brings the AI villain to junior format. This child-friendly design introduces younger collectors to the robotic threat. Perfect for age-appropriate Avengers adversary displays. A gateway villain for building comprehensive junior Marvel collections.",
    description_de: "Ultron mit kurzen Beinen bringt den KI-Schurken ins Junior-Format. Dieses kinderfreundliche Design führt jüngere Sammler zur Roboter-Bedrohung ein. Perfekt für altersgerechte Avengers-Gegner-Displays. Ein Einstiegs-Schurke für den Aufbau umfassender Junior-Marvel-Sammlungen.",
    description_fr: "Ultron avec jambes courtes apporte le méchant IA au format junior. Ce design adapté aux enfants présente la menace robotique aux jeunes collectionneurs. Parfait pour affichages d'adversaires Avengers adaptés à l'âge. Un méchant passerelle pour construire des collections Marvel junior complètes.",
    description_es: "Ultron con piernas cortas trae al villano de IA al formato junior. Este diseño amigable para niños introduce a coleccionistas más jóvenes a la amenaza robótica. Perfecto para exhibiciones de adversarios de Vengadores apropiadas para edad. Un villano de entrada para construir colecciones Marvel junior completas."
  },
  {
    minifigure_no: 'sh0254',
    description_en: "Iron Man Mark 46 with foot repulsors represents the Civil War suit. This armor showcases Tony Stark's technological advancement. The small helmet visor distinguishes this variant. Essential for chronicling Iron Man's evolution through Captain America: Civil War.",
    description_de: "Iron Man Mark 46 mit Fuß-Repulsoren repräsentiert den Civil War-Anzug. Diese Rüstung zeigt Tony Starks technologischen Fortschritt. Das kleine Helm-Visier unterscheidet diese Variante. Unverzichtbar für die Chronik von Iron Mans Evolution durch Captain America: Civil War.",
    description_fr: "Iron Man Mark 46 avec répulseurs de pied représente le costume Civil War. Cette armure présente l'avancement technologique de Tony Stark. La petite visière de casque distingue cette variante. Essentiel pour chronicler l'évolution d'Iron Man à travers Captain America: Civil War.",
    description_es: "Iron Man Mark 46 con repulsores de pie representa el traje de Civil War. Esta armadura muestra el avance tecnológico de Tony Stark. La visera pequeña de casco distingue esta variante. Esencial para relatar la evolución de Iron Man a través de Capitán América: Civil War."
  },
  {
    minifigure_no: 'sh0255',
    description_en: "Agent 13 (Sharon Carter) serves as SHIELD operative and Captain America's ally. Her connection to Peggy Carter adds historical depth. This skilled agent represents the new generation of SHIELD. Important supporting character for Captain America: Civil War storylines.",
    description_de: "Agent 13 (Sharon Carter) dient als SHIELD-Operative und Captain Americas Verbündete. Ihre Verbindung zu Peggy Carter fügt historische Tiefe hinzu. Diese qualifizierte Agentin repräsentiert die neue Generation von SHIELD. Wichtige Nebenfigur für Captain America: Civil War-Handlungen.",
    description_fr: "Agent 13 (Sharon Carter) sert comme opérative SHIELD et alliée de Captain America. Sa connexion à Peggy Carter ajoute profondeur historique. Cette agente qualifiée représente la nouvelle génération de SHIELD. Personnage secondaire important pour intrigues Captain America: Civil War.",
    description_es: "Agente 13 (Sharon Carter) sirve como operativa de SHIELD y aliada del Capitán América. Su conexión con Peggy Carter añade profundidad histórica. Esta agente calificada representa la nueva generación de SHIELD. Personaje secundario importante para historias de Capitán América: Civil War."
  },
  {
    minifigure_no: 'sh0256',
    description_en: "Scarlet Witch with dark red cloth skirt showcases Wanda Maximoff's evolving costume. This Civil War appearance features plain legs with fabric skirt detail. The reddish brown hair completes her signature look. Essential for chronicling Scarlet Witch's journey through MCU films.",
    description_de: "Scarlet Witch mit dunkelrotem Stoffrock zeigt Wanda Maximoffs sich entwickelndes Kostüm. Dieses Civil War-Aussehen zeigt schlichte Beine mit Stoffrock-Detail. Das rotbraune Haar vervollständigt ihren charakteristischen Look. Unverzichtbar für die Chronik von Scarlet Witchs Reise durch MCU-Filme.",
    description_fr: "Scarlet Witch avec jupe en tissu rouge foncé présente le costume évolutif de Wanda Maximoff. Cette apparence Civil War présente jambes simples avec détail de jupe en tissu. Les cheveux brun rougeâtre complètent son look signature. Essentiel pour chronicler le parcours de Scarlet Witch à travers les films MCU.",
    description_es: "Bruja Escarlata con falda de tela rojo oscuro muestra el traje evolutivo de Wanda Maximoff. Esta apariencia de Civil War presenta piernas lisas con detalle de falda de tela. El cabello castaño rojizo completa su look característico. Esencial para relatar el viaje de Bruja Escarlata a través de películas MCU."
  },
  {
    minifigure_no: 'sh0257',
    description_en: "Winter Soldier with black hands represents Bucky Barnes' assassin configuration. This Civil War variant emphasizes the cybernetic arm contrast. The dark brown hair distinguishes this version. A critical piece for Captain America: Civil War's central conflict.",
    description_de: "Winter Soldier mit schwarzen Händen repräsentiert Bucky Barnes' Attentäter-Konfiguration. Diese Civil War-Variante betont den kybernetischen Arm-Kontrast. Das dunkelbraune Haar unterscheidet diese Version. Ein kritisches Teil für den zentralen Konflikt von Captain America: Civil War.",
    description_fr: "Winter Soldier avec mains noires représente la configuration d'assassin de Bucky Barnes. Cette variante Civil War souligne le contraste du bras cybernétique. Les cheveux brun foncé distinguent cette version. Une pièce critique pour le conflit central de Captain America: Civil War.",
    description_es: "Soldado de Invierno con manos negras representa la configuración de asesino de Bucky Barnes. Esta variante de Civil War enfatiza el contraste del brazo cibernético. El cabello marrón oscuro distingue esta versión. Una pieza crítica para el conflicto central de Capitán América: Civil War."
  },
  {
    minifigure_no: 'sh0258',
    description_en: "War Machine with shooter adds play action to James Rhodes' armor. This weaponized variant emphasizes military firepower. The shooter mechanism enhances interactive display possibilities. A dynamic War Machine piece perfect for action-oriented battle scenes.",
    description_de: "War Machine mit Shooter fügt James Rhodes' Rüstung Spiel-Action hinzu. Diese bewaffnete Variante betont militärische Feuerkraft. Der Shooter-Mechanismus verbessert interaktive Display-Möglichkeiten. Ein dynamisches War Machine-Teil, perfekt für actionorientierte Kampfszenen.",
    description_fr: "War Machine avec lanceur ajoute action de jeu à l'armure de James Rhodes. Cette variante armée souligne la puissance de feu militaire. Le mécanisme de lanceur améliore les possibilités d'affichage interactif. Une pièce War Machine dynamique parfaite pour scènes de bataille orientées action.",
    description_es: "War Machine con lanzador añade acción de juego a la armadura de James Rhodes. Esta variante armada enfatiza potencia de fuego militar. El mecanismo de lanzador mejora posibilidades de exhibición interactiva. Una pieza dinámica de War Machine perfecta para escenas de batalla orientadas a acción."
  },
  {
    minifigure_no: 'sh0259',
    description_en: "Deadshot brings deadly accuracy to the Suicide Squad. Floyd Lawton's precision marksmanship makes him invaluable. This minifigure captures his distinctive red targeting visor. Essential villain-turned-antihero for Suicide Squad team displays.",
    description_de: "Deadshot bringt tödliche Genauigkeit zum Suicide Squad. Floyd Lawtons Präzisions-Scharfschützen-Fähigkeit macht ihn unschätzbar. Diese Minifigur erfasst sein charakteristisches rotes Zielvisier. Unverzichtbarer Schurke-wurde-Antiheld für Suicide Squad-Team-Displays.",
    description_fr: "Deadshot apporte précision mortelle au Suicide Squad. La précision de tir de Floyd Lawton le rend inestimable. Cette figurine capture sa visière de ciblage rouge distinctive. Anti-héros essentiel anciennement méchant pour affichages d'équipe Suicide Squad.",
    description_es: "Deadshot aporta precisión mortal al Escuadrón Suicida. La precisión de tiro de Floyd Lawton lo hace invaluable. Esta minifigura captura su distintiva visera de objetivo roja. Villano convertido en antihéroe esencial para exhibiciones de equipo Escuadrón Suicida."
  },
  {
    minifigure_no: 'sh0260',
    description_en: "Harley Quinn with blue and red hands and pigtails captures her Suicide Squad appearance. Dr. Harleen Quinzel's chaotic energy defines the team dynamic. This variant showcases her iconic two-tone aesthetic. Highly popular character essential for Suicide Squad collections.",
    description_de: "Harley Quinn mit blau-roten Händen und Zöpfen erfasst ihr Suicide Squad-Aussehen. Dr. Harleen Quinzels chaotische Energie definiert die Team-Dynamik. Diese Variante zeigt ihre ikonische zweifarbige Ästhetik. Sehr beliebte Figur, unverzichtbar für Suicide Squad-Sammlungen.",
    description_fr: "Harley Quinn avec mains bleues et rouges et couettes capture son apparence Suicide Squad. L'énergie chaotique du Dr Harleen Quinzel définit la dynamique d'équipe. Cette variante présente son esthétique bicolore emblématique. Personnage très populaire essentiel pour collections Suicide Squad.",
    description_es: "Harley Quinn con manos azules y rojas y coletas captura su apariencia de Escuadrón Suicida. La energía caótica de la Dra. Harleen Quinzel define la dinámica del equipo. Esta variante muestra su estética icónica de dos tonos. Personaje muy popular esencial para colecciones de Escuadrón Suicida."
  },
  {
    minifigure_no: 'sh0261',
    description_en: "Falcon with light bluish gray and dark red wings represents Sam Wilson's Civil War appearance. His aerial combat capabilities make him essential. The distinctive wing coloring identifies this variant. A key Avengers member bridging Captain America storylines.",
    description_de: "Falcon mit hellblaugrauen und dunkelroten Flügeln repräsentiert Sam Wilsons Civil War-Aussehen. Seine Luftkampf-Fähigkeiten machen ihn unverzichtbar. Die charakteristische Flügel-Färbung identifiziert diese Variante. Ein Schlüssel-Avengers-Mitglied, das Captain America-Handlungen verbindet.",
    description_fr: "Falcon avec ailes gris bleuté clair et rouge foncé représente l'apparence Civil War de Sam Wilson. Ses capacités de combat aérien le rendent essentiel. La coloration distinctive des ailes identifie cette variante. Un membre Avengers clé reliant les intrigues Captain America.",
    description_es: "Falcon con alas gris azulado claro y rojo oscuro representa la apariencia de Civil War de Sam Wilson. Sus capacidades de combate aéreo lo hacen esencial. La coloración distintiva de alas identifica esta variante. Un miembro clave de Vengadores que une historias del Capitán América."
  },
  {
    minifigure_no: 'sh0262',
    description_en: "Crossbones emerges as Brock Rumlow's villainous transformation. This ruthless mercenary drives Captain America: Civil War's opening conflict. The skull-masked appearance emphasizes brutal efficiency. A key villain representing Hydra's persistent threat.",
    description_de: "Crossbones tritt als Brock Rumlows schurkenhafte Verwandlung auf. Dieser rücksichtslose Söldner treibt den Eröffnungskonflikt von Captain America: Civil War. Das totenkopfmaskierte Aussehen betont brutale Effizienz. Ein Schlüssel-Schurke, der Hydras anhaltende Bedrohung repräsentiert.",
    description_fr: "Crossbones émerge comme la transformation vilaine de Brock Rumlow. Ce mercenaire impitoyable motive le conflit d'ouverture de Captain America: Civil War. L'apparence masquée de crâne souligne l'efficacité brutale. Un méchant clé représentant la menace persistante d'Hydra.",
    description_es: "Crossbones emerge como la transformación villana de Brock Rumlow. Este mercenario despiadado impulsa el conflicto inicial de Capitán América: Civil War. La apariencia enmascarada de calavera enfatiza eficiencia brutal. Un villano clave que representa la amenaza persistente de Hydra."
  },
  {
    minifigure_no: 'sh0263',
    description_en: "Black Panther with dark silver armor marks T'Challa's MCU debut. The yellow eyes distinguish this Civil War variant. Wakanda's protector brings vibranium technology and royal authority. An essential character launching Black Panther's standalone franchise.",
    description_de: "Black Panther mit dunkelsilberner Rüstung markiert T'Challas MCU-Debüt. Die gelben Augen unterscheiden diese Civil War-Variante. Wakandas Beschützer bringt Vibranium-Technologie und königliche Autorität. Eine unverzichtbare Figur, die Black Panthers eigenständiges Franchise startet.",
    description_fr: "Black Panther avec armure argent foncé marque les débuts MCU de T'Challa. Les yeux jaunes distinguent cette variante Civil War. Le protecteur du Wakanda apporte technologie vibranium et autorité royale. Un personnage essentiel lançant la franchise autonome Black Panther.",
    description_es: "Black Panther con armadura plateada oscura marca el debut MCU de T'Challa. Los ojos amarillos distinguen esta variante de Civil War. El protector de Wakanda aporta tecnología de vibranium y autoridad real. Un personaje esencial que lanza la franquicia independiente de Black Panther."
  },
  {
    minifigure_no: 'sh0264',
    description_en: "Captain America unmasked with dark brown eyebrows shows Steve Rogers in Civil War. This variant reveals the man behind the shield during the Avengers split. Perfect for character-driven displays emphasizing personal conflict. Essential for showcasing Civil War's emotional stakes.",
    description_de: "Captain America ohne Maske mit dunkelbraunen Augenbrauen zeigt Steve Rogers in Civil War. Diese Variante enthüllt den Mann hinter dem Schild während der Avengers-Spaltung. Perfekt für charaktergetriebene Displays, die persönlichen Konflikt betonen. Unverzichtbar für die Darstellung der emotionalen Einsätze von Civil War.",
    description_fr: "Captain America démasqué avec sourcils brun foncé montre Steve Rogers dans Civil War. Cette variante révèle l'homme derrière le bouclier pendant la scission des Avengers. Parfait pour affichages axés sur les personnages soulignant le conflit personnel. Essentiel pour présenter les enjeux émotionnels de Civil War.",
    description_es: "Capitán América sin máscara con cejas marrón oscuro muestra a Steve Rogers en Civil War. Esta variante revela al hombre detrás del escudo durante la división de Vengadores. Perfecto para exhibiciones impulsadas por personaje que enfatizan conflicto personal. Esencial para mostrar las apuestas emocionales de Civil War."
  },
  {
    minifigure_no: 'sh0265',
    description_en: "Pirate Batman brings swashbuckling adventure to the Dark Knight. This themed variant combines Batman aesthetics with nautical elements. Perfect for alternate universe and playful display scenarios. A fun crossover piece appealing to collectors seeking unconventional Batman variants.",
    description_de: "Pirate Batman bringt verwegenes Abenteuer zum Dark Knight. Diese thematische Variante kombiniert Batman-Ästhetik mit nautischen Elementen. Perfekt für alternative Universum- und verspielte Display-Szenarien. Ein lustiges Crossover-Teil, das Sammler anzieht, die unkonventionelle Batman-Varianten suchen.",
    description_fr: "Pirate Batman apporte aventure de cape et d'épée au Chevalier Noir. Cette variante thématique combine esthétique Batman avec éléments nautiques. Parfait pour scénarios d'univers alternatif et d'affichage ludique. Une pièce crossover amusante attirant collectionneurs recherchant variantes Batman non conventionnelles.",
    description_es: "Batman Pirata aporta aventura de capa y espada al Caballero Oscuro. Esta variante temática combina estética de Batman con elementos náuticos. Perfecto para escenarios de universo alternativo y exhibición lúdica. Una pieza de cruce divertida que atrae a coleccionistas que buscan variantes no convencionales de Batman."
  },
  {
    minifigure_no: 'sh0266',
    description_en: "Mr. Freeze from Classic TV Series recreates the icy villain's 1960s portrayal. This cold-themed adversary brings scientific genius to Batman's rogues. The television styling captures period authenticity. Essential villain for completing Classic TV Batman adversary collections.",
    description_de: "Mr. Freeze aus der klassischen TV-Serie bildet die eisige Darstellung des Schurken aus den 1960ern nach. Dieser kältethematische Gegner bringt wissenschaftliches Genie zu Batmans Rogues. Das Fernseh-Styling erfasst Perioden-Authentizität. Unverzichtbarer Schurke für die Vervollständigung klassischer TV Batman-Gegner-Sammlungen.",
    description_fr: "Mr. Freeze de la Série Télévisée Classique recrée le portrait glacial du méchant des années 1960. Cet adversaire à thème froid apporte génie scientifique aux voyous de Batman. Le style télévisuel capture l'authenticité d'époque. Méchant essentiel pour compléter collections d'adversaires Batman TV Classique.",
    description_es: "Mr. Freeze de la Serie de TV Clásica recrea la interpretación helada del villano de los años 1960. Este adversario temático de frío aporta genio científico a los pícaros de Batman. El estilo televisivo captura autenticidad de época. Villano esencial para completar colecciones de adversarios de Batman de TV Clásico."
  },
  {
    minifigure_no: 'sh0267',
    description_en: "Ghost Rider (Johnny Blaze) brings supernatural vengeance with flaming skull. The Spirit of Vengeance combines motorcycle stunts with hellfire powers. This white head variant captures his skeletal appearance. A dramatic Marvel character essential for supernatural superhero collections.",
    description_de: "Ghost Rider (Johnny Blaze) bringt übernatürliche Rache mit flammendem Schädel. Der Geist der Rache kombiniert Motorrad-Stunts mit Höllenfeuer-Kräften. Diese weiße Kopf-Variante erfasst sein skelettartiges Aussehen. Eine dramatische Marvel-Figur, unverzichtbar für übernatürliche Superhelden-Sammlungen.",
    description_fr: "Ghost Rider (Johnny Blaze) apporte vengeance surnaturelle avec crâne enflammé. L'Esprit de Vengeance combine cascades de moto avec pouvoirs de feu infernal. Cette variante de tête blanche capture son apparence squelettique. Un personnage Marvel dramatique essentiel pour collections de super-héros surnaturels.",
    description_es: "Ghost Rider (Johnny Blaze) aporta venganza sobrenatural con cráneo en llamas. El Espíritu de Venganza combina acrobacias de motocicleta con poderes de fuego infernal. Esta variante de cabeza blanca captura su apariencia esquelética. Un personaje dramático de Marvel esencial para colecciones de superhéroes sobrenaturales."
  },
  {
    minifigure_no: 'sh0268',
    description_en: "Hobgoblin with starched fabric cape brings menace to Spider-Man's rogues. Roderick Kingsley's goblin-themed villainy mirrors Green Goblin's threat. The fabric cape adds premium quality. A key Spider-Man villain essential for comprehensive adversary displays.",
    description_de: "Hobgoblin mit gestärktem Stoffcape bringt Bedrohung zu Spider-Mans Rogues. Roderick Kingsleys kobold-thematische Schurkentat spiegelt Green Goblins Bedrohung. Das Stoffcape fügt Premium-Qualität hinzu. Ein Schlüssel-Spider-Man-Schurke, unverzichtbar für umfassende Gegner-Displays.",
    description_fr: "Hobgoblin avec cape en tissu amidonné apporte menace aux voyous de Spider-Man. La vilenie à thème gobelin de Roderick Kingsley reflète la menace du Green Goblin. La cape en tissu ajoute qualité premium. Un méchant Spider-Man clé essentiel pour affichages d'adversaires complets.",
    description_es: "Hobgoblin con capa de tela almidonada aporta amenaza a los pícaros de Spider-Man. La villanía temática de duende de Roderick Kingsley refleja la amenaza del Duende Verde. La capa de tela añade calidad premium. Un villano clave de Spider-Man esencial para exhibiciones completas de adversarios."
  },
  {
    minifigure_no: 'sh0269',
    description_en: "Scorpion brings deadly tail and venom to Spider-Man battles. Mac Gargan's transformation created this arachnid-themed villain. The mechanical tail adds distinctive attack capability. Essential Spider-Man adversary for Sinister Six team displays.",
    description_de: "Scorpion bringt tödlichen Schwanz und Gift zu Spider-Man-Kämpfen. Mac Gargans Verwandlung schuf diesen arachniden-thematischen Schurken. Der mechanische Schwanz fügt charakteristische Angriffsfähigkeit hinzu. Unverzichtbarer Spider-Man-Gegner für Sinister Six-Team-Displays.",
    description_fr: "Scorpion apporte queue mortelle et venin aux batailles Spider-Man. La transformation de Mac Gargan a créé ce méchant à thème arachnide. La queue mécanique ajoute capacité d'attaque distinctive. Adversaire Spider-Man essentiel pour affichages d'équipe Sinister Six.",
    description_es: "Scorpion aporta cola mortal y veneno a batallas de Spider-Man. La transformación de Mac Gargan creó este villano temático arácnido. La cola mecánica añade capacidad de ataque distintiva. Adversario esencial de Spider-Man para exhibiciones de equipo Siniestros Seis."
  },
  {
    minifigure_no: 'sh0270',
    description_en: "Kraven the Hunter stalks Spider-Man with primal ferocity. Sergei Kravinoff's obsession with hunting the ultimate prey drives his villainy. This distinctive character brings jungle aesthetics to urban battles. A unique Spider-Man villain essential for diverse rogues gallery displays.",
    description_de: "Kraven der Jäger verfolgt Spider-Man mit urwüchsiger Wildheit. Sergei Kravinoffs Besessenheit mit der Jagd auf die ultimative Beute treibt seine Schurkentat. Diese charakteristische Figur bringt Dschungel-Ästhetik zu urbanen Kämpfen. Ein einzigartiger Spider-Man-Schurke, unverzichtbar für vielfältige Rogues Gallery-Displays.",
    description_fr: "Kraven le Chasseur traque Spider-Man avec férocité primale. L'obsession de Sergei Kravinoff pour chasser la proie ultime motive sa vilenie. Ce personnage distinctif apporte esthétique jungle aux batailles urbaines. Un méchant Spider-Man unique essentiel pour affichages de galerie de voyous diversifiés.",
    description_es: "Kraven el Cazador acecha a Spider-Man con ferocidad primitiva. La obsesión de Sergei Kravinoff por cazar la presa definitiva impulsa su villanía. Este personaje distintivo aporta estética de jungla a batallas urbanas. Un villano único de Spider-Man esencial para exhibiciones diversas de galería de pícaros."
  },
  {
    minifigure_no: 'sh0271',
    description_en: "Green Goblin with magenta outfit showcases an alternate color scheme. Norman Osborn's menacing presence remains through different costume variations. The bright green skin contrasts dramatically with magenta. A striking visual variant for collectors seeking every Green Goblin design.",
    description_de: "Green Goblin mit magentafarbenem Outfit zeigt ein alternatives Farbschema. Norman Osborns bedrohliche Präsenz bleibt durch verschiedene Kostüm-Variationen. Die hellgrüne Haut kontrastiert dramatisch mit Magenta. Eine auffällige visuelle Variante für Sammler, die jedes Green Goblin-Design suchen.",
    description_fr: "Green Goblin avec tenue magenta présente un schéma de couleurs alternatif. La présence menaçante de Norman Osborn demeure à travers différentes variations de costume. La peau vert vif contraste dramatiquement avec le magenta. Une variante visuelle frappante pour collectionneurs recherchant chaque design Green Goblin.",
    description_es: "Duende Verde con traje magenta muestra un esquema de color alternativo. La presencia amenazante de Norman Osborn permanece a través de diferentes variaciones de traje. La piel verde brillante contrasta dramáticamente con magenta. Una variante visual llamativa para coleccionistas que buscan cada diseño del Duende Verde."
  },
  {
    minifigure_no: 'sh0272',
    description_en: "Aunt May with medium lavender scarf represents Peter Parker's beloved guardian. May Parker provides moral guidance and emotional support. This nurturing character adds heart to Spider-Man stories. Essential supporting character for complete Spider-Man family displays.",
    description_de: "Aunt May mit mittellavendelfarbenem Schal repräsentiert Peter Parkers geliebte Beschützerin. May Parker bietet moralische Führung und emotionale Unterstützung. Diese fürsorgliche Figur fügt Herz zu Spider-Man-Geschichten hinzu. Unverzichtbare Nebenfigur für vollständige Spider-Man-Familien-Displays.",
    description_fr: "Tante May avec écharpe lavande moyen représente la tutrice bien-aimée de Peter Parker. May Parker fournit guidance morale et soutien émotionnel. Ce personnage nourricier ajoute du cœur aux histoires Spider-Man. Personnage secondaire essentiel pour affichages complets de famille Spider-Man.",
    description_es: "Tía May con bufanda lavanda medio representa a la querida tutora de Peter Parker. May Parker proporciona guía moral y apoyo emocional. Este personaje protector añade corazón a historias de Spider-Man. Personaje secundario esencial para exhibiciones completas de familia Spider-Man."
  },
  {
    minifigure_no: 'sh0273',
    description_en: "Spider-Girl in red outfit brings the next generation to Spider-verse. May 'Mayday' Parker carries on her father's legacy with unique powers. This future hero expands Spider-family storytelling. Essential for comprehensive Spider-verse and legacy hero collections.",
    description_de: "Spider-Girl im roten Outfit bringt die nächste Generation ins Spider-Verse. May 'Mayday' Parker führt das Erbe ihres Vaters mit einzigartigen Kräften fort. Diese zukünftige Heldin erweitert Spider-Familien-Storytelling. Unverzichtbar für umfassende Spider-Verse- und Legacy-Helden-Sammlungen.",
    description_fr: "Spider-Girl en tenue rouge apporte la prochaine génération au Spider-verse. May 'Mayday' Parker poursuit l'héritage de son père avec pouvoirs uniques. Cette héroïne future élargit la narration de famille Spider. Essentiel pour collections complètes Spider-verse et héros héritage.",
    description_es: "Spider-Girl en traje rojo aporta la próxima generación al Spider-verso. May 'Mayday' Parker continúa el legado de su padre con poderes únicos. Esta heroína futura expande narración de familia Spider. Esencial para colecciones completas de Spider-verso y héroes legado."
  },
  {
    minifigure_no: 'sh0274',
    description_en: "Scarlet Spider showcases Ben Reilly's distinctive costume design. This Spider-Man clone brings complex identity to the spider-family. The scarlet and blue color scheme stands out. Essential for comprehensive Spider-verse collections exploring clone saga storylines.",
    description_de: "Scarlet Spider zeigt Ben Reillys charakteristisches Kostüm-Design. Dieser Spider-Man-Klon bringt komplexe Identität zur Spider-Familie. Das scharlach-blaue Farbschema sticht hervor. Unverzichtbar für umfassende Spider-Verse-Sammlungen, die Klon-Saga-Handlungen erforschen.",
    description_fr: "Scarlet Spider présente le design de costume distinctif de Ben Reilly. Ce clone de Spider-Man apporte identité complexe à la famille-araignée. Le schéma de couleurs écarlate et bleu se démarque. Essentiel pour collections Spider-verse complètes explorant intrigues de saga des clones.",
    description_es: "Scarlet Spider muestra el diseño de traje distintivo de Ben Reilly. Este clon de Spider-Man aporta identidad compleja a la familia-araña. El esquema de color escarlata y azul destaca. Esencial para colecciones completas de Spider-verso que exploran historias de saga de clones."
  },
  {
    minifigure_no: 'sh0275',
    description_en: "Scarecrow with dark orange floppy hat terrorizes Gotham with fear toxin. Dr. Jonathan Crane weaponizes psychology against Batman. This distinctive design emphasizes his nightmare-inducing persona. Essential Batman villain representing psychological horror threats.",
    description_de: "Scarecrow mit dunkelorangem Schlapphut terrorisiert Gotham mit Angst-Toxin. Dr. Jonathan Crane bewaffnet Psychologie gegen Batman. Dieses charakteristische Design betont seine alptraumauslösende Persona. Unverzichtbarer Batman-Schurke, der psychologische Horror-Bedrohungen repräsentiert.",
    description_fr: "Scarecrow avec chapeau mou orange foncé terrorise Gotham avec toxine de peur. Dr. Jonathan Crane transforme la psychologie en arme contre Batman. Ce design distinctif souligne son personnage inducteur de cauchemars. Méchant Batman essentiel représentant menaces d'horreur psychologique.",
    description_es: "Scarecrow con sombrero flojo naranja oscuro aterroriza Gotham con toxina de miedo. Dr. Jonathan Crane arma psicología contra Batman. Este diseño distintivo enfatiza su persona inductora de pesadillas. Villano esencial de Batman que representa amenazas de horror psicológico."
  }
];

async function main() {
  console.log(`🦸 Starting Super Heroes batch sh0251-sh0275 (${descriptions.length} minifigs)...`);
  console.log();

  for (let i = 0; i < descriptions.length; i++) {
    const desc = descriptions[i];

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

    console.log(`✓ Saved ${desc.minifigure_no} (${i + 1}/${descriptions.length})`);
  }

  console.log();
  console.log(`✅ Batch complete! ${descriptions.length} minifigs saved. Total: 275 done.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
