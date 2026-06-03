import { PrismaClient as PrismaClientHostinger } from '@prisma/client';

const prisma = new PrismaClientHostinger({
  datasources: {
    db: {
      url: "mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker"
    }
  }
});

const descriptions = [
  {
    minifigure_no: 'sh0101',
    description_en: "MODOK (Mental Organism Designed Only for Killing) represents one of Marvel's most unique villain designs. Created by AIM scientists, George Tarleton was transformed into a giant-headed bio-computer. This large-format minifigure perfectly captures his distinctive oversized head, tiny limbs, and hover-chair. A must-have for Marvel collectors interested in obscure yet iconic characters.",
    description_de: "MODOK (Mental Organism Designed Only for Killing) repräsentiert eines der einzigartigsten Schurken-Designs von Marvel. Der von AIM-Wissenschaftlern geschaffene George Tarleton wurde in einen riesenkopfigen Bio-Computer verwandelt. Diese großformatige Minifigur erfasst perfekt seinen charakteristischen übergroßen Kopf, winzigen Gliedmaßen und Schwebestuhl. Ein Muss für Marvel-Sammler, die sich für obskure, aber ikonische Charaktere interessieren.",
    description_fr: "MODOK (Mental Organism Designed Only for Killing) représente l'un des designs de méchants les plus uniques de Marvel. Créé par des scientifiques de l'AIM, George Tarleton a été transformé en bio-ordinateur à tête géante. Cette figurine grand format capture parfaitement sa tête démesurée distinctive, ses petits membres et son fauteuil flottant. Un incontournable pour les collectionneurs Marvel intéressés par des personnages obscurs mais iconiques.",
    description_es: "MODOK (Organismo Mental Diseñado Solo para Matar) representa uno de los diseños de villanos más únicos de Marvel. Creado por científicos de AIM, George Tarleton fue transformado en una bio-computadora de cabeza gigante. Esta minifigura de gran formato captura perfectamente su distintiva cabeza descomunal, extremidades diminutas y silla flotante. Imprescindible para coleccionistas de Marvel interesados en personajes oscuros pero icónicos."
  },
  {
    minifigure_no: 'sh0102',
    description_en: "The Green Goblin emerges as one of Spider-Man's most dangerous and psychologically complex enemies. Norman Osborn's alter ego combines superhuman strength with genius-level intellect and insanity. This large-format figure features his olive green skin, menacing expression, and imposing size. Essential for any Spider-Man collection, representing the ultimate tragic villain.",
    description_de: "Der Grüne Kobold erscheint als einer der gefährlichsten und psychologisch komplexesten Feinde von Spider-Man. Norman Osborns Alter Ego kombiniert übermenschliche Stärke mit genialem Intellekt und Wahnsinn. Diese großformatige Figur zeigt seine olivgrüne Haut, bedrohlichen Ausdruck und imposante Größe. Unverzichtbar für jede Spider-Man-Sammlung als ultimativer tragischer Schurke.",
    description_fr: "Le Bouffon Vert émerge comme l'un des ennemis les plus dangereux et psychologiquement complexes de Spider-Man. L'alter ego de Norman Osborn combine force surhumaine avec intellect de génie et folie. Cette figurine grand format présente sa peau vert olive, expression menaçante et taille imposante. Essentiel pour toute collection Spider-Man, représentant le méchant tragique ultime.",
    description_es: "El Duende Verde emerge como uno de los enemigos más peligrosos y psicológicamente complejos de Spider-Man. El alter ego de Norman Osborn combina fuerza sobrehumana con intelecto genial y locura. Esta figura de gran formato presenta su piel verde oliva, expresión amenazante y tamaño imponente. Esencial para cualquier colección de Spider-Man, representando al villano trágico definitivo."
  },
  {
    minifigure_no: 'sh0103',
    description_en: "Mary Jane Watson stands as one of the most iconic supporting characters in Spider-Man's life. The fashionable model and actress brings both glamour and courage to the Marvel universe. This minifigure captures her distinctive red hair and confident personality. Highly collectible as Peter Parker's most significant love interest.",
    description_de: "Mary Jane Watson gilt als eine der ikonischsten Nebenfiguren in Spider-Mans Leben. Das modische Model und die Schauspielerin bringen sowohl Glamour als auch Mut ins Marvel-Universum. Diese Minifigur erfasst ihr charakteristisches rotes Haar und selbstbewusste Persönlichkeit. Sehr sammelwürdig als Peter Parkers bedeutendste Liebesinteresse.",
    description_fr: "Mary Jane Watson se présente comme l'un des personnages secondaires les plus emblématiques de la vie de Spider-Man. Le mannequin et actrice à la mode apporte à la fois glamour et courage à l'univers Marvel. Cette figurine capture ses cheveux roux distinctifs et sa personnalité confiante. Très collectionnable en tant qu'intérêt amoureux le plus significatif de Peter Parker.",
    description_es: "Mary Jane Watson se erige como uno de los personajes secundarios más icónicos en la vida de Spider-Man. La modelo y actriz de moda aporta tanto glamour como valentía al universo Marvel. Esta minifigura captura su distintivo cabello rojo y personalidad segura. Altamente coleccionable como el interés amoroso más significativo de Peter Parker."
  },
  {
    minifigure_no: 'sh0104',
    description_en: "Power Man (Luke Cage) brings street-level heroism and unbreakable skin to the Marvel universe. A hero for hire from Harlem, his super-strength and invulnerability make him a formidable defender of the innocent. This minifigure showcases his iconic yellow shirt and silver tiara. A key figure in Marvel's diverse hero roster.",
    description_de: "Power Man (Luke Cage) bringt Heldentum auf Straßenniveau und unzerbrechliche Haut ins Marvel-Universum. Ein Held zur Miete aus Harlem, seine Superstärke und Unverwundbarkeit machen ihn zu einem beeindruckenden Verteidiger der Unschuldigen. Diese Minifigur zeigt sein ikonisches gelbes Hemd und silbernes Diadem. Eine Schlüsselfigur in Marvels vielfältigem Helden-Kader.",
    description_fr: "Power Man (Luke Cage) apporte l'héroïsme de rue et une peau incassable à l'univers Marvel. Un héros à louer de Harlem, sa super-force et invulnérabilité font de lui un défenseur formidable des innocents. Cette figurine présente sa chemise jaune emblématique et son diadème argenté. Une figure clé dans le roster diversifié de héros Marvel.",
    description_es: "Power Man (Luke Cage) aporta heroísmo callejero y piel irrompible al universo Marvel. Un héroe de alquiler de Harlem, su superfuerza e invulnerabilidad lo convierten en un formidable defensor de los inocentes. Esta minifigura muestra su icónica camisa amarilla y diadema plateada. Una figura clave en el diverso plantel de héroes de Marvel."
  },
  {
    minifigure_no: 'sh0105',
    description_en: "Electro commands the power of electricity, making him one of Spider-Man's most visually striking and dangerous foes. Max Dillon's transformation into a living electrical generator gave him devastating offensive capabilities. This minifigure features translucent medium blue elements capturing his electrical nature. A fan-favorite villain essential for Spider-Man collections.",
    description_de: "Electro beherrscht die Kraft der Elektrizität und ist damit einer der visuell auffälligsten und gefährlichsten Feinde von Spider-Man. Max Dillons Verwandlung in einen lebenden elektrischen Generator verlieh ihm verheerende Offensivfähigkeiten. Diese Minifigur zeigt durchscheinende mittelblaue Elemente, die seine elektrische Natur erfassen. Ein bei Fans beliebter Schurke, unverzichtbar für Spider-Man-Sammlungen.",
    description_fr: "Electro commande le pouvoir de l'électricité, ce qui en fait l'un des ennemis les plus visuellement frappants et dangereux de Spider-Man. La transformation de Max Dillon en générateur électrique vivant lui a donné des capacités offensives dévastatrices. Cette figurine présente des éléments bleu moyen translucides capturant sa nature électrique. Un méchant favori des fans essentiel pour les collections Spider-Man.",
    description_es: "Electro domina el poder de la electricidad, convirtiéndolo en uno de los enemigos más visualmente impactantes y peligrosos de Spider-Man. La transformación de Max Dillon en un generador eléctrico viviente le otorgó capacidades ofensivas devastadoras. Esta minifigura presenta elementos azul medio translúcidos que capturan su naturaleza eléctrica. Un villano favorito de los fans esencial para colecciones de Spider-Man."
  },
  {
    minifigure_no: 'sh0106',
    description_en: "Captain America embodies patriotism, justice, and unwavering moral courage. Steve Rogers, the first Avenger, leads by example with super-soldier abilities and tactical genius. This variant features his classic blue suit with red hands and full mask. A cornerstone minifigure for any Marvel collection, representing America's greatest hero.",
    description_de: "Captain America verkörpert Patriotismus, Gerechtigkeit und unerschütterlichen moralischen Mut. Steve Rogers, der erste Avenger, führt mit gutem Beispiel voran mit Super-Soldaten-Fähigkeiten und taktischem Genie. Diese Variante zeigt seinen klassischen blauen Anzug mit roten Händen und vollständiger Maske. Eine Eckpfeiler-Minifigur für jede Marvel-Sammlung, die Amerikas größten Helden repräsentiert.",
    description_fr: "Captain America incarne le patriotisme, la justice et le courage moral inébranlable. Steve Rogers, le premier Avenger, dirige par l'exemple avec des capacités de super-soldat et un génie tactique. Cette variante présente son costume bleu classique avec mains rouges et masque complet. Une figurine pierre angulaire pour toute collection Marvel, représentant le plus grand héros de l'Amérique.",
    description_es: "El Capitán América encarna patriotismo, justicia y coraje moral inquebrantable. Steve Rogers, el primer Vengador, lidera con el ejemplo con habilidades de supersoldado y genio táctico. Esta variante presenta su clásico traje azul con manos rojas y máscara completa. Una minifigura fundamental para cualquier colección Marvel, representando al héroe más grande de América."
  },
  {
    minifigure_no: 'sh0107',
    description_en: "Red Skull stands as Captain America's ultimate nemesis and symbol of pure evil. Johann Schmidt's transformation into the Red Skull created one of Marvel's most feared terrorists. This variant features his distinctive dark brown belt and Nazi symbolism. A critical villain piece representing the darkest threats in the Marvel universe.",
    description_de: "Red Skull steht als Captain Americas ultimativer Nemesis und Symbol des reinen Bösen. Johann Schmidts Verwandlung in den Red Skull schuf einen der gefürchtetsten Terroristen von Marvel. Diese Variante zeigt seinen charakteristischen dunkelbraunen Gürtel und Nazi-Symbolik. Ein kritisches Schurken-Teil, das die dunkelsten Bedrohungen im Marvel-Universum repräsentiert.",
    description_fr: "Red Skull se présente comme le némésis ultime de Captain America et symbole du mal pur. La transformation de Johann Schmidt en Red Skull a créé l'un des terroristes les plus redoutés de Marvel. Cette variante présente sa ceinture marron foncé distinctive et symbolisme nazi. Une pièce de méchant critique représentant les menaces les plus sombres de l'univers Marvel.",
    description_es: "Cráneo Rojo se erige como el némesis definitivo del Capitán América y símbolo del mal puro. La transformación de Johann Schmidt en Cráneo Rojo creó uno de los terroristas más temidos de Marvel. Esta variante presenta su distintivo cinturón marrón oscuro y simbolismo nazi. Una pieza de villano crítica que representa las amenazas más oscuras del universo Marvel."
  },
  {
    minifigure_no: 'sh0108',
    description_en: "The Hydra Henchman represents the endless army of fanatics serving the terrorist organization Hydra. These loyal soldiers carry out Red Skull's sinister plans across the Marvel universe. Essential army builders for creating authentic Hydra forces to battle Captain America and the Avengers. Multiple copies enhance any Captain America display.",
    description_de: "Der Hydra-Handlanger repräsentiert die endlose Armee von Fanatikern, die der Terrororganisation Hydra dienen. Diese loyalen Soldaten führen Red Skulls finstere Pläne im gesamten Marvel-Universum aus. Unverzichtbare Armee-Baumeister für die Erstellung authentischer Hydra-Kräfte, um gegen Captain America und die Avengers zu kämpfen. Mehrere Exemplare verbessern jede Captain America-Ausstellung.",
    description_fr: "Le Sbire Hydra représente l'armée sans fin de fanatiques servant l'organisation terroriste Hydra. Ces soldats loyaux exécutent les plans sinistres de Red Skull à travers l'univers Marvel. Constructeurs d'armée essentiels pour créer des forces Hydra authentiques pour combattre Captain America et les Avengers. Plusieurs exemplaires améliorent tout affichage Captain America.",
    description_es: "El Secuaz de Hydra representa el ejército interminable de fanáticos que sirven a la organización terrorista Hydra. Estos soldados leales ejecutan los planes siniestros de Cráneo Rojo a través del universo Marvel. Constructores de ejército esenciales para crear fuerzas Hydra auténticas para batallar contra el Capitán América y los Vengadores. Múltiples copias mejoran cualquier exhibición del Capitán América."
  },
  {
    minifigure_no: 'sh0109',
    description_en: "The Armored Truck Driver represents civilians caught in superhero battles and heists. These security personnel face extraordinary dangers transporting valuable cargo in the Marvel universe. This minifigure adds realism to action displays and bank heist scenarios. A great supporting character for creating dynamic Marvel storylines.",
    description_de: "Der gepanzerte Lastwagenfahrer repräsentiert Zivilisten, die in Superhelden-Kämpfe und Überfälle geraten. Diese Sicherheitskräfte begegnen außergewöhnlichen Gefahren beim Transport wertvoller Fracht im Marvel-Universum. Diese Minifigur fügt Action-Displays und Bankraub-Szenarien Realismus hinzu. Eine großartige Nebenfigur für die Erstellung dynamischer Marvel-Handlungen.",
    description_fr: "Le Conducteur de Camion Blindé représente des civils pris dans des batailles de super-héros et des casses. Ces personnels de sécurité font face à des dangers extraordinaires en transportant des cargaisons précieuses dans l'univers Marvel. Cette figurine ajoute du réalisme aux affichages d'action et scénarios de braquage de banque. Un excellent personnage secondaire pour créer des intrigues Marvel dynamiques.",
    description_es: "El Conductor de Camión Blindado representa civiles atrapados en batallas de superhéroes y atracos. Este personal de seguridad enfrenta peligros extraordinarios transportando carga valiosa en el universo Marvel. Esta minifigura añade realismo a exhibiciones de acción y escenarios de atraco a bancos. Un gran personaje secundario para crear historias dinámicas de Marvel."
  },
  {
    minifigure_no: 'sh0110',
    description_en: "Doctor Octopus (Otto Octavius) combines scientific genius with mechanical arms in one of Spider-Man's most iconic foes. The brilliant scientist's fusion with his tentacle apparatus created a formidable villain. This minifigure features his white lab coat over bright green outfit and mechanical arms. A must-have centerpiece for Spider-Man villain collections.",
    description_de: "Doctor Octopus (Otto Octavius) kombiniert wissenschaftliches Genie mit mechanischen Armen in einem der ikonischsten Feinde von Spider-Man. Die Fusion des brillanten Wissenschaftlers mit seiner Tentakel-Apparatur schuf einen beeindruckenden Schurken. Diese Minifigur zeigt seinen weißen Laborkittel über hellgrünem Outfit und mechanischen Armen. Ein unverzichtbares Herzstück für Spider-Man-Schurken-Sammlungen.",
    description_fr: "Doctor Octopus (Otto Octavius) combine génie scientifique avec bras mécaniques dans l'un des ennemis les plus emblématiques de Spider-Man. La fusion du brillant scientifique avec son appareil à tentacules a créé un méchant formidable. Cette figurine présente sa blouse blanche de laboratoire sur tenue vert vif et bras mécaniques. Une pièce maîtresse incontournable pour les collections de méchants Spider-Man.",
    description_es: "Doctor Octopus (Otto Octavius) combina genio científico con brazos mecánicos en uno de los enemigos más icónicos de Spider-Man. La fusión del brillante científico con su aparato de tentáculos creó un villano formidable. Esta minifigura presenta su bata de laboratorio blanca sobre traje verde brillante y brazos mecánicos. Una pieza central imprescindible para colecciones de villanos de Spider-Man."
  },
  {
    minifigure_no: 'sh0111',
    description_en: "Batman's light bluish gray suit represents one of his classic costume variations. The Dark Knight's yellow belt and crest contrast beautifully with the blue mask and cape. This color scheme pays homage to Silver Age Batman comics. A nostalgic addition for collectors appreciating Batman's evolving costume history.",
    description_de: "Batmans hellblaugrauer Anzug repräsentiert eine seiner klassischen Kostüm-Variationen. Der gelbe Gürtel und das Wappen des Dark Knight kontrastieren schön mit der blauen Maske und dem Cape. Dieses Farbschema zollt Silver Age Batman-Comics Tribut. Eine nostalgische Ergänzung für Sammler, die Batmans sich entwickelnde Kostümgeschichte schätzen.",
    description_fr: "Le costume gris bleuté clair de Batman représente l'une de ses variations de costume classiques. La ceinture et l'écusson jaunes du Chevalier Noir contrastent magnifiquement avec le masque et la cape bleus. Cette palette de couleurs rend hommage aux comics Batman de l'Âge d'Argent. Un ajout nostalgique pour les collectionneurs appréciant l'histoire évolutive du costume de Batman.",
    description_es: "El traje gris azulado claro de Batman representa una de sus variaciones de traje clásicas. El cinturón y emblema amarillos del Caballero Oscuro contrastan bellamente con la máscara y capa azules. Este esquema de color rinde homenaje a los cómics de Batman de la Edad de Plata. Una adición nostálgica para coleccionistas que aprecian la historia evolutiva del traje de Batman."
  },
  {
    minifigure_no: 'sh0112',
    description_en: "Robin's very short cape variant represents the Boy Wonder in a more practical crime-fighting configuration. Dick Grayson's acrobatic skills shine through this streamlined design. Perfect for dynamic action poses without cape interference. A unique variant appealing to collectors seeking every Robin variation.",
    description_de: "Robins sehr kurzer Cape-Variante repräsentiert den Boy Wonder in einer praktischeren Verbrechensbekämpfungs-Konfiguration. Dick Graysons akrobatische Fähigkeiten glänzen durch dieses stromlinienförmige Design. Perfekt für dynamische Action-Posen ohne Cape-Interferenz. Eine einzigartige Variante, die Sammler anzieht, die jede Robin-Variation suchen.",
    description_fr: "La variante de Robin avec cape très courte représente le Boy Wonder dans une configuration de lutte contre le crime plus pratique. Les compétences acrobatiques de Dick Grayson brillent à travers ce design épuré. Parfait pour des poses d'action dynamiques sans interférence de cape. Une variante unique attirant les collectionneurs recherchant chaque variation de Robin.",
    description_es: "La variante de Robin con capa muy corta representa al Joven Maravilla en una configuración de lucha contra el crimen más práctica. Las habilidades acrobáticas de Dick Grayson brillan a través de este diseño aerodinámico. Perfecto para poses de acción dinámicas sin interferencia de capa. Una variante única que atrae a coleccionistas que buscan cada variación de Robin."
  },
  {
    minifigure_no: 'sh0113',
    description_en: "Venom emerges with teeth together in this menacing variant of Spider-Man's most dangerous symbiote enemy. Eddie Brock's fusion with the alien symbiote created a monster with Spider-Man's powers plus brutal strength. This design captures Venom's terrifying closed-mouth expression. Essential for collectors seeking the definitive Venom representation.",
    description_de: "Venom erscheint mit zusammengepressten Zähnen in dieser bedrohlichen Variante von Spider-Mans gefährlichstem Symbioten-Feind. Eddie Brocks Fusion mit dem außerirdischen Symbioten schuf ein Monster mit Spider-Mans Kräften plus brutaler Stärke. Dieses Design erfasst Venoms erschreckenden Ausdruck mit geschlossenem Mund. Unverzichtbar für Sammler, die die definitive Venom-Darstellung suchen.",
    description_fr: "Venom émerge avec dents ensemble dans cette variante menaçante de l'ennemi symbiote le plus dangereux de Spider-Man. La fusion d'Eddie Brock avec le symbiote extraterrestre a créé un monstre avec les pouvoirs de Spider-Man plus une force brutale. Ce design capture l'expression terrifiante de Venom à bouche fermée. Essentiel pour les collectionneurs recherchant la représentation définitive de Venom.",
    description_es: "Venom emerge con dientes juntos en esta variante amenazante del enemigo simbionte más peligroso de Spider-Man. La fusión de Eddie Brock con el simbionte alienígena creó un monstruo con los poderes de Spider-Man más fuerza brutal. Este diseño captura la aterradora expresión de boca cerrada de Venom. Esencial para coleccionistas que buscan la representación definitiva de Venom."
  },
  {
    minifigure_no: 'sh0114',
    description_en: "Martian Manhunter (J'onn J'onzz) brings alien perspective and vast powers to the Justice League. One of DC's most powerful heroes, his shapeshifting, telepathy, and super-strength make him invaluable. This minifigure showcases his distinctive green Martian appearance. A cornerstone piece for comprehensive Justice League collections.",
    description_de: "Martian Manhunter (J'onn J'onzz) bringt außerirdische Perspektive und gewaltige Kräfte zur Justice League. Als einer der mächtigsten Helden von DC machen seine Gestaltwandlung, Telepathie und Superstärke ihn unschätzbar. Diese Minifigur zeigt sein charakteristisches grünes marsianisches Aussehen. Ein Eckpfeiler für umfassende Justice League-Sammlungen.",
    description_fr: "Martian Manhunter (J'onn J'onzz) apporte perspective extraterrestre et vastes pouvoirs à la Justice League. L'un des héros les plus puissants de DC, sa métamorphose, télépathie et super-force le rendent inestimable. Cette figurine présente son apparence martienne verte distinctive. Une pièce pierre angulaire pour des collections Justice League complètes.",
    description_es: "Martian Manhunter (J'onn J'onzz) aporta perspectiva alienígena y vastos poderes a la Liga de la Justicia. Uno de los héroes más poderosos de DC, su cambio de forma, telepatía y superfuerza lo hacen invaluable. Esta minifigura muestra su distintiva apariencia marciana verde. Una pieza fundamental para colecciones completas de la Liga de la Justicia."
  },
  {
    minifigure_no: 'sh0115',
    description_en: "Spider-Man's black web pattern with red hips represents a distinctive costume variation. This design showcases Peter Parker's evolving suit aesthetics while maintaining classic Spider-Man elements. The color combination creates visual interest for display purposes. A valuable variant for completionist Spider-Man collectors.",
    description_de: "Spider-Mans schwarzes Netzmuster mit roten Hüften repräsentiert eine charakteristische Kostüm-Variation. Dieses Design zeigt Peter Parkers sich entwickelnde Anzugästhetik, während es klassische Spider-Man-Elemente beibehält. Die Farbkombination schafft visuelles Interesse für Ausstellungszwecke. Eine wertvolle Variante für vervollständigende Spider-Man-Sammler.",
    description_fr: "Le motif de toile noire avec hanches rouges de Spider-Man représente une variation de costume distinctive. Ce design présente l'esthétique évolutive du costume de Peter Parker tout en conservant des éléments Spider-Man classiques. La combinaison de couleurs crée un intérêt visuel à des fins d'affichage. Une variante précieuse pour les collectionneurs complétistes de Spider-Man.",
    description_es: "El patrón de telaraña negra con caderas rojas de Spider-Man representa una variación de traje distintiva. Este diseño muestra la estética evolutiva del traje de Peter Parker mientras mantiene elementos clásicos de Spider-Man. La combinación de colores crea interés visual para propósitos de exhibición. Una variante valiosa para coleccionistas completistas de Spider-Man."
  },
  {
    minifigure_no: 'sh0116',
    description_en: "Storm commands the weather with godlike power as one of the X-Men's most formidable members. Ororo Munroe's mastery of meteorological forces makes her a natural leader. This black suit variant showcases her regal bearing and elemental control. Essential for X-Men collections, representing mutant royalty.",
    description_de: "Storm beherrscht das Wetter mit gottähnlicher Macht als eines der beeindruckendsten Mitglieder der X-Men. Ororo Munroes Beherrschung meteorologischer Kräfte macht sie zu einer natürlichen Führerin. Diese schwarze Anzugvariante zeigt ihre königliche Haltung und elementare Kontrolle. Unverzichtbar für X-Men-Sammlungen, repräsentiert Mutanten-Königtum.",
    description_fr: "Storm commande la météo avec un pouvoir divin comme l'un des membres les plus formidables des X-Men. La maîtrise des forces météorologiques d'Ororo Munroe fait d'elle une leader naturelle. Cette variante en costume noir met en valeur son allure royale et contrôle élémentaire. Essentiel pour les collections X-Men, représentant la royauté mutante.",
    description_es: "Tormenta comanda el clima con poder divino como uno de los miembros más formidables de los X-Men. El dominio de las fuerzas meteorológicas de Ororo Munroe la convierte en una líder natural. Esta variante de traje negro muestra su porte regio y control elemental. Esencial para colecciones de X-Men, representando realeza mutante."
  },
  {
    minifigure_no: 'sh0117',
    description_en: "Cyclops leads the X-Men with tactical brilliance and devastating optic blasts. Scott Summers' ruby-quartz visor contains uncontrollable energy beams. This dark blue outfit variant represents his field commander persona. A cornerstone minifigure for X-Men team displays, embodying mutant leadership.",
    description_de: "Cyclops führt die X-Men mit taktischer Brillanz und verheerenden optischen Strahlen. Scott Summers' Rubin-Quarz-Visier enthält unkontrollierbare Energiestrahlen. Diese dunkelblaue Outfit-Variante repräsentiert seine Feldkommandanten-Persona. Eine Eckpfeiler-Minifigur für X-Men-Team-Displays, die Mutanten-Führung verkörpert.",
    description_fr: "Cyclops dirige les X-Men avec brillance tactique et explosions optiques dévastatrices. La visière en quartz rubis de Scott Summers contient des faisceaux d'énergie incontrôlables. Cette variante de tenue bleu foncé représente son personnage de commandant sur le terrain. Une figurine pierre angulaire pour les affichages d'équipe X-Men, incarnant le leadership mutant.",
    description_es: "Cíclope lidera a los X-Men con brillantez táctica y devastadores rayos ópticos. La visera de cuarzo rubí de Scott Summers contiene rayos de energía incontrolables. Esta variante de traje azul oscuro representa su personaje de comandante de campo. Una minifigura fundamental para exhibiciones de equipo X-Men, encarnando liderazgo mutante."
  },
  {
    minifigure_no: 'sh0118',
    description_en: "Wolverine slashes through enemies with adamantium claws and berserker rage. Logan's healing factor and indestructible skeleton make him nearly unkillable. This variant features bright light orange and black mask with dark brown hands. One of Marvel's most popular characters, essential for any superhero collection.",
    description_de: "Wolverine schlitzt Feinde auf mit Adamantium-Klauen und Berserker-Wut. Logans Heilungsfaktor und unzerstörbares Skelett machen ihn nahezu untötbar. Diese Variante zeigt hellleuchtendes Orange und schwarze Maske mit dunkelbraunen Händen. Eine der beliebtesten Marvel-Figuren, unverzichtbar für jede Superhelden-Sammlung.",
    description_fr: "Wolverine lacère les ennemis avec griffes d'adamantium et rage de berserker. Le facteur de guérison et le squelette indestructible de Logan le rendent presque impossible à tuer. Cette variante présente masque orange vif et noir avec mains marron foncé. L'un des personnages Marvel les plus populaires, essentiel pour toute collection de super-héros.",
    description_es: "Wolverine desgarra enemigos con garras de adamantium y furia berserker. El factor de curación y esqueleto indestructible de Logan lo hacen casi imposible de matar. Esta variante presenta máscara naranja brillante y negra con manos marrón oscuro. Uno de los personajes más populares de Marvel, esencial para cualquier colección de superhéroes."
  },
  {
    minifigure_no: 'sh0119',
    description_en: "Magneto manipulates magnetic fields with terrifying precision, making him one of the X-Men's most dangerous adversaries. Erik Lehnsherr's tragic past fuels his militant mutant supremacy ideology. This dark purple outfit represents his iconic Master of Magnetism persona. A critical villain piece for X-Men storylines and displays.",
    description_de: "Magneto manipuliert Magnetfelder mit erschreckender Präzision und ist damit einer der gefährlichsten Gegner der X-Men. Erik Lehnsherrs tragische Vergangenheit befeuert seine militante Mutanten-Vorherrschafts-Ideologie. Dieses dunkelviolette Outfit repräsentiert seine ikonische Meister des Magnetismus-Persona. Ein kritisches Schurken-Teil für X-Men-Handlungen und Displays.",
    description_fr: "Magneto manipule les champs magnétiques avec précision terrifiante, ce qui en fait l'un des adversaires les plus dangereux des X-Men. Le passé tragique d'Erik Lehnsherr alimente son idéologie militante de suprématie mutante. Cette tenue violette foncée représente son personnage emblématique de Maître du Magnétisme. Une pièce de méchant critique pour les intrigues et affichages X-Men.",
    description_es: "Magneto manipula campos magnéticos con precisión aterradora, convirtiéndolo en uno de los adversarios más peligrosos de los X-Men. El pasado trágico de Erik Lehnsherr alimenta su ideología militante de supremacía mutante. Este traje morado oscuro representa su icónica persona de Maestro del Magnetismo. Una pieza de villano crítica para historias y exhibiciones de X-Men."
  },
  {
    minifigure_no: 'sh0120',
    description_en: "The Sakaaran soldier represents the alien warrior race from the planet Sakaar. These fierce combatants appeared in the Guardians of the Galaxy storyline. With distinctive armor and weaponry, they add cosmic scope to Marvel displays. Essential army builders for creating authentic Guardians of the Galaxy battle scenes.",
    description_de: "Der Sakaaran-Soldat repräsentiert die außerirdische Kriegerrasse vom Planeten Sakaar. Diese wilden Kämpfer erschienen in der Guardians of the Galaxy-Handlung. Mit charakteristischer Rüstung und Bewaffnung fügen sie kosmischen Umfang zu Marvel-Displays hinzu. Unverzichtbare Armee-Baumeister für die Erstellung authentischer Guardians of the Galaxy-Kampfszenen.",
    description_fr: "Le soldat Sakaaran représente la race guerrière extraterrestre de la planète Sakaar. Ces combattants féroces sont apparus dans l'intrigue des Gardiens de la Galaxie. Avec armure et armement distinctifs, ils ajoutent une portée cosmique aux affichages Marvel. Constructeurs d'armée essentiels pour créer des scènes de bataille Gardiens de la Galaxie authentiques.",
    description_es: "El soldado Sakaaran representa la raza guerrera alienígena del planeta Sakaar. Estos combatientes feroces aparecieron en la historia de Guardianes de la Galaxia. Con armadura y armamento distintivos, añaden alcance cósmico a exhibiciones Marvel. Constructores de ejército esenciales para crear escenas de batalla auténticas de Guardianes de la Galaxia."
  },
  {
    minifigure_no: 'sh0121',
    description_en: "Nebula emerges as a complex character torn between villainy and redemption. Thanos's adopted daughter combines cybernetic enhancements with deadly combat skills. This blue-headed variant captures her distinctive alien appearance. A fan-favorite Guardians of the Galaxy character essential for cosmic Marvel collections.",
    description_de: "Nebula tritt als komplexer Charakter hervor, zerrissen zwischen Schurkentat und Erlösung. Thanos' Adoptivtochter kombiniert kybernetische Verbesserungen mit tödlichen Kampffähigkeiten. Diese blauköpfige Variante erfasst ihr charakteristisches außerirdisches Aussehen. Ein bei Fans beliebter Guardians of the Galaxy-Charakter, unverzichtbar für kosmische Marvel-Sammlungen.",
    description_fr: "Nebula émerge comme un personnage complexe déchiré entre vilenie et rédemption. La fille adoptive de Thanos combine améliorations cybernétiques avec compétences de combat mortelles. Cette variante à tête bleue capture son apparence extraterrestre distinctive. Un personnage Gardiens de la Galaxie favori des fans essentiel pour les collections Marvel cosmiques.",
    description_es: "Nébula emerge como un personaje complejo desgarrado entre villanía y redención. La hija adoptiva de Thanos combina mejoras cibernéticas con habilidades de combate mortales. Esta variante de cabeza azul captura su distintiva apariencia alienígena. Un personaje favorito de los fans de Guardianes de la Galaxia esencial para colecciones cósmicas de Marvel."
  },
  {
    minifigure_no: 'sh0122',
    description_en: "Rocket Raccoon brings tactical genius and heavy weapons expertise to the Guardians of the Galaxy. The genetically engineered raccoon combines humor with deadly efficiency. This orange and reddish brown outfit variant showcases his distinctive appearance. A beloved character essential for any Guardians collection.",
    description_de: "Rocket Raccoon bringt taktisches Genie und Schwerwaffenexpertise zu den Guardians of the Galaxy. Der genetisch konstruierte Waschbär kombiniert Humor mit tödlicher Effizienz. Diese orange und rotbraune Outfit-Variante zeigt sein charakteristisches Aussehen. Eine geliebte Figur, unverzichtbar für jede Guardians-Sammlung.",
    description_fr: "Rocket Raccoon apporte génie tactique et expertise en armes lourdes aux Gardiens de la Galaxie. Le raton laveur génétiquement modifié combine humour avec efficacité mortelle. Cette variante de tenue orange et brun rougeâtre met en valeur son apparence distinctive. Un personnage bien-aimé essentiel pour toute collection Gardiens.",
    description_es: "Rocket Raccoon aporta genio táctico y experiencia en armas pesadas a los Guardianes de la Galaxia. El mapache genéticamente modificado combina humor con eficiencia mortal. Esta variante de traje naranja y marrón rojizo muestra su apariencia distintiva. Un personaje querido esencial para cualquier colección de Guardianes."
  },
  {
    minifigure_no: 'sh0123',
    description_en: "Star-Lord leads the Guardians of the Galaxy with roguish charm and heroic determination. Peter Quill's masked appearance and jacket with side buttons represent his iconic space outlaw look. Essential leader piece for Guardians displays. Highly sought after by Marvel cosmic collectors.",
    description_de: "Star-Lord führt die Guardians of the Galaxy mit schelmischem Charme und heroischer Entschlossenheit. Peter Quills maskiertes Aussehen und Jacke mit Seitenknöpfen repräsentieren seinen ikonischen Weltraum-Outlaw-Look. Unverzichtbares Anführer-Teil für Guardians-Displays. Sehr begehrt von kosmischen Marvel-Sammlern.",
    description_fr: "Star-Lord dirige les Gardiens de la Galaxie avec charme roublard et détermination héroïque. L'apparence masquée et la veste avec boutons latéraux de Peter Quill représentent son look emblématique de hors-la-loi de l'espace. Pièce de leader essentielle pour les affichages Gardiens. Très recherché par les collectionneurs Marvel cosmiques.",
    description_es: "Star-Lord lidera a los Guardianes de la Galaxia con encanto pícaro y determinación heroica. La apariencia enmascarada y chaqueta con botones laterales de Peter Quill representan su icónico look de forajido espacial. Pieza de líder esencial para exhibiciones de Guardianes. Muy buscado por coleccionistas cósmicos de Marvel."
  },
  {
    minifigure_no: 'sh0124',
    description_en: "Gamora stands as the deadliest woman in the galaxy with unmatched combat skills. Trained by Thanos but fighting for redemption, her dark red suit represents her warrior status. A core Guardians of the Galaxy member essential for team displays. Highly valued by collectors for her character complexity.",
    description_de: "Gamora steht als die tödlichste Frau der Galaxie mit unübertroffenen Kampffähigkeiten. Von Thanos trainiert, aber für Erlösung kämpfend, repräsentiert ihr dunkelroter Anzug ihren Krieger-Status. Ein Kern-Mitglied der Guardians of the Galaxy, unverzichtbar für Team-Displays. Sehr geschätzt von Sammlern für ihre Charakter-Komplexität.",
    description_fr: "Gamora se dresse comme la femme la plus mortelle de la galaxie avec compétences de combat inégalées. Entraînée par Thanos mais se battant pour la rédemption, son costume rouge foncé représente son statut de guerrière. Un membre central des Gardiens de la Galaxie essentiel pour les affichages d'équipe. Très valorisée par les collectionneurs pour sa complexité de personnage.",
    description_es: "Gamora se erige como la mujer más mortal de la galaxia con habilidades de combate inigualables. Entrenada por Thanos pero luchando por redención, su traje rojo oscuro representa su estatus de guerrera. Un miembro central de Guardianes de la Galaxia esencial para exhibiciones de equipo. Muy valorada por coleccionistas por su complejidad de personaje."
  },
  {
    minifigure_no: 'sh0125',
    description_en: "Drax the Destroyer combines brute strength with unwavering dedication to vengeance against Thanos. His literalist personality and red legs variant create a memorable character. An essential Guardians of the Galaxy team member bringing muscle and humor. Popular among collectors for his distinctive appearance and personality.",
    description_de: "Drax der Zerstörer kombiniert rohe Stärke mit unerschütterlicher Hingabe an Rache gegen Thanos. Seine wörtliche Persönlichkeit und rotbeinige Variante schaffen einen unvergesslichen Charakter. Ein unverzichtbares Guardians of the Galaxy-Teammitglied, das Muskelkraft und Humor bringt. Beliebt bei Sammlern für sein charakteristisches Aussehen und Persönlichkeit.",
    description_fr: "Drax le Destructeur combine force brute avec dévouement inébranlable à la vengeance contre Thanos. Sa personnalité littéraliste et variante à jambes rouges créent un personnage mémorable. Un membre d'équipe Gardiens de la Galaxie essentiel apportant muscle et humour. Populaire parmi les collectionneurs pour son apparence et personnalité distinctives.",
    description_es: "Drax el Destructor combina fuerza bruta con dedicación inquebrantable a la venganza contra Thanos. Su personalidad literalista y variante de piernas rojas crean un personaje memorable. Un miembro esencial del equipo Guardianes de la Galaxia que aporta músculo y humor. Popular entre coleccionistas por su apariencia y personalidad distintivas."
  }
];

async function main() {
  console.log(`🦸 Starting Super Heroes batch sh0101-sh0125 (${descriptions.length} minifigs)...`);
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
  console.log(`✅ Batch complete! ${descriptions.length} minifigs saved. Total: 125 done.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
