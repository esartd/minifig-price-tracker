import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0690',
    name: 'Rebel Trooper, Rebel Helmet, Jet Pack',
    description_en: 'Rebel Troopers equipped with jet packs provided aerial reconnaissance and rapid response capabilities. This variant with Rebel helmet showed specialized airborne infantry. Their jet packs enabled quick strikes against Imperial positions and emergency evacuations. These mobile soldiers gave the Alliance tactical flexibility against numerically superior forces.',
    description_de: 'Rebellensoldaten mit Jetpacks boten Luftaufklärung und schnelle Reaktionsfähigkeiten. Diese Variante mit Rebellenhelm zeigte spezialisierte Luftinfanterie. Ihre Jetpacks ermöglichten schnelle Angriffe gegen imperiale Positionen und Notevakuierungen. Diese mobilen Soldaten gaben der Allianz taktische Flexibilität gegen zahlenmäßig überlegene Kräfte.',
    description_fr: 'Les Soldats Rebelles équipés de réacteurs dorsaux fournissaient reconnaissance aérienne et capacités de réponse rapide. Cette variante avec casque rebelle montrait infanterie aéroportée spécialisée. Leurs réacteurs dorsaux permettaient frappes rapides contre positions impériales et évacuations d\'urgence. Ces soldats mobiles donnaient à l\'Alliance flexibilité tactique contre forces numériquement supérieures.',
    description_es: 'Los Soldados Rebeldes equipados con mochilas cohete proporcionaban reconocimiento aéreo y capacidades de respuesta rápida. Esta variante con casco rebelde mostraba infantería aerotransportada especializada. Sus mochilas cohete permitían ataques rápidos contra posiciones imperiales y evacuaciones de emergencia. Estos soldados móviles daban a la Alianza flexibilidad táctica contra fuerzas numéricamente superiores.'
  },
  {
    minifigure_no: 'sw0691',
    name: 'Imperial Jet Pack Trooper (Jumptrooper)',
    description_en: 'Imperial Jumptroopers deployed jet packs for aerial assault missions and urban combat. These specialized stormtroopers excelled at three-dimensional warfare in city environments. Their jet packs provided rapid vertical movement overwhelming ground-based defenders. Jumptroopers represented the Empire\'s technological investment in elite airborne infantry.',
    description_de: 'Imperiale Jumptroopers setzten Jetpacks für Luftangriffsmissionen und Stadtkampf ein. Diese spezialisierten Sturmtruppler zeichneten sich in dreidimensionaler Kriegsführung in Stadtumgebungen aus. Ihre Jetpacks boten schnelle vertikale Bewegung, die bodenbasierte Verteidiger überwältigte. Jumptroopers repräsentierten die technologische Investition des Imperiums in Elite-Luftinfanterie.',
    description_fr: 'Les Jumptroopers Impériaux déployaient des réacteurs dorsaux pour missions d\'assaut aérien et combat urbain. Ces stormtroopers spécialisés excellaient en guerre tridimensionnelle dans environnements urbains. Leurs réacteurs dorsaux fournissaient mouvement vertical rapide submergant défenseurs au sol. Les Jumptroopers représentaient l\'investissement technologique de l\'Empire en infanterie aéroportée d\'élite.',
    description_es: 'Los Jumptroopers Imperiales desplegaban mochilas cohete para misiones de asalto aéreo y combate urbano. Estos stormtroopers especializados sobresalían en guerra tridimensional en entornos urbanos. Sus mochilas cohete proporcionaban movimiento vertical rápido abrumando defensores terrestres. Los Jumptroopers representaban inversión tecnológica del Imperio en infantería aerotransportada de élite.'
  },
  {
    minifigure_no: 'sw0692',
    name: 'Imperial Shock Trooper',
    description_en: 'Imperial Shock Troopers served as elite security forces guarding the Emperor and vital Imperial installations. Their distinctive red markings denoted elite status above standard stormtroopers. These specialized soldiers received enhanced combat training and superior equipment. Shock Troopers enforced order on Coruscant and protected high-value Imperial assets.',
    description_de: 'Imperiale Shock Troopers dienten als Elite-Sicherheitskräfte, die den Imperator und vitale imperiale Installationen bewachten. Ihre markanten roten Markierungen bezeichneten Elite-Status über Standard-Sturmtrupplern. Diese spezialisierten Soldaten erhielten verbesserte Kampfausbildung und überlegene Ausrüstung. Shock Troopers setzten Ordnung auf Coruscant durch und schützten hochwertige imperiale Vermögenswerte.',
    description_fr: 'Les Shock Troopers Impériaux servaient comme forces de sécurité d\'élite gardant l\'Empereur et installations impériales vitales. Leurs marques rouges distinctives dénotaient statut d\'élite au-dessus des stormtroopers standard. Ces soldats spécialisés recevaient formation de combat améliorée et équipement supérieur. Les Shock Troopers appliquaient l\'ordre sur Coruscant et protégeaient actifs impériaux de haute valeur.',
    description_es: 'Los Shock Troopers Imperiales servían como fuerzas de seguridad de élite custodiando al Emperador e instalaciones imperiales vitales. Sus marcas rojas distintivas denotaban estatus de élite sobre stormtroopers estándar. Estos soldados especializados recibían entrenamiento de combate mejorado y equipo superior. Los Shock Troopers aplicaban orden en Coruscant y protegían activos imperiales de alto valor.'
  },
  {
    minifigure_no: 'sw0693',
    name: 'Imperial Crew - Black Cap, Closed Mouth',
    description_en: 'Imperial Crew members operated Star Destroyers and military installations throughout the Empire. This variant with black cap and closed mouth expression represented technical personnel. These operators maintained weapons systems, engines, and navigation equipment. Imperial crew efficiency kept the vast military machine functioning across thousands of worlds.',
    description_de: 'Imperiale Besatzungsmitglieder operierten Sternenzerstörer und militärische Installationen im gesamten Imperium. Diese Variante mit schwarzer Kappe und geschlossenem Mund-Ausdruck repräsentierte technisches Personal. Diese Operateure warteten Waffensysteme, Motoren und Navigationsausrüstung. Die Effizienz der imperialen Besatzung hielt die riesige Militärmaschine über Tausende von Welten funktionsfähig.',
    description_fr: 'Les Membres d\'Équipage Impériaux opéraient Destroyers Stellaires et installations militaires dans tout l\'Empire. Cette variante avec casquette noire et expression bouche fermée représentait personnel technique. Ces opérateurs maintenaient systèmes d\'armes, moteurs et équipement de navigation. L\'efficacité de l\'équipage impérial maintenait la vaste machine militaire fonctionnant sur des milliers de mondes.',
    description_es: 'Los Miembros de Tripulación Imperial operaban Destructores Estelares e instalaciones militares por todo el Imperio. Esta variante con gorra negra y expresión de boca cerrada representaba personal técnico. Estos operadores mantenían sistemas de armas, motores y equipo de navegación. La eficiencia de tripulación imperial mantenía la vasta máquina militar funcionando en miles de mundos.'
  },
  {
    minifigure_no: 'sw0694',
    name: 'First Order Crew Member (Officer Sumistu) - Cap with Insignia',
    description_en: 'Officer Sumistu served aboard First Order capital ships coordinating tactical operations. This crew member\'s cap with insignia marked specialized technical expertise. First Order officers like Sumistu managed complex starship systems and weapons arrays. Their precise coordination enabled devastating orbital bombardments and fleet maneuvers.',
    description_de: 'Offizier Sumistu diente an Bord von Großschiffen der Ersten Ordnung und koordinierte taktische Operationen. Die Kappe dieses Besatzungsmitglieds mit Insignien kennzeichnete spezialisierte technische Expertise. Offiziere der Ersten Ordnung wie Sumistu verwalteten komplexe Raumschiffsysteme und Waffenreihen. Ihre präzise Koordination ermöglichte verheerende Orbitalbombardements und Flottenmanöver.',
    description_fr: 'L\'Officier Sumistu servait à bord de vaisseaux capitaux du Premier Ordre coordonnant opérations tactiques. La casquette de ce membre d\'équipage avec insigne marquait expertise technique spécialisée. Les officiers du Premier Ordre comme Sumistu géraient systèmes de vaisseaux spatiaux complexes et réseaux d\'armes. Leur coordination précise permettait bombardements orbitaux dévastateurs et manœuvres de flotte.',
    description_es: 'El Oficial Sumistu servía a bordo de naves capitales de la Primera Orden coordinando operaciones tácticas. La gorra de este miembro de tripulación con insignia marcaba pericia técnica especializada. Los oficiales de la Primera Orden como Sumistu gestionaban sistemas de naves espaciales complejos y matrices de armas. Su coordinación precisa permitía bombardeos orbitales devastadores y maniobras de flota.'
  },
  {
    minifigure_no: 'sw0695',
    name: 'First Order Heavy Assault Stormtrooper (Rounded Mouth Pattern)',
    description_en: 'First Order Heavy Assault Stormtroopers wore reinforced armor and carried powerful weapons for breakthrough operations. This variant with rounded mouth pattern showed enhanced helmet design. These heavily armed soldiers specialized in fortress assault and urban combat. Their superior firepower overwhelmed Resistance defensive positions.',
    description_de: 'Schwere Angriffs-Sturmtruppler der Ersten Ordnung trugen verstärkte Rüstung und trugen mächtige Waffen für Durchbruchsoperationen. Diese Variante mit abgerundetem Mundmuster zeigte verbessertes Helmdesign. Diese schwer bewaffneten Soldaten spezialisierten sich auf Festungsangriff und Stadtkampf. Ihre überlegene Feuerkraft überwältigte Widerstands-Verteidigungspositionen.',
    description_fr: 'Les Stormtroopers d\'Assaut Lourd du Premier Ordre portaient armure renforcée et transportaient armes puissantes pour opérations de percée. Cette variante avec motif de bouche arrondie montrait conception de casque améliorée. Ces soldats lourdement armés se spécialisaient en assaut de forteresse et combat urbain. Leur puissance de feu supérieure submergait positions défensives de la Résistance.',
    description_es: 'Los Stormtroopers de Asalto Pesado de la Primera Orden llevaban armadura reforzada y portaban armas poderosas para operaciones de ruptura. Esta variante con patrón de boca redondeada mostraba diseño de casco mejorado. Estos soldados fuertemente armados se especializaban en asalto de fortaleza y combate urbano. Su poder de fuego superior abrumaba posiciones defensivas de la Resistencia.'
  },
  {
    minifigure_no: 'sw0696',
    name: 'Resistance Trooper - Tan Jacket, Moustache',
    description_en: 'Resistance Troopers came from diverse backgrounds bringing unique skills to fight the First Order. This trooper with tan jacket and moustache showed the individualistic nature of Resistance forces. Unlike uniformed First Order troops, Resistance soldiers maintained personal identity while fighting tyranny. Their varied appearances reflected grassroots military organization.',
    description_de: 'Widerstands-Soldaten kamen aus vielfältigen Hintergründen und brachten einzigartige Fähigkeiten zum Kampf gegen die Erste Ordnung. Dieser Soldat mit beiger Jacke und Schnurrbart zeigte die individualistische Natur der Widerstandskräfte. Anders als uniformierte Truppen der Ersten Ordnung behielten Widerstands-Soldaten persönliche Identität beim Kampf gegen Tyrannei. Ihre vielfältigen Erscheinungen spiegelten Basis-Militärorganisation wider.',
    description_fr: 'Les Soldats de la Résistance venaient d\'origines diverses apportant compétences uniques pour combattre le Premier Ordre. Ce soldat avec veste beige et moustache montrait la nature individualiste des forces de la Résistance. Contrairement aux troupes uniformisées du Premier Ordre, les soldats de la Résistance maintenaient identité personnelle en combattant la tyrannie. Leurs apparences variées reflétaient organisation militaire de base.',
    description_es: 'Los Soldados de la Resistencia venían de orígenes diversos trayendo habilidades únicas para luchar contra la Primera Orden. Este soldado con chaqueta beige y bigote mostraba naturaleza individualista de fuerzas de la Resistencia. A diferencia de tropas uniformadas de la Primera Orden, soldados de la Resistencia mantenían identidad personal mientras luchaban contra tiranía. Sus apariencias variadas reflejaban organización militar de base.'
  },
  {
    minifigure_no: 'sw0697',
    name: 'Resistance Trooper - Dark Tan Jacket, Frown, Furrowed Eyebrows',
    description_en: 'This Resistance Trooper\'s dark tan jacket and furrowed expression captured the grim determination of fighters facing overwhelming odds. His frown reflected the heavy losses suffered against First Order military might. These hardened soldiers continued fighting despite knowing the desperate nature of their struggle. Their resolve inspired hope throughout the oppressed galaxy.',
    description_de: 'Die dunkle beige Jacke und gerunzelte Ausdruck dieses Widerstands-Soldaten erfassten die düstere Entschlossenheit von Kämpfern gegen überwältigende Chancen. Sein Stirnrunzeln spiegelte die schweren Verluste gegen die militärische Macht der Ersten Ordnung wider. Diese verhärteten Soldaten kämpften weiter, obwohl sie die verzweifelte Natur ihres Kampfes kannten. Ihre Entschlossenheit inspirierte Hoffnung in der unterdrückten Galaxis.',
    description_fr: 'La veste beige foncé et expression froncée de ce Soldat de la Résistance capturaient la détermination sombre de combattants face à chances écrasantes. Son froncement reflétait les lourdes pertes subies contre la puissance militaire du Premier Ordre. Ces soldats endurcis continuaient à combattre malgré la nature désespérée de leur lutte. Leur détermination inspirait espoir dans toute la galaxie opprimée.',
    description_es: 'La chaqueta beige oscuro y expresión fruncida de este Soldado de la Resistencia capturaban determinación sombría de luchadores enfrentando probabilidades abrumadoras. Su ceño fruncido reflejaba pérdidas pesadas sufridas contra poderío militar de la Primera Orden. Estos soldados endurecidos continuaban luchando a pesar de conocer naturaleza desesperada de su lucha. Su determinación inspiraba esperanza por toda galaxia oprimida.'
  },
  {
    minifigure_no: 'sw0698',
    name: 'Resistance Trooper - Tan Jacket, Frown, Cheek Lines',
    description_en: 'This battle-worn Resistance Trooper showed the physical toll of fighting the First Order through cheek lines and weary frown. His tan jacket bore signs of hard campaigning across hostile worlds. These veterans formed the experienced core of Resistance ground forces. Their combat knowledge proved invaluable training new recruits joining the desperate cause.',
    description_de: 'Dieser kampferprobte Widerstands-Soldat zeigte den physischen Tribut des Kampfes gegen die Erste Ordnung durch Wangenlinien und müdes Stirnrunzeln. Seine beige Jacke trug Zeichen harter Kampagne über feindliche Welten. Diese Veteranen bildeten den erfahrenen Kern der Widerstands-Bodentruppen. Ihr Kampfwissen erwies sich als unschätzbar wertvoll beim Training neuer Rekruten, die sich der verzweifelten Sache anschlossen.',
    description_fr: 'Ce Soldat de la Résistance éprouvé par la bataille montrait le péage physique du combat contre le Premier Ordre à travers lignes de joue et froncement las. Sa veste beige portait signes de campagne dure sur mondes hostiles. Ces vétérans formaient le noyau expérimenté des forces terrestres de la Résistance. Leur connaissance du combat s\'avérait inestimable pour former nouvelles recrues rejoignant la cause désespérée.',
    description_es: 'Este Soldado de la Resistencia curtido en batalla mostraba costo físico de luchar contra la Primera Orden a través de líneas de mejilla y ceño fruncido cansado. Su chaqueta beige mostraba signos de campaña dura por mundos hostiles. Estos veteranos formaban núcleo experimentado de fuerzas terrestres de la Resistencia. Su conocimiento de combate resultaba invaluable entrenando nuevos reclutas uniéndose a causa desesperada.'
  },
  {
    minifigure_no: 'sw0699',
    name: 'Resistance Officer - Headset',
    description_en: 'Resistance Officers coordinated ground forces and starfighter squadrons from command centers. This officer\'s headset enabled real-time communication with scattered Resistance units. These tactical coordinators managed limited resources fighting a vastly superior enemy. Their strategic decisions determined success or failure in desperate battles against the First Order.',
    description_de: 'Widerstands-Offiziere koordinierten Bodentruppen und Sternjäger-Staffeln von Kommandozentralen. Das Headset dieses Offiziers ermöglichte Echtzeitkommunikation mit verstreuten Widerstands-Einheiten. Diese taktischen Koordinatoren verwalteten begrenzte Ressourcen im Kampf gegen einen weit überlegenen Feind. Ihre strategischen Entscheidungen bestimmten Erfolg oder Misserfolg in verzweifelten Schlachten gegen die Erste Ordnung.',
    description_fr: 'Les Officiers de la Résistance coordonnaient forces terrestres et escadrons de chasseurs stellaires depuis centres de commandement. Le casque de cet officier permettait communication en temps réel avec unités de Résistance dispersées. Ces coordinateurs tactiques géraient ressources limitées combattant ennemi largement supérieur. Leurs décisions stratégiques déterminaient succès ou échec dans batailles désespérées contre le Premier Ordre.',
    description_es: 'Los Oficiales de la Resistencia coordinaban fuerzas terrestres y escuadrones de cazas estelares desde centros de comando. El auricular de este oficial permitía comunicación en tiempo real con unidades de Resistencia dispersas. Estos coordinadores tácticos gestionaban recursos limitados luchando contra enemigo vastamente superior. Sus decisiones estratégicas determinaban éxito o fracaso en batallas desesperadas contra la Primera Orden.'
  },
  {
    minifigure_no: 'sw0700',
    name: 'C-3PO - Colorful Wires, Printed Legs',
    description_en: 'This C-3PO variant features exposed colorful wires and printed legs showing battle damage from decades of adventures. The protocol droid\'s internal mechanisms became visible after countless repairs. His printed legs detailed the wear from serving Resistance heroes. Despite physical deterioration, C-3PO\'s loyalty and translation skills remained invaluable.',
    description_de: 'Diese C-3PO-Variante zeigt freiliegende bunte Drähte und bedruckte Beine, die Kampfschaden aus Jahrzehnten von Abenteuern zeigen. Die internen Mechanismen des Protokoll-Droiden wurden nach unzähligen Reparaturen sichtbar. Seine bedruckten Beine detaillierten die Abnutzung vom Dienst für Widerstands-Helden. Trotz physischem Verfall blieben C-3POs Loyalität und Übersetzungsfähigkeiten unschätzbar wertvoll.',
    description_fr: 'Cette variante de C-3PO présente fils colorés exposés et jambes imprimées montrant dommages de bataille de décennies d\'aventures. Les mécanismes internes du droïde de protocole devinrent visibles après d\'innombrables réparations. Ses jambes imprimées détaillaient l\'usure du service pour héros de la Résistance. Malgré détérioration physique, la loyauté et compétences de traduction de C-3PO restaient inestimables.',
    description_es: 'Esta variante de C-3PO presenta cables coloridos expuestos y piernas impresas mostrando daño de batalla de décadas de aventuras. Los mecanismos internos del droide de protocolo se volvieron visibles tras incontables reparaciones. Sus piernas impresas detallaban desgaste de servir a héroes de la Resistencia. A pesar de deterioro físico, lealtad y habilidades de traducción de C-3PO permanecían invaluables.'
  },
  {
    minifigure_no: 'sw0701',
    name: 'First Order Snowtrooper',
    description_en: 'First Order Snowtroopers inherited Imperial cold assault tactics with upgraded armor and weapons. These specialized soldiers operated in arctic and sub-zero environments. Their insulated suits and advanced heating systems enabled extended cold-weather operations. Snowtroopers deployed to ice worlds enforcing First Order control in extreme climates.',
    description_de: 'Snowtrooper der Ersten Ordnung erbten imperiale Kälte-Angriffstaktiken mit aufgerüsteter Rüstung und Waffen. Diese spezialisierten Soldaten operierten in arktischen und unter Null-Umgebungen. Ihre isolierten Anzüge und fortschrittlichen Heizsysteme ermöglichten ausgedehnte Kaltwetter-Operationen. Snowtrooper wurden auf Eiswelten eingesetzt, um Kontrolle der Ersten Ordnung in extremen Klimata durchzusetzen.',
    description_fr: 'Les Snowtroopers du Premier Ordre héritaient des tactiques d\'assaut par temps froid impériales avec armure et armes améliorées. Ces soldats spécialisés opéraient dans environnements arctiques et sous zéro. Leurs combinaisons isolées et systèmes de chauffage avancés permettaient opérations prolongées par temps froid. Les Snowtroopers déployés sur mondes de glace appliquaient contrôle du Premier Ordre dans climats extrêmes.',
    description_es: 'Los Snowtroopers de la Primera Orden heredaban tácticas de asalto en frío imperiales con armadura y armas mejoradas. Estos soldados especializados operaban en entornos árticos y bajo cero. Sus trajes aislados y sistemas de calefacción avanzados permitían operaciones prolongadas en clima frío. Los Snowtroopers desplegados en mundos de hielo aplicaban control de la Primera Orden en climas extremos.'
  },
  {
    minifigure_no: 'sw0702',
    name: 'Imperial Combat Driver - Gray Uniform',
    description_en: 'Imperial Combat Drivers piloted AT-ATs, AT-STs, and other ground assault vehicles. This variant in gray uniform operated heavy armor during planetary invasions. These specialized pilots required extensive training controlling massive walkers. Their skill enabled devastating Imperial mechanized assaults crushing Rebel ground forces.',
    description_de: 'Imperiale Kampffahrer pilotierten AT-ATs, AT-STs und andere Boden-Angriffsfahrzeuge. Diese Variante in grauer Uniform operierte schwere Panzerung während planetarer Invasionen. Diese spezialisierten Piloten benötigten umfangreiche Ausbildung zur Kontrolle massiver Walker. Ihre Fähigkeit ermöglichte verheerende imperiale mechanisierte Angriffe, die Rebellen-Bodentruppen zerquetschten.',
    description_fr: 'Les Pilotes de Combat Impériaux pilotaient AT-AT, AT-ST et autres véhicules d\'assaut terrestre. Cette variante en uniforme gris opérait blindage lourd pendant invasions planétaires. Ces pilotes spécialisés nécessitaient formation extensive pour contrôler marcheurs massifs. Leur compétence permettait assauts mécanisés impériaux dévastateurs écrasant forces terrestres rebelles.',
    description_es: 'Los Pilotos de Combate Imperial pilotaban AT-AT, AT-ST y otros vehículos de asalto terrestre. Esta variante en uniforme gris operaba blindaje pesado durante invasiones planetarias. Estos pilotos especializados requerían entrenamiento extenso controlando caminantes masivos. Su habilidad permitía asaltos mecanizados imperiales devastadores aplastando fuerzas terrestres rebeldes.'
  },
  {
    minifigure_no: 'sw0703',
    name: 'Maz Kanata',
    description_en: 'Maz Kanata ran her castle cantina on Takodana for over a millennium, witnessing galactic history. This ancient Force-sensitive offered wisdom and sanctuary to smugglers and freedom fighters. Her massive goggles magnified her wise eyes that had seen empires rise and fall. Maz guided Rey toward accepting her Force destiny and gave Finn courage to fight.',
    description_de: 'Maz Kanata führte ihre Schloss-Cantina auf Takodana über ein Jahrtausend und bezeugte galaktische Geschichte. Diese uralte Macht-Empfindliche bot Weisheit und Zuflucht für Schmuggler und Freiheitskämpfer. Ihre massiven Schutzbrillen vergrößerten ihre weisen Augen, die Imperien aufsteigen und fallen gesehen hatten. Maz führte Rey dazu, ihr Macht-Schicksal zu akzeptieren und gab Finn Mut zu kämpfen.',
    description_fr: 'Maz Kanata dirigeait sa cantine château sur Takodana pendant plus d\'un millénaire, témoin de l\'histoire galactique. Cette ancienne sensible à la Force offrait sagesse et sanctuaire aux contrebandiers et combattants de la liberté. Ses lunettes massives magnifiaient ses yeux sages qui avaient vu empires s\'élever et tomber. Maz guida Rey vers acceptation de son destin de Force et donna courage à Finn de combattre.',
    description_es: 'Maz Kanata dirigía su cantina castillo en Takodana por más de un milenio, presenciando historia galáctica. Esta antigua sensible a la Fuerza ofrecía sabiduría y santuario a contrabandistas y luchadores por libertad. Sus gafas masivas magnificaban sus ojos sabios que habían visto imperios ascender y caer. Maz guió a Rey hacia aceptar su destino de Fuerza y dio a Finn valor para luchar.'
  },
  {
    minifigure_no: 'sw0704',
    name: 'Obi-Wan Kenobi (Headset)',
    description_en: 'This Obi-Wan variant with headset shows the Jedi Master during Clone Wars command operations. His communication gear connected him to clone commanders across battlefields. Obi-Wan\'s tactical brilliance coordinated massive clone armies against Separatist forces. The headset symbolized his dual role as warrior and military strategist.',
    description_de: 'Diese Obi-Wan-Variante mit Headset zeigt den Jedi-Meister während Klonkriegs-Befehlsoperationen. Seine Kommunikationsausrüstung verband ihn mit Klon-Kommandanten über Schlachtfelder. Obi-Wans taktische Brillanz koordinierte massive Klon-Armeen gegen Separatisten-Streitkräfte. Das Headset symbolisierte seine doppelte Rolle als Krieger und Militärstratege.',
    description_fr: 'Cette variante d\'Obi-Wan avec casque montre le Maître Jedi pendant opérations de commandement de la Guerre des Clones. Son équipement de communication le reliait aux commandants clones à travers champs de bataille. Le génie tactique d\'Obi-Wan coordonnait armées de clones massives contre forces séparatistes. Le casque symbolisait son double rôle de guerrier et stratège militaire.',
    description_es: 'Esta variante de Obi-Wan con auricular muestra al Maestro Jedi durante operaciones de comando de las Guerras Clon. Su equipo de comunicación lo conectaba con comandantes clon a través de campos de batalla. La brillantez táctica de Obi-Wan coordinaba ejércitos clon masivos contra fuerzas separatistas. El auricular simbolizaba su rol dual como guerrero y estratega militar.'
  },
  {
    minifigure_no: 'sw0705',
    name: 'Resistance Pilot X-wing (Temmin \'Snap\' Wexley)',
    description_en: 'Temmin "Snap" Wexley flew as one of the Resistance\'s most skilled X-wing pilots. The son of Norra Wexley inherited his mother\'s exceptional piloting abilities. Snap served in Black Squadron alongside Poe Dameron on dangerous reconnaissance missions. His technical expertise with starfighters made him invaluable to Resistance fighter operations.',
    description_de: 'Temmin "Snap" Wexley flog als einer der fähigsten X-Wing-Piloten des Widerstands. Der Sohn von Norra Wexley erbte die außergewöhnlichen Pilotenfähigkeiten seiner Mutter. Snap diente in der Schwarzen Staffel neben Poe Dameron bei gefährlichen Aufklärungsmissionen. Seine technische Expertise mit Sternjägern machte ihn unschätzbar wertvoll für Widerstands-Jäger-Operationen.',
    description_fr: 'Temmin "Snap" Wexley pilotait comme l\'un des pilotes X-wing les plus compétents de la Résistance. Le fils de Norra Wexley hérita des capacités de pilotage exceptionnelles de sa mère. Snap servait dans l\'Escadron Noir aux côtés de Poe Dameron sur missions de reconnaissance dangereuses. Son expertise technique avec chasseurs stellaires le rendait inestimable pour opérations de chasseurs de la Résistance.',
    description_es: 'Temmin "Snap" Wexley volaba como uno de los pilotos X-wing más hábiles de la Resistencia. El hijo de Norra Wexley heredó habilidades de pilotaje excepcionales de su madre. Snap servía en Escuadrón Negro junto a Poe Dameron en misiones de reconocimiento peligrosas. Su pericia técnica con cazas estelares lo hacía invaluable para operaciones de cazas de la Resistencia.'
  },
  {
    minifigure_no: 'sw0706',
    name: 'Astromech Droid, R4-P17 - Silver Band Around Dome, Black Outline Rectangles',
    description_en: 'R4-P17 served as Obi-Wan Kenobi\'s loyal astromech during the Clone Wars. This droid\'s distinctive silver band and red-orange dome made it recognizable in combat. R4 provided navigation, repairs, and tactical support during dangerous missions. The droid\'s destruction during a space battle devastated Obi-Wan, showing the bond between Jedi and their mechanical companions.',
    description_de: 'R4-P17 diente als Obi-Wan Kenobis treuer Astromech während der Klonkriege. Das markante silberne Band und die rot-orange Kuppel dieses Droiden machten ihn im Kampf erkennbar. R4 bot Navigation, Reparaturen und taktische Unterstützung während gefährlicher Missionen. Die Zerstörung des Droiden während einer Weltraumschlacht verwüstete Obi-Wan und zeigte die Bindung zwischen Jedi und ihren mechanischen Begleitern.',
    description_fr: 'R4-P17 servait comme astromech loyal d\'Obi-Wan Kenobi pendant la Guerre des Clones. La bande argentée distinctive et dôme rouge-orange de ce droïde le rendaient reconnaissable au combat. R4 fournissait navigation, réparations et support tactique pendant missions dangereuses. La destruction du droïde pendant bataille spatiale dévasta Obi-Wan, montrant le lien entre Jedi et leurs compagnons mécaniques.',
    description_es: 'R4-P17 servía como astromech leal de Obi-Wan Kenobi durante las Guerras Clon. La banda plateada distintiva y cúpula rojo-naranja de este droide lo hacían reconocible en combate. R4 proporcionaba navegación, reparaciones y soporte táctico durante misiones peligrosas. La destrucción del droide durante batalla espacial devastó a Obi-Wan, mostrando vínculo entre Jedi y sus compañeros mecánicos.'
  },
  {
    minifigure_no: 'sw0707',
    name: 'Yoda - Olive Green, Open Robe with Large Creases',
    description_en: 'This Yoda variant features olive green coloring and open robe with prominent creases showing the ancient Jedi Master. His flowing robes reflected centuries of wisdom and Force mastery. This appearance captured Yoda during his teaching years training Jedi younglings at the Temple. The detailed robe printing emphasized his dignified presence.',
    description_de: 'Diese Yoda-Variante zeigt olivgrüne Färbung und offene Robe mit prominenten Falten, die den uralten Jedi-Meister zeigen. Seine fließenden Roben spiegelten Jahrhunderte von Weisheit und Macht-Meisterschaft wider. Dieses Erscheinungsbild erfasste Yoda während seiner Lehrjahre beim Training von Jedi-Jünglingen im Tempel. Der detaillierte Robe-Druck betonte seine würdevolle Präsenz.',
    description_fr: 'Cette variante de Yoda présente coloration vert olive et robe ouverte avec plis proéminents montrant le Maître Jedi ancien. Ses robes fluides reflétaient des siècles de sagesse et maîtrise de la Force. Cette apparence capturait Yoda pendant ses années d\'enseignement formant jeunes Jedi au Temple. L\'impression de robe détaillée soulignait sa présence digne.',
    description_es: 'Esta variante de Yoda presenta coloración verde oliva y túnica abierta con pliegues prominentes mostrando al Maestro Jedi antiguo. Sus túnicas fluidas reflejaban siglos de sabiduría y maestría de la Fuerza. Esta apariencia capturaba a Yoda durante sus años de enseñanza entrenando jóvenes Jedi en el Templo. La impresión de túnica detallada enfatizaba su presencia digna.'
  },
  {
    minifigure_no: 'sw0708',
    name: 'Hoth Rebel Trooper White Uniform (Frown)',
    description_en: 'This Hoth Rebel Trooper\'s frown captured the grim determination defending Echo Base against overwhelming Imperial forces. His white insulated uniform provided protection against Hoth\'s deadly cold. These brave soldiers faced certain defeat yet continued fighting to enable the evacuation. Their sacrifice allowed Rebel leadership to escape and continue the fight.',
    description_de: 'Das Stirnrunzeln dieses Hoth-Rebellen-Soldaten erfasste die düstere Entschlossenheit bei der Verteidigung von Echo Base gegen überwältigende imperiale Kräfte. Seine weiße isolierte Uniform bot Schutz gegen Hoths tödliche Kälte. Diese tapferen Soldaten sahen sich sicherer Niederlage gegenüber, kämpften aber weiter, um die Evakuierung zu ermöglichen. Ihr Opfer erlaubte es der Rebellenführung zu entkommen und den Kampf fortzusetzen.',
    description_fr: 'Le froncement de ce Soldat Rebelle de Hoth capturait la détermination sombre défendant la Base Echo contre forces impériales écrasantes. Son uniforme blanc isolé fournissait protection contre le froid mortel de Hoth. Ces soldats braves faisaient face à défaite certaine mais continuaient à combattre pour permettre l\'évacuation. Leur sacrifice permit au leadership rebelle d\'échapper et continuer le combat.',
    description_es: 'El ceño fruncido de este Soldado Rebelde de Hoth capturaba determinación sombría defendiendo Base Eco contra fuerzas imperiales abrumadoras. Su uniforme blanco aislado proporcionaba protección contra frío mortal de Hoth. Estos soldados valientes enfrentaban derrota segura pero continuaban luchando para permitir evacuación. Su sacrificio permitió al liderazgo rebelde escapar y continuar lucha.'
  },
  {
    minifigure_no: 'sw0709',
    name: 'Han Solo - Parka, Dark Brown Coat (Hoth)',
    description_en: 'Han Solo wore this dark brown parka with hood during the desperate defense of Hoth. His heavy coat protected against the planet\'s sub-zero temperatures. This outfit captured Han as he rescued Luke from the frozen wastes, showing his loyalty despite cynical exterior. The Hoth gear became iconic from Empire Strikes Back\'s opening act.',
    description_de: 'Han Solo trug diese dunkelbraune Parka mit Kapuze während der verzweifelten Verteidigung von Hoth. Sein schwerer Mantel schützte gegen die unter Null-Temperaturen des Planeten. Dieses Outfit erfasste Han, als er Luke aus der gefrorenen Einöde rettete und seine Loyalität trotz zynischem Äußeren zeigte. Die Hoth-Ausrüstung wurde ikonisch aus dem Eröffnungsakt von Das Imperium schlägt zurück.',
    description_fr: 'Han Solo portait ce parka brun foncé avec capuche pendant la défense désespérée de Hoth. Son manteau lourd protégeait contre les températures sous zéro de la planète. Cette tenue capturait Han alors qu\'il sauvait Luke des étendues gelées, montrant sa loyauté malgré extérieur cynique. L\'équipement de Hoth devint iconique de l\'acte d\'ouverture de L\'Empire contre-attaque.',
    description_es: 'Han Solo llevaba esta parka marrón oscuro con capucha durante defensa desesperada de Hoth. Su abrigo pesado protegía contra temperaturas bajo cero del planeta. Este atuendo capturaba a Han mientras rescataba a Luke de páramos congelados, mostrando su lealtad a pesar de exterior cínico. El equipo de Hoth se volvió icónico del acto de apertura de El Imperio Contraataca.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0690-sw0709...');

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

  console.log('Batch complete! 20 minifigs saved (sw0690-sw0709).');
  await prisma.$disconnect();
}

saveBatch();
