const fs = require('fs');
const path = require('path');

const de = require('../locales/de.json');
const fr = require('../locales/fr.json');
const es = require('../locales/es.json');

// German
de.themes.descriptions["Teenage Mutant Ninja Turtles"] = "Cowabunga! LEGO® TMNT Minifiguren bringen die Turtles-Power! Leonardo, Donatello, Michelangelo und Raphael kämpfen gegen Shredder, Krang und die Foot Clan. Pizza-liebende Ninja-Schildkröten mit Meister Splinter. Perfekt für TMNT-Fans!";
de.themes.descriptions["Toy Story"] = "To infinity and beyond! LEGO® Toy Story mit Woody, Buzz Lightyear, Jessie und den Spielzeugen von Andy. Rex, Hamm, Slinky Dog und Bo Peep. Perfekt für Pixar-Fans!";
de.themes.descriptions["The LEGO Movie"] = "Everything is awesome! Emmet, Wyldstyle, Batman, Unikitty und Benny aus dem LEGO Movie! Master Builders gegen Lord Business. Perfekt für LEGO Movie-Fans!";
de.themes.descriptions["The LEGO Batman Movie"] = "I only work in black... and sometimes very very dark gray! LEGO Batman, Robin, Batgirl gegen Joker und die Rogue's Gallery. Perfekt für Batman-Fans!";
de.themes.descriptions["Overwatch"] = "Heroes never die! LEGO® Overwatch mit Tracer, Widowmaker, Soldier 76, Hanzo, D.Va und mehr. Blizzard's FPS-Helden in LEGO-Form. Perfekt für Gamer!";
de.themes.descriptions["Minecraft Dungeons"] = "Dungeon-crawling in der Minecraft-Welt! Helden mit speziellen Rüstungen und Waffen gegen Mobs. Basierend auf dem Action-RPG-Spinoff. Perfekt für Minecraft-Fans!";
de.themes.descriptions["Forma"] = "LEGO® Forma ist eine experimentelle LEGO-Serie für Erwachsene mit mechanischen Fisch-Skulpturen und anpassbaren Skins. Organische Bewegungen durch Zahnräder. Perfekt für Design-Liebhaber!";
de.themes.descriptions["LEGO Art"] = "LEGO® Art Mosaik-Sets für Erwachsene: Star Wars, Marvel, The Beatles, Andy Warhol und mehr. Hängende Wandkunst aus tausenden Steinen. Perfekt für Kunst-Sammler!";
de.themes.descriptions["LEGO Super Mario"] = "It's-a me, Mario! Interaktive LEGO® Super Mario-Sets mit elektronischen Mario-, Luigi- und Peach-Figuren. Sammeln Sie Münzen, besiegen Sie Bowser und Goombas. Perfekt für Nintendo-Fans!";
de.themes.descriptions["LEGO Luigi"] = "Luigi time! Luigi's Mansion und Luigi-Adventures mit elektronischer Luigi-Figur. Geisterjagd und Münzen sammeln im Mushroom Kingdom. Perfekt für Luigi-Fans!";
de.themes.descriptions["Brickheadz"] = "LEGO® Brickheadz sind kubische Figuren von Pop-Kultur-Ikonen: Marvel, Star Wars, Disney, DC, Harry Potter und mehr. Stylisierte Köpfe zum Sammeln. Perfekt für Pop-Kultur-Sammler!";
de.themes.descriptions["VIDIYO"] = "LEGO® VIDIYO kombiniert LEGO mit Musik-Videos! Minifiguren-Bandmates mit AR-App zum Erstellen von Musikvideos. BeatBits und Bühnen-Sets. Perfekt für Musik-Fans!";
de.themes.descriptions["Dots"] = "LEGO® Dots sind kreative Schmuck- und Deko-Sets zum Gestalten: Armbänder, Bilderrahmen, Aufbewahrungsboxen mit bunten Tiles. Endlos anpassbar. Perfekt für Design-Fans!";
de.themes.descriptions["BOOST"] = "LEGO® BOOST ist ein programmierbares Robotik-System für Kinder. Bauen Sie Vernie den Roboter, Frankie die Katze, die M.T.R.4-Maschine und mehr. App-basierte Programmierung. Perfekt für STEM-Lernen!";
de.themes.descriptions["Powered UP"] = "LEGO® Powered UP ist das moderne Motor- und Smart Hub-System für MOC-Builders. Bluetooth-gesteuerte Motoren, Lichter und Sensoren. Perfekt für Technik-Fans!";
de.themes.descriptions["Mindstorms"] = "LEGO® Mindstorms ist das ultimative programmierbare Robotik-System. Bauen und codieren Sie komplexe Roboter mit Sensoren, Motoren und dem programmierbaren Brick. Perfekt für MINT-Enthusiasten!";
de.themes.descriptions["Education"] = "LEGO® Education bietet Lernwerkzeuge für Schulen: WeDo, Spike Prime, Mindstorms Education. MINT-Lehrpläne mit hands-on Lernen. Perfekt für Pädagogen!";
de.themes.descriptions["SERIOUS PLAY"] = "LEGO® SERIOUS PLAY ist eine Facilitationsmethode für Unternehmen mit speziellen LEGO-Kits. Workshops für Innovation und Problemlösung. Perfekt für Team-Building!";
de.themes.descriptions["LEGO House"] = "LEGO® House in Billund, Dänemark ist das ultimative LEGO-Erlebnis. Exklusive LEGO House-Minifiguren und Sets nur dort erhältlich. Perfekt für LEGO-Pilger!";
de.themes.descriptions["BrickLink Designer Program"] = "BrickLink Designer Program sind von Fans designte Sets, die durch Community-Voting produziert werden. Exklusive Fan-Designs nur auf BrickLink. Perfekt für Crowdsourced-Kreativität!";

// French  
fr.themes.descriptions["Teenage Mutant Ninja Turtles"] = "Cowabunga! LEGO® TMNT avec Leonardo, Donatello, Michelangelo et Raphael contre Shredder et Foot Clan. Tortues ninja avec Maître Splinter. Parfait pour les fans!";
fr.themes.descriptions["Toy Story"] = "Vers l'infini et au-delà! LEGO® Toy Story avec Woody, Buzz, Jessie et les jouets d'Andy. Rex, Hamm, Slinky Dog. Parfait pour les fans Pixar!";
fr.themes.descriptions["The LEGO Movie"] = "Tout est génial! Emmet, Wyldstyle, Batman, Unikitty du LEGO Movie! Master Builders vs Lord Business. Parfait pour les fans!";
fr.themes.descriptions["The LEGO Batman Movie"] = "Je travaille qu'en noir... et parfois en gris très très foncé! Batman, Robin, Batgirl vs Joker. Parfait pour les fans!";
fr.themes.descriptions["Overwatch"] = "Les héros ne meurent jamais! LEGO® Overwatch avec Tracer, Widowmaker, Soldier 76, D.Va. Héros FPS Blizzard en LEGO. Parfait pour les gamers!";
fr.themes.descriptions["Minecraft Dungeons"] = "Exploration de donjons Minecraft! Héros avec armures contre mobs. Basé sur l'action-RPG. Parfait pour les fans!";
fr.themes.descriptions["Forma"] = "LEGO® Forma est une série expérimentale pour adultes avec sculptures de poissons mécaniques. Mouvements organiques. Parfait pour les designers!";
fr.themes.descriptions["LEGO Art"] = "LEGO® Art mosaïques pour adultes: Star Wars, Marvel, Beatles, Warhol. Art mural de milliers de pièces. Parfait pour les collectionneurs!";
fr.themes.descriptions["LEGO Super Mario"] = "C'est moi, Mario! Sets LEGO® Super Mario interactifs avec figurines électroniques. Collectez pièces, battez Bowser. Parfait pour les fans Nintendo!";
fr.themes.descriptions["LEGO Luigi"] = "C'est Luigi! Luigi's Mansion avec figurine Luigi électronique. Chasse aux fantômes et pièces. Parfait pour les fans!";
fr.themes.descriptions["Brickheadz"] = "LEGO® Brickheadz sont des figurines cubiques d'icônes pop: Marvel, Star Wars, Disney. Têtes stylisées à collectionner. Parfait pour les fans!";
fr.themes.descriptions["VIDIYO"] = "LEGO® VIDIYO combine LEGO et vidéos musicales! Minifigurines avec app AR pour créer des clips. BeatBits et scènes. Parfait pour les fans de musique!";
fr.themes.descriptions["Dots"] = "LEGO® Dots sont des sets créatifs: bracelets, cadres, boîtes avec tuiles colorées. Personnalisation infinie. Parfait pour les designers!";
fr.themes.descriptions["BOOST"] = "LEGO® BOOST est un système robotique programmable. Construisez Vernie, Frankie le chat, M.T.R.4. Programmation par app. Parfait pour l'apprentissage STEM!";
fr.themes.descriptions["Powered UP"] = "LEGO® Powered UP est le système moderne de moteurs Smart Hub. Moteurs Bluetooth, lumières, capteurs. Parfait pour les techniciens!";
fr.themes.descriptions["Mindstorms"] = "LEGO® Mindstorms est le système robotique programmable ultime. Construisez et codez des robots complexes. Parfait pour les passionnés STEM!";
fr.themes.descriptions["Education"] = "LEGO® Education offre des outils d'apprentissage: WeDo, Spike Prime, Mindstorms. Programmes STEM. Parfait pour les éducateurs!";
fr.themes.descriptions["SERIOUS PLAY"] = "LEGO® SERIOUS PLAY est une méthode de facilitation pour entreprises. Ateliers d'innovation avec kits LEGO. Parfait pour le team building!";
fr.themes.descriptions["LEGO House"] = "LEGO® House à Billund, Danemark. Minifigurines et sets exclusifs disponibles uniquement là-bas. Parfait pour les pèlerins LEGO!";
fr.themes.descriptions["BrickLink Designer Program"] = "Sets designés par des fans produits via vote communautaire. Designs exclusifs sur BrickLink. Parfait pour la créativité collaborative!";

// Spanish
es.themes.descriptions["Teenage Mutant Ninja Turtles"] = "¡Cowabunga! LEGO® TMNT con Leonardo, Donatello, Michelangelo y Raphael contra Shredder y Foot Clan. Tortugas ninja con Maestro Splinter. ¡Perfecto para fans!";
es.themes.descriptions["Toy Story"] = "¡Hasta el infinito y más allá! LEGO® Toy Story con Woody, Buzz, Jessie y los juguetes de Andy. Rex, Hamm, Slinky Dog. ¡Perfecto para fans de Pixar!";
es.themes.descriptions["The LEGO Movie"] = "¡Todo es genial! Emmet, Wyldstyle, Batman, Unikitty del LEGO Movie! Master Builders vs Lord Business. ¡Perfecto para fans!";
es.themes.descriptions["The LEGO Batman Movie"] = "¡Solo trabajo en negro... y a veces en gris muy muy oscuro! Batman, Robin, Batgirl vs Joker. ¡Perfecto para fans!";
es.themes.descriptions["Overwatch"] = "¡Los héroes nunca mueren! LEGO® Overwatch con Tracer, Widowmaker, Soldier 76, D.Va. Héroes FPS de Blizzard en LEGO. ¡Perfecto para gamers!";
es.themes.descriptions["Minecraft Dungeons"] = "¡Exploración de mazmorras Minecraft! Héroes con armaduras contra mobs. Basado en el action-RPG. ¡Perfecto para fans!";
es.themes.descriptions["Forma"] = "LEGO® Forma es una serie experimental para adultos con esculturas de peces mecánicos. Movimientos orgánicos. ¡Perfecto para diseñadores!";
es.themes.descriptions["LEGO Art"] = "LEGO® Art mosaicos para adultos: Star Wars, Marvel, Beatles, Warhol. Arte mural de miles de piezas. ¡Perfecto para coleccionistas!";
es.themes.descriptions["LEGO Super Mario"] = "¡Soy yo, Mario! Sets LEGO® Super Mario interactivos con figuras electrónicas. Colecciona monedas, derrota a Bowser. ¡Perfecto para fans de Nintendo!";
es.themes.descriptions["LEGO Luigi"] = "¡Es Luigi! Luigi's Mansion con figura Luigi electrónica. Caza fantasmas y monedas. ¡Perfecto para fans!";
es.themes.descriptions["Brickheadz"] = "LEGO® Brickheadz son figuras cúbicas de íconos pop: Marvel, Star Wars, Disney. Cabezas estilizadas coleccionables. ¡Perfecto para fans!";
es.themes.descriptions["VIDIYO"] = "LEGO® VIDIYO combina LEGO y videos musicales! Minifiguras con app AR para crear clips. BeatBits y escenarios. ¡Perfecto para fans de música!";
es.themes.descriptions["Dots"] = "LEGO® Dots son sets creativos: pulseras, marcos, cajas con baldosas coloridas. Personalización infinita. ¡Perfecto para diseñadores!";
es.themes.descriptions["BOOST"] = "LEGO® BOOST es un sistema robótico programable. Construye Vernie, Frankie el gato, M.T.R.4. Programación por app. ¡Perfecto para aprendizaje STEM!";
es.themes.descriptions["Powered UP"] = "LEGO® Powered UP es el sistema moderno de motores Smart Hub. Motores Bluetooth, luces, sensores. ¡Perfecto para técnicos!";
es.themes.descriptions["Mindstorms"] = "LEGO® Mindstorms es el sistema robótico programable definitivo. Construye y codifica robots complejos. ¡Perfecto para entusiastas STEM!";
es.themes.descriptions["Education"] = "LEGO® Education ofrece herramientas de aprendizaje: WeDo, Spike Prime, Mindstorms. Programas STEM. ¡Perfecto para educadores!";
es.themes.descriptions["SERIOUS PLAY"] = "LEGO® SERIOUS PLAY es un método de facilitación para empresas. Talleres de innovación con kits LEGO. ¡Perfecto para team building!";
es.themes.descriptions["LEGO House"] = "LEGO® House en Billund, Dinamarca. Minifiguras y sets exclusivos solo disponibles allí. ¡Perfecto para peregrinos LEGO!";
es.themes.descriptions["BrickLink Designer Program"] = "Sets diseñados por fans producidos por votación comunitaria. Diseños exclusivos en BrickLink. ¡Perfecto para creatividad colaborativa!";

fs.writeFileSync(path.join(__dirname, '../locales/de.json'), JSON.stringify(de, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../locales/fr.json'), JSON.stringify(fr, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../locales/es.json'), JSON.stringify(es, null, 2), 'utf8');

console.log('✅ Batch 5 complete: 20 themes');
console.log('📊 Progress: 68/179 themes = 38% complete');
console.log('⏭️  Next: 111 themes remaining');
