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
    minifigure_no: 'sh0851',
    description_en: "Black Widow in Black Jumpsuit with Dark Orange Short Hair (2023) from The Infinity Saga features Natasha Romanoff in her tactical stealth suit with printed arms and bobbed hairstyle, capturing Scarlett Johansson's spy character with enhanced detail.",
    description_de: "Black Widow im schwarzen Jumpsuit mit dunkellorangem kurzem Haar (2023) aus The Infinity Saga zeigt Natasha Romanoff in ihrem taktischen Stealth-Anzug mit bedruckten Armen und Bob-Frisur, die Scarlett Johanssons Spion-Charakter mit verbessertem Detail einfängt.",
    description_fr: "Black Widow en combinaison noire avec cheveux courts orange foncé (2023) de The Infinity Saga présente Natasha Romanoff dans son costume furtif tactique avec des bras imprimés et une coiffure au carré, capturant le personnage d'espionne de Scarlett Johansson avec des détails améliorés.",
    description_es: "Black Widow en mono negro con cabello corto naranja oscuro (2023) de The Infinity Saga presenta a Natasha Romanoff en su traje táctico sigiloso con brazos impresos y peinado bob, capturando el personaje de espía de Scarlett Johansson con detalle mejorado."
  },
  {
    minifigure_no: 'sh0852',
    description_en: "Captain America in Dark Blue Suit with Dark Blue Belt and Helmet (2023) from The Infinity Saga features Steve Rogers in his Avengers uniform with dark red hands and complete helmet, perfect for Battle of New York and Chitauri invasion displays.",
    description_de: "Captain America im dunkelblauen Anzug mit dunkelblauem Gürtel und Helm (2023) aus The Infinity Saga zeigt Steve Rogers in seiner Avengers-Uniform mit dunkelroten Händen und vollständigem Helm, perfekt für Battle of New York- und Chitauri-Invasion-Displays.",
    description_fr: "Captain America en costume bleu foncé avec ceinture bleu foncé et casque (2023) de The Infinity Saga présente Steve Rogers dans son uniforme Avengers avec des mains rouge foncé et un casque complet, parfait pour les présentations de la Bataille de New York et de l'invasion Chitauri.",
    description_es: "Captain America en traje azul oscuro con cinturón azul oscuro y casco (2023) de The Infinity Saga presenta a Steve Rogers en su uniforme Avengers con manos rojas oscuras y casco completo, perfecto para exhibiciones de la Batalla de Nueva York e invasión Chitauri."
  },
  {
    minifigure_no: 'sh0853',
    description_en: "Iron Man in Mark 7 Armor with Large Helmet Visor (2023) from The Infinity Saga showcases Tony Stark's Battle of New York suit with enhanced visor design, featuring the armor that famously assembled mid-flight through Stark Tower.",
    description_de: "Iron Man in Mark 7 Rüstung mit großem Helm-Visier (2023) aus The Infinity Saga zeigt Tony Starks Battle of New York-Anzug mit verbessertem Visier-Design, mit der Rüstung, die sich berühmt im Flug durch den Stark Tower zusammensetzte.",
    description_fr: "Iron Man en armure Mark 7 avec grande visière de casque (2023) de The Infinity Saga présente le costume Battle of New York de Tony Stark avec un design de visière amélioré, présentant l'armure qui s'est célèbrement assemblée en vol à travers la Stark Tower.",
    description_es: "Iron Man en armadura Mark 7 con visera de casco grande (2023) de The Infinity Saga muestra el traje de la Batalla de Nueva York de Tony Stark con diseño de visera mejorado, presentando la armadura que se ensambló famosamente en vuelo a través de la Torre Stark."
  },
  {
    minifigure_no: 'sh0854',
    description_en: "Bruce Banner with Dark Bluish Gray Legs (2023) from The Infinity Saga features Mark Ruffalo's character in civilian scientist attire with glasses, capturing the mild-mannered physicist before his transformation into the Hulk with detailed printing.",
    description_de: "Bruce Banner mit dunkelblauen Beinen (2023) aus The Infinity Saga zeigt Mark Ruffalos Charakter in ziviler Wissenschaftler-Kleidung mit Brille, der den sanftmütigen Physiker vor seiner Verwandlung in den Hulk mit detailliertem Druck einfängt.",
    description_fr: "Bruce Banner avec jambes gris bleu foncé (2023) de The Infinity Saga présente le personnage de Mark Ruffalo dans une tenue de scientifique civil avec des lunettes, capturant le physicien doux avant sa transformation en Hulk avec une impression détaillée.",
    description_es: "Bruce Banner con piernas gris azulado oscuro (2023) de The Infinity Saga presenta al personaje de Mark Ruffalo en atuendo de científico civil con gafas, capturando al físico apacible antes de su transformación en Hulk con impresión detallada."
  },
  {
    minifigure_no: 'sh0855',
    description_en: "Spider-Man (Miles Morales) with Dark Bluish Gray Webbing and Red Hands (2023) features the Brooklyn hero in his signature black suit with red accents and detailed web pattern, capturing his Into the Spider-Verse style with vibrant colors.",
    description_de: "Spider-Man (Miles Morales) mit dunkelblaugrauem Netz und roten Händen (2023) zeigt den Brooklyn-Helden in seinem charakteristischen schwarzen Anzug mit roten Akzenten und detailliertem Netz-Muster, der seinen Into the Spider-Verse-Stil mit lebendigen Farben einfängt.",
    description_fr: "Spider-Man (Miles Morales) avec toile gris bleu foncé et mains rouges (2023) présente le héros de Brooklyn dans son costume noir signature avec des accents rouges et un motif de toile détaillé, capturant son style Into the Spider-Verse avec des couleurs vibrantes.",
    description_es: "Spider-Man (Miles Morales) con telaraña gris azulado oscuro y manos rojas (2023) presenta al héroe de Brooklyn en su característico traje negro con acentos rojos y patrón de telaraña detallado, capturando su estilo de Into the Spider-Verse con colores vibrantes."
  },
  {
    minifigure_no: 'sh0856',
    description_en: "Morbius (2023) brings the Living Vampire to LEGO with pale skin and vampiric features, capturing Jared Leto's anti-hero character with detailed costume printing showing his transformation from scientist to bloodsucker with dark powers.",
    description_de: "Morbius (2023) bringt den Lebenden Vampir zu LEGO mit blasser Haut und vampirischen Merkmalen, der Jared Letos Anti-Helden-Charakter mit detailliertem Kostümdruck einfängt, der seine Verwandlung vom Wissenschaftler zum Blutsauger mit dunklen Kräften zeigt.",
    description_fr: "Morbius (2023) apporte le Vampire Vivant à LEGO avec une peau pâle et des traits vampiriques, capturant le personnage d'anti-héros de Jared Leto avec une impression de costume détaillée montrant sa transformation de scientifique en suceur de sang avec des pouvoirs sombres.",
    description_es: "Morbius (2023) trae al Vampiro Viviente a LEGO con piel pálida y características vampíricas, capturando el personaje antihéroe de Jared Leto con impresión de traje detallada mostrando su transformación de científico a chupasangre con poderes oscuros."
  },
  {
    minifigure_no: 'sh0857',
    description_en: "Hulk Minifigure in Dark Purple Pants with Spiked Hair (2023) features the green giant with dual-sided head showing smile and angry expressions, capturing Bruce Banner's alter ego with classic purple shorts and powerful muscular build.",
    description_de: "Hulk-Minifigur in dunkellila Hose mit stacheligen Haaren (2023) zeigt den grünen Riesen mit doppelseitigem Kopf, der Lächeln und wütende Ausdrücke zeigt, der Bruce Banners Alter Ego mit klassischer lila Shorts und kraftvollem muskulösem Körperbau einfängt.",
    description_fr: "Figurine Hulk en pantalon violet foncé avec cheveux hérissés (2023) présente le géant vert avec une tête à double face montrant des expressions de sourire et de colère, capturant l'alter ego de Bruce Banner avec un short violet classique et une carrure musculaire puissante.",
    description_es: "Minifigura de Hulk en pantalones púrpura oscuro con cabello puntiagudo (2023) presenta al gigante verde con cabeza de doble cara mostrando expresiones de sonrisa y enojo, capturando el alter ego de Bruce Banner con shorts púrpura clásicos y constitución muscular poderosa."
  },
  {
    minifigure_no: 'sh0858',
    description_en: "Rocket Raccoon in Orange and Dark Tan Outfit with Reddish Brown Head (2023) features the genetically-enhanced Guardian with detailed fur texture and tactical costume, capturing Bradley Cooper's voice character with weapon accessories and sarcastic attitude.",
    description_de: "Rocket Raccoon in orangenem und dunkelbraunem Outfit mit rotbraunem Kopf (2023) zeigt den genetisch verbesserten Guardian mit detaillierter Fell-Textur und taktischem Kostüm, der Bradley Coopers Stimmen-Charakter mit Waffen-Zubehör und sarkastischer Attitüde einfängt.",
    description_fr: "Rocket Raccoon en tenue orange et brun foncé avec tête brun rougeâtre (2023) présente le Gardien génétiquement amélioré avec une texture de fourrure détaillée et un costume tactique, capturant le personnage vocal de Bradley Cooper avec des accessoires d'armes et une attitude sarcastique.",
    description_es: "Rocket Raccoon en atuendo naranja y marrón oscuro con cabeza marrón rojizo (2023) presenta al Guardián genéticamente mejorado con textura de pelaje detallada y traje táctico, capturando el personaje de voz de Bradley Cooper con accesorios de armas y actitud sarcástica."
  },
  {
    minifigure_no: 'sh0859',
    description_en: "Thanos Minifigure in Dark Blue and Gold Outfit with Medium Lavender Arms (2023) depicts the Mad Titan in his iconic armor with enhanced color-matched arms, capturing Josh Brolin's character with imposing build and Infinity Gauntlet quest details.",
    description_de: "Thanos-Minifigur in dunkelblauem und goldenem Outfit mit mittellila Armen (2023) zeigt den Verrückten Titanen in seiner ikonischen Rüstung mit verbesserten farblich passenden Armen, der Josh Brolins Charakter mit imposantem Körperbau und Infinity Gauntlet-Quest-Details einfängt.",
    description_fr: "Figurine Thanos en tenue bleu foncé et or avec bras lavande moyen (2023) représente le Titan fou dans son armure iconique avec des bras assortis en couleur améliorés, capturant le personnage de Josh Brolin avec une carrure imposante et des détails de quête du Gant de l'Infini.",
    description_es: "Minifigura de Thanos en atuendo azul oscuro y dorado con brazos lavanda medio (2023) representa al Titán Loco en su armadura icónica con brazos mejorados a juego de color, capturando el personaje de Josh Brolin con constitución imponente y detalles de búsqueda del Guantelete del Infinito."
  },
  {
    minifigure_no: 'sh0860',
    description_en: "Loki in Pearl Dark Gray Suit with Cloth Cape (2023) from The Infinity Saga features Tom Hiddleston's God of Mischief in his regal Asgardian attire with premium fabric cape, capturing his trickster personality with horned helmet and detailed costume.",
    description_de: "Loki im perlgrauen Anzug mit Stoffumhang (2023) aus The Infinity Saga zeigt Tom Hiddlestons Gott der Streiche in seiner königlichen asgardischen Kleidung mit Premium-Stoffumhang, der seine Schwindler-Persönlichkeit mit gehörntem Helm und detailliertem Kostüm einfängt.",
    description_fr: "Loki en costume gris foncé perlé avec cape en tissu (2023) de The Infinity Saga présente le Dieu de la Malice de Tom Hiddleston dans sa tenue asgardienne royale avec une cape en tissu premium, capturant sa personnalité de filou avec un casque à cornes et un costume détaillé.",
    description_es: "Loki en traje gris oscuro perla con capa de tela (2023) de The Infinity Saga presenta al Dios de las Travesuras de Tom Hiddleston en su atuendo asgardiano regio con capa de tela premium, capturando su personalidad de embaucador con casco con cuernos y traje detallado."
  },
  {
    minifigure_no: 'sh0861',
    description_en: "Ghost Rider (Johnny Blaze) with White Head and Spiked Belt (2023) brings the Spirit of Vengeance to life with flaming skull head piece and leather jacket with spikes, capturing the supernatural motorcycle-riding anti-hero with hellfire powers.",
    description_de: "Ghost Rider (Johnny Blaze) mit weißem Kopf und Stachelgürtel (2023) erweckt den Geist der Rache mit flammendem Schädel-Kopfteil und Lederjacke mit Stacheln zum Leben, der den übernatürlichen Motorrad fahrenden Anti-Helden mit Höllenfeuer-Kräften einfängt.",
    description_fr: "Ghost Rider (Johnny Blaze) avec tête blanche et ceinture à pointes (2023) donne vie à l'Esprit de Vengeance avec une pièce de tête de crâne enflammé et une veste en cuir avec des pointes, capturant l'anti-héros surnaturel motocycliste avec des pouvoirs de feu infernal.",
    description_es: "Ghost Rider (Johnny Blaze) con cabeza blanca y cinturón con pinchos (2023) da vida al Espíritu de Venganza con pieza de cabeza de calavera en llamas y chaqueta de cuero con pinchos, capturando al antihéroe motociclista sobrenatural con poderes de fuego infernal."
  },
  {
    minifigure_no: 'sh0862',
    description_en: "Spider-Man (Miles 'Spin' Morales) in Red Suit with Medium Legs (2023) from Spidey and His Amazing Friends features the young Brooklyn hero in alternate red costume with simplified design for 4+ builders' Spider-Team adventures.",
    description_de: "Spider-Man (Miles 'Spin' Morales) im roten Anzug mit mittleren Beinen (2023) aus Spidey and His Amazing Friends zeigt den jungen Brooklyn-Helden in alternativem rotem Kostüm mit vereinfachtem Design für Spider-Team-Abenteuer für Baumeister ab 4 Jahren.",
    description_fr: "Spider-Man (Miles 'Spin' Morales) en costume rouge avec jambes moyennes (2023) de Spidey and His Amazing Friends présente le jeune héros de Brooklyn dans un costume rouge alternatif avec un design simplifié pour les aventures Spider-Team des constructeurs de 4 ans et plus.",
    description_es: "Spider-Man (Miles 'Spin' Morales) en traje rojo con piernas medianas (2023) de Spidey and His Amazing Friends presenta al joven héroe de Brooklyn en traje rojo alternativo con diseño simplificado para aventuras del Spider-Team de constructores de 4+ años."
  },
  {
    minifigure_no: 'sh0863',
    description_en: "Ghost-Spider (Gwen Stacy) with Trans-Clear Fishbowl Helmet and Yellow Spider Logo (2023) from Spidey and His Amazing Friends features the young hero in space suit variant with transparent helmet for cosmic adventures with simplified preschool design.",
    description_de: "Ghost-Spider (Gwen Stacy) mit transparentem Fischglas-Helm und gelbem Spinnen-Logo (2023) aus Spidey and His Amazing Friends zeigt die junge Heldin in Raumanzug-Variante mit transparentem Helm für kosmische Abenteuer mit vereinfachtem Vorschul-Design.",
    description_fr: "Ghost-Spider (Gwen Stacy) avec casque en bocal transparent et logo d'araignée jaune (2023) de Spidey and His Amazing Friends présente la jeune héroïne dans une variante de combinaison spatiale avec un casque transparent pour des aventures cosmiques avec un design préscolaire simplifié.",
    description_es: "Ghost-Spider (Gwen Stacy) con casco de pecera transparente y logo de araña amarillo (2023) de Spidey and His Amazing Friends presenta a la joven heroína en variante de traje espacial con casco transparente para aventuras cósmicas con diseño preescolar simplificado."
  },
  {
    minifigure_no: 'sh0864',
    description_en: "Sandman with Dark Brown Legs (2023) from Spidey and His Amazing Friends features the shape-shifting villain Flint Marko with sand-textured printing, capturing his granular transformation powers for young fans' Spider-Team battles.",
    description_de: "Sandman mit dunkelbraunen Beinen (2023) aus Spidey and His Amazing Friends zeigt den gestaltwandelnden Schurken Flint Marko mit sand-texturiertem Druck, der seine körnigen Verwandlungskräfte für Spider-Team-Kämpfe junger Fans einfängt.",
    description_fr: "Sandman avec jambes brun foncé (2023) de Spidey and His Amazing Friends présente le méchant métamorphe Flint Marko avec une impression texturée de sable, capturant ses pouvoirs de transformation granulaire pour les batailles Spider-Team des jeunes fans.",
    description_es: "Sandman con piernas marrones oscuras (2023) de Spidey and His Amazing Friends presenta al villano cambiante de forma Flint Marko con impresión texturizada de arena, capturando sus poderes de transformación granular para batallas del Spider-Team de fans jóvenes."
  },
  {
    minifigure_no: 'sh0865',
    description_en: "Black Panther with Medium Legs (2023) from Spidey and His Amazing Friends brings Wakanda's protector to preschool sets with simplified vibranium suit design and medium legs for 4+ builders' superhero team adventures.",
    description_de: "Black Panther mit mittleren Beinen (2023) aus Spidey and His Amazing Friends bringt Wakandas Beschützer in Vorschul-Sets mit vereinfachtem Vibranium-Anzug-Design und mittleren Beinen für Superhelden-Team-Abenteuer für Baumeister ab 4 Jahren.",
    description_fr: "Black Panther avec jambes moyennes (2023) de Spidey and His Amazing Friends apporte le protecteur du Wakanda aux ensembles préscolaires avec un design de costume en vibranium simplifié et des jambes moyennes pour les aventures d'équipe de super-héros des constructeurs de 4 ans et plus.",
    description_es: "Black Panther con piernas medianas (2023) de Spidey and His Amazing Friends trae al protector de Wakanda a sets preescolares con diseño de traje de vibranium simplificado y piernas medianas para aventuras de equipo de superhéroes de constructores de 4+ años."
  },
  {
    minifigure_no: 'sh0866',
    description_en: "Spider-Man (Peter 'Spidey' Parker) with White Spider Logo (2023) from Spidey and His Amazing Friends features the young hero in his classic red and blue suit with white chest emblem, perfect for preschool Marvel adventures with simplified design.",
    description_de: "Spider-Man (Peter 'Spidey' Parker) mit weißem Spinnen-Logo (2023) aus Spidey and His Amazing Friends zeigt den jungen Helden in seinem klassischen rot-blauen Anzug mit weißem Brust-Emblem, perfekt für Vorschul-Marvel-Abenteuer mit vereinfachtem Design.",
    description_fr: "Spider-Man (Peter 'Spidey' Parker) avec logo d'araignée blanc (2023) de Spidey and His Amazing Friends présente le jeune héros dans son costume classique rouge et bleu avec emblème de poitrine blanc, parfait pour les aventures Marvel préscolaires avec un design simplifié.",
    description_es: "Spider-Man (Peter 'Spidey' Parker) con logo de araña blanco (2023) de Spidey and His Amazing Friends presenta al joven héroe en su traje clásico rojo y azul con emblema de pecho blanco, perfecto para aventuras Marvel preescolares con diseño simplificado."
  },
  {
    minifigure_no: 'sh0867',
    description_en: "Spider-Man (Miles 'Spin' Morales) with Black Medium Legs and White Spider Logo (2023) from Spidey and His Amazing Friends features the Brooklyn hero in his signature black suit with white emblem for preschool superhero team displays.",
    description_de: "Spider-Man (Miles 'Spin' Morales) mit schwarzen mittleren Beinen und weißem Spinnen-Logo (2023) aus Spidey and His Amazing Friends zeigt den Brooklyn-Helden in seinem charakteristischen schwarzen Anzug mit weißem Emblem für Vorschul-Superhelden-Team-Displays.",
    description_fr: "Spider-Man (Miles 'Spin' Morales) avec jambes moyennes noires et logo d'araignée blanc (2023) de Spidey and His Amazing Friends présente le héros de Brooklyn dans son costume noir signature avec emblème blanc pour les présentations d'équipe de super-héros préscolaires.",
    description_es: "Spider-Man (Miles 'Spin' Morales) con piernas medianas negras y logo de araña blanco (2023) de Spidey and His Amazing Friends presenta al héroe de Brooklyn en su característico traje negro con emblema blanco para exhibiciones de equipo de superhéroes preescolares."
  },
  {
    minifigure_no: 'sh0868',
    description_en: "Ghost-Spider (Gwen Stacy) with White Hood and White Spider Logo (2023) from Spidey and His Amazing Friends features the young hero in her signature white-hooded costume with simplified preschool design for 4+ builders' Spider-Team adventures.",
    description_de: "Ghost-Spider (Gwen Stacy) mit weißer Kapuze und weißem Spinnen-Logo (2023) aus Spidey and His Amazing Friends zeigt die junge Heldin in ihrem charakteristischen weiß-kapuzigen Kostüm mit vereinfachtem Vorschul-Design für Spider-Team-Abenteuer für Baumeister ab 4 Jahren.",
    description_fr: "Ghost-Spider (Gwen Stacy) avec capuche blanche et logo d'araignée blanc (2023) de Spidey and His Amazing Friends présente la jeune héroïne dans son costume à capuche blanche signature avec un design préscolaire simplifié pour les aventures Spider-Team des constructeurs de 4 ans et plus.",
    description_es: "Ghost-Spider (Gwen Stacy) con capucha blanca y logo de araña blanco (2023) de Spidey and His Amazing Friends presenta a la joven heroína en su característico traje con capucha blanca con diseño preescolar simplificado para aventuras del Spider-Team de constructores de 4+ años."
  },
  {
    minifigure_no: 'sh0869',
    description_en: "Doc Ock Female with Light Bluish Gray Arms (2023) from Spidey and His Amazing Friends shows Olivia Octavius in bright green jacket with large goggles and updated mechanical arm color for preschool villain displays.",
    description_de: "Doc Ock weiblich mit hellblaugrauen Armen (2023) aus Spidey and His Amazing Friends zeigt Olivia Octavius in helllgrüner Jacke mit großer Schutzbrille und aktualisierter mechanischer Armfarbe für Vorschul-Schurken-Displays.",
    description_fr: "Doc Ock féminine avec bras gris bleu clair (2023) de Spidey and His Amazing Friends montre Olivia Octavius dans une veste vert vif avec de grandes lunettes et une couleur de bras mécanique mise à jour pour les présentations de méchants préscolaires.",
    description_es: "Doc Ock femenina con brazos gris azulado claro (2023) de Spidey and His Amazing Friends muestra a Olivia Octavius en chaqueta verde brillante con gafas grandes y color de brazo mecánico actualizado para exhibiciones de villanos preescolares."
  },
  {
    minifigure_no: 'sh0870',
    description_en: "Okoye in Red Top with Shoulder Armor (2023) from The Infinity Saga features Danai Gurira's Dora Milaje general with enhanced armor accessories, capturing Wakanda's fierce warrior with traditional costume and protective shoulder gear for royal guard displays.",
    description_de: "Okoye im roten Top mit Schulterpanzer (2023) aus The Infinity Saga zeigt Danai Guriras Dora Milaje-General mit verbesserten Rüstungs-Zubehör, die Wakandas wilde Kriegerin mit traditionellem Kostüm und schützender Schulterausrüstung für königliche Garde-Displays einfängt.",
    description_fr: "Okoye en haut rouge avec armure d'épaule (2023) de The Infinity Saga présente la générale Dora Milaje de Danai Gurira avec des accessoires d'armure améliorés, capturant la guerrière féroce du Wakanda avec un costume traditionnel et un équipement d'épaule protecteur pour les présentations de garde royale.",
    description_es: "Okoye en top rojo con armadura de hombro (2023) de The Infinity Saga presenta a la general Dora Milaje de Danai Gurira con accesorios de armadura mejorados, capturando a la feroz guerrera de Wakanda con traje tradicional y equipo protector de hombro para exhibiciones de guardia real."
  },
  {
    minifigure_no: 'sh0871',
    description_en: "Outrider with Extended Arms (2023) from The Infinity Saga brings Thanos's alien shock troops to life with extended arm molds and dark bluish gray neck details, capturing the four-armed creatures from the Battle of Wakanda with menacing appearance.",
    description_de: "Outrider mit ausgestreckten Armen (2023) aus The Infinity Saga erweckt Thanos' außerirdische Stoßtruppen mit ausgestreckten Armformen und dunkelblauen Halsdetails zum Leben, die die vierarmigen Kreaturen aus der Schlacht von Wakanda mit bedrohlichem Erscheinungsbild einfangen.",
    description_fr: "Outrider avec bras étendus (2023) de The Infinity Saga donne vie aux troupes de choc aliens de Thanos avec des moules de bras étendus et des détails de cou gris bleu foncé, capturant les créatures à quatre bras de la Bataille du Wakanda avec une apparence menaçante.",
    description_es: "Outrider con brazos extendidos (2023) de The Infinity Saga da vida a las tropas de choque alienígenas de Thanos con moldes de brazos extendidos y detalles de cuello gris azulado oscuro, capturando las criaturas de cuatro brazos de la Batalla de Wakanda con apariencia amenazante."
  },
  {
    minifigure_no: 'sh0872',
    description_en: "Outrider (2023) from The Infinity Saga depicts Thanos's alien warriors in standard configuration with dark bluish gray neck details, perfect for army-building Battle of Wakanda scenes and recreating the Infinity War invasion with multiple units.",
    description_de: "Outrider (2023) aus The Infinity Saga zeigt Thanos' außerirdische Krieger in Standardkonfiguration mit dunkelblauen Halsdetails, perfekt zum Aufbau von Armeen für Battle of Wakanda-Szenen und zur Nachstellung der Infinity War-Invasion mit mehreren Einheiten.",
    description_fr: "Outrider (2023) de The Infinity Saga représente les guerriers aliens de Thanos dans une configuration standard avec des détails de cou gris bleu foncé, parfait pour construire une armée de scènes de la Bataille du Wakanda et recréer l'invasion d'Infinity War avec plusieurs unités.",
    description_es: "Outrider (2023) de The Infinity Saga representa a los guerreros alienígenas de Thanos en configuración estándar con detalles de cuello gris azulado oscuro, perfecto para construir ejército de escenas de la Batalla de Wakanda y recrear la invasión de Infinity War con múltiples unidades."
  },
  {
    minifigure_no: 'sh0873',
    description_en: "Star-Lord in Dark Blue Suit (2023) from Guardians of the Galaxy Vol. 3 features Peter Quill in his updated team uniform with matching color scheme, capturing Chris Pratt's character in coordinated Guardian attire for final trilogy adventures.",
    description_de: "Star-Lord im dunkelblauen Anzug (2023) aus Guardians of the Galaxy Vol. 3 zeigt Peter Quill in seiner aktualisierten Team-Uniform mit passendem Farbschema, der Chris Pratts Charakter in koordinierter Guardian-Kleidung für finale Trilogie-Abenteuer einfängt.",
    description_fr: "Star-Lord en costume bleu foncé (2023) de Guardians of the Galaxy Vol. 3 présente Peter Quill dans son uniforme d'équipe mis à jour avec un schéma de couleurs assorti, capturant le personnage de Chris Pratt dans une tenue Guardian coordonnée pour les aventures finales de la trilogie.",
    description_es: "Star-Lord en traje azul oscuro (2023) de Guardians of the Galaxy Vol. 3 presenta a Peter Quill en su uniforme de equipo actualizado con esquema de colores a juego, capturando el personaje de Chris Pratt en atuendo Guardian coordinado para aventuras finales de trilogía."
  },
  {
    minifigure_no: 'sh0874',
    description_en: "Teen Groot in Dark Tan with Shoulder Armor (2023) from Guardians of the Galaxy Vol. 3 features the adolescent tree warrior with protective shoulder gear, capturing his evolution from moody teenager to capable fighter with enhanced armor details.",
    description_de: "Teen Groot in dunkelbraun mit Schulterpanzer (2023) aus Guardians of the Galaxy Vol. 3 zeigt den jugendlichen Baum-Krieger mit schützender Schulterausrüstung, der seine Entwicklung vom launischen Teenager zum fähigen Kämpfer mit verbesserten Rüstungsdetails einfängt.",
    description_fr: "Teen Groot en brun foncé avec armure d'épaule (2023) de Guardians of the Galaxy Vol. 3 présente le guerrier arbre adolescent avec un équipement d'épaule protecteur, capturant son évolution d'adolescent de mauvaise humeur à combattant capable avec des détails d'armure améliorés.",
    description_es: "Teen Groot en marrón oscuro con armadura de hombro (2023) de Guardians of the Galaxy Vol. 3 presenta al guerrero árbol adolescente con equipo protector de hombro, capturando su evolución de adolescente malhumorado a luchador capaz con detalles de armadura mejorados."
  },
  {
    minifigure_no: 'sh0875',
    description_en: "Rocket Raccoon in Dark Blue Guardians Suit with Reddish Brown Head (2023) from Vol. 3 features the genius engineer in team-coordinated uniform, capturing Bradley Cooper's character in matching Guardian colors for final trilogy adventures and emotional storylines.",
    description_de: "Rocket Raccoon im dunkelblauen Guardians-Anzug mit rotbraunem Kopf (2023) aus Vol. 3 zeigt den genialen Ingenieur in team-koordinierter Uniform, der Bradley Coopers Charakter in passenden Guardian-Farben für finale Trilogie-Abenteuer und emotionale Storylines einfängt.",
    description_fr: "Rocket Raccoon en costume Guardians bleu foncé avec tête brun rougeâtre (2023) de Vol. 3 présente l'ingénieur de génie dans un uniforme coordonné d'équipe, capturant le personnage de Bradley Cooper dans des couleurs Guardian assorties pour les aventures finales de la trilogie et les scénarios émotionnels.",
    description_es: "Rocket Raccoon en traje Guardians azul oscuro con cabeza marrón rojizo (2023) de Vol. 3 presenta al ingeniero genio en uniforme coordinado de equipo, capturando el personaje de Bradley Cooper en colores Guardian a juego para aventuras finales de trilogía e historias emocionales."
  }
];

async function main() {
  console.log(`Starting batch update: sh0851-sh0875 (${descriptions.length} minifigures)`);

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

  console.log(`\n✅ Batch complete: sh0851-sh0875`);
  await prisma.$disconnect();
}

main();
