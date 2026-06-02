import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch14 = [
  {
    minifigure_no: 'sw0062',
    name: 'Adi Gallia',
    description_en: 'Adi Gallia, the Tholothian Jedi Master known for her wisdom and diplomatic skills, served as a trusted Council member and military general. This minifigure features Adi\'s distinctive head-tails and ornate headdress, brown Jedi robes, elegant appearance, and blue lightsaber. Released in 2011, she became prominent through Clone Wars campaigns. Collectors value Adi Gallia for her intelligence gathering and strategic planning during the war. Her tragic death at Savage Opress\'s hands while protecting Obi-Wan showcased ultimate Jedi sacrifice. Essential for Jedi Council chambers and Clone Wars space combat recreations where she commanded Republic fleets.',
    description_de: 'Adi Gallia, die tholothianische Jedi-Meisterin, bekannt für ihre Weisheit und diplomatischen Fähigkeiten, diente als vertrauenswürdiges Ratsmitglied und militärische Generalin. Diese Minifigur zeigt Adis charakteristische Kopfschwänze und kunstvollen Kopfschmuck, braune Jedi-Roben, elegantes Aussehen und blaues Lichtschwert. 2011 veröffentlicht, wurde sie durch Klonkriegs-Kampagnen prominent. Sammler schätzen Adi Gallia für ihre Informationsbeschaffung und strategische Planung während des Krieges. Ihr tragischer Tod durch Savage Opress\' Hand, während sie Obi-Wan beschützte, zeigte das ultimative Jedi-Opfer. Unverzichtbar für Jedi-Rat-Kammern und Klonkriegs-Weltraumkampf-Nachstellungen, wo sie republikanische Flotten kommandierte.',
    description_fr: 'Adi Gallia, la Maître Jedi Tholothian connue pour sa sagesse et ses compétences diplomatiques, a servi en tant que membre de confiance du Conseil et générale militaire. Cette minifigurine présente les queues de tête et la coiffe ornée distinctives d\'Adi, des robes Jedi brunes, une apparence élégante et un sabre laser bleu. Sortie en 2011, elle est devenue proéminente grâce aux campagnes de la Guerre des Clones. Les collectionneurs apprécient Adi Gallia pour son renseignement et sa planification stratégique pendant la guerre. Sa mort tragique aux mains de Savage Opress en protégeant Obi-Wan a montré le sacrifice ultime Jedi. Essentielle pour les chambres du Conseil Jedi et les recréations de combat spatial de la Guerre des Clones où elle commandait les flottes de la République.',
    description_es: 'Adi Gallia, la Maestra Jedi Tholothiana conocida por su sabiduría y habilidades diplomáticas, sirvió como miembro confiable del Consejo y general militar. Esta minifigura presenta las distintivas colas de cabeza y tocado ornamentado de Adi, túnicas Jedi marrones, apariencia elegante y sable de luz azul. Lanzada en 2011, se volvió prominente a través de campañas de las Guerras Clon. Los coleccionistas valoran a Adi Gallia por su recopilación de inteligencia y planificación estratégica durante la guerra. Su trágica muerte a manos de Savage Opress mientras protegía a Obi-Wan demostró el sacrificio Jedi supremo. Esencial para cámaras del Consejo Jedi y recreaciones de combate espacial de las Guerras Clon donde comandó flotas de la República.'
  },
  {
    minifigure_no: 'sw0063',
    name: 'Stass Allie',
    description_en: 'Stass Allie, the Tholothian Jedi Master and cousin of Adi Gallia, specialized in medicine and healing arts while serving on the Council. This minifigure features Stass\'s distinctive head-tails with ornate jewelry, brown Jedi robes, serene expression, and green lightsaber. Released in 2005, she represented the Jedi\'s compassionate healer archetype. Collectors appreciate Stass Allie for her medical expertise and tragic Order 66 death on Saleucami. Her speeder bike explosion showed the sudden brutality of the clone betrayal. Essential for Jedi Council displays and medical frigate scenes showcasing Jedi healers during the Clone Wars.',
    description_de: 'Stass Allie, die tholothianische Jedi-Meisterin und Cousine von Adi Gallia, spezialisierte sich auf Medizin und Heilkünste, während sie im Rat diente. Diese Minifigur zeigt Stass\' charakteristische Kopfschwänze mit kunstvollen Schmuck, braune Jedi-Roben, ruhigen Ausdruck und grünes Lichtschwert. 2005 veröffentlicht, repräsentierte sie den mitfühlenden Heiler-Archetyp der Jedi. Sammler schätzen Stass Allie für ihre medizinische Expertise und tragischen Order-66-Tod auf Saleucami. Ihre Schwebegleiter-Explosion zeigte die plötzliche Brutalität des Klonverrats. Unverzichtbar für Jedi-Rat-Displays und medizinische Fregatte-Szenen, die Jedi-Heiler während der Klonkriege zeigen.',
    description_fr: 'Stass Allie, la Maître Jedi Tholothian et cousine d\'Adi Gallia, s\'est spécialisée dans la médecine et les arts de la guérison tout en servant au Conseil. Cette minifigurine présente les queues de tête distinctives de Stass avec des bijoux ornés, des robes Jedi brunes, une expression sereine et un sabre laser vert. Sortie en 2005, elle représentait l\'archétype du guérisseur compatissant Jedi. Les collectionneurs apprécient Stass Allie pour son expertise médicale et sa mort tragique lors de l\'Ordre 66 sur Saleucami. L\'explosion de son speeder bike a montré la brutalité soudaine de la trahison des clones. Essentielle pour les expositions du Conseil Jedi et les scènes de frégates médicales présentant les guérisseurs Jedi pendant la Guerre des Clones.',
    description_es: 'Stass Allie, la Maestra Jedi Tholothiana y prima de Adi Gallia, se especializó en medicina y artes curativas mientras servía en el Consejo. Esta minifigura presenta las distintivas colas de cabeza de Stass con joyería ornamentada, túnicas Jedi marrones, expresión serena y sable de luz verde. Lanzada en 2005, representó el arquetipo de sanadora compasiva Jedi. Los coleccionistas aprecian a Stass Allie por su experiencia médica y trágica muerte en la Orden 66 en Saleucami. La explosión de su moto deslizadora mostró la brutalidad repentina de la traición clon. Esencial para exhibiciones del Consejo Jedi y escenas de fragatas médicas que muestran sanadores Jedi durante las Guerras Clon.'
  },
  {
    minifigure_no: 'sw0064',
    name: 'Even Piell',
    description_en: 'Even Piell, the diminutive Lannik Jedi Master known for his fierce warrior spirit despite small stature, served with distinction on the Council. This minifigure features Even\'s short stature, pointed ears, scarred face with missing eye, brown Jedi robes, and green lightsaber. Released in 2012, he gained prominence through The Clone Wars prison arc. Collectors value Even Piell for his courage and the knowledge of secret hyperspace routes he protected. His death on Lola Sayu while imprisoned by the Separatists showcased unwavering Jedi bravery. Essential for Clone Wars prison break recreations and Jedi Council displays showing diverse species.',
    description_de: 'Even Piell, der winzige Lannik-Jedi-Meister, bekannt für seinen heftigen Kriegergeist trotz kleiner Statur, diente mit Auszeichnung im Rat. Diese Minifigur zeigt Evens kleine Statur, spitze Ohren, vernarbtes Gesicht mit fehlendem Auge, braune Jedi-Roben und grünes Lichtschwert. 2012 veröffentlicht, gewann er durch den Clone-Wars-Gefängnis-Handlungsbogen an Bedeutung. Sammler schätzen Even Piell für seinen Mut und das Wissen über geheime Hyperraum-Routen, die er schützte. Sein Tod auf Lola Sayu, während er von den Separatisten gefangen gehalten wurde, zeigte unerschütterliche Jedi-Tapferkeit. Unverzichtbar für Klonkriegs-Gefängnisausbruch-Nachstellungen und Jedi-Rat-Displays mit vielfältigen Spezies.',
    description_fr: 'Even Piell, le petit Maître Jedi Lannik connu pour son esprit guerrier féroce malgré sa petite stature, a servi avec distinction au Conseil. Cette minifigurine présente la petite stature d\'Even, des oreilles pointues, un visage balafré avec un œil manquant, des robes Jedi brunes et un sabre laser vert. Sortie en 2012, il a gagné en importance grâce à l\'arc de prison de The Clone Wars. Les collectionneurs apprécient Even Piell pour son courage et la connaissance des routes secrètes de l\'hyperespace qu\'il protégeait. Sa mort sur Lola Sayu alors qu\'il était emprisonné par les Séparatistes a montré le courage Jedi inébranlable. Essentiel pour les recréations d\'évasion de prison de la Guerre des Clones et les expositions du Conseil Jedi montrant des espèces diverses.',
    description_es: 'Even Piell, el diminuto Maestro Jedi Lannik conocido por su feroz espíritu guerrero a pesar de su pequeña estatura, sirvió con distinción en el Consejo. Esta minifigura presenta la baja estatura de Even, orejas puntiagudas, rostro cicatrizado con ojo faltante, túnicas Jedi marrones y sable de luz verde. Lanzado en 2012, ganó prominencia a través del arco de prisión de The Clone Wars. Los coleccionistas valoran a Even Piell por su coraje y el conocimiento de rutas secretas de hiperespacio que protegió. Su muerte en Lola Sayu mientras estaba prisionero de los Separatistas demostró valentía Jedi inquebrantable. Esencial para recreaciones de fuga de prisión de las Guerras Clon y exhibiciones del Consejo Jedi que muestran especies diversas.'
  },
  {
    minifigure_no: 'sw0065',
    name: 'Oppo Rancisis',
    description_en: 'Oppo Rancisis, the Thisspiasian Jedi Master with serpentine lower body, brought ancient wisdom and battle meditation skills to the Council. This minifigure features Oppo\'s distinctive long white hair and beard, reptilian features, snake-like tail instead of legs, and green lightsaber. Released in 2013, he represents one of the most unusual Jedi designs. Collectors appreciate Oppo Rancisis for his unique physiology and mastery of battle meditation that influenced entire battlefields. His strategic mind and centuries of experience made him invaluable during the Clone Wars. Essential for complete Jedi Council displays showcasing the Order\'s diversity.',
    description_de: 'Oppo Rancisis, der thisspiasianische Jedi-Meister mit schlangenartigem Unterkörper, brachte uralte Weisheit und Schlachtmeditationsfähigkeiten zum Rat. Diese Minifigur zeigt Oppos charakteristisches langes weißes Haar und Bart, reptilienartige Merkmale, schlangenartigen Schwanz statt Beinen und grünes Lichtschwert. 2013 veröffentlicht, repräsentiert er eines der ungewöhnlichsten Jedi-Designs. Sammler schätzen Oppo Rancisis für seine einzigartige Physiologie und Beherrschung der Schlachtmeditation, die ganze Schlachtfelder beeinflusste. Sein strategischer Verstand und jahrhundertelange Erfahrung machten ihn während der Klonkriege unschätzbar. Unverzichtbar für vollständige Jedi-Rat-Displays, die die Vielfalt des Ordens zeigen.',
    description_fr: 'Oppo Rancisis, le Maître Jedi Thisspiasien avec un corps inférieur de serpent, a apporté une sagesse ancienne et des compétences de méditation de bataille au Conseil. Cette minifigurine présente les longs cheveux et la barbe blancs distinctifs d\'Oppo, des traits reptiliens, une queue serpentine au lieu de jambes et un sabre laser vert. Sortie en 2013, il représente l\'un des designs Jedi les plus inhabituels. Les collectionneurs apprécient Oppo Rancisis pour sa physiologie unique et sa maîtrise de la méditation de bataille qui influençait des champs de bataille entiers. Son esprit stratégique et ses siècles d\'expérience l\'ont rendu inestimable pendant la Guerre des Clones. Essentiel pour les expositions complètes du Conseil Jedi présentant la diversité de l\'Ordre.',
    description_es: 'Oppo Rancisis, el Maestro Jedi Thisspiasiano con cuerpo inferior serpentino, trajo sabiduría antigua y habilidades de meditación de batalla al Consejo. Esta minifigura presenta el distintivo cabello y barba blancos largos de Oppo, rasgos reptilianos, cola serpentina en lugar de piernas y sable de luz verde. Lanzado en 2013, representa uno de los diseños Jedi más inusuales. Los coleccionistas aprecian a Oppo Rancisis por su fisiología única y maestría de la meditación de batalla que influenciaba campos de batalla enteros. Su mente estratégica y siglos de experiencia lo hicieron invaluable durante las Guerras Clon. Esencial para exhibiciones completas del Consejo Jedi que muestran la diversidad de la Orden.'
  },
  {
    minifigure_no: 'sw0066',
    name: 'Yaddle',
    description_en: 'Yaddle, a member of Yoda\'s mysterious species and a powerful Jedi Master, served on the Council with quiet wisdom and compassion. This minifigure features Yaddle\'s distinctive large eyes, small stature similar to Yoda, brown hair in a bun, tan Jedi robes, and green lightsaber. Released in 2013, she represents the extremely rare glimpse into Yoda\'s species. Collectors highly value Yaddle for being one of only three known members of this enigmatic species. Her sacrifice to save Mawan showcased selfless Jedi ideals. Essential for Jedi Council completeness and representing the mysteries of the Star Wars galaxy.',
    description_de: 'Yaddle, ein Mitglied von Yodas mysteriöser Spezies und eine mächtige Jedi-Meisterin, diente im Rat mit stiller Weisheit und Mitgefühl. Diese Minifigur zeigt Yaddles charakteristische große Augen, kleine Statur ähnlich wie Yoda, braunes Haar im Knoten, beige Jedi-Roben und grünes Lichtschwert. 2013 veröffentlicht, repräsentiert sie den extrem seltenen Einblick in Yodas Spezies. Sammler schätzen Yaddle sehr dafür, eines von nur drei bekannten Mitgliedern dieser rätselhaften Spezies zu sein. Ihr Opfer zur Rettung von Mawan zeigte selbstlose Jedi-Ideale. Unverzichtbar für Jedi-Rat-Vollständigkeit und Darstellung der Mysterien der Star-Wars-Galaxis.',
    description_fr: 'Yaddle, membre de l\'espèce mystérieuse de Yoda et puissante Maître Jedi, a servi au Conseil avec une sagesse tranquille et de la compassion. Cette minifigurine présente les grands yeux distinctifs de Yaddle, une petite stature similaire à Yoda, des cheveux bruns en chignon, des robes Jedi beiges et un sabre laser vert. Sortie en 2013, elle représente l\'aperçu extrêmement rare de l\'espèce de Yoda. Les collectionneurs apprécient grandement Yaddle pour être l\'un des trois seuls membres connus de cette espèce énigmatique. Son sacrifice pour sauver Mawan a montré les idéaux Jedi altruistes. Essentielle pour la complétude du Conseil Jedi et représenter les mystères de la galaxie Star Wars.',
    description_es: 'Yaddle, miembro de la misteriosa especie de Yoda y poderosa Maestra Jedi, sirvió en el Consejo con sabiduría silenciosa y compasión. Esta minifigura presenta los distintivos ojos grandes de Yaddle, estatura pequeña similar a Yoda, cabello castaño en moño, túnicas Jedi beige y sable de luz verde. Lanzada en 2013, representa la visión extremadamente rara de la especie de Yoda. Los coleccionistas valoran mucho a Yaddle por ser uno de solo tres miembros conocidos de esta enigmática especie. Su sacrificio para salvar Mawan demostró ideales Jedi desinteresados. Esencial para la integridad del Consejo Jedi y representar los misterios de la galaxia Star Wars.'
  }
];

async function saveBatch() {
  console.log('💾 Saving batch 14 (sw0062-sw0066)...\n');
  
  for (const minifig of batch14) {
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
  
  console.log('\n✨ Batch 14 complete! Total: 65 minifigs (260 descriptions)\n');
  await prisma.$disconnect();
}

saveBatch().catch(console.error);
