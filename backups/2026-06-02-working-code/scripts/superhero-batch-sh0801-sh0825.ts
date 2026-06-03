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
    minifigure_no: 'sh0801',
    description_en: "America Chavez (2022) from Doctor Strange in the Multiverse of Madness introduces the dimension-hopping hero in her star-emblazoned denim jacket, capturing Xochitl Gomez's character with portal-creating powers and multiverse traveling abilities.",
    description_de: "America Chavez (2022) aus Doctor Strange in the Multiverse of Madness führt die dimensionsreisende Heldin in ihrer stern-verzierten Jeansjacke ein, die Xochitl Gomez' Charakter mit portalschaffenden Kräften und Multiversum-Reisefähigkeiten einfängt.",
    description_fr: "America Chavez (2022) de Doctor Strange in the Multiverse of Madness présente l'héroïne sauteuse de dimensions dans sa veste en jean ornée d'étoiles, capturant le personnage de Xochitl Gomez avec des pouvoirs créateurs de portails et des capacités de voyage dans le multivers.",
    description_es: "America Chavez (2022) de Doctor Strange in the Multiverse of Madness presenta a la heroína saltadora de dimensiones en su chaqueta de mezclilla con estrellas, capturando el personaje de Xochitl Gomez con poderes creadores de portales y habilidades de viaje multiversal."
  },
  {
    minifigure_no: 'sh0802',
    description_en: "Doctor Strange with Brooch and Flexible Rubber Cape (2022) from Multiverse of Madness features the Sorcerer Supreme with enhanced mystical details including Eye of Agamotto brooch and realistic flowing cape for multiverse adventures.",
    description_de: "Doctor Strange mit Brosche und flexiblem Gummiumhang (2022) aus Multiverse of Madness zeigt den Sorcerer Supreme mit verbesserten mystischen Details einschließlich Auge von Agamotto-Brosche und realistisch fließendem Umhang für Multiversum-Abenteuer.",
    description_fr: "Doctor Strange avec broche et cape en caoutchouc flexible (2022) de Multiverse of Madness présente le Sorcier Suprême avec des détails mystiques améliorés incluant une broche Œil d'Agamotto et une cape fluide réaliste pour les aventures du multivers.",
    description_es: "Doctor Strange con broche y capa de goma flexible (2022) de Multiverse of Madness presenta al Hechicero Supremo con detalles místicos mejorados incluyendo broche del Ojo de Agamotto y capa fluida realista para aventuras multiversales."
  },
  {
    minifigure_no: 'sh0803',
    description_en: "Green Goblin with Medium Legs (2022) from Spidey and His Amazing Friends features the cackling villain in lime skin with dark purple outfit and dark blue stomach details, perfect for young fans' Spider-Team battles.",
    description_de: "Green Goblin mit mittleren Beinen (2022) aus Spidey and His Amazing Friends zeigt den kichernden Schurken mit lindgrüner Haut, dunkellila Outfit und dunkelblauen Bauchdetails, perfekt für Spider-Team-Kämpfe junger Fans.",
    description_fr: "Green Goblin avec jambes moyennes (2022) de Spidey and His Amazing Friends présente le méchant ricanant dans une peau lime avec une tenue violet foncé et des détails d'estomac bleu foncé, parfait pour les batailles Spider-Team des jeunes fans.",
    description_es: "Green Goblin con piernas medianas (2022) de Spidey and His Amazing Friends presenta al villano cacareante en piel lima con atuendo púrpura oscuro y detalles de estómago azul oscuro, perfecto para batallas del Spider-Team de fans jóvenes."
  },
  {
    minifigure_no: 'sh0804',
    description_en: "Thor with Spongy Cape and Black Legs (2022) from The Infinity Saga features the God of Thunder in his classic armor with tan tousled hair and realistic textured cape, perfect for Avengers assembly displays.",
    description_de: "Thor mit schwammigem Umhang und schwarzen Beinen (2022) aus The Infinity Saga zeigt den Donnergott in seiner klassischen Rüstung mit hellbraunem zerzaustem Haar und realistisch texturiertem Umhang, perfekt für Avengers-Versammlungs-Displays.",
    description_fr: "Thor avec cape spongieuse et jambes noires (2022) de The Infinity Saga présente le Dieu du Tonnerre dans son armure classique avec des cheveux châtain ébouriffés et une cape texturée réaliste, parfait pour les présentations d'assemblage des Avengers.",
    description_es: "Thor con capa esponjosa y piernas negras (2022) de The Infinity Saga presenta al Dios del Trueno en su armadura clásica con cabello castaño despeinado y capa texturizada realista, perfecto para exhibiciones de ensamblaje de Avengers."
  },
  {
    minifigure_no: 'sh0805',
    description_en: "Wolverine in Bright Light Orange and Black Mask (2022) brings the iconic X-Men mutant to LEGO with his classic costume featuring orange and black cowl design, blue hands, and adamantium claw accessories for authentic Marvel action.",
    description_de: "Wolverine in hellorangener und schwarzer Maske (2022) bringt den ikonischen X-Men-Mutanten zu LEGO mit seinem klassischen Kostüm mit orange-schwarzem Kapuzen-Design, blauen Händen und Adamantium-Krallen-Zubehör für authentische Marvel-Action.",
    description_fr: "Wolverine en masque orange vif et noir (2022) apporte le mutant X-Men iconique à LEGO avec son costume classique présentant un design de capuche orange et noir, des mains bleues et des accessoires de griffes d'adamantium pour une action Marvel authentique.",
    description_es: "Wolverine en máscara naranja brillante y negra (2022) trae al mutante icónico de X-Men a LEGO con su traje clásico con diseño de capucha naranja y negra, manos azules y accesorios de garras de adamantium para acción Marvel auténtica."
  },
  {
    minifigure_no: 'sh0806',
    description_en: "Iron Man in Pearl Gold Armor and Legs (2022) showcases Tony Stark in a luxurious all-gold variant with pearl metallic finish covering both armor and legs, representing his most opulent armor design with premium shine.",
    description_de: "Iron Man in perlgoldener Rüstung und Beinen (2022) zeigt Tony Stark in einer luxuriösen vollgoldenen Variante mit perlmetallischem Finish, das sowohl Rüstung als auch Beine bedeckt, die sein opulentestes Rüstungsdesign mit Premium-Glanz darstellt.",
    description_fr: "Iron Man en armure or perlé et jambes (2022) présente Tony Stark dans une variante tout en or luxueuse avec une finition métallique perlée couvrant à la fois l'armure et les jambes, représentant son design d'armure le plus opulent avec un éclat premium.",
    description_es: "Iron Man en armadura dorada perla y piernas (2022) muestra a Tony Stark en una variante totalmente dorada lujosa con acabado metálico perla que cubre tanto la armadura como las piernas, representando su diseño de armadura más opulento con brillo premium."
  },
  {
    minifigure_no: 'sh0807',
    description_en: "Black Panther in Dark Silver Armor (2022) depicts T'Challa in his vibranium-enhanced suit with dark silver details and white eyes, capturing Wakanda's protector with metallic sheen representing advanced technology and royal heritage.",
    description_de: "Black Panther in dunkelsilberner Rüstung (2022) zeigt T'Challa in seinem vibranium-verstärkten Anzug mit dunkelsilbernen Details und weißen Augen, der Wakandas Beschützer mit metallischem Glanz einfängt, der fortschrittliche Technologie und königliches Erbe darstellt.",
    description_fr: "Black Panther en armure argent foncé (2022) représente T'Challa dans son costume renforcé de vibranium avec des détails argent foncé et des yeux blancs, capturant le protecteur du Wakanda avec un éclat métallique représentant la technologie avancée et l'héritage royal.",
    description_es: "Black Panther en armadura plateada oscura (2022) representa a T'Challa en su traje mejorado con vibranium con detalles plateados oscuros y ojos blancos, capturando al protector de Wakanda con brillo metálico que representa tecnología avanzada y herencia real."
  },
  {
    minifigure_no: 'sh0808',
    description_en: "Miek with Mech Body (2022) upgrades the insectoid gladiator with mechanized exoskeleton armor, featuring enhanced build-able body construction for Sakaar arena battles and Thor: Ragnarok storylines with upgraded combat capabilities.",
    description_de: "Miek mit Mech-Körper (2022) rüstet den insektoiden Gladiator mit mechanisiertem Exoskelett-Rüstung auf, mit verbesserter aufbaubarer Körperkonstruktion für Sakaar-Arena-Kämpfe und Thor: Ragnarok-Storylines mit aufgerüsteten Kampffähigkeiten.",
    description_fr: "Miek avec corps mech (2022) améliore le gladiateur insectoïde avec une armure d'exosquelette mécanisé, présentant une construction de corps constructible améliorée pour les batailles d'arène de Sakaar et les scénarios Thor: Ragnarok avec des capacités de combat améliorées.",
    description_es: "Miek con cuerpo mech (2022) mejora al gladiador insectoide con armadura de exoesqueleto mecanizado, presentando construcción de cuerpo construible mejorada para batallas de arena de Sakaar e historias de Thor: Ragnarok con capacidades de combate mejoradas."
  },
  {
    minifigure_no: 'sh0809',
    description_en: "Batman with Brick Built Wings (2022) features the Dark Knight with constructible wing apparatus attachments, capturing his gliding capabilities through Gotham's skyline with mechanical flight technology and detective gadgetry.",
    description_de: "Batman mit gebauten Flügeln (2022) zeigt den Dark Knight mit konstruierbaren Flügelapparat-Aufsätzen, der seine Gleitfähigkeiten durch Gothams Skyline mit mechanischer Flugtechnologie und Detektiv-Ausrüstung einfängt.",
    description_fr: "Batman avec ailes construites en briques (2022) présente le Dark Knight avec des accessoires d'appareil d'ailes constructibles, capturant ses capacités de vol plané à travers l'horizon de Gotham avec une technologie de vol mécanique et des gadgets de détective.",
    description_es: "Batman con alas construidas con ladrillos (2022) presenta al Caballero Oscuro con accesorios de aparato de alas construibles, capturando sus capacidades de planeo por el horizonte de Gotham con tecnología de vuelo mecánico y gadgets detectivescos."
  },
  {
    minifigure_no: 'sh0810',
    description_en: "Korg with Shoulder Armor Pad (2022) upgrades the friendly Kronan warrior with additional protective gear including shoulder armor, perfect for enhanced gladiator displays and Thor: Ragnarok battle scenes with combat-ready appearance.",
    description_de: "Korg mit Schulterpanzer (2022) rüstet den freundlichen Kronan-Krieger mit zusätzlicher Schutzausrüstung einschließlich Schulterpanzer auf, perfekt für verbesserte Gladiatoren-Displays und Thor: Ragnarok-Kampfszenen mit kampfbereitem Erscheinungsbild.",
    description_fr: "Korg avec épaulière (2022) améliore le guerrier Kronan amical avec un équipement de protection supplémentaire incluant une armure d'épaule, parfait pour des présentations de gladiateurs améliorées et des scènes de bataille Thor: Ragnarok avec une apparence prête au combat.",
    description_es: "Korg con hombreras (2022) mejora al guerrero Kronan amigable con equipo protector adicional incluyendo armadura de hombro, perfecto para exhibiciones de gladiador mejoradas y escenas de batalla de Thor: Ragnarok con apariencia lista para combate."
  },
  {
    minifigure_no: 'sh0811',
    description_en: "Thor in Blue Suit (2022) from Love and Thunder features the God of Thunder in his distinctive blue and gold armored costume, representing his new look with vibrant blue coloring and detailed printing for cosmic adventures.",
    description_de: "Thor im blauen Anzug (2022) aus Love and Thunder zeigt den Donnergott in seinem markanten blau-goldenen gepanzerten Kostüm, das seinen neuen Look mit lebendiger blauer Färbung und detailliertem Druck für kosmische Abenteuer darstellt.",
    description_fr: "Thor en costume bleu (2022) de Love and Thunder présente le Dieu du Tonnerre dans son costume blindé bleu et or distinctif, représentant son nouveau look avec une coloration bleue vibrante et une impression détaillée pour les aventures cosmiques.",
    description_es: "Thor en traje azul (2022) de Love and Thunder presenta al Dios del Trueno en su distintivo traje blindado azul y dorado, representando su nuevo look con coloración azul vibrante e impresión detallada para aventuras cósmicas."
  },
  {
    minifigure_no: 'sh0812',
    description_en: "Gorr (2022) from Love and Thunder brings Christian Bale's God Butcher villain to life with pale skin and dark robes, capturing the menacing antagonist wielding the Necrosword with terrifying presence and cosmic threat.",
    description_de: "Gorr (2022) aus Love and Thunder erweckt Christian Bales Götterschlächter-Schurken mit blasser Haut und dunklen Roben zum Leben, der den bedrohlichen Antagonisten mit dem Necroschwert mit erschreckender Präsenz und kosmischer Bedrohung einfängt.",
    description_fr: "Gorr (2022) de Love and Thunder donne vie au méchant Boucher de Dieux de Christian Bale avec une peau pâle et des robes sombres, capturant l'antagoniste menaçant maniant la Nécroépée avec une présence terrifiante et une menace cosmique.",
    description_es: "Gorr (2022) de Love and Thunder da vida al villano Carnicero de Dioses de Christian Bale con piel pálida y túnicas oscuras, capturando al antagonista amenazante blandiendo la Necroespada con presencia aterradora y amenaza cósmica."
  },
  {
    minifigure_no: 'sh0814',
    description_en: "Korg with Neck Collar Fur (2022) from Love and Thunder shows the Kronan warrior in ceremonial attire with fur neck collar accessory, capturing his evolved appearance in New Asgard with enhanced costume details and friendly personality.",
    description_de: "Korg mit Halskragen-Fell (2022) aus Love and Thunder zeigt den Kronan-Krieger in zeremonieller Kleidung mit Fell-Halskragen-Zubehör, der sein weiterentwickeltes Erscheinungsbild in Neu-Asgard mit verbesserten Kostümdetails und freundlicher Persönlichkeit einfängt.",
    description_fr: "Korg avec col de fourrure (2022) de Love and Thunder montre le guerrier Kronan dans une tenue cérémonielle avec un accessoire de col de fourrure, capturant son apparence évoluée à Nouveau Asgard avec des détails de costume améliorés et une personnalité amicale.",
    description_es: "Korg con cuello de piel (2022) de Love and Thunder muestra al guerrero Kronan en atuendo ceremonial con accesorio de cuello de piel, capturando su apariencia evolucionada en Nueva Asgard con detalles de traje mejorados y personalidad amigable."
  },
  {
    minifigure_no: 'sh0815',
    description_en: "Mighty Thor (Jane Foster) (2022) from Love and Thunder features Natalie Portman's character wielding the reforged Mjolnir in her blue and silver armor, capturing her transformation into the Goddess of Thunder with heroic costume design.",
    description_de: "Mighty Thor (Jane Foster) (2022) aus Love and Thunder zeigt Natalie Portmans Charakter, der den neu geschmiedeten Mjolnir in ihrer blau-silbernen Rüstung schwingt, der ihre Verwandlung in die Donnergöttin mit heroischem Kostümdesign einfängt.",
    description_fr: "Mighty Thor (Jane Foster) (2022) de Love and Thunder présente le personnage de Natalie Portman maniant le Mjolnir reforgé dans son armure bleue et argentée, capturant sa transformation en Déesse du Tonnerre avec un design de costume héroïque.",
    description_es: "Mighty Thor (Jane Foster) (2022) de Love and Thunder presenta al personaje de Natalie Portman blandiendo el Mjolnir reforjado en su armadura azul y plateada, capturando su transformación en la Diosa del Trueno con diseño de traje heroico."
  },
  {
    minifigure_no: 'sh0816',
    description_en: "King Valkyrie (2022) from Love and Thunder depicts Tessa Thompson's character in her royal New Asgard attire with crown and ceremonial armor, capturing her evolution from warrior to leader with regal costume details and commanding presence.",
    description_de: "King Valkyrie (2022) aus Love and Thunder zeigt Tessa Thompsons Charakter in ihrer königlichen Neu-Asgard-Kleidung mit Krone und zeremonieller Rüstung, der ihre Entwicklung von Kriegerin zur Anführerin mit königlichen Kostümdetails und gebietender Präsenz einfängt.",
    description_fr: "King Valkyrie (2022) de Love and Thunder représente le personnage de Tessa Thompson dans sa tenue royale de Nouveau Asgard avec couronne et armure cérémonielle, capturant son évolution de guerrière à leader avec des détails de costume royal et une présence imposante.",
    description_es: "King Valkyrie (2022) de Love and Thunder representa al personaje de Tessa Thompson en su atuendo real de Nueva Asgard con corona y armadura ceremonial, capturando su evolución de guerrera a líder con detalles de traje regio y presencia imponente."
  },
  {
    minifigure_no: 'sh0818',
    description_en: "Captain America with Jet Pack (2022) upgrades Steve Rogers with aerial combat gear including helmet and jet pack accessories, featuring dark blue suit with reddish brown belt and red hands for enhanced Avengers action displays.",
    description_de: "Captain America mit Jetpack (2022) rüstet Steve Rogers mit Luftkampfausrüstung einschließlich Helm und Jetpack-Zubehör auf, mit dunkelblauem Anzug mit rotbraunem Gürtel und roten Händen für verbesserte Avengers-Action-Displays.",
    description_fr: "Captain America avec Jet Pack (2022) améliore Steve Rogers avec un équipement de combat aérien incluant un casque et des accessoires de jet pack, présentant un costume bleu foncé avec une ceinture brun rougeâtre et des mains rouges pour des présentations d'action Avengers améliorées.",
    description_es: "Captain America con Jet Pack (2022) mejora a Steve Rogers con equipo de combate aéreo incluyendo casco y accesorios de jet pack, presentando traje azul oscuro con cinturón marrón rojizo y manos rojas para exhibiciones de acción Avengers mejoradas."
  },
  {
    minifigure_no: 'sh0819',
    description_en: "War Machine in Pearl Dark Gray and Silver Armor with Backpack (2022) from The Infinity Saga features James Rhodes in heavily-armed configuration with metallic finish and weapon backpack attachment for maximum firepower displays.",
    description_de: "War Machine in perldunkelgrauer und silberner Rüstung mit Rucksack (2022) aus The Infinity Saga zeigt James Rhodes in schwer bewaffneter Konfiguration mit metallischem Finish und Waffen-Rucksack-Aufsatz für maximale Feuerkraft-Displays.",
    description_fr: "War Machine en armure gris foncé perlé et argent avec sac à dos (2022) de The Infinity Saga présente James Rhodes dans une configuration lourdement armée avec une finition métallique et un accessoire de sac à dos d'armes pour des présentations de puissance de feu maximale.",
    description_es: "War Machine en armadura gris oscuro perla y plateada con mochila (2022) de The Infinity Saga presenta a James Rhodes en configuración fuertemente armada con acabado metálico y accesorio de mochila de armas para exhibiciones de potencia de fuego máxima."
  },
  {
    minifigure_no: 'sh0820',
    description_en: "War Machine with Rifle and Stud Shooter (2022) arms James Rhodes with dual weapon accessories including rifle and stud shooter projectile launcher, perfect for heavily-armed Avengers combat scenarios and military action displays.",
    description_de: "War Machine mit Gewehr und Stud Shooter (2022) bewaffnet James Rhodes mit doppeltem Waffen-Zubehör einschließlich Gewehr und Stud Shooter Projektilwerfer, perfekt für schwer bewaffnete Avengers-Kampfszenarien und militärische Action-Displays.",
    description_fr: "War Machine avec fusil et Stud Shooter (2022) arme James Rhodes avec des accessoires d'armes doubles incluant un fusil et un lanceur de projectiles Stud Shooter, parfait pour des scénarios de combat Avengers lourdement armés et des présentations d'action militaire.",
    description_es: "War Machine con rifle y Stud Shooter (2022) arma a James Rhodes con accesorios de armas duales incluyendo rifle y lanzador de proyectiles Stud Shooter, perfecto para escenarios de combate Avengers fuertemente armados y exhibiciones de acción militar."
  },
  {
    minifigure_no: 'sh0821',
    description_en: "Whiplash (2022) from The Infinity Saga brings Ivan Vanko to life with his signature electrified whip weapons, capturing Mickey Rourke's Iron Man 2 antagonist with detailed prison tattoo printing and menacing weaponized appearance.",
    description_de: "Whiplash (2022) aus The Infinity Saga erweckt Ivan Vanko mit seinen charakteristischen elektrifizierten Peitschenwaffen zum Leben, der Mickey Rourkes Iron Man 2-Antagonisten mit detailliertem Gefängnis-Tattoo-Druck und bedrohlichem bewaffnetem Erscheinungsbild einfängt.",
    description_fr: "Whiplash (2022) de The Infinity Saga donne vie à Ivan Vanko avec ses armes de fouet électrifiées signature, capturant l'antagoniste Iron Man 2 de Mickey Rourke avec une impression de tatouage de prison détaillée et une apparence armée menaçante.",
    description_es: "Whiplash (2022) de The Infinity Saga da vida a Ivan Vanko con sus armas de látigo electrificado características, capturando al antagonista de Iron Man 2 de Mickey Rourke con impresión detallada de tatuajes de prisión y apariencia armada amenazante."
  },
  {
    minifigure_no: 'sh0822',
    description_en: "Robin with Neck Bracket (2022) features Batman's sidekick with neck bracket accessory for enhanced cape attachment, showcasing Dick Grayson in his classic red, green and yellow costume with utility belt and dynamic crime-fighting appearance.",
    description_de: "Robin mit Halsklammer (2022) zeigt Batmans Sidekick mit Halsklammer-Zubehör für verbesserte Umhang-Befestigung, der Dick Grayson in seinem klassischen rot-grün-gelben Kostüm mit Utility-Gürtel und dynamischem Verbrechensbekämpfungs-Erscheinungsbild zeigt.",
    description_fr: "Robin avec support de cou (2022) présente le sidekick de Batman avec un accessoire de support de cou pour une fixation de cape améliorée, montrant Dick Grayson dans son costume classique rouge, vert et jaune avec une ceinture utilitaire et une apparence dynamique de lutte contre le crime.",
    description_es: "Robin con soporte de cuello (2022) presenta al compañero de Batman con accesorio de soporte de cuello para sujeción de capa mejorada, mostrando a Dick Grayson en su traje clásico rojo, verde y amarillo con cinturón de utilidad y apariencia dinámica de lucha contra el crimen."
  },
  {
    minifigure_no: 'sh0823',
    description_en: "Iron Man in Mark 25 Armor (2022) from The Infinity Saga showcases Tony Stark's specialized stealth suit variant with unique color scheme and design features, representing one of his many Iron Legion armors from Iron Man 3.",
    description_de: "Iron Man in Mark 25 Rüstung (2022) aus The Infinity Saga zeigt Tony Starks spezialisierte Stealth-Anzug-Variante mit einzigartigem Farbschema und Designmerkmalen, die eine seiner vielen Iron Legion-Rüstungen aus Iron Man 3 darstellt.",
    description_fr: "Iron Man en armure Mark 25 (2022) de The Infinity Saga présente la variante de costume furtif spécialisé de Tony Stark avec un schéma de couleurs et des caractéristiques de design uniques, représentant l'une de ses nombreuses armures Iron Legion d'Iron Man 3.",
    description_es: "Iron Man en armadura Mark 25 (2022) de The Infinity Saga muestra la variante de traje sigiloso especializado de Tony Stark con esquema de colores único y características de diseño, representando una de sus muchas armaduras de Legión de Hierro de Iron Man 3."
  },
  {
    minifigure_no: 'sh0824',
    description_en: "Iron Man in Mark 85 Armor with Large Helmet Visor and Wings (2022) from The Infinity Saga features Tony Stark's final suit from Endgame with enhanced visor design and wing attachments for ultimate battle displays against Thanos.",
    description_de: "Iron Man in Mark 85 Rüstung mit großem Helm-Visier und Flügeln (2022) aus The Infinity Saga zeigt Tony Starks finalen Anzug aus Endgame mit verbessertem Visier-Design und Flügelaufsätzen für ultimative Kampf-Displays gegen Thanos.",
    description_fr: "Iron Man en armure Mark 85 avec grande visière de casque et ailes (2022) de The Infinity Saga présente le costume final de Tony Stark d'Endgame avec un design de visière amélioré et des accessoires d'ailes pour des présentations de bataille ultimes contre Thanos.",
    description_es: "Iron Man en armadura Mark 85 con visera de casco grande y alas (2022) de The Infinity Saga presenta el traje final de Tony Stark de Endgame con diseño de visera mejorado y accesorios de alas para exhibiciones de batalla definitivas contra Thanos."
  },
  {
    minifigure_no: 'sh0825',
    description_en: "Iron Man in Mark 3 Armor with Helmet (2022) from The Infinity Saga recreates Tony Stark's classic red and gold suit from the first Iron Man film, featuring the iconic circular arc reactor and complete helmet for authentic MCU origin displays.",
    description_de: "Iron Man in Mark 3 Rüstung mit Helm (2022) aus The Infinity Saga erschafft Tony Starks klassischen rot-goldenen Anzug aus dem ersten Iron Man-Film neu, mit dem ikonischen kreisförmigen Arc-Reaktor und vollständigem Helm für authentische MCU-Ursprungs-Displays.",
    description_fr: "Iron Man en armure Mark 3 avec casque (2022) de The Infinity Saga recrée le costume rouge et or classique de Tony Stark du premier film Iron Man, présentant le réacteur à arc circulaire iconique et un casque complet pour des présentations d'origine MCU authentiques.",
    description_es: "Iron Man en armadura Mark 3 con casco (2022) de The Infinity Saga recrea el traje rojo y dorado clásico de Tony Stark de la primera película de Iron Man, presentando el icónico reactor de arco circular y casco completo para exhibiciones de origen MCU auténticas."
  }
];

async function main() {
  console.log(`Starting batch update: sh0801-sh0825 (${descriptions.length} minifigures)`);

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

  console.log(`\n✅ Batch complete: sh0801-sh0825`);
  await prisma.$disconnect();
}

main();
