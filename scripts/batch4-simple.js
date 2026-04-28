const fs = require('fs');
const path = require('path');

// Batch 4: Load from batch2 to avoid quote issues  
const de = require('../locales/de.json');
const fr = require('../locales/fr.json');
const es = require('../locales/es.json');

// Simpler approach - write directly
de.themes.descriptions["Stranger Things"] = "Willkommen in Hawkins, Indiana mit LEGO® Stranger Things Minifiguren! Diese Kollektion bringt die 1980er Jahre zum Leben mit Eleven, Mike, Dustin, Lucas, Will und Max. Treffen Sie Chief Hopper, Joyce Byers und kämpfen Sie gegen den Demogorgon aus dem Upside Down. Bauen Sie das Byers Haus mit der berühmten Lichterketten-Wand. Perfekt für Stranger Things-Fans!";

de.themes.descriptions["The Simpsons"] = "D'oh! Willkommen in Springfield mit LEGO® The Simpsons! Homer, Marge, Bart, Lisa und Maggie in LEGO-Form. Entdecken Sie Mr. Burns, Ned Flanders, Apu und das legendäre Simpsons-Haus (742 Evergreen Terrace). Perfekt für Sitcom-Fans!";

de.themes.descriptions["Scooby-Doo"] = "Zoinks! LEGO® Scooby-Doo bringt Mystery Inc. in LEGO-Form! Scooby, Shaggy, Fred, Daphne und Velma lösen Mysterien. Bauen Sie das Mystery Machine und jagen Sie Schurken mit abnehmbaren Masken. Perfekt für Mystery-Solver!";

de.themes.descriptions["Speed Champions"] = "Start your engines! LEGO® Speed Champions feiert echte Rennfahrer und Top-Marken: Ferrari, Porsche, McLaren, Lamborghini. Authentische Rennanzüge und detaillierte Autos. Perfekt für Autoliebhaber!";

de.themes.descriptions["Legends of Chima"] = "For Chima! Anthropomorphe Tierkrieger kämpfen um die CHI-Energie. Lion, Eagle, Gorilla, Crocodile und Wolf Tribes mit Speedorz Battle-Bikes. Perfekt für Fantasy-Fans!";

de.themes.descriptions["Ultra Agents"] = "Mission accepted! Elite-Agenten gegen Superschurken! Agent Fury, Phoenix, Blaze kämpfen gegen AntiMatter, Tremor und Psyclone. Futuristische Action! Perfekt für Action-Fans!";

de.themes.descriptions["Monster Fighters"] = "The monsters are coming! Jäger gegen Universal Monsters. Dr. Rathbone und Team bekämpfen Lord Vampyre, Zombies und Werwölfe in Gothic-Horror-Settings. Perfekt für Horror-Fans!";

de.themes.descriptions["Pharaoh's Quest"] = "Uncover ancient secrets! Abenteurer stoppen den bösen Pharao Amset-Ra in Ägypten. Mumien, Anubis-Wächter und Pyramiden-Schätze. Perfekt für Ägypten-Fans!";

de.themes.descriptions["Atlantis"] = "Dive deep! Unterwasserforscher suchen die verlorene Stadt Atlantis. Kämpfen Sie gegen Manta Warriors, Squid Warriors und den Portal Emperor. Perfekt für Unterwasser-Fans!";

de.themes.descriptions["Power Miners"] = "Dig deep! Bergleute sammeln Energiekristalle und bekämpfen Rock Monsters unter der Erde. Gigantische Bohrfahrzeuge und Lava-Höhlen. Perfekt für Bergbau-Fans!";

de.themes.descriptions["Dino"] = "Prehistoric danger! Elite-Jäger fangen aggressive Dinosaurier: T-Rex, Raptoren, Pteranodons. Moderne Militär-Ausrüstung trifft prähistorische Gefahr. Perfekt für Dino-Fans!";

de.themes.descriptions["Agents"] = "Top secret! Elite-Spione gegen Dr. Inferno's kriminelle Organisation. Agent Chase und Team mit futuristischen Gadgets und Verfolgungsjagden. Perfekt für Spion-Fans!";

de.themes.descriptions["Alien Conquest"] = "They're here! Earth Defense Force gegen Alien-Invasion. Menschen gegen insektenartige Aliens mit UFOs und Traktorstrahlen. Retro Sci-Fi! Perfekt für Alien-Fans!";

de.themes.descriptions["Galaxy Squad"] = "Exterminate the bugs! Space Marines gegen biomechanische Alien-Insekten. Orange, Blue, Green und Red Teams mit Mech-Anzügen. Perfekt für Sci-Fi-Action-Fans!";

de.themes.descriptions["Hidden Side"] = "See the unseen! Augmented Reality Geisterjagd! Jack und Parker bekämpfen Lady E mit Smartphone-App. Scan LEGO-Sets und jagen Sie digitale Geister! Perfekt für Tech-Fans!";

// French
fr.themes.descriptions["Stranger Things"] = "Bienvenue à Hawkins, Indiana avec LEGO® Stranger Things! Eleven, Mike, Dustin et la lutte contre le Demogorgon. Construisez la maison Byers avec le mur d'alphabet lumineux. Parfait pour les fans!";

fr.themes.descriptions["The Simpsons"] = "D'oh! Springfield avec Homer, Marge, Bart, Lisa et Maggie. La maison des Simpson, Moe's Tavern et le Kwik-E-Mart. Parfait pour les fans de sitcom!";

fr.themes.descriptions["Scooby-Doo"] = "Zoinks! Mystery Inc. en briques! Scooby, Shaggy, Fred, Daphne et Velma résolvent des mystères. Le Mystery Machine et méchants masqués. Parfait pour les résolveurs!";

fr.themes.descriptions["Speed Champions"] = "Démarrez vos moteurs! Pilotes et marques: Ferrari, Porsche, McLaren, Lamborghini. Voitures détaillées et combinaisons authentiques. Parfait pour les amateurs!";

fr.themes.descriptions["Legends of Chima"] = "Pour Chima! Guerriers animaux pour l'énergie CHI. Tribus Lion, Eagle, Gorilla, Crocodile et Wolf avec Speedorz. Parfait pour les fans de fantasy!";

fr.themes.descriptions["Ultra Agents"] = "Mission acceptée! Agents d'élite contre super-méchants. Jack Fury, Phoenix et Blaze contre AntiMatter. Action futuriste! Parfait pour les fans!";

fr.themes.descriptions["Monster Fighters"] = "Les monstres arrivent! Chasseurs contre monstres Universal. Dr. Rathbone contre vampires et zombies. Horreur gothique! Parfait pour les fans!";

fr.themes.descriptions["Pharaoh's Quest"] = "Secrets anciens! Aventuriers contre le pharaon Amset-Ra. Momies, gardiennes Anubis et pyramides. Parfait pour les fans d'Égypte!";

fr.themes.descriptions["Atlantis"] = "Plongez profond! Explorateurs cherchent Atlantis. Combat contre Manta Warriors et Portal Emperor. Parfait pour les fans sous-marins!";

fr.themes.descriptions["Power Miners"] = "Creusez profond! Mineurs vs Rock Monsters. Collecte de cristaux et véhicules géants. Parfait pour les fans de minage!";

fr.themes.descriptions["Dino"] = "Danger préhistorique! Chasseurs contre dinosaures. T-Rex, Raptors et équipement militaire. Parfait pour les fans de dinosaures!";

fr.themes.descriptions["Agents"] = "Top secret! Espions contre Dr. Inferno. Agent Chase avec gadgets futuristes. Parfait pour les fans d'espions!";

fr.themes.descriptions["Alien Conquest"] = "Ils sont là! Défense terrestre contre invasion alien. Humains vs aliens insectoïdes. Sci-fi rétro! Parfait pour les fans!";

fr.themes.descriptions["Galaxy Squad"] = "Exterminez les insectes! Marines spatiaux vs bugs aliens. Teams avec mechs. Parfait pour les fans sci-fi!";

fr.themes.descriptions["Hidden Side"] = "Voyez l'invisible! Chasse aux fantômes en AR! Jack et Parker vs Lady E avec app smartphone. Scannez et chassez! Parfait pour les fans!";

// Spanish
es.themes.descriptions["Stranger Things"] = "¡Bienvenido a Hawkins, Indiana con LEGO® Stranger Things! Eleven, Mike, Dustin y la lucha contra el Demogorgon. Construye la casa Byers con la pared de alfabeto luminoso. ¡Perfecto para fans!";

es.themes.descriptions["The Simpsons"] = "¡D'oh! Springfield con Homer, Marge, Bart, Lisa y Maggie. La casa de los Simpson, Moe's Tavern y Kwik-E-Mart. ¡Perfecto para fans de sitcom!";

es.themes.descriptions["Scooby-Doo"] = "¡Zoinks! ¡Mystery Inc. en ladrillos! Scooby, Shaggy, Fred, Daphne y Velma resuelven misterios. El Mystery Machine y villanos enmascarados. ¡Perfecto para resolutores!";

es.themes.descriptions["Speed Champions"] = "¡Arranquen motores! Pilotos y marcas: Ferrari, Porsche, McLaren, Lamborghini. Autos detallados y trajes auténticos. ¡Perfecto para amantes!";

es.themes.descriptions["Legends of Chima"] = "¡Por Chima! Guerreros animales por energía CHI. Tribus Lion, Eagle, Gorilla, Crocodile y Wolf con Speedorz. ¡Perfecto para fans de fantasía!";

es.themes.descriptions["Ultra Agents"] = "¡Misión aceptada! Agentes de élite contra supervillanos. Jack Fury, Phoenix y Blaze contra AntiMatter. ¡Acción futurista! ¡Perfecto para fans!";

es.themes.descriptions["Monster Fighters"] = "¡Los monstruos vienen! Cazadores contra monstruos Universal. Dr. Rathbone contra vampiros y zombies. ¡Horror gótico! ¡Perfecto para fans!";

es.themes.descriptions["Pharaoh's Quest"] = "¡Secretos antiguos! Aventureros contra el faraón Amset-Ra. Momias, guardias Anubis y pirámides. ¡Perfecto para fans de Egipto!";

es.themes.descriptions["Atlantis"] = "¡Sumérgete profundo! Exploradores buscan Atlantis. Combate contra Manta Warriors y Portal Emperor. ¡Perfecto para fans submarinos!";

es.themes.descriptions["Power Miners"] = "¡Cava profundo! Mineros vs Rock Monsters. Recolección de cristales y vehículos gigantes. ¡Perfecto para fans de minería!";

es.themes.descriptions["Dino"] = "¡Peligro prehistórico! Cazadores contra dinosaurios. T-Rex, Raptors y equipo militar. ¡Perfecto para fans de dinosaurios!";

es.themes.descriptions["Agents"] = "¡Alto secreto! Espías contra Dr. Inferno. Agent Chase con gadgets futuristas. ¡Perfecto para fans de espías!";

es.themes.descriptions["Alien Conquest"] = "¡Están aquí! Defensa terrestre contra invasión alien. Humanos vs aliens insectoides. ¡Sci-fi retro! ¡Perfecto para fans!";

es.themes.descriptions["Galaxy Squad"] = "¡Exterminen insectos! Marines espaciales vs bugs aliens. Teams con mechs. ¡Perfecto para fans sci-fi!";

es.themes.descriptions["Hidden Side"] = "¡Ve lo invisible! ¡Caza de fantasmas en AR! Jack y Parker vs Lady E con app smartphone. ¡Escanea y caza! ¡Perfecto para fans!";

fs.writeFileSync(path.join(__dirname, '../locales/de.json'), JSON.stringify(de, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../locales/fr.json'), JSON.stringify(fr, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../locales/es.json'), JSON.stringify(es, null, 2), 'utf8');

console.log('✅ Batch 4 complete: 15 themes (simplified)');
console.log('📊 Progress: 48/179 themes = 27% complete');
console.log('⏭️  Next: 131 themes remaining');
