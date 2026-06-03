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
    minifigure_no: 'sh0776',
    description_en: "MJ (Michelle Jones) in Dark Bluish Gray Plaid Jacket (2021) from No Way Home features Zendaya's character in her casual high school outfit with dark brown wavy hair, perfect for Spider-Man story displays.",
    description_de: "MJ (Michelle Jones) in dunkelblaugrauer Karojacke (2021) aus No Way Home zeigt Zendayas Charakter in ihrem lässigen Highschool-Outfit mit dunkelbraunem welligem Haar, perfekt für Spider-Man-Story-Displays.",
    description_fr: "MJ (Michelle Jones) en veste écossaise gris bleu foncé (2021) de No Way Home présente le personnage de Zendaya dans sa tenue décontractée de lycée avec des cheveux bruns ondulés, parfait pour les présentations d'histoires Spider-Man.",
    description_es: "MJ (Michelle Jones) en chaqueta de cuadros gris azulado oscuro (2021) de No Way Home presenta el personaje de Zendaya en su atuendo casual de secundaria con cabello castaño ondulado, perfecto para exhibiciones de historias de Spider-Man."
  },
  {
    minifigure_no: 'sh0777',
    description_en: "Doctor Strange with Necklace and Flexible Rubber Cape (2021) from No Way Home features the Sorcerer Supreme with Eye of Agamotto necklace and realistic flowing cape, capturing his pivotal role in the multiverse storyline.",
    description_de: "Doctor Strange mit Halskette und flexiblem Gummiumhang (2021) aus No Way Home zeigt den Sorcerer Supreme mit Auge von Agamotto-Halskette und realistisch fließendem Umhang, der seine entscheidende Rolle in der Multiversum-Storyline einfängt.",
    description_fr: "Doctor Strange avec collier et cape en caoutchouc flexible (2021) de No Way Home présente le Sorcier Suprême avec un collier Œil d'Agamotto et une cape fluide réaliste, capturant son rôle central dans l'histoire du multivers.",
    description_es: "Doctor Strange con collar y capa de goma flexible (2021) de No Way Home presenta al Hechicero Supremo con collar del Ojo de Agamotto y capa fluida realista, capturando su papel fundamental en la historia del multiverso."
  },
  {
    minifigure_no: 'sh0778',
    description_en: "Spider-Man in Integrated Suit (2021) from No Way Home features Peter Parker's hybrid costume combining Stark tech with magic protection, with large gold spider emblem and gold knee trim representing the merged technologies.",
    description_de: "Spider-Man im integrierten Anzug (2021) aus No Way Home zeigt Peter Parkers Hybrid-Kostüm, das Stark-Technologie mit magischem Schutz kombiniert, mit großem goldenem Spinnen-Emblem und goldener Knieverkleidung, die die verschmolzenen Technologien darstellen.",
    description_fr: "Spider-Man en costume intégré (2021) de No Way Home présente le costume hybride de Peter Parker combinant la technologie Stark avec la protection magique, avec un grand emblème d'araignée dorée et une bordure de genou dorée représentant les technologies fusionnées.",
    description_es: "Spider-Man en traje integrado (2021) de No Way Home presenta el traje híbrido de Peter Parker que combina tecnología Stark con protección mágica, con gran emblema de araña dorada y ribete dorado en la rodilla que representan las tecnologías fusionadas."
  },
  {
    minifigure_no: 'sh0779',
    description_en: "Wong in Bright Light Orange Parka (2021) from No Way Home shows the Sorcerer Supreme in casual winter attire, capturing his everyday civilian appearance when not in mystical robes with vibrant orange jacket.",
    description_de: "Wong in hellorangener Parka (2021) aus No Way Home zeigt den Sorcerer Supreme in lässiger Winterkleidung, der sein alltägliches Zivilisten-Erscheinungsbild einfängt, wenn er nicht in mystischen Roben mit leuchtend oranger Jacke ist.",
    description_fr: "Wong en parka orange vif (2021) de No Way Home montre le Sorcier Suprême dans une tenue hivernale décontractée, capturant son apparence civile quotidienne lorsqu'il ne porte pas de robes mystiques avec une veste orange vibrante.",
    description_es: "Wong en parka naranja brillante (2021) de No Way Home muestra al Hechicero Supremo en atuendo invernal casual, capturando su apariencia civil cotidiana cuando no está en túnicas místicas con chaqueta naranja vibrante."
  },
  {
    minifigure_no: 'sh0780',
    description_en: "Scarecrow without Hat in Dark Bluish Gray Suit (2021) from Dark Knight Trilogy depicts Dr. Jonathan Crane in his civilian psychiatrist attire, perfect for Arkham Asylum scenes before donning his fear-inducing mask.",
    description_de: "Scarecrow ohne Hut im dunkelblaugrauen Anzug (2021) aus der Dark Knight Trilogie zeigt Dr. Jonathan Crane in seiner zivilen Psychiater-Kleidung, perfekt für Arkham Asylum-Szenen, bevor er seine furchteinflößende Maske aufsetzt.",
    description_fr: "Scarecrow sans chapeau en costume gris bleu foncé (2021) de la trilogie Dark Knight représente le Dr. Jonathan Crane dans sa tenue civile de psychiatre, parfait pour les scènes d'Arkham Asylum avant de mettre son masque induisant la peur.",
    description_es: "Scarecrow sin sombrero en traje gris azulado oscuro (2021) de la trilogía Dark Knight representa al Dr. Jonathan Crane en su atuendo civil de psiquiatra, perfecto para escenas de Arkham Asylum antes de ponerse su máscara inductora de miedo."
  },
  {
    minifigure_no: 'sh0781',
    description_en: "Batman in Black Suit with Copper Belt and Spongy Cape (2021) from Dark Knight Trilogy features Christian Bale's iconic tactical armor with metallic copper utility belt and realistic textured cape for authentic Gotham displays.",
    description_de: "Batman im schwarzen Anzug mit Kupfergürtel und schwammigem Umhang (2021) aus der Dark Knight Trilogie zeigt Christian Bales ikonische taktische Rüstung mit metallischem Kupfer-Utility-Gürtel und realistischem texturiertem Umhang für authentische Gotham-Displays.",
    description_fr: "Batman en costume noir avec ceinture cuivre et cape spongieuse (2021) de la trilogie Dark Knight présente l'armure tactique iconique de Christian Bale avec une ceinture utilitaire cuivre métallique et une cape texturée réaliste pour des présentations Gotham authentiques.",
    description_es: "Batman en traje negro con cinturón de cobre y capa esponjosa (2021) de la trilogía Dark Knight presenta la icónica armadura táctica de Christian Bale con cinturón de utilidad de cobre metálico y capa texturizada realista para exhibiciones auténticas de Gotham."
  },
  {
    minifigure_no: 'sh0782',
    description_en: "Spider-Man in Upgraded Suit (2021) from No Way Home features Peter Parker's Far From Home black and red costume with small black spider emblem and silver technological trim, representing Tony Stark's final gift design.",
    description_de: "Spider-Man im aufgerüsteten Anzug (2021) aus No Way Home zeigt Peter Parkers Far From Home schwarz-roten Kostüm mit kleinem schwarzem Spinnen-Emblem und silberner technologischer Verkleidung, die Tony Starks letztes Geschenk-Design darstellt.",
    description_fr: "Spider-Man en costume amélioré (2021) de No Way Home présente le costume noir et rouge Far From Home de Peter Parker avec un petit emblème d'araignée noir et une bordure technologique argentée, représentant le design du dernier cadeau de Tony Stark.",
    description_es: "Spider-Man en traje mejorado (2021) de No Way Home presenta el traje negro y rojo de Far From Home de Peter Parker con pequeño emblema de araña negro y ribete tecnológico plateado, representando el diseño del último regalo de Tony Stark."
  },
  {
    minifigure_no: 'sh0783',
    description_en: "Mysterio with Magenta Trim and Satin Trans-Light Blue Helmet (2021) from No Way Home features Quentin Beck's illusion-master costume with distinctive magenta cape trim and translucent fishbowl helmet with special satin finish.",
    description_de: "Mysterio mit magentafarbener Verkleidung und satiniertem transparentlichtblauem Helm (2021) aus No Way Home zeigt Quentin Becks Illusionsmeister-Kostüm mit markanter magentafarbener Umhangverkleidung und durchsichtigem Fischglas-Helm mit speziellem Satinfinish.",
    description_fr: "Mysterio avec bordure magenta et casque bleu clair trans satiné (2021) de No Way Home présente le costume de maître des illusions de Quentin Beck avec une bordure de cape magenta distinctive et un casque en bocal translucide avec finition satinée spéciale.",
    description_es: "Mysterio con ribete magenta y casco azul claro trans satinado (2021) de No Way Home presenta el traje de maestro de ilusiones de Quentin Beck con ribete de capa magenta distintivo y casco de pecera translúcido con acabado satinado especial."
  },
  {
    minifigure_no: 'sh0784',
    description_en: "Bruce Wayne Drifter (2021) from The Batman shows Robert Pattinson's reclusive billionaire in casual street clothes, capturing his underground vigilante persona before fully suiting up as the Dark Knight with disheveled appearance.",
    description_de: "Bruce Wayne Drifter (2021) aus The Batman zeigt Robert Pattinsons zurückgezogenen Milliardär in lässiger Straßenkleidung, der seine unterirdische Vigilanten-Persona einfängt, bevor er sich vollständig als Dark Knight mit ungepflegtem Erscheinungsbild anzieht.",
    description_fr: "Bruce Wayne Drifter (2021) de The Batman montre le milliardaire reclus de Robert Pattinson dans des vêtements de rue décontractés, capturant son personnage de justicier underground avant de s'équiper complètement en tant que Dark Knight avec une apparence débraillée.",
    description_es: "Bruce Wayne Drifter (2021) de The Batman muestra al multimillonario recluso de Robert Pattinson en ropa de calle casual, capturando su persona de vigilante clandestino antes de vestirse completamente como el Caballero Oscuro con apariencia desaliñada."
  },
  {
    minifigure_no: 'sh0785',
    description_en: "The Riddler in Olive Green Jacket (2021) from The Batman features Paul Dano's menacing terrorist version with olive military-style jacket, capturing his Zodiac Killer-inspired interpretation with dark psychological edge.",
    description_de: "Der Riddler in olivgrüner Jacke (2021) aus The Batman zeigt Paul Danos bedrohliche Terroristen-Version mit olivfarbener Militärjacke, die seine vom Zodiac Killer inspirierte Interpretation mit dunkler psychologischer Kante einfängt.",
    description_fr: "The Riddler en veste vert olive (2021) de The Batman présente la version terroriste menaçante de Paul Dano avec une veste de style militaire olive, capturant son interprétation inspirée du tueur du Zodiac avec un côté psychologique sombre.",
    description_es: "The Riddler en chaqueta verde oliva (2021) de The Batman presenta la versión terrorista amenazante de Paul Dano con chaqueta de estilo militar oliva, capturando su interpretación inspirada en el Asesino del Zodiaco con toque psicológico oscuro."
  },
  {
    minifigure_no: 'sh0786',
    description_en: "Batman in Dark Bluish Gray Suit with Black Belt (2021) from The Batman depicts Robert Pattinson's armored vigilante costume with realistic tactical details, black boots, and spongy textured cape for Year Two Gotham adventures.",
    description_de: "Batman im dunkelblaugrauen Anzug mit schwarzem Gürtel (2021) aus The Batman zeigt Robert Pattinsons gepanzerte Vigilanten-Kostüm mit realistischen taktischen Details, schwarzen Stiefeln und schwammig texturiertem Umhang für Year Two Gotham-Abenteuer.",
    description_fr: "Batman en costume gris bleu foncé avec ceinture noire (2021) de The Batman représente le costume de justicier blindé de Robert Pattinson avec des détails tactiques réalistes, des bottes noires et une cape texturée spongieuse pour les aventures Year Two de Gotham.",
    description_es: "Batman en traje gris azulado oscuro con cinturón negro (2021) de The Batman representa el traje de vigilante blindado de Robert Pattinson con detalles tácticos realistas, botas negras y capa texturizada esponjosa para aventuras de Gotham Año Dos."
  },
  {
    minifigure_no: 'sh0787',
    description_en: "Lt. James Gordon with Black Hair and Black Suit (2021) from The Batman features Jeffrey Wright's honest cop character in detective attire with dark red tie, perfect for GCPD corruption investigation storylines.",
    description_de: "Lt. James Gordon mit schwarzem Haar und schwarzem Anzug (2021) aus The Batman zeigt Jeffrey Wrights ehrlichen Polizisten-Charakter in Detektiv-Kleidung mit dunkelroter Krawatte, perfekt für GCPD-Korruptionsermittlungs-Storylines.",
    description_fr: "Lt. James Gordon avec cheveux noirs et costume noir (2021) de The Batman présente le personnage de flic honnête de Jeffrey Wright dans une tenue de détective avec cravate rouge foncé, parfait pour les scénarios d'enquête sur la corruption du GCPD.",
    description_es: "Lt. James Gordon con cabello negro y traje negro (2021) de The Batman presenta el personaje de policía honesto de Jeffrey Wright en atuendo de detective con corbata roja oscura, perfecto para historias de investigación de corrupción del GCPD."
  },
  {
    minifigure_no: 'sh0788',
    description_en: "Selina Kyle (2021) from The Batman shows Zoë Kravitz's Catwoman in her civilian identity with casual street clothes, capturing her cat burglar persona before donning the full feline costume with mysterious allure.",
    description_de: "Selina Kyle (2021) aus The Batman zeigt Zoë Kravitz' Catwoman in ihrer zivilen Identität mit lässiger Straßenkleidung, die ihre Katzenburglar-Persona einfängt, bevor sie das vollständige Katzenkostüm mit geheimnisvoller Anziehungskraft anzieht.",
    description_fr: "Selina Kyle (2021) de The Batman montre la Catwoman de Zoë Kravitz dans son identité civile avec des vêtements de rue décontractés, capturant son personnage de cambrioleuse avant de revêtir le costume félin complet avec une allure mystérieuse.",
    description_es: "Selina Kyle (2021) de The Batman muestra a la Catwoman de Zoë Kravitz en su identidad civil con ropa de calle casual, capturando su persona de ladrona de gatos antes de ponerse el traje felino completo con encanto misterioso."
  },
  {
    minifigure_no: 'sh0789',
    description_en: "Alfred Pennyworth in Black Vest (2021) from The Batman features Andy Serkis's loyal butler with light bluish gray hair and dark bluish gray beard, capturing his mentor role to young Bruce Wayne with distinguished appearance.",
    description_de: "Alfred Pennyworth in schwarzer Weste (2021) aus The Batman zeigt Andy Serkis' treuen Butler mit hellblaugrauem Haar und dunkelblaugrauem Bart, der seine Mentorrolle für den jungen Bruce Wayne mit distinguiertem Erscheinungsbild einfängt.",
    description_fr: "Alfred Pennyworth en gilet noir (2021) de The Batman présente le majordome loyal d'Andy Serkis avec des cheveux gris bleu clair et une barbe gris bleu foncé, capturant son rôle de mentor pour le jeune Bruce Wayne avec une apparence distinguée.",
    description_es: "Alfred Pennyworth en chaleco negro (2021) de The Batman presenta al mayordomo leal de Andy Serkis con cabello gris azulado claro y barba gris azulada oscura, capturando su papel de mentor del joven Bruce Wayne con apariencia distinguida."
  },
  {
    minifigure_no: 'sh0790',
    description_en: "The Penguin (2021) from The Batman depicts Colin Farrell's crime lord Oswald Cobblepot in his Iceberg Lounge persona, capturing the prosthetics-enhanced mobster appearance with detailed criminal underworld styling.",
    description_de: "Der Pinguin (2021) aus The Batman zeigt Colin Farrells Verbrecherboss Oswald Cobblepot in seiner Iceberg Lounge-Persona, der das durch Prothesen verstärkte Mobster-Erscheinungsbild mit detailliertem kriminellem Unterwelt-Styling einfängt.",
    description_fr: "The Penguin (2021) de The Batman représente le chef du crime Oswald Cobblepot de Colin Farrell dans son personnage de l'Iceberg Lounge, capturant l'apparence de mafieux améliorée par prothèses avec un style de monde criminel détaillé.",
    description_es: "The Penguin (2021) de The Batman representa al señor del crimen Oswald Cobblepot de Colin Farrell en su persona del Iceberg Lounge, capturando la apariencia de mafioso mejorada con prótesis con estilo detallado del mundo criminal."
  },
  {
    minifigure_no: 'sh0791',
    description_en: "Batman in Black Suit with Copper Belt and Printed Legs (2021) from Dark Knight Trilogy features Type 2 Cowl design with enhanced printed leg details and metallic copper utility belt for premium Christian Bale displays.",
    description_de: "Batman im schwarzen Anzug mit Kupfergürtel und bedruckten Beinen (2021) aus der Dark Knight Trilogie zeigt Type 2 Cowl-Design mit verbesserten bedruckten Beindetails und metallischem Kupfer-Utility-Gürtel für Premium Christian Bale-Displays.",
    description_fr: "Batman en costume noir avec ceinture cuivre et jambes imprimées (2021) de la trilogie Dark Knight présente le design Type 2 Cowl avec des détails de jambes imprimées améliorés et une ceinture utilitaire cuivre métallique pour des présentations premium de Christian Bale.",
    description_es: "Batman en traje negro con cinturón de cobre y piernas impresas (2021) de la trilogía Dark Knight presenta diseño Type 2 Cowl con detalles de piernas impresas mejorados y cinturón de utilidad de cobre metálico para exhibiciones premium de Christian Bale."
  },
  {
    minifigure_no: 'sh0792',
    description_en: "The Joker in Green Vest and Printed Arms (2021) from Dark Knight Trilogy captures Heath Ledger's anarchic criminal mastermind with detailed arm printing showing his purple coat sleeves and iconic chaotic styling.",
    description_de: "Der Joker in grüner Weste und bedruckten Armen (2021) aus der Dark Knight Trilogie fängt Heath Ledgers anarchisches kriminelles Superhirn mit detailliertem Armdruck ein, der seine lila Mantelärmel und ikonisches chaotisches Styling zeigt.",
    description_fr: "The Joker en gilet vert et bras imprimés (2021) de la trilogie Dark Knight capture le cerveau criminel anarchique de Heath Ledger avec une impression détaillée des bras montrant les manches de son manteau violet et son style chaotique iconique.",
    description_es: "The Joker en chaleco verde y brazos impresos (2021) de la trilogía Dark Knight captura al cerebro criminal anárquico de Heath Ledger con impresión detallada en los brazos mostrando las mangas de su abrigo púrpura y estilo caótico icónico."
  },
  {
    minifigure_no: 'sh0793',
    description_en: "Wong in Dark Red Robe and Dark Purple Legs (2021) from Doctor Strange in the Multiverse of Madness features the Sorcerer Supreme in his mystical robes, capturing his leadership of Kamar-Taj with traditional costume details.",
    description_de: "Wong in dunkelroter Robe und dunkellila Beinen (2021) aus Doctor Strange in the Multiverse of Madness zeigt den Sorcerer Supreme in seinen mystischen Roben, der seine Führung von Kamar-Taj mit traditionellen Kostümdetails einfängt.",
    description_fr: "Wong en robe rouge foncé et jambes violet foncé (2021) de Doctor Strange in the Multiverse of Madness présente le Sorcier Suprême dans ses robes mystiques, capturant son leadership de Kamar-Taj avec des détails de costume traditionnels.",
    description_es: "Wong en túnica roja oscura y piernas púrpura oscuro (2021) de Doctor Strange in the Multiverse of Madness presenta al Hechicero Supremo en sus túnicas místicas, capturando su liderazgo de Kamar-Taj con detalles de traje tradicionales."
  },
  {
    minifigure_no: 'sh0794',
    description_en: "Ghost-Spider (Gwen Stacy) with Medium Legs (2022) from Spidey and His Amazing Friends features the young hero in her white and dark purple suit with medium azure spider logo, perfect for 4+ builders' superhero adventures.",
    description_de: "Ghost-Spider (Gwen Stacy) mit mittleren Beinen (2022) aus Spidey and His Amazing Friends zeigt die junge Heldin in ihrem weiß-dunkellila Anzug mit mittelazurblauem Spinnen-Logo, perfekt für Superhelden-Abenteuer für Baumeister ab 4 Jahren.",
    description_fr: "Ghost-Spider (Gwen Stacy) avec jambes moyennes (2022) de Spidey and His Amazing Friends présente la jeune héroïne dans son costume blanc et violet foncé avec un logo d'araignée azur moyen, parfait pour les aventures de super-héros des constructeurs de 4 ans et plus.",
    description_es: "Ghost-Spider (Gwen Stacy) con piernas medianas (2022) de Spidey and His Amazing Friends presenta a la joven heroína en su traje blanco y púrpura oscuro con logo de araña azul medio, perfecto para aventuras de superhéroes de constructores de 4+ años."
  },
  {
    minifigure_no: 'sh0795',
    description_en: "Rhino with Shoulder Armor and White Horn (2022) from Spidey and His Amazing Friends features the charging villain in his mechanized suit with prominent white horn attachment, perfect for young fans' action-packed battles.",
    description_de: "Rhino mit Schulterrüstung und weißem Horn (2022) aus Spidey and His Amazing Friends zeigt den stürmenden Schurken in seinem mechanisierten Anzug mit prominentem weißem Horn-Aufsatz, perfekt für actiongeladene Kämpfe junger Fans.",
    description_fr: "Rhino avec armure d'épaule et corne blanche (2022) de Spidey and His Amazing Friends présente le méchant chargeant dans son costume mécanisé avec une corne blanche proéminente, parfait pour les batailles pleines d'action des jeunes fans.",
    description_es: "Rhino con armadura de hombro y cuerno blanco (2022) de Spidey and His Amazing Friends presenta al villano embistiendo en su traje mecanizado con prominente cuerno blanco adjunto, perfecto para batallas llenas de acción de fans jóvenes."
  },
  {
    minifigure_no: 'sh0796',
    description_en: "Doc Ock Female with Medium Legs (2022) from Spidey and His Amazing Friends shows Olivia Octavius in bright green jacket with large goggles and flat silver mechanical arms, bringing the animated series villain to life for young builders.",
    description_de: "Doc Ock weiblich mit mittleren Beinen (2022) aus Spidey and His Amazing Friends zeigt Olivia Octavius in helllgrüner Jacke mit großer Schutzbrille und flachen silbernen mechanischen Armen, die den Schurken der Animationsserie für junge Baumeister zum Leben erweckt.",
    description_fr: "Doc Ock féminine avec jambes moyennes (2022) de Spidey and His Amazing Friends montre Olivia Octavius dans une veste vert vif avec de grandes lunettes et des bras mécaniques argentés plats, donnant vie au méchant de la série animée pour les jeunes constructeurs.",
    description_es: "Doc Ock femenina con piernas medianas (2022) de Spidey and His Amazing Friends muestra a Olivia Octavius en chaqueta verde brillante con gafas grandes y brazos mecánicos plateados planos, dando vida a la villana de la serie animada para constructores jóvenes."
  },
  {
    minifigure_no: 'sh0797',
    description_en: "Spider-Man (Peter 'Spidey' Parker) with Medium Legs (2022) from Spidey and His Amazing Friends features the young hero in his classic red and blue suit with black spider logo, perfect for preschool Marvel adventures with simplified design.",
    description_de: "Spider-Man (Peter 'Spidey' Parker) mit mittleren Beinen (2022) aus Spidey and His Amazing Friends zeigt den jungen Helden in seinem klassischen rot-blauen Anzug mit schwarzem Spinnen-Logo, perfekt für Vorschul-Marvel-Abenteuer mit vereinfachtem Design.",
    description_fr: "Spider-Man (Peter 'Spidey' Parker) avec jambes moyennes (2022) de Spidey and His Amazing Friends présente le jeune héros dans son costume classique rouge et bleu avec un logo d'araignée noir, parfait pour les aventures Marvel préscolaires avec un design simplifié.",
    description_es: "Spider-Man (Peter 'Spidey' Parker) con piernas medianas (2022) de Spidey and His Amazing Friends presenta al joven héroe en su traje clásico rojo y azul con logo de araña negro, perfecto para aventuras Marvel preescolares con diseño simplificado."
  },
  {
    minifigure_no: 'sh0798',
    description_en: "Hulk Minifigure in Dark Purple Pants (2022) from Spidey and His Amazing Friends features the green giant with short tousled hair in his classic purple pants, capturing Bruce Banner's alter ego for young superhero team displays.",
    description_de: "Hulk-Minifigur in dunkellila Hose (2022) aus Spidey and His Amazing Friends zeigt den grünen Riesen mit kurzem zerzaustem Haar in seiner klassischen lila Hose, der Bruce Banners Alter Ego für junge Superhelden-Team-Displays einfängt.",
    description_fr: "Figurine Hulk en pantalon violet foncé (2022) de Spidey and His Amazing Friends présente le géant vert avec des cheveux courts ébouriffés dans son pantalon violet classique, capturant l'alter ego de Bruce Banner pour les présentations d'équipe de super-héros jeunes.",
    description_es: "Minifigura de Hulk en pantalones púrpura oscuro (2022) de Spidey and His Amazing Friends presenta al gigante verde con cabello corto despeinado en sus pantalones púrpura clásicos, capturando el alter ego de Bruce Banner para exhibiciones de equipos de superhéroes jóvenes."
  },
  {
    minifigure_no: 'sh0799',
    description_en: "Ms. Marvel (Kamala Khan) with Medium Legs (2022) from Spidey and His Amazing Friends introduces Marvel's stretching teen hero in her purple and red costume with lightning bolt design, perfect for diverse superhero team building.",
    description_de: "Ms. Marvel (Kamala Khan) mit mittleren Beinen (2022) aus Spidey and His Amazing Friends führt Marvels dehnbare Teen-Heldin in ihrem lila-roten Kostüm mit Blitz-Design ein, perfekt für vielfältigen Superhelden-Team-Aufbau.",
    description_fr: "Ms. Marvel (Kamala Khan) avec jambes moyennes (2022) de Spidey and His Amazing Friends présente l'héroïne adolescente extensible de Marvel dans son costume violet et rouge avec un design d'éclair, parfait pour la construction d'équipes de super-héros diversifiées.",
    description_es: "Ms. Marvel (Kamala Khan) con piernas medianas (2022) de Spidey and His Amazing Friends presenta a la heroína adolescente elástica de Marvel en su traje púrpura y rojo con diseño de rayo, perfecto para construcción de equipos de superhéroes diversos."
  },
  {
    minifigure_no: 'sh0800',
    description_en: "Spider-Man (Miles 'Spin' Morales) with Red Medium Legs (2022) from Spidey and His Amazing Friends features the young Brooklyn hero in his black suit with red spider logo and red legs, bringing multiverse Spider-diversity to preschool sets.",
    description_de: "Spider-Man (Miles 'Spin' Morales) mit roten mittleren Beinen (2022) aus Spidey and His Amazing Friends zeigt den jungen Brooklyn-Helden in seinem schwarzen Anzug mit rotem Spinnen-Logo und roten Beinen, der Multiversum-Spider-Vielfalt in Vorschul-Sets bringt.",
    description_fr: "Spider-Man (Miles 'Spin' Morales) avec jambes moyennes rouges (2022) de Spidey and His Amazing Friends présente le jeune héros de Brooklyn dans son costume noir avec logo d'araignée rouge et jambes rouges, apportant la diversité Spider du multivers aux ensembles préscolaires.",
    description_es: "Spider-Man (Miles 'Spin' Morales) con piernas medianas rojas (2022) de Spidey and His Amazing Friends presenta al joven héroe de Brooklyn en su traje negro con logo de araña rojo y piernas rojas, trayendo diversidad Spider multiverso a sets preescolares."
  }
];

async function main() {
  console.log(`Starting batch update: sh0776-sh0800 (${descriptions.length} minifigures)`);

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

  console.log(`\n✅ Batch complete: sh0776-sh0800`);
  await prisma.$disconnect();
}

main();
