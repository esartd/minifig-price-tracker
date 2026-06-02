import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Disney Characters minifigure descriptions - variant-specific details
const batch = [
  {
    minifigure_no: 'dis012',
    name: 'Mickey Mouse, Disney, Series 1 (Minifigure Only without Stand and Accessories)',
    description_en: 'Mickey Mouse the iconic Disney character brought joy and optimism to audiences worldwide. His cheerful personality and can-do attitude made him the face of Disney. This collectible minifigure series captured Mickey\'s classic design with rounded ears and friendly smile. Mickey represented the magic of imagination and friendship.',
    description_de: 'Mickey Maus die ikonische Disney-Figur brachte Freude und Optimismus zu Zuschauern weltweit. Seine fröhliche Persönlichkeit und Can-Do-Einstellung machten ihn zum Gesicht von Disney. Diese sammelbare Minifiguren-Serie erfasste Mickeys klassisches Design mit runden Ohren und freundlichem Lächeln. Mickey repräsentierte die Magie von Vorstellungskraft und Freundschaft.',
    description_fr: 'Mickey Mouse le personnage emblématique de Disney apportait joie et optimisme aux audiences du monde entier. Sa personnalité joyeuse et son attitude positive firent de lui le visage de Disney. Cette série de minifigurines à collectionner capturait le design classique de Mickey avec oreilles rondes et sourire amical. Mickey représentait la magie de l\'imagination et de l\'amitié.',
    description_es: 'Mickey Mouse el icónico personaje de Disney trajo alegría y optimismo a audiencias mundiales. Su personalidad alegre y actitud positiva lo convirtieron en el rostro de Disney. Esta serie de minifiguras coleccionables capturaba el diseño clásico de Mickey con orejas redondas y sonrisa amigable. Mickey representaba la magia de la imaginación y la amistad.'
  },
  {
    minifigure_no: 'dis011',
    name: 'Minnie Mouse, Disney, Series 1 (Minifigure Only without Stand and Accessories)',
    description_en: 'Minnie Mouse the stylish and sweet counterpart to Mickey charmed audiences with her kindness. Her signature polka dot bow and dress became fashion icons. Despite her gentle nature, Minnie showed strength and independence. This collectible minifigure celebrated Minnie\'s timeless elegance and warm heart.',
    description_de: 'Minnie Maus das stilvolle und süße Gegenstück zu Mickey bezauberte Zuschauer mit ihrer Freundlichkeit. Ihre charakteristische Polka-Dot-Schleife und Kleid wurden zu Mode-Ikonen. Trotz ihrer sanften Natur zeigte Minnie Stärke und Unabhängigkeit. Diese sammelbare Minifigur feierte Minnies zeitlose Eleganz und warmes Herz.',
    description_fr: 'Minnie Mouse la contrepartie élégante et douce de Mickey charmait les audiences avec sa gentillesse. Son nœud et sa robe à pois emblématiques devinrent des icônes de mode. Malgré sa nature douce, Minnie montrait force et indépendance. Cette minifigurine à collectionner célébrait l\'élégance intemporelle et le cœur chaleureux de Minnie.',
    description_es: 'Minnie Mouse la contraparte elegante y dulce de Mickey encantaba audiencias con su amabilidad. Su lazo y vestido de lunares característicos se convirtieron en íconos de moda. A pesar de su naturaleza gentil, Minnie mostraba fuerza e independencia. Esta minifigura coleccionable celebraba la elegancia atemporal y corazón cálido de Minnie.'
  },
  {
    minifigure_no: 'dis010',
    name: 'Donald Duck, Disney, Series 1 (Minifigure Only without Stand and Accessories)',
    description_en: 'Donald Duck the hot-tempered but lovable duck brought comedy through his frustrations. His distinctive voice and sailor suit made him instantly recognizable. Despite frequent bad luck, Donald\'s determination never quit. This collectible minifigure captured Donald\'s expressive personality and comic charm.',
    description_de: 'Donald Duck die temperamentvolle aber liebenswerte Ente brachte Komödie durch seine Frustrationen. Seine charakteristische Stimme und Matrosenanzug machten ihn sofort erkennbar. Trotz häufigen Pechs gab Donalds Entschlossenheit nie auf. Diese sammelbare Minifigur erfasste Donalds ausdrucksstarke Persönlichkeit und komischen Charme.',
    description_fr: 'Donald Duck le canard colérique mais attachant apportait la comédie à travers ses frustrations. Sa voix distinctive et son costume de marin le rendaient instantanément reconnaissable. Malgré sa malchance fréquente, la détermination de Donald n\'abandonnait jamais. Cette minifigurine à collectionner capturait la personnalité expressive et le charme comique de Donald.',
    description_es: 'Donald Duck el pato temperamental pero adorable traía comedia a través de sus frustraciones. Su voz distintiva y traje de marinero lo hacían instantáneamente reconocible. A pesar de la mala suerte frecuente, la determinación de Donald nunca se rendía. Esta minifigura coleccionable capturaba la personalidad expresiva y encanto cómico de Donald.'
  },
  {
    minifigure_no: 'dis009',
    name: 'Daisy Duck, Disney, Series 1 (Minifigure Only without Stand and Accessories)',
    description_en: 'Daisy Duck the sophisticated and fashionable duck matched Donald\'s energy with style. Her confident personality and love of glamour made her a Disney fashion icon. Despite Donald\'s chaos, Daisy\'s affection for him remained strong. This collectible minifigure showcased Daisy\'s elegance and spirited nature.',
    description_de: 'Daisy Duck die raffinierte und modische Ente entsprach Donalds Energie mit Stil. Ihre selbstbewusste Persönlichkeit und Liebe zum Glamour machten sie zu einer Disney-Mode-Ikone. Trotz Donalds Chaos blieb Daisys Zuneigung für ihn stark. Diese sammelbare Minifigur zeigte Daisys Eleganz und temperamentvolle Natur.',
    description_fr: 'Daisy Duck la cane sophistiquée et à la mode égalait l\'énergie de Donald avec style. Sa personnalité confiante et son amour du glamour firent d\'elle une icône de mode Disney. Malgré le chaos de Donald, l\'affection de Daisy pour lui restait forte. Cette minifigurine à collectionner présentait l\'élégance et la nature vive de Daisy.',
    description_es: 'Daisy Duck la pata sofisticada y fashionista igualaba la energía de Donald con estilo. Su personalidad confiada y amor por el glamour la convirtieron en un ícono de moda de Disney. A pesar del caos de Donald, el afecto de Daisy por él permanecía fuerte. Esta minifigura coleccionable mostraba la elegancia y naturaleza animada de Daisy.'
  },
  {
    minifigure_no: 'dis001',
    name: 'Stitch, Disney, Series 1 (Minifigure Only without Stand and Accessories)',
    description_en: 'Stitch the genetic experiment 626 was designed for destruction but found family instead. His chaotic energy and mischievous nature concealed a desire for belonging. Lilo\'s love transformed Stitch from a destructive force into a loyal ohana member. This collectible minifigure captured Stitch\'s unique blend of mayhem and heart.',
    description_de: 'Stitch das genetische Experiment 626 wurde für Zerstörung entworfen, fand aber stattdessen Familie. Seine chaotische Energie und schelmische Natur verbargen ein Verlangen nach Zugehörigkeit. Lilos Liebe verwandelte Stitch von einer destruktiven Kraft in ein treues Ohana-Mitglied. Diese sammelbare Minifigur erfasste Stitchs einzigartige Mischung aus Chaos und Herz.',
    description_fr: 'Stitch l\'expérience génétique 626 fut conçu pour la destruction mais trouva une famille à la place. Son énergie chaotique et sa nature espiègle dissimulaient un désir d\'appartenance. L\'amour de Lilo transforma Stitch d\'une force destructrice en un membre loyal de l\'ohana. Cette minifigurine à collectionner capturait le mélange unique de chaos et de cœur de Stitch.',
    description_es: 'Stitch el experimento genético 626 fue diseñado para destrucción pero encontró familia en su lugar. Su energía caótica y naturaleza traviesa ocultaban un deseo de pertenencia. El amor de Lilo transformó a Stitch de una fuerza destructiva en un miembro leal del ohana. Esta minifigura coleccionable capturaba la mezcla única de caos y corazón de Stitch.'
  },
  {
    minifigure_no: 'dis003',
    name: 'Buzz Lightyear, Disney, Series 1 (Minifigure Only without Stand and Accessories)',
    description_en: 'Buzz Lightyear the Space Ranger initially believed he was a real hero from Star Command. His confidence and catchphrase "To infinity and beyond" inspired other toys. When Buzz discovered his toy identity, he found purpose in making Andy happy. This collectible minifigure celebrated Buzz\'s heroic spirit and friendship with Woody.',
    description_de: 'Buzz Lightyear der Space Ranger glaubte anfangs, er sei ein echter Held vom Star Command. Sein Selbstvertrauen und Slogan "Bis zur Unendlichkeit und noch viel weiter" inspirierten andere Spielzeuge. Als Buzz seine Spielzeug-Identität entdeckte, fand er Sinn darin, Andy glücklich zu machen. Diese sammelbare Minifigur feierte Buzz\' heroischen Geist und Freundschaft mit Woody.',
    description_fr: 'Buzz l\'Éclair le Space Ranger croyait initialement être un vrai héros de Star Command. Sa confiance et sa phrase d\'accroche "Vers l\'infini et au-delà" inspiraient les autres jouets. Quand Buzz découvrit son identité de jouet, il trouva un but à rendre Andy heureux. Cette minifigurine à collectionner célébrait l\'esprit héroïque de Buzz et son amitié avec Woody.',
    description_es: 'Buzz Lightyear el Guardián Espacial inicialmente creía ser un héroe real de Star Command. Su confianza y lema "Hasta el infinito y más allá" inspiraban a otros juguetes. Cuando Buzz descubrió su identidad de juguete, encontró propósito en hacer feliz a Andy. Esta minifigura coleccionable celebraba el espíritu heroico de Buzz y amistad con Woody.'
  },
  {
    minifigure_no: 'dis019',
    name: 'Mickey Mouse - Black Tuxedo Jacket, Yellow Bow Tie',
    description_en: 'Mickey Mouse in formal tuxedo represented special occasions and celebrations. His black tuxedo with yellow bow tie showed Mickey\'s classic elegance. Whether hosting events or attending galas, Mickey brought charm and sophistication. This dressed-up variant captured Mickey\'s timeless style and gentleman character.',
    description_de: 'Mickey Maus im formellen Smoking repräsentierte besondere Anlässe und Feiern. Sein schwarzer Smoking mit gelber Fliege zeigte Mickeys klassische Eleganz. Ob beim Veranstalten von Events oder beim Besuch von Galas, Mickey brachte Charme und Raffinesse. Diese festlich gekleidete Variante erfasste Mickeys zeitlosen Stil und Gentleman-Charakter.',
    description_fr: 'Mickey Mouse en smoking formel représentait les occasions spéciales et célébrations. Son smoking noir avec nœud papillon jaune montrait l\'élégance classique de Mickey. Que ce soit pour organiser des événements ou assister à des galas, Mickey apportait charme et sophistication. Cette variante habillée capturait le style intemporel et le caractère gentleman de Mickey.',
    description_es: 'Mickey Mouse en esmoquin formal representaba ocasiones especiales y celebraciones. Su esmoquin negro con pajarita amarilla mostraba la elegancia clásica de Mickey. Ya fuera organizando eventos o asistiendo a galas, Mickey traía encanto y sofisticación. Esta variante vestida capturaba el estilo atemporal y carácter caballero de Mickey.'
  },
  {
    minifigure_no: 'dis020',
    name: 'Minnie Mouse - Red Polka Dot Dress',
    description_en: 'Minnie Mouse in her iconic red polka dot dress showcased her signature style. The red and white pattern became synonymous with Minnie\'s fashionable personality. Her matching bow completed the timeless look that inspired generations. This variant celebrated Minnie\'s status as a fashion icon and beloved character.',
    description_de: 'Minnie Maus in ihrem ikonischen roten Polka-Dot-Kleid zeigte ihren charakteristischen Stil. Das rot-weiße Muster wurde synonym mit Minnies modischer Persönlichkeit. Ihre passende Schleife vervollständigte den zeitlosen Look, der Generationen inspirierte. Diese Variante feierte Minnies Status als Mode-Ikone und geliebte Figur.',
    description_fr: 'Minnie Mouse dans sa robe emblématique à pois rouges présentait son style signature. Le motif rouge et blanc devint synonyme de la personnalité à la mode de Minnie. Son nœud assorti complétait le look intemporel qui inspira des générations. Cette variante célébrait le statut de Minnie comme icône de mode et personnage bien-aimé.',
    description_es: 'Minnie Mouse en su icónico vestido de lunares rojos mostraba su estilo característico. El patrón rojo y blanco se volvió sinónimo de la personalidad fashionista de Minnie. Su lazo a juego completaba el look atemporal que inspiró generaciones. Esta variante celebraba el estatus de Minnie como ícono de moda y personaje querido.'
  }
];

async function updateDescriptions() {
  console.log(`Starting Disney Characters minifigure description updates...`);
  console.log(`Total minifigures: ${batch.length}\n`);

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
      console.log(`✅ Updated ${minifig.minifigure_no} - ${minifig.name}`);
    } catch (error) {
      console.error(`❌ Error updating ${minifig.minifigure_no}:`, error);
    }
  }

  console.log(`\n✅ Disney Characters descriptions update complete!`);
  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
