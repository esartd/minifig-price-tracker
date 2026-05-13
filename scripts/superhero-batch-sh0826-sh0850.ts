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
    minifigure_no: 'sh0826',
    description_en: "Wong in Dark Red Robe and Dark Blue Legs (2022) from The Infinity Saga features the Master of the Mystic Arts in his traditional sorcerer robes with dark blue leg printing, perfect for Sanctum Sanctorum and Kamar-Taj displays.",
    description_de: "Wong in dunkelroter Robe und dunkelblauen Beinen (2022) aus The Infinity Saga zeigt den Meister der mystischen Künste in seinen traditionellen Zauberer-Roben mit dunkelblauem Beindruck, perfekt für Sanctum Sanctorum- und Kamar-Taj-Displays.",
    description_fr: "Wong en robe rouge foncé et jambes bleu foncé (2022) de The Infinity Saga présente le Maître des Arts Mystiques dans ses robes de sorcier traditionnelles avec une impression de jambes bleu foncé, parfait pour les présentations du Sanctum Sanctorum et de Kamar-Taj.",
    description_es: "Wong en túnica roja oscura y piernas azul oscuro (2022) de The Infinity Saga presenta al Maestro de las Artes Místicas en sus túnicas de hechicero tradicionales con impresión de piernas azul oscuro, perfecto para exhibiciones del Sanctum Sanctorum y Kamar-Taj."
  },
  {
    minifigure_no: 'sh0827',
    description_en: "Ebony Maw with Light Bluish Gray Head (2022) from The Infinity Saga brings Thanos's Black Order member to life with alien head mold and dark robes, capturing his telekinetic powers and sinister appearance from Infinity War.",
    description_de: "Ebony Maw mit hellblaugrauem Kopf (2022) aus The Infinity Saga erweckt Thanos' Black Order-Mitglied mit Alien-Kopfform und dunklen Roben zum Leben, der seine telekinetischen Kräfte und sein finsteres Erscheinungsbild aus Infinity War einfängt.",
    description_fr: "Ebony Maw avec tête gris bleu clair (2022) de The Infinity Saga donne vie au membre de l'Ordre Noir de Thanos avec un moule de tête alien et des robes sombres, capturant ses pouvoirs télékinétiques et son apparence sinistre d'Infinity War.",
    description_es: "Ebony Maw con cabeza gris azulado claro (2022) de The Infinity Saga da vida al miembro de la Orden Negra de Thanos con molde de cabeza alienígena y túnicas oscuras, capturando sus poderes telequinéticos y apariencia siniestra de Infinity War."
  },
  {
    minifigure_no: 'sh0828',
    description_en: "Iron Man in Mark 50 Armor with Large Helmet Visor (2022) from The Infinity Saga showcases Tony Stark's nanotech suit from Infinity War with enhanced visor design and bleeding edge technology details for Titan battle displays.",
    description_de: "Iron Man in Mark 50 Rüstung mit großem Helm-Visier (2022) aus The Infinity Saga zeigt Tony Starks Nanotech-Anzug aus Infinity War mit verbessertem Visier-Design und Bleeding Edge-Technologie-Details für Titan-Kampf-Displays.",
    description_fr: "Iron Man en armure Mark 50 avec grande visière de casque (2022) de The Infinity Saga présente le costume nanotech de Tony Stark d'Infinity War avec un design de visière amélioré et des détails de technologie de pointe pour les présentations de bataille sur Titan.",
    description_es: "Iron Man en armadura Mark 50 con visera de casco grande (2022) de The Infinity Saga muestra el traje nanotech de Tony Stark de Infinity War con diseño de visera mejorado y detalles de tecnología de vanguardia para exhibiciones de batalla en Titán."
  },
  {
    minifigure_no: 'sh0829',
    description_en: "Spider-Man with Printed Dark Blue Arms and Red Feet (2022) from The Infinity Saga features enhanced printing details on arms and dual-molded legs with red feet, representing Peter Parker's Iron Spider suit with premium detailing.",
    description_de: "Spider-Man mit bedruckten dunkelblauen Armen und roten Füßen (2022) aus The Infinity Saga zeigt verbesserte Druckdetails an Armen und dual-geformten Beinen mit roten Füßen, die Peter Parkers Iron Spider-Anzug mit Premium-Details darstellen.",
    description_fr: "Spider-Man avec bras bleu foncé imprimés et pieds rouges (2022) de The Infinity Saga présente des détails d'impression améliorés sur les bras et des jambes moulées en double avec des pieds rouges, représentant le costume Iron Spider de Peter Parker avec des détails premium.",
    description_es: "Spider-Man con brazos azul oscuro impresos y pies rojos (2022) de The Infinity Saga presenta detalles de impresión mejorados en los brazos y piernas moldeadas duales con pies rojos, representando el traje Iron Spider de Peter Parker con detalles premium."
  },
  {
    minifigure_no: 'sh0830',
    description_en: "Sinister Strange (2022) from The Infinity Saga depicts the corrupted alternate universe Doctor Strange with darkened costume and third eye detail, capturing his descent into dark magic from Multiverse of Madness with menacing appearance.",
    description_de: "Sinister Strange (2022) aus The Infinity Saga zeigt den korrumpierten alternativen Universum Doctor Strange mit verdunkeltem Kostüm und drittem Auge-Detail, der seinen Abstieg in dunkle Magie aus Multiverse of Madness mit bedrohlichem Erscheinungsbild einfängt.",
    description_fr: "Sinister Strange (2022) de The Infinity Saga représente le Doctor Strange alternatif corrompu avec un costume assombri et un détail de troisième œil, capturant sa descente dans la magie noire de Multiverse of Madness avec une apparence menaçante.",
    description_es: "Sinister Strange (2022) de The Infinity Saga representa al Doctor Strange alternativo corrupto con traje oscurecido y detalle de tercer ojo, capturando su descenso a la magia oscura de Multiverse of Madness con apariencia amenazante."
  },
  {
    minifigure_no: 'sh0831',
    description_en: "The Scarlet Witch (Wanda Maximoff) with Medium Nougat Hair and Tiara (2022) from The Infinity Saga features her classic comic-accurate costume with red and pink details and signature headpiece for powerful WandaVision displays.",
    description_de: "Die Scharlachrote Hexe (Wanda Maximoff) mit mittelbraunem Haar und Tiara (2022) aus The Infinity Saga zeigt ihr klassisches comic-genaues Kostüm mit roten und rosa Details und charakteristischem Kopfschmuck für mächtige WandaVision-Displays.",
    description_fr: "La Sorcière Rouge (Wanda Maximoff) avec cheveux nougat moyen et tiare (2022) de The Infinity Saga présente son costume classique fidèle aux comics avec des détails rouges et roses et un diadème signature pour de puissantes présentations WandaVision.",
    description_es: "La Bruja Escarlata (Wanda Maximoff) con cabello caramelo medio y tiara (2022) de The Infinity Saga presenta su traje clásico fiel a los cómics con detalles rojos y rosados y tocado característico para poderosas exhibiciones de WandaVision."
  },
  {
    minifigure_no: 'sh0832',
    description_en: "Karl Mordo in Sand Green Suit (2022) from The Infinity Saga shows the fallen Master of the Mystic Arts in his distinctive green robes, capturing Chiwetel Ejiofor's character after his turn against sorcerers with detailed costume printing.",
    description_de: "Karl Mordo im sandgrünen Anzug (2022) aus The Infinity Saga zeigt den gefallenen Meister der mystischen Künste in seinen markanten grünen Roben, der Chiwetel Ejiofors Charakter nach seiner Wendung gegen Zauberer mit detailliertem Kostümdruck einfängt.",
    description_fr: "Karl Mordo en costume vert sable (2022) de The Infinity Saga montre le Maître déchu des Arts Mystiques dans ses robes vertes distinctives, capturant le personnage de Chiwetel Ejiofor après son retournement contre les sorciers avec une impression de costume détaillée.",
    description_es: "Karl Mordo en traje verde arena (2022) de The Infinity Saga muestra al Maestro caído de las Artes Místicas en sus túnicas verdes distintivas, capturando el personaje de Chiwetel Ejiofor después de volverse contra los hechiceros con impresión de traje detallada."
  },
  {
    minifigure_no: 'sh0833',
    description_en: "Dead Strange (2022) from The Infinity Saga depicts the zombified Doctor Strange variant with decayed appearance and tattered Cloak of Levitation, capturing the horrific dreamwalking consequences from Multiverse of Madness with undead details.",
    description_de: "Dead Strange (2022) aus The Infinity Saga zeigt die zombifizierte Doctor Strange-Variante mit verwestem Erscheinungsbild und zerrissenem Umhang der Levitation, der die schrecklichen Traumwandel-Konsequenzen aus Multiverse of Madness mit Untoten-Details einfängt.",
    description_fr: "Dead Strange (2022) de The Infinity Saga représente la variante zombifiée de Doctor Strange avec une apparence décomposée et une Cape de Lévitation en lambeaux, capturant les conséquences horrifiques du rêve éveillé de Multiverse of Madness avec des détails de mort-vivant.",
    description_es: "Dead Strange (2022) de The Infinity Saga representa la variante zombificada de Doctor Strange con apariencia descompuesta y Capa de Levitación andrajosa, capturando las consecuencias horríficas del caminar de sueños de Multiverse of Madness con detalles de no-muerto."
  },
  {
    minifigure_no: 'sh0834',
    description_en: "Star-Lord with Dark Red Legs (2022) from Guardians of the Galaxy features Peter Quill in his iconic red leather jacket and mask with dark red leg printing, perfect for Milano spaceship displays and cosmic adventure scenes.",
    description_de: "Star-Lord mit dunkelroten Beinen (2022) aus Guardians of the Galaxy zeigt Peter Quill in seiner ikonischen roten Lederjacke und Maske mit dunkelrotem Beindruck, perfekt für Milano-Raumschiff-Displays und kosmische Abenteuerszenen.",
    description_fr: "Star-Lord avec jambes rouge foncé (2022) de Guardians of the Galaxy présente Peter Quill dans sa veste en cuir rouge iconique et son masque avec une impression de jambes rouge foncé, parfait pour les présentations de vaisseau spatial Milano et les scènes d'aventure cosmique.",
    description_es: "Star-Lord con piernas rojas oscuras (2022) de Guardians of the Galaxy presenta a Peter Quill en su icónica chaqueta de cuero roja y máscara con impresión de piernas roja oscura, perfecto para exhibiciones de nave espacial Milano y escenas de aventura cósmica."
  },
  {
    minifigure_no: 'sh0835',
    description_en: "Nebula in Holiday Sweater (2022) from Guardians of the Galaxy shows the assassin in festive Christmas attire, capturing Karen Gillan's character in her softer side during Guardians Holiday Special with seasonal charm and cybernetic details.",
    description_de: "Nebula im Weihnachtspullover (2022) aus Guardians of the Galaxy zeigt die Assassine in festlicher Weihnachtskleidung, die Karen Gillans Charakter in ihrer sanfteren Seite während des Guardians Holiday Special mit saisonalem Charme und kybernetischen Details einfängt.",
    description_fr: "Nebula en pull de Noël (2022) de Guardians of the Galaxy montre l'assassin dans une tenue de Noël festive, capturant le personnage de Karen Gillan dans son côté plus doux pendant le Guardians Holiday Special avec un charme saisonnier et des détails cybernétiques.",
    description_es: "Nebula en suéter navideño (2022) de Guardians of the Galaxy muestra a la asesina en atuendo navideño festivo, capturando el personaje de Karen Gillan en su lado más suave durante el Guardians Holiday Special con encanto estacional y detalles cibernéticos."
  },
  {
    minifigure_no: 'sh0836',
    description_en: "Teen Groot in Dark Tan with Neck Bracket (2022) from Guardians of the Galaxy features the moody adolescent tree in his video game-playing phase with neck bracket for accessory attachment and characteristic grumpy teenage attitude.",
    description_de: "Teen Groot in dunkelbraun mit Halsklammer (2022) aus Guardians of the Galaxy zeigt den launischen jugendlichen Baum in seiner Videospiel-spielenden Phase mit Halsklammer für Zubehör-Befestigung und charakteristischer mürrischer Teenager-Attitüde.",
    description_fr: "Teen Groot en brun foncé avec support de cou (2022) de Guardians of the Galaxy présente l'arbre adolescent de mauvaise humeur dans sa phase de jeux vidéo avec un support de cou pour la fixation d'accessoires et une attitude d'adolescent grognon caractéristique.",
    description_es: "Teen Groot en marrón oscuro con soporte de cuello (2022) de Guardians of the Galaxy presenta al árbol adolescente malhumorado en su fase de jugar videojuegos con soporte de cuello para sujeción de accesorios y actitud característica de adolescente gruñón."
  },
  {
    minifigure_no: 'sh0837',
    description_en: "Drax in Holiday Sweater (2022) from Guardians of the Galaxy features the Destroyer in festive Christmas attire with holiday patterns over his tattooed skin printing, capturing Dave Bautista's character celebrating with the team in seasonal style.",
    description_de: "Drax im Weihnachtspullover (2022) aus Guardians of the Galaxy zeigt den Zerstörer in festlicher Weihnachtskleidung mit Urlaubsmustern über seinem tätowierten Hautdruck, der Dave Bautistas Charakter beim Feiern mit dem Team im saisonalen Stil einfängt.",
    description_fr: "Drax en pull de Noël (2022) de Guardians of the Galaxy présente le Destructeur dans une tenue de Noël festive avec des motifs de vacances sur son impression de peau tatouée, capturant le personnage de Dave Bautista célébrant avec l'équipe dans un style saisonnier.",
    description_es: "Drax en suéter navideño (2022) de Guardians of the Galaxy presenta al Destructor en atuendo navideño festivo con patrones navideños sobre su impresión de piel tatuada, capturando al personaje de Dave Bautista celebrando con el equipo en estilo estacional."
  },
  {
    minifigure_no: 'sh0838',
    description_en: "Harley Quinn with Pigtails and Dark Azure/Dark Pink Eye Shadow (2022) features the Joker's girlfriend in her iconic jester costume with dual-colored eye makeup, capturing her chaotic personality with vibrant red and black outfit details.",
    description_de: "Harley Quinn mit Zöpfen und dunkelazur/dunkelpinkem Lidschatten (2022) zeigt Jokers Freundin in ihrem ikonischen Narren-Kostüm mit zweifarbigem Augen-Make-up, das ihre chaotische Persönlichkeit mit lebendigen rot-schwarzen Outfit-Details einfängt.",
    description_fr: "Harley Quinn avec couettes et fard à paupières azur foncé/rose foncé (2022) présente la petite amie du Joker dans son costume de bouffon iconique avec un maquillage des yeux bicolore, capturant sa personnalité chaotique avec des détails de tenue rouge et noir vibrants.",
    description_es: "Harley Quinn con coletas y sombra de ojos azul oscuro/rosa oscuro (2022) presenta a la novia del Joker en su icónico traje de bufón con maquillaje de ojos de dos colores, capturando su personalidad caótica con detalles de atuendo rojo y negro vibrantes."
  },
  {
    minifigure_no: 'sh0839',
    description_en: "Black Panther with Dark Silver and Dark Bluish Gray Armor Contours (2022) showcases T'Challa in his vibranium suit with enhanced metallic printing showing armor panel details, representing Wakanda's technological prowess with premium finish.",
    description_de: "Black Panther mit dunkelsilbernen und dunkelblaugrauen Rüstungskonturen (2022) zeigt T'Challa in seinem Vibranium-Anzug mit verbessertem metallischem Druck, der Rüstungsplatten-Details zeigt, die Wakandas technologische Leistungsfähigkeit mit Premium-Finish darstellen.",
    description_fr: "Black Panther avec contours d'armure argent foncé et gris bleu foncé (2022) présente T'Challa dans son costume de vibranium avec une impression métallique améliorée montrant les détails des panneaux d'armure, représentant la prouesse technologique du Wakanda avec une finition premium.",
    description_es: "Black Panther con contornos de armadura plateados oscuros y gris azulado oscuro (2022) muestra a T'Challa en su traje de vibranium con impresión metálica mejorada mostrando detalles de paneles de armadura, representando la destreza tecnológica de Wakanda con acabado premium."
  },
  {
    minifigure_no: 'sh0840',
    description_en: "Attuma (2022) from Wakanda Forever brings the Talokanil warrior to life with blue skin and traditional armor printing, capturing Alex Livinalli's character as Namor's fierce general with Mesoamerican-inspired battle costume details.",
    description_de: "Attuma (2022) aus Wakanda Forever erweckt den Talokanil-Krieger mit blauer Haut und traditionellem Rüstungsdruck zum Leben, der Alex Livinallis Charakter als Namors wilden General mit mesoamerikanisch inspirierten Kampfkostüm-Details einfängt.",
    description_fr: "Attuma (2022) de Wakanda Forever donne vie au guerrier Talokanil avec une peau bleue et une impression d'armure traditionnelle, capturant le personnage d'Alex Livinalli en tant que général féroce de Namor avec des détails de costume de bataille inspirés mésoaméricains.",
    description_es: "Attuma (2022) de Wakanda Forever da vida al guerrero Talokanil con piel azul e impresión de armadura tradicional, capturando el personaje de Alex Livinalli como el feroz general de Namor con detalles de traje de batalla inspirado en Mesoamérica."
  },
  {
    minifigure_no: 'sh0841',
    description_en: "King Namor (2022) from Wakanda Forever features Tenoch Huerta's Sub-Mariner with blue skin, winged ankle details, and traditional Talokan jewelry, capturing the underwater nation's ruler with Mesoamerican-inspired royal costume and aquatic powers.",
    description_de: "König Namor (2022) aus Wakanda Forever zeigt Tenoch Huertas Sub-Mariner mit blauer Haut, geflügelten Knöcheldetails und traditionellem Talokan-Schmuck, der den Herrscher der Unterwasser-Nation mit mesoamerikanisch inspiriertem königlichen Kostüm und aquatischen Kräften einfängt.",
    description_fr: "Roi Namor (2022) de Wakanda Forever présente le Sub-Mariner de Tenoch Huerta avec une peau bleue, des détails de cheville ailée et des bijoux Talokan traditionnels, capturant le dirigeant de la nation sous-marine avec un costume royal inspiré mésoaméricain et des pouvoirs aquatiques.",
    description_es: "Rey Namor (2022) de Wakanda Forever presenta al Sub-Marinero de Tenoch Huerta con piel azul, detalles de tobillo alado y joyería tradicional Talokan, capturando al gobernante de la nación submarina con traje real inspirado en Mesoamérica y poderes acuáticos."
  },
  {
    minifigure_no: 'sh0842',
    description_en: "Black Panther (Shuri) (2022) from Wakanda Forever features Letitia Wright's character inheriting the mantle with her unique purple-accented suit design, capturing Shuri's transformation from tech genius to Wakanda's new protector with detailed armor printing.",
    description_de: "Black Panther (Shuri) (2022) aus Wakanda Forever zeigt Letitia Wrights Charakter beim Erben des Mantels mit ihrem einzigartigen lila-akzentuierten Anzugdesign, der Shuris Verwandlung von Tech-Genie zu Wakandas neuer Beschützerin mit detailliertem Rüstungsdruck einfängt.",
    description_fr: "Black Panther (Shuri) (2022) de Wakanda Forever présente le personnage de Letitia Wright héritant du manteau avec son design de costume unique accentué de violet, capturant la transformation de Shuri de génie technologique en nouvelle protectrice du Wakanda avec une impression d'armure détaillée.",
    description_es: "Black Panther (Shuri) (2022) de Wakanda Forever presenta al personaje de Letitia Wright heredando el manto con su diseño único de traje acentuado en púrpura, capturando la transformación de Shuri de genio tecnológico a nueva protectora de Wakanda con impresión de armadura detallada."
  },
  {
    minifigure_no: 'sh0843',
    description_en: "Shuri in Black and Dark Purple Top (2022) from Wakanda Forever shows the princess in her lab attire with Wakandan-inspired casual clothing, capturing Letitia Wright's character as brilliant scientist and inventor before donning the Black Panther suit.",
    description_de: "Shuri in schwarzem und dunkellila Top (2022) aus Wakanda Forever zeigt die Prinzessin in ihrer Labor-Kleidung mit Wakanda-inspirierter Freizeitkleidung, die Letitia Wrights Charakter als brillante Wissenschaftlerin und Erfinderin einfängt, bevor sie den Black Panther-Anzug anzieht.",
    description_fr: "Shuri en haut noir et violet foncé (2022) de Wakanda Forever montre la princesse dans sa tenue de laboratoire avec des vêtements décontractés inspirés du Wakanda, capturant le personnage de Letitia Wright en tant que scientifique et inventeur brillant avant de revêtir le costume Black Panther.",
    description_es: "Shuri en top negro y púrpura oscuro (2022) de Wakanda Forever muestra a la princesa en su atuendo de laboratorio con ropa casual inspirada en Wakanda, capturando el personaje de Letitia Wright como científica e inventora brillante antes de ponerse el traje de Black Panther."
  },
  {
    minifigure_no: 'sh0844',
    description_en: "Nakia in Dark Green Suit (2022) from Wakanda Forever features Lupita Nyong'o's War Dog spy in her field operative attire with tactical green costume, capturing her role as Wakandan intelligence agent and T'Challa's ally with detailed printing.",
    description_de: "Nakia im dunkelgrünen Anzug (2022) aus Wakanda Forever zeigt Lupita Nyong'os War Dog-Spionin in ihrer Feldeinsatz-Kleidung mit taktischem grünem Kostüm, die ihre Rolle als Wakanda-Geheimdienstagentin und T'Challas Verbündete mit detailliertem Druck einfängt.",
    description_fr: "Nakia en costume vert foncé (2022) de Wakanda Forever présente l'espionne War Dog de Lupita Nyong'o dans sa tenue d'opérations sur le terrain avec un costume vert tactique, capturant son rôle d'agent de renseignement wakandais et alliée de T'Challa avec une impression détaillée.",
    description_es: "Nakia en traje verde oscuro (2022) de Wakanda Forever presenta a la espía War Dog de Lupita Nyong'o en su atuendo de operaciones de campo con traje verde táctico, capturando su papel como agente de inteligencia de Wakanda y aliada de T'Challa con impresión detallada."
  },
  {
    minifigure_no: 'sh0845',
    description_en: "Ironheart MK2 (2022) from Wakanda Forever showcases Riri Williams in her upgraded armor with red and gold color scheme inspired by Iron Man, featuring Dominique Thorne's character with advanced Wakandan-enhanced technology and flight capabilities.",
    description_de: "Ironheart MK2 (2022) aus Wakanda Forever zeigt Riri Williams in ihrer aufgerüsteten Rüstung mit rot-goldenem Farbschema inspiriert von Iron Man, die Dominique Thornes Charakter mit fortschrittlicher Wakanda-verstärkter Technologie und Flugfähigkeiten zeigt.",
    description_fr: "Ironheart MK2 (2022) de Wakanda Forever présente Riri Williams dans son armure améliorée avec un schéma de couleurs rouge et or inspiré d'Iron Man, présentant le personnage de Dominique Thorne avec une technologie avancée améliorée par le Wakanda et des capacités de vol.",
    description_es: "Ironheart MK2 (2022) de Wakanda Forever muestra a Riri Williams en su armadura mejorada con esquema de colores rojo y dorado inspirado en Iron Man, presentando el personaje de Dominique Thorne con tecnología avanzada mejorada por Wakanda y capacidades de vuelo."
  },
  {
    minifigure_no: 'sh0846',
    description_en: "M'Baku (2022) from Wakanda Forever features Winston Duke's Jabari Tribe leader in his ceremonial wooden armor with white fur details, capturing the mountain warrior's strength and honor with traditional Wakandan highland costume elements.",
    description_de: "M'Baku (2022) aus Wakanda Forever zeigt Winston Dukes Jabari-Stammes-Anführer in seiner zeremoniellen Holzrüstung mit weißen Pelzdetails, der die Stärke und Ehre des Bergkriegers mit traditionellen Wakanda-Hochland-Kostümelementen einfängt.",
    description_fr: "M'Baku (2022) de Wakanda Forever présente le chef de la tribu Jabari de Winston Duke dans son armure en bois cérémonielle avec des détails de fourrure blanche, capturant la force et l'honneur du guerrier de montagne avec des éléments de costume traditionnel des hautes terres wakandaises.",
    description_es: "M'Baku (2022) de Wakanda Forever presenta al líder de la tribu Jabari de Winston Duke en su armadura ceremonial de madera con detalles de piel blanca, capturando la fuerza y honor del guerrero de montaña con elementos de traje tradicional de las tierras altas de Wakanda."
  },
  {
    minifigure_no: 'sh0847',
    description_en: "Okoye in Red Top (2022) from Wakanda Forever shows Danai Gurira's Dora Milaje general in ceremonial red attire, capturing her loyalty to Wakanda with traditional warrior costume details and commanding presence as leader of the royal guard.",
    description_de: "Okoye im roten Top (2022) aus Wakanda Forever zeigt Danai Guriras Dora Milaje-General in zeremonieller roter Kleidung, die ihre Loyalität zu Wakanda mit traditionellen Krieger-Kostümdetails und gebietender Präsenz als Anführerin der königlichen Garde einfängt.",
    description_fr: "Okoye en haut rouge (2022) de Wakanda Forever montre la générale Dora Milaje de Danai Gurira dans une tenue rouge cérémonielle, capturant sa loyauté envers le Wakanda avec des détails de costume de guerrier traditionnel et une présence imposante en tant que chef de la garde royale.",
    description_es: "Okoye en top rojo (2022) de Wakanda Forever muestra a la general Dora Milaje de Danai Gurira en atuendo ceremonial rojo, capturando su lealtad a Wakanda con detalles de traje de guerrera tradicional y presencia imponente como líder de la guardia real."
  },
  {
    minifigure_no: 'sh0848',
    description_en: "Ironheart MK1 (2022) from Wakanda Forever features Riri Williams' prototype armor built in her MIT dorm with makeshift components, capturing Dominique Thorne's character as genius inventor with homemade Iron Man-inspired suit before Wakandan upgrades.",
    description_de: "Ironheart MK1 (2022) aus Wakanda Forever zeigt Riri Williams' Prototyp-Rüstung, die in ihrem MIT-Wohnheim mit behelfsmäßigen Komponenten gebaut wurde, die Dominique Thornes Charakter als geniale Erfinderin mit selbstgemachtem Iron Man-inspiriertem Anzug vor Wakanda-Upgrades einfängt.",
    description_fr: "Ironheart MK1 (2022) de Wakanda Forever présente l'armure prototype de Riri Williams construite dans son dortoir du MIT avec des composants de fortune, capturant le personnage de Dominique Thorne en tant qu'inventeur de génie avec un costume fait maison inspiré d'Iron Man avant les améliorations wakandaises.",
    description_es: "Ironheart MK1 (2022) de Wakanda Forever presenta la armadura prototipo de Riri Williams construida en su dormitorio del MIT con componentes improvisados, capturando el personaje de Dominique Thorne como inventora genio con traje casero inspirado en Iron Man antes de las mejoras de Wakanda."
  },
  {
    minifigure_no: 'sh0849',
    description_en: "Batman with Light Bluish Gray Scuba Mask (2022) features the Dark Knight in underwater diving gear with specialized mask accessory, perfect for aquatic missions, underwater Batcave scenes, and amphibious vehicle displays with tactical equipment.",
    description_de: "Batman mit hellblaugrauer Tauchermaske (2022) zeigt den Dark Knight in Unterwasser-Tauchausrüstung mit spezialisiertem Masken-Zubehör, perfekt für aquatische Missionen, Unterwasser-Batcave-Szenen und amphibische Fahrzeug-Displays mit taktischer Ausrüstung.",
    description_fr: "Batman avec masque de plongée gris bleu clair (2022) présente le Dark Knight dans un équipement de plongée sous-marine avec un accessoire de masque spécialisé, parfait pour les missions aquatiques, les scènes de Batcave sous-marine et les présentations de véhicules amphibies avec équipement tactique.",
    description_es: "Batman con máscara de buceo gris azulado claro (2022) presenta al Caballero Oscuro en equipo de buceo submarino con accesorio de máscara especializado, perfecto para misiones acuáticas, escenas de Batcave submarino y exhibiciones de vehículos anfibios con equipo táctico."
  },
  {
    minifigure_no: 'sh0850',
    description_en: "Tony Stark in Dark Bluish Gray Iron Man Suit with Dark Red Right Arm (2022) from Age of Ultron shows the billionaire mid-armor assembly with partially-equipped suit, capturing the suiting-up process with asymmetric armor attachment details.",
    description_de: "Tony Stark im dunkelblaugrauen Iron Man-Anzug mit dunkelrotem rechtem Arm (2022) aus Age of Ultron zeigt den Milliardär während der Rüstungsmontage mit teilweise ausgerüstetem Anzug, der den Anziehprozess mit asymmetrischen Rüstungsbefestigungs-Details einfängt.",
    description_fr: "Tony Stark en costume Iron Man gris bleu foncé avec bras droit rouge foncé (2022) d'Age of Ultron montre le milliardaire en plein assemblage d'armure avec un costume partiellement équipé, capturant le processus d'équipement avec des détails de fixation d'armure asymétriques.",
    description_es: "Tony Stark en traje Iron Man gris azulado oscuro con brazo derecho rojo oscuro (2022) de Age of Ultron muestra al multimillonario en medio del ensamblaje de armadura con traje parcialmente equipado, capturando el proceso de vestirse con detalles de sujeción de armadura asimétricos."
  }
];

async function main() {
  console.log(`Starting batch update: sh0826-sh0850 (${descriptions.length} minifigures)`);

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

  console.log(`\n✅ Batch complete: sh0826-sh0850`);
  await prisma.$disconnect();
}

main();
