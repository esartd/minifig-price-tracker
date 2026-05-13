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
    minifigure_no: 'sh0276',
    description_en: "Killer Moth with full helmet brings moth-themed villainy to Batman's rogues. Drury Walker's criminal career combines insect motifs with elaborate schemes. This full-helmet design emphasizes his distinctive appearance. A colorful Batman villain essential for comprehensive rogues gallery displays.",
    description_de: "Killer Moth mit vollem Helm bringt motten-thematische Schurkentat zu Batmans Rogues. Drury Walkers kriminelle Karriere kombiniert Insekten-Motive mit aufwendigen Plänen. Dieses Vollhelm-Design betont sein charakteristisches Aussehen. Ein farbenfroher Batman-Schurke, unverzichtbar für umfassende Rogues Gallery-Displays.",
    description_fr: "Killer Moth avec casque complet apporte vilenie à thème papillon de nuit aux voyous de Batman. La carrière criminelle de Drury Walker combine motifs d'insectes avec plans élaborés. Ce design de casque complet souligne son apparence distinctive. Un méchant Batman coloré essentiel pour affichages complets de galerie de voyous.",
    description_es: "Killer Moth con casco completo aporta villanía temática de polilla a los pícaros de Batman. La carrera criminal de Drury Walker combina motivos de insectos con planes elaborados. Este diseño de casco completo enfatiza su apariencia distintiva. Un villano colorido de Batman esencial para exhibiciones completas de galería de pícaros."
  },
  {
    minifigure_no: 'sh0277',
    description_en: "Farmer represents everyday civilians in superhero universes. These ordinary people provide context and humanity to action scenes. Perfect for rescue scenarios and civilian protection displays. A supporting character adding realism to diverse superhero storylines.",
    description_de: "Farmer repräsentiert alltägliche Zivilisten in Superhelden-Universen. Diese gewöhnlichen Menschen bieten Kontext und Menschlichkeit zu Action-Szenen. Perfekt für Rettungsszenarien und Zivilschutz-Displays. Eine Nebenfigur, die verschiedenen Superhelden-Handlungen Realismus hinzufügt.",
    description_fr: "Fermier représente des civils ordinaires dans les univers de super-héros. Ces personnes ordinaires fournissent contexte et humanité aux scènes d'action. Parfait pour scénarios de sauvetage et affichages de protection civile. Un personnage secondaire ajoutant réalisme à diverses intrigues de super-héros.",
    description_es: "Granjero representa civiles cotidianos en universos de superhéroes. Estas personas ordinarias proporcionan contexto y humanidad a escenas de acción. Perfecto para escenarios de rescate y exhibiciones de protección civil. Un personaje secundario que añade realismo a diversas historias de superhéroes."
  },
  {
    minifigure_no: 'sh0278',
    description_en: "Blue Beetle brings alien technology to young heroism. Jaime Reyes' symbiotic relationship with the Scarab grants incredible powers. This teen hero represents new generation Justice League members. Essential for diverse DC hero collections and Teen Titans displays.",
    description_de: "Blue Beetle bringt außerirdische Technologie zum jugendlichen Heldentum. Jaime Reyes' symbiotische Beziehung mit dem Scarab verleiht unglaubliche Kräfte. Dieser jugendliche Held repräsentiert neue Generation Justice League-Mitglieder. Unverzichtbar für vielfältige DC-Helden-Sammlungen und Teen Titans-Displays.",
    description_fr: "Blue Beetle apporte technologie extraterrestre à l'héroïsme jeune. La relation symbiotique de Jaime Reyes avec le Scarabée confère pouvoirs incroyables. Ce héros adolescent représente les membres de nouvelle génération de la Justice League. Essentiel pour collections de héros DC diversifiées et affichages Teen Titans.",
    description_es: "Blue Beetle aporta tecnología alienígena al heroísmo joven. La relación simbiótica de Jaime Reyes con el Escarabajo otorga poderes increíbles. Este héroe adolescente representa miembros de nueva generación de la Liga de la Justicia. Esencial para colecciones diversas de héroes DC y exhibiciones de Titanes Jóvenes."
  },
  {
    minifigure_no: 'sh0279',
    description_en: "Gas Mask Batman protects against chemical threats. This specialized variant shows Bruce Wayne's tactical adaptability. The gas mask adds distinctive visual appeal and practical storytelling. Perfect for toxin-themed villain encounters and hazardous environment scenarios.",
    description_de: "Gas Mask Batman schützt vor chemischen Bedrohungen. Diese spezialisierte Variante zeigt Bruce Waynes taktische Anpassungsfähigkeit. Die Gasmaske fügt charakteristische visuelle Anziehungskraft und praktisches Storytelling hinzu. Perfekt für toxin-thematische Schurken-Begegnungen und gefährliche Umgebungs-Szenarien.",
    description_fr: "Gas Mask Batman protège contre menaces chimiques. Cette variante spécialisée montre l'adaptabilité tactique de Bruce Wayne. Le masque à gaz ajoute attrait visuel distinctif et narration pratique. Parfait pour rencontres de méchants à thème toxine et scénarios d'environnement dangereux.",
    description_es: "Gas Mask Batman protege contra amenazas químicas. Esta variante especializada muestra la adaptabilidad táctica de Bruce Wayne. La máscara de gas añade atractivo visual distintivo y narración práctica. Perfecto para encuentros con villanos temáticos de toxina y escenarios de ambiente peligroso."
  },
  {
    minifigure_no: 'sh0280',
    description_en: "Killer Croc with sand blue pants brings reptilian menace to Gotham. Waylon Jones' mutation creates one of Batman's most physically imposing foes. The sand blue coloring distinguishes this variant. A powerful Batman villain essential for displaying raw physical threats.",
    description_de: "Killer Croc mit sandblauen Hosen bringt reptilienartige Bedrohung nach Gotham. Waylon Jones' Mutation schafft einen von Batmans physisch imposantesten Feinden. Die sandblaue Färbung unterscheidet diese Variante. Ein mächtiger Batman-Schurke, unverzichtbar für die Darstellung roher physischer Bedrohungen.",
    description_fr: "Killer Croc avec pantalon bleu sable apporte menace reptilienne à Gotham. La mutation de Waylon Jones crée l'un des ennemis les plus physiquement imposants de Batman. La coloration bleu sable distingue cette variante. Un méchant Batman puissant essentiel pour afficher menaces physiques brutes.",
    description_es: "Killer Croc con pantalones azul arena aporta amenaza reptiliana a Gotham. La mutación de Waylon Jones crea uno de los enemigos físicamente más imponentes de Batman. La coloración azul arena distingue esta variante. Un villano poderoso de Batman esencial para mostrar amenazas físicas brutas."
  },
  {
    minifigure_no: 'sh0281',
    description_en: "Captain Boomerang in black outfit represents the Flash villain turned Suicide Squad member. Digger Harkness' boomerang expertise makes him deadly. This black costume variant emphasizes his tactical shift. Essential for both Flash rogues and Suicide Squad team displays.",
    description_de: "Captain Boomerang im schwarzen Outfit repräsentiert den Flash-Schurken, der zum Suicide Squad-Mitglied wurde. Digger Harkness' Bumerang-Expertise macht ihn tödlich. Diese schwarze Kostüm-Variante betont seinen taktischen Wechsel. Unverzichtbar sowohl für Flash Rogues- als auch Suicide Squad-Team-Displays.",
    description_fr: "Captain Boomerang en tenue noire représente le méchant du Flash devenu membre du Suicide Squad. L'expertise en boomerang de Digger Harkness le rend mortel. Cette variante de costume noir souligne son changement tactique. Essentiel pour affichages de voyous Flash et d'équipe Suicide Squad.",
    description_es: "Capitán Boomerang en traje negro representa al villano de Flash convertido en miembro del Escuadrón Suicida. La experiencia en bumerán de Digger Harkness lo hace mortal. Esta variante de traje negro enfatiza su cambio táctico. Esencial tanto para pícaros de Flash como exhibiciones de equipo Escuadrón Suicida."
  },
  {
    minifigure_no: 'sh0282',
    description_en: "Red Hood brings Jason Todd's dark resurrection to Batman's world. This anti-hero operates with lethal methods Batman opposes. The red helmet symbolizes his tragic transformation. A complex character essential for exploring Batman family dynamics and moral conflicts.",
    description_de: "Red Hood bringt Jason Todds dunkle Auferstehung in Batmans Welt. Dieser Anti-Held operiert mit tödlichen Methoden, die Batman ablehnt. Der rote Helm symbolisiert seine tragische Verwandlung. Eine komplexe Figur, unverzichtbar für die Erforschung von Batman-Familien-Dynamiken und moralischen Konflikten.",
    description_fr: "Red Hood apporte la résurrection sombre de Jason Todd au monde de Batman. Cet anti-héros opère avec méthodes létales que Batman oppose. Le casque rouge symbolise sa transformation tragique. Un personnage complexe essentiel pour explorer dynamiques de famille Batman et conflits moraux.",
    description_es: "Red Hood aporta la oscura resurrección de Jason Todd al mundo de Batman. Este antihéroe opera con métodos letales que Batman rechaza. El casco rojo simboliza su transformación trágica. Un personaje complejo esencial para explorar dinámicas de familia Batman y conflictos morales."
  },
  {
    minifigure_no: 'sh0283',
    description_en: "Katana wields her soul-stealing sword with deadly precision. Tatsu Yamashiro's mystic blade traps enemies' spirits. This Suicide Squad member brings martial arts excellence and supernatural elements. Essential for comprehensive Suicide Squad team displays.",
    description_de: "Katana schwingt ihr seelenstehlendes Schwert mit tödlicher Präzision. Tatsu Yamashiros mystische Klinge fängt Feinde-Geister. Dieses Suicide Squad-Mitglied bringt Kampfkunst-Exzellenz und übernatürliche Elemente. Unverzichtbar für umfassende Suicide Squad-Team-Displays.",
    description_fr: "Katana manie son épée voleuse d'âmes avec précision mortelle. La lame mystique de Tatsu Yamashiro piège les esprits ennemis. Ce membre du Suicide Squad apporte excellence en arts martiaux et éléments surnaturels. Essentiel pour affichages d'équipe Suicide Squad complets.",
    description_es: "Katana maneja su espada robadora de almas con precisión mortal. La hoja mística de Tatsu Yamashiro atrapa espíritus enemigos. Este miembro del Escuadrón Suicida aporta excelencia en artes marciales y elementos sobrenaturales. Esencial para exhibiciones completas de equipo Escuadrón Suicida."
  },
  {
    minifigure_no: 'sh0284',
    description_en: "Doctor Octopus with neck bracket showcases enhanced mechanical attachment. Otto Octavius' tentacle integration reaches new sophistication. The bright green outfit with neck bracket adds distinctive detail. A refined Doc Ock variant for technical display emphasis.",
    description_de: "Doctor Octopus mit Nackenbügel zeigt verbesserte mechanische Befestigung. Otto Octavius' Tentakel-Integration erreicht neue Raffinesse. Das hellgrüne Outfit mit Nackenbügel fügt charakteristische Details hinzu. Eine raffinierte Doc Ock-Variante für technische Display-Betonung.",
    description_fr: "Doctor Octopus avec support de cou présente attachement mécanique amélioré. L'intégration de tentacules d'Otto Octavius atteint nouvelle sophistication. La tenue vert vif avec support de cou ajoute détail distinctif. Une variante Doc Ock raffinée pour emphase d'affichage technique.",
    description_es: "Doctor Octopus con soporte de cuello muestra conexión mecánica mejorada. La integración de tentáculos de Otto Octavius alcanza nueva sofisticación. El traje verde brillante con soporte de cuello añade detalle distintivo. Una variante refinada de Doc Ock para énfasis de exhibición técnica."
  },
  {
    minifigure_no: 'sh0285',
    description_en: "Vulture in green costume with falcon wings brings aerial menace to Spider-Man. Adrian Toomes' flight suit makes him formidable. This green variant with distinctive wings offers visual variety. A key Spider-Man villain essential for Sinister Six displays.",
    description_de: "Vulture im grünen Kostüm mit Falkenflügeln bringt Luft-Bedrohung zu Spider-Man. Adrian Toomes' Fluganzug macht ihn beeindruckend. Diese grüne Variante mit charakteristischen Flügeln bietet visuelle Vielfalt. Ein Schlüssel-Spider-Man-Schurke, unverzichtbar für Sinister Six-Displays.",
    description_fr: "Vautour en costume vert avec ailes de faucon apporte menace aérienne à Spider-Man. La combinaison de vol d'Adrian Toomes le rend formidable. Cette variante verte avec ailes distinctives offre variété visuelle. Un méchant Spider-Man clé essentiel pour affichages Sinister Six.",
    description_es: "Buitre en traje verde con alas de halcón aporta amenaza aérea a Spider-Man. El traje de vuelo de Adrian Toomes lo hace formidable. Esta variante verde con alas distintivas ofrece variedad visual. Un villano clave de Spider-Man esencial para exhibiciones de Siniestros Seis."
  },
  {
    minifigure_no: 'sh0286',
    description_en: "Captain Stacy represents law enforcement perspective in Spider-Man's world. Gwen Stacy's father bridges police and superhero dynamics. This authority figure adds institutional context to stories. Important supporting character for comprehensive Spider-Man storylines.",
    description_de: "Captain Stacy repräsentiert Strafverfolgungs-Perspektive in Spider-Mans Welt. Gwen Stacys Vater verbindet Polizei- und Superhelden-Dynamiken. Diese Autoritätsfigur fügt institutionellen Kontext zu Geschichten hinzu. Wichtige Nebenfigur für umfassende Spider-Man-Handlungen.",
    description_fr: "Captain Stacy représente la perspective de l'application de la loi dans le monde de Spider-Man. Le père de Gwen Stacy fait le pont entre dynamiques policières et super-héroïques. Cette figure d'autorité ajoute contexte institutionnel aux histoires. Personnage secondaire important pour intrigues Spider-Man complètes.",
    description_es: "Capitán Stacy representa perspectiva de aplicación de la ley en el mundo de Spider-Man. El padre de Gwen Stacy une dinámicas policiales y de superhéroes. Esta figura de autoridad añade contexto institucional a historias. Personaje secundario importante para historias completas de Spider-Man."
  },
  {
    minifigure_no: 'sh0287',
    description_en: "White Tiger brings martial arts mastery and mystical powers to Marvel. Ava Ayala's connection to the Tiger Amulet grants enhanced abilities. This street-level hero adds diversity to Marvel roster. Essential for comprehensive Marvel hero collections emphasizing global heroes.",
    description_de: "White Tiger bringt Kampfkunst-Meisterschaft und mystische Kräfte zu Marvel. Ava Ayalas Verbindung zum Tiger-Amulett verleiht verbesserte Fähigkeiten. Diese Straßenniveau-Heldin fügt Vielfalt zum Marvel-Kader hinzu. Unverzichtbar für umfassende Marvel-Helden-Sammlungen, die globale Helden betonen.",
    description_fr: "White Tiger apporte maîtrise des arts martiaux et pouvoirs mystiques à Marvel. La connexion d'Ava Ayala à l'Amulette du Tigre confère capacités améliorées. Cette héroïne de niveau rue ajoute diversité au roster Marvel. Essentiel pour collections de héros Marvel complètes soulignant héros mondiaux.",
    description_es: "Tigre Blanco aporta maestría en artes marciales y poderes místicos a Marvel. La conexión de Ava Ayala con el Amuleto del Tigre otorga habilidades mejoradas. Esta heroína de nivel callejero añade diversidad al plantel Marvel. Esencial para colecciones completas de héroes Marvel que enfatizan héroes globales."
  },
  {
    minifigure_no: 'sh0288',
    description_en: "Desert Batman adapts the Dark Knight to arid environments. This specialized suit combines heat protection with tactical capabilities. The desert coloring provides camouflage in sandy terrain. A unique Batman variant for diverse environmental mission displays.",
    description_de: "Desert Batman passt den Dark Knight an trockene Umgebungen an. Dieser spezialisierte Anzug kombiniert Hitzeschutz mit taktischen Fähigkeiten. Die Wüsten-Färbung bietet Tarnung in sandigem Gelände. Eine einzigartige Batman-Variante für vielfältige Umgebungs-Missions-Displays.",
    description_fr: "Desert Batman adapte le Chevalier Noir aux environnements arides. Cette combinaison spécialisée combine protection thermique avec capacités tactiques. La coloration désertique fournit camouflage en terrain sablonneux. Une variante Batman unique pour affichages de mission environnementale diversifiés.",
    description_es: "Desert Batman adapta al Caballero Oscuro a ambientes áridos. Este traje especializado combina protección contra calor con capacidades tácticas. La coloración desértica proporciona camuflaje en terreno arenoso. Una variante única de Batman para exhibiciones diversas de misión ambiental."
  },
  {
    minifigure_no: 'sh0289',
    description_en: "Robin with green hands and hood emphasizes the Boy Wonder's classic color scheme. Dick Grayson's acrobatic heroism shines through this variant. The green hands add costume accuracy. A refined Robin variant appealing to detail-oriented collectors.",
    description_de: "Robin mit grünen Händen und Kapuze betont das klassische Farbschema des Boy Wonder. Dick Graysons akrobatisches Heldentum glänzt durch diese Variante. Die grünen Hände fügen Kostüm-Genauigkeit hinzu. Eine raffinierte Robin-Variante, die detailorientierte Sammler anzieht.",
    description_fr: "Robin avec mains vertes et capuche souligne le schéma de couleurs classique du Boy Wonder. L'héroïsme acrobatique de Dick Grayson brille à travers cette variante. Les mains vertes ajoutent précision de costume. Une variante Robin raffinée attirant collectionneurs soucieux du détail.",
    description_es: "Robin con manos verdes y capucha enfatiza el esquema de color clásico del Joven Maravilla. El heroísmo acrobático de Dick Grayson brilla a través de esta variante. Las manos verdes añaden precisión de traje. Una variante refinada de Robin que atrae a coleccionistas orientados al detalle."
  },
  {
    minifigure_no: 'sh0290',
    description_en: "Ra's Al Ghul commands the League of Assassins with immortal ambition. The Demon's Head seeks to reshape civilization through destruction. This ecological terrorist poses Batman's most philosophical challenge. Essential Batman villain representing global-scale threats and moral complexity.",
    description_de: "Ra's Al Ghul befehligt die Liga der Assassinen mit unsterblichem Ehrgeiz. Der Kopf des Dämons versucht, die Zivilisation durch Zerstörung umzugestalten. Dieser ökologische Terrorist stellt Batmans philosophischste Herausforderung dar. Unverzichtbarer Batman-Schurke, der globale Bedrohungen und moralische Komplexität repräsentiert.",
    description_fr: "Ra's Al Ghul commande la Ligue des Assassins avec ambition immortelle. La Tête du Démon cherche à remodeler la civilisation par la destruction. Ce terroriste écologique pose le défi le plus philosophique de Batman. Méchant Batman essentiel représentant menaces à échelle mondiale et complexité morale.",
    description_es: "Ra's Al Ghul comanda la Liga de Asesinos con ambición inmortal. La Cabeza del Demonio busca remodelar la civilización mediante destrucción. Este terrorista ecológico plantea el desafío más filosófico de Batman. Villano esencial de Batman que representa amenazas a escala global y complejidad moral."
  },
  {
    minifigure_no: 'sh0291',
    description_en: "Talia Al Ghul walks between loyalty to her father and love for Batman. The daughter of Ra's Al Ghul combines deadly skills with complex emotions. This conflicted character adds romantic tension and moral ambiguity. Essential for comprehensive Batman adversary and ally displays.",
    description_de: "Talia Al Ghul bewegt sich zwischen Loyalität zu ihrem Vater und Liebe zu Batman. Die Tochter von Ra's Al Ghul kombiniert tödliche Fähigkeiten mit komplexen Emotionen. Diese konfliktreiche Figur fügt romantische Spannung und moralische Zweideutigkeit hinzu. Unverzichtbar für umfassende Batman-Gegner- und Verbündeten-Displays.",
    description_fr: "Talia Al Ghul marche entre loyauté envers son père et amour pour Batman. La fille de Ra's Al Ghul combine compétences mortelles avec émotions complexes. Ce personnage en conflit ajoute tension romantique et ambiguïté morale. Essentiel pour affichages complets d'adversaires et alliés Batman.",
    description_es: "Talia Al Ghul camina entre lealtad a su padre y amor por Batman. La hija de Ra's Al Ghul combina habilidades mortales con emociones complejas. Este personaje en conflicto añade tensión romántica y ambigüedad moral. Esencial para exhibiciones completas de adversarios y aliados de Batman."
  },
  {
    minifigure_no: 'sh0292',
    description_en: "Lex Luthor in battle armor with green legs represents his combat-ready configuration. Superman's nemesis combines genius intellect with mechanical might. This armored variant enables direct confrontation. Essential for showcasing Luthor's evolution from businessman to armored villain.",
    description_de: "Lex Luthor in Kampfrüstung mit grünen Beinen repräsentiert seine kampfbereite Konfiguration. Supermans Nemesis kombiniert geniales Intellekt mit mechanischer Macht. Diese gepanzerte Variante ermöglicht direkte Konfrontation. Unverzichtbar für die Darstellung von Luthors Evolution vom Geschäftsmann zum gepanzerten Schurken.",
    description_fr: "Lex Luthor en armure de combat avec jambes vertes représente sa configuration prête au combat. Le némésis de Superman combine intellect génial avec puissance mécanique. Cette variante blindée permet confrontation directe. Essentiel pour présenter l'évolution de Luthor d'homme d'affaires à méchant en armure.",
    description_es: "Lex Luthor en armadura de combate con piernas verdes representa su configuración lista para combate. El némesis de Superman combina intelecto genial con poder mecánico. Esta variante blindada permite confrontación directa. Esencial para mostrar la evolución de Luthor de empresario a villano armado."
  },
  {
    minifigure_no: 'sh0293',
    description_en: "ATOM from San Diego Comic-Con 2016 showcases Ray Palmer's size-changing powers. This Ivy University professor shrinks to microscopic levels. The convention exclusive status makes this highly collectible. A rare DC hero essential for serious convention exclusive collectors.",
    description_de: "ATOM von der San Diego Comic-Con 2016 zeigt Ray Palmers größenverändernde Kräfte. Dieser Ivy University-Professor schrumpft auf mikroskopische Ebenen. Der Convention-Exklusivstatus macht dies sehr sammelwürdig. Ein seltener DC-Held, unverzichtbar für ernsthafte Convention-Exklusiv-Sammler.",
    description_fr: "ATOM de la San Diego Comic-Con 2016 présente les pouvoirs de changement de taille de Ray Palmer. Ce professeur d'Ivy University rétrécit à niveaux microscopiques. Le statut exclusif de convention rend ceci très collectionnable. Un héros DC rare essentiel pour collectionneurs sérieux d'exclusives de convention.",
    description_es: "ATOM de San Diego Comic-Con 2016 muestra los poderes de cambio de tamaño de Ray Palmer. Este profesor de Ivy University se encoge a niveles microscópicos. El estado exclusivo de convención hace esto altamente coleccionable. Un héroe DC raro esencial para coleccionistas serios de exclusivas de convención."
  },
  {
    minifigure_no: 'sh0294',
    description_en: "Nightwing with white eye holes and blue chest symbol represents Dick Grayson's evolved hero identity. The former Robin operates independently with acrobatic excellence. This variant emphasizes his distinctive costume design. Essential for chronicling Dick Grayson's journey from sidekick to solo hero.",
    description_de: "Nightwing mit weißen Augenlöchern und blauem Brustsymbol repräsentiert Dick Graysons weiterentwickelte Helden-Identität. Der ehemalige Robin operiert unabhängig mit akrobatischer Exzellenz. Diese Variante betont sein charakteristisches Kostümdesign. Unverzichtbar für die Chronik von Dick Graysons Reise vom Sidekick zum Solo-Helden.",
    description_fr: "Nightwing avec trous d'œil blancs et symbole de poitrine bleu représente l'identité héroïque évoluée de Dick Grayson. L'ancien Robin opère indépendamment avec excellence acrobatique. Cette variante souligne son design de costume distinctif. Essentiel pour chronicler le parcours de Dick Grayson de sidekick à héros solo.",
    description_es: "Nightwing con agujeros de ojos blancos y símbolo de pecho azul representa la identidad heroica evolucionada de Dick Grayson. El ex Robin opera independientemente con excelencia acrobática. Esta variante enfatiza su diseño de traje distintivo. Esencial para relatar el viaje de Dick Grayson de compañero a héroe solitario."
  },
  {
    minifigure_no: 'sh0295',
    description_en: "Steve Rogers Captain America from San Diego Comic-Con 2016 represents the original shield-bearer. This convention exclusive captures Steve's classic heroism. Extremely valuable limited release essential for serious Captain America collectors. A premium piece celebrating Captain America's legacy.",
    description_de: "Steve Rogers Captain America von der San Diego Comic-Con 2016 repräsentiert den ursprünglichen Schildträger. Diese Convention-Exklusivfigur erfasst Steves klassisches Heldentum. Extrem wertvolle limitierte Veröffentlichung, unverzichtbar für ernsthafte Captain America-Sammler. Ein Premium-Teil, das Captain Americas Erbe feiert.",
    description_fr: "Steve Rogers Captain America de la San Diego Comic-Con 2016 représente le porteur de bouclier original. Cette exclusive de convention capture l'héroïsme classique de Steve. Version limitée extrêmement précieuse essentielle pour collectionneurs sérieux Captain America. Une pièce premium célébrant l'héritage de Captain America.",
    description_es: "Steve Rogers Captain America de San Diego Comic-Con 2016 representa al portador original del escudo. Esta exclusiva de convención captura el heroísmo clásico de Steve. Lanzamiento limitado extremadamente valioso esencial para coleccionistas serios del Capitán América. Una pieza premium que celebra el legado del Capitán América."
  },
  {
    minifigure_no: 'sh0296',
    description_en: "Doctor Strange with cloth cape brings mystical arts to the MCU. Stephen Strange's transformation from surgeon to Sorcerer Supreme revolutionizes Marvel. The starched fabric cape and collar add premium quality. Essential for MCU Phase 3 collections representing magical heroism.",
    description_de: "Doctor Strange mit Stoffcape bringt mystische Künste ins MCU. Stephen Stranges Verwandlung vom Chirurgen zum Sorcerer Supreme revolutioniert Marvel. Das gestärkte Stoffcape und Kragen fügen Premium-Qualität hinzu. Unverzichtbar für MCU Phase 3-Sammlungen, die magisches Heldentum repräsentieren.",
    description_fr: "Doctor Strange avec cape en tissu apporte arts mystiques au MCU. La transformation de Stephen Strange de chirurgien à Sorcier Suprême révolutionne Marvel. La cape et le col en tissu amidonné ajoutent qualité premium. Essentiel pour collections MCU Phase 3 représentant héroïsme magique.",
    description_es: "Doctor Strange con capa de tela aporta artes místicas al MCU. La transformación de Stephen Strange de cirujano a Hechicero Supremo revoluciona Marvel. La capa y cuello de tela almidonada añaden calidad premium. Esencial para colecciones de MCU Fase 3 que representan heroísmo mágico."
  },
  {
    minifigure_no: 'sh0297',
    description_en: "Karl Mordo with dark green vest represents Doctor Strange's ally and eventual adversary. His journey from mentor to villain adds complexity. This Master of the Mystic Arts brings discipline and later disillusionment. Important for chronicling Doctor Strange's evolving relationships.",
    description_de: "Karl Mordo mit dunkelgrüner Weste repräsentiert Doctor Stranges Verbündeten und späteren Gegner. Seine Reise vom Mentor zum Schurken fügt Komplexität hinzu. Dieser Meister der mystischen Künste bringt Disziplin und später Desillusionierung. Wichtig für die Chronik von Doctor Stranges sich entwickelnden Beziehungen.",
    description_fr: "Karl Mordo avec gilet vert foncé représente l'allié et éventuel adversaire de Doctor Strange. Son parcours de mentor à méchant ajoute complexité. Ce Maître des Arts Mystiques apporte discipline et plus tard désillusion. Important pour chronicler les relations évolutives de Doctor Strange.",
    description_es: "Karl Mordo con chaleco verde oscuro representa al aliado y eventual adversario de Doctor Strange. Su viaje de mentor a villano añade complejidad. Este Maestro de las Artes Místicas aporta disciplina y posteriormente desilusión. Importante para relatar las relaciones evolutivas de Doctor Strange."
  },
  {
    minifigure_no: 'sh0298',
    description_en: "The Ancient One teaches mystical arts with ancient wisdom. This powerful sorcerer trains Doctor Strange and protects reality. The Sorcerer Supreme brings centuries of knowledge. Essential for Doctor Strange collections representing magical mentorship and cosmic protection.",
    description_de: "Der Ancient One lehrt mystische Künste mit uralter Weisheit. Dieser mächtige Zauberer trainiert Doctor Strange und schützt die Realität. Der Sorcerer Supreme bringt Jahrhunderte des Wissens. Unverzichtbar für Doctor Strange-Sammlungen, die magische Mentorschaft und kosmischen Schutz repräsentieren.",
    description_fr: "L'Ancient One enseigne arts mystiques avec sagesse ancienne. Ce sorcier puissant entraîne Doctor Strange et protège la réalité. Le Sorcier Suprême apporte des siècles de connaissance. Essentiel pour collections Doctor Strange représentant mentorat magique et protection cosmique.",
    description_es: "El Anciano enseña artes místicas con sabiduría antigua. Este poderoso hechicero entrena a Doctor Strange y protege la realidad. El Hechicero Supremo aporta siglos de conocimiento. Esencial para colecciones de Doctor Strange que representan mentoría mágica y protección cósmica."
  },
  {
    minifigure_no: 'sh0299',
    description_en: "Spider-Man with red torso large vest and red boots represents detailed costume variation. Peter Parker's evolving suit designs offer collectors diverse display options. The large vest detail adds distinctive visual appeal. A valuable variant for comprehensive Spider-Man costume collections.",
    description_de: "Spider-Man mit rotem Oberkörper großer Weste und roten Stiefeln repräsentiert detaillierte Kostüm-Variation. Peter Parkers sich entwickelnde Anzug-Designs bieten Sammlern vielfältige Display-Optionen. Das große Westen-Detail fügt charakteristische visuelle Anziehungskraft hinzu. Eine wertvolle Variante für umfassende Spider-Man-Kostüm-Sammlungen.",
    description_fr: "Spider-Man avec torse rouge grand gilet et bottes rouges représente variation de costume détaillée. Les designs de costume évolutifs de Peter Parker offrent aux collectionneurs options d'affichage diverses. Le détail de grand gilet ajoute attrait visuel distinctif. Une variante précieuse pour collections complètes de costumes Spider-Man.",
    description_es: "Spider-Man con torso rojo chaleco grande y botas rojas representa variación de traje detallada. Los diseños de traje evolutivos de Peter Parker ofrecen a coleccionistas opciones de exhibición diversas. El detalle de chaleco grande añade atractivo visual distintivo. Una variante valiosa para colecciones completas de trajes de Spider-Man."
  },
  {
    minifigure_no: 'sh0300',
    description_en: "Superman with dual expressions captures both heroic determination and heat vision power. The open mouth and red eyes showcase his Kryptonian abilities. This spongy cape variant offers premium quality. A dynamic Superman piece essential for action-oriented display scenarios.",
    description_de: "Superman mit Doppelausdruck erfasst sowohl heroische Entschlossenheit als auch Hitzevisions-Kraft. Der offene Mund und rote Augen zeigen seine kryptonischen Fähigkeiten. Diese schwammige Cape-Variante bietet Premium-Qualität. Ein dynamisches Superman-Teil, unverzichtbar für actionorientierte Display-Szenarien.",
    description_fr: "Superman avec expressions doubles capture à la fois détermination héroïque et pouvoir de vision thermique. La bouche ouverte et les yeux rouges présentent ses capacités kryptoniennes. Cette variante de cape spongieuse offre qualité premium. Une pièce Superman dynamique essentielle pour scénarios d'affichage orientés action.",
    description_es: "Superman con expresiones duales captura tanto determinación heroica como poder de visión térmica. La boca abierta y ojos rojos muestran sus habilidades kryptonianas. Esta variante de capa esponjosa ofrece calidad premium. Una pieza dinámica de Superman esencial para escenarios de exhibición orientados a acción."
  }
];

async function main() {
  console.log(`🦸 Starting Super Heroes batch sh0276-sh0300 (${descriptions.length} minifigs)...`);
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
  console.log(`✅ Batch complete! ${descriptions.length} minifigs saved. Total: 300 done.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
