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
    minifigure_no: 'sh0751',
    description_en: "Steve Rogers from What If...? (2021) features an alternate timeline version of Captain America's origin story, showcasing him in a unique uniform that explores parallel MCU possibilities with authentic Marvel detail.",
    description_de: "Steve Rogers aus What If...? (2021) zeigt eine alternative Zeitlinie von Captain Americas Ursprungsgeschichte mit einer einzigartigen Uniform, die parallele MCU-Möglichkeiten mit authentischem Marvel-Detail erkundet.",
    description_fr: "Steve Rogers de What If...? (2021) présente une version alternative de l'origine de Captain America, le montrant dans un uniforme unique qui explore les possibilités parallèles du MCU avec des détails Marvel authentiques.",
    description_es: "Steve Rogers de What If...? (2021) presenta una versión de línea temporal alternativa del origen de Capitán América, mostrándolo en un uniforme único que explora posibilidades paralelas del MCU con detalles Marvel auténticos."
  },
  {
    minifigure_no: 'sh0752',
    description_en: "Korg from Thor: Ragnarok (2021) captures the fan-favorite Kronan warrior's friendly personality with printed rock-like texture, featuring his gladiator appearance from the Grandmaster's arena on Sakaar.",
    description_de: "Korg aus Thor: Ragnarok (2021) fängt die freundliche Persönlichkeit des beliebten Kronan-Kriegers mit bedruckter felsartiger Textur ein und zeigt sein Gladiatoren-Erscheinungsbild aus der Arena des Grandmasters auf Sakaar.",
    description_fr: "Korg de Thor: Ragnarok (2021) capture la personnalité amicale du guerrier Kronan préféré des fans avec une texture rocheuse imprimée, présentant son apparence de gladiateur de l'arène du Grand Maître sur Sakaar.",
    description_es: "Korg de Thor: Ragnarok (2021) captura la personalidad amigable del guerrero Kronan favorito de los fans con textura rocosa impresa, presentando su apariencia de gladiador de la arena del Gran Maestro en Sakaar."
  },
  {
    minifigure_no: 'sh0753',
    description_en: "Bro Thor (Fat Thor) from Avengers: Endgame (2021) depicts Thor's post-Infinity War appearance with casual attire and disheveled look, capturing his character arc during the five-year time jump with humorous authenticity.",
    description_de: "Bro Thor (Fat Thor) aus Avengers: Endgame (2021) zeigt Thors Erscheinung nach Infinity War mit lässiger Kleidung und ungepflegtem Look, der seinen Charakterbogen während des fünfjährigen Zeitsprungs mit humorvoller Authentizität einfängt.",
    description_fr: "Bro Thor (Fat Thor) d'Avengers: Endgame (2021) représente l'apparence de Thor après Infinity War avec une tenue décontractée et un look débraillé, capturant son arc narratif pendant le saut temporel de cinq ans avec une authenticité humoristique.",
    description_es: "Bro Thor (Fat Thor) de Avengers: Endgame (2021) representa la apariencia de Thor después de Infinity War con ropa casual y aspecto desaliñado, capturando su arco narrativo durante el salto temporal de cinco años con autenticidad humorística."
  },
  {
    minifigure_no: 'sh0754',
    description_en: "Miek from Thor: Ragnarok (2021) brings the insectoid gladiator to life with specialized molded parts capturing his exoskeleton appearance, perfect for recreating Sakaar arena battles alongside Korg.",
    description_de: "Miek aus Thor: Ragnarok (2021) erweckt den insektoiden Gladiator mit speziellen geformten Teilen zum Leben, die sein Exoskelett-Erscheinungsbild einfangen, perfekt zum Nachstellen von Sakaar-Arena-Kämpfen neben Korg.",
    description_fr: "Miek de Thor: Ragnarok (2021) donne vie au gladiateur insectoïde avec des pièces moulées spécialisées capturant son apparence d'exosquelette, parfait pour recréer les batailles de l'arène de Sakaar aux côtés de Korg.",
    description_es: "Miek de Thor: Ragnarok (2021) da vida al gladiador insectoide con piezas moldeadas especializadas que capturan su apariencia de exoesqueleto, perfecto para recrear batallas de arena de Sakaar junto a Korg."
  },
  {
    minifigure_no: 'sh0755',
    description_en: "War Machine with Double Shooters (2021) features James Rhodes in his heavily-armed Iron Patriot-era armor with dual shoulder-mounted weapons, perfect for Avengers team displays and epic battle scenes.",
    description_de: "War Machine mit doppelten Schützen (2021) zeigt James Rhodes in seiner schwer bewaffneten Iron Patriot-Ära-Rüstung mit zwei schultermontierten Waffen, perfekt für Avengers-Team-Displays und epische Kampfszenen.",
    description_fr: "War Machine avec Double Shooters (2021) présente James Rhodes dans son armure de l'ère Iron Patriot lourdement armée avec deux armes montées sur les épaules, parfait pour les présentations d'équipe Avengers et les scènes de bataille épiques.",
    description_es: "War Machine con dobles disparadores (2021) presenta a James Rhodes en su armadura de la era Iron Patriot fuertemente armada con dos armas montadas en los hombros, perfecto para exhibiciones del equipo Avengers y escenas de batalla épicas."
  },
  {
    minifigure_no: 'sh0756',
    description_en: "Thor with Red Scarf (2021) shows the God of Thunder in casual Midgardian attire with his signature red scarf, capturing his relaxed appearance between heroic adventures with detailed printing.",
    description_de: "Thor mit rotem Schal (2021) zeigt den Donnergott in lässiger Midgard-Kleidung mit seinem charakteristischen roten Schal, der sein entspanntes Erscheinungsbild zwischen heroischen Abenteuern mit detailliertem Druck einfängt.",
    description_fr: "Thor avec écharpe rouge (2021) montre le Dieu du Tonnerre dans une tenue midgardienne décontractée avec son écharpe rouge signature, capturant son apparence détendue entre les aventures héroïques avec une impression détaillée.",
    description_es: "Thor con bufanda roja (2021) muestra al Dios del Trueno en atuendo midgardiano casual con su bufanda roja característica, capturando su apariencia relajada entre aventuras heroicas con impresión detallada."
  },
  {
    minifigure_no: 'sh0757',
    description_en: "Spider-Man in Bright Light Orange Letter Jacket (2021) features Peter Parker in his distinctive Midtown High varsity jacket over his Spider-suit, capturing his high school student identity with vibrant orange colors.",
    description_de: "Spider-Man in hellorangener Collegejacke (2021) zeigt Peter Parker in seiner markanten Midtown High Varsity-Jacke über seinem Spider-Anzug, der seine Highschool-Schüler-Identität mit leuchtenden orangefarbenen Farben einfängt.",
    description_fr: "Spider-Man en veste de lettres orange vif (2021) présente Peter Parker dans sa veste universitaire distinctive de Midtown High par-dessus son costume Spider, capturant son identité d'étudiant du secondaire avec des couleurs orange vives.",
    description_es: "Spider-Man en chaqueta naranja brillante (2021) presenta a Peter Parker en su distintiva chaqueta universitaria de Midtown High sobre su traje Spider, capturando su identidad de estudiante de secundaria con colores naranja vibrantes."
  },
  {
    minifigure_no: 'sh0758',
    description_en: "Nick Fury with Dark Bluish Gray Beanie (2021) shows the SHIELD director in undercover civilian attire with his tactical beanie, perfect for covert operations and espionage storylines.",
    description_de: "Nick Fury mit dunkelblaugrauer Mütze (2021) zeigt den SHIELD-Direktor in verdeckter Zivilkleidung mit seiner taktischen Mütze, perfekt für verdeckte Operationen und Spionage-Storylines.",
    description_fr: "Nick Fury avec bonnet gris bleu foncé (2021) montre le directeur du SHIELD dans une tenue civile sous couverture avec son bonnet tactique, parfait pour les opérations secrètes et les scénarios d'espionnage.",
    description_es: "Nick Fury con gorro gris azulado oscuro (2021) muestra al director de SHIELD en atuendo civil encubierto con su gorro táctico, perfecto para operaciones encubiertas e historias de espionaje."
  },
  {
    minifigure_no: 'sh0759',
    description_en: "Snowman Iron Man (2021) transforms Tony Stark's armor into a festive holiday variant with snowman-themed white and carrot nose details, perfect for Christmas-themed Marvel displays and seasonal collections.",
    description_de: "Schneemann Iron Man (2021) verwandelt Tony Starks Rüstung in eine festliche Weihnachtsvariante mit Schneemann-thematischen weißen Details und Karottennase, perfekt für weihnachtliche Marvel-Displays und saisonale Sammlungen.",
    description_fr: "Snowman Iron Man (2021) transforme l'armure de Tony Stark en une variante festive avec des détails de bonhomme de neige blanc et nez de carotte, parfait pour les présentations Marvel sur le thème de Noël et les collections saisonnières.",
    description_es: "Snowman Iron Man (2021) transforma la armadura de Tony Stark en una variante festiva con detalles de muñeco de nieve blanco y nariz de zanahoria, perfecto para exhibiciones Marvel navideñas y colecciones estacionales."
  },
  {
    minifigure_no: 'sh0760',
    description_en: "Tony Stark in Holiday Sweater (2021) shows the genius billionaire in a festive Marvel-themed Christmas sweater, capturing his personality outside the Iron Man armor with seasonal charm and detailed torso printing.",
    description_de: "Tony Stark im Weihnachtspullover (2021) zeigt den genialen Milliardär in einem festlichen Marvel-thematischen Weihnachtspullover, der seine Persönlichkeit außerhalb der Iron Man-Rüstung mit saisonalem Charme und detailliertem Torso-Druck einfängt.",
    description_fr: "Tony Stark en pull de Noël (2021) montre le milliardaire génie dans un pull de Noël festif sur le thème de Marvel, capturant sa personnalité en dehors de l'armure Iron Man avec un charme saisonnier et une impression de torse détaillée.",
    description_es: "Tony Stark en suéter navideño (2021) muestra al genio multimillonario en un suéter navideño festivo con temática Marvel, capturando su personalidad fuera de la armadura Iron Man con encanto estacional e impresión de torso detallada."
  },
  {
    minifigure_no: 'sh0761',
    description_en: "Thanos in Dark Blue and Gold Outfit (2021) depicts the Mad Titan in his iconic armor with dark blue and pearl gold details, featuring his imposing appearance with plain legs for classic Infinity Saga displays.",
    description_de: "Thanos in dunkelblauem und goldenem Outfit (2021) zeigt den Verrückten Titanen in seiner ikonischen Rüstung mit dunkelblauen und perlgoldenen Details, mit seinem imposanten Erscheinungsbild mit einfachen Beinen für klassische Infinity Saga-Displays.",
    description_fr: "Thanos en tenue bleu foncé et or (2021) représente le Titan fou dans son armure iconique avec des détails bleu foncé et or perlé, présentant son apparence imposante avec des jambes simples pour les présentations classiques de l'Infinity Saga.",
    description_es: "Thanos en atuendo azul oscuro y dorado (2021) representa al Titán Loco en su armadura icónica con detalles azul oscuro y oro perla, presentando su apariencia imponente con piernas simples para exhibiciones clásicas de la Infinity Saga."
  },
  {
    minifigure_no: 'sh0762',
    description_en: "Ajak from Eternals (2021) features the wise leader of the Eternals in her ceremonial armor with gold and white details, capturing Salma Hayek's character with regal printed costume and flowing design.",
    description_de: "Ajak aus Eternals (2021) zeigt die weise Anführerin der Eternals in ihrer zeremoniellen Rüstung mit gold-weißen Details, die Salma Hayeks Charakter mit königlichem bedrucktem Kostüm und fließendem Design einfängt.",
    description_fr: "Ajak d'Eternals (2021) présente la sage chef des Éternels dans son armure cérémonielle avec des détails dorés et blancs, capturant le personnage de Salma Hayek avec un costume imprimé royal et un design fluide.",
    description_es: "Ajak de Eternals (2021) presenta a la sabia líder de los Eternos en su armadura ceremonial con detalles dorados y blancos, capturando el personaje de Salma Hayek con un traje impreso regio y diseño fluido."
  },
  {
    minifigure_no: 'sh0763',
    description_en: "Kingo from Eternals (2021) showcases the Bollywood star Eternal in his cosmic warrior armor with purple and gold accents, capturing Kumail Nanjiani's character with energy blast powers and charismatic details.",
    description_de: "Kingo aus Eternals (2021) zeigt den Bollywood-Star-Eternal in seiner kosmischen Krieger-Rüstung mit violetten und goldenen Akzenten, der Kumail Nanjianis Charakter mit Energiestrahl-Kräften und charismatischen Details einfängt.",
    description_fr: "Kingo d'Eternals (2021) présente l'Éternel star de Bollywood dans son armure de guerrier cosmique avec des accents violets et dorés, capturant le personnage de Kumail Nanjiani avec des pouvoirs d'explosion d'énergie et des détails charismatiques.",
    description_es: "Kingo de Eternals (2021) muestra al Eterno estrella de Bollywood en su armadura de guerrero cósmico con acentos morados y dorados, capturando el personaje de Kumail Nanjiani con poderes de explosión de energía y detalles carismáticos."
  },
  {
    minifigure_no: 'sh0764',
    description_en: "Ikaris from Eternals (2021) features the powerful Eternal with flight and optic beam abilities in his blue and gold armor, capturing Richard Madden's character with Superman-like powers and heroic presence.",
    description_de: "Ikaris aus Eternals (2021) zeigt den mächtigen Eternal mit Flug- und optischen Strahlfähigkeiten in seiner blau-goldenen Rüstung, der Richard Maddens Charakter mit Superman-ähnlichen Kräften und heroischer Präsenz einfängt.",
    description_fr: "Ikaris d'Eternals (2021) présente l'Éternel puissant avec des capacités de vol et de rayon optique dans son armure bleue et dorée, capturant le personnage de Richard Madden avec des pouvoirs similaires à Superman et une présence héroïque.",
    description_es: "Ikaris de Eternals (2021) presenta al poderoso Eterno con habilidades de vuelo y rayo óptico en su armadura azul y dorada, capturando el personaje de Richard Madden con poderes similares a Superman y presencia heroica."
  },
  {
    minifigure_no: 'sh0765',
    description_en: "Sersi from Eternals (2021) depicts the matter-manipulating Eternal in her elegant green and gold costume, capturing Gemma Chan's character with graceful design and transmutation powers represented in detailed printing.",
    description_de: "Sersi aus Eternals (2021) zeigt den materiemanipulierenden Eternal in ihrem eleganten grün-goldenen Kostüm, der Gemma Chans Charakter mit grazösem Design und Transmutationskräften in detailliertem Druck darstellt.",
    description_fr: "Sersi d'Eternals (2021) représente l'Éternelle manipulatrice de matière dans son élégant costume vert et or, capturant le personnage de Gemma Chan avec un design gracieux et des pouvoirs de transmutation représentés dans une impression détaillée.",
    description_es: "Sersi de Eternals (2021) representa a la Eterna manipuladora de materia en su elegante traje verde y dorado, capturando el personaje de Gemma Chan con diseño elegante y poderes de transmutación representados en impresión detallada."
  },
  {
    minifigure_no: 'sh0767',
    description_en: "Makkari from Eternals (2021) showcases the super-speed Eternal in her red and gold speedster costume, capturing Lauren Ridloff's groundbreaking deaf superhero character with dynamic design and cosmic details.",
    description_de: "Makkari aus Eternals (2021) zeigt den Super-Geschwindigkeits-Eternal in ihrem rot-goldenen Speedster-Kostüm, der Lauren Ridloffs bahnbrechenden gehörlosen Superhelden-Charakter mit dynamischem Design und kosmischen Details einfängt.",
    description_fr: "Makkari d'Eternals (2021) présente l'Éternelle super-rapide dans son costume de speedster rouge et or, capturant le personnage révolutionnaire de super-héros sourd de Lauren Ridloff avec un design dynamique et des détails cosmiques.",
    description_es: "Makkari de Eternals (2021) muestra a la Eterna de súper velocidad en su traje de velocista rojo y dorado, capturando el personaje revolucionario de superhéroe sordo de Lauren Ridloff con diseño dinámico y detalles cósmicos."
  },
  {
    minifigure_no: 'sh0768',
    description_en: "Gilgamesh from Eternals (2021) features the strongest Eternal warrior in his armored combat suit with gold accents, capturing Don Lee's character with powerful build and exoskeleton-enhanced battle costume.",
    description_de: "Gilgamesh aus Eternals (2021) zeigt den stärksten Eternal-Krieger in seinem gepanzerten Kampfanzug mit goldenen Akzenten, der Don Lees Charakter mit kraftvollem Körperbau und exoskelett-verstärktem Kampfkostüm einfängt.",
    description_fr: "Gilgamesh d'Eternals (2021) présente le guerrier Éternel le plus fort dans son costume de combat blindé avec des accents dorés, capturant le personnage de Don Lee avec une carrure puissante et un costume de combat renforcé par exosquelette.",
    description_es: "Gilgamesh de Eternals (2021) presenta al guerrero Eterno más fuerte en su traje de combate blindado con acentos dorados, capturando el personaje de Don Lee con constitución poderosa y traje de batalla mejorado con exoesqueleto."
  },
  {
    minifigure_no: 'sh0769',
    description_en: "Sprite from Eternals (2021) depicts the illusion-casting Eternal in her youthful appearance with green and gold costume, capturing Lia McHugh's character who appears as a child but possesses ancient cosmic powers.",
    description_de: "Sprite aus Eternals (2021) zeigt den illusionserzeugenden Eternal in ihrem jugendlichen Erscheinungsbild mit grün-goldenem Kostüm, der Lia McHughs Charakter einfängt, die als Kind erscheint, aber uralte kosmische Kräfte besitzt.",
    description_fr: "Sprite d'Eternals (2021) représente l'Éternelle créatrice d'illusions dans son apparence juvénile avec un costume vert et or, capturant le personnage de Lia McHugh qui apparaît comme un enfant mais possède d'anciens pouvoirs cosmiques.",
    description_es: "Sprite de Eternals (2021) representa a la Eterna creadora de ilusiones en su apariencia juvenil con traje verde y dorado, capturando el personaje de Lia McHugh que aparece como una niña pero posee antiguos poderes cósmicos."
  },
  {
    minifigure_no: 'sh0770',
    description_en: "Phastos from Eternals (2021) features the genius inventor Eternal in his technologically-enhanced armor with blue accents, capturing Brian Tyree Henry's character as Marvel's master craftsman with cosmic technology.",
    description_de: "Phastos aus Eternals (2021) zeigt den genialen Erfinder-Eternal in seiner technologisch verbesserten Rüstung mit blauen Akzenten, der Brian Tyree Henrys Charakter als Marvels Meisterhandwerker mit kosmischer Technologie einfängt.",
    description_fr: "Phastos d'Eternals (2021) présente l'Éternel inventeur de génie dans son armure technologiquement améliorée avec des accents bleus, capturant le personnage de Brian Tyree Henry en tant que maître artisan de Marvel avec technologie cosmique.",
    description_es: "Phastos de Eternals (2021) presenta al Eterno inventor genio en su armadura tecnológicamente mejorada con acentos azules, capturando el personaje de Brian Tyree Henry como el maestro artesano de Marvel con tecnología cósmica."
  },
  {
    minifigure_no: 'sh0771',
    description_en: "Druig from Eternals (2021) showcases the mind-controlling Eternal in his dark leather jacket and gold-accented costume, capturing Barry Keoghan's morally complex character with intense expression and brooding presence.",
    description_de: "Druig aus Eternals (2021) zeigt den geisteskontrollierenden Eternal in seiner dunklen Lederjacke und gold-akzentuiertem Kostüm, der Barry Keoghans moralisch komplexen Charakter mit intensivem Ausdruck und grüblerischer Präsenz einfängt.",
    description_fr: "Druig d'Eternals (2021) présente l'Éternel contrôleur d'esprit dans sa veste en cuir sombre et son costume accentué d'or, capturant le personnage moralement complexe de Barry Keoghan avec une expression intense et une présence sombre.",
    description_es: "Druig de Eternals (2021) muestra al Eterno controlador mental en su chaqueta de cuero oscura y traje con acentos dorados, capturando el personaje moralmente complejo de Barry Keoghan con expresión intensa y presencia inquietante."
  },
  {
    minifigure_no: 'sh0772',
    description_en: "Captain Marvel with Tan Hair Swept Back (2021) features Carol Danvers in her iconic red and blue suit with blonde hair styled swept back, perfect for Infinity Saga displays and cosmic Avengers adventures.",
    description_de: "Captain Marvel mit hellbraunem zurückgekämmtem Haar (2021) zeigt Carol Danvers in ihrem ikonischen rot-blauen Anzug mit zurückgekämmtem blondem Haar, perfekt für Infinity Saga-Displays und kosmische Avengers-Abenteuer.",
    description_fr: "Captain Marvel avec cheveux châtain clair balayés en arrière (2021) présente Carol Danvers dans son costume rouge et bleu iconique avec des cheveux blonds coiffés en arrière, parfait pour les présentations Infinity Saga et les aventures cosmiques des Avengers.",
    description_es: "Captain Marvel con cabello castaño claro peinado hacia atrás (2021) presenta a Carol Danvers en su icónico traje rojo y azul con cabello rubio peinado hacia atrás, perfecto para exhibiciones de Infinity Saga y aventuras cósmicas de los Avengers."
  },
  {
    minifigure_no: 'sh0773',
    description_en: "Thanos in Pearl Gold Outfit (2021) depicts the Mad Titan in his most regal appearance with luxurious pearl gold armor and detailed printing, capturing his imposing presence as the universe's greatest threat.",
    description_de: "Thanos in perlgoldenem Outfit (2021) zeigt den Verrückten Titanen in seinem königlichsten Erscheinungsbild mit luxuriöser perlgoldener Rüstung und detailliertem Druck, der seine imposante Präsenz als größte Bedrohung des Universums einfängt.",
    description_fr: "Thanos en tenue or perlé (2021) représente le Titan fou dans son apparence la plus royale avec une armure or perlé luxueuse et une impression détaillée, capturant sa présence imposante en tant que plus grande menace de l'univers.",
    description_es: "Thanos en atuendo dorado perla (2021) representa al Titán Loco en su apariencia más regia con armadura dorada perla lujosa e impresión detallada, capturando su presencia imponente como la mayor amenaza del universo."
  },
  {
    minifigure_no: 'sh0774',
    description_en: "Spider-Man in Black and Gold Suit (2021) from No Way Home features Peter Parker's inside-out suit with striking black and gold color scheme, representing his magical protection spell with unique reversed web pattern.",
    description_de: "Spider-Man im schwarz-goldenen Anzug (2021) aus No Way Home zeigt Peter Parkers umgestülpten Anzug mit auffälligem schwarz-goldenem Farbschema, das seinen magischen Schutzzauber mit einzigartigem umgekehrtem Web-Muster darstellt.",
    description_fr: "Spider-Man en costume noir et or (2021) de No Way Home présente le costume retourné de Peter Parker avec un schéma de couleurs noir et or frappant, représentant son sort de protection magique avec un motif de toile inversé unique.",
    description_es: "Spider-Man en traje negro y dorado (2021) de No Way Home presenta el traje al revés de Peter Parker con un llamativo esquema de colores negro y dorado, representando su hechizo de protección mágica con un patrón de telaraña invertido único."
  },
  {
    minifigure_no: 'sh0775',
    description_en: "Vulture in Reddish Brown Bomber Jacket (2021) from No Way Home shows Adrian Toomes in his civilian pilot attire with aviator oxygen mask, capturing his mechanical wings engineer persona before suiting up.",
    description_de: "Vulture in rotbrauner Bomberjacke (2021) aus No Way Home zeigt Adrian Toomes in seiner zivilen Pilotenkleidung mit Flieger-Sauerstoffmaske, die seine Persona als Ingenieur mechanischer Flügel vor dem Ankleiden einfängt.",
    description_fr: "Vulture en veste de bombardier brun rougeâtre (2021) de No Way Home montre Adrian Toomes dans sa tenue de pilote civil avec masque à oxygène d'aviateur, capturant son personnage d'ingénieur des ailes mécaniques avant de s'équiper.",
    description_es: "Vulture en chaqueta de bombardero marrón rojizo (2021) de No Way Home muestra a Adrian Toomes en su atuendo de piloto civil con máscara de oxígeno de aviador, capturando su persona de ingeniero de alas mecánicas antes de ponerse el traje."
  }
];

async function main() {
  console.log(`Starting batch update: sh0751-sh0775 (${descriptions.length} minifigures)`);

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

  console.log(`\n✅ Batch complete: sh0751-sh0775`);
  await prisma.$disconnect();
}

main();
