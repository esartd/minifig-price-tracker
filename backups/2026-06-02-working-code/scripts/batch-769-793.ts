import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    minifigure_no: 'sw0769',
    name: 'Death Star Trooper (Imperial Navy Trooper)',
    description_en: 'Death Star Troopers served as security forces aboard the Empire\'s ultimate weapon. These Imperial Navy troopers maintained order throughout the massive battle station. Their black uniforms and helmets distinguished them from regular stormtroopers. Death Star Troopers represented the elite personnel manning the galaxy\'s most feared installation.',
    description_de: 'Todesstern-Soldaten dienten als Sicherheitskräfte an Bord der ultimativen Waffe des Imperiums. Diese imperialen Marine-Soldaten hielten Ordnung in der gesamten massiven Kampfstation aufrecht. Ihre schwarzen Uniformen und Helme unterschieden sie von regulären Sturmtrupplern. Todesstern-Soldaten repräsentierten das Elite-Personal, das die gefürchtetste Installation der Galaxis bemannte.',
    description_fr: 'Les Soldats de l\'Étoile de la Mort servaient comme forces de sécurité à bord de l\'arme ultime de l\'Empire. Ces soldats de la Marine Impériale maintenaient l\'ordre dans toute la station de combat massive. Leurs uniformes et casques noirs les distinguaient des stormtroopers réguliers. Les Soldats de l\'Étoile de la Mort représentaient le personnel d\'élite maniant l\'installation la plus redoutée de la galaxie.',
    description_es: 'Los Soldados de la Estrella de la Muerte servían como fuerzas de seguridad a bordo del arma definitiva del Imperio. Estos soldados de Marina Imperial mantenían orden por toda estación de combate masiva. Sus uniformes y cascos negros los distinguían de stormtroopers regulares. Los Soldados de Estrella de la Muerte representaban personal de élite operando instalación más temida de galaxia.'
  },
  {
    minifigure_no: 'sw0770',
    name: 'Grand Moff Wilhuff Tarkin - Dark Bluish Gray Uniform, Swept Back Hair, Black Eyebrows',
    description_en: 'This Grand Moff Tarkin variant features dark bluish gray uniform with swept back hair and distinctive black eyebrows. His stern appearance reflected absolute authority over the Death Star. Tarkin\'s doctrine of ruling through fear shaped Imperial military strategy. This detailed variant captured the cold calculation of the Empire\'s most ruthless commander.',
    description_de: 'Diese Großmoff-Tarkin-Variante zeigt dunkle bläulich-graue Uniform mit zurückgekämmten Haaren und markanten schwarzen Augenbrauen. Sein strenges Erscheinungsbild spiegelte absolute Autorität über den Todesstern wider. Tarkins Doktrin der Herrschaft durch Angst prägte imperiale Militärstrategie. Diese detaillierte Variante erfasste die kalte Berechnung des rücksichtslosesten Kommandanten des Imperiums.',
    description_fr: 'Cette variante du Grand Moff Tarkin présente uniforme gris bleuté foncé avec cheveux lissés en arrière et sourcils noirs distinctifs. Son apparence sévère reflétait autorité absolue sur l\'Étoile de la Mort. La doctrine de Tarkin de régner par la peur façonnait stratégie militaire impériale. Cette variante détaillée capturait le calcul froid du commandant le plus impitoyable de l\'Empire.',
    description_es: 'Esta variante del Gran Moff Tarkin presenta uniforme gris azulado oscuro con cabello peinado hacia atrás y cejas negras distintivas. Su apariencia severa reflejaba autoridad absoluta sobre Estrella de la Muerte. La doctrina de Tarkin de gobernar mediante miedo moldeaba estrategia militar imperial. Esta variante detallada capturaba cálculo frío del comandante más despiadado del Imperio.'
  },
  {
    minifigure_no: 'sw0771',
    name: 'Han Solo - Black Vest with Pockets over Tan Shirt with Dark Tan Creases, Dark Blue Legs with Belts, Wavy Hair',
    description_en: 'This highly detailed Han Solo features black vest with pockets, creased tan shirt, and wavy hair. The intricate printing captured Han\'s iconic smuggler appearance with exceptional accuracy. His belt-printed dark blue legs and weathered clothing reflected years of dangerous adventures. This premium variant became a collector favorite for its attention to detail.',
    description_de: 'Dieser sehr detaillierte Han Solo zeigt schwarze Weste mit Taschen, zerknittertes beiges Hemd und welliges Haar. Der komplizierte Druck erfasste Hans ikonisches Schmuggler-Erscheinungsbild mit außergewöhnlicher Genauigkeit. Seine gürtelbedruckten dunkelblauen Beine und verwitterte Kleidung spiegelten Jahre gefährlicher Abenteuer wider. Diese Premium-Variante wurde ein Sammler-Favorit für ihre Liebe zum Detail.',
    description_fr: 'Ce Han Solo très détaillé présente gilet noir avec poches, chemise beige froissée et cheveux ondulés. L\'impression complexe capturait l\'apparence iconique de contrebandier de Han avec précision exceptionnelle. Ses jambes bleu foncé imprimées de ceinture et vêtements usés reflétaient années d\'aventures dangereuses. Cette variante premium devint favorite des collectionneurs pour son attention aux détails.',
    description_es: 'Este Han Solo muy detallado presenta chaleco negro con bolsillos, camisa beige arrugada y cabello ondulado. La impresión intrincada capturaba apariencia icónica de contrabandista de Han con precisión excepcional. Sus piernas azul oscuro impresas con cinturones y ropa desgastada reflejaban años de aventuras peligrosas. Esta variante premium se convirtió en favorita de coleccionistas por atención al detalle.'
  },
  {
    minifigure_no: 'sw0772',
    name: 'Han Solo - Stormtrooper Outfit, Printed Legs',
    description_en: 'Han Solo disguised as a stormtrooper infiltrated the Death Star to rescue Princess Leia. This variant with printed legs showed enhanced detail on his stolen armor. Han\'s stormtrooper disguise became one of the saga\'s most memorable moments. The printed legs added authenticity to this iconic infiltration scene.',
    description_de: 'Han Solo verkleidet als Sturmtruppler infiltrierte den Todesstern, um Prinzessin Leia zu retten. Diese Variante mit bedruckten Beinen zeigte verbesserte Details auf seiner gestohlenen Rüstung. Hans Sturmtruppler-Verkleidung wurde zu einem der unvergesslichsten Momente der Saga. Die bedruckten Beine fügten Authentizität zu dieser ikonischen Infiltrationsszene hinzu.',
    description_fr: 'Han Solo déguisé en stormtrooper infiltra l\'Étoile de la Mort pour sauver la Princesse Leia. Cette variante avec jambes imprimées montrait détail amélioré sur son armure volée. Le déguisement de stormtrooper de Han devint l\'un des moments les plus mémorables de la saga. Les jambes imprimées ajoutaient authenticité à cette scène d\'infiltration iconique.',
    description_es: 'Han Solo disfrazado como stormtrooper infiltró Estrella de la Muerte para rescatar a Princesa Leia. Esta variante con piernas impresas mostraba detalle mejorado en su armadura robada. El disfraz de stormtrooper de Han se convirtió en uno de momentos más memorables de saga. Las piernas impresas añadían autenticidad a esta escena de infiltración icónica.'
  },
  {
    minifigure_no: 'sw0773',
    name: 'Astromech Droid, R3-M3',
    description_en: 'R3-M3 served as an astromech droid with distinctive red and silver coloring. These R3 units provided navigation and repair services for starfighter operations. R3-M3\'s clear dome head revealed internal circuitry. This droid continued the tradition of loyal mechanical companions throughout Star Wars.',
    description_de: 'R3-M3 diente als Astromech-Droide mit markanter rot-silberner Färbung. Diese R3-Einheiten boten Navigation und Reparaturdienste für Sternjäger-Operationen. R3-M3s klarer Kuppelkopf enthüllte interne Schaltkreise. Dieser Droide setzte die Tradition treuer mechanischer Begleiter in Star Wars fort.',
    description_fr: 'R3-M3 servait comme droïde astromech avec coloration rouge et argentée distinctive. Ces unités R3 fournissaient navigation et services de réparation pour opérations de chasseurs stellaires. La tête à dôme transparent de R3-M3 révélait circuits internes. Ce droïde continuait la tradition de compagnons mécaniques loyaux dans Star Wars.',
    description_es: 'R3-M3 servía como droide astromech con coloración roja y plateada distintiva. Estas unidades R3 proporcionaban navegación y servicios de reparación para operaciones de cazas estelares. La cabeza de cúpula transparente de R3-M3 revelaba circuitos internos. Este droide continuaba tradición de compañeros mecánicos leales en Star Wars.'
  },
  {
    minifigure_no: 'sw0774',
    name: 'Imperial Non-Commissioned Officer (Lieutenant / Security, Stormtrooper Captain)',
    description_en: 'Imperial NCOs commanded stormtrooper units as lieutenants and security captains. Their uniforms marked them as experienced field commanders. These officers enforced discipline and tactical coordination in ground operations. Imperial NCOs bridged the gap between officers and enlisted troops.',
    description_de: 'Imperiale Unteroffiziere befehligten Sturmtruppler-Einheiten als Lieutenants und Sicherheits-Captains. Ihre Uniformen kennzeichneten sie als erfahrene Feldkommandanten. Diese Offiziere setzten Disziplin und taktische Koordination in Bodenoperationen durch. Imperiale Unteroffiziere überbrückten die Kluft zwischen Offizieren und Mannschaftssoldaten.',
    description_fr: 'Les sous-officiers impériaux commandaient unités de stormtroopers comme lieutenants et capitaines de sécurité. Leurs uniformes les marquaient comme commandants de terrain expérimentés. Ces officiers appliquaient discipline et coordination tactique dans opérations terrestres. Les sous-officiers impériaux comblaient l\'écart entre officiers et troupes enrôlées.',
    description_es: 'Los suboficiales imperiales comandaban unidades de stormtroopers como tenientes y capitanes de seguridad. Sus uniformes los marcaban como comandantes de campo experimentados. Estos oficiales aplicaban disciplina y coordinación táctica en operaciones terrestres. Los suboficiales imperiales cerraban brecha entre oficiales y tropas alistadas.'
  },
  {
    minifigure_no: 'sw0775',
    name: 'Imperial Officer - Light Bluish Gray Uniform',
    description_en: 'Imperial Officers in light bluish gray uniforms commanded various military branches. Their rank insignia indicated command authority over troops and installations. These officers enforced Imperial doctrine with ruthless efficiency. The light gray uniform distinguished them from higher-ranking black-uniformed commanders.',
    description_de: 'Imperiale Offiziere in hellbläulich-grauen Uniformen befehligten verschiedene Militärzweige. Ihre Rangabzeichen zeigten Befehlsgewalt über Truppen und Installationen. Diese Offiziere setzten imperiale Doktrin mit rücksichtsloser Effizienz durch. Die hellgraue Uniform unterschied sie von höherrangigen schwarz-uniformierten Kommandanten.',
    description_fr: 'Les Officiers Impériaux en uniformes gris bleuté clair commandaient diverses branches militaires. Leurs insignes de rang indiquaient autorité de commandement sur troupes et installations. Ces officiers appliquaient doctrine impériale avec efficacité impitoyable. L\'uniforme gris clair les distinguait des commandants de rang supérieur en uniforme noir.',
    description_es: 'Los Oficiales Imperiales en uniformes gris azulado claro comandaban varias ramas militares. Sus insignias de rango indicaban autoridad de mando sobre tropas e instalaciones. Estos oficiales aplicaban doctrina imperial con eficiencia despiadada. El uniforme gris claro los distinguía de comandantes de mayor rango en uniforme negro.'
  },
  {
    minifigure_no: 'sw0776',
    name: 'Interrogation Droid - Syringe',
    description_en: 'IT-O Interrogation Droids used syringes and truth serums to extract information from prisoners. This sinister droid\'s appearance aboard the Death Star terrorized captives. Their floating spherical design and multiple injector arms made them instruments of Imperial cruelty. Interrogation droids symbolized the Empire\'s disregard for individual rights.',
    description_de: 'IT-O-Verhör-Droiden verwendeten Spritzen und Wahrheitsseren, um Informationen von Gefangenen zu extrahieren. Das unheimliche Erscheinungsbild dieses Droiden an Bord des Todessterns terrorisierte Gefangene. Ihr schwebendes kugelförmiges Design und mehrere Injektions-Arme machten sie zu Instrumenten imperialer Grausamkeit. Verhör-Droiden symbolisierten die Missachtung individueller Rechte durch das Imperium.',
    description_fr: 'Les Droïdes d\'Interrogatoire IT-O utilisaient seringues et sérums de vérité pour extraire informations des prisonniers. L\'apparence sinistre de ce droïde à bord de l\'Étoile de la Mort terrorisait captifs. Leur conception sphérique flottante et multiples bras injecteurs en faisaient instruments de cruauté impériale. Les droïdes d\'interrogatoire symbolisaient le mépris de l\'Empire pour droits individuels.',
    description_es: 'Los Droides de Interrogatorio IT-O usaban jeringas y sueros de verdad para extraer información de prisioneros. La apariencia siniestra de este droide a bordo de Estrella de la Muerte aterrorizaba cautivos. Su diseño esférico flotante y múltiples brazos inyectores los convertían en instrumentos de crueldad imperial. Los droides de interrogatorio simbolizaban desprecio del Imperio por derechos individuales.'
  },
  {
    minifigure_no: 'sw0777',
    name: 'Luke Skywalker - Stormtrooper Outfit, Printed Legs, Tan Hair',
    description_en: 'Luke Skywalker disguised in stormtrooper armor infiltrated the Death Star alongside Han. This variant with printed legs and tan hair showed detailed armor printing. Luke\'s too-short stormtrooper disguise became a humorous moment in the rescue mission. The printed legs enhanced authenticity of this memorable infiltration scene.',
    description_de: 'Luke Skywalker verkleidet in Sturmtruppler-Rüstung infiltrierte den Todesstern zusammen mit Han. Diese Variante mit bedruckten Beinen und beigen Haaren zeigte detaillierte Rüstungsdrucke. Lukes zu kurze Sturmtruppler-Verkleidung wurde zu einem humorvollen Moment in der Rettungsmission. Die bedruckten Beine verbesserten die Authentizität dieser unvergesslichen Infiltrationsszene.',
    description_fr: 'Luke Skywalker déguisé en armure de stormtrooper infiltra l\'Étoile de la Mort avec Han. Cette variante avec jambes imprimées et cheveux beiges montrait impression d\'armure détaillée. Le déguisement de stormtrooper trop court de Luke devint moment humoristique dans la mission de sauvetage. Les jambes imprimées amélioraient authenticité de cette scène d\'infiltration mémorable.',
    description_es: 'Luke Skywalker disfrazado con armadura de stormtrooper infiltró Estrella de la Muerte junto a Han. Esta variante con piernas impresas y cabello beige mostraba impresión de armadura detallada. El disfraz de stormtrooper demasiado corto de Luke se convirtió en momento humorístico en misión de rescate. Las piernas impresas mejoraban autenticidad de esta escena de infiltración memorable.'
  },
  {
    minifigure_no: 'sw0778',
    name: 'Luke Skywalker (Tatooine, White Legs, Stern / Smile Face Print)',
    description_en: 'This Luke Skywalker variant features dual face printing showing both stern and smiling expressions. His white-legged Tatooine outfit captured the farm boy before his adventure began. The reversible head allowed displaying Luke\'s emotional range. This variant represented Luke at the threshold of destiny.',
    description_de: 'Diese Luke-Skywalker-Variante zeigt doppelten Gesichtsdruck mit sowohl strengen als auch lächelnden Ausdrücken. Sein weiß-beiniges Tatooine-Outfit erfasste den Farmjungen bevor sein Abenteuer begann. Der umkehrbare Kopf ermöglichte die Darstellung von Lukes emotionaler Bandbreite. Diese Variante repräsentierte Luke an der Schwelle des Schicksals.',
    description_fr: 'Cette variante de Luke Skywalker présente impression de visage double montrant expressions à la fois sévères et souriantes. Sa tenue de Tatooine à jambes blanches capturait le garçon de ferme avant que son aventure commence. La tête réversible permettait d\'afficher la gamme émotionnelle de Luke. Cette variante représentait Luke au seuil du destin.',
    description_es: 'Esta variante de Luke Skywalker presenta impresión de cara doble mostrando expresiones tanto severas como sonrientes. Su atuendo de Tatooine con piernas blancas capturaba al chico de granja antes de que su aventura comenzara. La cabeza reversible permitía mostrar rango emocional de Luke. Esta variante representaba a Luke en umbral del destino.'
  },
  {
    minifigure_no: 'sw0779',
    name: 'Princess Leia - White Dress, Detailed Belt with 3 Emblems, White Legs, Angry Frown / Lopsided Grin',
    description_en: 'This Princess Leia features detailed belt with three emblems and dual face printing. Her angry frown and lopsided grin captured Leia\'s fierce determination and hidden warmth. The white-legged dress showed her appearance during the Death Star rescue. This variant represented both Leia\'s strength and vulnerability.',
    description_de: 'Diese Prinzessin Leia zeigt detaillierten Gürtel mit drei Emblemen und doppelten Gesichtsdruck. Ihr wütendes Stirnrunzeln und schiefes Grinsen erfassten Leias wilde Entschlossenheit und verborgene Wärme. Das weiß-beinige Kleid zeigte ihr Erscheinungsbild während der Todesstern-Rettung. Diese Variante repräsentierte sowohl Leias Stärke als auch Verletzlichkeit.',
    description_fr: 'Cette Princesse Leia présente ceinture détaillée avec trois emblèmes et impression de visage double. Son froncement de colère et sourire de travers capturaient la détermination féroce et chaleur cachée de Leia. La robe à jambes blanches montrait son apparence pendant le sauvetage de l\'Étoile de la Mort. Cette variante représentait à la fois force et vulnérabilité de Leia.',
    description_es: 'Esta Princesa Leia presenta cinturón detallado con tres emblemas e impresión de cara doble. Su ceño fruncido enojado y sonrisa torcida capturaban determinación feroz y calidez oculta de Leia. El vestido con piernas blancas mostraba su apariencia durante rescate de Estrella de la Muerte. Esta variante representaba tanto fuerza como vulnerabilidad de Leia.'
  },
  {
    minifigure_no: 'sw0780',
    name: 'Bistan',
    description_en: 'Bistan was a space monkey gunner from Rogue One serving the Rebel Alliance. His species\' natural agility made him exceptional at aerial combat. Bistan manned door guns aboard U-wing transports during the Battle of Scarif. His enthusiastic fighting spirit and distinctive appearance made him a fan favorite.',
    description_de: 'Bistan war ein Weltraum-Affen-Schütze aus Rogue One, der der Rebellenallianz diente. Die natürliche Beweglichkeit seiner Spezies machte ihn außergewöhnlich im Luftkampf. Bistan bediente Türgeschütze an Bord von U-Wing-Transportern während der Schlacht von Scarif. Sein enthusiastischer Kampfgeist und markantes Erscheinungsbild machten ihn zu einem Fan-Favoriten.',
    description_fr: 'Bistan était un artilleur singe de l\'espace de Rogue One servant l\'Alliance Rebelle. L\'agilité naturelle de son espèce le rendait exceptionnel au combat aérien. Bistan manœuvrait canons de porte à bord de transports U-wing pendant la Bataille de Scarif. Son esprit combatif enthousiaste et apparence distinctive en firent un favori des fans.',
    description_es: 'Bistan era artillero mono espacial de Rogue One sirviendo a Alianza Rebelde. La agilidad natural de su especie lo hacía excepcional en combate aéreo. Bistan operaba cañones de puerta a bordo de transportes Ala-U durante Batalla de Scarif. Su espíritu de lucha entusiasta y apariencia distintiva lo convirtieron en favorito de fans.'
  },
  {
    minifigure_no: 'sw0781',
    name: 'Director Orson Callan Krennic',
    description_en: 'Director Krennic commanded the Death Star construction project with ruthless ambition. His white cape and distinctive uniform marked his authority over the Empire\'s ultimate weapon. Krennic\'s obsession with claiming credit for the Death Star drove Rogue One\'s narrative. His rivalry with Tarkin and confrontation with Galen Erso defined his tragic arc.',
    description_de: 'Direktor Krennic befehligte das Todesstern-Bauprojekt mit rücksichtslosem Ehrgeiz. Sein weißer Umhang und markante Uniform kennzeichneten seine Autorität über die ultimative Waffe des Imperiums. Krennics Besessenheit, Anerkennung für den Todesstern zu beanspruchen, trieb Rogue Ones Handlung an. Seine Rivalität mit Tarkin und Konfrontation mit Galen Erso definierten seinen tragischen Bogen.',
    description_fr: 'Le Directeur Krennic commandait le projet de construction de l\'Étoile de la Mort avec ambition impitoyable. Sa cape blanche et uniforme distinctif marquaient son autorité sur l\'arme ultime de l\'Empire. L\'obsession de Krennic de revendiquer crédit pour l\'Étoile de la Mort conduisait le récit de Rogue One. Sa rivalité avec Tarkin et confrontation avec Galen Erso définissaient son arc tragique.',
    description_es: 'El Director Krennic comandaba proyecto de construcción de Estrella de la Muerte con ambición despiadada. Su capa blanca y uniforme distintivo marcaban su autoridad sobre arma definitiva del Imperio. La obsesión de Krennic de reclamar crédito por Estrella de la Muerte impulsaba narrativa de Rogue One. Su rivalidad con Tarkin y confrontación con Galen Erso definían su arco trágico.'
  },
  {
    minifigure_no: 'sw0782',
    name: 'K-2SO Droid - Dark Bluish Gray and Silver Chest Panel',
    description_en: 'K-2SO was a reprogrammed Imperial security droid serving the Rebellion with brutal honesty. This dark bluish gray variant showed his imposing stature. K-2SO\'s dry wit and fierce loyalty made him Cassian Andor\'s trusted companion. His sacrifice during the Battle of Scarif became one of Rogue One\'s most emotional moments.',
    description_de: 'K-2SO war ein umprogrammierter imperialer Sicherheitsdroide, der der Rebellion mit brutaler Ehrlichkeit diente. Diese dunkle bläulich-graue Variante zeigte seine imposante Statur. K-2SOs trockener Witz und wilde Loyalität machten ihn zu Cassian Andors vertrautem Begleiter. Sein Opfer während der Schlacht von Scarif wurde zu einem der emotionalsten Momente von Rogue One.',
    description_fr: 'K-2SO était un droïde de sécurité impérial reprogrammé servant la Rébellion avec honnêteté brutale. Cette variante gris bleuté foncé montrait sa stature imposante. L\'esprit sec et loyauté féroce de K-2SO en faisaient le compagnon de confiance de Cassian Andor. Son sacrifice pendant la Bataille de Scarif devint l\'un des moments les plus émotionnels de Rogue One.',
    description_es: 'K-2SO era droide de seguridad imperial reprogramado sirviendo a Rebelión con honestidad brutal. Esta variante gris azulado oscuro mostraba su estatura imponente. El ingenio seco y lealtad feroz de K-2SO lo convertían en compañero de confianza de Cassian Andor. Su sacrificio durante Batalla de Scarif se convirtió en uno de momentos más emocionales de Rogue One.'
  },
  {
    minifigure_no: 'sw0783',
    name: 'Baze Malbus',
    description_en: 'Baze Malbus was a heavily armed warrior and Guardian of the Whills on Jedha. His powerful repeating blaster and practical armor made him a formidable fighter. Baze\'s friendship with Chirrut Îmwe defined both characters through their contrasting beliefs. His sacrifice alongside the Rogue One team helped secure the Death Star plans.',
    description_de: 'Baze Malbus war ein schwer bewaffneter Krieger und Wächter der Whills auf Jedha. Seine mächtige Repetierblaster und praktische Rüstung machten ihn zu einem gewaltigen Kämpfer. Bazes Freundschaft mit Chirrut Îmwe definierte beide Charaktere durch ihre kontrastierenden Überzeugungen. Sein Opfer zusammen mit dem Rogue One-Team half, die Todesstern-Pläne zu sichern.',
    description_fr: 'Baze Malbus était un guerrier lourdement armé et Gardien des Whills sur Jedha. Son puissant blaster à répétition et armure pratique en faisaient un combattant redoutable. L\'amitié de Baze avec Chirrut Îmwe définissait les deux personnages par leurs croyances contrastées. Son sacrifice aux côtés de l\'équipe Rogue One aida à sécuriser les plans de l\'Étoile de la Mort.',
    description_es: 'Baze Malbus era guerrero fuertemente armado y Guardián de los Whills en Jedha. Su poderoso bláster repetidor y armadura práctica lo convertían en luchador formidable. La amistad de Baze con Chirrut Îmwe definía ambos personajes por sus creencias contrastantes. Su sacrificio junto al equipo Rogue One ayudó a asegurar planos de Estrella de la Muerte.'
  },
  {
    minifigure_no: 'sw0784',
    name: 'Rebel Trooper (Lieutenant Sefla)',
    description_en: 'Lieutenant Sefla served as a Rebel trooper during the Battle of Scarif. Named characters like Sefla represented the countless individuals who fought for the Rebellion. These brave soldiers stormed Imperial installations knowing the odds against survival. Sefla\'s service exemplified ordinary heroes making extraordinary sacrifices.',
    description_de: 'Lieutenant Sefla diente als Rebellen-Soldat während der Schlacht von Scarif. Benannte Charaktere wie Sefla repräsentierten die unzähligen Individuen, die für die Rebellion kämpften. Diese tapferen Soldaten stürmten imperiale Installationen, wissend um die Chancen gegen das Überleben. Seflas Dienst verkörperte gewöhnliche Helden, die außergewöhnliche Opfer brachten.',
    description_fr: 'Le Lieutenant Sefla servait comme soldat rebelle pendant la Bataille de Scarif. Les personnages nommés comme Sefla représentaient les individus innombrables qui combattaient pour la Rébellion. Ces soldats braves prenaient d\'assaut installations impériales sachant les chances contre survie. Le service de Sefla exemplifiait héros ordinaires faisant sacrifices extraordinaires.',
    description_es: 'El Teniente Sefla servía como soldado rebelde durante Batalla de Scarif. Los personajes nombrados como Sefla representaban individuos incontables que luchaban por Rebelión. Estos soldados valientes asaltaban instalaciones imperiales sabiendo probabilidades contra supervivencia. El servicio de Sefla ejemplificaba héroes ordinarios haciendo sacrificios extraordinarios.'
  },
  {
    minifigure_no: 'sw0785',
    name: 'Imperial Ground Crew (Technician Kent Deezling)',
    description_en: 'Kent Deezling served as an Imperial ground crew technician maintaining TIE fighters and military equipment. These technical specialists kept Imperial war machines operational. Ground crew worked in dangerous conditions servicing armed starfighters. Their expertise ensured Imperial air superiority across occupied worlds.',
    description_de: 'Kent Deezling diente als imperialer Bodencrew-Techniker zur Wartung von TIE-Jägern und militärischer Ausrüstung. Diese technischen Spezialisten hielten imperiale Kriegsmaschinen betriebsbereit. Bodencrew arbeitete unter gefährlichen Bedingungen bei der Wartung bewaffneter Sternjäger. Ihre Expertise sicherte imperiale Luftüberlegenheit über besetzten Welten.',
    description_fr: 'Kent Deezling servait comme technicien d\'équipe au sol impériale maintenant chasseurs TIE et équipement militaire. Ces spécialistes techniques maintenaient machines de guerre impériales opérationnelles. L\'équipe au sol travaillait dans conditions dangereuses entretenant chasseurs stellaires armés. Leur expertise assurait supériorité aérienne impériale sur mondes occupés.',
    description_es: 'Kent Deezling servía como técnico de tripulación terrestre imperial manteniendo cazas TIE y equipo militar. Estos especialistas técnicos mantenían máquinas de guerra imperiales operativas. La tripulación terrestre trabajaba en condiciones peligrosas dando servicio a cazas estelares armados. Su pericia aseguraba superioridad aérea imperial sobre mundos ocupados.'
  },
  {
    minifigure_no: 'sw0786',
    name: 'Rebel Trooper (Private Basteren)',
    description_en: 'Private Basteren fought as a Rebel trooper during critical Alliance operations. These enlisted soldiers formed the backbone of Rebel ground forces. Basteren\'s service represented countless individuals who risked everything for freedom. Named privates personalized the sacrifice of ordinary soldiers fighting tyranny.',
    description_de: 'Private Basteren kämpfte als Rebellen-Soldat während kritischer Allianz-Operationen. Diese Mannschaftssoldaten bildeten das Rückgrat der Rebellen-Bodentruppen. Basternes Dienst repräsentierte unzählige Individuen, die alles für Freiheit riskierten. Benannte Soldaten personalisierten das Opfer gewöhnlicher Soldaten im Kampf gegen Tyrannei.',
    description_fr: 'Le Soldat Basteren combattait comme soldat rebelle pendant opérations critiques de l\'Alliance. Ces soldats enrôlés formaient l\'épine dorsale des forces terrestres rebelles. Le service de Basteren représentait individus innombrables qui risquaient tout pour la liberté. Les soldats nommés personnalisaient le sacrifice de soldats ordinaires combattant la tyrannie.',
    description_es: 'El Soldado Basteren luchaba como soldado rebelde durante operaciones críticas de Alianza. Estos soldados alistados formaban columna vertebral de fuerzas terrestres rebeldes. El servicio de Basteren representaba individuos incontables que arriesgaban todo por libertad. Los soldados nombrados personalizaban sacrificio de soldados ordinarios luchando contra tiranía.'
  },
  {
    minifigure_no: 'sw0787',
    name: 'Scarif Stormtrooper (Shoretrooper) (Captain)',
    description_en: 'Shoretrooper Captains commanded Imperial forces defending the Scarif archives. Their tan armor adapted to tropical environments contrasted with standard white stormtrooper gear. These specialized troops guarded the Empire\'s most sensitive data vault. Shoretroopers fought desperately to prevent the Death Star plans\' theft during Rogue One.',
    description_de: 'Shoretrooper-Captains befehligten imperiale Kräfte zur Verteidigung der Scarif-Archive. Ihre beige Rüstung angepasst an tropische Umgebungen kontrastierte mit Standard-weißer Sturmtruppler-Ausrüstung. Diese spezialisierten Truppen bewachten das empfindlichste Datentresor des Imperiums. Shoretroopers kämpften verzweifelt, um den Diebstahl der Todesstern-Pläne während Rogue One zu verhindern.',
    description_fr: 'Les Capitaines Shoretrooper commandaient forces impériales défendant les archives de Scarif. Leur armure beige adaptée aux environnements tropicaux contrastait avec équipement de stormtrooper blanc standard. Ces troupes spécialisées gardaient le coffre de données le plus sensible de l\'Empire. Les Shoretroopers combattaient désespérément pour empêcher le vol des plans de l\'Étoile de la Mort pendant Rogue One.',
    description_es: 'Los Capitanes Shoretrooper comandaban fuerzas imperiales defendiendo archivos de Scarif. Su armadura beige adaptada a entornos tropicales contrastaba con equipo de stormtrooper blanco estándar. Estas tropas especializadas custodiaban bóveda de datos más sensible del Imperio. Los Shoretroopers luchaban desesperadamente para prevenir robo de planos de Estrella de la Muerte durante Rogue One.'
  },
  {
    minifigure_no: 'sw0788',
    name: 'Imperial TIE Fighter / Striker Pilot',
    description_en: 'TIE Striker pilots flew specialized atmospheric fighters defending Imperial installations. Their helmets differed from standard TIE pilots for improved visibility. Strikers excelled at low-altitude combat and ground support missions. These pilots defended Scarif during the Rogue One assault with deadly effectiveness.',
    description_de: 'TIE-Striker-Piloten flogen spezialisierte atmosphärische Jäger zur Verteidigung imperialer Installationen. Ihre Helme unterschieden sich von Standard-TIE-Piloten für verbesserte Sichtbarkeit. Strikers zeichneten sich in Tiefflug-Kampf und Bodenunterstützungsmissionen aus. Diese Piloten verteidigten Scarif während des Rogue One-Angriffs mit tödlicher Effektivität.',
    description_fr: 'Les pilotes TIE Striker pilotaient chasseurs atmosphériques spécialisés défendant installations impériales. Leurs casques différaient des pilotes TIE standard pour visibilité améliorée. Les Strikers excellaient au combat à basse altitude et missions de soutien au sol. Ces pilotes défendaient Scarif pendant l\'assaut de Rogue One avec efficacité mortelle.',
    description_es: 'Los pilotos TIE Striker volaban cazas atmosféricos especializados defendiendo instalaciones imperiales. Sus cascos diferían de pilotos TIE estándar para visibilidad mejorada. Los Strikers sobresalían en combate a baja altitud y misiones de apoyo terrestre. Estos pilotos defendían Scarif durante asalto de Rogue One con efectividad mortal.'
  },
  {
    minifigure_no: 'sw0789',
    name: 'Chirrut Îmwe (Imwe)',
    description_en: 'Chirrut Îmwe was a blind warrior monk and Guardian of the Whills on Jedha. His faith in the Force guided his incredible combat abilities despite lacking sight. Chirrut\'s staff fighting skills and spiritual strength inspired the Rogue One team. His mantra "I am one with the Force" became iconic as he walked through blaster fire.',
    description_de: 'Chirrut Îmwe war ein blinder Krieger-Mönch und Wächter der Whills auf Jedha. Sein Glaube an die Macht leitete seine unglaublichen Kampffähigkeiten trotz fehlender Sicht. Chirruts Stabkampf-Fähigkeiten und spirituelle Stärke inspirierten das Rogue One-Team. Sein Mantra "Ich bin eins mit der Macht" wurde ikonisch, als er durch Blasterfeuer ging.',
    description_fr: 'Chirrut Îmwe était un moine guerrier aveugle et Gardien des Whills sur Jedha. Sa foi en la Force guidait ses capacités de combat incroyables malgré manque de vue. Les compétences de combat au bâton et force spirituelle de Chirrut inspiraient l\'équipe Rogue One. Son mantra "Je suis un avec la Force" devint iconique alors qu\'il marchait à travers tir de blaster.',
    description_es: 'Chirrut Îmwe era monje guerrero ciego y Guardián de los Whills en Jedha. Su fe en la Fuerza guiaba sus increíbles habilidades de combate a pesar de carecer de vista. Las habilidades de lucha con bastón y fuerza espiritual de Chirrut inspiraban al equipo Rogue One. Su mantra "Soy uno con la Fuerza" se volvió icónico mientras caminaba a través de fuego de bláster.'
  },
  {
    minifigure_no: 'sw0790',
    name: 'Cassian Andor - Dark Blue Coat',
    description_en: 'Cassian Andor was a Rebel intelligence officer who led the Rogue One mission. His dark blue coat reflected years of covert operations for the Alliance. Cassian\'s moral complexity and dedication to the cause made him a compelling hero. His partnership with Jyn Erso drove the mission to steal the Death Star plans.',
    description_de: 'Cassian Andor war ein Rebellen-Geheimdienstoffizier, der die Rogue One-Mission anführte. Sein dunkelblauer Mantel spiegelte Jahre verdeckter Operationen für die Allianz wider. Cassians moralische Komplexität und Hingabe an die Sache machten ihn zu einem fesselnden Helden. Seine Partnerschaft mit Jyn Erso trieb die Mission zum Diebstahl der Todesstern-Pläne an.',
    description_fr: 'Cassian Andor était un officier du renseignement rebelle qui dirigeait la mission Rogue One. Son manteau bleu foncé reflétait années d\'opérations secrètes pour l\'Alliance. La complexité morale et dévotion à la cause de Cassian en faisaient un héros convaincant. Son partenariat avec Jyn Erso conduisait la mission de voler les plans de l\'Étoile de la Mort.',
    description_es: 'Cassian Andor era oficial de inteligencia rebelde que lideró misión Rogue One. Su abrigo azul oscuro reflejaba años de operaciones encubiertas para Alianza. La complejidad moral y dedicación a la causa de Cassian lo convertían en héroe convincente. Su asociación con Jyn Erso impulsaba misión de robar planos de Estrella de la Muerte.'
  },
  {
    minifigure_no: 'sw0791',
    name: 'Jyn Erso',
    description_en: 'Jyn Erso led the Rogue One mission to steal the Death Star plans, daughter of weapon designer Galen Erso. Her troubled past and reluctant heroism defined her character arc. Jyn\'s determination to honor her father\'s sacrifice united the diverse Rogue One team. Her transmission of the Death Star plans sparked hope for the entire Rebellion.',
    description_de: 'Jyn Erso führte die Rogue One-Mission zum Diebstahl der Todesstern-Pläne, Tochter des Waffendesigners Galen Erso. Ihre schwierige Vergangenheit und widerwilliges Heldentum definierten ihren Charakterbogen. Jyns Entschlossenheit, das Opfer ihres Vaters zu ehren, vereinte das vielfältige Rogue One-Team. Ihre Übertragung der Todesstern-Pläne entfachte Hoffnung für die gesamte Rebellion.',
    description_fr: 'Jyn Erso dirigeait la mission Rogue One pour voler les plans de l\'Étoile de la Mort, fille du concepteur d\'armes Galen Erso. Son passé troublé et héroïsme réticent définissaient son arc de personnage. La détermination de Jyn à honorer le sacrifice de son père unissait l\'équipe Rogue One diverse. Sa transmission des plans de l\'Étoile de la Mort suscita espoir pour toute la Rébellion.',
    description_es: 'Jyn Erso lideró misión Rogue One para robar planos de Estrella de la Muerte, hija del diseñador de armas Galen Erso. Su pasado problemático y heroísmo reacio definían su arco de personaje. La determinación de Jyn de honrar sacrificio de su padre unió al equipo Rogue One diverso. Su transmisión de planos de Estrella de la Muerte encendió esperanza para toda Rebelión.'
  },
  {
    minifigure_no: 'sw0792',
    name: 'Rebel Trooper (Corporal Eskro Casrich)',
    description_en: 'Corporal Casrich served as a Rebel trooper during ground operations. These NCOs led small units in combat providing tactical leadership. Casrich represented the experienced soldiers who trained and commanded enlisted troops. Named corporals personalized the middle ranks of Rebel military structure.',
    description_de: 'Corporal Casrich diente als Rebellen-Soldat während Bodenoperationen. Diese Unteroffiziere führten kleine Einheiten im Kampf und boten taktische Führung. Casrich repräsentierte die erfahrenen Soldaten, die Mannschaftssoldaten trainierten und befehligten. Benannte Corporals personalisierten die mittleren Ränge der Rebellen-Militärstruktur.',
    description_fr: 'Le Caporal Casrich servait comme soldat rebelle pendant opérations terrestres. Ces sous-officiers dirigeaient petites unités au combat fournissant leadership tactique. Casrich représentait les soldats expérimentés qui formaient et commandaient troupes enrôlées. Les caporaux nommés personnalisaient les rangs intermédiaires de la structure militaire rebelle.',
    description_es: 'El Cabo Casrich servía como soldado rebelde durante operaciones terrestres. Estos suboficiales lideraban pequeñas unidades en combate proporcionando liderazgo táctico. Casrich representaba soldados experimentados que entrenaban y comandaban tropas alistadas. Los cabos nombrados personalizaban rangos medios de estructura militar rebelde.'
  },
  {
    minifigure_no: 'sw0793',
    name: 'Rebel Pilot U-wing / Y-wing',
    description_en: 'Rebel pilots flew both U-wing transports and Y-wing bombers during critical missions. These versatile aviators adapted to different craft depending on mission requirements. U-wing pilots inserted ground teams while Y-wing pilots provided heavy firepower. Their flexibility made them invaluable to Rebel operations.',
    description_de: 'Rebellen-Piloten flogen sowohl U-Wing-Transporter als auch Y-Wing-Bomber während kritischer Missionen. Diese vielseitigen Flieger passten sich je nach Missionsanforderungen an verschiedene Flugzeuge an. U-Wing-Piloten setzten Bodentruppen ein, während Y-Wing-Piloten schwere Feuerkraft boten. Ihre Flexibilität machte sie für Rebellen-Operationen unschätzbar wertvoll.',
    description_fr: 'Les pilotes rebelles pilotaient transports U-wing et bombardiers Y-wing pendant missions critiques. Ces aviateurs polyvalents s\'adaptaient à différents appareils selon exigences de mission. Les pilotes U-wing inséraient équipes au sol tandis que pilotes Y-wing fournissaient puissance de feu lourde. Leur flexibilité les rendait inestimables pour opérations rebelles.',
    description_es: 'Los pilotos rebeldes volaban tanto transportes Ala-U como bombarderos Ala-Y durante misiones críticas. Estos aviadores versátiles se adaptaban a diferentes naves según requisitos de misión. Los pilotos Ala-U insertaban equipos terrestres mientras pilotos Ala-Y proporcionaban poder de fuego pesado. Su flexibilidad los hacía invaluables para operaciones rebeldes.'
  }
];

async function saveBatch() {
  console.log('Starting batch save for sw0769-sw0793...');

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

  console.log('Batch complete! 25 minifigs saved (sw0769-sw0793).');
  await prisma.$disconnect();
}

saveBatch();
