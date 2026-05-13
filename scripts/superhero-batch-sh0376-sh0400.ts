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
    minifigure_no: 'sh0376',
    description_en: "Roller Disco Batman brings 1970s nostalgia to the Dark Knight. This themed variant combines crime-fighting with disco culture. The roller skates add playful mobility. A fun alternate universe Batman piece appealing to collectors seeking unconventional designs.",
    description_de: "Roller Disco Batman bringt 1970er-Nostalgie zum Dark Knight. Diese thematische Variante kombiniert Verbrechensbekämpfung mit Disco-Kultur. Die Rollschuhe fügen verspielte Mobilität hinzu. Ein lustiges alternatives Universum Batman-Teil, das Sammler anzieht, die unkonventionelle Designs suchen.",
    description_fr: "Roller Disco Batman apporte nostalgie des années 1970 au Chevalier Noir. Cette variante thématique combine lutte contre le crime avec culture disco. Les patins à roulettes ajoutent mobilité ludique. Une pièce Batman d'univers alternatif amusante attirant collectionneurs recherchant designs non conventionnels.",
    description_es: "Roller Disco Batman aporta nostalgia de los años 1970 al Caballero Oscuro. Esta variante temática combina lucha contra el crimen con cultura disco. Los patines de ruedas añaden movilidad juguetona. Una pieza divertida de Batman de universo alternativo que atrae a coleccionistas que buscan diseños no convencionales."
  },
  {
    minifigure_no: 'sh0377',
    description_en: "Tears of Batman Clown represents a bizarre alternate reality version. This inverted character combines Batman aesthetics with clown elements. The unusual design creates striking visual contrast. A unique collectible for fans of Batman's surreal multiverse variations.",
    description_de: "Tears of Batman Clown repräsentiert eine bizarre alternative Realitäts-Version. Diese invertierte Figur kombiniert Batman-Ästhetik mit Clown-Elementen. Das ungewöhnliche Design schafft auffälligen visuellen Kontrast. Ein einzigartiges Sammlerstück für Fans von Batmans surrealen Multiversum-Variationen.",
    description_fr: "Tears of Batman Clown représente une version bizarre de réalité alternative. Ce personnage inversé combine esthétique Batman avec éléments de clown. Le design inhabituel crée contraste visuel frappant. Un objet de collection unique pour fans de variations de multivers surréalistes de Batman.",
    description_es: "Tears of Batman Clown representa una versión bizarra de realidad alternativa. Este personaje invertido combina estética de Batman con elementos de payaso. El diseño inusual crea contraste visual llamativo. Un coleccionable único para fans de variaciones de multiverso surrealistas de Batman."
  },
  {
    minifigure_no: 'sh0378',
    description_en: "Ayesha leads the Sovereign with golden perfection. This genetically engineered high priestess pursues the Guardians with relentless determination. Her distinctive appearance emphasizes superiority complex. Essential for Guardians of the Galaxy Vol. 2 villain displays.",
    description_de: "Ayesha führt die Sovereign mit goldener Perfektion. Diese genetisch konstruierte Hohepriesterin verfolgt die Guardians mit unerbittlicher Entschlossenheit. Ihr charakteristisches Aussehen betont Überlegenheitskomplex. Unverzichtbar für Guardians of the Galaxy Vol. 2-Schurken-Displays.",
    description_fr: "Ayesha dirige les Souverains avec perfection dorée. Cette grande prêtresse génétiquement modifiée poursuit les Gardiens avec détermination implacable. Son apparence distinctive souligne le complexe de supériorité. Essentiel pour affichages de méchants Gardiens de la Galaxie Vol. 2.",
    description_es: "Ayesha lidera a los Soberanos con perfección dorada. Esta suma sacerdotisa genéticamente modificada persigue a los Guardianes con determinación implacable. Su apariencia distintiva enfatiza complejo de superioridad. Esencial para exhibiciones de villanos de Guardianes de la Galaxia Vol. 2."
  },
  {
    minifigure_no: 'sh0379',
    description_en: "Yondu commands his Ravagers with whistle-controlled arrows. This blue-skinned space pirate becomes surrogate father to Star-Lord. His Yaka arrow abilities make him formidable. Essential for comprehensive Guardians of the Galaxy character displays showing redemption arcs.",
    description_de: "Yondu befehligt seine Ravagers mit pfeif-kontrollierten Pfeilen. Dieser blauhäutige Weltraum-Pirat wird zum Ersatzvater für Star-Lord. Seine Yaka-Pfeil-Fähigkeiten machen ihn beeindruckend. Unverzichtbar für umfassende Guardians of the Galaxy-Charakter-Displays, die Erlösungsbögen zeigen.",
    description_fr: "Yondu commande ses Ravagers avec flèches contrôlées par sifflement. Ce pirate spatial à peau bleue devient père de substitution pour Star-Lord. Ses capacités de flèche Yaka le rendent formidable. Essentiel pour affichages complets de personnages Gardiens de la Galaxie montrant arcs de rédemption.",
    description_es: "Yondu comanda a sus Ravagers con flechas controladas por silbido. Este pirata espacial de piel azul se convierte en padre sustituto de Star-Lord. Sus habilidades de flecha Yaka lo hacen formidable. Esencial para exhibiciones completas de personajes de Guardianes de la Galaxia que muestran arcos de redención."
  },
  {
    minifigure_no: 'sh0380',
    description_en: "Star-Lord with jet pack enhances Peter Quill's mobility. This space-faring hero gains enhanced tactical options. The jet pack enables three-dimensional combat displays. Perfect for aerial Guardians of the Galaxy action scenarios.",
    description_de: "Star-Lord mit Jetpack verbessert Peter Quills Mobilität. Dieser weltraumreisende Held gewinnt verbesserte taktische Optionen. Der Jetpack ermöglicht dreidimensionale Kampf-Displays. Perfekt für aeriale Guardians of the Galaxy-Action-Szenarien.",
    description_fr: "Star-Lord avec jetpack améliore la mobilité de Peter Quill. Ce héros voyageant dans l'espace gagne des options tactiques améliorées. Le jetpack permet des affichages de combat tridimensionnels. Parfait pour scénarios d'action aériens Gardiens de la Galaxie.",
    description_es: "Star-Lord con jetpack mejora la movilidad de Peter Quill. Este héroe espacial gana opciones tácticas mejoradas. El jetpack permite exhibiciones de combate tridimensionales. Perfecto para escenarios de acción aérea de Guardianes de la Galaxia."
  },
  {
    minifigure_no: 'sh0381',
    description_en: "Baby Groot in reddish brown with dark red outfit captures his adorable rebirth. This miniature tree hero brings innocence to the Guardians. The dark red costume adds distinctive styling. Essential for Guardians Vol. 2 collections celebrating Groot's rejuvenation.",
    description_de: "Baby Groot in rotbraun mit dunkelrotem Outfit erfasst seine entzückende Wiedergeburt. Dieser miniatur-Baum-Held bringt Unschuld zu den Guardians. Das dunkelrote Kostüm fügt charakteristisches Styling hinzu. Unverzichtbar für Guardians Vol. 2-Sammlungen, die Groots Verjüngung feiern.",
    description_fr: "Bébé Groot en brun rougeâtre avec tenue rouge foncé capture sa renaissance adorable. Ce héros arbre miniature apporte innocence aux Gardiens. Le costume rouge foncé ajoute style distinctif. Essentiel pour collections Gardiens Vol. 2 célébrant le rajeunissement de Groot.",
    description_es: "Baby Groot en marrón rojizo con traje rojo oscuro captura su adorable renacimiento. Este héroe árbol miniatura aporta inocencia a los Guardianes. El traje rojo oscuro añade estilo distintivo. Esencial para colecciones de Guardianes Vol. 2 que celebran el rejuvenecimiento de Groot."
  },
  {
    minifigure_no: 'sh0382',
    description_en: "Taserface leads Ravager mutiny with brutish confidence. This self-named villain's unfortunate moniker becomes comedic. His intimidating appearance contrasts with ridiculous name. A memorable Guardians Vol. 2 antagonist essential for Ravager faction displays.",
    description_de: "Taserface führt Ravager-Meuterei mit brutaler Zuversicht. Der unglückliche Spitzname dieses selbstbenannten Schurken wird komisch. Sein einschüchterndes Aussehen kontrastiert mit lächerlichem Namen. Ein unvergesslicher Guardians Vol. 2-Antagonist, unverzichtbar für Ravager-Fraktions-Displays.",
    description_fr: "Taserface dirige la mutinerie des Ravagers avec confiance brutale. Le surnom malheureux de ce méchant auto-nommé devient comique. Son apparence intimidante contraste avec nom ridicule. Un antagoniste mémorable Gardiens Vol. 2 essentiel pour affichages de faction Ravager.",
    description_es: "Taserface lidera motín de Ravagers con confianza brutal. El desafortunado apodo de este villano auto-nombrado se vuelve cómico. Su apariencia intimidante contrasta con nombre ridículo. Un antagonista memorable de Guardianes Vol. 2 esencial para exhibiciones de facción Ravager."
  },
  {
    minifigure_no: 'sh0383',
    description_en: "Mantis brings empathic abilities to the Guardians. This innocent empath reads and manipulates emotions. The vest with dark blue trim captures her distinctive appearance. Essential for Guardians Vol. 2 team displays showing new member integration.",
    description_de: "Mantis bringt empathische Fähigkeiten zu den Guardians. Diese unschuldige Empathin liest und manipuliert Emotionen. Die Weste mit dunkelblauem Besatz erfasst ihr charakteristisches Aussehen. Unverzichtbar für Guardians Vol. 2-Team-Displays, die Integration neuer Mitglieder zeigen.",
    description_fr: "Mantis apporte capacités empathiques aux Gardiens. Cette empathe innocente lit et manipule les émotions. Le gilet avec garniture bleu foncé capture son apparence distinctive. Essentiel pour affichages d'équipe Gardiens Vol. 2 montrant intégration de nouveau membre.",
    description_es: "Mantis aporta habilidades empáticas a los Guardianes. Esta empática inocente lee y manipula emociones. El chaleco con adorno azul oscuro captura su apariencia distintiva. Esencial para exhibiciones de equipo Guardianes Vol. 2 que muestran integración de nuevo miembro."
  },
  {
    minifigure_no: 'sh0384',
    description_en: "Rocket Raccoon in dark blue and reddish brown outfit shows costume variation. This genetically engineered weapons expert brings tactical brilliance. The outfit change offers display variety. A valuable Rocket variant for comprehensive Guardians collections.",
    description_de: "Rocket Raccoon in dunkelblauem und rotbraunem Outfit zeigt Kostüm-Variation. Dieser genetisch konstruierte Waffen-Experte bringt taktische Brillanz. Der Outfit-Wechsel bietet Display-Vielfalt. Eine wertvolle Rocket-Variante für umfassende Guardians-Sammlungen.",
    description_fr: "Rocket Raccoon en tenue bleu foncé et brun rougeâtre montre variation de costume. Cet expert en armes génétiquement modifié apporte brillance tactique. Le changement de tenue offre variété d'affichage. Une variante Rocket précieuse pour collections Gardiens complètes.",
    description_es: "Rocket Raccoon en traje azul oscuro y marrón rojizo muestra variación de traje. Este experto en armas genéticamente modificado aporta brillantez táctica. El cambio de traje ofrece variedad de exhibición. Una variante valiosa de Rocket para colecciones completas de Guardianes."
  },
  {
    minifigure_no: 'sh0385',
    description_en: "Star-Lord in silver armor with jet pack represents upgraded equipment. Peter Quill gains enhanced protection and mobility. This armored variant emphasizes serious tactical capability. Essential for displaying Guardians' evolving technology and combat readiness.",
    description_de: "Star-Lord in silberner Rüstung mit Jetpack repräsentiert aufgerüstete Ausrüstung. Peter Quill gewinnt verbesserten Schutz und Mobilität. Diese gepanzerte Variante betont ernsthafte taktische Fähigkeit. Unverzichtbar für die Darstellung der sich entwickelnden Technologie und Kampfbereitschaft der Guardians.",
    description_fr: "Star-Lord en armure argentée avec jetpack représente équipement amélioré. Peter Quill gagne protection et mobilité améliorées. Cette variante blindée souligne capacité tactique sérieuse. Essentiel pour afficher la technologie évolutive et préparation au combat des Gardiens.",
    description_es: "Star-Lord en armadura plateada con jetpack representa equipo mejorado. Peter Quill gana protección y movilidad mejoradas. Esta variante blindada enfatiza capacidad táctica seria. Esencial para mostrar tecnología evolutiva y preparación para combate de Guardianes."
  },
  {
    minifigure_no: 'sh0386',
    description_en: "Nebula with torn outfit shows battle damage from conflicts. Thanos's adopted daughter displays her warrior hardship. The dark azure head and damaged clothing emphasize her struggles. Essential for chronicling Nebula's painful journey toward redemption.",
    description_de: "Nebula mit zerrissenem Outfit zeigt Kampfschäden aus Konflikten. Thanos' Adoptivtochter zeigt ihre Krieger-Härte. Der dunkelazurblaue Kopf und beschädigte Kleidung betonen ihre Kämpfe. Unverzichtbar für die Chronik von Nebulas schmerzhafter Reise zur Erlösung.",
    description_fr: "Nebula avec tenue déchirée montre dommages de bataille des conflits. La fille adoptive de Thanos affiche ses difficultés de guerrière. La tête azur foncé et vêtements endommagés soulignent ses luttes. Essentiel pour chronicler le parcours douloureux de Nebula vers la rédemption.",
    description_es: "Nebula con traje desgarrado muestra daño de batalla de conflictos. La hija adoptiva de Thanos muestra su dificultad de guerrera. La cabeza azul oscuro y ropa dañada enfatizan sus luchas. Esencial para relatar el doloroso viaje de Nebula hacia la redención."
  },
  {
    minifigure_no: 'sh0387',
    description_en: "Drax with jet pack gains aerial combat capability. The Destroyer's literal mindset combines with enhanced mobility. This variant emphasizes tactical versatility. Perfect for three-dimensional Guardians battle displays and space combat scenarios.",
    description_de: "Drax mit Jetpack gewinnt Luftkampf-Fähigkeit. Die wörtliche Denkweise des Zerstörers kombiniert mit verbesserter Mobilität. Diese Variante betont taktische Vielseitigkeit. Perfekt für dreidimensionale Guardians-Kampf-Displays und Weltraum-Kampf-Szenarien.",
    description_fr: "Drax avec jetpack gagne capacité de combat aérien. La mentalité littérale du Destructeur se combine avec mobilité améliorée. Cette variante souligne polyvalence tactique. Parfait pour affichages de bataille Gardiens tridimensionnels et scénarios de combat spatial.",
    description_es: "Drax con jetpack gana capacidad de combate aéreo. La mentalidad literal del Destructor se combina con movilidad mejorada. Esta variante enfatiza versatilidad táctica. Perfecto para exhibiciones de batalla tridimensionales de Guardianes y escenarios de combate espacial."
  },
  {
    minifigure_no: 'sh0388',
    description_en: "Gamora in silver armor gains enhanced protection. The deadliest woman in the galaxy upgrades her tactical gear. The armored variant emphasizes serious combat readiness. Essential for displaying Gamora's evolution as warrior and Guardian.",
    description_de: "Gamora in silberner Rüstung gewinnt verbesserten Schutz. Die tödlichste Frau der Galaxie rüstet ihre taktische Ausrüstung auf. Die gepanzerte Variante betont ernsthafte Kampfbereitschaft. Unverzichtbar für die Darstellung von Gamoras Evolution als Kriegerin und Guardian.",
    description_fr: "Gamora en armure argentée gagne protection améliorée. La femme la plus mortelle de la galaxie améliore son équipement tactique. La variante blindée souligne préparation au combat sérieuse. Essentiel pour afficher l'évolution de Gamora comme guerrière et Gardienne.",
    description_es: "Gamora en armadura plateada gana protección mejorada. La mujer más mortal de la galaxia mejora su equipo táctico. La variante blindada enfatiza preparación seria para combate. Esencial para mostrar la evolución de Gamora como guerrera y Guardiana."
  },
  {
    minifigure_no: 'sh0389',
    description_en: "Baby Groot in simple reddish brown captures his pure rebirth form. This miniature tree hero represents innocence and new beginnings. The unadorned appearance emphasizes his vulnerable state. Essential for Guardians Vol. 2 displays celebrating Groot's regeneration cycle.",
    description_de: "Baby Groot in einfachem Rotbraun erfasst seine reine Wiedergeburts-Form. Dieser miniatur-Baum-Held repräsentiert Unschuld und Neuanfänge. Das schmucklose Aussehen betont seinen verletzlichen Zustand. Unverzichtbar für Guardians Vol. 2-Displays, die Groots Regenerations-Zyklus feiern.",
    description_fr: "Bébé Groot en brun rougeâtre simple capture sa forme de renaissance pure. Ce héros arbre miniature représente innocence et nouveaux départs. L'apparence sans ornement souligne son état vulnérable. Essentiel pour affichages Gardiens Vol. 2 célébrant le cycle de régénération de Groot.",
    description_es: "Baby Groot en marrón rojizo simple captura su forma pura de renacimiento. Este héroe árbol miniatura representa inocencia y nuevos comienzos. La apariencia sin adornos enfatiza su estado vulnerable. Esencial para exhibiciones de Guardianes Vol. 2 que celebran el ciclo de regeneración de Groot."
  },
  {
    minifigure_no: 'sh0390',
    description_en: "Tiger Tuxedo Batman combines formal elegance with wild pattern. This themed variant showcases Batman's versatility across alternate scenarios. The tiger print adds exotic flair. A unique crossover piece appealing to collectors seeking unconventional Batman designs.",
    description_de: "Tiger Tuxedo Batman kombiniert formelle Eleganz mit wildem Muster. Diese thematische Variante zeigt Batmans Vielseitigkeit über alternative Szenarien hinweg. Der Tiger-Druck fügt exotisches Flair hinzu. Ein einzigartiges Crossover-Teil, das Sammler anzieht, die unkonventionelle Batman-Designs suchen.",
    description_fr: "Tiger Tuxedo Batman combine élégance formelle avec motif sauvage. Cette variante thématique présente la polyvalence de Batman à travers scénarios alternatifs. L'imprimé tigre ajoute panache exotique. Une pièce crossover unique attirant collectionneurs recherchant designs Batman non conventionnels.",
    description_es: "Tiger Tuxedo Batman combina elegancia formal con patrón salvaje. Esta variante temática muestra la versatilidad de Batman a través de escenarios alternativos. El estampado de tigre añade estilo exótico. Una pieza de cruce única que atrae a coleccionistas que buscan diseños no convencionales de Batman."
  },
  {
    minifigure_no: 'sh0391',
    description_en: "Scarecrow with reddish brown floppy hat represents costume variation. Dr. Jonathan Crane's fear-inducing persona gains color diversity. The reddish brown hat offers collectors display options. A valuable Scarecrow variant for comprehensive Batman villain collections.",
    description_de: "Scarecrow mit rotbraunem Schlapphut repräsentiert Kostüm-Variation. Dr. Jonathan Cranes angsterzeugende Persona gewinnt Farbvielfalt. Der rotbraune Hut bietet Sammlern Display-Optionen. Eine wertvolle Scarecrow-Variante für umfassende Batman-Schurken-Sammlungen.",
    description_fr: "Scarecrow avec chapeau mou brun rougeâtre représente variation de costume. Le personnage inducteur de peur du Dr. Jonathan Crane gagne diversité de couleurs. Le chapeau brun rougeâtre offre options d'affichage aux collectionneurs. Une variante Scarecrow précieuse pour collections complètes de méchants Batman.",
    description_es: "Scarecrow con sombrero flojo marrón rojizo representa variación de traje. La persona inductora de miedo del Dr. Jonathan Crane gana diversidad de color. El sombrero marrón rojizo ofrece a coleccionistas opciones de exhibición. Una variante valiosa de Scarecrow para colecciones completas de villanos de Batman."
  },
  {
    minifigure_no: 'sh0392',
    description_en: "Exclusive Wonder Woman represents special release collectibility. Diana's exclusive status makes this highly sought after. Limited availability drives collector demand. A premium piece essential for serious Wonder Woman and convention exclusive collections.",
    description_de: "Exclusive Wonder Woman repräsentiert spezielle Veröffentlichungs-Sammelbarkeit. Dianas exklusiver Status macht dies sehr begehrt. Begrenzte Verfügbarkeit treibt Sammler-Nachfrage. Ein Premium-Teil, unverzichtbar für ernsthafte Wonder Woman- und Convention-Exklusiv-Sammlungen.",
    description_fr: "Exclusive Wonder Woman représente collectibilité de sortie spéciale. Le statut exclusif de Diana rend ceci très recherché. La disponibilité limitée stimule la demande des collectionneurs. Une pièce premium essentielle pour collections sérieuses Wonder Woman et exclusives de convention.",
    description_es: "Exclusive Wonder Woman representa coleccionabilidad de lanzamiento especial. El estado exclusivo de Diana hace esto muy buscado. Disponibilidad limitada impulsa demanda de coleccionistas. Una pieza premium esencial para colecciones serias de Wonder Woman y exclusivas de convención."
  },
  {
    minifigure_no: 'sh0393',
    description_en: "Wonder Woman with red torso and blue skirt showcases classic costume colors. Diana's iconic appearance maintains Amazon warrior aesthetics. This color scheme represents traditional Wonder Woman design. Essential for comprehensive Wonder Woman costume variation displays.",
    description_de: "Wonder Woman mit rotem Oberkörper und blauem Rock zeigt klassische Kostüm-Farben. Dianas ikonisches Aussehen behält Amazonen-Kriegerin-Ästhetik bei. Dieses Farbschema repräsentiert traditionelles Wonder Woman-Design. Unverzichtbar für umfassende Wonder Woman-Kostüm-Variations-Displays.",
    description_fr: "Wonder Woman avec torse rouge et jupe bleue présente couleurs de costume classiques. L'apparence emblématique de Diana maintient l'esthétique de guerrière amazone. Ce schéma de couleurs représente le design Wonder Woman traditionnel. Essentiel pour affichages complets de variations de costume Wonder Woman.",
    description_es: "Wonder Woman con torso rojo y falda azul muestra colores de traje clásicos. La apariencia icónica de Diana mantiene estética de guerrera amazona. Este esquema de color representa diseño tradicional de Wonder Woman. Esencial para exhibiciones completas de variación de trajes de Wonder Woman."
  },
  {
    minifigure_no: 'sh0394',
    description_en: "Steve Trevor represents Wonder Woman's human connection. This pilot and spy bridges the mortal and divine worlds. His military background adds tactical expertise. Essential supporting character for Wonder Woman displays showing her integration into man's world.",
    description_de: "Steve Trevor repräsentiert Wonder Womans menschliche Verbindung. Dieser Pilot und Spion verbindet die sterbliche und göttliche Welt. Sein militärischer Hintergrund fügt taktische Expertise hinzu. Unverzichtbare Nebenfigur für Wonder Woman-Displays, die ihre Integration in die Welt der Menschen zeigen.",
    description_fr: "Steve Trevor représente la connexion humaine de Wonder Woman. Ce pilote et espion fait le pont entre les mondes mortel et divin. Son parcours militaire ajoute expertise tactique. Personnage secondaire essentiel pour affichages Wonder Woman montrant son intégration dans le monde des hommes.",
    description_es: "Steve Trevor representa la conexión humana de Wonder Woman. Este piloto y espía une los mundos mortal y divino. Su trasfondo militar añade experiencia táctica. Personaje secundario esencial para exhibiciones de Wonder Woman que muestran su integración en el mundo del hombre."
  },
  {
    minifigure_no: 'sh0395',
    description_en: "Two-Face with black and magenta hair emphasizes his dual nature. Harvey Dent's split personality manifests through contrasting colors. The dark bluish gray suit maintains professional appearance. Essential for showcasing Two-Face's tragic duality and psychological complexity.",
    description_de: "Two-Face mit schwarzen und magentafarbenen Haaren betont seine duale Natur. Harvey Dents gespaltene Persönlichkeit manifestiert sich durch kontrastierende Farben. Der dunkelblaugraue Anzug behält professionelles Aussehen bei. Unverzichtbar für die Darstellung von Two-Face's tragischer Dualität und psychologischer Komplexität.",
    description_fr: "Double-Face avec cheveux noirs et magenta souligne sa nature duelle. La personnalité divisée de Harvey Dent se manifeste par des couleurs contrastées. Le costume gris bleuté foncé maintient apparence professionnelle. Essentiel pour présenter la dualité tragique et complexité psychologique de Double-Face.",
    description_es: "Dos Caras con cabello negro y magenta enfatiza su naturaleza dual. La personalidad dividida de Harvey Dent se manifiesta mediante colores contrastantes. El traje gris azulado oscuro mantiene apariencia profesional. Esencial para mostrar la dualidad trágica y complejidad psicológica de Dos Caras."
  },
  {
    minifigure_no: 'sh0396',
    description_en: "Mutant Leader represents Gotham's underground threat. This gang leader commands street-level criminals. The mutant design adds post-apocalyptic atmosphere. Essential for displaying Gotham's diverse criminal ecosystem and gang warfare scenarios.",
    description_de: "Mutant Leader repräsentiert Gothams Untergrund-Bedrohung. Dieser Gang-Anführer befehligt Kriminelle auf Straßenniveau. Das Mutanten-Design fügt post-apokalyptische Atmosphäre hinzu. Unverzichtbar für die Darstellung von Gothams vielfältigem kriminellem Ökosystem und Gang-Kriegs-Szenarien.",
    description_fr: "Mutant Leader représente la menace souterraine de Gotham. Ce chef de gang commande des criminels de rue. Le design mutant ajoute atmosphère post-apocalyptique. Essentiel pour afficher l'écosystème criminel diversifié de Gotham et scénarios de guerre de gangs.",
    description_es: "Mutant Leader representa amenaza subterránea de Gotham. Este líder de pandilla comanda criminales callejeros. El diseño mutante añade atmósfera post-apocalíptica. Esencial para mostrar el ecosistema criminal diverso de Gotham y escenarios de guerra de pandillas."
  },
  {
    minifigure_no: 'sh0397',
    description_en: "Polka-Dot Man brings absurd villainy to Batman's rogues. This obscure character's polka-dot gimmick creates memorable aesthetic. The ridiculous yet dangerous combination adds humor. A unique villain piece for collectors appreciating Batman's stranger adversaries.",
    description_de: "Polka-Dot Man bringt absurde Schurkentat zu Batmans Rogues. Der Polka-Dot-Gimmick dieses obskuren Charakters schafft unvergessliche Ästhetik. Die lächerliche, aber gefährliche Kombination fügt Humor hinzu. Ein einzigartiges Schurken-Teil für Sammler, die Batmans seltsamere Gegner schätzen.",
    description_fr: "Polka-Dot Man apporte vilenie absurde aux voyous de Batman. Le gadget à pois de ce personnage obscur crée esthétique mémorable. La combinaison ridicule mais dangereuse ajoute humour. Une pièce de méchant unique pour collectionneurs appréciant les adversaires plus étranges de Batman.",
    description_es: "Polka-Dot Man aporta villanía absurda a los pícaros de Batman. El truco de lunares de este personaje oscuro crea estética memorable. La combinación ridícula pero peligrosa añade humor. Una pieza de villano única para coleccionistas que aprecian adversarios más extraños de Batman."
  },
  {
    minifigure_no: 'sh0398',
    description_en: "Harley Quinn with tutu adds ballet-inspired chaos. The black and red tutu combines elegance with insanity. This playful variant emphasizes her unpredictable nature. A dynamic Harley piece perfect for showcasing her theatrical criminal performances.",
    description_de: "Harley Quinn mit Tutu fügt ballett-inspiriertes Chaos hinzu. Das schwarz-rote Tutu kombiniert Eleganz mit Wahnsinn. Diese verspielte Variante betont ihre unvorhersehbare Natur. Ein dynamisches Harley-Teil, perfekt für die Darstellung ihrer theatralischen kriminellen Aufführungen.",
    description_fr: "Harley Quinn avec tutu ajoute chaos inspiré du ballet. Le tutu noir et rouge combine élégance avec folie. Cette variante ludique souligne sa nature imprévisible. Une pièce Harley dynamique parfaite pour présenter ses performances criminelles théâtrales.",
    description_es: "Harley Quinn con tutú añade caos inspirado en ballet. El tutú negro y rojo combina elegancia con locura. Esta variante juguetona enfatiza su naturaleza impredecible. Una pieza dinámica de Harley perfecta para mostrar sus actuaciones criminales teatrales."
  },
  {
    minifigure_no: 'sh0399',
    description_en: "Chief O'Hara represents Classic TV Series law enforcement. This 1960s police chief brings period authenticity to Batman displays. The vintage character adds nostalgic value. Essential for completing Classic TV Batman institutional authority figures.",
    description_de: "Chief O'Hara repräsentiert Strafverfolgung der klassischen TV-Serie. Dieser 1960er-Polizeichef bringt Perioden-Authentizität zu Batman-Displays. Der Vintage-Charakter fügt nostalgischen Wert hinzu. Unverzichtbar für die Vervollständigung klassischer TV Batman-institutioneller Autoritätsfiguren.",
    description_fr: "Chief O'Hara représente l'application de la loi de la Série Télévisée Classique. Ce chef de police des années 1960 apporte authenticité d'époque aux affichages Batman. Le personnage vintage ajoute valeur nostalgique. Essentiel pour compléter les figures d'autorité institutionnelles Batman TV Classique.",
    description_es: "Chief O'Hara representa aplicación de ley de Serie de TV Clásica. Este jefe de policía de los años 1960 aporta autenticidad de época a exhibiciones de Batman. El personaje vintage añade valor nostálgico. Esencial para completar figuras de autoridad institucional de Batman de TV Clásico."
  },
  {
    minifigure_no: 'sh0400',
    description_en: "GCPD Officer 1 serves Gotham's police force alongside Commissioner Gordon. These brave officers face superhuman threats daily. Essential army builders for creating authentic GCPD formations. Perfect for displaying Gotham's institutional law enforcement presence and street-level operations.",
    description_de: "GCPD Officer 1 dient Gothams Polizei an der Seite von Commissioner Gordon. Diese tapferen Offiziere begegnen täglich übermenschlichen Bedrohungen. Unverzichtbare Armee-Baumeister für die Erstellung authentischer GCPD-Formationen. Perfekt für die Darstellung von Gothams institutioneller Strafverfolgungs-Präsenz und Operationen auf Straßenniveau.",
    description_fr: "GCPD Officer 1 sert la force de police de Gotham aux côtés de Commissioner Gordon. Ces officiers courageux font face quotidiennement à des menaces surhumaines. Constructeurs d'armée essentiels pour créer des formations GCPD authentiques. Parfait pour afficher la présence d'application de la loi institutionnelle de Gotham et opérations de rue.",
    description_es: "GCPD Officer 1 sirve a la fuerza policial de Gotham junto a Commissioner Gordon. Estos oficiales valientes enfrentan amenazas sobrehumanas diariamente. Constructores de ejército esenciales para crear formaciones auténticas del GCPD. Perfecto para mostrar presencia institucional de aplicación de ley de Gotham y operaciones a nivel de calle."
  }
];

async function main() {
  console.log(`🦸 Starting Super Heroes batch sh0376-sh0400 (${descriptions.length} minifigs)...`);
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
  console.log(`✅ Batch complete! ${descriptions.length} minifigs saved. Total: 400 done.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
