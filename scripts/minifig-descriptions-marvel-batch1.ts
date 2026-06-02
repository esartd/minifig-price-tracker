import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Marvel minifigure descriptions - variant-specific details matching Star Wars quality
const batch = [
  {
    minifigure_no: 'spd001',
    name: 'Spider-Man 1 - Blue Arms and Legs, Silver Webbing',
    description_en: 'Spider-Man in classic blue and red suit with silver webbing represented the iconic superhero design. Peter Parker\'s spider-sense and web-slinging abilities made him New York\'s friendly neighborhood protector. The silver web details captured Spider-Man\'s signature style. This early variant showcased the web-crawler\'s timeless costume.',
    description_de: 'Spider-Man im klassischen blau-roten Anzug mit silbernen Netzmustern repräsentierte das ikonische Superhelden-Design. Peter Parkers Spinnensinn und Netz-Schwingungs-Fähigkeiten machten ihn zu New Yorks freundlichem Nachbarschafts-Beschützer. Die silbernen Netz-Details erfassten Spider-Mans charakteristischen Stil. Diese frühe Variante zeigte das zeitlose Kostüm des Netz-Schwingers.',
    description_fr: 'Spider-Man dans le costume classique bleu et rouge avec toiles argentées représentait le design emblématique du super-héros. Le sens d\'araignée et les capacités de balancement par toiles de Peter Parker firent de lui le protecteur amical du quartier de New York. Les détails de toile argentée capturaient le style signature de Spider-Man. Cette variante précoce présentait le costume intemporel du tisseur de toiles.',
    description_es: 'Spider-Man en traje clásico azul y rojo con telarañas plateadas representaba el diseño icónico del superhéroe. El sentido arácnido y habilidades de balanceo en telaraña de Peter Parker lo convirtieron en el protector amigable del vecindario de Nueva York. Los detalles de telaraña plateada capturaban el estilo característico de Spider-Man. Esta variante temprana mostraba el traje atemporal del lanzarredes.'
  },
  {
    minifigure_no: 'sh0015',
    name: 'Iron Man - Mark 6 Armor, Small Helmet Visor, Foot Repulsors',
    description_en: 'Iron Man in Mark 6 armor showcased Tony Stark\'s technological genius. The small helmet visor and foot repulsors captured the sleek armor design from the Avengers. Tony\'s arc reactor powered the suit\'s incredible abilities. This variant represented Iron Man\'s evolution as Earth\'s armored Avenger.',
    description_de: 'Iron Man in Mark 6-Rüstung zeigte Tony Starks technologisches Genie. Das kleine Helmvisier und Fuß-Repulsoren erfassten das elegante Rüstungsdesign aus den Avengers. Tonys Arc-Reaktor trieb die unglaublichen Fähigkeiten des Anzugs an. Diese Variante repräsentierte Iron Mans Evolution als Erdas gepanzerter Avenger.',
    description_fr: 'Iron Man dans l\'armure Mark 6 présentait le génie technologique de Tony Stark. La petite visière de casque et les répulseurs de pied capturaient le design élégant de l\'armure des Avengers. Le réacteur arc de Tony alimentait les capacités incroyables du costume. Cette variante représentait l\'évolution d\'Iron Man en tant qu\'Avenger blindé de la Terre.',
    description_es: 'Iron Man en armadura Mark 6 mostraba el genio tecnológico de Tony Stark. La pequeña visera del casco y repulsores de pie capturaban el diseño elegante de la armadura de los Vengadores. El reactor arc de Tony alimentaba las increíbles habilidades del traje. Esta variante representaba la evolución de Iron Man como Vengador acorazado de la Tierra.'
  },
  {
    minifigure_no: 'sh0014',
    name: 'Captain America - Dark Blue Suit with Dark Blue Belt, Dark Red Hands, Mask',
    description_en: 'Captain America in dark blue suit represented Steve Rogers as the First Avenger. His super-soldier serum and vibranium shield made him the ultimate symbol of heroism. The dark red hands matched his patriotic color scheme. This variant captured Cap\'s leadership and unwavering principles.',
    description_de: 'Captain America im dunkelblauen Anzug repräsentierte Steve Rogers als den Ersten Avenger. Sein Supersoldaten-Serum und Vibranium-Schild machten ihn zum ultimativen Symbol des Heroismus. Die dunkelroten Hände passten zu seinem patriotischen Farbschema. Diese Variante erfasste Caps Führung und unerschütterliche Prinzipien.',
    description_fr: 'Captain America dans le costume bleu foncé représentait Steve Rogers comme le Premier Avenger. Son sérum de super-soldat et son bouclier en vibranium firent de lui le symbole ultime de l\'héroïsme. Les mains rouge foncé correspondaient à son schéma de couleurs patriotique. Cette variante capturait le leadership et les principes inébranlables de Cap.',
    description_es: 'Captain America en traje azul oscuro representaba a Steve Rogers como el Primer Vengador. Su suero de supersoldado y escudo de vibranium lo convirtieron en el símbolo definitivo del heroísmo. Las manos rojo oscuro coincidían con su esquema de color patriótico. Esta variante capturaba el liderazgo y principios inquebrantables de Cap.'
  },
  {
    minifigure_no: 'sh0018',
    name: 'Thor - Starched Fabric Cape, Dark Blue Legs',
    description_en: 'Thor the God of Thunder wielded Mjolnir with immense power. His starched fabric cape billowed as he summoned lightning from the skies. Despite his godly strength, Thor learned humility and became worthy. This variant captured Thor\'s majestic presence among the Avengers.',
    description_de: 'Thor der Gott des Donners schwang Mjolnir mit immenser Kraft. Sein gestärkter Stoffumhang wehte, während er Blitze vom Himmel beschwor. Trotz seiner göttlichen Stärke lernte Thor Demut und wurde würdig. Diese Variante erfasste Thors majestätische Präsenz unter den Avengers.',
    description_fr: 'Thor le Dieu du Tonnerre maniait Mjolnir avec un pouvoir immense. Sa cape en tissu amidonné flottait alors qu\'il invoquait la foudre des cieux. Malgré sa force divine, Thor apprit l\'humilité et devint digne. Cette variante capturait la présence majestueuse de Thor parmi les Avengers.',
    description_es: 'Thor el Dios del Trueno blandía Mjolnir con inmenso poder. Su capa de tela almidonada ondeaba mientras invocaba rayos de los cielos. A pesar de su fuerza divina, Thor aprendió humildad y se volvió digno. Esta variante capturaba la presencia majestuosa de Thor entre los Vengadores.'
  },
  {
    minifigure_no: 'sh0013',
    name: 'Hulk - Giant, Dark Tan Pants',
    description_en: 'Hulk the giant green powerhouse represented Bruce Banner\'s uncontrollable rage. His immense strength made him the most physically powerful Avenger. The dark tan tattered pants survived his transformations. This giant figure captured Hulk\'s raw power and destructive potential.',
    description_de: 'Hulk das riesige grüne Kraftpaket repräsentierte Bruce Banners unkontrollierbare Wut. Seine immense Stärke machte ihn zum physisch mächtigsten Avenger. Die dunklen beigen zerrissenen Hosen überlebten seine Transformationen. Diese Riesenfigur erfasste Hulks rohe Kraft und destruktives Potenzial.',
    description_fr: 'Hulk la puissance géante verte représentait la rage incontrôlable de Bruce Banner. Sa force immense fit de lui l\'Avenger le plus puissant physiquement. Le pantalon déchiré beige foncé survivait à ses transformations. Cette figurine géante capturait la puissance brute et le potentiel destructeur de Hulk.',
    description_es: 'Hulk la potencia gigante verde representaba la ira incontrolable de Bruce Banner. Su inmensa fuerza lo convirtió en el Vengador físicamente más poderoso. Los pantalones andrajosos beige oscuro sobrevivían a sus transformaciones. Esta figura gigante capturaba el poder bruto y potencial destructivo de Hulk.'
  },
  {
    minifigure_no: 'sh0035',
    name: 'Black Widow - Black Jumpsuit, Dark Orange Mid-Length Hair, Printed Legs, Black Hands, Dark Orange Eyebrows',
    description_en: 'Black Widow with dark orange hair represented Natasha Romanoff\'s deadly skills as a spy and assassin. Her black jumpsuit allowed stealth and combat mobility. Despite her dark past, Natasha found redemption with the Avengers. This variant captured Black Widow\'s lethal grace and determination.',
    description_de: 'Black Widow mit dunkelorangen Haaren repräsentierte Natasha Romanoffs tödliche Fähigkeiten als Spionin und Assassinin. Ihr schwarzer Overall ermöglichte Heimlichkeit und Kampfmobilität. Trotz ihrer dunklen Vergangenheit fand Natasha Erlösung bei den Avengers. Diese Variante erfasste Black Widows tödliche Anmut und Entschlossenheit.',
    description_fr: 'Black Widow avec cheveux orange foncé représentait les compétences mortelles de Natasha Romanoff comme espionne et assassin. Sa combinaison noire permettait furtivité et mobilité au combat. Malgré son passé sombre, Natasha trouva rédemption avec les Avengers. Cette variante capturait la grâce mortelle et la détermination de Black Widow.',
    description_es: 'Viuda Negra con cabello naranja oscuro representaba las habilidades mortales de Natasha Romanoff como espía y asesina. Su mono negro permitía sigilo y movilidad de combate. A pesar de su oscuro pasado, Natasha encontró redención con los Vengadores. Esta variante capturaba la gracia letal y determinación de Viuda Negra.'
  },
  {
    minifigure_no: 'sh0034',
    name: 'Hawkeye - Black and Dark Red Suit, Medium Nougat Hair',
    description_en: 'Hawkeye in black and dark red suit showcased Clint Barton\'s incredible archery skills. His perfect aim made him invaluable despite lacking superhuman powers. The medium nougat hair distinguished this variant. Hawkeye\'s determination proved that skill and training could match any superpower.',
    description_de: 'Hawkeye im schwarz-dunkelroten Anzug zeigte Clint Bartons unglaubliche Bogenschießfähigkeiten. Seine perfekte Zielgenauigkeit machte ihn trotz fehlender übermenschlicher Kräfte unschätzbar. Die mittel-nougatfarbenen Haare unterschieden diese Variante. Hawkeyes Entschlossenheit bewies, dass Können und Training jeder Superkraft entsprechen konnten.',
    description_fr: 'Hawkeye dans le costume noir et rouge foncé présentait les compétences incroyables de tir à l\'arc de Clint Barton. Son tir parfait le rendait inestimable malgré l\'absence de pouvoirs surhumains. Les cheveux nougat moyen distinguaient cette variante. La détermination de Hawkeye prouva que compétence et entraînement pouvaient égaler n\'importe quel superpouvoir.',
    description_es: 'Ojo de Halcón en traje negro y rojo oscuro mostraba las increíbles habilidades de arquería de Clint Barton. Su puntería perfecta lo hacía invaluable a pesar de carecer de poderes sobrehumanos. El cabello nougat medio distinguía esta variante. La determinación de Ojo de Halcón demostró que habilidad y entrenamiento podían igualar cualquier superpoder.'
  },
  {
    minifigure_no: 'sh0038',
    name: 'Spider-Man - Black Web Pattern',
    description_en: 'Spider-Man in black suit represented the symbiote costume that enhanced Peter\'s powers but corrupted his mind. The black web pattern marked Spider-Man\'s darker phase. Though the suit amplified his abilities, Peter ultimately rejected its influence. This variant captured Spider-Man\'s struggle with power and responsibility.',
    description_de: 'Spider-Man im schwarzen Anzug repräsentierte das Symbionten-Kostüm, das Peters Kräfte verstärkte, aber seinen Verstand korrumpierte. Das schwarze Netzmuster kennzeichnete Spider-Mans dunklere Phase. Obwohl der Anzug seine Fähigkeiten verstärkte, lehnte Peter letztendlich dessen Einfluss ab. Diese Variante erfasste Spider-Mans Kampf mit Macht und Verantwortung.',
    description_fr: 'Spider-Man dans le costume noir représentait le costume symbiote qui amplifiait les pouvoirs de Peter mais corrompait son esprit. Le motif de toile noire marquait la phase plus sombre de Spider-Man. Bien que le costume amplifie ses capacités, Peter rejeta finalement son influence. Cette variante capturait la lutte de Spider-Man avec le pouvoir et la responsabilité.',
    description_es: 'Spider-Man en traje negro representaba el traje simbionte que aumentaba los poderes de Peter pero corrompía su mente. El patrón de telaraña negra marcaba la fase más oscura de Spider-Man. Aunque el traje amplificaba sus habilidades, Peter finalmente rechazó su influencia. Esta variante capturaba la lucha de Spider-Man con el poder y la responsabilidad.'
  }
];

async function updateDescriptions() {
  console.log(`Starting Marvel minifigure description updates (Batch 1)...`);
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

  console.log(`\n✅ Marvel Batch 1 descriptions update complete!`);
  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
