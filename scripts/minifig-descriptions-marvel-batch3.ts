import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Marvel minifigure descriptions - Batch 3: Spider-Man variants and Guardians of the Galaxy
const batch = [
  {
    minifigure_no: 'sh0536',
    name: 'Spider-Man - Iron Spider Suit, Metallic Arms',
    description_en: 'Spider-Man in the Iron Spider suit combined Peter\'s abilities with Tony Stark\'s technology. The metallic arms extended his combat capabilities during the Infinity War. The red and gold armor represented Peter\'s relationship with his mentor. This variant captured Spider-Man at his most technologically advanced.',
    description_de: 'Spider-Man im Iron Spider-Anzug kombinierte Peters Fähigkeiten mit Tony Starks Technologie. Die metallischen Arme erweiterten seine Kampffähigkeiten während des Infinity War. Die rot-goldene Rüstung repräsentierte Peters Beziehung zu seinem Mentor. Diese Variante erfasste Spider-Man auf seinem technologisch fortgeschrittensten Stand.',
    description_fr: 'Spider-Man dans le costume Iron Spider combinait les capacités de Peter avec la technologie de Tony Stark. Les bras métalliques étendirent ses capacités de combat pendant la Guerre de l\'Infini. L\'armure rouge et or représentait la relation de Peter avec son mentor. Cette variante capturait Spider-Man à son niveau technologique le plus avancé.',
    description_es: 'Spider-Man en el traje Iron Spider combinaba las habilidades de Peter con la tecnología de Tony Stark. Los brazos metálicos extendieron sus capacidades de combate durante la Guerra del Infinito. La armadura roja y dorada representaba la relación de Peter con su mentor. Esta variante capturaba a Spider-Man en su nivel tecnológicamente más avanzado.'
  },
  {
    minifigure_no: 'sh0611',
    name: 'Miles Morales - Black and Red Spider Suit',
    description_en: 'Miles Morales brought fresh energy as Brooklyn\'s new Spider-Man. His black and red suit distinguished him from Peter Parker while honoring the Spider-Man legacy. Miles\' unique bio-electric venom blast and invisibility powers expanded what Spider-Man could do. This variant captured Miles during his journey to become his own hero.',
    description_de: 'Miles Morales brachte frische Energie als Brooklyns neuer Spider-Man. Sein schwarz-roter Anzug unterschied ihn von Peter Parker und ehrte gleichzeitig das Spider-Man-Erbe. Miles\' einzigartige bioelektrische Venom-Explosion und Unsichtbarkeitskräfte erweiterten, was Spider-Man tun konnte. Diese Variante erfasste Miles während seiner Reise, sein eigener Held zu werden.',
    description_fr: 'Miles Morales apporta une énergie fraîche comme le nouveau Spider-Man de Brooklyn. Son costume noir et rouge le distinguait de Peter Parker tout en honorant l\'héritage Spider-Man. L\'explosion de venin bio-électrique unique et les pouvoirs d\'invisibilité de Miles étendirent ce que Spider-Man pouvait faire. Cette variante capturait Miles pendant son parcours pour devenir son propre héros.',
    description_es: 'Miles Morales trajo energía fresca como el nuevo Spider-Man de Brooklyn. Su traje negro y rojo lo distinguía de Peter Parker mientras honraba el legado de Spider-Man. El ataque de veneno bio-eléctrico único y poderes de invisibilidad de Miles expandieron lo que Spider-Man podía hacer. Esta variante capturaba a Miles durante su viaje para convertirse en su propio héroe.'
  },
  {
    minifigure_no: 'sh0541',
    name: 'Spider-Gwen - White and Pink Hood, Web Pattern',
    description_en: 'Spider-Gwen represented Gwen Stacy as Spider-Woman from an alternate dimension. Her white and pink hood with web pattern created an instantly iconic look. In her universe, Gwen gained spider powers instead of Peter. This variant captured Spider-Gwen\'s unique style and dimension-hopping adventures.',
    description_de: 'Spider-Gwen repräsentierte Gwen Stacy als Spider-Woman aus einer alternativen Dimension. Ihre weiß-rosa Kapuze mit Netzmuster schuf einen sofort ikonischen Look. In ihrem Universum erhielt Gwen Spinnenkräfte statt Peter. Diese Variante erfasste Spider-Gwens einzigartigen Stil und dimensionsübergreifende Abenteuer.',
    description_fr: 'Spider-Gwen représentait Gwen Stacy comme Spider-Woman d\'une dimension alternative. Sa capuche blanche et rose avec motif de toile créa un look instantanément emblématique. Dans son univers, Gwen gagna des pouvoirs d\'araignée au lieu de Peter. Cette variante capturait le style unique et les aventures inter-dimensionnelles de Spider-Gwen.',
    description_es: 'Spider-Gwen representaba a Gwen Stacy como Spider-Woman de una dimensión alternativa. Su capucha blanca y rosa con patrón de telaraña creó un look instantáneamente icónico. En su universo, Gwen ganó poderes de araña en lugar de Peter. Esta variante capturaba el estilo único y aventuras entre dimensiones de Spider-Gwen.'
  },
  {
    minifigure_no: 'sh0270',
    name: 'Star-Lord - Mask, Element Guns',
    description_en: 'Star-Lord led the Guardians of the Galaxy with humor and bravery. Peter Quill\'s mask and element guns made him a formidable outlaw. Despite his cocky attitude, Star-Lord\'s leadership held the ragtag team together. This variant captured the self-proclaimed legendary outlaw who saved the galaxy.',
    description_de: 'Star-Lord führte die Guardians of the Galaxy mit Humor und Tapferkeit. Peter Quills Maske und Elementwaffen machten ihn zu einem beeindruckenden Gesetzlosen. Trotz seiner überheblichen Einstellung hielt Star-Lords Führung das zusammengewürfelte Team zusammen. Diese Variante erfasste den selbsternannten legendären Gesetzlosen, der die Galaxie rettete.',
    description_fr: 'Star-Lord dirigeait les Gardiens de la Galaxie avec humour et bravoure. Le masque et les pistolets élémentaires de Peter Quill firent de lui un hors-la-loi redoutable. Malgré son attitude arrogante, le leadership de Star-Lord maintenait l\'équipe hétéroclite ensemble. Cette variante capturait le hors-la-loi légendaire autoproclamé qui sauva la galaxie.',
    description_es: 'Star-Lord lideró a los Guardianes de la Galaxia con humor y valentía. La máscara y pistolas de elementos de Peter Quill lo convirtieron en un forajido formidable. A pesar de su actitud arrogante, el liderazgo de Star-Lord mantuvo unido al equipo heterogéneo. Esta variante capturaba al forajido legendario autoproclamado que salvó la galaxia.'
  },
  {
    minifigure_no: 'sh0269',
    name: 'Gamora - Green Skin, Sword',
    description_en: 'Gamora the deadliest woman in the galaxy wielded her sword with lethal precision. Trained by Thanos as an assassin, Gamora sought redemption with the Guardians. Her green skin marked her as the last of the Zen-Whoberi. This variant captured Gamora as the fierce warrior who defied her adoptive father.',
    description_de: 'Gamora die tödlichste Frau der Galaxie führte ihr Schwert mit tödlicher Präzision. Von Thanos als Attentäterin trainiert, suchte Gamora Erlösung bei den Guardians. Ihre grüne Haut kennzeichnete sie als die Letzte der Zen-Whoberi. Diese Variante erfasste Gamora als die wilde Kriegerin, die ihrem Adoptivvater trotzte.',
    description_fr: 'Gamora la femme la plus mortelle de la galaxie maniait son épée avec une précision létale. Entraînée par Thanos comme assassin, Gamora cherchait rédemption avec les Gardiens. Sa peau verte la marquait comme la dernière des Zen-Whoberi. Cette variante capturait Gamora comme la guerrière féroce qui défia son père adoptif.',
    description_es: 'Gamora la mujer más mortal de la galaxia blandía su espada con precisión letal. Entrenada por Thanos como asesina, Gamora buscaba redención con los Guardianes. Su piel verde la marcaba como la última de los Zen-Whoberi. Esta variante capturaba a Gamora como la guerrera feroz que desafió a su padre adoptivo.'
  },
  {
    minifigure_no: 'sh0271',
    name: 'Drax the Destroyer - Red Tattoos, Bare Chest',
    description_en: 'Drax the Destroyer sought vengeance against Ronan for killing his family. His red tattoos and muscular build made him a fearsome warrior. Despite taking everything literally, Drax\'s loyalty to the Guardians was absolute. This variant captured Drax as the powerful fighter learning friendship could heal pain.',
    description_de: 'Drax der Zerstörer suchte Rache an Ronan für die Ermordung seiner Familie. Seine roten Tattoos und muskulöser Körperbau machten ihn zu einem furchterregenden Krieger. Trotz wörtlichem Verständnis von allem war Drax\' Loyalität zu den Guardians absolut. Diese Variante erfasste Drax als den mächtigen Kämpfer, der lernte, dass Freundschaft Schmerz heilen konnte.',
    description_fr: 'Drax le Destructeur cherchait vengeance contre Ronan pour avoir tué sa famille. Ses tatouages rouges et carrure musclée firent de lui un guerrier redoutable. Malgré sa prise au pied de la lettre de tout, la loyauté de Drax envers les Gardiens était absolue. Cette variante capturait Drax comme le combattant puissant apprenant que l\'amitié pouvait guérir la douleur.',
    description_es: 'Drax el Destructor buscaba venganza contra Ronan por matar a su familia. Sus tatuajes rojos y constitución muscular lo convertían en un guerrero temible. A pesar de tomar todo literalmente, la lealtad de Drax a los Guardianes era absoluta. Esta variante capturaba a Drax como el luchador poderoso aprendiendo que la amistad podía sanar el dolor.'
  },
  {
    minifigure_no: 'sh0272',
    name: 'Rocket Raccoon - Weapons, Brown Fur',
    description_en: 'Rocket Raccoon the genetically engineered mercenary brought firepower and technical genius to the Guardians. His weapons and brown fur concealed a painful past of experimentation. Despite his tough exterior, Rocket found family with the misfits. This variant captured the brilliant tactician who proved size didn\'t matter.',
    description_de: 'Rocket Raccoon der genetisch veränderte Söldner brachte Feuerkraft und technisches Genie zu den Guardians. Seine Waffen und braunes Fell verbargen eine schmerzhafte Vergangenheit voller Experimente. Trotz seiner harten Schale fand Rocket Familie bei den Außenseitern. Diese Variante erfasste den brillanten Taktiker, der bewies, dass Größe nicht zählt.',
    description_fr: 'Rocket Raccoon le mercenaire génétiquement modifié apporta puissance de feu et génie technique aux Gardiens. Ses armes et fourrure brune dissimulaient un passé douloureux d\'expérimentation. Malgré son extérieur dur, Rocket trouva une famille avec les marginaux. Cette variante capturait le tacticien brillant qui prouva que la taille n\'importait pas.',
    description_es: 'Rocket Raccoon el mercenario genéticamente modificado trajo potencia de fuego y genio técnico a los Guardianes. Sus armas y pelaje marrón ocultaban un pasado doloroso de experimentación. A pesar de su exterior duro, Rocket encontró familia con los inadaptados. Esta variante capturaba al táctico brillante que demostró que el tamaño no importaba.'
  },
  {
    minifigure_no: 'sh0273',
    name: 'Groot - Tree Form, Brown Limbs',
    description_en: 'Groot the Flora colossus communicated only through "I am Groot" yet expressed profound meaning. His tree form and regenerative abilities made him virtually indestructible. Despite limited vocabulary, Groot\'s heart was as big as his branches. This variant captured the gentle giant who sacrificed himself for his friends.',
    description_de: 'Groot der Flora colossus kommunizierte nur durch "Ich bin Groot", drückte aber tiefgründige Bedeutung aus. Seine Baumform und regenerative Fähigkeiten machten ihn praktisch unzerstörbar. Trotz begrenzten Wortschatzes war Groots Herz so groß wie seine Äste. Diese Variante erfasste den sanften Riesen, der sich für seine Freunde opferte.',
    description_fr: 'Groot le colosse Flora communiquait seulement par "Je suis Groot" mais exprimait un sens profond. Sa forme d\'arbre et capacités régénératives le rendaient pratiquement indestructible. Malgré un vocabulaire limité, le cœur de Groot était aussi grand que ses branches. Cette variante capturait le géant gentil qui se sacrifia pour ses amis.',
    description_es: 'Groot el coloso Flora comunicaba solo a través de "Yo soy Groot" pero expresaba significado profundo. Su forma de árbol y habilidades regenerativas lo hacían virtualmente indestructible. A pesar del vocabulario limitado, el corazón de Groot era tan grande como sus ramas. Esta variante capturaba al gigante gentil que se sacrificó por sus amigos.'
  }
];

async function updateDescriptions() {
  console.log(`Starting Marvel minifigure description updates (Batch 3)...`);
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

  console.log(`\n✅ Marvel Batch 3 descriptions update complete!`);
  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
