import { PrismaClient as PrismaClientHostinger } from '@prisma/client-hostinger';

const prisma = new PrismaClientHostinger({
  datasources: {
    db: {
      url: 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
    }
  }
});

const descriptions = [
  {
    minifigure_no: 'sh1001',
    description_en: "Red Hulk Giant figure with black eyes represents Thunderbolt Ross transformed by gamma radiation. This military general turned gamma monster brings brute strength rivaling the green Hulk with tactical military thinking.",
    description_de: "Red Hulk-Riesenfigur mit schwarzen Augen repräsentiert Thunderbolt Ross, verwandelt durch Gammastrahlung. Dieser Militärgeneralturned Gamma-Monster bringt brutale Stärke, die dem grünen Hulk mit taktischem Militärdenken ebenbürtig ist.",
    description_fr: "La figurine géante de Hulk Rouge avec des yeux noirs représente Thunderbolt Ross transformé par les radiations gamma. Ce général militaire devenu monstre gamma apporte une force brute rivalisant avec le Hulk vert avec une pensée militaire tactique.",
    description_es: "La figura gigante de Hulk Rojo con ojos negros representa a Thunderbolt Ross transformado por radiación gamma. Este general militar convertido en monstruo gamma aporta fuerza bruta que rivaliza con el Hulk verde con pensamiento militar táctico."
  },
  {
    minifigure_no: 'sh1002',
    description_en: "Ruth Bat-Seraph represents the Israeli super-heroine and member of international superhero teams. This Mossad agent brings her combat training and connection to the global superhero community.",
    description_de: "Ruth Bat-Seraph repräsentiert die israelische Superheldin und Mitglied internationaler Superhelden-Teams. Diese Mossad-Agentin bringt ihre Kampfausbildung und Verbindung zur globalen Superhelden-Gemeinschaft.",
    description_fr: "Ruth Bat-Seraph représente la super-héroïne israélienne et membre d'équipes de super-héros internationales. Cette agente du Mossad apporte sa formation au combat et sa connexion à la communauté mondiale des super-héros.",
    description_es: "Ruth Bat-Seraph representa a la superheroína israelí y miembro de equipos de superhéroes internacionales. Esta agente del Mossad aporta su entrenamiento de combate y conexión con la comunidad global de superhéroes."
  },
  {
    minifigure_no: 'sh1003',
    description_en: "Captain America (Sam Wilson) in dark blue suit with red boots features backpack and wings without stickers. This version shows Sam's aerial combat capabilities as he carries on Steve Rogers' legacy.",
    description_de: "Captain America (Sam Wilson) im dunkelblauen Anzug mit roten Stiefeln hat Rucksack und Flügel ohne Aufkleber. Diese Version zeigt Sams Luftkampf-Fähigkeiten, während er Steve Rogers' Vermächtnis weiterträgt.",
    description_fr: "Captain America (Sam Wilson) en costume bleu foncé avec des bottes rouges présente un sac à dos et des ailes sans autocollants. Cette version montre les capacités de combat aérien de Sam alors qu'il perpétue l'héritage de Steve Rogers.",
    description_es: "Capitán América (Sam Wilson) en traje azul oscuro con botas rojas presenta mochila y alas sin calcomanías. Esta versión muestra las capacidades de combate aéreo de Sam mientras continúa el legado de Steve Rogers."
  },
  {
    minifigure_no: 'sh1003s',
    description_en: "Captain America (Sam Wilson) with stickered wings provides detailed graphics on the flight equipment. This decorated version enhances the visual impact of Sam's high-tech Falcon wings combined with the Captain America mantle.",
    description_de: "Captain America (Sam Wilson) mit Aufkleber-Flügeln bietet detaillierte Grafiken auf der Flugausrüstung. Diese dekorierte Version verstärkt die visuelle Wirkung von Sams High-Tech-Falcon-Flügeln kombiniert mit dem Captain America-Mantel.",
    description_fr: "Captain America (Sam Wilson) avec des ailes autocollantes fournit des graphiques détaillés sur l'équipement de vol. Cette version décorée améliore l'impact visuel des ailes Faucon high-tech de Sam combinées avec le manteau de Captain America.",
    description_es: "Capitán América (Sam Wilson) con alas con calcomanías proporciona gráficos detallados en el equipo de vuelo. Esta versión decorada mejora el impacto visual de las alas Halcón de alta tecnología de Sam combinadas con el manto de Capitán América."
  },
  {
    minifigure_no: 'sh1004',
    description_en: "Mr. Freeze in sand blue outfit represents Victor Fries' cryogenic suit in a lighter color scheme. This version of the tragic villain maintains his freeze gun technology while protecting his own sub-zero body temperature.",
    description_de: "Mr. Freeze im sandblauen Outfit repräsentiert Victor Fries' kryogenen Anzug in einem helleren Farbschema. Diese Version des tragischen Bösewichts behält seine Gefrierwaffen-Technologie bei, während sie seine eigene Körpertemperatur unter null schützt.",
    description_fr: "Mr. Freeze en tenue bleu sable représente la combinaison cryogénique de Victor Fries dans un schéma de couleurs plus clair. Cette version du méchant tragique maintient sa technologie de pistolet gel tout en protégeant sa propre température corporelle sous zéro.",
    description_es: "Mr. Freeze en traje azul arena representa el traje criogénico de Victor Fries en un esquema de color más claro. Esta versión del villano trágico mantiene su tecnología de pistola congeladora mientras protege su propia temperatura corporal bajo cero."
  },
  {
    minifigure_no: 'sh1005',
    description_en: "Batman in black suit with yellow belt features medium nougat details and cowl with white eyes. This version emphasizes the Dark Knight's detective work and stealth operations in Gotham City.",
    description_de: "Batman im schwarzen Anzug mit gelbem Gürtel hat mittelbeige Details und Kapuze mit weißen Augen. Diese Version betont die Detektivarbeit und Heimlichkeitsoperationen des Dunklen Ritters in Gotham City.",
    description_fr: "Batman en costume noir avec ceinture jaune présente des détails nougat moyen et une cagoule avec des yeux blancs. Cette version met l'accent sur le travail de détective du Dark Knight et les opérations furtives à Gotham City.",
    description_es: "Batman en traje negro con cinturón amarillo presenta detalles color nougat medio y capucha con ojos blancos. Esta versión enfatiza el trabajo de detective del Caballero Oscuro y las operaciones sigilosas en Ciudad Gótica."
  },
  {
    minifigure_no: 'sh1006',
    description_en: "Superman in blue suit with spongy cape features tousled hair and dual-sided head showing closed mouth and red eyes. The Man of Steel displays both his heroic composure and heat vision powers.",
    description_de: "Superman im blauen Anzug mit schwammigem Umhang hat zerzaustes Haar und doppelseitigen Kopf mit geschlossenem Mund und roten Augen. Der Mann aus Stahl zeigt sowohl seine heroische Gelassenheit als auch seine Hitzeblick-Kräfte.",
    description_fr: "Superman en costume bleu avec cape spongieuse présente des cheveux ébouriffés et une tête à double face montrant une bouche fermée et des yeux rouges. L'Homme d'Acier affiche à la fois son sang-froid héroïque et ses pouvoirs de vision thermique.",
    description_es: "Superman en traje azul con capa esponjosa presenta cabello despeinado y cabeza de doble cara mostrando boca cerrada y ojos rojos. El Hombre de Acero muestra tanto su compostura heroica como sus poderes de visión de calor."
  },
  {
    minifigure_no: 'sh1007',
    description_en: "Lex Luthor in bright green armor with shoulder pads showcases his power suit design. Superman's arch-nemesis combines genius intellect with advanced technology in his ongoing schemes against the Man of Steel.",
    description_de: "Lex Luthor in hellgrüner Rüstung mit Schulterpolstern zeigt sein Power-Suit-Design. Supermans Erzfeind kombiniert genialen Intellekt mit fortschrittlicher Technologie in seinen andauernden Plänen gegen den Mann aus Stahl.",
    description_fr: "Lex Luthor en armure vert vif avec épaulettes présente son design de combinaison de puissance. L'ennemi juré de Superman combine un intellect de génie avec une technologie avancée dans ses stratagèmes continus contre l'Homme d'Acier.",
    description_es: "Lex Luthor en armadura verde brillante con hombreras muestra su diseño de traje de poder. El archienemigo de Superman combina intelecto genial con tecnología avanzada en sus continuos planes contra el Hombre de Acero."
  },
  {
    minifigure_no: 'sh1008',
    description_en: "Iron Man in dark red and gold armor with round arc reactor features pearl gold arms and helmet with visor. This Mark configuration showcases Tony Stark's refined armor technology with enhanced power systems.",
    description_de: "Iron Man in dunkelroter und goldener Rüstung mit rundem Arc-Reaktor hat perlgoldene Arme und Helm mit Visier. Diese Mark-Konfiguration zeigt Tony Starks verfeinerte Rüstungstechnologie mit verbesserten Energiesystemen.",
    description_fr: "Iron Man dans une armure rouge foncé et or avec un réacteur arc rond présente des bras or perlé et un casque avec visière. Cette configuration Mark présente la technologie d'armure raffinée de Tony Stark avec des systèmes d'alimentation améliorés.",
    description_es: "Iron Man en armadura rojo oscuro y oro con reactor arc redondo presenta brazos dorado perlado y casco con visera. Esta configuración Mark muestra la tecnología de armadura refinada de Tony Stark con sistemas de energía mejorados."
  },
  {
    minifigure_no: 'sh1009',
    description_en: "Ultron represents the artificial intelligence villain created by Tony Stark. This sentient robot seeks to eliminate humanity, viewing the Avengers' extinction as the key to achieving peace on Earth.",
    description_de: "Ultron repräsentiert den von Tony Stark erschaffenen künstlichen Intelligenz-Bösewicht. Dieser fühlende Roboter versucht die Menschheit auszulöschen und sieht die Ausrottung der Avengers als Schlüssel zur Erlangung des Friedens auf der Erde.",
    description_fr: "Ultron représente le méchant d'intelligence artificielle créé par Tony Stark. Ce robot sensible cherche à éliminer l'humanité, considérant l'extinction des Avengers comme la clé pour atteindre la paix sur Terre.",
    description_es: "Ultron representa al villano de inteligencia artificial creado por Tony Stark. Este robot sensible busca eliminar a la humanidad, viendo la extinción de los Vengadores como la clave para lograr la paz en la Tierra."
  },
  {
    minifigure_no: 'sh1010',
    description_en: "Anti-Venom represents Eddie Brock bonded with the cure for the Venom symbiote. This white symbiote uses its healing powers for heroic purposes, inverting the traditional Venom threat.",
    description_de: "Anti-Venom repräsentiert Eddie Brock, verbunden mit dem Heilmittel für den Venom-Symbioten. Dieser weiße Symbiont nutzt seine Heilkräfte für heroische Zwecke und kehrt die traditionelle Venom-Bedrohung um.",
    description_fr: "Anti-Venom représente Eddie Brock lié avec le remède pour le symbiote Venom. Ce symbiote blanc utilise ses pouvoirs de guérison à des fins héroïques, inversant la menace Venom traditionnelle.",
    description_es: "Anti-Venom representa a Eddie Brock unido con la cura para el simbionte Venom. Este simbionte blanco usa sus poderes curativos para propósitos heroicos, invirtiendo la amenaza tradicional de Venom."
  },
  {
    minifigure_no: 'sh1011',
    description_en: "Captain America in dark blue suit with strap showcases Steve Rogers' tactical uniform. The First Avenger's practical combat gear reflects his military background and leadership role.",
    description_de: "Captain America im dunkelblauen Anzug mit Riemen zeigt Steve Rogers' taktische Uniform. Die praktische Kampfausrüstung des First Avenger spiegelt seinen militärischen Hintergrund und seine Führungsrolle wider.",
    description_fr: "Captain America en costume bleu foncé avec sangle présente l'uniforme tactique de Steve Rogers. L'équipement de combat pratique du First Avenger reflète son passé militaire et son rôle de leadership.",
    description_es: "Capitán América en traje azul oscuro con correa muestra el uniforme táctico de Steve Rogers. El equipo de combate práctico del Primer Vengador refleja su trasfondo militar y papel de liderazgo."
  },
  {
    minifigure_no: 'sh1012',
    description_en: "Black Widow in black jumpsuit features dark orange mid-length hair, printed legs, black hands, and dark brown eyebrows. Natasha Romanoff's spy uniform reflects her expertise in espionage and hand-to-hand combat.",
    description_de: "Black Widow im schwarzen Overall hat dunkelorange mittellanges Haar, bedruckte Beine, schwarze Hände und dunkelbraune Augenbrauen. Natasha Romanoffs Spion-Uniform spiegelt ihre Expertise in Spionage und Nahkampf wider.",
    description_fr: "Black Widow en combinaison noire présente des cheveux mi-longs orange foncé, des jambes imprimées, des mains noires et des sourcils brun foncé. L'uniforme d'espionne de Natasha Romanoff reflète son expertise en espionnage et combat au corps à corps.",
    description_es: "Viuda Negra en traje negro presenta cabello mediano naranja oscuro, piernas impresas, manos negras y cejas marrón oscuro. El uniforme de espía de Natasha Romanoff refleja su experiencia en espionaje y combate cuerpo a cuerpo."
  },
  {
    minifigure_no: 'sh1013',
    description_en: "Hulk minifigure in dark bluish gray legs represents Bruce Banner's transformation with unique leg coloring. This version captures the gamma-powered hero's incredible strength in standard minifigure scale.",
    description_de: "Hulk-Minifigur in dunkelblaugrauen Beinen repräsentiert Bruce Banners Transformation mit einzigartiger Beinfärbung. Diese Version fängt die unglaubliche Stärke des Gamma-angetriebenen Helden im Standard-Minifigur-Maßstab ein.",
    description_fr: "La minifigurine de Hulk en jambes gris bleuté foncé représente la transformation de Bruce Banner avec une coloration de jambes unique. Cette version capture la force incroyable du héros propulsé par les rayons gamma à l'échelle de minifigurine standard.",
    description_es: "La minifigura de Hulk en piernas gris azulado oscuro representa la transformación de Bruce Banner con coloración de piernas única. Esta versión captura la increíble fuerza del héroe impulsado por gamma en escala de minifigura estándar."
  },
  {
    minifigure_no: 'sh1014',
    description_en: "Thor with spongy cape featuring single hole wears black legs and dark tan tousled hair. The God of Thunder's outfit combines Asgardian royal elements with practical warrior attire.",
    description_de: "Thor mit schwammigem Umhang mit einem Loch trägt schwarze Beine und dunkelbraunes zerzaustes Haar. Das Outfit des Donnergottes kombiniert asgardische königliche Elemente mit praktischer Kriegerkleidung.",
    description_fr: "Thor avec cape spongieuse à un seul trou porte des jambes noires et des cheveux ébouriffés brun foncé. La tenue du Dieu du Tonnerre combine des éléments royaux asgardiens avec une tenue de guerrier pratique.",
    description_es: "Thor con capa esponjosa con un solo agujero lleva piernas negras y cabello despeinado castaño oscuro. El atuendo del Dios del Trueno combina elementos reales asgardianos con vestimenta práctica de guerrero."
  },
  {
    minifigure_no: 'sh1015',
    description_en: "Iron Man Mark 6 armor with large helmet visor and light nougat head represents Tony Stark's iconic design. This armor iteration features the triangular arc reactor and advanced combat capabilities from the first Avengers era.",
    description_de: "Iron Man Mark 6-Rüstung mit großem Helmvisier und hellbeigem Kopf repräsentiert Tony Starks ikonisches Design. Diese Rüstungs-Iteration hat den dreieckigen Arc-Reaktor und fortschrittliche Kampffähigkeiten aus der ersten Avengers-Ära.",
    description_fr: "L'armure Iron Man Mark 6 avec une grande visière de casque et une tête nougat clair représente le design emblématique de Tony Stark. Cette itération d'armure présente le réacteur arc triangulaire et des capacités de combat avancées de l'ère des premiers Avengers.",
    description_es: "La armadura Iron Man Mark 6 con visera grande de casco y cabeza color nougat claro representa el diseño icónico de Tony Stark. Esta iteración de armadura presenta el reactor arc triangular y capacidades de combate avanzadas de la era de los primeros Vengadores."
  },
  {
    minifigure_no: 'sh1016',
    description_en: "Winter Soldier with black hair represents Bucky Barnes as HYDRA's brainwashed assassin. This tragic figure combines Steve Rogers' best friend with a deadly Soviet operative controlled through decades of programming.",
    description_de: "Winter Soldier mit schwarzen Haaren repräsentiert Bucky Barnes als HYDRAs gehirngewaschenen Attentäter. Diese tragische Figur kombiniert Steve Rogers' besten Freund mit einem tödlichen sowjetischen Agenten, der durch jahrzehntelange Programmierung kontrolliert wird.",
    description_fr: "Le Soldat de l'Hiver avec des cheveux noirs représente Bucky Barnes en tant qu'assassin lavé du cerveau d'HYDRA. Cette figure tragique combine le meilleur ami de Steve Rogers avec un opératif soviétique mortel contrôlé par des décennies de programmation.",
    description_es: "El Soldado de Invierno con cabello negro representa a Bucky Barnes como asesino con lavado de cerebro de HYDRA. Esta figura trágica combina al mejor amigo de Steve Rogers con un operativo soviético mortal controlado a través de décadas de programación."
  },
  {
    minifigure_no: 'sh1017',
    description_en: "Iron Man Mark 46 armor with large helmet visor represents Tony's advanced suit from Civil War. This configuration features enhanced mobility and weapons systems during the Avengers' internal conflict.",
    description_de: "Iron Man Mark 46-Rüstung mit großem Helmvisier repräsentiert Tonys fortschrittlichen Anzug aus Civil War. Diese Konfiguration hat verbesserte Mobilität und Waffensysteme während des internen Konflikts der Avengers.",
    description_fr: "L'armure Iron Man Mark 46 avec une grande visière de casque représente la combinaison avancée de Tony de Civil War. Cette configuration présente une mobilité améliorée et des systèmes d'armes pendant le conflit interne des Avengers.",
    description_es: "La armadura Iron Man Mark 46 con visera grande de casco representa el traje avanzado de Tony de Guerra Civil. Esta configuración presenta movilidad mejorada y sistemas de armas durante el conflicto interno de los Vengadores."
  },
  {
    minifigure_no: 'sh1018',
    description_en: "The Scarlet Witch (Wanda Maximoff) with plain legs and medium nougat hair showcases her reality-warping powers. This powerful Avenger manipulates chaos magic with devastating effect.",
    description_de: "Die Scarlet Witch (Wanda Maximoff) mit einfachen Beinen und mittelbeigem Haar zeigt ihre realitätsverzerrenden Kräfte. Dieser mächtige Avenger manipuliert Chaosmagie mit verheerender Wirkung.",
    description_fr: "La Sorcière Rouge (Wanda Maximoff) avec des jambes simples et des cheveux nougat moyen présente ses pouvoirs de déformation de la réalité. Cette puissante Avenger manipule la magie du chaos avec un effet dévastateur.",
    description_es: "La Bruja Escarlata (Wanda Maximoff) con piernas simples y cabello color nougat medio muestra sus poderes de distorsión de realidad. Esta poderosa Vengadora manipula magia caótica con efecto devastador."
  },
  {
    minifigure_no: 'sh1019',
    description_en: "Black Panther in dark bluish gray armor represents T'Challa as King of Wakanda. The vibranium suit combines advanced technology with the ceremonial mantle of the Panther God protector.",
    description_de: "Black Panther in dunkelblaugrauer Rüstung repräsentiert T'Challa als König von Wakanda. Der Vibranium-Anzug kombiniert fortschrittliche Technologie mit dem zeremoniellen Mantel des Panther-Gott-Beschützers.",
    description_fr: "Black Panther en armure gris bleuté foncé représente T'Challa en tant que Roi du Wakanda. La combinaison en vibranium combine une technologie avancée avec le manteau cérémoniel du protecteur du Dieu Panthère.",
    description_es: "Pantera Negra en armadura gris azulado oscuro representa a T'Challa como Rey de Wakanda. El traje de vibranium combina tecnología avanzada con el manto ceremonial del protector del Dios Pantera."
  },
  {
    minifigure_no: 'sh1020',
    description_en: "Spider-Man with printed dark blue arms and red boots showcases Peter Parker's enhanced costume details. This version emphasizes the web-slinger's acrobatic prowess with detailed costume printing.",
    description_de: "Spider-Man mit bedruckten dunkelblauen Armen und roten Stiefeln zeigt Peter Parkers verbesserte Kostümdetails. Diese Version betont die akrobatische Kunstfertigkeit des Netzschleuderers mit detailliertem Kostümdruck.",
    description_fr: "Spider-Man avec des bras bleu foncé imprimés et des bottes rouges présente les détails améliorés du costume de Peter Parker. Cette version met l'accent sur les prouesses acrobatiques du lanceur de toiles avec une impression de costume détaillée.",
    description_es: "Spider-Man con brazos azul oscuro impresos y botas rojas muestra los detalles mejorados del traje de Peter Parker. Esta versión enfatiza la destreza acrobática del lanzador de redes con impresión de traje detallada."
  },
  {
    minifigure_no: 'sh1021',
    description_en: "Batman in black suit with copper belt features cowl with white eyes and flexible rubber cape. The metallic belt accent adds visual interest to this Dark Knight interpretation.",
    description_de: "Batman im schwarzen Anzug mit Kupfergürtel hat eine Kapuze mit weißen Augen und flexiblem Gummi-Umhang. Der metallische Gürtelakzent verleiht dieser Dark Knight-Interpretation visuelles Interesse.",
    description_fr: "Batman en costume noir avec ceinture en cuivre présente une cagoule avec des yeux blancs et une cape en caoutchouc flexible. L'accent de ceinture métallique ajoute un intérêt visuel à cette interprétation du Dark Knight.",
    description_es: "Batman en traje negro con cinturón de cobre presenta capucha con ojos blancos y capa de goma flexible. El acento de cinturón metálico agrega interés visual a esta interpretación del Caballero Oscuro."
  },
  {
    minifigure_no: 'sh1022',
    description_en: "The Joker in dark purple suit with green vest and bright green hair showcases the Clown Prince of Crime's chaotic style. Batman's greatest enemy brings unpredictable mayhem with his theatrical criminal schemes.",
    description_de: "Der Joker im dunkellila Anzug mit grüner Weste und hellgrünen Haaren zeigt den chaotischen Stil des Clown-Prinzen des Verbrechens. Batmans größter Feind bringt unvorhersehbares Chaos mit seinen theatralischen kriminellen Plänen.",
    description_fr: "Le Joker en costume violet foncé avec un gilet vert et des cheveux vert vif présente le style chaotique du Prince Clown du Crime. Le plus grand ennemi de Batman apporte un chaos imprévisible avec ses stratagèmes criminels théâtraux.",
    description_es: "El Joker en traje morado oscuro con chaleco verde y cabello verde brillante muestra el estilo caótico del Príncipe Payaso del Crimen. El mayor enemigo de Batman trae caos impredecible con sus planes criminales teatrales."
  },
  {
    minifigure_no: 'sh1023',
    description_en: "Two-Face in dark bluish gray suit with dark tan hair represents Harvey Dent's tragic transformation. The former Gotham District Attorney makes decisions based on chance, his scarred psyche reflected in his coin flips.",
    description_de: "Two-Face im dunkelblaugrauen Anzug mit dunkelbraunen Haaren repräsentiert Harvey Dents tragische Transformation. Der ehemalige Gotham-Bezirksstaatsanwalt trifft Entscheidungen basierend auf Zufall, seine vernarbte Psyche spiegelt sich in seinen Münzwürfen wider.",
    description_fr: "Double-Face en costume gris bleuté foncé avec des cheveux brun foncé représente la transformation tragique de Harvey Dent. L'ancien procureur du district de Gotham prend des décisions basées sur le hasard, sa psyché cicatrisée se reflétant dans ses lancers de pièce.",
    description_es: "Dos Caras en traje gris azulado oscuro con cabello castaño oscuro representa la trágica transformación de Harvey Dent. El ex Fiscal de Distrito de Gótica toma decisiones basadas en el azar, su psique marcada reflejada en sus lanzamientos de moneda."
  },
  {
    minifigure_no: 'sh1024',
    description_en: "Ghost-Spider (Gwen Stacy) with dark purple medium legs, white basic smooth hood, and lime spider logo represents a variant color scheme. This alternate Spider-Gwen design maintains her heroic identity with fresh visual styling.",
    description_de: "Ghost-Spider (Gwen Stacy) mit dunkelvioletten mittellangen Beinen, weißer glatter Kapuze und limettenfarbenem Spinnenlogo repräsentiert ein alternatives Farbschema. Dieses alternative Spider-Gwen-Design behält ihre heroische Identität mit frischem visuellen Stil bei.",
    description_fr: "Ghost-Spider (Gwen Stacy) avec des jambes moyennes violet foncé, une capuche lisse blanche basique et un logo d'araignée citron vert représente un schéma de couleurs alternatif. Ce design alternatif de Spider-Gwen maintient son identité héroïque avec un style visuel frais.",
    description_es: "Ghost-Spider (Gwen Stacy) con piernas medianas moradas oscuras, capucha lisa blanca básica y logo de araña verde lima representa un esquema de color variante. Este diseño alternativo de Spider-Gwen mantiene su identidad heroica con estilo visual fresco."
  },
  {
    minifigure_no: 'sh1025',
    description_en: "Trapster represents the paste-pot wielding villain from Spider-Man's rogues gallery. Peter Petruski uses his adhesive technology to trap heroes and commit crimes with sticky situations.",
    description_de: "Trapster repräsentiert den Paste-Topf schwingenden Bösewicht aus Spider-Mans Schurken-Galerie. Peter Petruski nutzt seine Klebstofftechnologie, um Helden zu fangen und Verbrechen mit klebrigen Situationen zu begehen.",
    description_fr: "Trapster représente le méchant maniant un pot de pâte de la galerie des voyous de Spider-Man. Peter Petruski utilise sa technologie adhésive pour piéger les héros et commettre des crimes avec des situations collantes.",
    description_es: "Trapster representa al villano que maneja pasta adhesiva de la galería de villanos de Spider-Man. Peter Petruski usa su tecnología adhesiva para atrapar héroes y cometer crímenes con situaciones pegajosas."
  }
];

async function updateDescriptions() {
  console.log(`Starting batch update: sh1001-sh1025 (${descriptions.length} minifigures)`);

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
