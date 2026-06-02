import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// FLAGSHIP BATCH 2: More Marvel & Thanos, Star-Lord, Gamora
const batch = [
  {
    minifigure_no: 'sh0230',
    name: 'Thanos - Large Figure, Dark Blue and Pearl Gold Outfit, Arms, and Helmet',
    description_en: 'Thanos the Mad Titan sought the Infinity Stones to reshape the universe. This large-scale LEGO figure featured imposing dark blue and pearl gold armor with detailed helmet and muscular build. The wielder of the Infinity Gauntlet possessed immense power and ruthless determination. This collectible captured the ultimate Marvel villain whose snap threatened all existence, representing cosmic-level menace and philosophical conviction.',
    description_de: 'Thanos der Wahnsinnige Titan suchte die Unendlichkeitssteine um das Universum neu zu formen. Diese großformatige LEGO-Figur zeigte imposante dunkel-blaue und perl-goldene Rüstung mit detailliertem Helm und muskulösem Körperbau. Der Träger des Unendlichkeits-Handschuhs besaß immense Macht und rücksichtslose Entschlossenheit. Diese Sammlerfigur erfasste den ultimativen Marvel-Schurken, dessen Schnipsen alle Existenz bedrohte und kosmische Bedrohung mit philosophischer Überzeugung repräsentierte.',
    description_fr: 'Thanos le Titan Fou recherchait les Pierres d\'Infinité pour remodeler l\'univers. Cette figurine LEGO à grande échelle présentait une armure imposante bleu foncé et or perlé avec casque détaillé et construction musculaire. Le porteur du Gant de l\'Infini possédait un pouvoir immense et une détermination impitoyable. Cette collection capturait le méchant Marvel ultime dont le claquement menaçait toute existence, représentant une menace cosmique et une conviction philosophique.',
    description_es: 'Thanos el Titán Loco buscaba las Piedras del Infinito para remodelar el universo. Esta figura LEGO de gran escala presentaba imponente armadura azul oscuro y oro perlado con casco detallado y construcción muscular. El portador del Guantelete del Infinito poseía inmenso poder y determinación despiadada. Esta colección capturaba al villano Marvel definitivo cuyo chasquido amenazaba toda existencia, representando amenaza de nivel cósmico y convicción filosófica.'
  },
  {
    minifigure_no: 'sh0123',
    name: 'Star-Lord - Mask, Jacket with Side Buttons',
    description_en: 'Star-Lord led the Guardians of the Galaxy with roguish charm and mixed-tape soundtrack. This LEGO minifigure featured iconic helmet mask and detailed burgundy jacket with side buttons. Peter Quill\'s humor and leadership united misfit heroes across the cosmos. This collectible captured Star-Lord from Guardians of the Galaxy, representing the legendary outlaw who saved the galaxy while dancing through danger.',
    description_de: 'Star-Lord führte die Guardians of the Galaxy mit schurkischem Charme und Mixtape-Soundtrack. Diese LEGO-Minifigur zeigte ikonische Helm-Maske und detaillierte burgunderrote Jacke mit Seitenknöpfen. Peter Quills Humor und Führung vereinte Außenseiter-Helden im Kosmos. Diese Sammlerfigur erfasste Star-Lord aus Guardians of the Galaxy und repräsentierte den legendären Gesetzlosen, der die Galaxie rettete während er durch Gefahr tanzte.',
    description_fr: 'Star-Lord dirigeait les Gardiens de la Galaxie avec charme de voyou et bande-son de cassette mixte. Cette minifigurine LEGO présentait un masque de casque emblématique et une veste bordeaux détaillée avec boutons latéraux. L\'humour et le leadership de Peter Quill unissaient des héros inadaptés à travers le cosmos. Cette collection capturait Star-Lord de Guardians of the Galaxy, représentant le hors-la-loi légendaire qui sauva la galaxie en dansant à travers le danger.',
    description_es: 'Star-Lord lideraba a los Guardianes de la Galaxia con encanto pícaro y banda sonora de mezcla. Esta minifigura LEGO presentaba icónica máscara de casco y detallada chaqueta borgoña con botones laterales. El humor y liderazgo de Peter Quill unía héroes inadaptados a través del cosmos. Esta colección capturaba a Star-Lord de Guardianes de la Galaxia, representando al forajido legendario que salvó la galaxia mientras bailaba a través del peligro.'
  },
  {
    minifigure_no: 'sh0127',
    name: 'Star-Lord - Mask, Open Jacket',
    description_en: 'Star-Lord in alternate costume featured his signature helmet mask with open jacket design. This LEGO minifigure showcased detailed torso printing with visible shirt beneath the jacket. Peter Quill\'s blend of Earth culture and cosmic adventure defined the Guardians leader. This collectible represented Star-Lord\'s iconic look combining space opera heroics with 80s nostalgia and irreverent attitude.',
    description_de: 'Star-Lord im alternativen Kostüm zeigte seine charakteristische Helm-Maske mit offenem Jacken-Design. Diese LEGO-Minifigur präsentierte detaillierten Torso-Druck mit sichtbarem Hemd unter der Jacke. Peter Quills Mischung aus Erd-Kultur und kosmischem Abenteuer definierte den Guardians-Anführer. Diese Sammlerfigur repräsentierte Star-Lords ikonischen Look, der Space-Opera-Heldentum mit 80er-Nostalgie und respektloser Haltung kombinierte.',
    description_fr: 'Star-Lord en costume alternatif présentait son masque de casque signature avec design de veste ouverte. Cette minifigurine LEGO montrait une impression de torse détaillée avec chemise visible sous la veste. Le mélange de culture terrestre et d\'aventure cosmique de Peter Quill définissait le leader des Gardiens. Cette collection représentait le look emblématique de Star-Lord combinant héroïsme d\'opéra spatial avec nostalgie des années 80 et attitude irrévérencieuse.',
    description_es: 'Star-Lord en traje alternativo presentaba su icónica máscara de casco con diseño de chaqueta abierta. Esta minifigura LEGO mostraba impresión de torso detallada con camisa visible bajo la chaqueta. La mezcla de cultura terrestre y aventura cósmica de Peter Quill definía al líder de los Guardianes. Esta colección representaba el look icónico de Star-Lord combinando heroísmo de ópera espacial con nostalgia de los 80 y actitud irreverente.'
  },
  {
    minifigure_no: 'sh0124',
    name: 'Gamora, Dark Red Suit',
    description_en: 'Gamora the deadliest woman in the galaxy brought assassin skills to the Guardians. This LEGO minifigure featured dark red suit with detailed printing and distinctive green skin. Trained by Thanos yet fighting for good, she embodied redemption and lethal grace. This collectible captured Gamora from Guardians of the Galaxy, representing the warrior who chose heroism over her dark past.',
    description_de: 'Gamora die tödlichste Frau der Galaxie brachte Attentäter-Fähigkeiten zu den Guardians. Diese LEGO-Minifigur zeigte dunkelroten Anzug mit detailliertem Druck und charakteristischer grüner Haut. Von Thanos trainiert, doch für das Gute kämpfend, verkörperte sie Erlösung und tödliche Anmut. Diese Sammlerfigur erfasste Gamora aus Guardians of the Galaxy und repräsentierte die Kriegerin, die Heldentum über ihre dunkle Vergangenheit wählte.',
    description_fr: 'Gamora la femme la plus mortelle de la galaxie apportait des compétences d\'assassin aux Gardiens. Cette minifigurine LEGO présentait une combinaison rouge foncé avec impression détaillée et peau verte distinctive. Entraînée par Thanos mais combattant pour le bien, elle incarnait rédemption et grâce létale. Cette collection capturait Gamora de Guardians of the Galaxy, représentant la guerrière qui choisit l\'héroïsme plutôt que son passé sombre.',
    description_es: 'Gamora la mujer más mortal de la galaxia aportaba habilidades de asesina a los Guardianes. Esta minifigura LEGO presentaba traje rojo oscuro con impresión detallada y distintiva piel verde. Entrenada por Thanos pero luchando por el bien, encarnaba redención y gracia letal. Esta colección capturaba a Gamora de Guardianes de la Galaxia, representando a la guerrera que eligió heroísmo sobre su oscuro pasado.'
  },
  {
    minifigure_no: 'sh0167',
    name: 'Iron Man - Mark 43 Armor',
    description_en: 'Iron Man in Mark 43 armor represented advanced Stark technology from Avengers Age of Ultron. This LEGO minifigure featured sleek red and gold design with detailed chest arc reactor and helmet printing. The suit\'s enhanced capabilities prepared Tony Stark for the Ultron threat. This collectible showcased Iron Man\'s evolution with refined armor aesthetics and cutting-edge defensive systems.',
    description_de: 'Iron Man in Mark 43 Rüstung repräsentierte fortschrittliche Stark-Technologie aus Avengers Age of Ultron. Diese LEGO-Minifigur zeigte schlankes rot-goldenes Design mit detailliertem Brust-Arc-Reaktor und Helm-Druck. Die verbesserten Fähigkeiten des Anzugs bereiteten Tony Stark auf die Ultron-Bedrohung vor. Diese Sammlerfigur zeigte Iron Mans Evolution mit verfeinerter Rüstungs-Ästhetik und hochmodernen Verteidigungssystemen.',
    description_fr: 'Iron Man en armure Mark 43 représentait la technologie Stark avancée d\'Avengers Age of Ultron. Cette minifigurine LEGO présentait un design rouge et or élégant avec réacteur arc de poitrine et impression de casque détaillés. Les capacités améliorées du costume préparaient Tony Stark pour la menace Ultron. Cette collection montrait l\'évolution d\'Iron Man avec esthétique d\'armure raffinée et systèmes défensifs de pointe.',
    description_es: 'Iron Man en armadura Mark 43 representaba tecnología Stark avanzada de Avengers Age of Ultron. Esta minifigura LEGO presentaba diseño rojo y dorado elegante con reactor arc de pecho e impresión de casco detallados. Las capacidades mejoradas del traje preparaban a Tony Stark para la amenaza Ultron. Esta colección mostraba la evolución de Iron Man con estética de armadura refinada y sistemas defensivos de vanguardia.'
  },
  {
    minifigure_no: 'sh0195',
    name: 'Robin - Dark Green Legs',
    description_en: 'Robin the Boy Wonder fought crime alongside Batman as the Dynamic Duo. This LEGO minifigure featured classic red tunic with yellow cape, dark green legs, and iconic mask. Dick Grayson\'s acrobatic skills and courage made him Batman\'s trusted partner. This collectible captured Robin from Batman sets, representing the sidekick who proved young heroes could stand beside legends.',
    description_de: 'Robin das Wunder-Kind bekämpfte Verbrechen an Batmans Seite als dynamisches Duo. Diese LEGO-Minifigur zeigte klassische rote Tunika mit gelbem Umhang, dunkelgrünen Beinen und ikonischer Maske. Dick Graysons akrobatische Fähigkeiten und Mut machten ihn zu Batmans vertrautem Partner. Diese Sammlerfigur erfasste Robin aus Batman-Sets und repräsentierte den Sidekick, der bewies, dass junge Helden neben Legenden bestehen können.',
    description_fr: 'Robin le Jeune Prodige combattait le crime aux côtés de Batman en tant que Duo Dynamique. Cette minifigurine LEGO présentait une tunique rouge classique avec cape jaune, jambes vert foncé et masque emblématique. Les compétences acrobatiques et le courage de Dick Grayson en faisaient le partenaire de confiance de Batman. Cette collection capturait Robin des sets Batman, représentant le sidekick qui prouva que les jeunes héros pouvaient se tenir aux côtés des légendes.',
    description_es: 'Robin el Joven Maravilla combatía el crimen junto a Batman como el Dúo Dinámico. Esta minifigura LEGO presentaba túnica roja clásica con capa amarilla, piernas verde oscuro y máscara icónica. Las habilidades acrobáticas y coraje de Dick Grayson lo convertían en el socio de confianza de Batman. Esta colección capturaba a Robin de sets de Batman, representando al compañero que demostró que los jóvenes héroes podían estar junto a leyendas.'
  },
  {
    minifigure_no: 'sh0201',
    name: 'Ant-Man (Scott Lang) - Original Suit',
    description_en: 'Ant-Man mastered size-changing technology with the Pym Particles suit. This LEGO minifigure featured detailed red and black armor with distinctive helmet and size-adjustment controls. Scott Lang transformed from thief to hero, shrinking to ant-size or growing giant. This collectible represented Ant-Man\'s original suit design, showcasing the hero who proved big heroism comes in small packages.',
    description_de: 'Ant-Man beherrschte Größen-Änderungs-Technologie mit dem Pym-Partikel-Anzug. Diese LEGO-Minifigur zeigte detaillierte rot-schwarze Rüstung mit charakteristischem Helm und Größen-Anpassungs-Kontrollen. Scott Lang verwandelte sich vom Dieb zum Helden, schrumpfte auf Ameisengröße oder wuchs riesig. Diese Sammlerfigur repräsentierte Ant-Mans ursprüngliches Anzug-Design und zeigte den Helden, der bewies, dass großes Heldentum in kleinen Paketen kommt.',
    description_fr: 'Ant-Man maîtrisait la technologie de changement de taille avec le costume de Particules Pym. Cette minifigurine LEGO présentait une armure rouge et noire détaillée avec casque distinctif et contrôles d\'ajustement de taille. Scott Lang se transforma de voleur en héros, rétrécissant à la taille d\'une fourmi ou grandissant géant. Cette collection représentait le design original du costume d\'Ant-Man, montrant le héros qui prouva que le grand héroïsme vient en petits paquets.',
    description_es: 'Ant-Man dominaba tecnología de cambio de tamaño con el traje de Partículas Pym. Esta minifigura LEGO presentaba armadura roja y negra detallada con casco distintivo y controles de ajuste de tamaño. Scott Lang se transformó de ladrón a héroe, encogiéndose a tamaño de hormiga o creciendo gigante. Esta colección representaba el diseño original del traje de Ant-Man, mostrando al héroe que demostró que el gran heroísmo viene en paquetes pequeños.'
  },
  {
    minifigure_no: 'sh0204',
    name: 'Batman - Dark Bluish Gray Suit, Gold Belt, Black Hands, Spongy Cape, Black Boots',
    description_en: 'Batman the Dark Knight protected Gotham City with detective skills and martial arts mastery. This LEGO minifigure featured dark bluish gray suit with distinctive gold utility belt, black hands, spongy cape, and black boots. Bruce Wayne\'s dedication to justice made him a symbol of hope. This collectible captured Batman\'s iconic look, representing the vigilante who turned tragedy into heroic purpose.',
    description_de: 'Batman der Dunkle Ritter beschützte Gotham City mit Detektiv-Fähigkeiten und Kampfkunst-Meisterschaft. Diese LEGO-Minifigur zeigte dunkel-bläulich-grauen Anzug mit charakteristischem goldenen Utility-Gürtel, schwarzen Händen, schwammigem Umhang und schwarzen Stiefeln. Bruce Waynes Hingabe zur Gerechtigkeit machte ihn zum Symbol der Hoffnung. Diese Sammlerfigur erfasste Batmans ikonischen Look und repräsentierte den Bürgerwehr, der Tragödie in heroischen Zweck verwandelte.',
    description_fr: 'Batman le Chevalier Noir protégeait Gotham City avec compétences de détective et maîtrise des arts martiaux. Cette minifigurine LEGO présentait une combinaison gris bleuté foncé avec ceinture utilitaire dorée distinctive, mains noires, cape spongieuse et bottes noires. Le dévouement de Bruce Wayne à la justice en faisait un symbole d\'espoir. Cette collection capturait le look emblématique de Batman, représentant le justicier qui transforma la tragédie en objectif héroïque.',
    description_es: 'Batman el Caballero Oscuro protegía Gotham City con habilidades de detective y maestría en artes marciales. Esta minifigura LEGO presentaba traje gris azulado oscuro con distintivo cinturón utilitario dorado, manos negras, capa esponjosa y botas negras. La dedicación de Bruce Wayne a la justicia lo convirtió en símbolo de esperanza. Esta colección capturaba el look icónico de Batman, representando al vigilante que convirtió tragedia en propósito heroico.'
  },
];

async function updateDescriptions() {
  console.log(`\n🎯 Updating FLAGSHIP BATCH 2: More Marvel & DC (8 minifigs)\n`);

  let updated = 0;
  let errors = 0;

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
      console.log(`✅ ${minifig.minifigure_no} - ${minifig.name}`);
    } catch (error: any) {
      errors++;
      console.error(`❌ ${minifig.minifigure_no}:`, error.message);
    }
  }

  console.log(`\n✅ Flagship Batch 2 complete!`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Errors: ${errors}`);

  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
