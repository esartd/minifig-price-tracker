import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch18 = [
  {
    minifigure_no: 'sw0082',
    name: 'Owen Lars',
    description_en: 'Owen Lars, Luke Skywalker\'s uncle and moisture farmer on Tatooine, raised the boy who would save the galaxy. This minifigure features Owen\'s practical desert clothing, weathered appearance from harsh twin suns, and the stoic demeanor of a hardworking farmer. Released in 2011, Owen represents the humble family that kept Luke safe from the Empire. Collectors value this figure for his tragic role in A New Hope—murdered by Imperial stormtroopers searching for the droids. His death propelled Luke toward destiny. Essential for Lars homestead displays and the burning homestead scene that changed everything.',
    description_de: 'Owen Lars, Luke Skywalkers Onkel und Feuchtigkeitsfarmer auf Tatooine, zog den Jungen auf, der die Galaxis retten sollte. Diese Minifigur zeigt Owens praktische Wüstenkleidung, verwittertes Aussehen von harten Doppelsonnen und die stoische Art eines hart arbeitenden Farmers. 2011 veröffentlicht, repräsentiert Owen die bescheidene Familie, die Luke vor dem Imperium sicher hielt. Sammler schätzen diese Figur für seine tragische Rolle in Eine neue Hoffnung—ermordet von imperialen Sturmtruppern auf der Suche nach den Droiden. Sein Tod trieb Luke zum Schicksal. Unverzichtbar für Lars-Siedlung-Displays und die brennende Siedlungsszene, die alles veränderte.',
    description_fr: 'Owen Lars, l\'oncle de Luke Skywalker et fermier d\'humidité sur Tatooine, a élevé le garçon qui sauverait la galaxie. Cette minifigurine présente les vêtements de désert pratiques d\'Owen, une apparence patinée par les soleils jumeaux durs et le comportement stoïque d\'un fermier travailleur. Sortie en 2011, Owen représente la famille humble qui a gardé Luke en sécurité de l\'Empire. Les collectionneurs apprécient cette figurine pour son rôle tragique dans Un Nouvel Espoir—assassiné par des stormtroopers impériaux cherchant les droïdes. Sa mort a propulsé Luke vers son destin. Essentielle pour les expositions de la ferme Lars et la scène de la ferme en flammes qui a tout changé.',
    description_es: 'Owen Lars, tío de Luke Skywalker y granjero de humedad en Tatooine, crió al niño que salvaría la galaxia. Esta minifigura presenta la ropa práctica del desierto de Owen, apariencia desgastada por duros soles gemelos y el comportamiento estoico de un granjero trabajador. Lanzado en 2011, Owen representa a la familia humilde que mantuvo a Luke a salvo del Imperio. Los coleccionistas valoran esta figura por su trágico papel en Una Nueva Esperanza—asesinado por stormtroopers imperiales buscando los droides. Su muerte impulsó a Luke hacia el destino. Esencial para exhibiciones de granja Lars y la escena de granja ardiente que cambió todo.'
  },
  {
    minifigure_no: 'sw0083',
    name: 'Beru Lars',
    description_en: 'Beru Lars, Luke\'s aunt who raised him with love and care on Tatooine, represents the family warmth Luke left behind. This minifigure features Beru\'s simple desert clothing, kind expression, and maternal presence. Released in 2011, she embodies the peaceful life Luke abandoned to become a Jedi. Collectors appreciate Beru for her nurturing role and tragic death alongside Owen when stormtroopers attacked. Her loss drove Luke to join Obi-Wan and the Rebellion. Essential for Lars homestead scenes showing Luke\'s humble origins before galactic adventure.',
    description_de: 'Beru Lars, Lukes Tante, die ihn mit Liebe und Fürsorge auf Tatooine aufzog, repräsentiert die Familienwärme, die Luke zurückließ. Diese Minifigur zeigt Berus einfache Wüstenkleidung, freundlichen Ausdruck und mütterliche Präsenz. 2011 veröffentlicht, verkörpert sie das friedliche Leben, das Luke aufgab, um ein Jedi zu werden. Sammler schätzen Beru für ihre fürsorgliche Rolle und tragischen Tod neben Owen, als Sturmtruppen angriffen. Ihr Verlust trieb Luke dazu, sich Obi-Wan und der Rebellion anzuschließen. Unverzichtbar für Lars-Siedlung-Szenen, die Lukes bescheidene Ursprünge vor galaktischem Abenteuer zeigen.',
    description_fr: 'Beru Lars, la tante de Luke qui l\'a élevé avec amour et soin sur Tatooine, représente la chaleur familiale que Luke a laissée derrière. Cette minifigurine présente les vêtements de désert simples de Beru, une expression bienveillante et une présence maternelle. Sortie en 2011, elle incarne la vie paisible que Luke a abandonnée pour devenir un Jedi. Les collectionneurs apprécient Beru pour son rôle nourricier et sa mort tragique aux côtés d\'Owen lorsque les stormtroopers ont attaqué. Sa perte a poussé Luke à rejoindre Obi-Wan et la Rébellion. Essentielle pour les scènes de la ferme Lars montrant les origines humbles de Luke avant l\'aventure galactique.',
    description_es: 'Beru Lars, tía de Luke que lo crió con amor y cuidado en Tatooine, representa la calidez familiar que Luke dejó atrás. Esta minifigura presenta la ropa simple del desierto de Beru, expresión amable y presencia maternal. Lanzada en 2011, encarna la vida pacífica que Luke abandonó para convertirse en Jedi. Los coleccionistas aprecian a Beru por su papel nutritivo y trágica muerte junto a Owen cuando los stormtroopers atacaron. Su pérdida impulsó a Luke a unirse a Obi-Wan y la Rebelión. Esencial para escenas de granja Lars mostrando los humildes orígenes de Luke antes de la aventura galáctica.'
  },
  {
    minifigure_no: 'sw0084',
    name: 'Sandtrooper',
    description_en: 'Sandtroopers are specialized Imperial stormtroopers equipped for desert operations on planets like Tatooine. This minifigure features distinctive tan pauldron denoting rank, survival backpack, weathered white armor adapted for sand and heat, and heavy blaster. Released in 2001, Sandtroopers brought the Empire\'s desert presence to life. Collectors value these troopers for their role searching for the droids and discovering the Jawa massacre. Their orange pauldrons distinguish officers from standard troops. Essential for Tatooine Imperial patrols, Mos Eisley checkpoints, and Lars homestead attack scenes.',
    description_de: 'Sandtruppen sind spezialisierte imperiale Sturmtruppen, ausgerüstet für Wüstenoperationen auf Planeten wie Tatooine. Diese Minifigur zeigt charakteristische beige Schulterplatte, die Rang bezeichnet, Überlebensrucksack, verwitterte weiße Rüstung, angepasst für Sand und Hitze, und schweren Blaster. 2001 veröffentlicht, brachten Sandtruppen die Wüstenpräsenz des Imperiums zum Leben. Sammler schätzen diese Truppen für ihre Rolle bei der Suche nach Droiden und Entdeckung des Jawa-Massakers. Ihre orangefarbenen Schulterplatten unterscheiden Offiziere von Standardtruppen. Unverzichtbar für Tatooine-Imperiale-Patrouillen, Mos-Eisley-Kontrollpunkte und Lars-Siedlung-Angriffsszenen.',
    description_fr: 'Les Sandtroopers sont des stormtroopers impériaux spécialisés équipés pour les opérations dans le désert sur des planètes comme Tatooine. Cette minifigurine présente une épaulière beige distinctive dénotant le rang, un sac à dos de survie, une armure blanche patinée adaptée au sable et à la chaleur, et un blaster lourd. Sortis en 2001, les Sandtroopers ont donné vie à la présence de l\'Empire dans le désert. Les collectionneurs apprécient ces soldats pour leur rôle dans la recherche des droïdes et la découverte du massacre des Jawas. Leurs épaulières orange distinguent les officiers des troupes standard. Essentiels pour les patrouilles impériales de Tatooine, les points de contrôle de Mos Eisley et les scènes d\'attaque de la ferme Lars.',
    description_es: 'Los Sandtroopers son stormtroopers imperiales especializados equipados para operaciones en el desierto en planetas como Tatooine. Esta minifigura presenta distintiva hombrera beige que denota rango, mochila de supervivencia, armadura blanca desgastada adaptada para arena y calor, y bláster pesado. Lanzados en 2001, los Sandtroopers dieron vida a la presencia del Imperio en el desierto. Los coleccionistas valoran estos soldados por su papel buscando los droides y descubriendo la masacre Jawa. Sus hombreras naranjas distinguen oficiales de tropas estándar. Esenciales para patrullas Imperiales de Tatooine, puestos de control de Mos Eisley y escenas de ataque a granja Lars.'
  },
  {
    minifigure_no: 'sw0085',
    name: 'Death Star Trooper',
    description_en: 'Death Star Troopers served as security and technical staff aboard the Empire\'s ultimate weapon. This minifigure features distinctive black uniform with Imperial insignia, helmet with comlink, and sidearm blaster. Released in 2008, these troopers represented the specialized personnel operating the Death Star. Collectors appreciate Death Star Troopers for manning control rooms, detention blocks, and security checkpoints. Their presence during Leia\'s rescue and the destruction of Alderaan made them part of the Empire\'s greatest atrocities. Essential for Death Star interior scenes, detention block rescues, and control room displays.',
    description_de: 'Todesstern-Truppen dienten als Sicherheits- und technisches Personal an Bord der ultimativen Waffe des Imperiums. Diese Minifigur zeigt charakteristische schwarze Uniform mit imperialem Abzeichen, Helm mit Komlink und Seitenwaffen-Blaster. 2008 veröffentlicht, repräsentierten diese Truppen das spezialisierte Personal, das den Todesstern betrieb. Sammler schätzen Todesstern-Truppen für die Besetzung von Kontrollräumen, Haftblöcken und Sicherheitskontrollpunkten. Ihre Präsenz während Leias Rettung und der Zerstörung von Alderaan machte sie zu Teil der größten Gräueltaten des Imperiums. Unverzichtbar für Todesstern-Innenszenen, Haftblock-Rettungen und Kontrollraum-Displays.',
    description_fr: 'Les Soldats de l\'Étoile de la Mort servaient de personnel de sécurité et technique à bord de l\'arme ultime de l\'Empire. Cette minifigurine présente un uniforme noir distinctif avec insigne impérial, un casque avec communicateur et un blaster de poing. Sortis en 2008, ces soldats représentaient le personnel spécialisé opérant l\'Étoile de la Mort. Les collectionneurs apprécient les Soldats de l\'Étoile de la Mort pour garder les salles de contrôle, les blocs de détention et les points de contrôle de sécurité. Leur présence pendant le sauvetage de Leia et la destruction d\'Alderaan en a fait partie des plus grandes atrocités de l\'Empire. Essentiels pour les scènes intérieures de l\'Étoile de la Mort, les sauvetages de blocs de détention et les expositions de salles de contrôle.',
    description_es: 'Los Soldados de la Estrella de la Muerte sirvieron como personal de seguridad y técnico a bordo del arma definitiva del Imperio. Esta minifigura presenta distintivo uniforme negro con insignia Imperial, casco con comunicador y bláster de pistolera. Lanzados en 2008, estos soldados representaron al personal especializado operando la Estrella de la Muerte. Los coleccionistas aprecian a los Soldados de la Estrella de la Muerte por tripular salas de control, bloques de detención y puestos de control de seguridad. Su presencia durante el rescate de Leia y la destrucción de Alderaan los hizo parte de las mayores atrocidades del Imperio. Esenciales para escenas interiores de la Estrella de la Muerte, rescates de bloques de detención y exhibiciones de salas de control.'
  },
  {
    minifigure_no: 'sw0086',
    name: 'Grand Moff Tarkin',
    description_en: 'Grand Moff Tarkin commanded the Death Star and embodied the Empire\'s ruthless military doctrine. This minifigure features Tarkin\'s distinctive Imperial officer uniform with rank insignia, angular face, and cold expression. Released in 2006, Peter Cushing\'s portrayal of absolute authority came to LEGO. Collectors highly prize Tarkin for ordering Alderaan\'s destruction and his arrogant confidence before the Death Star\'s destruction. His strategic brilliance couldn\'t overcome the fatal flaw Luke exploited. Essential for Death Star conference rooms, command bridge displays, and the moment Princess Leia witnessed her homeworld\'s annihilation.',
    description_de: 'Großmoff Tarkin kommandierte den Todesstern und verkörperte die rücksichtslose militärische Doktrin des Imperiums. Diese Minifigur zeigt Tarkins charakteristische imperiale Offiziersuniform mit Rangabzeichen, kantiges Gesicht und kalten Ausdruck. 2006 veröffentlicht, kam Peter Cushings Darstellung absoluter Autorität zu LEGO. Sammler schätzen Tarkin sehr für die Anordnung von Alderaans Zerstörung und sein arrogantes Selbstvertrauen vor der Zerstörung des Todessterns. Seine strategische Brillanz konnte den tödlichen Fehler nicht überwinden, den Luke ausnutzte. Unverzichtbar für Todesstern-Konferenzräume, Kommandobrücken-Displays und den Moment, als Prinzessin Leia die Vernichtung ihrer Heimatwelt miterlebte.',
    description_fr: 'Le Grand Moff Tarkin commandait l\'Étoile de la Mort et incarnait la doctrine militaire impitoyable de l\'Empire. Cette minifigurine présente l\'uniforme d\'officier impérial distinctif de Tarkin avec insignes de rang, visage anguleux et expression froide. Sortie en 2006, l\'interprétation de l\'autorité absolue de Peter Cushing est venue chez LEGO. Les collectionneurs apprécient grandement Tarkin pour avoir ordonné la destruction d\'Alderaan et sa confiance arrogante avant la destruction de l\'Étoile de la Mort. Sa brillance stratégique n\'a pu surmonter le défaut fatal que Luke a exploité. Essentiel pour les salles de conférence de l\'Étoile de la Mort, les expositions de pont de commandement et le moment où la Princesse Leia a été témoin de l\'anéantissement de son monde natal.',
    description_es: 'El Gran Moff Tarkin comandó la Estrella de la Muerte y encarnó la doctrina militar despiadada del Imperio. Esta minifigura presenta el distintivo uniforme de oficial Imperial de Tarkin con insignias de rango, rostro angular y expresión fría. Lanzado en 2006, la interpretación de autoridad absoluta de Peter Cushing llegó a LEGO. Los coleccionistas valoran mucho a Tarkin por ordenar la destrucción de Alderaan y su confianza arrogante antes de la destrucción de la Estrella de la Muerte. Su brillantez estratégica no pudo superar el fallo fatal que Luke explotó. Esencial para salas de conferencia de la Estrella de la Muerte, exhibiciones de puente de comando y el momento en que la Princesa Leia presenció la aniquilación de su mundo natal.'
  }
];

async function saveBatch() {
  console.log('💾 Saving batch 18 (sw0082-sw0086)...\n');
  
  for (const minifig of batch18) {
    await prisma.minifigCatalog.upsert({
      where: { minifigure_no: minifig.minifigure_no },
      update: {
        description_en: minifig.description_en,
        description_de: minifig.description_de,
        description_fr: minifig.description_fr,
        description_es: minifig.description_es,
        description_generated_at: new Date(),
        description_status: 'generated'
      },
      create: {
        minifigure_no: minifig.minifigure_no,
        name: minifig.name,
        category_id: 1,
        category_name: 'Star Wars',
        search_name: minifig.name.toLowerCase(),
        description_en: minifig.description_en,
        description_de: minifig.description_de,
        description_fr: minifig.description_fr,
        description_es: minifig.description_es,
        description_generated_at: new Date(),
        description_status: 'generated'
      }
    });
    console.log(`  ✅ ${minifig.minifigure_no}: ${minifig.name}`);
  }
  
  console.log('\n✨ Batch 18 complete! Total: 85 minifigs (340 descriptions)\n');
  await prisma.$disconnect();
}

saveBatch().catch(console.error);
