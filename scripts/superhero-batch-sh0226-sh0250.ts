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
    minifigure_no: 'sh0226',
    description_en: "Captain Marvel with red sash brings cosmic power to Earth's mightiest heroes. Billy Batson's magical transformation grants Shazam-level abilities. This classic design features the distinctive red sash detail. An essential DC hero representing magical heroism and youthful wonder.",
    description_de: "Captain Marvel mit roter Schärpe bringt kosmische Macht zu den mächtigsten Helden der Erde. Billy Batsons magische Verwandlung verleiht Shazam-Level-Fähigkeiten. Dieses klassische Design zeigt das charakteristische rote Schärpen-Detail. Ein unverzichtbarer DC-Held, der magisches Heldentum und jugendliches Staunen repräsentiert.",
    description_fr: "Captain Marvel avec écharpe rouge apporte pouvoir cosmique aux héros les plus puissants de la Terre. La transformation magique de Billy Batson accorde des capacités de niveau Shazam. Ce design classique présente le détail d'écharpe rouge distinctive. Un héros DC essentiel représentant héroïsme magique et émerveillement juvénile.",
    description_es: "Capitán Marvel con faja roja aporta poder cósmico a los héroes más poderosos de la Tierra. La transformación mágica de Billy Batson otorga habilidades de nivel Shazam. Este diseño clásico presenta el detalle distintivo de faja roja. Un héroe DC esencial que representa heroísmo mágico y asombro juvenil."
  },
  {
    minifigure_no: 'sh0227',
    description_en: "Hyperion commands Superman-level powers as Marvel's Squadron Supreme member. This alternate universe hero mirrors Justice League dynamics. His immense strength and flight capabilities make him formidable. A rare Marvel character essential for multiverse and alternate reality collections.",
    description_de: "Hyperion befehligt Superman-Level-Kräfte als Marvels Squadron Supreme-Mitglied. Dieser alternative Universum-Held spiegelt Justice League-Dynamiken. Seine immense Stärke und Flugfähigkeiten machen ihn beeindruckend. Eine seltene Marvel-Figur, unverzichtbar für Multiversum- und alternative Realitäts-Sammlungen.",
    description_fr: "Hyperion commande des pouvoirs de niveau Superman comme membre du Squadron Supreme de Marvel. Ce héros d'univers alternatif reflète les dynamiques de la Justice League. Sa force immense et ses capacités de vol le rendent formidable. Un personnage Marvel rare essentiel pour collections de multivers et réalité alternative.",
    description_es: "Hyperion comanda poderes de nivel Superman como miembro del Escuadrón Supremo de Marvel. Este héroe de universo alternativo refleja dinámicas de la Liga de la Justicia. Su inmensa fuerza y capacidades de vuelo lo hacen formidable. Un personaje Marvel raro esencial para colecciones de multiverso y realidad alternativa."
  },
  {
    minifigure_no: 'sh0228',
    description_en: "Space Captain America extends Steve Rogers' heroism to cosmic threats. This specialized suit enables interstellar missions. The space-themed design combines patriotic colors with sci-fi elements. A unique Captain America variant for cosmic adventure displays.",
    description_de: "Space Captain America erweitert Steve Rogers' Heldentum auf kosmische Bedrohungen. Dieser spezialisierte Anzug ermöglicht interstellare Missionen. Das weltraum-thematische Design kombiniert patriotische Farben mit Sci-Fi-Elementen. Eine einzigartige Captain America-Variante für kosmische Abenteuer-Displays.",
    description_fr: "Space Captain America étend l'héroïsme de Steve Rogers aux menaces cosmiques. Ce costume spécialisé permet des missions interstellaires. Le design à thème spatial combine couleurs patriotiques avec éléments sci-fi. Une variante Captain America unique pour affichages d'aventure cosmique.",
    description_es: "Space Captain America extiende el heroísmo de Steve Rogers a amenazas cósmicas. Este traje especializado permite misiones interestelares. El diseño temático espacial combina colores patrióticos con elementos de ciencia ficción. Una variante única del Capitán América para exhibiciones de aventura cósmica."
  },
  {
    minifigure_no: 'sh0229',
    description_en: "Space Iron Man brings Tony Stark's genius to extraterrestrial missions. This cosmic armor variant features specialized deep space capabilities. The design combines signature Iron Man aesthetics with space technology. Perfect for Guardians of the Galaxy crossover displays.",
    description_de: "Space Iron Man bringt Tony Starks Genie zu außerirdischen Missionen. Diese kosmische Rüstungs-Variante zeigt spezialisierte Weltraum-Fähigkeiten. Das Design kombiniert charakteristische Iron Man-Ästhetik mit Weltraum-Technologie. Perfekt für Guardians of the Galaxy-Crossover-Displays.",
    description_fr: "Space Iron Man apporte le génie de Tony Stark aux missions extraterrestres. Cette variante d'armure cosmique présente des capacités d'espace profond spécialisées. Le design combine esthétique Iron Man signature avec technologie spatiale. Parfait pour affichages de crossover Gardiens de la Galaxie.",
    description_es: "Space Iron Man aporta el genio de Tony Stark a misiones extraterrestres. Esta variante de armadura cósmica presenta capacidades especializadas de espacio profundo. El diseño combina estética característica de Iron Man con tecnología espacial. Perfecto para exhibiciones de cruce de Guardianes de la Galaxia."
  },
  {
    minifigure_no: 'sh0230',
    description_en: "Thanos emerges as Marvel's ultimate cosmic threat. The Mad Titan's quest for the Infinity Stones drives MCU's overarching narrative. This large-format figure captures his imposing presence in dark blue and pearl gold. An essential centerpiece villain representing Marvel's greatest antagonist.",
    description_de: "Thanos tritt als Marvels ultimative kosmische Bedrohung auf. Die Suche des Wahnsinnigen Titanen nach den Infinity-Steinen treibt die übergreifende MCU-Erzählung. Diese großformatige Figur erfasst seine imposante Präsenz in dunkelblau und perlgold. Ein unverzichtbarer Herzstück-Schurke, der Marvels größten Antagonisten repräsentiert.",
    description_fr: "Thanos émerge comme la menace cosmique ultime de Marvel. La quête du Titan Fou pour les Pierres d'Infinité motive le récit global du MCU. Cette figurine grand format capture sa présence imposante en bleu foncé et or perlé. Une pièce maîtresse de méchant essentielle représentant le plus grand antagoniste de Marvel.",
    description_es: "Thanos emerge como la amenaza cósmica definitiva de Marvel. La búsqueda del Titán Loco por las Gemas del Infinito impulsa la narrativa general del MCU. Esta figura de gran formato captura su presencia imponente en azul oscuro y oro perlado. Una pieza central de villano esencial que representa al mayor antagonista de Marvel."
  },
  {
    minifigure_no: 'sh0231',
    description_en: "Iron Man Mark 7 with small helmet visor represents the Avengers assembly suit. This iconic armor featured prominently in the Battle of New York. The refined visor design distinguishes this variant. Essential for chronicling Iron Man's armor evolution through MCU Phase 1.",
    description_de: "Iron Man Mark 7 mit kleinem Helm-Visier repräsentiert den Avengers-Versammlungs-Anzug. Diese ikonische Rüstung erschien prominent in der Schlacht um New York. Das raffinierte Visier-Design unterscheidet diese Variante. Unverzichtbar für die Chronik von Iron Mans Rüstungs-Evolution durch MCU Phase 1.",
    description_fr: "Iron Man Mark 7 avec petite visière de casque représente le costume d'assemblage Avengers. Cette armure emblématique figurait en bonne place dans la Bataille de New York. Le design de visière raffiné distingue cette variante. Essentiel pour chronicler l'évolution d'armure d'Iron Man à travers MCU Phase 1.",
    description_es: "Iron Man Mark 7 con visera pequeña de casco representa el traje de ensamblaje de Vengadores. Esta armadura icónica apareció prominentemente en la Batalla de Nueva York. El diseño de visera refinado distingue esta variante. Esencial para relatar la evolución de armadura de Iron Man a través de MCU Fase 1."
  },
  {
    minifigure_no: 'sh0232',
    description_en: "Silver Centurion (Mark 33) showcases Tony Stark's silver and red color scheme. This specialized armor appeared in Iron Man 3's House Party Protocol. The distinctive coloring makes it visually striking. A fan-favorite variant essential for Iron Man armor completionists.",
    description_de: "Silver Centurion (Mark 33) zeigt Tony Starks silber-rotes Farbschema. Diese spezialisierte Rüstung erschien in Iron Man 3's House Party Protocol. Die charakteristische Färbung macht sie visuell auffällig. Eine bei Fans beliebte Variante, unverzichtbar für Iron Man-Rüstungs-Vervollständiger.",
    description_fr: "Silver Centurion (Mark 33) présente le schéma de couleurs argent et rouge de Tony Stark. Cette armure spécialisée est apparue dans le House Party Protocol d'Iron Man 3. La coloration distinctive la rend visuellement frappante. Une variante favorite des fans essentielle pour complétistes d'armures Iron Man.",
    description_es: "Silver Centurion (Mark 33) muestra el esquema de color plateado y rojo de Tony Stark. Esta armadura especializada apareció en el House Party Protocol de Iron Man 3. La coloración distintiva la hace visualmente llamativa. Una variante favorita de fans esencial para completistas de armaduras de Iron Man."
  },
  {
    minifigure_no: 'sh0233',
    description_en: "Batman from the Classic TV Series brings 1960s nostalgia with sand blue torso and headband. Adam West's iconic portrayal revolutionized superhero television. This faithful recreation captures the campy charm. Highly collectible for fans of classic Batman and television history.",
    description_de: "Batman aus der klassischen TV-Serie bringt 1960er-Nostalgie mit sandblauem Oberkörper und Stirnband. Adam Wests ikonische Darstellung revolutionierte Superhelden-Fernsehen. Diese treue Nachbildung erfasst den campigen Charme. Sehr sammelwürdig für Fans von klassischem Batman und Fernsehgeschichte.",
    description_fr: "Batman de la Série Télévisée Classique apporte nostalgie des années 1960 avec torse bleu sable et bandeau. Le portrait emblématique d'Adam West a révolutionné la télévision de super-héros. Cette recréation fidèle capture le charme camp. Très collectionnable pour fans de Batman classique et histoire de la télévision.",
    description_es: "Batman de la Serie de TV Clásica aporta nostalgia de los años 1960 con torso azul arena y banda para cabeza. La icónica interpretación de Adam West revolucionó la televisión de superhéroes. Esta recreación fiel captura el encanto camp. Altamente coleccionable para fans de Batman clásico e historia de televisión."
  },
  {
    minifigure_no: 'sh0234',
    description_en: "Robin from Classic TV Series captures Burt Ward's portrayal of Dick Grayson. The Dynamic Duo's television adventures defined a generation. This authentic recreation preserves 1960s costume design. Essential companion piece to Classic TV Batman for nostalgic displays.",
    description_de: "Robin aus der klassischen TV-Serie erfasst BurtWards Darstellung von Dick Grayson. Die Fernsehabenteuer des dynamischen Duos definierten eine Generation. Diese authentische Nachbildung bewahrt 1960er-Kostümdesign. Unverzichtbares Begleitstück zu Classic TV Batman für nostalgische Displays.",
    description_fr: "Robin de la Série Télévisée Classique capture le portrait de Dick Grayson par Burt Ward. Les aventures télévisées du Duo Dynamique ont défini une génération. Cette recréation authentique préserve le design de costume des années 1960. Pièce compagnon essentielle à Batman TV Classique pour affichages nostalgiques.",
    description_es: "Robin de la Serie de TV Clásica captura la interpretación de Dick Grayson por Burt Ward. Las aventuras televisivas del Dúo Dinámico definieron una generación. Esta recreación auténtica preserva diseño de traje de los años 1960. Pieza complementaria esencial para Batman de TV Clásico para exhibiciones nostálgicas."
  },
  {
    minifigure_no: 'sh0235',
    description_en: "Bruce Wayne in ascot and button down shirt shows the billionaire playboy persona. This sophisticated civilian appearance contrasts with Batman's dark vigilante identity. Perfect for Wayne Manor scenes and dual-identity storytelling. An essential character piece showing Bruce outside the cowl.",
    description_de: "Bruce Wayne in Krawattenschal und Hemd zeigt die Milliardärs-Playboy-Persona. Dieses anspruchsvolle zivile Aussehen kontrastiert mit Batmans dunkler Vigilanten-Identität. Perfekt für Wayne Manor-Szenen und Doppelidentitäts-Storytelling. Ein unverzichtbares Charakter-Teil, das Bruce außerhalb der Kapuze zeigt.",
    description_fr: "Bruce Wayne en foulard ascot et chemise boutonnée montre le personnage de playboy milliardaire. Cette apparence civile sophistiquée contraste avec l'identité de justicier sombre de Batman. Parfait pour scènes Wayne Manor et narration de double identité. Une pièce de personnage essentielle montrant Bruce hors de la capuche.",
    description_es: "Bruce Wayne en pañuelo ascot y camisa abotonada muestra la persona de playboy multimillonario. Esta apariencia civil sofisticada contrasta con la identidad de vigilante oscuro de Batman. Perfecto para escenas de Wayne Manor y narración de identidad dual. Una pieza de personaje esencial que muestra a Bruce fuera de la capucha."
  },
  {
    minifigure_no: 'sh0236',
    description_en: "Dick Grayson from Classic TV Series shows Robin's civilian identity. This young ward appearance enables Bruce Wayne and Dick Grayson partnership displays. The 1960s styling captures television authenticity. Perfect for Wayne Manor and Batcave behind-the-scenes scenarios.",
    description_de: "Dick Grayson aus der klassischen TV-Serie zeigt Robins zivile Identität. Dieses Aussehen als junger Mündel ermöglicht Bruce Wayne- und Dick Grayson-Partnerschafts-Displays. Das 1960er-Styling erfasst Fernseh-Authentizität. Perfekt für Wayne Manor- und Batcave-Hinter-den-Kulissen-Szenarien.",
    description_fr: "Dick Grayson de la Série Télévisée Classique montre l'identité civile de Robin. Cette apparence de jeune pupille permet des affichages de partenariat Bruce Wayne et Dick Grayson. Le style des années 1960 capture l'authenticité télévisuelle. Parfait pour scénarios coulisses Wayne Manor et Batcave.",
    description_es: "Dick Grayson de la Serie de TV Clásica muestra la identidad civil de Robin. Esta apariencia de joven pupilo permite exhibiciones de asociación Bruce Wayne y Dick Grayson. El estilo de los años 1960 captura autenticidad televisiva. Perfecto para escenarios detrás de escena de Wayne Manor y Batcave."
  },
  {
    minifigure_no: 'sh0237',
    description_en: "Alfred Pennyworth with white hair serves the Wayne family with unwavering loyalty. Batman's trusted butler provides wisdom and support. This distinguished appearance captures Alfred's dignified presence. Essential supporting character for Wayne Manor displays and Batman's support system.",
    description_de: "Alfred Pennyworth mit weißem Haar dient der Wayne-Familie mit unerschütterlicher Loyalität. Batmans vertrauenswürdiger Butler bietet Weisheit und Unterstützung. Dieses vornehme Aussehen erfasst Alfreds würdevolle Präsenz. Unverzichtbare Nebenfigur für Wayne Manor-Displays und Batmans Unterstützungssystem.",
    description_fr: "Alfred Pennyworth avec cheveux blancs sert la famille Wayne avec loyauté inébranlable. Le majordome de confiance de Batman fournit sagesse et soutien. Cette apparence distinguée capture la présence digne d'Alfred. Personnage secondaire essentiel pour affichages Wayne Manor et système de soutien de Batman.",
    description_es: "Alfred Pennyworth con cabello blanco sirve a la familia Wayne con lealtad inquebrantable. El mayordomo de confianza de Batman proporciona sabiduría y apoyo. Esta apariencia distinguida captura la presencia digna de Alfred. Personaje secundario esencial para exhibiciones de Wayne Manor y sistema de apoyo de Batman."
  },
  {
    minifigure_no: 'sh0238',
    description_en: "The Joker in dark pink suit with dual expressions showcases his unpredictable nature. The wide grin and pursed lips offer versatile display moods. This color scheme brings theatrical flair. A dynamic Joker variant emphasizing his chaotic personality through expression options.",
    description_de: "Der Joker im dunkelrosa Anzug mit Doppelausdruck zeigt seine unvorhersehbare Natur. Das breite Grinsen und die gespitzten Lippen bieten vielseitige Display-Stimmungen. Dieses Farbschema bringt theatralisches Flair. Eine dynamische Joker-Variante, die seine chaotische Persönlichkeit durch Ausdrucksoptionen betont.",
    description_fr: "Le Joker en costume rose foncé avec expressions doubles présente sa nature imprévisible. Le large sourire et les lèvres pincées offrent des humeurs d'affichage polyvalentes. Cette palette de couleurs apporte panache théâtral. Une variante Joker dynamique soulignant sa personnalité chaotique par options d'expression.",
    description_es: "El Joker en traje rosa oscuro con expresiones duales muestra su naturaleza impredecible. La amplia sonrisa y labios fruncidos ofrecen estados de ánimo de exhibición versátiles. Este esquema de color aporta estilo teatral. Una variante dinámica del Joker que enfatiza su personalidad caótica a través de opciones de expresión."
  },
  {
    minifigure_no: 'sh0239',
    description_en: "The Penguin from Classic TV Series recreates Burgess Meredith's memorable portrayal. This refined villain brings sophistication to Batman's rogues gallery. The 1960s television styling captures period authenticity. Essential villain for Classic TV Batman collection displays.",
    description_de: "Der Penguin aus der klassischen TV-Serie bildet Burgess Merediths unvergessliche Darstellung nach. Dieser raffinierte Schurke bringt Raffinesse zu Batmans Rogues Gallery. Das 1960er-Fernseh-Styling erfasst Perioden-Authentizität. Unverzichtbarer Schurke für Classic TV Batman-Sammlungs-Displays.",
    description_fr: "Le Pingouin de la Série Télévisée Classique recrée le portrait mémorable de Burgess Meredith. Ce méchant raffiné apporte sophistication à la galerie de voyous de Batman. Le style télévisuel des années 1960 capture l'authenticité d'époque. Méchant essentiel pour affichages de collection Batman TV Classique.",
    description_es: "El Pingüino de la Serie de TV Clásica recrea la memorable interpretación de Burgess Meredith. Este villano refinado aporta sofisticación a la galería de pícaros de Batman. El estilo televisivo de los años 1960 captura autenticidad de época. Villano esencial para exhibiciones de colección de Batman de TV Clásico."
  },
  {
    minifigure_no: 'sh0240',
    description_en: "The Riddler from Classic TV Series captures Frank Gorshin's iconic performance. This puzzle-obsessed villain brings intellectual challenge to Batman. The 1960s costume design preserves television history. A key villain essential for complete Classic TV Batman adversary displays.",
    description_de: "Der Riddler aus der klassischen TV-Serie erfasst Frank Gorshins ikonische Darbietung. Dieser puzzlebesessene Schurke bringt intellektuelle Herausforderung zu Batman. Das 1960er-Kostümdesign bewahrt Fernsehgeschichte. Ein Schlüssel-Schurke, unverzichtbar für vollständige Classic TV Batman-Gegner-Displays.",
    description_fr: "Le Sphinx de la Série Télévisée Classique capture la performance emblématique de Frank Gorshin. Ce méchant obsédé par les énigmes apporte défi intellectuel à Batman. Le design de costume des années 1960 préserve l'histoire télévisuelle. Un méchant clé essentiel pour affichages complets d'adversaires Batman TV Classique.",
    description_es: "El Acertijo de la Serie de TV Clásica captura la actuación icónica de Frank Gorshin. Este villano obsesionado con acertijos aporta desafío intelectual a Batman. El diseño de traje de los años 1960 preserva historia televisiva. Un villano clave esencial para exhibiciones completas de adversarios de Batman de TV Clásico."
  },
  {
    minifigure_no: 'sh0241',
    description_en: "Catwoman from Classic TV Series recreates Julie Newmar's sultry portrayal. This feline fatale walks the line between villain and anti-hero. The 1960s costume design captures television glamour. An essential Batman adversary with complex romantic tension.",
    description_de: "Catwoman aus der klassischen TV-Serie bildet Julie Newmars verführerische Darstellung nach. Diese katzenartige Femme Fatale bewegt sich zwischen Schurkin und Anti-Heldin. Das 1960er-Kostümdesign erfasst Fernseh-Glamour. Eine unverzichtbare Batman-Gegnerin mit komplexer romantischer Spannung.",
    description_fr: "Catwoman de la Série Télévisée Classique recrée le portrait sensuel de Julie Newmar. Cette femme fatale féline marche sur la ligne entre méchante et anti-héroïne. Le design de costume des années 1960 capture le glamour télévisuel. Une adversaire Batman essentielle avec tension romantique complexe.",
    description_es: "Catwoman de la Serie de TV Clásica recrea la interpretación sensual de Julie Newmar. Esta femme fatale felina camina la línea entre villana y anti-heroína. El diseño de traje de los años 1960 captura glamour televisivo. Una adversaria esencial de Batman con tensión romántica compleja."
  },
  {
    minifigure_no: 'sh0242',
    description_en: "Batman with short legs represents younger Bruce Wayne or junior format. This child-friendly design maintains iconic Batman aesthetics. Perfect for family-oriented displays and younger collector introductions. A versatile piece for diverse Batman storytelling scales.",
    description_de: "Batman mit kurzen Beinen repräsentiert jüngeren Bruce Wayne oder Junior-Format. Dieses kinderfreundliche Design behält ikonische Batman-Ästhetik bei. Perfekt für familienorientierte Displays und Einführungen für jüngere Sammler. Ein vielseitiges Teil für verschiedene Batman-Storytelling-Maßstäbe.",
    description_fr: "Batman avec jambes courtes représente Bruce Wayne plus jeune ou format junior. Ce design adapté aux enfants maintient l'esthétique Batman emblématique. Parfait pour affichages orientés famille et introductions de jeunes collectionneurs. Une pièce polyvalente pour diverses échelles de narration Batman.",
    description_es: "Batman con piernas cortas representa a Bruce Wayne más joven o formato junior. Este diseño amigable para niños mantiene estética icónica de Batman. Perfecto para exhibiciones orientadas a familia e introducciones de coleccionistas jóvenes. Una pieza versátil para diversas escalas narrativas de Batman."
  },
  {
    minifigure_no: 'sh0243',
    description_en: "Catwoman with short legs in black suit offers junior collector appeal. This simplified design introduces younger fans to the character. Perfect for child-friendly Batman displays. A gateway piece for building next-generation superhero collections.",
    description_de: "Catwoman mit kurzen Beinen im schwarzen Anzug bietet Junior-Sammler-Appeal. Dieses vereinfachte Design führt jüngere Fans zur Figur ein. Perfekt für kinderfreundliche Batman-Displays. Ein Einstiegs-Teil für den Aufbau von Superhelden-Sammlungen der nächsten Generation.",
    description_fr: "Catwoman avec jambes courtes en costume noir offre attrait pour jeunes collectionneurs. Ce design simplifié présente le personnage aux fans plus jeunes. Parfait pour affichages Batman adaptés aux enfants. Une pièce passerelle pour construire des collections de super-héros de nouvelle génération.",
    description_es: "Catwoman con piernas cortas en traje negro ofrece atractivo para coleccionistas junior. Este diseño simplificado introduce a fans más jóvenes al personaje. Perfecto para exhibiciones de Batman amigables para niños. Una pieza de entrada para construir colecciones de superhéroes de nueva generación."
  },
  {
    minifigure_no: 'sh0244',
    description_en: "Robin with short legs provides younger collector accessibility. This junior format maintains Dick Grayson's heroic identity. Perfect for introducing the Dynamic Duo to new generations. An essential piece for family-oriented Batman collections.",
    description_de: "Robin mit kurzen Beinen bietet jüngeren Sammlern Zugänglichkeit. Dieses Junior-Format behält Dick Graysons heroische Identität bei. Perfekt für die Vorstellung des dynamischen Duos bei neuen Generationen. Ein unverzichtbares Teil für familienorientierte Batman-Sammlungen.",
    description_fr: "Robin avec jambes courtes offre accessibilité aux jeunes collectionneurs. Ce format junior maintient l'identité héroïque de Dick Grayson. Parfait pour présenter le Duo Dynamique aux nouvelles générations. Une pièce essentielle pour collections Batman orientées famille.",
    description_es: "Robin con piernas cortas proporciona accesibilidad para coleccionistas más jóvenes. Este formato junior mantiene la identidad heroica de Dick Grayson. Perfecto para presentar al Dúo Dinámico a nuevas generaciones. Una pieza esencial para colecciones de Batman orientadas a familia."
  },
  {
    minifigure_no: 'sh0245',
    description_en: "Bane with short legs brings the powerful villain to junior format. This child-friendly design introduces younger collectors to Batman's formidable adversary. Perfect for age-appropriate villain displays. A gateway piece for building comprehensive junior superhero collections.",
    description_de: "Bane mit kurzen Beinen bringt den mächtigen Schurken ins Junior-Format. Dieses kinderfreundliche Design führt jüngere Sammler zu Batmans beeindruckendem Gegner ein. Perfekt für altersgerechte Schurken-Displays. Ein Einstiegs-Teil für den Aufbau umfassender Junior-Superhelden-Sammlungen.",
    description_fr: "Bane avec jambes courtes apporte le méchant puissant au format junior. Ce design adapté aux enfants présente l'adversaire formidable de Batman aux jeunes collectionneurs. Parfait pour affichages de méchants adaptés à l'âge. Une pièce passerelle pour construire des collections complètes de super-héros junior.",
    description_es: "Bane con piernas cortas trae al villano poderoso al formato junior. Este diseño amigable para niños introduce a coleccionistas más jóvenes al formidable adversario de Batman. Perfecto para exhibiciones de villanos apropiadas para edad. Una pieza de entrada para construir colecciones completas de superhéroes junior."
  },
  {
    minifigure_no: 'sh0246',
    description_en: "The Flash with short legs speeds into junior collections. This child-friendly format introduces younger fans to the Scarlet Speedster. Perfect for building next-generation Justice League displays. An accessible entry point for young superhero enthusiasts.",
    description_de: "Der Flash mit kurzen Beinen rast in Junior-Sammlungen. Dieses kinderfreundliche Format führt jüngere Fans zum scharlachroten Speedster ein. Perfekt für den Aufbau von Justice League-Displays der nächsten Generation. Ein zugänglicher Einstiegspunkt für junge Superhelden-Enthusiasten.",
    description_fr: "Le Flash avec jambes courtes fonce dans les collections junior. Ce format adapté aux enfants présente le Coureur Écarlate aux jeunes fans. Parfait pour construire des affichages Justice League de nouvelle génération. Un point d'entrée accessible pour jeunes enthousiastes de super-héros.",
    description_es: "Flash con piernas cortas acelera hacia colecciones junior. Este formato amigable para niños introduce a fans más jóvenes al Corredor Escarlata. Perfecto para construir exhibiciones de Liga de la Justicia de nueva generación. Un punto de entrada accesible para jóvenes entusiastas de superhéroes."
  },
  {
    minifigure_no: 'sh0247',
    description_en: "Captain Cold with short legs brings Flash's rogues to junior format. This child-friendly design introduces younger collectors to the cold-themed villain. Perfect for building age-appropriate Flash adversary displays. A gateway villain piece for next-generation collections.",
    description_de: "Captain Cold mit kurzen Beinen bringt Flashs Rogues ins Junior-Format. Dieses kinderfreundliche Design führt jüngere Sammler zum kältethematischen Schurken ein. Perfekt für den Aufbau altersgerechter Flash-Gegner-Displays. Ein Einstiegs-Schurken-Teil für Sammlungen der nächsten Generation.",
    description_fr: "Captain Cold avec jambes courtes apporte les voyous du Flash au format junior. Ce design adapté aux enfants présente le méchant à thème froid aux jeunes collectionneurs. Parfait pour construire des affichages d'adversaires Flash adaptés à l'âge. Une pièce de méchant passerelle pour collections de nouvelle génération.",
    description_es: "Capitán Frío con piernas cortas trae a los pícaros de Flash al formato junior. Este diseño amigable para niños introduce a coleccionistas más jóvenes al villano temático de frío. Perfecto para construir exhibiciones de adversarios de Flash apropiadas para edad. Una pieza de villano de entrada para colecciones de nueva generación."
  },
  {
    minifigure_no: 'sh0248',
    description_en: "Spider-Man with short legs introduces Peter Parker to younger collectors. This junior format maintains iconic web-slinger aesthetics. Perfect for child-friendly Marvel displays. An essential entry point for building next-generation Spider-Man collections.",
    description_de: "Spider-Man mit kurzen Beinen führt Peter Parker bei jüngeren Sammlern ein. Dieses Junior-Format behält ikonische Web-Slinger-Ästhetik bei. Perfekt für kinderfreundliche Marvel-Displays. Ein unverzichtbarer Einstiegspunkt für den Aufbau von Spider-Man-Sammlungen der nächsten Generation.",
    description_fr: "Spider-Man avec jambes courtes présente Peter Parker aux jeunes collectionneurs. Ce format junior maintient l'esthétique emblématique du lanceur de toiles. Parfait pour affichages Marvel adaptés aux enfants. Un point d'entrée essentiel pour construire des collections Spider-Man de nouvelle génération.",
    description_es: "Spider-Man con piernas cortas introduce a Peter Parker a coleccionistas más jóvenes. Este formato junior mantiene estética icónica del lanzador de telarañas. Perfecto para exhibiciones Marvel amigables para niños. Un punto de entrada esencial para construir colecciones de Spider-Man de nueva generación."
  },
  {
    minifigure_no: 'sh0249',
    description_en: "Green Goblin with short legs brings Spider-Man's nemesis to junior format. This child-friendly design introduces younger collectors to the iconic villain. Perfect for age-appropriate Spider-Man adversary displays. A gateway villain for building comprehensive junior Marvel collections.",
    description_de: "Green Goblin mit kurzen Beinen bringt Spider-Mans Nemesis ins Junior-Format. Dieses kinderfreundliche Design führt jüngere Sammler zum ikonischen Schurken ein. Perfekt für altersgerechte Spider-Man-Gegner-Displays. Ein Einstiegs-Schurke für den Aufbau umfassender Junior-Marvel-Sammlungen.",
    description_fr: "Green Goblin avec jambes courtes apporte le némésis de Spider-Man au format junior. Ce design adapté aux enfants présente le méchant emblématique aux jeunes collectionneurs. Parfait pour affichages d'adversaires Spider-Man adaptés à l'âge. Un méchant passerelle pour construire des collections Marvel junior complètes.",
    description_es: "Duende Verde con piernas cortas trae al némesis de Spider-Man al formato junior. Este diseño amigable para niños introduce a coleccionistas más jóvenes al villano icónico. Perfecto para exhibiciones de adversarios de Spider-Man apropiadas para edad. Un villano de entrada para construir colecciones Marvel junior completas."
  },
  {
    minifigure_no: 'sh0250',
    description_en: "Captain America with short legs introduces Steve Rogers to younger collectors. This junior format maintains patriotic heroism in child-friendly scale. Perfect for building next-generation Avengers displays. An essential entry point for young Marvel superhero enthusiasts.",
    description_de: "Captain America mit kurzen Beinen führt Steve Rogers bei jüngeren Sammlern ein. Dieses Junior-Format behält patriotisches Heldentum im kinderfreundlichen Maßstab bei. Perfekt für den Aufbau von Avengers-Displays der nächsten Generation. Ein unverzichtbarer Einstiegspunkt für junge Marvel-Superhelden-Enthusiasten.",
    description_fr: "Captain America avec jambes courtes présente Steve Rogers aux jeunes collectionneurs. Ce format junior maintient l'héroïsme patriotique à échelle adaptée aux enfants. Parfait pour construire des affichages Avengers de nouvelle génération. Un point d'entrée essentiel pour jeunes enthousiastes de super-héros Marvel.",
    description_es: "Capitán América con piernas cortas introduce a Steve Rogers a coleccionistas más jóvenes. Este formato junior mantiene heroísmo patriótico en escala amigable para niños. Perfecto para construir exhibiciones de Vengadores de nueva generación. Un punto de entrada esencial para jóvenes entusiastas de superhéroes Marvel."
  }
];

async function main() {
  console.log(`🦸 Starting Super Heroes batch sh0226-sh0250 (${descriptions.length} minifigs)...`);
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
  console.log(`✅ Batch complete! ${descriptions.length} minifigs saved. Total: 250 done.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
