import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// FLAGSHIP BATCH 1: Marvel Characters (from actual BrickLink IDs in database)
const batch = [
  {
    minifigure_no: 'spd001',
    name: 'Spider-Man 1 - Blue Arms and Legs, Silver Webbing',
    description_en: 'Spider-Man the web-slinging hero protected New York City with extraordinary powers. This early LEGO minifigure featured iconic blue arms and legs with detailed silver webbing patterns. Peter Parker\'s alter ego became one of Marvel\'s most beloved characters. This collectible minifigure captured the classic Spider-Man design from the first LEGO Spider-Man sets, representing the beginning of Marvel superheroes in LEGO form.',
    description_de: 'Spider-Man der netzschwingende Held beschützte New York City mit außergewöhnlichen Kräften. Diese frühe LEGO-Minifigur zeigte ikonische blaue Arme und Beine mit detaillierten silbernen Netz-Mustern. Peter Parkers Alter Ego wurde eine der beliebtesten Marvel-Figuren. Diese Sammlerfigur erfasste das klassische Spider-Man-Design aus den ersten LEGO Spider-Man Sets und repräsentierte den Beginn der Marvel-Superhelden in LEGO-Form.',
    description_fr: 'Spider-Man le héros lanceur de toiles protégeait New York City avec des pouvoirs extraordinaires. Cette première minifigurine LEGO présentait des bras et jambes bleus iconiques avec des motifs de toiles argentées détaillés. L\'alter ego de Peter Parker devint l\'un des personnages Marvel les plus aimés. Cette minifigurine de collection capturait le design classique de Spider-Man des premiers sets LEGO Spider-Man, représentant le début des super-héros Marvel en forme LEGO.',
    description_es: 'Spider-Man el héroe lanzador de telarañas protegía New York City con poderes extraordinarios. Esta temprana minifigura LEGO presentaba icónicos brazos y piernas azules con detallados patrones de telaraña plateada. El alter ego de Peter Parker se convirtió en uno de los personajes Marvel más queridos. Esta minifigura coleccionable capturaba el diseño clásico de Spider-Man de los primeros sets LEGO Spider-Man, representando el comienzo de superhéroes Marvel en forma LEGO.'
  },
  {
    minifigure_no: 'sh0015',
    name: 'Iron Man - Mark 6 Armor, Small Helmet Visor, Foot Repulsors',
    description_en: 'Iron Man in Mark 6 armor represented Tony Stark\'s advanced combat suit technology. This LEGO minifigure featured detailed chest arc reactor printing and distinctive small helmet visor design. The suit\'s foot repulsors enabled iconic flight capabilities. This collectible captured Iron Man during The Avengers era, showcasing the red and gold armor that made him a technological marvel among superheroes.',
    description_de: 'Iron Man in Mark 6 Rüstung repräsentierte Tony Starks fortschrittliche Kampfanzug-Technologie. Diese LEGO-Minifigur zeigte detaillierten Brust-Arc-Reaktor-Druck und charakteristisches kleines Helmvisier-Design. Die Fuß-Repulsoren des Anzugs ermöglichten ikonische Flugfähigkeiten. Diese Sammlerfigur erfasste Iron Man während der Avengers-Ära und zeigte die rot-goldene Rüstung, die ihn zu einem technologischen Wunder unter Superhelden machte.',
    description_fr: 'Iron Man en armure Mark 6 représentait la technologie de combinaison de combat avancée de Tony Stark. Cette minifigurine LEGO présentait une impression détaillée de réacteur arc de poitrine et un design distinctif de petite visière de casque. Les répulseurs de pied du costume permettaient des capacités de vol iconiques. Cette collection capturait Iron Man pendant l\'ère des Avengers, montrant l\'armure rouge et or qui en fit une merveille technologique parmi les super-héros.',
    description_es: 'Iron Man en armadura Mark 6 representaba la tecnología de traje de combate avanzado de Tony Stark. Esta minifigura LEGO presentaba impresión detallada de reactor arc de pecho y diseño distintivo de visera de casco pequeña. Los repulsores de pie del traje permitían capacidades de vuelo icónicas. Esta colección capturaba a Iron Man durante la era de Los Vengadores, mostrando la armadura roja y dorada que lo convirtió en una maravilla tecnológica entre superhéroes.'
  },
  {
    minifigure_no: 'sh0014',
    name: 'Captain America - Dark Blue Suit with Dark Blue Belt, Dark Red Hands, Mask',
    description_en: 'Captain America the First Avenger led with courage and super-soldier strength. This LEGO minifigure featured the classic dark blue suit with white star chest emblem and distinctive dark blue belt. Steve Rogers\' mask and dark red hands completed the patriotic hero design. This collectible represented the iconic Captain America from The Avengers, embodying honor, justice, and unwavering determination.',
    description_de: 'Captain America der Erste Avenger führte mit Mut und Super-Soldaten-Stärke. Diese LEGO-Minifigur zeigte den klassischen dunkelblauen Anzug mit weißem Stern-Brust-Emblem und charakteristischem dunkelblauen Gürtel. Steve Rogers\' Maske und dunkelrote Hände vervollständigten das patriotische Helden-Design. Diese Sammlerfigur repräsentierte den ikonischen Captain America aus den Avengers und verkörperte Ehre, Gerechtigkeit und unerschütterliche Entschlossenheit.',
    description_fr: 'Captain America le Premier Avenger menait avec courage et force de super-soldat. Cette minifigurine LEGO présentait le costume bleu foncé classique avec emblème d\'étoile blanche sur la poitrine et ceinture bleu foncé distinctive. Le masque de Steve Rogers et les mains rouge foncé complétaient le design de héros patriotique. Cette collection représentait l\'emblématique Captain America des Avengers, incarnant honneur, justice et détermination inébranlable.',
    description_es: 'Captain America el Primer Vengador lideraba con coraje y fuerza de super-soldado. Esta minifigura LEGO presentaba el clásico traje azul oscuro con emblema de estrella blanca en el pecho y distintivo cinturón azul oscuro. La máscara de Steve Rogers y las manos rojo oscuro completaban el diseño de héroe patriótico. Esta colección representaba al icónico Captain America de Los Vengadores, encarnando honor, justicia y determinación inquebrantable.'
  },
  {
    minifigure_no: 'sh0018',
    name: 'Thor - Starched Fabric Cape, Dark Blue Legs',
    description_en: 'Thor the God of Thunder wielded Mjolnir with divine Asgardian power. This LEGO minifigure featured detailed silver armor chest printing and iconic starched red fabric cape. The dark blue legs and blonde hair completed the Norse god warrior design. This collectible captured Thor from The Avengers, representing the mighty protector of both Asgard and Earth.',
    description_de: 'Thor der Gott des Donners schwang Mjolnir mit göttlicher Asgard-Macht. Diese LEGO-Minifigur zeigte detaillierten silbernen Rüstungs-Brust-Druck und ikonischen gestärkten roten Stoff-Umhang. Die dunkelblauen Beine und blonden Haare vervollständigten das nordische Gott-Krieger-Design. Diese Sammlerfigur erfasste Thor aus den Avengers und repräsentierte den mächtigen Beschützer von Asgard und Erde.',
    description_fr: 'Thor le Dieu du Tonnerre maniait Mjolnir avec pouvoir divin asgardien. Cette minifigurine LEGO présentait une impression détaillée d\'armure argentée sur la poitrine et une cape en tissu rouge amidonnée emblématique. Les jambes bleu foncé et les cheveux blonds complétaient le design de guerrier dieu nordique. Cette collection capturait Thor des Avengers, représentant le puissant protecteur d\'Asgard et de la Terre.',
    description_es: 'Thor el Dios del Trueno empuñaba Mjolnir con poder divino asgardiano. Esta minifigura LEGO presentaba impresión detallada de armadura plateada en el pecho y icónica capa de tela roja almidonada. Las piernas azul oscuro y el cabello rubio completaban el diseño de guerrero dios nórdico. Esta colección capturaba a Thor de Los Vengadores, representando al poderoso protector tanto de Asgard como de la Tierra.'
  },
  {
    minifigure_no: 'sh0013',
    name: 'Hulk - Giant, Dark Tan Pants',
    description_en: 'Hulk the incredible green giant embodied Bruce Banner\'s uncontrollable rage and strength. This large-scale LEGO figure featured massive build with detailed muscle printing and dark tan tattered pants. The Hulk\'s enormous size and power made him the strongest Avenger. This collectible represented the smashing green behemoth from The Avengers, capturing raw unstoppable force.',
    description_de: 'Hulk der unglaubliche grüne Riese verkörperte Bruce Banners unkontrollierbare Wut und Stärke. Diese großformatige LEGO-Figur zeigte massiven Körperbau mit detailliertem Muskel-Druck und dunkel-bräunlichen zerrissenen Hosen. Hulks enorme Größe und Kraft machten ihn zum stärksten Avenger. Diese Sammlerfigur repräsentierte den zerschmetternden grünen Koloss aus den Avengers und erfasste rohe unaufhaltsame Kraft.',
    description_fr: 'Hulk le géant vert incroyable incarnait la rage et la force incontrôlables de Bruce Banner. Cette figurine LEGO à grande échelle présentait une construction massive avec impression musculaire détaillée et pantalon brun foncé en lambeaux. La taille et la puissance énormes de Hulk en faisaient l\'Avenger le plus fort. Cette collection représentait le béhémoth vert fracassant des Avengers, capturant une force brute imparable.',
    description_es: 'Hulk el increíble gigante verde encarnaba la ira y fuerza incontrolables de Bruce Banner. Esta figura LEGO de gran escala presentaba construcción masiva con impresión muscular detallada y pantalones bronceados oscuros andrajosos. El tamaño y poder enormes de Hulk lo convertían en el Vengador más fuerte. Esta colección representaba al behemoth verde aplastante de Los Vengadores, capturando fuerza bruta imparable.'
  },
  {
    minifigure_no: 'sh0035',
    name: 'Black Widow - Black Jumpsuit, Dark Orange Mid-Length Hair, Printed Legs, Black Hands, Dark Orange Eyebrows',
    description_en: 'Black Widow the master spy and assassin brought lethal skills to the Avengers. This LEGO minifigure featured sleek black jumpsuit with detailed torso and leg printing, dark orange mid-length hair, and matching eyebrows. Natasha Romanoff\'s combat expertise and intelligence made her invaluable. This collectible captured Black Widow from The Avengers, representing the deadly agent who fought alongside Earth\'s mightiest heroes.',
    description_de: 'Black Widow die Meisterspionin und Attentäterin brachte tödliche Fähigkeiten zu den Avengers. Diese LEGO-Minifigur zeigte schlanken schwarzen Jumpsuit mit detailliertem Torso- und Bein-Druck, dunkel-oranges mittellanges Haar und passende Augenbrauen. Natasha Romanoffs Kampfexpertise und Intelligenz machten sie unersetzlich. Diese Sammlerfigur erfasste Black Widow aus den Avengers und repräsentierte die tödliche Agentin, die an der Seite der mächtigsten Helden der Erde kämpfte.',
    description_fr: 'Black Widow la maître espionne et assassin apportait des compétences létales aux Avengers. Cette minifigurine LEGO présentait une combinaison noire élégante avec impression détaillée du torse et des jambes, des cheveux orange foncé mi-longs et des sourcils assortis. L\'expertise au combat et l\'intelligence de Natasha Romanoff la rendaient inestimable. Cette collection capturait Black Widow des Avengers, représentant l\'agent mortel qui combattait aux côtés des héros les plus puissants de la Terre.',
    description_es: 'Black Widow la maestra espía y asesina aportaba habilidades letales a Los Vengadores. Esta minifigura LEGO presentaba elegante mono negro con impresión detallada de torso y piernas, cabello naranja oscuro de longitud media y cejas a juego. La experiencia en combate e inteligencia de Natasha Romanoff la hacían invaluable. Esta colección capturaba a Black Widow de Los Vengadores, representando a la agente mortal que luchaba junto a los héroes más poderosos de la Tierra.'
  },
  {
    minifigure_no: 'sh0034',
    name: 'Hawkeye - Black and Dark Red Suit, Medium Nougat Hair',
    description_en: 'Hawkeye the master archer never missed his target with exceptional accuracy. This LEGO minifigure featured black and dark red tactical suit with detailed chest printing and medium nougat hair. Clint Barton\'s bow and arrow skills made him essential to the Avengers despite having no superpowers. This collectible represented Hawkeye from The Avengers, capturing the sharpshooter hero who proved human skill could match superhuman abilities.',
    description_de: 'Hawkeye der Meisterbogenschütze verfehlte niemals sein Ziel mit außergewöhnlicher Genauigkeit. Diese LEGO-Minifigur zeigte schwarzen und dunkelroten taktischen Anzug mit detailliertem Brust-Druck und medium-nougat-farbenem Haar. Clint Bartons Bogen- und Pfeil-Fähigkeiten machten ihn für die Avengers unverzichtbar, trotz fehlender Superkräfte. Diese Sammlerfigur repräsentierte Hawkeye aus den Avengers und erfasste den Scharfschützen-Helden, der bewies, dass menschliche Fähigkeiten mit übermenschlichen Kräften mithalten können.',
    description_fr: 'Hawkeye le maître archer ne manquait jamais sa cible avec une précision exceptionnelle. Cette minifigurine LEGO présentait une combinaison tactique noire et rouge foncé avec impression détaillée sur la poitrine et des cheveux nougat moyen. Les compétences à l\'arc et à la flèche de Clint Barton le rendaient essentiel aux Avengers malgré l\'absence de super-pouvoirs. Cette collection représentait Hawkeye des Avengers, capturant le héros tireur d\'élite qui prouvait que la compétence humaine pouvait égaler les capacités surhumaines.',
    description_es: 'Hawkeye el maestro arquero nunca fallaba su objetivo con excepcional precisión. Esta minifigura LEGO presentaba traje táctico negro y rojo oscuro con impresión detallada en el pecho y cabello nougat medio. Las habilidades de arco y flecha de Clint Barton lo hacían esencial para Los Vengadores a pesar de no tener superpoderes. Esta colección representaba a Hawkeye de Los Vengadores, capturando al héroe tirador de élite que demostró que la habilidad humana podía igualar capacidades sobrehumanas.'
  },
  {
    minifigure_no: 'sh0038',
    name: 'Spider-Man - Black Web Pattern',
    description_en: 'Spider-Man in his classic costume featured the iconic black web pattern design. This LEGO minifigure showcased detailed web printing across the red suit with blue accents. Peter Parker\'s agility, wall-crawling, and spider-sense made him a beloved hero. This collectible from Ultimate Spider-Man represented the friendly neighborhood web-slinger protecting New York City from threats both small and universe-threatening.',
    description_de: 'Spider-Man in seinem klassischen Kostüm zeigte das ikonische schwarze Netz-Muster-Design. Diese LEGO-Minifigur präsentierte detaillierten Netz-Druck über den roten Anzug mit blauen Akzenten. Peter Parkers Agilität, Wand-Klettern und Spinnen-Sinn machten ihn zu einem geliebten Helden. Diese Sammlerfigur aus Ultimate Spider-Man repräsentierte den freundlichen Nachbarschafts-Netzschleuderer, der New York City vor kleinen und universumsbedrohenden Gefahren beschützt.',
    description_fr: 'Spider-Man dans son costume classique présentait le design emblématique de motif de toile noire. Cette minifigurine LEGO montrait une impression de toile détaillée sur la combinaison rouge avec des accents bleus. L\'agilité, l\'escalade de murs et le sens d\'araignée de Peter Parker en faisaient un héros adoré. Cette collection d\'Ultimate Spider-Man représentait le lanceur de toiles du quartier amical protégeant New York City contre des menaces petites et menaçant l\'univers.',
    description_es: 'Spider-Man en su traje clásico presentaba el icónico diseño de patrón de telaraña negra. Esta minifigura LEGO mostraba impresión de telaraña detallada sobre el traje rojo con acentos azules. La agilidad, escalada de paredes y sentido arácnido de Peter Parker lo convirtieron en un héroe querido. Esta colección de Ultimate Spider-Man representaba al amigable vecino lanzador de telarañas protegiendo New York City de amenazas tanto pequeñas como que amenazaban el universo.'
  },
];

async function updateDescriptions() {
  console.log(`\n🎯 Updating FLAGSHIP BATCH 1: Marvel Characters (8 minifigs)\n`);

  let updated = 0;
  let errors = 0;

  for (const minifig of batch) {
    try {
      await prisma.minifigCatalog.update({
        where: { minifigure_no: minifig.minifigure_no },
        data: {
          description_en: minifig.description_en,
          description_de: minifig.description_de,
          description_fr: minifig.description_fr,
          description_es: minifig.description_es,
        },
      });
      updated++;
      console.log(`✅ ${minifig.minifigure_no} - ${minifig.name}`);
    } catch (error: any) {
      errors++;
      console.error(`❌ ${minifig.minifigure_no}:`, error.message);
    }
  }

  console.log(`\n✅ Flagship Batch 1 complete!`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Errors: ${errors}`);

  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
