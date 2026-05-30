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
    minifigure_no: 'sh0126',
    description_en: "Ronan the Accuser wields cosmic power and zealous judgment as a Kree warrior. His blue head and hands distinguish this powerful adversary from Guardians of the Galaxy. The Accuser's hammer grants reality-altering abilities. A formidable villain piece essential for cosmic Marvel displays and Guardians storylines.",
    description_de: "Ronan der Ankläger schwingt kosmische Macht und fanatisches Urteil als Kree-Krieger. Sein blauer Kopf und blaue Hände zeichnen diesen mächtigen Gegner der Guardians of the Galaxy aus. Der Hammer des Anklägers verleiht realitätsverändernde Fähigkeiten. Ein beeindruckendes Schurken-Teil, unverzichtbar für kosmische Marvel-Displays und Guardians-Handlungen.",
    description_fr: "Ronan l'Accusateur manie pouvoir cosmique et jugement zélé en tant que guerrier Kree. Sa tête et mains bleues distinguent cet adversaire puissant des Gardiens de la Galaxie. Le marteau de l'Accusateur confère des capacités altérant la réalité. Une pièce de méchant formidable essentielle pour les affichages Marvel cosmiques et intrigues Gardiens.",
    description_es: "Ronan el Acusador maneja poder cósmico y juicio fanático como guerrero Kree. Su cabeza y manos azules distinguen a este poderoso adversario de Guardianes de la Galaxia. El martillo del Acusador otorga habilidades que alteran la realidad. Una pieza de villano formidable esencial para exhibiciones cósmicas de Marvel e historias de Guardianes."
  },
  {
    minifigure_no: 'sh0127',
    description_en: "Star-Lord's masked appearance with open jacket variant showcases Peter Quill's relaxed leadership style. This configuration captures his roguish charm and cosmic adventure spirit. The open jacket reveals character details while maintaining his iconic masked look. A must-have variant for comprehensive Star-Lord collections.",
    description_de: "Star-Lords maskiertes Aussehen mit offener Jacken-Variante zeigt Peter Quills entspannten Führungsstil. Diese Konfiguration erfasst seinen schelmischen Charme und kosmischen Abenteuergeist. Die offene Jacke enthüllt Charakter-Details, während sie seinen ikonischen maskierten Look beibehält. Eine unverzichtbare Variante für umfassende Star-Lord-Sammlungen.",
    description_fr: "L'apparence masquée de Star-Lord avec variante de veste ouverte met en valeur le style de leadership décontracté de Peter Quill. Cette configuration capture son charme roublard et son esprit d'aventure cosmique. La veste ouverte révèle des détails de personnage tout en conservant son look masqué emblématique. Une variante incontournable pour les collections Star-Lord complètes.",
    description_es: "La apariencia enmascarada de Star-Lord con variante de chaqueta abierta muestra el estilo de liderazgo relajado de Peter Quill. Esta configuración captura su encanto pícaro y espíritu de aventura cósmica. La chaqueta abierta revela detalles del personaje mientras mantiene su icónico look enmascarado. Una variante imprescindible para colecciones completas de Star-Lord."
  },
  {
    minifigure_no: 'sh0128',
    description_en: "Nova Corps Officers maintain peace and order across the galaxy. These elite space police force members appeared prominently in Guardians of the Galaxy. Their distinctive uniforms and commitment to justice make them valuable allies. Essential army builders for creating authentic Nova Corps formations and space battle scenes.",
    description_de: "Nova Corps-Offiziere bewahren Frieden und Ordnung in der gesamten Galaxie. Diese Elite-Weltraumpolizei-Mitglieder erschienen prominent in Guardians of the Galaxy. Ihre charakteristischen Uniformen und Engagement für Gerechtigkeit machen sie zu wertvollen Verbündeten. Unverzichtbare Armee-Baumeister für die Erstellung authentischer Nova Corps-Formationen und Weltraumkampfszenen.",
    description_fr: "Les Officiers du Nova Corps maintiennent la paix et l'ordre à travers la galaxie. Ces membres de la force de police spatiale d'élite sont apparus de manière proéminente dans les Gardiens de la Galaxie. Leurs uniformes distinctifs et engagement envers la justice en font des alliés précieux. Constructeurs d'armée essentiels pour créer des formations Nova Corps authentiques et scènes de bataille spatiale.",
    description_es: "Los Oficiales del Nova Corps mantienen paz y orden a través de la galaxia. Estos miembros de la fuerza policial espacial de élite aparecieron prominentemente en Guardianes de la Galaxia. Sus uniformes distintivos y compromiso con la justicia los convierten en aliados valiosos. Constructores de ejército esenciales para crear formaciones auténticas del Nova Corps y escenas de batalla espacial."
  },
  {
    minifigure_no: 'sh0129',
    description_en: "Batman of Zur-En-Arrh represents one of the Dark Knight's most psychedelic and bizarre alternate personas. This San Diego Comic-Con 2014 exclusive features wild colors from Grant Morrison's acclaimed storyline. The bright costume contrasts dramatically with traditional Batman aesthetics. Extremely rare and valuable convention exclusive highly prized by serious Batman collectors.",
    description_de: "Batman von Zur-En-Arrh repräsentiert eine der psychedelischsten und bizarrsten alternativen Personas des Dark Knight. Diese San Diego Comic-Con 2014-Exklusivfigur zeigt wilde Farben aus Grant Morrisons gefeierter Handlung. Das leuchtende Kostüm kontrastiert dramatisch mit traditioneller Batman-Ästhetik. Extrem seltene und wertvolle Convention-Exklusivfigur, hoch geschätzt von ernsthaften Batman-Sammlern.",
    description_fr: "Batman de Zur-En-Arrh représente l'un des personnages alternatifs les plus psychédéliques et bizarres du Chevalier Noir. Cette exclusive San Diego Comic-Con 2014 présente des couleurs sauvages de l'intrigue acclamée de Grant Morrison. Le costume lumineux contraste dramatiquement avec l'esthétique Batman traditionnelle. Exclusive de convention extrêmement rare et précieuse très prisée par les collectionneurs sérieux de Batman.",
    description_es: "Batman de Zur-En-Arrh representa una de las personas alternativas más psicodélicas y bizarras del Caballero Oscuro. Esta exclusiva de San Diego Comic-Con 2014 presenta colores salvajes de la aclamada historia de Grant Morrison. El traje brillante contrasta dramáticamente con la estética tradicional de Batman. Exclusiva de convención extremadamente rara y valiosa muy apreciada por coleccionistas serios de Batman."
  },
  {
    minifigure_no: 'sh0130',
    description_en: "The Collector obsessively gathers rare specimens from across the universe. Taneleer Tivan's museum houses the galaxy's most valuable artifacts. This San Diego Comic-Con 2014 exclusive captures his distinctive appearance from Guardians of the Galaxy. Highly sought-after convention exclusive essential for serious Marvel cosmic collectors.",
    description_de: "Der Sammler sammelt obsessiv seltene Exemplare aus dem gesamten Universum. Taneleer Tivans Museum beherbergt die wertvollsten Artefakte der Galaxie. Diese San Diego Comic-Con 2014-Exklusivfigur erfasst sein charakteristisches Aussehen aus Guardians of the Galaxy. Sehr begehrte Convention-Exklusivfigur, unverzichtbar für ernsthafte kosmische Marvel-Sammler.",
    description_fr: "Le Collectionneur rassemble obsessionnellement des spécimens rares de tout l'univers. Le musée de Taneleer Tivan abrite les artefacts les plus précieux de la galaxie. Cette exclusive San Diego Comic-Con 2014 capture son apparence distinctive des Gardiens de la Galaxie. Exclusive de convention très recherchée essentielle pour les collectionneurs sérieux Marvel cosmiques.",
    description_es: "El Coleccionista reúne obsesivamente especímenes raros de todo el universo. El museo de Taneleer Tivan alberga los artefactos más valiosos de la galaxia. Esta exclusiva de San Diego Comic-Con 2014 captura su apariencia distintiva de Guardianes de la Galaxia. Exclusiva de convención muy buscada esencial para coleccionistas serios cósmicos de Marvel."
  },
  {
    minifigure_no: 'sh0132',
    description_en: "Batman's black suit with copper belt features the Type 2 cowl design. This variant showcases an elegant color combination emphasizing the Dark Knight's shadowy nature. The copper belt provides subtle contrast against the all-black costume. A sophisticated variant appealing to collectors seeking every Batman cowl variation.",
    description_de: "Batmans schwarzer Anzug mit kupfernem Gürtel zeigt das Type 2-Kapuzen-Design. Diese Variante präsentiert eine elegante Farbkombination, die die schattenhafte Natur des Dark Knight betont. Der kupferne Gürtel bietet subtilen Kontrast gegen das ganz schwarze Kostüm. Eine anspruchsvolle Variante, die Sammler anzieht, die jede Batman-Kapuzen-Variation suchen.",
    description_fr: "Le costume noir de Batman avec ceinture cuivrée présente le design de capuche Type 2. Cette variante met en valeur une combinaison de couleurs élégante soulignant la nature ombragée du Chevalier Noir. La ceinture cuivrée offre un contraste subtil contre le costume entièrement noir. Une variante sophistiquée attirant les collectionneurs recherchant chaque variation de capuche Batman.",
    description_es: "El traje negro de Batman con cinturón de cobre presenta el diseño de capucha Tipo 2. Esta variante muestra una combinación de colores elegante que enfatiza la naturaleza sombría del Caballero Oscuro. El cinturón de cobre proporciona contraste sutil contra el traje completamente negro. Una variante sofisticada que atrae a coleccionistas que buscan cada variación de capucha de Batman."
  },
  {
    minifigure_no: 'sh0133',
    description_en: "The Joker's dark purple suit with green vest showcases the Clown Prince of Crime in formal attire. His signature green hair completes this elegant yet menacing appearance. This variant captures the Joker's unpredictable blend of sophistication and chaos. Essential for collectors seeking the full range of Joker's costume variations.",
    description_de: "Der dunkelviolette Anzug des Jokers mit grüner Weste zeigt den Clown-Prinzen des Verbrechens in formeller Kleidung. Sein charakteristisches grünes Haar vervollständigt dieses elegante, aber bedrohliche Aussehen. Diese Variante erfasst die Jokers unvorhersehbare Mischung aus Raffinesse und Chaos. Unverzichtbar für Sammler, die die gesamte Bandbreite der Kostüm-Variationen des Jokers suchen.",
    description_fr: "Le costume violet foncé du Joker avec gilet vert présente le Prince Clown du Crime en tenue formelle. Ses cheveux verts signature complètent cette apparence élégante mais menaçante. Cette variante capture le mélange imprévisible de sophistication et chaos du Joker. Essentiel pour les collectionneurs recherchant toute la gamme des variations de costume du Joker.",
    description_es: "El traje morado oscuro del Joker con chaleco verde muestra al Príncipe Payaso del Crimen en atuendo formal. Su característico cabello verde completa esta apariencia elegante pero amenazante. Esta variante captura la mezcla impredecible de sofisticación y caos del Joker. Esencial para coleccionistas que buscan la gama completa de variaciones de traje del Joker."
  },
  {
    minifigure_no: 'sh0137',
    description_en: "Superman's black suit represents his return from death in the iconic 'Death of Superman' storyline. This San Diego Comic-Con 2013 exclusive captures one of the most significant moments in DC Comics history. The black costume symbolizes mourning and rebirth. Extremely rare convention exclusive commanding premium prices among Superman collectors.",
    description_de: "Supermans schwarzer Anzug repräsentiert seine Rückkehr vom Tod in der ikonischen 'Tod von Superman'-Handlung. Diese San Diego Comic-Con 2013-Exklusivfigur erfasst einen der bedeutendsten Momente in der DC Comics-Geschichte. Das schwarze Kostüm symbolisiert Trauer und Wiedergeburt. Extrem seltene Convention-Exklusivfigur, die Premium-Preise bei Superman-Sammlern erzielt.",
    description_fr: "Le costume noir de Superman représente son retour de la mort dans l'intrigue emblématique 'La Mort de Superman'. Cette exclusive San Diego Comic-Con 2013 capture l'un des moments les plus significatifs de l'histoire DC Comics. Le costume noir symbolise le deuil et la renaissance. Exclusive de convention extrêmement rare commandant des prix premium parmi les collectionneurs Superman.",
    description_es: "El traje negro de Superman representa su regreso de la muerte en la icónica historia 'La Muerte de Superman'. Esta exclusiva de San Diego Comic-Con 2013 captura uno de los momentos más significativos en la historia de DC Comics. El traje negro simboliza luto y renacimiento. Exclusiva de convención extremadamente rara que alcanza precios premium entre coleccionistas de Superman."
  },
  {
    minifigure_no: 'sh0138',
    description_en: "Green Arrow's hooded appearance captures Oliver Queen's street-level vigilante persona. This San Diego Comic-Con 2013 exclusive showcases the Emerald Archer's iconic look. The hood adds mystery and urban grit to his superhero identity. Highly valuable convention exclusive sought by DC Comics collectors.",
    description_de: "Green Arrows Kapuzen-Aussehen erfasst Oliver Queens Vigilanten-Persona auf Straßenniveau. Diese San Diego Comic-Con 2013-Exklusivfigur zeigt den ikonischen Look des smaragdgrünen Bogenschützen. Die Kapuze fügt Mysterium und urbanen Schmutz zu seiner Superhelden-Identität hinzu. Sehr wertvolle Convention-Exklusivfigur, gesucht von DC Comics-Sammlern.",
    description_fr: "L'apparence à capuche de Green Arrow capture le personnage de justicier de rue d'Oliver Queen. Cette exclusive San Diego Comic-Con 2013 met en valeur le look emblématique de l'Archer Émeraude. La capuche ajoute mystère et rudesse urbaine à son identité de super-héros. Exclusive de convention très précieuse recherchée par les collectionneurs DC Comics.",
    description_es: "La apariencia con capucha de Flecha Verde captura la persona de vigilante callejero de Oliver Queen. Esta exclusiva de San Diego Comic-Con 2013 muestra el look icónico del Arquero Esmeralda. La capucha añade misterio y dureza urbana a su identidad de superhéroe. Exclusiva de convención muy valiosa buscada por coleccionistas de DC Comics."
  },
  {
    minifigure_no: 'sh0139',
    description_en: "Spider-Man's red lower legs variant from San Diego Comic-Con 2013 represents a unique costume configuration. This exclusive captures Peter Parker's iconic web-slinger appearance with distinctive leg coloring. Comic-Con exclusives always command premium collector interest. A must-have for completionist Spider-Man collections.",
    description_de: "Spider-Mans Variante mit roten Unterbeinen von der San Diego Comic-Con 2013 repräsentiert eine einzigartige Kostüm-Konfiguration. Diese Exklusivfigur erfasst Peter Parkers ikonisches Web-Slinger-Aussehen mit charakteristischer Beinfärbung. Comic-Con-Exklusivfiguren erzielen immer Premium-Sammler-Interesse. Ein Muss für vervollständigende Spider-Man-Sammlungen.",
    description_fr: "La variante de Spider-Man avec jambes inférieures rouges de la San Diego Comic-Con 2013 représente une configuration de costume unique. Cette exclusive capture l'apparence emblématique du lanceur de toiles de Peter Parker avec coloration distinctive des jambes. Les exclusives Comic-Con commandent toujours un intérêt premium des collectionneurs. Un incontournable pour les collections Spider-Man complétistes.",
    description_es: "La variante de Spider-Man con piernas inferiores rojas de San Diego Comic-Con 2013 representa una configuración de traje única. Esta exclusiva captura la apariencia icónica del lanzador de telarañas de Peter Parker con coloración distintiva de piernas. Las exclusivas de Comic-Con siempre generan interés premium de coleccionistas. Imprescindible para colecciones completistas de Spider-Man."
  },
  {
    minifigure_no: 'sh0140',
    description_en: "Spider-Woman brings unique powers and complexity to the Marvel spider-verse. Jessica Drew's pheromone manipulation and venom blasts complement her wall-crawling abilities. This San Diego Comic-Con 2013 exclusive marks a rare LEGO appearance for the character. Highly valuable convention exclusive essential for Marvel spider-family collectors.",
    description_de: "Spider-Woman bringt einzigartige Kräfte und Komplexität ins Marvel-Spider-Verse. Jessica Drews Pheromon-Manipulation und Giftexplosionen ergänzen ihre Wandkletter-Fähigkeiten. Diese San Diego Comic-Con 2013-Exklusivfigur markiert einen seltenen LEGO-Auftritt für die Figur. Sehr wertvolle Convention-Exklusivfigur, unverzichtbar für Marvel-Spider-Familien-Sammler.",
    description_fr: "Spider-Woman apporte des pouvoirs uniques et de la complexité au spider-verse Marvel. La manipulation de phéromones et les explosions de venin de Jessica Drew complètent ses capacités d'escalade murale. Cette exclusive San Diego Comic-Con 2013 marque une apparition LEGO rare pour le personnage. Exclusive de convention très précieuse essentielle pour les collectionneurs de famille-araignée Marvel.",
    description_es: "Spider-Woman aporta poderes únicos y complejidad al spider-verso de Marvel. La manipulación de feromonas y ráfagas de veneno de Jessica Drew complementan sus habilidades de escalar paredes. Esta exclusiva de San Diego Comic-Con 2013 marca una aparición LEGO rara para el personaje. Exclusiva de convención muy valiosa esencial para coleccionistas de familia-araña de Marvel."
  },
  {
    minifigure_no: 'sh0141',
    description_en: "Electro's black and dark bluish gray outfit with bright light blue head represents an alternate costume design. This variant showcases Maxwell Dillon's electrical powers with translucent elements. The color scheme emphasizes his shocking abilities and dangerous nature. A striking variant essential for comprehensive Electro collections.",
    description_de: "Electros schwarzes und dunkles blaugraues Outfit mit hellleuchtend blauem Kopf repräsentiert ein alternatives Kostüm-Design. Diese Variante zeigt Maxwell Dillons elektrische Kräfte mit durchscheinenden Elementen. Das Farbschema betont seine schockierenden Fähigkeiten und gefährliche Natur. Eine auffällige Variante, unverzichtbar für umfassende Electro-Sammlungen.",
    description_fr: "La tenue noire et gris bleuté foncé d'Electro avec tête bleu clair vif représente un design de costume alternatif. Cette variante met en valeur les pouvoirs électriques de Maxwell Dillon avec des éléments translucides. La palette de couleurs souligne ses capacités choquantes et sa nature dangereuse. Une variante frappante essentielle pour les collections Electro complètes.",
    description_es: "El traje negro y gris azulado oscuro de Electro con cabeza azul claro brillante representa un diseño de traje alternativo. Esta variante muestra los poderes eléctricos de Maxwell Dillon con elementos translúcidos. El esquema de color enfatiza sus habilidades impactantes y naturaleza peligrosa. Una variante llamativa esencial para colecciones completas de Electro."
  },
  {
    minifigure_no: 'sh0142',
    description_en: "Plastic Man stretches impossibly with humor and heroism. Eel O'Brian's ability to reshape his body into any form makes him one of DC's most versatile heroes. This minifigure captures his distinctive red, yellow, and black color scheme. A fun and valuable addition to Justice League collections.",
    description_de: "Plastic Man dehnt sich unmöglich mit Humor und Heldentum. Eel O'Brians Fähigkeit, seinen Körper in jede Form umzugestalten, macht ihn zu einem der vielseitigsten Helden von DC. Diese Minifigur erfasst sein charakteristisches rot-gelb-schwarzes Farbschema. Eine lustige und wertvolle Ergänzung für Justice League-Sammlungen.",
    description_fr: "Plastic Man s'étire impossiblement avec humour et héroïsme. La capacité d'Eel O'Brian à remodeler son corps en n'importe quelle forme fait de lui l'un des héros les plus polyvalents de DC. Cette figurine capture sa palette de couleurs distinctive rouge, jaune et noire. Un ajout amusant et précieux aux collections Justice League.",
    description_es: "Plastic Man se estira imposiblemente con humor y heroísmo. La habilidad de Eel O'Brian para remodelar su cuerpo en cualquier forma lo convierte en uno de los héroes más versátiles de DC. Esta minifigura captura su distintivo esquema de color rojo, amarillo y negro. Una adición divertida y valiosa a colecciones de la Liga de la Justicia."
  },
  {
    minifigure_no: 'sh0143',
    description_en: "Superboy combines Kryptonian power with teenage rebellion. Conner Kent's cloned genetics give him incredible strength while his youth brings impetuousness. This minifigure showcases his distinctive costume design. An important Young Justice team member highly valued by DC collectors.",
    description_de: "Superboy kombiniert kryptonische Kraft mit jugendlicher Rebellion. Conner Kents geklonte Genetik verleiht ihm unglaubliche Stärke, während seine Jugend Ungestüm bringt. Diese Minifigur zeigt sein charakteristisches Kostüm-Design. Ein wichtiges Young Justice-Teammitglied, hoch geschätzt von DC-Sammlern.",
    description_fr: "Superboy combine pouvoir kryptonien avec rébellion adolescente. La génétique clonée de Conner Kent lui donne une force incroyable tandis que sa jeunesse apporte de l'impétuosité. Cette figurine présente son design de costume distinctif. Un membre important de l'équipe Young Justice très apprécié par les collectionneurs DC.",
    description_es: "Superboy combina poder kryptoniano con rebeldía adolescente. La genética clonada de Conner Kent le otorga fuerza increíble mientras su juventud aporta impetuosidad. Esta minifigura muestra su distintivo diseño de traje. Un importante miembro del equipo Young Justice muy valorado por coleccionistas de DC."
  },
  {
    minifigure_no: 'sh0144',
    description_en: "Sinestro wields yellow fear energy as Green Lantern's greatest enemy. Once the greatest Green Lantern, Thaal Sinestro's fall to villainy created the Sinestro Corps. This minifigure captures his distinctive yellow and purple color scheme. Essential antagonist for Green Lantern storylines and displays.",
    description_de: "Sinestro schwingt gelbe Angst-Energie als Green Lanterns größter Feind. Einst der größte Green Lantern, Thaal Sinestros Fall zur Schurkentat schuf das Sinestro Corps. Diese Minifigur erfasst sein charakteristisches gelb-violettes Farbschema. Unverzichtbarer Antagonist für Green Lantern-Handlungen und Displays.",
    description_fr: "Sinestro manie l'énergie de peur jaune comme plus grand ennemi de Green Lantern. Autrefois le plus grand Green Lantern, la chute de Thaal Sinestro dans la vilenie a créé le Sinestro Corps. Cette figurine capture sa palette de couleurs distinctive jaune et violette. Antagoniste essentiel pour les intrigues et affichages Green Lantern.",
    description_es: "Sinestro maneja energía de miedo amarilla como el mayor enemigo de Linterna Verde. Una vez la mayor Linterna Verde, la caída de Thaal Sinestro a la villanía creó el Sinestro Corps. Esta minifigura captura su distintivo esquema de color amarillo y morado. Antagonista esencial para historias y exhibiciones de Linterna Verde."
  },
  {
    minifigure_no: 'sh0145',
    description_en: "Green Lantern with white hands represents Hal Jordan wielding his power ring. The white hands variant distinguishes this version from other Green Lantern minifigures. His willpower-based constructs make him one of DC's most powerful heroes. A key piece for Justice League and Green Lantern Corps displays.",
    description_de: "Green Lantern mit weißen Händen repräsentiert Hal Jordan, der seinen Machtring schwingt. Die weiße-Hände-Variante unterscheidet diese Version von anderen Green Lantern-Minifiguren. Seine willenskraftbasierten Konstrukte machen ihn zu einem der mächtigsten Helden von DC. Ein Schlüssel-Teil für Justice League- und Green Lantern Corps-Displays.",
    description_fr: "Green Lantern avec mains blanches représente Hal Jordan maniant son anneau de pouvoir. La variante de mains blanches distingue cette version des autres figurines Green Lantern. Ses constructions basées sur la volonté font de lui l'un des héros les plus puissants de DC. Une pièce clé pour les affichages Justice League et Green Lantern Corps.",
    description_es: "Linterna Verde con manos blancas representa a Hal Jordan manejando su anillo de poder. La variante de manos blancas distingue esta versión de otras minifiguras de Linterna Verde. Sus constructos basados en fuerza de voluntad lo convierten en uno de los héroes más poderosos de DC. Una pieza clave para exhibiciones de Liga de la Justicia y Green Lantern Corps."
  },
  {
    minifigure_no: 'sh0146',
    description_en: "Space Batman extends the Dark Knight's crime-fighting to cosmic threats. This variant features specialized equipment for extraterrestrial missions. The space suit design maintains Batman's iconic silhouette while adding sci-fi elements. A unique crossover piece combining Batman with space adventure themes.",
    description_de: "Space Batman erweitert die Verbrechensbekämpfung des Dark Knight auf kosmische Bedrohungen. Diese Variante zeigt spezialisierte Ausrüstung für außerirdische Missionen. Das Raumanzug-Design behält Batmans ikonische Silhouette bei, während es Sci-Fi-Elemente hinzufügt. Ein einzigartiges Crossover-Teil, das Batman mit Weltraum-Abenteuerthemen kombiniert.",
    description_fr: "Space Batman étend la lutte contre le crime du Chevalier Noir aux menaces cosmiques. Cette variante présente un équipement spécialisé pour les missions extraterrestres. Le design de combinaison spatiale maintient la silhouette emblématique de Batman tout en ajoutant des éléments sci-fi. Une pièce crossover unique combinant Batman avec des thèmes d'aventure spatiale.",
    description_es: "Batman Espacial extiende la lucha contra el crimen del Caballero Oscuro a amenazas cósmicas. Esta variante presenta equipo especializado para misiones extraterrestres. El diseño de traje espacial mantiene la silueta icónica de Batman mientras añade elementos de ciencia ficción. Una pieza de cruce única que combina Batman con temas de aventura espacial."
  },
  {
    minifigure_no: 'sh0147',
    description_en: "Gorilla Grodd combines super-intelligence with savage strength. The psychic gorilla from Gorilla City ranks among the Flash's most dangerous enemies. This large-format figure captures his imposing simian appearance. A powerful villain piece essential for Flash collections and Justice League adversary displays.",
    description_de: "Gorilla Grodd kombiniert Superintelligenz mit wilder Stärke. Der psychische Gorilla aus Gorilla City zählt zu den gefährlichsten Feinden des Flash. Diese großformatige Figur erfasst sein imposantes Affen-Aussehen. Ein mächtiges Schurken-Teil, unverzichtbar für Flash-Sammlungen und Justice League-Gegner-Displays.",
    description_fr: "Gorilla Grodd combine super-intelligence avec force sauvage. Le gorille psychique de Gorilla City compte parmi les ennemis les plus dangereux du Flash. Cette figurine grand format capture son apparence simienne imposante. Une pièce de méchant puissante essentielle pour les collections Flash et affichages d'adversaires Justice League.",
    description_es: "Gorilla Grodd combina superinteligencia con fuerza salvaje. El gorila psíquico de Ciudad Gorila se encuentra entre los enemigos más peligrosos de Flash. Esta figura de gran formato captura su imponente apariencia simiesca. Una pieza de villano poderosa esencial para colecciones de Flash y exhibiciones de adversarios de la Liga de la Justicia."
  },
  {
    minifigure_no: 'sh0148',
    description_en: "Captain Cold freezes adversaries with his cold gun and icy demeanor. Leonard Snart leads the Flash's Rogues Gallery with tactical genius. This minifigure showcases his distinctive blue and white cold-themed costume. A cornerstone villain for Flash collections, representing professional criminal excellence.",
    description_de: "Captain Cold friert Gegner mit seiner Kältepistole und eisigem Auftreten ein. Leonard Snart führt die Rogues Gallery des Flash mit taktischem Genie. Diese Minifigur zeigt sein charakteristisches blau-weißes kältethematisches Kostüm. Ein Eckpfeiler-Schurke für Flash-Sammlungen, der professionelle kriminelle Exzellenz repräsentiert.",
    description_fr: "Captain Cold gèle les adversaires avec son pistolet froid et son comportement glacial. Leonard Snart dirige la Rogues Gallery du Flash avec un génie tactique. Cette figurine présente son costume distinctif bleu et blanc à thème froid. Un méchant pierre angulaire pour les collections Flash, représentant l'excellence criminelle professionnelle.",
    description_es: "Capitán Frío congela adversarios con su pistola de frío y comportamiento helado. Leonard Snart lidera la Galería de Pícaros de Flash con genio táctico. Esta minifigura muestra su distintivo traje temático de frío azul y blanco. Un villano fundamental para colecciones de Flash, representando excelencia criminal profesional."
  },
  {
    minifigure_no: 'sh0149',
    description_en: "The Truck Driver in overalls represents hardworking civilians in the DC universe. These everyday characters add realism and context to superhero action scenes. Perfect for creating authentic urban environments and rescue scenarios. A valuable supporting character for building dynamic storytelling displays.",
    description_de: "Der Lastwagenfahrer in Overall repräsentiert hart arbeitende Zivilisten im DC-Universum. Diese alltäglichen Charaktere fügen Realismus und Kontext zu Superhelden-Action-Szenen hinzu. Perfekt für die Erstellung authentischer urbaner Umgebungen und Rettungsszenarien. Ein wertvoller Nebencharakter für den Aufbau dynamischer Storytelling-Displays.",
    description_fr: "Le Conducteur de Camion en salopette représente des civils travailleurs dans l'univers DC. Ces personnages quotidiens ajoutent réalisme et contexte aux scènes d'action de super-héros. Parfait pour créer des environnements urbains authentiques et scénarios de sauvetage. Un personnage secondaire précieux pour construire des affichages de narration dynamiques.",
    description_es: "El Conductor de Camión en overol representa civiles trabajadores en el universo DC. Estos personajes cotidianos añaden realismo y contexto a escenas de acción de superhéroes. Perfecto para crear entornos urbanos auténticos y escenarios de rescate. Un personaje secundario valioso para construir exhibiciones de narración dinámica."
  },
  {
    minifigure_no: 'sh0150',
    description_en: "Wonder Woman's silver tiara with dark blue legs variant showcases the Amazon Princess in classic form. Diana of Themyscira combines divine power with warrior skill. This color scheme represents one of her iconic costume variations. Essential cornerstone piece for Justice League and Wonder Woman collections.",
    description_de: "Wonder Womans silbernes Diadem mit dunkelblauen Beinen-Variante zeigt die Amazonenprinzessin in klassischer Form. Diana von Themyscira kombiniert göttliche Kraft mit Kriegerfähigkeit. Dieses Farbschema repräsentiert eine ihrer ikonischen Kostüm-Variationen. Unverzichtbares Eckpfeiler-Teil für Justice League- und Wonder Woman-Sammlungen.",
    description_fr: "Le diadème argenté de Wonder Woman avec variante de jambes bleu foncé présente la Princesse Amazone sous forme classique. Diana de Themyscira combine pouvoir divin avec compétence de guerrière. Cette palette de couleurs représente l'une de ses variations de costume emblématiques. Pièce pierre angulaire essentielle pour les collections Justice League et Wonder Woman.",
    description_es: "La tiara plateada de Wonder Woman con variante de piernas azul oscuro muestra a la Princesa Amazona en forma clásica. Diana de Temiscira combina poder divino con habilidad guerrera. Este esquema de color representa una de sus variaciones de traje icónicas. Pieza fundamental esencial para colecciones de Liga de la Justicia y Wonder Woman."
  }
];

async function main() {
  console.log(`🦸 Starting Super Heroes batch sh0126-sh0150 (${descriptions.length} minifigs)...`);
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
  console.log(`✅ Batch complete! ${descriptions.length} minifigs saved. Total: 150 done.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
