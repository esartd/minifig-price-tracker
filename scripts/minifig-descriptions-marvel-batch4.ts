import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Marvel minifigure descriptions - Batch 4: Ant-Man, Wasp, Defenders, and street-level heroes
const batch = [
  {
    minifigure_no: 'sh0201',
    name: 'Ant-Man - Scott Lang, Helmet with Red Eyes',
    description_en: 'Ant-Man represented Scott Lang as the reformed thief who became a hero. His helmet with red eyes controlled the suit\'s size-changing abilities. Despite starting as a criminal, Scott\'s love for his daughter drove him to do better. This variant captured Ant-Man mastering the quantum realm and joining the Avengers.',
    description_de: 'Ant-Man repräsentierte Scott Lang als den geläuterten Dieb, der zum Helden wurde. Sein Helm mit roten Augen kontrollierte die größenverändernden Fähigkeiten des Anzugs. Trotz krimineller Vergangenheit trieb Scotts Liebe zu seiner Tochter ihn an, besser zu werden. Diese Variante erfasste Ant-Man beim Meistern des Quantenreichs und Beitritt zu den Avengers.',
    description_fr: 'Ant-Man représentait Scott Lang comme le voleur réformé devenu héros. Son casque avec yeux rouges contrôlait les capacités de changement de taille du costume. Malgré des débuts de criminel, l\'amour de Scott pour sa fille le poussa à faire mieux. Cette variante capturait Ant-Man maîtrisant le royaume quantique et rejoignant les Avengers.',
    description_es: 'Ant-Man representaba a Scott Lang como el ladrón reformado que se convirtió en héroe. Su casco con ojos rojos controlaba las habilidades de cambio de tamaño del traje. A pesar de comenzar como criminal, el amor de Scott por su hija lo impulsó a mejorar. Esta variante capturaba a Ant-Man dominando el reino cuántico y uniéndose a los Vengadores.'
  },
  {
    minifigure_no: 'sh0516',
    name: 'The Wasp - Hope van Dyne, Wings, Yellow Suit',
    description_en: 'The Wasp showcased Hope van Dyne finally donning her mother\'s mantle. Her yellow suit with wings made her more agile than Ant-Man. Hope\'s determination to honor Janet van Dyne\'s legacy drove her heroism. This variant captured The Wasp as a skilled fighter proving herself worthy of the name.',
    description_de: 'The Wasp zeigte Hope van Dyne, die endlich den Mantel ihrer Mutter annahm. Ihr gelber Anzug mit Flügeln machte sie agiler als Ant-Man. Hopes Entschlossenheit, Janet van Dynes Vermächtnis zu ehren, trieb ihren Heroismus an. Diese Variante erfasste The Wasp als geschickte Kämpferin, die sich des Namens würdig erwies.',
    description_fr: 'La Guêpe présentait Hope van Dyne endossant enfin le manteau de sa mère. Son costume jaune avec ailes la rendait plus agile qu\'Ant-Man. La détermination de Hope à honorer l\'héritage de Janet van Dyne motivait son héroïsme. Cette variante capturait La Guêpe comme une combattante qualifiée se prouvant digne du nom.',
    description_es: 'La Avispa mostraba a Hope van Dyne finalmente asumiendo el manto de su madre. Su traje amarillo con alas la hacía más ágil que Ant-Man. La determinación de Hope de honrar el legado de Janet van Dyne impulsaba su heroísmo. Esta variante capturaba a La Avispa como una luchadora hábil demostrando ser digna del nombre.'
  },
  {
    minifigure_no: 'sh0344',
    name: 'Daredevil - Red Suit, Billy Clubs',
    description_en: 'Daredevil protected Hell\'s Kitchen as the blind lawyer with enhanced senses. His red suit and billy clubs became symbols of street-level justice. Matt Murdock\'s Catholic guilt and determination to help created internal conflict. This variant captured the Man Without Fear fighting crime in New York\'s shadows.',
    description_de: 'Daredevil schützte Hell\'s Kitchen als blinder Anwalt mit verstärkten Sinnen. Sein roter Anzug und Billy Clubs wurden zu Symbolen der Straßengerechtigkeit. Matt Murdocks katholische Schuldgefühle und Entschlossenheit zu helfen schufen inneren Konflikt. Diese Variante erfasste den Mann ohne Furcht beim Verbrechensbekämpfen in New Yorks Schatten.',
    description_fr: 'Daredevil protégeait Hell\'s Kitchen comme l\'avocat aveugle aux sens améliorés. Son costume rouge et matraques devinrent symboles de justice de rue. La culpabilité catholique et la détermination d\'aider de Matt Murdock créaient un conflit interne. Cette variante capturait l\'Homme sans Peur combattant le crime dans les ombres de New York.',
    description_es: 'Daredevil protegía Hell\'s Kitchen como el abogado ciego con sentidos mejorados. Su traje rojo y porras se convirtieron en símbolos de justicia callejera. La culpa católica y determinación de ayudar de Matt Murdock creaban conflicto interno. Esta variante capturaba al Hombre sin Miedo luchando contra el crimen en las sombras de Nueva York.'
  },
  {
    minifigure_no: 'sh0459',
    name: 'Jessica Jones - Purple Scarf, Leather Jacket',
    description_en: 'Jessica Jones worked as a private investigator with superhuman strength and trauma. Her purple scarf and leather jacket reflected her street-smart attitude. Despite suffering mind control by Kilgrave, Jessica\'s resilience never broke. This variant captured Jessica as the hard-drinking detective protecting the powerless.',
    description_de: 'Jessica Jones arbeitete als Privatdetektivin mit übermenschlicher Stärke und Trauma. Ihr lila Schal und Lederjacke spiegelten ihre straßenschlaue Einstellung wider. Trotz Gedankenkontrolle durch Kilgrave brach Jessicas Widerstandsfähigkeit nie. Diese Variante erfasste Jessica als die hart trinkende Detektivin, die die Machtlosen schützte.',
    description_fr: 'Jessica Jones travaillait comme détective privée avec force surhumaine et traumatisme. Son écharpe violette et veste en cuir reflétaient son attitude débrouillarde. Malgré le contrôle mental de Kilgrave, la résilience de Jessica ne se brisa jamais. Cette variante capturait Jessica comme la détective buvant dur protégeant les impuissants.',
    description_es: 'Jessica Jones trabajaba como investigadora privada con fuerza sobrehumana y trauma. Su bufanda púrpura y chaqueta de cuero reflejaban su actitud callejera. A pesar de sufrir control mental por Kilgrave, la resistencia de Jessica nunca se rompió. Esta variante capturaba a Jessica como la detective que bebe fuerte protegiendo a los indefensos.'
  },
  {
    minifigure_no: 'sh0458',
    name: 'Luke Cage - Yellow Shirt, Bullet Holes, Unbreakable Skin',
    description_en: 'Luke Cage possessed unbreakable skin from a failed experiment in prison. His yellow shirt with bullet holes showed his invulnerability to harm. Carl Lucas became a hero for hire protecting Harlem. This variant captured Power Man as the street-level defender who couldn\'t be broken.',
    description_de: 'Luke Cage besaß unzerbrechliche Haut durch ein gescheitertes Experiment im Gefängnis. Sein gelbes Hemd mit Einschusslöchern zeigte seine Unverwundbarkeit. Carl Lucas wurde ein Held für Hire, der Harlem schützte. Diese Variante erfasste Power Man als den Straßenverteidiger, der nicht gebrochen werden konnte.',
    description_fr: 'Luke Cage possédait une peau incassable suite à une expérience ratée en prison. Sa chemise jaune avec trous de balles montrait son invulnérabilité. Carl Lucas devint un héros à louer protégeant Harlem. Cette variante capturait Power Man comme le défenseur de rue qui ne pouvait être brisé.',
    description_es: 'Luke Cage poseía piel irrompible de un experimento fallido en prisión. Su camisa amarilla con agujeros de bala mostraba su invulnerabilidad. Carl Lucas se convirtió en un héroe de alquiler protegiendo Harlem. Esta variante capturaba a Power Man como el defensor callejero que no podía ser quebrado.'
  },
  {
    minifigure_no: 'sh0460',
    name: 'Iron Fist - Yellow Mask, Glowing Fist',
    description_en: 'Iron Fist channeled the mystical power of Shou-Lao the dragon through his fist. Danny Rand\'s yellow mask and glowing fist marked him as K\'un-Lun\'s warrior. Despite wealth and privilege, Danny chose to fight for justice. This variant captured the Immortal Iron Fist mastering chi and defending New York.',
    description_de: 'Iron Fist kanalisierte die mystische Kraft von Shou-Lao dem Drachen durch seine Faust. Danny Rands gelbe Maske und leuchtende Faust kennzeichneten ihn als K\'un-Luns Krieger. Trotz Reichtum und Privilegien wählte Danny, für Gerechtigkeit zu kämpfen. Diese Variante erfasste den Unsterblichen Iron Fist beim Chi-Meistern und New York-Verteidigen.',
    description_fr: 'Iron Fist canalisait le pouvoir mystique de Shou-Lao le dragon à travers son poing. Le masque jaune et poing lumineux de Danny Rand le marquaient comme guerrier de K\'un-Lun. Malgré richesse et privilège, Danny choisit de combattre pour la justice. Cette variante capturait le Poing de Fer Immortel maîtrisant le chi et défendant New York.',
    description_es: 'Iron Fist canalizaba el poder místico de Shou-Lao el dragón a través de su puño. La máscara amarilla y puño brillante de Danny Rand lo marcaban como guerrero de K\'un-Lun. A pesar de riqueza y privilegio, Danny eligió luchar por la justicia. Esta variante capturaba al Puño de Hierro Inmortal dominando el chi y defendiendo Nueva York.'
  },
  {
    minifigure_no: 'sh0309',
    name: 'Black Panther - T\'Challa, Vibranium Suit',
    description_en: 'Black Panther protected Wakanda as both king and superhero. T\'Challa\'s vibranium suit absorbed kinetic energy for devastating counterattacks. Despite leading the world\'s most advanced nation, T\'Challa remained humble and wise. This variant captured Black Panther as the warrior king balancing tradition with progress.',
    description_de: 'Black Panther schützte Wakanda als König und Superheld. T\'Challas Vibranium-Anzug absorbierte kinetische Energie für verheerende Gegenangriffe. Trotz Führung der technologisch fortschrittlichsten Nation blieb T\'Challa bescheiden und weise. Diese Variante erfasste Black Panther als Kriegerkönig, der Tradition mit Fortschritt ausbalancierte.',
    description_fr: 'Black Panther protégeait le Wakanda comme roi et super-héros. Le costume en vibranium de T\'Challa absorbait l\'énergie cinétique pour des contre-attaques dévastatrices. Malgré la direction de la nation la plus avancée du monde, T\'Challa restait humble et sage. Cette variante capturait Black Panther comme le roi guerrier équilibrant tradition et progrès.',
    description_es: 'Black Panther protegía Wakanda como rey y superhéroe. El traje de vibranium de T\'Challa absorbía energía cinética para contraataques devastadores. A pesar de liderar la nación más avanzada del mundo, T\'Challa permanecía humilde y sabio. Esta variante capturaba a Black Panther como el rey guerrero equilibrando tradición con progreso.'
  },
  {
    minifigure_no: 'sh0528',
    name: 'Shuri - Black Panther Suit, Purple Energy Lines',
    description_en: 'Shuri combined genius-level intellect with warrior skills as Wakanda\'s princess. Her Black Panther suit with purple energy lines reflected her technological innovations. When T\'Challa needed her, Shuri stepped up as protector. This variant captured Shuri proving she could be both scientist and superhero.',
    description_de: 'Shuri kombinierte Genie-Intellekt mit Kriegerfertigkeiten als Wakandas Prinzessin. Ihr Black Panther-Anzug mit lila Energielinien spiegelte ihre technologischen Innovationen wider. Als T\'Challa sie brauchte, trat Shuri als Beschützerin auf. Diese Variante erfasste Shuri beim Beweis, dass sie sowohl Wissenschaftlerin als auch Superheldin sein konnte.',
    description_fr: 'Shuri combinait intellect de niveau génie avec compétences de guerrière comme princesse du Wakanda. Son costume Black Panther avec lignes d\'énergie violettes reflétait ses innovations technologiques. Quand T\'Challa eut besoin d\'elle, Shuri se leva comme protectrice. Cette variante capturait Shuri prouvant qu\'elle pouvait être à la fois scientifique et super-héroïne.',
    description_es: 'Shuri combinaba intelecto de nivel genio con habilidades de guerrera como princesa de Wakanda. Su traje Black Panther con líneas de energía púrpura reflejaba sus innovaciones tecnológicas. Cuando T\'Challa la necesitó, Shuri se levantó como protectora. Esta variante capturaba a Shuri demostrando que podía ser tanto científica como superheroína.'
  }
];

async function updateDescriptions() {
  console.log(`Starting Marvel minifigure description updates (Batch 4)...`);
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

  console.log(`\n✅ Marvel Batch 4 descriptions update complete!`);
  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
