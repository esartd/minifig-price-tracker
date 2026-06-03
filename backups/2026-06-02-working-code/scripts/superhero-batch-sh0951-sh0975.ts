import { PrismaClient as PrismaClientHostinger } from '@prisma/client';

const prisma = new PrismaClientHostinger({
  datasources: {
    db: {
      url: 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
    }
  }
});

const descriptions = [
  {
    minifigure_no: 'sh0951',
    description_en: "Electro from Marvel's Spidey and His Amazing Friends features a bright green torso and hair, yellow mask, and medium legs. This junior-sized villain brings electric energy to the Spidey team's adventures with his distinctive neon appearance.",
    description_de: "Electro aus Marvels Spidey und seine Super-Freunde hat einen hellgrünen Torso und Haare, eine gelbe Maske und mittellange Beine. Dieser Junior-Bösewicht bringt elektrische Energie in die Abenteuer des Spidey-Teams mit seinem markanten Neon-Aussehen.",
    description_fr: "Electro de Marvel's Spidey et ses amis extraordinaires présente un torse et des cheveux vert vif, un masque jaune et des jambes moyennes. Ce méchant junior apporte une énergie électrique aux aventures de l'équipe de Spidey avec son apparence néon distinctive.",
    description_es: "Electro de Marvel's Spidey y su superequipo presenta un torso y cabello verde brillante, máscara amarilla y piernas medianas. Este villano junior aporta energía eléctrica a las aventuras del equipo de Spidey con su distintiva apariencia de neón."
  },
  {
    minifigure_no: 'sh0952',
    description_en: "Iron Man from Spidey and His Amazing Friends wears a simplified armor design with yellow mask and leg armor. This junior-style Tony Stark helps the young heroes with his iconic suit adapted for the preschool series.",
    description_de: "Iron Man aus Spidey und seine Super-Freunde trägt ein vereinfachtes Rüstungsdesign mit gelber Maske und Beinpanzerung. Dieser Tony Stark im Junior-Stil hilft den jungen Helden mit seinem ikonischen Anzug, der für die Vorschulserie angepasst wurde.",
    description_fr: "Iron Man de Spidey et ses amis extraordinaires porte une armure simplifiée avec un masque jaune et une armure de jambes. Ce Tony Stark de style junior aide les jeunes héros avec sa combinaison emblématique adaptée pour la série préscolaire.",
    description_es: "Iron Man de Spidey y su superequipo lleva un diseño de armadura simplificado con máscara amarilla y armadura de piernas. Este Tony Stark estilo junior ayuda a los jóvenes héroes con su traje icónico adaptado para la serie preescolar."
  },
  {
    minifigure_no: 'sh0953',
    description_en: "Zola appears as a unique villain with his distinctive robotic appearance. This digital consciousness housed in a mechanical body brings a classic Captain America antagonist to LEGO form.",
    description_de: "Zola erscheint als einzigartiger Bösewicht mit seinem markanten Roboter-Aussehen. Dieses digitale Bewusstsein in einem mechanischen Körper bringt einen klassischen Captain America-Antagonisten in LEGO-Form.",
    description_fr: "Zola apparaît comme un méchant unique avec son apparence robotique distinctive. Cette conscience numérique logée dans un corps mécanique apporte un antagoniste classique de Captain America sous forme LEGO.",
    description_es: "Zola aparece como un villano único con su distintiva apariencia robótica. Esta conciencia digital alojada en un cuerpo mecánico trae a un antagonista clásico de Capitán América en forma LEGO."
  },
  {
    minifigure_no: 'sh0954',
    description_en: "Ghost-Spider (Gwen Stacy) from Spidey and His Amazing Friends features dark purple medium legs, white basic smooth hood, and gold spider logo with eyes. This junior version of Spider-Gwen joins the young hero team with her distinctive costume.",
    description_de: "Ghost-Spider (Gwen Stacy) aus Spidey und seine Super-Freunde hat dunkelviolette mittellange Beine, eine weiße glatte Kapuze und ein goldenes Spinnenlogo mit Augen. Diese Junior-Version von Spider-Gwen schließt sich dem jungen Heldenteam mit ihrem markanten Kostüm an.",
    description_fr: "Ghost-Spider (Gwen Stacy) de Spidey et ses amis extraordinaires présente des jambes moyennes violet foncé, une capuche lisse blanche basique et un logo d'araignée doré avec des yeux. Cette version junior de Spider-Gwen rejoint l'équipe de jeunes héros avec son costume distinctif.",
    description_es: "Ghost-Spider (Gwen Stacy) de Spidey y su superequipo presenta piernas medianas moradas oscuras, capucha lisa blanca básica y logo de araña dorado con ojos. Esta versión junior de Spider-Gwen se une al equipo de jóvenes héroes con su distintivo traje."
  },
  {
    minifigure_no: 'sh0955',
    description_en: "Spider-Man (Peter 'Spidey' Parker) from the preschool series wears medium legs with a gold spider logo. This junior-friendly version makes the web-slinger accessible to younger LEGO fans with simplified details.",
    description_de: "Spider-Man (Peter 'Spidey' Parker) aus der Vorschulserie trägt mittellange Beine mit goldenem Spinnenlogo. Diese kinderfreundliche Version macht den Netzschleuderer für jüngere LEGO-Fans mit vereinfachten Details zugänglich.",
    description_fr: "Spider-Man (Peter 'Spidey' Parker) de la série préscolaire porte des jambes moyennes avec un logo d'araignée doré. Cette version adaptée aux juniors rend le lanceur de toiles accessible aux jeunes fans de LEGO avec des détails simplifiés.",
    description_es: "Spider-Man (Peter 'Spidey' Parker) de la serie preescolar lleva piernas medianas con logo de araña dorado. Esta versión amigable para niños hace que el lanzador de redes sea accesible para los fanáticos jóvenes de LEGO con detalles simplificados."
  },
  {
    minifigure_no: 'sh0956',
    description_en: "Batman with jet pack features flames shooting from the propulsion system. This aerial version of the Dark Knight showcases his advanced technology and aerial combat capabilities.",
    description_de: "Batman mit Jetpack zeigt Flammen, die aus dem Antriebssystem schießen. Diese Luftversion des Dunklen Ritters zeigt seine fortschrittliche Technologie und Luftkampffähigkeiten.",
    description_fr: "Batman avec jet pack présente des flammes sortant du système de propulsion. Cette version aérienne du Dark Knight met en valeur sa technologie avancée et ses capacités de combat aérien.",
    description_es: "Batman con mochila propulsora presenta llamas que salen del sistema de propulsión. Esta versión aérea del Caballero Oscuro muestra su tecnología avanzada y capacidades de combate aéreo."
  },
  {
    minifigure_no: 'sh0957',
    description_en: "Green Goblin from Spidey and His Amazing Friends has lime skin, dark purple outfit, and medium legs. This junior-sized version of Norman Osborn's villainous alter ego brings the classic Spider-Man foe to younger audiences.",
    description_de: "Green Goblin aus Spidey und seine Super-Freunde hat limettenfarbene Haut, ein dunkelviolettes Outfit und mittellange Beine. Diese Junior-Version von Norman Osborns bösartigem Alter Ego bringt den klassischen Spider-Man-Feind zu jüngeren Zuschauern.",
    description_fr: "Le Bouffon Vert de Spidey et ses amis extraordinaires a une peau citron vert, une tenue violet foncé et des jambes moyennes. Cette version junior de l'alter ego méchant de Norman Osborn apporte l'ennemi classique de Spider-Man aux jeunes publics.",
    description_es: "Duende Verde de Spidey y su superequipo tiene piel verde lima, traje morado oscuro y piernas medianas. Esta versión junior del villano alter ego de Norman Osborn trae al clásico enemigo de Spider-Man a audiencias más jóvenes."
  },
  {
    minifigure_no: 'sh0958',
    description_en: "Batman in dark bluish gray suit with dark blue and black cape represents a classic interpretation of the Caped Crusader. This version emphasizes the stealth and detective aspects of Bruce Wayne's crime-fighting persona.",
    description_de: "Batman im dunkelblaugrauen Anzug mit dunkelblauem und schwarzem Umhang repräsentiert eine klassische Interpretation des Caped Crusader. Diese Version betont die Heimlichkeits- und Detektiv-Aspekte von Bruce Waynes Verbrechensbekämpfungs-Persona.",
    description_fr: "Batman en costume gris bleuté foncé avec cape bleu foncé et noire représente une interprétation classique du Croisé à la Cape. Cette version met l'accent sur les aspects furtifs et détectives du personnage de Bruce Wayne combattant le crime.",
    description_es: "Batman en traje gris azulado oscuro con capa azul oscuro y negra representa una interpretación clásica del Cruzado de la Capa. Esta versión enfatiza los aspectos sigilosos y detectivescos de la personalidad de Bruce Wayne contra el crimen."
  },
  {
    minifigure_no: 'sh0959',
    description_en: "Harley Quinn wears her classic jester's cap with black and red hands and rounded collar. This interpretation of the Joker's accomplice captures her iconic harlequin-inspired costume from Batman: The Animated Series.",
    description_de: "Harley Quinn trägt ihre klassische Narrenkappe mit schwarz-roten Händen und rundem Kragen. Diese Interpretation der Joker-Komplizin fängt ihr ikonisches, von Harlekin inspiriertes Kostüm aus Batman: The Animated Series ein.",
    description_fr: "Harley Quinn porte son bonnet de bouffon classique avec des mains noires et rouges et un col arrondi. Cette interprétation de la complice du Joker capture son costume emblématique inspiré d'Arlequin de Batman: The Animated Series.",
    description_es: "Harley Quinn lleva su clásico gorro de bufón con manos negras y rojas y cuello redondeado. Esta interpretación de la cómplice del Joker captura su icónico traje inspirado en arlequín de Batman: La serie animada."
  },
  {
    minifigure_no: 'sh0960',
    description_en: "The Joker appears in medium lavender suit with bright light orange vest and dark green hair. This color scheme represents the Clown Prince of Crime's theatrical and unpredictable nature as Batman's arch-nemesis.",
    description_de: "Der Joker erscheint in einem mittellila Anzug mit hellem orangefarbenem Weste und dunkelgrünen Haaren. Dieses Farbschema repräsentiert die theatralische und unvorhersehbare Natur des Clown-Prinzen des Verbrechens als Batmans Erzfeind.",
    description_fr: "Le Joker apparaît dans un costume lavande moyen avec un gilet orange vif et des cheveux vert foncé. Cette palette de couleurs représente la nature théâtrale et imprévisible du Prince Clown du Crime en tant qu'ennemi juré de Batman.",
    description_es: "El Joker aparece en traje lavanda medio con chaleco naranja claro brillante y cabello verde oscuro. Este esquema de color representa la naturaleza teatral e impredecible del Príncipe Payaso del Crimen como archienemigo de Batman."
  },
  {
    minifigure_no: 'sh0961',
    description_en: "Catwoman in light bluish gray suit showcases Selina Kyle's sleek and stealthy appearance. This feline-themed anti-hero walks the line between villain and ally in Gotham's criminal underworld.",
    description_de: "Catwoman im hellblaugrauen Anzug zeigt Selina Kyles elegantes und heimliches Aussehen. Diese katzenartige Anti-Heldin bewegt sich auf der Grenze zwischen Bösewicht und Verbündeter in Gothams krimineller Unterwelt.",
    description_fr: "Catwoman en costume gris bleuté clair met en valeur l'apparence élégante et furtive de Selina Kyle. Cette anti-héroïne à thème félin marche sur la ligne entre méchant et allié dans le monde criminel de Gotham.",
    description_es: "Catwoman en traje gris azulado claro muestra la apariencia elegante y sigilosa de Selina Kyle. Esta anti-heroína de temática felina camina en la línea entre villano y aliado en el submundo criminal de Gotham."
  },
  {
    minifigure_no: 'sh0962',
    description_en: "Batman with flexible rubber cape in dark bluish gray suit offers enhanced posability for action displays. The soft goods cape allows for dramatic swooping poses that capture the Dark Knight's theatrical presence.",
    description_de: "Batman mit flexiblem Gummi-Umhang im dunkelblaugrauen Anzug bietet verbesserte Posierbarkeit für Action-Displays. Der Stoffumhang ermöglicht dramatische Schwung-Posen, die die theatralische Präsenz des Dunklen Ritters einfangen.",
    description_fr: "Batman avec cape en caoutchouc flexible dans un costume gris bleuté foncé offre une posabilité améliorée pour les présentations d'action. La cape en tissu permet des poses dramatiques en vol plané qui capturent la présence théâtrale du Dark Knight.",
    description_es: "Batman con capa de goma flexible en traje gris azulado oscuro ofrece mejor capacidad de posado para exhibiciones de acción. La capa de tela suave permite poses dramáticas de planeo que capturan la presencia teatral del Caballero Oscuro."
  },
  {
    minifigure_no: 'sh0963',
    description_en: "Mr. Freeze in flat silver and black outfit represents Victor Fries' cryogenic suit necessary for his survival. This tragic villain uses cold-based weapons in his quest to save his dying wife Nora.",
    description_de: "Mr. Freeze im flachen silbernen und schwarzen Outfit repräsentiert Victor Fries' kryogenen Anzug, der für sein Überleben notwendig ist. Dieser tragische Bösewicht verwendet kältebasierte Waffen in seinem Bestreben, seine sterbende Frau Nora zu retten.",
    description_fr: "Mr. Freeze dans une tenue argentée et noire plate représente la combinaison cryogénique de Victor Fries nécessaire à sa survie. Ce méchant tragique utilise des armes à base de froid dans sa quête pour sauver sa femme mourante Nora.",
    description_es: "Mr. Freeze en traje plata y negro plano representa el traje criogénico de Victor Fries necesario para su supervivencia. Este villano trágico usa armas basadas en frío en su búsqueda para salvar a su esposa moribunda Nora."
  },
  {
    minifigure_no: 'sh0964',
    description_en: "Batman in black suit with yellow belt features cowl with white eyes and dual-sided head showing neutral and angry expressions with bared teeth. This version captures the Dark Knight's intimidating presence when confronting Gotham's criminals.",
    description_de: "Batman im schwarzen Anzug mit gelbem Gürtel hat eine Kapuze mit weißen Augen und doppelseitigem Kopf mit neutralen und wütenden Ausdrücken mit entblößten Zähnen. Diese Version fängt die einschüchternde Präsenz des Dunklen Ritters ein, wenn er Gothams Kriminelle konfrontiert.",
    description_fr: "Batman en costume noir avec ceinture jaune présente une cagoule avec des yeux blancs et une tête à double face montrant des expressions neutres et en colère avec des dents découvertes. Cette version capture la présence intimidante du Dark Knight lorsqu'il confronte les criminels de Gotham.",
    description_es: "Batman en traje negro con cinturón amarillo presenta capucha con ojos blancos y cabeza de doble cara mostrando expresiones neutrales y enojadas con dientes al descubierto. Esta versión captura la presencia intimidante del Caballero Oscuro al confrontar a los criminales de Gotham."
  },
  {
    minifigure_no: 'sh0965',
    description_en: "Batgirl in light bluish gray suit represents Barbara Gordon's crime-fighting alter ego. The Commissioner's daughter brings detective skills and acrobatic prowess to the Batman Family as a key ally.",
    description_de: "Batgirl im hellblaugrauen Anzug repräsentiert Barbara Gordons Verbrechensbekämpfungs-Alter Ego. Die Tochter des Commissioners bringt Detektiv-Fähigkeiten und akrobatische Kunstfertigkeit zur Batman-Familie als wichtige Verbündete.",
    description_fr: "Batgirl en costume gris bleuté clair représente l'alter ego de Barbara Gordon dans la lutte contre le crime. La fille du commissaire apporte des compétences de détective et des prouesses acrobatiques à la famille Batman en tant qu'alliée clé.",
    description_es: "Batgirl en traje gris azulado claro representa el alter ego de Barbara Gordon en la lucha contra el crimen. La hija del Comisionado aporta habilidades de detective y destreza acrobática a la Familia Batman como aliada clave."
  },
  {
    minifigure_no: 'sh0966',
    description_en: "Hulk Giant figure features sand blue pants with lavender panels and raging expression with open mouth. This oversized build represents Bruce Banner's unstoppable transformation during the Infinity Saga.",
    description_de: "Hulk-Riesenfigur hat sandblaue Hosen mit lavendelfarbenen Paneelen und wütendem Ausdruck mit offenem Mund. Dieser übergroße Build repräsentiert Bruce Banners unaufhaltsame Transformation während der Infinity Saga.",
    description_fr: "La figurine géante de Hulk présente un pantalon bleu sable avec des panneaux lavande et une expression enragée avec la bouche ouverte. Cette construction surdimensionnée représente la transformation imparable de Bruce Banner pendant la saga Infinity.",
    description_es: "La figura gigante de Hulk presenta pantalones azul arena con paneles lavanda y expresión furiosa con boca abierta. Esta construcción de gran tamaño representa la transformación imparable de Bruce Banner durante la Saga del Infinito."
  },
  {
    minifigure_no: 'sh0969',
    description_en: "Hawkeye wears black and dark red suit with dark tan hair, quiver, and silver boot tips. This master archer Clint Barton represents his appearance in the Infinity Saga with his signature precision weaponry.",
    description_de: "Hawkeye trägt einen schwarzen und dunkelroten Anzug mit dunkelbraunen Haaren, Köcher und silbernen Stiefeltips. Dieser Meisterbogenschütze Clint Barton repräsentiert sein Aussehen in der Infinity Saga mit seinen charakteristischen Präzisionswaffen.",
    description_fr: "Hawkeye porte un costume noir et rouge foncé avec des cheveux brun foncé, un carquois et des bouts de bottes argentés. Ce maître archer Clint Barton représente son apparition dans la saga Infinity avec ses armes de précision emblématiques.",
    description_es: "Hawkeye lleva traje negro y rojo oscuro con cabello castaño oscuro, carcaj y puntas de botas plateadas. Este maestro arquero Clint Barton representa su apariencia en la Saga del Infinito con su característico armamento de precisión."
  },
  {
    minifigure_no: 'sh0970',
    description_en: "Hydra Trooper represents the foot soldiers of the villainous organization from Captain America's universe. These faceless minions serve as the military force behind Hydra's schemes for world domination.",
    description_de: "Hydra-Truppe repräsentiert die Fußsoldaten der bösartigen Organisation aus Captain Americas Universum. Diese gesichtslosen Handlanger dienen als militärische Macht hinter Hydras Plänen zur Weltherrschaft.",
    description_fr: "Le soldat Hydra représente les fantassins de l'organisation méchante de l'univers de Captain America. Ces sbires sans visage servent de force militaire derrière les plans de domination mondiale d'Hydra.",
    description_es: "El soldado de Hydra representa a los soldados de a pie de la organización villana del universo de Capitán América. Estos secuaces sin rostro sirven como la fuerza militar detrás de los planes de Hydra para la dominación mundial."
  },
  {
    minifigure_no: 'sh0971',
    description_en: "Hydra Trooper with energy pack carries advanced weaponry on the back. This specialized soldier represents Hydra's technological capabilities and their use of advanced armaments against S.H.I.E.L.D. and the Avengers.",
    description_de: "Hydra-Truppe mit Energiepack trägt fortschrittliche Waffen auf dem Rücken. Dieser spezialisierte Soldat repräsentiert Hydras technologische Fähigkeiten und ihre Verwendung fortschrittlicher Waffen gegen S.H.I.E.L.D. und die Avengers.",
    description_fr: "Le soldat Hydra avec pack d'énergie porte une armurerie avancée sur le dos. Ce soldat spécialisé représente les capacités technologiques d'Hydra et leur utilisation d'armements avancés contre le S.H.I.E.L.D. et les Avengers.",
    description_es: "El soldado de Hydra con paquete de energía lleva armamento avanzado en la espalda. Este soldado especializado representa las capacidades tecnológicas de Hydra y su uso de armamento avanzado contra S.H.I.E.L.D. y los Vengadores."
  },
  {
    minifigure_no: 'sh0972',
    description_en: "Thor with flexible rubber cape wears black legs and sports tousled hair. This Asgardian Avenger from the Infinity Saga brings the power of Mjolnir and lightning to the fight against cosmic threats.",
    description_de: "Thor mit flexiblem Gummi-Umhang trägt schwarze Beine und zerzaustes Haar. Dieser asgardische Avenger aus der Infinity Saga bringt die Macht von Mjolnir und Blitzen in den Kampf gegen kosmische Bedrohungen.",
    description_fr: "Thor avec cape en caoutchouc flexible porte des jambes noires et arbore des cheveux ébouriffés. Cet Avenger asgardien de la saga Infinity apporte la puissance de Mjolnir et de la foudre dans la lutte contre les menaces cosmiques.",
    description_es: "Thor con capa de goma flexible lleva piernas negras y luce cabello despeinado. Este Vengador asgardiano de la Saga del Infinito trae el poder de Mjolnir y el rayo a la lucha contra amenazas cósmicas."
  },
  {
    minifigure_no: 'sh0973',
    description_en: "Captain America wears dark blue suit with reddish brown belt and harness, reddish brown hands, helmet, and neck bracket. This Steve Rogers version from the Infinity Saga showcases his tactical gear and leadership as the first Avenger.",
    description_de: "Captain America trägt einen dunkelblauen Anzug mit rotbraunem Gürtel und Geschirr, rotbraunen Händen, Helm und Halshalterung. Diese Steve Rogers-Version aus der Infinity Saga zeigt seine taktische Ausrüstung und Führung als erster Avenger.",
    description_fr: "Captain America porte un costume bleu foncé avec ceinture et harnais brun rougeâtre, mains brun rougeâtre, casque et support de cou. Cette version de Steve Rogers de la saga Infinity met en valeur son équipement tactique et son leadership en tant que premier Avenger.",
    description_es: "Capitán América lleva traje azul oscuro con cinturón y arnés marrón rojizo, manos marrones rojizas, casco y soporte de cuello. Esta versión de Steve Rogers de la Saga del Infinito muestra su equipo táctico y liderazgo como el primer Vengador."
  },
  {
    minifigure_no: 'sh0974',
    description_en: "Iron Man in Mark 43 armor features light nougat head showing Tony Stark beneath the suit. This Infinity Saga version represents one of Tony's most advanced armor configurations with enhanced combat capabilities.",
    description_de: "Iron Man in Mark 43-Rüstung hat einen hellbeigen Kopf, der Tony Stark unter dem Anzug zeigt. Diese Infinity Saga-Version repräsentiert eine von Tonys fortschrittlichsten Rüstungskonfigurationen mit verbesserten Kampffähigkeiten.",
    description_fr: "Iron Man dans l'armure Mark 43 présente une tête nougat clair montrant Tony Stark sous la combinaison. Cette version de la saga Infinity représente l'une des configurations d'armure les plus avancées de Tony avec des capacités de combat améliorées.",
    description_es: "Iron Man en armadura Mark 43 presenta cabeza color nougat claro mostrando a Tony Stark debajo del traje. Esta versión de la Saga del Infinito representa una de las configuraciones de armadura más avanzadas de Tony con capacidades de combate mejoradas."
  },
  {
    minifigure_no: 'sh0975',
    description_en: "Star-Lord from Guardians of the Galaxy Vol. 2 features dark red printed legs. Peter Quill's distinctive costume includes his signature leather jacket look as he leads the Guardians through cosmic adventures.",
    description_de: "Star-Lord aus Guardians of the Galaxy Vol. 2 hat dunkelrote bedruckte Beine. Peter Quills markantes Kostüm umfasst sein charakteristisches Lederjacken-Look, während er die Guardians durch kosmische Abenteuer führt.",
    description_fr: "Star-Lord de Les Gardiens de la Galaxie Vol. 2 présente des jambes imprimées rouge foncé. Le costume distinctif de Peter Quill inclut son look de veste en cuir emblématique alors qu'il mène les Gardiens à travers des aventures cosmiques.",
    description_es: "Star-Lord de Guardianes de la Galaxia Vol. 2 presenta piernas impresas rojo oscuro. El distintivo traje de Peter Quill incluye su característico look de chaqueta de cuero mientras lidera a los Guardianes a través de aventuras cósmicas."
  }
];

async function updateDescriptions() {
  console.log(`Starting batch update: sh0951-sh0975 (${descriptions.length} minifigures)`);

  for (const desc of descriptions) {
    try {
      await prisma.minifigCatalog.update({
        where: { minifigure_no: desc.minifigure_no },
        data: {
          description_en: desc.description_en,
          description_de: desc.description_de,
          description_fr: desc.description_fr,
          description_es: desc.description_es
        }
      });
      console.log(`✅ Updated ${desc.minifigure_no}`);
    } catch (error) {
      console.error(`❌ Error updating ${desc.minifigure_no}:`, error);
    }
  }

  console.log('\n✅ Batch update complete!');
  await prisma.$disconnect();
}

updateDescriptions();
