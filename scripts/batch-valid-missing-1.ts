import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0254',
    name: 'General Grievous - Bent Legs, Tan Armor',
    description_en: 'General Grievous was the deadly cyborg Supreme Commander of the Separatist Droid Army. This variant features bent legs and tan armor plates showing battle damage. Grievous collected lightsabers from Jedi he killed, wielding four simultaneously. His mechanical body and combat training made him a terrifying opponent.',
    description_de: 'General Grievous war der tödliche Cyborg-Oberbefehlshaber der Separatisten-Droiden-Armee. Diese Variante zeigt gebogene Beine und beige Rüstungsplatten mit Kampfschäden. Grievous sammelte Lichtschwerter von Jedi, die er tötete, und führte vier gleichzeitig. Sein mechanischer Körper und Kampftraining machten ihn zu einem furchterregenden Gegner.',
    description_fr: 'Le Général Grievous était le redoutable Commandant Suprême cyborg de l\'Armée Droïde Séparatiste. Cette variante présente des jambes pliées et des plaques d\'armure beiges montrant des dommages de bataille. Grievous collectionnait les sabres laser des Jedi qu\'il tuait, en maniant quatre simultanément. Son corps mécanique et son entraînement au combat en faisaient un adversaire terrifiant.',
    description_es: 'El General Grievous era el mortal Comandante Supremo cyborg del Ejército Droide Separatista. Esta variante presenta piernas dobladas y placas de armadura beige mostrando daño de batalla. Grievous coleccionaba sables de luz de Jedi que mataba, manejando cuatro simultáneamente. Su cuerpo mecánico y entrenamiento de combate lo convertían en un oponente aterrador.'
  },
  {
    minifigure_no: 'sw0457',
    name: 'Imperial TIE Fighter / Bomber Pilot',
    description_en: 'Imperial TIE Bomber pilots flew heavy assault craft delivering devastating payloads against Rebel targets. Their black flight suits contained life support for TIE operations. These specialized pilots underwent intensive bombing run training. TIE Bombers provided the Empire\'s primary strike capability against capital ships and installations.',
    description_de: 'Imperiale TIE-Bomber-Piloten flogen schwere Angriffsflugzeuge, die verheerende Nutzlasten gegen Rebellenziele abwarfen. Ihre schwarzen Fluganzüge enthielten Lebenserhaltung für TIE-Operationen. Diese spezialisierten Piloten durchliefen intensives Bombenangriff-Training. TIE-Bomber boten die primäre Angriffsfähigkeit des Imperiums gegen Großschiffe und Installationen.',
    description_fr: 'Les pilotes de Bombardiers TIE Impériaux pilotaient des appareils d\'assaut lourds livrant des charges dévastatrices contre des cibles rebelles. Leurs combinaisons de vol noires contenaient un support vital pour les opérations TIE. Ces pilotes spécialisés suivaient un entraînement intensif de bombardement. Les Bombardiers TIE fournissaient la capacité de frappe primaire de l\'Empire contre les vaisseaux capitaux et installations.',
    description_es: 'Los pilotos de Bombarderos TIE Imperiales volaban naves de asalto pesado entregando cargas devastadoras contra objetivos rebeldes. Sus trajes de vuelo negros contenían soporte vital para operaciones TIE. Estos pilotos especializados se sometían a entrenamiento intensivo de bombardeo. Los Bombarderos TIE proporcionaban la capacidad de ataque primaria del Imperio contra naves capitales e instalaciones.'
  },
  {
    minifigure_no: 'sw0458',
    name: 'Snowspeeder Pilot - White Helmet',
    description_en: 'Rebel Snowspeeder pilots defended Echo Base during the Battle of Hoth wearing white helmets for arctic conditions. These brave flyers used tow cables to trip AT-AT walkers. Snowspeeders were civilian airspeeders modified for combat. The pilots\' desperate tactics bought time for the Rebel evacuation.',
    description_de: 'Rebellische Snowspeeder-Piloten verteidigten Echo Base während der Schlacht von Hoth mit weißen Helmen für arktische Bedingungen. Diese mutigen Flieger benutzten Abschleppseile, um AT-AT-Walker zu Fall zu bringen. Snowspeeder waren zivile Luftgleiter, die für den Kampf modifiziert wurden. Die verzweifelten Taktiken der Piloten verschafften Zeit für die Rebellenevakuierung.',
    description_fr: 'Les pilotes de Snowspeeder rebelles défendaient la Base Echo pendant la Bataille de Hoth portant des casques blancs pour conditions arctiques. Ces braves pilotes utilisaient des câbles de remorquage pour faire trébucher les marcheurs AT-AT. Les Snowspeeders étaient des speeders aériens civils modifiés pour le combat. Les tactiques désespérées des pilotes ont gagné du temps pour l\'évacuation rebelle.',
    description_es: 'Los pilotos de Snowspeeder rebeldes defendían Base Eco durante la Batalla de Hoth usando cascos blancos para condiciones árticas. Estos valientes pilotos usaban cables de remolque para derribar caminantes AT-AT. Los Snowspeeders eran deslizadores aéreos civiles modificados para combate. Las tácticas desesperadas de los pilotos ganaron tiempo para la evacuación rebelde.'
  },
  {
    minifigure_no: 'sw0459',
    name: 'Imperial Probe Droid - Trans-Clear Dish Stand, Lever on Top',
    description_en: 'This Imperial Probe Droid variant features trans-clear dish stand and lever assembly. Probe droids scoured the galaxy hunting for Rebel bases. Their multiple sensors transmitted reconnaissance before self-destructing. The probe\'s discovery of Echo Base triggered the Battle of Hoth.',
    description_de: 'Diese imperiale Probe-Droiden-Variante zeigt transparente Schüssel-Halterung und Hebel-Baugruppe. Probe-Droiden durchkämmten die Galaxis auf der Suche nach Rebellenbasen. Ihre mehreren Sensoren übermittelten Aufklärung vor Selbstzerstörung. Die Entdeckung der Echo-Basis durch die Probe löste die Schlacht von Hoth aus.',
    description_fr: 'Cette variante de Droïde Sonde Impérial présente un support de parabole transparent et un assemblage de levier. Les droïdes sondes parcouraient la galaxie à la recherche de bases rebelles. Leurs multiples capteurs transmettaient la reconnaissance avant l\'auto-destruction. La découverte de la Base Echo par la sonde a déclenché la Bataille de Hoth.',
    description_es: 'Esta variante de Droide Sonda Imperial presenta soporte de plato transparente y ensamblaje de palanca. Los droides sonda recorrían la galaxia buscando bases rebeldes. Sus múltiples sensores transmitían reconocimiento antes de autodestruirse. El descubrimiento de Base Eco por la sonda desencadenó la Batalla de Hoth.'
  },
  {
    minifigure_no: 'sw0460',
    name: 'General Rieekan',
    description_en: 'General Carlist Rieekan commanded Echo Base during the Empire\'s assault on Hoth. His tactical decisions enabled the successful evacuation despite overwhelming Imperial forces. Rieekan\'s experience made him a trusted Alliance military leader. His calm leadership under pressure saved countless Rebel lives.',
    description_de: 'General Carlist Rieekan befehligte Echo Base während des Angriffs des Imperiums auf Hoth. Seine taktischen Entscheidungen ermöglichten die erfolgreiche Evakuierung trotz überwältigender imperialer Kräfte. Rieekans Erfahrung machte ihn zu einem vertrauenswürdigen Allianz-Militärführer. Seine ruhige Führung unter Druck rettete unzählige Rebellenleben.',
    description_fr: 'Le Général Carlist Rieekan commandait la Base Echo pendant l\'assaut de l\'Empire sur Hoth. Ses décisions tactiques ont permis l\'évacuation réussie malgré des forces impériales écrasantes. L\'expérience de Rieekan en faisait un leader militaire de l\'Alliance de confiance. Son leadership calme sous pression a sauvé d\'innombrables vies rebelles.',
    description_es: 'El General Carlist Rieekan comandaba Base Eco durante el asalto del Imperio en Hoth. Sus decisiones tácticas permitieron la evacuación exitosa a pesar de fuerzas imperiales abrumadoras. La experiencia de Rieekan lo convirtió en un líder militar de la Alianza confiable. Su liderazgo tranquilo bajo presión salvó incontables vidas rebeldes.'
  },
  {
    minifigure_no: 'sw0461',
    name: 'Luke Skywalker (Pilot, Printed Legs)',
    description_en: 'Luke Skywalker in pilot gear with printed legs represented his role as Red Five during the Battle of Yavin. His X-wing piloting skills came from Tatooine skyhopping experience. Luke\'s Force-guided torpedo shot destroyed the Death Star. This heroic act made him a legend throughout the Rebellion.',
    description_de: 'Luke Skywalker in Pilotenausrüstung mit bedruckten Beinen repräsentierte seine Rolle als Red Five während der Schlacht von Yavin. Seine X-Wing-Pilotenfähigkeiten stammten aus Tatooine-Skyhopping-Erfahrung. Lukes macht-geführter Torpedoschuss zerstörte den Todesstern. Diese heroische Tat machte ihn zu einer Legende in der ganzen Rebellion.',
    description_fr: 'Luke Skywalker en équipement de pilote avec jambes imprimées représentait son rôle de Red Five pendant la Bataille de Yavin. Ses compétences de pilotage de X-wing venaient de l\'expérience de skyhopping sur Tatooine. Le tir de torpille guidé par la Force de Luke a détruit l\'Étoile de la Mort. Cet acte héroïque en a fait une légende dans toute la Rébellion.',
    description_es: 'Luke Skywalker en equipo de piloto con piernas impresas representaba su papel como Red Five durante la Batalla de Yavin. Sus habilidades de pilotaje de X-wing vinieron de experiencia de skyhopping en Tatooine. El disparo de torpedo guiado por Fuerza de Luke destruyó la Estrella de la Muerte. Este acto heroico lo convirtió en leyenda por toda la Rebelión.'
  },
  {
    minifigure_no: 'sw0462',
    name: 'Hoth Rebel Trooper Tan Uniform (Stubble)',
    description_en: 'Hoth Rebel Troopers in tan uniforms defended Echo Base against the Imperial assault. This variant with stubble showed the wear of extended duty in harsh arctic conditions. These soldiers operated defensive positions and evacuation procedures. Their sacrifice enabled the Alliance to escape destruction.',
    description_de: 'Hoth-Rebellentruppen in beigen Uniformen verteidigten Echo Base gegen den imperialen Angriff. Diese Variante mit Stoppeln zeigte die Abnutzung durch längeren Dienst in rauen arktischen Bedingungen. Diese Soldaten operierten Verteidigungspositionen und Evakuierungsverfahren. Ihr Opfer ermöglichte es der Allianz, der Zerstörung zu entkommen.',
    description_fr: 'Les Soldats Rebelles de Hoth en uniformes beiges défendaient la Base Echo contre l\'assaut impérial. Cette variante avec barbe de trois jours montrait l\'usure du service prolongé dans des conditions arctiques difficiles. Ces soldats opéraient des positions défensives et des procédures d\'évacuation. Leur sacrifice a permis à l\'Alliance d\'échapper à la destruction.',
    description_es: 'Los Soldados Rebeldes de Hoth en uniformes beige defendían Base Eco contra el asalto imperial. Esta variante con barba incipiente mostraba el desgaste de servicio prolongado en condiciones árticas duras. Estos soldados operaban posiciones defensivas y procedimientos de evacuación. Su sacrificio permitió a la Alianza escapar de la destrucción.'
  },
  {
    minifigure_no: 'sw0547',
    name: 'Darth Revan',
    description_en: 'Darth Revan was a legendary Sith Lord from the Old Republic era who walked both light and dark paths. His distinctive mask concealed his identity and became iconic. Revan\'s complex history spans redemption and fall across thousands of years before the films. This minifigure represents Expanded Universe lore highly valued by collectors.',
    description_de: 'Darth Revan war ein legendärer Sith-Lord aus der Ära der Alten Republik, der sowohl helle als auch dunkle Pfade ging. Seine markante Maske verbarg seine Identität und wurde ikonisch. Revans komplexe Geschichte umfasst Erlösung und Fall über Tausende von Jahren vor den Filmen. Diese Minifigur repräsentiert Expanded-Universe-Lore, die von Sammlern sehr geschätzt wird.',
    description_fr: 'Dark Revan était un Seigneur Sith légendaire de l\'ère de l\'Ancienne République qui a marché sur les chemins de la lumière et de l\'obscurité. Son masque distinctif cachait son identité et est devenu iconique. L\'histoire complexe de Revan couvre la rédemption et la chute sur des milliers d\'années avant les films. Cette minifigurine représente la légende de l\'Univers Étendu très appréciée des collectionneurs.',
    description_es: 'Darth Revan era un legendario Señor Sith de la era de la Antigua República que caminó por senderos de luz y oscuridad. Su máscara distintiva ocultaba su identidad y se volvió icónica. La historia compleja de Revan abarca redención y caída a través de miles de años antes de las películas. Esta minifigura representa leyenda del Universo Expandido muy valorada por coleccionistas.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for valid missing descriptions (part 1/2)...');

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
