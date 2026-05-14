import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Batman/DC minifigure descriptions - Batch 1: Batman variants and core villains
const batch = [
  {
    minifigure_no: 'sh0016',
    name: 'Batman - Black Suit with Yellow Belt and Crest',
    description_en: 'Batman in classic black suit represented Bruce Wayne as Gotham\'s dark knight protector. The yellow utility belt and bat crest on his chest became iconic symbols. Despite tragic origins, Bruce channeled grief into justice. This variant captured Batman\'s timeless design as the world\'s greatest detective.',
    description_de: 'Batman im klassischen schwarzen Anzug repräsentierte Bruce Wayne als Gothams dunklen Ritter-Beschützer. Der gelbe Allzweckgürtel und Fledermaus-Wappen auf seiner Brust wurden zu ikonischen Symbolen. Trotz tragischer Ursprünge kanalisierte Bruce Trauer in Gerechtigkeit. Diese Variante erfasste Batmans zeitloses Design als weltbester Detektiv.',
    description_fr: 'Batman dans le costume noir classique représentait Bruce Wayne comme le protecteur chevalier noir de Gotham. La ceinture utilitaire jaune et l\'emblème de chauve-souris sur sa poitrine devinrent des symboles emblématiques. Malgré des origines tragiques, Bruce canalisa le chagrin en justice. Cette variante capturait le design intemporel de Batman comme le plus grand détective du monde.',
    description_es: 'Batman en traje negro clásico representaba a Bruce Wayne como el protector caballero oscuro de Gotham. El cinturón utilitario amarillo y emblema de murciélago en su pecho se convirtieron en símbolos icónicos. A pesar de orígenes trágicos, Bruce canalizó el dolor en justicia. Esta variante capturaba el diseño atemporal de Batman como el mejor detective del mundo.'
  },
  {
    minifigure_no: 'sh0068',
    name: 'Batman - Dark Bluish Gray Suit, All Black Head',
    description_en: 'Batman in dark bluish gray suit showcased a modern tactical approach. The all-black head emphasized Batman\'s intimidating presence in shadows. Bruce\'s strategic mind and combat training made him formidable without superpowers. This variant captured Batman as the calculating vigilante protecting Gotham through fear.',
    description_de: 'Batman im dunkel bläulich-grauen Anzug zeigte einen modernen taktischen Ansatz. Der ganz schwarze Kopf betonte Batmans einschüchternde Präsenz in Schatten. Bruces strategischer Verstand und Kampftraining machten ihn beeindruckend ohne Superkräfte. Diese Variante erfasste Batman als kalkulierenden Vigilanten, der Gotham durch Furcht schützte.',
    description_fr: 'Batman dans le costume gris bleuté foncé présentait une approche tactique moderne. La tête entièrement noire soulignait la présence intimidante de Batman dans les ombres. L\'esprit stratégique et l\'entraînement au combat de Bruce le rendaient redoutable sans superpouvoirs. Cette variante capturait Batman comme le justicier calculateur protégeant Gotham par la peur.',
    description_es: 'Batman en traje gris azulado oscuro mostraba un enfoque táctico moderno. La cabeza totalmente negra enfatizaba la presencia intimidante de Batman en las sombras. La mente estratégica y entrenamiento de combate de Bruce lo hacían formidable sin superpoderes. Esta variante capturaba a Batman como el vigilante calculador protegiendo Gotham a través del miedo.'
  },
  {
    minifigure_no: 'sh0251',
    name: 'Batman - Armored, Heavy Suit, Batfleck',
    description_en: 'Batman in heavy armored suit prepared for brutal combat against Superman. The reinforced armor represented Bruce\'s tactical planning and resourcefulness. Despite Superman\'s godlike power, Batman\'s determination and technology made the fight possible. This variant captured the Dark Knight\'s most heavily armored appearance.',
    description_de: 'Batman in schwerer gepanzerter Rüstung bereitete sich auf brutalen Kampf gegen Superman vor. Die verstärkte Rüstung repräsentierte Bruces taktische Planung und Einfallsreichtum. Trotz Supermans gottgleicher Kraft machten Batmans Entschlossenheit und Technologie den Kampf möglich. Diese Variante erfasste das am stärksten gepanzerte Erscheinungsbild des Dunklen Ritters.',
    description_fr: 'Batman dans l\'armure lourde se préparait au combat brutal contre Superman. L\'armure renforcée représentait la planification tactique et l\'ingéniosité de Bruce. Malgré le pouvoir divin de Superman, la détermination et la technologie de Batman rendirent le combat possible. Cette variante capturait l\'apparence la plus blindée du Chevalier Noir.',
    description_es: 'Batman en traje blindado pesado se preparaba para combate brutal contra Superman. La armadura reforzada representaba la planificación táctica e ingenio de Bruce. A pesar del poder divino de Superman, la determinación y tecnología de Batman hicieron posible la pelea. Esta variante capturaba la apariencia más blindada del Caballero Oscuro.'
  },
  {
    minifigure_no: 'sh0017',
    name: 'The Joker - Purple Suit, Green Hair',
    description_en: 'The Joker embodied chaos as Batman\'s greatest nemesis. His purple suit and green hair created a clownish yet terrifying appearance. The Joker\'s unpredictable madness challenged Batman\'s quest for order. This variant captured Gotham\'s Clown Prince of Crime in his most iconic look.',
    description_de: 'Der Joker verkörperte Chaos als Batmans größter Erzfeind. Sein lila Anzug und grüne Haare schufen ein clowneskes aber schreckliches Erscheinungsbild. Jokers unberechenbare Verrücktheit forderte Batmans Streben nach Ordnung heraus. Diese Variante erfasste Gothams Clown-Prinzen des Verbrechens in seinem ikonischsten Look.',
    description_fr: 'Le Joker incarnait le chaos comme le plus grand ennemi juré de Batman. Son costume violet et cheveux verts créaient une apparence clownesque mais terrifiante. La folie imprévisible du Joker défiait la quête d\'ordre de Batman. Cette variante capturait le Prince Clown du Crime de Gotham dans son look le plus emblématique.',
    description_es: 'El Joker encarnaba el caos como el mayor némesis de Batman. Su traje púrpura y cabello verde creaban una apariencia payasesca pero aterradora. La locura impredecible del Joker desafiaba la búsqueda de orden de Batman. Esta variante capturaba al Príncipe Payaso del Crimen de Gotham en su look más icónico.'
  },
  {
    minifigure_no: 'sh0093',
    name: 'The Joker - Wide Grin, Striped Vest',
    description_en: 'The Joker with wide grin and striped vest represented his theatrical criminal style. His maniacal smile concealed brilliant but twisted intelligence. Every scheme aimed to prove that anyone could become him with one bad day. This variant captured The Joker\'s performance art approach to villainy.',
    description_de: 'Der Joker mit breitem Grinsen und gestreifter Weste repräsentierte seinen theatralischen kriminellen Stil. Sein wahnsinniges Lächeln verbarg brillante aber verdrehte Intelligenz. Jedes Schema zielte darauf ab zu beweisen, dass jeder mit einem schlechten Tag zu ihm werden konnte. Diese Variante erfasste Jokers Performance-Art-Ansatz zur Bösewichtigkeit.',
    description_fr: 'Le Joker avec large sourire et gilet rayé représentait son style criminel théâtral. Son sourire maniaque dissimulait une intelligence brillante mais tordue. Chaque plan visait à prouver que quiconque pouvait devenir lui après un mauvais jour. Cette variante capturait l\'approche d\'art performatif du Joker à la vilenie.',
    description_es: 'El Joker con sonrisa amplia y chaleco a rayas representaba su estilo criminal teatral. Su sonrisa maníaca ocultaba inteligencia brillante pero retorcida. Cada plan apuntaba a probar que cualquiera podía convertirse en él con un mal día. Esta variante capturaba el enfoque de arte performático del Joker hacia la villanía.'
  },
  {
    minifigure_no: 'sh0127',
    name: 'Harley Quinn - Classic Red and Black Jumpsuit, Pigtails',
    description_en: 'Harley Quinn escaped the Joker\'s control to become her own chaotic anti-hero. Her red and black jumpsuit with blonde pigtails became her signature look. Despite abuse from Joker, Harley found strength in independence. This variant captured Harley during her transformation from sidekick to free agent.',
    description_de: 'Harley Quinn entkam Jokers Kontrolle, um ihre eigene chaotische Anti-Heldin zu werden. Ihr rot-schwarzer Overall mit blonden Zöpfen wurde ihr charakteristischer Look. Trotz Missbrauchs durch Joker fand Harley Stärke in Unabhängigkeit. Diese Variante erfasste Harley während ihrer Transformation vom Sidekick zur freien Agentin.',
    description_fr: 'Harley Quinn échappa au contrôle du Joker pour devenir sa propre anti-héroïne chaotique. Sa combinaison rouge et noire avec couettes blondes devint son look signature. Malgré les abus du Joker, Harley trouva force dans l\'indépendance. Cette variante capturait Harley pendant sa transformation d\'acolyte à agent libre.',
    description_es: 'Harley Quinn escapó del control del Joker para convertirse en su propia anti-heroína caótica. Su mono rojo y negro con coletas rubias se convirtió en su look característico. A pesar del abuso del Joker, Harley encontró fuerza en la independencia. Esta variante capturaba a Harley durante su transformación de compinche a agente libre.'
  },
  {
    minifigure_no: 'sh0044',
    name: 'Robin - Tim Drake, Red Torso with Black Arms',
    description_en: 'Robin represented Tim Drake as Batman\'s brilliant detective protégé. His red torso with black arms showed the traditional Robin colors. Tim deduced Batman\'s identity through intellect alone. This variant captured Robin as the Boy Wonder who chose to be a hero.',
    description_de: 'Robin repräsentierte Tim Drake als Batmans brillanten Detektiv-Schützling. Sein roter Torso mit schwarzen Armen zeigte die traditionellen Robin-Farben. Tim deduzierte Batmans Identität durch Intellekt allein. Diese Variante erfasste Robin als den Boy Wonder, der wählte, ein Held zu sein.',
    description_fr: 'Robin représentait Tim Drake comme le protégé détective brillant de Batman. Son torse rouge avec bras noirs montrait les couleurs traditionnelles de Robin. Tim déduisit l\'identité de Batman par intellect seul. Cette variante capturait Robin comme le Boy Wonder qui choisit d\'être un héros.',
    description_es: 'Robin representaba a Tim Drake como el brillante protegido detective de Batman. Su torso rojo con brazos negros mostraba los colores tradicionales de Robin. Tim dedujo la identidad de Batman solo por intelecto. Esta variante capturaba a Robin como el Chico Maravilla que eligió ser un héroe.'
  },
  {
    minifigure_no: 'sh0237',
    name: 'Nightwing - Blue and Black Suit, Dual Escrima Sticks',
    description_en: 'Nightwing represented Dick Grayson stepping out of Batman\'s shadow. His blue and black suit with dual escrima sticks created a unique fighting style. After outgrowing the Robin identity, Dick became Blüdhaven\'s protector. This variant captured Nightwing as the first Robin who became his own hero.',
    description_de: 'Nightwing repräsentierte Dick Grayson beim Heraustreten aus Batmans Schatten. Sein blau-schwarzer Anzug mit doppelten Escrima-Stöcken schuf einen einzigartigen Kampfstil. Nach Hinauswachsen aus der Robin-Identität wurde Dick Blüdhavens Beschützer. Diese Variante erfasste Nightwing als den ersten Robin, der sein eigener Held wurde.',
    description_fr: 'Nightwing représentait Dick Grayson sortant de l\'ombre de Batman. Son costume bleu et noir avec bâtons escrima doubles créa un style de combat unique. Après avoir dépassé l\'identité Robin, Dick devint le protecteur de Blüdhaven. Cette variante capturait Nightwing comme le premier Robin devenu son propre héros.',
    description_es: 'Nightwing representaba a Dick Grayson saliendo de la sombra de Batman. Su traje azul y negro con palos escrima duales creaba un estilo de lucha único. Después de superar la identidad Robin, Dick se convirtió en el protector de Blüdhaven. Esta variante capturaba a Nightwing como el primer Robin que se convirtió en su propio héroe.'
  }
];

async function updateDescriptions() {
  console.log(`Starting Batman/DC minifigure description updates (Batch 1)...`);
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

  console.log(`\n✅ Batman/DC Batch 1 descriptions update complete!`);
  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
