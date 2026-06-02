import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// FLAGSHIP BATCH 7: More Marvel
const batch = [
  {
    minifigure_no: 'sh0516',
    name: 'Ant-Man (Scott Lang) - Upgraded Suit',
    description_en: 'Ant-Man with upgraded suit featured enhanced technology and refined design details. This LEGO minifigure showcased Scott Lang\'s evolved costume with improved printing and helmet design. The ex-thief turned hero mastered Pym Particles to shrink and grow at will. This collectible from Marvel films represented Ant-Man\'s technological advancement and heroic journey.',
    description_de: 'Ant-Man mit verbessertem Anzug zeigte erweiterte Technologie und verfeinerte Design-Details. Diese LEGO-Minifigur präsentierte Scott Langs weiterentwickeltes Kostüm mit verbessertem Druck und Helm-Design. Der Ex-Dieb als Held meisterte Pym-Partikel zum Schrumpfen und Wachsen nach Belieben. Diese Sammlerfigur aus Marvel-Filmen repräsentierte Ant-Mans technologischen Fortschritt und heroische Reise.',
    description_fr: 'Ant-Man avec costume amélioré présentait technologie avancée et détails de design raffinés. Cette minifigurine LEGO montrait le costume évolué de Scott Lang avec impression améliorée et design de casque. L\'ex-voleur devenu héros maîtrisait les particules de Pym pour rétrécir et grandir à volonté. Cette collection des films Marvel représentait l\'avancement technologique et le parcours héroïque d\'Ant-Man.',
    description_es: 'Ant-Man con traje mejorado presentaba tecnología avanzada y detalles de diseño refinados. Esta minifigura LEGO mostraba el traje evolucionado de Scott Lang con impresión mejorada y diseño de casco. El ex ladrón convertido en héroe dominaba las Partículas Pym para encoger y crecer a voluntad. Esta colección de películas Marvel representaba el avance tecnológico y el viaje heroico de Ant-Man.'
  },
  {
    minifigure_no: 'sh0528',
    name: 'Batman - Heavy Armor',
    description_en: 'Batman in heavy armor prepared for his most dangerous missions with reinforced protection. This LEGO minifigure featured bulky armored suit with enhanced plating and weaponry. Bruce Wayne\'s tactical planning included specialized equipment for extreme threats. This collectible from Batman v Superman represented the Dark Knight ready for his ultimate confrontation.',
    description_de: 'Batman in schwerer Rüstung bereitete sich auf seine gefährlichsten Missionen mit verstärktem Schutz vor. Diese LEGO-Minifigur zeigte sperrigen gepanzerten Anzug mit verbesserter Panzerung und Bewaffnung. Bruce Waynes taktische Planung umfasste spezialisierte Ausrüstung für extreme Bedrohungen. Diese Sammlerfigur aus Batman v Superman repräsentierte den Dunklen Ritter bereit für seine ultimative Konfrontation.',
    description_fr: 'Batman en armure lourde se préparait pour ses missions les plus dangereuses avec protection renforcée. Cette minifigurine LEGO présentait un costume blindé massif avec plaques améliorées et armement. La planification tactique de Bruce Wayne incluait équipement spécialisé pour menaces extrêmes. Cette collection de Batman v Superman représentait le Chevalier Noir prêt pour sa confrontation ultime.',
    description_es: 'Batman con armadura pesada se preparaba para sus misiones más peligrosas con protección reforzada. Esta minifigura LEGO presentaba traje blindado voluminoso con placas mejoradas y armamento. La planificación táctica de Bruce Wayne incluía equipo especializado para amenazas extremas. Esta colección de Batman v Superman representaba al Caballero Oscuro listo para su confrontación definitiva.'
  },
  {
    minifigure_no: 'sh0536',
    name: 'Spider-Man - Metallic Light Blue Eye Highlights',
    description_en: 'Spider-Man with metallic light blue eye highlights featured striking visual design and modern aesthetics. This LEGO minifigure showcased enhanced printing with distinctive eye detailing. Peter Parker\'s advanced suit incorporated new technology for crime-fighting. This collectible from Spider-Man Homecoming represented the web-slinger\'s contemporary appearance with premium finish.',
    description_de: 'Spider-Man mit metallisch hellblauen Augen-Highlights zeigte auffälliges visuelles Design und moderne Ästhetik. Diese LEGO-Minifigur präsentierte verbesserten Druck mit charakteristischen Augen-Details. Peter Parkers fortschrittlicher Anzug integrierte neue Technologie zur Verbrechensbekämpfung. Diese Sammlerfigur aus Spider-Man Homecoming repräsentierte das zeitgemäße Erscheinungsbild des Netzschleuderers mit Premium-Finish.',
    description_fr: 'Spider-Man avec reflets métalliques bleu clair aux yeux présentait un design visuel frappant et esthétique moderne. Cette minifigurine LEGO montrait impression améliorée avec détails distinctifs des yeux. Le costume avancé de Peter Parker incorporait nouvelle technologie pour combattre le crime. Cette collection de Spider-Man Homecoming représentait l\'apparence contemporaine du lanceur de toiles avec finition premium.',
    description_es: 'Spider-Man con reflejos metálicos azul claro en los ojos presentaba diseño visual llamativo y estética moderna. Esta minifigura LEGO mostraba impresión mejorada con detalles distintivos de ojos. El traje avanzado de Peter Parker incorporaba nueva tecnología para combatir el crimen. Esta colección de Spider-Man Homecoming representaba la apariencia contemporánea del lanzador de telarañas con acabado premium.'
  },
  {
    minifigure_no: 'sh0541',
    name: 'Carnage - Long Appendages',
    description_en: 'Carnage with long appendages brought the terrifying symbiote villain to LEGO form. This minifigure featured distinctive red and black design with extended tentacle pieces. Cletus Kasady bonded with alien symbiote became Spider-Man\'s most dangerous foe. This collectible represented the chaos and destruction of Marvel\'s ultimate psychotic villain.',
    description_de: 'Carnage mit langen Anhängseln brachte den erschreckenden Symbiont-Schurken in LEGO-Form. Diese Minifigur zeigte charakteristisches rot-schwarzes Design mit erweiterten Tentakel-Teilen. Cletus Kasady verbunden mit außerirdischem Symbiont wurde Spider-Mans gefährlichster Feind. Diese Sammlerfigur repräsentierte das Chaos und die Zerstörung von Marvels ultimativem psychotischen Schurken.',
    description_fr: 'Carnage avec longs appendices apportait le terrifiant méchant symbiote en forme LEGO. Cette minifigurine présentait un design rouge et noir distinctif avec pièces de tentacules étendues. Cletus Kasady lié au symbiote alien devint l\'ennemi le plus dangereux de Spider-Man. Cette collection représentait le chaos et la destruction du méchant psychotique ultime de Marvel.',
    description_es: 'Carnage con largos apéndices traía al aterrador villano simbionte en forma LEGO. Esta minifigura presentaba distintivo diseño rojo y negro con piezas de tentáculos extendidos. Cletus Kasady vinculado con simbionte alienígena se convirtió en el enemigo más peligroso de Spider-Man. Esta colección representaba el caos y la destrucción del villano psicótico definitivo de Marvel.'
  },
  {
    minifigure_no: 'sh0611',
    name: 'Hulk - Giant, White Jumpsuit',
    description_en: 'Hulk in white jumpsuit appeared in giant BigFig format capturing incredible size and strength. This LEGO figure featured unique white outfit and massive green body. Bruce Banner\'s transformation brought unstoppable force and raw power. This collectible from Marvel sets represented the strongest Avenger in alternative civilian clothing at enormous scale.',
    description_de: 'Hulk im weißen Overall erschien im riesigen BigFig-Format und erfasste unglaubliche Größe und Stärke. Diese LEGO-Figur zeigte einzigartiges weißes Outfit und massiven grünen Körper. Bruce Banners Verwandlung brachte unaufhaltsame Kraft und rohe Power. Diese Sammlerfigur aus Marvel-Sets repräsentierte den stärksten Avenger in alternativer Zivilkleidung in enormer Größe.',
    description_fr: 'Hulk en combinaison blanche apparaissait au format géant BigFig capturant taille et force incroyables. Cette figurine LEGO présentait une tenue blanche unique et un corps vert massif. La transformation de Bruce Banner apportait force imparable et puissance brute. Cette collection des sets Marvel représentait l\'Avenger le plus fort en vêtements civils alternatifs à échelle énorme.',
    description_es: 'Hulk con mono blanco aparecía en formato gigante BigFig capturando tamaño y fuerza increíbles. Esta figura LEGO presentaba atuendo blanco único y cuerpo verde masivo. La transformación de Bruce Banner traía fuerza imparable y poder bruto. Esta colección de sets Marvel representaba al Avenger más fuerte con ropa civil alternativa a escala enorme.'
  },
  {
    minifigure_no: 'min001',
    name: 'Micromob Creeper - Tall',
    description_en: 'Minecraft Creeper in tall Micromob format brought iconic pixelated enemy to LEGO. This minifigure captured the blocky green design with distinctive face pattern. The silent explosive mob struck fear into players worldwide. This collectible from LEGO Minecraft represented gaming\'s most recognizable hostile creature in miniature scale.',
    description_de: 'Minecraft Creeper im hohen Micromob-Format brachte ikonischen pixeligen Feind zu LEGO. Diese Minifigur erfasste das blockige grüne Design mit charakteristischem Gesichts-Muster. Der stille explosive Mob verbreitete Angst bei Spielern weltweit. Diese Sammlerfigur aus LEGO Minecraft repräsentierte das erkennbarste feindliche Geschöpf des Gamings in Miniatur-Größe.',
    description_fr: 'Creeper Minecraft au format grand Micromob apportait l\'ennemi pixelisé emblématique à LEGO. Cette minifigurine capturait le design vert carré avec motif facial distinctif. La foule explosive silencieuse inspirait la peur aux joueurs du monde entier. Cette collection de LEGO Minecraft représentait la créature hostile la plus reconnaissable du gaming à échelle miniature.',
    description_es: 'Creeper de Minecraft en formato alto Micromob traía al icónico enemigo pixelado a LEGO. Esta minifigura capturaba el diseño verde cuadrado con patrón facial distintivo. La turba explosiva silenciosa causaba temor en jugadores de todo el mundo. Esta colección de LEGO Minecraft representaba la criatura hostil más reconocible del gaming a escala miniatura.'
  },
  {
    minifigure_no: 'min002',
    name: 'Micromob Steve - Tall',
    description_en: 'Minecraft Steve in tall Micromob format brought the default player character to LEGO. This minifigure featured iconic blue shirt and blocky design faithful to the game. Steve represented every player\'s journey through infinite procedurally generated worlds. This collectible from LEGO Minecraft captured gaming\'s most customizable protagonist in classic appearance.',
    description_de: 'Minecraft Steve im hohen Micromob-Format brachte den Standard-Spieler-Charakter zu LEGO. Diese Minifigur zeigte ikonisches blaues Hemd und blockiges Design treu zum Spiel. Steve repräsentierte die Reise jedes Spielers durch unendliche prozedural generierte Welten. Diese Sammlerfigur aus LEGO Minecraft erfasste den anpassbarsten Protagonisten des Gamings im klassischen Erscheinungsbild.',
    description_fr: 'Steve Minecraft au format grand Micromob apportait le personnage joueur par défaut à LEGO. Cette minifigurine présentait chemise bleue emblématique et design carré fidèle au jeu. Steve représentait le voyage de chaque joueur à travers des mondes infinis générés procéduralement. Cette collection de LEGO Minecraft capturait le protagoniste le plus personnalisable du gaming en apparence classique.',
    description_es: 'Steve de Minecraft en formato alto Micromob traía al personaje jugador predeterminado a LEGO. Esta minifigura presentaba icónica camisa azul y diseño cuadrado fiel al juego. Steve representaba el viaje de cada jugador a través de mundos infinitos generados proceduralmente. Esta colección de LEGO Minecraft capturaba al protagonista más personalizable del gaming en apariencia clásica.'
  },
  {
    minifigure_no: 'min004',
    name: 'Micromob Villager - Tall',
    description_en: 'Minecraft Villager in tall Micromob format brought peaceful NPC to LEGO. This minifigure featured brown robe and distinctive large nose typical of village inhabitants. Villagers offered trades and commerce in blocky world. This collectible from LEGO Minecraft represented the friendly merchant characters essential to gameplay and community building.',
    description_de: 'Minecraft Villager im hohen Micromob-Format brachte friedlichen NPC zu LEGO. Diese Minifigur zeigte braune Robe und charakteristische große Nase typisch für Dorf-Bewohner. Villager boten Handel und Kommerz in blockiger Welt. Diese Sammlerfigur aus LEGO Minecraft repräsentierte die freundlichen Händler-Charaktere wesentlich für Gameplay und Gemeinschaftsaufbau.',
    description_fr: 'Villageois Minecraft au format grand Micromob apportait un PNJ pacifique à LEGO. Cette minifigurine présentait robe brune et grand nez distinctif typique des habitants de village. Les villageois offraient commerce et échanges dans le monde carré. Cette collection de LEGO Minecraft représentait les personnages marchands amicaux essentiels au gameplay et à la construction communautaire.',
    description_es: 'Aldeano de Minecraft en formato alto Micromob traía NPC pacífico a LEGO. Esta minifigura presentaba túnica marrón y distintiva nariz grande típica de habitantes de aldea. Los aldeanos ofrecían comercio y transacciones en mundo cuadrado. Esta colección de LEGO Minecraft representaba los personajes comerciantes amistosos esenciales para el juego y construcción de comunidad.'
  },
  {
    minifigure_no: 'min005',
    name: 'Micromob Zombie - Tall',
    description_en: 'Minecraft Zombie in tall Micromob format brought undead threat to LEGO. This minifigure featured tattered clothing and green rotting skin in blocky style. Zombies emerged at night to attack players and villagers. This collectible from LEGO Minecraft represented the classic hostile mob that defined survival challenge and nighttime danger.',
    description_de: 'Minecraft Zombie im hohen Micromob-Format brachte untote Bedrohung zu LEGO. Diese Minifigur zeigte zerrissene Kleidung und grüne verwesende Haut im blockigen Stil. Zombies erschienen nachts um Spieler und Villager anzugreifen. Diese Sammlerfigur aus LEGO Minecraft repräsentierte den klassischen feindlichen Mob, der Überlebens-Herausforderung und nächtliche Gefahr definierte.',
    description_fr: 'Zombie Minecraft au format grand Micromob apportait menace mort-vivante à LEGO. Cette minifigurine présentait vêtements déchirés et peau verte en décomposition en style carré. Les zombies émergeaient la nuit pour attaquer joueurs et villageois. Cette collection de LEGO Minecraft représentait la foule hostile classique qui définissait le défi de survie et le danger nocturne.',
    description_es: 'Zombi de Minecraft en formato alto Micromob traía amenaza no-muerta a LEGO. Esta minifigura presentaba ropa desgarrada y piel verde en descomposición en estilo cuadrado. Los zombis emergían de noche para atacar jugadores y aldeanos. Esta colección de LEGO Minecraft representaba la turba hostil clásica que definía el desafío de supervivencia y peligro nocturno.'
  },
];

async function updateDescriptions() {
  console.log(`\n🎯 BATCH 7: More Marvel (9 minifigs)\n`);
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
