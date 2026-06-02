import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// FLAGSHIP BATCH 12: Harry Potter
const batch = [
  {
    minifigure_no: 'hp009',
    name: 'Rubeus Hagrid',
    description_en: 'Rubeus Hagrid brought the gentle half-giant to LEGO form. This minifigure featured oversized body, wild hair and beard, and caring expression. The Keeper of Keys welcomed Harry to Hogwarts. This collectible from LEGO Harry Potter represented the loyal friend whose love of magical creatures and big heart made him unforgettable.',
    description_de: 'Rubeus Hagrid brachte den sanften Halbriesen in LEGO-Form. Diese Minifigur zeigte übergroßen Körper, wildes Haar und Bart und fürsorglichen Ausdruck. Der Schlüsselbewahrer begrüßte Harry in Hogwarts. Diese Sammlerfigur aus LEGO Harry Potter repräsentierte den treuen Freund dessen Liebe zu magischen Kreaturen und großes Herz ihn unvergesslich machten.',
    description_fr: 'Rubeus Hagrid apportait le doux demi-géant en forme LEGO. Cette minifigurine présentait corps surdimensionné, cheveux et barbe sauvages et expression bienveillante. Le Gardien des Clés accueillit Harry à Poudlard. Cette collection de LEGO Harry Potter représentait l\'ami loyal dont l\'amour des créatures magiques et le grand cœur le rendaient inoubliable.',
    description_es: 'Rubeus Hagrid traía al gentil semi-gigante en forma LEGO. Esta minifigura presentaba cuerpo sobredimensionado, cabello y barba salvajes y expresión cariñosa. El Guardián de las Llaves dio la bienvenida a Harry en Hogwarts. Esta colección de LEGO Harry Potter representaba al amigo leal cuyo amor por criaturas mágicas y gran corazón lo hacían inolvidable.'
  },
  {
    minifigure_no: 'hp012',
    name: 'Professor Severus Snape',
    description_en: 'Professor Severus Snape brought the complex Potions Master to LEGO form. This minifigure featured black robes, greasy hair, and stern expression. The mysterious teacher harbored deep secrets. This collectible from LEGO Harry Potter represented the misunderstood hero whose love and loyalty remained hidden until the very end.',
    description_de: 'Professor Severus Snape brachte den komplexen Tränkemeister in LEGO-Form. Diese Minifigur zeigte schwarze Roben, fettiges Haar und strengen Ausdruck. Der mysteriöse Lehrer hegte tiefe Geheimnisse. Diese Sammlerfigur aus LEGO Harry Potter repräsentierte den missverstandenen Helden dessen Liebe und Loyalität bis zum Ende verborgen blieben.',
    description_fr: 'Le Professeur Severus Rogue apportait le Maître des Potions complexe en forme LEGO. Cette minifigurine présentait robes noires, cheveux gras et expression sévère. L\'enseignant mystérieux abritait de profonds secrets. Cette collection de LEGO Harry Potter représentait le héros incompris dont l\'amour et la loyauté restèrent cachés jusqu\'à la toute fin.',
    description_es: 'El Profesor Severus Snape traía al complejo Maestro de Pociones en forma LEGO. Esta minifigura presentaba túnicas negras, cabello grasiento y expresión severa. El profesor misterioso albergaba secretos profundos. Esta colección de LEGO Harry Potter representaba al héroe incomprendido cuyo amor y lealtad permanecieron ocultos hasta el final.'
  },
  {
    minifigure_no: 'hp019',
    name: 'Harry Potter - Dark Red Quidditch',
    description_en: 'Harry Potter in dark red Quidditch robes brought the youngest Seeker to LEGO form. This minifigure featured Gryffindor team colors and athletic gear. The talented player caught the Golden Snitch. This collectible from LEGO Harry Potter represented Harry\'s sporting prowess and natural ability that made him a legend on the Quidditch pitch.',
    description_de: 'Harry Potter in dunkelroten Quidditch-Roben brachte den jüngsten Sucher in LEGO-Form. Diese Minifigur zeigte Gryffindor-Team-Farben und sportliche Ausrüstung. Der talentierte Spieler fing den Goldenen Schnatz. Diese Sammlerfigur aus LEGO Harry Potter repräsentierte Harrys sportliche Fähigkeiten und natürliche Begabung, die ihn zur Legende auf dem Quidditch-Feld machten.',
    description_fr: 'Harry Potter en robes Quidditch rouge foncé apportait le plus jeune Attrapeur en forme LEGO. Cette minifigurine présentait couleurs d\'équipe Gryffondor et équipement athlétique. Le joueur talentueux attrapa le Vif d\'Or. Cette collection de LEGO Harry Potter représentait les prouesses sportives et capacités naturelles de Harry qui firent de lui une légende sur le terrain de Quidditch.',
    description_es: 'Harry Potter con túnicas de Quidditch rojo oscuro traía al Buscador más joven en forma LEGO. Esta minifigura presentaba colores de equipo de Gryffindor y equipo atlético. El jugador talentoso atrapó la Snitch Dorada. Esta colección de LEGO Harry Potter representaba la destreza deportiva y habilidad natural de Harry que lo convirtieron en leyenda en el campo de Quidditch.'
  },
  {
    minifigure_no: 'hp020',
    name: 'Draco Malfoy - Green Quidditch',
    description_en: 'Draco Malfoy in green Quidditch robes brought Harry\'s rival to LEGO form. This minifigure featured Slytherin team colors and sneering expression. The spoiled Seeker played dirty to win. This collectible from LEGO Harry Potter represented the antagonist whose family wealth and pure-blood pride fueled constant conflict with Harry.',
    description_de: 'Draco Malfoy in grünen Quidditch-Roben brachte Harrys Rivalen in LEGO-Form. Diese Minifigur zeigte Slytherin-Team-Farben und höhnischen Ausdruck. Der verwöhnte Sucher spielte schmutzig um zu gewinnen. Diese Sammlerfigur aus LEGO Harry Potter repräsentierte den Antagonisten dessen Familien-Reichtum und Reinblut-Stolz ständigen Konflikt mit Harry befeuerten.',
    description_fr: 'Draco Malefoy en robes Quidditch vertes apportait le rival de Harry en forme LEGO. Cette minifigurine présentait couleurs d\'équipe Serpentard et expression moqueuse. L\'Attrapeur gâté jouait sale pour gagner. Cette collection de LEGO Harry Potter représentait l\'antagoniste dont la richesse familiale et la fierté de sang-pur alimentaient un conflit constant avec Harry.',
    description_es: 'Draco Malfoy con túnicas de Quidditch verdes traía al rival de Harry en forma LEGO. Esta minifigura presentaba colores de equipo de Slytherin y expresión burlona. El Buscador mimado jugaba sucio para ganar. Esta colección de LEGO Harry Potter representaba al antagonista cuya riqueza familiar y orgullo de sangre pura alimentaban conflicto constante con Harry.'
  },
];

async function updateDescriptions() {
  console.log(`\n🎯 BATCH 12: Harry Potter (4 minifigs)\n`);
  let updated = 0;
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
      console.log(`✅ ${minifig.minifigure_no}`);
    } catch (error: any) {
      console.error(`❌ ${minifig.minifigure_no}:`, error.message);
    }
  }
  console.log(`\n✅ Updated: ${updated}`);
  await prisma.$disconnect();
}

updateDescriptions().catch(console.error);
