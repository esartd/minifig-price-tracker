import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch10 = [
  {
    minifigure_no: 'sw0042',
    name: 'Jango Fett',
    description_en: 'Jango Fett, the legendary Mandalorian bounty hunter and genetic template for the Clone Army, represents one of the most iconic characters in Star Wars lore. This minifigure features Jango\'s distinctive blue and silver Mandalorian armor with detailed printing, unique helmet design, dual blaster pistols, and jetpack. Released in 2002 with Attack of the Clones sets, this captures Temuera Morrison\'s portrayal of the galaxy\'s most feared bounty hunter. Collectors highly prize Jango Fett for his crucial role as the genetic source of all Clone Troopers and his tragic final duel with Mace Windu. His Mandalorian heritage and combat prowess make him essential for any Star Wars collection.',
    description_de: 'Jango Fett, der legendäre mandalorianische Kopfgeldjäger und genetische Vorlage für die Klonarmee, repräsentiert einen der ikonischsten Charaktere in der Star Wars Überlieferung. Diese Minifigur zeigt Jangos charakteristische blau-silberne mandalorianische Rüstung mit detailliertem Druck, einzigartiges Helmdesign, duale Blasterpistolen und Jetpack. 2002 mit Angriff-der-Klonkrieger-Sets veröffentlicht, erfasst dies Temuera Morrisons Darstellung des am meisten gefürchteten Kopfgeldjägers der Galaxis. Sammler schätzen Jango Fett sehr für seine entscheidende Rolle als genetische Quelle aller Klontruppen und sein tragisches finales Duell mit Mace Windu. Sein mandalorianisches Erbe und seine Kampffähigkeit machen ihn unverzichtbar für jede Star Wars Sammlung.',
    description_fr: 'Jango Fett, le légendaire chasseur de primes Mandalorien et modèle génétique pour l\'Armée des Clones, représente l\'un des personnages les plus emblématiques de la tradition Star Wars. Cette minifigurine présente l\'armure Mandalorienne bleue et argentée distinctive de Jango avec des impressions détaillées, un design de casque unique, des pistolets blasters doubles et un jetpack. Sortie en 2002 avec les sets de L\'Attaque des Clones, cela capture l\'interprétation de Temuera Morrison du chasseur de primes le plus redouté de la galaxie. Les collectionneurs apprécient grandement Jango Fett pour son rôle crucial en tant que source génétique de tous les Soldats Clones et son duel final tragique avec Mace Windu. Son héritage Mandalorien et ses prouesses au combat le rendent essentiel pour toute collection Star Wars.',
    description_es: 'Jango Fett, el legendario cazarrecompensas Mandaloriano y plantilla genética para el Ejército Clon, representa uno de los personajes más icónicos en la tradición de Star Wars. Esta minifigura presenta la distintiva armadura Mandaloriana azul y plateada de Jango con impresiones detalladas, diseño único de casco, pistolas bláster duales y mochila propulsora. Lanzado en 2002 con sets de El Ataque de los Clones, esto captura la interpretación de Temuera Morrison del cazarrecompensas más temido de la galaxia. Los coleccionistas valoran mucho a Jango Fett por su papel crucial como fuente genética de todos los Soldados Clon y su trágico duelo final con Mace Windu. Su herencia Mandaloriana y destreza en combate lo hacen esencial para cualquier colección Star Wars.'
  },
  {
    minifigure_no: 'sw0043',
    name: 'Boba Fett (Young)',
    description_en: 'Young Boba Fett represents the unaltered clone and son of Jango Fett before he became the galaxy\'s most feared bounty hunter. This minifigure features Boba as a child with his distinctive face matching his father, simple clothing, and innocent appearance. Released in 2002, this captures Daniel Logan\'s portrayal from Attack of the Clones. Collectors value this variant for showing Boba\'s tragic origins on Kamino and witnessing his father\'s death on Geonosis. This traumatic moment shaped him into the legendary Mandalorian warrior. Essential for Kamino cloning facility displays and the tragic Geonosis arena battle where young Boba lost everything.',
    description_de: 'Der junge Boba Fett repräsentiert den unveränderten Klon und Sohn von Jango Fett, bevor er zum gefürchtetsten Kopfgeldjäger der Galaxis wurde. Diese Minifigur zeigt Boba als Kind mit seinem charakteristischen Gesicht, das seinem Vater entspricht, einfacher Kleidung und unschuldigem Aussehen. 2002 veröffentlicht, erfasst dies Daniel Logans Darstellung aus Angriff der Klonkrieger. Sammler schätzen diese Variante dafür, dass sie Bobas tragische Ursprünge auf Kamino zeigt und Zeuge des Todes seines Vaters auf Geonosis wird. Dieser traumatische Moment formte ihn zum legendären mandalorianischen Krieger. Unverzichtbar für Kamino-Klonanlage-Displays und die tragische Geonosis-Arena-Schlacht, bei der der junge Boba alles verlor.',
    description_fr: 'Le jeune Boba Fett représente le clone non altéré et fils de Jango Fett avant qu\'il ne devienne le chasseur de primes le plus redouté de la galaxie. Cette minifigurine présente Boba enfant avec son visage distinctif ressemblant à son père, des vêtements simples et une apparence innocente. Sortie en 2002, cela capture l\'interprétation de Daniel Logan dans L\'Attaque des Clones. Les collectionneurs apprécient cette variante pour montrer les origines tragiques de Boba sur Kamino et être témoin de la mort de son père sur Geonosis. Ce moment traumatisant l\'a façonné en guerrier Mandalorien légendaire. Essentielle pour les expositions de l\'installation de clonage de Kamino et la bataille tragique de l\'arène de Geonosis où le jeune Boba a tout perdu.',
    description_es: 'El joven Boba Fett representa al clon no alterado e hijo de Jango Fett antes de convertirse en el cazarrecompensas más temido de la galaxia. Esta minifigura presenta a Boba como niño con su rostro distintivo coincidente con su padre, ropa simple y apariencia inocente. Lanzado en 2002, esto captura la interpretación de Daniel Logan en El Ataque de los Clones. Los coleccionistas valoran esta variante por mostrar los orígenes trágicos de Boba en Kamino y presenciar la muerte de su padre en Geonosis. Este momento traumático lo moldeó en el legendario guerrero Mandaloriano. Esencial para exhibiciones de instalaciones de clonación de Kamino y la trágica batalla del arena de Geonosis donde el joven Boba lo perdió todo.'
  },
  {
    minifigure_no: 'sw0044',
    name: 'Clone Trooper (Phase I)',
    description_en: 'The Phase I Clone Trooper represents the Republic\'s elite soldiers during the early Clone Wars, genetically identical warriors bred from Jango Fett. This minifigure features distinctive white armor with Phase I helmet design, simplified waist printing, and DC-15 blaster rifle. Released in 2002, these troopers launched an entire army-building phenomenon among LEGO collectors. The Phase I armor with its rounded helmet and blue accents distinguishes it from later Phase II designs. Collectors amass large battalions of Clone Troopers to recreate epic battles from Attack of the Clones and The Clone Wars. Essential for Geonosis battle recreations and Republic military displays.',
    description_de: 'Der Phase-I-Klontruppler repräsentiert die Elite-Soldaten der Republik während der frühen Klonkriege, genetisch identische Krieger, die von Jango Fett gezüchtet wurden. Diese Minifigur zeigt charakteristische weiße Rüstung mit Phase-I-Helmdesign, vereinfachtem Taillendruck und DC-15-Blastergewehr. 2002 veröffentlicht, lösten diese Truppler ein ganzes Armeeaufbau-Phänomen unter LEGO Sammlern aus. Die Phase-I-Rüstung mit ihrem abgerundeten Helm und blauen Akzenten unterscheidet sie von späteren Phase-II-Designs. Sammler häufen große Bataillone von Klontruplern an, um epische Schlachten aus Angriff der Klonkrieger und The Clone Wars nachzustellen. Unverzichtbar für Geonosis-Schlacht-Nachstellungen und Republik-Militär-Displays.',
    description_fr: 'Le Soldat Clone Phase I représente les soldats d\'élite de la République pendant les premières Guerres des Clones, des guerriers génétiquement identiques issus de Jango Fett. Cette minifigurine présente une armure blanche distinctive avec un design de casque Phase I, une impression de taille simplifiée et un fusil blaster DC-15. Sortie en 2002, ces soldats ont lancé un phénomène entier de construction d\'armée parmi les collectionneurs LEGO. L\'armure Phase I avec son casque arrondi et ses accents bleus la distingue des designs Phase II ultérieurs. Les collectionneurs accumulent de grands bataillons de Soldats Clones pour recréer des batailles épiques de L\'Attaque des Clones et The Clone Wars. Essentiels pour les recréations de bataille de Geonosis et les expositions militaires de la République.',
    description_es: 'El Soldado Clon Fase I representa a los soldados de élite de la República durante las primeras Guerras Clon, guerreros genéticamente idénticos criados de Jango Fett. Esta minifigura presenta armadura blanca distintiva con diseño de casco Fase I, impresión de cintura simplificada y rifle bláster DC-15. Lanzados en 2002, estos soldados lanzaron todo un fenómeno de construcción de ejércitos entre los coleccionistas LEGO. La armadura Fase I con su casco redondeado y acentos azules la distingue de diseños Fase II posteriores. Los coleccionistas acumulan grandes batallones de Soldados Clon para recrear batallas épicas de El Ataque de los Clones y The Clone Wars. Esenciales para recreaciones de batalla de Geonosis y exhibiciones militares de la República.'
  },
  {
    minifigure_no: 'sw0045',
    name: 'Count Dooku',
    description_en: 'Count Dooku, also known as Darth Tyranus, represents the fallen Jedi Master who became a Sith Lord and leader of the Separatist Alliance. This minifigure features Dooku\'s distinctive curved lightsaber hilt, elegant black cape, white hair, and aristocratic appearance. Released in 2002, this captures Christopher Lee\'s commanding portrayal of the sophisticated villain. Collectors value Count Dooku for his unique weapon design and pivotal role as Palpatine\'s apprentice before Darth Vader. His mastery of Form II lightsaber combat and political manipulation make him a formidable antagonist. Essential for recreating the Geonosis hangar duel with Anakin and Obi-Wan.',
    description_de: 'Graf Dooku, auch bekannt als Darth Tyranus, repräsentiert den gefallenen Jedi-Meister, der ein Sith-Lord und Anführer der Separatistenallianz wurde. Diese Minifigur zeigt Dookus charakteristischen gebogenen Lichtschwertkampfgriff, eleganten schwarzen Umhang, weißes Haar und aristokratisches Aussehen. 2002 veröffentlicht, erfasst dies Christopher Lees kommandierende Darstellung des raffinierten Schurken. Sammler schätzen Graf Dooku für sein einzigartiges Waffendesign und zentrale Rolle als Palpatines Schüler vor Darth Vader. Seine Beherrschung des Form-II-Lichtschwertkampfes und politischen Manipulation machen ihn zu einem furchteinflößenden Antagonisten. Unverzichtbar für die Nachstellung des Geonosis-Hangar-Duells mit Anakin und Obi-Wan.',
    description_fr: 'Le Comte Dooku, également connu sous le nom de Dark Tyranus, représente le Maître Jedi déchu devenu Seigneur Sith et leader de l\'Alliance Séparatiste. Cette minifigurine présente la poignée de sabre laser courbée distinctive de Dooku, une cape noire élégante, des cheveux blancs et une apparence aristocratique. Sortie en 2002, cela capture l\'interprétation commandante de Christopher Lee du méchant sophistiqué. Les collectionneurs apprécient le Comte Dooku pour son design d\'arme unique et son rôle pivot en tant qu\'apprenti de Palpatine avant Dark Vador. Sa maîtrise du combat au sabre laser Forme II et sa manipulation politique en font un antagoniste formidable. Essentiel pour recréer le duel du hangar de Geonosis avec Anakin et Obi-Wan.',
    description_es: 'El Conde Dooku, también conocido como Darth Tyranus, representa al Maestro Jedi caído que se convirtió en Señor Sith y líder de la Alianza Separatista. Esta minifigura presenta el distintivo mango curvado de sable de luz de Dooku, elegante capa negra, cabello blanco y apariencia aristocrática. Lanzado en 2002, esto captura la imponente interpretación de Christopher Lee del sofisticado villano. Los coleccionistas valoran al Conde Dooku por su diseño único de arma y papel fundamental como aprendiz de Palpatine antes de Darth Vader. Su maestría del combate de sable de luz Forma II y manipulación política lo convierten en un antagonista formidable. Esencial para recrear el duelo del hangar de Geonosis con Anakin y Obi-Wan.'
  },
  {
    minifigure_no: 'sw0046',
    name: 'Mace Windu',
    description_en: 'Mace Windu, the legendary Jedi Master and member of the Jedi High Council, wields one of the most iconic lightsabers in Star Wars history. This minifigure features Mace\'s distinctive bald head, brown Jedi robes, stern expression, and his unique purple lightsaber blade. Released in 2002, this captures Samuel L. Jackson\'s powerful portrayal of one of the Order\'s greatest warriors. Collectors highly prize Mace Windu for his exceptional combat skills and his pivotal duel with Emperor Palpatine. His death at Palpatine\'s hands marked the tragic fall of the Jedi Order. Essential for Geonosis arena battles and the fateful confrontation in Palpatine\'s office.',
    description_de: 'Mace Windu, der legendäre Jedi-Meister und Mitglied des Hohen Jedi-Rates, führt eines der ikonischsten Lichtschwerter in der Star Wars Geschichte. Diese Minifigur zeigt Maces charakteristischen kahlen Kopf, braune Jedi-Roben, strengen Ausdruck und sein einzigartiges violettes Lichtschwert. 2002 veröffentlicht, erfasst dies Samuel L. Jacksons kraftvolle Darstellung eines der größten Krieger des Ordens. Sammler schätzen Mace Windu sehr für seine außergewöhnlichen Kampffähigkeiten und sein entscheidendes Duell mit Imperator Palpatine. Sein Tod durch Palpatines Hand markierte den tragischen Fall des Jedi-Ordens. Unverzichtbar für Geonosis-Arena-Kämpfe und die schicksalhafte Konfrontation in Palpatines Büro.',
    description_fr: 'Mace Windu, le légendaire Maître Jedi et membre du Haut Conseil Jedi, manie l\'un des sabres laser les plus emblématiques de l\'histoire de Star Wars. Cette minifigurine présente la tête chauve distinctive de Mace, des robes Jedi brunes, une expression sévère et sa lame de sabre laser violette unique. Sortie en 2002, cela capture l\'interprétation puissante de Samuel L. Jackson de l\'un des plus grands guerriers de l\'Ordre. Les collectionneurs apprécient grandement Mace Windu pour ses compétences de combat exceptionnelles et son duel pivot avec l\'Empereur Palpatine. Sa mort aux mains de Palpatine a marqué la chute tragique de l\'Ordre Jedi. Essentiel pour les batailles de l\'arène de Geonosis et la confrontation fatidique dans le bureau de Palpatine.',
    description_es: 'Mace Windu, el legendario Maestro Jedi y miembro del Alto Consejo Jedi, empuña uno de los sables de luz más icónicos en la historia de Star Wars. Esta minifigura presenta la distintiva cabeza calva de Mace, túnicas Jedi marrones, expresión severa y su única hoja de sable de luz púrpura. Lanzado en 2002, esto captura la poderosa interpretación de Samuel L. Jackson de uno de los más grandes guerreros de la Orden. Los coleccionistas valoran mucho a Mace Windu por sus excepcionales habilidades de combate y su duelo fundamental con el Emperador Palpatine. Su muerte a manos de Palpatine marcó la trágica caída de la Orden Jedi. Esencial para batallas del arena de Geonosis y la fatídica confrontación en la oficina de Palpatine.'
  }
];

async function saveBatch() {
  console.log('💾 Saving batch 10 (sw0042-sw0046)...\n');
  
  for (const minifig of batch10) {
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
  
  console.log('\n✨ Batch 10 complete! Total: 45 minifigs (180 descriptions)\n');
  await prisma.$disconnect();
}

saveBatch().catch(console.error);
