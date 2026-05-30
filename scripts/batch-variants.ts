import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0001a',
    name: 'Battle Droid - Tan, Angled Arms, 1 x 2 Plate on Back',
    description_en: 'Battle Droids formed the backbone of the Separatist droid army during the Clone Wars. This early variant features tan coloring with angled arms and a distinctive 1x2 plate mounting on the back for backpack attachments. These mass-produced droids were cheaply manufactured but effective in overwhelming numbers. Collectors value early variants for their historical significance in LEGO Star Wars.',
    description_de: 'Kampfdroiden bildeten das Rückgrat der Separatisten-Droiden-Armee während der Klonkriege. Diese frühe Variante verfügt über eine beige Färbung mit abgewinkelten Armen und einer markanten 1x2-Plattenmontage auf der Rückseite für Rucksack-Befestigungen. Diese massenproduzierten Droiden wurden billig hergestellt, waren aber in überwältigenden Zahlen effektiv. Sammler schätzen frühe Varianten wegen ihrer historischen Bedeutung in LEGO Star Wars.',
    description_fr: 'Les Droïdes de Combat formaient l\'épine dorsale de l\'armée droïde séparatiste pendant les Guerres des Clones. Cette variante précoce présente une coloration beige avec des bras angulaires et une plaque 1x2 distinctive à l\'arrière pour les fixations de sac à dos. Ces droïdes produits en masse étaient fabriqués à bon marché mais efficaces en nombre écrasant. Les collectionneurs apprécient les variantes précoces pour leur signification historique dans LEGO Star Wars.',
    description_es: 'Los Droides de Batalla formaban la columna vertebral del ejército de droides separatistas durante las Guerras Clon. Esta variante temprana presenta coloración beige con brazos angulados y una placa 1x2 distintiva en la espalda para fijaciones de mochila. Estos droides producidos en masa se fabricaban baratos pero eran efectivos en números abrumadores. Los coleccionistas valoran las variantes tempranas por su significado histórico en LEGO Star Wars.'
  },
  {
    minifigure_no: 'sw0001b',
    name: 'Battle Droid - Tan, Angled Arms',
    description_en: 'This Battle Droid variant removes the back plate attachment while maintaining the characteristic tan coloring and angled arm design. The simplified construction reflects LEGO\'s evolution of Battle Droid design across different sets. These droids served under Trade Federation and Separatist command throughout the prequel trilogy. This version appears in numerous Clone Wars era sets.',
    description_de: 'Diese Kampfdroiden-Variante entfernt die Rückenplattenbefestigung, behält aber die charakteristische beige Färbung und das abgewinkelte Armdesign bei. Die vereinfachte Konstruktion spiegelt LEGOs Entwicklung des Kampfdroiden-Designs über verschiedene Sets hinweg wider. Diese Droiden dienten unter dem Kommando der Handelsföderation und der Separatisten während der gesamten Prequel-Trilogie. Diese Version erscheint in zahlreichen Klonkriegs-Sets.',
    description_fr: 'Cette variante de Droïde de Combat supprime la fixation de plaque arrière tout en conservant la coloration beige caractéristique et la conception de bras angulaires. La construction simplifiée reflète l\'évolution de LEGO de la conception des Droïdes de Combat à travers différents ensembles. Ces droïdes servaient sous le commandement de la Fédération du Commerce et des Séparatistes tout au long de la trilogie préquelle. Cette version apparaît dans de nombreux ensembles de l\'ère des Guerres des Clones.',
    description_es: 'Esta variante de Droide de Batalla elimina la fijación de placa trasera mientras mantiene la coloración beige característica y el diseño de brazos angulados. La construcción simplificada refleja la evolución de LEGO del diseño de Droides de Batalla a través de diferentes sets. Estos droides sirvieron bajo el mando de la Federación de Comercio y los Separatistas durante toda la trilogía de precuelas. Esta versión aparece en numerosos sets de la era de las Guerras Clon.'
  },
  {
    minifigure_no: 'sw0001c',
    name: 'Battle Droid - Tan, Angled Arm and Straight Arm',
    description_en: 'This unique Battle Droid variant features an asymmetric arm configuration with one angled arm and one straight arm, representing battle damage or manufacturing variations. The mixed arm design creates a distinctive appearance among Battle Droid variants. Such variations were common as the Separatists prioritized quantity over quality in droid production. Collectors seek this unusual asymmetric version for its rarity.',
    description_de: 'Diese einzigartige Kampfdroiden-Variante verfügt über eine asymmetrische Armkonfiguration mit einem abgewinkelten Arm und einem geraden Arm, die Kampfschäden oder Herstellungsvariationen darstellt. Das gemischte Armdesign schafft ein markantes Erscheinungsbild unter Kampfdroiden-Varianten. Solche Variationen waren üblich, da die Separatisten Quantität über Qualität in der Droiden-Produktion priorisierten. Sammler suchen diese ungewöhnliche asymmetrische Version wegen ihrer Seltenheit.',
    description_fr: 'Cette variante unique de Droïde de Combat présente une configuration de bras asymétrique avec un bras angulaire et un bras droit, représentant des dommages de bataille ou des variations de fabrication. La conception de bras mixte crée une apparence distinctive parmi les variantes de Droïdes de Combat. De telles variations étaient courantes car les Séparatistes privilégiaient la quantité à la qualité dans la production de droïdes. Les collectionneurs recherchent cette version asymétrique inhabituelle pour sa rareté.',
    description_es: 'Esta variante única de Droide de Batalla presenta una configuración de brazos asimétrica con un brazo angulado y un brazo recto, representando daño de batalla o variaciones de fabricación. El diseño de brazos mixto crea una apariencia distintiva entre las variantes de Droides de Batalla. Tales variaciones eran comunes ya que los Separatistas priorizaban cantidad sobre calidad en la producción de droides. Los coleccionistas buscan esta versión asimétrica inusual por su rareza.'
  },
  {
    minifigure_no: 'sw0001d',
    name: 'Battle Droid - Tan, Straight Arms',
    description_en: 'This Battle Droid variant features both arms in straight configuration, representing a later design refinement in LEGO\'s Battle Droid production. The straight arms provide different posing options compared to angled arm variants. These droids appeared extensively in Trade Federation and Separatist ground forces. The evolution from angled to straight arms reflects LEGO\'s ongoing improvements to minifigure articulation.',
    description_de: 'Diese Kampfdroiden-Variante verfügt über beide Arme in gerader Konfiguration, was eine spätere Design-Verfeinerung in LEGOs Kampfdroiden-Produktion darstellt. Die geraden Arme bieten andere Posierungsoptionen im Vergleich zu Varianten mit abgewinkelten Armen. Diese Droiden erschienen ausgiebig in den Bodentruppen der Handelsföderation und der Separatisten. Die Entwicklung von abgewinkelten zu geraden Armen spiegelt LEGOs fortlaufende Verbesserungen der Minifiguren-Artikulation wider.',
    description_fr: 'Cette variante de Droïde de Combat présente les deux bras en configuration droite, représentant un raffinement de conception ultérieur dans la production de Droïdes de Combat de LEGO. Les bras droits offrent des options de pose différentes par rapport aux variantes de bras angulaires. Ces droïdes sont apparus largement dans les forces terrestres de la Fédération du Commerce et des Séparatistes. L\'évolution des bras angulaires vers droits reflète les améliorations continues de LEGO à l\'articulation des minifigurines.',
    description_es: 'Esta variante de Droide de Batalla presenta ambos brazos en configuración recta, representando un refinamiento de diseño posterior en la producción de Droides de Batalla de LEGO. Los brazos rectos proporcionan diferentes opciones de pose en comparación con variantes de brazos angulados. Estos droides aparecieron extensamente en fuerzas terrestres de la Federación de Comercio y Separatistas. La evolución de brazos angulados a rectos refleja las mejoras continuas de LEGO a la articulación de minifiguras.'
  },
  {
    minifigure_no: 'sw0002a',
    name: 'Boba Fett - Bluish Grays',
    description_en: 'Boba Fett is the galaxy\'s most infamous bounty hunter, wearing Mandalorian armor inherited from his father Jango Fett. This variant features bluish gray color scheme reflecting his iconic armor appearance. Boba tracked the Millennium Falcon and delivered Han Solo frozen in carbonite to Jabba the Hutt. His mysterious reputation and distinctive armor make him one of the most popular Star Wars characters among collectors.',
    description_de: 'Boba Fett ist der berüchtigtste Kopfgeldjäger der Galaxis und trägt mandalorianische Rüstung, die er von seinem Vater Jango Fett geerbt hat. Diese Variante verfügt über ein bläulich-graues Farbschema, das das Erscheinungsbild seiner ikonischen Rüstung widerspiegelt. Boba verfolgte den Millennium Falcon und lieferte Han Solo eingefroren in Karbonit an Jabba the Hutt. Sein mysteriöser Ruf und seine markante Rüstung machen ihn zu einem der beliebtesten Star Wars-Charaktere unter Sammlern.',
    description_fr: 'Boba Fett est le chasseur de primes le plus tristement célèbre de la galaxie, portant une armure mandalorienne héritée de son père Jango Fett. Cette variante présente un schéma de couleurs gris bleuté reflétant l\'apparence iconique de son armure. Boba a traqué le Faucon Millenium et livré Han Solo gelé dans la carbonite à Jabba le Hutt. Sa réputation mystérieuse et son armure distinctive en font l\'un des personnages Star Wars les plus populaires parmi les collectionneurs.',
    description_es: 'Boba Fett es el cazarrecompensas más infame de la galaxia, vistiendo armadura mandaloriana heredada de su padre Jango Fett. Esta variante presenta un esquema de color gris azulado reflejando la apariencia icónica de su armadura. Boba rastreó el Halcón Milenario y entregó a Han Solo congelado en carbonita a Jabba el Hutt. Su reputación misteriosa y armadura distintiva lo hacen uno de los personajes de Star Wars más populares entre coleccionistas.'
  },
  {
    minifigure_no: 'sw0002b',
    name: 'Boba Fett - Bluish Grays - Dark Red Helmet Highlights',
    description_en: 'This Boba Fett variant features enhanced helmet detailing with dark red highlights, providing greater screen accuracy to his armor appearance. The improved printing captures the weathered, battle-worn look of Boba\'s distinctive T-visor helmet. Boba Fett survived the Sarlacc pit and continued his bounty hunting career throughout the expanded universe. Updated variants like this reflect LEGO\'s commitment to increasingly accurate character representations.',
    description_de: 'Diese Boba-Fett-Variante verfügt über verbesserte Helmdetails mit dunkelroten Akzenten, die eine größere Bildschirmgenauigkeit seines Rüstungserscheinungsbilds bieten. Der verbesserte Druck erfasst den verwitterten, kampfabgenutzten Look von Bobas markanten T-Visier-Helm. Boba Fett überlebte die Sarlacc-Grube und setzte seine Kopfgeldjäger-Karriere im erweiterten Universum fort. Aktualisierte Varianten wie diese spiegeln LEGOs Engagement für zunehmend genaue Charakterdarstellungen wider.',
    description_fr: 'Cette variante de Boba Fett présente des détails de casque améliorés avec des reflets rouge foncé, offrant une plus grande précision d\'écran à l\'apparence de son armure. L\'impression améliorée capture l\'aspect patiné et usé par la bataille du casque distinctif à visière en T de Boba. Boba Fett a survécu au puits de Sarlacc et a poursuivi sa carrière de chasseur de primes dans l\'univers étendu. Les variantes mises à jour comme celle-ci reflètent l\'engagement de LEGO envers des représentations de personnages de plus en plus précises.',
    description_es: 'Esta variante de Boba Fett presenta detalles de casco mejorados con reflejos rojo oscuro, proporcionando mayor precisión de pantalla a la apariencia de su armadura. La impresión mejorada captura el aspecto desgastado y gastado por batalla del distintivo casco con visor en T de Boba. Boba Fett sobrevivió al pozo de Sarlacc y continuó su carrera de cazarrecompensas a través del universo expandido. Variantes actualizadas como esta reflejan el compromiso de LEGO con representaciones de personajes cada vez más precisas.'
  },
  {
    minifigure_no: 'sw0004a',
    name: 'Darth Vader (Light Bluish Gray Head)',
    description_en: 'Darth Vader is the Dark Lord of the Sith and central villain of the original Star Wars trilogy. This variant features a light bluish gray head representing Vader\'s scarred face beneath the iconic black helmet and armor. Once Jedi Knight Anakin Skywalker, Vader serves Emperor Palpatine as supreme military commander. His redemption through saving Luke Skywalker completed his tragic arc from hero to villain to redeemed father.',
    description_de: 'Darth Vader ist der Dunkle Lord der Sith und zentrale Bösewicht der ursprünglichen Star Wars-Trilogie. Diese Variante verfügt über einen hellbläulich-grauen Kopf, der Vaders vernarbtes Gesicht unter dem ikonischen schwarzen Helm und der Rüstung darstellt. Einst Jedi-Ritter Anakin Skywalker, dient Vader Kaiser Palpatine als oberster Militärkommandant. Seine Erlösung durch die Rettung von Luke Skywalker vollendete seinen tragischen Bogen vom Helden zum Bösewicht zum erlösten Vater.',
    description_fr: 'Dark Vador est le Seigneur Noir des Sith et méchant central de la trilogie originale Star Wars. Cette variante présente une tête gris bleuté clair représentant le visage cicatrisé de Vador sous le casque noir iconique et l\'armure. Autrefois Chevalier Jedi Anakin Skywalker, Vador sert l\'Empereur Palpatine comme commandant militaire suprême. Sa rédemption en sauvant Luke Skywalker a complété son arc tragique de héros à méchant à père racheté.',
    description_es: 'Darth Vader es el Señor Oscuro de los Sith y villano central de la trilogía original de Star Wars. Esta variante presenta una cabeza gris azulado claro representando el rostro cicatrizado de Vader bajo el icónico casco negro y armadura. Una vez Caballero Jedi Anakin Skywalker, Vader sirve al Emperador Palpatine como comandante militar supremo. Su redención al salvar a Luke Skywalker completó su arco trágico de héroe a villano a padre redimido.'
  },
  {
    minifigure_no: 'sw0005a',
    name: 'Imperial Scout Trooper - Plain Black Head, Dark Bluish Gray Torso Print',
    description_en: 'Imperial Scout Troopers were specialized reconnaissance units deployed on Endor during Return of the Jedi. This early variant features a plain black head with dark bluish gray torso printing. Scout Troopers piloted speeder bikes through forest terrain hunting Rebel strike teams. Their lightweight armor prioritized mobility over protection, making them vulnerable to Ewok guerrilla tactics.',
    description_de: 'Imperiale Scout-Trooper waren spezialisierte Aufklärungseinheiten, die auf Endor während Die Rückkehr der Jedi-Ritter eingesetzt wurden. Diese frühe Variante verfügt über einen schlichten schwarzen Kopf mit dunkelblaugrauem Torso-Druck. Scout-Trooper pilotierten Speeder-Bikes durch Waldgelände auf der Jagd nach Rebellen-Einsatzteams. Ihre leichte Rüstung priorisierte Mobilität über Schutz, was sie anfällig für Ewok-Guerilla-Taktiken machte.',
    description_fr: 'Les Scout Troopers Impériaux étaient des unités de reconnaissance spécialisées déployées sur Endor pendant Le Retour du Jedi. Cette variante précoce présente une tête noire unie avec impression de torse gris bleuté foncé. Les Scout Troopers pilotaient des speeder bikes à travers le terrain forestier chassant les équipes de frappe rebelles. Leur armure légère privilégiait la mobilité à la protection, les rendant vulnérables aux tactiques de guérilla Ewok.',
    description_es: 'Los Scout Troopers Imperiales eran unidades de reconocimiento especializadas desplegadas en Endor durante El Retorno del Jedi. Esta variante temprana presenta una cabeza negra lisa con impresión de torso gris azulado oscuro. Los Scout Troopers pilotaban speeder bikes a través de terreno forestal cazando equipos de ataque rebeldes. Su armadura ligera priorizaba movilidad sobre protección, haciéndolos vulnerables a tácticas de guerrilla Ewok.'
  },
  {
    minifigure_no: 'sw0005b',
    name: 'Imperial Scout Trooper - Printed Black Head, Dark Bluish Gray Torso Print',
    description_en: 'This updated Scout Trooper variant features printed facial details on the black head piece, adding realism beneath the removable helmet. The dark bluish gray torso maintains authentic armor detailing. Scout Troopers formed part of the Imperial garrison protecting the Death Star II shield generator. Their high-speed pursuit of Luke and Leia\'s speeder bike became one of Return of the Jedi\'s most memorable action sequences.',
    description_de: 'Diese aktualisierte Scout-Trooper-Variante verfügt über gedruckte Gesichtsdetails auf dem schwarzen Kopfteil, was Realismus unter dem abnehmbaren Helm hinzufügt. Der dunkelblaugraue Torso behält authentische Rüstungsdetails bei. Scout-Trooper bildeten Teil der imperialen Garnison, die den Schildgenerator des Todessterns II schützte. Ihre Hochgeschwindigkeitsverfolgung von Lukes und Leias Speeder-Bike wurde eine der unvergesslichsten Actionsequenzen von Die Rückkehr der Jedi-Ritter.',
    description_fr: 'Cette variante mise à jour de Scout Trooper présente des détails faciaux imprimés sur la pièce de tête noire, ajoutant du réalisme sous le casque amovible. Le torse gris bleuté foncé maintient des détails d\'armure authentiques. Les Scout Troopers faisaient partie de la garnison impériale protégeant le générateur de bouclier de l\'Étoile de la Mort II. Leur poursuite à grande vitesse du speeder bike de Luke et Leia est devenue l\'une des séquences d\'action les plus mémorables du Retour du Jedi.',
    description_es: 'Esta variante actualizada de Scout Trooper presenta detalles faciales impresos en la pieza de cabeza negra, añadiendo realismo bajo el casco removible. El torso gris azulado oscuro mantiene detalles de armadura auténticos. Los Scout Troopers formaban parte de la guarnición imperial protegiendo el generador de escudo de la Estrella de la Muerte II. Su persecución de alta velocidad de la speeder bike de Luke y Leia se convirtió en una de las secuencias de acción más memorables de El Retorno del Jedi.'
  },
  {
    minifigure_no: 'sw0011a',
    name: 'Chewbacca - Reddish Brown',
    description_en: 'Chewbacca is the loyal Wookiee co-pilot of the Millennium Falcon and Han Solo\'s best friend. This variant features reddish brown coloring representing his distinctive fur. Chewbacca served as a warrior during the Clone Wars and later joined the Rebel Alliance. His strength, mechanical skills, and unwavering loyalty made him an invaluable member of the Rebel heroes throughout the original trilogy.',
    description_de: 'Chewbacca ist der loyale Wookiee-Copilot des Millennium Falcon und Han Solos bester Freund. Diese Variante verfügt über eine rotbraune Färbung, die sein markantes Fell darstellt. Chewbacca diente als Krieger während der Klonkriege und trat später der Rebellen-Allianz bei. Seine Stärke, mechanischen Fähigkeiten und unerschütterliche Loyalität machten ihn zu einem unschätzbaren Mitglied der Rebellen-Helden während der gesamten ursprünglichen Trilogie.',
    description_fr: 'Chewbacca est le copilote Wookiee loyal du Faucon Millenium et le meilleur ami de Han Solo. Cette variante présente une coloration brun rougeâtre représentant sa fourrure distinctive. Chewbacca a servi comme guerrier pendant les Guerres des Clones et a ensuite rejoint l\'Alliance Rebelle. Sa force, ses compétences mécaniques et sa loyauté inébranlable ont fait de lui un membre inestimable des héros rebelles tout au long de la trilogie originale.',
    description_es: 'Chewbacca es el leal copiloto Wookiee del Halcón Milenario y mejor amigo de Han Solo. Esta variante presenta coloración marrón rojizo representando su pelaje distintivo. Chewbacca sirvió como guerrero durante las Guerras Clon y más tarde se unió a la Alianza Rebelde. Su fuerza, habilidades mecánicas y lealtad inquebrantable lo convirtieron en un miembro invaluable de los héroes rebeldes durante toda la trilogía original.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for Star Wars minifigure variants...');

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

  console.log(`Batch complete! ${batch.length} minifigs saved.`);
  await prisma.$disconnect();
}

saveBatch();
