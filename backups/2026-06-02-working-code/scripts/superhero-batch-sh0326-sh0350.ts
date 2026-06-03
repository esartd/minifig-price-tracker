import { PrismaClient as PrismaClientHostinger } from '@prisma/client';

const prisma = new PrismaClientHostinger({
  datasources: {
    db: {
      url: "mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker"
    }
  }
});

const descriptions = [
  {
    minifigure_no: 'sh0326',
    description_en: "Commissioner Gordon with red sash represents Gotham's highest police authority. James Gordon bridges law enforcement and Batman's vigilantism. The red sash adds ceremonial distinction. Essential for showcasing Gotham's institutional structure and Batman's official allies.",
    description_de: "Commissioner Gordon mit roter Schärpe repräsentiert Gothams höchste Polizei-Autorität. James Gordon verbindet Strafverfolgung und Batmans Vigilantismus. Die rote Schärpe fügt zeremonielle Auszeichnung hinzu. Unverzichtbar für die Darstellung von Gothams institutioneller Struktur und Batmans offiziellen Verbündeten.",
    description_fr: "Commissioner Gordon avec écharpe rouge représente la plus haute autorité policière de Gotham. James Gordon fait le pont entre application de la loi et vigilantisme de Batman. L'écharpe rouge ajoute distinction cérémonielle. Essentiel pour présenter la structure institutionnelle de Gotham et les alliés officiels de Batman.",
    description_es: "Commissioner Gordon con faja roja representa la autoridad policial más alta de Gotham. James Gordon une aplicación de la ley y vigilantismo de Batman. La faja roja añade distinción ceremonial. Esencial para mostrar la estructura institucional de Gotham y aliados oficiales de Batman."
  },
  {
    minifigure_no: 'sh0327',
    description_en: "Poison Ivy with cloth skirt showcases Pamela Isley's botanical villainy. This eco-terrorist uses plant control for deadly effect. The fabric skirt adds premium detail to her nature-themed appearance. Essential Batman villain representing environmental extremism and seductive danger.",
    description_de: "Poison Ivy mit Stoffrock zeigt Pamela Isleys botanische Schurkentat. Diese Öko-Terroristin nutzt Pflanzenkontrolle für tödliche Wirkung. Der Stoffrock fügt Premium-Detail zu ihrem naturthematischen Aussehen hinzu. Unverzichtbarer Batman-Schurke, der Umwelt-Extremismus und verführerische Gefahr repräsentiert.",
    description_fr: "Poison Ivy avec jupe en tissu présente la vilenie botanique de Pamela Isley. Cette éco-terroriste utilise le contrôle des plantes pour effet mortel. La jupe en tissu ajoute détail premium à son apparence à thème nature. Méchant Batman essentiel représentant extrémisme environnemental et danger séduisant.",
    description_es: "Poison Ivy con falda de tela muestra la villanía botánica de Pamela Isley. Esta eco-terrorista usa control de plantas para efecto mortal. La falda de tela añade detalle premium a su apariencia temática de naturaleza. Villano esencial de Batman que representa extremismo ambiental y peligro seductor."
  },
  {
    minifigure_no: 'sh0328',
    description_en: "Barbara Gordon in SWAT vest represents her law enforcement career before becoming Batgirl. Commissioner Gordon's daughter combines tactical training with heroic determination. The SWAT gear emphasizes her professional capabilities. Important for chronicling Barbara's evolution from police officer to superhero.",
    description_de: "Barbara Gordon in SWAT-Weste repräsentiert ihre Strafverfolgungs-Karriere, bevor sie Batgirl wurde. Commissioner Gordons Tochter kombiniert taktisches Training mit heroischer Entschlossenheit. Die SWAT-Ausrüstung betont ihre professionellen Fähigkeiten. Wichtig für die Chronik von Barbaras Evolution von Polizistin zu Superheldin.",
    description_fr: "Barbara Gordon en gilet SWAT représente sa carrière dans l'application de la loi avant de devenir Batgirl. La fille de Commissioner Gordon combine entraînement tactique avec détermination héroïque. L'équipement SWAT souligne ses capacités professionnelles. Important pour chronicler l'évolution de Barbara d'officier de police à super-héroïne.",
    description_es: "Barbara Gordon en chaleco SWAT representa su carrera de aplicación de ley antes de convertirse en Batgirl. La hija de Commissioner Gordon combina entrenamiento táctico con determinación heroica. El equipo SWAT enfatiza sus capacidades profesionales. Importante para relatar la evolución de Barbara de oficial de policía a superheroína."
  },
  {
    minifigure_no: 'sh0329',
    description_en: "Batman with utility belt and head type 3 offers another facial expression variant. This version provides collectors with diverse display options. The utility belt remains Batman's signature equipment. A valuable piece for completionist collections seeking every Batman expression variation.",
    description_de: "Batman mit Utility Belt und Kopf Typ 3 bietet eine weitere Gesichtsausdrucks-Variante. Diese Version bietet Sammlern vielfältige Display-Optionen. Der Utility Belt bleibt Batmans charakteristische Ausrüstung. Ein wertvolles Teil für vervollständigende Sammlungen, die jede Batman-Ausdrucks-Variation suchen.",
    description_fr: "Batman avec ceinture utilitaire et type de tête 3 offre une autre variante d'expression faciale. Cette version fournit aux collectionneurs diverses options d'affichage. La ceinture utilitaire reste l'équipement signature de Batman. Une pièce précieuse pour collections complétistes recherchant chaque variation d'expression Batman.",
    description_es: "Batman con cinturón utilitario y tipo de cabeza 3 ofrece otra variante de expresión facial. Esta versión proporciona a coleccionistas diversas opciones de exhibición. El cinturón utilitario permanece como equipo característico de Batman. Una pieza valiosa para colecciones completistas que buscan cada variación de expresión de Batman."
  },
  {
    minifigure_no: 'sh0330',
    description_en: "Catwoman in dark purple suit represents an alternate costume design. Selina Kyle's feline aesthetic adapts across different interpretations. The dark purple coloring offers visual variety. A valuable Catwoman variant for collectors seeking comprehensive costume representations.",
    description_de: "Catwoman im dunkelvioletten Anzug repräsentiert ein alternatives Kostüm-Design. Selina Kyles katzenartige Ästhetik passt sich über verschiedene Interpretationen hinweg an. Die dunkelviolette Färbung bietet visuelle Vielfalt. Eine wertvolle Catwoman-Variante für Sammler, die umfassende Kostüm-Darstellungen suchen.",
    description_fr: "Catwoman en costume violet foncé représente un design de costume alternatif. L'esthétique féline de Selina Kyle s'adapte à travers différentes interprétations. La coloration violet foncé offre variété visuelle. Une variante Catwoman précieuse pour collectionneurs recherchant représentations de costumes complètes.",
    description_es: "Catwoman en traje morado oscuro representa un diseño de traje alternativo. La estética felina de Selina Kyle se adapta a través de diferentes interpretaciones. La coloración morado oscuro ofrece variedad visual. Una variante valiosa de Catwoman para coleccionistas que buscan representaciones completas de trajes."
  },
  {
    minifigure_no: 'sh0331',
    description_en: "Security Guard represents civilian workers protecting Gotham facilities. These everyday heroes face extraordinary dangers during villain attacks. Essential for creating realistic urban environment displays. A supporting character adding authenticity to Batman's Gotham City scenarios.",
    description_de: "Sicherheitsbeamter repräsentiert zivile Arbeiter, die Gotham-Einrichtungen schützen. Diese alltäglichen Helden begegnen außergewöhnlichen Gefahren während Schurken-Angriffen. Unverzichtbar für die Erstellung realistischer urbaner Umgebungs-Displays. Eine Nebenfigur, die Authentizität zu Batmans Gotham City-Szenarien hinzufügt.",
    description_fr: "Gardien de Sécurité représente travailleurs civils protégeant installations de Gotham. Ces héros ordinaires font face à dangers extraordinaires pendant attaques de méchants. Essentiel pour créer affichages d'environnement urbain réalistes. Un personnage secondaire ajoutant authenticité aux scénarios Gotham City de Batman.",
    description_es: "Guardia de Seguridad representa trabajadores civiles protegiendo instalaciones de Gotham. Estos héroes cotidianos enfrentan peligros extraordinarios durante ataques de villanos. Esencial para crear exhibiciones de ambiente urbano realistas. Un personaje secundario que añade autenticidad a escenarios de Ciudad Gotham de Batman."
  },
  {
    minifigure_no: 'sh0332',
    description_en: "Scarecrow in pizza delivery outfit demonstrates his infiltration tactics. Dr. Jonathan Crane uses disguises to spread fear toxin. This civilian disguise adds storytelling depth. A unique Scarecrow variant perfect for displaying his psychological warfare methods.",
    description_de: "Scarecrow im Pizza-Liefer-Outfit demonstriert seine Infiltrations-Taktiken. Dr. Jonathan Crane nutzt Verkleidungen, um Angst-Toxin zu verbreiten. Diese zivile Verkleidung fügt Storytelling-Tiefe hinzu. Eine einzigartige Scarecrow-Variante, perfekt für die Darstellung seiner psychologischen Kriegsführungs-Methoden.",
    description_fr: "Scarecrow en tenue de livraison de pizza démontre ses tactiques d'infiltration. Dr. Jonathan Crane utilise des déguisements pour répandre la toxine de peur. Ce déguisement civil ajoute profondeur de narration. Une variante Scarecrow unique parfaite pour afficher ses méthodes de guerre psychologique.",
    description_es: "Scarecrow en traje de entrega de pizza demuestra sus tácticas de infiltración. Dr. Jonathan Crane usa disfraces para esparcir toxina de miedo. Este disfraz civil añade profundidad narrativa. Una variante única de Scarecrow perfecta para mostrar sus métodos de guerra psicológica."
  },
  {
    minifigure_no: 'sh0333',
    description_en: "Magpie brings kleptomaniac villainy to Batman's rogues. This jewel thief's obsession with shiny objects drives her crimes. The bird-themed design creates distinctive appearance. A collectible Batman villain for comprehensive obscure adversary displays.",
    description_de: "Magpie bringt kleptomanische Schurkentat zu Batmans Rogues. Diese Juwelendiebins Besessenheit mit glänzenden Objekten treibt ihre Verbrechen. Das vogelthematische Design schafft charakteristisches Aussehen. Ein sammelbarer Batman-Schurke für umfassende obskure Gegner-Displays.",
    description_fr: "Magpie apporte vilenie kleptomane aux voyous de Batman. L'obsession de cette voleuse de bijoux pour les objets brillants motive ses crimes. Le design à thème oiseau crée apparence distinctive. Un méchant Batman collectionnable pour affichages complets d'adversaires obscurs.",
    description_es: "Magpie aporta villanía cleptómana a los pícaros de Batman. La obsesión de esta ladrona de joyas con objetos brillantes impulsa sus crímenes. El diseño temático de ave crea apariencia distintiva. Un villano coleccionable de Batman para exhibiciones completas de adversarios oscuros."
  },
  {
    minifigure_no: 'sh0334',
    description_en: "The Riddler in suit and tie with hat shows his dapper criminal persona. Edward Nygma's intellectual vanity demands stylish presentation. The hat with hair adds sophisticated detail. A refined Riddler variant emphasizing his puzzle-obsessed elegance.",
    description_de: "Der Riddler in Anzug und Krawatte mit Hut zeigt seine elegante kriminelle Persona. Edward Nygmas intellektuelle Eitelkeit verlangt stilvolle Präsentation. Der Hut mit Haaren fügt raffiniertes Detail hinzu. Eine raffinierte Riddler-Variante, die seine puzzlebesessene Eleganz betont.",
    description_fr: "Le Sphinx en costume et cravate avec chapeau montre son personnage criminel élégant. La vanité intellectuelle d'Edward Nygma exige présentation stylée. Le chapeau avec cheveux ajoute détail sophistiqué. Une variante Sphinx raffinée soulignant son élégance obsédée par les énigmes.",
    description_es: "El Acertijo en traje y corbata con sombrero muestra su persona criminal elegante. La vanidad intelectual de Edward Nygma exige presentación elegante. El sombrero con cabello añade detalle sofisticado. Una variante refinada del Acertijo que enfatiza su elegancia obsesionada con acertijos."
  },
  {
    minifigure_no: 'sh0335',
    description_en: "Calendar Man bases crimes on dates with obsessive precision. Julian Day's calendar-themed villainy creates unique criminal patterns. This temporal villain adds conceptual depth to Batman's rogues. A collectible piece for fans of Batman's psychological adversaries.",
    description_de: "Calendar Man basiert Verbrechen auf Daten mit obsessiver Präzision. Julian Days kalender-thematische Schurkentat schafft einzigartige kriminelle Muster. Dieser zeitliche Schurke fügt konzeptionelle Tiefe zu Batmans Rogues hinzu. Ein sammelbares Teil für Fans von Batmans psychologischen Gegnern.",
    description_fr: "Calendar Man base les crimes sur les dates avec précision obsessionnelle. La vilenie à thème calendrier de Julian Day crée des motifs criminels uniques. Ce méchant temporel ajoute profondeur conceptuelle aux voyous de Batman. Une pièce collectionnable pour fans d'adversaires psychologiques de Batman.",
    description_es: "Calendar Man basa crímenes en fechas con precisión obsesiva. La villanía temática de calendario de Julian Day crea patrones criminales únicos. Este villano temporal añade profundidad conceptual a los pícaros de Batman. Una pieza coleccionable para fans de adversarios psicológicos de Batman."
  },
  {
    minifigure_no: 'sh0336',
    description_en: "Kite Man flies through Gotham with ridiculous determination. Charles Brown's kite-based crimes demonstrate absurd villainy. This comical character adds humor to Batman's rogues. A unique villain piece appealing to collectors appreciating Batman's lighter adversaries.",
    description_de: "Kite Man fliegt durch Gotham mit lächerlicher Entschlossenheit. Charles Browns drachen-basierte Verbrechen demonstrieren absurde Schurkentat. Diese komische Figur fügt Humor zu Batmans Rogues hinzu. Ein einzigartiges Schurken-Teil, das Sammler anzieht, die Batmans leichtere Gegner schätzen.",
    description_fr: "Kite Man vole à travers Gotham avec détermination ridicule. Les crimes basés sur le cerf-volant de Charles Brown démontrent vilenie absurde. Ce personnage comique ajoute humour aux voyous de Batman. Une pièce de méchant unique attirant collectionneurs appréciant les adversaires plus légers de Batman.",
    description_es: "Kite Man vuela por Gotham con determinación ridícula. Los crímenes basados en cometas de Charles Brown demuestran villanía absurda. Este personaje cómico añade humor a los pícaros de Batman. Una pieza de villano única que atrae a coleccionistas que aprecian adversarios más ligeros de Batman."
  },
  {
    minifigure_no: 'sh0337',
    description_en: "Barbara Gordon in pinstripe vest represents her professional civilian identity. Commissioner Gordon's daughter maintains career alongside heroic activities. The pinstripe detail adds sophisticated styling. Perfect for dual-identity displays showing Barbara's multifaceted life.",
    description_de: "Barbara Gordon in Nadelstreifen-Weste repräsentiert ihre professionelle zivile Identität. Commissioner Gordons Tochter pflegt Karriere neben heroischen Aktivitäten. Das Nadelstreifen-Detail fügt anspruchsvolles Styling hinzu. Perfekt für Doppelidentitäts-Displays, die Barbaras facettenreiches Leben zeigen.",
    description_fr: "Barbara Gordon en gilet à fines rayures représente son identité civile professionnelle. La fille de Commissioner Gordon maintient carrière aux côtés d'activités héroïques. Le détail de fines rayures ajoute style sophistiqué. Parfait pour affichages de double identité montrant la vie aux multiples facettes de Barbara.",
    description_es: "Barbara Gordon en chaleco a rayas finas representa su identidad civil profesional. La hija de Commissioner Gordon mantiene carrera junto a actividades heroicas. El detalle de rayas finas añade estilo sofisticado. Perfecto para exhibiciones de identidad dual que muestran la vida multifacética de Barbara."
  },
  {
    minifigure_no: 'sh0338',
    description_en: "Catwoman in orange prison jumpsuit shows Selina Kyle captured. This incarcerated appearance adds storytelling dimension. The orange jumpsuit contrasts with her usual sleek costumes. Perfect for Arkham Asylum and prison break scenario displays.",
    description_de: "Catwoman im orangefarbenen Gefängnis-Overall zeigt die gefangene Selina Kyle. Dieses inhaftierte Aussehen fügt Storytelling-Dimension hinzu. Der orangefarbene Overall kontrastiert mit ihren üblichen eleganten Kostümen. Perfekt für Arkham Asylum- und Gefängnisausbruchs-Szenario-Displays.",
    description_fr: "Catwoman en combinaison de prison orange montre Selina Kyle capturée. Cette apparence incarcérée ajoute dimension de narration. La combinaison orange contraste avec ses costumes élégants habituels. Parfait pour affichages de scénarios Arkham Asylum et évasion de prison.",
    description_es: "Catwoman en mono de prisión naranja muestra a Selina Kyle capturada. Esta apariencia encarcelada añade dimensión narrativa. El mono naranja contrasta con sus trajes elegantes habituales. Perfecto para exhibiciones de escenarios de Arkham Asylum y fuga de prisión."
  },
  {
    minifigure_no: 'sh0339',
    description_en: "Aaron Cash serves as Arkham Asylum security personnel. This dedicated guard maintains order among Gotham's most dangerous inmates. His presence represents institutional authority. Essential for Arkham Asylum displays and prison security scenarios.",
    description_de: "Aaron Cash dient als Arkham Asylum-Sicherheitspersonal. Dieser engagierte Wächter bewahrt Ordnung unter Gothams gefährlichsten Insassen. Seine Präsenz repräsentiert institutionelle Autorität. Unverzichtbar für Arkham Asylum-Displays und Gefängnis-Sicherheits-Szenarien.",
    description_fr: "Aaron Cash sert comme personnel de sécurité d'Arkham Asylum. Ce gardien dévoué maintient l'ordre parmi les détenus les plus dangereux de Gotham. Sa présence représente l'autorité institutionnelle. Essentiel pour affichages Arkham Asylum et scénarios de sécurité pénitentiaire.",
    description_es: "Aaron Cash sirve como personal de seguridad de Arkham Asylum. Este guardia dedicado mantiene orden entre los reclusos más peligrosos de Gotham. Su presencia representa autoridad institucional. Esencial para exhibiciones de Arkham Asylum y escenarios de seguridad penitenciaria."
  },
  {
    minifigure_no: 'sh0340',
    description_en: "Dr. Harleen Quinzel with red glasses shows Harley Quinn before her transformation. This psychiatrist appearance captures her professional identity. The red glasses distinguish her civilian persona. Essential for chronicling Harley's evolution from doctor to villain.",
    description_de: "Dr. Harleen Quinzel mit roter Brille zeigt Harley Quinn vor ihrer Verwandlung. Dieses Psychiater-Aussehen erfasst ihre professionelle Identität. Die rote Brille unterscheidet ihre zivile Persona. Unverzichtbar für die Chronik von Harleys Evolution von Ärztin zu Schurkin.",
    description_fr: "Dr. Harleen Quinzel avec lunettes rouges montre Harley Quinn avant sa transformation. Cette apparence de psychiatre capture son identité professionnelle. Les lunettes rouges distinguent son personnage civil. Essentiel pour chronicler l'évolution de Harley de médecin à méchante.",
    description_es: "Dra. Harleen Quinzel con gafas rojas muestra a Harley Quinn antes de su transformación. Esta apariencia de psiquiatra captura su identidad profesional. Las gafas rojas distinguen su persona civil. Esencial para relatar la evolución de Harley de médica a villana."
  },
  {
    minifigure_no: 'sh0341',
    description_en: "Robin with green glasses and dual expressions captures emotional versatility. The frown and raised eyebrows show Dick Grayson's range. Green glasses add distinctive character detail. Perfect for dynamic displays emphasizing Robin's emotional journey.",
    description_de: "Robin mit grüner Brille und Doppelausdruck erfasst emotionale Vielseitigkeit. Das Stirnrunzeln und die hochgezogenen Augenbrauen zeigen Dick Graysons Bandbreite. Grüne Brille fügt charakteristisches Charakter-Detail hinzu. Perfekt für dynamische Displays, die Robins emotionale Reise betonen.",
    description_fr: "Robin avec lunettes vertes et expressions doubles capture polyvalence émotionnelle. Le froncement et les sourcils levés montrent la gamme de Dick Grayson. Les lunettes vertes ajoutent détail de caractère distinctif. Parfait pour affichages dynamiques soulignant le parcours émotionnel de Robin.",
    description_es: "Robin con gafas verdes y expresiones duales captura versatilidad emocional. El ceño fruncido y cejas levantadas muestran el rango de Dick Grayson. Las gafas verdes añaden detalle de carácter distintivo. Perfecto para exhibiciones dinámicas que enfatizan el viaje emocional de Robin."
  },
  {
    minifigure_no: 'sh0342',
    description_en: "Poison Ivy in prison jumpsuit shows Pamela Isley incarcerated. This captured appearance adds narrative depth. The orange jumpsuit contrasts with her nature-themed villain costumes. Perfect for Arkham Asylum and villain containment displays.",
    description_de: "Poison Ivy im Gefängnis-Overall zeigt die inhaftierte Pamela Isley. Dieses gefangene Aussehen fügt narrative Tiefe hinzu. Der orangefarbene Overall kontrastiert mit ihren naturthematischen Schurken-Kostümen. Perfekt für Arkham Asylum- und Schurken-Eindämmungs-Displays.",
    description_fr: "Poison Ivy en combinaison de prison montre Pamela Isley incarcérée. Cette apparence capturée ajoute profondeur narrative. La combinaison orange contraste avec ses costumes de méchante à thème nature. Parfait pour affichages Arkham Asylum et confinement de méchants.",
    description_es: "Poison Ivy en mono de prisión muestra a Pamela Isley encarcelada. Esta apariencia capturada añade profundidad narrativa. El mono naranja contrasta con sus trajes de villana temáticos de naturaleza. Perfecto para exhibiciones de Arkham Asylum y contención de villanos."
  },
  {
    minifigure_no: 'sh0343',
    description_en: "The Joker in prison jumpsuit with pointed teeth grin shows him incarcerated. This captured appearance never diminishes his menace. The orange jumpsuit with signature grin emphasizes his enduring threat. Essential for Arkham Asylum and prison scenario displays.",
    description_de: "Der Joker im Gefängnis-Overall mit spitzen Zähnen-Grinsen zeigt ihn inhaftiert. Dieses gefangene Aussehen mindert seine Bedrohung nie. Der orangefarbene Overall mit charakteristischem Grinsen betont seine anhaltende Bedrohung. Unverzichtbar für Arkham Asylum- und Gefängnis-Szenario-Displays.",
    description_fr: "Le Joker en combinaison de prison avec sourire de dents pointues le montre incarcéré. Cette apparence capturée ne diminue jamais sa menace. La combinaison orange avec sourire signature souligne sa menace persistante. Essentiel pour affichages de scénarios Arkham Asylum et prison.",
    description_es: "El Joker en mono de prisión con sonrisa de dientes puntiagudos lo muestra encarcelado. Esta apariencia capturada nunca disminuye su amenaza. El mono naranja con sonrisa característica enfatiza su amenaza persistente. Esencial para exhibiciones de escenarios de Arkham Asylum y prisión."
  },
  {
    minifigure_no: 'sh0344',
    description_en: "The Riddler in orange prison jumpsuit shows Edward Nygma captured. This incarcerated appearance demonstrates even imprisoned villains remain threats. The orange jumpsuit contrasts with his usual flamboyant costumes. Perfect for Arkham Asylum containment displays.",
    description_de: "Der Riddler im orangefarbenen Gefängnis-Overall zeigt den gefangenen Edward Nygma. Dieses inhaftierte Aussehen demonstriert, dass selbst inhaftierte Schurken Bedrohungen bleiben. Der orangefarbene Overall kontrastiert mit seinen üblichen extravaganten Kostümen. Perfekt für Arkham Asylum-Eindämmungs-Displays.",
    description_fr: "Le Sphinx en combinaison de prison orange montre Edward Nygma capturé. Cette apparence incarcérée démontre que même les méchants emprisonnés restent des menaces. La combinaison orange contraste avec ses costumes flamboyants habituels. Parfait pour affichages de confinement Arkham Asylum.",
    description_es: "El Acertijo en mono de prisión naranja muestra a Edward Nygma capturado. Esta apariencia encarcelada demuestra que incluso villanos encarcelados siguen siendo amenazas. El mono naranja contrasta con sus trajes extravagantes habituales. Perfecto para exhibiciones de contención de Arkham Asylum."
  },
  {
    minifigure_no: 'sh0345',
    description_en: "Two-Face in prison jumpsuit shows Harvey Dent's fall from grace. This incarcerated appearance emphasizes his tragic transformation. The orange jumpsuit symbolizes justice system failure. Essential for Arkham Asylum displays showing Gotham's fallen district attorney.",
    description_de: "Two-Face im Gefängnis-Overall zeigt Harvey Dents Fall von der Gnade. Dieses inhaftierte Aussehen betont seine tragische Verwandlung. Der orangefarbene Overall symbolisiert das Versagen des Justizsystems. Unverzichtbar für Arkham Asylum-Displays, die Gothams gefallenen Bezirksstaatsanwalt zeigen.",
    description_fr: "Double-Face en combinaison de prison montre la chute en disgrâce de Harvey Dent. Cette apparence incarcérée souligne sa transformation tragique. La combinaison orange symbolise l'échec du système judiciaire. Essentiel pour affichages Arkham Asylum montrant le procureur de district déchu de Gotham.",
    description_es: "Dos Caras en mono de prisión muestra la caída en desgracia de Harvey Dent. Esta apariencia encarcelada enfatiza su transformación trágica. El mono naranja simboliza fallo del sistema de justicia. Esencial para exhibiciones de Arkham Asylum que muestran al fiscal de distrito caído de Gotham."
  },
  {
    minifigure_no: 'sh0346',
    description_en: "GCPD Officer (Female) represents Gotham's diverse police force. These brave officers face extraordinary dangers from supervillains. Essential army builders for creating authentic GCPD formations. Perfect for displaying Gotham's institutional law enforcement presence.",
    description_de: "GCPD-Offizierin repräsentiert Gothams vielfältige Polizei. Diese tapferen Offiziere begegnen außergewöhnlichen Gefahren durch Superschurken. Unverzichtbare Armee-Baumeister für die Erstellung authentischer GCPD-Formationen. Perfekt für die Darstellung von Gothams institutioneller Strafverfolgungs-Präsenz.",
    description_fr: "Officier GCPD (Femme) représente la force de police diversifiée de Gotham. Ces officiers courageux font face à dangers extraordinaires des super-vilains. Constructeurs d'armée essentiels pour créer formations GCPD authentiques. Parfait pour afficher la présence d'application de la loi institutionnelle de Gotham.",
    description_es: "Oficial del GCPD (Mujer) representa la fuerza policial diversa de Gotham. Estos oficiales valientes enfrentan peligros extraordinarios de supervillanos. Constructores de ejército esenciales para crear formaciones auténticas del GCPD. Perfecto para mostrar la presencia institucional de aplicación de ley de Gotham."
  },
  {
    minifigure_no: 'sh0347',
    description_en: "GCPD Officer (Male) serves Gotham alongside Commissioner Gordon. These dedicated officers maintain order against superhuman threats. Essential army builders for comprehensive GCPD displays. Perfect for creating authentic Gotham law enforcement scenarios.",
    description_de: "GCPD-Offizier dient Gotham an der Seite von Commissioner Gordon. Diese engagierten Offiziere bewahren Ordnung gegen übermenschliche Bedrohungen. Unverzichtbare Armee-Baumeister für umfassende GCPD-Displays. Perfekt für die Erstellung authentischer Gotham-Strafverfolgungs-Szenarien.",
    description_fr: "Officier GCPD (Homme) sert Gotham aux côtés de Commissioner Gordon. Ces officiers dévoués maintiennent l'ordre contre menaces surhumaines. Constructeurs d'armée essentiels pour affichages GCPD complets. Parfait pour créer scénarios d'application de la loi Gotham authentiques.",
    description_es: "Oficial del GCPD (Hombre) sirve a Gotham junto a Commissioner Gordon. Estos oficiales dedicados mantienen orden contra amenazas sobrehumanas. Constructores de ejército esenciales para exhibiciones completas del GCPD. Perfecto para crear escenarios auténticos de aplicación de ley de Gotham."
  },
  {
    minifigure_no: 'sh0348',
    description_en: "Superman with short legs introduces the Man of Steel to junior collectors. This child-friendly format maintains iconic heroism. Perfect for family-oriented DC displays. An essential entry point for building next-generation Superman collections.",
    description_de: "Superman mit kurzen Beinen führt den Man of Steel bei jüngeren Sammlern ein. Dieses kinderfreundliche Format behält ikonisches Heldentum bei. Perfekt für familienorientierte DC-Displays. Ein unverzichtbarer Einstiegspunkt für den Aufbau von Superman-Sammlungen der nächsten Generation.",
    description_fr: "Superman avec jambes courtes présente l'Homme d'Acier aux jeunes collectionneurs. Ce format adapté aux enfants maintient l'héroïsme emblématique. Parfait pour affichages DC orientés famille. Un point d'entrée essentiel pour construire des collections Superman de nouvelle génération.",
    description_es: "Superman con piernas cortas introduce al Hombre de Acero a coleccionistas junior. Este formato amigable para niños mantiene heroísmo icónico. Perfecto para exhibiciones DC orientadas a familia. Un punto de entrada esencial para construir colecciones de Superman de nueva generación."
  },
  {
    minifigure_no: 'sh0349',
    description_en: "Bizarro with short legs brings the imperfect Superman clone to junior format. This backwards hero operates with inverted logic. The child-friendly design introduces younger collectors to Superman's rogues. A unique villain piece for next-generation DC collections.",
    description_de: "Bizarro mit kurzen Beinen bringt den unvollkommenen Superman-Klon ins Junior-Format. Dieser rückwärts Held operiert mit invertierter Logik. Das kinderfreundliche Design führt jüngere Sammler zu Supermans Rogues ein. Ein einzigartiges Schurken-Teil für DC-Sammlungen der nächsten Generation.",
    description_fr: "Bizarro avec jambes courtes apporte le clone Superman imparfait au format junior. Ce héros à l'envers opère avec logique inversée. Le design adapté aux enfants présente les voyous de Superman aux jeunes collectionneurs. Une pièce de méchant unique pour collections DC de nouvelle génération.",
    description_es: "Bizarro con piernas cortas trae al clon imperfecto de Superman al formato junior. Este héroe al revés opera con lógica invertida. El diseño amigable para niños introduce a coleccionistas más jóvenes a los pícaros de Superman. Una pieza de villano única para colecciones DC de nueva generación."
  },
  {
    minifigure_no: 'sh0350',
    description_en: "Mayor McCaskill represents Gotham's civilian government leadership. This political figure adds institutional context to Batman stories. The mayor embodies civic authority challenged by criminal chaos. Essential for comprehensive Gotham City political structure displays.",
    description_de: "Bürgermeister McCaskill repräsentiert Gothams zivile Regierungsführung. Diese politische Figur fügt institutionellen Kontext zu Batman-Geschichten hinzu. Der Bürgermeister verkörpert zivile Autorität, die durch kriminelles Chaos herausgefordert wird. Unverzichtbar für umfassende Gotham City-Politikstruktur-Displays.",
    description_fr: "Maire McCaskill représente le leadership du gouvernement civil de Gotham. Cette figure politique ajoute contexte institutionnel aux histoires Batman. Le maire incarne l'autorité civique défiée par le chaos criminel. Essentiel pour affichages complets de structure politique de Gotham City.",
    description_es: "Alcalde McCaskill representa el liderazgo gubernamental civil de Gotham. Esta figura política añade contexto institucional a historias de Batman. El alcalde encarna autoridad cívica desafiada por caos criminal. Esencial para exhibiciones completas de estructura política de Ciudad Gotham."
  }
];

async function main() {
  console.log(`🦸 Starting Super Heroes batch sh0326-sh0350 (${descriptions.length} minifigs)...`);
  console.log();

  for (let i = 0; i < descriptions.length; i++) {
    const desc = descriptions[i];

    await prisma.minifigCatalog.update({
      where: { minifigure_no: desc.minifigure_no },
      data: {
        description_en: desc.description_en,
        description_de: desc.description_de,
        description_fr: desc.description_fr,
        description_es: desc.description_es,
        description_generated_at: new Date(),
        description_status: 'completed'
      }
    });

    console.log(`✓ Saved ${desc.minifigure_no} (${i + 1}/${descriptions.length})`);
  }

  console.log();
  console.log(`✅ Batch complete! ${descriptions.length} minifigs saved. Total: 350 done.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
