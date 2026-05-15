import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// FLAGSHIP BATCH 11: Princesses + Harry Potter
const batch = [
  {
    minifigure_no: 'dp011',
    name: 'Aurora - Closed Mouth',
    description_en: 'Aurora with closed mouth brought Sleeping Beauty to LEGO form. This minifigure featured pink dress, blonde hair, and serene expression. The cursed princess awaited true love\'s kiss. This collectible from LEGO Disney Princess represented the graceful character who slept for one hundred years until awakened by destiny.',
    description_de: 'Aurora mit geschlossenem Mund brachte Dornröschen in LEGO-Form. Diese Minifigur zeigte rosa Kleid, blondes Haar und ruhigen Ausdruck. Die verfluchte Prinzessin wartete auf den Kuss der wahren Liebe. Diese Sammlerfigur aus LEGO Disney Princess repräsentierte die anmutige Figur, die hundert Jahre schlief bis vom Schicksal geweckt.',
    description_fr: 'Aurore avec bouche fermée apportait la Belle au Bois Dormant en forme LEGO. Cette minifigurine présentait robe rose, cheveux blonds et expression sereine. La princesse maudite attendait le baiser du véritable amour. Cette collection de LEGO Disney Princess représentait le personnage gracieux qui dormit cent ans jusqu\'à être réveillé par le destin.',
    description_es: 'Aurora con boca cerrada traía a la Bella Durmiente en forma LEGO. Esta minifigura presentaba vestido rosa, cabello rubio y expresión serena. La princesa maldita esperaba el beso del amor verdadero. Esta colección de LEGO Disney Princess representaba al personaje elegante que durmió cien años hasta ser despertada por el destino.'
  },
  {
    minifigure_no: 'dp012',
    name: 'Jasmine',
    description_en: 'Jasmine brought the Arabian princess to LEGO form. This minifigure featured turquoise outfit, black hair, and confident expression. The independent princess refused arranged marriage. This collectible from LEGO Disney Princess Aladdin represented the strong-willed character who chose love over status and adventure over palace walls.',
    description_de: 'Jasmine brachte die arabische Prinzessin in LEGO-Form. Diese Minifigur zeigte türkisfarbenes Outfit, schwarzes Haar und selbstbewussten Ausdruck. Die unabhängige Prinzessin verweigerte arrangierte Ehe. Diese Sammlerfigur aus LEGO Disney Princess Aladdin repräsentierte die willensstarke Figur, die Liebe über Status und Abenteuer über Palast-Mauern wählte.',
    description_fr: 'Jasmine apportait la princesse arabe en forme LEGO. Cette minifigurine présentait tenue turquoise, cheveux noirs et expression confiante. La princesse indépendante refusait le mariage arrangé. Cette collection de LEGO Disney Princess Aladdin représentait le personnage volontaire qui choisit l\'amour plutôt que le statut et l\'aventure plutôt que les murs du palais.',
    description_es: 'Jasmine traía a la princesa árabe en forma LEGO. Esta minifigura presentaba atuendo turquesa, cabello negro y expresión confiada. La princesa independiente rechazaba matrimonio arreglado. Esta colección de LEGO Disney Princess Aladdín representaba al personaje de voluntad fuerte que eligió amor sobre estatus y aventura sobre muros de palacio.'
  },
  {
    minifigure_no: 'dp015',
    name: 'Elsa',
    description_en: 'Elsa brought the ice queen to LEGO form. This minifigure featured sparkly blue dress, blonde braid, and regal appearance. The powerful sorceress controlled ice and snow. This collectible from LEGO Disney Princess Frozen represented the character who learned to embrace her powers and let it go.',
    description_de: 'Elsa brachte die Eiskönigin in LEGO-Form. Diese Minifigur zeigte funkelndes blaues Kleid, blonden Zopf und königliches Erscheinungsbild. Die mächtige Zauberin kontrollierte Eis und Schnee. Diese Sammlerfigur aus LEGO Disney Princess Frozen repräsentierte die Figur, die lernte ihre Kräfte zu umarmen und loszulassen.',
    description_fr: 'Elsa apportait la reine des neiges en forme LEGO. Cette minifigurine présentait robe bleue scintillante, tresse blonde et apparence royale. La puissante sorcière contrôlait glace et neige. Cette collection de LEGO Disney Princess Frozen représentait le personnage qui apprit à embrasser ses pouvoirs et à laisser aller.',
    description_es: 'Elsa traía a la reina del hielo en forma LEGO. Esta minifigura presentaba vestido azul brillante, trenza rubia y apariencia regia. La poderosa hechicera controlaba hielo y nieve. Esta colección de LEGO Disney Princess Frozen representaba al personaje que aprendió a abrazar sus poderes y dejarlo ir.'
  },
  {
    minifigure_no: 'dp016',
    name: 'Anna',
    description_en: 'Anna brought Elsa\'s brave sister to LEGO form. This minifigure featured colorful dress, braided hair, and determined expression. The fearless princess journeyed to save her sister. This collectible from LEGO Disney Princess Frozen represented the optimistic character whose love and courage melted frozen hearts.',
    description_de: 'Anna brachte Elsas mutige Schwester in LEGO-Form. Diese Minifigur zeigte buntes Kleid, geflochtenes Haar und entschlossenen Ausdruck. Die furchtlose Prinzessin reiste um ihre Schwester zu retten. Diese Sammlerfigur aus LEGO Disney Princess Frozen repräsentierte die optimistische Figur deren Liebe und Mut gefrorene Herzen schmolz.',
    description_fr: 'Anna apportait la courageuse sœur d\'Elsa en forme LEGO. Cette minifigurine présentait robe colorée, cheveux tressés et expression déterminée. La princesse intrépide voyagea pour sauver sa sœur. Cette collection de LEGO Disney Princess Frozen représentait le personnage optimiste dont l\'amour et le courage firent fondre les cœurs gelés.',
    description_es: 'Anna traía a la valiente hermana de Elsa en forma LEGO. Esta minifigura presentaba vestido colorido, cabello trenzado y expresión determinada. La princesa intrépida viajó para salvar a su hermana. Esta colección de LEGO Disney Princess Frozen representaba al personaje optimista cuyo amor y valor derritieron corazones congelados.'
  },
  {
    minifigure_no: 'hp001',
    name: 'Hermione Granger',
    description_en: 'Hermione Granger brought the brightest witch to LEGO form. This minifigure featured Gryffindor robes, bushy brown hair, and determined expression. The brilliant student excelled at every spell. This collectible from LEGO Harry Potter represented the loyal friend whose intelligence and courage saved the wizarding world countless times.',
    description_de: 'Hermione Granger brachte die klügste Hexe in LEGO-Form. Diese Minifigur zeigte Gryffindor-Roben, buschiges braunes Haar und entschlossenen Ausdruck. Die brillante Schülerin meisterte jeden Zauber. Diese Sammlerfigur aus LEGO Harry Potter repräsentierte die treue Freundin deren Intelligenz und Mut die Zauberwelt unzählige Male rettete.',
    description_fr: 'Hermione Granger apportait la sorcière la plus brillante en forme LEGO. Cette minifigurine présentait robes Gryffondor, cheveux bruns touffus et expression déterminée. L\'étudiante brillante excellait à chaque sort. Cette collection de LEGO Harry Potter représentait l\'amie loyale dont l\'intelligence et le courage sauvèrent le monde des sorciers d\'innombrables fois.',
    description_es: 'Hermione Granger traía a la bruja más brillante en forma LEGO. Esta minifigura presentaba túnicas de Gryffindor, cabello castaño alborotado y expresión determinada. La estudiante brillante sobresalía en cada hechizo. Esta colección de LEGO Harry Potter representaba a la amiga leal cuya inteligencia y valor salvaron el mundo mágico innumerables veces.'
  },
  {
    minifigure_no: 'hp005',
    name: 'Harry Potter',
    description_en: 'Harry Potter brought the Boy Who Lived to LEGO form. This minifigure featured iconic lightning bolt scar, round glasses, and Gryffindor robes. The chosen one defeated the Dark Lord. This collectible from LEGO Harry Potter represented the orphaned wizard who became the greatest hero in magical history.',
    description_de: 'Harry Potter brachte den Jungen der lebte in LEGO-Form. Diese Minifigur zeigte ikonische Blitz-Narbe, runde Brille und Gryffindor-Roben. Der Auserwählte besiegte den Dunklen Lord. Diese Sammlerfigur aus LEGO Harry Potter repräsentierte den verwaisten Zauberer, der zum größten Helden der magischen Geschichte wurde.',
    description_fr: 'Harry Potter apportait le Garçon qui a survécu en forme LEGO. Cette minifigurine présentait cicatrice emblématique en éclair, lunettes rondes et robes Gryffondor. L\'élu vainquit le Seigneur des Ténèbres. Cette collection de LEGO Harry Potter représentait le sorcier orphelin qui devint le plus grand héros de l\'histoire magique.',
    description_es: 'Harry Potter traía al Niño que Vivió en forma LEGO. Esta minifigura presentaba icónica cicatriz de rayo, gafas redondas y túnicas de Gryffindor. El elegido derrotó al Señor Oscuro. Esta colección de LEGO Harry Potter representaba al mago huérfano que se convirtió en el mayor héroe de la historia mágica.'
  },
  {
    minifigure_no: 'hp006',
    name: 'Ron Weasley',
    description_en: 'Ron Weasley brought Harry\'s loyal best friend to LEGO form. This minifigure featured red hair, freckles, and Gryffindor robes. The brave Weasley stood by Harry through every challenge. This collectible from LEGO Harry Potter represented the faithful companion whose humor and courage proved essential to defeating darkness.',
    description_de: 'Ron Weasley brachte Harrys treuen besten Freund in LEGO-Form. Diese Minifigur zeigte rotes Haar, Sommersprossen und Gryffindor-Roben. Der mutige Weasley stand Harry bei jeder Herausforderung bei. Diese Sammlerfigur aus LEGO Harry Potter repräsentierte den treuen Begleiter dessen Humor und Mut wesentlich waren um Dunkelheit zu besiegen.',
    description_fr: 'Ron Weasley apportait le meilleur ami loyal de Harry en forme LEGO. Cette minifigurine présentait cheveux roux, taches de rousseur et robes Gryffondor. Le courageux Weasley resta aux côtés de Harry à travers chaque défi. Cette collection de LEGO Harry Potter représentait le compagnon fidèle dont l\'humour et le courage se révélèrent essentiels pour vaincre les ténèbres.',
    description_es: 'Ron Weasley traía al mejor amigo leal de Harry en forma LEGO. Esta minifigura presentaba cabello rojo, pecas y túnicas de Gryffindor. El valiente Weasley permaneció junto a Harry en cada desafío. Esta colección de LEGO Harry Potter representaba al compañero fiel cuyo humor y valor resultaron esenciales para derrotar la oscuridad.'
  },
  {
    minifigure_no: 'hp008',
    name: 'Albus Dumbledore',
    description_en: 'Albus Dumbledore brought the greatest wizard to LEGO form. This minifigure featured long silver beard, half-moon spectacles, and flowing robes. The wise headmaster guided Harry. This collectible from LEGO Harry Potter represented the powerful mentor whose wisdom and sacrifice protected the wizarding world.',
    description_de: 'Albus Dumbledore brachte den größten Zauberer in LEGO-Form. Diese Minifigur zeigte langen silbernen Bart, Halbmond-Brille und fließende Roben. Der weise Schulleiter führte Harry. Diese Sammlerfigur aus LEGO Harry Potter repräsentierte den mächtigen Mentor dessen Weisheit und Opfer die Zauberwelt schützten.',
    description_fr: 'Albus Dumbledore apportait le plus grand sorcier en forme LEGO. Cette minifigurine présentait longue barbe argentée, lunettes en demi-lune et robes fluides. Le sage directeur guida Harry. Cette collection de LEGO Harry Potter représentait le mentor puissant dont la sagesse et le sacrifice protégèrent le monde des sorciers.',
    description_es: 'Albus Dumbledore traía al mayor mago en forma LEGO. Esta minifigura presentaba larga barba plateada, gafas de media luna y túnicas fluidas. El sabio director guió a Harry. Esta colección de LEGO Harry Potter representaba al mentor poderoso cuya sabiduría y sacrificio protegieron el mundo mágico.'
  },
];

async function updateDescriptions() {
  console.log(`\n🎯 BATCH 11: Princesses + Harry Potter (8 minifigs)\n`);
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
