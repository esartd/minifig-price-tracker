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
    minifigure_no: 'sh0301',
    description_en: "Cosmic Boy leads the Legion of Super-Heroes with magnetic powers. Rokk Krinn's ability to manipulate magnetism makes him formidable. This futuristic hero brings DC's 31st century to life. Essential for Legion of Super-Heroes collections and DC cosmic hero displays.",
    description_de: "Cosmic Boy führt die Legion der Superhelden mit magnetischen Kräften. Rokk Krinns Fähigkeit, Magnetismus zu manipulieren, macht ihn beeindruckend. Dieser futuristische Held erweckt DCs 31. Jahrhundert zum Leben. Unverzichtbar für Legion der Superhelden-Sammlungen und DC-kosmische Helden-Displays.",
    description_fr: "Cosmic Boy dirige la Légion des Super-Héros avec pouvoirs magnétiques. La capacité de Rokk Krinn à manipuler le magnétisme le rend formidable. Ce héros futuriste donne vie au 31e siècle de DC. Essentiel pour collections Légion des Super-Héros et affichages de héros cosmiques DC.",
    description_es: "Cosmic Boy lidera la Legión de Superhéroes con poderes magnéticos. La habilidad de Rokk Krinn para manipular magnetismo lo hace formidable. Este héroe futurista da vida al siglo 31 de DC. Esencial para colecciones de Legión de Superhéroes y exhibiciones de héroes cósmicos DC."
  },
  {
    minifigure_no: 'sh0302',
    description_en: "Hawkeye in black and dark purple suit represents his solo operative appearance. Clint Barton's master archery skills remain essential despite color variation. This darker costume scheme offers display variety. A sleek Hawkeye variant appealing to collectors seeking every costume design.",
    description_de: "Hawkeye im schwarzen und dunkellilanen Anzug repräsentiert sein Solo-Operativen-Aussehen. Clint Bartons Meister-Bogenschützen-Fähigkeiten bleiben trotz Farbvariation unverzichtbar. Dieses dunklere Kostümschema bietet Display-Vielfalt. Eine elegante Hawkeye-Variante, die Sammler anzieht, die jedes Kostümdesign suchen.",
    description_fr: "Hawkeye en costume noir et violet foncé représente son apparence d'opératif solo. Les compétences d'archerie maître de Clint Barton restent essentielles malgré la variation de couleur. Ce schéma de costume plus sombre offre variété d'affichage. Une variante Hawkeye élégante attirant collectionneurs recherchant chaque design de costume.",
    description_es: "Hawkeye en traje negro y morado oscuro representa su apariencia de operativo solitario. Las habilidades de arquería maestra de Clint Barton permanecen esenciales a pesar de variación de color. Este esquema de traje más oscuro ofrece variedad de exhibición. Una variante elegante de Hawkeye que atrae a coleccionistas que buscan cada diseño de traje."
  },
  {
    minifigure_no: 'sh0303',
    description_en: "Vision with yellow spot on forehead represents an alternate Mind Stone depiction. This synthetic being's appearance varies across interpretations. The yellow forehead gem distinguishes this variant. A valuable Vision piece for collectors exploring different visual representations.",
    description_de: "Vision mit gelbem Fleck auf der Stirn repräsentiert eine alternative Mind Stone-Darstellung. Das Aussehen dieses synthetischen Wesens variiert über Interpretationen hinweg. Der gelbe Stirn-Edelstein unterscheidet diese Variante. Ein wertvolles Vision-Teil für Sammler, die verschiedene visuelle Darstellungen erforschen.",
    description_fr: "Vision avec tache jaune sur front représente une représentation alternative de la Pierre de l'Esprit. L'apparence de cet être synthétique varie selon les interprétations. La gemme frontale jaune distingue cette variante. Une pièce Vision précieuse pour collectionneurs explorant différentes représentations visuelles.",
    description_es: "Visión con mancha amarilla en frente representa una representación alternativa de la Gema de la Mente. La apariencia de este ser sintético varía entre interpretaciones. La gema frontal amarilla distingue esta variante. Una pieza valiosa de Visión para coleccionistas que exploran diferentes representaciones visuales."
  },
  {
    minifigure_no: 'sh0304',
    description_en: "Tartan Batman brings Scottish heritage to the Dark Knight. This themed variant combines Batman aesthetics with plaid patterns. Perfect for alternate universe and cultural crossover displays. A unique Batman piece appealing to collectors seeking unconventional designs.",
    description_de: "Tartan Batman bringt schottisches Erbe zum Dark Knight. Diese thematische Variante kombiniert Batman-Ästhetik mit Karo-Mustern. Perfekt für alternative Universum- und kulturelle Crossover-Displays. Ein einzigartiges Batman-Teil, das Sammler anzieht, die unkonventionelle Designs suchen.",
    description_fr: "Tartan Batman apporte héritage écossais au Chevalier Noir. Cette variante thématique combine esthétique Batman avec motifs écossais. Parfait pour affichages d'univers alternatif et croisement culturel. Une pièce Batman unique attirant collectionneurs recherchant designs non conventionnels.",
    description_es: "Tartan Batman aporta herencia escocesa al Caballero Oscuro. Esta variante temática combina estética de Batman con patrones de tartán. Perfecto para exhibiciones de universo alternativo y cruce cultural. Una pieza única de Batman que atrae a coleccionistas que buscan diseños no convencionales."
  },
  {
    minifigure_no: 'sh0305',
    description_en: "Batgirl with dark purple suit and dual expressions captures Barbara Gordon's heroic versatility. The open mouth smile and concerned face offer display flexibility. The yellow cape adds distinctive color contrast. Essential for comprehensive Bat-family collections showing emotional range.",
    description_de: "Batgirl mit dunkellilafarbenem Anzug und Doppelausdruck erfasst Barbara Gordons heroische Vielseitigkeit. Das offene Mund-Lächeln und besorgte Gesicht bieten Display-Flexibilität. Das gelbe Cape fügt charakteristischen Farbkontrast hinzu. Unverzichtbar für umfassende Bat-Familien-Sammlungen, die emotionale Bandbreite zeigen.",
    description_fr: "Batgirl avec costume violet foncé et expressions doubles capture la polyvalence héroïque de Barbara Gordon. Le sourire bouche ouverte et visage préoccupé offrent flexibilité d'affichage. La cape jaune ajoute contraste de couleur distinctif. Essentiel pour collections complètes de famille Bat montrant gamme émotionnelle.",
    description_es: "Batgirl con traje morado oscuro y expresiones duales captura la versatilidad heroica de Barbara Gordon. La sonrisa de boca abierta y cara preocupada ofrecen flexibilidad de exhibición. La capa amarilla añade contraste de color distintivo. Esencial para colecciones completas de familia Bat que muestran rango emocional."
  },
  {
    minifigure_no: 'sh0306',
    description_en: "Harley Quinn with roller skates brings kinetic energy to the character. The black eye mask with pigtails captures her playful chaos. Roller skates add unique mobility element. A dynamic Harley variant perfect for action-oriented display scenarios.",
    description_de: "Harley Quinn mit Rollschuhen bringt kinetische Energie zur Figur. Die schwarze Augenmaske mit Zöpfen erfasst ihr verspieltes Chaos. Rollschuhe fügen einzigartiges Mobilitätselement hinzu. Eine dynamische Harley-Variante, perfekt für actionorientierte Display-Szenarien.",
    description_fr: "Harley Quinn avec patins à roulettes apporte énergie cinétique au personnage. Le masque oculaire noir avec couettes capture son chaos ludique. Les patins à roulettes ajoutent élément de mobilité unique. Une variante Harley dynamique parfaite pour scénarios d'affichage orientés action.",
    description_es: "Harley Quinn con patines de ruedas aporta energía cinética al personaje. La máscara de ojos negra con coletas captura su caos juguetón. Los patines de ruedas añaden elemento de movilidad único. Una variante dinámica de Harley perfecta para escenarios de exhibición orientados a acción."
  },
  {
    minifigure_no: 'sh0307',
    description_en: "The Joker in vest and shirtsleeves with smile showing fang captures his menacing charm. This casual yet threatening appearance emphasizes unpredictability. The fang detail adds sinister character. A distinctive Joker variant showcasing his chaotic personality.",
    description_de: "Der Joker in Weste und Hemdärmeln mit Lächeln, das Fang zeigt, erfasst seinen bedrohlichen Charme. Dieses lässige, aber bedrohliche Aussehen betont Unvorhersehbarkeit. Das Fang-Detail fügt unheimlichen Charakter hinzu. Eine charakteristische Joker-Variante, die seine chaotische Persönlichkeit zeigt.",
    description_fr: "Le Joker en gilet et manches de chemise avec sourire montrant croc capture son charme menaçant. Cette apparence décontractée mais menaçante souligne l'imprévisibilité. Le détail de croc ajoute caractère sinistre. Une variante Joker distinctive présentant sa personnalité chaotique.",
    description_es: "El Joker en chaleco y mangas de camisa con sonrisa mostrando colmillo captura su encanto amenazante. Esta apariencia casual pero amenazante enfatiza imprevisibilidad. El detalle de colmillo añade carácter siniestro. Una variante distintiva del Joker que muestra su personalidad caótica."
  },
  {
    minifigure_no: 'sh0308',
    description_en: "Bruce Wayne in white tuxedo shows the billionaire at formal events. This sophisticated appearance contrasts with Batman's dark persona. Perfect for gala scenes and dual-identity storytelling. Essential for Wayne Manor and high-society display scenarios.",
    description_de: "Bruce Wayne im weißen Smoking zeigt den Milliardär bei formellen Veranstaltungen. Dieses anspruchsvolle Aussehen kontrastiert mit Batmans dunkler Persona. Perfekt für Gala-Szenen und Doppelidentitäts-Storytelling. Unverzichtbar für Wayne Manor- und High-Society-Display-Szenarien.",
    description_fr: "Bruce Wayne en smoking blanc montre le milliardaire lors d'événements formels. Cette apparence sophistiquée contraste avec la personne sombre de Batman. Parfait pour scènes de gala et narration de double identité. Essentiel pour scénarios d'affichage Wayne Manor et haute société.",
    description_es: "Bruce Wayne en esmoquin blanco muestra al multimillonario en eventos formales. Esta apariencia sofisticada contrasta con la persona oscura de Batman. Perfecto para escenas de gala y narración de identidad dual. Esencial para escenarios de exhibición de Wayne Manor y alta sociedad."
  },
  {
    minifigure_no: 'sh0309',
    description_en: "Batman in Scu-Batsuit represents specialized diving equipment. This aquatic variant enables underwater crime-fighting missions. The scuba configuration adds tactical versatility. Perfect for underwater villain encounters and expanding Batman's operational environments.",
    description_de: "Batman im Scu-Batsuit repräsentiert spezialisierte Tauchausrüstung. Diese aquatische Variante ermöglicht Unterwasser-Verbrechensbekämpfungs-Missionen. Die Tauch-Konfiguration fügt taktische Vielseitigkeit hinzu. Perfekt für Unterwasser-Schurken-Begegnungen und Erweiterung von Batmans Einsatzumgebungen.",
    description_fr: "Batman en Scu-Batsuit représente équipement de plongée spécialisé. Cette variante aquatique permet missions de lutte contre le crime sous-marines. La configuration de plongée ajoute polyvalence tactique. Parfait pour rencontres de méchants sous-marins et expansion des environnements opérationnels de Batman.",
    description_es: "Batman en Scu-Batsuit representa equipo de buceo especializado. Esta variante acuática permite misiones de lucha contra el crimen submarinas. La configuración de buceo añade versatilidad táctica. Perfecto para encuentros con villanos submarinos y expansión de ambientes operacionales de Batman."
  },
  {
    minifigure_no: 'sh0310',
    description_en: "Batman with Bat-Pack brings aerial mobility to crime-fighting. This jetpack-equipped suit enables flight capabilities. The specialized equipment expands tactical options. A unique Batman variant perfect for aerial pursuit and rooftop action displays.",
    description_de: "Batman mit Bat-Pack bringt Luftmobilität zur Verbrechensbekämpfung. Dieser jetpack-ausgerüstete Anzug ermöglicht Flugfähigkeiten. Die spezialisierte Ausrüstung erweitert taktische Optionen. Eine einzigartige Batman-Variante, perfekt für Luftverfolgung und Dach-Action-Displays.",
    description_fr: "Batman avec Bat-Pack apporte mobilité aérienne à la lutte contre le crime. Cette combinaison équipée de jetpack permet capacités de vol. L'équipement spécialisé élargit options tactiques. Une variante Batman unique parfaite pour poursuite aérienne et affichages d'action sur toits.",
    description_es: "Batman con Bat-Pack aporta movilidad aérea a la lucha contra el crimen. Este traje equipado con jetpack permite capacidades de vuelo. El equipo especializado expande opciones tácticas. Una variante única de Batman perfecta para persecución aérea y exhibiciones de acción en tejados."
  },
  {
    minifigure_no: 'sh0311',
    description_en: "Batman in Raging Batsuit emphasizes raw power and intimidation. This heavily armored variant showcases maximum force capability. The aggressive design reflects Batman's darker methods. Essential for displaying Batman's tactical range from stealth to overwhelming force.",
    description_de: "Batman im Raging Batsuit betont rohe Kraft und Einschüchterung. Diese schwer gepanzerte Variante zeigt maximale Kraft-Fähigkeit. Das aggressive Design spiegelt Batmans dunklere Methoden wider. Unverzichtbar für die Darstellung von Batmans taktischer Bandbreite von Heimlichkeit bis überwältigender Gewalt.",
    description_fr: "Batman en Raging Batsuit souligne puissance brute et intimidation. Cette variante lourdement blindée présente capacité de force maximale. Le design agressif reflète les méthodes plus sombres de Batman. Essentiel pour afficher la gamme tactique de Batman de la furtivité à la force écrasante.",
    description_es: "Batman en Raging Batsuit enfatiza poder bruto e intimidación. Esta variante pesadamente blindada muestra capacidad de fuerza máxima. El diseño agresivo refleja métodos más oscuros de Batman. Esencial para mostrar el rango táctico de Batman desde sigilo hasta fuerza abrumadora."
  },
  {
    minifigure_no: 'sh0312',
    description_en: "Batman with utility belt and head type 1 represents classic costume configuration. The utility belt emphasizes Batman's preparedness philosophy. This standard design serves as foundation for Batman collections. Essential baseline piece for comprehensive Dark Knight displays.",
    description_de: "Batman mit Utility Belt und Kopf Typ 1 repräsentiert klassische Kostüm-Konfiguration. Der Utility Belt betont Batmans Vorbereitungs-Philosophie. Dieses Standarddesign dient als Grundlage für Batman-Sammlungen. Unverzichtbares Basis-Teil für umfassende Dark Knight-Displays.",
    description_fr: "Batman avec ceinture utilitaire et type de tête 1 représente configuration de costume classique. La ceinture utilitaire souligne la philosophie de préparation de Batman. Ce design standard sert de fondation pour collections Batman. Pièce de base essentielle pour affichages Chevalier Noir complets.",
    description_es: "Batman con cinturón utilitario y tipo de cabeza 1 representa configuración de traje clásica. El cinturón utilitario enfatiza la filosofía de preparación de Batman. Este diseño estándar sirve como base para colecciones de Batman. Pieza base esencial para exhibiciones completas del Caballero Oscuro."
  },
  {
    minifigure_no: 'sh0313',
    description_en: "Alfred Pennyworth in pinstripe vest shows the butler's distinguished service. This formal attire emphasizes his professional dedication. The pinstripe detail adds sophistication. Essential supporting character for Wayne Manor domestic scenes and Batman's support system displays.",
    description_de: "Alfred Pennyworth in Nadelstreifen-Weste zeigt den ausgezeichneten Dienst des Butlers. Diese formelle Kleidung betont seine professionelle Hingabe. Das Nadelstreifen-Detail fügt Raffinesse hinzu. Unverzichtbare Nebenfigur für Wayne Manor-Haushaltsszenen und Batmans Unterstützungssystem-Displays.",
    description_fr: "Alfred Pennyworth en gilet à fines rayures montre le service distingué du majordome. Cette tenue formelle souligne son dévouement professionnel. Le détail de fines rayures ajoute sophistication. Personnage secondaire essentiel pour scènes domestiques Wayne Manor et affichages de système de soutien de Batman.",
    description_es: "Alfred Pennyworth en chaleco a rayas finas muestra el servicio distinguido del mayordomo. Esta vestimenta formal enfatiza su dedicación profesional. El detalle de rayas finas añade sofisticación. Personaje secundario esencial para escenas domésticas de Wayne Manor y exhibiciones de sistema de apoyo de Batman."
  },
  {
    minifigure_no: 'sh0314',
    description_en: "The Penguin with white fur collar and smile captures his ostentatious villainy. Oswald Cobblepot's refined criminal empire combines class with cruelty. The white fur adds luxurious detail. A sophisticated Penguin variant essential for comprehensive Batman villain displays.",
    description_de: "Der Penguin mit weißem Pelzkragen und Lächeln erfasst seine auffällige Schurkentat. Oswald Cobblepots raffiniertes Verbrecherimperium kombiniert Klasse mit Grausamkeit. Der weiße Pelz fügt luxuriöses Detail hinzu. Eine anspruchsvolle Penguin-Variante, unverzichtbar für umfassende Batman-Schurken-Displays.",
    description_fr: "Le Pingouin avec col de fourrure blanche et sourire capture sa vilenie ostentatoire. L'empire criminel raffiné d'Oswald Cobblepot combine classe avec cruauté. La fourrure blanche ajoute détail luxueux. Une variante Pingouin sophistiquée essentielle pour affichages complets de méchants Batman.",
    description_es: "El Pingüino con cuello de piel blanca y sonrisa captura su villanía ostentosa. El imperio criminal refinado de Oswald Cobblepot combina clase con crueldad. La piel blanca añade detalle lujoso. Una variante sofisticada del Pingüino esencial para exhibiciones completas de villanos de Batman."
  },
  {
    minifigure_no: 'sh0315',
    description_en: "Robin with green glasses and dual expressions shows Dick Grayson's youthful personality. The smile and scared face capture his emotional range. Green glasses add distinctive character detail. Perfect for dynamic storytelling emphasizing Robin's growth and vulnerability.",
    description_de: "Robin mit grüner Brille und Doppelausdruck zeigt Dick Graysons jugendliche Persönlichkeit. Das Lächeln und ängstliche Gesicht erfassen seine emotionale Bandbreite. Grüne Brille fügt charakteristisches Charakter-Detail hinzu. Perfekt für dynamisches Storytelling, das Robins Wachstum und Verletzlichkeit betont.",
    description_fr: "Robin avec lunettes vertes et expressions doubles montre la personnalité juvénile de Dick Grayson. Le sourire et visage effrayé capturent sa gamme émotionnelle. Les lunettes vertes ajoutent détail de caractère distinctif. Parfait pour narration dynamique soulignant la croissance et vulnérabilité de Robin.",
    description_es: "Robin con gafas verdes y expresiones duales muestra la personalidad juvenil de Dick Grayson. La sonrisa y cara asustada capturan su rango emocional. Las gafas verdes añaden detalle de carácter distintivo. Perfecto para narración dinámica que enfatiza crecimiento y vulnerabilidad de Robin."
  },
  {
    minifigure_no: 'sh0316',
    description_en: "Kabuki Twin brings Japanese theatrical tradition to Gotham villains. These masked henchmen combine cultural aesthetics with criminal activity. The kabuki design creates visually striking adversaries. Essential army builders for creating diverse Gotham criminal organization displays.",
    description_de: "Kabuki Twin bringt japanische Theater-Tradition zu Gotham-Schurken. Diese maskierten Handlanger kombinieren kulturelle Ästhetik mit krimineller Aktivität. Das Kabuki-Design schafft visuell auffällige Gegner. Unverzichtbare Armee-Baumeister für die Erstellung vielfältiger Gotham-Verbrecherorganisations-Displays.",
    description_fr: "Kabuki Twin apporte tradition théâtrale japonaise aux méchants de Gotham. Ces sbires masqués combinent esthétique culturelle avec activité criminelle. Le design kabuki crée adversaires visuellement frappants. Constructeurs d'armée essentiels pour créer affichages diversifiés d'organisation criminelle Gotham.",
    description_es: "Kabuki Twin aporta tradición teatral japonesa a villanos de Gotham. Estos secuaces enmascarados combinan estética cultural con actividad criminal. El diseño kabuki crea adversarios visualmente impactantes. Constructores de ejército esenciales para crear exhibiciones diversas de organización criminal de Gotham."
  },
  {
    minifigure_no: 'sh0318',
    description_en: "Batman with utility belt and head type 2 offers alternate facial sculpt. This variant provides collectors with different display expression options. The utility belt remains central to Batman's preparedness. A valuable piece for collectors seeking every Batman head variation.",
    description_de: "Batman mit Utility Belt und Kopf Typ 2 bietet alternative Gesichtsskulptur. Diese Variante bietet Sammlern verschiedene Display-Ausdrucksoptionen. Der Utility Belt bleibt zentral für Batmans Vorbereitheit. Ein wertvolles Teil für Sammler, die jede Batman-Kopf-Variation suchen.",
    description_fr: "Batman avec ceinture utilitaire et type de tête 2 offre sculpture faciale alternative. Cette variante fournit aux collectionneurs différentes options d'expression d'affichage. La ceinture utilitaire reste centrale à la préparation de Batman. Une pièce précieuse pour collectionneurs recherchant chaque variation de tête Batman.",
    description_es: "Batman con cinturón utilitario y tipo de cabeza 2 ofrece escultura facial alternativa. Esta variante proporciona a coleccionistas diferentes opciones de expresión de exhibición. El cinturón utilitario permanece central para la preparación de Batman. Una pieza valiosa para coleccionistas que buscan cada variación de cabeza de Batman."
  },
  {
    minifigure_no: 'sh0319',
    description_en: "Mr. Freeze with shoulder ice armor showcases enhanced cold-technology design. Victor Fries' cryogenic suit gains additional protective elements. The shoulder armor emphasizes his frozen aesthetic. A refined Mr. Freeze variant for collectors emphasizing technological villain displays.",
    description_de: "Mr. Freeze mit Schulter-Eis-Rüstung zeigt verbessertes Kälte-Technologie-Design. Victor Fries' kryogener Anzug gewinnt zusätzliche Schutz-Elemente. Die Schulter-Rüstung betont seine gefrorene Ästhetik. Eine raffinierte Mr. Freeze-Variante für Sammler, die technologische Schurken-Displays betonen.",
    description_fr: "Mr. Freeze avec armure de glace d'épaule présente design de technologie froide amélioré. Le costume cryogénique de Victor Fries gagne des éléments de protection supplémentaires. L'armure d'épaule souligne son esthétique gelée. Une variante Mr. Freeze raffinée pour collectionneurs soulignant affichages de méchants technologiques.",
    description_es: "Mr. Freeze con armadura de hielo en hombros muestra diseño mejorado de tecnología fría. El traje criogénico de Victor Fries gana elementos protectores adicionales. La armadura de hombros enfatiza su estética congelada. Una variante refinada de Mr. Freeze para coleccionistas que enfatizan exhibiciones de villanos tecnológicos."
  },
  {
    minifigure_no: 'sh0320',
    description_en: "Security Guard with fire helmet represents emergency responders in superhero scenarios. These brave civilians face extraordinary dangers during villain attacks. Perfect for rescue scenes and disaster response displays. A supporting character adding realism to action-packed storylines.",
    description_de: "Sicherheitsbeamter mit Feuerwehrhelm repräsentiert Notfall-Einsatzkräfte in Superhelden-Szenarien. Diese tapferen Zivilisten begegnen außergewöhnlichen Gefahren während Schurken-Angriffen. Perfekt für Rettungsszenen und Katastrophen-Reaktions-Displays. Eine Nebenfigur, die actionreichen Handlungen Realismus hinzufügt.",
    description_fr: "Gardien de Sécurité avec casque de pompier représente intervenants d'urgence dans scénarios de super-héros. Ces civils courageux font face à dangers extraordinaires pendant attaques de méchants. Parfait pour scènes de sauvetage et affichages de réponse aux catastrophes. Un personnage secondaire ajoutant réalisme aux intrigues pleines d'action.",
    description_es: "Guardia de Seguridad con casco de bombero representa personal de emergencia en escenarios de superhéroes. Estos valientes civiles enfrentan peligros extraordinarios durante ataques de villanos. Perfecto para escenas de rescate y exhibiciones de respuesta a desastres. Un personaje secundario que añade realismo a historias llenas de acción."
  },
  {
    minifigure_no: 'sh0321',
    description_en: "Killer Croc with blue pants and claws emphasizes his reptilian mutation. Waylon Jones' enhanced physical form gains additional menacing detail. The claws add distinctive attack capability. A powerful Killer Croc variant perfect for displaying raw physical threats.",
    description_de: "Killer Croc mit blauen Hosen und Klauen betont seine reptilienartige Mutation. Waylon Jones' verbesserte physische Form gewinnt zusätzliche bedrohliche Details. Die Klauen fügen charakteristische Angriffsfähigkeit hinzu. Eine mächtige Killer Croc-Variante, perfekt für die Darstellung roher physischer Bedrohungen.",
    description_fr: "Killer Croc avec pantalon bleu et griffes souligne sa mutation reptilienne. La forme physique améliorée de Waylon Jones gagne détail menaçant supplémentaire. Les griffes ajoutent capacité d'attaque distinctive. Une variante Killer Croc puissante parfaite pour afficher menaces physiques brutes.",
    description_es: "Killer Croc con pantalones azules y garras enfatiza su mutación reptiliana. La forma física mejorada de Waylon Jones gana detalle amenazante adicional. Las garras añaden capacidad de ataque distintiva. Una variante poderosa de Killer Croc perfecta para mostrar amenazas físicas brutas."
  },
  {
    minifigure_no: 'sh0322',
    description_en: "Tarantula brings spider-themed villainy to Batman's rogues. This obscure villain adds depth to Gotham's criminal ecosystem. The arachnid design creates visually distinctive adversary. A collectible piece for completionist Batman villain collections.",
    description_de: "Tarantula bringt spinnen-thematische Schurkentat zu Batmans Rogues. Dieser obskure Schurke fügt Tiefe zu Gothams kriminellem Ökosystem hinzu. Das Arachniden-Design schafft visuell charakteristischen Gegner. Ein sammelbares Teil für vervollständigende Batman-Schurken-Sammlungen.",
    description_fr: "Tarantula apporte vilenie à thème araignée aux voyous de Batman. Ce méchant obscur ajoute profondeur à l'écosystème criminel de Gotham. Le design arachnide crée adversaire visuellement distinctif. Une pièce collectionnable pour collections complétistes de méchants Batman.",
    description_es: "Tarantula aporta villanía temática de araña a los pícaros de Batman. Este villano oscuro añade profundidad al ecosistema criminal de Gotham. El diseño arácnido crea adversario visualmente distintivo. Una pieza coleccionable para colecciones completistas de villanos de Batman."
  },
  {
    minifigure_no: 'sh0323',
    description_en: "Zebra-Man brings striped villainy to Batman's rogues gallery. This obscure character adds visual variety to criminal displays. The zebra pattern creates memorable aesthetic. A unique villain piece appealing to collectors seeking complete Batman adversary rosters.",
    description_de: "Zebra-Man bringt gestreifte Schurkentat zu Batmans Rogues Gallery. Diese obskure Figur fügt visuelle Vielfalt zu kriminellen Displays hinzu. Das Zebra-Muster schafft unvergessliche Ästhetik. Ein einzigartiges Schurken-Teil, das Sammler anzieht, die vollständige Batman-Gegner-Aufstellungen suchen.",
    description_fr: "Zebra-Man apporte vilenie rayée à la galerie de voyous de Batman. Ce personnage obscur ajoute variété visuelle aux affichages criminels. Le motif zèbre crée esthétique mémorable. Une pièce de méchant unique attirant collectionneurs recherchant rosters complets d'adversaires Batman.",
    description_es: "Zebra-Man aporta villanía rayada a la galería de pícaros de Batman. Este personaje oscuro añade variedad visual a exhibiciones criminales. El patrón de cebra crea estética memorable. Una pieza de villano única que atrae a coleccionistas que buscan planteles completos de adversarios de Batman."
  },
  {
    minifigure_no: 'sh0324',
    description_en: "The Joker with long coattails and fang smile captures theatrical villainy. This dramatic costume emphasizes his showman personality. The flowing coattails add visual flair. A striking Joker variant perfect for emphasizing his theatrical criminal performances.",
    description_de: "Der Joker mit langen Rockschößen und Fang-Lächeln erfasst theatralische Schurkentat. Dieses dramatische Kostüm betont seine Showman-Persönlichkeit. Die fließenden Rockschöße fügen visuelles Flair hinzu. Eine auffällige Joker-Variante, perfekt für die Betonung seiner theatralischen kriminellen Aufführungen.",
    description_fr: "Le Joker avec longues basques et sourire de croc capture vilenie théâtrale. Ce costume dramatique souligne sa personnalité de showman. Les basques fluides ajoutent panache visuel. Une variante Joker frappante parfaite pour souligner ses performances criminelles théâtrales.",
    description_es: "El Joker con faldones largos y sonrisa de colmillo captura villanía teatral. Este traje dramático enfatiza su personalidad de showman. Los faldones fluidos añaden estilo visual. Una variante llamativa del Joker perfecta para enfatizar sus actuaciones criminales teatrales."
  },
  {
    minifigure_no: 'sh0325',
    description_en: "Dick Grayson in tuxedo shows Robin's civilian identity at formal events. This sophisticated appearance enables dual-identity storytelling. Perfect for Wayne Manor galas and high-society scenes. Essential for comprehensive Dick Grayson character development displays.",
    description_de: "Dick Grayson im Smoking zeigt Robins zivile Identität bei formellen Veranstaltungen. Dieses anspruchsvolle Aussehen ermöglicht Doppelidentitäts-Storytelling. Perfekt für Wayne Manor-Galas und High-Society-Szenen. Unverzichtbar für umfassende Dick Grayson-Charakterentwicklungs-Displays.",
    description_fr: "Dick Grayson en smoking montre l'identité civile de Robin lors d'événements formels. Cette apparence sophistiquée permet narration de double identité. Parfait pour galas Wayne Manor et scènes de haute société. Essentiel pour affichages complets de développement de personnage Dick Grayson.",
    description_es: "Dick Grayson en esmoquin muestra la identidad civil de Robin en eventos formales. Esta apariencia sofisticada permite narración de identidad dual. Perfecto para galas de Wayne Manor y escenas de alta sociedad. Esencial para exhibiciones completas de desarrollo de personaje de Dick Grayson."
  }
];

async function main() {
  console.log(`🦸 Starting Super Heroes batch sh0301-sh0325 (${descriptions.length} minifigs)...`);
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
  console.log(`✅ Batch complete! ${descriptions.length} minifigs saved. Total: 325 done.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
