import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// FLAGSHIP BATCH 9: Mario + Disney start
const batch = [
  {
    minifigure_no: 'mar0013',
    name: 'Blooper',
    description_en: 'Blooper brought the aquatic squid enemy to LEGO Super Mario form. This minifigure featured white body with multiple tentacles and simple face design. The swimming foe floated through underwater levels. This collectible from LEGO Super Mario represented the classic water-dwelling enemy that challenged players beneath the waves.',
    description_de: 'Blooper brachte den aquatischen Tintenfisch-Feind in LEGO Super Mario Form. Diese Minifigur zeigte weißen Körper mit mehreren Tentakeln und einfachem Gesichts-Design. Der schwimmende Feind schwebte durch Unterwasser-Level. Diese Sammlerfigur aus LEGO Super Mario repräsentierte den klassischen im Wasser lebenden Feind, der Spieler unter den Wellen herausforderte.',
    description_fr: 'Blooper apportait l\'ennemi calamar aquatique en forme LEGO Super Mario. Cette minifigurine présentait corps blanc avec plusieurs tentacules et design facial simple. L\'ennemi nageur flottait à travers les niveaux sous-marins. Cette collection de LEGO Super Mario représentait l\'ennemi classique vivant dans l\'eau qui défiait les joueurs sous les vagues.',
    description_es: 'Blooper traía al enemigo calamar acuático en forma LEGO Super Mario. Esta minifigura presentaba cuerpo blanco con múltiples tentáculos y diseño facial simple. El enemigo nadador flotaba a través de niveles submarinos. Esta colección de LEGO Super Mario representaba al enemigo clásico que habitaba el agua y desafiaba a jugadores bajo las olas.'
  },
  {
    minifigure_no: 'mar0015',
    name: 'Boomer / Banzai Bill',
    description_en: 'Banzai Bill brought the giant bullet projectile to LEGO form. This minifigure featured oversized black missile design with angry face and outstretched arms. The massive enemy charged straight at Mario. This collectible from LEGO Super Mario represented the super-sized threat that required quick reflexes to dodge or defeat.',
    description_de: 'Banzai Bill brachte das riesige Kugel-Projektil in LEGO-Form. Diese Minifigur zeigte übergroßes schwarzes Raketen-Design mit wütendem Gesicht und ausgestreckten Armen. Der massive Feind stürmte direkt auf Mario zu. Diese Sammlerfigur aus LEGO Super Mario repräsentierte die super-große Bedrohung, die schnelle Reflexe erforderte zum Ausweichen oder Besiegen.',
    description_fr: 'Banzai Bill apportait le projectile balle géante en forme LEGO. Cette minifigurine présentait design de missile noir surdimensionné avec visage en colère et bras tendus. L\'ennemi massif chargeait directement vers Mario. Cette collection de LEGO Super Mario représentait la menace super-dimensionnée qui nécessitait des réflexes rapides pour esquiver ou vaincre.',
    description_es: 'Banzai Bill traía el proyectil bala gigante en forma LEGO. Esta minifigura presentaba diseño de misil negro sobredimensionado con cara enojada y brazos extendidos. El enemigo masivo cargaba directo hacia Mario. Esta colección de LEGO Super Mario representaba la amenaza super grande que requería reflejos rápidos para esquivar o derrotar.'
  },
  {
    minifigure_no: 'mar0016',
    name: 'Bullet Bill',
    description_en: 'Bullet Bill brought the iconic projectile enemy to LEGO form. This minifigure featured black missile design with white arms and determined expression. Shot from Bill Blasters throughout levels. This collectible from LEGO Super Mario represented one of gaming\'s most recognizable flying enemies that tested player timing and dodging skills.',
    description_de: 'Bullet Bill brachte den ikonischen Projektil-Feind in LEGO-Form. Diese Minifigur zeigte schwarzes Raketen-Design mit weißen Armen und entschlossenem Ausdruck. Geschossen aus Bill Blastern durch alle Level. Diese Sammlerfigur aus LEGO Super Mario repräsentierte einen der erkennbarsten fliegenden Feinde des Gamings, der Spieler-Timing und Ausweich-Fähigkeiten testete.',
    description_fr: 'Bullet Bill apportait l\'ennemi projectile emblématique en forme LEGO. Cette minifigurine présentait design de missile noir avec bras blancs et expression déterminée. Tiré des Bill Blasters à travers les niveaux. Cette collection de LEGO Super Mario représentait l\'un des ennemis volants les plus reconnaissables du gaming qui testait le timing et les compétences d\'esquive des joueurs.',
    description_es: 'Bullet Bill traía al enemigo proyectil icónico en forma LEGO. Esta minifigura presentaba diseño de misil negro con brazos blancos y expresión determinada. Disparado desde Bill Blasters a través de niveles. Esta colección de LEGO Super Mario representaba uno de los enemigos voladores más reconocibles del gaming que probaba el timing y habilidades de esquiva de jugadores.'
  },
  {
    minifigure_no: 'dis001',
    name: 'Stitch',
    description_en: 'Stitch brought the lovable alien experiment to LEGO Disney form. This minifigure featured blue fur, large ears, and mischievous expression. Experiment 626 found family with Lilo in Hawaii. This collectible from LEGO Disney represented the chaotic creature who learned about ohana and became an icon of friendship.',
    description_de: 'Stitch brachte das liebenswerte außerirdische Experiment in LEGO Disney Form. Diese Minifigur zeigte blaues Fell, große Ohren und schelmischen Ausdruck. Experiment 626 fand Familie mit Lilo in Hawaii. Diese Sammlerfigur aus LEGO Disney repräsentierte die chaotische Kreatur, die über Ohana lernte und zur Ikone der Freundschaft wurde.',
    description_fr: 'Stitch apportait l\'expérience alien adorable en forme LEGO Disney. Cette minifigurine présentait fourrure bleue, grandes oreilles et expression espiègle. L\'expérience 626 trouvait une famille avec Lilo à Hawaii. Cette collection de LEGO Disney représentait la créature chaotique qui apprit l\'ohana et devint une icône de l\'amitié.',
    description_es: 'Stitch traía el adorable experimento alienígena en forma LEGO Disney. Esta minifigura presentaba pelaje azul, orejas grandes y expresión traviesa. El Experimento 626 encontró familia con Lilo en Hawaii. Esta colección de LEGO Disney representaba la criatura caótica que aprendió sobre ohana y se convirtió en icono de la amistad.'
  },
  {
    minifigure_no: 'dis003',
    name: 'Buzz Lightyear',
    description_en: 'Buzz Lightyear brought the Space Ranger to LEGO Disney form. This minifigure featured iconic spacesuit with purple and green colors and wings. The toy believed he was a real space hero. This collectible from LEGO Disney Toy Story represented the delusional action figure who learned friendship and became Andy\'s beloved toy.',
    description_de: 'Buzz Lightyear brachte den Space Ranger in LEGO Disney Form. Diese Minifigur zeigte ikonischen Raumanzug mit lila und grünen Farben und Flügeln. Das Spielzeug glaubte er sei ein echter Weltraum-Held. Diese Sammlerfigur aus LEGO Disney Toy Story repräsentierte die wahnhafte Actionfigur, die Freundschaft lernte und zu Andys geliebtem Spielzeug wurde.',
    description_fr: 'Buzz Lightyear apportait le Space Ranger en forme LEGO Disney. Cette minifigurine présentait combinaison spatiale emblématique avec couleurs violet et vert et ailes. Le jouet croyait être un vrai héros spatial. Cette collection de LEGO Disney Toy Story représentait la figurine d\'action délirante qui apprit l\'amitié et devint le jouet bien-aimé d\'Andy.',
    description_es: 'Buzz Lightyear traía al Guardián Espacial en forma LEGO Disney. Esta minifigura presentaba icónico traje espacial con colores morado y verde y alas. El juguete creía que era un héroe espacial real. Esta colección de LEGO Disney Toy Story representaba la figura de acción delirante que aprendió la amistad y se convirtió en el juguete amado de Andy.'
  },
  {
    minifigure_no: 'dis009',
    name: 'Daisy Duck',
    description_en: 'Daisy Duck brought Donald\'s fashionable girlfriend to LEGO Disney form. This minifigure featured white feathers, purple bow, and elegant dress. The sophisticated duck had strong personality and style. This collectible from LEGO Disney represented the confident character who balanced glamour with determination in classic cartoons.',
    description_de: 'Daisy Duck brachte Donalds modische Freundin in LEGO Disney Form. Diese Minifigur zeigte weiße Federn, lila Schleife und elegantes Kleid. Die kultivierte Ente hatte starke Persönlichkeit und Stil. Diese Sammlerfigur aus LEGO Disney repräsentierte die selbstbewusste Figur, die Glamour mit Entschlossenheit in klassischen Cartoons ausbalancierte.',
    description_fr: 'Daisy Duck apportait la petite amie élégante de Donald en forme LEGO Disney. Cette minifigurine présentait plumes blanches, nœud violet et robe élégante. Le canard sophistiqué avait une forte personnalité et du style. Cette collection de LEGO Disney représentait le personnage confiant qui équilibrait glamour et détermination dans les dessins animés classiques.',
    description_es: 'Daisy Duck traía a la novia elegante de Donald en forma LEGO Disney. Esta minifigura presentaba plumas blancas, lazo morado y vestido elegante. La pata sofisticada tenía fuerte personalidad y estilo. Esta colección de LEGO Disney representaba al personaje seguro que equilibraba glamour con determinación en caricaturas clásicas.'
  },
  {
    minifigure_no: 'dis010',
    name: 'Donald Duck',
    description_en: 'Donald Duck brought the hot-tempered sailor to LEGO Disney form. This minifigure featured white feathers, blue sailor suit, and characteristic angry expression. The unlucky duck\'s temper tantrums entertained generations. This collectible from LEGO Disney represented one of animation\'s most iconic characters with his unforgettable voice and explosive personality.',
    description_de: 'Donald Duck brachte den jähzornigen Matrosen in LEGO Disney Form. Diese Minifigur zeigte weiße Federn, blauen Matrosenanzug und charakteristischen wütenden Ausdruck. Die Wutanfälle der Pechvogel-Ente unterhielten Generationen. Diese Sammlerfigur aus LEGO Disney repräsentierte eine der ikonischsten Figuren der Animation mit unvergesslicher Stimme und explosiver Persönlichkeit.',
    description_fr: 'Donald Duck apportait le marin colérique en forme LEGO Disney. Cette minifigurine présentait plumes blanches, costume marin bleu et expression en colère caractéristique. Les crises de colère du canard malchanceux divertissaient les générations. Cette collection de LEGO Disney représentait l\'un des personnages les plus emblématiques de l\'animation avec sa voix inoubliable et personnalité explosive.',
    description_es: 'Donald Duck traía al marinero de mal genio en forma LEGO Disney. Esta minifigura presentaba plumas blancas, traje de marinero azul y expresión enojada característica. Los berrinches del pato desafortunado entretenían generaciones. Esta colección de LEGO Disney representaba uno de los personajes más icónicos de la animación con su voz inolvidable y personalidad explosiva.'
  },
  {
    minifigure_no: 'dis011',
    name: 'Minnie Mouse',
    description_en: 'Minnie Mouse brought Mickey\'s sweetheart to LEGO Disney form. This minifigure featured iconic red polka dot dress and large bow. The cheerful mouse charmed audiences with kindness. This collectible from LEGO Disney represented the beloved character who became a timeless symbol of classic animation and feminine grace.',
    description_de: 'Minnie Mouse brachte Mickys Liebste in LEGO Disney Form. Diese Minifigur zeigte ikonisches rot gepunktetes Kleid und große Schleife. Die fröhliche Maus bezauberte Publikum mit Freundlichkeit. Diese Sammlerfigur aus LEGO Disney repräsentierte die beliebte Figur, die zum zeitlosen Symbol klassischer Animation und femininer Anmut wurde.',
    description_fr: 'Minnie Mouse apportait la chérie de Mickey en forme LEGO Disney. Cette minifigurine présentait robe à pois rouges emblématique et grand nœud. La souris joyeuse charmait le public avec gentillesse. Cette collection de LEGO Disney représentait le personnage bien-aimé qui devint un symbole intemporel de l\'animation classique et de la grâce féminine.',
    description_es: 'Minnie Mouse traía a la novia de Mickey en forma LEGO Disney. Esta minifigura presentaba icónico vestido de lunares rojos y gran lazo. La ratona alegre encantaba audiencias con amabilidad. Esta colección de LEGO Disney representaba al personaje amado que se convirtió en símbolo atemporal de animación clásica y gracia femenina.'
  },
];

async function updateDescriptions() {
  console.log(`\n🎯 BATCH 9: Mario + Disney start (8 minifigs)\n`);
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
