const fs = require('fs');
const path = require('path');

const de = require('../locales/de.json');
const fr = require('../locales/fr.json');
const es = require('../locales/es.json');

// German
de.themes.descriptions["Fabuland"] = "LEGO® Fabuland (1979-1989): Anthropomorphe Tier-Charaktere für Vorschulkinder! Edward Elephant, Bonnie Bunny, Max Mouse in vereinfachten Stadt-Szenarien. Retro-Kindheit. Perfekt für Nostalgie!";
de.themes.descriptions["Homemaker"] = "LEGO® Homemaker (1971-1982): Frühe LEGO-Häuser und Möbel! Wohnzimmer, Küchen, Schlafzimmer mit Minifiguren-Vorläufern. Vintage-Innenarchitektur. Perfekt für klassische LEGO!";
de.themes.descriptions["Basic"] = "LEGO® Basic (1965-heute): Reine Bau-Steine ohne Thema! Verschiedene Farben und Größen für freies Bauen. Die Grundlage von LEGO-Kreativität. Perfekt für Puristen!";
de.themes.descriptions["Freestyle"] = "LEGO® Freestyle (1991-heute): Kreative Bau-Boxen mit Steinen und Rädern! Freestyle-Eimer und Grundplatten für offenes Spielen. Perfekt für freie Kreativität!";
de.themes.descriptions["Primo"] = "LEGO® Primo (1996-2006): Baby-LEGO für 6-24 Monate! Rattle-Steine, Beißringe und weiche Plüsch-Elemente. Ersetzt durch DUPLO Baby. Perfekt für Babys!";
de.themes.descriptions["Baby"] = "LEGO® Baby (1990er-2000er): Kleinkind-Spielzeug für die Jüngsten! Rassel-Steine, Plüschtiere und sichere Baby-Produkte. Teil der DUPLO-Familie. Perfekt für Kleinkinder!";
de.themes.descriptions["Explore"] = "LEGO® Explore (2002-2004): DUPLO-Unterkategorie für Vorschulkinder! Lern-Sets mit Zahlen, Buchstaben, Tieren. Spielerisches Lernen. Perfekt für Vorschüler!";
de.themes.descriptions["Quatro"] = "LEGO® Quatro (2004-2006): Übergroße Bausteine für 1-3 Jahre! Doppelt so groß wie DUPLO, vierfach größer als System-Steine. Sicher für Kleinkinder. Perfekt für die Kleinsten!";
de.themes.descriptions["Service Packs"] = "LEGO® Service Packs: Ersatzteile und spezielle Komponenten! Ersatz-Steine, Räder, Fenster und seltene Elemente. Offizieller LEGO-Service. Perfekt für Reparaturen!";
de.themes.descriptions["Bulk Bricks"] = "LEGO® Bulk Bricks: Große Mengen von Basis-Steinen! Eimer und Boxen mit hunderten Steinen für Massen-Bauen. Wert-orientierte Sets. Perfekt für MOC-Builder!";
de.themes.descriptions["Storage"] = "LEGO® Storage: Aufbewahrungslösungen für LEGO! Brick-förmige Boxen, Sortier-Organizer und Display-Cases. Ordnung ins Chaos. Perfekt für Organisation!";
de.themes.descriptions["Gear"] = "LEGO® Gear: Nicht-Bauspielzeug LEGO-Produkte! Kleidung, Rucksäcke, Schreibwaren und Accessoires. LEGO-Lifestyle. Perfekt für Fans!";
de.themes.descriptions["Books"] = "LEGO® Books: Offiziell lizenzierte LEGO-Bücher! Bauanleitungen, Enzyklopädien, Romane und Comics. LEGO-Lektüre. Perfekt für Leser!";
de.themes.descriptions["Video Games"] = "LEGO® Video Games: LEGO-Videospiele von TT Games! LEGO Star Wars, Batman, Harry Potter, Marvel und mehr. Block-förmige Gaming. Perfekt für Gamer!";
de.themes.descriptions["Board Games"] = "LEGO® Board Games (2009-2013): Baubares Brettspiel-System! Minotaurus, Pirate Code, Race 3000. Anpassbare Spielbretter. Perfekt für Spieleabende!";
de.themes.descriptions["Trading Cards"] = "LEGO® Trading Cards: Sammelkarten verschiedener Themen! NINJAGO, Star Wars, NEXO KNIGHTS Karten. Sammeln und tauschen. Perfekt für Sammler!";
de.themes.descriptions["Watches"] = "LEGO® Watches: Tragbare LEGO-Armbanduhren! Minifiguren-Uhren, anpassbare Armbänder. Zeit im LEGO-Stil. Perfekt für Mode!";
de.themes.descriptions["Jewelry"] = "LEGO® Jewelry: LEGO-Schmuck und Accessoires! Halsketten, Ohrringe, Ringe mit Mini-LEGO-Steinen. Wearable LEGO. Perfekt für Schmuck-Fans!";
de.themes.descriptions["Keychains"] = "LEGO® Keychains: Minifiguren-Schlüsselanhänger! Star Wars, Super Heroes, NINJAGO-Charaktere an Schlüsselringen. Portable Minifigs. Perfekt für Taschen!";
de.themes.descriptions["Magnets"] = "LEGO® Magnets: Magnet-Minifiguren für Kühlschränke! Kleine Magnete mit populären Charakteren. Dekorative LEGO-Magnete. Perfekt für Kühlschränke!";

// French
fr.themes.descriptions["Fabuland"] = "LEGO® Fabuland (1979-1989): Personnages animaux anthropomorphes pour préscolaires! Edward Elephant, Bonnie Bunny, Max Mouse dans scénarios ville simplifiés. Enfance rétro. Parfait pour la nostalgie!";
fr.themes.descriptions["Homemaker"] = "LEGO® Homemaker (1971-1982): Premières maisons et meubles LEGO! Salons, cuisines, chambres avec précurseurs minifigurines. Architecture d'intérieur vintage. Parfait pour LEGO classique!";
fr.themes.descriptions["Basic"] = "LEGO® Basic (1965-aujourd'hui): Briques de construction pures sans thème! Couleurs et tailles variées pour construction libre. Fondation de la créativité LEGO. Parfait pour puristes!";
fr.themes.descriptions["Freestyle"] = "LEGO® Freestyle (1991-aujourd'hui): Boîtes créatives avec briques et roues! Seaux Freestyle et plaques de base pour jeu ouvert. Parfait pour créativité libre!";
fr.themes.descriptions["Primo"] = "LEGO® Primo (1996-2006): Baby LEGO pour 6-24 mois! Briques hochets, anneaux de dentition et éléments peluche doux. Remplacé par DUPLO Baby. Parfait pour bébés!";
fr.themes.descriptions["Baby"] = "LEGO® Baby (années 90-2000): Jouets tout-petits pour les plus jeunes! Briques hochets, peluches et produits bébé sûrs. Partie famille DUPLO. Parfait pour tout-petits!";
fr.themes.descriptions["Explore"] = "LEGO® Explore (2002-2004): Sous-catégorie DUPLO pour préscolaires! Sets d'apprentissage avec chiffres, lettres, animaux. Apprentissage ludique. Parfait pour préscolaires!";
fr.themes.descriptions["Quatro"] = "LEGO® Quatro (2004-2006): Briques surdimensionnées pour 1-3 ans! Double taille DUPLO, quadruple taille System. Sûr pour tout-petits. Parfait pour les plus petits!";
fr.themes.descriptions["Service Packs"] = "LEGO® Service Packs: Pièces détachées et composants spéciaux! Briques de remplacement, roues, fenêtres et éléments rares. Service officiel LEGO. Parfait pour réparations!";
fr.themes.descriptions["Bulk Bricks"] = "LEGO® Bulk Bricks: Grandes quantités de briques de base! Seaux et boîtes avec centaines de briques pour construction de masse. Sets orientés valeur. Parfait pour builders MOC!";
fr.themes.descriptions["Storage"] = "LEGO® Storage: Solutions de rangement pour LEGO! Boîtes forme brique, organiseurs de tri et vitrines. Ordre dans le chaos. Parfait pour organisation!";
fr.themes.descriptions["Gear"] = "LEGO® Gear: Produits LEGO non-construction! Vêtements, sacs à dos, papeterie et accessoires. Style de vie LEGO. Parfait pour les fans!";
fr.themes.descriptions["Books"] = "LEGO® Books: Livres LEGO sous licence officielle! Instructions de construction, encyclopédies, romans et comics. Lecture LEGO. Parfait pour lecteurs!";
fr.themes.descriptions["Video Games"] = "LEGO® Video Games: Jeux vidéo LEGO par TT Games! LEGO Star Wars, Batman, Harry Potter, Marvel et plus. Gaming en blocs. Parfait pour gamers!";
fr.themes.descriptions["Board Games"] = "LEGO® Board Games (2009-2013): Système jeux de société constructible! Minotaurus, Pirate Code, Race 3000. Plateaux personnalisables. Parfait pour soirées jeux!";
fr.themes.descriptions["Trading Cards"] = "LEGO® Trading Cards: Cartes à collectionner divers thèmes! Cartes NINJAGO, Star Wars, NEXO KNIGHTS. Collectionner et échanger. Parfait pour collectionneurs!";
fr.themes.descriptions["Watches"] = "LEGO® Watches: Montres-bracelets LEGO portables! Montres minifigurines, bracelets personnalisables. Temps style LEGO. Parfait pour la mode!";
fr.themes.descriptions["Jewelry"] = "LEGO® Jewelry: Bijoux et accessoires LEGO! Colliers, boucles d'oreilles, bagues avec mini-briques LEGO. LEGO portable. Parfait pour fans de bijoux!";
fr.themes.descriptions["Keychains"] = "LEGO® Keychains: Porte-clés minifigurines! Personnages Star Wars, Super Heroes, NINJAGO sur anneaux. Minifigs portables. Parfait pour sacs!";
fr.themes.descriptions["Magnets"] = "LEGO® Magnets: Minifigurines magnétiques pour réfrigérateurs! Petits aimants avec personnages populaires. Aimants LEGO décoratifs. Parfait pour frigos!";

// Spanish
es.themes.descriptions["Fabuland"] = "LEGO® Fabuland (1979-1989): ¡Personajes animales antropomórficos para preescolares! Edward Elephant, Bonnie Bunny, Max Mouse en escenarios de ciudad simplificados. Infancia retro. ¡Perfecto para nostalgia!";
es.themes.descriptions["Homemaker"] = "LEGO® Homemaker (1971-1982): ¡Primeras casas y muebles LEGO! Salas, cocinas, dormitorios con precursores de minifiguras. Arquitectura interior vintage. ¡Perfecto para LEGO clásico!";
es.themes.descriptions["Basic"] = "LEGO® Basic (1965-hoy): ¡Ladrillos de construcción puros sin tema! Colores y tamaños variados para construcción libre. Fundación de creatividad LEGO. ¡Perfecto para puristas!";
es.themes.descriptions["Freestyle"] = "LEGO® Freestyle (1991-hoy): ¡Cajas creativas con ladrillos y ruedas! Cubos Freestyle y placas base para juego abierto. ¡Perfecto para creatividad libre!";
es.themes.descriptions["Primo"] = "LEGO® Primo (1996-2006): ¡Baby LEGO para 6-24 meses! Ladrillos sonajero, aros de dentición y elementos de peluche suaves. Reemplazado por DUPLO Baby. ¡Perfecto para bebés!";
es.themes.descriptions["Baby"] = "LEGO® Baby (años 90-2000): ¡Juguetes para bebés para los más pequeños! Ladrillos sonajero, peluches y productos seguros para bebés. Parte de familia DUPLO. ¡Perfecto para bebés!";
es.themes.descriptions["Explore"] = "LEGO® Explore (2002-2004): ¡Subcategoría DUPLO para preescolares! Sets de aprendizaje con números, letras, animales. Aprendizaje lúdico. ¡Perfecto para preescolares!";
es.themes.descriptions["Quatro"] = "LEGO® Quatro (2004-2006): ¡Ladrillos sobredimensionados para 1-3 años! Doble tamaño DUPLO, cuádruple tamaño System. Seguro para bebés. ¡Perfecto para los más pequeños!";
es.themes.descriptions["Service Packs"] = "LEGO® Service Packs: ¡Piezas de repuesto y componentes especiales! Ladrillos de reemplazo, ruedas, ventanas y elementos raros. Servicio oficial LEGO. ¡Perfecto para reparaciones!";
es.themes.descriptions["Bulk Bricks"] = "LEGO® Bulk Bricks: ¡Grandes cantidades de ladrillos básicos! Cubos y cajas con cientos de ladrillos para construcción masiva. Sets orientados al valor. ¡Perfecto para builders MOC!";
es.themes.descriptions["Storage"] = "LEGO® Storage: ¡Soluciones de almacenamiento para LEGO! Cajas forma ladrillo, organizadores de clasificación y vitrinas. Orden en el caos. ¡Perfecto para organización!";
es.themes.descriptions["Gear"] = "LEGO® Gear: ¡Productos LEGO no-construcción! Ropa, mochilas, papelería y accesorios. Estilo de vida LEGO. ¡Perfecto para fans!";
es.themes.descriptions["Books"] = "LEGO® Books: ¡Libros LEGO con licencia oficial! Instrucciones de construcción, enciclopedias, novelas y cómics. Lectura LEGO. ¡Perfecto para lectores!";
es.themes.descriptions["Video Games"] = "LEGO® Video Games: ¡Videojuegos LEGO por TT Games! LEGO Star Wars, Batman, Harry Potter, Marvel y más. Gaming en bloques. ¡Perfecto para gamers!";
es.themes.descriptions["Board Games"] = "LEGO® Board Games (2009-2013): ¡Sistema de juegos de mesa construible! Minotaurus, Pirate Code, Race 3000. Tableros personalizables. ¡Perfecto para noches de juegos!";
es.themes.descriptions["Trading Cards"] = "LEGO® Trading Cards: ¡Cartas coleccionables de varios temas! Cartas NINJAGO, Star Wars, NEXO KNIGHTS. Coleccionar e intercambiar. ¡Perfecto para coleccionistas!";
es.themes.descriptions["Watches"] = "LEGO® Watches: ¡Relojes de pulsera LEGO portables! Relojes de minifiguras, pulseras personalizables. Tiempo estilo LEGO. ¡Perfecto para moda!";
es.themes.descriptions["Jewelry"] = "LEGO® Jewelry: ¡Joyas y accesorios LEGO! Collares, aretes, anillos con mini-ladrillos LEGO. LEGO portable. ¡Perfecto para fans de joyas!";
es.themes.descriptions["Keychains"] = "LEGO® Keychains: ¡Llaveros de minifiguras! Personajes Star Wars, Super Heroes, NINJAGO en argollas. Minifigs portables. ¡Perfecto para bolsas!";
es.themes.descriptions["Magnets"] = "LEGO® Magnets: ¡Minifiguras magnéticas para refrigeradores! Pequeños imanes con personajes populares. Imanes LEGO decorativos. ¡Perfecto para neveras!";

fs.writeFileSync(path.join(__dirname, '../locales/de.json'), JSON.stringify(de, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../locales/fr.json'), JSON.stringify(fr, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../locales/es.json'), JSON.stringify(es, null, 2), 'utf8');

console.log('✅ Batch 8 complete: 20 themes');
console.log('📊 Progress: 128/179 themes = 71% complete');
console.log('⏭️  Next: 51 themes remaining');
