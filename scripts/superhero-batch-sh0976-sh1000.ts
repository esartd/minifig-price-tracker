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
    minifigure_no: 'sh0976',
    description_en: "Gamora from Guardians of the Galaxy Vol. 2 features dark red printed legs. The deadliest woman in the galaxy wears her signature combat outfit as she fights alongside the Guardians through cosmic adventures.",
    description_de: "Gamora aus Guardians of the Galaxy Vol. 2 hat dunkelrote bedruckte Beine. Die tödlichste Frau der Galaxie trägt ihr charakteristisches Kampfoutfit, während sie an der Seite der Guardians durch kosmische Abenteuer kämpft.",
    description_fr: "Gamora des Gardiens de la Galaxie Vol. 2 présente des jambes imprimées rouge foncé. La femme la plus mortelle de la galaxie porte sa tenue de combat emblématique alors qu'elle combat aux côtés des Gardiens à travers des aventures cosmiques.",
    description_es: "Gamora de Guardianes de la Galaxia Vol. 2 presenta piernas impresas rojo oscuro. La mujer más mortífera de la galaxia lleva su característico traje de combate mientras lucha junto a los Guardianes a través de aventuras cósmicas."
  },
  {
    minifigure_no: 'sh0977',
    description_en: "Drax from Guardians of the Galaxy features dark red tattoos covering his muscular frame. The literal-minded warrior seeks vengeance against Thanos while providing comic relief with his blunt observations.",
    description_de: "Drax aus Guardians of the Galaxy hat dunkelrote Tätowierungen auf seinem muskulösen Körper. Der wörtlich denkende Krieger sucht Rache an Thanos, während er mit seinen direkten Beobachtungen für komische Erleichterung sorgt.",
    description_fr: "Drax des Gardiens de la Galaxie présente des tatouages rouge foncé couvrant son cadre musclé. Le guerrier littéral cherche la vengeance contre Thanos tout en fournissant un soulagement comique avec ses observations franches.",
    description_es: "Drax de Guardianes de la Galaxia presenta tatuajes rojo oscuro cubriendo su marco musculoso. El guerrero literal busca venganza contra Thanos mientras proporciona alivio cómico con sus observaciones directas."
  },
  {
    minifigure_no: 'sh0978',
    description_en: "Baby Groot in dark tan represents the adorable sapling form of the Guardian after his sacrifice. This tiny tree-like creature brings innocence and humor while slowly regrowing to his full size.",
    description_de: "Baby Groot in Dunkelbraun repräsentiert die bezaubernde Setzling-Form des Guardians nach seinem Opfer. Diese winzige baumartige Kreatur bringt Unschuld und Humor, während sie langsam zu ihrer vollen Größe nachwächst.",
    description_fr: "Bébé Groot en brun foncé représente la forme adorable de jeune pousse du Gardien après son sacrifice. Cette minuscule créature ressemblant à un arbre apporte innocence et humour tout en repoussant lentement à sa taille complète.",
    description_es: "Bebé Groot en marrón oscuro representa la adorable forma de retoño del Guardián después de su sacrificio. Esta diminuta criatura parecida a un árbol aporta inocencia y humor mientras vuelve a crecer lentamente a su tamaño completo."
  },
  {
    minifigure_no: 'sh0979',
    description_en: "Thor with flexible rubber cape features pearl dark gray legs and tousled hair. This version of the God of Thunder showcases his more casual appearance while still ready for Asgardian battles.",
    description_de: "Thor mit flexiblem Gummi-Umhang hat perlgraue Beine und zerzaustes Haar. Diese Version des Donnergottes zeigt sein lässigeres Aussehen, während er immer noch bereit für asgardische Schlachten ist.",
    description_fr: "Thor avec cape en caoutchouc flexible présente des jambes gris foncé perlé et des cheveux ébouriffés. Cette version du Dieu du Tonnerre présente son apparence plus décontractée tout en étant prêt pour les batailles asgardiennes.",
    description_es: "Thor con capa de goma flexible presenta piernas gris oscuro perlado y cabello despeinado. Esta versión del Dios del Trueno muestra su apariencia más casual mientras sigue listo para batallas asgardianas."
  },
  {
    minifigure_no: 'sh0980',
    description_en: "Fire Demon represents one of the elemental adversaries faced by Marvel heroes. This blazing creature brings intense heat and destruction as a formidable supernatural threat.",
    description_de: "Feuerdämon repräsentiert einen der elementaren Gegner, denen Marvel-Helden gegenüberstehen. Diese lodernde Kreatur bringt intensive Hitze und Zerstörung als beeindruckende übernatürliche Bedrohung.",
    description_fr: "Le Démon de Feu représente l'un des adversaires élémentaires auxquels sont confrontés les héros Marvel. Cette créature enflammée apporte une chaleur intense et une destruction en tant que menace surnaturelle formidable.",
    description_es: "El Demonio de Fuego representa a uno de los adversarios elementales enfrentados por los héroes de Marvel. Esta criatura ardiente trae calor intenso y destrucción como una formidable amenaza sobrenatural."
  },
  {
    minifigure_no: 'sh0981',
    description_en: "Iron Man in dark red and gold armor features round arc reactor, pearl gold arms, and hair showing Tony Stark. This configuration represents one of Tony's distinctive armor designs with enhanced power systems.",
    description_de: "Iron Man in dunkelroter und goldener Rüstung hat einen runden Arc-Reaktor, perlgoldene Arme und Haare, die Tony Stark zeigen. Diese Konfiguration repräsentiert eines von Tonys markanten Rüstungsdesigns mit verbesserten Energiesystemen.",
    description_fr: "Iron Man dans une armure rouge foncé et or présente un réacteur arc rond, des bras or perlé et des cheveux montrant Tony Stark. Cette configuration représente l'un des designs d'armure distinctifs de Tony avec des systèmes d'alimentation améliorés.",
    description_es: "Iron Man en armadura rojo oscuro y oro presenta reactor arc redondo, brazos dorado perlado y cabello mostrando a Tony Stark. Esta configuración representa uno de los diseños de armadura distintivos de Tony con sistemas de energía mejorados."
  },
  {
    minifigure_no: 'sh0982',
    description_en: "Hulk minifigure in dark purple pants features spiked hair with dual-sided head showing lopsided grin and angry expressions. This compact version captures Bruce Banner's transformation with both his playful and enraged personas.",
    description_de: "Hulk-Minifigur in dunkelvioletten Hosen hat stacheliges Haar mit doppelseitigem Kopf, der ein schiefes Grinsen und wütende Ausdrücke zeigt. Diese kompakte Version fängt Bruce Banners Transformation mit seinen spielerischen und wütenden Persönlichkeiten ein.",
    description_fr: "La minifigurine de Hulk en pantalon violet foncé présente des cheveux hérissés avec une tête à double face montrant un sourire de travers et des expressions en colère. Cette version compacte capture la transformation de Bruce Banner avec ses personnages joueurs et enragés.",
    description_es: "La minifigura de Hulk en pantalones morados oscuros presenta cabello puntiagudo con cabeza de doble cara mostrando sonrisa torcida y expresiones enojadas. Esta versión compacta captura la transformación de Bruce Banner con sus personalidades juguetonas y enfurecidas."
  },
  {
    minifigure_no: 'sh0983',
    description_en: "Iron Legion drone features dark blue head with one-piece helmet. These autonomous units serve as Tony Stark's peacekeeping force, designed to protect the world without direct human intervention.",
    description_de: "Iron Legion-Drohne hat einen dunkelblauen Kopf mit einteiligem Helm. Diese autonomen Einheiten dienen als Tony Starks Friedenstruppe, entworfen um die Welt ohne direkte menschliche Intervention zu schützen.",
    description_fr: "Le drone de la Légion de Fer présente une tête bleu foncé avec un casque d'une seule pièce. Ces unités autonomes servent de force de maintien de la paix de Tony Stark, conçues pour protéger le monde sans intervention humaine directe.",
    description_es: "El dron de la Legión de Hierro presenta cabeza azul oscuro con casco de una pieza. Estas unidades autónomas sirven como fuerza de paz de Tony Stark, diseñadas para proteger el mundo sin intervención humana directa."
  },
  {
    minifigure_no: 'sh0984',
    description_en: "Venom with scarf showcases a unique take on the symbiote villain. The accessory adds personality to Eddie Brock's alien-enhanced form as Spider-Man's most dangerous adversary.",
    description_de: "Venom mit Schal zeigt eine einzigartige Interpretation des Symbioten-Bösewichts. Das Accessoire verleiht Eddie Brocks außerirdisch verstärkter Form als Spider-Mans gefährlichstem Gegner Persönlichkeit.",
    description_fr: "Venom avec écharpe présente une interprétation unique du méchant symbiote. L'accessoire ajoute de la personnalité à la forme améliorée par l'alien d'Eddie Brock en tant qu'adversaire le plus dangereux de Spider-Man.",
    description_es: "Venom con bufanda muestra una interpretación única del villano simbionte. El accesorio agrega personalidad a la forma mejorada por alienígenas de Eddie Brock como el adversario más peligroso de Spider-Man."
  },
  {
    minifigure_no: 'sh0985',
    description_en: "Spider-Man (Miles Morales) in holiday sweater with headphones brings festive spirit to the wall-crawler. This seasonal version shows Miles embracing his Brooklyn roots during the winter season.",
    description_de: "Spider-Man (Miles Morales) im Weihnachtspullover mit Kopfhörern bringt festliche Stimmung zum Wandkletterer. Diese saisonale Version zeigt Miles, wie er seine Brooklyn-Wurzeln während der Wintersaison annimmt.",
    description_fr: "Spider-Man (Miles Morales) en pull de fête avec des écouteurs apporte un esprit festif au grimpeur de murs. Cette version saisonnière montre Miles embrassant ses racines de Brooklyn pendant la saison hivernale.",
    description_es: "Spider-Man (Miles Morales) en suéter festivo con auriculares trae espíritu festivo al trepador de paredes. Esta versión estacional muestra a Miles abrazando sus raíces de Brooklyn durante la temporada de invierno."
  },
  {
    minifigure_no: 'sh0986',
    description_en: "Batman from the Classic TV Series features goggles, light bluish gray torso, and flexible rubber cape. This Adam West-inspired version captures the campy 1960s aesthetic of the beloved television show.",
    description_de: "Batman aus der klassischen TV-Serie hat eine Brille, einen hellblaugrauen Torso und einen flexiblen Gummi-Umhang. Diese von Adam West inspirierte Version fängt die campy 1960er-Ästhetik der beliebten Fernsehshow ein.",
    description_fr: "Batman de la série télévisée classique présente des lunettes, un torse gris bleuté clair et une cape en caoutchouc flexible. Cette version inspirée d'Adam West capture l'esthétique camp des années 1960 de l'émission télévisée bien-aimée.",
    description_es: "Batman de la serie de TV clásica presenta gafas, torso gris azulado claro y capa de goma flexible. Esta versión inspirada en Adam West captura la estética camp de los años 60 del amado programa de televisión."
  },
  {
    minifigure_no: 'sh0987',
    description_en: "War Machine in pearl dark gray and silver armor features neck bracket with ingot and plate with clip. James Rhodes' heavily armed suit provides firepower support for Iron Man with advanced weapons systems.",
    description_de: "War Machine in perlgrauer und silberner Rüstung hat eine Halshalterung mit Barren und Platte mit Clip. James Rhodes' schwer bewaffneter Anzug bietet Feuerkraft-Unterstützung für Iron Man mit fortschrittlichen Waffensystemen.",
    description_fr: "War Machine en armure gris foncé perlé et argentée présente un support de cou avec lingot et plaque avec clip. La combinaison lourdement armée de James Rhodes fournit un soutien de puissance de feu pour Iron Man avec des systèmes d'armes avancés.",
    description_es: "War Machine en armadura gris oscuro perlado y plateada presenta soporte de cuello con lingote y placa con clip. El traje fuertemente armado de James Rhodes proporciona apoyo de potencia de fuego para Iron Man con sistemas de armas avanzados."
  },
  {
    minifigure_no: 'sh0988',
    description_en: "Batman in black suit with yellow belt features cowl with white eyes and flexible rubber cape. This classic design emphasizes the Dark Knight's stealth capabilities with dramatic soft goods cape for dynamic poses.",
    description_de: "Batman im schwarzen Anzug mit gelbem Gürtel hat eine Kapuze mit weißen Augen und flexiblem Gummi-Umhang. Dieses klassische Design betont die Heimlichkeitsfähigkeiten des Dunklen Ritters mit dramatischem Stoffumhang für dynamische Posen.",
    description_fr: "Batman en costume noir avec ceinture jaune présente une cagoule avec des yeux blancs et une cape en caoutchouc flexible. Ce design classique met l'accent sur les capacités furtives du Dark Knight avec une cape en tissu dramatique pour des poses dynamiques.",
    description_es: "Batman en traje negro con cinturón amarillo presenta capucha con ojos blancos y capa de goma flexible. Este diseño clásico enfatiza las capacidades sigilosas del Caballero Oscuro con capa de tela dramática para poses dinámicas."
  },
  {
    minifigure_no: 'sh0989',
    description_en: "Wolverine with hair and blue hands represents Logan's iconic X-Men appearance. The mutant with adamantium claws brings berserker rage and healing factor to the team of gifted individuals.",
    description_de: "Wolverine mit Haaren und blauen Händen repräsentiert Logans ikonisches X-Men-Aussehen. Der Mutant mit Adamantium-Klauen bringt Berserker-Wut und Heilfaktor zum Team begabter Individuen.",
    description_fr: "Wolverine avec des cheveux et des mains bleues représente l'apparence emblématique des X-Men de Logan. Le mutant avec des griffes en adamantium apporte une rage de berserker et un facteur de guérison à l'équipe d'individus doués.",
    description_es: "Wolverine con cabello y manos azules representa la icónica apariencia de Logan en X-Men. El mutante con garras de adamantium aporta furia berserker y factor de curación al equipo de individuos dotados."
  },
  {
    minifigure_no: 'sh0990',
    description_en: "Professor X (Charles Francis Xavier) in dark blue suit represents the telepathic founder of the X-Men. The world's most powerful telepath leads his team of mutants from his wheelchair while promoting peaceful coexistence.",
    description_de: "Professor X (Charles Francis Xavier) im dunkelblauen Anzug repräsentiert den telepathischen Gründer der X-Men. Der mächtigste Telepath der Welt führt sein Team von Mutanten aus seinem Rollstuhl, während er friedliche Koexistenz fördert.",
    description_fr: "Le Professeur X (Charles Francis Xavier) en costume bleu foncé représente le fondateur télépathique des X-Men. Le télépathe le plus puissant du monde dirige son équipe de mutants depuis son fauteuil roulant tout en promouvant la coexistence pacifique.",
    description_es: "El Profesor X (Charles Francis Xavier) en traje azul oscuro representa al fundador telepático de los X-Men. El telépata más poderoso del mundo lidera su equipo de mutantes desde su silla de ruedas mientras promueve la coexistencia pacífica."
  },
  {
    minifigure_no: 'sh0991',
    description_en: "Jean Grey showcases one of the X-Men's most powerful members with telepathic and telekinetic abilities. This Phoenix Force host balances immense cosmic power with her humanity as a founding X-Man.",
    description_de: "Jean Grey zeigt eines der mächtigsten Mitglieder der X-Men mit telepathischen und telekinetischen Fähigkeiten. Diese Phoenix Force-Trägerin balanciert immense kosmische Kraft mit ihrer Menschlichkeit als Gründungs-X-Man.",
    description_fr: "Jean Grey présente l'un des membres les plus puissants des X-Men avec des capacités télépathiques et télékinétiques. Cette hôte de la Force Phoenix équilibre une puissance cosmique immense avec son humanité en tant que X-Man fondateur.",
    description_es: "Jean Grey muestra a uno de los miembros más poderosos de los X-Men con habilidades telepáticas y telequinéticas. Esta anfitriona de la Fuerza Fénix equilibra un inmenso poder cósmico con su humanidad como X-Man fundador."
  },
  {
    minifigure_no: 'sh0992',
    description_en: "Cyclops in blue outfit with printed legs represents Scott Summers' leadership of the X-Men. His signature ruby-quartz visor contains the devastating optic blasts that make him one of mutantkind's tactical commanders.",
    description_de: "Cyclops im blauen Outfit mit bedruckten Beinen repräsentiert Scott Summers' Führung der X-Men. Sein charakteristisches Rubinquarz-Visier enthält die verheerenden Augenstrahlen, die ihn zu einem der taktischen Kommandeure der Mutanten machen.",
    description_fr: "Cyclope en tenue bleue avec des jambes imprimées représente le leadership de Scott Summers des X-Men. Sa visière signature en quartz rubis contient les explosions optiques dévastatrices qui font de lui l'un des commandants tactiques des mutants.",
    description_es: "Cíclope en traje azul con piernas impresas representa el liderazgo de Scott Summers de los X-Men. Su característica visera de cuarzo rubí contiene las devastadoras explosiones ópticas que lo convierten en uno de los comandantes tácticos de los mutantes."
  },
  {
    minifigure_no: 'sh0993',
    description_en: "Storm in white suit with long hair represents Ororo Munroe's weather-controlling powers. The omega-level mutant commands wind, rain, and lightning as one of the X-Men's most powerful members.",
    description_de: "Storm im weißen Anzug mit langen Haaren repräsentiert Ororo Munroes wetterbeherrschende Kräfte. Die Omega-Level-Mutantin befehligt Wind, Regen und Blitz als eines der mächtigsten Mitglieder der X-Men.",
    description_fr: "Tornade en costume blanc avec de longs cheveux représente les pouvoirs de contrôle météorologique d'Ororo Munroe. La mutante de niveau oméga commande le vent, la pluie et la foudre en tant que l'un des membres les plus puissants des X-Men.",
    description_es: "Tormenta en traje blanco con cabello largo representa los poderes de control del clima de Ororo Munroe. La mutante de nivel omega comanda viento, lluvia y relámpago como uno de los miembros más poderosos de los X-Men."
  },
  {
    minifigure_no: 'sh0994',
    description_en: "Gambit showcases Remy LeBeau's card-throwing mutant abilities. The Cajun charmer kinetically charges objects, typically playing cards, turning them into explosive projectiles for the X-Men.",
    description_de: "Gambit zeigt Remy LeBeaus kartentwerfende Mutantenfähigkeiten. Der Cajun-Charmeur lädt Objekte kinetisch auf, typischerweise Spielkarten, und verwandelt sie in explosive Geschosse für die X-Men.",
    description_fr: "Gambit présente les capacités mutantes de lancer de cartes de Remy LeBeau. Le charmeur cajun charge cinétiquement des objets, généralement des cartes à jouer, les transformant en projectiles explosifs pour les X-Men.",
    description_es: "Gambit muestra las habilidades mutantes de lanzamiento de cartas de Remy LeBeau. El encantador cajún carga objetos cinéticamente, típicamente naipes, convirtiéndolos en proyectiles explosivos para los X-Men."
  },
  {
    minifigure_no: 'sh0995',
    description_en: "Iceman with medium blue eyes and mouth represents Bobby Drake's thermokinetic powers. This omega-level mutant creates ice constructs and freezes opponents as one of the original X-Men members.",
    description_de: "Iceman mit mittelblauen Augen und Mund repräsentiert Bobby Drakes thermokinetische Kräfte. Dieser Omega-Level-Mutant erschafft Eis-Konstrukte und friert Gegner ein als eines der ursprünglichen X-Men-Mitglieder.",
    description_fr: "Iceman avec des yeux et une bouche bleu moyen représente les pouvoirs thermocinétiques de Bobby Drake. Ce mutant de niveau oméga crée des constructions de glace et gèle les adversaires en tant que l'un des membres originaux des X-Men.",
    description_es: "Iceman con ojos y boca azul medio representa los poderes termocinéticos de Bobby Drake. Este mutante de nivel omega crea construcciones de hielo y congela a los oponentes como uno de los miembros originales de los X-Men."
  },
  {
    minifigure_no: 'sh0996',
    description_en: "Bishop brings time-traveling mutant abilities to the X-Men. Lucas Bishop absorbs and redirects energy attacks with his distinctive M branding, coming from a dystopian future to prevent catastrophe.",
    description_de: "Bishop bringt zeitreisende Mutantenfähigkeiten zu den X-Men. Lucas Bishop absorbiert und leitet Energie-Angriffe mit seinem markanten M-Brandzeichen um und kommt aus einer dystopischen Zukunft, um eine Katastrophe zu verhindern.",
    description_fr: "Bishop apporte des capacités mutantes de voyage dans le temps aux X-Men. Lucas Bishop absorbe et redirige les attaques énergétiques avec son marquage M distinctif, venant d'un futur dystopique pour empêcher une catastrophe.",
    description_es: "Bishop aporta habilidades mutantes de viaje en el tiempo a los X-Men. Lucas Bishop absorbe y redirige ataques de energía con su distintiva marca M, viniendo de un futuro distópico para prevenir una catástrofe."
  },
  {
    minifigure_no: 'sh0997',
    description_en: "Magneto in red outfit with flexible rubber cape represents Erik Lehnsherr's magnetic powers. The Master of Magnetism leads the Brotherhood of Mutants, advocating mutant supremacy as Xavier's philosophical counterpoint.",
    description_de: "Magneto im roten Outfit mit flexiblem Gummi-Umhang repräsentiert Erik Lehnsherrs magnetische Kräfte. Der Meister des Magnetismus führt die Bruderschaft der Mutanten an und befürwortet Mutanten-Suprematie als Xaviers philosophisches Gegengewicht.",
    description_fr: "Magnéto en tenue rouge avec cape en caoutchouc flexible représente les pouvoirs magnétiques d'Erik Lehnsherr. Le Maître du Magnétisme dirige la Confrérie des Mutants, prônant la suprématie mutante comme contrepoint philosophique de Xavier.",
    description_es: "Magneto en traje rojo con capa de goma flexible representa los poderes magnéticos de Erik Lehnsherr. El Maestro del Magnetismo lidera la Hermandad de Mutantes, defendiendo la supremacía mutante como contrapunto filosófico de Xavier."
  },
  {
    minifigure_no: 'sh0998',
    description_en: "Professor X in black vest shows Charles Xavier in more casual attire. The telepathic leader continues mentoring young mutants at his School for Gifted Youngsters despite his more relaxed appearance.",
    description_de: "Professor X in schwarzer Weste zeigt Charles Xavier in lässigerer Kleidung. Der telepathische Anführer betreut weiterhin junge Mutanten an seiner Schule für begabte Jugendliche trotz seines entspannteren Aussehens.",
    description_fr: "Le Professeur X en gilet noir montre Charles Xavier dans une tenue plus décontractée. Le leader télépathique continue de mentorer les jeunes mutants à son École pour Jeunes Surdoués malgré son apparence plus détendue.",
    description_es: "El Profesor X en chaleco negro muestra a Charles Xavier en atuendo más casual. El líder telepático continúa siendo mentor de jóvenes mutantes en su Escuela para Jóvenes Dotados a pesar de su apariencia más relajada."
  },
  {
    minifigure_no: 'sh0999',
    description_en: "Captain America (Sam Wilson) in dark blue and white suit represents the Falcon's ascension to the shield. Sam takes up Steve Rogers' legacy, bringing aerial combat skills and moral leadership to the Captain America mantle.",
    description_de: "Captain America (Sam Wilson) im dunkelblauen und weißen Anzug repräsentiert Falcons Aufstieg zum Schild. Sam übernimmt Steve Rogers' Vermächtnis und bringt Luftkampf-Fähigkeiten und moralische Führung zur Captain America-Mantel.",
    description_fr: "Captain America (Sam Wilson) en costume bleu foncé et blanc représente l'ascension du Faucon au bouclier. Sam reprend l'héritage de Steve Rogers, apportant des compétences de combat aérien et un leadership moral au manteau de Captain America.",
    description_es: "Capitán América (Sam Wilson) en traje azul oscuro y blanco representa el ascenso del Halcón al escudo. Sam asume el legado de Steve Rogers, aportando habilidades de combate aéreo y liderazgo moral al manto de Capitán América."
  },
  {
    minifigure_no: 'sh1000',
    description_en: "Falcon (Joaquín Torres) with backpack and wings without stickers represents the new Falcon taking Sam Wilson's previous role. This young hero brings fresh perspective to the aerial hero legacy with his high-tech flight equipment.",
    description_de: "Falcon (Joaquín Torres) mit Rucksack und Flügeln ohne Aufkleber repräsentiert den neuen Falcon, der Sam Wilsons frühere Rolle übernimmt. Dieser junge Held bringt frische Perspektive zum Lufthelden-Vermächtnis mit seiner High-Tech-Flugausrüstung.",
    description_fr: "Falcon (Joaquín Torres) avec sac à dos et ailes sans autocollants représente le nouveau Faucon prenant le rôle précédent de Sam Wilson. Ce jeune héros apporte une perspective fraîche à l'héritage du héros aérien avec son équipement de vol high-tech.",
    description_es: "Halcón (Joaquín Torres) con mochila y alas sin calcomanías representa al nuevo Halcón asumiendo el papel anterior de Sam Wilson. Este joven héroe aporta una perspectiva fresca al legado del héroe aéreo con su equipo de vuelo de alta tecnología."
  }
];

async function updateDescriptions() {
  console.log(`Starting batch update: sh0976-sh1000 (${descriptions.length} minifigures)`);

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
