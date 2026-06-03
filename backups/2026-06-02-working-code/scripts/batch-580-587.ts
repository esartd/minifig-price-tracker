import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0580',
    name: 'Snowtrooper Commander',
    description_en: 'Snowtrooper Commanders led Imperial cold assault forces during arctic operations. Their distinctive rank markings identified them as squad leaders. These officers coordinated snowtrooper tactics during the Battle of Hoth. Their leadership was crucial to the Empire\'s devastating ground assault on Echo Base.',
    description_de: 'Snowtrooper-Kommandanten führten imperiale Kälte-Angriffskräfte während arktischer Operationen an. Ihre markanten Rangabzeichen identifizierten sie als Truppführer. Diese Offiziere koordinierten Snowtrooper-Taktiken während der Schlacht von Hoth. Ihre Führung war entscheidend für den verheerenden Bodenangriff des Imperiums auf Echo Base.',
    description_fr: 'Les Commandants Snowtrooper dirigeaient les forces d\'assaut par temps froid impériales pendant les opérations arctiques. Leurs marques de rang distinctives les identifiaient comme chefs d\'escouade. Ces officiers coordonnaient les tactiques des snowtroopers pendant la Bataille de Hoth. Leur leadership était crucial pour l\'assaut terrestre dévastateur de l\'Empire sur la Base Echo.',
    description_es: 'Los Comandantes Snowtrooper lideraban fuerzas de asalto en frío imperiales durante operaciones árticas. Sus marcas de rango distintivas los identificaban como líderes de escuadrón. Estos oficiales coordinaban tácticas de snowtroopers durante la Batalla de Hoth. Su liderazgo era crucial para el asalto terrestre devastador del Imperio en Base Eco.'
  },
  {
    minifigure_no: 'sw0581',
    name: 'AT-AT Driver - Dark Red Imperial Logo, Grimacing',
    description_en: 'AT-AT Drivers piloted the Empire\'s massive All Terrain Armored Transport walkers. This variant with dark red Imperial logo and grimacing expression showed battle stress. These specialized pilots required extensive training to control the towering war machines. Their skill was essential during the assault on Hoth.',
    description_de: 'AT-AT-Fahrer pilotierten die massiven All Terrain Armored Transport-Walker des Imperiums. Diese Variante mit dunklem roten imperialen Logo und grimassierendem Ausdruck zeigte Kampfstress. Diese spezialisierten Piloten benötigten umfangreiche Ausbildung zur Kontrolle der hoch aufragenden Kriegsmaschinen. Ihre Fähigkeit war wesentlich während des Angriffs auf Hoth.',
    description_fr: 'Les Pilotes AT-AT pilotaient les marcheurs All Terrain Armored Transport massifs de l\'Empire. Cette variante avec logo impérial rouge foncé et expression grimaçante montrait le stress de bataille. Ces pilotes spécialisés nécessitaient une formation extensive pour contrôler les machines de guerre imposantes. Leur compétence était essentielle pendant l\'assaut sur Hoth.',
    description_es: 'Los Pilotos AT-AT pilotaban los masivos caminantes All Terrain Armored Transport del Imperio. Esta variante con logo imperial rojo oscuro y expresión de mueca mostraba estrés de batalla. Estos pilotos especializados requerían entrenamiento extenso para controlar las máquinas de guerra imponentes. Su habilidad era esencial durante el asalto en Hoth.'
  },
  {
    minifigure_no: 'sw0582',
    name: 'Imperial Officer (Captain / Commandant / Commander)',
    description_en: 'Imperial Officers commanded various levels of military operations throughout the Empire\'s forces. This generic officer variant represented captains, commandants, and commanders. Their rank plaques on black uniforms indicated command authority. These officers enforced Imperial order across countless star systems.',
    description_de: 'Imperiale Offiziere befehligten verschiedene Ebenen militärischer Operationen in den Streitkräften des Imperiums. Diese generische Offiziers-Variante repräsentierte Captains, Kommandanten und Commanders. Ihre Rangplaketten auf schwarzen Uniformen zeigten Befehlsgewalt. Diese Offiziere setzten imperiale Ordnung in unzähligen Sternensystemen durch.',
    description_fr: 'Les Officiers Impériaux commandaient divers niveaux d\'opérations militaires dans toutes les forces de l\'Empire. Cette variante d\'officier générique représentait des capitaines, des commandants et des commanders. Leurs plaques de rang sur uniformes noirs indiquaient l\'autorité de commandement. Ces officiers appliquaient l\'ordre impérial dans d\'innombrables systèmes stellaires.',
    description_es: 'Los Oficiales Imperiales comandaban varios niveles de operaciones militares a través de las fuerzas del Imperio. Esta variante de oficial genérica representaba capitanes, comandantes y commanders. Sus placas de rango en uniformes negros indicaban autoridad de comando. Estos oficiales aplicaban orden imperial a través de incontables sistemas estelares.'
  },
  {
    minifigure_no: 'sw0583',
    name: 'Imperial Navy Trooper - Nougat Head',
    description_en: 'Imperial Navy Troopers served as security forces aboard Star Destroyers and capital ships. This nougat head variant showed diversity among naval personnel. These soldiers maintained order on Imperial vessels and defended against boarding actions. Their black uniforms with helmets distinguished them from army stormtroopers.',
    description_de: 'Imperiale Marine-Truppen dienten als Sicherheitskräfte an Bord von Sternenzerstörern und Großschiffen. Diese Nougat-Kopf-Variante zeigte Vielfalt unter Marinepersonal. Diese Soldaten hielten Ordnung auf imperialen Schiffen und verteidigten gegen Enteraktionen. Ihre schwarzen Uniformen mit Helmen unterschieden sie von Armee-Sturmtrupplern.',
    description_fr: 'Les Soldats de la Marine Impériale servaient comme forces de sécurité à bord des Destroyers Stellaires et vaisseaux capitaux. Cette variante à tête nougat montrait la diversité parmi le personnel naval. Ces soldats maintenaient l\'ordre sur les vaisseaux impériaux et défendaient contre les actions d\'abordage. Leurs uniformes noirs avec casques les distinguaient des stormtroopers de l\'armée.',
    description_es: 'Los Soldados de la Marina Imperial servían como fuerzas de seguridad a bordo de Destructores Estelares y naves capitales. Esta variante de cabeza beige mostraba diversidad entre personal naval. Estos soldados mantenían orden en naves imperiales y defendían contra acciones de abordaje. Sus uniformes negros con cascos los distinguían de stormtroopers del ejército.'
  },
  {
    minifigure_no: 'sw0584',
    name: 'Imperial Crew - Dark Bluish Gray Cap, Plain Arms',
    description_en: 'Imperial crew members operated technical systems aboard Star Destroyers and military installations. This variant with dark bluish gray cap and plain arms represented engineering and operations personnel. These technicians maintained the Empire\'s vast military infrastructure. Their expertise kept Imperial war machines functioning.',
    description_de: 'Imperiale Besatzungsmitglieder operierten technische Systeme an Bord von Sternenzerstörern und militärischen Installationen. Diese Variante mit dunkler bläulich-grauer Kappe und einfachen Armen repräsentierte Ingenieur- und Betriebspersonal. Diese Techniker warteten die riesige militärische Infrastruktur des Imperiums. Ihre Expertise hielt die imperialen Kriegsmaschinen am Laufen.',
    description_fr: 'Les membres de l\'équipage impérial opéraient des systèmes techniques à bord des Destroyers Stellaires et installations militaires. Cette variante avec casquette gris bleuté foncé et bras simples représentait le personnel d\'ingénierie et d\'opérations. Ces techniciens maintenaient la vaste infrastructure militaire de l\'Empire. Leur expertise maintenait les machines de guerre impériales en fonctionnement.',
    description_es: 'Los miembros de tripulación imperial operaban sistemas técnicos a bordo de Destructores Estelares e instalaciones militares. Esta variante con gorra gris azulado oscuro y brazos simples representaba personal de ingeniería y operaciones. Estos técnicos mantenían la vasta infraestructura militar del Imperio. Su pericia mantenía las máquinas de guerra imperiales funcionando.'
  },
  {
    minifigure_no: 'sw0585',
    name: 'Imperial Stormtrooper - Printed Legs, Dark Blue Helmet Vents',
    description_en: 'This stormtrooper variant features printed legs and dark blue helmet vents showing design evolution. Imperial shock troops enforced order throughout occupied systems. Their white armor became the most recognizable symbol of Imperial military power. Mass-produced stormtroopers represented the Empire\'s overwhelming numerical advantage.',
    description_de: 'Diese Sturmtruppler-Variante zeigt bedruckte Beine und dunkelblaue Helm-Belüftungen, die Design-Evolution zeigen. Imperiale Stoßtruppen setzten Ordnung in besetzten Systemen durch. Ihre weiße Rüstung wurde zum erkennbarsten Symbol imperialer Militärmacht. Massenproduzierte Sturmtruppler repräsentierten den überwältigenden zahlenmäßigen Vorteil des Imperiums.',
    description_fr: 'Cette variante de stormtrooper présente des jambes imprimées et des évents de casque bleu foncé montrant l\'évolution du design. Les troupes de choc impériales appliquaient l\'ordre dans tous les systèmes occupés. Leur armure blanche est devenue le symbole le plus reconnaissable du pouvoir militaire impérial. Les stormtroopers produits en masse représentaient l\'avantage numérique écrasant de l\'Empire.',
    description_es: 'Esta variante de stormtrooper presenta piernas impresas y ventilaciones de casco azul oscuro mostrando evolución de diseño. Las tropas de choque imperiales aplicaban orden por sistemas ocupados. Su armadura blanca se convirtió en el símbolo más reconocible del poder militar imperial. Los stormtroopers producidos en masa representaban la ventaja numérica abrumadora del Imperio.'
  },
  {
    minifigure_no: 'sw0586',
    name: 'Darth Vader (Tan Head)',
    description_en: 'This Darth Vader variant shows his scarred tan head beneath the iconic black helmet. Anakin Skywalker\'s transformation into Vader defined the saga\'s tragedy. His mechanical life support and dark armor symbolized his fall to the dark side. Vader\'s redemption through saving Luke completed his arc from hero to villain to hero.',
    description_de: 'Diese Darth-Vader-Variante zeigt seinen vernarbten beigen Kopf unter dem ikonischen schwarzen Helm. Anakin Skywalkers Verwandlung in Vader definierte die Tragödie der Saga. Seine mechanische Lebenserhaltung und dunkle Rüstung symbolisierten seinen Fall zur dunklen Seite. Vaders Erlösung durch Lukes Rettung vervollständigte seinen Bogen von Held zu Bösewicht zu Held.',
    description_fr: 'Cette variante de Dark Vador montre sa tête beige cicatrisée sous le casque noir iconique. La transformation d\'Anakin Skywalker en Vador définissait la tragédie de la saga. Son support vital mécanique et son armure sombre symbolisaient sa chute vers le côté obscur. La rédemption de Vador en sauvant Luke a complété son arc de héros à méchant à héros.',
    description_es: 'Esta variante de Darth Vader muestra su cabeza beige cicatrizada bajo el casco negro icónico. La transformación de Anakin Skywalker en Vader definió la tragedia de la saga. Su soporte vital mecánico y armadura oscura simbolizaban su caída al lado oscuro. La redención de Vader al salvar a Luke completó su arco de héroe a villano a héroe.'
  },
  {
    minifigure_no: 'sw0587',
    name: 'Treadwell Droid - Mini',
    description_en: 'This mini-scale Treadwell droid represented the common repair units found on moisture farms. These wheeled maintenance droids performed routine mechanical tasks throughout Tatooine. Their simple design made them affordable for poor farmers. Treadwell units were ubiquitous in the Outer Rim territories.',
    description_de: 'Dieser Mini-Treadwell-Droide repräsentierte die gängigen Reparatureinheiten auf Feuchtigkeitsfarmen. Diese Rad-Wartungsdroiden führten routinemäßige mechanische Aufgaben in ganz Tatooine durch. Ihr einfaches Design machte sie für arme Farmer erschwinglich. Treadwell-Einheiten waren allgegenwärtig in den Äußeren-Rand-Territorien.',
    description_fr: 'Ce droïde Treadwell mini-échelle représentait les unités de réparation communes trouvées sur les fermes d\'humidité. Ces droïdes de maintenance à roues effectuaient des tâches mécaniques de routine dans tout Tatooine. Leur conception simple les rendait abordables pour les fermiers pauvres. Les unités Treadwell étaient omniprésentes dans les territoires de la Bordure Extérieure.',
    description_es: 'Este droide Treadwell mini-escala representaba las unidades de reparación comunes encontradas en granjas de humedad. Estos droides de mantenimiento con ruedas realizaban tareas mecánicas rutinarias por todo Tatooine. Su diseño simple los hacía asequibles para granjeros pobres. Las unidades Treadwell eran ubicuas en territorios del Borde Exterior.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0580-sw0587...');

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
