import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// NINJAGO minifigure descriptions - Batch 1: Core ninja team with variant suits
const batch = [
  {
    minifigure_no: 'njo001',
    name: 'Kai - Kendo Armor',
    description_en: 'Kai the red ninja of fire trained at Sensei Wu\'s monastery wearing traditional kendo armor. His hot-headed personality matched his elemental power. Despite impulsiveness, Kai\'s determination to protect his sister Nya drove his journey to master Spinjitzu. This early variant captured Kai during his initial ninja training.',
    description_de: 'Kai der rote Ninja des Feuers trainierte in Sensei Wus Kloster mit traditioneller Kendo-Rüstung. Seine hitzköpfige Persönlichkeit passte zu seiner elementaren Kraft. Trotz Impulsivität trieb Kais Entschlossenheit, seine Schwester Nya zu schützen, seine Reise, Spinjitzu zu meistern. Diese frühe Variante erfasste Kai während seines anfänglichen Ninja-Trainings.',
    description_fr: 'Kai le ninja rouge du feu s\'entraînait au monastère de Sensei Wu portant une armure de kendo traditionnelle. Sa personnalité impétueuse correspondait à son pouvoir élémentaire. Malgré l\'impulsivité, la détermination de Kai à protéger sa sœur Nya motiva son parcours pour maîtriser le Spinjitzu. Cette variante précoce capturait Kai pendant son entraînement ninja initial.',
    description_es: 'Kai el ninja rojo del fuego entrenaba en el monasterio del Sensei Wu usando armadura de kendo tradicional. Su personalidad impetuosa coincidía con su poder elemental. A pesar de la impulsividad, la determinación de Kai de proteger a su hermana Nya impulsó su viaje para dominar Spinjitzu. Esta variante temprana capturaba a Kai durante su entrenamiento ninja inicial.'
  },
  {
    minifigure_no: 'njo002',
    name: 'Jay - Kendo Armor',
    description_en: 'Jay the blue ninja of lightning combined humor with electrical powers. His kendo armor marked him as Sensei Wu\'s student mastering Spinjitzu. Jay\'s talkative nature and crush on Nya brought levity to the team. This early variant captured Jay as the enthusiastic inventor learning to be a ninja.',
    description_de: 'Jay der blaue Ninja des Blitzes kombinierte Humor mit elektrischen Kräften. Seine Kendo-Rüstung kennzeichnete ihn als Sensei Wus Schüler beim Meistern von Spinjitzu. Jays gesprächige Natur und Schwarm für Nya brachten Leichtigkeit ins Team. Diese frühe Variante erfasste Jay als den begeisterten Erfinder, der lernte, ein Ninja zu sein.',
    description_fr: 'Jay le ninja bleu de la foudre combinait humour et pouvoirs électriques. Son armure de kendo le marquait comme étudiant de Sensei Wu maîtrisant le Spinjitzu. La nature bavarde de Jay et son béguin pour Nya apportaient légèreté à l\'équipe. Cette variante précoce capturait Jay comme l\'inventeur enthousiaste apprenant à être un ninja.',
    description_es: 'Jay el ninja azul del rayo combinaba humor con poderes eléctricos. Su armadura de kendo lo marcaba como estudiante del Sensei Wu dominando Spinjitzu. La naturaleza habladora de Jay y su enamoramiento de Nya traían levedad al equipo. Esta variante temprana capturaba a Jay como el inventor entusiasta aprendiendo a ser un ninja.'
  },
  {
    minifigure_no: 'njo003',
    name: 'Cole - Kendo Armor',
    description_en: 'Cole the black ninja of earth possessed incredible strength and leadership. His kendo armor showed his dedication to martial arts training. As the team\'s unofficial leader before Lloyd, Cole\'s steadfast nature kept the ninja grounded. This early variant captured Cole during his transformation from dancer to warrior.',
    description_de: 'Cole der schwarze Ninja der Erde besaß unglaubliche Stärke und Führung. Seine Kendo-Rüstung zeigte seine Hingabe zum Kampfkunst-Training. Als inoffizieller Anführer des Teams vor Lloyd hielt Coles standhaftes Wesen die Ninjas geerdet. Diese frühe Variante erfasste Cole während seiner Transformation vom Tänzer zum Krieger.',
    description_fr: 'Cole le ninja noir de la terre possédait force incroyable et leadership. Son armure de kendo montrait son dévouement à l\'entraînement d\'arts martiaux. Comme leader non officiel de l\'équipe avant Lloyd, la nature inébranlable de Cole gardait les ninjas ancrés. Cette variante précoce capturait Cole pendant sa transformation de danseur à guerrier.',
    description_es: 'Cole el ninja negro de la tierra poseía fuerza increíble y liderazgo. Su armadura de kendo mostraba su dedicación al entrenamiento de artes marciales. Como líder no oficial del equipo antes de Lloyd, la naturaleza firme de Cole mantenía a los ninjas con los pies en la tierra. Esta variante temprana capturaba a Cole durante su transformación de bailarín a guerrero.'
  },
  {
    minifigure_no: 'njo004',
    name: 'Zane - Kendo Armor',
    description_en: 'Zane the white ninja of ice concealed his identity as a nindroid built by Dr. Julien. His kendo armor helped him train alongside organic teammates. Despite being robotic, Zane possessed the strongest sense of honor and sacrifice. This early variant captured Zane before discovering his true nature.',
    description_de: 'Zane der weiße Ninja des Eises verbarg seine Identität als Nindroid, gebaut von Dr. Julien. Seine Kendo-Rüstung half ihm, zusammen mit organischen Teamkollegen zu trainieren. Trotz robotischer Natur besaß Zane den stärksten Sinn für Ehre und Opfer. Diese frühe Variante erfasste Zane vor der Entdeckung seiner wahren Natur.',
    description_fr: 'Zane le ninja blanc de la glace dissimulait son identité de nindroïde construit par Dr. Julien. Son armure de kendo l\'aidait à s\'entraîner aux côtés de coéquipiers organiques. Malgré sa nature robotique, Zane possédait le sens le plus fort de l\'honneur et du sacrifice. Cette variante précoce capturait Zane avant de découvrir sa vraie nature.',
    description_es: 'Zane el ninja blanco del hielo ocultaba su identidad como nindroide construido por el Dr. Julien. Su armadura de kendo le ayudaba a entrenar junto a compañeros orgánicos. A pesar de ser robótico, Zane poseía el sentido más fuerte de honor y sacrificio. Esta variante temprana capturaba a Zane antes de descubrir su verdadera naturaleza.'
  },
  {
    minifigure_no: 'njo048',
    name: 'Lloyd Garmadon - Green Ninja Suit',
    description_en: 'Lloyd Garmadon fulfilled his destiny as the legendary Green Ninja. His green suit marked him as the chosen one destined to defeat evil. Despite being Lord Garmadon\'s son, Lloyd chose heroism over darkness. This variant captured Lloyd embracing his role as leader and master of the Golden Power.',
    description_de: 'Lloyd Garmadon erfüllte sein Schicksal als der legendäre Grüne Ninja. Sein grüner Anzug kennzeichnete ihn als den Auserwählten, bestimmt das Böse zu besiegen. Trotz Lord Garmadons Sohn wählte Lloyd Heroismus über Dunkelheit. Diese Variante erfasste Lloyd beim Annehmen seiner Rolle als Anführer und Meister der Goldenen Macht.',
    description_fr: 'Lloyd Garmadon accomplit son destin comme le légendaire Ninja Vert. Son costume vert le marquait comme l\'élu destiné à vaincre le mal. Malgré son statut de fils de Lord Garmadon, Lloyd choisit l\'héroïsme plutôt que les ténèbres. Cette variante capturait Lloyd embrassant son rôle de leader et maître du Pouvoir Doré.',
    description_es: 'Lloyd Garmadon cumplió su destino como el legendario Ninja Verde. Su traje verde lo marcaba como el elegido destinado a derrotar el mal. A pesar de ser hijo de Lord Garmadon, Lloyd eligió el heroísmo sobre la oscuridad. Esta variante capturaba a Lloyd abrazando su rol como líder y maestro del Poder Dorado.'
  },
  {
    minifigure_no: 'njo055',
    name: 'Nya - Samurai X Armor',
    description_en: 'Nya secretly operated as Samurai X before revealing her identity. Her mechanized armor and exo-suit allowed her to fight alongside the ninja. Despite lacking elemental powers initially, Nya\'s engineering genius made her invaluable. This variant captured Nya as the independent warrior forging her own path.',
    description_de: 'Nya operierte heimlich als Samurai X, bevor sie ihre Identität enthüllte. Ihre mechanisierte Rüstung und Exo-Anzug erlaubten ihr, an der Seite der Ninjas zu kämpfen. Trotz anfangs fehlender elementarer Kräfte machte Nyas technisches Genie sie unschätzbar. Diese Variante erfasste Nya als die unabhängige Kriegerin, die ihren eigenen Weg schmiedete.',
    description_fr: 'Nya opérait secrètement comme Samurai X avant de révéler son identité. Son armure mécanisée et exo-combinaison lui permettaient de combattre aux côtés des ninjas. Malgré l\'absence initiale de pouvoirs élémentaires, le génie d\'ingénierie de Nya la rendait inestimable. Cette variante capturait Nya comme la guerrière indépendante forgeant sa propre voie.',
    description_es: 'Nya operaba secretamente como Samurai X antes de revelar su identidad. Su armadura mecanizada y exo-traje le permitían luchar junto a los ninjas. A pesar de carecer inicialmente de poderes elementales, el genio de ingeniería de Nya la hacía invaluable. Esta variante capturaba a Nya como la guerrera independiente forjando su propio camino.'
  },
  {
    minifigure_no: 'njo070',
    name: 'Kai - ZX Robe, Armor Shoulder Pad',
    description_en: 'Kai in ZX armor upgraded his abilities with enhanced protection and power. The shoulder pad and reinforced robe marked his growth as a ninja. This advanced suit helped Kai face greater threats to Ninjago. This variant captured Kai\'s evolution into a more experienced warrior.',
    description_de: 'Kai in ZX-Rüstung verbesserte seine Fähigkeiten mit verstärktem Schutz und Kraft. Die Schulterpanzerung und verstärkte Robe kennzeichneten sein Wachstum als Ninja. Dieser fortgeschrittene Anzug half Kai, größere Bedrohungen für Ninjago zu begegnen. Diese Variante erfasste Kais Evolution zu einem erfahreneren Krieger.',
    description_fr: 'Kai dans l\'armure ZX améliora ses capacités avec protection et puissance renforcées. L\'épaulière et la robe renforcée marquaient sa croissance comme ninja. Ce costume avancé aida Kai à affronter de plus grandes menaces pour Ninjago. Cette variante capturait l\'évolution de Kai en guerrier plus expérimenté.',
    description_es: 'Kai en armadura ZX mejoró sus habilidades con protección y poder mejorados. La hombrera y túnica reforzada marcaban su crecimiento como ninja. Este traje avanzado ayudó a Kai a enfrentar mayores amenazas a Ninjago. Esta variante capturaba la evolución de Kai a un guerrero más experimentado.'
  },
  {
    minifigure_no: 'njo226',
    name: 'Kai - Deepstone Armor',
    description_en: 'Kai wore Deepstone armor specifically designed to combat ghosts. The mystical Deepstone metal allowed physical interaction with spectral enemies. This specialized suit helped Kai fight Morro and the Preeminent\'s ghost army. This variant captured Kai adapting to supernatural threats.',
    description_de: 'Kai trug Deepstone-Rüstung speziell entworfen, um Geister zu bekämpfen. Das mystische Deepstone-Metall erlaubte physische Interaktion mit spektralen Feinden. Dieser spezialisierte Anzug half Kai, Morro und die Geisterarmee der Preeminent zu bekämpfen. Diese Variante erfasste Kai beim Anpassen an übernatürliche Bedrohungen.',
    description_fr: 'Kai portait une armure de Deepstone spécialement conçue pour combattre les fantômes. Le métal mystique Deepstone permettait l\'interaction physique avec les ennemis spectraux. Ce costume spécialisé aida Kai à combattre Morro et l\'armée fantôme de la Preeminent. Cette variante capturait Kai s\'adaptant aux menaces surnaturelles.',
    description_es: 'Kai usaba armadura de Deepstone diseñada específicamente para combatir fantasmas. El metal místico Deepstone permitía interacción física con enemigos espectrales. Este traje especializado ayudó a Kai a luchar contra Morro y el ejército fantasma de la Preeminente. Esta variante capturaba a Kai adaptándose a amenazas sobrenaturales.'
  }
];

async function updateDescriptions() {
  console.log(`Starting NINJAGO minifigure description updates (Batch 1)...`);
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

  console.log(`\n✅ NINJAGO Batch 1 descriptions update complete!`);
  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
