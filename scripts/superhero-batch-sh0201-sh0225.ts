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
    minifigure_no: 'sh0201',
    description_en: "Ant-Man (Scott Lang) in his original suit marks the hero's MCU debut. This master thief turned hero uses Pym Particles to shrink and control ants. The red and black suit design remains iconic. Essential for Ant-Man collections and heist scenario displays.",
    description_de: "Ant-Man (Scott Lang) in seinem ursprünglichen Anzug markiert das MCU-Debüt des Helden. Dieser Meisterdieb, der zum Helden wurde, verwendet Pym-Partikel, um zu schrumpfen und Ameisen zu kontrollieren. Das rot-schwarze Anzug-Design bleibt ikonisch. Unverzichtbar für Ant-Man-Sammlungen und Raub-Szenario-Displays.",
    description_fr: "Ant-Man (Scott Lang) dans son costume original marque les débuts MCU du héros. Ce maître voleur devenu héros utilise les Particules Pym pour rétrécir et contrôler les fourmis. Le design de costume rouge et noir reste emblématique. Essentiel pour collections Ant-Man et affichages de scénarios de braquage.",
    description_es: "Ant-Man (Scott Lang) en su traje original marca el debut MCU del héroe. Este maestro ladrón convertido en héroe usa Partículas Pym para encogerse y controlar hormigas. El diseño de traje rojo y negro permanece icónico. Esencial para colecciones de Ant-Man y exhibiciones de escenarios de atraco."
  },
  {
    minifigure_no: 'sh0202',
    description_en: "Hank Pym created the Ant-Man technology and served as the original size-changing hero. This brilliant scientist's legacy shapes the MCU. His civilian appearance shows the man behind the revolutionary invention. Essential for chronicling Ant-Man's multi-generational heroic legacy.",
    description_de: "Hank Pym schuf die Ant-Man-Technologie und diente als ursprünglicher größenverändernder Held. Das Vermächtnis dieses brillanten Wissenschaftlers prägt das MCU. Sein ziviles Aussehen zeigt den Mann hinter der revolutionären Erfindung. Unverzichtbar für die Chronik von Ant-Mans mehrgenerationaler heroischer Vermächtnis.",
    description_fr: "Hank Pym a créé la technologie Ant-Man et a servi comme héros changeant de taille original. L'héritage de ce brillant scientifique façonne le MCU. Son apparence civile montre l'homme derrière l'invention révolutionnaire. Essentiel pour chronicler l'héritage héroïque multigénérationnel d'Ant-Man.",
    description_es: "Hank Pym creó la tecnología Ant-Man y sirvió como el héroe original que cambia de tamaño. El legado de este brillante científico da forma al MCU. Su apariencia civil muestra al hombre detrás de la invención revolucionaria. Esencial para relatar el legado heroico multigeneracional de Ant-Man."
  },
  {
    minifigure_no: 'sh0203',
    description_en: "Police Officer from Juniors line represents law enforcement in simplified form. This figure brings civic authority to superhero scenarios. Perfect for creating rescue scenes and civilian protection displays. A supporting character adding realism to action-packed storylines.",
    description_de: "Polizist aus der Juniors-Linie repräsentiert Strafverfolgung in vereinfachter Form. Diese Figur bringt staatliche Autorität zu Superhelden-Szenarien. Perfekt für die Erstellung von Rettungsszenen und Zivilschutz-Displays. Eine Nebenfigur, die actionreichen Handlungen Realismus hinzufügt.",
    description_fr: "Officier de Police de la ligne Juniors représente l'application de la loi sous forme simplifiée. Cette figurine apporte l'autorité civique aux scénarios de super-héros. Parfait pour créer des scènes de sauvetage et affichages de protection civile. Un personnage secondaire ajoutant réalisme aux intrigues pleines d'action.",
    description_es: "Oficial de Policía de la línea Juniors representa aplicación de ley en forma simplificada. Esta figura aporta autoridad cívica a escenarios de superhéroes. Perfecto para crear escenas de rescate y exhibiciones de protección civil. Un personaje secundario que añade realismo a historias llenas de acción."
  },
  {
    minifigure_no: 'sh0204',
    description_en: "Batman with black boots adds a distinctive footwear detail to the Dark Knight. This variant features the classic dark bluish gray suit with gold belt and spongy cape. The black boots provide additional accuracy. A refined Batman variant for detail-oriented collectors.",
    description_de: "Batman mit schwarzen Stiefeln fügt dem Dark Knight ein charakteristisches Schuhwerk-Detail hinzu. Diese Variante zeigt den klassischen dunkelblaugrauen Anzug mit Goldgürtel und schwammigem Cape. Die schwarzen Stiefel bieten zusätzliche Genauigkeit. Eine raffinierte Batman-Variante für detailorientierte Sammler.",
    description_fr: "Batman avec bottes noires ajoute un détail de chaussures distinctif au Chevalier Noir. Cette variante présente le costume gris bleuté foncé classique avec ceinture dorée et cape spongieuse. Les bottes noires fournissent précision supplémentaire. Une variante Batman raffinée pour collectionneurs soucieux du détail.",
    description_es: "Batman con botas negras añade un detalle distintivo de calzado al Caballero Oscuro. Esta variante presenta el clásico traje gris azulado oscuro con cinturón dorado y capa esponjosa. Las botas negras proporcionan precisión adicional. Una variante refinada de Batman para coleccionistas orientados al detalle."
  },
  {
    minifigure_no: 'sh0205',
    description_en: "Spider-Man with black web pattern and red boots represents another classic costume variation. Peter Parker's evolving suit designs showcase different artistic interpretations. The red boots add distinctive lower body detailing. A valuable variant for comprehensive Spider-Man costume collections.",
    description_de: "Spider-Man mit schwarzem Netzmuster und roten Stiefeln repräsentiert eine weitere klassische Kostüm-Variation. Peter Parkers sich entwickelnde Anzug-Designs zeigen verschiedene künstlerische Interpretationen. Die roten Stiefel fügen charakteristische Unterkörper-Details hinzu. Eine wertvolle Variante für umfassende Spider-Man-Kostüm-Sammlungen.",
    description_fr: "Spider-Man avec motif de toile noire et bottes rouges représente une autre variation de costume classique. Les designs de costume évolutifs de Peter Parker présentent différentes interprétations artistiques. Les bottes rouges ajoutent des détails distinctifs du bas du corps. Une variante précieuse pour collections complètes de costumes Spider-Man.",
    description_es: "Spider-Man con patrón de telaraña negra y botas rojas representa otra variación de traje clásica. Los diseños de traje evolutivos de Peter Parker muestran diferentes interpretaciones artísticas. Las botas rojas añaden detalles distintivos de parte inferior del cuerpo. Una variante valiosa para colecciones completas de trajes de Spider-Man."
  },
  {
    minifigure_no: 'sh0206',
    description_en: "The Joker with large smile and smirk captures his menacing expressions. The medium azure vest with lime bow tie maintains his flamboyant style. This dual-expression head offers versatility for different display moods. Essential for showcasing the Joker's unpredictable personality.",
    description_de: "Der Joker mit großem Lächeln und Grinsen erfasst seine bedrohlichen Ausdrücke. Die mittelazurblaue Weste mit lindgrüner Fliege behält seinen extravaganten Stil bei. Dieser Doppelausdrucks-Kopf bietet Vielseitigkeit für verschiedene Display-Stimmungen. Unverzichtbar für die Darstellung der unvorhersehbaren Persönlichkeit des Jokers.",
    description_fr: "Le Joker avec grand sourire et rictus capture ses expressions menaçantes. Le gilet azur moyen avec nœud papillon lime maintient son style flamboyant. Cette tête à double expression offre polyvalence pour différentes humeurs d'affichage. Essentiel pour présenter la personnalité imprévisible du Joker.",
    description_es: "El Joker con gran sonrisa y mueca captura sus expresiones amenazantes. El chaleco azul medio con pajarita lima mantiene su estilo extravagante. Esta cabeza de doble expresión ofrece versatilidad para diferentes estados de ánimo de exhibición. Esencial para mostrar la personalidad impredecible del Joker."
  },
  {
    minifigure_no: 'sh0207',
    description_en: "Arsenal from San Diego Comic-Con 2015 showcases Roy Harper's weapon expertise. This Teen Titans member brings archery skills and tactical knowledge. The convention exclusive status makes this highly collectible. A rare figure essential for serious Teen Titans and DC convention exclusive collectors.",
    description_de: "Arsenal von der San Diego Comic-Con 2015 zeigt Roy Harpers Waffen-Expertise. Dieses Teen Titans-Mitglied bringt Bogenschießen-Fähigkeiten und taktisches Wissen. Der Convention-Exklusivstatus macht dies sehr sammelwürdig. Eine seltene Figur, unverzichtbar für ernsthafte Teen Titans- und DC-Convention-Exklusiv-Sammler.",
    description_fr: "Arsenal de la San Diego Comic-Con 2015 présente l'expertise en armes de Roy Harper. Ce membre des Teen Titans apporte compétences en tir à l'arc et connaissances tactiques. Le statut exclusif de convention rend ceci très collectionnable. Une figurine rare essentielle pour collectionneurs sérieux Teen Titans et exclusives de convention DC.",
    description_es: "Arsenal de San Diego Comic-Con 2015 muestra la experiencia en armas de Roy Harper. Este miembro de Titanes Jóvenes aporta habilidades de arquería y conocimiento táctico. El estado exclusivo de convención hace esto altamente coleccionable. Una figura rara esencial para coleccionistas serios de Titanes Jóvenes y exclusivas de convención DC."
  },
  {
    minifigure_no: 'sh0208',
    description_en: "All New Captain America (Sam Wilson) represents the Falcon taking up the shield. This San Diego Comic-Con 2015 exclusive captures a historic moment in Marvel history. Sam brings flight and tactical excellence to the Captain America legacy. Extremely valuable convention exclusive essential for Captain America evolution collections.",
    description_de: "All New Captain America (Sam Wilson) repräsentiert den Falcon, der den Schild aufnimmt. Diese San Diego Comic-Con 2015-Exklusivfigur erfasst einen historischen Moment in der Marvel-Geschichte. Sam bringt Flug und taktische Exzellenz zum Captain America-Erbe. Extrem wertvolle Convention-Exklusivfigur, unverzichtbar für Captain America-Evolutions-Sammlungen.",
    description_fr: "All New Captain America (Sam Wilson) représente le Faucon prenant le bouclier. Cette exclusive San Diego Comic-Con 2015 capture un moment historique dans l'histoire Marvel. Sam apporte vol et excellence tactique à l'héritage Captain America. Exclusive de convention extrêmement précieuse essentielle pour collections d'évolution Captain America.",
    description_es: "All New Captain America (Sam Wilson) representa a Falcon tomando el escudo. Esta exclusiva de San Diego Comic-Con 2015 captura un momento histórico en la historia Marvel. Sam aporta vuelo y excelencia táctica al legado del Capitán América. Exclusiva de convención extremadamente valiosa esencial para colecciones de evolución del Capitán América."
  },
  {
    minifigure_no: 'sh0209',
    description_en: "Ultron Sentry with neck armor represents an upgraded robotic soldier variant. The additional armor plating shows tactical evolution. Essential army builder for creating diverse Ultron forces. Perfect for Age of Ultron battle displays with varied robot types.",
    description_de: "Ultron Sentry mit Nackenpanzer repräsentiert eine aufgerüstete Robotersoldaten-Variante. Die zusätzliche Panzerung zeigt taktische Evolution. Unverzichtbarer Armee-Baumeister für die Erstellung vielfältiger Ultron-Kräfte. Perfekt für Age of Ultron-Kampf-Displays mit verschiedenen Roboter-Typen.",
    description_fr: "Ultron Sentry avec armure de cou représente une variante de soldat robotique améliorée. Le blindage supplémentaire montre l'évolution tactique. Constructeur d'armée essentiel pour créer des forces Ultron diverses. Parfait pour affichages de bataille Age of Ultron avec types de robots variés.",
    description_es: "Ultron Sentry con armadura de cuello representa una variante mejorada de soldado robótico. El blindaje adicional muestra evolución táctica. Constructor de ejército esencial para crear fuerzas Ultron diversas. Perfecto para exhibiciones de batalla de Age of Ultron con tipos de robots variados."
  },
  {
    minifigure_no: 'sh0210',
    description_en: "Trickster brings mischievous villainy to the Flash's rogues gallery. James Jesse uses illusions and gadgets for elaborate crimes. This colorful character adds theatrical flair to displays. A fun villain essential for comprehensive Flash adversary collections.",
    description_de: "Trickster bringt schelmische Schurkentat zur Rogues Gallery des Flash. James Jesse verwendet Illusionen und Gadgets für aufwendige Verbrechen. Diese farbenfrohe Figur fügt theatralisches Flair zu Displays hinzu. Ein lustiger Schurke, unverzichtbar für umfassende Flash-Gegner-Sammlungen.",
    description_fr: "Trickster apporte vilenie malicieuse à la galerie de voyous du Flash. James Jesse utilise illusions et gadgets pour crimes élaborés. Ce personnage coloré ajoute du panache théâtral aux affichages. Un méchant amusant essentiel pour collections complètes d'adversaires Flash.",
    description_es: "Trickster aporta villanía traviesa a la galería de pícaros de Flash. James Jesse usa ilusiones y dispositivos para crímenes elaborados. Este personaje colorido añade estilo teatral a exhibiciones. Un villano divertido esencial para colecciones completas de adversarios de Flash."
  },
  {
    minifigure_no: 'sh0211',
    description_en: "Lightning Lad electrifies the Legion of Super-Heroes with lightning powers. Garth Ranzz's electrical abilities make him a founding Legionnaire. This future hero brings sci-fi heroism to DC collections. An important Legion member for fans of DC's futuristic heroes.",
    description_de: "Lightning Lad elektrisiert die Legion der Superhelden mit Blitzkräften. Garth Ranzz' elektrische Fähigkeiten machen ihn zu einem Gründungs-Legionär. Dieser zukünftige Held bringt Sci-Fi-Heldentum zu DC-Sammlungen. Ein wichtiges Legion-Mitglied für Fans von DCs futuristischen Helden.",
    description_fr: "Lightning Lad électrifie la Légion des Super-Héros avec pouvoirs de foudre. Les capacités électriques de Garth Ranzz font de lui un Légionnaire fondateur. Ce héros futur apporte héroïsme sci-fi aux collections DC. Un membre important de la Légion pour fans de héros futuristes DC.",
    description_es: "Lightning Lad electrifica la Legión de Superhéroes con poderes de relámpago. Las habilidades eléctricas de Garth Ranzz lo convierten en Legionario fundador. Este héroe futuro aporta heroísmo de ciencia ficción a colecciones DC. Un miembro importante de la Legión para fans de héroes futuristas de DC."
  },
  {
    minifigure_no: 'sh0212',
    description_en: "Hulk minifigure with Avengers logo shows standard-scale Bruce Banner's alter ego. This smaller format allows for versatile display options. The team emblem signifies his role as essential Avenger. Perfect for scenes where standard minifigure scale is preferred over giant format.",
    description_de: "Hulk-Minifigur mit Avengers-Logo zeigt Bruce Banners Alter Ego im Standardmaßstab. Dieses kleinere Format ermöglicht vielseitige Display-Optionen. Das Team-Emblem bedeutet seine Rolle als unverzichtbarer Avenger. Perfekt für Szenen, in denen Standardmaßstab gegenüber Riesenformat bevorzugt wird.",
    description_fr: "Figurine Hulk avec logo Avengers montre l'alter ego de Bruce Banner à échelle standard. Ce format plus petit permet des options d'affichage polyvalentes. L'emblème d'équipe signifie son rôle comme Avenger essentiel. Parfait pour scènes où l'échelle de figurine standard est préférée au format géant.",
    description_es: "Minifigura de Hulk con logo de Vengadores muestra el alter ego de Bruce Banner a escala estándar. Este formato más pequeño permite opciones de exhibición versátiles. El emblema de equipo significa su rol como Vengador esencial. Perfecto para escenas donde se prefiere escala de minifigura estándar sobre formato gigante."
  },
  {
    minifigure_no: 'sh0213',
    description_en: "Scuba Iron Man extends Tony Stark's capabilities to underwater missions. This specialized armor variant combines repulsor technology with diving equipment. Perfect for aquatic battle scenarios and expanding Avengers operational range. A unique Iron Man configuration for diverse display possibilities.",
    description_de: "Scuba Iron Man erweitert Tony Starks Fähigkeiten auf Unterwasser-Missionen. Diese spezialisierte Rüstungs-Variante kombiniert Repulsor-Technologie mit Tauchausrüstung. Perfekt für aquatische Kampfszenarien und Erweiterung der operativen Reichweite der Avengers. Eine einzigartige Iron Man-Konfiguration für vielfältige Display-Möglichkeiten.",
    description_fr: "Scuba Iron Man étend les capacités de Tony Stark aux missions sous-marines. Cette variante d'armure spécialisée combine technologie de répulseur avec équipement de plongée. Parfait pour scénarios de bataille aquatique et expansion de la portée opérationnelle des Avengers. Une configuration Iron Man unique pour possibilités d'affichage diverses.",
    description_es: "Scuba Iron Man extiende las capacidades de Tony Stark a misiones submarinas. Esta variante de armadura especializada combina tecnología de repulsor con equipo de buceo. Perfecto para escenarios de batalla acuática y expansión del rango operativo de Vengadores. Una configuración única de Iron Man para posibilidades de exhibición diversas."
  },
  {
    minifigure_no: 'sh0214',
    description_en: "Scuba Captain America brings underwater tactical capabilities to Steve Rogers. This specialized variant shows the Avengers' adaptability to any environment. Perfect for aquatic rescue missions and expanding storytelling options. A unique Captain America configuration for water-based scenarios.",
    description_de: "Scuba Captain America bringt Unterwasser-taktische Fähigkeiten zu Steve Rogers. Diese spezialisierte Variante zeigt die Anpassungsfähigkeit der Avengers an jede Umgebung. Perfekt für aquatische Rettungsmissionen und Erweiterung der Storytelling-Optionen. Eine einzigartige Captain America-Konfiguration für wasserbasierte Szenarien.",
    description_fr: "Scuba Captain America apporte capacités tactiques sous-marines à Steve Rogers. Cette variante spécialisée montre l'adaptabilité des Avengers à tout environnement. Parfait pour missions de sauvetage aquatiques et expansion des options de narration. Une configuration Captain America unique pour scénarios aquatiques.",
    description_es: "Scuba Captain America aporta capacidades tácticas submarinas a Steve Rogers. Esta variante especializada muestra la adaptabilidad de los Vengadores a cualquier entorno. Perfecto para misiones de rescate acuático y expansión de opciones narrativas. Una configuración única del Capitán América para escenarios acuáticos."
  },
  {
    minifigure_no: 'sh0215',
    description_en: "Iron Skull combines Red Skull's evil with Iron Man's technology. This villainous fusion creates a terrifying adversary. The hybrid design showcases what happens when Nazi ideology meets advanced armor. A striking villain piece representing technological threats corrupted by evil.",
    description_de: "Iron Skull kombiniert Red Skulls Böses mit Iron Mans Technologie. Diese schurkenhafte Fusion schafft einen erschreckenden Gegner. Das Hybrid-Design zeigt, was passiert, wenn Nazi-Ideologie auf fortgeschrittene Rüstung trifft. Ein auffälliges Schurken-Teil, das technologische Bedrohungen repräsentiert, die durch Böses korrumpiert wurden.",
    description_fr: "Iron Skull combine le mal de Red Skull avec la technologie d'Iron Man. Cette fusion vilaine crée un adversaire terrifiant. Le design hybride présente ce qui se passe quand l'idéologie nazie rencontre l'armure avancée. Une pièce de méchant frappante représentant menaces technologiques corrompues par le mal.",
    description_es: "Iron Skull combina el mal de Cráneo Rojo con la tecnología de Iron Man. Esta fusión villana crea un adversario aterrador. El diseño híbrido muestra qué sucede cuando la ideología nazi encuentra armadura avanzada. Una pieza de villano impactante que representa amenazas tecnológicas corruptas por el mal."
  },
  {
    minifigure_no: 'sh0216',
    description_en: "Hydra Diver extends the terrorist organization's reach to underwater operations. These specialized soldiers bring aquatic combat capabilities to Hydra forces. Essential army builders for underwater battle scenarios. Perfect for creating comprehensive Hydra military displays across all environments.",
    description_de: "Hydra-Taucher erweitert die Reichweite der Terrororganisation auf Unterwasser-Operationen. Diese spezialisierten Soldaten bringen aquatische Kampffähigkeiten zu Hydra-Kräften. Unverzichtbare Armee-Baumeister für Unterwasser-Kampfszenarien. Perfekt für die Erstellung umfassender Hydra-Militär-Displays in allen Umgebungen.",
    description_fr: "Hydra Diver étend la portée de l'organisation terroriste aux opérations sous-marines. Ces soldats spécialisés apportent capacités de combat aquatique aux forces Hydra. Constructeurs d'armée essentiels pour scénarios de bataille sous-marine. Parfait pour créer affichages militaires Hydra complets dans tous environnements.",
    description_es: "Hydra Diver extiende el alcance de la organización terrorista a operaciones submarinas. Estos soldados especializados aportan capacidades de combate acuático a fuerzas Hydra. Constructores de ejército esenciales para escenarios de batalla submarina. Perfecto para crear exhibiciones militares Hydra completas en todos los entornos."
  },
  {
    minifigure_no: 'sh0217',
    description_en: "Armored Batman from Batman v Superman features heavy tactical armor. This suit enables Bruce Wayne to battle Superman on equal footing. The bulky design emphasizes raw power over agility. An iconic variant essential for Batman v Superman: Dawn of Justice collections.",
    description_de: "Armored Batman aus Batman v Superman zeigt schwere taktische Rüstung. Dieser Anzug ermöglicht es Bruce Wayne, Superman auf Augenhöhe zu bekämpfen. Das klobige Design betont rohe Kraft über Agilität. Eine ikonische Variante, unverzichtbar für Batman v Superman: Dawn of Justice-Sammlungen.",
    description_fr: "Armored Batman de Batman v Superman présente armure tactique lourde. Ce costume permet à Bruce Wayne de combattre Superman d'égal à égal. Le design volumineux souligne la puissance brute plutôt que l'agilité. Une variante emblématique essentielle pour collections Batman v Superman: L'Aube de la Justice.",
    description_es: "Armored Batman de Batman v Superman presenta armadura táctica pesada. Este traje permite a Bruce Wayne batallar contra Superman en igualdad de condiciones. El diseño voluminoso enfatiza poder bruto sobre agilidad. Una variante icónica esencial para colecciones de Batman v Superman: El Amanecer de la Justicia."
  },
  {
    minifigure_no: 'sh0217a',
    description_en: "Armored Batman without cape shows the tactical suit in pure combat configuration. This variant reveals the full armor design without cape obstruction. Perfect for action poses emphasizing the suit's mechanical details. A display-friendly variant for showcasing Batman's advanced technology.",
    description_de: "Armored Batman ohne Cape zeigt den taktischen Anzug in reiner Kampfkonfiguration. Diese Variante enthüllt das vollständige Rüstungs-Design ohne Cape-Behinderung. Perfekt für Action-Posen, die die mechanischen Details des Anzugs betonen. Eine display-freundliche Variante zur Präsentation von Batmans fortgeschrittener Technologie.",
    description_fr: "Armored Batman sans cape montre le costume tactique en configuration de combat pure. Cette variante révèle le design d'armure complet sans obstruction de cape. Parfait pour poses d'action soulignant les détails mécaniques du costume. Une variante adaptée à l'affichage pour présenter la technologie avancée de Batman.",
    description_es: "Armored Batman sin capa muestra el traje táctico en configuración de combate pura. Esta variante revela el diseño de armadura completo sin obstrucción de capa. Perfecto para poses de acción que enfatizan los detalles mecánicos del traje. Una variante amigable para exhibición que muestra la tecnología avanzada de Batman."
  },
  {
    minifigure_no: 'sh0218',
    description_en: "Batman with large bat logo emphasizes the iconic chest symbol. This variant features enhanced logo printing for maximum visual impact. The dark bluish gray suit with spongy cape maintains premium quality. A bold Batman variant appealing to collectors who value prominent branding.",
    description_de: "Batman mit großem Fledermaus-Logo betont das ikonische Brust-Symbol. Diese Variante zeigt verbesserten Logo-Druck für maximale visuelle Wirkung. Der dunkelblaugraue Anzug mit schwammigem Cape behält Premium-Qualität bei. Eine kühne Batman-Variante, die Sammler anzieht, die prominente Markenbildung schätzen.",
    description_fr: "Batman avec grand logo de chauve-souris souligne le symbole de poitrine emblématique. Cette variante présente impression de logo améliorée pour impact visuel maximum. Le costume gris bleuté foncé avec cape spongieuse maintient qualité premium. Une variante Batman audacieuse attirant collectionneurs valorisant l'image de marque proéminente.",
    description_es: "Batman con gran logo de murciélago enfatiza el símbolo icónico del pecho. Esta variante presenta impresión de logo mejorada para máximo impacto visual. El traje gris azulado oscuro con capa esponjosa mantiene calidad premium. Una variante audaz de Batman que atrae a coleccionistas que valoran marca prominente."
  },
  {
    minifigure_no: 'sh0219',
    description_en: "Superman with plain legs represents a simplified costume variant. The dark blue suit with spongy cape maintains quality while reducing printing complexity. This cleaner design emphasizes Clark Kent's timeless heroism. A classic Superman variant for purist collectors.",
    description_de: "Superman mit schlichten Beinen repräsentiert eine vereinfachte Kostüm-Variante. Der dunkelblaue Anzug mit schwammigem Cape behält Qualität bei, während er Druck-Komplexität reduziert. Dieses sauberere Design betont Clark Kents zeitloses Heldentum. Eine klassische Superman-Variante für puristische Sammler.",
    description_fr: "Superman avec jambes simples représente une variante de costume simplifiée. Le costume bleu foncé avec cape spongieuse maintient qualité tout en réduisant complexité d'impression. Ce design plus épuré souligne l'héroïsme intemporel de Clark Kent. Une variante Superman classique pour collectionneurs puristes.",
    description_es: "Superman con piernas lisas representa una variante de traje simplificada. El traje azul oscuro con capa esponjosa mantiene calidad mientras reduce complejidad de impresión. Este diseño más limpio enfatiza el heroísmo atemporal de Clark Kent. Una variante clásica de Superman para coleccionistas puristas."
  },
  {
    minifigure_no: 'sh0220',
    description_en: "Superman with red boots adds distinctive footwear detailing. This variant combines dark blue suit and spongy cape with boot printing. The red boots enhance costume accuracy and visual appeal. A refined Superman variant for detail-conscious collectors.",
    description_de: "Superman mit roten Stiefeln fügt charakteristische Schuhwerk-Details hinzu. Diese Variante kombiniert dunkelblauen Anzug und schwammiges Cape mit Stiefel-Druck. Die roten Stiefel verbessern Kostüm-Genauigkeit und visuelle Anziehungskraft. Eine raffinierte Superman-Variante für detailbewusste Sammler.",
    description_fr: "Superman avec bottes rouges ajoute détails de chaussures distinctifs. Cette variante combine costume bleu foncé et cape spongieuse avec impression de bottes. Les bottes rouges améliorent précision de costume et attrait visuel. Une variante Superman raffinée pour collectionneurs soucieux du détail.",
    description_es: "Superman con botas rojas añade detalles distintivos de calzado. Esta variante combina traje azul oscuro y capa esponjosa con impresión de botas. Las botas rojas mejoran precisión de traje y atractivo visual. Una variante refinada de Superman para coleccionistas conscientes del detalle."
  },
  {
    minifigure_no: 'sh0221',
    description_en: "Wonder Woman with dark red torso and dark blue skirt showcases costume color variation. Diana's warrior appearance remains powerful across different designs. This variant offers collectors alternate display options. Essential for comprehensive Wonder Woman costume collection displays.",
    description_de: "Wonder Woman mit dunkelrotem Oberkörper und dunkelblauem Rock zeigt Kostüm-Farbvariation. Dianas Krieger-Aussehen bleibt mächtig über verschiedene Designs hinweg. Diese Variante bietet Sammlern alternative Display-Optionen. Unverzichtbar für umfassende Wonder Woman-Kostüm-Sammlungs-Displays.",
    description_fr: "Wonder Woman avec torse rouge foncé et jupe bleu foncé présente variation de couleur de costume. L'apparence guerrière de Diana reste puissante à travers différents designs. Cette variante offre aux collectionneurs options d'affichage alternatives. Essentiel pour affichages complets de collection de costumes Wonder Woman.",
    description_es: "Wonder Woman con torso rojo oscuro y falda azul oscuro muestra variación de color de traje. La apariencia guerrera de Diana permanece poderosa a través de diferentes diseños. Esta variante ofrece a coleccionistas opciones de exhibición alternativas. Esencial para exhibiciones completas de colección de trajes de Wonder Woman."
  },
  {
    minifigure_no: 'sh0222',
    description_en: "Lex Luthor in tan suit presents the billionaire businessman facade. Superman's greatest enemy hides genius-level intellect behind corporate respectability. This civilian appearance enables dual-identity storytelling. Essential for showcasing Luthor's role as both businessman and supervillain.",
    description_de: "Lex Luthor im beigen Anzug präsentiert die Milliardärs-Geschäftsmann-Fassade. Supermans größter Feind verbirgt geniales Intellekt hinter Unternehmens-Respektabilität. Dieses zivile Aussehen ermöglicht Doppelidentitäts-Storytelling. Unverzichtbar für die Darstellung von Luthors Rolle sowohl als Geschäftsmann als auch als Superschurke.",
    description_fr: "Lex Luthor en costume beige présente la façade d'homme d'affaires milliardaire. Le plus grand ennemi de Superman cache intellect de génie derrière respectabilité corporative. Cette apparence civile permet narration de double identité. Essentiel pour présenter le rôle de Luthor à la fois comme homme d'affaires et super-vilain.",
    description_es: "Lex Luthor en traje beige presenta la fachada de empresario multimillonario. El mayor enemigo de Superman esconde intelecto genial detrás de respetabilidad corporativa. Esta apariencia civil permite narración de identidad dual. Esencial para mostrar el rol de Luthor tanto como empresario como supervillano."
  },
  {
    minifigure_no: 'sh0223',
    description_en: "LexCorp Henchman 2 with dark brown legs serves Lex Luthor's corporate empire. These loyal employees carry out illegal operations behind legitimate business fronts. Essential army builders for creating LexCorp security forces. Perfect for Batman v Superman storyline displays.",
    description_de: "LexCorp-Handlanger 2 mit dunkelbraunen Beinen dient Lex Luthors Unternehmens-Imperium. Diese loyalen Angestellten führen illegale Operationen hinter legitimen Geschäftsfronten aus. Unverzichtbare Armee-Baumeister für die Erstellung von LexCorp-Sicherheitskräften. Perfekt für Batman v Superman-Handlungs-Displays.",
    description_fr: "Sbire LexCorp 2 avec jambes marron foncé sert l'empire corporatif de Lex Luthor. Ces employés loyaux exécutent opérations illégales derrière façades d'affaires légitimes. Constructeurs d'armée essentiels pour créer forces de sécurité LexCorp. Parfait pour affichages d'intrigue Batman v Superman.",
    description_es: "Secuaz de LexCorp 2 con piernas marrón oscuro sirve al imperio corporativo de Lex Luthor. Estos empleados leales ejecutan operaciones ilegales detrás de fachadas comerciales legítimas. Constructores de ejército esenciales para crear fuerzas de seguridad LexCorp. Perfecto para exhibiciones de historia de Batman v Superman."
  },
  {
    minifigure_no: 'sh0224',
    description_en: "LexCorp Henchman 1 with black legs complements Henchman 2 for varied displays. These corporate soldiers protect Luthor's interests through force. Essential army builders for comprehensive LexCorp military formations. Perfect for creating authentic Batman v Superman confrontation scenes.",
    description_de: "LexCorp-Handlanger 1 mit schwarzen Beinen ergänzt Handlanger 2 für vielfältige Displays. Diese Unternehmens-Soldaten schützen Luthors Interessen durch Gewalt. Unverzichtbare Armee-Baumeister für umfassende LexCorp-Militär-Formationen. Perfekt für die Erstellung authentischer Batman v Superman-Konfrontationsszenen.",
    description_fr: "Sbire LexCorp 1 avec jambes noires complète Sbire 2 pour affichages variés. Ces soldats corporatifs protègent les intérêts de Luthor par la force. Constructeurs d'armée essentiels pour formations militaires LexCorp complètes. Parfait pour créer scènes de confrontation Batman v Superman authentiques.",
    description_es: "Secuaz de LexCorp 1 con piernas negras complementa a Secuaz 2 para exhibiciones variadas. Estos soldados corporativos protegen los intereses de Luthor mediante fuerza. Constructores de ejército esenciales para formaciones militares LexCorp completas. Perfecto para crear escenas de confrontación auténticas de Batman v Superman."
  },
  {
    minifigure_no: 'sh0225',
    description_en: "Lois Lane in black suit represents the intrepid Daily Planet reporter. Her journalistic courage and relationship with Superman make her essential. This professional appearance emphasizes her career dedication. A key supporting character for Superman storylines and romantic subplots.",
    description_de: "Lois Lane im schwarzen Anzug repräsentiert die unerschrockene Daily Planet-Reporterin. Ihr journalistischer Mut und ihre Beziehung zu Superman machen sie unverzichtbar. Dieses professionelle Aussehen betont ihre Karriere-Hingabe. Eine Schlüssel-Nebenfigur für Superman-Handlungen und romantische Nebenhandlungen.",
    description_fr: "Lois Lane en costume noir représente l'intrépide reporter du Daily Planet. Son courage journalistique et sa relation avec Superman la rendent essentielle. Cette apparence professionnelle souligne son dévouement à sa carrière. Un personnage secondaire clé pour intrigues Superman et sous-intrigues romantiques.",
    description_es: "Lois Lane en traje negro representa a la intrépida reportera del Daily Planet. Su coraje periodístico y relación con Superman la hacen esencial. Esta apariencia profesional enfatiza su dedicación a carrera. Un personaje secundario clave para historias de Superman y subtramas románticas."
  }
];

async function main() {
  console.log(`🦸 Starting Super Heroes batch sh0201-sh0225 (${descriptions.length} minifigs)...`);
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
  console.log(`✅ Batch complete! ${descriptions.length} minifigs saved. Total: 225 done.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
