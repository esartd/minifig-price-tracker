import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0548',
    name: 'Stormtrooper',
    description_en: 'Imperial Stormtroopers were the Empire\'s elite shock troops enforcing galactic order. Their white armor became the iconic symbol of Imperial military might. These soldiers underwent extensive training and conditioning. Despite poor accuracy in films, stormtroopers represented fearsome overwhelming force throughout the galaxy.',
    description_de: 'Imperiale Sturmtruppler waren die Elite-Stoßtruppen des Imperiums zur Durchsetzung galaktischer Ordnung. Ihre weiße Rüstung wurde zum ikonischen Symbol imperialer Militärmacht. Diese Soldaten durchliefen umfangreiche Ausbildung und Konditionierung. Trotz schlechter Genauigkeit in Filmen repräsentierten Sturmtruppler furchterregende überwältigende Kraft in der ganzen Galaxis.',
    description_fr: 'Les Stormtroopers Impériaux étaient les troupes de choc d\'élite de l\'Empire appliquant l\'ordre galactique. Leur armure blanche est devenue le symbole iconique de la puissance militaire impériale. Ces soldats suivaient une formation et un conditionnement intensifs. Malgré une mauvaise précision dans les films, les stormtroopers représentaient une force écrasante redoutable dans toute la galaxie.',
    description_es: 'Los Stormtroopers Imperiales eran las tropas de choque de élite del Imperio aplicando orden galáctico. Su armadura blanca se convirtió en el símbolo icónico del poderío militar imperial. Estos soldados se sometían a entrenamiento y acondicionamiento extensos. A pesar de poca precisión en películas, los stormtroopers representaban fuerza abrumadora temible por toda la galaxia.'
  },
  {
    minifigure_no: 'sw0549',
    name: 'Ewok',
    description_en: 'Ewoks were primitive yet resourceful teddy bear-like inhabitants of Endor\'s forest moon. These tribal warriors initially captured the Rebel strike team. Their guerrilla tactics and knowledge of forest terrain proved crucial in defeating Imperial forces. The Ewok celebration marked the Empire\'s final defeat.',
    description_de: 'Ewoks waren primitive aber einfallsreiche teddybär-ähnliche Bewohner von Endors Waldmond. Diese Stammeskrieger nahmen zunächst das Rebellen-Stoßtruppteam gefangen. Ihre Guerilla-Taktiken und Kenntnis des Waldgeländes erwiesen sich als entscheidend für die Niederlage imperialer Streitkräfte. Die Ewok-Feier markierte die endgültige Niederlage des Imperiums.',
    description_fr: 'Les Ewoks étaient des habitants primitifs mais ingénieux ressemblant à des ours en peluche de la lune forestière d\'Endor. Ces guerriers tribaux ont d\'abord capturé l\'équipe d\'assaut rebelle. Leurs tactiques de guérilla et leur connaissance du terrain forestier se sont révélées cruciales pour vaincre les forces impériales. La célébration Ewok a marqué la défaite finale de l\'Empire.',
    description_es: 'Los Ewoks eran habitantes primitivos pero ingeniosos parecidos a osos de peluche de la luna forestal de Endor. Estos guerreros tribales inicialmente capturaron al equipo de asalto rebelde. Sus tácticas de guerrilla y conocimiento del terreno forestal resultaron cruciales para derrotar fuerzas imperiales. La celebración Ewok marcó la derrota final del Imperio.'
  },
  {
    minifigure_no: 'sw0550',
    name: 'Treadwell Droid - White and Red Body, Dark Bluish Gray Binoculars',
    description_en: 'Treadwell droids were common repair and maintenance units on moisture farms throughout Tatooine. This white and red variant with binoculars performed diagnostic work. These wheeled droids handled routine mechanical tasks. Owen Lars owned a Treadwell unit before purchasing R2-D2 and C-3PO.',
    description_de: 'Treadwell-Droiden waren gängige Reparatur- und Wartungseinheiten auf Feuchtigkeitsfarmen in ganz Tatooine. Diese weiß-rote Variante mit Fernglas führte Diagnosearbeiten durch. Diese Rad-Droiden erledigten routinemäßige mechanische Aufgaben. Owen Lars besaß eine Treadwell-Einheit vor dem Kauf von R2-D2 und C-3PO.',
    description_fr: 'Les droïdes Treadwell étaient des unités de réparation et maintenance communes sur les fermes d\'humidité à travers Tatooine. Cette variante blanche et rouge avec jumelles effectuait des travaux de diagnostic. Ces droïdes à roues géraient les tâches mécaniques de routine. Owen Lars possédait une unité Treadwell avant d\'acheter R2-D2 et C-3PO.',
    description_es: 'Los droides Treadwell eran unidades comunes de reparación y mantenimiento en granjas de humedad por todo Tatooine. Esta variante blanca y roja con binoculares realizaba trabajo de diagnóstico. Estos droides con ruedas manejaban tareas mecánicas rutinarias. Owen Lars poseía una unidad Treadwell antes de comprar R2-D2 y C-3PO.'
  },
  {
    minifigure_no: 'sw0551',
    name: 'Luke Skywalker (Tatooine, White Legs, Detailed Face Print)',
    description_en: 'Young Luke Skywalker on Tatooine dreamed of adventure beyond moisture farming. This detailed variant shows his farm boy appearance with white legs. Luke\'s journey began when he discovered Princess Leia\'s message in R2-D2. His simple origins contrasted dramatically with his destiny as the galaxy\'s last Jedi hope.',
    description_de: 'Der junge Luke Skywalker auf Tatooine träumte von Abenteuern jenseits der Feuchtigkeitslandwirtschaft. Diese detaillierte Variante zeigt sein Farmjungen-Erscheinungsbild mit weißen Beinen. Lukes Reise begann, als er Prinzessin Leias Nachricht in R2-D2 entdeckte. Seine einfache Herkunft kontrastierte dramatisch mit seinem Schicksal als letzte Jedi-Hoffnung der Galaxis.',
    description_fr: 'Le jeune Luke Skywalker sur Tatooine rêvait d\'aventure au-delà de la culture d\'humidité. Cette variante détaillée montre son apparence de garçon de ferme avec jambes blanches. Le voyage de Luke a commencé quand il a découvert le message de la Princesse Leia dans R2-D2. Ses origines simples contrastaient dramatiquement avec son destin comme dernier espoir Jedi de la galaxie.',
    description_es: 'El joven Luke Skywalker en Tatooine soñaba con aventura más allá de la agricultura de humedad. Esta variante detallada muestra su apariencia de granjero con piernas blancas. El viaje de Luke comenzó cuando descubrió el mensaje de la Princesa Leia en R2-D2. Sus orígenes simples contrastaban dramáticamente con su destino como última esperanza Jedi de la galaxia.'
  },
  {
    minifigure_no: 'sw0552',
    name: 'Obi-Wan Kenobi - Old, Dark Brown Hooded Coat',
    description_en: 'Old Ben Kenobi lived as a hermit on Tatooine watching over young Luke from afar. This variant in dark brown hooded coat showed his weathered exile appearance. Obi-Wan\'s sacrifice aboard the Death Star allowed Luke and friends to escape. His Force ghost continued guiding Luke\'s journey.',
    description_de: 'Der alte Ben Kenobi lebte als Einsiedler auf Tatooine und wachte aus der Ferne über den jungen Luke. Diese Variante in dunklem braunen Kapuzenmantel zeigte sein verwittertes Exil-Erscheinungsbild. Obi-Wans Opfer an Bord des Todessterns ermöglichte Luke und Freunden die Flucht. Sein Macht-Geist führte Lukes Reise weiter.',
    description_fr: 'Le vieux Ben Kenobi vivait en ermite sur Tatooine surveillant le jeune Luke de loin. Cette variante en manteau à capuche brun foncé montrait son apparence d\'exil usée. Le sacrifice d\'Obi-Wan à bord de l\'Étoile de la Mort a permis à Luke et ses amis de s\'échapper. Son fantôme de Force a continué à guider le voyage de Luke.',
    description_es: 'El viejo Ben Kenobi vivía como ermitaño en Tatooine vigilando al joven Luke desde lejos. Esta variante en abrigo con capucha marrón oscuro mostraba su apariencia de exilio desgastada. El sacrificio de Obi-Wan a bordo de la Estrella de la Muerte permitió a Luke y amigos escapar. Su fantasma de Fuerza continuó guiando el viaje de Luke.'
  },
  {
    minifigure_no: 'sw0553',
    name: 'Greedo - Medium Nougat Vest, Belt on Legs, Medium Azure Legs',
    description_en: 'Greedo was the unfortunate Rodian bounty hunter who confronted Han Solo in the Mos Eisley cantina. This variant features medium nougat vest and azure legs. Greedo\'s fatal mistake was threatening Han at close range. The "who shot first" debate became Star Wars legend.',
    description_de: 'Greedo war der unglückliche rodianische Kopfgeldjäger, der Han Solo in der Mos-Eisley-Cantina konfrontierte. Diese Variante zeigt mittlere Nougat-Weste und azurblaue Beine. Gree dos fataler Fehler war, Han aus nächster Nähe zu bedrohen. Die "wer schoss zuerst"-Debatte wurde zur Star-Wars-Legende.',
    description_fr: 'Greedo était le malheureux chasseur de primes Rodien qui a confronté Han Solo dans la cantina de Mos Eisley. Cette variante présente un gilet nougat moyen et des jambes azur moyen. L\'erreur fatale de Greedo était de menacer Han à courte portée. Le débat "qui a tiré en premier" est devenu une légende Star Wars.',
    description_es: 'Greedo era el desafortunado cazarrecompensas Rodiano que confrontó a Han Solo en la cantina de Mos Eisley. Esta variante presenta chaleco beige medio y piernas azul medio. El error fatal de Greedo fue amenazar a Han a corta distancia. El debate de "quién disparó primero" se convirtió en leyenda de Star Wars.'
  },
  {
    minifigure_no: 'sw0554',
    name: 'Bith Musician',
    description_en: 'Bith musicians formed the iconic cantina band playing jizz music in Mos Eisley. Their distinctive bulbous heads housed highly developed brains. The Modal Nodes band became synonymous with Star Wars cantina atmosphere. Bith represented the diverse alien species populating the galaxy.',
    description_de: 'Bith-Musiker bildeten die ikonische Cantina-Band, die Jizz-Musik in Mos Eisley spielte. Ihre markanten kugelförmigen Köpfe beherbergten hochentwickelte Gehirne. Die Modal-Nodes-Band wurde synonym mit Star-Wars-Cantina-Atmosphäre. Bith repräsentierten die vielfältigen Alien-Spezies, die die Galaxis bevölkerten.',
    description_fr: 'Les musiciens Bith formaient le groupe iconique de la cantina jouant de la musique jizz à Mos Eisley. Leurs têtes bulbeuses distinctives abritaient des cerveaux hautement développés. Le groupe Modal Nodes est devenu synonyme d\'atmosphère de cantina Star Wars. Les Bith représentaient les diverses espèces aliens peuplant la galaxie.',
    description_es: 'Los músicos Bith formaban la icónica banda de cantina tocando música jizz en Mos Eisley. Sus distintivas cabezas bulbosas albergaban cerebros altamente desarrollados. La banda Modal Nodes se volvió sinónimo de atmósfera de cantina de Star Wars. Los Bith representaban las diversas especies alienígenas poblando la galaxia.'
  },
  {
    minifigure_no: 'sw0555',
    name: 'Astromech Droid, R2-A5',
    description_en: 'R2-A5 was a red astromech droid serving aboard Rebel starfighters. These utility droids provided navigation, repair, and combat support during missions. Astromechs came in various color schemes identifying different squadrons. Their loyalty and technical skills made them invaluable to pilots.',
    description_de: 'R2-A5 war ein roter Astromech-Droide, der an Bord von Rebellen-Sternjägern diente. Diese Nutzdroi den boten Navigation, Reparatur und Kampfunterstützung während Missionen. Astromechs kamen in verschiedenen Farbschemata vor, die verschiedene Staffeln identifizierten. Ihre Loyalität und technischen Fähigkeiten machten sie für Piloten unschätzbar.',
    description_fr: 'R2-A5 était un droïde astromech rouge servant à bord de chasseurs stellaires rebelles. Ces droïdes utilitaires fournissaient navigation, réparation et support de combat pendant les missions. Les astromechs venaient dans divers schémas de couleurs identifiant différents escadrons. Leur loyauté et compétences techniques les rendaient inestimables pour les pilotes.',
    description_es: 'R2-A5 era un droide astromech rojo sirviendo a bordo de cazas estelares rebeldes. Estos droides utilitarios proporcionaban navegación, reparación y soporte de combate durante misiones. Los astromechs venían en varios esquemas de color identificando diferentes escuadrones. Su lealtad y habilidades técnicas los hacían invaluables para pilotos.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0548-sw0555...');

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
