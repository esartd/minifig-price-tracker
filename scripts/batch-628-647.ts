import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0628',
    name: 'Gungan Warrior',
    description_en: 'Gungan Warriors from Naboo fought bravely against the droid army during the Battle of Naboo. These amphibious soldiers wielded distinctive energy weapons and shields. Gungan martial traditions proved surprisingly effective against battle droids. Their cooperation with the Naboo helped liberate the planet from Trade Federation control.',
    description_de: 'Gungan-Krieger von Naboo kämpften tapfer gegen die Droiden-Armee während der Schlacht von Naboo. Diese amphibischen Soldaten führten markante Energiewaffen und Schilde. Gungan-Kampftraditionen erwiesen sich als überraschend effektiv gegen Kampfdroiden. Ihre Zusammenarbeit mit den Naboo half, den Planeten von Handelsföderations-Kontrolle zu befreien.',
    description_fr: 'Les Guerriers Gungans de Naboo se sont battus courageusement contre l\'armée droïde pendant la Bataille de Naboo. Ces soldats amphibies maniaient des armes énergétiques et des boucliers distinctifs. Les traditions martiales Gungan se sont révélées étonnamment efficaces contre les droïdes de combat. Leur coopération avec les Naboo a aidé à libérer la planète du contrôle de la Fédération du Commerce.',
    description_es: 'Los Guerreros Gungan de Naboo lucharon valientemente contra el ejército droide durante la Batalla de Naboo. Estos soldados anfibios manejaban armas de energía y escudos distintivos. Las tradiciones marciales Gungan resultaron sorprendentemente efectivas contra droides de batalla. Su cooperación con los Naboo ayudó a liberar el planeta del control de la Federación de Comercio.'
  },
  {
    minifigure_no: 'sw0629',
    name: 'Clone Trooper Lieutenant (Phase 1) - Printed Legs, Scowl',
    description_en: 'Phase 1 Clone Lieutenants led squads during early Clone Wars campaigns. This scowling variant with printed legs showed officer determination. Blue markings identified lieutenant rank among clone forces. These NCOs bridged the gap between commanders and regular troopers.',
    description_de: 'Phase-1-Klon-Lieutenants führten Trupps während früher Klonkrieg-Kampagnen an. Diese mürrische Variante mit bedruckten Beinen zeigte Offiziers-Entschlossenheit. Blaue Markierungen identifizierten Lieutenant-Rang unter Klon-Streitkräften. Diese Unteroffiziere überbrückten die Lücke zwischen Kommandeuren und regulären Truppen.',
    description_fr: 'Les Lieutenants Clones Phase 1 dirigeaient des escouades pendant les premières campagnes des Guerres des Clones. Cette variante renfrognée avec jambes imprimées montrait la détermination d\'officier. Les marques bleues identifiaient le rang de lieutenant parmi les forces clones. Ces sous-officiers comblaient l\'écart entre commandants et soldats réguliers.',
    description_es: 'Los Tenientes Clon Fase 1 lideraban escuadrones durante campañas tempranas de Guerras Clon. Esta variante ceñuda con piernas impresas mostraba determinación de oficial. Las marcas azules identificaban rango de teniente entre fuerzas clon. Estos suboficiales cerraban la brecha entre comandantes y soldados regulares.'
  },
  {
    minifigure_no: 'sw0630',
    name: 'Imperial Stormtrooper Sergeant',
    description_en: 'Imperial Stormtrooper Sergeants led squad-level operations throughout occupied territories. Their rank markings distinguished them from regular troopers. These NCOs enforced discipline and coordinated tactical maneuvers. Sergeant-level leadership was essential to stormtrooper effectiveness.',
    description_de: 'Imperiale Sturmtruppler-Sergeants führten Trupp-Operationen in besetzten Territorien an. Ihre Rangabzeichen unterschieden sie von regulären Truppen. Diese Unteroffiziere setzten Disziplin durch und koordinierten taktische Manöver. Sergeant-Level-Führung war wesentlich für Sturmtruppler-Effektivität.',
    description_fr: 'Les Sergents Stormtroopers Impériaux dirigeaient des opérations au niveau de l\'escouade dans les territoires occupés. Leurs marques de rang les distinguaient des soldats réguliers. Ces sous-officiers appliquaient la discipline et coordonnaient les manœuvres tactiques. Le leadership au niveau sergent était essentiel à l\'efficacité des stormtroopers.',
    description_es: 'Los Sargentos Stormtrooper Imperiales lideraban operaciones a nivel de escuadrón en territorios ocupados. Sus marcas de rango los distinguían de soldados regulares. Estos suboficiales aplicaban disciplina y coordinaban maniobras tácticas. El liderazgo a nivel sargento era esencial para la efectividad de stormtroopers.'
  },
  {
    minifigure_no: 'sw0631',
    name: 'Boba Fett - White, Detailed Pattern',
    description_en: 'This white Boba Fett variant features detailed patterns showing his armor before repainting. Young Boba inherited his father Jango\'s armor and modified it over years. The white color showed the original Mandalorian armor base. This rare variant represents Boba\'s transition to legendary bounty hunter.',
    description_de: 'Diese weiße Boba-Fett-Variante zeigt detaillierte Muster seiner Rüstung vor Neuanstrich. Der junge Boba erbte die Rüstung seines Vaters Jango und modifizierte sie über Jahre. Die weiße Farbe zeigte die ursprüngliche mandalorianische Rüstungsbasis. Diese seltene Variante repräsentiert Bobas Übergang zum legendären Kopfgeldjäger.',
    description_fr: 'Cette variante blanche de Boba Fett présente des motifs détaillés montrant son armure avant repeinte. Le jeune Boba a hérité de l\'armure de son père Jango et l\'a modifiée au fil des années. La couleur blanche montrait la base d\'armure mandalorienne originale. Cette variante rare représente la transition de Boba vers chasseur de primes légendaire.',
    description_es: 'Esta variante blanca de Boba Fett presenta patrones detallados mostrando su armadura antes de repintar. El joven Boba heredó la armadura de su padre Jango y la modificó durante años. El color blanco mostraba la base de armadura mandaloriana original. Esta variante rara representa la transición de Boba a cazarrecompensas legendario.'
  },
  {
    minifigure_no: 'sw0632',
    name: 'Imperial TIE Fighter Pilot - Printed Arms',
    description_en: 'This TIE Fighter Pilot variant features printed arms showing updated detail. Imperial pilots flew the Empire\'s vast starfighter fleet. Their black flight suits and helmets provided life support in TIE cockpits. Mass-produced pilots represented the Empire\'s expendable military doctrine.',
    description_de: 'Diese TIE-Fighter-Pilot-Variante zeigt bedruckte Arme mit aktualisierten Details. Imperiale Piloten flogen die riesige Sternjäger-Flotte des Imperiums. Ihre schwarzen Fluganzüge und Helme boten Lebenserhaltung in TIE-Cockpits. Massenproduzierte Piloten repräsentierten die entbehrliche Militärdoktrin des Imperiums.',
    description_fr: 'Cette variante de Pilote de Chasseur TIE présente des bras imprimés montrant des détails mis à jour. Les pilotes impériaux pilotaient la vaste flotte de chasseurs stellaires de l\'Empire. Leurs combinaisons de vol et casques noirs fournissaient un support vital dans les cockpits TIE. Les pilotes produits en masse représentaient la doctrine militaire jetable de l\'Empire.',
    description_es: 'Esta variante de Piloto de Caza TIE presenta brazos impresos mostrando detalle actualizado. Los pilotos imperiales volaban la vasta flota de cazas estelares del Imperio. Sus trajes de vuelo y cascos negros proporcionaban soporte vital en cabinas TIE. Los pilotos producidos en masa representaban la doctrina militar prescindible del Imperio.'
  },
  {
    minifigure_no: 'sw0633',
    name: 'Admiral Wullf Yularen - White Uniform, White Combed Hair (Colonel)',
    description_en: 'Admiral Wullf Yularen served the Republic during the Clone Wars before joining the Imperial Security Bureau. This variant in white uniform with combed hair showed his distinguished service. Yularen coordinated naval operations with Jedi generals. His loyalty transferred from Republic to Empire seamlessly.',
    description_de: 'Admiral Wullf Yularen diente der Republik während der Klonkriege, bevor er dem Imperialen Sicherheitsbüro beitrat. Diese Variante in weißer Uniform mit gekämmtem Haar zeigte seinen ausgezeichneten Dienst. Yularen koordinierte Marine-Operationen mit Jedi-Generälen. Seine Loyalität wechselte nahtlos von Republik zu Imperium.',
    description_fr: 'L\'Amiral Wullf Yularen a servi la République pendant les Guerres des Clones avant de rejoindre le Bureau de Sécurité Impérial. Cette variante en uniforme blanc avec cheveux peignés montrait son service distingué. Yularen coordonnait les opérations navales avec les généraux Jedi. Sa loyauté est passée de la République à l\'Empire sans heurt.',
    description_es: 'El Almirante Wullf Yularen sirvió a la República durante las Guerras Clon antes de unirse a la Oficina de Seguridad Imperial. Esta variante en uniforme blanco con cabello peinado mostraba su servicio distinguido. Yularen coordinaba operaciones navales con generales Jedi. Su lealtad se transfirió de República a Imperio sin problemas.'
  },
  {
    minifigure_no: 'sw0634',
    name: 'Emperor Palpatine',
    description_en: 'Emperor Palpatine ruled the Galactic Empire through fear and dark side power. His wizened appearance showed the corrupting effects of the dark side. Palpatine\'s manipulation from Senator to Emperor defined the prequel trilogy. His death at Vader\'s hands ended the Empire\'s reign.',
    description_de: 'Emperor Palpatine regierte das Galaktische Imperium durch Angst und Macht der dunklen Seite. Sein verwelktes Aussehen zeigte die korrumpierenden Effekte der dunklen Seite. Palpatines Manipulation vom Senator zum Imperator definierte die Prequel-Trilogie. Sein Tod durch Vaders Hand beendete die Herrschaft des Imperiums.',
    description_fr: 'L\'Empereur Palpatine régnait sur l\'Empire Galactique par la peur et le pouvoir du côté obscur. Son apparence ridée montrait les effets corrupteurs du côté obscur. La manipulation de Palpatine de Sénateur à Empereur définissait la trilogie préquelle. Sa mort aux mains de Vador a mis fin au règne de l\'Empire.',
    description_es: 'El Emperador Palpatine gobernaba el Imperio Galáctico mediante miedo y poder del lado oscuro. Su apariencia marchita mostraba los efectos corruptores del lado oscuro. La manipulación de Palpatine de Senador a Emperador definió la trilogía de precuelas. Su muerte a manos de Vader terminó el reinado del Imperio.'
  },
  {
    minifigure_no: 'sw0635',
    name: 'Luke Skywalker - Jedi Master, Dark Tan Smooth Hair',
    description_en: 'Luke Skywalker as Jedi Master with dark tan smooth hair appeared in The Force Awakens. Decades after Return of the Jedi, Luke became a legendary teacher. His exile followed the tragedy of Ben Solo\'s fall. This older Luke showed the weight of failure and loss.',
    description_de: 'Luke Skywalker als Jedi-Meister mit dunklem beigen glatten Haaren erschien in Das Erwachen der Macht. Jahrzehnte nach Die Rückkehr der Jedi wurde Luke ein legendärer Lehrer. Sein Exil folgte der Tragödie von Ben Solos Fall. Dieser ältere Luke zeigte das Gewicht von Versagen und Verlust.',
    description_fr: 'Luke Skywalker en tant que Maître Jedi avec cheveux lisses beiges foncés est apparu dans Le Réveil de la Force. Des décennies après Le Retour du Jedi, Luke est devenu un enseignant légendaire. Son exil a suivi la tragédie de la chute de Ben Solo. Ce Luke plus âgé montrait le poids de l\'échec et de la perte.',
    description_es: 'Luke Skywalker como Maestro Jedi con cabello liso beige oscuro apareció en El Despertar de la Fuerza. Décadas después del Retorno del Jedi, Luke se convirtió en un maestro legendario. Su exilio siguió la tragedia de la caída de Ben Solo. Este Luke mayor mostraba el peso del fracaso y la pérdida.'
  },
  {
    minifigure_no: 'sw0636',
    name: 'Darth Vader (Type 2 Helmet)',
    description_en: 'Darth Vader with Type 2 helmet showed design refinements to the iconic dark lord. Vader\'s mechanical suit and life support defined his tragic existence. His redemption through saving Luke completed the saga\'s central arc. The Type 2 helmet featured improved printing detail.',
    description_de: 'Darth Vader mit Typ-2-Helm zeigte Design-Verfeinerungen des ikonischen dunklen Lords. Vaders mechanischer Anzug und Lebenserhaltung definierten seine tragische Existenz. Seine Erlösung durch Lukes Rettung vervollständigte den zentralen Bogen der Saga. Der Typ-2-Helm zeigte verbesserte Druck-Details.',
    description_fr: 'Dark Vador avec casque Type 2 montrait des raffinements de design au seigneur noir iconique. Le costume mécanique et le support vital de Vador définissaient son existence tragique. Sa rédemption en sauvant Luke a complété l\'arc central de la saga. Le casque Type 2 présentait des détails d\'impression améliorés.',
    description_es: 'Darth Vader con casco Tipo 2 mostraba refinamientos de diseño del señor oscuro icónico. El traje mecánico y soporte vital de Vader definían su existencia trágica. Su redención al salvar a Luke completó el arco central de la saga. El casco Tipo 2 presentaba detalle de impresión mejorado.'
  },
  {
    minifigure_no: 'sw0637',
    name: 'Obi-Wan Kenobi - Old, Light Bluish Gray Hair and Beard, Black Eyes, Starched Fabric Cape',
    description_en: 'Old Ben Kenobi with light bluish gray hair and starched fabric cape watched over Luke from Tatooine exile. His weathered appearance showed years of isolation. Obi-Wan\'s sacrifice aboard the Death Star became legendary. His Force ghost continued guiding Luke\'s journey to become a Jedi.',
    description_de: 'Der alte Ben Kenobi mit hellbläulich-grauem Haar und gestärktem Stoff-Umhang wachte über Luke aus Tatooine-Exil. Sein verwittertes Aussehen zeigte Jahre der Isolation. Obi-Wans Opfer an Bord des Todessterns wurde legendär. Sein Macht-Geist führte Lukes Reise zum Jedi weiter.',
    description_fr: 'Le vieux Ben Kenobi avec cheveux gris bleuté clair et cape en tissu amidonné veillait sur Luke depuis l\'exil de Tatooine. Son apparence usée montrait des années d\'isolation. Le sacrifice d\'Obi-Wan à bord de l\'Étoile de la Mort est devenu légendaire. Son fantôme de Force a continué à guider le voyage de Luke pour devenir Jedi.',
    description_es: 'El viejo Ben Kenobi con cabello gris azulado claro y capa de tela almidonada vigilaba a Luke desde el exilio de Tatooine. Su apariencia desgastada mostraba años de aislamiento. El sacrificio de Obi-Wan a bordo de la Estrella de la Muerte se volvió legendario. Su fantasma de Fuerza continuó guiando el viaje de Luke para convertirse en Jedi.'
  },
  {
    minifigure_no: 'sw0638',
    name: 'Naboo Security Officer - Reddish Brown and Sand Blue Uniform, Light Nougat Head, Hat with Neck Protector',
    description_en: 'Naboo Security Officers wore distinctive reddish brown and sand blue uniforms with protective hats. These officers maintained order during the peaceful planet\'s crisis. Their dedication to Queen Amidala never wavered during Trade Federation occupation. Security forces fought bravely to liberate Naboo.',
    description_de: 'Naboo-Sicherheitsoffiziere trugen markante rotbraune und sandblaue Uniformen mit Schutzhüten. Diese Offiziere hielten Ordnung während der Krise des friedlichen Planeten. Ihre Hingabe zu Königin Amidala wankte nie während der Handelsföderations-Besatzung. Sicherheitskräfte kämpften tapfer, um Naboo zu befreien.',
    description_fr: 'Les Officiers de Sécurité de Naboo portaient des uniformes brun rougeâtre et bleu sable distinctifs avec chapeaux protecteurs. Ces officiers maintenaient l\'ordre pendant la crise de la planète paisible. Leur dévouement à la Reine Amidala n\'a jamais faibli pendant l\'occupation de la Fédération du Commerce. Les forces de sécurité se sont battues courageusement pour libérer Naboo.',
    description_es: 'Los Oficiales de Seguridad de Naboo usaban uniformes marrón rojizo y azul arena distintivos con sombreros protectores. Estos oficiales mantenían orden durante la crisis del planeta pacífico. Su dedicación a la Reina Amidala nunca vaciló durante la ocupación de la Federación de Comercio. Las fuerzas de seguridad lucharon valientemente para liberar Naboo.'
  },
  {
    minifigure_no: 'sw0639',
    name: 'Captain Tarpals',
    description_en: 'Captain Tarpals led Gungan forces during the Battle of Naboo with distinction. This brave warrior commanded troops against the droid army. Tarpals\' military expertise proved crucial to the Gungan contribution. His leadership during the ground battle helped secure victory.',
    description_de: 'Captain Tarpals führte Gungan-Streitkräfte während der Schlacht von Naboo mit Auszeichnung an. Dieser tapfere Krieger befehligte Truppen gegen die Droiden-Armee. Tarpals\' militärische Expertise erwies sich als entscheidend für den Gungan-Beitrag. Seine Führung während der Bodenschlacht half, den Sieg zu sichern.',
    description_fr: 'Le Capitaine Tarpals a dirigé les forces Gungans pendant la Bataille de Naboo avec distinction. Ce brave guerrier commandait des troupes contre l\'armée droïde. L\'expertise militaire de Tarpals s\'est révélée cruciale pour la contribution Gungan. Son leadership pendant la bataille terrestre a aidé à assurer la victoire.',
    description_es: 'El Capitán Tarpals lideró fuerzas Gungan durante la Batalla de Naboo con distinción. Este valiente guerrero comandaba tropas contra el ejército droide. La pericia militar de Tarpals resultó crucial para la contribución Gungan. Su liderazgo durante la batalla terrestre ayudó a asegurar la victoria.'
  },
  {
    minifigure_no: 'sw0640',
    name: 'Anakin Skywalker - Short Legs, Short Tousled Hair, Belt with Pouches on Back',
    description_en: 'Young Anakin Skywalker with short legs represented the boy who would become Darth Vader. His tousled hair and innocent appearance contrasted with his dark future. Anakin\'s natural piloting ability and Force sensitivity marked him as the Chosen One. This variant captured him before tragedy struck.',
    description_de: 'Der junge Anakin Skywalker mit kurzen Beinen repräsentierte den Jungen, der Darth Vader werden würde. Sein zerzaustes Haar und unschuldiges Erscheinungsbild kontrastierten mit seiner dunklen Zukunft. Anakins natürliche Pilotenfähigkeit und Macht-Empfindlichkeit kennzeichneten ihn als den Auserwählten. Diese Variante erfasste ihn vor der Tragödie.',
    description_fr: 'Le jeune Anakin Skywalker avec jambes courtes représentait le garçon qui deviendrait Dark Vador. Ses cheveux ébouriffés et son apparence innocente contrastaient avec son avenir sombre. La capacité de pilotage naturelle et la sensibilité à la Force d\'Anakin le marquaient comme l\'Élu. Cette variante le capturait avant que la tragédie ne frappe.',
    description_es: 'El joven Anakin Skywalker con piernas cortas representaba al niño que se convertiría en Darth Vader. Su cabello despeinado y apariencia inocente contrastaban con su futuro oscuro. La habilidad de pilotaje natural y sensibilidad a la Fuerza de Anakin lo marcaban como el Elegido. Esta variante lo capturaba antes de que golpeara la tragedia.'
  },
  {
    minifigure_no: 'sw0641',
    name: 'Naboo Fighter Pilot - Medium Nougat Jacket',
    description_en: 'Naboo Fighter Pilots flew N-1 starfighters defending their peaceful planet. This variant in medium nougat jacket showed pilot gear. These brave aviators participated in the space battle against the Trade Federation. Young Anakin\'s heroic destruction of the droid control ship came from this squadron.',
    description_de: 'Naboo-Fighter-Piloten flogen N-1-Sternjäger zur Verteidigung ihres friedlichen Planeten. Diese Variante in mittlerer Nougat-Jacke zeigte Pilotenausrüstung. Diese mutigen Flieger nahmen an der Raumschlacht gegen die Handelsföderation teil. Der junge Anakins heroische Zerstörung des Droiden-Kontrollschiffs kam aus dieser Staffel.',
    description_fr: 'Les Pilotes de Chasseurs Naboo pilotaient des chasseurs stellaires N-1 défendant leur planète paisible. Cette variante en veste nougat moyen montrait l\'équipement de pilote. Ces braves aviateurs participaient à la bataille spatiale contre la Fédération du Commerce. La destruction héroïque du vaisseau de contrôle droïde par le jeune Anakin venait de cet escadron.',
    description_es: 'Los Pilotos de Cazas Naboo volaban cazas estelares N-1 defendiendo su planeta pacífico. Esta variante en chaqueta beige medio mostraba equipo de piloto. Estos valientes aviadores participaban en la batalla espacial contra la Federación de Comercio. La heroica destrucción de la nave de control droide del joven Anakin vino de este escuadrón.'
  },
  {
    minifigure_no: 'sw0642',
    name: 'Droideka (Destroyer Droid) - Reddish Brown Triangles without Stickers',
    description_en: 'Droidekas were deadly destroyer droids rolling into battle with shields and twin blasters. This variant without stickers showed the base design. These formidable machines terrified opponents with overwhelming firepower. Their personal shields made them nearly invincible to standard weapons.',
    description_de: 'Droidekas waren tödliche Zerstörer-Droiden, die mit Schilden und Zwillings-Blastern in die Schlacht rollten. Diese Variante ohne Aufkleber zeigte das Basis-Design. Diese furchterregenden Maschinen erschreckten Gegner mit überwältigender Feuerkraft. Ihre persönlichen Schilde machten sie fast unbesiegbar gegen Standard-Waffen.',
    description_fr: 'Les Droidekas étaient des droïdes destructeurs mortels roulant au combat avec boucliers et blasters jumeaux. Cette variante sans autocollants montrait le design de base. Ces machines formidables terrifiaient les adversaires avec une puissance de feu écrasante. Leurs boucliers personnels les rendaient presque invincibles aux armes standard.',
    description_es: 'Los Droidekas eran droides destructores mortales rodando a batalla con escudos y blasters gemelos. Esta variante sin calcomanías mostraba el diseño base. Estas máquinas formidables aterrorizaban oponentes con poder de fuego abrumador. Sus escudos personales los hacían casi invencibles a armas estándar.'
  },
  {
    minifigure_no: 'sw0643',
    name: 'Princess Leia - Endor Outfit, Dark Tan Jacket, Camouflage Cape, Sand Blue Legs',
    description_en: 'Princess Leia in Endor outfit with camouflage cape led the strike team to disable the Death Star shield generator. Her tactical gear suited forest operations. Leia\'s leadership and courage inspired the Rebel commandos. Her connection with Luke and Han defined the original trilogy.',
    description_de: 'Prinzessin Leia in Endor-Outfit mit Tarn-Umhang führte das Stoßtruppteam an, um den Todesstern-Schildgenerator zu deaktivieren. Ihre taktische Ausrüstung passte zu Waldoperationen. Leias Führung und Mut inspirierten die Rebellen-Commandos. Ihre Verbindung mit Luke und Han definierte die Original-Trilogie.',
    description_fr: 'La Princesse Leia en tenue d\'Endor avec cape de camouflage dirigeait l\'équipe d\'assaut pour désactiver le générateur de bouclier de l\'Étoile de la Mort. Son équipement tactique convenait aux opérations forestières. Le leadership et le courage de Leia inspiraient les commandos rebelles. Sa connexion avec Luke et Han définissait la trilogie originale.',
    description_es: 'La Princesa Leia en atuendo de Endor con capa de camuflaje lideró el equipo de asalto para desactivar el generador de escudo de la Estrella de la Muerte. Su equipo táctico se adaptaba a operaciones forestales. El liderazgo y coraje de Leia inspiraban a los comandos rebeldes. Su conexión con Luke y Han definió la trilogía original.'
  },
  {
    minifigure_no: 'sw0644',
    name: 'Han Solo - Endor Outfit, Dark Tan Camouflage Jacket, Smooth Hair',
    description_en: 'Han Solo in Endor camouflage outfit led the commando team against the shield generator. His dark tan jacket and smooth hair showed his military leadership role. Han\'s transformation from smuggler to general completed his character arc. His courage on Endor helped destroy the Empire.',
    description_de: 'Han Solo in Endor-Tarnoutfit führte das Commando-Team gegen den Schildgenerator an. Seine dunkle beige Jacke und glattes Haar zeigten seine militärische Führungsrolle. Hans Verwandlung vom Schmuggler zum General vervollständigte seinen Charakterbogen. Sein Mut auf Endor half, das Imperium zu zerstören.',
    description_fr: 'Han Solo en tenue de camouflage d\'Endor dirigeait l\'équipe de commando contre le générateur de bouclier. Sa veste beige foncé et ses cheveux lisses montraient son rôle de leadership militaire. La transformation de Han de contrebandier à général a complété son arc de personnage. Son courage sur Endor a aidé à détruire l\'Empire.',
    description_es: 'Han Solo en atuendo de camuflaje de Endor lideró el equipo de comando contra el generador de escudo. Su chaqueta beige oscuro y cabello liso mostraban su rol de liderazgo militar. La transformación de Han de contrabandista a general completó su arco de personaje. Su coraje en Endor ayudó a destruir el Imperio.'
  },
  {
    minifigure_no: 'sw0645',
    name: 'Endor Rebel Trooper - Olive Green',
    description_en: 'Endor Rebel Troopers in olive green camouflage conducted the crucial mission to destroy the shield generator. These commandos faced overwhelming odds against Imperial forces. Their forest camouflage suited Endor\'s terrain. These elite soldiers represented the Rebellion\'s best troops.',
    description_de: 'Endor-Rebellentruppen in olivgrüner Tarnung führten die entscheidende Mission zur Zerstörung des Schildgenerators durch. Diese Commandos standen überwältigenden Chancen gegen imperiale Streitkräfte gegenüber. Ihre Waldtarnung passte zu Endors Gelände. Diese Elite-Soldaten repräsentierten die besten Truppen der Rebellion.',
    description_fr: 'Les Soldats Rebelles d\'Endor en camouflage vert olive menaient la mission cruciale pour détruire le générateur de bouclier. Ces commandos faisaient face à des chances écrasantes contre les forces impériales. Leur camouflage forestier convenait au terrain d\'Endor. Ces soldats d\'élite représentaient les meilleures troupes de la Rébellion.',
    description_es: 'Los Soldados Rebeldes de Endor en camuflaje verde oliva realizaban la misión crucial para destruir el generador de escudo. Estos comandos enfrentaban probabilidades abrumadoras contra fuerzas imperiales. Su camuflaje forestal se adaptaba al terreno de Endor. Estos soldados de élite representaban las mejores tropas de la Rebelión.'
  },
  {
    minifigure_no: 'sw0646',
    name: 'Endor Rebel Trooper - Dark Tan Vest, Tan Beard (Commander Rex)',
    description_en: 'This Endor trooper represents Commander Rex, the legendary clone who fought from the Clone Wars through to Endor. His tan beard showed decades of service. Rex\'s presence at Endor connected the prequel and original trilogies. His survival and continued service inspired generations.',
    description_de: 'Dieser Endor-Truppen repräsentiert Commander Rex, den legendären Klon, der von den Klonkriegen bis Endor kämpfte. Sein beiger Bart zeigte Jahrzehnte des Dienstes. Rex\' Präsenz auf Endor verband Prequel- und Original-Trilogien. Sein Überleben und fortgesetzter Dienst inspirierte Generationen.',
    description_fr: 'Ce soldat d\'Endor représente le Commandant Rex, le clone légendaire qui a combattu depuis les Guerres des Clones jusqu\'à Endor. Sa barbe beige montrait des décennies de service. La présence de Rex à Endor connectait les trilogies préquelles et originales. Sa survie et son service continu ont inspiré des générations.',
    description_es: 'Este soldado de Endor representa al Comandante Rex, el clon legendario que luchó desde las Guerras Clon hasta Endor. Su barba beige mostraba décadas de servicio. La presencia de Rex en Endor conectaba las trilogías de precuelas y original. Su supervivencia y servicio continuado inspiraron generaciones.'
  },
  {
    minifigure_no: 'sw0647',
    name: 'Agent Alexsandr Kallus - Hair',
    description_en: 'Agent Kallus without helmet showed his human face beneath the Imperial ISB agent exterior. His eventual defection to the Rebellion proved redemption was possible. Kallus\' transformation from hunter to ally became a powerful Rebels storyline. His inside knowledge proved invaluable to the Rebel cause.',
    description_de: 'Agent Kallus ohne Helm zeigte sein menschliches Gesicht unter dem imperialen ISB-Agenten-Äußeren. Seine eventuelle Fahnenflucht zur Rebellion bewies, dass Erlösung möglich war. Kallus\' Verwandlung vom Jäger zum Verbündeten wurde eine mächtige Rebels-Geschichte. Sein Insiderwissen erwies sich als unschätzbar für die Rebellensache.',
    description_fr: 'L\'Agent Kallus sans casque montrait son visage humain sous l\'extérieur d\'agent ISB impérial. Sa défection éventuelle vers la Rébellion prouvait que la rédemption était possible. La transformation de Kallus de chasseur à allié est devenue une puissante histoire de Rebels. Ses connaissances internes se sont révélées inestimables pour la cause rebelle.',
    description_es: 'El Agente Kallus sin casco mostraba su rostro humano bajo el exterior de agente ISB imperial. Su eventual deserción a la Rebelión probó que la redención era posible. La transformación de Kallus de cazador a aliado se convirtió en una poderosa historia de Rebels. Su conocimiento interno resultó invaluable para la causa rebelde.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0628-sw0647...');

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

  console.log('Batch complete! 20 minifigs saved.');
  await prisma.$disconnect();
}

saveBatch();
