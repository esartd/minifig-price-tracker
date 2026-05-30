import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0564',
    name: 'Max Rebo',
    description_en: 'Max Rebo was the blue Ortolan keyboard player leading the Max Rebo Band in Jabba\'s palace. His distinctive appearance and musical talent made him memorable despite limited screen time. The band provided entertainment during Jabba\'s court proceedings. Max Rebo survived the sail barge destruction and continued performing.',
    description_de: 'Max Rebo war der blaue Ortolan-Keyboardspieler, der die Max-Rebo-Band in Jabbas Palast anführte. Sein markantes Erscheinungsbild und musikalisches Talent machten ihn unvergesslich trotz begrenzter Bildschirmzeit. Die Band bot Unterhaltung während Jabbas Gerichtsverfahren. Max Rebo überlebte die Segelbarken-Zerstörung und trat weiter auf.',
    description_fr: 'Max Rebo était le claviériste Ortolan bleu dirigeant le Groupe Max Rebo dans le palais de Jabba. Son apparence distinctive et son talent musical le rendaient mémorable malgré un temps d\'écran limité. Le groupe fournissait du divertissement pendant les procédures judiciaires de Jabba. Max Rebo a survécu à la destruction de la barge à voile et a continué à se produire.',
    description_es: 'Max Rebo era el tecladista Ortolan azul liderando la Banda Max Rebo en el palacio de Jabba. Su apariencia distintiva y talento musical lo hicieron memorable a pesar de tiempo de pantalla limitado. La banda proporcionaba entretenimiento durante procedimientos de corte de Jabba. Max Rebo sobrevivió la destrucción de la barcaza de vela y continuó actuando.'
  },
  {
    minifigure_no: 'sw0565',
    name: 'Astromech Droid, C1-10P (Chopper) - Light Bluish Gray Body',
    description_en: 'C1-10P, nicknamed Chopper, was the cantankerous astromech droid serving the Ghost crew in Star Wars Rebels. This light bluish gray variant showed his mismatched salvaged parts. Chopper\'s grumpy personality and aggressive tactics contrasted with typical helpful droids. His loyalty to the crew was unwavering despite constant complaining.',
    description_de: 'C1-10P, Spitzname Chopper, war der streitsüchtige Astromech-Droide, der der Ghost-Crew in Star Wars Rebels diente. Diese hellbläulich-graue Variante zeigte seine nicht passenden geborgenen Teile. Choppers mürrische Persönlichkeit und aggressive Taktiken kontrastierten mit typischen hilfsbereiten Droiden. Seine Loyalität zur Crew war unerschütterlich trotz ständigen Beschwerens.',
    description_fr: 'C1-10P, surnommé Chopper, était le droïde astromech acariâtre servant l\'équipage du Ghost dans Star Wars Rebels. Cette variante gris bleuté clair montrait ses pièces récupérées dépareillées. La personnalité grincheuse de Chopper et ses tactiques agressives contrastaient avec les droïdes utiles typiques. Sa loyauté envers l\'équipage était inébranlable malgré les plaintes constantes.',
    description_es: 'C1-10P, apodado Chopper, era el droide astromech cascarrabias sirviendo a la tripulación del Ghost en Star Wars Rebels. Esta variante gris azulado claro mostraba sus partes recuperadas desiguales. La personalidad gruñona de Chopper y tácticas agresivas contrastaban con droides serviciales típicos. Su lealtad a la tripulación era inquebrantable a pesar de quejas constantes.'
  },
  {
    minifigure_no: 'sw0566',
    name: 'Luke Skywalker (Tatooine) - 2014 version',
    description_en: 'This 2014 version of Luke on Tatooine featured updated printing and details. Young Luke dreamed of leaving his moisture farming life for adventure at the Academy. His simple farm boy origins made his transformation into a Jedi Knight even more remarkable. This version captured Luke at the very beginning of his legendary journey.',
    description_de: 'Diese 2014-Version von Luke auf Tatooine zeigte aktualisierte Bedruckung und Details. Der junge Luke träumte davon, sein Feuchtigkeitsfarmleben für Abenteuer an der Akademie zu verlassen. Seine einfache Farmjungen-Herkunft machte seine Verwandlung in einen Jedi-Ritter noch bemerkenswerter. Diese Version erfasste Luke am Beginn seiner legendären Reise.',
    description_fr: 'Cette version 2014 de Luke sur Tatooine présentait une impression et des détails mis à jour. Le jeune Luke rêvait de quitter sa vie de culture d\'humidité pour l\'aventure à l\'Académie. Ses origines simples de garçon de ferme rendaient sa transformation en Chevalier Jedi encore plus remarquable. Cette version capturait Luke au tout début de son voyage légendaire.',
    description_es: 'Esta versión 2014 de Luke en Tatooine presentaba impresión y detalles actualizados. El joven Luke soñaba con dejar su vida de agricultura de humedad por aventura en la Academia. Sus orígenes simples de granjero hacían su transformación en Caballero Jedi aún más notable. Esta versión capturaba a Luke al comienzo mismo de su viaje legendario.'
  },
  {
    minifigure_no: 'sw0567',
    name: 'Dak Ralter (with Pockets on Legs)',
    description_en: 'Dak Ralter served as Luke Skywalker\'s gunner during the Battle of Hoth. This variant with pockets on legs showed his Rebel pilot gear. Dak\'s enthusiasm and confidence made him a memorable character despite brief screen time. His death in the snowspeeder demonstrated the brutal reality of war against the Empire.',
    description_de: 'Dak Ralter diente als Luke Skywalkers Schütze während der Schlacht von Hoth. Diese Variante mit Taschen an den Beinen zeigte seine Rebellen-Pilotenausrüstung. Daks Enthusiasmus und Selbstvertrauen machten ihn zu einem unvergesslichen Charakter trotz kurzer Bildschirmzeit. Sein Tod im Snowspeeder demonstrierte die brutale Realität des Krieges gegen das Imperium.',
    description_fr: 'Dak Ralter servait comme artilleur de Luke Skywalker pendant la Bataille de Hoth. Cette variante avec poches sur les jambes montrait son équipement de pilote rebelle. L\'enthousiasme et la confiance de Dak en faisaient un personnage mémorable malgré un bref temps d\'écran. Sa mort dans le snowspeeder a démontré la réalité brutale de la guerre contre l\'Empire.',
    description_es: 'Dak Ralter servía como artillero de Luke Skywalker durante la Batalla de Hoth. Esta variante con bolsillos en las piernas mostraba su equipo de piloto rebelde. El entusiasmo y confianza de Dak lo hicieron un personaje memorable a pesar de breve tiempo de pantalla. Su muerte en el snowspeeder demostró la realidad brutal de la guerra contra el Imperio.'
  },
  {
    minifigure_no: 'sw0568',
    name: 'Snowtrooper, Light Bluish Gray Hips, Light Bluish Gray Hands, White Kama',
    description_en: 'This Snowtrooper variant features light bluish gray hips and hands with white kama skirt armor. Imperial cold assault troopers wore specialized gear for arctic operations. Their insulated armor allowed combat effectiveness in Hoth\'s sub-zero temperatures. Snowtroopers led the devastating ground assault on Echo Base.',
    description_de: 'Diese Snowtrooper-Variante zeigt hellbläulich-graue Hüften und Hände mit weißem Kama-Rock-Panzer. Imperiale Kälte-Angriffstruppen trugen spezialisierte Ausrüstung für arktische Operationen. Ihre isolierte Rüstung ermöglichte Kampfeffektivität in Hoths Minusgraden. Snowtrooper führten den verheerenden Bodenangriff auf Echo Base an.',
    description_fr: 'Cette variante de Snowtrooper présente des hanches et des mains gris bleuté clair avec une armure de jupe kama blanche. Les troupes d\'assaut par temps froid impériales portaient un équipement spécialisé pour les opérations arctiques. Leur armure isolée permettait une efficacité au combat dans les températures sous zéro de Hoth. Les Snowtroopers ont mené l\'assaut terrestre dévastateur sur la Base Echo.',
    description_es: 'Esta variante de Snowtrooper presenta caderas y manos gris azulado claro con armadura de falda kama blanca. Las tropas de asalto en frío imperiales usaban equipo especializado para operaciones árticas. Su armadura aislada permitía efectividad de combate en temperaturas bajo cero de Hoth. Los Snowtroopers lideraron el asalto terrestre devastador en Base Eco.'
  },
  {
    minifigure_no: 'sw0569',
    name: 'Luke Skywalker (Pilot, Printed Legs, Cheek Lines)',
    description_en: 'Luke Skywalker in pilot gear with printed legs and cheek lines showing battle wear. This variant captured him during the assault on the Death Star as Red Five. Luke\'s farmboy piloting skills and Force sensitivity made him the hero of Yavin. His impossible shot saved the Rebellion and began his legend.',
    description_de: 'Luke Skywalker in Pilotenausrüstung mit bedruckten Beinen und Wangenlinien, die Kampfspuren zeigen. Diese Variante erfasste ihn während des Angriffs auf den Todesstern als Red Five. Lukes Farmjungen-Pilotenfähigkeiten und Macht-Empfindlichkeit machten ihn zum Helden von Yavin. Sein unmöglicher Schuss rettete die Rebellion und begann seine Legende.',
    description_fr: 'Luke Skywalker en équipement de pilote avec jambes imprimées et lignes de joues montrant l\'usure de bataille. Cette variante le capturait pendant l\'assaut sur l\'Étoile de la Mort en tant que Red Five. Les compétences de pilotage de garçon de ferme de Luke et sa sensibilité à la Force en faisaient le héros de Yavin. Son tir impossible a sauvé la Rébellion et a commencé sa légende.',
    description_es: 'Luke Skywalker en equipo de piloto con piernas impresas y líneas de mejillas mostrando desgaste de batalla. Esta variante lo capturaba durante el asalto en la Estrella de la Muerte como Red Five. Las habilidades de pilotaje de granjero de Luke y sensibilidad a la Fuerza lo convirtieron en el héroe de Yavin. Su disparo imposible salvó la Rebelión y comenzó su leyenda.'
  },
  {
    minifigure_no: 'sw0570',
    name: 'Ithorian Jedi Master (Noga-ta)',
    description_en: 'Noga-ta was an Ithorian Jedi Master serving the Order during the Clone Wars. The peaceful Ithorian species, known as "Hammerheads," rarely became warriors. Noga-ta\'s Force abilities and dedication made him a respected teacher. His presence showed the Jedi Order\'s diversity across countless species.',
    description_de: 'Noga-ta war ein ithorianischer Jedi-Meister, der dem Orden während der Klonkriege diente. Die friedliche ithorianische Spezies, bekannt als "Hammerköpfe," wurden selten Krieger. Noga-tas Macht-Fähigkeiten und Hingabe machten ihn zu einem respektierten Lehrer. Seine Präsenz zeigte die Vielfalt des Jedi-Ordens über unzählige Spezies.',
    description_fr: 'Noga-ta était un Maître Jedi Ithorien servant l\'Ordre pendant les Guerres des Clones. L\'espèce Ithorienne pacifique, connue sous le nom de "Têtes de Marteau," devenait rarement des guerriers. Les capacités de Force de Noga-ta et son dévouement en faisaient un enseignant respecté. Sa présence montrait la diversité de l\'Ordre Jedi à travers d\'innombrables espèces.',
    description_es: 'Noga-ta era un Maestro Jedi Ithoriano sirviendo a la Orden durante las Guerras Clon. La especie Ithoriana pacífica, conocida como "Cabezas de Martillo," raramente se convertían en guerreros. Las habilidades de Fuerza de Noga-ta y dedicación lo convirtieron en un maestro respetado. Su presencia mostraba la diversidad de la Orden Jedi a través de incontables especies.'
  },
  {
    minifigure_no: 'sw0571',
    name: 'Jek-14 - Stormtrooper Helmet',
    description_en: 'Jek-14 was a Force-sensitive clone created by the Empire in The Yoda Chronicles animated series. This variant showed him wearing a stormtrooper helmet during his Imperial service. Jek-14\'s unique origin and Force abilities made him powerful yet conflicted. His story explored themes of identity and choice.',
    description_de: 'Jek-14 war ein macht-empfindlicher Klon, der vom Imperium in der animierten Serie The Yoda Chronicles erschaffen wurde. Diese Variante zeigte ihn mit Sturmtruppler-Helm während seines imperialen Dienstes. Jek-14s einzigartige Herkunft und Macht-Fähigkeiten machten ihn mächtig aber konfliktgeladen. Seine Geschichte erforschte Themen von Identität und Wahl.',
    description_fr: 'Jek-14 était un clone sensible à la Force créé par l\'Empire dans la série animée The Yoda Chronicles. Cette variante le montrait portant un casque de stormtrooper pendant son service impérial. L\'origine unique de Jek-14 et ses capacités de Force le rendaient puissant mais conflictuel. Son histoire explorait des thèmes d\'identité et de choix.',
    description_es: 'Jek-14 era un clon sensible a la Fuerza creado por el Imperio en la serie animada The Yoda Chronicles. Esta variante lo mostraba usando un casco de stormtrooper durante su servicio imperial. El origen único de Jek-14 y habilidades de Fuerza lo hacían poderoso pero conflictuado. Su historia exploraba temas de identidad y elección.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0564-sw0571...');

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

  console.log('Batch complete! 8 minifigs saved.');
  await prisma.$disconnect();
}

saveBatch();
