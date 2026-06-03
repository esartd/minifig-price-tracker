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
    minifigure_no: 'sh0876',
    description_en: "Nebula in Dark Blue Suit (2023) from Guardians of the Galaxy Vol. 3 features Karen Gillan's assassin-turned-Guardian in team-coordinated uniform, capturing her evolution from villain to hero with matching colors and cybernetic enhancements.",
    description_de: "Nebula im dunkelblauen Anzug (2023) aus Guardians of the Galaxy Vol. 3 zeigt Karen Gillans Assassin-zur-Guardian-gewordene in team-koordinierter Uniform, die ihre Entwicklung vom Schurken zum Helden mit passenden Farben und kybernetischen Verbesserungen einfängt.",
    description_fr: "Nebula en costume bleu foncé (2023) de Guardians of the Galaxy Vol. 3 présente l'assassin devenue Gardienne de Karen Gillan dans un uniforme coordonné d'équipe, capturant son évolution de méchante à héroïne avec des couleurs assorties et des améliorations cybernétiques.",
    description_es: "Nebula en traje azul oscuro (2023) de Guardians of the Galaxy Vol. 3 presenta a la asesina convertida en Guardiana de Karen Gillan en uniforme coordinado de equipo, capturando su evolución de villana a heroína con colores a juego y mejoras cibernéticas."
  },
  {
    minifigure_no: 'sh0877',
    description_en: "Adam Warlock (2023) from Guardians of the Galaxy Vol. 3 introduces Will Poulter's genetically-perfect being in golden cosmic suit, capturing the powerful Sovereign creation with detailed printing and cape for epic space battles.",
    description_de: "Adam Warlock (2023) aus Guardians of the Galaxy Vol. 3 führt Will Poulters genetisch perfektes Wesen in goldenem kosmischem Anzug ein, das die mächtige Sovereign-Kreation mit detailliertem Druck und Umhang für epische Weltraumschlachten einfängt.",
    description_fr: "Adam Warlock (2023) de Guardians of the Galaxy Vol. 3 présente l'être génétiquement parfait de Will Poulter dans un costume cosmique doré, capturant la puissante création Sovereign avec une impression détaillée et une cape pour des batailles spatiales épiques.",
    description_es: "Adam Warlock (2023) de Guardians of the Galaxy Vol. 3 presenta al ser genéticamente perfecto de Will Poulter en traje cósmico dorado, capturando la poderosa creación Sovereign con impresión detallada y capa para batallas espaciales épicas."
  },
  {
    minifigure_no: 'sh0878',
    description_en: "Mantis in Dark Blue Suit (2023) from Guardians of the Galaxy Vol. 3 features Pom Klementieff's empath in team-coordinated uniform, capturing her gentle personality and empathic powers with matching Guardian colors and antennae details.",
    description_de: "Mantis im dunkelblauen Anzug (2023) aus Guardians of the Galaxy Vol. 3 zeigt Pom Klementieffs Empathin in team-koordinierter Uniform, die ihre sanfte Persönlichkeit und empathischen Kräfte mit passenden Guardian-Farben und Antennen-Details einfängt.",
    description_fr: "Mantis en costume bleu foncé (2023) de Guardians of the Galaxy Vol. 3 présente l'empathique de Pom Klementieff dans un uniforme coordonné d'équipe, capturant sa personnalité douce et ses pouvoirs empathiques avec des couleurs Guardian assorties et des détails d'antennes.",
    description_es: "Mantis en traje azul oscuro (2023) de Guardians of the Galaxy Vol. 3 presenta a la empática de Pom Klementieff en uniforme coordinado de equipo, capturando su personalidad gentil y poderes empáticos con colores Guardian a juego y detalles de antenas."
  },
  {
    minifigure_no: 'sh0879',
    description_en: "Drax in Dark Blue Suit (2023) from Guardians of the Galaxy Vol. 3 features Dave Bautista's Destroyer in team-coordinated uniform over his tattooed skin, capturing his literal-minded warrior personality with matching Guardian colors.",
    description_de: "Drax im dunkelblauen Anzug (2023) aus Guardians of the Galaxy Vol. 3 zeigt Dave Bautistas Zerstörer in team-koordinierter Uniform über seiner tätowierten Haut, der seine wörtlich denkende Krieger-Persönlichkeit mit passenden Guardian-Farben einfängt.",
    description_fr: "Drax en costume bleu foncé (2023) de Guardians of the Galaxy Vol. 3 présente le Destructeur de Dave Bautista dans un uniforme coordonné d'équipe sur sa peau tatouée, capturant sa personnalité de guerrier littéral avec des couleurs Guardian assorties.",
    description_es: "Drax en traje azul oscuro (2023) de Guardians of the Galaxy Vol. 3 presenta al Destructor de Dave Bautista en uniforme coordinado de equipo sobre su piel tatuada, capturando su personalidad de guerrero literal con colores Guardian a juego."
  },
  {
    minifigure_no: 'sh0880',
    description_en: "Batman with One Piece Cowl and Cape (1992/2023) from Tim Burton's Batman features Michael Keaton's iconic Dark Knight in classic 1989 film suit with simple bat logo and integrated cowl-cape design for nostalgic Gotham displays.",
    description_de: "Batman mit einteiligem Cowl und Umhang (1992/2023) aus Tim Burtons Batman zeigt Michael Keatons ikonischen Dark Knight im klassischen 1989-Film-Anzug mit einfachem Fledermaus-Logo und integriertem Cowl-Umhang-Design für nostalgische Gotham-Displays.",
    description_fr: "Batman avec capuche et cape d'une pièce (1992/2023) du Batman de Tim Burton présente le Dark Knight iconique de Michael Keaton dans le costume classique du film de 1989 avec un logo de chauve-souris simple et un design de capuche-cape intégré pour des présentations nostalgiques de Gotham.",
    description_es: "Batman con capucha y capa de una pieza (1992/2023) del Batman de Tim Burton presenta al icónico Caballero Oscuro de Michael Keaton en traje clásico de película de 1989 con logo simple de murciélago y diseño integrado de capucha-capa para exhibiciones nostálgicas de Gotham."
  },
  {
    minifigure_no: 'sh0881',
    description_en: "Black Widow in Black Jumpsuit with Metallic Light Blue Trim (2023) from The Infinity Saga features Natasha Romanoff in enhanced tactical suit with printed legs and metallic accent details, capturing her stealth operations with premium finish.",
    description_de: "Black Widow im schwarzen Jumpsuit mit metallischem hellblauen Rand (2023) aus The Infinity Saga zeigt Natasha Romanoff in verbessertem taktischem Anzug mit bedruckten Beinen und metallischen Akzentdetails, die ihre Stealth-Operationen mit Premium-Finish einfängt.",
    description_fr: "Black Widow en combinaison noire avec bordure bleu clair métallique (2023) de The Infinity Saga présente Natasha Romanoff dans un costume tactique amélioré avec des jambes imprimées et des détails d'accent métalliques, capturant ses opérations furtives avec une finition premium.",
    description_es: "Black Widow en mono negro con ribete azul claro metálico (2023) de The Infinity Saga presenta a Natasha Romanoff en traje táctico mejorado con piernas impresas y detalles de acento metálico, capturando sus operaciones sigilosas con acabado premium."
  },
  {
    minifigure_no: 'sh0882',
    description_en: "Max Shreck (2023) from Tim Burton's Batman Returns features Christopher Walken's corrupt businessman in formal attire with distinctive white-streaked hair, capturing the sinister industrialist plotting with the Penguin for Gotham domination.",
    description_de: "Max Shreck (2023) aus Tim Burtons Batman Returns zeigt Christopher Walkens korrupten Geschäftsmann in formeller Kleidung mit markanten weiß-gestreiften Haaren, der den finsteren Industriellen einfängt, der mit dem Pinguin für Gotham-Herrschaft intrigiert.",
    description_fr: "Max Shreck (2023) du Batman Returns de Tim Burton présente l'homme d'affaires corrompu de Christopher Walken dans une tenue formelle avec des cheveux distinctifs striés de blanc, capturant l'industriel sinistre complotant avec le Pingouin pour la domination de Gotham.",
    description_es: "Max Shreck (2023) del Batman Returns de Tim Burton presenta al empresario corrupto de Christopher Walken en atuendo formal con cabello característico con rayas blancas, capturando al industrial siniestro conspirando con el Pingüino para la dominación de Gotham."
  },
  {
    minifigure_no: 'sh0883',
    description_en: "Alfred Pennyworth in Black Tuxedo with Light Bluish Gray Hair (2023) from Tim Burton's Batman features Michael Gough's loyal butler in formal attire, capturing the distinguished Wayne Manor servant with classic dignified appearance.",
    description_de: "Alfred Pennyworth im schwarzen Smoking mit hellblaugrauem Haar (2023) aus Tim Burtons Batman zeigt Michael Goughs treuen Butler in formeller Kleidung, der den distinguierten Wayne Manor-Diener mit klassischem würdevollem Erscheinungsbild einfängt.",
    description_fr: "Alfred Pennyworth en smoking noir avec cheveux gris bleu clair (2023) du Batman de Tim Burton présente le majordome loyal de Michael Gough dans une tenue formelle, capturant le serviteur distingué du Wayne Manor avec une apparence classique digne.",
    description_es: "Alfred Pennyworth en esmoquin negro con cabello gris azulado claro (2023) del Batman de Tim Burton presenta al mayordomo leal de Michael Gough en atuendo formal, capturando al distinguido sirviente de Wayne Manor con apariencia clásica digna."
  },
  {
    minifigure_no: 'sh0884',
    description_en: "Bruce Wayne in Black Suit with Dark Bluish Gray Sweater (2023) from Tim Burton's Batman shows Michael Keaton's billionaire in layered civilian attire, capturing the brooding playboy persona before donning the Batsuit with sophisticated styling.",
    description_de: "Bruce Wayne im schwarzen Anzug mit dunkelblaugrauem Pullover (2023) aus Tim Burtons Batman zeigt Michael Keatons Milliardär in geschichteter Zivilkleidung, der die grüblerische Playboy-Persona einfängt, bevor er den Batsuit mit raffiniertem Styling anzieht.",
    description_fr: "Bruce Wayne en costume noir avec pull gris bleu foncé (2023) du Batman de Tim Burton montre le milliardaire de Michael Keaton dans une tenue civile superposée, capturant le personnage de playboy sombre avant de revêtir le Batsuit avec un style sophistiqué.",
    description_es: "Bruce Wayne en traje negro con suéter gris azulado oscuro (2023) del Batman de Tim Burton muestra al multimillonario de Michael Keaton en atuendo civil en capas, capturando la persona de playboy melancólico antes de ponerse el Batsuit con estilo sofisticado."
  },
  {
    minifigure_no: 'sh0885',
    description_en: "Catwoman in Black Stitched Suit and Mask (2023) from Tim Burton's Batman Returns features Michelle Pfeiffer's iconic feline anti-hero with detailed stitching pattern, capturing her revenge-driven transformation from Selina Kyle with leather costume.",
    description_de: "Catwoman im schwarzen genähten Anzug und Maske (2023) aus Tim Burtons Batman Returns zeigt Michelle Pfeiffers ikonische Katzen-Anti-Heldin mit detailliertem Nahtmuster, die ihre rachegetriebene Verwandlung von Selina Kyle mit Lederkostüm einfängt.",
    description_fr: "Catwoman en costume noir cousu et masque (2023) du Batman Returns de Tim Burton présente l'anti-héroïne féline iconique de Michelle Pfeiffer avec un motif de couture détaillé, capturant sa transformation motivée par la vengeance de Selina Kyle avec un costume en cuir.",
    description_es: "Catwoman en traje negro cosido y máscara (2023) del Batman Returns de Tim Burton presenta a la icónica antiheroína felina de Michelle Pfeiffer con patrón de costura detallado, capturando su transformación impulsada por venganza de Selina Kyle con traje de cuero."
  },
  {
    minifigure_no: 'sh0886',
    description_en: "Batman in Black Suit with Gold Belt and Dual-Sided Head (2023) from Tim Burton's Batman features Michael Keaton with smirk/goggles expressions and white-eyed cowl, capturing his mysterious vigilante persona with classic 1989 film styling.",
    description_de: "Batman im schwarzen Anzug mit Goldgürtel und doppelseitigem Kopf (2023) aus Tim Burtons Batman zeigt Michael Keaton mit Grinsen/Schutzbrille-Ausdrücken und weißäugigem Cowl, der seine mysteriöse Vigilanten-Persona mit klassischem 1989-Film-Styling einfängt.",
    description_fr: "Batman en costume noir avec ceinture dorée et tête double face (2023) du Batman de Tim Burton présente Michael Keaton avec des expressions de sourire/lunettes et une capuche aux yeux blancs, capturant son personnage de justicier mystérieux avec le style classique du film de 1989.",
    description_es: "Batman en traje negro con cinturón dorado y cabeza de doble cara (2023) del Batman de Tim Burton presenta a Michael Keaton con expresiones de sonrisa/gafas y capucha de ojos blancos, capturando su persona de vigilante misterioso con estilo clásico de película de 1989."
  },
  {
    minifigure_no: 'sh0887',
    description_en: "The Penguin with Reddish Brown Fur Collar and Dark Tan Waistcoat (2023) from Tim Burton's Batman Returns features Danny DeVito's grotesque villain in Victorian-inspired costume with umbrella accessories, capturing Oswald Cobblepot's deformed appearance.",
    description_de: "Der Pinguin mit rotbraunem Pelzkragen und dunkelbrauner Weste (2023) aus Tim Burtons Batman Returns zeigt Danny DeVitos grotesken Schurken in viktorianisch inspiriertem Kostüm mit Regenschirm-Zubehör, der Oswald Cobblepots deformiertes Erscheinungsbild einfängt.",
    description_fr: "The Penguin avec col de fourrure brun rougeâtre et gilet brun foncé (2023) du Batman Returns de Tim Burton présente le méchant grotesque de Danny DeVito dans un costume d'inspiration victorienne avec des accessoires de parapluie, capturant l'apparence déformée d'Oswald Cobblepot.",
    description_es: "The Penguin con cuello de piel marrón rojizo y chaleco marrón oscuro (2023) del Batman Returns de Tim Burton presenta al villano grotesco de Danny DeVito en traje de inspiración victoriana con accesorios de paraguas, capturando la apariencia deformada de Oswald Cobblepot."
  },
  {
    minifigure_no: 'sh0888',
    description_en: "Green Goblin without Mask with Dark Brown Hair (2023) from No Way Home shows Norman Osborn in his armored green suit before donning the goblin helmet, capturing Willem Dafoe's unmasked villain appearance with maniacal expression.",
    description_de: "Green Goblin ohne Maske mit dunkelbraunem Haar (2023) aus No Way Home zeigt Norman Osborn in seinem gepanzerten grünen Anzug, bevor er den Goblin-Helm aufsetzt, der Willem Dafoes unmaskiertes Schurken-Erscheinungsbild mit manischem Ausdruck einfängt.",
    description_fr: "Green Goblin sans masque avec cheveux brun foncé (2023) de No Way Home montre Norman Osborn dans son costume vert blindé avant de mettre le casque goblin, capturant l'apparence de méchant démasqué de Willem Dafoe avec une expression maniaque.",
    description_es: "Green Goblin sin máscara con cabello castaño oscuro (2023) de No Way Home muestra a Norman Osborn en su traje verde blindado antes de ponerse el casco duende, capturando la apariencia de villano desenmascarado de Willem Dafoe con expresión maníaca."
  },
  {
    minifigure_no: 'sh0889',
    description_en: "The Amazing Spider-Man (2023) from No Way Home features Andrew Garfield's web-slinger in his distinctive costume with raised webbing pattern and large eye pieces, capturing his acrobatic fighting style from The Amazing Spider-Man films.",
    description_de: "The Amazing Spider-Man (2023) aus No Way Home zeigt Andrew Garfields Web-Slinger in seinem markanten Kostüm mit erhabenem Web-Muster und großen Augenstücken, der seinen akrobatischen Kampfstil aus den Amazing Spider-Man-Filmen einfängt.",
    description_fr: "The Amazing Spider-Man (2023) de No Way Home présente le lanceur de toiles d'Andrew Garfield dans son costume distinctif avec un motif de toile en relief et de grandes pièces d'yeux, capturant son style de combat acrobatique des films The Amazing Spider-Man.",
    description_es: "The Amazing Spider-Man (2023) de No Way Home presenta al lanzatelarañas de Andrew Garfield en su distintivo traje con patrón de telaraña en relieve y piezas de ojos grandes, capturando su estilo de lucha acrobático de las películas The Amazing Spider-Man."
  },
  {
    minifigure_no: 'sh0890',
    description_en: "Dr. Octopus (Otto Octavius) in Dark Bluish Gray Outfit with Mechanical Arms (2023) from No Way Home features Alfred Molina's villain with four articulated tentacle accessories, capturing Doc Ock's fusion reactor accident and brilliant scientist-turned-villain transformation.",
    description_de: "Dr. Octopus (Otto Octavius) im dunkelblaugrauen Outfit mit mechanischen Armen (2023) aus No Way Home zeigt Alfred Molinas Schurken mit vier artikulierten Tentakel-Zubehör, der Doc Ocks Fusionsreaktor-Unfall und brillante Wissenschaftler-zur-Schurken-Verwandlung einfängt.",
    description_fr: "Dr. Octopus (Otto Octavius) en tenue gris bleu foncé avec bras mécaniques (2023) de No Way Home présente le méchant d'Alfred Molina avec quatre accessoires de tentacules articulés, capturant l'accident de réacteur à fusion de Doc Ock et la transformation de scientifique brillant en méchant.",
    description_es: "Dr. Octopus (Otto Octavius) en atuendo gris azulado oscuro con brazos mecánicos (2023) de No Way Home presenta al villano de Alfred Molina con cuatro accesorios de tentáculos articulados, capturando el accidente de reactor de fusión de Doc Ock y la transformación de científico brillante a villano."
  },
  {
    minifigure_no: 'sh0891',
    description_en: "Electro with Large Electricity Wings (2023) from No Way Home features Jamie Foxx's electrified villain with medium brown head and black outfit, capturing his enhanced MCU appearance with translucent lightning wing accessories and electrical powers.",
    description_de: "Electro mit großen Elektrizitäts-Flügeln (2023) aus No Way Home zeigt Jamie Foxxs elektrifizierten Schurken mit mittelbraunem Kopf und schwarzem Outfit, der sein verbessertes MCU-Erscheinungsbild mit durchsichtigen Blitz-Flügel-Zubehör und elektrischen Kräften einfängt.",
    description_fr: "Electro avec grandes ailes d'électricité (2023) de No Way Home présente le méchant électrifié de Jamie Foxx avec une tête brun moyen et une tenue noire, capturant son apparence MCU améliorée avec des accessoires d'ailes d'éclair translucides et des pouvoirs électriques.",
    description_es: "Electro con grandes alas de electricidad (2023) de No Way Home presenta al villano electrificado de Jamie Foxx con cabeza marrón medio y atuendo negro, capturando su apariencia MCU mejorada con accesorios de alas de relámpago translúcidos y poderes eléctricos."
  },
  {
    minifigure_no: 'sh0892',
    description_en: "Friendly Neighborhood Spider-Man (2023) from No Way Home features Tobey Maguire's original web-slinger in his classic Sam Raimi trilogy costume with raised webbing and silver eyes, capturing the beloved 2002 Spider-Man with nostalgic design.",
    description_de: "Friendly Neighborhood Spider-Man (2023) aus No Way Home zeigt Tobey Maguires ursprünglichen Web-Slinger in seinem klassischen Sam Raimi-Trilogie-Kostüm mit erhabenem Netz und silbernen Augen, der den geliebten 2002 Spider-Man mit nostalgischem Design einfängt.",
    description_fr: "Friendly Neighborhood Spider-Man (2023) de No Way Home présente le lanceur de toiles original de Tobey Maguire dans son costume classique de la trilogie de Sam Raimi avec toile en relief et yeux argentés, capturant le bien-aimé Spider-Man de 2002 avec un design nostalgique.",
    description_es: "Friendly Neighborhood Spider-Man (2023) de No Way Home presenta al lanzatelarañas original de Tobey Maguire en su traje clásico de trilogía de Sam Raimi con telaraña en relieve y ojos plateados, capturando al amado Spider-Man de 2002 con diseño nostálgico."
  },
  {
    minifigure_no: 'sh0893',
    description_en: "Ned Leeds in Red and Yellow Letter Jacket (2023) from No Way Home features Jacob Batalon's loyal friend in Midtown High varsity jacket with sand blue legs, capturing Peter Parker's best friend and Guy in the Chair with detailed school attire.",
    description_de: "Ned Leeds in rot-gelber Collegejacke (2023) aus No Way Home zeigt Jacob Batalons treuen Freund in Midtown High Varsity-Jacke mit sandblau Beinen, der Peter Parkers besten Freund und Guy in the Chair mit detaillierter Schulkleidung einfängt.",
    description_fr: "Ned Leeds en veste de lettres rouge et jaune (2023) de No Way Home présente l'ami fidèle de Jacob Batalon dans une veste universitaire de Midtown High avec des jambes bleu sable, capturant le meilleur ami de Peter Parker et Guy in the Chair avec une tenue scolaire détaillée.",
    description_es: "Ned Leeds en chaqueta de letras roja y amarilla (2023) de No Way Home presenta al amigo leal de Jacob Batalon en chaqueta universitaria de Midtown High con piernas azul arena, capturando al mejor amigo de Peter Parker y Guy in the Chair con atuendo escolar detallado."
  },
  {
    minifigure_no: 'sh0894',
    description_en: "MJ (Michelle Jones) in Dark Tan Striped Sweater (2023) from No Way Home features Zendaya's character in cozy casual attire with dark brown wavy hair, capturing her artistic personality and relationship with Peter Parker with detailed knit pattern printing.",
    description_de: "MJ (Michelle Jones) im dunkelbraunen gestreiften Pullover (2023) aus No Way Home zeigt Zendayas Charakter in gemütlicher Freizeitkleidung mit dunkelbraunem welligem Haar, der ihre künstlerische Persönlichkeit und Beziehung zu Peter Parker mit detailliertem Strickmuster-Druck einfängt.",
    description_fr: "MJ (Michelle Jones) en pull rayé brun foncé (2023) de No Way Home présente le personnage de Zendaya dans une tenue décontractée confortable avec des cheveux bruns ondulés, capturant sa personnalité artistique et sa relation avec Peter Parker avec une impression de motif tricoté détaillée.",
    description_es: "MJ (Michelle Jones) en suéter a rayas marrón oscuro (2023) de No Way Home presenta al personaje de Zendaya en atuendo casual acogedor con cabello castaño ondulado, capturando su personalidad artística y relación con Peter Parker con impresión de patrón de punto detallada."
  },
  {
    minifigure_no: 'sh0895',
    description_en: "Venom with White Teeth Parted and 4 Large Back Appendages (2023) brings the alien symbiote to life with massive build, articulated tentacle accessories, and characteristic white spider emblem, capturing the lethal protector with menacing appearance.",
    description_de: "Venom mit weißen getrennten Zähnen und 4 großen Rücken-Anhängseln (2023) erweckt den außerirdischen Symbioten mit massivem Körperbau, artikulierten Tentakel-Zubehör und charakteristischem weißem Spinnen-Emblem zum Leben, der den tödlichen Beschützer mit bedrohlichem Erscheinungsbild einfängt.",
    description_fr: "Venom avec dents blanches écartées et 4 grands appendices dorsaux (2023) donne vie au symbiote extraterrestre avec une construction massive, des accessoires de tentacules articulés et un emblème d'araignée blanc caractéristique, capturant le protecteur mortel avec une apparence menaçante.",
    description_es: "Venom con dientes blancos separados y 4 grandes apéndices traseros (2023) da vida al simbionte alienígena con constitución masiva, accesorios de tentáculos articulados y emblema de araña blanco característico, capturando al protector letal con apariencia amenazante."
  },
  {
    minifigure_no: 'sh0896',
    description_en: "Thanos Large Figure in Dark Bluish Gray Outfit with Printed Legs (2023) from The Infinity Saga features the Mad Titan in big-fig scale with enhanced printed leg details and angry expression, capturing Josh Brolin's imposing villain with premium build.",
    description_de: "Thanos große Figur im dunkelblaugrauen Outfit mit bedruckten Beinen (2023) aus The Infinity Saga zeigt den Verrückten Titanen im Big-Fig-Maßstab mit verbesserten bedruckten Beindetails und wütendem Ausdruck, der Josh Brolins imposanten Schurken mit Premium-Bau einfängt.",
    description_fr: "Grande figurine Thanos en tenue gris bleu foncé avec jambes imprimées (2023) de The Infinity Saga présente le Titan fou à l'échelle big-fig avec des détails de jambes imprimées améliorés et une expression en colère, capturant le méchant imposant de Josh Brolin avec une construction premium.",
    description_es: "Figura grande de Thanos en atuendo gris azulado oscuro con piernas impresas (2023) de The Infinity Saga presenta al Titán Loco a escala de figura grande con detalles de piernas impresas mejorados y expresión enojada, capturando al villano imponente de Josh Brolin con construcción premium."
  },
  {
    minifigure_no: 'sh0897',
    description_en: "The Scarlet Witch (Wanda Maximoff) with Dark Red Cloth Skirt (2023) from The Infinity Saga features Elizabeth Olsen's character with premium fabric skirt piece and tiara, capturing her WandaVision look with enhanced costume details and flowing design.",
    description_de: "Die Scharlachrote Hexe (Wanda Maximoff) mit dunkelrotem Stoffrock (2023) aus The Infinity Saga zeigt Elizabeth Olsens Charakter mit Premium-Stoffrock-Teil und Tiara, der ihren WandaVision-Look mit verbesserten Kostümdetails und fließendem Design einfängt.",
    description_fr: "La Sorcière Rouge (Wanda Maximoff) avec jupe en tissu rouge foncé (2023) de The Infinity Saga présente le personnage d'Elizabeth Olsen avec une pièce de jupe en tissu premium et une tiare, capturant son look WandaVision avec des détails de costume améliorés et un design fluide.",
    description_es: "La Bruja Escarlata (Wanda Maximoff) con falda de tela roja oscura (2023) de The Infinity Saga presenta al personaje de Elizabeth Olsen con pieza de falda de tela premium y tiara, capturando su look de WandaVision con detalles de traje mejorados y diseño fluido."
  },
  {
    minifigure_no: 'sh0898',
    description_en: "Valkyrie in Light Bluish Gray Suit (2023) from The Infinity Saga features Tessa Thompson's Asgardian warrior in her distinctive armor with detailed printing, capturing her evolution from alcoholic exile to King of New Asgard with regal appearance.",
    description_de: "Valkyrie im hellblaugrauen Anzug (2023) aus The Infinity Saga zeigt Tessa Thompsons asgardische Kriegerin in ihrer markanten Rüstung mit detailliertem Druck, die ihre Entwicklung von alkoholischem Exil zur Königin von Neu-Asgard mit königlichem Erscheinungsbild einfängt.",
    description_fr: "Valkyrie en costume gris bleu clair (2023) de The Infinity Saga présente la guerrière asgardienne de Tessa Thompson dans son armure distinctive avec une impression détaillée, capturant son évolution d'exil alcoolique à Roi de Nouveau Asgard avec une apparence royale.",
    description_es: "Valkyrie en traje gris azulado claro (2023) de The Infinity Saga presenta a la guerrera asgardiana de Tessa Thompson en su distintiva armadura con impresión detallada, capturando su evolución de exilio alcohólico a Rey de Nueva Asgard con apariencia regia."
  },
  {
    minifigure_no: 'sh0899',
    description_en: "Batman in Black Suit with Neutral/Angry Expressions (2023) from Tim Burton's Batman features Michael Keaton with dual-sided head showing calm and bared-teeth anger, capturing the Dark Knight's intimidating presence with white-eyed cowl and gold belt.",
    description_de: "Batman im schwarzen Anzug mit neutralen/wütenden Ausdrücken (2023) aus Tim Burtons Batman zeigt Michael Keaton mit doppelseitigem Kopf, der Ruhe und Zähne-fletschende Wut zeigt, der die einschüchternde Präsenz des Dark Knight mit weißäugigem Cowl und Goldgürtel einfängt.",
    description_fr: "Batman en costume noir avec expressions neutres/en colère (2023) du Batman de Tim Burton présente Michael Keaton avec une tête à double face montrant le calme et la colère aux dents découvertes, capturant la présence intimidante du Dark Knight avec une capuche aux yeux blancs et une ceinture dorée.",
    description_es: "Batman en traje negro con expresiones neutrales/enojadas (2023) del Batman de Tim Burton presenta a Michael Keaton con cabeza de doble cara mostrando calma e ira con dientes descubiertos, capturando la presencia intimidante del Caballero Oscuro con capucha de ojos blancos y cinturón dorado."
  },
  {
    minifigure_no: 'sh0900',
    description_en: "The Joker in Dark Turquoise Bow Tie with Fedora (2023) from Tim Burton's Batman features Jack Nicholson's Clown Prince of Crime in purple suit with hat accessory, capturing the theatrical villain's maniacal grin and flamboyant 1989 styling.",
    description_de: "Der Joker in dunkeltürkiser Fliege mit Fedora (2023) aus Tim Burtons Batman zeigt Jack Nicholsons Clown Prince of Crime im lila Anzug mit Hut-Zubehör, der das theatralische Grinsen des Schurken und flamboyantes 1989-Styling einfängt.",
    description_fr: "The Joker en nœud papillon turquoise foncé avec fedora (2023) du Batman de Tim Burton présente le Clown Prince of Crime de Jack Nicholson dans un costume violet avec accessoire de chapeau, capturant le sourire maniaque du méchant théâtral et le style flamboyant de 1989.",
    description_es: "The Joker en corbata de moño turquesa oscuro con sombrero fedora (2023) del Batman de Tim Burton presenta al Príncipe Payaso del Crimen de Jack Nicholson en traje púrpura con accesorio de sombrero, capturando la sonrisa maníaca del villano teatral y estilo extravagante de 1989."
  }
];

async function main() {
  console.log(`Starting batch update: sh0876-sh0900 (${descriptions.length} minifigures)`);

  for (const desc of descriptions) {
    try {
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
      console.log(`✅ Updated ${desc.minifigure_no}`);
    } catch (error) {
      console.error(`❌ Failed to update ${desc.minifigure_no}:`, error);
    }
  }

  console.log(`\n✅ Batch complete: sh0876-sh0900`);
  await prisma.$disconnect();
}

main();
