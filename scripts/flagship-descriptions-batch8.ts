import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// FLAGSHIP BATCH 8: Minecraft + Mario start
const batch = [
  {
    minifigure_no: 'min006',
    name: 'Micromob Ghast',
    description_en: 'Minecraft Ghast in Micromob format brought floating Nether terror to LEGO. This minifigure featured white cube design with crying face and tentacles below. The flying hostile mob shot fireballs from the skies. This collectible from LEGO Minecraft represented the haunting creature of the dangerous Nether dimension in miniature form.',
    description_de: 'Minecraft Ghast im Micromob-Format brachte schwebenden Nether-Terror zu LEGO. Diese Minifigur zeigte weißes Würfel-Design mit weinendem Gesicht und Tentakeln darunter. Der fliegende feindliche Mob schoss Feuerbälle vom Himmel. Diese Sammlerfigur aus LEGO Minecraft repräsentierte das heimsuchende Geschöpf der gefährlichen Nether-Dimension in Miniatur-Form.',
    description_fr: 'Ghast Minecraft au format Micromob apportait terreur flottante du Nether à LEGO. Cette minifigurine présentait design de cube blanc avec visage pleurant et tentacules en dessous. La foule hostile volante tirait des boules de feu du ciel. Cette collection de LEGO Minecraft représentait la créature hantée de la dangereuse dimension Nether sous forme miniature.',
    description_es: 'Ghast de Minecraft en formato Micromob traía terror flotante del Nether a LEGO. Esta minifigura presentaba diseño de cubo blanco con cara llorosa y tentáculos debajo. La turba hostil voladora disparaba bolas de fuego desde los cielos. Esta colección de LEGO Minecraft representaba la criatura inquietante de la peligrosa dimensión Nether en forma miniatura.'
  },
  {
    minifigure_no: 'min007',
    name: 'Micromob Zombie Pigman',
    description_en: 'Minecraft Zombie Pigman in Micromob format brought Nether inhabitant to LEGO. This minifigure featured rotting pig-zombie hybrid design with golden sword. Neutral until provoked, these creatures roamed the hellish dimension. This collectible from LEGO Minecraft represented the iconic undead mob that guarded the dangerous Nether realm.',
    description_de: 'Minecraft Zombie Pigman im Micromob-Format brachte Nether-Bewohner zu LEGO. Diese Minifigur zeigte verwesenden Schwein-Zombie-Hybrid-Design mit goldenem Schwert. Neutral bis provoziert, durchstreiften diese Kreaturen die höllische Dimension. Diese Sammlerfigur aus LEGO Minecraft repräsentierte den ikonischen untoten Mob, der das gefährliche Nether-Reich bewachte.',
    description_fr: 'Zombie Pigman Minecraft au format Micromob apportait habitant du Nether à LEGO. Cette minifigurine présentait design hybride cochon-zombie en décomposition avec épée dorée. Neutre jusqu\'à provoqué, ces créatures erraient dans la dimension infernale. Cette collection de LEGO Minecraft représentait la foule mort-vivante emblématique qui gardait le royaume dangereux du Nether.',
    description_es: 'Zombie Pigman de Minecraft en formato Micromob traía habitante del Nether a LEGO. Esta minifigura presentaba diseño híbrido cerdo-zombi en descomposición con espada dorada. Neutral hasta ser provocado, estas criaturas vagaban por la dimensión infernal. Esta colección de LEGO Minecraft representaba la turba no-muerta icónica que custodiaba el peligroso reino Nether.'
  },
  {
    minifigure_no: 'min008',
    name: 'Micromob Enderman',
    description_en: 'Minecraft Enderman in Micromob format brought mysterious teleporting creature to LEGO. This minifigure featured tall black design with glowing purple eyes and ability to hold blocks. The neutral mob became hostile when looked at directly. This collectible from LEGO Minecraft represented the enigmatic being from the End dimension in compact scale.',
    description_de: 'Minecraft Enderman im Micromob-Format brachte mysteriöse teleportierende Kreatur zu LEGO. Diese Minifigur zeigte hohes schwarzes Design mit leuchtenden lila Augen und Fähigkeit Blöcke zu halten. Der neutrale Mob wurde feindlich wenn direkt angesehen. Diese Sammlerfigur aus LEGO Minecraft repräsentierte das rätselhaftes Wesen aus der End-Dimension in kompakter Größe.',
    description_fr: 'Enderman Minecraft au format Micromob apportait créature téléportante mystérieuse à LEGO. Cette minifigurine présentait grand design noir avec yeux violets lumineux et capacité de tenir des blocs. La foule neutre devenait hostile quand regardée directement. Cette collection de LEGO Minecraft représentait l\'être énigmatique de la dimension End à échelle compacte.',
    description_es: 'Enderman de Minecraft en formato Micromob traía criatura teletransportadora misteriosa a LEGO. Esta minifigura presentaba diseño negro alto con ojos morados brillantes y capacidad de sostener bloques. La turba neutral se volvía hostil cuando se miraba directamente. Esta colección de LEGO Minecraft representaba el ser enigmático de la dimensión End a escala compacta.'
  },
  {
    minifigure_no: 'mar0001',
    name: 'Boo - Red Tongue',
    description_en: 'Boo with red tongue brought Mario\'s shy ghost enemy to LEGO form. This minifigure featured white spherical design with open mouth and outstretched arms. The bashful spirit only moved when Mario looked away. This collectible from LEGO Super Mario represented the playful phantom that became gaming icon through adorable mischievous behavior.',
    description_de: 'Boo mit roter Zunge brachte Marios schüchternen Geist-Feind in LEGO-Form. Diese Minifigur zeigte weißes kugelförmiges Design mit offenem Mund und ausgestreckten Armen. Der scheue Geist bewegte sich nur wenn Mario wegschaute. Diese Sammlerfigur aus LEGO Super Mario repräsentierte das verspielte Phantom, das durch bezauberndes schelmisches Verhalten zur Gaming-Ikone wurde.',
    description_fr: 'Boo avec langue rouge apportait l\'ennemi fantôme timide de Mario en forme LEGO. Cette minifigurine présentait design sphérique blanc avec bouche ouverte et bras tendus. L\'esprit timide ne bougeait que quand Mario détournait le regard. Cette collection de LEGO Super Mario représentait le fantôme joueur qui devint icône du gaming par comportement adorable et espiègle.',
    description_es: 'Boo con lengua roja traía al enemigo fantasma tímido de Mario en forma LEGO. Esta minifigura presentaba diseño esférico blanco con boca abierta y brazos extendidos. El espíritu tímido solo se movía cuando Mario miraba hacia otro lado. Esta colección de LEGO Super Mario representaba al fantasma juguetón que se convirtió en icono del gaming por comportamiento adorable y travieso.'
  },
  {
    minifigure_no: 'mar0002',
    name: 'Bowser - Tan Tile',
    description_en: 'Bowser with tan tile brought Mario\'s arch-nemesis to LEGO in detailed form. This minifigure featured spiky shell, orange hair, and fierce expression. The Koopa King kidnapped Princess Peach countless times. This collectible from LEGO Super Mario represented gaming\'s most persistent villain and iconic antagonist in the Mushroom Kingdom.',
    description_de: 'Bowser mit beiger Fliese brachte Marios Erzfeind zu LEGO in detaillierter Form. Diese Minifigur zeigte stacheligen Panzer, oranges Haar und wilden Ausdruck. Der Koopa-König entführte Prinzessin Peach unzählige Male. Diese Sammlerfigur aus LEGO Super Mario repräsentierte den hartnäckigsten Schurken des Gamings und ikonischen Antagonisten im Pilz-Königreich.',
    description_fr: 'Bowser avec tuile beige apportait l\'archi-ennemi de Mario à LEGO sous forme détaillée. Cette minifigurine présentait carapace épineuse, cheveux orange et expression féroce. Le Roi Koopa kidnappait la Princesse Peach d\'innombrables fois. Cette collection de LEGO Super Mario représentait le méchant le plus persistant du gaming et antagoniste emblématique du Royaume Champignon.',
    description_es: 'Bowser con baldosa beige traía al archienemigo de Mario a LEGO en forma detallada. Esta minifigura presentaba caparazón puntiagudo, cabello naranja y expresión feroz. El Rey Koopa secuestraba a la Princesa Peach innumerables veces. Esta colección de LEGO Super Mario representaba al villano más persistente del gaming y antagonista icónico en el Reino Champiñón.'
  },
  {
    minifigure_no: 'mar0003',
    name: 'Bowser Jr.',
    description_en: 'Bowser Jr. brought the young Koopa prince to LEGO form. This minifigure featured small shell, bandana, and mischievous expression like his father. The troublemaking son caused chaos across the Mushroom Kingdom. This collectible from LEGO Super Mario represented the next generation villain and Bowser\'s heir to the throne.',
    description_de: 'Bowser Jr. brachte den jungen Koopa-Prinzen in LEGO-Form. Diese Minifigur zeigte kleinen Panzer, Bandana und schelmischen Ausdruck wie sein Vater. Der Unruhestifter-Sohn verursachte Chaos im Pilz-Königreich. Diese Sammlerfigur aus LEGO Super Mario repräsentierte den Schurken der nächsten Generation und Bowsers Thronfolger.',
    description_fr: 'Bowser Jr. apportait le jeune prince Koopa en forme LEGO. Cette minifigurine présentait petite carapace, bandana et expression espiègle comme son père. Le fils fauteur de troubles causait le chaos à travers le Royaume Champignon. Cette collection de LEGO Super Mario représentait le méchant de nouvelle génération et l\'héritier du trône de Bowser.',
    description_es: 'Bowser Jr. traía al joven príncipe Koopa en forma LEGO. Esta minifigura presentaba pequeño caparazón, pañuelo y expresión traviesa como su padre. El hijo causante de problemas causaba caos en el Reino Champiñón. Esta colección de LEGO Super Mario representaba al villano de nueva generación y heredero del trono de Bowser.'
  },
  {
    minifigure_no: 'mar0004',
    name: 'Dry Bones - Looking Straight',
    description_en: 'Dry Bones looking straight brought undead Koopa Troopa to LEGO form. This minifigure featured skeletal white design that reassembled after being stomped. The persistent enemy kept coming back to life. This collectible from LEGO Super Mario represented the determined undead foe that tested player patience in castle dungeons.',
    description_de: 'Dry Bones geradeaus schauend brachte untoten Koopa Troopa in LEGO-Form. Diese Minifigur zeigte skelettartiges weißes Design, das sich nach dem Stampfen wieder zusammensetzte. Der hartnäckige Feind kam immer wieder zum Leben. Diese Sammlerfigur aus LEGO Super Mario repräsentierte den entschlossenen untoten Feind, der Spieler-Geduld in Schloss-Kerkern testete.',
    description_fr: 'Dry Bones regardant droit apportait Koopa Troopa mort-vivant en forme LEGO. Cette minifigurine présentait design squelettique blanc qui se reconstituait après avoir été piétiné. L\'ennemi persistant revenait sans cesse à la vie. Cette collection de LEGO Super Mario représentait l\'ennemi mort-vivant déterminé qui testait la patience des joueurs dans les donjons de château.',
    description_es: 'Dry Bones mirando al frente traía Koopa Troopa no-muerto en forma LEGO. Esta minifigura presentaba diseño esquelético blanco que se reensamblaba después de ser pisado. El enemigo persistente seguía volviendo a la vida. Esta colección de LEGO Super Mario representaba al enemigo no-muerto determinado que probaba la paciencia de los jugadores en mazmorras de castillo.'
  },
  {
    minifigure_no: 'mar0005',
    name: 'King Boo - Red Tongue',
    description_en: 'King Boo with red tongue brought the ghostly monarch to LEGO form. This minifigure featured large white design with crown and menacing expression. The leader of all Boos haunted Luigi in his mansion adventures. This collectible from LEGO Super Mario represented the royal phantom and primary antagonist of Luigi\'s ghostly encounters.',
    description_de: 'King Boo mit roter Zunge brachte den geisterhaften Monarchen in LEGO-Form. Diese Minifigur zeigte großes weißes Design mit Krone und bedrohlichem Ausdruck. Der Anführer aller Boos heimsuchte Luigi in seinen Villa-Abenteuern. Diese Sammlerfigur aus LEGO Super Mario repräsentierte das königliche Phantom und primären Antagonisten von Luigis geisterhaften Begegnungen.',
    description_fr: 'King Boo avec langue rouge apportait le monarque fantomatique en forme LEGO. Cette minifigurine présentait grand design blanc avec couronne et expression menaçante. Le chef de tous les Boos hantait Luigi dans ses aventures de manoir. Cette collection de LEGO Super Mario représentait le fantôme royal et antagoniste principal des rencontres spectrales de Luigi.',
    description_es: 'King Boo con lengua roja traía al monarca fantasmal en forma LEGO. Esta minifigura presentaba gran diseño blanco con corona y expresión amenazante. El líder de todos los Boos acechaba a Luigi en sus aventuras de mansión. Esta colección de LEGO Super Mario representaba al fantasma real y antagonista principal de los encuentros fantasmales de Luigi.'
  },
];

async function updateDescriptions() {
  console.log(`\n🎯 BATCH 8: Minecraft + Mario start (8 minifigs)\n`);
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
