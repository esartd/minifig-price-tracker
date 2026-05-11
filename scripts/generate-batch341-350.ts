import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    no: 'sw0449',
    name: 'Clone Trooper - Phase II',
    en: 'Phase II Clone Troopers represent the upgraded armor worn by the Republic\'s clone army during the later stages of the Clone Wars in Revenge of the Sith. This minifigure features improved white armor with better mobility, updated helmet design with enhanced optics, and unit markings in various colors. As the more advanced clone armor seen in Episode III, Phase II represents the Republic military at its peak before Order 66. Released in countless battle packs and Episode III sets, these upgraded troopers are essential for building late Clone Wars armies and remain among the most produced Star Wars minifigures.',
    de: 'Phase-II-Klonkrieger repräsentieren die verbesserte Rüstung, die von der Klon-Armee der Republik während der späteren Phasen der Klonkriege in Die Rache der Sith getragen wird. Diese Minifigur zeigt verbesserte weiße Rüstung mit besserer Mobilität, aktualisiertem Helmdesign mit verbesserter Optik und Einheitsmarkierungen in verschiedenen Farben. Als die fortschrittlichere Klonrüstung aus Episode III repräsentiert Phase II das republikanische Militär auf seinem Höhepunkt vor Order 66. Veröffentlicht in zahllosen Kampfpaketen und Episode III-Sets, sind diese verbesserten Truppen unerlässlich für den Aufbau später Klonkriegs-Armeen und bleiben unter den am häufigsten produzierten Star Wars-Minifiguren.',
    fr: 'Les Clone Troopers de Phase II représentent l\'armure améliorée portée par l\'armée de clones de la République pendant les dernières étapes des Guerres des Clones dans La Revanche des Sith. Cette minifigurine présente une armure blanche améliorée avec meilleure mobilité, design de casque mis à jour avec optique améliorée, et marques d\'unité dans diverses couleurs. En tant qu\'armure de clone plus avancée vue dans l\'Épisode III, la Phase II représente le militaire républicain à son apogée avant l\'Ordre 66. Sortie dans d\'innombrables packs de bataille et sets Épisode III, ces soldats améliorés sont essentiels pour construire des armées de fin des Guerres des Clones et restent parmi les minifigurines Star Wars les plus produites.',
    es: 'Los Clone Troopers de Fase II representan la armadura mejorada usada por el ejército clon de la República durante las etapas finales de las Guerras Clon en La Venganza de los Sith. Esta minifigura presenta armadura blanca mejorada con mejor movilidad, diseño de casco actualizado con óptica mejorada y marcas de unidad en varios colores. Como la armadura clon más avanzada vista en el Episodio III, la Fase II representa al militar republicano en su apogeo antes de la Orden 66. Lanzada en innumerables paquetes de batalla y sets del Episodio III, estos soldados mejorados son esenciales para construir ejércitos de finales de las Guerras Clon y permanecen entre las minifiguras de Star Wars más producidas.'
  },
  {
    no: 'sw0450',
    name: 'Clone Pilot',
    en: 'Clone Pilots operate the Republic\'s starfighters, gunships, and other aerial vehicles throughout the Clone Wars. This minifigure features distinctive yellow and white flight suit with specialized helmet, life support equipment, and clone pilot markings. Flying ARC-170s, V-wings, and LAAT gunships, these specialized clones provide crucial air support. Released in various starfighter and gunship sets, clone pilots are essential for Republic fleet displays and represent the elite aviators of the Grand Army.',
    de: 'Klonpiloten bedienen die Sternenjäger, Kampfschiffe und andere Luftfahrzeuge der Republik während der gesamten Klonkriege. Diese Minifigur zeigt einen charakteristischen gelben und weißen Fluganzug mit spezialisiertem Helm, Lebenserhaltungsausrüstung und Klonpiloten-Markierungen. ARC-170s, V-Wings und LAAT-Kampfschiffe fliegend, bieten diese spezialisierten Klone entscheidende Luftunterstützung. Veröffentlicht in verschiedenen Sternenjäger- und Kampfschiff-Sets, sind Klonpiloten unerlässlich für republikanische Flotten-Displays und repräsentieren die Elite-Flieger der Großen Armee.',
    fr: 'Les Pilotes Clones opèrent les chasseurs stellaires, canonnières, et autres véhicules aériens de la République tout au long des Guerres des Clones. Cette minifigurine présente une combinaison de vol jaune et blanche distinctive avec casque spécialisé, équipement de survie, et marques de pilote clone. Pilotant des ARC-170, V-wings, et canonnières LAAT, ces clones spécialisés fournissent un soutien aérien crucial. Sortie dans divers sets de chasseur stellaire et canonnière, les pilotes clones sont essentiels pour les displays de flotte républicaine et représentent les aviateurs d\'élite de la Grande Armée.',
    es: 'Los Pilotos Clon operan los cazas estelares, cañoneras y otros vehículos aéreos de la República a lo largo de las Guerras Clon. Esta minifigura presenta distintivo traje de vuelo amarillo y blanco con casco especializado, equipo de soporte vital y marcas de piloto clon. Volando ARC-170s, V-wings y cañoneras LAAT, estos clones especializados proporcionan apoyo aéreo crucial. Lanzada en varios sets de caza estelar y cañonera, los pilotos clon son esenciales para exhibiciones de flota republicana y representan a los aviadores de élite del Gran Ejército.'
  },
  {
    no: 'sw0451',
    name: 'Clone Trooper - 501st Legion',
    en: 'The 501st Legion, also known as "Vader\'s Fist," is the elite clone unit personally led by Anakin Skywalker with distinctive blue markings. This minifigure features Phase II white armor with blue stripes and markings denoting the legendary 501st. From the siege of the Jedi Temple during Order 66 to later service as Imperial stormtroopers, the 501st represents the most famous clone unit. Released in numerous sets, these blue-marked troopers are among the most popular clones with collectors and army builders.',
    de: 'Die 501. Legion, auch bekannt als "Vaders Faust," ist die Elite-Kloneinheit, die persönlich von Anakin Skywalker mit charakteristischen blauen Markierungen angeführt wird. Diese Minifigur zeigt Phase-II-weiße Rüstung mit blauen Streifen und Markierungen, die die legendäre 501. bezeichnen. Von der Belagerung des Jedi-Tempels während Order 66 bis zum späteren Dienst als imperiale Sturmtruppen repräsentiert die 501. die berühmteste Kloneinheit. Veröffentlicht in zahlreichen Sets, sind diese blau markierten Truppen unter den beliebtesten Klonen bei Sammlern und Armee-Bauern.',
    fr: 'La 501ème Légion, également connue sous le nom de "Poing de Vader," est l\'unité de clone d\'élite personnellement dirigée par Anakin Skywalker avec des marques bleues distinctives. Cette minifigurine présente une armure blanche de Phase II avec rayures et marques bleues dénotant la légendaire 501ème. Du siège du Temple Jedi pendant l\'Ordre 66 au service ultérieur comme stormtroopers impériaux, la 501ème représente l\'unité de clone la plus célèbre. Sortie dans de nombreux sets, ces soldats marqués en bleu sont parmi les clones les plus populaires auprès des collectionneurs et constructeurs d\'armée.',
    es: 'La Legión 501, también conocida como "Puño de Vader," es la unidad clon de élite liderada personalmente por Anakin Skywalker con distintivas marcas azules. Esta minifigura presenta armadura blanca de Fase II con rayas y marcas azules denotando la legendaria 501. Desde el asedio del Templo Jedi durante la Orden 66 hasta el servicio posterior como stormtroopers Imperiales, la 501 representa la unidad clon más famosa. Lanzada en numerosos sets, estos soldados marcados en azul están entre los clones más populares con coleccionistas y constructores de ejércitos.'
  },
  {
    no: 'sw0452',
    name: 'Clone Trooper - 212th Attack Battalion',
    en: 'The 212th Attack Battalion serves under Obi-Wan Kenobi with distinctive orange markings throughout the Clone Wars. This minifigure features Phase II armor with orange stripes denoting the unit that fought on Utapau and other key battles. Led by Commander Cody, the 212th represents one of the Republic\'s most effective combat units. Released in various Clone Wars battle sets, these orange-marked clones are popular with army builders creating Obi-Wan\'s forces.',
    de: 'Das 212. Angriffsbataillon dient unter Obi-Wan Kenobi mit charakteristischen orangen Markierungen während der gesamten Klonkriege. Diese Minifigur zeigt Phase-II-Rüstung mit orangen Streifen, die die Einheit bezeichnen, die auf Utapau und anderen Schlüsselschlachten kämpfte. Angeführt von Commander Cody, repräsentiert die 212. eine der effektivsten Kampfeinheiten der Republik. Veröffentlicht in verschiedenen Klonkriegs-Schlacht-Sets, sind diese orange markierten Klone bei Armee-Bauern beliebt, die Obi-Wans Streitkräfte erstellen.',
    fr: 'Le 212ème Bataillon d\'Attaque sert sous Obi-Wan Kenobi avec des marques orange distinctives tout au long des Guerres des Clones. Cette minifigurine présente une armure de Phase II avec rayures orange dénotant l\'unité qui a combattu sur Utapau et d\'autres batailles clés. Dirigé par le Commandant Cody, le 212ème représente l\'une des unités de combat les plus efficaces de la République. Sortie dans divers sets de bataille des Guerres des Clones, ces clones marqués en orange sont populaires auprès des constructeurs d\'armée créant les forces d\'Obi-Wan.',
    es: 'El Batallón de Ataque 212 sirve bajo Obi-Wan Kenobi con distintivas marcas naranjas a lo largo de las Guerras Clon. Esta minifigura presenta armadura de Fase II con rayas naranjas denotando la unidad que luchó en Utapau y otras batallas clave. Liderado por el Comandante Cody, el 212 representa una de las unidades de combate más efectivas de la República. Lanzada en varios sets de batalla de las Guerras Clon, estos clones marcados en naranja son populares con constructores de ejércitos creando las fuerzas de Obi-Wan.'
  },
  {
    no: 'sw0453',
    name: 'ARC Trooper',
    en: 'Advanced Recon Commandos (ARC Troopers) are elite special forces clones trained for the most dangerous missions during the Clone Wars. This minifigure features specialized armor with additional equipment, dual pistols, kama skirt, and unique markings. More independent and skilled than regular clones, ARC Troopers represent the Republic\'s special operations forces. Released in various Clone Wars sets, these elite troopers are highly valued by collectors for their distinctive armor and special forces status.',
    de: 'Advanced Recon Commandos (ARC-Truppen) sind Elite-Spezialkräfte-Klone, die für die gefährlichsten Missionen während der Klonkriege ausgebildet wurden. Diese Minifigur zeigt spezialisierte Rüstung mit zusätzlicher Ausrüstung, dualen Pistolen, Kama-Rock und einzigartigen Markierungen. Unabhängiger und geschickter als reguläre Klone, repräsentieren ARC-Truppen die Spezialoperationsstreitkräfte der Republik. Veröffentlicht in verschiedenen Klonkriegs-Sets, werden diese Elite-Truppen von Sammlern wegen ihrer charakteristischen Rüstung und ihres Spezialkräfte-Status sehr geschätzt.',
    fr: 'Les Advanced Recon Commandos (ARC Troopers) sont des clones de forces spéciales d\'élite entraînés pour les missions les plus dangereuses pendant les Guerres des Clones. Cette minifigurine présente une armure spécialisée avec équipement supplémentaire, pistolets doubles, jupe kama, et marques uniques. Plus indépendants et qualifiés que les clones réguliers, les ARC Troopers représentent les forces d\'opérations spéciales de la République. Sortie dans divers sets des Guerres des Clones, ces soldats d\'élite sont très appréciés par les collectionneurs pour leur armure distinctive et leur statut de forces spéciales.',
    es: 'Los Advanced Recon Commandos (ARC Troopers) son clones de fuerzas especiales de élite entrenados para las misiones más peligrosas durante las Guerras Clon. Esta minifigura presenta armadura especializada con equipo adicional, pistolas duales, falda kama y marcas únicas. Más independientes y hábiles que los clones regulares, los ARC Troopers representan las fuerzas de operaciones especiales de la República. Lanzada en varios sets de las Guerras Clon, estos soldados de élite son muy valorados por coleccionistas por su armadura distintiva y estatus de fuerzas especiales.'
  },
  {
    no: 'sw0454',
    name: 'Clone Commander',
    en: 'Clone Commanders are the officer-ranked clones who lead battalions and legions throughout the Clone Wars. This minifigure features Phase II armor with distinctive colored markings, pauldron shoulder armor, kama skirt, antenna, and specialized equipment denoting command rank. As leaders of clone forces, these commanders represent the military hierarchy of the Grand Army. Released in various command and battle sets, clone commanders are essential for building complete Republic armies with proper command structure.',
    de: 'Klon-Kommandanten sind die im Offiziersrang stehenden Klone, die während der gesamten Klonkriege Bataillone und Legionen anführen. Diese Minifigur zeigt Phase-II-Rüstung mit charakteristischen farbigen Markierungen, Schulterpanzer-Schulterstück, Kama-Rock, Antenne und spezialisierter Ausrüstung, die Kommandorang bezeichnet. Als Anführer von Klonstruppen repräsentieren diese Kommandanten die militärische Hierarchie der Großen Armee. Veröffentlicht in verschiedenen Kommando- und Schlacht-Sets, sind Klon-Kommandanten unerlässlich für den Aufbau vollständiger republikanischer Armeen mit ordnungsgemäßer Kommandostruktur.',
    fr: 'Les Commandants Clones sont les clones de rang d\'officier qui dirigent des bataillons et légions tout au long des Guerres des Clones. Cette minifigurine présente une armure de Phase II avec marques colorées distinctives, épaulette d\'armure d\'épaule, jupe kama, antenne, et équipement spécialisé dénotant le rang de commandement. En tant que leaders des forces de clones, ces commandants représentent la hiérarchie militaire de la Grande Armée. Sortie dans divers sets de commandement et bataille, les commandants clones sont essentiels pour construire des armées républicaines complètes avec structure de commandement appropriée.',
    es: 'Los Comandantes Clon son los clones de rango de oficial que lideran batallones y legiones a lo largo de las Guerras Clon. Esta minifigura presenta armadura de Fase II con distintivas marcas de colores, armadura de hombrera pauldron, falda kama, antena y equipo especializado denotando rango de comando. Como líderes de fuerzas clon, estos comandantes representan la jerarquía militar del Gran Ejército. Lanzada en varios sets de comando y batalla, los comandantes clon son esenciales para construir ejércitos republicanos completos con estructura de comando apropiada.'
  },
  {
    no: 'sw0455',
    name: 'Shock Trooper',
    en: 'Shock Troopers are the elite Coruscant Guard clones who serve as security forces on the Republic capital with distinctive red markings. This minifigure features Phase II armor with red stripes, specialized police equipment, and DC-15 blaster. Responsible for Senate security and maintaining order on Coruscant, Shock Troopers represent the Republic\'s military police. Released in various Coruscant and Senate sets, these red-marked clones add diversity to Republic clone armies.',
    de: 'Schocktruppen sind die Elite-Coruscant-Garde-Klone, die als Sicherheitskräfte in der republikanischen Hauptstadt mit charakteristischen roten Markierungen dienen. Diese Minifigur zeigt Phase-II-Rüstung mit roten Streifen, spezialisierter Polizeiausrüstung und DC-15-Blaster. Verantwortlich für Senats-Sicherheit und Aufrechterhaltung der Ordnung auf Coruscant, repräsentieren Schocktruppen die Militärpolizei der Republik. Veröffentlicht in verschiedenen Coruscant- und Senats-Sets, fügen diese rot markierten Klone Vielfalt zu republikanischen Klon-Armeen hinzu.',
    fr: 'Les Shock Troopers sont les clones d\'élite de la Garde de Coruscant qui servent comme forces de sécurité sur la capitale de la République avec des marques rouges distinctives. Cette minifigurine présente une armure de Phase II avec rayures rouges, équipement de police spécialisé, et blaster DC-15. Responsables de la sécurité du Sénat et du maintien de l\'ordre sur Coruscant, les Shock Troopers représentent la police militaire de la République. Sortie dans divers sets Coruscant et Sénat, ces clones marqués en rouge ajoutent de la diversité aux armées de clones républicaines.',
    es: 'Los Shock Troopers son los clones de élite de la Guardia de Coruscant que sirven como fuerzas de seguridad en la capital de la República con distintivas marcas rojas. Esta minifigura presenta armadura de Fase II con rayas rojas, equipo policial especializado y bláster DC-15. Responsables de la seguridad del Senado y mantener el orden en Coruscant, los Shock Troopers representan la policía militar de la República. Lanzada en varios sets de Coruscant y Senado, estos clones marcados en rojo añaden diversidad a los ejércitos clon republicanos.'
  },
  {
    no: 'sw0456',
    name: 'Chancellor Palpatine - Episode III',
    en: 'Chancellor Palpatine in Revenge of the Sith orchestrates the final stages of his plan to destroy the Jedi and transform the Republic into the Empire. This minifigure depicts Palpatine in his Chancellor robes before revealing himself as Darth Sidious. From his "rescue" by Anakin to declaring himself Emperor, this version represents Palpatine at the moment of his ultimate triumph. Released in various Episode III sets, this variant captures the political mastermind behind the galaxy\'s fall into darkness.',
    de: 'Kanzler Palpatine orchestriert in Die Rache der Sith die finalen Phasen seines Plans, die Jedi zu zerstören und die Republik in das Imperium zu verwandeln. Diese Minifigur zeigt Palpatine in seinen Kanzler-Roben, bevor er sich als Darth Sidious offenbart. Von seiner "Rettung" durch Anakin bis zur Erklärung zum Imperator repräsentiert diese Version Palpatine im Moment seines ultimativen Triumphs. Veröffentlicht in verschiedenen Episode III-Sets, erfasst diese Variante das politische Superhirn hinter dem Fall der Galaxie in die Dunkelheit.',
    fr: 'Le Chancelier Palpatine dans La Revanche des Sith orchestre les étapes finales de son plan pour détruire les Jedi et transformer la République en Empire. Cette minifigurine dépeint Palpatine dans ses robes de Chancelier avant de se révéler comme Darth Sidious. De son "sauvetage" par Anakin à sa déclaration comme Empereur, cette version représente Palpatine au moment de son triomphe ultime. Sortie dans divers sets Épisode III, cette variante capture le cerveau politique derrière la chute de la galaxie dans les ténèbres.',
    es: 'El Canciller Palpatine en La Venganza de los Sith orquesta las etapas finales de su plan para destruir a los Jedi y transformar la República en el Imperio. Esta minifigura representa a Palpatine en sus túnicas de Canciller antes de revelarse como Darth Sidious. Desde su "rescate" por Anakin hasta declararse Emperador, esta versión representa a Palpatine en el momento de su triunfo final. Lanzada en varios sets del Episodio III, esta variante captura a la mente maestra política detrás de la caída de la galaxia en la oscuridad.'
  },
  {
    no: 'sw0457',
    name: 'Darth Sidious - Episode III',
    en: 'Darth Sidious reveals his true Sith identity and battles the Jedi Masters who attempt to arrest him in Revenge of the Sith. This minifigure depicts the unmasked Sith Lord with his disfigured face from Force lightning, dark robes, and red lightsaber. From killing Mace Windu to corrupting Anakin completely, Sidious represents pure evil triumphant. Released in Chancellor\'s office and duel sets, this unmasked variant shows the Emperor\'s true monstrous form.',
    de: 'Darth Sidious offenbart seine wahre Sith-Identität und kämpft gegen die Jedi-Meister, die versuchen, ihn in Die Rache der Sith zu verhaften. Diese Minifigur zeigt den demaskierten Sith-Lord mit seinem durch Macht-Blitze entstellten Gesicht, dunklen Roben und rotem Lichtschwert. Vom Töten von Mace Windu bis zur vollständigen Korrumpierung von Anakin repräsentiert Sidious triumphierendes reines Böses. Veröffentlicht in Kanzler-Büro- und Duell-Sets, zeigt diese demaskierte Variante die wahre monströse Form des Imperators.',
    fr: 'Darth Sidious révèle sa véritable identité Sith et combat les Maîtres Jedi qui tentent de l\'arrêter dans La Revanche des Sith. Cette minifigurine dépeint le Seigneur Sith démasqué avec son visage défiguré par l\'éclair de Force, robes sombres, et sabre laser rouge. Du meurtre de Mace Windu à la corruption complète d\'Anakin, Sidious représente le mal pur triomphant. Sortie dans des sets de bureau du Chancelier et duel, cette variante démasquée montre la véritable forme monstrueuse de l\'Empereur.',
    es: 'Darth Sidious revela su verdadera identidad Sith y batalla a los Maestros Jedi que intentan arrestarlo en La Venganza de los Sith. Esta minifigura representa al Señor Sith desenmascarado con su cara desfigurada por relámpagos de Fuerza, túnicas oscuras y sable de luz rojo. Desde matar a Mace Windu hasta corromper completamente a Anakin, Sidious representa el mal puro triunfante. Lanzada en sets de oficina del Canciller y duelo, esta variante desenmascarada muestra la verdadera forma monstruosa del Emperador.'
  },
  {
    no: 'sw0458',
    name: 'Padmé Amidala - Episode III',
    en: 'Padmé Amidala as a Senator fights to preserve democracy as the Republic crumbles around her in Revenge of the Sith. This minifigure depicts Padmé in her elegant senatorial attire during her pregnancy with Luke and Leia. From witnessing Anakin\'s fall to dying of a broken heart after childbirth, this version represents Padmé during the saga\'s most tragic moments. Released in various Episode III sets, this variant captures the former queen at her most vulnerable and heartbroken.',
    de: 'Padmé Amidala als Senatorin kämpft um die Bewahrung der Demokratie, während die Republik um sie herum in Die Rache der Sith zusammenbricht. Diese Minifigur zeigt Padmé in ihrer eleganten Senatorenkleidung während ihrer Schwangerschaft mit Luke und Leia. Vom Miterleben von Anakins Fall bis zum Sterben an gebrochenem Herzen nach der Geburt repräsentiert diese Version Padmé während der tragischsten Momente der Saga. Veröffentlicht in verschiedenen Episode III-Sets, erfasst diese Variante die ehemalige Königin in ihrem verwundbarsten und herzzerrissensten Zustand.',
    fr: 'Padmé Amidala en tant que Sénatrice combat pour préserver la démocratie alors que la République s\'effondre autour d\'elle dans La Revanche des Sith. Cette minifigurine dépeint Padmé dans sa tenue sénatoriale élégante pendant sa grossesse avec Luke et Leia. De témoigner la chute d\'Anakin à mourir d\'un cœur brisé après l\'accouchement, cette version représente Padmé pendant les moments les plus tragiques de la saga. Sortie dans divers sets Épisode III, cette variante capture l\'ancienne reine à son plus vulnérable et le cœur brisé.',
    es: 'Padmé Amidala como Senadora lucha por preservar la democracia mientras la República se derrumba a su alrededor en La Venganza de los Sith. Esta minifigura representa a Padmé en su elegante atuendo senatorial durante su embarazo con Luke y Leia. Desde presenciar la caída de Anakin hasta morir de corazón roto después del parto, esta versión representa a Padmé durante los momentos más trágicos de la saga. Lanzada en varios sets del Episodio III, esta variante captura a la ex reina en su momento más vulnerable y con el corazón roto.'
  }
];

async function saveBatch() {
  console.log('💾 Saving batch 341-350 (sw0449-sw0458) - 10 minifigs...\n');

  for (const m of batch) {
    try {
      await prisma.minifigCatalog.upsert({
        where: { minifigure_no: m.no },
        update: {
          description_en: m.en,
          description_de: m.de,
          description_fr: m.fr,
          description_es: m.es,
          description_generated_at: new Date(),
          description_status: 'generated'
        },
        create: {
          minifigure_no: m.no,
          name: m.name,
          category_id: 1,
          category_name: 'Star Wars',
          search_name: m.name.toLowerCase(),
          description_en: m.en,
          description_de: m.de,
          description_fr: m.fr,
          description_es: m.es,
          description_generated_at: new Date(),
          description_status: 'generated'
        }
      });
      console.log(`  ✅ ${m.no}: ${m.name}`);
    } catch (error: any) {
      console.error(`  ❌ ${m.no}: ${error.message}`);
    }
  }

  console.log('\n✨ Batch 341-350 complete: 10 minifigs (40 descriptions)');
  await prisma.$disconnect();
}

saveBatch().catch(console.error);
