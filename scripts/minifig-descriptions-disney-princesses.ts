import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Disney Princess minifigure descriptions - character personality and story context
const batch = [
  {
    minifigure_no: 'dp001',
    name: 'Ariel, Mermaid (Light Nougat) - Medium Lavender Shell Bra Top, Bright Green Tail, Medium Azure Eyes',
    description_en: 'Ariel the mermaid princess dreamed of the human world above the waves. Her curiosity and adventurous spirit drove her to collect human treasures. Despite her father\'s warnings, Ariel\'s fascination with Prince Eric changed her fate. Her beautiful voice and kind heart made her beloved under the sea.',
    description_de: 'Ariel die Meerjungfrau-Prinzessin träumte von der Menschenwelt über den Wellen. Ihre Neugier und ihr Abenteurergeist trieben sie an, menschliche Schätze zu sammeln. Trotz der Warnungen ihres Vaters veränderte Ariels Faszination für Prinz Eric ihr Schicksal. Ihre schöne Stimme und ihr gutes Herz machten sie unter dem Meer beliebt.',
    description_fr: 'Ariel la princesse sirène rêvait du monde humain au-dessus des vagues. Sa curiosité et son esprit aventureux la poussaient à collectionner des trésors humains. Malgré les avertissements de son père, la fascination d\'Ariel pour le Prince Eric changea son destin. Sa belle voix et son cœur bon la rendirent aimée sous la mer.',
    description_es: 'Ariel la princesa sirena soñaba con el mundo humano sobre las olas. Su curiosidad y espíritu aventurero la llevaron a coleccionar tesoros humanos. A pesar de las advertencias de su padre, la fascinación de Ariel por el Príncipe Eric cambió su destino. Su hermosa voz y buen corazón la hicieron amada bajo el mar.'
  },
  {
    minifigure_no: 'dp002',
    name: 'Merida',
    description_en: 'Merida the Scottish princess refused to follow tradition and chose her own path. Her skill with a bow matched her fierce independence. When her wish transformed her mother, Merida learned that changing fate requires understanding. Her wild red hair reflected her untamed spirit.',
    description_de: 'Merida die schottische Prinzessin weigerte sich, der Tradition zu folgen und wählte ihren eigenen Weg. Ihre Fertigkeit mit dem Bogen entsprach ihrer wilden Unabhängigkeit. Als ihr Wunsch ihre Mutter verwandelte, lernte Merida, dass Schicksalsänderung Verständnis erfordert. Ihr wildes rotes Haar spiegelte ihren ungezähmten Geist wider.',
    description_fr: 'Merida la princesse écossaise refusa de suivre la tradition et choisit son propre chemin. Son habileté à l\'arc égalait son indépendance farouche. Quand son souhait transforma sa mère, Merida apprit que changer le destin nécessite compréhension. Ses cheveux roux sauvages reflétaient son esprit indomptable.',
    description_es: 'Merida la princesa escocesa se negó a seguir la tradición y eligió su propio camino. Su habilidad con el arco igualaba su feroz independencia. Cuando su deseo transformó a su madre, Merida aprendió que cambiar el destino requiere comprensión. Su cabello rojo salvaje reflejaba su espíritu indomable.'
  },
  {
    minifigure_no: 'dp003',
    name: 'Cinderella',
    description_en: 'Cinderella remained kind despite cruel treatment from her stepfamily. Her gentle nature attracted magical help from her Fairy Godmother. At the royal ball, her grace captured the Prince\'s heart. The glass slipper proved that true beauty shines through hardship.',
    description_de: 'Cinderella blieb freundlich trotz grausamer Behandlung durch ihre Stieffamilie. Ihre sanfte Natur zog magische Hilfe ihrer Guten Fee an. Beim königlichen Ball eroberte ihre Anmut das Herz des Prinzen. Der Glasschuh bewies, dass wahre Schönheit durch Härten hindurch leuchtet.',
    description_fr: 'Cendrillon resta gentille malgré le traitement cruel de sa belle-famille. Sa nature douce attira l\'aide magique de sa Fée Marraine. Au bal royal, sa grâce captura le cœur du Prince. La pantoufle de verre prouva que la vraie beauté brille à travers l\'adversité.',
    description_es: 'Cenicienta permaneció amable a pesar del trato cruel de su familia política. Su naturaleza gentil atrajo ayuda mágica de su Hada Madrina. En el baile real, su gracia capturó el corazón del Príncipe. El zapato de cristal demostró que la verdadera belleza brilla a través de las dificultades.'
  },
  {
    minifigure_no: 'dp006',
    name: 'Rapunzel - Mini Doll, Magenta and Medium Azure Bows, Pearl Gold Tiara',
    description_en: 'Rapunzel lived locked in a tower with magical golden hair. Her innocent curiosity about the outside world never faded. When Flynn Rider appeared, her adventure finally began. Her healing hair symbolized the power of hope and love.',
    description_de: 'Rapunzel lebte eingesperrt in einem Turm mit magischem goldenen Haar. Ihre unschuldige Neugier auf die Außenwelt verblasste nie. Als Flynn Rider erschien, begann ihr Abenteuer endlich. Ihr heilendes Haar symbolisierte die Kraft von Hoffnung und Liebe.',
    description_fr: 'Raiponce vivait enfermée dans une tour avec des cheveux dorés magiques. Sa curiosité innocente pour le monde extérieur ne s\'estompa jamais. Quand Flynn Rider apparut, son aventure commença enfin. Ses cheveux guérisseurs symbolisaient le pouvoir de l\'espoir et de l\'amour.',
    description_es: 'Rapunzel vivía encerrada en una torre con cabello dorado mágico. Su curiosidad inocente sobre el mundo exterior nunca se desvaneció. Cuando Flynn Rider apareció, su aventura finalmente comenzó. Su cabello curativo simbolizaba el poder de la esperanza y el amor.'
  },
  {
    minifigure_no: 'dp011',
    name: 'Aurora - Closed Mouth',
    description_en: 'Aurora the Sleeping Beauty was cursed as an infant by Maleficent. Raised by three good fairies, she grew into a kind and graceful princess. Her beauty captivated Prince Phillip during a chance meeting in the forest. True love\'s kiss broke the sleeping curse.',
    description_de: 'Aurora die Dornröschen wurde als Säugling von Maleficent verflucht. Von drei guten Feen aufgezogen, wuchs sie zu einer freundlichen und anmutigen Prinzessin heran. Ihre Schönheit fesselte Prinz Phillip bei einer zufälligen Begegnung im Wald. Der Kuss der wahren Liebe brach den Schlaffluch.',
    description_fr: 'Aurore la Belle au Bois Dormant fut maudite en tant que bébé par Maléfique. Élevée par trois bonnes fées, elle devint une princesse gentille et gracieuse. Sa beauté captiva le Prince Philippe lors d\'une rencontre fortuite dans la forêt. Le baiser d\'amour véritable brisa la malédiction du sommeil.',
    description_es: 'Aurora la Bella Durmiente fue maldecida como bebé por Maléfica. Criada por tres hadas buenas, creció hasta ser una princesa amable y elegante. Su belleza cautivó al Príncipe Felipe durante un encuentro casual en el bosque. El beso del amor verdadero rompió la maldición del sueño.'
  },
  {
    minifigure_no: 'dp012',
    name: 'Jasmine - Plain Top and Trousers, Light Aqua Shoes',
    description_en: 'Jasmine the princess of Agrabah yearned for freedom beyond the palace walls. Her intelligence and strong will made her refuse unwanted suitors. When she met Aladdin in the marketplace, she found someone who valued her for herself. Her tiger Rajah reflected her fierce spirit.',
    description_de: 'Jasmin die Prinzessin von Agrabah sehnte sich nach Freiheit jenseits der Palastmauern. Ihre Intelligenz und starker Wille ließen sie unerwünschte Verehrer ablehnen. Als sie Aladdin auf dem Marktplatz traf, fand sie jemanden, der sie um ihrer selbst willen schätzte. Ihr Tiger Rajah spiegelte ihren wilden Geist wider.',
    description_fr: 'Jasmine la princesse d\'Agrabah aspirait à la liberté au-delà des murs du palais. Son intelligence et sa forte volonté la firent refuser les prétendants non désirés. Quand elle rencontra Aladdin au marché, elle trouva quelqu\'un qui l\'appréciait pour elle-même. Son tigre Rajah reflétait son esprit féroce.',
    description_es: 'Jasmine la princesa de Agrabah anhelaba libertad más allá de los muros del palacio. Su inteligencia y fuerte voluntad la hicieron rechazar pretendientes no deseados. Cuando conoció a Aladdin en el mercado, encontró a alguien que la valoraba por sí misma. Su tigre Rajah reflejaba su espíritu feroz.'
  },
  {
    minifigure_no: 'dp015',
    name: 'Elsa - Sparkly Light Aqua Cape, Lavender Hair Bow',
    description_en: 'Elsa the Snow Queen possessed powerful ice magic she struggled to control. Fear of hurting others made her hide her abilities. When her secret was revealed, Elsa fled to the mountains and built an ice palace. Her sister Anna\'s love helped Elsa realize that love could control her powers.',
    description_de: 'Elsa die Schneekönigin besaß mächtige Eismagie, die sie zu kontrollieren kämpfte. Angst, anderen zu schaden, ließ sie ihre Fähigkeiten verbergen. Als ihr Geheimnis enthüllt wurde, floh Elsa in die Berge und baute einen Eispalast. Die Liebe ihrer Schwester Anna half Elsa zu erkennen, dass Liebe ihre Kräfte kontrollieren konnte.',
    description_fr: 'Elsa la Reine des Neiges possédait une puissante magie de glace qu\'elle peinait à contrôler. La peur de blesser les autres la fit cacher ses capacités. Quand son secret fut révélé, Elsa s\'enfuit dans les montagnes et construisit un palais de glace. L\'amour de sa sœur Anna aida Elsa à réaliser que l\'amour pouvait contrôler ses pouvoirs.',
    description_es: 'Elsa la Reina de las Nieves poseía poderosa magia de hielo que luchaba por controlar. El miedo a herir a otros la hizo ocultar sus habilidades. Cuando su secreto fue revelado, Elsa huyó a las montañas y construyó un palacio de hielo. El amor de su hermana Anna ayudó a Elsa a darse cuenta de que el amor podía controlar sus poderes.'
  },
  {
    minifigure_no: 'dp016',
    name: 'Anna',
    description_en: 'Anna the fearless princess never gave up on her sister Elsa. Her optimistic and impulsive nature drove her to chase Elsa into a winter storm. When Kristoff and Olaf joined her quest, Anna showed that determination and sisterly love could overcome any obstacle. Her sacrifice for Elsa became an act of true love.',
    description_de: 'Anna die furchtlose Prinzessin gab ihre Schwester Elsa nie auf. Ihre optimistische und impulsive Natur trieb sie an, Elsa in einen Wintersturm zu verfolgen. Als Kristoff und Olaf sich ihrer Suche anschlossen, zeigte Anna, dass Entschlossenheit und geschwisterliche Liebe jedes Hindernis überwinden konnten. Ihr Opfer für Elsa wurde zu einem Akt wahrer Liebe.',
    description_fr: 'Anna la princesse intrépide n\'abandonna jamais sa sœur Elsa. Sa nature optimiste et impulsive la poussa à poursuivre Elsa dans une tempête hivernale. Quand Kristoff et Olaf rejoignirent sa quête, Anna montra que la détermination et l\'amour fraternel pouvaient surmonter tout obstacle. Son sacrifice pour Elsa devint un acte d\'amour véritable.',
    description_es: 'Anna la princesa intrépida nunca se rindió con su hermana Elsa. Su naturaleza optimista e impulsiva la llevó a perseguir a Elsa en una tormenta invernal. Cuando Kristoff y Olaf se unieron a su búsqueda, Anna mostró que la determinación y el amor fraternal podían superar cualquier obstáculo. Su sacrificio por Elsa se convirtió en un acto de amor verdadero.'
  },
  {
    minifigure_no: 'dp004',
    name: 'Ariel, Human (Light Nougat) - Bright Pink Dress with White Stars, Lavender Bow',
    description_en: 'Ariel as a human finally experienced the world she always dreamed of. Trading her voice for legs, she had three days to win Prince Eric\'s love. Her determination and expressive nature helped her communicate without words. Ariel\'s courage to leave everything behind showed the power of following your dreams.',
    description_de: 'Ariel als Mensch erlebte endlich die Welt, von der sie immer geträumt hatte. Sie tauschte ihre Stimme gegen Beine und hatte drei Tage, um Prinz Erics Liebe zu gewinnen. Ihre Entschlossenheit und ausdrucksstarke Natur halfen ihr, ohne Worte zu kommunizieren. Ariels Mut, alles zurückzulassen, zeigte die Kraft, seinen Träumen zu folgen.',
    description_fr: 'Ariel en tant qu\'humaine vécut enfin le monde dont elle avait toujours rêvé. Échangeant sa voix contre des jambes, elle avait trois jours pour gagner l\'amour du Prince Eric. Sa détermination et sa nature expressive l\'aidèrent à communiquer sans mots. Le courage d\'Ariel de tout laisser derrière montra le pouvoir de suivre ses rêves.',
    description_es: 'Ariel como humana finalmente experimentó el mundo con el que siempre soñó. Intercambiando su voz por piernas, tenía tres días para ganar el amor del Príncipe Eric. Su determinación y naturaleza expresiva la ayudaron a comunicarse sin palabras. El coraje de Ariel de dejar todo atrás mostró el poder de seguir tus sueños.'
  },
  {
    minifigure_no: 'dp008',
    name: 'Cinderella - Two-Colored Dress and Long Gloves',
    description_en: 'Cinderella in her iconic ball gown represented transformation and hope. Her Fairy Godmother\'s magic turned rags into this beautiful dress. At midnight the spell would break, but Cinderella\'s brief moment at the ball changed her life forever. The elegant gown showed that inner beauty deserves to shine.',
    description_de: 'Cinderella in ihrem ikonischen Ballkleid repräsentierte Transformation und Hoffnung. Die Magie ihrer Guten Fee verwandelte Lumpen in dieses wunderschöne Kleid. Um Mitternacht würde der Zauber brechen, aber Cinderellas kurzer Moment beim Ball veränderte ihr Leben für immer. Das elegante Kleid zeigte, dass innere Schönheit es verdient zu glänzen.',
    description_fr: 'Cendrillon dans sa robe de bal emblématique représentait la transformation et l\'espoir. La magie de sa Fée Marraine transforma des haillons en cette belle robe. À minuit le sort se briserait, mais le bref moment de Cendrillon au bal changea sa vie à jamais. La robe élégante montrait que la beauté intérieure mérite de briller.',
    description_es: 'Cenicienta en su icónico vestido de baile representaba transformación y esperanza. La magia de su Hada Madrina convirtió harapos en este hermoso vestido. A medianoche el hechizo se rompería, pero el breve momento de Cenicienta en el baile cambió su vida para siempre. El elegante vestido mostró que la belleza interior merece brillar.'
  }
];

async function updateDescriptions() {
  console.log(`Starting Disney Princess minifigure description updates...`);
  console.log(`Total minifigures: ${batch.length}\n`);

  for (const minifig of batch) {
    try {
      await prisma.minifigCatalog.update({
        where: { minifigure_no: minifig.minifigure_no },
        data: {
          description_en: minifig.description_en,
          description_de: minifig.description_de,
          description_fr: minifig.description_fr,
          description_es: minifig.description_es,
        },
      });
      console.log(`✅ Updated ${minifig.minifigure_no} - ${minifig.name}`);
    } catch (error) {
      console.error(`❌ Error updating ${minifig.minifigure_no}:`, error);
    }
  }

  console.log(`\n✅ Disney Princess descriptions update complete!`);
  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
