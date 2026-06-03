import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// FLAGSHIP BATCH 4: More Marvel/DC
const batch = [
  {
    minifigure_no: 'sh0256',
    name: 'The Scarlet Witch',
    description_en: 'The Scarlet Witch wielded reality-altering chaos magic with devastating power. This LEGO minifigure featured distinctive red costume with flowing cape and crown headpiece. Wanda Maximoff\'s abilities made her one of the most powerful Avengers. This collectible from Doctor Strange sets captured the mystical hero who could reshape existence itself.',
    description_de: 'Die Scarlet Witch handhabte realitätsverändernde Chaos-Magie mit verheerender Kraft. Diese LEGO-Minifigur zeigte charakteristisches rotes Kostüm mit fließendem Umhang und Kronen-Kopfschmuck. Wanda Maximoffs Fähigkeiten machten sie zu einer der mächtigsten Avengers. Diese Sammlerfigur aus Doctor Strange Sets erfasste die mystische Heldin, die die Existenz selbst umformen konnte.',
    description_fr: 'La Sorcière Rouge maniait une magie du chaos altérant la réalité avec un pouvoir dévastateur. Cette minifigurine LEGO présentait un costume rouge distinctif avec cape fluide et coiffe couronne. Les capacités de Wanda Maximoff en faisaient l\'une des Avengers les plus puissantes. Cette collection des ensembles Doctor Strange capturait l\'héroïne mystique qui pouvait remodeler l\'existence elle-même.',
    description_es: 'La Bruja Escarlata manejaba magia de caos que alteraba la realidad con poder devastador. Esta minifigura LEGO presentaba distintivo traje rojo con capa fluida y tocado de corona. Las habilidades de Wanda Maximoff la convertían en una de las Avengers más poderosas. Esta colección de sets de Doctor Strange capturaba a la heroína mística que podía remodelar la existencia misma.'
  },
  {
    minifigure_no: 'sh0257',
    name: 'Winter Soldier',
    description_en: 'Winter Soldier emerged from the shadows as a deadly assassin with a metal arm. This LEGO minifigure featured tactical gear, dark outfit, and distinctive bionic limb. Bucky Barnes transformed from Captain America\'s friend into HYDRA\'s most dangerous weapon. This collectible from Captain America: Civil War represented the conflicted soldier seeking redemption.',
    description_de: 'Winter Soldier tauchte aus den Schatten als tödlicher Attentäter mit Metall-Arm auf. Diese LEGO-Minifigur zeigte taktische Ausrüstung, dunkles Outfit und charakteristische bionische Gliedmaße. Bucky Barnes verwandelte sich von Captain Americas Freund in HYDRAs gefährlichste Waffe. Diese Sammlerfigur aus Captain America: Civil War repräsentierte den zerrissenen Soldaten auf der Suche nach Erlösung.',
    description_fr: 'Le Soldat de l\'Hiver émergea des ombres comme assassin mortel avec bras métallique. Cette minifigurine LEGO présentait équipement tactique, tenue sombre et membre bionique distinctif. Bucky Barnes se transforma d\'ami de Captain America en arme la plus dangereuse d\'HYDRA. Cette collection de Captain America: Civil War représentait le soldat en conflit cherchant la rédemption.',
    description_es: 'El Soldado de Invierno emergió de las sombras como asesino mortal con brazo metálico. Esta minifigura LEGO presentaba equipo táctico, atuendo oscuro y distintiva extremidad biónica. Bucky Barnes se transformó de amigo de Captain America en el arma más peligrosa de HYDRA. Esta colección de Captain America: Civil War representaba al soldado en conflicto buscando redención.'
  },
  {
    minifigure_no: 'sh0269',
    name: 'Scorpion',
    description_en: 'Scorpion stalked Spider-Man with a powerful mechanical tail and venomous attitude. This LEGO minifigure featured green armor with distinctive tail piece accessory. Mac Gargan\'s transformation into a super-villain created one of the web-slinger\'s deadliest foes. This collectible from Spider-Man sets captured the armored predator who matched Spider-Man\'s agility.',
    description_de: 'Scorpion jagte Spider-Man mit einem kraftvollen mechanischen Schwanz und giftiger Einstellung. Diese LEGO-Minifigur zeigte grüne Rüstung mit charakteristischem Schwanz-Teil-Zubehör. Mac Gargans Verwandlung in einen Super-Schurken schuf einen der tödlichsten Feinde des Netzschleuderers. Diese Sammlerfigur aus Spider-Man Sets erfasste den gepanzerten Raubtier, der Spider-Mans Agilität entsprach.',
    description_fr: 'Scorpion traquait Spider-Man avec queue mécanique puissante et attitude venimeuse. Cette minifigurine LEGO présentait armure verte avec accessoire de queue distinctif. La transformation de Mac Gargan en super-vilain créa l\'un des ennemis les plus mortels du lanceur de toiles. Cette collection des ensembles Spider-Man capturait le prédateur blindé qui égalait l\'agilité de Spider-Man.',
    description_es: 'Escorpión acechaba a Spider-Man con poderosa cola mecánica y actitud venenosa. Esta minifigura LEGO presentaba armadura verde con distintivo accesorio de cola. La transformación de Mac Gargan en supervillano creó uno de los enemigos más mortales del lanzador de telarañas. Esta colección de sets de Spider-Man capturaba al depredador blindado que igualaba la agilidad de Spider-Man.'
  },
  {
    minifigure_no: 'sh0270',
    name: 'Kraven The Hunter',
    description_en: 'Kraven The Hunter pursued Spider-Man as the ultimate prey in his twisted safari. This LEGO minifigure featured safari vest, distinctive facial hair, and hunter accessories. Sergei Kravinoff\'s obsession with defeating the web-slinger drove him to extreme measures. This collectible from Spider-Man sets represented the big-game hunter who saw heroes as trophies.',
    description_de: 'Kraven The Hunter verfolgte Spider-Man als ultimative Beute in seiner verdrehten Safari. Diese LEGO-Minifigur zeigte Safari-Weste, charakteristischen Gesichtsbehaarung und Jäger-Zubehör. Sergei Kravinoffs Besessenheit, den Netzschleuderer zu besiegen, trieb ihn zu extremen Maßnahmen. Diese Sammlerfigur aus Spider-Man Sets repräsentierte den Großwildjäger, der Helden als Trophäen sah.',
    description_fr: 'Kraven le Chasseur poursuivait Spider-Man comme proie ultime dans son safari tordu. Cette minifigurine LEGO présentait gilet safari, pilosité faciale distinctive et accessoires de chasseur. L\'obsession de Sergei Kravinoff de vaincre le lanceur de toiles le poussa à des mesures extrêmes. Cette collection des ensembles Spider-Man représentait le chasseur de gros gibier qui voyait les héros comme trophées.',
    description_es: 'Kraven el Cazador perseguía a Spider-Man como presa definitiva en su safari retorcido. Esta minifigura LEGO presentaba chaleco safari, distintivo vello facial y accesorios de cazador. La obsesión de Sergei Kravinoff con derrotar al lanzador de telarañas lo llevó a medidas extremas. Esta colección de sets de Spider-Man representaba al cazador de caza mayor que veía a los héroes como trofeos.'
  },
  {
    minifigure_no: 'sh0271',
    name: 'Green Goblin',
    description_en: 'Green Goblin terrorized New York City as Spider-Man\'s most dangerous nemesis. This LEGO minifigure featured purple costume, goblin mask, and signature glider accessory. Norman Osborn\'s descent into madness created a villain of unmatched cunning and cruelty. This collectible from Spider-Man sets captured the cackling menace who knew Peter Parker\'s secret identity.',
    description_de: 'Green Goblin terrorisierte New York City als Spider-Mans gefährlichster Erzfeind. Diese LEGO-Minifigur zeigte lila Kostüm, Kobold-Maske und charakteristisches Gleiter-Zubehör. Norman Osborns Abstieg in den Wahnsinn schuf einen Schurken von unübertroffener Gerissenheit und Grausamkeit. Diese Sammlerfigur aus Spider-Man Sets erfasste die kichernde Bedrohung, die Peter Parkers Geheimidentität kannte.',
    description_fr: 'Le Bouffon Vert terrorisait New York comme némésis la plus dangereuse de Spider-Man. Cette minifigurine LEGO présentait costume violet, masque de gobelin et accessoire planeur signature. La descente de Norman Osborn dans la folie créa un vilain de ruse et cruauté inégalées. Cette collection des ensembles Spider-Man capturait la menace ricanante qui connaissait l\'identité secrète de Peter Parker.',
    description_es: 'El Duende Verde aterrorizaba la Ciudad de Nueva York como némesis más peligrosa de Spider-Man. Esta minifigura LEGO presentaba traje morado, máscara de duende y accesorio planeador característico. El descenso de Norman Osborn a la locura creó un villano de astucia y crueldad sin igual. Esta colección de sets de Spider-Man capturaba la amenaza cacareante que conocía la identidad secreta de Peter Parker.'
  },
  {
    minifigure_no: 'sh0272',
    name: 'Aunt May',
    description_en: 'Aunt May provided wisdom and unconditional love as Peter Parker\'s guardian. This LEGO minifigure featured casual attire and kind expression. May Parker\'s strength and resilience anchored Spider-Man through every crisis. This collectible from Spider-Man sets represented the heart of Peter\'s world who never gave up hope.',
    description_de: 'Tante May bot Weisheit und bedingungslose Liebe als Peter Parkers Vormund. Diese LEGO-Minifigur zeigte lässige Kleidung und freundlichen Ausdruck. May Parkers Stärke und Widerstandsfähigkeit verankerten Spider-Man durch jede Krise. Diese Sammlerfigur aus Spider-Man Sets repräsentierte das Herz von Peters Welt, die niemals die Hoffnung aufgab.',
    description_fr: 'Tante May fournissait sagesse et amour inconditionnel comme tutrice de Peter Parker. Cette minifigurine LEGO présentait tenue décontractée et expression bienveillante. La force et résilience de May Parker ancraient Spider-Man à travers chaque crise. Cette collection des ensembles Spider-Man représentait le cœur du monde de Peter qui n\'abandonnait jamais l\'espoir.',
    description_es: 'La Tía May proporcionaba sabiduría y amor incondicional como tutora de Peter Parker. Esta minifigura LEGO presentaba atuendo casual y expresión amable. La fuerza y resistencia de May Parker anclaban a Spider-Man a través de cada crisis. Esta colección de sets de Spider-Man representaba el corazón del mundo de Peter que nunca perdía la esperanza.'
  },
  {
    minifigure_no: 'sh0273',
    name: 'Spider-Girl',
    description_en: 'Spider-Girl swung into action as the next generation of web-slinging heroes. This LEGO minifigure featured pink and white costume with web pattern design. Whether Anya Corazon or another spider-powered hero, she brought fresh energy to Spider-Man\'s legacy. This collectible from Spider-Man sets represented the future of spider-heroes.',
    description_de: 'Spider-Girl schwang sich in Aktion als nächste Generation netzschleudernder Helden. Diese LEGO-Minifigur zeigte rosa-weißes Kostüm mit Netz-Muster-Design. Ob Anya Corazon oder eine andere spinnen-gestärkte Heldin, sie brachte frische Energie zu Spider-Mans Vermächtnis. Diese Sammlerfigur aus Spider-Man Sets repräsentierte die Zukunft der Spinnen-Helden.',
    description_fr: 'Spider-Girl se lança dans l\'action comme prochaine génération de héros lanceurs de toiles. Cette minifigurine LEGO présentait costume rose et blanc avec design de motif de toile. Qu\'il s\'agisse d\'Anya Corazon ou d\'une autre héroïne aux pouvoirs d\'araignée, elle apportait énergie fraîche à l\'héritage de Spider-Man. Cette collection des ensembles Spider-Man représentait l\'avenir des héros-araignées.',
    description_es: 'Spider-Girl se lanzó a la acción como siguiente generación de héroes lanzadores de telarañas. Esta minifigura LEGO presentaba traje rosa y blanco con diseño de patrón de telaraña. Ya sea Anya Corazon u otra heroína con poderes de araña, traía energía fresca al legado de Spider-Man. Esta colección de sets de Spider-Man representaba el futuro de los héroes araña.'
  },
  {
    minifigure_no: 'sh0016',
    name: 'Batman - Black Suit',
    description_en: 'Batman in all-black suit embodied the Dark Knight at his most intimidating. This LEGO minifigure featured solid black costume with minimal grey accents and cowl. Bruce Wayne\'s shadowy appearance struck fear into Gotham\'s criminals. This collectible from early Batman sets represented the stealthy protector who emerged from darkness itself.',
    description_de: 'Batman im komplett schwarzen Anzug verkörperte den dunklen Ritter auf seiner einschüchterndsten Art. Diese LEGO-Minifigur zeigte solides schwarzes Kostüm mit minimalen grauen Akzenten und Kapuze. Bruce Waynes schattenhafte Erscheinung jagte Gothams Verbrechern Angst ein. Diese Sammlerfigur aus frühen Batman Sets repräsentierte den versteckten Beschützer, der aus der Dunkelheit selbst hervortrat.',
    description_fr: 'Batman en costume entièrement noir incarnait le Chevalier Noir à son plus intimidant. Cette minifigurine LEGO présentait costume noir uni avec accents gris minimaux et cagoule. L\'apparence sombre de Bruce Wayne inspirait la peur aux criminels de Gotham. Cette collection des premiers ensembles Batman représentait le protecteur furtif qui émergeait des ténèbres elles-mêmes.',
    description_es: 'Batman en traje completamente negro encarnaba al Caballero Oscuro en su forma más intimidante. Esta minifigura LEGO presentaba traje negro sólido con mínimos acentos grises y capucha. La apariencia sombría de Bruce Wayne infundía miedo en los criminales de Gotham. Esta colección de sets tempranos de Batman representaba al protector sigiloso que emergía de la oscuridad misma.'
  }
];

async function updateDescriptions() {
  console.log(`\n🎯 BATCH 4: More Marvel/DC (8 minifigs)\n`);
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
