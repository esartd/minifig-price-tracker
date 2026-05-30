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
    minifigure_no: 'sh0901',
    description_en: "The Joker in Dark Turquoise Bow Tie with Hair (2023) from Tim Burton's Batman features Jack Nicholson's Clown Prince without fedora, showing his green hair and maniacal expression with purple suit and theatrical styling from the 1989 film.",
    description_de: "Der Joker in dunkeltürkiser Fliege mit Haar (2023) aus Tim Burtons Batman zeigt Jack Nicholsons Clown Prince ohne Fedora, der sein grünes Haar und manischen Ausdruck mit lila Anzug und theatralischem Styling aus dem 1989-Film zeigt.",
    description_fr: "The Joker en nœud papillon turquoise foncé avec cheveux (2023) du Batman de Tim Burton présente le Clown Prince de Jack Nicholson sans fedora, montrant ses cheveux verts et son expression maniaque avec un costume violet et un style théâtral du film de 1989.",
    description_es: "The Joker en corbata de moño turquesa oscuro con cabello (2023) del Batman de Tim Burton presenta al Príncipe Payaso de Jack Nicholson sin sombrero fedora, mostrando su cabello verde y expresión maníaca con traje púrpura y estilo teatral de la película de 1989."
  },
  {
    minifigure_no: 'sh0902',
    description_en: "Batman in Black Suit with Yellow Belt and Dual Expressions (2023) features the Dark Knight with lopsided grin and teeth-showing smile on dual-sided head, capturing a lighter take on the Caped Crusader with white-eyed cowl.",
    description_de: "Batman im schwarzen Anzug mit gelbem Gürtel und doppelten Ausdrücken (2023) zeigt den Dark Knight mit schiefem Grinsen und zähnezeigendem Lächeln auf doppelseitigem Kopf, der eine leichtere Darstellung des Caped Crusader mit weißäugigem Cowl einfängt.",
    description_fr: "Batman en costume noir avec ceinture jaune et expressions doubles (2023) présente le Dark Knight avec un sourire de travers et un sourire montrant les dents sur une tête à double face, capturant une interprétation plus légère du Caped Crusader avec une capuche aux yeux blancs.",
    description_es: "Batman en traje negro con cinturón amarillo y expresiones duales (2023) presenta al Caballero Oscuro con sonrisa torcida y sonrisa mostrando dientes en cabeza de doble cara, capturando una interpretación más ligera del Caped Crusader con capucha de ojos blancos."
  },
  {
    minifigure_no: 'sh0903',
    description_en: "The Joker in Medium Lavender Suit with Dark Green Vest (2023) features the Clown Prince of Crime in distinctive purple and green color scheme with swept-back green hair, capturing his iconic comic-accurate appearance with theatrical villain styling.",
    description_de: "Der Joker im mittellila Anzug mit dunkelgrüner Weste (2023) zeigt den Clown Prince of Crime in markanter lila-grüner Farbgebung mit zurückgekämmtem grünem Haar, der sein ikonisches comic-genaues Erscheinungsbild mit theatralischem Schurken-Styling einfängt.",
    description_fr: "The Joker en costume lavande moyen avec gilet vert foncé (2023) présente le Clown Prince of Crime dans un schéma de couleurs violet et vert distinctif avec des cheveux verts peignés en arrière, capturant son apparence iconique fidèle aux comics avec un style de méchant théâtral.",
    description_es: "The Joker en traje lavanda medio con chaleco verde oscuro (2023) presenta al Príncipe Payaso del Crimen en distintivo esquema de colores púrpura y verde con cabello verde peinado hacia atrás, capturando su apariencia icónica fiel a los cómics con estilo de villano teatral."
  },
  {
    minifigure_no: 'sh0904',
    description_en: "Iron Man in Mark 85 Armor with Thin Red Markings (2023) features Tony Stark's final Endgame suit with refined torso details and large visor, capturing the sleek nanotech design that wielded the Infinity Stones with elegant red accent lines.",
    description_de: "Iron Man in Mark 85 Rüstung mit dünnen roten Markierungen (2023) zeigt Tony Starks finalen Endgame-Anzug mit verfeinerten Torso-Details und großem Visier, der das schlanke Nanotech-Design einfängt, das die Infinity Steine mit eleganten roten Akzentlinien führte.",
    description_fr: "Iron Man en armure Mark 85 avec fines marques rouges (2023) présente le costume final d'Endgame de Tony Stark avec des détails de torse raffinés et une grande visière, capturant le design nanotech élégant qui a manié les Pierres d'Infinité avec des lignes d'accent rouges élégantes.",
    description_es: "Iron Man en armadura Mark 85 con marcas rojas finas (2023) presenta el traje final de Endgame de Tony Stark con detalles de torso refinados y visera grande, capturando el diseño nanotech elegante que empuñó las Gemas del Infinito con elegantes líneas de acento rojas."
  },
  {
    minifigure_no: 'sh0905',
    description_en: "Spider-Man in Holiday Sweater (2023) features Peter Parker in festive Christmas attire with web-slinger themed patterns, capturing the friendly neighborhood hero celebrating the season with cozy knit sweater details and seasonal charm.",
    description_de: "Spider-Man im Weihnachtspullover (2023) zeigt Peter Parker in festlicher Weihnachtskleidung mit Web-Slinger-thematischen Mustern, der den freundlichen Nachbarschafts-Helden beim Feiern der Saison mit gemütlichen Strickpullover-Details und saisonalem Charme einfängt.",
    description_fr: "Spider-Man en pull de Noël (2023) présente Peter Parker dans une tenue de Noël festive avec des motifs sur le thème du lanceur de toiles, capturant le héros sympathique du quartier célébrant la saison avec des détails de pull tricoté confortable et un charme saisonnier.",
    description_es: "Spider-Man en suéter navideño (2023) presenta a Peter Parker en atuendo navideño festivo con patrones temáticos de lanzatelarañas, capturando al héroe amigable del vecindario celebrando la temporada con detalles de suéter tejido acogedor y encanto estacional."
  },
  {
    minifigure_no: 'sh0906',
    description_en: "Thanos Minifigure with Helmet (2023) from The Infinity Saga features the Mad Titan in full armor with removable helmet accessory, capturing Josh Brolin's imposing villain with complete battle-ready appearance and color-matched lavender arms.",
    description_de: "Thanos-Minifigur mit Helm (2023) aus The Infinity Saga zeigt den Verrückten Titanen in voller Rüstung mit abnehmbarem Helm-Zubehör, der Josh Brolins imposanten Schurken mit vollständigem kampfbereitem Erscheinungsbild und farblich passenden lila Armen einfängt.",
    description_fr: "Figurine Thanos avec casque (2023) de The Infinity Saga présente le Titan fou en armure complète avec accessoire de casque amovible, capturant le méchant imposant de Josh Brolin avec une apparence de bataille complète et des bras lavande assortis en couleur.",
    description_es: "Minifigura de Thanos con casco (2023) de The Infinity Saga presenta al Titán Loco en armadura completa con accesorio de casco removible, capturando al villano imponente de Josh Brolin con apariencia lista para batalla completa y brazos lavanda a juego de color."
  },
  {
    minifigure_no: 'sh0907',
    description_en: "Black Widow in Holiday Sweater (2023) features Natasha Romanoff celebrating the season in festive Christmas attire with spy-themed patterns, capturing Scarlett Johansson's character in cozy knit sweater with seasonal Avengers team spirit.",
    description_de: "Black Widow im Weihnachtspullover (2023) zeigt Natasha Romanoff beim Feiern der Saison in festlicher Weihnachtskleidung mit spion-thematischen Mustern, die Scarlett Johanssons Charakter in gemütlichem Strickpullover mit saisonalem Avengers-Teamgeist einfängt.",
    description_fr: "Black Widow en pull de Noël (2023) présente Natasha Romanoff célébrant la saison dans une tenue de Noël festive avec des motifs sur le thème de l'espionnage, capturant le personnage de Scarlett Johansson dans un pull tricoté confortable avec l'esprit d'équipe saisonnier des Avengers.",
    description_es: "Black Widow en suéter navideño (2023) presenta a Natasha Romanoff celebrando la temporada en atuendo navideño festivo con patrones temáticos de espía, capturando el personaje de Scarlett Johansson en suéter tejido acogedor con espíritu de equipo estacional de Avengers."
  },
  {
    minifigure_no: 'sh0908',
    description_en: "Captain America in Dark Blue Suit with Hair (2023) features Steve Rogers unmasked in his Avengers uniform with blonde hair showing, capturing Chris Evans's character with dual-sided expressions and dark red gloved hands.",
    description_de: "Captain America im dunkelblauen Anzug mit Haar (2023) zeigt Steve Rogers unmaskiert in seiner Avengers-Uniform mit sichtbarem blondem Haar, der Chris Evans' Charakter mit doppelseitigen Ausdrücken und dunkelroten behandschuhten Händen einfängt.",
    description_fr: "Captain America en costume bleu foncé avec cheveux (2023) présente Steve Rogers démasqué dans son uniforme Avengers avec des cheveux blonds visibles, capturant le personnage de Chris Evans avec des expressions à double face et des mains gantées rouge foncé.",
    description_es: "Captain America en traje azul oscuro con cabello (2023) presenta a Steve Rogers desenmascarado en su uniforme Avengers con cabello rubio visible, capturando el personaje de Chris Evans con expresiones de doble cara y manos enguantadas rojas oscuras."
  },
  {
    minifigure_no: 'sh0909',
    description_en: "Doctor Strange with Brooch (2023) features the Sorcerer Supreme with Eye of Agamotto brooch accessory and detailed mystical robes, capturing Benedict Cumberbatch's character ready for spell-casting and interdimensional adventures with premium details.",
    description_de: "Doctor Strange mit Brosche (2023) zeigt den Sorcerer Supreme mit Auge von Agamotto-Broschen-Zubehör und detaillierten mystischen Roben, der Benedict Cumberbatchs Charakter bereit für Zaubersprüche und interdimensionale Abenteuer mit Premium-Details einfängt.",
    description_fr: "Doctor Strange avec broche (2023) présente le Sorcier Suprême avec un accessoire de broche Œil d'Agamotto et des robes mystiques détaillées, capturant le personnage de Benedict Cumberbatch prêt pour les sorts et les aventures interdimensionnelles avec des détails premium.",
    description_es: "Doctor Strange con broche (2023) presenta al Hechicero Supremo con accesorio de broche del Ojo de Agamotto y túnicas místicas detalladas, capturando el personaje de Benedict Cumberbatch listo para lanzar hechizos y aventuras interdimensionales con detalles premium."
  },
  {
    minifigure_no: 'sh0910',
    description_en: "Iron Man with Round Arc Reactor and One Piece Helmet (2023) from The Infinity Saga features classic Mark armor design with pearl gold arms and integrated helmet piece, capturing Tony Stark's iconic suit with vintage circular chest reactor.",
    description_de: "Iron Man mit rundem Arc-Reaktor und einteiligem Helm (2023) aus The Infinity Saga zeigt klassisches Mark-Rüstungsdesign mit perlgoldenen Armen und integriertem Helm-Teil, der Tony Starks ikonischen Anzug mit Vintage-kreisförmigem Brustrektor einfängt.",
    description_fr: "Iron Man avec réacteur Arc rond et casque d'une pièce (2023) de The Infinity Saga présente un design d'armure Mark classique avec des bras or perlé et une pièce de casque intégrée, capturant le costume iconique de Tony Stark avec un réacteur thoracique circulaire vintage.",
    description_es: "Iron Man con reactor Arc redondo y casco de una pieza (2023) de The Infinity Saga presenta diseño de armadura Mark clásico con brazos dorados perla y pieza de casco integrada, capturando el traje icónico de Tony Stark con reactor de pecho circular vintage."
  },
  {
    minifigure_no: 'sh0911',
    description_en: "Captain Marvel (Carol Danvers) with Tan Hair over Shoulder (2023) from The Marvels features Brie Larson's hero in her iconic red and blue suit with flowing hair, capturing her cosmic powers and leadership role with detailed costume printing.",
    description_de: "Captain Marvel (Carol Danvers) mit hellbraunem Haar über der Schulter (2023) aus The Marvels zeigt Brie Larsons Heldin in ihrem ikonischen rot-blauen Anzug mit fließendem Haar, der ihre kosmischen Kräfte und Führungsrolle mit detailliertem Kostümdruck einfängt.",
    description_fr: "Captain Marvel (Carol Danvers) avec cheveux châtain sur l'épaule (2023) de The Marvels présente l'héroïne de Brie Larson dans son costume rouge et bleu iconique avec des cheveux fluides, capturant ses pouvoirs cosmiques et son rôle de leader avec une impression de costume détaillée.",
    description_es: "Captain Marvel (Carol Danvers) con cabello castaño sobre el hombro (2023) de The Marvels presenta a la heroína de Brie Larson en su icónico traje rojo y azul con cabello fluido, capturando sus poderes cósmicos y rol de liderazgo con impresión de traje detallada."
  },
  {
    minifigure_no: 'sh0912',
    description_en: "Photon (Monica Rambeau) (2023) from The Marvels introduces Teyonah Parris's character in her superhero costume with light-manipulating powers, capturing the SWORD agent-turned-hero with energy-based abilities and cosmic team member design.",
    description_de: "Photon (Monica Rambeau) (2023) aus The Marvels führt Teyonah Parris' Charakter in ihrem Superhelden-Kostüm mit lichtmanipulierenden Kräften ein, der den SWORD-Agenten-zur-Heldin-gewordenen mit energiebasierten Fähigkeiten und kosmischem Teammitglieds-Design einfängt.",
    description_fr: "Photon (Monica Rambeau) (2023) de The Marvels présente le personnage de Teyonah Parris dans son costume de super-héros avec des pouvoirs de manipulation de la lumière, capturant l'agent SWORD devenu héros avec des capacités basées sur l'énergie et un design de membre d'équipe cosmique.",
    description_es: "Photon (Monica Rambeau) (2023) de The Marvels presenta al personaje de Teyonah Parris en su traje de superheroína con poderes de manipulación de luz, capturando a la agente de SWORD convertida en heroína con habilidades basadas en energía y diseño de miembro de equipo cósmico."
  },
  {
    minifigure_no: 'sh0913',
    description_en: "Ms. Marvel (Kamala Khan) in Red Suit (2023) from The Marvels features Iman Vellani's stretching hero in her updated costume with red color scheme, capturing the Jersey City teen's comic-accurate powers and enthusiastic fangirl personality.",
    description_de: "Ms. Marvel (Kamala Khan) im roten Anzug (2023) aus The Marvels zeigt Iman Vellanis dehnbare Heldin in ihrem aktualisierten Kostüm mit rotem Farbschema, die die Comic-genauen Kräfte und enthusiastische Fangirl-Persönlichkeit des Jersey City-Teenagers einfängt.",
    description_fr: "Ms. Marvel (Kamala Khan) en costume rouge (2023) de The Marvels présente l'héroïne extensible d'Iman Vellani dans son costume mis à jour avec un schéma de couleurs rouge, capturant les pouvoirs fidèles aux comics de l'adolescente de Jersey City et sa personnalité de fangirl enthousiaste.",
    description_es: "Ms. Marvel (Kamala Khan) en traje rojo (2023) de The Marvels presenta a la heroína elástica de Iman Vellani en su traje actualizado con esquema de colores rojo, capturando los poderes fieles a los cómics de la adolescente de Jersey City y personalidad entusiasta de fanática."
  },
  {
    minifigure_no: 'sh0914',
    description_en: "Iron Man in Model 64 Armor (2023) showcases Tony Stark in specialized suit variant with unique design features, representing one of his many armor iterations with distinctive color scheme and advanced technology details from his vast armory.",
    description_de: "Iron Man in Model 64 Rüstung (2023) zeigt Tony Stark in spezialisierter Anzugvariante mit einzigartigen Designmerkmalen, die eine seiner vielen Rüstungsiterationen mit markanter Farbgebung und fortschrittlichen Technologiedetails aus seinem riesigen Waffenarsenal darstellt.",
    description_fr: "Iron Man en armure Model 64 (2023) présente Tony Stark dans une variante de costume spécialisée avec des caractéristiques de design uniques, représentant l'une de ses nombreuses itérations d'armure avec un schéma de couleurs distinctif et des détails de technologie avancée de son vaste arsenal.",
    description_es: "Iron Man en armadura Model 64 (2023) muestra a Tony Stark en variante de traje especializado con características de diseño únicas, representando una de sus muchas iteraciones de armadura con esquema de colores distintivo y detalles de tecnología avanzada de su vasto arsenal."
  },
  {
    minifigure_no: 'sh0915',
    description_en: "Thor with Spongy Cape and Bushy Hair (2023) features the God of Thunder in his classic armor with wild blonde hair and realistic textured cape, capturing Chris Hemsworth's character with powerful Asgardian warrior appearance.",
    description_de: "Thor mit schwammigem Umhang und buschigem Haar (2023) zeigt den Donnergott in seiner klassischen Rüstung mit wildem blondem Haar und realistisch texturiertem Umhang, der Chris Hemsworths Charakter mit mächtigem asgardischem Krieger-Erscheinungsbild einfängt.",
    description_fr: "Thor avec cape spongieuse et cheveux touffus (2023) présente le Dieu du Tonnerre dans son armure classique avec des cheveux blonds sauvages et une cape texturée réaliste, capturant le personnage de Chris Hemsworth avec une apparence de guerrier asgardien puissant.",
    description_es: "Thor con capa esponjosa y cabello tupido (2023) presenta al Dios del Trueno en su armadura clásica con cabello rubio salvaje y capa texturizada realista, capturando el personaje de Chris Hemsworth con apariencia de guerrero asgardiano poderoso."
  },
  {
    minifigure_no: 'sh0916',
    description_en: "Vision in Dark Turquoise (2023) features Paul Bettany's synthetic being in his distinctive blue-green coloring with Mind Stone on forehead, capturing the powerful android Avenger with phase-shifting abilities and philosophical personality.",
    description_de: "Vision in dunkeltürkis (2023) zeigt Paul Bettanys synthetisches Wesen in seiner markanten blau-grünen Färbung mit Mind Stone auf der Stirn, der den mächtigen Android-Avenger mit Phasenverschiebungsfähigkeiten und philosophischer Persönlichkeit einfängt.",
    description_fr: "Vision en turquoise foncé (2023) présente l'être synthétique de Paul Bettany dans sa coloration bleu-vert distinctive avec la Pierre de l'Esprit sur le front, capturant l'Avenger androïde puissant avec des capacités de changement de phase et une personnalité philosophique.",
    description_es: "Vision en turquesa oscuro (2023) presenta al ser sintético de Paul Bettany en su distintiva coloración azul-verde con Gema de la Mente en la frente, capturando al poderoso Avenger androide con habilidades de cambio de fase y personalidad filosófica."
  },
  {
    minifigure_no: 'sh0917',
    description_en: "SHIELD Agent Female in Tactical Vest with Black Goggles (2023) features a field operative in combat gear with medium brown head, perfect for army-building SHIELD security forces and recreating covert operations with tactical equipment.",
    description_de: "SHIELD-Agentin weiblich in taktischer Weste mit schwarzer Schutzbrille (2023) zeigt eine Feldeinsatz-Operative in Kampfausrüstung mit mittelbraunem Kopf, perfekt zum Aufbau von SHIELD-Sicherheitskräften und zur Nachstellung verdeckter Operationen mit taktischer Ausrüstung.",
    description_fr: "Agent SHIELD femme en gilet tactique avec lunettes noires (2023) présente une opératrice de terrain en équipement de combat avec une tête brun moyen, parfait pour construire des forces de sécurité SHIELD et recréer des opérations secrètes avec un équipement tactique.",
    description_es: "Agente SHIELD femenina en chaleco táctico con gafas negras (2023) presenta a una operativa de campo en equipo de combate con cabeza marrón medio, perfecto para construir fuerzas de seguridad SHIELD y recrear operaciones encubiertas con equipo táctico."
  },
  {
    minifigure_no: 'sh0918',
    description_en: "SHIELD Agent Male in Tactical Vest with Black Goggles (2023) features a field operative in combat gear with reddish brown head, perfect for army-building SHIELD security teams and recreating Marvel espionage missions with military equipment.",
    description_de: "SHIELD-Agent männlich in taktischer Weste mit schwarzer Schutzbrille (2023) zeigt einen Feldeinsatz-Operativen in Kampfausrüstung mit rotbraunem Kopf, perfekt zum Aufbau von SHIELD-Sicherheitsteams und zur Nachstellung von Marvel-Spionagemissionen mit militärischer Ausrüstung.",
    description_fr: "Agent SHIELD homme en gilet tactique avec lunettes noires (2023) présente un opérateur de terrain en équipement de combat avec une tête brun rougeâtre, parfait pour construire des équipes de sécurité SHIELD et recréer des missions d'espionnage Marvel avec un équipement militaire.",
    description_es: "Agente SHIELD masculino en chaleco táctico con gafas negras (2023) presenta a un operativo de campo en equipo de combate con cabeza marrón rojizo, perfecto para construir equipos de seguridad SHIELD y recrear misiones de espionaje Marvel con equipo militar."
  },
  {
    minifigure_no: 'sh0919',
    description_en: "SHIELD Agent Tony Stark in Tactical Vest (2023) features the genius billionaire undercover in SHIELD gear with helmet and goggles, capturing his infiltration appearance before suiting up as Iron Man for covert operations.",
    description_de: "SHIELD-Agent Tony Stark in taktischer Weste (2023) zeigt den genialen Milliardär verdeckt in SHIELD-Ausrüstung mit Helm und Schutzbrille, der sein Infiltrations-Erscheinungsbild einfängt, bevor er sich als Iron Man für verdeckte Operationen anzieht.",
    description_fr: "Agent SHIELD Tony Stark en gilet tactique (2023) présente le milliardaire génie sous couverture dans un équipement SHIELD avec casque et lunettes, capturant son apparence d'infiltration avant de s'équiper en Iron Man pour des opérations secrètes.",
    description_es: "Agente SHIELD Tony Stark en chaleco táctico (2023) presenta al genio multimillonario encubierto en equipo SHIELD con casco y gafas, capturando su apariencia de infiltración antes de vestirse como Iron Man para operaciones encubiertas."
  },
  {
    minifigure_no: 'sh0920',
    description_en: "Alexander Pierce (2023) brings Robert Redford's HYDRA infiltrator to life in formal SHIELD attire, capturing the seemingly-loyal World Security Council member who secretly plots to implement Project Insight with sinister intelligence community appearance.",
    description_de: "Alexander Pierce (2023) erweckt Robert Redfords HYDRA-Infiltrator in formeller SHIELD-Kleidung zum Leben, der das scheinbar loyale World Security Council-Mitglied einfängt, das heimlich die Implementierung von Project Insight mit finsterer Intelligence-Community-Erscheinung plant.",
    description_fr: "Alexander Pierce (2023) donne vie à l'infiltré HYDRA de Robert Redford dans une tenue SHIELD formelle, capturant le membre apparemment loyal du Conseil de Sécurité Mondial qui complote secrètement pour mettre en œuvre le Projet Insight avec une apparence sinistre de la communauté du renseignement.",
    description_es: "Alexander Pierce (2023) da vida al infiltrado de HYDRA de Robert Redford en atuendo formal de SHIELD, capturando al miembro aparentemente leal del Consejo de Seguridad Mundial que secretamente conspira para implementar el Proyecto Insight con apariencia siniestra de comunidad de inteligencia."
  },
  {
    minifigure_no: 'sh0921',
    description_en: "Dr. Helen Cho (2023) features Claudia Kim's genius geneticist in lab attire, capturing the Cradle technology creator who develops synthetic tissue regeneration and plays a key role in Vision's creation with scientific expertise.",
    description_de: "Dr. Helen Cho (2023) zeigt Claudia Kims geniale Genetikerin in Laborkleidung, die die Cradle-Technologie-Schöpferin einfängt, die synthetische Geweberegeneration entwickelt und eine Schlüsselrolle bei Visions Erschaffung mit wissenschaftlicher Expertise spielt.",
    description_fr: "Dr. Helen Cho (2023) présente la généticienne de génie de Claudia Kim dans une tenue de laboratoire, capturant la créatrice de la technologie Cradle qui développe la régénération tissulaire synthétique et joue un rôle clé dans la création de Vision avec une expertise scientifique.",
    description_es: "Dr. Helen Cho (2023) presenta a la genetista genio de Claudia Kim en atuendo de laboratorio, capturando a la creadora de tecnología Cradle que desarrolla regeneración de tejido sintético y juega un papel clave en la creación de Vision con experiencia científica."
  },
  {
    minifigure_no: 'sh0922',
    description_en: "Black Widow in Black Jumpsuit with Printed Legs and Arms (2023) features Natasha Romanoff in her tactical stealth suit with enhanced printing details on both legs and arms, capturing her combat-ready appearance with premium costume detailing.",
    description_de: "Black Widow im schwarzen Jumpsuit mit bedruckten Beinen und Armen (2023) zeigt Natasha Romanoff in ihrem taktischen Stealth-Anzug mit verbesserten Druckdetails sowohl an Beinen als auch Armen, die ihr kampfbereites Erscheinungsbild mit Premium-Kostümdetails einfängt.",
    description_fr: "Black Widow en combinaison noire avec jambes et bras imprimés (2023) présente Natasha Romanoff dans son costume furtif tactique avec des détails d'impression améliorés sur les jambes et les bras, capturant son apparence prête au combat avec des détails de costume premium.",
    description_es: "Black Widow en mono negro con piernas y brazos impresos (2023) presenta a Natasha Romanoff en su traje táctico sigiloso con detalles de impresión mejorados tanto en piernas como en brazos, capturando su apariencia lista para combate con detalles de traje premium."
  },
  {
    minifigure_no: 'sh0923',
    description_en: "Iron Man in Mark 6 Armor with Battle Damage (2023) features Tony Stark's suit with weathered details and damage printing, capturing post-combat appearance with scratches and wear from intense battles with enhanced realistic detailing.",
    description_de: "Iron Man in Mark 6 Rüstung mit Kampfschaden (2023) zeigt Tony Starks Anzug mit verwitterten Details und Schadens-Druck, der das Nach-Kampf-Erscheinungsbild mit Kratzern und Abnutzung von intensiven Kämpfen mit verbessertem realistischem Detail einfängt.",
    description_fr: "Iron Man en armure Mark 6 avec dégâts de bataille (2023) présente le costume de Tony Stark avec des détails usés et une impression de dommages, capturant l'apparence après combat avec des rayures et l'usure de batailles intenses avec des détails réalistes améliorés.",
    description_es: "Iron Man en armadura Mark 6 con daño de batalla (2023) presenta el traje de Tony Stark con detalles desgastados e impresión de daños, capturando apariencia post-combate con rasguños y desgaste de batallas intensas con detalles realistas mejorados."
  },
  {
    minifigure_no: 'sh0925',
    description_en: "Hawkeye in Black and Dark Red Suit with Quiver (2023) features Clint Barton in his tactical archer costume with dark tan hair and silver zipper details, capturing Jeremy Renner's marksman with arrow quiver accessory and combat-ready appearance.",
    description_de: "Hawkeye im schwarz-dunkelroten Anzug mit Köcher (2023) zeigt Clint Barton in seinem taktischen Bogenschützen-Kostüm mit dunkelbraunem Haar und silbernen Reißverschluss-Details, der Jeremy Renners Scharfschützen mit Pfeilköcher-Zubehör und kampfbereitem Erscheinungsbild einfängt.",
    description_fr: "Hawkeye en costume noir et rouge foncé avec carquois (2023) présente Clint Barton dans son costume d'archer tactique avec des cheveux châtain foncé et des détails de fermeture éclair argentée, capturant le tireur d'élite de Jeremy Renner avec un accessoire de carquois de flèches et une apparence prête au combat.",
    description_es: "Hawkeye en traje negro y rojo oscuro con carcaj (2023) presenta a Clint Barton en su traje de arquero táctico con cabello castaño oscuro y detalles de cremallera plateada, capturando al tirador de élite de Jeremy Renner con accesorio de carcaj de flechas y apariencia lista para combate."
  }
];

async function main() {
  console.log(`Starting batch update: sh0901-sh0925 (${descriptions.length} minifigures)`);

  for (const desc of descriptions) {
    try {
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
      console.log(`✅ Updated ${desc.minifigure_no}`);
    } catch (error) {
      console.error(`❌ Failed to update ${desc.minifigure_no}:`, error);
    }
  }

  console.log(`\n✅ Batch complete: sh0901-sh0925`);
  await prisma.$disconnect();
}

main();
