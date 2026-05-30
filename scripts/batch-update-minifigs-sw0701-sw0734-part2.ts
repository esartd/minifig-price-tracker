import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0718',
    name: 'Resistance Trooper - Tan Jacket, Smile',
    description_en: 'Resistance Troopers with tan jackets and smiles showed hope despite overwhelming odds. Their optimism reflected belief in the cause. These cheerful fighters maintained morale in dark times. Smiling faces reminded comrades why they fought.',
    description_de: 'Widerstands-Truppen mit beigen Jacken und Lächeln zeigten Hoffnung trotz überwältigender Chancen. Ihr Optimismus spiegelte Glauben an die Sache wider. Diese fröhlichen Kämpfer erhielten Moral in dunklen Zeiten. Lächelnde Gesichter erinnerten Kameraden, warum sie kämpften.',
    description_fr: 'Les Soldats de la Résistance avec vestes beiges et sourires montraient l\'espoir malgré des chances écrasantes. Leur optimisme reflétait la croyance en la cause. Ces combattants joyeux maintenaient le moral dans les temps sombres. Les visages souriants rappelaient aux camarades pourquoi ils se battaient.',
    description_es: 'Los Soldados de Resistencia con chaquetas beige y sonrisas mostraban esperanza a pesar de probabilidades abrumadoras. Su optimismo reflejaba creencia en la causa. Estos luchadores alegres mantenían moral en tiempos oscuros. Los rostros sonrientes recordaban a camaradas por qué luchaban.'
  },
  {
    minifigure_no: 'sw0719',
    name: 'Poe Dameron - Resistance Jacket, No Eyebrows',
    description_en: 'Poe Dameron in Resistance jacket without eyebrows showed an early design variant. His charisma and piloting skills made him a natural leader. Poe\'s loyalty to the Resistance never wavered. This variant captured the galaxy\'s best pilot.',
    description_de: 'Poe Dameron in Widerstands-Jacke ohne Augenbrauen zeigte eine frühe Design-Variante. Sein Charisma und Pilotenfähigkeiten machten ihn zum natürlichen Anführer. Poes Loyalität zum Widerstand schwankte nie. Diese Variante erfasste den besten Piloten der Galaxie.',
    description_fr: 'Poe Dameron en veste de la Résistance sans sourcils montrait une variante de conception précoce. Son charisme et ses compétences de pilotage en faisaient un leader naturel. La loyauté de Poe envers la Résistance n\'a jamais faibli. Cette variante capturait le meilleur pilote de la galaxie.',
    description_es: 'Poe Dameron en chaqueta de Resistencia sin cejas mostraba una variante de diseño temprana. Su carisma y habilidades de pilotaje lo hacían un líder natural. La lealtad de Poe a la Resistencia nunca flaqueó. Esta variante capturaba el mejor piloto de la galaxia.'
  },
  {
    minifigure_no: 'sw0720',
    name: 'FN-2187 (Finn) - Stormtrooper Armor',
    description_en: 'FN-2187 in stormtrooper armor showed Finn before his defection from the First Order. His designation dehumanized him as a number. Witnessing atrocities awakened his conscience. This armor represented the identity Finn courageously rejected.',
    description_de: 'FN-2187 in Sturmtruppler-Rüstung zeigte Finn vor seiner Abspaltung von der Ersten Ordnung. Seine Bezeichnung entmenschlichte ihn als Nummer. Das Miterleben von Gräueltaten erweckte sein Gewissen. Diese Rüstung repräsentierte die Identität, die Finn mutig ablehnte.',
    description_fr: 'FN-2187 en armure de stormtrooper montrait Finn avant sa désertion du Premier Ordre. Sa désignation le déshumanisait en tant que numéro. Être témoin d\'atrocités a éveillé sa conscience. Cette armure représentait l\'identité que Finn a courageusement rejetée.',
    description_es: 'FN-2187 en armadura de stormtrooper mostraba a Finn antes de su deserción de la Primera Orden. Su designación lo deshumanizaba como número. Presenciar atrocidades despertó su conciencia. Esta armadura representaba la identidad que Finn rechazó valientemente.'
  },
  {
    minifigure_no: 'sw0721',
    name: 'Kylo Ren - Cape, Hood Down',
    description_en: 'Kylo Ren with cape and hood down revealed his conflicted face. Ben Solo\'s fall to the dark side tore apart his family. His unstable emotions fueled unpredictable power. This variant showed the man behind the mask\'s terror.',
    description_de: 'Kylo Ren mit Umhang und heruntergelassener Kapuze enthüllte sein konfliktreiches Gesicht. Ben Solos Fall zur dunklen Seite zerriss seine Familie. Seine instabilen Emotionen nährten unvorhersehbare Macht. Diese Variante zeigte den Mann hinter dem Terror der Maske.',
    description_fr: 'Kylo Ren avec cape et capuche baissée révélait son visage conflictuel. La chute de Ben Solo du côté obscur déchirait sa famille. Ses émotions instables alimentaient un pouvoir imprévisible. Cette variante montrait l\'homme derrière la terreur du masque.',
    description_es: 'Kylo Ren con capa y capucha bajada revelaba su rostro conflictivo. La caída de Ben Solo al lado oscuro destrozó su familia. Sus emociones inestables alimentaban poder impredecible. Esta variante mostraba al hombre detrás del terror de la máscara.'
  },
  {
    minifigure_no: 'sw0722',
    name: 'Unkar\'s Thug',
    description_en: 'Unkar\'s Thugs enforced the junk dealer\'s control over Jakku scavengers. These brutes ensured Unkar Plutt got favorable terms. Their intimidation kept desperate scavengers in line. Life on Jakku bred hard men serving cruel masters.',
    description_de: 'Unkars Schläger setzten die Kontrolle des Schrotthändlers über Jakku-Plünderer durch. Diese groben Kerle sicherten Unkar Plutt günstige Bedingungen. Ihre Einschüchterung hielt verzweifelte Plünderer in Schach. Das Leben auf Jakku züchtete harte Männer, die grausamen Herren dienten.',
    description_fr: 'Les Voyous d\'Unkar appliquaient le contrôle du marchand de ferraille sur les récupérateurs de Jakku. Ces brutes assuraient qu\'Unkar Plutt obtenait des conditions favorables. Leur intimidation maintenait les récupérateurs désespérés en ligne. La vie sur Jakku engendrait des hommes durs servant des maîtres cruels.',
    description_es: 'Los Matones de Unkar aplicaban el control del comerciante de chatarra sobre los carroñeros de Jakku. Estos brutos aseguraban que Unkar Plutt obtuviera términos favorables. Su intimidación mantenía a carroñeros desesperados en línea. La vida en Jakku criaba hombres duros sirviendo amos crueles.'
  },
  {
    minifigure_no: 'sw0723',
    name: 'Guavian Security Soldier',
    description_en: 'Guavian Security Soldiers served the Guavian Death Gang as elite enforcers. Their distinctive red armor and helmets made them instantly recognizable. These cybernetically enhanced warriors pursued Han Solo relentlessly. Their mechanical breathing added to their menacing presence.',
    description_de: 'Guavianische Sicherheitssoldaten dienten der Guavianischen Todesbande als Elite-Vollstrecker. Ihre markante rote Rüstung und Helme machten sie sofort erkennbar. Diese kybernetisch verstärkten Krieger verfolgten Han Solo unerbittlich. Ihre mechanische Atmung verstärkte ihre bedrohliche Präsenz.',
    description_fr: 'Les Soldats de Sécurité Guaviens servaient le Gang de la Mort Guavien comme exécuteurs d\'élite. Leur armure rouge distinctive et leurs casques les rendaient instantanément reconnaissables. Ces guerriers cybernétiquement améliorés poursuivaient Han Solo sans relâche. Leur respiration mécanique ajoutait à leur présence menaçante.',
    description_es: 'Los Soldados de Seguridad Guavianos servían a la Pandilla de Muerte Guaviana como ejecutores de élite. Su armadura roja distintiva y cascos los hacían instantáneamente reconocibles. Estos guerreros cibernéticamente mejorados perseguían a Han Solo implacablemente. Su respiración mecánica agregaba a su presencia amenazante.'
  },
  {
    minifigure_no: 'sw0724',
    name: 'Lor San Tekka',
    description_en: 'Lor San Tekka safeguarded the map to Luke Skywalker on Jakku. This elderly explorer understood the Force\'s importance. His friendship with the Skywalker family drove his mission. Kylo Ren murdered him for refusing to reveal Luke\'s location.',
    description_de: 'Lor San Tekka bewahrte die Karte zu Luke Skywalker auf Jakku. Dieser ältere Forscher verstand die Wichtigkeit der Macht. Seine Freundschaft mit der Skywalker-Familie trieb seine Mission an. Kylo Ren ermordete ihn, weil er sich weigerte, Lukes Standort zu offenbaren.',
    description_fr: 'Lor San Tekka gardait la carte vers Luke Skywalker sur Jakku. Cet explorateur âgé comprenait l\'importance de la Force. Son amitié avec la famille Skywalker motivait sa mission. Kylo Ren l\'a assassiné pour avoir refusé de révéler l\'emplacement de Luke.',
    description_es: 'Lor San Tekka salvaguardaba el mapa hacia Luke Skywalker en Jakku. Este explorador anciano entendía la importancia de la Fuerza. Su amistad con la familia Skywalker impulsaba su misión. Kylo Ren lo asesinó por negarse a revelar la ubicación de Luke.'
  },
  {
    minifigure_no: 'sw0725',
    name: 'First Order Flametrooper',
    description_en: 'First Order Flametroopers specialized in clearing fortifications and burning villages. Their distinctive armor protected against extreme heat. These specialists committed atrocities in the First Order\'s name. Flametroopers represented the regime\'s brutal tactics.',
    description_de: 'Flammenwerfertruppen der Ersten Ordnung spezialisierten sich auf Räumung von Befestigungen und Niederbrennen von Dörfern. Ihre markante Rüstung schützte vor extremer Hitze. Diese Spezialisten begingen Gräueltaten im Namen der Ersten Ordnung. Flammenwerfertruppen repräsentierten die brutalen Taktiken des Regimes.',
    description_fr: 'Les Flametroopers du Premier Ordre se spécialisaient dans le nettoyage des fortifications et l\'incendie des villages. Leur armure distinctive protégeait contre la chaleur extrême. Ces spécialistes commettaient des atrocités au nom du Premier Ordre. Les Flametroopers représentaient les tactiques brutales du régime.',
    description_es: 'Los Flametroopers de Primera Orden se especializaban en limpiar fortificaciones y quemar aldeas. Su armadura distintiva protegía contra calor extremo. Estos especialistas cometían atrocidades en nombre de la Primera Orden. Los Flametroopers representaban las tácticas brutales del régimen.'
  },
  {
    minifigure_no: 'sw0726',
    name: 'First Order Snowtrooper Officer',
    description_en: 'First Order Snowtrooper Officers led cold weather assault forces. Their advanced armor improved upon Imperial designs. These officers commanded attacks on ice planets and frozen installations. Enhanced insulation and equipment made them effective in harsh climates.',
    description_de: 'Schneetruppen-Offiziere der Ersten Ordnung führten Kaltwetter-Angriffskräfte an. Ihre fortschrittliche Rüstung verbesserte imperiale Designs. Diese Offiziere befehligten Angriffe auf Eisplaneten und gefrorene Anlagen. Verbesserte Isolierung und Ausrüstung machten sie effektiv in harten Klimata.',
    description_fr: 'Les Officiers Snowtroopers du Premier Ordre dirigeaient les forces d\'assaut par temps froid. Leur armure avancée améliorait les conceptions impériales. Ces officiers commandaient des attaques sur les planètes de glace et les installations gelées. L\'isolation et l\'équipement améliorés les rendaient efficaces dans les climats difficiles.',
    description_es: 'Los Oficiales Snowtrooper de Primera Orden lideraban fuerzas de asalto de clima frío. Su armadura avanzada mejoraba diseños imperiales. Estos oficiales comandaban ataques en planetas de hielo e instalaciones congeladas. El aislamiento y equipo mejorados los hacían efectivos en climas duros.'
  },
  {
    minifigure_no: 'sw0727',
    name: 'First Order Snowtrooper',
    description_en: 'First Order Snowtroopers conducted operations in frozen environments. Their specialized armor provided superior protection against cold. These soldiers participated in the assault on Starkiller Base. Enhanced mobility and weaponry made them formidable arctic fighters.',
    description_de: 'Schneetruppen der Ersten Ordnung führten Operationen in gefrorenen Umgebungen durch. Ihre spezialisierte Rüstung bot überlegenen Schutz gegen Kälte. Diese Soldaten nahmen am Angriff auf Starkiller-Basis teil. Verbesserte Mobilität und Bewaffnung machten sie zu furchterregenden Arktis-Kämpfern.',
    description_fr: 'Les Snowtroopers du Premier Ordre menaient des opérations dans des environnements gelés. Leur armure spécialisée offrait une protection supérieure contre le froid. Ces soldats ont participé à l\'assaut sur la Base Starkiller. La mobilité et l\'armement améliorés en faisaient des combattants arctiques redoutables.',
    description_es: 'Los Snowtroopers de Primera Orden realizaban operaciones en entornos congelados. Su armadura especializada proporcionaba protección superior contra frío. Estos soldados participaron en el asalto a Base Starkiller. La movilidad y armamento mejorados los hacían luchadores árticos formidables.'
  },
  {
    minifigure_no: 'sw0728',
    name: 'Han Solo, Old (Frown)',
    description_en: 'Older Han Solo with frown showed years of loss weighing on him. His separation from Leia and loss of Ben haunted every decision. This weathered smuggler still fought for what mattered. Han\'s frown captured decades of hard choices.',
    description_de: 'Der ältere Han Solo mit Stirnrunzeln zeigte Jahre des Verlusts, die auf ihm lasteten. Seine Trennung von Leia und der Verlust von Ben verfolgten jede Entscheidung. Dieser verwitterte Schmuggler kämpfte immer noch für das, was wichtig war. Hans Stirnrunzeln erfasste Jahrzehnte schwerer Entscheidungen.',
    description_fr: 'Le Han Solo plus âgé avec froncement de sourcils montrait des années de perte pesant sur lui. Sa séparation de Leia et la perte de Ben hantaient chaque décision. Ce contrebandier usé se battait toujours pour ce qui comptait. Le froncement de sourcils de Han capturait des décennies de choix difficiles.',
    description_es: 'El Han Solo mayor con ceño fruncido mostraba años de pérdida pesando sobre él. Su separación de Leia y pérdida de Ben atormentaban cada decisión. Este contrabandista desgastado aún luchaba por lo que importaba. El ceño fruncido de Han capturaba décadas de elecciones difíciles.'
  },
  {
    minifigure_no: 'sw0729',
    name: 'Rey - Dark Tan Vest, Belt',
    description_en: 'Rey in dark tan vest with belt showed her scavenger practical attire. Her resourcefulness helped her survive Jakku\'s harsh conditions. This variant captured Rey before discovering her Force potential. Her survival skills proved as valuable as any training.',
    description_de: 'Rey in dunkel-beiger Weste mit Gürtel zeigte ihre praktische Plünderer-Kleidung. Ihre Einfallsreichtum half ihr, Jakkus harte Bedingungen zu überleben. Diese Variante erfasste Rey vor der Entdeckung ihres Macht-Potenzials. Ihre Überlebensfähigkeiten erwiesen sich als wertvoll wie jedes Training.',
    description_fr: 'Rey en gilet beige foncé avec ceinture montrait sa tenue pratique de récupératrice. Son ingéniosité l\'aidait à survivre aux conditions difficiles de Jakku. Cette variante capturait Rey avant de découvrir son potentiel de Force. Ses compétences de survie se sont révélées aussi précieuses que n\'importe quel entraînement.',
    description_es: 'Rey en chaleco beige oscuro con cinturón mostraba su atuendo práctico de carroñera. Su ingenio la ayudaba a sobrevivir las condiciones duras de Jakku. Esta variante capturaba a Rey antes de descubrir su potencial de Fuerza. Sus habilidades de supervivencia resultaron tan valiosas como cualquier entrenamiento.'
  },
  {
    minifigure_no: 'sw0730',
    name: 'BB-8',
    description_en: 'BB-8 served as Poe Dameron\'s loyal astromech droid. His spherical design provided unique mobility. BB-8 carried the crucial map to Luke Skywalker. This plucky droid\'s personality endeared him to the Resistance.',
    description_de: 'BB-8 diente als Poe Damerons treuer Astromech-Droide. Sein kugelförmiges Design bot einzigartige Mobilität. BB-8 trug die entscheidende Karte zu Luke Skywalker. Die mutige Persönlichkeit dieses Droiden machte ihn beim Widerstand beliebt.',
    description_fr: 'BB-8 servait comme droïde astromech fidèle de Poe Dameron. Sa conception sphérique offrait une mobilité unique. BB-8 transportait la carte cruciale vers Luke Skywalker. La personnalité courageuse de ce droïde l\'a rendu cher à la Résistance.',
    description_es: 'BB-8 servía como droide astromecánico leal de Poe Dameron. Su diseño esférico proporcionaba movilidad única. BB-8 llevaba el mapa crucial hacia Luke Skywalker. La personalidad valiente de este droide lo hizo querido por la Resistencia.'
  },
  {
    minifigure_no: 'sw0731',
    name: 'First Order TIE Pilot',
    description_en: 'First Order TIE Pilots flew advanced fighters with shields and hyperdrives. Their enhanced training surpassed Imperial standards. These pilots represented First Order technological superiority. Elite flight training made them dangerous adversaries.',
    description_de: 'TIE-Piloten der Ersten Ordnung flogen fortgeschrittene Jäger mit Schilden und Hyperantrieben. Ihre verbesserte Ausbildung übertraf imperiale Standards. Diese Piloten repräsentierten technologische Überlegenheit der Ersten Ordnung. Elite-Flugausbildung machte sie zu gefährlichen Gegnern.',
    description_fr: 'Les Pilotes TIE du Premier Ordre pilotaient des chasseurs avancés avec boucliers et hyperdrives. Leur formation améliorée surpassait les normes impériales. Ces pilotes représentaient la supériorité technologique du Premier Ordre. La formation de vol d\'élite en faisait des adversaires dangereux.',
    description_es: 'Los Pilotos TIE de Primera Orden volaban cazas avanzados con escudos e hiperimpulsores. Su entrenamiento mejorado superaba estándares imperiales. Estos pilotos representaban superioridad tecnológica de Primera Orden. El entrenamiento de vuelo de élite los hacía adversarios peligrosos.'
  },
  {
    minifigure_no: 'sw0732',
    name: 'General Leia Organa',
    description_en: 'General Leia Organa led the Resistance against the First Order decades after Endor. Her diplomatic skills and military experience proved invaluable. Leia\'s strength persisted despite personal tragedies. This legendary leader fought tyranny across three generations.',
    description_de: 'General Leia Organa führte den Widerstand gegen die Erste Ordnung Jahrzehnte nach Endor an. Ihre diplomatischen Fähigkeiten und militärische Erfahrung erwiesen sich als unbezahlbar. Leias Stärke bestand trotz persönlicher Tragödien. Diese legendäre Anführerin kämpfte gegen Tyrannei über drei Generationen.',
    description_fr: 'La Générale Leia Organa dirigeait la Résistance contre le Premier Ordre des décennies après Endor. Ses compétences diplomatiques et son expérience militaire se sont révélées inestimables. La force de Leia persistait malgré les tragédies personnelles. Cette leader légendaire combattait la tyrannie sur trois générations.',
    description_es: 'La General Leia Organa lideraba la Resistencia contra la Primera Orden décadas después de Endor. Sus habilidades diplomáticas y experiencia militar resultaron invaluables. La fuerza de Leia persistía a pesar de tragedias personales. Esta líder legendaria luchaba contra tiranía a través de tres generaciones.'
  },
  {
    minifigure_no: 'sw0733',
    name: 'FN-2199 (Nines) - Stormtrooper',
    description_en: 'FN-2199, nicknamed Nines, confronted his former squadmate Finn as a traitor. His loyalty to the First Order never wavered. Nines wielded a Z6 baton in their brutal confrontation. This stormtrooper represented unwavering indoctrination.',
    description_de: 'FN-2199, genannt Nines, konfrontierte seinen ehemaligen Kameraden Finn als Verräter. Seine Loyalität zur Ersten Ordnung schwankte nie. Nines führte einen Z6-Schlagstock in ihrer brutalen Konfrontation. Dieser Sturmtruppler repräsentierte unerschütterliche Indoktrination.',
    description_fr: 'FN-2199, surnommé Nines, confrontait son ancien camarade Finn en tant que traître. Sa loyauté envers le Premier Ordre n\'a jamais faibli. Nines maniait un bâton Z6 dans leur confrontation brutale. Ce stormtrooper représentait l\'endoctrinement inébranlable.',
    description_es: 'FN-2199, apodado Nines, confrontó a su ex compañero Finn como traidor. Su lealtad a la Primera Orden nunca flaqueó. Nines manejaba un bastón Z6 en su confrontación brutal. Este stormtrooper representaba adoctrinamiento inquebrantable.'
  },
  {
    minifigure_no: 'sw0734',
    name: 'First Order Stormtrooper Sergeant',
    description_en: 'First Order Stormtrooper Sergeants commanded squad-level operations. Their red pauldrons designated their rank. These non-commissioned officers maintained discipline and tactical execution. Sergeants bridged the gap between officers and troopers.',
    description_de: 'Sturmtruppler-Sergeants der Ersten Ordnung befehligten Trupp-Operationen. Ihre roten Schulterstücke bezeichneten ihren Rang. Diese Unteroffiziere erhielten Disziplin und taktische Ausführung. Sergeants überbrückten die Lücke zwischen Offizieren und Truppen.',
    description_fr: 'Les Sergents Stormtroopers du Premier Ordre commandaient des opérations au niveau de l\'escouade. Leurs pauldrons rouges désignaient leur rang. Ces sous-officiers maintenaient la discipline et l\'exécution tactique. Les sergents comblaient l\'écart entre les officiers et les soldats.',
    description_es: 'Los Sargentos Stormtrooper de Primera Orden comandaban operaciones a nivel de escuadra. Sus hombreras rojas designaban su rango. Estos suboficiales mantenían disciplina y ejecución táctica. Los sargentos salvaban la brecha entre oficiales y tropas.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0701-sw0734 (Part 2/2)...');

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

  console.log('Part 2 complete! All descriptions for sw0701-sw0734 have been saved.');
  await prisma.$disconnect();
}

saveBatch();
