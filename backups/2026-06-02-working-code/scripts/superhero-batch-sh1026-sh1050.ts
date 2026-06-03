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
    minifigure_no: 'sh1026',
    description_en: "Red Hulk in standard minifigure form represents Thunderbolt Ross's gamma-powered transformation. This compact version captures the military general's rage and strength as a red-skinned powerhouse.",
    description_de: "Red Hulk in Standard-Minifigur-Form repräsentiert Thunderbolt Ross' Gamma-angetriebene Transformation. Diese kompakte Version fängt die Wut und Stärke des Militärgenerals als rothäutiges Kraftpaket ein.",
    description_fr: "Hulk Rouge sous forme de minifigurine standard représente la transformation propulsée par les rayons gamma de Thunderbolt Ross. Cette version compacte capture la rage et la force du général militaire en tant que force à peau rouge.",
    description_es: "Hulk Rojo en forma de minifigura estándar representa la transformación impulsada por gamma de Thunderbolt Ross. Esta versión compacta captura la furia y fuerza del general militar como una potencia de piel roja."
  },
  {
    minifigure_no: 'sh1027',
    description_en: "Spider-Woman in black outfit with white boots showcases Jessica Drew's distinctive costume. This Avenger brings spider-powers and bio-electric venom blasts to the team with her unique design.",
    description_de: "Spider-Woman im schwarzen Outfit mit weißen Stiefeln zeigt Jessica Drews markantes Kostüm. Dieser Avenger bringt Spinnenkräfte und bioelektrische Giftexplosionen zum Team mit ihrem einzigartigen Design.",
    description_fr: "Spider-Woman en tenue noire avec des bottes blanches présente le costume distinctif de Jessica Drew. Cette Avenger apporte des pouvoirs d'araignée et des explosions de venin bio-électriques à l'équipe avec son design unique.",
    description_es: "Spider-Woman en traje negro con botas blancas muestra el distintivo traje de Jessica Drew. Esta Vengadora aporta poderes de araña y explosiones de veneno bioeléctrico al equipo con su diseño único."
  },
  {
    minifigure_no: 'sh1028',
    description_en: "Venom with white teeth parted and 2 symmetrical back appendages represents Eddie Brock's alien symbiote form. The black-suited menace brings lethal protector energy as Spider-Man's most dangerous adversary.",
    description_de: "Venom mit weißen geöffneten Zähnen und 2 symmetrischen Rückenanhängen repräsentiert Eddie Brocks außerirdische Symbioten-Form. Die schwarzgekleidete Bedrohung bringt tödliche Beschützer-Energie als Spider-Mans gefährlichster Gegner.",
    description_fr: "Venom avec des dents blanches séparées et 2 appendices dorsaux symétriques représente la forme de symbiote alien d'Eddie Brock. La menace en costume noir apporte une énergie de protecteur mortel en tant qu'adversaire le plus dangereux de Spider-Man.",
    description_es: "Venom con dientes blancos separados y 2 apéndices traseros simétricos representa la forma de simbionte alienígena de Eddie Brock. La amenaza de traje negro aporta energía de protector letal como el adversario más peligroso de Spider-Man."
  },
  {
    minifigure_no: 'sh1029',
    description_en: "Spider-Man (Miles Morales) in Spider-Verse suit showcases the Brooklyn teen's journey across dimensions. This multiverse version brings Miles' unique powers including venom strike and invisibility to alternate realities.",
    description_de: "Spider-Man (Miles Morales) im Spider-Verse-Anzug zeigt die Reise des Brooklyn-Teenagers durch Dimensionen. Diese Multiversum-Version bringt Miles' einzigartige Kräfte einschließlich Venom-Schlag und Unsichtbarkeit in alternative Realitäten.",
    description_fr: "Spider-Man (Miles Morales) en costume Spider-Verse présente le voyage de l'adolescent de Brooklyn à travers les dimensions. Cette version du multivers apporte les pouvoirs uniques de Miles, y compris la frappe de venin et l'invisibilité, vers des réalités alternatives.",
    description_es: "Spider-Man (Miles Morales) en traje Spider-Verse muestra el viaje del adolescente de Brooklyn a través de dimensiones. Esta versión del multiverso trae los poderes únicos de Miles incluyendo golpe de veneno e invisibilidad a realidades alternativas."
  },
  {
    minifigure_no: 'sh1030',
    description_en: "Ghost-Spider/Spider-Gwen (Gwen Stacy) with black legs, white basic smooth hood, and magenta hands represents her Spider-Verse appearance. This dimensional variant shows Gwen's heroic identity from Earth-65.",
    description_de: "Ghost-Spider/Spider-Gwen (Gwen Stacy) mit schwarzen Beinen, weißer glatter Kapuze und magentafarbenen Händen repräsentiert ihr Spider-Verse-Aussehen. Diese dimensionale Variante zeigt Gwens heroische Identität von Erde-65.",
    description_fr: "Ghost-Spider/Spider-Gwen (Gwen Stacy) avec des jambes noires, une capuche lisse blanche basique et des mains magenta représente son apparition dans le Spider-Verse. Cette variante dimensionnelle montre l'identité héroïque de Gwen de la Terre-65.",
    description_es: "Ghost-Spider/Spider-Gwen (Gwen Stacy) con piernas negras, capucha lisa blanca básica y manos magenta representa su apariencia en Spider-Verse. Esta variante dimensional muestra la identidad heroica de Gwen de Tierra-65."
  },
  {
    minifigure_no: 'sh1031',
    description_en: "Officer Jefferson Morales represents Miles' father serving with the NYPD. This dedicated police officer balances protecting Brooklyn while supporting his son's superhero activities.",
    description_de: "Officer Jefferson Morales repräsentiert Miles' Vater im Dienst des NYPD. Dieser engagierte Polizist balanciert den Schutz Brooklyns mit der Unterstützung der Superhelden-Aktivitäten seines Sohnes.",
    description_fr: "L'officier Jefferson Morales représente le père de Miles servant au NYPD. Ce policier dévoué équilibre la protection de Brooklyn tout en soutenant les activités de super-héros de son fils.",
    description_es: "El Oficial Jefferson Morales representa al padre de Miles sirviendo en el NYPD. Este dedicado oficial de policía equilibra proteger Brooklyn mientras apoya las actividades de superhéroe de su hijo."
  },
  {
    minifigure_no: 'sh1032',
    description_en: "The Spot showcases the portal-creating villain with his distinctive spotted appearance. This dimension-hopping antagonist uses his dark matter powers to travel through portals across the multiverse.",
    description_de: "Der Spot zeigt den Portal-erschaffenden Bösewicht mit seinem markanten gepunkteten Aussehen. Dieser Dimensions-springende Antagonist nutzt seine Dunkle-Materie-Kräfte, um durch Portale durch das Multiversum zu reisen.",
    description_fr: "The Spot présente le méchant créateur de portails avec son apparence tachetée distinctive. Cet antagoniste sautant de dimension utilise ses pouvoirs de matière noire pour voyager à travers des portails à travers le multivers.",
    description_es: "The Spot muestra al villano creador de portales con su distintiva apariencia manchada. Este antagonista que salta dimensiones usa sus poderes de materia oscura para viajar a través de portales por el multiverso."
  },
  {
    minifigure_no: 'sh1033',
    description_en: "Spider-Man (Peter 'Spidey' Parker) with medium legs and lime spider logo represents the preschool series version. This junior-friendly web-slinger makes Marvel's hero accessible to younger LEGO fans.",
    description_de: "Spider-Man (Peter 'Spidey' Parker) mit mittellangen Beinen und limettenfarbenem Spinnenlogo repräsentiert die Vorschulserien-Version. Dieser kinderfreundliche Netzschleuderer macht Marvels Held für jüngere LEGO-Fans zugänglich.",
    description_fr: "Spider-Man (Peter 'Spidey' Parker) avec des jambes moyennes et un logo d'araignée citron vert représente la version de la série préscolaire. Ce lanceur de toiles adapté aux juniors rend le héros Marvel accessible aux jeunes fans de LEGO.",
    description_es: "Spider-Man (Peter 'Spidey' Parker) con piernas medianas y logo de araña verde lima representa la versión de la serie preescolar. Este lanzador de redes amigable para niños hace que el héroe de Marvel sea accesible para los fanáticos jóvenes de LEGO."
  },
  {
    minifigure_no: 'sh1034',
    description_en: "Spider-Man (Miles 'Spin' Morales) with black medium legs and lime spider logo brings the young hero to the preschool series. This junior version introduces Miles' character to the youngest Marvel fans.",
    description_de: "Spider-Man (Miles 'Spin' Morales) mit schwarzen mittellangen Beinen und limettenfarbenem Spinnenlogo bringt den jungen Helden zur Vorschulserie. Diese Junior-Version stellt Miles' Charakter den jüngsten Marvel-Fans vor.",
    description_fr: "Spider-Man (Miles 'Spin' Morales) avec des jambes moyennes noires et un logo d'araignée citron vert apporte le jeune héros à la série préscolaire. Cette version junior présente le personnage de Miles aux plus jeunes fans de Marvel.",
    description_es: "Spider-Man (Miles 'Spin' Morales) con piernas medianas negras y logo de araña verde lima trae al joven héroe a la serie preescolar. Esta versión junior presenta el personaje de Miles a los fanáticos más jóvenes de Marvel."
  },
  {
    minifigure_no: 'sh1035',
    description_en: "Iron Legion with dark blue head, one-piece helmet, and stud shooter represents Tony's armed drones. These automated units provide firepower as part of Stark's peacekeeping initiative.",
    description_de: "Iron Legion mit dunkelblauen Kopf, einteiligem Helm und Noppen-Shooter repräsentiert Tonys bewaffnete Drohnen. Diese automatisierten Einheiten bieten Feuerkraft als Teil von Starks Friedenssicherungsinitiative.",
    description_fr: "La Légion de Fer avec une tête bleu foncé, un casque d'une seule pièce et un lanceur de tenons représente les drones armés de Tony. Ces unités automatisées fournissent une puissance de feu dans le cadre de l'initiative de maintien de la paix de Stark.",
    description_es: "La Legión de Hierro con cabeza azul oscuro, casco de una pieza y lanzador de tachuelas representa los drones armados de Tony. Estas unidades automatizadas proporcionan potencia de fuego como parte de la iniciativa de paz de Stark."
  },
  {
    minifigure_no: 'sh1036',
    description_en: "Dum-E with yellow mechanical claw represents Tony Stark's loyal robot assistant. This workshop companion provides comic relief while helping with Iron Man armor maintenance and repairs.",
    description_de: "Dum-E mit gelber mechanischer Klaue repräsentiert Tony Starks treuen Roboter-Assistenten. Dieser Werkstatt-Begleiter sorgt für komische Erleichterung, während er bei der Wartung und Reparatur der Iron Man-Rüstung hilft.",
    description_fr: "Dum-E avec une pince mécanique jaune représente l'assistant robot fidèle de Tony Stark. Ce compagnon d'atelier fournit un soulagement comique tout en aidant à l'entretien et aux réparations de l'armure Iron Man.",
    description_es: "Dum-E con garra mecánica amarilla representa al leal asistente robot de Tony Stark. Este compañero de taller proporciona alivio cómico mientras ayuda con el mantenimiento y reparaciones de la armadura de Iron Man."
  },
  {
    minifigure_no: 'sh1037',
    description_en: "Dr. Octopus (Otto Octavius) in dark green suit half Venomized features 2 mechanical arms and 2 back appendages. This hybrid villain combines Doc Ock's intelligence with symbiote enhancement for devastating effect.",
    description_de: "Dr. Octopus (Otto Octavius) im dunkelgrünen Anzug halb venomisiert hat 2 mechanische Arme und 2 Rückenanhänge. Dieser Hybrid-Bösewicht kombiniert Doc Ocks Intelligenz mit Symbioten-Verstärkung für verheerende Wirkung.",
    description_fr: "Dr. Octopus (Otto Octavius) en costume vert foncé à moitié Venomisé présente 2 bras mécaniques et 2 appendices dorsaux. Ce méchant hybride combine l'intelligence de Doc Ock avec l'amélioration du symbiote pour un effet dévastateur.",
    description_es: "Dr. Octopus (Otto Octavius) en traje verde oscuro medio Venomizado presenta 2 brazos mecánicos y 2 apéndices traseros. Este villano híbrido combina la inteligencia de Doc Ock con mejora de simbionte para efecto devastador."
  },
  {
    minifigure_no: 'sh1038',
    description_en: "Iron Patriot MK1 with stud shooter represents James Rhodes in the government-painted armor. This red, white, and blue suit serves as War Machine's patriotic rebranding during Iron Man 3.",
    description_de: "Iron Patriot MK1 mit Noppen-Shooter repräsentiert James Rhodes in der regierungsbemalten Rüstung. Dieser rot-weiß-blaue Anzug dient als War Machines patriotisches Rebranding während Iron Man 3.",
    description_fr: "Iron Patriot MK1 avec lanceur de tenons représente James Rhodes dans l'armure peinte par le gouvernement. Cette combinaison rouge, blanc et bleu sert de reconversion patriotique de War Machine pendant Iron Man 3.",
    description_es: "Iron Patriot MK1 con lanzador de tachuelas representa a James Rhodes en la armadura pintada por el gobierno. Este traje rojo, blanco y azul sirve como rebranding patriótico de War Machine durante Iron Man 3."
  },
  {
    minifigure_no: 'sh1039',
    description_en: "Pepper Potts in black suit with reddish orange ponytail represents Tony Stark's CEO and partner. Virginia 'Pepper' Potts manages Stark Industries while supporting Iron Man's heroic activities.",
    description_de: "Pepper Potts im schwarzen Anzug mit rotorangen Pferdeschwanz repräsentiert Tony Starks CEO und Partnerin. Virginia 'Pepper' Potts verwaltet Stark Industries, während sie Iron Mans heroische Aktivitäten unterstützt.",
    description_fr: "Pepper Potts en costume noir avec une queue de cheval orange rougeâtre représente la PDG et partenaire de Tony Stark. Virginia 'Pepper' Potts dirige Stark Industries tout en soutenant les activités héroïques d'Iron Man.",
    description_es: "Pepper Potts en traje negro con cola de caballo naranja rojiza representa a la CEO y compañera de Tony Stark. Virginia 'Pepper' Potts administra Stark Industries mientras apoya las actividades heroicas de Iron Man."
  },
  {
    minifigure_no: 'sh1040',
    description_en: "Iron Man Mark 6 armor with large helmet visor and trans-light blue head shows the arc reactor glowing through. This iconic armor features the triangular chest piece that powered Tony through the Avengers era.",
    description_de: "Iron Man Mark 6-Rüstung mit großem Helmvisier und transparent-hellblauem Kopf zeigt den leuchtenden Arc-Reaktor. Diese ikonische Rüstung hat das dreieckige Bruststück, das Tony durch die Avengers-Ära antrieb.",
    description_fr: "L'armure Iron Man Mark 6 avec une grande visière de casque et une tête bleu clair transparente montre le réacteur arc brillant à travers. Cette armure emblématique présente la pièce de poitrine triangulaire qui a propulsé Tony à travers l'ère des Avengers.",
    description_es: "La armadura Iron Man Mark 6 con visera grande de casco y cabeza azul claro transparente muestra el reactor arc brillando a través. Esta armadura icónica presenta la pieza de pecho triangular que impulsó a Tony a través de la era de los Vengadores."
  },
  {
    minifigure_no: 'sh1041',
    description_en: "Aldrich Killian with bare chest showing dragon tattoos represents the Extremis-enhanced villain. This Iron Man 3 antagonist combines biotech enhancement with terrorist schemes against Tony Stark.",
    description_de: "Aldrich Killian mit nackter Brust mit Drachen-Tätowierungen repräsentiert den Extremis-verstärkten Bösewicht. Dieser Iron Man 3-Antagonist kombiniert Biotech-Verstärkung mit terroristischen Plänen gegen Tony Stark.",
    description_fr: "Aldrich Killian avec une poitrine nue montrant des tatouages de dragon représente le méchant amélioré par Extremis. Cet antagoniste d'Iron Man 3 combine l'amélioration biotechnologique avec des stratagèmes terroristes contre Tony Stark.",
    description_es: "Aldrich Killian con pecho desnudo mostrando tatuajes de dragón representa al villano mejorado con Extremis. Este antagonista de Iron Man 3 combina mejora biotecnológica con planes terroristas contra Tony Stark."
  },
  {
    minifigure_no: 'sh1042',
    description_en: "Dum-E with black mechanical claw offers a variant coloring of Tony's robot assistant. This alternate workshop companion continues providing loyal service in Stark's laboratory.",
    description_de: "Dum-E mit schwarzer mechanischer Klaue bietet eine alternative Farbgebung von Tonys Roboter-Assistenten. Dieser alternative Werkstatt-Begleiter bietet weiterhin treuen Service in Starks Labor.",
    description_fr: "Dum-E avec une pince mécanique noire offre une coloration variante de l'assistant robot de Tony. Ce compagnon d'atelier alternatif continue de fournir un service fidèle dans le laboratoire de Stark.",
    description_es: "Dum-E con garra mecánica negra ofrece una coloración variante del asistente robot de Tony. Este compañero de taller alternativo continúa proporcionando servicio leal en el laboratorio de Stark."
  },
  {
    minifigure_no: 'sh1043',
    description_en: "Hulk minifigure in dark purple legs with helmet showcases Bruce Banner's transformation in armored form. This version adds protective gear to the gamma-powered hero's incredible strength.",
    description_de: "Hulk-Minifigur in dunkelvioletten Beinen mit Helm zeigt Bruce Banners Transformation in gepanzerter Form. Diese Version fügt Schutzausrüstung zur unglaublichen Stärke des Gamma-angetriebenen Helden hinzu.",
    description_fr: "La minifigurine de Hulk en jambes violet foncé avec casque présente la transformation de Bruce Banner sous forme blindée. Cette version ajoute un équipement de protection à la force incroyable du héros propulsé par les rayons gamma.",
    description_es: "La minifigura de Hulk en piernas moradas oscuras con casco muestra la transformación de Bruce Banner en forma blindada. Esta versión agrega equipo protector a la increíble fuerza del héroe impulsado por gamma."
  },
  {
    minifigure_no: 'sh1044',
    description_en: "Thanos minifigure in dark blue and gold outfit features dark blue arms, medium lavender hands, and shoulder armor. The Mad Titan seeks the Infinity Stones to reshape reality according to his twisted vision.",
    description_de: "Thanos-Minifigur im dunkelblauen und goldenen Outfit hat dunkelblaue Arme, mittellila Hände und Schulterpanzer. Der Wahnsinnige Titan sucht die Infinity Steine, um die Realität nach seiner verdrehten Vision umzugestalten.",
    description_fr: "La minifigurine de Thanos en tenue bleu foncé et or présente des bras bleu foncé, des mains lavande moyen et une armure d'épaule. Le Titan Fou cherche les Pierres d'Infinité pour remodeler la réalité selon sa vision tordue.",
    description_es: "La minifigura de Thanos en traje azul oscuro y oro presenta brazos azul oscuro, manos lavanda medio y armadura de hombro. El Titán Loco busca las Gemas del Infinito para remodelar la realidad según su visión retorcida."
  },
  {
    minifigure_no: 'sh1045',
    description_en: "Ant-Man (Scott Lang) in black suit with closed helmet represents the size-changing hero. The ex-burglar turned Avenger brings Pym Particles technology for shrinking and growing abilities.",
    description_de: "Ant-Man (Scott Lang) im schwarzen Anzug mit geschlossenem Helm repräsentiert den größenverändernden Helden. Der Ex-Einbrecher, der zum Avenger wurde, bringt Pym-Partikel-Technologie für Schrumpf- und Wachstumsfähigkeiten.",
    description_fr: "Ant-Man (Scott Lang) en costume noir avec casque fermé représente le héros changeant de taille. L'ex-cambrioleur devenu Avenger apporte la technologie des Particules Pym pour les capacités de rétrécissement et de croissance.",
    description_es: "Ant-Man (Scott Lang) en traje negro con casco cerrado representa al héroe que cambia de tamaño. El ex-ladrón convertido en Vengador trae tecnología de Partículas Pym para habilidades de encogimiento y crecimiento."
  },
  {
    minifigure_no: 'sh1046',
    description_en: "Iron Man Mark 85 armor with large helmet visor features thick red markings on torso. This final armor configuration represents Tony's ultimate suit design during the Endgame battle.",
    description_de: "Iron Man Mark 85-Rüstung mit großem Helmvisier hat dicke rote Markierungen am Torso. Diese finale Rüstungskonfiguration repräsentiert Tonys ultimatives Anzugsdesign während der Endgame-Schlacht.",
    description_fr: "L'armure Iron Man Mark 85 avec une grande visière de casque présente d'épaisses marques rouges sur le torse. Cette configuration d'armure finale représente le design de combinaison ultime de Tony pendant la bataille d'Endgame.",
    description_es: "La armadura Iron Man Mark 85 con visera grande de casco presenta marcas rojas gruesas en el torso. Esta configuración de armadura final representa el diseño de traje definitivo de Tony durante la batalla de Endgame."
  },
  {
    minifigure_no: 'sh1047',
    description_en: "Iron Spider with skeleton arms featuring barbs showcases Peter Parker's Stark-designed suit. The waldoes provide additional combat capabilities with their mechanical precision and striking power.",
    description_de: "Iron Spider mit Skelett-Armen mit Widerhaken zeigt Peter Parkers von Stark entworfenen Anzug. Die Waldoes bieten zusätzliche Kampffähigkeiten mit ihrer mechanischen Präzision und Schlagkraft.",
    description_fr: "Iron Spider avec des bras squelettes dotés de barbes présente la combinaison conçue par Stark de Peter Parker. Les waldoes offrent des capacités de combat supplémentaires avec leur précision mécanique et leur puissance de frappe.",
    description_es: "Iron Spider con brazos esqueléticos con púas muestra el traje diseñado por Stark de Peter Parker. Los waldoes proporcionan capacidades de combate adicionales con su precisión mecánica y poder de golpe."
  },
  {
    minifigure_no: 'sh1048',
    description_en: "Iron Man Mark 4 armor with large helmet visor and light nougat head represents Tony's earlier suit design. This configuration appeared during the Stark Expo demonstration before the Senate hearings.",
    description_de: "Iron Man Mark 4-Rüstung mit großem Helmvisier und hellbeigem Kopf repräsentiert Tonys früheres Anzugsdesign. Diese Konfiguration erschien während der Stark Expo-Demonstration vor den Senatsanhörungen.",
    description_fr: "L'armure Iron Man Mark 4 avec une grande visière de casque et une tête nougat clair représente le design de combinaison antérieur de Tony. Cette configuration est apparue pendant la démonstration de l'Expo Stark avant les audiences du Sénat.",
    description_es: "La armadura Iron Man Mark 4 con visera grande de casco y cabeza color nougat claro representa el diseño de traje anterior de Tony. Esta configuración apareció durante la demostración de la Expo Stark antes de las audiencias del Senado."
  },
  {
    minifigure_no: 'sh1049',
    description_en: "Reed Richards represents Mr. Fantastic of the Fantastic Four. The brilliant scientist leads the team with his elastic stretching powers and genius-level intellect.",
    description_de: "Reed Richards repräsentiert Mr. Fantastic der Fantastischen Vier. Der brillante Wissenschaftler führt das Team mit seinen elastischen Dehnungskräften und Genialitäts-Intellekt.",
    description_fr: "Reed Richards représente Mr. Fantastique des Quatre Fantastiques. Le scientifique brillant dirige l'équipe avec ses pouvoirs d'étirement élastique et son intellect de niveau génie.",
    description_es: "Reed Richards representa a Mr. Fantástico de Los Cuatro Fantásticos. El brillante científico lidera el equipo con sus poderes de estiramiento elástico e intelecto de nivel genio."
  },
  {
    minifigure_no: 'sh1050',
    description_en: "Sue Storm represents the Invisible Woman of the Fantastic Four. This founding member uses force fields and invisibility powers as the team's most powerful member.",
    description_de: "Sue Storm repräsentiert die Invisible Woman der Fantastischen Vier. Dieses Gründungsmitglied nutzt Kraftfelder und Unsichtbarkeits-Kräfte als mächtigstes Mitglied des Teams.",
    description_fr: "Sue Storm représente la Femme Invisible des Quatre Fantastiques. Ce membre fondateur utilise des champs de force et des pouvoirs d'invisibilité en tant que membre le plus puissant de l'équipe.",
    description_es: "Sue Storm representa a la Mujer Invisible de Los Cuatro Fantásticos. Esta miembro fundadora usa campos de fuerza y poderes de invisibilidad como el miembro más poderoso del equipo."
  }
];

async function updateDescriptions() {
  console.log(`Starting batch update: sh1026-sh1050 (${descriptions.length} minifigures)`);

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
