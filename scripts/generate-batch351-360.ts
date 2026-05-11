import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    no: 'sw0459',
    name: 'Bail Organa',
    en: 'Bail Organa is the Senator of Alderaan and adoptive father of Princess Leia who helps hide the Skywalker twins at the end of Revenge of the Sith. This minifigure depicts the noble senator in his formal Alderaanian attire. As one of the founders of the Rebel Alliance alongside Mon Mothma, Bail represents the Republic loyalists who resisted the Empire. Released in limited Episode III sets, this minifigure is valued by collectors for his crucial role in protecting Leia and establishing the Rebellion.',
    de: 'Bail Organa ist der Senator von Alderaan und Adoptivvater von Prinzessin Leia, der am Ende von Die Rache der Sith hilft, die Skywalker-Zwillinge zu verstecken. Diese Minifigur zeigt den edlen Senator in seiner formellen Alderaanischen Kleidung. Als einer der Gründer der Rebellenallianz neben Mon Mothma repräsentiert Bail die Republik-Loyalisten, die dem Imperium widerstanden. Veröffentlicht in begrenzten Episode III-Sets, wird diese Minifigur von Sammlern wegen seiner entscheidenden Rolle beim Schutz von Leia und der Gründung der Rebellion geschätzt.',
    fr: 'Bail Organa est le Sénateur d\'Alderaan et père adoptif de la Princesse Leia qui aide à cacher les jumeaux Skywalker à la fin de La Revanche des Sith. Cette minifigurine dépeint le noble sénateur dans sa tenue formelle Alderaanienne. En tant que l\'un des fondateurs de l\'Alliance Rebelle aux côtés de Mon Mothma, Bail représente les loyalistes de la République qui ont résisté à l\'Empire. Sortie dans des sets Épisode III limités, cette minifigurine est appréciée par les collectionneurs pour son rôle crucial dans la protection de Leia et l\'établissement de la Rébellion.',
    es: 'Bail Organa es el Senador de Alderaan y padre adoptivo de la Princesa Leia que ayuda a esconder a los gemelos Skywalker al final de La Venganza de los Sith. Esta minifigura representa al noble senador en su atuendo formal Alderaaniano. Como uno de los fundadores de la Alianza Rebelde junto a Mon Mothma, Bail representa a los leales de la República que resistieron al Imperio. Lanzada en sets limitados del Episodio III, esta minifigura es valorada por coleccionistas por su papel crucial en proteger a Leia y establecer la Rebelión.'
  },
  {
    no: 'sw0460',
    name: 'Chewbacca - Episode III',
    en: 'Chewbacca fights alongside Yoda to defend Kashyyyk from the Separatist invasion in Revenge of the Sith, establishing his connection to the Jedi Master. This minifigure depicts the younger Wookiee warrior with brown fur, bandolier, and bowcaster. Fighting to protect his homeworld and later helping Yoda escape Order 66, this version represents Chewbacca before meeting Han Solo. Released in various Kashyyyk battle sets, this variant shows Chewie as a Wookiee freedom fighter.',
    de: 'Chewbacca kämpft an Yodas Seite, um Kashyyyk vor der Separatisten-Invasion in Die Rache der Sith zu verteidigen, und etabliert seine Verbindung zum Jedi-Meister. Diese Minifigur zeigt den jüngeren Wookiee-Krieger mit braunem Fell, Bandolier und Bowcaster. Kämpfend, um seine Heimatwelt zu schützen und später Yoda bei der Flucht vor Order 66 helfend, repräsentiert diese Version Chewbacca vor dem Treffen mit Han Solo. Veröffentlicht in verschiedenen Kashyyyk-Schlacht-Sets, zeigt diese Variante Chewie als Wookiee-Freiheitskämpfer.',
    fr: 'Chewbacca combat aux côtés de Yoda pour défendre Kashyyyk contre l\'invasion Séparatiste dans La Revanche des Sith, établissant sa connexion au Maître Jedi. Cette minifigurine dépeint le jeune guerrier Wookiee avec fourrure brune, bandoulière, et arbalète. Combattant pour protéger son monde natal et aidant plus tard Yoda à échapper à l\'Ordre 66, cette version représente Chewbacca avant de rencontrer Han Solo. Sortie dans divers sets de bataille de Kashyyyk, cette variante montre Chewie comme un combattant de la liberté Wookiee.',
    es: 'Chewbacca lucha junto a Yoda para defender Kashyyyk de la invasión Separatista en La Venganza de los Sith, estableciendo su conexión con el Maestro Jedi. Esta minifigura representa al joven guerrero Wookiee con pelaje marrón, bandolera y ballesta. Luchando para proteger su mundo natal y más tarde ayudando a Yoda a escapar de la Orden 66, esta versión representa a Chewbacca antes de conocer a Han Solo. Lanzada en varios sets de batalla de Kashyyyk, esta variante muestra a Chewie como un luchador por la libertad Wookiee.'
  },
  {
    no: 'sw0461',
    name: 'Wookiee Warrior',
    en: 'Wookiee Warriors are the fierce defenders of Kashyyyk who fight alongside the Republic against the Separatist droid invasion in Revenge of the Sith. This minifigure depicts the tall, powerful species with brown fur, bandolier straps, and bowcaster weapons. Known for their strength and loyalty, Wookiees represent formidable allies in battle. Released in various Kashyyyk battle sets and army builder packs, these warriors are popular for building Wookiee armies and recreating the forest planet\'s defense.',
    de: 'Wookiee-Krieger sind die wilden Verteidiger von Kashyyyk, die an der Seite der Republik gegen die Separatisten-Droiden-Invasion in Die Rache der Sith kämpfen. Diese Minifigur zeigt die große, mächtige Spezies mit braunem Fell, Bandolier-Riemen und Bowcaster-Waffen. Bekannt für ihre Stärke und Loyalität, repräsentieren Wookiees beeindruckende Verbündete im Kampf. Veröffentlicht in verschiedenen Kashyyyk-Schlacht-Sets und Armee-Bauer-Paketen, sind diese Krieger beliebt für den Aufbau von Wookiee-Armeen und die Nachstellung der Verteidigung des Waldplaneten.',
    fr: 'Les Guerriers Wookiees sont les défenseurs féroces de Kashyyyk qui combattent aux côtés de la République contre l\'invasion droïde Séparatiste dans La Revanche des Sith. Cette minifigurine dépeint la grande espèce puissante avec fourrure brune, sangles de bandoulière, et armes arbalète. Connus pour leur force et leur loyauté, les Wookiees représentent des alliés formidables au combat. Sortie dans divers sets de bataille de Kashyyyk et packs de constructeurs d\'armée, ces guerriers sont populaires pour construire des armées Wookiee et recréer la défense de la planète forestière.',
    es: 'Los Guerreros Wookiee son los feroces defensores de Kashyyyk que luchan junto a la República contra la invasión droide Separatista en La Venganza de los Sith. Esta minifigura representa a la alta y poderosa especie con pelaje marrón, correas de bandolera y armas de ballesta. Conocidos por su fuerza y lealtad, los Wookiees representan aliados formidables en batalla. Lanzada en varios sets de batalla de Kashyyyk y paquetes de constructores de ejércitos, estos guerreros son populares para construir ejércitos Wookiee y recrear la defensa del planeta forestal.'
  },
  {
    no: 'sw0462',
    name: 'Tarfful',
    en: 'Tarfful is the Wookiee chieftain who leads the defense of Kashyyyk and helps Yoda escape after Order 66 in Revenge of the Sith. This minifigure depicts the distinguished Wookiee leader with darker fur, elaborate bandoliers, and ceremonial decorations denoting his status. As a key ally to the Jedi and protector of Kashyyyk, Tarfful represents the Wookiee leadership. Released in limited Kashyyyk battle sets, this named character is valued by collectors for his unique design and important role.',
    de: 'Tarfful ist der Wookiee-Häuptling, der die Verteidigung von Kashyyyk anführt und Yoda nach Order 66 in Die Rache der Sith bei der Flucht hilft. Diese Minifigur zeigt den angesehenen Wookiee-Anführer mit dunklerem Fell, aufwendigen Bandoliers und zeremoniellen Dekorationen, die seinen Status bezeichnen. Als wichtiger Verbündeter der Jedi und Beschützer von Kashyyyk repräsentiert Tarfful die Wookiee-Führung. Veröffentlicht in begrenzten Kashyyyk-Schlacht-Sets, wird dieser benannte Charakter von Sammlern wegen seines einzigartigen Designs und seiner wichtigen Rolle geschätzt.',
    fr: 'Tarfful est le chef Wookiee qui dirige la défense de Kashyyyk et aide Yoda à s\'échapper après l\'Ordre 66 dans La Revanche des Sith. Cette minifigurine dépeint le leader Wookiee distingué avec fourrure plus foncée, bandoulières élaborées, et décorations cérémonielles dénotant son statut. En tant qu\'allié clé des Jedi et protecteur de Kashyyyk, Tarfful représente le leadership Wookiee. Sortie dans des sets de bataille de Kashyyyk limités, ce personnage nommé est apprécié par les collectionneurs pour son design unique et son rôle important.',
    es: 'Tarfful es el jefe Wookiee que lidera la defensa de Kashyyyk y ayuda a Yoda a escapar después de la Orden 66 en La Venganza de los Sith. Esta minifigura representa al distinguido líder Wookiee con pelaje más oscuro, elaboradas bandoleras y decoraciones ceremoniales denotando su estatus. Como un aliado clave de los Jedi y protector de Kashyyyk, Tarfful representa el liderazgo Wookiee. Lanzada en sets limitados de batalla de Kashyyyk, este personaje nombrado es valorado por coleccionistas por su diseño único y papel importante.'
  },
  {
    no: 'sw0463',
    name: 'Tion Medon',
    en: 'Tion Medon is the Port Administrator of Pau City on Utapau who secretly warns Obi-Wan Kenobi about General Grievous\'s presence in Revenge of the Sith. This minifigure depicts the tall, pale Utapaun with elongated head, dark robes, and distinctive facial features. Despite appearing to serve the Separatists, Tion Medon aids the Republic by providing crucial intelligence. Released in limited Utapau sets, this obscure character is valued by completist collectors.',
    de: 'Tion Medon ist der Hafen-Administrator von Pau City auf Utapau, der Obi-Wan Kenobi heimlich vor der Anwesenheit von General Grievous in Die Rache der Sith warnt. Diese Minifigur zeigt den großen, blassen Utapaun mit verlängertem Kopf, dunklen Roben und charakteristischen Gesichtszügen. Obwohl er scheinbar den Separatisten dient, hilft Tion Medon der Republik, indem er entscheidende Informationen liefert. Veröffentlicht in begrenzten Utapau-Sets, wird dieser obskure Charakter von Komplettisten-Sammlern geschätzt.',
    fr: 'Tion Medon est l\'Administrateur du Port de Pau City sur Utapau qui avertit secrètement Obi-Wan Kenobi de la présence du Général Grievous dans La Revanche des Sith. Cette minifigurine dépeint le grand Utapaun pâle avec tête allongée, robes sombres, et traits faciaux distinctifs. Malgré son apparente service aux Séparatistes, Tion Medon aide la République en fournissant des renseignements cruciaux. Sortie dans des sets Utapau limités, ce personnage obscur est apprécié par les collectionneurs complétistes.',
    es: 'Tion Medon es el Administrador del Puerto de Pau City en Utapau que secretamente advierte a Obi-Wan Kenobi sobre la presencia del General Grievous en La Venganza de los Sith. Esta minifigura representa al alto y pálido Utapaun con cabeza alargada, túnicas oscuras y rasgos faciales distintivos. A pesar de aparentar servir a los Separatistas, Tion Medon ayuda a la República proporcionando inteligencia crucial. Lanzada en sets limitados de Utapau, este personaje oscuro es valorado por coleccionistas completistas.'
  },
  {
    no: 'sw0464',
    name: 'Neimoidian Warrior',
    en: 'Neimoidian Warriors serve as the personal guards for Trade Federation and Separatist leaders like Nute Gunray. This minifigure depicts the green-gray skinned aliens with distinctive robes and weapons. As the military forces protecting the cowardly Neimoidian leadership, these warriors represent the Trade Federation\'s security. Released in limited Separatist sets, these guards add authenticity to Trade Federation leadership displays.',
    de: 'Neimoidianische Krieger dienen als persönliche Wachen für Handelsföderation- und Separatisten-Anführer wie Nute Gunray. Diese Minifigur zeigt die grüngrau-häutigen Außerirdischen mit charakteristischen Roben und Waffen. Als militärische Streitkräfte, die die feigen Neimoidianischen Anführer schützen, repräsentieren diese Krieger die Sicherheit der Handelsföderation. Veröffentlicht in begrenzten Separatisten-Sets, fügen diese Wachen Authentizität zu Handelsföderation-Führungs-Displays hinzu.',
    fr: 'Les Guerriers Neimoidiens servent de gardes personnels pour les leaders de la Fédération du Commerce et Séparatistes comme Nute Gunray. Cette minifigurine dépeint les extraterrestres à peau vert-gris avec robes et armes distinctives. En tant que forces militaires protégeant le leadership Neimoidien lâche, ces guerriers représentent la sécurité de la Fédération du Commerce. Sortie dans des sets Séparatistes limités, ces gardes ajoutent de l\'authenticité aux displays de leadership de la Fédération du Commerce.',
    es: 'Los Guerreros Neimoidian sirven como guardias personales para líderes de la Federación de Comercio y Separatistas como Nute Gunray. Esta minifigura representa a los alienígenas de piel verde-gris con túnicas y armas distintivas. Como las fuerzas militares que protegen al liderazgo Neimoidian cobarde, estos guerreros representan la seguridad de la Federación de Comercio. Lanzada en sets Separatistas limitados, estos guardias añaden autenticidad a las exhibiciones de liderazgo de la Federación de Comercio.'
  },
  {
    no: 'sw0465',
    name: 'MagnaGuard',
    en: 'MagnaGuards are the elite IG-100 droid bodyguards who protect General Grievous with their electrostaff weapons in Revenge of the Sith. This minifigure features the distinctive skeletal droid design with cape, staff weapon, and ability to function even after decapitation. As Grievous\'s personal guards, these droids represent the most dangerous non-Force wielding warriors. Released in various Grievous sets, MagnaGuards are highly popular with collectors for their unique design and combat effectiveness.',
    de: 'MagnaGuards sind die Elite-IG-100-Droiden-Leibwächter, die General Grievous mit ihren Elektrostab-Waffen in Die Rache der Sith beschützen. Diese Minifigur zeigt das charakteristische skelettartige Droiden-Design mit Umhang, Stabwaffe und Fähigkeit, selbst nach Enthauptung zu funktionieren. Als Grievous\' persönliche Wachen repräsentieren diese Droiden die gefährlichsten Nicht-Macht-Kämpfer. Veröffentlicht in verschiedenen Grievous-Sets, sind MagnaGuards bei Sammlern wegen ihres einzigartigen Designs und ihrer Kampfeffektivität sehr beliebt.',
    fr: 'Les MagnaGuards sont les gardes du corps droïdes IG-100 d\'élite qui protègent le Général Grievous avec leurs armes bâton électrique dans La Revanche des Sith. Cette minifigurine présente le design de droïde squelettique distinctif avec cape, arme bâton, et capacité à fonctionner même après décapitation. En tant que gardes personnels de Grievous, ces droïdes représentent les guerriers les plus dangereux ne maniant pas la Force. Sortie dans divers sets Grievous, les MagnaGuards sont très populaires auprès des collectionneurs pour leur design unique et leur efficacité au combat.',
    es: 'Los MagnaGuards son los guardaespaldas droides IG-100 de élite que protegen al General Grievous con sus armas de bastón eléctrico en La Venganza de los Sith. Esta minifigura presenta el distintivo diseño droide esquelético con capa, arma de bastón y capacidad de funcionar incluso después de la decapitación. Como guardias personales de Grievous, estos droides representan a los guerreros más peligrosos que no manejan la Fuerza. Lanzada en varios sets de Grievous, los MagnaGuards son muy populares entre coleccionistas por su diseño único y efectividad en combate.'
  },
  {
    no: 'sw0466',
    name: 'Droideka - Episode III',
    en: 'Droidekas continue their role as deadly combat droids for the Separatists in the final battles of Revenge of the Sith. This Episode III variant maintains the distinctive rolling wheel form, three-legged walker mode, twin blasters, and shield generators. Deployed on Utapau, Kashyyyk, and other battlefields, these destroyer droids represent the Separatist army\'s most fearsome weapon. Released in various Episode III battle sets, this updated variant shows the continued threat of these nearly unstoppable droids.',
    de: 'Droidekas setzen ihre Rolle als tödliche Kampfdroiden für die Separatisten in den finalen Schlachten von Die Rache der Sith fort. Diese Episode III-Variante behält die charakteristische rollende Radform, Drei-Bein-Läufer-Modus, Doppel-Blaster und Schildgeneratoren bei. Eingesetzt auf Utapau, Kashyyyk und anderen Schlachtfeldern, repräsentieren diese Zerstörerdroiden die furchtbarste Waffe der Separatistenarmee. Veröffentlicht in verschiedenen Episode III-Schlacht-Sets, zeigt diese aktualisierte Variante die anhaltende Bedrohung dieser nahezu unaufhaltsamen Droiden.',
    fr: 'Les Droidekas continuent leur rôle de droïdes de combat mortels pour les Séparatistes dans les batailles finales de La Revanche des Sith. Cette variante Épisode III maintient la forme de roue roulante distinctive, mode marcheur à trois pattes, blasters doubles, et générateurs de bouclier. Déployés sur Utapau, Kashyyyk, et autres champs de bataille, ces droïdes destructeurs représentent l\'arme la plus redoutable de l\'armée Séparatiste. Sortie dans divers sets de bataille Épisode III, cette variante mise à jour montre la menace continue de ces droïdes presque imparables.',
    es: 'Los Droidekas continúan su papel como droides de combate mortales para los Separatistas en las batallas finales de La Venganza de los Sith. Esta variante del Episodio III mantiene la distintiva forma de rueda rodante, modo caminante de tres patas, blásteres gemelos y generadores de escudo. Desplegados en Utapau, Kashyyyk y otros campos de batalla, estos droides destructores representan el arma más temible del ejército Separatista. Lanzada en varios sets de batalla del Episodio III, esta variante actualizada muestra la amenaza continua de estos droides casi imparables.'
  },
  {
    no: 'sw0467',
    name: 'R4-P17',
    en: 'R4-P17 is Obi-Wan Kenobi\'s astromech droid companion throughout the Clone Wars, serving aboard his Jedi starfighters. This minifigure depicts the red and white astromech with distinctive conical head design. Tragically destroyed by buzz droids during the rescue of Chancellor Palpatine, R4 demonstrates loyalty until the end. Released in Obi-Wan\'s starfighter sets, this droid is valued by collectors for its unique design and connection to the Jedi Master.',
    de: 'R4-P17 ist Obi-Wan Kenobis Astromech-Droiden-Begleiter während der gesamten Klonkriege und dient an Bord seiner Jedi-Sternenjäger. Diese Minifigur zeigt den rot-weißen Astromech mit charakteristischem konischem Kopfdesign. Tragisch zerstört von Buzz-Droiden während der Rettung von Kanzler Palpatine, demonstriert R4 Loyalität bis zum Ende. Veröffentlicht in Obi-Wans Sternenjäger-Sets, wird dieser Droide von Sammlern wegen seines einzigartigen Designs und seiner Verbindung zum Jedi-Meister geschätzt.',
    fr: 'R4-P17 est le droïde astromech compagnon d\'Obi-Wan Kenobi tout au long des Guerres des Clones, servant à bord de ses chasseurs stellaires Jedi. Cette minifigurine dépeint l\'astromech rouge et blanc avec design de tête conique distinctive. Tragiquement détruit par des buzz droïdes pendant le sauvetage du Chancelier Palpatine, R4 démontre la loyauté jusqu\'à la fin. Sortie dans les sets de chasseur stellaire d\'Obi-Wan, ce droïde est apprécié par les collectionneurs pour son design unique et sa connexion au Maître Jedi.',
    es: 'R4-P17 es el droide astromecánico compañero de Obi-Wan Kenobi a lo largo de las Guerras Clon, sirviendo a bordo de sus cazas estelares Jedi. Esta minifigura representa al astromecánico rojo y blanco con distintivo diseño de cabeza cónica. Trágicamente destruido por buzz droides durante el rescate del Canciller Palpatine, R4 demuestra lealtad hasta el final. Lanzada en sets de caza estelar de Obi-Wan, este droide es valorado por coleccionistas por su diseño único y conexión con el Maestro Jedi.'
  },
  {
    no: 'sw0468',
    name: 'Medical Droid',
    en: 'Medical Droids provide healthcare and surgical services throughout the galaxy, including treating Anakin\'s injuries on Mustafar in Revenge of the Sith. This minifigure depicts the sterile white and gray medical droid with surgical tools and diagnostic equipment. From delivering Luke and Leia to attempting to save Padmé, medical droids represent the healthcare technology of Star Wars. Released in medical bay sets, these droids add authenticity to medical facility displays.',
    de: 'Medizinische Droiden bieten Gesundheitsversorgung und chirurgische Dienstleistungen in der gesamten Galaxie, einschließlich der Behandlung von Anakins Verletzungen auf Mustafar in Die Rache der Sith. Diese Minifigur zeigt den sterilen weißen und grauen medizinischen Droiden mit chirurgischen Werkzeugen und diagnostischer Ausrüstung. Von der Entbindung von Luke und Leia bis zum Versuch, Padmé zu retten, repräsentieren medizinische Droiden die Gesundheitstechnologie von Star Wars. Veröffentlicht in Medizinstation-Sets, fügen diese Droiden Authentizität zu medizinischen Einrichtungs-Displays hinzu.',
    fr: 'Les Droïdes Médicaux fournissent des services de santé et chirurgicaux à travers la galaxie, y compris le traitement des blessures d\'Anakin sur Mustafar dans La Revanche des Sith. Cette minifigurine dépeint le droïde médical stérile blanc et gris avec outils chirurgicaux et équipement de diagnostic. De l\'accouchement de Luke et Leia à la tentative de sauver Padmé, les droïdes médicaux représentent la technologie de santé de Star Wars. Sortie dans des sets de baie médicale, ces droïdes ajoutent de l\'authenticité aux displays d\'installations médicales.',
    es: 'Los Droides Médicos proporcionan servicios de salud y quirúrgicos en toda la galaxia, incluyendo tratar las lesiones de Anakin en Mustafar en La Venganza de los Sith. Esta minifigura representa al droide médico estéril blanco y gris con herramientas quirúrgicas y equipo de diagnóstico. Desde dar a luz a Luke y Leia hasta intentar salvar a Padmé, los droides médicos representan la tecnología de salud de Star Wars. Lanzada en sets de bahía médica, estos droides añaden autenticidad a las exhibiciones de instalaciones médicas.'
  }
];

async function saveBatch() {
  console.log('💾 Saving batch 351-360 (sw0459-sw0468) - 10 minifigs...\n');

  for (const m of batch) {
    try {
      await prisma.minifigCatalog.upsert({
        where: { minifigure_no: m.no },
        update: {
          description_en: m.en,
          description_de: m.de,
          description_fr: m.fr,
          description_es: m.es,
          description_generated_at: new Date(),
          description_status: 'generated'
        },
        create: {
          minifigure_no: m.no,
          name: m.name,
          category_id: 1,
          category_name: 'Star Wars',
          search_name: m.name.toLowerCase(),
          description_en: m.en,
          description_de: m.de,
          description_fr: m.fr,
          description_es: m.es,
          description_generated_at: new Date(),
          description_status: 'generated'
        }
      });
      console.log(`  ✅ ${m.no}: ${m.name}`);
    } catch (error: any) {
      console.error(`  ❌ ${m.no}: ${error.message}`);
    }
  }

  console.log('\n✨ Batch 351-360 complete: 10 minifigs (40 descriptions)');
  await prisma.$disconnect();
}

saveBatch().catch(console.error);
