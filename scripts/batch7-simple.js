const fs = require('fs');
const path = require('path');

const de = require('../locales/de.json');
const fr = require('../locales/fr.json');
const es = require('../locales/es.json');

// German
de.themes.descriptions["Insectoids"] = "LEGO® Insectoids (1998-1999): Weltraum-Kolonisten auf insekten-infiziertem Planeten! Zapper und Gypsy gegen riesige Alien-Insekten. Transparente neon-Farben. Perfekt für Bug-Action!";
de.themes.descriptions["Spyrius"] = "LEGO® Spyrius (1994-1996): Mysteriöse Weltraum-Spione in schwarz/rot! Roboter, Spionage-Fahrzeuge und geheime Basen. Teil der Space-Ära. Perfekt für Space-Spionage!";
de.themes.descriptions["UFO"] = "LEGO® UFO (1997-1998): Aliens gegen Menschen im Weltraum! Blaue/transparente Alien-Saucers kämpfen gegen weiße/blaue Erdverteidigung. Cyberdrone-Roboter. Perfekt für Alien-Invasion!";
de.themes.descriptions["Life on Mars"] = "LEGO® Life on Mars (2001): Menschen treffen friedliche Mars-Aliens! Astronauten und orange Marsianer teilen den roten Planeten. Hybrid Martian-Human Sets. Perfekt für Mars-Kolonisation!";
de.themes.descriptions["Mission to Mars"] = "LEGO® Mission to Mars (2003): Mars-Pioniere bauen Forschungsstationen! Astronauten, Rover und Lebensraum-Module auf dem Mars. Realistische Weltraum-Exploration. Perfekt für echte Weltraum-Fans!";
de.themes.descriptions["Discovery"] = "LEGO® Discovery (2003-2004): Bildungs-Sets mit echten NASA-Partnerschaften! Space Shuttle, Mars Rover, Dinosaurier-Skelette. LEGO trifft Wissenschaft. Perfekt für STEM-Lernen!";
de.themes.descriptions["Alpha Team"] = "LEGO® Alpha Team (2001-2005): Elite-Spionage-Team gegen böse Ogel! Dash Justice, Radia und Crunch gegen Mind-Control-Plots. Sci-Fi Spionage-Action. Perfekt für Agenten-Action!";
de.themes.descriptions["Extreme Team"] = "LEGO® Extreme Team (2002): Extrem-Sport-Athleten! Skateboarding, BMX, Inline-Skating und Snowboarding mit Rampen und Stunts. Perfekt für X-Games-Fans!";
de.themes.descriptions["Jack Stone"] = "LEGO® Jack Stone (2001-2003): Simplifizierte Action-Sets für jüngere Kinder! Jack rettet die Stadt mit Feuerwehr, Polizei und Rettungsmissionen. Easy-Build. Perfekt für Einsteiger!";
de.themes.descriptions["Knights Kingdom I"] = "LEGO® Knights Kingdom I (2000-2001): Klassische Ritter des Königreichs! König Leo, Cedric, Gilbert und Richard kämpfen gegen Cedric the Bull. Mittelalterliche Turniere. Perfekt für Ritter!";
de.themes.descriptions["Knights Kingdom II"] = "LEGO® Knights Kingdom II (2004-2006): Fantasie-Ritter mit BIONICLE-Stil! Santis, Danju, Rascus und Jayko gegen Vladek. Große Action-Figuren mit Rüstung. Perfekt für Ritter-Action!";
de.themes.descriptions["Vikings"] = "LEGO® Vikings (2005-2006): Nordische Krieger gegen Drachen! Wikinger-Dörfer, Langschiffe und Schatz-Jagden. Horned Helms und Battle Axes. Perfekt für Nordmänner!";
de.themes.descriptions["Belville"] = "LEGO® Belville (1994-2009): LEGO-Linie für Mädchen mit Puppen-ähnlichen Figuren! Märchen-Prinzessinnen, Pferde, Paläste und Freundschafts-Geschichten. Größere Figuren. Perfekt für junge Baumeisterinnen!";
de.themes.descriptions["Scala"] = "LEGO® Scala (1979-1980, 1997-2001): Fashion-fokussierte Sets für Mädchen! Puppenhaus-ähnliche Figuren mit Mode, Schmuck und Wohnräumen. Perfekt für Mode-Fans!";
de.themes.descriptions["Clikits"] = "LEGO® Clikits (2003-2006): Schmuck- und Accessoire-Bastelsets für Mädchen! Armbänder, Schlüsselanhänger, Bilderrahmen mit Klick-Verbindungen. Nicht-Brick LEGO. Perfekt für Crafting!";
de.themes.descriptions["Creator Expert"] = "LEGO® Creator Expert: Hochdetaillierte Modelle für Erwachsene! Modulare Gebäude, Fahrzeuge, Fairground und Architektur. 18+ Sets. Perfekt für anspruchsvolle Bauer!";
de.themes.descriptions["Creator 3-in-1"] = "LEGO® Creator 3-in-1: Ein Set, drei Modelle! Bauen, umbauen, nochmals bauen. Tiere, Fahrzeuge, Häuser mit alternativen Bauanleitungen. Perfekt für kreative Bauer!";
de.themes.descriptions["Seasonal"] = "LEGO® Seasonal: Saisonale Sets für Feiertage! Halloween, Ostern, Valentinstag, Thanksgiving und mehr. Limitierte Event-Sets. Perfekt für Sammler!";
de.themes.descriptions["Holiday"] = "LEGO® Holiday: Weihnachts- und Winterferien-Sets! Santa, Schneemänner, Weihnachtsmärkte und Geschenke. Festliche LEGO-Magie. Perfekt für die Feiertage!";
de.themes.descriptions["Promotional"] = "LEGO® Promotional: Exklusive Werbegeschenk-Sets! Store-Promos, Event-Exclusives, Polybags und limitierte Minifiguren. Sammler-Schätze. Perfekt für Promo-Jäger!";

// French
fr.themes.descriptions["Insectoids"] = "LEGO® Insectoids (1998-1999): Colons spatiaux sur planète infestée d'insectes! Zapper et Gypsy contre insectes aliens géants. Couleurs néon transparentes. Parfait pour l'action bugs!";
fr.themes.descriptions["Spyrius"] = "LEGO® Spyrius (1994-1996): Espions spatiaux mystérieux en noir/rouge! Robots, véhicules d'espionnage et bases secrètes. Ère Space. Parfait pour l'espionnage spatial!";
fr.themes.descriptions["UFO"] = "LEGO® UFO (1997-1998): Aliens vs humains dans l'espace! Soucoupes aliens bleues/transparentes vs défense terrestre blanc/bleu. Robots Cyberdrone. Parfait pour l'invasion alien!";
fr.themes.descriptions["Life on Mars"] = "LEGO® Life on Mars (2001): Humains rencontrent aliens martiens pacifiques! Astronautes et martiens orange partagent la planète rouge. Sets hybrides. Parfait pour la colonisation martienne!";
fr.themes.descriptions["Mission to Mars"] = "LEGO® Mission to Mars (2003): Pionniers martiens construisent stations de recherche! Astronautes, rovers et modules habitat sur Mars. Exploration spatiale réaliste. Parfait pour les fans!";
fr.themes.descriptions["Discovery"] = "LEGO® Discovery (2003-2004): Sets éducatifs avec partenariats NASA réels! Navette spatiale, rover Mars, squelettes de dinosaures. LEGO rencontre science. Parfait pour STEM!";
fr.themes.descriptions["Alpha Team"] = "LEGO® Alpha Team (2001-2005): Équipe d'espionnage d'élite contre Ogel maléfique! Dash Justice, Radia et Crunch contre contrôle mental. Espionnage sci-fi. Parfait pour l'action d'agents!";
fr.themes.descriptions["Extreme Team"] = "LEGO® Extreme Team (2002): Athlètes de sports extrêmes! Skateboard, BMX, roller et snowboard avec rampes. Parfait pour les fans X-Games!";
fr.themes.descriptions["Jack Stone"] = "LEGO® Jack Stone (2001-2003): Sets d'action simplifiés pour jeunes enfants! Jack sauve la ville avec pompiers, police et sauvetages. Construction facile. Parfait pour débutants!";
fr.themes.descriptions["Knights Kingdom I"] = "LEGO® Knights Kingdom I (2000-2001): Chevaliers classiques du royaume! Roi Leo, Cedric, Gilbert et Richard contre Cedric the Bull. Tournois médiévaux. Parfait pour les chevaliers!";
fr.themes.descriptions["Knights Kingdom II"] = "LEGO® Knights Kingdom II (2004-2006): Chevaliers fantasy style BIONICLE! Santis, Danju, Rascus et Jayko contre Vladek. Grandes figurines d'action. Parfait pour l'action chevaliers!";
fr.themes.descriptions["Vikings"] = "LEGO® Vikings (2005-2006): Guerriers nordiques contre dragons! Villages vikings, drakkars et chasses au trésor. Casques à cornes et haches. Parfait pour les nordiques!";
fr.themes.descriptions["Belville"] = "LEGO® Belville (1994-2009): Ligne LEGO pour filles avec figurines type poupées! Princesses de contes de fées, chevaux, palais. Grandes figurines. Parfait pour jeunes bâtisseuses!";
fr.themes.descriptions["Scala"] = "LEGO® Scala (1979-1980, 1997-2001): Sets mode pour filles! Figurines type maison de poupée avec mode, bijoux et espaces de vie. Parfait pour les fans de mode!";
fr.themes.descriptions["Clikits"] = "LEGO® Clikits (2003-2006): Sets craft de bijoux et accessoires pour filles! Bracelets, porte-clés, cadres avec connexions clic. LEGO non-brique. Parfait pour le craft!";
fr.themes.descriptions["Creator Expert"] = "LEGO® Creator Expert: Modèles hautement détaillés pour adultes! Bâtiments modulaires, véhicules, fêtes foraines. Sets 18+. Parfait pour bâtisseurs exigeants!";
fr.themes.descriptions["Creator 3-in-1"] = "LEGO® Creator 3-in-1: Un set, trois modèles! Construire, reconstruire, encore construire. Animaux, véhicules, maisons avec instructions alternatives. Parfait pour bâtisseurs créatifs!";
fr.themes.descriptions["Seasonal"] = "LEGO® Seasonal: Sets saisonniers pour fêtes! Halloween, Pâques, Saint-Valentin, Thanksgiving. Sets événementiels limités. Parfait pour les collectionneurs!";
fr.themes.descriptions["Holiday"] = "LEGO® Holiday: Sets Noël et vacances d'hiver! Père Noël, bonshommes de neige, marchés de Noël. Magie LEGO festive. Parfait pour les fêtes!";
fr.themes.descriptions["Promotional"] = "LEGO® Promotional: Sets cadeaux exclusifs! Promos magasin, exclusivités événements, polybags et minifigurines limitées. Trésors de collection. Parfait pour chasseurs de promos!";

// Spanish
es.themes.descriptions["Insectoids"] = "LEGO® Insectoids (1998-1999): ¡Colonos espaciales en planeta infestado de insectos! Zapper y Gypsy contra insectos aliens gigantes. Colores neón transparentes. ¡Perfecto para acción de bugs!";
es.themes.descriptions["Spyrius"] = "LEGO® Spyrius (1994-1996): ¡Espías espaciales misteriosos en negro/rojo! Robots, vehículos de espionaje y bases secretas. Era Space. ¡Perfecto para espionaje espacial!";
es.themes.descriptions["UFO"] = "LEGO® UFO (1997-1998): ¡Aliens vs humanos en el espacio! Platillos aliens azules/transparentes vs defensa terrestre blanco/azul. Robots Cyberdrone. ¡Perfecto para invasión alien!";
es.themes.descriptions["Life on Mars"] = "LEGO® Life on Mars (2001): ¡Humanos conocen aliens marcianos pacíficos! Astronautas y marcianos naranjas comparten el planeta rojo. Sets híbridos. ¡Perfecto para colonización marciana!";
es.themes.descriptions["Mission to Mars"] = "LEGO® Mission to Mars (2003): ¡Pioneros marcianos construyen estaciones de investigación! Astronautas, rovers y módulos hábitat en Marte. Exploración espacial realista. ¡Perfecto para fans!";
es.themes.descriptions["Discovery"] = "LEGO® Discovery (2003-2004): ¡Sets educativos con asociaciones NASA reales! Transbordador espacial, rover Mars, esqueletos de dinosaurios. LEGO encuentra ciencia. ¡Perfecto para STEM!";
es.themes.descriptions["Alpha Team"] = "LEGO® Alpha Team (2001-2005): ¡Equipo de espionaje de élite contra Ogel malvado! Dash Justice, Radia y Crunch contra control mental. Espionaje sci-fi. ¡Perfecto para acción de agentes!";
es.themes.descriptions["Extreme Team"] = "LEGO® Extreme Team (2002): ¡Atletas de deportes extremos! Skateboard, BMX, patinaje y snowboard con rampas. ¡Perfecto para fans de X-Games!";
es.themes.descriptions["Jack Stone"] = "LEGO® Jack Stone (2001-2003): ¡Sets de acción simplificados para niños pequeños! Jack salva la ciudad con bomberos, policía y rescates. Construcción fácil. ¡Perfecto para principiantes!";
es.themes.descriptions["Knights Kingdom I"] = "LEGO® Knights Kingdom I (2000-2001): ¡Caballeros clásicos del reino! Rey Leo, Cedric, Gilbert y Richard contra Cedric the Bull. Torneos medievales. ¡Perfecto para caballeros!";
es.themes.descriptions["Knights Kingdom II"] = "LEGO® Knights Kingdom II (2004-2006): ¡Caballeros de fantasía estilo BIONICLE! Santis, Danju, Rascus y Jayko contra Vladek. Grandes figuras de acción. ¡Perfecto para acción de caballeros!";
es.themes.descriptions["Vikings"] = "LEGO® Vikings (2005-2006): ¡Guerreros nórdicos contra dragones! Aldeas vikingas, drakkar y cazas de tesoros. Cascos con cuernos y hachas. ¡Perfecto para nórdicos!";
es.themes.descriptions["Belville"] = "LEGO® Belville (1994-2009): ¡Línea LEGO para niñas con figuras tipo muñecas! Princesas de cuentos, caballos, palacios. Figuras grandes. ¡Perfecto para jóvenes constructoras!";
es.themes.descriptions["Scala"] = "LEGO® Scala (1979-1980, 1997-2001): ¡Sets de moda para niñas! Figuras tipo casa de muñecas con moda, joyas y espacios de vida. ¡Perfecto para fans de moda!";
es.themes.descriptions["Clikits"] = "LEGO® Clikits (2003-2006): ¡Sets craft de joyas y accesorios para niñas! Pulseras, llaveros, marcos con conexiones clic. LEGO no-ladrillo. ¡Perfecto para crafting!";
es.themes.descriptions["Creator Expert"] = "LEGO® Creator Expert: ¡Modelos altamente detallados para adultos! Edificios modulares, vehículos, ferias. Sets 18+. ¡Perfecto para constructores exigentes!";
es.themes.descriptions["Creator 3-in-1"] = "LEGO® Creator 3-in-1: ¡Un set, tres modelos! Construir, reconstruir, construir otra vez. Animales, vehículos, casas con instrucciones alternativas. ¡Perfecto para constructores creativos!";
es.themes.descriptions["Seasonal"] = "LEGO® Seasonal: ¡Sets de temporada para festividades! Halloween, Pascua, San Valentín, Acción de Gracias. Sets de eventos limitados. ¡Perfecto para coleccionistas!";
es.themes.descriptions["Holiday"] = "LEGO® Holiday: ¡Sets de Navidad y vacaciones de invierno! Santa, muñecos de nieve, mercados navideños. Magia LEGO festiva. ¡Perfecto para las fiestas!";
es.themes.descriptions["Promotional"] = "LEGO® Promotional: ¡Sets de regalo exclusivos! Promos de tienda, exclusivos de eventos, polybags y minifiguras limitadas. Tesoros de colección. ¡Perfecto para cazadores de promos!";

fs.writeFileSync(path.join(__dirname, '../locales/de.json'), JSON.stringify(de, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../locales/fr.json'), JSON.stringify(fr, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../locales/es.json'), JSON.stringify(es, null, 2), 'utf8');

console.log('✅ Batch 7 complete: 20 themes');
console.log('📊 Progress: 108/179 themes = 60% complete');
console.log('🎉 Past halfway! 71 themes remaining');
