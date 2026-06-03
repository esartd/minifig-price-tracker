import { PrismaClient as PrismaClientHostinger } from '@prisma/client';

const prisma = new PrismaClientHostinger({
  datasources: {
    db: {
      url: 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
    }
  }
});

const descriptions = [
  {
    minifigure_no: 'sh1051',
    description_en: "Ben Grimm represents The Thing before his rocky transformation. This pre-power version shows the astronaut before cosmic radiation turned him into the Fantastic Four's powerhouse.",
    description_de: "Ben Grimm repräsentiert The Thing vor seiner felsigen Transformation. Diese Vor-Kraft-Version zeigt den Astronauten, bevor kosmische Strahlung ihn in das Kraftpaket der Fantastischen Vier verwandelte.",
    description_fr: "Ben Grimm représente La Chose avant sa transformation rocheuse. Cette version pré-pouvoirs montre l'astronaute avant que les radiations cosmiques ne le transforment en force des Quatre Fantastiques.",
    description_es: "Ben Grimm representa a La Cosa antes de su transformación rocosa. Esta versión pre-poder muestra al astronauta antes de que la radiación cósmica lo convirtiera en la potencia de Los Cuatro Fantásticos."
  },
  {
    minifigure_no: 'sh1052',
    description_en: "Johnny Storm represents the Human Torch before igniting. This founding Fantastic Four member can engulf himself in flames and fly, bringing hot-headed youthful energy to the team.",
    description_de: "Johnny Storm repräsentiert die Human Torch vor dem Entzünden. Dieses Gründungsmitglied der Fantastischen Vier kann sich in Flammen hüllen und fliegen und bringt hitzköpfige jugendliche Energie zum Team.",
    description_fr: "Johnny Storm représente la Torche Humaine avant de s'enflammer. Ce membre fondateur des Quatre Fantastiques peut s'envelopper de flammes et voler, apportant une énergie juvénile impétueuse à l'équipe.",
    description_es: "Johnny Storm representa a la Antorcha Humana antes de encenderse. Este miembro fundador de Los Cuatro Fantásticos puede envolverse en llamas y volar, aportando energía juvenil impetuosa al equipo."
  },
  {
    minifigure_no: 'sh1053',
    description_en: "Spider-Man in Cyborg suit showcases Peter Parker's technological enhancement. This mechanized version combines web-slinging abilities with advanced robotic components for enhanced combat capabilities.",
    description_de: "Spider-Man im Cyborg-Anzug zeigt Peter Parkers technologische Verbesserung. Diese mechanisierte Version kombiniert Netzschleuderfähigkeiten mit fortschrittlichen Roboterkomponenten für verbesserte Kampffähigkeiten.",
    description_fr: "Spider-Man en costume Cyborg présente l'amélioration technologique de Peter Parker. Cette version mécanisée combine des capacités de lancement de toiles avec des composants robotiques avancés pour des capacités de combat améliorées.",
    description_es: "Spider-Man en traje Cyborg muestra la mejora tecnológica de Peter Parker. Esta versión mecanizada combina habilidades de lanzamiento de redes con componentes robóticos avanzados para capacidades de combate mejoradas."
  },
  {
    minifigure_no: 'sh1054',
    description_en: "War Machine in pearl dark gray and silver armor with laser shooters provides heavy firepower. James Rhodes' military-grade suit brings overwhelming ordnance to support the Avengers.",
    description_de: "War Machine in perlgrauer und silberner Rüstung mit Laser-Shootern bietet schwere Feuerkraft. James Rhodes' militärischer Anzug bringt überwältigende Munition zur Unterstützung der Avengers.",
    description_fr: "War Machine en armure gris foncé perlé et argentée avec des lanceurs laser fournit une puissance de feu lourde. La combinaison de qualité militaire de James Rhodes apporte des munitions écrasantes pour soutenir les Avengers.",
    description_es: "War Machine en armadura gris oscuro perlado y plateada con lanzadores láser proporciona potencia de fuego pesada. El traje de grado militar de James Rhodes trae munición abrumadora para apoyar a los Vengadores."
  },
  {
    minifigure_no: 'sh1055',
    description_en: "Superman in blue suit with rubber cape represents the Man of Steel's classic appearance. Clark Kent brings superhuman strength, flight, and moral integrity as Earth's protector.",
    description_de: "Superman im blauen Anzug mit Gummi-Umhang repräsentiert das klassische Aussehen des Mannes aus Stahl. Clark Kent bringt übermenschliche Stärke, Flug und moralische Integrität als Beschützer der Erde.",
    description_fr: "Superman en costume bleu avec cape en caoutchouc représente l'apparence classique de l'Homme d'Acier. Clark Kent apporte une force surhumaine, un vol et une intégrité morale en tant que protecteur de la Terre.",
    description_es: "Superman en traje azul con capa de goma representa la apariencia clásica del Hombre de Acero. Clark Kent aporta fuerza sobrehumana, vuelo e integridad moral como protector de la Tierra."
  },
  {
    minifigure_no: 'sh1056',
    description_en: "Captain America with dark blue suit, reddish brown belt and harness, and jet pack adds aerial mobility. Steve Rogers combines the super-soldier serum with flight technology for enhanced tactical options.",
    description_de: "Captain America mit dunkelblauen Anzug, rotbraunem Gürtel und Geschirr und Jetpack fügt Luftmobilität hinzu. Steve Rogers kombiniert das Super-Soldaten-Serum mit Flugtechnologie für verbesserte taktische Optionen.",
    description_fr: "Captain America avec costume bleu foncé, ceinture et harnais brun rougeâtre et jet pack ajoute de la mobilité aérienne. Steve Rogers combine le sérum de super-soldat avec la technologie de vol pour des options tactiques améliorées.",
    description_es: "Capitán América con traje azul oscuro, cinturón y arnés marrón rojizo y mochila propulsora agrega movilidad aérea. Steve Rogers combina el suero de super-soldado con tecnología de vuelo para opciones tácticas mejoradas."
  },
  {
    minifigure_no: 'sh1057',
    description_en: "Spider-Man with dark blue arms and legs, red boots, silver webbing, and light nougat costume tears shows battle damage. This worn version captures Peter Parker after intense combat.",
    description_de: "Spider-Man mit dunkelblauen Armen und Beinen, roten Stiefeln, silbernem Netz und hellbeigen Kostümrissen zeigt Kampfschaden. Diese abgenutzte Version fängt Peter Parker nach intensivem Kampf ein.",
    description_fr: "Spider-Man avec des bras et des jambes bleu foncé, des bottes rouges, une toile argentée et des déchirures de costume nougat clair montre des dommages de bataille. Cette version usée capture Peter Parker après un combat intense.",
    description_es: "Spider-Man con brazos y piernas azul oscuro, botas rojas, telaraña plateada y desgarros de traje color nougat claro muestra daño de batalla. Esta versión desgastada captura a Peter Parker después de combate intenso."
  },
  {
    minifigure_no: 'sh1058',
    description_en: "Aunt May in light bluish gray cardigan sweater with bright light blue legs represents Peter Parker's guardian. May Parker provides moral guidance and support as Peter's beloved aunt.",
    description_de: "Tante May im hellblaugrauen Cardigan-Pullover mit hellblauen Beinen repräsentiert Peter Parkers Vormund. May Parker bietet moralische Führung und Unterstützung als Peters geliebte Tante.",
    description_fr: "Tante May en cardigan gris bleuté clair avec des jambes bleu clair vif représente la tutrice de Peter Parker. May Parker fournit des conseils moraux et un soutien en tant que tante bien-aimée de Peter.",
    description_es: "Tía May en suéter de cárdigan gris azulado claro con piernas azul claro brillante representa a la tutora de Peter Parker. May Parker proporciona orientación moral y apoyo como la amada tía de Peter."
  },
  {
    minifigure_no: 'sh1059',
    description_en: "J. Jonah Jameson in dark blue suit with reddish brown hair represents the Daily Bugle publisher. This bombastic editor demands photos of Spider-Man while crusading against the web-slinger in print.",
    description_de: "J. Jonah Jameson im dunkelblauen Anzug mit rotbraunen Haaren repräsentiert den Daily Bugle-Verleger. Dieser bombastische Redakteur fordert Fotos von Spider-Man, während er gegen den Netzschleuderer in der Presse Kreuzzug führt.",
    description_fr: "J. Jonah Jameson en costume bleu foncé avec des cheveux brun rougeâtre représente l'éditeur du Daily Bugle. Cet éditeur grandiloquent exige des photos de Spider-Man tout en faisant une croisade contre le lanceur de toiles dans la presse.",
    description_es: "J. Jonah Jameson en traje azul oscuro con cabello marrón rojizo representa al editor del Daily Bugle. Este editor rimbombante exige fotos de Spider-Man mientras hace una cruzada contra el lanzador de redes en prensa."
  },
  {
    minifigure_no: 'sh1060',
    description_en: "Dr. Octopus (Otto Octavius) in reddish brown outfit with mechanical arms represents the classic Spider-Man villain. Doc Ock's four robotic tentacles make him one of Peter's most formidable scientific adversaries.",
    description_de: "Dr. Octopus (Otto Octavius) im rotbraunen Outfit mit mechanischen Armen repräsentiert den klassischen Spider-Man-Bösewicht. Doc Ocks vier Roboter-Tentakel machen ihn zu einem von Peters beeindruckendsten wissenschaftlichen Gegnern.",
    description_fr: "Dr. Octopus (Otto Octavius) en tenue brun rougeâtre avec des bras mécaniques représente le méchant classique de Spider-Man. Les quatre tentacules robotiques de Doc Ock font de lui l'un des adversaires scientifiques les plus formidables de Peter.",
    description_es: "Dr. Octopus (Otto Octavius) en traje marrón rojizo con brazos mecánicos representa al villano clásico de Spider-Man. Los cuatro tentáculos robóticos de Doc Ock lo convierten en uno de los adversarios científicos más formidables de Peter."
  },
  {
    minifigure_no: 'sh1061',
    description_en: "Hobgoblin with flexible rubber cape represents the demonic-looking villain from Spider-Man's rogues gallery. This glider-riding menace brings chaos with pumpkin bombs and supernatural aesthetics.",
    description_de: "Hobgoblin mit flexiblem Gummi-Umhang repräsentiert den dämonisch aussehenden Bösewicht aus Spider-Mans Schurken-Galerie. Diese Gleiter-reitende Bedrohung bringt Chaos mit Kürbisbomben und übernatürlicher Ästhetik.",
    description_fr: "Hobgoblin avec cape en caoutchouc flexible représente le méchant à l'apparence démoniaque de la galerie des voyous de Spider-Man. Cette menace chevauchant un planeur apporte le chaos avec des bombes citrouilles et une esthétique surnaturelle.",
    description_es: "Hobgoblin con capa de goma flexible representa al villano de aspecto demoníaco de la galería de villanos de Spider-Man. Esta amenaza montada en planeador trae caos con bombas de calabaza y estética sobrenatural."
  },
  {
    minifigure_no: 'sh1062',
    description_en: "Mary Jane in medium nougat jacket with red hair represents Peter Parker's love interest. MJ Watson brings her modeling career and strong personality to Peter's complicated life.",
    description_de: "Mary Jane in mittelbeiger Jacke mit roten Haaren repräsentiert Peter Parkers Liebesinteresse. MJ Watson bringt ihre Model-Karriere und starke Persönlichkeit in Peters kompliziertes Leben.",
    description_fr: "Mary Jane en veste nougat moyen avec des cheveux roux représente l'intérêt amoureux de Peter Parker. MJ Watson apporte sa carrière de mannequin et sa forte personnalité à la vie compliquée de Peter.",
    description_es: "Mary Jane en chaqueta color nougat medio con cabello rojo representa el interés amoroso de Peter Parker. MJ Watson aporta su carrera de modelo y fuerte personalidad a la complicada vida de Peter."
  },
  {
    minifigure_no: 'sh1063',
    description_en: "Eddie Brock with Venom head shows the symbiote's human host. This dual identity captures the transformation between journalist and alien-enhanced anti-hero.",
    description_de: "Eddie Brock mit Venom-Kopf zeigt den menschlichen Wirt des Symbioten. Diese duale Identität fängt die Transformation zwischen Journalist und außerirdisch verstärktem Anti-Helden ein.",
    description_fr: "Eddie Brock avec une tête de Venom montre l'hôte humain du symbiote. Cette double identité capture la transformation entre journaliste et anti-héros amélioré par l'alien.",
    description_es: "Eddie Brock con cabeza de Venom muestra al anfitrión humano del simbionte. Esta identidad dual captura la transformación entre periodista y anti-héroe mejorado por alienígenas."
  },
  {
    minifigure_no: 'sh1064',
    description_en: "Spider-Woman in black outfit with black legs showcases Jessica Drew's stealth costume variant. This darker design emphasizes her espionage background and covert operations capabilities.",
    description_de: "Spider-Woman im schwarzen Outfit mit schwarzen Beinen zeigt Jessica Drews Stealth-Kostüm-Variante. Dieses dunklere Design betont ihren Spionage-Hintergrund und verdeckte Operationsfähigkeiten.",
    description_fr: "Spider-Woman en tenue noire avec des jambes noires présente la variante de costume furtif de Jessica Drew. Ce design plus sombre met l'accent sur son passé d'espionnage et ses capacités d'opérations secrètes.",
    description_es: "Spider-Woman en traje negro con piernas negras muestra la variante de traje sigiloso de Jessica Drew. Este diseño más oscuro enfatiza su trasfondo de espionaje y capacidades de operaciones encubiertas."
  },
  {
    minifigure_no: 'sh1065',
    description_en: "Norman Osborn in black suit represents the industrialist before becoming Green Goblin. This civilian identity shows Oscorp's CEO before his transformation into Spider-Man's greatest enemy.",
    description_de: "Norman Osborn im schwarzen Anzug repräsentiert den Industriellen vor seiner Verwandlung in Green Goblin. Diese zivile Identität zeigt Oscorps CEO vor seiner Transformation in Spider-Mans größten Feind.",
    description_fr: "Norman Osborn en costume noir représente l'industriel avant de devenir le Bouffon Vert. Cette identité civile montre le PDG d'Oscorp avant sa transformation en plus grand ennemi de Spider-Man.",
    description_es: "Norman Osborn en traje negro representa al industrial antes de convertirse en Duende Verde. Esta identidad civil muestra al CEO de Oscorp antes de su transformación en el mayor enemigo de Spider-Man."
  },
  {
    minifigure_no: 'sh1066',
    description_en: "Green Goblin in green outfit with dark purple hood represents Norman Osborn's villainous alter ego. This glider-riding menace brings goblin-themed weapons and insanity to terrorize Spider-Man.",
    description_de: "Green Goblin im grünen Outfit mit dunkelvioletter Kapuze repräsentiert Norman Osborns bösartiges Alter Ego. Diese Gleiter-reitende Bedrohung bringt Goblin-thematische Waffen und Wahnsinn, um Spider-Man zu terrorisieren.",
    description_fr: "Le Bouffon Vert en tenue verte avec une capuche violet foncé représente l'alter ego méchant de Norman Osborn. Cette menace chevauchant un planeur apporte des armes à thème gobelin et de la folie pour terroriser Spider-Man.",
    description_es: "Duende Verde en traje verde con capucha morada oscura representa el alter ego villano de Norman Osborn. Esta amenaza montada en planeador trae armas temáticas de duende y locura para aterrorizar a Spider-Man."
  },
  {
    minifigure_no: 'sh1067',
    description_en: "Iron Patriot MK2 represents an upgraded version of the government armor. This second iteration improves on the original red, white, and blue design with enhanced combat systems.",
    description_de: "Iron Patriot MK2 repräsentiert eine aufgerüstete Version der Regierungsrüstung. Diese zweite Iteration verbessert das ursprüngliche rot-weiß-blaue Design mit verbesserten Kampfsystemen.",
    description_fr: "Iron Patriot MK2 représente une version améliorée de l'armure gouvernementale. Cette deuxième itération améliore le design original rouge, blanc et bleu avec des systèmes de combat améliorés.",
    description_es: "Iron Patriot MK2 representa una versión mejorada de la armadura gubernamental. Esta segunda iteración mejora el diseño original rojo, blanco y azul con sistemas de combate mejorados."
  },
  {
    minifigure_no: 'sh1068',
    description_en: "Rocket Raccoon in dark blue outfit with dark red scarf and reddish brown head showcases the weapons expert. This genetically-engineered Guardian brings tactical genius and heavy artillery to the team.",
    description_de: "Rocket Raccoon im dunkelblauen Outfit mit dunkelrotem Schal und rotbraunem Kopf zeigt den Waffenexperten. Dieser gentechnisch veränderte Guardian bringt taktisches Genie und schwere Artillerie zum Team.",
    description_fr: "Rocket Raccoon en tenue bleu foncé avec une écharpe rouge foncé et une tête brun rougeâtre présente l'expert en armes. Ce Gardien génétiquement modifié apporte un génie tactique et de l'artillerie lourde à l'équipe.",
    description_es: "Rocket Raccoon en traje azul oscuro con bufanda rojo oscuro y cabeza marrón rojiza muestra al experto en armas. Este Guardián genéticamente modificado aporta genio táctico y artillería pesada al equipo."
  },
  {
    minifigure_no: 'sh1069',
    description_en: "Thor with flexible rubber cape, black legs, and dark tan tousled hair represents the God of Thunder's battle-ready appearance. This Asgardian warrior brings Mjolnir and lightning to protect the Nine Realms.",
    description_de: "Thor mit flexiblem Gummi-Umhang, schwarzen Beinen und dunkelbraunem zerzaustem Haar repräsentiert das kampfbereite Aussehen des Donnergottes. Dieser asgardische Krieger bringt Mjolnir und Blitz, um die Neun Reiche zu schützen.",
    description_fr: "Thor avec cape en caoutchouc flexible, jambes noires et cheveux ébouriffés brun foncé représente l'apparence prête au combat du Dieu du Tonnerre. Ce guerrier asgardien apporte Mjolnir et la foudre pour protéger les Neuf Royaumes.",
    description_es: "Thor con capa de goma flexible, piernas negras y cabello despeinado castaño oscuro representa la apariencia lista para batalla del Dios del Trueno. Este guerrero asgardiano trae a Mjolnir y el rayo para proteger los Nueve Reinos."
  },
  {
    minifigure_no: 'sh1070',
    description_en: "Kraven The Hunter in reddish brown plain legs represents Sergei Kravinoff's big-game hunting obsession. This Spider-Man villain brings tracking skills and primal combat to his hunt for the ultimate prey.",
    description_de: "Kraven The Hunter in rotbraunen einfachen Beinen repräsentiert Sergei Kravinoffs Großwildjagd-Obsession. Dieser Spider-Man-Bösewicht bringt Fährtenlese-Fähigkeiten und primitiven Kampf zu seiner Jagd auf die ultimative Beute.",
    description_fr: "Kraven Le Chasseur en jambes simples brun rougeâtre représente l'obsession de Sergei Kravinoff pour la chasse au gros gibier. Ce méchant de Spider-Man apporte des compétences de pistage et un combat primitif à sa chasse pour la proie ultime.",
    description_es: "Kraven El Cazador en piernas simples marrón rojizo representa la obsesión de Sergei Kravinoff por la caza mayor. Este villano de Spider-Man aporta habilidades de rastreo y combate primitivo a su caza por la presa definitiva."
  },
  {
    minifigure_no: 'sh1071',
    description_en: "Batman in pearl dark gray suit represents a unique color scheme for the Dark Knight. This metallic-toned version offers a fresh take on Bruce Wayne's crime-fighting uniform.",
    description_de: "Batman im perlgrauen Anzug repräsentiert ein einzigartiges Farbschema für den Dunklen Ritter. Diese metallisch getönte Version bietet eine frische Interpretation von Bruce Waynes Verbrechensbekämpfungs-Uniform.",
    description_fr: "Batman en costume gris foncé perlé représente un schéma de couleurs unique pour le Dark Knight. Cette version aux tons métalliques offre une nouvelle interprétation de l'uniforme de lutte contre le crime de Bruce Wayne.",
    description_es: "Batman en traje gris oscuro perlado representa un esquema de color único para el Caballero Oscuro. Esta versión de tono metálico ofrece una nueva interpretación del uniforme contra el crimen de Bruce Wayne."
  },
  {
    minifigure_no: 'sh1072',
    description_en: "Quicksilver in sand blue shirt represents Pietro Maximoff's super-speed powers. This Avenger brings lightning-fast reflexes and cocky attitude to the team alongside his sister Wanda.",
    description_de: "Quicksilver im sandblauen Hemd repräsentiert Pietro Maximoffs Supergeschwindigkeits-Kräfte. Dieser Avenger bringt blitzschnelle Reflexe und überhebliche Einstellung zum Team neben seiner Schwester Wanda.",
    description_fr: "Quicksilver en chemise bleu sable représente les pouvoirs de super-vitesse de Pietro Maximoff. Cet Avenger apporte des réflexes ultra-rapides et une attitude arrogante à l'équipe aux côtés de sa sœur Wanda.",
    description_es: "Quicksilver en camisa azul arena representa los poderes de super-velocidad de Pietro Maximoff. Este Vengador aporta reflejos ultrarrápidos y actitud arrogante al equipo junto a su hermana Wanda."
  },
  {
    minifigure_no: 'sh1073',
    description_en: "Ultimate Ultron represents the final evolved form of Tony Stark's rogue AI. This perfected robot body showcases Ultron's vision of mechanical supremacy and extinction-level threat to humanity.",
    description_de: "Ultimate Ultron repräsentiert die finale entwickelte Form von Tony Starks abtrünniger KI. Dieser perfektionierte Roboterkörper zeigt Ultrons Vision mechanischer Vorherrschaft und Ausrottungs-Level-Bedrohung für die Menschheit.",
    description_fr: "Ultimate Ultron représente la forme évoluée finale de l'IA voyou de Tony Stark. Ce corps robotique perfectionné présente la vision d'Ultron de suprématie mécanique et de menace de niveau d'extinction pour l'humanité.",
    description_es: "Ultimate Ultron representa la forma evolucionada final de la IA rebelde de Tony Stark. Este cuerpo robótico perfeccionado muestra la visión de Ultron de supremacía mecánica y amenaza de nivel de extinción para la humanidad."
  },
  {
    minifigure_no: 'sh1074',
    description_en: "Iron Spider-Man with mechanical arms showcases Peter Parker's Stark-enhanced suit. The waldoe appendages provide additional combat versatility for the web-slinger's arsenal.",
    description_de: "Iron Spider-Man mit mechanischen Armen zeigt Peter Parkers von Stark verbesserten Anzug. Die Waldoe-Anhänge bieten zusätzliche Kampf-Vielseitigkeit für das Arsenal des Netzschleuderers.",
    description_fr: "Iron Spider-Man avec des bras mécaniques présente la combinaison améliorée par Stark de Peter Parker. Les appendices waldoe offrent une polyvalence de combat supplémentaire pour l'arsenal du lanceur de toiles.",
    description_es: "Iron Spider-Man con brazos mecánicos muestra el traje mejorado por Stark de Peter Parker. Los apéndices waldoe proporcionan versatilidad de combate adicional para el arsenal del lanzador de redes."
  },
  {
    minifigure_no: 'sh1075',
    description_en: "The Joker in prison jumpsuit with side pockets shows the Clown Prince of Crime in custody. Even incarcerated, Batman's nemesis schemes his next chaotic escape and theatrical crime spree.",
    description_de: "Der Joker im Gefängnisoverall mit Seitentaschen zeigt den Clown-Prinzen des Verbrechens in Haft. Selbst inhaftiert plant Batmans Nemesis seine nächste chaotische Flucht und theatralische Verbrechenswelle.",
    description_fr: "Le Joker en combinaison de prison avec des poches latérales montre le Prince Clown du Crime en garde à vue. Même incarcéré, le nemesis de Batman planifie sa prochaine évasion chaotique et sa prochaine vague de crimes théâtraux.",
    description_es: "El Joker en mono de prisión con bolsillos laterales muestra al Príncipe Payaso del Crimen en custodia. Incluso encarcelado, la némesis de Batman planea su próximo escape caótico y ola de crímenes teatrales."
  }
];

async function updateDescriptions() {
  console.log(`Starting batch update: sh1051-sh1075 (${descriptions.length} minifigures)`);

  for (const desc of descriptions) {
    try {
      await prisma.minifigCatalog.update({
        where: { minifigure_no: desc.minifigure_no },
        data: {
          description_en: desc.description_en,
          description_de: desc.description_de,
          description_fr: desc.description_fr,
          description_es: desc.description_es
        }
      });
      console.log(`✅ Updated ${desc.minifigure_no}`);
    } catch (error) {
      console.error(`❌ Error updating ${desc.minifigure_no}:`, error);
    }
  }

  console.log('\n✅ Batch update complete!');
  await prisma.$disconnect();
}

updateDescriptions();
