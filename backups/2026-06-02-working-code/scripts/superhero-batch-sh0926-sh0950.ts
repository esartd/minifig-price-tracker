import { PrismaClient as PrismaClientHostinger } from '@prisma/client';

const prisma = new PrismaClientHostinger({
  datasources: {
    db: {
      url: "mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker"
    }
  }
});

const descriptions = [
  {
    minifigure_no: 'sh0926',
    description_en: "Pepper Potts in Black Suit with Dark Orange Hair (2023) features Gwyneth Paltrow's character in professional business attire, capturing Tony Stark's CEO and partner with flowing hair and sophisticated executive styling.",
    description_de: "Pepper Potts im schwarzen Anzug mit dunkellorangem Haar (2023) zeigt Gwyneth Paltrows Charakter in professioneller Geschäftskleidung, die Tony Starks CEO und Partnerin mit fließendem Haar und raffiniertem Executive-Styling einfängt.",
    description_fr: "Pepper Potts en costume noir avec cheveux orange foncé (2023) présente le personnage de Gwyneth Paltrow dans une tenue professionnelle d'affaires, capturant la PDG et partenaire de Tony Stark avec des cheveux fluides et un style exécutif sophistiqué.",
    description_es: "Pepper Potts en traje negro con cabello naranja oscuro (2023) presenta al personaje de Gwyneth Paltrow en atuendo profesional de negocios, capturando a la CEO y pareja de Tony Stark con cabello fluido y estilo ejecutivo sofisticado."
  },
  {
    minifigure_no: 'sh0927',
    description_en: "The Wasp (Hope van Dyne) with Trans-Clear Wings and Hexagons (2023) features Evangeline Lilly's shrinking hero with transparent hexagonal-patterned wings, capturing her size-changing abilities and partnership with Ant-Man in detailed costume.",
    description_de: "The Wasp (Hope van Dyne) mit durchsichtigen Flügeln und Sechsecken (2023) zeigt Evangeline Lillys schrumpfende Heldin mit transparenten sechseckig gemusterten Flügeln, die ihre größenverändernden Fähigkeiten und Partnerschaft mit Ant-Man in detailliertem Kostüm einfängt.",
    description_fr: "The Wasp (Hope van Dyne) avec ailes transparentes et hexagones (2023) présente l'héroïne rétrécissante d'Evangeline Lilly avec des ailes transparentes à motif hexagonal, capturant ses capacités de changement de taille et son partenariat avec Ant-Man dans un costume détaillé.",
    description_es: "The Wasp (Hope van Dyne) con alas transparentes y hexágonos (2023) presenta a la heroína encogible de Evangeline Lilly con alas transparentes con patrón hexagonal, capturando sus habilidades de cambio de tamaño y asociación con Ant-Man en traje detallado."
  },
  {
    minifigure_no: 'sh0928',
    description_en: "Tony Stark in Black Shirt with Gold Helmet and Pin Holder (2023) features the genius billionaire holding his Iron Man helmet with specialized back piece for display mounting, capturing his dual identity with casual attire and armor accessory.",
    description_de: "Tony Stark im schwarzen Hemd mit goldenem Helm und Pin-Halter (2023) zeigt den genialen Milliardär, der seinen Iron Man-Helm mit spezialisiertem Rückenteil für Display-Montage hält, der seine doppelte Identität mit lässiger Kleidung und Rüstungs-Zubehör einfängt.",
    description_fr: "Tony Stark en chemise noire avec casque doré et porte-épingle (2023) présente le milliardaire génie tenant son casque Iron Man avec une pièce arrière spécialisée pour le montage d'affichage, capturant sa double identité avec une tenue décontractée et un accessoire d'armure.",
    description_es: "Tony Stark en camisa negra con casco dorado y soporte de alfiler (2023) presenta al genio multimillonario sosteniendo su casco Iron Man con pieza trasera especializada para montaje de exhibición, capturando su identidad dual con atuendo casual y accesorio de armadura."
  },
  {
    minifigure_no: 'sh0929',
    description_en: "Falcon in Dark Bluish Gray and Black Suit with Printed Legs (2023) features Sam Wilson in his tactical flight suit with enhanced leg printing, capturing Anthony Mackie's character with EXO-7 Falcon wings and aerial combat gear.",
    description_de: "Falcon im dunkelblaugrauen und schwarzen Anzug mit bedruckten Beinen (2023) zeigt Sam Wilson in seinem taktischen Fluganzug mit verbessertem Beindruck, der Anthony Mackies Charakter mit EXO-7 Falcon-Flügeln und Luftkampfausrüstung einfängt.",
    description_fr: "Falcon en costume gris bleu foncé et noir avec jambes imprimées (2023) présente Sam Wilson dans son costume de vol tactique avec une impression de jambes améliorée, capturant le personnage d'Anthony Mackie avec des ailes EXO-7 Falcon et un équipement de combat aérien.",
    description_es: "Falcon en traje gris azulado oscuro y negro con piernas impresas (2023) presenta a Sam Wilson en su traje de vuelo táctico con impresión de piernas mejorada, capturando el personaje de Anthony Mackie con alas EXO-7 Falcon y equipo de combate aéreo."
  },
  {
    minifigure_no: 'sh0930',
    description_en: "Dr. Erik Selvig (2023) features Stellan Skarsgård's astrophysicist in casual attire, capturing the brilliant scientist mentoring Jane Foster and studying cosmic phenomena with Asgardian connections and Tesseract research expertise.",
    description_de: "Dr. Erik Selvig (2023) zeigt Stellan Skarsgårds Astrophysiker in lässiger Kleidung, der den brillanten Wissenschaftler einfängt, der Jane Foster betreut und kosmische Phänomene mit asgardischen Verbindungen und Tesseract-Forschungsexpertise studiert.",
    description_fr: "Dr. Erik Selvig (2023) présente l'astrophysicien de Stellan Skarsgård dans une tenue décontractée, capturant le scientifique brillant encadrant Jane Foster et étudiant les phénomènes cosmiques avec des connexions asgardiennes et une expertise de recherche sur le Tesseract.",
    description_es: "Dr. Erik Selvig (2023) presenta al astrofísico de Stellan Skarsgård en atuendo casual, capturando al científico brillante que hace de mentor de Jane Foster y estudia fenómenos cósmicos con conexiones asgardianas y experiencia en investigación del Teseracto."
  },
  {
    minifigure_no: 'sh0932',
    description_en: "Hulk Giant Figure in Dark Bluish Gray Pants with Smile (2023) features the green giant in big-fig scale with friendly expression, capturing Bruce Banner's alter ego with massive build and Professor Hulk's intelligent personality.",
    description_de: "Hulk Riesenfigur in dunkelblaugrauer Hose mit Lächeln (2023) zeigt den grünen Riesen im Big-Fig-Maßstab mit freundlichem Ausdruck, der Bruce Banners Alter Ego mit massivem Körperbau und Professor Hulks intelligenter Persönlichkeit einfängt.",
    description_fr: "Figurine géante Hulk en pantalon gris bleu foncé avec sourire (2023) présente le géant vert à l'échelle big-fig avec une expression amicale, capturant l'alter ego de Bruce Banner avec une carrure massive et la personnalité intelligente du Professeur Hulk.",
    description_es: "Figura gigante de Hulk en pantalones gris azulado oscuro con sonrisa (2023) presenta al gigante verde a escala de figura grande con expresión amigable, capturando el alter ego de Bruce Banner con constitución masiva y personalidad inteligente del Profesor Hulk."
  },
  {
    minifigure_no: 'sh0933',
    description_en: "Dum-E Black Mechanical Arm (2023) brings Tony Stark's workshop robot assistant to life with articulated mechanical arm piece, capturing the clumsy but loyal AI helper from his Malibu mansion lab with industrial construction.",
    description_de: "Dum-E schwarzer mechanischer Arm (2023) erweckt Tony Starks Werkstatt-Roboter-Assistent mit artikuliertem mechanischem Arm-Teil zum Leben, der den tollpatschigen aber loyalen KI-Helfer aus seinem Malibu-Mansion-Labor mit industrieller Konstruktion einfängt.",
    description_fr: "Bras mécanique noir Dum-E (2023) donne vie à l'assistant robot d'atelier de Tony Stark avec une pièce de bras mécanique articulée, capturant l'aide IA maladroit mais loyal de son laboratoire du manoir de Malibu avec une construction industrielle.",
    description_es: "Brazo mecánico negro Dum-E (2023) da vida al asistente robot de taller de Tony Stark con pieza de brazo mecánico articulado, capturando al ayudante de IA torpe pero leal de su laboratorio de mansión de Malibú con construcción industrial."
  },
  {
    minifigure_no: 'sh0934',
    description_en: "Taxi Driver (2023) features a New York City cab driver civilian minifigure, perfect for street-level Marvel scenes and recreating urban environments where heroes operate among everyday citizens with authentic city styling.",
    description_de: "Taxifahrer (2023) zeigt eine New York City Taxifahrer-Zivilisten-Minifigur, perfekt für Street-Level-Marvel-Szenen und zur Nachstellung urbaner Umgebungen, in denen Helden unter alltäglichen Bürgern mit authentischem Stadt-Styling operieren.",
    description_fr: "Chauffeur de taxi (2023) présente une figurine civile de chauffeur de taxi de New York, parfaite pour les scènes Marvel au niveau de la rue et la recréation d'environnements urbains où les héros opèrent parmi les citoyens ordinaires avec un style de ville authentique.",
    description_es: "Taxista (2023) presenta una minifigura civil de conductor de taxi de Nueva York, perfecta para escenas Marvel a nivel de calle y recrear entornos urbanos donde los héroes operan entre ciudadanos comunes con estilo de ciudad auténtico."
  },
  {
    minifigure_no: 'sh0935',
    description_en: "Baby Groot with Short Legs (2024) features the adorable seedling in child-sized proportions with short leg piece, capturing the cute Phase 2 Groot after his heroic sacrifice and regrowth with innocent charm.",
    description_de: "Baby Groot mit kurzen Beinen (2024) zeigt den bezaubernden Sämling in kindgroßen Proportionen mit kurzem Beinteil, der den niedlichen Phase 2 Groot nach seinem heroischen Opfer und Nachwachsen mit unschuldiger Anziehungskraft einfängt.",
    description_fr: "Baby Groot avec jambes courtes (2024) présente le semis adorable en proportions de taille d'enfant avec une pièce de jambe courte, capturant le mignon Groot Phase 2 après son sacrifice héroïque et sa repousse avec un charme innocent.",
    description_es: "Baby Groot con piernas cortas (2024) presenta al adorable retoño en proporciones de tamaño infantil con pieza de pierna corta, capturando al lindo Groot de Fase 2 después de su sacrificio heroico y crecimiento con encanto inocente."
  },
  {
    minifigure_no: 'sh0936',
    description_en: "Rocket Raccoon in Dark Red and Pearl Dark Gray Outfit (2024) from The Infinity Saga features the genius engineer in tactical combat gear with updated color scheme, capturing his weapons expert personality with detailed costume printing.",
    description_de: "Rocket Raccoon in dunkelrotem und perldunkelgrauem Outfit (2024) aus The Infinity Saga zeigt den genialen Ingenieur in taktischer Kampfausrüstung mit aktualisiertem Farbschema, der seine Waffenexperten-Persönlichkeit mit detailliertem Kostümdruck einfängt.",
    description_fr: "Rocket Raccoon en tenue rouge foncé et gris foncé perlé (2024) de The Infinity Saga présente l'ingénieur de génie dans un équipement de combat tactique avec un schéma de couleurs mis à jour, capturant sa personnalité d'expert en armes avec une impression de costume détaillée.",
    description_es: "Rocket Raccoon en atuendo rojo oscuro y gris oscuro perla (2024) de The Infinity Saga presenta al ingeniero genio en equipo de combate táctico con esquema de colores actualizado, capturando su personalidad de experto en armas con impresión de traje detallada."
  },
  {
    minifigure_no: 'sh0937',
    description_en: "Ronan the Accuser with Dark Azure Head and Hands (2024) from The Infinity Saga features Lee Pace's Kree fanatic in his black armor with blue skin, capturing the radical villain wielding the Power Stone with imposing hammer weapon.",
    description_de: "Ronan der Ankläger mit dunkelazurblauem Kopf und Händen (2024) aus The Infinity Saga zeigt Lee Paces Kree-Fanatiker in seiner schwarzen Rüstung mit blauer Haut, der den radikalen Schurken mit dem Power Stone mit imposanter Hammer-Waffe einfängt.",
    description_fr: "Ronan l'Accusateur avec tête et mains azur foncé (2024) de The Infinity Saga présente le fanatique Kree de Lee Pace dans son armure noire avec une peau bleue, capturant le méchant radical maniant la Pierre de Pouvoir avec une arme de marteau imposante.",
    description_es: "Ronan el Acusador con cabeza y manos azur oscuro (2024) de The Infinity Saga presenta al fanático Kree de Lee Pace en su armadura negra con piel azul, capturando al villano radical blandiendo la Gema de Poder con imponente arma de martillo."
  },
  {
    minifigure_no: 'sh0938',
    description_en: "Lizard (2024) from No Way Home brings Dr. Curt Connors to life in his reptilian transformation with scaled texture and specialized mold, capturing the tragic villain from The Amazing Spider-Man with massive build and tail accessory.",
    description_de: "Lizard (2024) aus No Way Home erweckt Dr. Curt Connors in seiner reptilischen Verwandlung mit geschuppter Textur und spezialisierter Form zum Leben, der den tragischen Schurken aus The Amazing Spider-Man mit massivem Körperbau und Schwanz-Zubehör einfängt.",
    description_fr: "Lizard (2024) de No Way Home donne vie au Dr. Curt Connors dans sa transformation reptilienne avec une texture écaillée et un moule spécialisé, capturant le méchant tragique de The Amazing Spider-Man avec une carrure massive et un accessoire de queue.",
    description_es: "Lizard (2024) de No Way Home da vida al Dr. Curt Connors en su transformación reptiliana con textura escamosa y molde especializado, capturando al villano trágico de The Amazing Spider-Man con constitución masiva y accesorio de cola."
  },
  {
    minifigure_no: 'sh0939',
    description_en: "Wolverine in Yellow and Black Mask with Blue Hands (2024) brings the iconic X-Men mutant back with updated costume featuring yellow and black cowl design, blue gloves, and adamantium claw accessories for authentic Marvel action.",
    description_de: "Wolverine in gelb-schwarzer Maske mit blauen Händen (2024) bringt den ikonischen X-Men-Mutanten mit aktualisiertem Kostüm mit gelb-schwarzem Kapuzen-Design, blauen Handschuhen und Adamantium-Krallen-Zubehör für authentische Marvel-Action zurück.",
    description_fr: "Wolverine en masque jaune et noir avec mains bleues (2024) ramène le mutant X-Men iconique avec un costume mis à jour présentant un design de capuche jaune et noir, des gants bleus et des accessoires de griffes d'adamantium pour une action Marvel authentique.",
    description_es: "Wolverine en máscara amarilla y negra con manos azules (2024) trae de vuelta al mutante icónico de X-Men con traje actualizado con diseño de capucha amarilla y negra, guantes azules y accesorios de garras de adamantium para acción Marvel auténtica."
  },
  {
    minifigure_no: 'sh0940',
    description_en: "Magneto in Magenta Outfit (2024) features the Master of Magnetism in his iconic comic-accurate costume with magenta and red color scheme, capturing the powerful mutant leader with his metal-manipulating abilities and complex anti-hero personality.",
    description_de: "Magneto in magentafarbenem Outfit (2024) zeigt den Meister des Magnetismus in seinem ikonischen comic-genauen Kostüm mit magenta-rotem Farbschema, der den mächtigen Mutanten-Anführer mit seinen metallmanipulierenden Fähigkeiten und komplexer Anti-Helden-Persönlichkeit einfängt.",
    description_fr: "Magneto en tenue magenta (2024) présente le Maître du Magnétisme dans son costume iconique fidèle aux comics avec un schéma de couleurs magenta et rouge, capturant le puissant leader mutant avec ses capacités de manipulation du métal et sa personnalité d'anti-héros complexe.",
    description_es: "Magneto en atuendo magenta (2024) presenta al Maestro del Magnetismo en su icónico traje fiel a los cómics con esquema de colores magenta y rojo, capturando al poderoso líder mutante con sus habilidades de manipulación de metal y personalidad compleja de antihéroe."
  },
  {
    minifigure_no: 'sh0941',
    description_en: "Cyclops in Blue Outfit with Plain Legs (2024) features Scott Summers in his classic X-Men uniform with distinctive visor, capturing the team leader with optic blast powers and tactical leadership abilities in comic-accurate design.",
    description_de: "Cyclops im blauen Outfit mit einfachen Beinen (2024) zeigt Scott Summers in seiner klassischen X-Men-Uniform mit markantem Visier, der den Teamleiter mit optischen Strahlkräften und taktischen Führungsfähigkeiten in comic-genauem Design einfängt.",
    description_fr: "Cyclops en tenue bleue avec jambes simples (2024) présente Scott Summers dans son uniforme X-Men classique avec un viseur distinctif, capturant le chef d'équipe avec des pouvoirs de rayon optique et des capacités de leadership tactique dans un design fidèle aux comics.",
    description_es: "Cyclops en atuendo azul con piernas simples (2024) presenta a Scott Summers en su uniforme clásico de X-Men con visor distintivo, capturando al líder del equipo con poderes de explosión óptica y habilidades de liderazgo táctico en diseño fiel a los cómics."
  },
  {
    minifigure_no: 'sh0942',
    description_en: "Rogue (2024) introduces the power-absorbing X-Men member in her iconic green and yellow costume with white-streaked hair, capturing the Southern mutant with life-force draining abilities and complex relationship with her dangerous powers.",
    description_de: "Rogue (2024) führt das kraftabsorbierende X-Men-Mitglied in ihrem ikonischen grün-gelben Kostüm mit weiß-gestreiftem Haar ein, die die südliche Mutantin mit lebenskraft-absorbierenden Fähigkeiten und komplexer Beziehung zu ihren gefährlichen Kräften einfängt.",
    description_fr: "Rogue (2024) présente le membre des X-Men absorbeur de pouvoir dans son costume vert et jaune iconique avec des cheveux striés de blanc, capturant la mutante du Sud avec des capacités de drainage de force vitale et une relation complexe avec ses pouvoirs dangereux.",
    description_es: "Rogue (2024) presenta al miembro de X-Men absorbedor de poderes en su icónico traje verde y amarillo con cabello con rayas blancas, capturando a la mutante sureña con habilidades de drenaje de fuerza vital y relación compleja con sus poderes peligrosos."
  },
  {
    minifigure_no: 'sh0943',
    description_en: "Spider-Man (Miles Morales) in Dark Red Hood with Dark Bluish Gray Legs (2024) features the Brooklyn hero in casual street wear over his suit, capturing his undercover appearance with hoodie and civilian clothing mixing with hero identity.",
    description_de: "Spider-Man (Miles Morales) in dunkelroter Kapuze mit dunkelblaugrauen Beinen (2024) zeigt den Brooklyn-Helden in lässiger Straßenkleidung über seinem Anzug, der sein verdecktes Erscheinungsbild mit Kapuzenpulli und Zivilkleidung vermischt mit Helden-Identität einfängt.",
    description_fr: "Spider-Man (Miles Morales) en capuche rouge foncé avec jambes gris bleu foncé (2024) présente le héros de Brooklyn dans des vêtements de rue décontractés par-dessus son costume, capturant son apparence sous couverture avec un sweat à capuche et des vêtements civils se mélangeant à l'identité de héros.",
    description_es: "Spider-Man (Miles Morales) en capucha roja oscura con piernas gris azulado oscuro (2024) presenta al héroe de Brooklyn en ropa de calle casual sobre su traje, capturando su apariencia encubierta con sudadera con capucha y ropa civil mezclándose con identidad de héroe."
  },
  {
    minifigure_no: 'sh0944',
    description_en: "War Machine in Pearl Dark Gray and Light Bluish Gray Armor (2024) from The Infinity Saga features James Rhodes in updated color scheme with enhanced metallic finish, capturing his heavily-armed combat suit with premium paint details.",
    description_de: "War Machine in perldunkelgrauer und hellblaugrauer Rüstung (2024) aus The Infinity Saga zeigt James Rhodes in aktualisiertem Farbschema mit verbessertem metallischem Finish, der seinen schwer bewaffneten Kampfanzug mit Premium-Farb-Details einfängt.",
    description_fr: "War Machine en armure gris foncé perlé et gris bleu clair (2024) de The Infinity Saga présente James Rhodes dans un schéma de couleurs mis à jour avec une finition métallique améliorée, capturant son costume de combat lourdement armé avec des détails de peinture premium.",
    description_es: "War Machine en armadura gris oscuro perla y gris azulado claro (2024) de The Infinity Saga presenta a James Rhodes en esquema de colores actualizado con acabado metálico mejorado, capturando su traje de combate fuertemente armado con detalles de pintura premium."
  },
  {
    minifigure_no: 'sh0945',
    description_en: "Electro with Small Electricity Wings (2024) from No Way Home features Jamie Foxx's electrified villain with compact wing accessories, capturing his MCU appearance with electrical powers and translucent lightning effects in smaller scale.",
    description_de: "Electro mit kleinen Elektrizitäts-Flügeln (2024) aus No Way Home zeigt Jamie Foxxs elektrifizierten Schurken mit kompakten Flügel-Zubehör, der sein MCU-Erscheinungsbild mit elektrischen Kräften und durchsichtigen Blitz-Effekten in kleinerem Maßstab einfängt.",
    description_fr: "Electro avec petites ailes d'électricité (2024) de No Way Home présente le méchant électrifié de Jamie Foxx avec des accessoires d'ailes compacts, capturant son apparence MCU avec des pouvoirs électriques et des effets d'éclair translucides à plus petite échelle.",
    description_es: "Electro con pequeñas alas de electricidad (2024) de No Way Home presenta al villano electrificado de Jamie Foxx con accesorios de alas compactos, capturando su apariencia MCU con poderes eléctricos y efectos de relámpago translúcidos a menor escala."
  },
  {
    minifigure_no: 'sh0946',
    description_en: "Dr. Octopus Half Venomized in Dark Green Suit (2024) features Otto Octavius corrupted by symbiote with black webbing on half his body and 4 mechanical arms, capturing a dark alternate version fusing Doc Ock with Venom powers.",
    description_de: "Dr. Octopus halb venomisiert im dunkelgrünen Anzug (2024) zeigt Otto Octavius, der von Symbiont korrumpiert ist, mit schwarzem Netz auf seiner halben Körperhälfte und 4 mechanischen Armen, der eine dunkle alternative Version einfängt, die Doc Ock mit Venom-Kräften verschmilzt.",
    description_fr: "Dr. Octopus à moitié venomisé en costume vert foncé (2024) présente Otto Octavius corrompu par le symbiote avec une toile noire sur la moitié de son corps et 4 bras mécaniques, capturant une version alternative sombre fusionnant Doc Ock avec les pouvoirs de Venom.",
    description_es: "Dr. Octopus medio venomizado en traje verde oscuro (2024) presenta a Otto Octavius corrompido por simbionte con telaraña negra en la mitad de su cuerpo y 4 brazos mecánicos, capturando una versión alternativa oscura fusionando a Doc Ock con poderes de Venom."
  },
  {
    minifigure_no: 'sh0947',
    description_en: "Dr. Octopus in Dark Green Suit with Hinged Mechanical Arms (2024) features Otto Octavius with articulated tentacle accessories using hinge pieces, capturing the classic villain with improved posability for dynamic displays and fighting poses.",
    description_de: "Dr. Octopus im dunkelgrünen Anzug mit angelenkten mechanischen Armen (2024) zeigt Otto Octavius mit artikulierten Tentakel-Zubehör mit Scharnier-Teilen, der den klassischen Schurken mit verbesserter Posierbarkeit für dynamische Displays und Kampfposen einfängt.",
    description_fr: "Dr. Octopus en costume vert foncé avec bras mécaniques articulés (2024) présente Otto Octavius avec des accessoires de tentacules articulés utilisant des pièces de charnière, capturant le méchant classique avec une posabilité améliorée pour des présentations dynamiques et des poses de combat.",
    description_es: "Dr. Octopus en traje verde oscuro con brazos mecánicos con bisagras (2024) presenta a Otto Octavius con accesorios de tentáculos articulados usando piezas de bisagra, capturando al villano clásico con posabilidad mejorada para exhibiciones dinámicas y poses de lucha."
  },
  {
    minifigure_no: 'sh0948',
    description_en: "Venom Green Goblin (2024) fuses Norman Osborn with alien symbiote creating a terrifying hybrid villain with goblin mask and black webbing texture, capturing a dark alternate universe version combining two of Spider-Man's deadliest foes.",
    description_de: "Venom Green Goblin (2024) verschmilzt Norman Osborn mit außerirdischem Symbiont, der einen erschreckenden Hybrid-Schurken mit Goblin-Maske und schwarzer Netz-Textur erschafft, der eine dunkle alternative Universum-Version einfängt, die zwei von Spider-Mans tödlichsten Feinden kombiniert.",
    description_fr: "Venom Green Goblin (2024) fusionne Norman Osborn avec le symbiote extraterrestre créant un méchant hybride terrifiant avec un masque goblin et une texture de toile noire, capturant une version d'univers alternatif sombre combinant deux des ennemis les plus mortels de Spider-Man.",
    description_es: "Venom Green Goblin (2024) fusiona a Norman Osborn con simbionte alienígena creando un villano híbrido aterrador con máscara de duende y textura de telaraña negra, capturando una versión de universo alternativo oscuro que combina dos de los enemigos más mortales de Spider-Man."
  },
  {
    minifigure_no: 'sh0949',
    description_en: "Ghost-Spider (Gwen Stacy) with Arms and Wings (2024) from Spidey and His Amazing Friends features the young hero with gold spider logo and wing attachments, perfect for flight-based adventures in preschool superhero team displays.",
    description_de: "Ghost-Spider (Gwen Stacy) mit Armen und Flügeln (2024) aus Spidey and His Amazing Friends zeigt die junge Heldin mit goldenem Spinnen-Logo und Flügel-Aufsätzen, perfekt für flugbasierte Abenteuer in Vorschul-Superhelden-Team-Displays.",
    description_fr: "Ghost-Spider (Gwen Stacy) avec bras et ailes (2024) de Spidey and His Amazing Friends présente la jeune héroïne avec un logo d'araignée doré et des accessoires d'ailes, parfait pour des aventures basées sur le vol dans les présentations d'équipe de super-héros préscolaires.",
    description_es: "Ghost-Spider (Gwen Stacy) con brazos y alas (2024) de Spidey and His Amazing Friends presenta a la joven heroína con logo de araña dorado y accesorios de alas, perfecto para aventuras basadas en vuelo en exhibiciones de equipo de superhéroes preescolares."
  },
  {
    minifigure_no: 'sh0950',
    description_en: "Spider-Man (Miles 'Spin' Morales) with Gold Spider Logo (2024) from Spidey and His Amazing Friends features the Brooklyn hero in his black suit with gold emblem variant, perfect for preschool superhero team adventures with simplified design.",
    description_de: "Spider-Man (Miles 'Spin' Morales) mit goldenem Spinnen-Logo (2024) aus Spidey and His Amazing Friends zeigt den Brooklyn-Helden in seinem schwarzen Anzug mit goldener Emblem-Variante, perfekt für Vorschul-Superhelden-Team-Abenteuer mit vereinfachtem Design.",
    description_fr: "Spider-Man (Miles 'Spin' Morales) avec logo d'araignée doré (2024) de Spidey and His Amazing Friends présente le héros de Brooklyn dans son costume noir avec variante d'emblème doré, parfait pour les aventures d'équipe de super-héros préscolaires avec un design simplifié.",
    description_es: "Spider-Man (Miles 'Spin' Morales) con logo de araña dorado (2024) de Spidey and His Amazing Friends presenta al héroe de Brooklyn en su traje negro con variante de emblema dorado, perfecto para aventuras de equipo de superhéroes preescolares con diseño simplificado."
  }
];

async function main() {
  console.log(`Starting batch update: sh0926-sh0950 (${descriptions.length} minifigures)`);

  for (const desc of descriptions) {
    try {
      await prisma.minifigCatalog.update({
        where: { minifigure_no: desc.minifigure_no },
        data: {
          description_en: desc.description_en,
          description_de: desc.description_de,
          description_fr: desc.description_fr,
          description_es: desc.description_es,
          description_generated_at: new Date(),
          description_status: 'completed'
        }
      });
      console.log(`✅ Updated ${desc.minifigure_no}`);
    } catch (error) {
      console.error(`❌ Failed to update ${desc.minifigure_no}:`, error);
    }
  }

  console.log(`\n✅ Batch complete: sh0926-sh0950`);
  await prisma.$disconnect();
}

main();
