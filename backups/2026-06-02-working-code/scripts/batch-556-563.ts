import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0556',
    name: 'Ten Numb - Red Pilot Suit, Tan Head, B-Wing Pilot Helmet',
    description_en: 'Ten Numb was a skilled Sullustan B-wing pilot who flew in the Battle of Endor. His red pilot suit and distinctive helmet marked him as part of the Rebel starfighter corps. Ten Numb\'s expert piloting helped destroy the second Death Star. Sullustan pilots like Numb brought exceptional navigational abilities to the Rebellion.',
    description_de: 'Ten Numb war ein geschickter sullustan B-Wing-Pilot, der in der Schlacht von Endor flog. Sein roter Pilotenanzug und markanter Helm kennzeichneten ihn als Teil des Rebellen-Sternjäger-Korps. Ten Numbs Expertenpilotierung half, den zweiten Todesstern zu zerstören. Sullustan-Piloten wie Numb brachten außergewöhnliche Navigationsfähigkeiten zur Rebellion.',
    description_fr: 'Ten Numb était un pilote de B-wing Sullustan compétent qui a volé dans la Bataille d\'Endor. Sa combinaison de pilote rouge et son casque distinctif le marquaient comme faisant partie du corps de chasseurs stellaires rebelles. Le pilotage expert de Ten Numb a aidé à détruire la deuxième Étoile de la Mort. Les pilotes Sullustans comme Numb apportaient des capacités de navigation exceptionnelles à la Rébellion.',
    description_es: 'Ten Numb era un hábil piloto de B-wing Sullustan que voló en la Batalla de Endor. Su traje de piloto rojo y casco distintivo lo marcaban como parte del cuerpo de cazas estelares rebeldes. El pilotaje experto de Ten Numb ayudó a destruir la segunda Estrella de la Muerte. Los pilotos Sullustans como Numb trajeron habilidades de navegación excepcionales a la Rebelión.'
  },
  {
    minifigure_no: 'sw0557',
    name: 'General Airen Cracken',
    description_en: 'General Airen Cracken was a legendary Rebel intelligence officer and military commander. His tactical brilliance and espionage network provided crucial information throughout the Galactic Civil War. Cracken led intelligence operations that undermined Imperial security. His expertise made him one of the Alliance\'s most valuable strategists.',
    description_de: 'General Airen Cracken war ein legendärer Rebellen-Geheimdienstoffizier und Militärkommandant. Seine taktische Brillanz und sein Spionagenetzwerk lieferten entscheidende Informationen während des Galaktischen Bürgerkriegs. Cracken leitete Geheimdienstoperationen, die die imperiale Sicherheit untergruben. Seine Expertise machte ihn zu einem der wertvollsten Strategen der Allianz.',
    description_fr: 'Le Général Airen Cracken était un officier de renseignement rebelle légendaire et commandant militaire. Son génie tactique et son réseau d\'espionnage fournissaient des informations cruciales tout au long de la Guerre Civile Galactique. Cracken dirigeait des opérations de renseignement qui sapaient la sécurité impériale. Son expertise en faisait l\'un des stratèges les plus précieux de l\'Alliance.',
    description_es: 'El General Airen Cracken era un legendario oficial de inteligencia rebelde y comandante militar. Su brillantez táctica y red de espionaje proporcionaban información crucial a través de la Guerra Civil Galáctica. Cracken lideraba operaciones de inteligencia que socavaban la seguridad imperial. Su pericia lo convirtió en uno de los estrategas más valiosos de la Alianza.'
  },
  {
    minifigure_no: 'sw0558',
    name: 'Gray Squadron Pilot (Horton Salm)',
    description_en: 'Horton Salm commanded Gray Squadron flying Y-wing bombers during critical Rebel operations. His tactical expertise made him one of the Alliance\'s most respected bomber pilots. Salm participated in major battles including the assault on the second Death Star. Gray Squadron\'s bombing runs proved devastating against Imperial targets.',
    description_de: 'Horton Salm befehligte Gray Squadron und flog Y-Wing-Bomber während kritischer Rebellenoperationen. Seine taktische Expertise machte ihn zu einem der meistrespektierten Bomberpiloten der Allianz. Salm nahm an großen Schlachten teil, einschließlich des Angriffs auf den zweiten Todesstern. Gray Squadrons Bombenangriffe erwiesen sich als verheerend gegen imperiale Ziele.',
    description_fr: 'Horton Salm commandait l\'Escadron Gris pilotant des bombardiers Y-wing pendant les opérations rebelles critiques. Son expertise tactique en faisait l\'un des pilotes de bombardier les plus respectés de l\'Alliance. Salm a participé aux batailles majeures incluant l\'assaut sur la deuxième Étoile de la Mort. Les bombardements de l\'Escadron Gris se sont révélés dévastateurs contre les cibles impériales.',
    description_es: 'Horton Salm comandaba el Escuadrón Gris volando bombarderos Y-wing durante operaciones rebeldes críticas. Su pericia táctica lo convirtió en uno de los pilotos de bombardero más respetados de la Alianza. Salm participó en batallas mayores incluyendo el asalto en la segunda Estrella de la Muerte. Los bombardeos del Escuadrón Gris resultaron devastadores contra objetivos imperiales.'
  },
  {
    minifigure_no: 'sw0559',
    name: 'Owen Lars - Printed Legs, Tousled Hair',
    description_en: 'Owen Lars was Luke Skywalker\'s uncle and guardian on Tatooine running a moisture farm. This variant with printed legs and tousled hair showed his hardworking farmer appearance. Owen tried protecting Luke by keeping him from adventure and his Jedi heritage. His death at Imperial hands set Luke on his heroic journey.',
    description_de: 'Owen Lars war Luke Skywalkers Onkel und Vormund auf Tatooine und betrieb eine Feuchtigkeitsfarm. Diese Variante mit bedruckten Beinen und zerzaustem Haar zeigte sein hart arbeitendes Farmer-Erscheinungsbild. Owen versuchte Luke zu schützen, indem er ihn von Abenteuern und seinem Jedi-Erbe fernhielt. Sein Tod durch imperiale Hand setzte Luke auf seine heroische Reise.',
    description_fr: 'Owen Lars était l\'oncle et tuteur de Luke Skywalker sur Tatooine exploitant une ferme d\'humidité. Cette variante avec jambes imprimées et cheveux ébouriffés montrait son apparence de fermier travailleur. Owen essayait de protéger Luke en le gardant de l\'aventure et de son héritage Jedi. Sa mort aux mains impériales a mis Luke sur son voyage héroïque.',
    description_es: 'Owen Lars era el tío y tutor de Luke Skywalker en Tatooine operando una granja de humedad. Esta variante con piernas impresas y cabello despeinado mostraba su apariencia de granjero trabajador. Owen intentaba proteger a Luke manteniéndolo alejado de aventuras y su herencia Jedi. Su muerte a manos imperiales puso a Luke en su viaje heroico.'
  },
  {
    minifigure_no: 'sw0560',
    name: 'Jawa - Straps',
    description_en: 'Jawas were scavenging traders on Tatooine collecting and selling droid parts and technology. This variant with straps showed their practical equipment for hauling salvage. Jawas sold R2-D2 and C-3PO to Owen Lars, inadvertently starting Luke\'s adventure. Their glowing eyes and mysterious nature made them iconic desert dwellers.',
    description_de: 'Jawas waren Plünderungs-Händler auf Tatooine, die Droidenteile und Technologie sammelten und verkauften. Diese Variante mit Riemen zeigte ihre praktische Ausrüstung zum Transportieren von Bergungsgut. Jawas verkauften R2-D2 und C-3PO an Owen Lars und starteten unabsichtlich Lukes Abenteuer. Ihre leuchtenden Augen und mysteriöse Natur machten sie zu ikonischen Wüstenbewohnern.',
    description_fr: 'Les Jawas étaient des commerçants récupérateurs sur Tatooine collectant et vendant des pièces de droïdes et de la technologie. Cette variante avec sangles montrait leur équipement pratique pour transporter la récupération. Les Jawas ont vendu R2-D2 et C-3PO à Owen Lars, déclenchant par inadvertance l\'aventure de Luke. Leurs yeux lumineux et leur nature mystérieuse en faisaient des habitants du désert iconiques.',
    description_es: 'Los Jawas eran comerciantes recolectores en Tatooine recolectando y vendiendo partes de droides y tecnología. Esta variante con correas mostraba su equipo práctico para transportar salvamento. Los Jawas vendieron R2-D2 y C-3PO a Owen Lars, comenzando inadvertidamente la aventura de Luke. Sus ojos brillantes y naturaleza misteriosa los convirtieron en icónicos habitantes del desierto.'
  },
  {
    minifigure_no: 'sw0561',
    name: 'C-3PO - Printed Legs (Robot Limiter/Restraining Bolt)',
    description_en: 'C-3PO with printed legs showing the restraining bolt the Jawas attached to prevent escape. This protocol droid served countless masters throughout the saga. C-3PO\'s fluency in over six million forms of communication proved invaluable. His worrying nature and friendship with R2-D2 provided comic relief and heart.',
    description_de: 'C-3PO mit bedruckten Beinen, die den Hemmbolzen zeigen, den die Jawas anbrachten, um Flucht zu verhindern. Dieser Protokoll-Droide diente unzähligen Herren während der gesamten Saga. C-3POs Beherrschung von über sechs Millionen Kommunikationsformen erwies sich als unschätzbar. Seine sorgenvolle Natur und Freundschaft mit R2-D2 boten komische Erleichterung und Herz.',
    description_fr: 'C-3PO avec jambes imprimées montrant le boulon de retenue que les Jawas ont attaché pour empêcher la fuite. Ce droïde de protocole a servi d\'innombrables maîtres tout au long de la saga. La maîtrise de C-3PO de plus de six millions de formes de communication s\'est révélée inestimable. Sa nature inquiète et son amitié avec R2-D2 offraient un soulagement comique et du cœur.',
    description_es: 'C-3PO con piernas impresas mostrando el perno restrictivo que los Jawas adjuntaron para prevenir escape. Este droide de protocolo sirvió a incontables amos a través de la saga. La fluidez de C-3PO en más de seis millones de formas de comunicación resultó invaluable. Su naturaleza preocupada y amistad con R2-D2 proporcionaban alivio cómico y corazón.'
  },
  {
    minifigure_no: 'sw0562',
    name: 'Gonk Droid (GNK Power Droid), Dark Bluish Gray',
    description_en: 'Gonk Droids were mobile power generators serving throughout the galaxy. This dark bluish gray variant provided portable energy for equipment and vehicles. Their simple walking battery design made them ubiquitous on starships and bases. The distinctive "gonk gonk" sound became a memorable Star Wars detail.',
    description_de: 'Gonk-Droiden waren mobile Stromgeneratoren, die in der ganzen Galaxis dienten. Diese dunkle bläulich-graue Variante bot tragbare Energie für Ausrüstung und Fahrzeuge. Ihr einfaches wandelndes Batterie-Design machte sie auf Raumschiffen und Basen allgegenwärtig. Das markante "gonk gonk"-Geräusch wurde zu einem unvergesslichen Star-Wars-Detail.',
    description_fr: 'Les Droïdes Gonk étaient des générateurs d\'énergie mobiles servant dans toute la galaxie. Cette variante gris bleuté foncé fournissait de l\'énergie portable pour l\'équipement et les véhicules. Leur conception simple de batterie ambulante les rendait omniprésents sur les vaisseaux spatiaux et les bases. Le son distinctif "gonk gonk" est devenu un détail Star Wars mémorable.',
    description_es: 'Los Droides Gonk eran generadores de energía móviles sirviendo por toda la galaxia. Esta variante gris azulado oscuro proporcionaba energía portátil para equipo y vehículos. Su diseño simple de batería caminante los hacía ubicuos en naves espaciales y bases. El sonido distintivo "gonk gonk" se convirtió en un detalle memorable de Star Wars.'
  },
  {
    minifigure_no: 'sw0563',
    name: 'Salacious Crumb',
    description_en: 'Salacious Crumb was Jabba the Hutt\'s cackling monkey-lizard court jester. This Kowakian creature provided entertainment through mockery and cruel pranks. Crumb\'s obnoxious laughter echoed through Jabba\'s palace. His fate during the sail barge battle remained unclear, adding to his memorable villainy.',
    description_de: 'Salacious Crumb war Jabba der Hutts kichernder Affen-Echsen-Hofnarr. Diese Kowakian-Kreatur bot Unterhaltung durch Spott und grausame Streiche. Crumbs widerwärtiges Lachen hallte durch Jabbas Palast. Sein Schicksal während der Segelbarken-Schlacht blieb unklar und trug zu seiner unvergesslichen Bösartigkeit bei.',
    description_fr: 'Salacious Crumb était le bouffon de cour singe-lézard ricanant de Jabba le Hutt. Cette créature Kowakian fournissait du divertissement par la moquerie et les farces cruelles. Le rire odieux de Crumb résonnait dans le palais de Jabba. Son sort pendant la bataille de la barge à voile est resté incertain, ajoutant à sa méchanceté mémorable.',
    description_es: 'Salacious Crumb era el bufón de corte mono-lagarto cacareante de Jabba el Hutt. Esta criatura Kowakian proporcionaba entretenimiento mediante burla y bromas crueles. La risa odiosa de Crumb resonaba por el palacio de Jabba. Su destino durante la batalla de la barcaza de vela permaneció incierto, agregando a su villanía memorable.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0556-sw0563...');

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
