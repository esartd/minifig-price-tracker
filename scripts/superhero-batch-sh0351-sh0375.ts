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
    minifigure_no: 'sh0351',
    description_en: "The Penguin with angry expression emphasizes Oswald Cobblepot's volatile temper. The white fur collar maintains his ostentatious style while showing his dangerous side. This emotional variant adds display versatility. Essential for showcasing Penguin's criminal rage alongside refined villainy.",
    description_de: "Der Penguin mit wütendem Ausdruck betont Oswald Cobblepots explosives Temperament. Der weiße Pelzkragen behält seinen auffälligen Stil bei, während er seine gefährliche Seite zeigt. Diese emotionale Variante fügt Display-Vielseitigkeit hinzu. Unverzichtbar für die Darstellung von Penguins krimineller Wut neben raffinierter Schurkentat.",
    description_fr: "Le Pingouin avec expression en colère souligne le tempérament explosif d'Oswald Cobblepot. Le col de fourrure blanche maintient son style ostentatoire tout en montrant son côté dangereux. Cette variante émotionnelle ajoute polyvalence d'affichage. Essentiel pour présenter la rage criminelle du Pingouin aux côtés de la vilenie raffinée.",
    description_es: "El Pingüino con expresión enojada enfatiza el temperamento volátil de Oswald Cobblepot. El cuello de piel blanca mantiene su estilo ostentoso mientras muestra su lado peligroso. Esta variante emocional añade versatilidad de exhibición. Esencial para mostrar la rabia criminal del Pingüino junto a villanía refinada."
  },
  {
    minifigure_no: 'sh0352',
    description_en: "Arkham Asylum Statue in monochrome represents Gothic institutional architecture. This decorative piece adds environmental atmosphere to displays. The monochromatic design emphasizes dark aesthetic. Perfect for creating authentic Arkham Asylum architectural details and horror atmosphere.",
    description_de: "Arkham Asylum-Statue in Monochrom repräsentiert gotische institutionelle Architektur. Dieses dekorative Teil fügt Umgebungs-Atmosphäre zu Displays hinzu. Das monochromatische Design betont dunkle Ästhetik. Perfekt für die Erstellung authentischer Arkham Asylum-Architektur-Details und Horror-Atmosphäre.",
    description_fr: "Statue Arkham Asylum en monochrome représente architecture institutionnelle gothique. Cette pièce décorative ajoute atmosphère environnementale aux affichages. Le design monochromatique souligne l'esthétique sombre. Parfait pour créer détails architecturaux Arkham Asylum authentiques et atmosphère d'horreur.",
    description_es: "Estatua de Arkham Asylum en monocromo representa arquitectura institucional gótica. Esta pieza decorativa añade atmósfera ambiental a exhibiciones. El diseño monocromático enfatiza estética oscura. Perfecto para crear detalles arquitectónicos auténticos de Arkham Asylum y atmósfera de horror."
  },
  {
    minifigure_no: 'sh0353',
    description_en: "The Joker with long coattails and neck bracket adds mechanical attachment detail. This theatrical villain gains enhanced display possibilities. The neck bracket enables unique posing options. A distinctive Joker variant for collectors emphasizing technical display features.",
    description_de: "Der Joker mit langen Rockschößen und Nackenbügel fügt mechanische Befestigungs-Details hinzu. Dieser theatralische Schurke gewinnt verbesserte Display-Möglichkeiten. Der Nackenbügel ermöglicht einzigartige Posierungs-Optionen. Eine charakteristische Joker-Variante für Sammler, die technische Display-Funktionen betonen.",
    description_fr: "Le Joker avec longues basques et support de cou ajoute détail d'attachement mécanique. Ce méchant théâtral gagne des possibilités d'affichage améliorées. Le support de cou permet des options de pose uniques. Une variante Joker distinctive pour collectionneurs soulignant fonctionnalités d'affichage techniques.",
    description_es: "El Joker con faldones largos y soporte de cuello añade detalle de conexión mecánica. Este villano teatral gana posibilidades de exhibición mejoradas. El soporte de cuello permite opciones de pose únicas. Una variante distintiva del Joker para coleccionistas que enfatizan características de exhibición técnicas."
  },
  {
    minifigure_no: 'sh0354',
    description_en: "The Joker with long coattails captures theatrical criminal drama. This variant without neck bracket offers standard display configuration. The flowing coattails emphasize showman personality. Essential for collectors seeking classic Joker theatrical presentation.",
    description_de: "Der Joker mit langen Rockschößen erfasst theatralisches kriminelles Drama. Diese Variante ohne Nackenbügel bietet Standard-Display-Konfiguration. Die fließenden Rockschöße betonen Showman-Persönlichkeit. Unverzichtbar für Sammler, die klassische Joker-Theaterpräsentation suchen.",
    description_fr: "Le Joker avec longues basques capture drame criminel théâtral. Cette variante sans support de cou offre configuration d'affichage standard. Les basques fluides soulignent personnalité de showman. Essentiel pour collectionneurs recherchant présentation théâtrale Joker classique.",
    description_es: "El Joker con faldones largos captura drama criminal teatral. Esta variante sin soporte de cuello ofrece configuración de exhibición estándar. Los faldones fluidos enfatizan personalidad de showman. Esencial para coleccionistas que buscan presentación teatral clásica del Joker."
  },
  {
    minifigure_no: 'sh0355',
    description_en: "Mr. Freeze in black represents a darker costume variant. Victor Fries' cryogenic technology gains stealth aesthetic. The black coloring emphasizes tactical operations. A menacing Mr. Freeze variant perfect for night mission displays.",
    description_de: "Mr. Freeze in Schwarz repräsentiert eine dunklere Kostüm-Variante. Victor Fries' kryogene Technologie gewinnt Heimlich-Ästhetik. Die schwarze Färbung betont taktische Operationen. Eine bedrohliche Mr. Freeze-Variante, perfekt für Nachtmissions-Displays.",
    description_fr: "Mr. Freeze en noir représente une variante de costume plus sombre. La technologie cryogénique de Victor Fries gagne esthétique furtive. La coloration noire souligne les opérations tactiques. Une variante Mr. Freeze menaçante parfaite pour affichages de mission nocturne.",
    description_es: "Mr. Freeze en negro representa una variante de traje más oscura. La tecnología criogénica de Victor Fries gana estética sigilosa. La coloración negra enfatiza operaciones tácticas. Una variante amenazante de Mr. Freeze perfecta para exhibiciones de misión nocturna."
  },
  {
    minifigure_no: 'sh0356',
    description_en: "Batman with short legs and dark blue cape introduces the Dark Knight to junior collectors. This child-friendly format maintains heroic aesthetics. Perfect for family-oriented displays. An essential entry point for building next-generation Batman collections.",
    description_de: "Batman mit kurzen Beinen und dunkelblauem Cape führt den Dark Knight bei jüngeren Sammlern ein. Dieses kinderfreundliche Format behält heroische Ästhetik bei. Perfekt für familienorientierte Displays. Ein unverzichtbarer Einstiegspunkt für den Aufbau von Batman-Sammlungen der nächsten Generation.",
    description_fr: "Batman avec jambes courtes et cape bleu foncé présente le Chevalier Noir aux jeunes collectionneurs. Ce format adapté aux enfants maintient l'esthétique héroïque. Parfait pour affichages orientés famille. Un point d'entrée essentiel pour construire des collections Batman de nouvelle génération.",
    description_es: "Batman con piernas cortas y capa azul oscuro introduce al Caballero Oscuro a coleccionistas junior. Este formato amigable para niños mantiene estética heroica. Perfecto para exhibiciones orientadas a familia. Un punto de entrada esencial para construir colecciones de Batman de nueva generación."
  },
  {
    minifigure_no: 'sh0357',
    description_en: "Killer Moth with short legs brings the moth-themed villain to junior format. This child-friendly design introduces younger collectors to Batman's colorful rogues. Perfect for age-appropriate villain displays. A gateway piece for next-generation Batman villain collections.",
    description_de: "Killer Moth mit kurzen Beinen bringt den motten-thematischen Schurken ins Junior-Format. Dieses kinderfreundliche Design führt jüngere Sammler zu Batmans bunten Rogues ein. Perfekt für altersgerechte Schurken-Displays. Ein Einstiegs-Teil für Batman-Schurken-Sammlungen der nächsten Generation.",
    description_fr: "Killer Moth avec jambes courtes apporte le méchant à thème papillon de nuit au format junior. Ce design adapté aux enfants présente les voyous colorés de Batman aux jeunes collectionneurs. Parfait pour affichages de méchants adaptés à l'âge. Une pièce passerelle pour collections de méchants Batman de nouvelle génération.",
    description_es: "Killer Moth con piernas cortas trae al villano temático de polilla al formato junior. Este diseño amigable para niños introduce a coleccionistas más jóvenes a los pícaros coloridos de Batman. Perfecto para exhibiciones de villanos apropiadas para edad. Una pieza de entrada para colecciones de villanos de Batman de nueva generación."
  },
  {
    minifigure_no: 'sh0358',
    description_en: "Wonder Woman with short legs introduces Diana to junior collectors. This child-friendly format maintains Amazon warrior aesthetics. The gold tiara remains iconic. Perfect for building next-generation DC hero collections with young fans.",
    description_de: "Wonder Woman mit kurzen Beinen führt Diana bei jüngeren Sammlern ein. Dieses kinderfreundliche Format behält Amazonen-Kriegerin-Ästhetik bei. Das goldene Diadem bleibt ikonisch. Perfekt für den Aufbau von DC-Helden-Sammlungen der nächsten Generation mit jungen Fans.",
    description_fr: "Wonder Woman avec jambes courtes présente Diana aux jeunes collectionneurs. Ce format adapté aux enfants maintient l'esthétique de guerrière amazone. Le diadème doré reste emblématique. Parfait pour construire des collections de héros DC de nouvelle génération avec jeunes fans.",
    description_es: "Wonder Woman con piernas cortas introduce a Diana a coleccionistas junior. Este formato amigable para niños mantiene estética de guerrera amazona. La tiara dorada permanece icónica. Perfecto para construir colecciones de héroes DC de nueva generación con fans jóvenes."
  },
  {
    minifigure_no: 'sh0359',
    description_en: "Doomsday with short legs brings Superman's deadliest foe to junior format. This child-friendly design introduces the monster who killed Superman. Perfect for age-appropriate Superman villain displays. A gateway piece for next-generation DC villain collections.",
    description_de: "Doomsday mit kurzen Beinen bringt Supermans tödlichsten Feind ins Junior-Format. Dieses kinderfreundliche Design führt das Monster ein, das Superman tötete. Perfekt für altersgerechte Superman-Schurken-Displays. Ein Einstiegs-Teil für DC-Schurken-Sammlungen der nächsten Generation.",
    description_fr: "Doomsday avec jambes courtes apporte l'ennemi le plus mortel de Superman au format junior. Ce design adapté aux enfants présente le monstre qui a tué Superman. Parfait pour affichages de méchants Superman adaptés à l'âge. Une pièce passerelle pour collections de méchants DC de nouvelle génération.",
    description_es: "Doomsday con piernas cortas trae al enemigo más mortal de Superman al formato junior. Este diseño amigable para niños introduce al monstruo que mató a Superman. Perfecto para exhibiciones de villanos de Superman apropiadas para edad. Una pieza de entrada para colecciones de villanos DC de nueva generación."
  },
  {
    minifigure_no: 'sh0360',
    description_en: "Spider-Man with short legs winking adds playful personality. This junior format captures Peter Parker's friendly neighborhood hero charm. The wink emphasizes his lighthearted nature. Perfect for introducing young collectors to Spider-Man's fun-loving character.",
    description_de: "Spider-Man mit kurzen Beinen zwinkert und fügt verspielte Persönlichkeit hinzu. Dieses Junior-Format erfasst Peter Parkers freundlichen Nachbarschafts-Helden-Charme. Das Zwinkern betont seine unbeschwerte Natur. Perfekt, um junge Sammler an Spider-Mans lebenslustigen Charakter heranzuführen.",
    description_fr: "Spider-Man avec jambes courtes faisant un clin d'œil ajoute personnalité ludique. Ce format junior capture le charme de héros de quartier amical de Peter Parker. Le clin d'œil souligne sa nature légère. Parfait pour présenter le caractère enjoué de Spider-Man aux jeunes collectionneurs.",
    description_es: "Spider-Man con piernas cortas guiñando añade personalidad juguetona. Este formato junior captura el encanto de héroe amigable del vecindario de Peter Parker. El guiño enfatiza su naturaleza despreocupada. Perfecto para introducir a coleccionistas jóvenes al carácter alegre de Spider-Man."
  },
  {
    minifigure_no: 'sh0361',
    description_en: "Scorpion with short legs brings the arachnid villain to junior format. This child-friendly design introduces Mac Gargan's mechanical tail threat. Perfect for age-appropriate Spider-Man villain displays. A gateway piece for next-generation Marvel villain collections.",
    description_de: "Scorpion mit kurzen Beinen bringt den Arachniden-Schurken ins Junior-Format. Dieses kinderfreundliche Design führt Mac Gargans mechanische Schwanz-Bedrohung ein. Perfekt für altersgerechte Spider-Man-Schurken-Displays. Ein Einstiegs-Teil für Marvel-Schurken-Sammlungen der nächsten Generation.",
    description_fr: "Scorpion avec jambes courtes apporte le méchant arachnide au format junior. Ce design adapté aux enfants présente la menace de queue mécanique de Mac Gargan. Parfait pour affichages de méchants Spider-Man adaptés à l'âge. Une pièce passerelle pour collections de méchants Marvel de nouvelle génération.",
    description_es: "Scorpion con piernas cortas trae al villano arácnido al formato junior. Este diseño amigable para niños introduce la amenaza de cola mecánica de Mac Gargan. Perfecto para exhibiciones de villanos de Spider-Man apropiadas para edad. Una pieza de entrada para colecciones de villanos Marvel de nueva generación."
  },
  {
    minifigure_no: 'sh0362',
    description_en: "Iron Man with short legs introduces Tony Stark to junior collectors. This child-friendly format maintains iconic red and gold armor. Perfect for building next-generation Avengers displays. An essential entry point for young Marvel superhero enthusiasts.",
    description_de: "Iron Man mit kurzen Beinen führt Tony Stark bei jüngeren Sammlern ein. Dieses kinderfreundliche Format behält ikonische rot-goldene Rüstung bei. Perfekt für den Aufbau von Avengers-Displays der nächsten Generation. Ein unverzichtbarer Einstiegspunkt für junge Marvel-Superhelden-Enthusiasten.",
    description_fr: "Iron Man avec jambes courtes présente Tony Stark aux jeunes collectionneurs. Ce format adapté aux enfants maintient l'armure rouge et or emblématique. Parfait pour construire des affichages Avengers de nouvelle génération. Un point d'entrée essentiel pour jeunes enthousiastes de super-héros Marvel.",
    description_es: "Iron Man con piernas cortas introduce a Tony Stark a coleccionistas junior. Este formato amigable para niños mantiene armadura icónica roja y dorada. Perfecto para construir exhibiciones de Vengadores de nueva generación. Un punto de entrada esencial para jóvenes entusiastas de superhéroes Marvel."
  },
  {
    minifigure_no: 'sh0363',
    description_en: "Thanos minifigure in standard scale offers versatile display options. The Mad Titan's blue outfit maintains his iconic appearance. This smaller format enables integration with standard minifigure scenes. Essential for collectors preferring consistent scale across displays.",
    description_de: "Thanos-Minifigur im Standardmaßstab bietet vielseitige Display-Optionen. Das blaue Outfit des Wahnsinnigen Titanen behält sein ikonisches Aussehen bei. Dieses kleinere Format ermöglicht Integration mit Standard-Minifiguren-Szenen. Unverzichtbar für Sammler, die konsistenten Maßstab über Displays hinweg bevorzugen.",
    description_fr: "Figurine Thanos à échelle standard offre options d'affichage polyvalentes. La tenue bleue du Titan Fou maintient son apparence emblématique. Ce format plus petit permet intégration avec scènes de figurines standard. Essentiel pour collectionneurs préférant échelle cohérente à travers affichages.",
    description_es: "Minifigura de Thanos a escala estándar ofrece opciones de exhibición versátiles. El traje azul del Titán Loco mantiene su apariencia icónica. Este formato más pequeño permite integración con escenas de minifiguras estándar. Esencial para coleccionistas que prefieren escala consistente en exhibiciones."
  },
  {
    minifigure_no: 'sh0364',
    description_en: "Wolverine with hair and short legs introduces Logan to junior collectors. This child-friendly format maintains his fierce heroism. Perfect for building next-generation X-Men displays. An essential entry point for young Marvel mutant hero enthusiasts.",
    description_de: "Wolverine mit Haaren und kurzen Beinen führt Logan bei jüngeren Sammlern ein. Dieses kinderfreundliche Format behält sein wildes Heldentum bei. Perfekt für den Aufbau von X-Men-Displays der nächsten Generation. Ein unverzichtbarer Einstiegspunkt für junge Marvel-Mutanten-Helden-Enthusiasten.",
    description_fr: "Wolverine avec cheveux et jambes courtes présente Logan aux jeunes collectionneurs. Ce format adapté aux enfants maintient son héroïsme féroce. Parfait pour construire des affichages X-Men de nouvelle génération. Un point d'entrée essentiel pour jeunes enthousiastes de héros mutants Marvel.",
    description_es: "Wolverine con cabello y piernas cortas introduce a Logan a coleccionistas junior. Este formato amigable para niños mantiene su heroísmo feroz. Perfecto para construir exhibiciones de X-Men de nueva generación. Un punto de entrada esencial para jóvenes entusiastas de héroes mutantes Marvel."
  },
  {
    minifigure_no: 'sh0365',
    description_en: "Magneto with short legs brings the Master of Magnetism to junior format. This child-friendly design introduces Erik Lehnsherr's powerful abilities. Perfect for age-appropriate X-Men villain displays. A gateway piece for next-generation Marvel mutant collections.",
    description_de: "Magneto mit kurzen Beinen bringt den Meister des Magnetismus ins Junior-Format. Dieses kinderfreundliche Design führt Erik Lehnsherrs mächtige Fähigkeiten ein. Perfekt für altersgerechte X-Men-Schurken-Displays. Ein Einstiegs-Teil für Marvel-Mutanten-Sammlungen der nächsten Generation.",
    description_fr: "Magneto avec jambes courtes apporte le Maître du Magnétisme au format junior. Ce design adapté aux enfants présente les capacités puissantes d'Erik Lehnsherr. Parfait pour affichages de méchants X-Men adaptés à l'âge. Une pièce passerelle pour collections de mutants Marvel de nouvelle génération.",
    description_es: "Magneto con piernas cortas trae al Maestro del Magnetismo al formato junior. Este diseño amigable para niños introduce las poderosas habilidades de Erik Lehnsherr. Perfecto para exhibiciones de villanos de X-Men apropiadas para edad. Una pieza de entrada para colecciones de mutantes Marvel de nueva generación."
  },
  {
    minifigure_no: 'sh0366',
    description_en: "Super-Adaptoid combines multiple Avengers powers through adaptive technology. This android mimics superhero abilities for villainous purposes. The shape-shifting threat adds tactical complexity. Essential for collections exploring technological Marvel villains and Avengers adversaries.",
    description_de: "Super-Adaptoid kombiniert mehrere Avengers-Kräfte durch adaptive Technologie. Dieser Android ahmt Superhelden-Fähigkeiten für schurkenhafte Zwecke nach. Die gestaltwandelnde Bedrohung fügt taktische Komplexität hinzu. Unverzichtbar für Sammlungen, die technologische Marvel-Schurken und Avengers-Gegner erforschen.",
    description_fr: "Super-Adaptoid combine plusieurs pouvoirs Avengers grâce à technologie adaptative. Cet androïde imite les capacités de super-héros à des fins vilaines. La menace métamorphe ajoute complexité tactique. Essentiel pour collections explorant méchants Marvel technologiques et adversaires Avengers.",
    description_es: "Super-Adaptoid combina múltiples poderes de Vengadores mediante tecnología adaptativa. Este androide imita habilidades de superhéroes para propósitos villanos. La amenaza metamórfica añade complejidad táctica. Esencial para colecciones que exploran villanos tecnológicos Marvel y adversarios de Vengadores."
  },
  {
    minifigure_no: 'sh0367',
    description_en: "Justin Hammer represents corporate villainy in the MCU. This weapons manufacturer rivals Tony Stark's genius with unethical methods. His business suit emphasizes white-collar criminality. Essential for showcasing Marvel's institutional threats and Iron Man adversaries.",
    description_de: "Justin Hammer repräsentiert Unternehmens-Schurkentat im MCU. Dieser Waffenhersteller rivalisiert mit Tony Starks Genie durch unethische Methoden. Sein Geschäftsanzug betont White-Collar-Kriminalität. Unverzichtbar für die Darstellung von Marvels institutionellen Bedrohungen und Iron Man-Gegnern.",
    description_fr: "Justin Hammer représente la vilenie corporative dans le MCU. Ce fabricant d'armes rivalise avec le génie de Tony Stark par des méthodes non éthiques. Son costume d'affaires souligne la criminalité en col blanc. Essentiel pour présenter les menaces institutionnelles de Marvel et les adversaires d'Iron Man.",
    description_es: "Justin Hammer representa villanía corporativa en el MCU. Este fabricante de armas rivaliza con el genio de Tony Stark con métodos no éticos. Su traje de negocios enfatiza criminalidad de cuello blanco. Esencial para mostrar amenazas institucionales de Marvel y adversarios de Iron Man."
  },
  {
    minifigure_no: 'sh0368',
    description_en: "Invincible Iron Man represents Tony Stark's ultimate armor configuration. This advanced suit combines all previous innovations. The design emphasizes peak technological achievement. Essential for collectors chronicling Iron Man's armor evolution to perfection.",
    description_de: "Invincible Iron Man repräsentiert Tony Starks ultimative Rüstungs-Konfiguration. Dieser fortgeschrittene Anzug kombiniert alle vorherigen Innovationen. Das Design betont Spitzen-Technologie-Leistung. Unverzichtbar für Sammler, die Iron Mans Rüstungs-Evolution zur Perfektion dokumentieren.",
    description_fr: "Invincible Iron Man représente la configuration d'armure ultime de Tony Stark. Cette combinaison avancée combine toutes les innovations précédentes. Le design souligne la réalisation technologique maximale. Essentiel pour collectionneurs chronicant l'évolution d'armure d'Iron Man vers la perfection.",
    description_es: "Invincible Iron Man representa la configuración de armadura definitiva de Tony Stark. Este traje avanzado combina todas las innovaciones anteriores. El diseño enfatiza logro tecnológico máximo. Esencial para coleccionistas que relatan la evolución de armadura de Iron Man hacia la perfección."
  },
  {
    minifigure_no: 'sh0369',
    description_en: "Agent Coulson represents SHIELD's dedicated field operatives. Phil Coulson's loyalty and competence make him essential. This everyman hero bridges ordinary and extraordinary. Important supporting character for MCU institutional displays and Avengers Initiative storylines.",
    description_de: "Agent Coulson repräsentiert SHIELDs engagierte Feldoperative. Phil Coulsons Loyalität und Kompetenz machen ihn unverzichtbar. Dieser Jedermann-Held verbindet Gewöhnliches und Außergewöhnliches. Wichtige Nebenfigur für MCU-institutionelle Displays und Avengers Initiative-Handlungen.",
    description_fr: "Agent Coulson représente les opératifs de terrain dévoués de SHIELD. La loyauté et la compétence de Phil Coulson le rendent essentiel. Ce héros homme ordinaire fait le pont entre ordinaire et extraordinaire. Personnage secondaire important pour affichages institutionnels MCU et intrigues Initiative Avengers.",
    description_es: "Agente Coulson representa operativos de campo dedicados de SHIELD. La lealtad y competencia de Phil Coulson lo hacen esencial. Este héroe hombre común une lo ordinario y extraordinario. Personaje secundario importante para exhibiciones institucionales MCU e historias de Iniciativa Vengadores."
  },
  {
    minifigure_no: 'sh0370',
    description_en: "Red Hulk with yellow eyes brings Thunderbolt Ross's transformation to life. This military-minded gamma monster combines rage with tactical thinking. The large-format figure emphasizes his imposing presence. Essential for comprehensive Hulk family displays and military villain collections.",
    description_de: "Red Hulk mit gelben Augen erweckt Thunderbolt Ross' Verwandlung zum Leben. Dieses militärisch denkende Gamma-Monster kombiniert Wut mit taktischem Denken. Die großformatige Figur betont seine imposante Präsenz. Unverzichtbar für umfassende Hulk-Familien-Displays und militärische Schurken-Sammlungen.",
    description_fr: "Red Hulk avec yeux jaunes donne vie à la transformation de Thunderbolt Ross. Ce monstre gamma à mentalité militaire combine rage avec pensée tactique. La figurine grand format souligne sa présence imposante. Essentiel pour affichages complets de famille Hulk et collections de méchants militaires.",
    description_es: "Red Hulk con ojos amarillos da vida a la transformación de Thunderbolt Ross. Este monstruo gamma de mentalidad militar combina rabia con pensamiento táctico. La figura de gran formato enfatiza su presencia imponente. Esencial para exhibiciones completas de familia Hulk y colecciones de villanos militares."
  },
  {
    minifigure_no: 'sh0371',
    description_en: "Hulk with magenta pants and dark green hair represents an alternate color scheme. Bruce Banner's rage-fueled form gains visual variety. This color variation offers collectors display diversity. A valuable Hulk piece for comprehensive gamma monster collections.",
    description_de: "Hulk mit magentafarbenen Hosen und dunkelgrünem Haar repräsentiert ein alternatives Farbschema. Bruce Banners wutgetriebene Form gewinnt visuelle Vielfalt. Diese Farbvariation bietet Sammlern Display-Vielfalt. Ein wertvolles Hulk-Teil für umfassende Gamma-Monster-Sammlungen.",
    description_fr: "Hulk avec pantalon magenta et cheveux vert foncé représente un schéma de couleurs alternatif. La forme alimentée par la rage de Bruce Banner gagne variété visuelle. Cette variation de couleur offre diversité d'affichage aux collectionneurs. Une pièce Hulk précieuse pour collections complètes de monstres gamma.",
    description_es: "Hulk con pantalones magenta y cabello verde oscuro representa un esquema de color alternativo. La forma impulsada por rabia de Bruce Banner gana variedad visual. Esta variación de color ofrece a coleccionistas diversidad de exhibición. Una pieza valiosa de Hulk para colecciones completas de monstruos gamma."
  },
  {
    minifigure_no: 'sh0372',
    description_en: "Red She-Hulk brings Betty Ross's gamma transformation to Marvel. This powerful heroine combines strength with intelligence. The red coloring distinguishes her from traditional She-Hulk. Essential for comprehensive gamma hero displays and strong female character collections.",
    description_de: "Red She-Hulk bringt Betty Ross' Gamma-Verwandlung zu Marvel. Diese mächtige Heldin kombiniert Stärke mit Intelligenz. Die rote Färbung unterscheidet sie von traditioneller She-Hulk. Unverzichtbar für umfassende Gamma-Helden-Displays und starke weibliche Charakter-Sammlungen.",
    description_fr: "Red She-Hulk apporte la transformation gamma de Betty Ross à Marvel. Cette héroïne puissante combine force avec intelligence. La coloration rouge la distingue de la She-Hulk traditionnelle. Essentiel pour affichages complets de héros gamma et collections de personnages féminins forts.",
    description_es: "Red She-Hulk aporta la transformación gamma de Betty Ross a Marvel. Esta heroína poderosa combina fuerza con inteligencia. La coloración roja la distingue de She-Hulk tradicional. Esencial para exhibiciones completas de héroes gamma y colecciones de personajes femeninos fuertes."
  },
  {
    minifigure_no: 'sh0373',
    description_en: "She-Hulk combines Jennifer Walters' legal expertise with superhuman strength. This lawyer-turned-hero maintains intelligence while gaining power. Her green form represents controlled gamma transformation. Essential for comprehensive Hulk family and strong female hero displays.",
    description_de: "She-Hulk kombiniert Jennifer Walters' juristische Expertise mit übermenschlicher Stärke. Diese Anwältin-wurde-Heldin behält Intelligenz bei, während sie Macht gewinnt. Ihre grüne Form repräsentiert kontrollierte Gamma-Verwandlung. Unverzichtbar für umfassende Hulk-Familien- und starke weibliche Helden-Displays.",
    description_fr: "She-Hulk combine l'expertise juridique de Jennifer Walters avec force surhumaine. Cette avocate devenue héroïne maintient l'intelligence tout en gagnant du pouvoir. Sa forme verte représente la transformation gamma contrôlée. Essentiel pour affichages complets de famille Hulk et héroïnes fortes.",
    description_es: "She-Hulk combina experiencia legal de Jennifer Walters con fuerza sobrehumana. Esta abogada convertida en heroína mantiene inteligencia mientras gana poder. Su forma verde representa transformación gamma controlada. Esencial para exhibiciones completas de familia Hulk y heroínas fuertes."
  },
  {
    minifigure_no: 'sh0374',
    description_en: "Pilot Captain America shows Steve Rogers in aviation gear. This specialized variant emphasizes his World War II fighter pilot role. The flight suit adds historical military authenticity. Perfect for chronicling Captain America's wartime service and aerial combat missions.",
    description_de: "Pilot Captain America zeigt Steve Rogers in Luftfahrt-Ausrüstung. Diese spezialisierte Variante betont seine Rolle als Jagdflieger im Zweiten Weltkrieg. Der Fluganzug fügt historische militärische Authentizität hinzu. Perfekt für die Chronik von Captain Americas Kriegsdienst und Luftkampf-Missionen.",
    description_fr: "Pilot Captain America montre Steve Rogers en équipement d'aviation. Cette variante spécialisée souligne son rôle de pilote de chasse de la Seconde Guerre mondiale. La combinaison de vol ajoute authenticité militaire historique. Parfait pour chronicler le service en temps de guerre de Captain America et missions de combat aérien.",
    description_es: "Pilot Captain America muestra a Steve Rogers en equipo de aviación. Esta variante especializada enfatiza su rol de piloto de combate de la Segunda Guerra Mundial. El traje de vuelo añade autenticidad militar histórica. Perfecto para relatar el servicio en tiempo de guerra del Capitán América y misiones de combate aéreo."
  },
  {
    minifigure_no: 'sh0375',
    description_en: "Ms. Marvel (Kamala Khan) with long arms showcases her polymorph powers. This Pakistani-American hero represents Marvel's diverse new generation. The extended arms demonstrate her shape-shifting abilities. Essential for modern Marvel hero collections and celebrating cultural representation.",
    description_de: "Ms. Marvel (Kamala Khan) mit langen Armen zeigt ihre Polymorph-Kräfte. Diese pakistanisch-amerikanische Heldin repräsentiert Marvels vielfältige neue Generation. Die verlängerten Arme demonstrieren ihre Gestaltwandlungs-Fähigkeiten. Unverzichtbar für moderne Marvel-Helden-Sammlungen und Feier kultureller Repräsentation.",
    description_fr: "Ms. Marvel (Kamala Khan) avec longs bras présente ses pouvoirs polymorphes. Cette héroïne pakistano-américaine représente la nouvelle génération diversifiée de Marvel. Les bras étendus démontrent ses capacités de métamorphose. Essentiel pour collections de héros Marvel modernes et célébration de représentation culturelle.",
    description_es: "Ms. Marvel (Kamala Khan) con brazos largos muestra sus poderes polimorfos. Esta heroína pakistaní-americana representa la nueva generación diversa de Marvel. Los brazos extendidos demuestran sus habilidades de cambio de forma. Esencial para colecciones modernas de héroes Marvel y celebración de representación cultural."
  }
];

async function main() {
  console.log(`🦸 Starting Super Heroes batch sh0351-sh0375 (${descriptions.length} minifigs)...`);
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
  console.log(`✅ Batch complete! ${descriptions.length} minifigs saved. Total: 375 done.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
