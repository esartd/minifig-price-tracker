import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0572',
    name: 'Astromech Droid, Dark Blue',
    description_en: 'This dark blue astromech droid served Rebel and Republic starfighter pilots throughout the saga. Astromechs provided crucial navigation, repair, and combat support. Their distinctive color schemes helped pilots identify their personal droid companions. These loyal units became trusted partners to countless heroes.',
    description_de: 'Dieser dunkelblaue Astromech-Droide diente Rebellen- und Republik-Sternjägerpiloten während der gesamten Saga. Astromechs boten entscheidende Navigation, Reparatur und Kampfunterstützung. Ihre markanten Farbschemata halfen Piloten, ihre persönlichen Droiden-Begleiter zu identifizieren. Diese treuen Einheiten wurden zu vertrauenswürdigen Partnern für unzählige Helden.',
    description_fr: 'Ce droïde astromech bleu foncé servait les pilotes de chasseurs stellaires rebelles et de la République tout au long de la saga. Les astromechs fournissaient navigation, réparation et support de combat cruciaux. Leurs schémas de couleurs distinctifs aidaient les pilotes à identifier leurs compagnons droïdes personnels. Ces unités loyales sont devenues des partenaires de confiance pour d\'innombrables héros.',
    description_es: 'Este droide astromech azul oscuro servía a pilotos de cazas estelares rebeldes y de la República a través de la saga. Los astromechs proporcionaban navegación, reparación y soporte de combate cruciales. Sus esquemas de color distintivos ayudaban a pilotos a identificar sus compañeros droides personales. Estas unidades leales se convirtieron en socios confiables para incontables héroes.'
  },
  {
    minifigure_no: 'sw0573',
    name: 'RA-7 Protocol Droid (Dark Bluish Gray)',
    description_en: 'RA-7 protocol droids, nicknamed "death star droids," served the Empire in administrative and translation roles. This dark bluish gray variant showed their ominous Imperial design. These droids appeared throughout Imperial facilities and starships. Their presence became associated with Imperial bureaucracy and control.',
    description_de: 'RA-7-Protokoll-Droiden, Spitzname "Todesstern-Droiden," dienten dem Imperium in administrativen und Übersetzungsrollen. Diese dunkle bläulich-graue Variante zeigte ihr ominöses imperiales Design. Diese Droiden erschienen in imperialen Einrichtungen und Raumschiffen. Ihre Präsenz wurde mit imperialer Bürokratie und Kontrolle assoziiert.',
    description_fr: 'Les droïdes de protocole RA-7, surnommés "droïdes de l\'étoile de la mort," servaient l\'Empire dans des rôles administratifs et de traduction. Cette variante gris bleuté foncé montrait leur design impérial inquiétant. Ces droïdes apparaissaient dans toutes les installations et vaisseaux spatiaux impériaux. Leur présence est devenue associée à la bureaucratie et au contrôle impériaux.',
    description_es: 'Los droides de protocolo RA-7, apodados "droides estrella de la muerte," servían al Imperio en roles administrativos y de traducción. Esta variante gris azulado oscuro mostraba su diseño imperial ominoso. Estos droides aparecían por instalaciones y naves espaciales imperiales. Su presencia se asoció con burocracia y control imperial.'
  },
  {
    minifigure_no: 'sw0574',
    name: 'Ezra Bridger - Dark Tan Vest, Hair',
    description_en: 'Ezra Bridger was a Force-sensitive street thief who became a Jedi Padawan in Star Wars Rebels. This variant with dark tan vest and hair showed his early appearance. Ezra\'s journey from selfish survivor to selfless hero defined the Rebels series. His connection to the Force grew stronger through Kanan\'s teaching.',
    description_de: 'Ezra Bridger war ein macht-empfindlicher Straßendieb, der in Star Wars Rebels ein Jedi-Padawan wurde. Diese Variante mit dunkler beiger Weste und Haaren zeigte sein frühes Erscheinungsbild. Ezras Reise vom egoistischen Überlebenden zum selbstlosen Helden definierte die Rebels-Serie. Seine Verbindung zur Macht wurde durch Kanans Lehre stärker.',
    description_fr: 'Ezra Bridger était un voleur de rue sensible à la Force qui est devenu un Padawan Jedi dans Star Wars Rebels. Cette variante avec gilet beige foncé et cheveux montrait son apparence initiale. Le voyage d\'Ezra de survivant égoïste à héros altruiste définissait la série Rebels. Sa connexion à la Force s\'est renforcée grâce à l\'enseignement de Kanan.',
    description_es: 'Ezra Bridger era un ladrón callejero sensible a la Fuerza que se convirtió en Padawan Jedi en Star Wars Rebels. Esta variante con chaleco beige oscuro y cabello mostraba su apariencia temprana. El viaje de Ezra de sobreviviente egoísta a héroe desinteresado definió la serie Rebels. Su conexión con la Fuerza se fortaleció a través de la enseñanza de Kanan.'
  },
  {
    minifigure_no: 'sw0575',
    name: 'Garazeb \'Zeb\' Orrelios',
    description_en: 'Garazeb "Zeb" Orrelios was a Lasat warrior and muscle of the Ghost crew in Rebels. His purple-skinned species nearly faced extinction by the Empire. Zeb\'s gruff exterior hid a compassionate heart and strong sense of honor. His redemption arc and friendship with the crew made him beloved.',
    description_de: 'Garazeb "Zeb" Orrelios war ein Lasat-Krieger und Muskel der Ghost-Crew in Rebels. Seine lilahäutige Spezies stand kurz vor der Ausrottung durch das Imperium. Zebs raues Äußeres verbarg ein mitfühlendes Herz und starken Ehrsinn. Sein Erlösungsbogen und Freundschaft mit der Crew machten ihn beliebt.',
    description_fr: 'Garazeb "Zeb" Orrelios était un guerrier Lasat et le muscle de l\'équipage du Ghost dans Rebels. Son espèce à peau violette a failli être exterminée par l\'Empire. L\'extérieur bourru de Zeb cachait un cœur compatissant et un fort sens de l\'honneur. Son arc de rédemption et son amitié avec l\'équipage l\'ont rendu adoré.',
    description_es: 'Garazeb "Zeb" Orrelios era un guerrero Lasat y músculo de la tripulación del Ghost en Rebels. Su especie de piel morada casi enfrentó extinción por el Imperio. El exterior rudo de Zeb ocultaba un corazón compasivo y fuerte sentido del honor. Su arco de redención y amistad con la tripulación lo hicieron querido.'
  },
  {
    minifigure_no: 'sw0576',
    name: 'Hera Syndulla - Dark Tan Arms',
    description_en: 'Hera Syndulla was the talented Twi\'lek pilot commanding the Ghost in Star Wars Rebels. This variant with dark tan arms showed her practical flight gear. Hera\'s leadership held the crew together through countless missions. Her piloting skills were legendary throughout the Rebellion.',
    description_de: 'Hera Syndulla war die talentierte Twi\'lek-Pilotin, die die Ghost in Star Wars Rebels befehligte. Diese Variante mit dunklen beigen Armen zeigte ihre praktische Flugausrüstung. Heras Führung hielt die Crew durch unzählige Missionen zusammen. Ihre Pilotenfähigkeiten waren legendär in der ganzen Rebellion.',
    description_fr: 'Hera Syndulla était la pilote Twi\'lek talentueuse commandant le Ghost dans Star Wars Rebels. Cette variante avec bras beiges foncés montrait son équipement de vol pratique. Le leadership de Hera maintenait l\'équipage uni à travers d\'innombrables missions. Ses compétences de pilotage étaient légendaires dans toute la Rébellion.',
    description_es: 'Hera Syndulla era la talentosa piloto Twi\'lek comandando el Ghost en Star Wars Rebels. Esta variante con brazos beige oscuro mostraba su equipo de vuelo práctico. El liderazgo de Hera mantuvo a la tripulación unida a través de incontables misiones. Sus habilidades de pilotaje eran legendarias por toda la Rebelión.'
  },
  {
    minifigure_no: 'sw0577',
    name: 'Kanan Jarrus - Black Hair and Eyebrows',
    description_en: 'Kanan Jarrus was a Jedi Knight in hiding who became Ezra\'s master in Star Wars Rebels. This variant with black hair showed him before his blinding. Kanan survived Order 66 as a Padawan and lived years in secrecy. His redemption through teaching Ezra restored his connection to the Force.',
    description_de: 'Kanan Jarrus war ein Jedi-Ritter im Versteck, der Ezras Meister in Star Wars Rebels wurde. Diese Variante mit schwarzen Haaren zeigte ihn vor seiner Erblindung. Kanan überlebte Order 66 als Padawan und lebte Jahre im Verborgenen. Seine Erlösung durch Ezras Unterricht stellte seine Verbindung zur Macht wieder her.',
    description_fr: 'Kanan Jarrus était un Chevalier Jedi caché qui est devenu le maître d\'Ezra dans Star Wars Rebels. Cette variante avec cheveux noirs le montrait avant son aveuglement. Kanan a survécu à l\'Ordre 66 en tant que Padawan et a vécu des années dans le secret. Sa rédemption en enseignant à Ezra a restauré sa connexion à la Force.',
    description_es: 'Kanan Jarrus era un Caballero Jedi escondido que se convirtió en el maestro de Ezra en Star Wars Rebels. Esta variante con cabello negro lo mostraba antes de su ceguera. Kanan sobrevivió la Orden 66 como Padawan y vivió años en secreto. Su redención al enseñar a Ezra restauró su conexión con la Fuerza.'
  },
  {
    minifigure_no: 'sw0578',
    name: 'Imperial Stormtrooper - Printed Legs, Dark Azure Helmet Vents',
    description_en: 'This Imperial Stormtrooper variant features printed legs and dark azure helmet vents showing updated detail. Stormtroopers remained the Empire\'s iconic shock troops enforcing order throughout the galaxy. Their white armor symbolized Imperial military might. Despite poor accuracy, they represented overwhelming Imperial force.',
    description_de: 'Diese imperiale Sturmtruppler-Variante zeigt bedruckte Beine und dunkelazurblaue Helm-Belüftungen mit aktualisierten Details. Sturmtruppler blieben die ikonischen Stoßtruppen des Imperiums zur Durchsetzung der Ordnung in der ganzen Galaxis. Ihre weiße Rüstung symbolisierte imperiale Militärmacht. Trotz schlechter Genauigkeit repräsentierten sie überwältigende imperiale Kraft.',
    description_fr: 'Cette variante de Stormtrooper Impérial présente des jambes imprimées et des évents de casque azur foncé montrant des détails mis à jour. Les Stormtroopers restaient les troupes de choc iconiques de l\'Empire appliquant l\'ordre dans toute la galaxie. Leur armure blanche symbolisait la puissance militaire impériale. Malgré une mauvaise précision, ils représentaient une force impériale écrasante.',
    description_es: 'Esta variante de Stormtrooper Imperial presenta piernas impresas y ventilaciones de casco azul oscuro mostrando detalle actualizado. Los Stormtroopers permanecían como tropas de choque icónicas del Imperio aplicando orden por toda la galaxia. Su armadura blanca simbolizaba poderío militar imperial. A pesar de poca precisión, representaban fuerza imperial abrumadora.'
  },
  {
    minifigure_no: 'sw0579',
    name: 'General Maximillian Veers - Chest Armor, Sand Blue Helmet',
    description_en: 'General Veers commanded the Imperial ground assault on Hoth personally piloting the lead AT-AT walker. This variant with chest armor and sand blue helmet showed his distinctive officer gear. Veers\' tactical brilliance led to the Empire\'s victory at Echo Base. His cold efficiency made him one of the Empire\'s most effective commanders.',
    description_de: 'General Veers befehligte den imperialen Bodenangriff auf Hoth und pilotierte persönlich den führenden AT-AT-Walker. Diese Variante mit Brustpanzer und sandblauem Helm zeigte seine markante Offiziersausrüstung. Veers\' taktische Brillanz führte zum Sieg des Imperiums bei Echo Base. Seine kalte Effizienz machte ihn zu einem der effektivsten Kommandanten des Imperiums.',
    description_fr: 'Le Général Veers commandait l\'assaut terrestre impérial sur Hoth pilotant personnellement le marcheur AT-AT de tête. Cette variante avec armure de poitrine et casque bleu sable montrait son équipement d\'officier distinctif. Le génie tactique de Veers a mené à la victoire de l\'Empire à la Base Echo. Son efficacité froide en faisait l\'un des commandants les plus efficaces de l\'Empire.',
    description_es: 'El General Veers comandaba el asalto terrestre imperial en Hoth pilotando personalmente el caminante AT-AT líder. Esta variante con armadura de pecho y casco azul arena mostraba su equipo de oficial distintivo. La brillantez táctica de Veers llevó a la victoria del Imperio en Base Eco. Su eficiencia fría lo convirtió en uno de los comandantes más efectivos del Imperio.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0572-sw0579...');

  for (const minifig of batch) {
    try {
      await prisma.minifigCatalog.update({
        where: { minifigure_no: minifig.minifigure_no },
        data: {
          description_en: minifig.description_en,
          description_de: minifig.description_de,
          description_fr: minifig.description_fr,
          description_es: minifig.description_es,
          description_generated_at: new Date(),
          description_status: 'generated'
        },
      });
      console.log(`✓ Saved ${minifig.minifigure_no}: ${minifig.name}`);
    } catch (error) {
      console.error(`✗ Error saving ${minifig.minifigure_no}:`, error);
    }
  }

  console.log('Batch complete! 8 minifigs saved.');
  await prisma.$disconnect();
}

saveBatch();
