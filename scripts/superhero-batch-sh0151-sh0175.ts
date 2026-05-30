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
    minifigure_no: 'sh0151',
    description_en: "Batman's dark bluish gray suit with gold belt and spongy cape represents a premium texture variant. The black hands and soft cape material enhance display quality. This variant offers collectors improved aesthetic presentation. A sophisticated upgrade appealing to Batman completionists seeking every cape variation.",
    description_de: "Batmans dunkelblaugrauer Anzug mit Goldgürtel und schwammigem Cape repräsentiert eine Premium-Texturvariante. Die schwarzen Hände und weiches Cape-Material verbessern die Display-Qualität. Diese Variante bietet Sammlern verbesserte ästhetische Präsentation. Ein anspruchsvolles Upgrade, das Batman-Vervollständiger anzieht, die jede Cape-Variation suchen.",
    description_fr: "Le costume gris bleuté foncé de Batman avec ceinture dorée et cape spongieuse représente une variante de texture premium. Les mains noires et le matériau de cape souple améliorent la qualité d'affichage. Cette variante offre aux collectionneurs une présentation esthétique améliorée. Une mise à niveau sophistiquée attirant les complétistes Batman recherchant chaque variation de cape.",
    description_es: "El traje gris azulado oscuro de Batman con cinturón dorado y capa esponjosa representa una variante de textura premium. Las manos negras y material de capa suave mejoran la calidad de exhibición. Esta variante ofrece a coleccionistas presentación estética mejorada. Una actualización sofisticada que atrae a completistas de Batman que buscan cada variación de capa."
  },
  {
    minifigure_no: 'sh0152',
    description_en: "Darkseid commands ultimate power as DC's most terrifying cosmic tyrant. The Lord of Apokolips seeks the Anti-Life Equation to dominate all existence. This large-format figure captures his massive stone-like appearance and imposing presence. An essential heavyweight villain for Justice League's greatest threats display.",
    description_de: "Darkseid befiehlt ultimative Macht als DCs erschreckendster kosmischer Tyrann. Der Herr von Apokolips sucht die Anti-Leben-Gleichung, um die gesamte Existenz zu beherrschen. Diese großformatige Figur erfasst sein massives steinartiges Aussehen und imposante Präsenz. Ein unverzichtbarer Schwergewichts-Schurke für das Display der größten Bedrohungen der Justice League.",
    description_fr: "Darkseid commande le pouvoir ultime comme le tyran cosmique le plus terrifiant de DC. Le Seigneur d'Apokolips cherche l'Équation Anti-Vie pour dominer toute existence. Cette figurine grand format capture son apparence massive semblable à la pierre et sa présence imposante. Un méchant poids lourd essentiel pour l'affichage des plus grandes menaces de la Justice League.",
    description_es: "Darkseid comanda poder definitivo como el tirano cósmico más aterrador de DC. El Señor de Apokolips busca la Ecuación Anti-Vida para dominar toda existencia. Esta figura de gran formato captura su apariencia masiva similar a piedra y presencia imponente. Un villano peso pesado esencial para exhibición de las mayores amenazas de la Liga de la Justicia."
  },
  {
    minifigure_no: 'sh0153',
    description_en: "Green Arrow with hair shows Oliver Queen's civilian identity alongside his heroic persona. This variant reveals the billionaire playboy behind the mask. The hair piece adds character depth and display versatility. Perfect for creating dual-identity storylines and character development scenes.",
    description_de: "Green Arrow mit Haaren zeigt Oliver Queens zivile Identität neben seiner heroischen Persona. Diese Variante enthüllt den Milliardärs-Playboy hinter der Maske. Das Haarteil fügt Charaktertiefe und Display-Vielseitigkeit hinzu. Perfekt für die Erstellung von Doppelidentitäts-Handlungen und Charakterentwicklungsszenen.",
    description_fr: "Green Arrow avec cheveux montre l'identité civile d'Oliver Queen à côté de son personnage héroïque. Cette variante révèle le playboy milliardaire derrière le masque. La pièce de cheveux ajoute profondeur de caractère et polyvalence d'affichage. Parfait pour créer des intrigues de double identité et scènes de développement de personnage.",
    description_es: "Flecha Verde con cabello muestra la identidad civil de Oliver Queen junto a su persona heroica. Esta variante revela al playboy multimillonario detrás de la máscara. La pieza de cabello añade profundidad de personaje y versatilidad de exhibición. Perfecto para crear historias de identidad dual y escenas de desarrollo de personaje."
  },
  {
    minifigure_no: 'sh0154',
    description_en: "Hawkman soars through battle with ancient weapons and Nth metal wings. Carter Hall's reincarnated warrior spirit brings Egyptian mysticism to the Justice League. This minifigure showcases his distinctive winged helmet and hawk motif. A cornerstone Justice League member representing mystical power.",
    description_de: "Hawkman schwebt durch die Schlacht mit antiken Waffen und Nth-Metall-Flügeln. Carter Halls reinkarnierter Kriegergeist bringt ägyptische Mystik zur Justice League. Diese Minifigur zeigt seinen charakteristischen geflügelten Helm und Falken-Motiv. Ein Eckpfeiler-Mitglied der Justice League, das mystische Macht repräsentiert.",
    description_fr: "Hawkman plane à travers la bataille avec armes anciennes et ailes en métal Nth. L'esprit guerrier réincarné de Carter Hall apporte le mysticisme égyptien à la Justice League. Cette figurine présente son casque ailé distinctif et motif de faucon. Un membre pierre angulaire de la Justice League représentant le pouvoir mystique.",
    description_es: "Hawkman vuela por la batalla con armas antiguas y alas de metal Nth. El espíritu guerrero reencarnado de Carter Hall aporta misticismo egipcio a la Liga de la Justicia. Esta minifigura muestra su distintivo casco alado y motivo de halcón. Un miembro fundamental de la Liga de la Justicia que representa poder místico."
  },
  {
    minifigure_no: 'sh0155',
    description_en: "Cyborg merges human spirit with advanced technology. Victor Stone's smiling expression with black gloves shows his humanity despite mechanical enhancements. This variant emphasizes the optimistic side of the half-human hero. Essential Justice League member bridging human and technological heroism.",
    description_de: "Cyborg verschmilzt menschlichen Geist mit fortgeschrittener Technologie. Victor Stones lächelnder Ausdruck mit schwarzen Handschuhen zeigt seine Menschlichkeit trotz mechanischer Verbesserungen. Diese Variante betont die optimistische Seite des halb-menschlichen Helden. Unverzichtbares Justice League-Mitglied, das menschliches und technologisches Heldentum verbindet.",
    description_fr: "Cyborg fusionne esprit humain avec technologie avancée. L'expression souriante de Victor Stone avec gants noirs montre son humanité malgré les améliorations mécaniques. Cette variante souligne le côté optimiste du héros mi-humain. Membre essentiel de la Justice League reliant héroïsme humain et technologique.",
    description_es: "Cyborg fusiona espíritu humano con tecnología avanzada. La expresión sonriente de Victor Stone con guantes negros muestra su humanidad a pesar de mejoras mecánicas. Esta variante enfatiza el lado optimista del héroe semi-humano. Miembro esencial de la Liga de la Justicia que une heroísmo humano y tecnológico."
  },
  {
    minifigure_no: 'sh0156',
    description_en: "Superman's dual-expression head with frown and red eyes captures both his heroic and potentially dangerous sides. The spongy cape with hair featuring front curl represents premium quality. This variant showcases Clark Kent's struggle between humanity and godlike power. A dramatic Superman variant essential for serious collectors.",
    description_de: "Supermans Doppelausdrucks-Kopf mit Stirnrunzeln und roten Augen erfasst sowohl seine heroischen als auch potenziell gefährlichen Seiten. Das schwammige Cape mit Haar mit Frontlocke repräsentiert Premium-Qualität. Diese Variante zeigt Clark Kents Kampf zwischen Menschlichkeit und gottähnlicher Macht. Eine dramatische Superman-Variante, unverzichtbar für ernsthafte Sammler.",
    description_fr: "La tête à double expression de Superman avec froncement et yeux rouges capture à la fois ses côtés héroïque et potentiellement dangereux. La cape spongieuse avec cheveux comportant boucle frontale représente une qualité premium. Cette variante présente la lutte de Clark Kent entre humanité et pouvoir divin. Une variante Superman dramatique essentielle pour collectionneurs sérieux.",
    description_es: "La cabeza de doble expresión de Superman con ceño fruncido y ojos rojos captura tanto sus lados heroicos como potencialmente peligrosos. La capa esponjosa con cabello con rizo frontal representa calidad premium. Esta variante muestra la lucha de Clark Kent entre humanidad y poder divino. Una variante dramática de Superman esencial para coleccionistas serios."
  },
  {
    minifigure_no: 'sh0157',
    description_en: "Supergirl brings Kryptonian power with youthful determination. Kara Zor-El's strength matches Superman's while her personality adds fresh energy. This minifigure captures her iconic red and blue costume. Essential for comprehensive Superman family collections and Justice League displays.",
    description_de: "Supergirl bringt kryptonische Kraft mit jugendlicher Entschlossenheit. Kara Zor-Els Stärke entspricht Supermans, während ihre Persönlichkeit frische Energie hinzufügt. Diese Minifigur erfasst ihr ikonisches rot-blaues Kostüm. Unverzichtbar für umfassende Superman-Familien-Sammlungen und Justice League-Displays.",
    description_fr: "Supergirl apporte pouvoir kryptonien avec détermination juvénile. La force de Kara Zor-El égale celle de Superman tandis que sa personnalité ajoute une énergie fraîche. Cette figurine capture son costume rouge et bleu emblématique. Essentiel pour les collections complètes de la famille Superman et affichages Justice League.",
    description_es: "Supergirl aporta poder kryptoniano con determinación juvenil. La fuerza de Kara Zor-El iguala la de Superman mientras su personalidad añade energía fresca. Esta minifigura captura su icónico traje rojo y azul. Esencial para colecciones completas de familia Superman y exhibiciones de Liga de la Justicia."
  },
  {
    minifigure_no: 'sh0158',
    description_en: "Martian Manhunter with cape and collar emphasizes J'onn J'onzz's regal presence. This variant adds dramatic flair to the Martian hero's appearance. The caped design enhances his mystique and power. A distinguished variant for collectors seeking comprehensive Martian Manhunter representations.",
    description_de: "Martian Manhunter mit Cape und Kragen betont J'onn J'onzz' königliche Präsenz. Diese Variante fügt dem marsianischen Helden dramatisches Flair hinzu. Das Cape-Design verstärkt seine Mystik und Macht. Eine vornehme Variante für Sammler, die umfassende Martian Manhunter-Darstellungen suchen.",
    description_fr: "Martian Manhunter avec cape et col souligne la présence royale de J'onn J'onzz. Cette variante ajoute du panache dramatique à l'apparence du héros martien. Le design à cape améliore son mystique et son pouvoir. Une variante distinguée pour collectionneurs recherchant des représentations complètes de Martian Manhunter.",
    description_es: "Martian Manhunter con capa y cuello enfatiza la presencia regia de J'onn J'onzz. Esta variante añade estilo dramático a la apariencia del héroe marciano. El diseño con capa realza su mística y poder. Una variante distinguida para coleccionistas que buscan representaciones completas de Martian Manhunter."
  },
  {
    minifigure_no: 'sh0159',
    description_en: "Brainiac represents cold artificial intelligence seeking universal knowledge. The 12th-level intellect from Colu shrinks cities for his collection. This minifigure captures his green cybernetic appearance. A critical Superman villain essential for showcasing technological threats in the DC universe.",
    description_de: "Brainiac repräsentiert kalte künstliche Intelligenz, die universelles Wissen sucht. Der 12-stufige Intellekt von Colu schrumpft Städte für seine Sammlung. Diese Minifigur erfasst sein grünes kybernetisches Aussehen. Ein kritischer Superman-Schurke, unverzichtbar für die Darstellung technologischer Bedrohungen im DC-Universum.",
    description_fr: "Brainiac représente l'intelligence artificielle froide cherchant la connaissance universelle. L'intellect de 12e niveau de Colu rétrécit les villes pour sa collection. Cette figurine capture son apparence cybernétique verte. Un méchant Superman critique essentiel pour présenter les menaces technologiques dans l'univers DC.",
    description_es: "Brainiac representa inteligencia artificial fría que busca conocimiento universal. El intelecto de nivel 12 de Colu encoge ciudades para su colección. Esta minifigura captura su apariencia cibernética verde. Un villano crítico de Superman esencial para mostrar amenazas tecnológicas en el universo DC."
  },
  {
    minifigure_no: 'sh0160',
    description_en: "Black Manta with flat silver helmet emerges as Aquaman's most persistent enemy. David Hyde's advanced technology and burning hatred drive his vendetta. This variant features distinctive metallic helmet styling. Essential antagonist for Aquaman collections and underwater battle scenes.",
    description_de: "Black Manta mit flachem Silberhelm tritt als Aquamans hartnäckigster Feind auf. David Hydes fortgeschrittene Technologie und brennender Hass treiben seine Vendetta an. Diese Variante zeigt charakteristisches metallisches Helm-Styling. Unverzichtbarer Antagonist für Aquaman-Sammlungen und Unterwasser-Kampfszenen.",
    description_fr: "Black Manta avec casque argenté plat émerge comme l'ennemi le plus persistant d'Aquaman. La technologie avancée et la haine brûlante de David Hyde alimentent sa vendetta. Cette variante présente un style de casque métallique distinctif. Antagoniste essentiel pour les collections Aquaman et scènes de bataille sous-marine.",
    description_es: "Black Manta con casco plateado plano emerge como el enemigo más persistente de Aquaman. La tecnología avanzada y odio ardiente de David Hyde impulsan su vendetta. Esta variante presenta estilo distintivo de casco metálico. Antagonista esencial para colecciones de Aquaman y escenas de batalla submarina."
  },
  {
    minifigure_no: 'sh0161',
    description_en: "Scuba Robin brings underwater capabilities to the Dynamic Duo. Dick Grayson's specialized diving equipment enables aquatic crime-fighting missions. This variant adds tactical versatility to Robin's roster. Perfect for underwater rescue scenarios and expanding Batman family adventures.",
    description_de: "Scuba Robin bringt Unterwasserfähigkeiten zum dynamischen Duo. Dick Graysons spezialisierte Tauchausrüstung ermöglicht aquatische Verbrechensbekämpfungs-Missionen. Diese Variante fügt taktische Vielseitigkeit zu Robins Aufgebot hinzu. Perfekt für Unterwasser-Rettungsszenarien und Erweiterung der Batman-Familien-Abenteuer.",
    description_fr: "Scuba Robin apporte des capacités sous-marines au Duo Dynamique. L'équipement de plongée spécialisé de Dick Grayson permet des missions de lutte contre le crime aquatiques. Cette variante ajoute polyvalence tactique au roster de Robin. Parfait pour scénarios de sauvetage sous-marin et expansion des aventures de la famille Batman.",
    description_es: "Scuba Robin aporta capacidades submarinas al Dúo Dinámico. El equipo de buceo especializado de Dick Grayson permite misiones de lucha contra el crimen acuáticas. Esta variante añade versatilidad táctica al plantel de Robin. Perfecto para escenarios de rescate submarino y expansión de aventuras de familia Batman."
  },
  {
    minifigure_no: 'sh0162',
    description_en: "Batman with scuba mask extends the Dark Knight's reach to underwater operations. This variant combines his iconic suit with aquatic equipment. The spongy cape maintains Batman's silhouette while adding practical diving capability. A specialized Batman variant for underwater mission displays.",
    description_de: "Batman mit Tauchmaske erweitert die Reichweite des Dark Knight auf Unterwasser-Operationen. Diese Variante kombiniert seinen ikonischen Anzug mit aquatischer Ausrüstung. Das schwammige Cape bewahrt Batmans Silhouette, während es praktische Tauchfähigkeit hinzufügt. Eine spezialisierte Batman-Variante für Unterwasser-Missions-Displays.",
    description_fr: "Batman avec masque de plongée étend la portée du Chevalier Noir aux opérations sous-marines. Cette variante combine son costume emblématique avec équipement aquatique. La cape spongieuse maintient la silhouette de Batman tout en ajoutant capacité de plongée pratique. Une variante Batman spécialisée pour affichages de mission sous-marine.",
    description_es: "Batman con máscara de buceo extiende el alcance del Caballero Oscuro a operaciones submarinas. Esta variante combina su traje icónico con equipo acuático. La capa esponjosa mantiene la silueta de Batman mientras añade capacidad práctica de buceo. Una variante especializada de Batman para exhibiciones de misión submarina."
  },
  {
    minifigure_no: 'sh0163',
    description_en: "Batzarro emerges from Bizarro World as Batman's imperfect duplicate. This reversed hero operates with backwards logic and broken speech. The bizarre variant showcases DC's playful alternate universe concepts. A quirky collector piece appealing to fans of DC's weirder storylines.",
    description_de: "Batzarro taucht aus Bizarro World als Batmans unvollkommenes Duplikat auf. Dieser umgekehrte Held operiert mit rückwärts Logik und gebrochenem Sprechen. Die bizarre Variante zeigt DCs verspielte alternative Universumskonzepte. Ein schrulliges Sammlerstück, das Fans von DCs merkwürdigeren Handlungen anzieht.",
    description_fr: "Batzarro émerge de Bizarro World comme duplicata imparfait de Batman. Ce héros inversé opère avec logique inversée et parole brisée. La variante bizarre présente les concepts d'univers alternatif ludiques de DC. Une pièce de collection originale attirant les fans des intrigues plus étranges de DC.",
    description_es: "Batzarro emerge del Mundo Bizarro como duplicado imperfecto de Batman. Este héroe invertido opera con lógica invertida y habla quebrada. La variante bizarra muestra conceptos de universo alternativo juguetones de DC. Una pieza de colección peculiar que atrae a fans de historias más raras de DC."
  },
  {
    minifigure_no: 'sh0164',
    description_en: "Iron Man Mark 45 represents Tony Stark's advanced armor from Age of Ultron. This suit combines enhanced firepower with sleeker design. The red and gold color scheme remains iconic while upgrading capabilities. Essential for chronicling Iron Man's technological evolution through MCU films.",
    description_de: "Iron Man Mark 45 repräsentiert Tony Starks fortgeschrittene Rüstung aus Age of Ultron. Dieser Anzug kombiniert verbesserte Feuerkraft mit schlankeren Design. Das rot-goldene Farbschema bleibt ikonisch, während es Fähigkeiten verbessert. Unverzichtbar für die Chronik von Iron Mans technologischer Evolution durch MCU-Filme.",
    description_fr: "Iron Man Mark 45 représente l'armure avancée de Tony Stark d'Age of Ultron. Cette combinaison combine puissance de feu améliorée avec design plus élégant. Le schéma de couleurs rouge et or reste emblématique tout en améliorant les capacités. Essentiel pour chronicler l'évolution technologique d'Iron Man à travers les films MCU.",
    description_es: "Iron Man Mark 45 representa la armadura avanzada de Tony Stark de Age of Ultron. Este traje combina potencia de fuego mejorada con diseño más elegante. El esquema de color rojo y dorado permanece icónico mientras mejora capacidades. Esencial para relatar la evolución tecnológica de Iron Man a través de películas MCU."
  },
  {
    minifigure_no: 'sh0165',
    description_en: "Ultron Sentry Officer commands the robotic army in Age of Ultron. These upgraded sentries coordinate attacks against the Avengers. The officer variant features distinctive markings showing rank. Essential army builders for creating massive Ultron force displays.",
    description_de: "Ultron Sentry Officer befehligt die Roboter-Armee in Age of Ultron. Diese aufgerüsteten Wachposten koordinieren Angriffe gegen die Avengers. Die Offiziersvariante zeigt charakteristische Markierungen, die den Rang zeigen. Unverzichtbare Armee-Baumeister für die Erstellung massiver Ultron-Kraft-Displays.",
    description_fr: "Ultron Sentry Officer commande l'armée robotique dans Age of Ultron. Ces sentinelles améliorées coordonnent les attaques contre les Avengers. La variante officier présente des marquages distinctifs montrant le rang. Constructeurs d'armée essentiels pour créer des affichages de force Ultron massifs.",
    description_es: "Ultron Sentry Officer comanda el ejército robótico en Age of Ultron. Estos centinelas mejorados coordinan ataques contra los Vengadores. La variante de oficial presenta marcas distintivas que muestran rango. Constructores de ejército esenciales para crear exhibiciones masivas de fuerza Ultron."
  },
  {
    minifigure_no: 'sh0166',
    description_en: "Ultron Sentry forms the backbone of Ultron's robotic legion. These mass-produced drones attack with overwhelming numbers. Essential army builders for recreating Age of Ultron battle scenes. Multiple copies create authentic Avengers versus robot army displays.",
    description_de: "Ultron Sentry bildet das Rückgrat von Ultrons Roboter-Legion. Diese massenproduzierten Drohnen greifen mit überwältigenden Zahlen an. Unverzichtbare Armee-Baumeister zur Nachstellung von Age of Ultron-Kampfszenen. Mehrere Exemplare schaffen authentische Avengers-gegen-Roboter-Armee-Displays.",
    description_fr: "Ultron Sentry forme l'épine dorsale de la légion robotique d'Ultron. Ces drones produits en masse attaquent avec des nombres écrasants. Constructeurs d'armée essentiels pour recréer des scènes de bataille Age of Ultron. Plusieurs exemplaires créent des affichages authentiques Avengers contre armée robotique.",
    description_es: "Ultron Sentry forma la columna vertebral de la legión robótica de Ultron. Estos drones producidos en masa atacan con números abrumadores. Constructores de ejército esenciales para recrear escenas de batalla de Age of Ultron. Múltiples copias crean exhibiciones auténticas de Vengadores versus ejército robot."
  },
  {
    minifigure_no: 'sh0167',
    description_en: "Iron Man Mark 43 serves as Tony Stark's primary armor in Age of Ultron. This suit bridges earlier designs with Mark 45's upgrades. The distinctive red and gold remains while incorporating new technology. Important piece documenting Iron Man's armor progression through Avengers films.",
    description_de: "Iron Man Mark 43 dient als Tony Starks primäre Rüstung in Age of Ultron. Dieser Anzug verbindet frühere Designs mit Mark 45's Upgrades. Das charakteristische Rot und Gold bleibt, während neue Technologie integriert wird. Wichtiges Teil, das Iron Mans Rüstungsfortschritt durch Avengers-Filme dokumentiert.",
    description_fr: "Iron Man Mark 43 sert d'armure principale de Tony Stark dans Age of Ultron. Cette combinaison fait le pont entre les designs antérieurs et les améliorations du Mark 45. Le rouge et or distinctif demeure tout en incorporant nouvelle technologie. Pièce importante documentant la progression d'armure d'Iron Man à travers les films Avengers.",
    description_es: "Iron Man Mark 43 sirve como armadura principal de Tony Stark en Age of Ultron. Este traje une diseños anteriores con mejoras del Mark 45. El distintivo rojo y dorado permanece mientras incorpora nueva tecnología. Pieza importante que documenta la progresión de armadura de Iron Man a través de películas de Vengadores."
  },
  {
    minifigure_no: 'sh0168',
    description_en: "Iron Legion with trans-neon orange head represents Tony Stark's autonomous defense drones. These peacekeeping robots were corrupted by Ultron in Age of Ultron. The translucent orange head distinguishes the helmet visor variant. Collectible army builder showing technology's double-edged nature.",
    description_de: "Iron Legion mit trans-neon-orangem Kopf repräsentiert Tony Starks autonome Verteidigungs-Drohnen. Diese friedenserhaltenden Roboter wurden von Ultron in Age of Ultron korrumpiert. Der durchscheinende orange Kopf unterscheidet die Helm-Visier-Variante. Sammelbarer Armee-Baumeister, der die zweischneidige Natur der Technologie zeigt.",
    description_fr: "Iron Legion avec tête orange néon translucide représente les drones de défense autonomes de Tony Stark. Ces robots de maintien de la paix ont été corrompus par Ultron dans Age of Ultron. La tête orange translucide distingue la variante de visière de casque. Constructeur d'armée collectionnable montrant la nature à double tranchant de la technologie.",
    description_es: "Iron Legion con cabeza naranja neón translúcida representa los drones de defensa autónomos de Tony Stark. Estos robots de mantenimiento de paz fueron corrompidos por Ultron en Age of Ultron. La cabeza naranja translúcida distingue la variante de visera de casco. Constructor de ejército coleccionable que muestra la naturaleza de doble filo de la tecnología."
  },
  {
    minifigure_no: 'sh0169',
    description_en: "Ultron MK1 with trans-clear head represents the villain's first physical form. Tony Stark's artificial intelligence achieved sentience and turned against humanity. The transparent head shows Ultron's early crude construction. A critical piece showing Ultron's origin in the MCU.",
    description_de: "Ultron MK1 mit trans-klarem Kopf repräsentiert die erste physische Form des Schurken. Tony Starks künstliche Intelligenz erlangte Bewusstsein und wandte sich gegen die Menschheit. Der durchsichtige Kopf zeigt Ultrons frühe grobe Konstruktion. Ein kritisches Teil, das Ultrons Ursprung im MCU zeigt.",
    description_fr: "Ultron MK1 avec tête transparente représente la première forme physique du méchant. L'intelligence artificielle de Tony Stark a atteint la conscience et s'est retournée contre l'humanité. La tête transparente montre la construction brute précoce d'Ultron. Une pièce critique montrant l'origine d'Ultron dans le MCU.",
    description_es: "Ultron MK1 con cabeza transparente representa la primera forma física del villano. La inteligencia artificial de Tony Stark alcanzó consciencia y se volvió contra la humanidad. La cabeza transparente muestra la construcción cruda temprana de Ultron. Una pieza crítica que muestra el origen de Ultron en el MCU."
  },
  {
    minifigure_no: 'sh0170',
    description_en: "Thor with spongy cape and dark blue legs brings enhanced quality to the God of Thunder. This Age of Ultron variant features improved cape material. The darker legs distinguish this version from earlier Thor minifigures. A premium quality variant essential for MCU Phase 2 collections.",
    description_de: "Thor mit schwammigem Cape und dunkelblauen Beinen bringt verbesserte Qualität zum Gott des Donners. Diese Age of Ultron-Variante zeigt verbesserte Cape-Material. Die dunkleren Beine unterscheiden diese Version von früheren Thor-Minifiguren. Eine Premium-Qualitätsvariante, unverzichtbar für MCU Phase 2-Sammlungen.",
    description_fr: "Thor avec cape spongieuse et jambes bleu foncé apporte qualité améliorée au Dieu du Tonnerre. Cette variante Age of Ultron présente un matériau de cape amélioré. Les jambes plus foncées distinguent cette version des figurines Thor antérieures. Une variante de qualité premium essentielle pour les collections MCU Phase 2.",
    description_es: "Thor con capa esponjosa y piernas azul oscuro aporta calidad mejorada al Dios del Trueno. Esta variante de Age of Ultron presenta material de capa mejorado. Las piernas más oscuras distinguen esta versión de minifiguras anteriores de Thor. Una variante de calidad premium esencial para colecciones de MCU Fase 2."
  },
  {
    minifigure_no: 'sh0171',
    description_en: "Hydra Henchman in Chitauri armor represents the terrorist organization's use of alien technology. These soldiers combine Hydra ideology with advanced alien weaponry. Essential army builders bridging Winter Soldier and Age of Ultron storylines. Perfect for creating hybrid threat force displays.",
    description_de: "Hydra-Handlanger in Chitauri-Rüstung repräsentiert die Verwendung außerirdischer Technologie durch die Terrororganisation. Diese Soldaten kombinieren Hydra-Ideologie mit fortgeschrittener außerirdischer Bewaffnung. Unverzichtbare Armee-Baumeister, die Winter Soldier- und Age of Ultron-Handlungen verbinden. Perfekt für die Erstellung hybrider Bedrohungs-Kraft-Displays.",
    description_fr: "Sbire Hydra en armure Chitauri représente l'utilisation de technologie extraterrestre par l'organisation terroriste. Ces soldats combinent idéologie Hydra avec armement extraterrestre avancé. Constructeurs d'armée essentiels reliant les intrigues Winter Soldier et Age of Ultron. Parfait pour créer des affichages de force de menace hybride.",
    description_es: "Secuaz de Hydra en armadura Chitauri representa el uso de tecnología alienígena por la organización terrorista. Estos soldados combinan ideología Hydra con armamento alienígena avanzado. Constructores de ejército esenciales que unen historias de Winter Soldier y Age of Ultron. Perfecto para crear exhibiciones de fuerza de amenaza híbrida."
  },
  {
    minifigure_no: 'sh0172',
    description_en: "Hawkeye's black and dark red suit with reddish brown spiked hair shows his Age of Ultron appearance. Clint Barton's master archer skills remain crucial despite lacking superpowers. This variant captures his evolved costume design. Essential for complete Avengers team lineup displays.",
    description_de: "Hawkeyes schwarzer und dunkelroter Anzug mit rotbraunem stacheligem Haar zeigt sein Age of Ultron-Aussehen. Clint Bartons Meister-Bogenschützen-Fähigkeiten bleiben entscheidend, trotz fehlender Superkräfte. Diese Variante erfasst sein weiterentwickeltes Kostüm-Design. Unverzichtbar für vollständige Avengers-Team-Lineup-Displays.",
    description_fr: "Le costume noir et rouge foncé de Hawkeye avec cheveux brun rougeâtre hérissés montre son apparence Age of Ultron. Les compétences d'archer maître de Clint Barton restent cruciales malgré l'absence de superpouvoirs. Cette variante capture son design de costume évolué. Essentiel pour affichages complets d'alignement d'équipe Avengers.",
    description_es: "El traje negro y rojo oscuro de Hawkeye con cabello castaño rojizo puntiagudo muestra su apariencia de Age of Ultron. Las habilidades de arquero maestro de Clint Barton permanecen cruciales a pesar de carecer de superpoderes. Esta variante captura su diseño de traje evolucionado. Esencial para exhibiciones completas de alineación de equipo Vengadores."
  },
  {
    minifigure_no: 'sh0173',
    description_en: "Hulk with Avengers logo on dark purple pants represents team unity. This giant figure variant shows Bruce Banner's alter ego fighting alongside heroes. The team emblem signifies Hulk's role as essential Avenger. A powerful centerpiece for Age of Ultron collections.",
    description_de: "Hulk mit Avengers-Logo auf dunkelvioletten Hosen repräsentiert Team-Einheit. Diese Riesenfigur-Variante zeigt Bruce Banners Alter Ego, das an der Seite von Helden kämpft. Das Team-Emblem bedeutet Hulks Rolle als unverzichtbarer Avenger. Ein mächtiges Herzstück für Age of Ultron-Sammlungen.",
    description_fr: "Hulk avec logo Avengers sur pantalon violet foncé représente l'unité d'équipe. Cette variante de figurine géante montre l'alter ego de Bruce Banner combattant aux côtés de héros. L'emblème d'équipe signifie le rôle de Hulk comme Avenger essentiel. Une pièce maîtresse puissante pour les collections Age of Ultron.",
    description_es: "Hulk con logo de Vengadores en pantalones morado oscuro representa unidad de equipo. Esta variante de figura gigante muestra el alter ego de Bruce Banner luchando junto a héroes. El emblema de equipo significa el rol de Hulk como Vengador esencial. Una pieza central poderosa para colecciones de Age of Ultron."
  },
  {
    minifigure_no: 'sh0174',
    description_en: "Scarlet Witch with printed legs and reddish brown hair captures Wanda Maximoff's MCU debut. Her reality-altering powers make her one of Marvel's most formidable characters. This Age of Ultron variant showcases her origin story appearance. Essential for chronicling her evolution from antagonist to Avenger.",
    description_de: "Scarlet Witch mit bedruckten Beinen und rotbraunem Haar erfasst Wanda Maximoffs MCU-Debüt. Ihre realitätsverändernden Kräfte machen sie zu einer der beeindruckendsten Marvel-Figuren. Diese Age of Ultron-Variante zeigt ihr Ursprungsgeschichten-Aussehen. Unverzichtbar für die Chronik ihrer Evolution von Antagonistin zu Avenger.",
    description_fr: "Scarlet Witch avec jambes imprimées et cheveux brun rougeâtre capture les débuts MCU de Wanda Maximoff. Ses pouvoirs altérant la réalité font d'elle l'un des personnages Marvel les plus formidables. Cette variante Age of Ultron présente son apparence d'histoire d'origine. Essentiel pour chronicler son évolution d'antagoniste à Avenger.",
    description_es: "Bruja Escarlata con piernas impresas y cabello castaño rojizo captura el debut MCU de Wanda Maximoff. Sus poderes que alteran la realidad la convierten en uno de los personajes más formidables de Marvel. Esta variante de Age of Ultron muestra su apariencia de historia de origen. Esencial para relatar su evolución de antagonista a Vengadora."
  },
  {
    minifigure_no: 'sh0175',
    description_en: "Ultron Prime represents the villain's ultimate evolved form. This perfected body combines vibranium construction with deadly weaponry. The imposing figure showcases Ultron's final threatening appearance. An essential centerpiece villain for Age of Ultron displays and Avengers versus AI storylines.",
    description_de: "Ultron Prime repräsentiert die ultimative evolvierte Form des Schurken. Dieser perfektionierte Körper kombiniert Vibranium-Konstruktion mit tödlicher Bewaffnung. Die imposante Figur zeigt Ultrons finale bedrohliche Erscheinung. Ein unverzichtbarer Herzstück-Schurke für Age of Ultron-Displays und Avengers-gegen-KI-Handlungen.",
    description_fr: "Ultron Prime représente la forme évoluée ultime du méchant. Ce corps perfectionné combine construction en vibranium avec armement mortel. La figurine imposante présente l'apparence menaçante finale d'Ultron. Une pièce maîtresse de méchant essentielle pour affichages Age of Ultron et intrigues Avengers contre IA.",
    description_es: "Ultron Prime representa la forma evolucionada definitiva del villano. Este cuerpo perfeccionado combina construcción de vibranium con armamento mortal. La figura imponente muestra la apariencia amenazante final de Ultron. Una pieza central de villano esencial para exhibiciones de Age of Ultron e historias de Vengadores versus IA."
  }
];

async function main() {
  console.log(`🦸 Starting Super Heroes batch sh0151-sh0175 (${descriptions.length} minifigs)...`);
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
  console.log(`✅ Batch complete! ${descriptions.length} minifigs saved. Total: 175 done.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
