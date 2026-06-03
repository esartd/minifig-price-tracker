import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch13 = [
  {
    minifigure_no: 'sw0057',
    name: 'Ki-Adi-Mundi',
    description_en: 'Ki-Adi-Mundi, the Cerean Jedi Master distinguished by his towering cranium, brings tactical brilliance to the Jedi Council. This minifigure features Ki-Adi\'s distinctive elongated head housing a binary brain, white beard, brown Jedi robes, and blue lightsaber. Released in 2002, he represents one of the most intellectually gifted Council members. Collectors value Ki-Adi-Mundi for his strategic mind and leadership during Clone Wars battles. His unique Cerean physiology and permission to have multiple families made him an exception to Jedi rules. His death during Order 66 on Mygeeto was captured in tragic detail in Revenge of the Sith.',
    description_de: 'Ki-Adi-Mundi, der cereanische Jedi-Meister, ausgezeichnet durch seinen turmhohen Schädel, bringt taktische Brillanz zum Jedi-Rat. Diese Minifigur zeigt Ki-Adis charakteristischen länglichen Kopf mit einem binären Gehirn, weißen Bart, braune Jedi-Roben und blaues Lichtschwert. 2002 veröffentlicht, repräsentiert er eines der intellektuell begabtesten Ratsmitglieder. Sammler schätzen Ki-Adi-Mundi für seinen strategischen Verstand und Führung während Klonkriegs-Schlachten. Seine einzigartige cereanische Physiologie und Erlaubnis, mehrere Familien zu haben, machten ihn zu einer Ausnahme von Jedi-Regeln. Sein Tod während Order 66 auf Mygeeto wurde in Die Rache der Sith in tragischen Details festgehalten.',
    description_fr: 'Ki-Adi-Mundi, le Maître Jedi Céréen distingué par son crâne imposant, apporte une brillance tactique au Conseil Jedi. Cette minifigurine présente la tête allongée distinctive de Ki-Adi abritant un cerveau binaire, une barbe blanche, des robes Jedi brunes et un sabre laser bleu. Sortie en 2002, il représente l\'un des membres du Conseil les plus intellectuellement doués. Les collectionneurs apprécient Ki-Adi-Mundi pour son esprit stratégique et son leadership lors des batailles de la Guerre des Clones. Sa physiologie Céréenne unique et sa permission d\'avoir plusieurs familles en ont fait une exception aux règles Jedi. Sa mort pendant l\'Ordre 66 sur Mygeeto a été capturée en détail tragique dans La Revanche des Sith.',
    description_es: 'Ki-Adi-Mundi, el Maestro Jedi Cereano distinguido por su cráneo elevado, aporta brillantez táctica al Consejo Jedi. Esta minifigura presenta la distintiva cabeza alargada de Ki-Adi que alberga un cerebro binario, barba blanca, túnicas Jedi marrones y sable de luz azul. Lanzado en 2002, representa uno de los miembros del Consejo más intelectualmente dotados. Los coleccionistas valoran a Ki-Adi-Mundi por su mente estratégica y liderazgo durante las batallas de las Guerras Clon. Su fisiología Cereana única y permiso para tener múltiples familias lo convirtieron en una excepción a las reglas Jedi. Su muerte durante la Orden 66 en Mygeeto fue capturada en trágico detalle en La Venganza de los Sith.'
  },
  {
    minifigure_no: 'sw0058',
    name: 'Aayla Secura',
    description_en: 'Aayla Secura, the Twi\'lek Jedi Knight known for her distinctive blue skin and combat prowess, represents one of the most visually striking Jedi. This minifigure features Aayla\'s blue skin, head-tails (lekku), brown leather outfit with detailed printing, and green lightsaber. Released in 2005, she gained prominence through Clone Wars battles despite limited film appearances. Collectors highly value Aayla Secura for her unique design and tragic fate during Order 66 on Felucia. Her loyalty and skill made her a fan favorite, and her master-padawan lineage from Quinlan Vos adds depth. Essential for Clone Wars battle recreations and Jedi diversity in collections.',
    description_de: 'Aayla Secura, die Twi\'lek-Jedi-Ritterin, bekannt für ihre charakteristische blaue Haut und Kampffähigkeit, repräsentiert eine der visuell auffälligsten Jedi. Diese Minifigur zeigt Aaylas blaue Haut, Kopfschwänze (Lekku), braunes Lederoutfit mit detailliertem Druck und grünes Lichtschwert. 2005 veröffentlicht, gewann sie durch Klonkriegs-Schlachten an Bedeutung trotz begrenzter Filmauftritte. Sammler schätzen Aayla Secura sehr für ihr einzigartiges Design und tragisches Schicksal während Order 66 auf Felucia. Ihre Loyalität und Fähigkeit machten sie zu einem Fan-Favoriten, und ihre Meister-Padawan-Abstammung von Quinlan Vos fügt Tiefe hinzu. Unverzichtbar für Klonkriegs-Schlacht-Nachstellungen und Jedi-Diversität in Sammlungen.',
    description_fr: 'Aayla Secura, la Chevalier Jedi Twi\'lek connue pour sa peau bleue distinctive et ses prouesses au combat, représente l\'une des Jedi les plus visuellement frappantes. Cette minifigurine présente la peau bleue d\'Aayla, les queues de tête (lekku), une tenue en cuir brun avec des impressions détaillées et un sabre laser vert. Sortie en 2005, elle a gagné en importance grâce aux batailles de la Guerre des Clones malgré des apparitions limitées dans les films. Les collectionneurs apprécient grandement Aayla Secura pour son design unique et son destin tragique pendant l\'Ordre 66 sur Felucia. Sa loyauté et ses compétences en ont fait une favorite des fans, et sa lignée maître-padawan de Quinlan Vos ajoute de la profondeur. Essentielle pour les recréations de batailles de la Guerre des Clones et la diversité Jedi dans les collections.',
    description_es: 'Aayla Secura, la Caballero Jedi Twi\'lek conocida por su distintiva piel azul y destreza en combate, representa una de las Jedi más visualmente impactantes. Esta minifigura presenta la piel azul de Aayla, colas de cabeza (lekku), atuendo de cuero marrón con impresiones detalladas y sable de luz verde. Lanzada en 2005, ganó prominencia a través de batallas de las Guerras Clon a pesar de apariciones limitadas en películas. Los coleccionistas valoran mucho a Aayla Secura por su diseño único y destino trágico durante la Orden 66 en Felucia. Su lealtad y habilidad la convirtieron en favorita de los fans, y su linaje maestro-padawan de Quinlan Vos añade profundidad. Esencial para recreaciones de batallas de las Guerras Clon y diversidad Jedi en colecciones.'
  },
  {
    minifigure_no: 'sw0059',
    name: 'Barriss Offee',
    description_en: 'Barriss Offee, the Mirialan Jedi Padawan and skilled healer, represents the tragic fall of a promising young Jedi. This minifigure features Barriss\'s green skin with diamond-shaped facial tattoos, traditional Mirialan markings, dark robes, and blue lightsaber. Released in 2005, she was initially portrayed as Luminara Unduli\'s dedicated apprentice. Collectors value this figure for representing Barriss before her devastating betrayal of the Jedi Order. Her terrorist bombing of the Jedi Temple and framing of Ahsoka Tano revealed how the Clone Wars corrupted even noble Jedi. Essential for Geonosis medical tent scenes and her tragic transformation storyline from The Clone Wars.',
    description_de: 'Barriss Offee, die mirialanische Jedi-Padawan und geschickte Heilerin, repräsentiert den tragischen Fall einer vielversprechenden jungen Jedi. Diese Minifigur zeigt Barriss\' grüne Haut mit diamantförmigen Gesichtstätowierungen, traditionelle mirialanische Markierungen, dunkle Roben und blaues Lichtschwert. 2005 veröffentlicht, wurde sie zunächst als Luminara Unduli\'s hingebungsvolle Schülerin dargestellt. Sammler schätzen diese Figur dafür, dass sie Barriss vor ihrem verheerenden Verrat am Jedi-Orden repräsentiert. Ihr terroristischer Bombenanschlag auf den Jedi-Tempel und die falsche Anschuldigung von Ahsoka Tano zeigten, wie die Klonkriege selbst edle Jedi korrumpierten. Unverzichtbar für Geonosis-Sanitätszelt-Szenen und ihre tragische Transformations-Storyline aus The Clone Wars.',
    description_fr: 'Barriss Offee, la Padawan Jedi Mirialan et guérisseuse talentueuse, représente la chute tragique d\'une jeune Jedi prometteuse. Cette minifigurine présente la peau verte de Barriss avec des tatouages faciaux en forme de diamant, des marques Mirialan traditionnelles, des robes sombres et un sabre laser bleu. Sortie en 2005, elle était initialement dépeinte comme l\'apprentie dévouée de Luminara Unduli. Les collectionneurs apprécient cette figurine pour représenter Barriss avant sa trahison dévastatrice de l\'Ordre Jedi. Son attentat terroriste contre le Temple Jedi et son accusation d\'Ahsoka Tano ont révélé comment la Guerre des Clones a corrompu même les Jedi nobles. Essentielle pour les scènes de tente médicale de Geonosis et son histoire de transformation tragique de The Clone Wars.',
    description_es: 'Barriss Offee, la Padawan Jedi Mirialan y hábil sanadora, representa la trágica caída de una joven Jedi prometedora. Esta minifigura presenta la piel verde de Barriss con tatuajes faciales en forma de diamante, marcas Mirialan tradicionales, túnicas oscuras y sable de luz azul. Lanzada en 2005, fue inicialmente retratada como la dedicada aprendiz de Luminara Unduli. Los coleccionistas valoran esta figura por representar a Barriss antes de su devastadora traición a la Orden Jedi. Su bombardeo terrorista del Templo Jedi e incriminación de Ahsoka Tano reveló cómo las Guerras Clon corrompieron incluso a Jedi nobles. Esencial para escenas de carpa médica de Geonosis y su trágica historia de transformación de The Clone Wars.'
  },
  {
    minifigure_no: 'sw0060',
    name: 'Coleman Trebor',
    description_en: 'Coleman Trebor, the Vurk Jedi Master known for his diplomatic skills and unfortunate fate, represents the Jedi who fell at Geonosis. This minifigure features Coleman\'s distinctive reptilian green head with elongated snout, brown Jedi robes, and green lightsaber. Released in 2002, he had one of the briefest yet most memorable appearances in Attack of the Clones. Collectors appreciate Coleman Trebor for his tragic attempt to assassinate Count Dooku in the arena, only to be shot down by Jango Fett. His death showed the deadly reality facing Jedi during the Clone Wars. Essential for completing Geonosis arena battle displays with all participating Jedi.',
    description_de: 'Coleman Trebor, der Vurk-Jedi-Meister, bekannt für seine diplomatischen Fähigkeiten und unglückliches Schicksal, repräsentiert die Jedi, die bei Geonosis fielen. Diese Minifigur zeigt Colemans charakteristischen reptilienartigen grünen Kopf mit verlängerter Schnauze, braune Jedi-Roben und grünes Lichtschwert. 2002 veröffentlicht, hatte er einen der kürzesten, aber einprägsamsten Auftritte in Angriff der Klonkrieger. Sammler schätzen Coleman Trebor für seinen tragischen Versuch, Graf Dooku in der Arena zu ermorden, nur um von Jango Fett abgeschossen zu werden. Sein Tod zeigte die tödliche Realität, der Jedi während der Klonkriege gegenüberstanden. Unverzichtbar für die Vervollständigung von Geonosis-Arena-Schlacht-Displays mit allen teilnehmenden Jedi.',
    description_fr: 'Coleman Trebor, le Maître Jedi Vurk connu pour ses compétences diplomatiques et son destin malheureux, représente les Jedi tombés à Geonosis. Cette minifigurine présente la tête verte reptilienne distinctive de Coleman avec un museau allongé, des robes Jedi brunes et un sabre laser vert. Sortie en 2002, il a eu l\'une des apparitions les plus brèves mais les plus mémorables dans L\'Attaque des Clones. Les collectionneurs apprécient Coleman Trebor pour sa tentative tragique d\'assassiner le Comte Dooku dans l\'arène, seulement pour être abattu par Jango Fett. Sa mort a montré la réalité mortelle à laquelle les Jedi faisaient face pendant la Guerre des Clones. Essentiel pour compléter les expositions de bataille de l\'arène de Geonosis avec tous les Jedi participants.',
    description_es: 'Coleman Trebor, el Maestro Jedi Vurk conocido por sus habilidades diplomáticas y desafortunado destino, representa a los Jedi que cayeron en Geonosis. Esta minifigura presenta la distintiva cabeza verde reptiliana de Coleman con hocico alargado, túnicas Jedi marrones y sable de luz verde. Lanzado en 2002, tuvo una de las apariciones más breves pero memorables en El Ataque de los Clones. Los coleccionistas aprecian a Coleman Trebor por su trágico intento de asesinar al Conde Dooku en el arena, solo para ser derribado por Jango Fett. Su muerte mostró la mortal realidad que enfrentaban los Jedi durante las Guerras Clon. Esencial para completar exhibiciones de batalla del arena de Geonosis con todos los Jedi participantes.'
  },
  {
    minifigure_no: 'sw0061',
    name: 'Eeth Koth',
    description_en: 'Eeth Koth, the Zabrak Jedi Master known for his exceptional pain tolerance and combat endurance, served on the Jedi Council during critical times. This minifigure features Eeth\'s distinctive horned Zabrak head with facial tattoos, brown Jedi robes, stern expression, and green lightsaber. Released in 2011, he gained prominence through The Clone Wars animated series. Collectors value Eeth Koth for his torture and rescue storyline at General Grievous\'s hands, showcasing Jedi resilience. His ability to withstand extreme physical punishment demonstrated the mental fortitude of Iridonian Zabraks. Essential for Jedi Council displays and Clone Wars rescue mission recreations.',
    description_de: 'Eeth Koth, der Zabrak-Jedi-Meister, bekannt für seine außergewöhnliche Schmerztoleranz und Kampfausdauer, diente während kritischer Zeiten im Jedi-Rat. Diese Minifigur zeigt Eeths charakteristischen gehörnten Zabrak-Kopf mit Gesichtstätowierungen, braune Jedi-Roben, strengen Ausdruck und grünes Lichtschwert. 2011 veröffentlicht, gewann er durch die animierte Serie The Clone Wars an Bedeutung. Sammler schätzen Eeth Koth für seine Folter- und Rettungs-Storyline durch General Grievous\' Hände, die die Widerstandsfähigkeit der Jedi zeigt. Seine Fähigkeit, extreme körperliche Bestrafung zu ertragen, demonstrierte die mentale Stärke der iridonian Zabraks. Unverzichtbar für Jedi-Rat-Displays und Klonkriegs-Rettungsmissions-Nachstellungen.',
    description_fr: 'Eeth Koth, le Maître Jedi Zabrak connu pour sa tolérance exceptionnelle à la douleur et son endurance au combat, a servi au Conseil Jedi pendant des périodes critiques. Cette minifigurine présente la tête Zabrak cornue distinctive d\'Eeth avec des tatouages faciaux, des robes Jedi brunes, une expression sévère et un sabre laser vert. Sortie en 2011, il a gagné en importance grâce à la série animée The Clone Wars. Les collectionneurs apprécient Eeth Koth pour son histoire de torture et de sauvetage aux mains du Général Grievous, démontrant la résilience Jedi. Sa capacité à supporter une punition physique extrême a démontré la force mentale des Zabraks d\'Iridonia. Essentiel pour les expositions du Conseil Jedi et les recréations de missions de sauvetage de la Guerre des Clones.',
    description_es: 'Eeth Koth, el Maestro Jedi Zabrak conocido por su excepcional tolerancia al dolor y resistencia en combate, sirvió en el Consejo Jedi durante tiempos críticos. Esta minifigura presenta la distintiva cabeza Zabrak con cuernos de Eeth con tatuajes faciales, túnicas Jedi marrones, expresión severa y sable de luz verde. Lanzado en 2011, ganó prominencia a través de la serie animada The Clone Wars. Los coleccionistas valoran a Eeth Koth por su historia de tortura y rescate a manos del General Grievous, demostrando la resistencia Jedi. Su capacidad para soportar castigo físico extremo demostró la fortaleza mental de los Zabraks Iridonianos. Esencial para exhibiciones del Consejo Jedi y recreaciones de misiones de rescate de las Guerras Clon.'
  }
];

async function saveBatch() {
  console.log('💾 Saving batch 13 (sw0057-sw0061)...\n');
  
  for (const minifig of batch13) {
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
  
  console.log('\n✨ Batch 13 complete! Total: 60 minifigs (240 descriptions)\n');
  await prisma.$disconnect();
}

saveBatch().catch(console.error);
