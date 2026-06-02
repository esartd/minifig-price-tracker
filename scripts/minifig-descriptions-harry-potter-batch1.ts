import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Harry Potter minifigure descriptions - variant-specific details like Star Wars style
const batch = [
  {
    minifigure_no: 'hp005',
    name: 'Harry Potter - Gryffindor Shield Torso, Light Gray Legs, Black Cape with Stars',
    description_en: 'Harry Potter in Gryffindor uniform with house shield showed his pride in belonging to the brave house. The black cape with stars marked him as a Hogwarts student learning magic. This early variant captured Harry during his first years discovering the wizarding world. The Gryffindor shield represented courage and determination.',
    description_de: 'Harry Potter in Gryffindor-Uniform mit Hauswappen zeigte seinen Stolz, dem mutigen Haus anzugehören. Der schwarze Umhang mit Sternen kennzeichnete ihn als Hogwarts-Schüler, der Magie lernte. Diese frühe Variante erfasste Harry während seiner ersten Jahre bei der Entdeckung der Zaubererwelt. Das Gryffindor-Wappen repräsentierte Mut und Entschlossenheit.',
    description_fr: 'Harry Potter en uniforme Gryffondor avec écusson de maison montrait sa fierté d\'appartenir à la maison courageuse. La cape noire avec étoiles le marquait comme étudiant de Poudlard apprenant la magie. Cette variante précoce capturait Harry pendant ses premières années découvrant le monde sorcier. L\'écusson Gryffondor représentait courage et détermination.',
    description_es: 'Harry Potter en uniforme de Gryffindor con escudo de casa mostraba su orgullo de pertenecer a la casa valiente. La capa negra con estrellas lo marcaba como estudiante de Hogwarts aprendiendo magia. Esta variante temprana capturaba a Harry durante sus primeros años descubriendo el mundo mágico. El escudo de Gryffindor representaba coraje y determinación.'
  },
  {
    minifigure_no: 'hp019',
    name: 'Harry Potter - Dark Red Quidditch Uniform with Red Cape',
    description_en: 'Harry Potter as Gryffindor Seeker wore the dark red Quidditch uniform during matches. His natural flying talent made him the youngest Seeker in a century. The red cape billowed behind him as he chased the Golden Snitch. This variant captured Harry\'s exceptional skill on a broomstick.',
    description_de: 'Harry Potter als Gryffindor-Sucher trug die dunkelrote Quidditch-Uniform während der Spiele. Sein natürliches Flugtalent machte ihn zum jüngsten Sucher seit einem Jahrhundert. Der rote Umhang wehte hinter ihm her, während er dem Goldenen Schnatz nachjagte. Diese Variante erfasste Harrys außergewöhnliche Fertigkeit auf einem Besen.',
    description_fr: 'Harry Potter en tant qu\'Attrapeur de Gryffondor portait l\'uniforme de Quidditch rouge foncé pendant les matchs. Son talent naturel de vol fit de lui le plus jeune Attrapeur depuis un siècle. La cape rouge flottait derrière lui alors qu\'il poursuivait le Vif d\'Or. Cette variante capturait le talent exceptionnel de Harry sur un balai.',
    description_es: 'Harry Potter como Buscador de Gryffindor usaba el uniforme de Quidditch rojo oscuro durante los partidos. Su talento natural para volar lo convirtió en el Buscador más joven en un siglo. La capa roja ondeaba detrás de él mientras perseguía la Snitch Dorada. Esta variante capturaba la habilidad excepcional de Harry en una escoba.'
  },
  {
    minifigure_no: 'hp001',
    name: 'Hermione Granger - Medium Blue Torso, Blue Legs',
    description_en: 'Hermione Granger in casual blue clothing showed her practical side outside of classes. Her brilliant mind made her the brightest witch of her age. Even in simple attire, Hermione\'s determination to master every spell never wavered. This variant captured her studious nature and loyal friendship.',
    description_de: 'Hermine Granger in lässiger blauer Kleidung zeigte ihre praktische Seite außerhalb des Unterrichts. Ihr brillanter Verstand machte sie zur klügsten Hexe ihrer Generation. Selbst in einfacher Kleidung schwankte Hermines Entschlossenheit, jeden Zauber zu meistern, nie. Diese Variante erfasste ihre fleißige Natur und treue Freundschaft.',
    description_fr: 'Hermione Granger en vêtements bleus décontractés montrait son côté pratique en dehors des cours. Son esprit brillant fit d\'elle la sorcière la plus brillante de son âge. Même en tenue simple, la détermination d\'Hermione à maîtriser chaque sort ne faiblit jamais. Cette variante capturait sa nature studieuse et son amitié loyale.',
    description_es: 'Hermione Granger en ropa azul casual mostraba su lado práctico fuera de clases. Su mente brillante la convirtió en la bruja más brillante de su edad. Incluso en atuendo simple, la determinación de Hermione de dominar cada hechizo nunca flaqueó. Esta variante capturaba su naturaleza estudiosa y amistad leal.'
  },
  {
    minifigure_no: 'hp006',
    name: 'Ron Weasley - Blue Sweater',
    description_en: 'Ron Weasley in his blue sweater represented the Weasley family\'s warmth and love. His mother Molly knitted sweaters for all her children every Christmas. Despite hand-me-downs and second-hand wands, Ron\'s loyalty to Harry never faltered. This variant showed Ron\'s down-to-earth charm and brave heart.',
    description_de: 'Ron Weasley in seinem blauen Pullover repräsentierte die Wärme und Liebe der Weasley-Familie. Seine Mutter Molly strickte jeden Weihnachten Pullover für alle ihre Kinder. Trotz abgelegter Kleidung und gebrauchter Zauberstäbe schwankte Rons Loyalität zu Harry nie. Diese Variante zeigte Rons bodenständigen Charme und mutiges Herz.',
    description_fr: 'Ron Weasley dans son pull bleu représentait la chaleur et l\'amour de la famille Weasley. Sa mère Molly tricotait des pulls pour tous ses enfants chaque Noël. Malgré les vêtements d\'occasion et les baguettes d\'occasion, la loyauté de Ron envers Harry ne faiblit jamais. Cette variante montrait le charme terre-à-terre de Ron et son cœur courageux.',
    description_es: 'Ron Weasley en su suéter azul representaba la calidez y amor de la familia Weasley. Su madre Molly tejía suéteres para todos sus hijos cada Navidad. A pesar de ropa heredada y varitas de segunda mano, la lealtad de Ron hacia Harry nunca flaqueó. Esta variante mostraba el encanto realista de Ron y corazón valiente.'
  },
  {
    minifigure_no: 'hp008',
    name: 'Albus Dumbledore - Yellow Version',
    description_en: 'Albus Dumbledore the Hogwarts Headmaster possessed immense wisdom and magical power. His twinkling eyes saw through deception and recognized potential in students. Despite his strength, Dumbledore valued love and choice above all. This early yellow-skinned variant captured the greatest wizard of the age.',
    description_de: 'Albus Dumbledore der Hogwarts-Schulleiter besaß immense Weisheit und magische Kraft. Seine funkelnden Augen durchschauten Täuschung und erkannten Potenzial in Schülern. Trotz seiner Stärke schätzte Dumbledore Liebe und Wahlfreiheit über alles. Diese frühe gelbhäutige Variante erfasste den größten Zauberer der Zeit.',
    description_fr: 'Albus Dumbledore le Directeur de Poudlard possédait une sagesse immense et un pouvoir magique. Ses yeux pétillants voyaient à travers la tromperie et reconnaissaient le potentiel chez les étudiants. Malgré sa force, Dumbledore valorisait l\'amour et le choix par-dessus tout. Cette variante précoce à peau jaune capturait le plus grand sorcier de l\'époque.',
    description_es: 'Albus Dumbledore el Director de Hogwarts poseía inmensa sabiduría y poder mágico. Sus ojos centelleantes veían a través del engaño y reconocían potencial en estudiantes. A pesar de su fuerza, Dumbledore valoraba el amor y la elección sobre todo. Esta variante temprana de piel amarilla capturaba al mayor mago de la época.'
  },
  {
    minifigure_no: 'hp012',
    name: 'Professor Severus Snape - Glow in the Dark Head',
    description_en: 'Severus Snape the Potions Master concealed his true loyalties beneath a cold exterior. His glow-in-the-dark head suggested his mysterious nature and connection to dark arts. Despite appearing cruel, Snape protected Harry throughout his years at Hogwarts. This variant captured the most complex character in wizarding history.',
    description_de: 'Severus Snape der Zaubertrankmeister verbarg seine wahren Loyalitäten hinter einer kalten Fassade. Sein im Dunkeln leuchtender Kopf deutete auf seine mysteriöse Natur und Verbindung zu dunklen Künsten hin. Trotz grausamer Erscheinung schützte Snape Harry während seiner Jahre in Hogwarts. Diese Variante erfasste den komplexesten Charakter in der Zaubereigeschichte.',
    description_fr: 'Severus Rogue le Maître des Potions dissimulait ses vraies loyautés sous un extérieur froid. Sa tête phosphorescente suggérait sa nature mystérieuse et connexion aux arts sombres. Malgré son apparence cruelle, Rogue protégea Harry tout au long de ses années à Poudlard. Cette variante capturait le personnage le plus complexe de l\'histoire sorcière.',
    description_es: 'Severus Snape el Maestro de Pociones ocultaba sus verdaderas lealtades bajo un exterior frío. Su cabeza que brilla en la oscuridad sugería su naturaleza misteriosa y conexión con artes oscuras. A pesar de parecer cruel, Snape protegió a Harry durante sus años en Hogwarts. Esta variante capturaba el personaje más complejo en la historia mágica.'
  },
  {
    minifigure_no: 'hp009',
    name: 'Rubeus Hagrid - Yellow Head',
    description_en: 'Rubeus Hagrid the Keeper of Keys and Grounds at Hogwarts possessed a gentle heart despite his giant size. His love for magical creatures often led to dangerous situations. Hagrid delivered Harry\'s Hogwarts letter and introduced him to the wizarding world. This variant captured Hogwarts\' most loyal and kindhearted friend.',
    description_de: 'Rubeus Hagrid der Schlüsselbewahrer und Wildhüter von Hogwarts besaß ein sanftes Herz trotz seiner Riesengröße. Seine Liebe für magische Kreaturen führte oft zu gefährlichen Situationen. Hagrid überbrachte Harrys Hogwarts-Brief und führte ihn in die Zaubererwelt ein. Diese Variante erfasste Hogwarts\' treuesten und herzensgütesten Freund.',
    description_fr: 'Rubeus Hagrid le Garde-Chasse et Gardien des Clés de Poudlard possédait un cœur doux malgré sa taille géante. Son amour pour les créatures magiques menait souvent à des situations dangereuses. Hagrid délivra la lettre de Poudlard de Harry et l\'introduisit au monde sorcier. Cette variante capturait l\'ami le plus loyal et bon de Poudlard.',
    description_es: 'Rubeus Hagrid el Guardián de Llaves y Terrenos de Hogwarts poseía un corazón gentil a pesar de su tamaño gigante. Su amor por criaturas mágicas a menudo llevaba a situaciones peligrosas. Hagrid entregó la carta de Hogwarts de Harry y lo introdujo al mundo mágico. Esta variante capturaba al amigo más leal y bondadoso de Hogwarts.'
  },
  {
    minifigure_no: 'hp020',
    name: 'Draco Malfoy - Green Quidditch Uniform',
    description_en: 'Draco Malfoy as Slytherin Seeker wore the green Quidditch uniform with pride and arrogance. His wealthy family bought the entire Slytherin team new broomsticks to secure his position. Despite natural talent, Draco\'s rivalry with Harry often clouded his judgment. This variant captured Draco\'s competitive and privileged nature.',
    description_de: 'Draco Malfoy als Slytherin-Sucher trug die grüne Quidditch-Uniform mit Stolz und Arroganz. Seine wohlhabende Familie kaufte dem gesamten Slytherin-Team neue Besen, um seine Position zu sichern. Trotz natürlichem Talent trübte Dracos Rivalität mit Harry oft sein Urteilsvermögen. Diese Variante erfasste Dracos wettbewerbsorientierte und privilegierte Natur.',
    description_fr: 'Draco Malefoy en tant qu\'Attrapeur de Serpentard portait l\'uniforme de Quidditch vert avec fierté et arrogance. Sa famille riche acheta de nouveaux balais à toute l\'équipe de Serpentard pour sécuriser sa position. Malgré son talent naturel, la rivalité de Draco avec Harry brouillait souvent son jugement. Cette variante capturait la nature compétitive et privilégiée de Draco.',
    description_es: 'Draco Malfoy como Buscador de Slytherin usaba el uniforme de Quidditch verde con orgullo y arrogancia. Su familia adinerada compró escobas nuevas para todo el equipo de Slytherin para asegurar su posición. A pesar del talento natural, la rivalidad de Draco con Harry a menudo nublaba su juicio. Esta variante capturaba la naturaleza competitiva y privilegiada de Draco.'
  }
];

async function updateDescriptions() {
  console.log(`Starting Harry Potter minifigure description updates (Batch 1)...`);
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

  console.log(`\n✅ Harry Potter Batch 1 descriptions update complete!`);
  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
