import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// FLAGSHIP BATCH 6: More DC Characters
const batch = [
  {
    minifigure_no: 'sh0078',
    name: 'General Zod',
    description_en: 'General Zod the ruthless Kryptonian military commander sought to conquer Earth with Superman\'s powers. This LEGO minifigure featured distinctive armor and commanding presence. As a rogue from Superman\'s home planet, Zod brought advanced Kryptonian technology and combat expertise. This collectible from Man of Steel represented one of Superman\'s most formidable adversaries with superior strength and tactical genius.',
    description_de: 'General Zod der rücksichtslose kryptonische Militärkommandant versuchte die Erde mit Supermans Kräften zu erobern. Diese LEGO-Minifigur zeigte charakteristische Rüstung und befehlende Präsenz. Als Schurke von Supermans Heimatplaneten brachte Zod fortschrittliche kryptonische Technologie und Kampfexpertise. Diese Sammlerfigur aus Man of Steel repräsentierte einen von Supermans gefährlichsten Gegnern mit überlegener Stärke und taktischem Genie.',
    description_fr: 'Le Général Zod le commandant militaire kryptonien impitoyable cherchait à conquérir la Terre avec les pouvoirs de Superman. Cette minifigurine LEGO présentait une armure distinctive et une présence commandante. En tant que renégat de la planète natale de Superman, Zod apportait technologie kryptonienne avancée et expertise en combat. Cette collection de Man of Steel représentait l\'un des adversaires les plus redoutables de Superman avec force supérieure et génie tactique.',
    description_es: 'El General Zod el despiadado comandante militar kryptoniano buscaba conquistar la Tierra con los poderes de Superman. Esta minifigura LEGO presentaba armadura distintiva y presencia imponente. Como villano del planeta natal de Superman, Zod traía tecnología kryptoniana avanzada y experiencia en combate. Esta colección de Man of Steel representaba a uno de los adversarios más formidables de Superman con fuerza superior y genio táctico.'
  },
  {
    minifigure_no: 'sh0093',
    name: 'Joker\'s Goon',
    description_en: 'Joker\'s Goon served the Clown Prince of Crime as loyal henchman in Gotham\'s underworld. This LEGO minifigure featured distinctive clown makeup and criminal attire. Working for the Joker meant unpredictable danger and chaotic schemes. This collectible from Batman represented the expendable foot soldiers who helped spread mayhem across Gotham City.',
    description_de: 'Joker\'s Goon diente dem Clown-Prinzen des Verbrechens als treuer Handlanger in Gothams Unterwelt. Diese LEGO-Minifigur zeigte charakteristisches Clown-Make-up und kriminelle Kleidung. Für den Joker zu arbeiten bedeutete unvorhersehbare Gefahr und chaotische Pläne. Diese Sammlerfigur aus Batman repräsentierte die entbehrlichen Fußsoldaten, die halfen Chaos in Gotham City zu verbreiten.',
    description_fr: 'Le Sbire du Joker servait le Prince Clown du Crime comme homme de main loyal dans la pègre de Gotham. Cette minifigurine LEGO présentait un maquillage de clown distinctif et une tenue criminelle. Travailler pour le Joker signifiait danger imprévisible et plans chaotiques. Cette collection de Batman représentait les fantassins sacrifiables qui aidaient à répandre le chaos dans Gotham City.',
    description_es: 'El Secuaz del Joker servía al Príncipe Payaso del Crimen como sicario leal en el submundo de Gotham. Esta minifigura LEGO presentaba distintivo maquillaje de payaso y vestimenta criminal. Trabajar para el Joker significaba peligro impredecible y planes caóticos. Esta colección de Batman representaba a los soldados rasos prescindibles que ayudaban a esparcir el caos en Gotham City.'
  },
  {
    minifigure_no: 'sh0279',
    name: 'Batman, Gas Mask Batman',
    description_en: 'Batman equipped with specialized gas mask prepared for chemical threats in Gotham. This LEGO minifigure featured protective breathing apparatus over tactical suit. When villains like Scarecrow deployed fear toxins, Batman adapted with specialized equipment. This collectible from Batman v Superman represented the Dark Knight\'s preparedness for any environmental hazard.',
    description_de: 'Batman ausgestattet mit spezialisierter Gasmaske bereitete sich auf chemische Bedrohungen in Gotham vor. Diese LEGO-Minifigur zeigte schützende Atemausrüstung über taktischem Anzug. Wenn Schurken wie Scarecrow Angst-Toxine einsetzten, passte sich Batman mit spezialisierter Ausrüstung an. Diese Sammlerfigur aus Batman v Superman repräsentierte die Vorbereitung des dunklen Ritters für jede Umweltgefahr.',
    description_fr: 'Batman équipé d\'un masque à gaz spécialisé se préparait pour les menaces chimiques à Gotham. Cette minifigurine LEGO présentait un appareil respiratoire protecteur sur un costume tactique. Quand des méchants comme Scarecrow déployaient des toxines de peur, Batman s\'adaptait avec équipement spécialisé. Cette collection de Batman v Superman représentait la préparation du Chevalier Noir pour tout danger environnemental.',
    description_es: 'Batman equipado con máscara de gas especializada se preparaba para amenazas químicas en Gotham. Esta minifigura LEGO presentaba aparato respiratorio protector sobre traje táctico. Cuando villanos como Scarecrow desplegaban toxinas del miedo, Batman se adaptaba con equipo especializado. Esta colección de Batman v Superman representaba la preparación del Caballero Oscuro para cualquier peligro ambiental.'
  },
  {
    minifigure_no: 'sh0309',
    name: 'Batman - Scu-Batsuit',
    description_en: 'Batman in advanced Scuba Batsuit tackled underwater missions with specialized diving equipment. This LEGO minifigure featured aquatic gear with breathing apparatus and streamlined design. When crime moved beneath Gotham Harbor, Batman followed with technological adaptations. This collectible from Batman represented the Dark Knight\'s versatility in any environment including the ocean depths.',
    description_de: 'Batman in fortgeschrittenem Tauch-Batsuit bewältigte Unterwasser-Missionen mit spezialisierter Tauchausrüstung. Diese LEGO-Minifigur zeigte aquatische Ausrüstung mit Atemgerät und stromlinienförmigem Design. Wenn Verbrechen unter Gotham Harbor stattfanden, folgte Batman mit technologischen Anpassungen. Diese Sammlerfigur aus Batman repräsentierte die Vielseitigkeit des dunklen Ritters in jeder Umgebung einschließlich der Meerestiefen.',
    description_fr: 'Batman en Scuba Batsuit avancé s\'attaquait aux missions sous-marines avec équipement de plongée spécialisé. Cette minifigurine LEGO présentait un équipement aquatique avec appareil respiratoire et design aérodynamique. Quand le crime se déplaçait sous Gotham Harbor, Batman suivait avec adaptations technologiques. Cette collection de Batman représentait la polyvalence du Chevalier Noir dans tout environnement y compris les profondeurs océaniques.',
    description_es: 'Batman en avanzado Traje de Buceo Bat enfrentaba misiones submarinas con equipo de buceo especializado. Esta minifigura LEGO presentaba equipo acuático con aparato respiratorio y diseño aerodinámico. Cuando el crimen se movía bajo Gotham Harbor, Batman seguía con adaptaciones tecnológicas. Esta colección de Batman representaba la versatilidad del Caballero Oscuro en cualquier ambiente incluyendo las profundidades oceánicas.'
  },
  {
    minifigure_no: 'sh0344',
    name: 'The Riddler',
    description_en: 'The Riddler challenged Batman with elaborate puzzles and criminal riddles across Gotham. This LEGO minifigure featured iconic green suit adorned with question marks. Edward Nigma\'s obsession with proving intellectual superiority drove his elaborate schemes. This collectible from Batman represented the master of conundrums who turned crime into a twisted game of wits.',
    description_de: 'The Riddler forderte Batman mit aufwendigen Rätseln und kriminellen Knobeleien in Gotham heraus. Diese LEGO-Minifigur zeigte ikonischen grünen Anzug verziert mit Fragezeichen. Edward Nigmas Besessenheit intellektuelle Überlegenheit zu beweisen trieb seine aufwendigen Pläne an. Diese Sammlerfigur aus Batman repräsentierte den Meister der Rätsel, der Verbrechen in ein verdrehtes Spiel des Verstandes verwandelte.',
    description_fr: 'Le Sphinx défiait Batman avec énigmes élaborées et devinettes criminelles à travers Gotham. Cette minifigurine LEGO présentait un costume vert emblématique orné de points d\'interrogation. L\'obsession d\'Edward Nigma de prouver sa supériorité intellectuelle motivait ses plans élaborés. Cette collection de Batman représentait le maître des énigmes qui transformait le crime en jeu tordu d\'intelligence.',
    description_es: 'El Acertijo desafiaba a Batman con elaborados acertijos y enigmas criminales por Gotham. Esta minifigura LEGO presentaba icónico traje verde adornado con signos de interrogación. La obsesión de Edward Nigma por demostrar superioridad intelectual impulsaba sus elaborados planes. Esta colección de Batman representaba al maestro de los enigmas que convertía el crimen en un retorcido juego de ingenio.'
  },
  {
    minifigure_no: 'sh0458',
    name: 'Batman, Neck Bracket',
    description_en: 'Batman with specialized neck bracket represented a specific gear configuration for tactical missions. This LEGO minifigure featured unique attachment point for additional equipment. The Dark Knight\'s adaptable suit system allowed modular upgrades for different scenarios. This collectible from Batman showcased the technological versatility that made Batman prepared for any challenge.',
    description_de: 'Batman mit spezialisierter Hals-Halterung repräsentierte eine spezifische Ausrüstungskonfiguration für taktische Missionen. Diese LEGO-Minifigur zeigte einzigartigen Befestigungspunkt für zusätzliche Ausrüstung. Das anpassbare Anzugsystem des dunklen Ritters erlaubte modulare Upgrades für verschiedene Szenarien. Diese Sammlerfigur aus Batman zeigte die technologische Vielseitigkeit, die Batman für jede Herausforderung vorbereitet machte.',
    description_fr: 'Batman avec support de cou spécialisé représentait une configuration d\'équipement spécifique pour missions tactiques. Cette minifigurine LEGO présentait un point d\'attache unique pour équipement supplémentaire. Le système de costume adaptable du Chevalier Noir permettait des améliorations modulaires pour différents scénarios. Cette collection de Batman montrait la polyvalence technologique qui rendait Batman préparé pour tout défi.',
    description_es: 'Batman con soporte de cuello especializado representaba una configuración de equipo específica para misiones tácticas. Esta minifigura LEGO presentaba punto de anclaje único para equipo adicional. El sistema de traje adaptable del Caballero Oscuro permitía mejoras modulares para diferentes escenarios. Esta colección de Batman mostraba la versatilidad tecnológica que hacía a Batman preparado para cualquier desafío.'
  },
  {
    minifigure_no: 'sh0459',
    name: 'Lex Luthor',
    description_en: 'Lex Luthor the brilliant billionaire industrialist used intellect and resources to oppose Superman. This LEGO minifigure featured business suit and calculating expression. As Metropolis\'s most powerful businessman, Luthor saw Superman as an alien threat to humanity. This collectible from Batman v Superman represented the master manipulator whose genius rivaled Superman\'s strength.',
    description_de: 'Lex Luthor der brillante Milliardär-Industrielle nutzte Intellekt und Ressourcen um sich Superman zu widersetzen. Diese LEGO-Minifigur zeigte Geschäftsanzug und berechnenden Ausdruck. Als mächtigster Geschäftsmann von Metropolis sah Luthor Superman als außerirdische Bedrohung für die Menschheit. Diese Sammlerfigur aus Batman v Superman repräsentierte den Meistermanipulator dessen Genie Supermans Stärke ebenbürtig war.',
    description_fr: 'Lex Luthor le brillant industriel milliardaire utilisait intellect et ressources pour s\'opposer à Superman. Cette minifigurine LEGO présentait un costume d\'affaires et une expression calculatrice. En tant qu\'homme d\'affaires le plus puissant de Metropolis, Luthor voyait Superman comme une menace extraterrestre pour l\'humanité. Cette collection de Batman v Superman représentait le maître manipulateur dont le génie rivalisait avec la force de Superman.',
    description_es: 'Lex Luthor el brillante industrial multimillonario usaba intelecto y recursos para oponerse a Superman. Esta minifigura LEGO presentaba traje de negocios y expresión calculadora. Como el hombre de negocios más poderoso de Metrópolis, Luthor veía a Superman como una amenaza alienígena para la humanidad. Esta colección de Batman v Superman representaba al maestro manipulador cuyo genio rivalizaba con la fuerza de Superman.'
  },
  {
    minifigure_no: 'sh0460',
    name: 'Cheetah',
    description_en: 'Cheetah the fierce feline villain possessed superhuman speed and predatory instincts. This LEGO minifigure featured spotted pattern and animal-like features. Barbara Ann Minerva transformed into a powerful hybrid creature with enhanced agility. This collectible from Wonder Woman represented one of Diana\'s most dangerous adversaries with savage combat skills and relentless hunting abilities.',
    description_de: 'Cheetah die wilde Katzen-Schurkin besaß übermenschliche Geschwindigkeit und räuberische Instinkte. Diese LEGO-Minifigur zeigte geflecktes Muster und tierähnliche Merkmale. Barbara Ann Minerva verwandelte sich in eine mächtige Hybrid-Kreatur mit verbesserter Agilität. Diese Sammlerfigur aus Wonder Woman repräsentierte eine von Dianas gefährlichsten Gegnerinnen mit wilden Kampffähigkeiten und unerbittlichen Jagdfähigkeiten.',
    description_fr: 'Cheetah la féroce méchante féline possédait vitesse surhumaine et instincts de prédateur. Cette minifigurine LEGO présentait un motif tacheté et des caractéristiques animales. Barbara Ann Minerva se transforma en créature hybride puissante avec agilité améliorée. Cette collection de Wonder Woman représentait l\'une des adversaires les plus dangereuses de Diana avec compétences de combat sauvages et capacités de chasse implacables.',
    description_es: 'Cheetah la feroz villana felina poseía velocidad sobrehumana e instintos depredadores. Esta minifigura LEGO presentaba patrón manchado y características animales. Barbara Ann Minerva se transformó en una poderosa criatura híbrida con agilidad mejorada. Esta colección de Wonder Woman representaba a una de las adversarias más peligrosas de Diana con habilidades de combate salvajes y capacidades de caza implacables.'
  },
];

async function updateDescriptions() {
  console.log(`\n🎯 BATCH 6: More DC Characters (8 minifigs)\n`);
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
