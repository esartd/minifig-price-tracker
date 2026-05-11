import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch7 = [
  {
    minifigure_no: 'sw0027',
    name: 'Naboo Fighter Pilot',
    description_en: 'The Naboo Fighter Pilot represents the skilled defenders of the peaceful planet Naboo during the Trade Federation invasion. This minifigure features a distinctive yellow and black flight suit with detailed printing, a specialized helmet with breathing apparatus, and represents the elite N-1 Starfighter corps. Released in 1999 with the original Naboo Fighter set, this pilot captures the regal aesthetic of Naboo\'s military forces. Collectors appreciate this variant for its connection to The Phantom Menace and young Anakin Skywalker\'s heroic assault on the droid control ship. The unique color scheme sets Naboo pilots apart from other Star Wars factions.',
    description_de: 'Der Naboo-Jägerpilot repräsentiert die geschickten Verteidiger des friedlichen Planeten Naboo während der Handelsföderation-Invasion. Diese Minifigur zeigt einen charakteristischen gelb-schwarzen Fluganzug mit detailliertem Druck, einen Spezialhelm mit Atemgerät und repräsentiert das Elite-N-1-Sternenjägerkorps. 1999 mit dem originalen Naboo-Jäger-Set veröffentlicht, erfasst dieser Pilot die königliche Ästhetik von Naboos Streitkräften. Sammler schätzen diese Variante für ihre Verbindung zu Die dunkle Bedrohung und dem jungen Anakin Skywalkers heroischem Angriff auf das Droiden-Kontrollschiff. Das einzigartige Farbschema hebt Naboo-Piloten von anderen Star Wars Fraktionen ab.',
    description_fr: 'Le Pilote de Chasseur Naboo représente les défenseurs qualifiés de la planète pacifique Naboo pendant l\'invasion de la Fédération du Commerce. Cette minifigurine présente une combinaison de vol jaune et noire distinctive avec des impressions détaillées, un casque spécialisé avec appareil respiratoire, et représente le corps d\'élite des Chasseurs Stellaires N-1. Sortie en 1999 avec le set original Chasseur Naboo, ce pilote capture l\'esthétique royale des forces militaires de Naboo. Les collectionneurs apprécient cette variante pour son lien avec La Menace Fantôme et l\'assaut héroïque du jeune Anakin Skywalker sur le vaisseau de contrôle droïde. Le schéma de couleurs unique distingue les pilotes Naboo des autres factions Star Wars.',
    description_es: 'El Piloto de Caza de Naboo representa a los hábiles defensores del pacífico planeta Naboo durante la invasión de la Federación de Comercio. Esta minifigura presenta un distintivo traje de vuelo amarillo y negro con impresiones detalladas, un casco especializado con aparato de respiración, y representa al cuerpo de élite de Cazas Estelares N-1. Lanzado en 1999 con el set original de Caza de Naboo, este piloto captura la estética real de las fuerzas militares de Naboo. Los coleccionistas aprecian esta variante por su conexión con La Amenaza Fantasma y el asalto heroico del joven Anakin Skywalker al crucero de control droide. El esquema de color único distingue a los pilotos de Naboo de otras facciones de Star Wars.'
  },
  {
    minifigure_no: 'sw0028',
    name: 'Qui-Gon Jinn',
    description_en: 'Qui-Gon Jinn, the wise and unconventional Jedi Master, is a fan-favorite character brought to life in LEGO form. This minifigure features Qui-Gon\'s long brown hair, detailed face print with beard, tan Jedi robes, and his green lightsaber. Released in 1999 as part of the first wave of Episode I sets, this represents one of Liam Neeson\'s iconic portrayal. Collectors value this minifigure for Qui-Gon\'s pivotal role as Anakin Skywalker\'s discoverer and Obi-Wan\'s mentor. His tragic death at Darth Maul\'s hands makes this figure particularly poignant. Essential for recreating the Battle of Naboo and the legendary Duel of the Fates lightsaber battle.',
    description_de: 'Qui-Gon Jinn, der weise und unkonventionelle Jedi-Meister, ist ein Fan-Lieblingscharakter, der in LEGO Form zum Leben erweckt wurde. Diese Minifigur zeigt Qui-Gons langes braunes Haar, detaillierten Gesichtsdruck mit Bart, beige Jedi-Roben und sein grünes Lichtschwert. 1999 als Teil der ersten Welle von Episode-I-Sets veröffentlicht, repräsentiert dies Liam Neesons ikonische Darstellung. Sammler schätzen diese Minifigur für Qui-Gons zentrale Rolle als Entdecker von Anakin Skywalker und Obi-Wans Mentor. Sein tragischer Tod durch Darth Mauls Hand macht diese Figur besonders ergreifend. Unverzichtbar für die Nachstellung der Schlacht um Naboo und des legendären Duel-of-the-Fates-Lichtschwertkampfes.',
    description_fr: 'Qui-Gon Jinn, le sage et non-conventionnel Maître Jedi, est un personnage favori des fans porté à la vie en forme LEGO. Cette minifigurine présente les longs cheveux bruns de Qui-Gon, une impression de visage détaillée avec barbe, des robes Jedi beiges et son sabre laser vert. Sortie en 1999 dans la première vague de sets de l\'Épisode I, cela représente l\'interprétation emblématique de Liam Neeson. Les collectionneurs apprécient cette minifigurine pour le rôle pivot de Qui-Gon en tant que découvreur d\'Anakin Skywalker et mentor d\'Obi-Wan. Sa mort tragique aux mains de Darth Maul rend cette figurine particulièrement poignante. Essentielle pour recréer la Bataille de Naboo et le légendaire duel au sabre laser Duel des Destins.',
    description_es: 'Qui-Gon Jinn, el sabio y poco convencional Maestro Jedi, es un personaje favorito de los fans traído a la vida en forma LEGO. Esta minifigura presenta el largo cabello castaño de Qui-Gon, impresión de rostro detallada con barba, túnicas Jedi beige y su sable de luz verde. Lanzado en 1999 como parte de la primera ola de sets del Episodio I, esto representa la icónica interpretación de Liam Neeson. Los coleccionistas valoran esta minifigura por el papel fundamental de Qui-Gon como descubridor de Anakin Skywalker y mentor de Obi-Wan. Su trágica muerte a manos de Darth Maul hace que esta figura sea particularmente conmovedora. Esencial para recrear la Batalla de Naboo y la legendaria batalla de sables de luz Duel of the Fates.'
  },
  {
    minifigure_no: 'sw0029',
    name: 'Obi-Wan Kenobi (Young with Headset)',
    description_en: 'Young Obi-Wan Kenobi with headset represents the Jedi Padawan during his training under Qui-Gon Jinn in The Phantom Menace. This minifigure features Obi-Wan\'s distinctive reddish-brown hair with a small braid, detailed face printing, tan Jedi robes, and a communication headset. Released in 1999, this captures Ewan McGregor\'s portrayal of the young Jedi before his rise to Master. The headset accessory is particularly notable as it references specific scenes from the film. Collectors value this early Obi-Wan variant for representing his humble beginnings as a Padawan learner. Essential for recreating the Duel of the Fates where Obi-Wan avenges his master\'s death.',
    description_de: 'Der junge Obi-Wan Kenobi mit Headset repräsentiert den Jedi-Padawan während seiner Ausbildung unter Qui-Gon Jinn in Die dunkle Bedrohung. Diese Minifigur zeigt Obi-Wans charakteristisches rotbraunes Haar mit kleinem Zopf, detaillierten Gesichtsdruck, beige Jedi-Roben und ein Kommunikations-Headset. 1999 veröffentlicht, erfasst dies Ewan McGregors Darstellung des jungen Jedi vor seinem Aufstieg zum Meister. Das Headset-Zubehör ist besonders bemerkenswert, da es auf spezifische Filmszenen verweist. Sammler schätzen diese frühe Obi-Wan-Variante für die Darstellung seiner bescheidenen Anfänge als Padawan-Schüler. Unverzichtbar für die Nachstellung des Duel of the Fates, bei dem Obi-Wan den Tod seines Meisters rächt.',
    description_fr: 'Le jeune Obi-Wan Kenobi avec casque représente le Padawan Jedi pendant son entraînement sous Qui-Gon Jinn dans La Menace Fantôme. Cette minifigurine présente les cheveux brun-roux distinctifs d\'Obi-Wan avec une petite tresse, une impression de visage détaillée, des robes Jedi beiges et un casque de communication. Sortie en 1999, cela capture l\'interprétation d\'Ewan McGregor du jeune Jedi avant son ascension au rang de Maître. L\'accessoire casque est particulièrement notable car il fait référence à des scènes spécifiques du film. Les collectionneurs apprécient cette variante précoce d\'Obi-Wan pour représenter ses humbles débuts en tant qu\'apprenti Padawan. Essentielle pour recréer le Duel des Destins où Obi-Wan venge la mort de son maître.',
    description_es: 'El joven Obi-Wan Kenobi con audífono representa al Padawan Jedi durante su entrenamiento bajo Qui-Gon Jinn en La Amenaza Fantasma. Esta minifigura presenta el distintivo cabello castaño rojizo de Obi-Wan con una pequeña trenza, impresión de rostro detallada, túnicas Jedi beige y un audífono de comunicación. Lanzado en 1999, esto captura la interpretación de Ewan McGregor del joven Jedi antes de su ascenso a Maestro. El accesorio de audífono es particularmente notable ya que hace referencia a escenas específicas de la película. Los coleccionistas valoran esta variante temprana de Obi-Wan por representar sus humildes comienzos como aprendiz Padawan. Esencial para recrear el Duel of the Fates donde Obi-Wan venga la muerte de su maestro.'
  },
  {
    minifigure_no: 'sw0030',
    name: 'Darth Maul',
    description_en: 'Darth Maul stands as one of the most visually striking and collectible LEGO Star Wars minifigures ever created. This variant features Maul\'s iconic red and black Zabrak facial tattoos with yellow Sith eyes, black hooded robes, and his legendary double-bladed red lightsaber. Released in 1999 with the original Episode I sets, this minifigure captures the menacing Sith apprentice who stunned audiences. Collectors highly prize Darth Maul for his unique appearance and pivotal role in The Phantom Menace. His acrobatic fighting style and tragic bifurcation at Obi-Wan\'s hands have made him a fan favorite. Essential for recreating the climactic Duel of the Fates lightsaber battle.',
    description_de: 'Darth Maul ist eine der visuell auffälligsten und sammelbarsten LEGO Star Wars Minifiguren, die jemals geschaffen wurden. Diese Variante zeigt Mauls ikonische rot-schwarze Zabrak-Gesichtstätowierungen mit gelben Sith-Augen, schwarze Roben mit Kapuze und sein legendäres doppelklingiges rotes Lichtschwert. 1999 mit den originalen Episode-I-Sets veröffentlicht, erfasst diese Minifigur den bedrohlichen Sith-Schüler, der das Publikum verblüffte. Sammler schätzen Darth Maul sehr für sein einzigartiges Aussehen und seine zentrale Rolle in Die dunkle Bedrohung. Sein akrobatischer Kampfstil und seine tragische Halbierung durch Obi-Wans Hand haben ihn zu einem Fan-Favoriten gemacht. Unverzichtbar für die Nachstellung des climaktischen Duel-of-the-Fates-Lichtschwertkampfes.',
    description_fr: 'Darth Maul est l\'une des minifigurines LEGO Star Wars les plus visuellement frappantes et collectionnables jamais créées. Cette variante présente les tatouages faciaux Zabrak rouges et noirs emblématiques de Maul avec des yeux Sith jaunes, des robes noires à capuche et son légendaire sabre laser rouge à double lame. Sortie en 1999 avec les sets originaux de l\'Épisode I, cette minifigurine capture l\'apprenti Sith menaçant qui a stupéfié le public. Les collectionneurs apprécient grandement Darth Maul pour son apparence unique et son rôle pivot dans La Menace Fantôme. Son style de combat acrobatique et sa bifurcation tragique aux mains d\'Obi-Wan en ont fait un favori des fans. Essentielle pour recréer le combat au sabre laser climactique Duel des Destins.',
    description_es: 'Darth Maul es una de las minifiguras LEGO Star Wars más visualmente impactantes y coleccionables jamás creadas. Esta variante presenta los icónicos tatuajes faciales Zabrak rojos y negros de Maul con ojos Sith amarillos, túnicas negras con capucha y su legendario sable de luz rojo de doble hoja. Lanzado en 1999 con los sets originales del Episodio I, esta minifigura captura al amenazante aprendiz Sith que asombró a las audiencias. Los coleccionistas valoran mucho a Darth Maul por su apariencia única y papel fundamental en La Amenaza Fantasma. Su estilo de lucha acrobático y su trágica bifurcación a manos de Obi-Wan lo han convertido en un favorito de los fans. Esencial para recrear la climática batalla de sables de luz Duel of the Fates.'
  },
  {
    minifigure_no: 'sw0031',
    name: 'Pit Droid',
    description_en: 'The Pit Droid represents the mechanical workers of Tatooine\'s podracing culture, known for their nervous energy and quick repairs. This unique minifigure features an orange body with articulated limbs, distinctive head design with retractable panels, and captures the quirky droids from The Phantom Menace. Released in 1999, Pit Droids are recognizable for their comedic scenes and practical function in maintaining podracers. Collectors appreciate these droids for their unusual design compared to standard minifigures and their connection to the exciting Boonta Eve Podrace. Their small size and specialized function make them interesting additions to Tatooine-themed displays and podracer sets.',
    description_de: 'Der Grubendroide repräsentiert die mechanischen Arbeiter der Podrennen-Kultur von Tatooine, bekannt für ihre nervöse Energie und schnelle Reparaturen. Diese einzigartige Minifigur zeigt einen orangefarbenen Körper mit beweglichen Gliedmaßen, charakteristisches Kopfdesign mit einziehbaren Panels und erfasst die skurrilen Droiden aus Die dunkle Bedrohung. 1999 veröffentlicht, sind Grubendroiden erkennbar für ihre komischen Szenen und praktische Funktion bei der Wartung von Podrennern. Sammler schätzen diese Droiden für ihr ungewöhnliches Design im Vergleich zu Standard-Minifiguren und ihre Verbindung zum aufregenden Boonta-Eve-Podrennen. Ihre geringe Größe und spezialisierte Funktion machen sie zu interessanten Ergänzungen für Tatooine-thematisierte Displays und Podrenner-Sets.',
    description_fr: 'Le Droïde de Fosse représente les travailleurs mécaniques de la culture de course de modules de Tatooine, connus pour leur énergie nerveuse et leurs réparations rapides. Cette minifigurine unique présente un corps orange avec des membres articulés, un design de tête distinctif avec des panneaux rétractables et capture les droïdes excentriques de La Menace Fantôme. Sortis en 1999, les Droïdes de Fosse sont reconnaissables pour leurs scènes comiques et leur fonction pratique dans l\'entretien des modules de course. Les collectionneurs apprécient ces droïdes pour leur design inhabituel par rapport aux minifigurines standard et leur lien avec l\'excitante Course de Modules de Boonta Eve. Leur petite taille et leur fonction spécialisée en font des ajouts intéressants aux expositions sur le thème de Tatooine et aux sets de modules de course.',
    description_es: 'El Droide de Boxes representa a los trabajadores mecánicos de la cultura de carreras de vainas de Tatooine, conocidos por su energía nerviosa y reparaciones rápidas. Esta minifigura única presenta un cuerpo naranja con extremidades articuladas, diseño de cabeza distintivo con paneles retráctiles y captura a los peculiares droides de La Amenaza Fantasma. Lanzados en 1999, los Droides de Boxes son reconocibles por sus escenas cómicas y función práctica en el mantenimiento de corredores de vainas. Los coleccionistas aprecian estos droides por su diseño inusual en comparación con las minifiguras estándar y su conexión con la emocionante Carrera de Vainas de Boonta Eve. Su pequeño tamaño y función especializada los convierten en adiciones interesantes para exhibiciones temáticas de Tatooine y sets de corredores de vainas.'
  }
];

async function saveBatch() {
  console.log('💾 Saving batch 7 (sw0027-sw0031)...\n');
  
  for (const minifig of batch7) {
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
  
  console.log('\n✨ Batch 7 complete! Total: 30 minifigs (120 descriptions)\n');
  await prisma.$disconnect();
}

saveBatch().catch(console.error);
