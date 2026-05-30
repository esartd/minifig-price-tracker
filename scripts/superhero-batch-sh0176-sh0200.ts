import { PrismaClient as PrismaClientHostinger } from '@prisma/client-hostinger';

const prisma = new PrismaClientHostinger({
  datasources: {
    db: {
      url: "mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker"
    }
  }
});

const descriptions = [
  {
    minifigure_no: 'sh0176',
    description_en: "Ultimate Ultron with foot repulsors represents the villain's most advanced flying configuration. This variant showcases enhanced mobility capabilities. The foot-mounted propulsion system adds dynamic posing possibilities. A powerful final boss piece for Age of Ultron climactic battle displays.",
    description_de: "Ultimate Ultron mit Fuß-Repulsoren repräsentiert die fortgeschrittenste Flugkonfiguration des Schurken. Diese Variante zeigt verbesserte Mobilitätsfähigkeiten. Das fußmontierte Antriebssystem fügt dynamische Posierungsmöglichkeiten hinzu. Ein mächtiges Endgegner-Teil für Age of Ultron-Höhepunkt-Kampf-Displays.",
    description_fr: "Ultimate Ultron avec répulseurs de pied représente la configuration de vol la plus avancée du méchant. Cette variante présente des capacités de mobilité améliorées. Le système de propulsion monté sur pied ajoute des possibilités de pose dynamiques. Une pièce de boss final puissante pour affichages de bataille culminante Age of Ultron.",
    description_es: "Ultimate Ultron con repulsores de pie representa la configuración de vuelo más avanzada del villano. Esta variante muestra capacidades de movilidad mejoradas. El sistema de propulsión montado en pie añade posibilidades de pose dinámica. Una pieza de jefe final poderosa para exhibiciones de batalla culminante de Age of Ultron."
  },
  {
    minifigure_no: 'sh0177',
    description_en: "Captain America's dark blue suit with reddish brown belt and harness shows his Age of Ultron tactical gear. Steve Rogers leads the Avengers with this upgraded costume design. The reddish brown accessories complement the patriotic color scheme. Essential for complete Age of Ultron team displays.",
    description_de: "Captain Americas dunkelblaue Rüstung mit rotbraunem Gürtel und Geschirr zeigt seine Age of Ultron-taktische Ausrüstung. Steve Rogers führt die Avengers mit diesem aufgewerteten Kostümdesign. Die rotbraunen Accessoires ergänzen das patriotische Farbschema. Unverzichtbar für vollständige Age of Ultron-Team-Displays.",
    description_fr: "Le costume bleu foncé de Captain America avec ceinture et harnais brun rougeâtre montre son équipement tactique Age of Ultron. Steve Rogers dirige les Avengers avec ce design de costume amélioré. Les accessoires brun rougeâtre complètent le schéma de couleurs patriotique. Essentiel pour affichages d'équipe Age of Ultron complets.",
    description_es: "El traje azul oscuro del Capitán América con cinturón y arnés marrón rojizo muestra su equipo táctico de Age of Ultron. Steve Rogers lidera a los Vengadores con este diseño de traje mejorado. Los accesorios marrón rojizo complementan el esquema de color patriótico. Esencial para exhibiciones completas de equipo de Age of Ultron."
  },
  {
    minifigure_no: 'sh0178',
    description_en: "Vision combines android perfection with humanity. The sand green coloring with dark azure Mind Stone creates his distinctive appearance. This synthetic being wields immense power responsibly. An essential Avengers member representing artificial life achieving true heroism.",
    description_de: "Vision kombiniert Android-Perfektion mit Menschlichkeit. Die sandgrüne Färbung mit dunkelazurblauem Mind Stone schafft sein charakteristisches Aussehen. Dieses synthetische Wesen schwingt immense Macht verantwortungsvoll. Ein unverzichtbares Avengers-Mitglied, das künstliches Leben darstellt, das wahres Heldentum erreicht.",
    description_fr: "Vision combine perfection androïde avec humanité. La coloration vert sable avec Pierre de l'Esprit azur foncé crée son apparence distinctive. Cet être synthétique manie un pouvoir immense de manière responsable. Un membre Avengers essentiel représentant la vie artificielle atteignant le véritable héroïsme.",
    description_es: "Visión combina perfección androide con humanidad. La coloración verde arena con Gema de la Mente azul oscuro crea su apariencia distintiva. Este ser sintético maneja poder inmenso responsablemente. Un miembro esencial de Vengadores que representa vida artificial logrando verdadero heroísmo."
  },
  {
    minifigure_no: 'sh0179',
    description_en: "Baron Von Strucker leads Hydra's European operations with ruthless efficiency. This Nazi scientist's experiments created Scarlet Witch and Quicksilver. His presence connects Captain America's past to modern threats. A key villain bridging World War II Hydra to contemporary MCU storylines.",
    description_de: "Baron Von Strucker führt Hydras europäische Operationen mit rücksichtsloser Effizienz. Dieser Nazi-Wissenschaftler-Experimente schufen Scarlet Witch und Quicksilver. Seine Präsenz verbindet Captain Americas Vergangenheit mit modernen Bedrohungen. Ein Schlüssel-Schurke, der Zweiter-Weltkriegs-Hydra mit zeitgenössischen MCU-Handlungen verbindet.",
    description_fr: "Baron Von Strucker dirige les opérations européennes d'Hydra avec une efficacité impitoyable. Les expériences de ce scientifique nazi ont créé Scarlet Witch et Quicksilver. Sa présence connecte le passé de Captain America aux menaces modernes. Un méchant clé reliant l'Hydra de la Seconde Guerre mondiale aux intrigues MCU contemporaines.",
    description_es: "Barón Von Strucker lidera las operaciones europeas de Hydra con eficiencia despiadada. Los experimentos de este científico nazi crearon a Bruja Escarlata y Quicksilver. Su presencia conecta el pasado del Capitán América con amenazas modernas. Un villano clave que une Hydra de la Segunda Guerra Mundial con historias contemporáneas del MCU."
  },
  {
    minifigure_no: 'sh0180',
    description_en: "Quicksilver races with superhuman speed. Pietro Maximoff's dark azure shirt marks his Age of Ultron appearance. His powers make him invaluable in battle despite tragic fate. An important character representing the Maximoff twins' journey from antagonists to heroes.",
    description_de: "Quicksilver rennt mit übermenschlicher Geschwindigkeit. Pietro Maximoffs dunkelazurblaues Hemd markiert sein Age of Ultron-Aussehen. Seine Kräfte machen ihn im Kampf unschätzbar, trotz tragischen Schicksals. Eine wichtige Figur, die die Reise der Maximoff-Zwillinge von Antagonisten zu Helden repräsentiert.",
    description_fr: "Quicksilver court à vitesse surhumaine. La chemise azur foncé de Pietro Maximoff marque son apparence Age of Ultron. Ses pouvoirs le rendent inestimable au combat malgré un destin tragique. Un personnage important représentant le voyage des jumeaux Maximoff d'antagonistes à héros.",
    description_es: "Quicksilver corre con velocidad sobrehumana. La camisa azul oscuro de Pietro Maximoff marca su apariencia de Age of Ultron. Sus poderes lo hacen invaluable en batalla a pesar de destino trágico. Un personaje importante que representa el viaje de los gemelos Maximoff de antagonistas a héroes."
  },
  {
    minifigure_no: 'sh0181',
    description_en: "Winter Soldier shows Bucky Barnes as Hydra's brainwashed assassin. The dark brown hair and light bluish gray metal arm capture his tragic transformation. This deadly operative bridges Captain America's past and present. A critical character essential for Captain America: Winter Soldier storylines.",
    description_de: "Winter Soldier zeigt Bucky Barnes als Hydras gehirngewaschenen Attentäter. Das dunkelbraune Haar und hellblaugraue Metallarm erfassen seine tragische Verwandlung. Dieser tödliche Operative verbindet Captain Americas Vergangenheit und Gegenwart. Eine kritische Figur, unverzichtbar für Captain America: Winter Soldier-Handlungen.",
    description_fr: "Winter Soldier montre Bucky Barnes comme assassin sous contrôle mental d'Hydra. Les cheveux brun foncé et bras métallique gris bleuté clair capturent sa transformation tragique. Cet opératif mortel relie le passé et le présent de Captain America. Un personnage critique essentiel pour les intrigues Captain America: Le Soldat de l'Hiver.",
    description_es: "Soldado de Invierno muestra a Bucky Barnes como asesino lavado de cerebro de Hydra. El cabello marrón oscuro y brazo metálico gris azulado claro capturan su transformación trágica. Este operativo mortal une el pasado y presente del Capitán América. Un personaje crítico esencial para historias de Capitán América: El Soldado de Invierno."
  },
  {
    minifigure_no: 'sh0183',
    description_en: "Maria Hill commands SHIELD operations with tactical expertise. This high-ranking agent serves as Nick Fury's right hand. Her presence adds governmental and strategic depth to Marvel displays. An important supporting character for SHIELD and Avengers organizational scenes.",
    description_de: "Maria Hill befehligt SHIELD-Operationen mit taktischer Expertise. Diese hochrangige Agentin dient als Nick Furys rechte Hand. Ihre Präsenz fügt staatliche und strategische Tiefe zu Marvel-Displays hinzu. Eine wichtige Nebenfigur für SHIELD- und Avengers-Organisationsszenen.",
    description_fr: "Maria Hill commande les opérations SHIELD avec expertise tactique. Cette agente de haut rang sert de bras droit à Nick Fury. Sa présence ajoute profondeur gouvernementale et stratégique aux affichages Marvel. Un personnage secondaire important pour scènes organisationnelles SHIELD et Avengers.",
    description_es: "Maria Hill comanda operaciones de SHIELD con experiencia táctica. Esta agente de alto rango sirve como mano derecha de Nick Fury. Su presencia añade profundidad gubernamental y estratégica a exhibiciones Marvel. Un personaje secundario importante para escenas organizacionales de SHIELD y Vengadores."
  },
  {
    minifigure_no: 'sh0184',
    description_en: "Captain America unmasked shows Steve Rogers in tactical gear with hair and dark orange eyebrows. This variant reveals the man behind the shield. The dual-identity display potential enriches storytelling possibilities. Perfect for creating character development and team interaction scenes.",
    description_de: "Captain America ohne Maske zeigt Steve Rogers in taktischer Ausrüstung mit Haar und dunkelorangenen Augenbrauen. Diese Variante enthüllt den Mann hinter dem Schild. Das Doppelidentitäts-Display-Potenzial bereichert Storytelling-Möglichkeiten. Perfekt für die Erstellung von Charakterentwicklungs- und Team-Interaktionsszenen.",
    description_fr: "Captain America démasqué montre Steve Rogers en équipement tactique avec cheveux et sourcils orange foncé. Cette variante révèle l'homme derrière le bouclier. Le potentiel d'affichage de double identité enrichit les possibilités de narration. Parfait pour créer des scènes de développement de personnage et d'interaction d'équipe.",
    description_es: "Capitán América sin máscara muestra a Steve Rogers en equipo táctico con cabello y cejas naranja oscuro. Esta variante revela al hombre detrás del escudo. El potencial de exhibición de doble identidad enriquece posibilidades narrativas. Perfecto para crear escenas de desarrollo de personaje e interacción de equipo."
  },
  {
    minifigure_no: 'sh0185',
    description_en: "Nick Fury in leather trench coat commands SHIELD with strategic brilliance. The iconic eyepatch and commanding presence define this master spy. This variant emphasizes his mysterious and authoritative nature. Essential cornerstone piece for any MCU collection, representing leadership and espionage.",
    description_de: "Nick Fury im Ledermantel befehligt SHIELD mit strategischer Brillanz. Die ikonische Augenklappe und befehlende Präsenz definieren diesen Meisterspion. Diese Variante betont seine mysteriöse und autoritäre Natur. Unverzichtbares Eckpfeiler-Teil für jede MCU-Sammlung, das Führung und Spionage repräsentiert.",
    description_fr: "Nick Fury en trench-coat de cuir commande SHIELD avec brillance stratégique. Le cache-œil emblématique et la présence autoritaire définissent ce maître espion. Cette variante souligne sa nature mystérieuse et autoritaire. Pièce pierre angulaire essentielle pour toute collection MCU, représentant leadership et espionnage.",
    description_es: "Nick Fury en gabardina de cuero comanda SHIELD con brillantez estratégica. El icónico parche y presencia autoritaria definen a este maestro espía. Esta variante enfatiza su naturaleza misteriosa y autoritaria. Pieza fundamental esencial para cualquier colección MCU, representando liderazgo y espionaje."
  },
  {
    minifigure_no: 'sh0186',
    description_en: "Black Widow's black jumpsuit with dark orange short hair and dark azure trim shows her Age of Ultron appearance. Natasha Romanoff's spy skills and combat prowess make her essential. The printed legs add premium detail. A core Avengers member highly valued by MCU collectors.",
    description_de: "Black Widows schwarzer Jumpsuit mit dunkelorangem kurzem Haar und dunkelazurblauem Besatz zeigt ihr Age of Ultron-Aussehen. Natasha Romanoffs Spion-Fähigkeiten und Kampfgeschick machen sie unverzichtbar. Die bedruckten Beine fügen Premium-Details hinzu. Ein Kern-Avengers-Mitglied, hoch geschätzt von MCU-Sammlern.",
    description_fr: "La combinaison noire de Black Widow avec cheveux courts orange foncé et garniture azur foncé montre son apparence Age of Ultron. Les compétences d'espionne et la prouesse au combat de Natasha Romanoff la rendent essentielle. Les jambes imprimées ajoutent des détails premium. Un membre Avengers central très apprécié par les collectionneurs MCU.",
    description_es: "El mono negro de Viuda Negra con cabello corto naranja oscuro y adorno azul oscuro muestra su apariencia de Age of Ultron. Las habilidades de espía y destreza en combate de Natasha Romanoff la hacen esencial. Las piernas impresas añaden detalle premium. Un miembro central de Vengadores muy valorado por coleccionistas MCU."
  },
  {
    minifigure_no: 'sh0187',
    description_en: "Carnage brings symbiotic chaos with shorter appendages variant. Cletus Kasady's bond with the alien symbiote creates Spider-Man's most psychotic enemy. This design captures his terrifying red and black appearance. A must-have villain for Spider-Man collections representing pure evil.",
    description_de: "Carnage bringt symbiotisches Chaos mit kürzeren Anhängseln-Variante. Cletus Kasadys Verbindung mit dem außerirdischen Symbioten schafft Spider-Mans psychotischsten Feind. Dieses Design erfasst sein erschreckendes rot-schwarzes Aussehen. Ein unverzichtbarer Schurke für Spider-Man-Sammlungen, der reines Böses repräsentiert.",
    description_fr: "Carnage apporte le chaos symbiotique avec variante d'appendices plus courts. Le lien de Cletus Kasady avec le symbiote extraterrestre crée l'ennemi le plus psychotique de Spider-Man. Ce design capture son apparence rouge et noire terrifiante. Un méchant incontournable pour les collections Spider-Man représentant le mal pur.",
    description_es: "Carnage trae caos simbiótico con variante de apéndices más cortos. El vínculo de Cletus Kasady con el simbionte alienígena crea al enemigo más psicótico de Spider-Man. Este diseño captura su aterradora apariencia roja y negra. Un villano imprescindible para colecciones de Spider-Man que representa maldad pura."
  },
  {
    minifigure_no: 'sh0188',
    description_en: "SHIELD Agent with white hips and hands represents the organization's field operatives. These tactical agents carry out Nick Fury's missions worldwide. Essential army builders for creating authentic SHIELD team formations. Perfect for government agency and espionage scenario displays.",
    description_de: "SHIELD-Agent mit weißen Hüften und Händen repräsentiert die Feldoperativen der Organisation. Diese taktischen Agenten führen Nick Furys Missionen weltweit aus. Unverzichtbare Armee-Baumeister für die Erstellung authentischer SHIELD-Team-Formationen. Perfekt für Regierungsbehörden- und Spionage-Szenario-Displays.",
    description_fr: "Agent SHIELD avec hanches et mains blanches représente les opératifs de terrain de l'organisation. Ces agents tactiques exécutent les missions de Nick Fury dans le monde entier. Constructeurs d'armée essentiels pour créer des formations d'équipe SHIELD authentiques. Parfait pour affichages de scénarios d'agence gouvernementale et d'espionnage.",
    description_es: "Agente de SHIELD con caderas y manos blancas representa a los operativos de campo de la organización. Estos agentes tácticos ejecutan las misiones de Nick Fury en todo el mundo. Constructores de ejército esenciales para crear formaciones auténticas de equipo SHIELD. Perfecto para exhibiciones de escenarios de agencia gubernamental y espionaje."
  },
  {
    minifigure_no: 'sh0189',
    description_en: "Yellow Jacket represents Hank Pym's dangerous technology weaponized. Darren Cross's suit mirrors Ant-Man's abilities with villainous intent. This minifigure showcases the threatening yellow and black color scheme. Essential antagonist for Ant-Man storylines and size-changing hero battles.",
    description_de: "Yellow Jacket repräsentiert Hank Pyms gefährliche Technologie, die bewaffnet wurde. Darren Cross' Anzug spiegelt Ant-Mans Fähigkeiten mit schurkenhafte Absicht. Diese Minifigur zeigt das bedrohliche gelb-schwarze Farbschema. Unverzichtbarer Antagonist für Ant-Man-Handlungen und größenverändernde Helden-Kämpfe.",
    description_fr: "Yellow Jacket représente la technologie dangereuse d'Hank Pym militarisée. Le costume de Darren Cross reflète les capacités d'Ant-Man avec intention vilaine. Cette figurine présente le schéma de couleurs jaune et noir menaçant. Antagoniste essentiel pour intrigues Ant-Man et batailles de héros changeant de taille.",
    description_es: "Yellow Jacket representa la tecnología peligrosa de Hank Pym armamentizada. El traje de Darren Cross refleja las habilidades de Ant-Man con intención villana. Esta minifigura muestra el amenazante esquema de color amarillo y negro. Antagonista esencial para historias de Ant-Man y batallas de héroes que cambian de tamaño."
  },
  {
    minifigure_no: 'sh0190',
    description_en: "Miles Morales brings fresh energy to the Spider-Man legacy. This variant features red webbing on head and red hands. His unique powers include invisibility and venom blast. An essential Spider-Man for collectors embracing Marvel's diverse hero roster.",
    description_de: "Miles Morales bringt frische Energie zum Spider-Man-Erbe. Diese Variante zeigt rotes Netz auf dem Kopf und rote Hände. Seine einzigartigen Kräfte umfassen Unsichtbarkeit und Giftexplosion. Ein unverzichtbarer Spider-Man für Sammler, die Marvels vielfältiges Helden-Aufgebot annehmen.",
    description_fr: "Miles Morales apporte une énergie fraîche à l'héritage Spider-Man. Cette variante présente toile rouge sur tête et mains rouges. Ses pouvoirs uniques incluent invisibilité et explosion de venin. Un Spider-Man essentiel pour collectionneurs embrassant le roster diversifié de héros Marvel.",
    description_es: "Miles Morales aporta energía fresca al legado de Spider-Man. Esta variante presenta telaraña roja en cabeza y manos rojas. Sus poderes únicos incluyen invisibilidad y ráfaga de veneno. Un Spider-Man esencial para coleccionistas que abrazan el diverso plantel de héroes de Marvel."
  },
  {
    minifigure_no: 'sh0191',
    description_en: "Sandman with tan legs manipulates sand with devastating effect. Flint Marko's ability to transform into sand makes him nearly impossible to defeat. This variant captures his earthy appearance. A powerful Spider-Man villain essential for Sinister Six team displays.",
    description_de: "Sandman mit beigen Beinen manipuliert Sand mit verheerender Wirkung. Flint Markos Fähigkeit, sich in Sand zu verwandeln, macht ihn nahezu unmöglich zu besiegen. Diese Variante erfasst sein erdiges Aussehen. Ein mächtiger Spider-Man-Schurke, unverzichtbar für Sinister Six-Team-Displays.",
    description_fr: "Sandman avec jambes beiges manipule le sable avec effet dévastateur. La capacité de Flint Marko à se transformer en sable le rend presque impossible à vaincre. Cette variante capture son apparence terreuse. Un méchant Spider-Man puissant essentiel pour affichages d'équipe Sinister Six.",
    description_es: "Sandman con piernas bronceadas manipula arena con efecto devastador. La habilidad de Flint Marko para transformarse en arena lo hace casi imposible de derrotar. Esta variante captura su apariencia terrosa. Un villano poderoso de Spider-Man esencial para exhibiciones de equipo Siniestros Seis."
  },
  {
    minifigure_no: 'sh0192',
    description_en: "Rhino charges with unstoppable momentum. Aleksei Sytsevich's armored suit grants superhuman strength and durability. This large-format figure captures his massive imposing presence. A heavyweight Spider-Man villain essential for big battle scene displays.",
    description_de: "Rhino lädt mit unaufhaltsamem Schwung. Aleksei Sytsevichs gepanzerte Rüstung verleiht übermenschliche Stärke und Haltbarkeit. Diese großformatige Figur erfasst seine massive imposante Präsenz. Ein Schwergewichts-Spider-Man-Schurke, unverzichtbar für große Kampfszenen-Displays.",
    description_fr: "Rhino charge avec élan imparable. Le costume blindé d'Aleksei Sytsevich confère force et durabilité surhumaines. Cette figurine grand format capture sa présence massive imposante. Un méchant Spider-Man poids lourd essentiel pour affichages de scène de grande bataille.",
    description_es: "Rhino carga con impulso imparable. El traje blindado de Aleksei Sytsevich otorga fuerza y durabilidad sobrehumanas. Esta figura de gran formato captura su presencia masiva imponente. Un villano peso pesado de Spider-Man esencial para exhibiciones de escena de gran batalla."
  },
  {
    minifigure_no: 'sh0193',
    description_en: "Iron Spider with bony appendages showcases Tony Stark's advanced suit design for Peter Parker. The mechanical arms add versatility and firepower. This sophisticated design represents Stark's mentorship. A premium Spider-Man variant highly sought by collectors.",
    description_de: "Iron Spider mit knöchernen Anhängseln zeigt Tony Starks fortgeschrittenes Anzug-Design für Peter Parker. Die mechanischen Arme fügen Vielseitigkeit und Feuerkraft hinzu. Dieses anspruchsvolle Design repräsentiert Starks Mentorschaft. Eine Premium-Spider-Man-Variante, sehr gesucht von Sammlern.",
    description_fr: "Iron Spider avec appendices osseux présente le design de costume avancé de Tony Stark pour Peter Parker. Les bras mécaniques ajoutent polyvalence et puissance de feu. Ce design sophistiqué représente le mentorat de Stark. Une variante Spider-Man premium très recherchée par les collectionneurs.",
    description_es: "Iron Spider con apéndices óseos muestra el diseño avanzado de traje de Tony Stark para Peter Parker. Los brazos mecánicos añaden versatilidad y potencia de fuego. Este diseño sofisticado representa la mentoría de Stark. Una variante premium de Spider-Man muy buscada por coleccionistas."
  },
  {
    minifigure_no: 'sh0194',
    description_en: "Deathstroke stands as DC's most dangerous mercenary. Slade Wilson's enhanced abilities and tactical genius make him a formidable adversary. This minifigure captures his iconic orange and blue armored appearance. Essential villain for Teen Titans and Batman collections.",
    description_de: "Deathstroke steht als DCs gefährlichster Söldner. Slade Wilsons verbesserte Fähigkeiten und taktisches Genie machen ihn zu einem beeindruckenden Gegner. Diese Minifigur erfasst sein ikonisches orange-blaues gepanzertes Aussehen. Unverzichtbarer Schurke für Teen Titans- und Batman-Sammlungen.",
    description_fr: "Deathstroke se présente comme le mercenaire le plus dangereux de DC. Les capacités améliorées et le génie tactique de Slade Wilson en font un adversaire formidable. Cette figurine capture son apparence blindée emblématique orange et bleue. Méchant essentiel pour collections Teen Titans et Batman.",
    description_es: "Deathstroke se erige como el mercenario más peligroso de DC. Las habilidades mejoradas y genio táctico de Slade Wilson lo convierten en un adversario formidable. Esta minifigura captura su icónica apariencia blindada naranja y azul. Villano esencial para colecciones de Teen Titans y Batman."
  },
  {
    minifigure_no: 'sh0195',
    description_en: "Robin with dark green legs represents another costume variation. Dick Grayson's evolving appearance reflects his growth as hero. The darker leg color provides visual distinction from other Robin variants. A valuable piece for comprehensive Robin collection displays.",
    description_de: "Robin mit dunkelgrünen Beinen repräsentiert eine weitere Kostüm-Variation. Dick Graysons sich entwickelndes Aussehen spiegelt sein Wachstum als Held wider. Die dunklere Beinfarbe bietet visuelle Unterscheidung von anderen Robin-Varianten. Ein wertvolles Teil für umfassende Robin-Sammlungs-Displays.",
    description_fr: "Robin avec jambes vert foncé représente une autre variation de costume. L'apparence évolutive de Dick Grayson reflète sa croissance en tant que héros. La couleur de jambes plus foncée fournit distinction visuelle des autres variantes Robin. Une pièce précieuse pour affichages de collection Robin complète.",
    description_es: "Robin con piernas verde oscuro representa otra variación de traje. La apariencia evolutiva de Dick Grayson refleja su crecimiento como héroe. El color de pierna más oscuro proporciona distinción visual de otras variantes de Robin. Una pieza valiosa para exhibiciones completas de colección Robin."
  },
  {
    minifigure_no: 'sh0196',
    description_en: "Green Goblin with bright green skin and large yellow eyes presents a vivid comic book appearance. Norman Osborn's dark purple outfit contrasts dramatically with his grotesque features. This eye-catching variant emphasizes the character's monstrous transformation. A striking villain piece for Spider-Man displays.",
    description_de: "Green Goblin mit hellgrüner Haut und großen gelben Augen präsentiert ein lebendiges Comic-Aussehen. Norman Osborns dunkelviolettes Outfit kontrastiert dramatisch mit seinen grotesken Zügen. Diese auffällige Variante betont die monströse Verwandlung der Figur. Ein auffälliges Schurken-Teil für Spider-Man-Displays.",
    description_fr: "Green Goblin avec peau vert vif et grands yeux jaunes présente une apparence de bande dessinée vive. La tenue violet foncé de Norman Osborn contraste dramatiquement avec ses traits grotesques. Cette variante accrocheuse souligne la transformation monstrueuse du personnage. Une pièce de méchant frappante pour affichages Spider-Man.",
    description_es: "Duende Verde con piel verde brillante y grandes ojos amarillos presenta una apariencia de cómic vívida. El traje morado oscuro de Norman Osborn contrasta dramáticamente con sus rasgos grotescos. Esta variante llamativa enfatiza la transformación monstruosa del personaje. Una pieza de villano impactante para exhibiciones de Spider-Man."
  },
  {
    minifigure_no: 'sh0197',
    description_en: "Starfire brings alien power and optimism to the Teen Titans. Koriand'r's energy projection and flight capabilities make her formidable. This minifigure captures her vibrant orange and purple color scheme. Essential for comprehensive Teen Titans team displays.",
    description_de: "Starfire bringt außerirdische Kraft und Optimismus zu den Teen Titans. Koriand'rs Energieprojektion und Flugfähigkeiten machen sie beeindruckend. Diese Minifigur erfasst ihr lebendiges orange-violettes Farbschema. Unverzichtbar für umfassende Teen Titans-Team-Displays.",
    description_fr: "Starfire apporte pouvoir extraterrestre et optimisme aux Teen Titans. La projection d'énergie et les capacités de vol de Koriand'r la rendent formidable. Cette figurine capture sa palette de couleurs orange et violette vibrante. Essentiel pour affichages d'équipe Teen Titans complets.",
    description_es: "Starfire aporta poder alienígena y optimismo a los Titanes Jóvenes. La proyección de energía y capacidades de vuelo de Koriand'r la hacen formidable. Esta minifigura captura su vibrante esquema de color naranja y morado. Esencial para exhibiciones completas de equipo Titanes Jóvenes."
  },
  {
    minifigure_no: 'sh0198',
    description_en: "Beast Boy shapeshifts into any animal with humor and heart. Garfield Logan's green skin marks his unique transformation abilities. This Teen Titans member brings versatility and comedy. A fun character essential for complete Teen Titans roster displays.",
    description_de: "Beast Boy verwandelt sich in jedes Tier mit Humor und Herz. Garfield Logans grüne Haut markiert seine einzigartigen Verwandlungsfähigkeiten. Dieses Teen Titans-Mitglied bringt Vielseitigkeit und Komödie. Eine lustige Figur, unverzichtbar für vollständige Teen Titans-Roster-Displays.",
    description_fr: "Beast Boy se transforme en n'importe quel animal avec humour et cœur. La peau verte de Garfield Logan marque ses capacités de transformation uniques. Ce membre des Teen Titans apporte polyvalence et comédie. Un personnage amusant essentiel pour affichages de roster Teen Titans complet.",
    description_es: "Beast Boy se transforma en cualquier animal con humor y corazón. La piel verde de Garfield Logan marca sus habilidades únicas de transformación. Este miembro de los Titanes Jóvenes aporta versatilidad y comedia. Un personaje divertido esencial para exhibiciones completas de plantel Titanes Jóvenes."
  },
  {
    minifigure_no: 'sh0199',
    description_en: "Harley Quinn with white arms showcases the iconic anti-hero. Dr. Harleen Quinzel's chaotic personality and gymnastic skills make her unpredictable. This variant emphasizes her classic red, black, and white color scheme. Highly popular character essential for both Batman and Suicide Squad collections.",
    description_de: "Harley Quinn mit weißen Armen zeigt die ikonische Anti-Heldin. Dr. Harleen Quinzels chaotische Persönlichkeit und gymnastische Fähigkeiten machen sie unberechenbar. Diese Variante betont ihr klassisches rot-schwarz-weißes Farbschema. Sehr beliebte Figur, unverzichtbar für sowohl Batman- als auch Suicide Squad-Sammlungen.",
    description_fr: "Harley Quinn avec bras blancs présente l'anti-héroïne emblématique. La personnalité chaotique et les compétences gymnastiques du Dr Harleen Quinzel la rendent imprévisible. Cette variante souligne sa palette de couleurs classique rouge, noir et blanc. Personnage très populaire essentiel pour collections Batman et Suicide Squad.",
    description_es: "Harley Quinn con brazos blancos muestra a la icónica anti-heroína. La personalidad caótica y habilidades gimnásticas de la Dra. Harleen Quinzel la hacen impredecible. Esta variante enfatiza su clásico esquema de color rojo, negro y blanco. Personaje muy popular esencial para colecciones de Batman y Escuadrón Suicida."
  },
  {
    minifigure_no: 'sh0200',
    description_en: "Robin with molded short sleeves and spiked hair represents a modern Teen Titans design. This variant showcases contemporary costume styling. The spiked hair adds youthful energy to the character. A dynamic Robin variant appealing to fans of animated series aesthetics.",
    description_de: "Robin mit geformten kurzen Ärmeln und stacheligem Haar repräsentiert ein modernes Teen Titans-Design. Diese Variante zeigt zeitgenössisches Kostüm-Styling. Das stachelige Haar fügt jugendliche Energie zur Figur hinzu. Eine dynamische Robin-Variante, die Fans animierter Serien-Ästhetik anzieht.",
    description_fr: "Robin avec manches courtes moulées et cheveux hérissés représente un design Teen Titans moderne. Cette variante présente un style de costume contemporain. Les cheveux hérissés ajoutent de l'énergie juvénile au personnage. Une variante Robin dynamique attirant les fans d'esthétique de séries animées.",
    description_es: "Robin con mangas cortas moldeadas y cabello puntiagudo representa un diseño moderno de Titanes Jóvenes. Esta variante muestra estilo de traje contemporáneo. El cabello puntiagudo añade energía juvenil al personaje. Una variante dinámica de Robin que atrae a fans de estética de series animadas."
  }
];

async function main() {
  console.log(`🦸 Starting Super Heroes batch sh0176-sh0200 (${descriptions.length} minifigs)...`);
  console.log();

  for (let i = 0; i < descriptions.length; i++) {
    const desc = descriptions[i];

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

    console.log(`✓ Saved ${desc.minifigure_no} (${i + 1}/${descriptions.length})`);
  }

  console.log();
  console.log(`✅ Batch complete! ${descriptions.length} minifigs saved. Total: 200 done.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
