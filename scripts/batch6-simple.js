const fs = require('fs');
const path = require('path');

const de = require('../locales/de.json');
const fr = require('../locales/fr.json');
const es = require('../locales/es.json');

// German
de.themes.descriptions["Indiana Jones"] = "It belongs in a museum! LEGO® Indiana Jones mit Indy, Marion, Short Round auf der Jagd nach verlorenen Artefakten. Kämpfen Sie gegen Nazis und den Tempel des Todes. Perfekt für Abenteuer-Fans!";
de.themes.descriptions["Prince of Persia"] = "LEGO® Prince of Persia basierend auf dem Film. Dastan, Prinzessin Tamina und der Dolch der Zeit in persischen Palästen. Perfekt für Action-Abenteuer-Fans!";
de.themes.descriptions["Lone Ranger"] = "Hi-Yo Silver! LEGO® Lone Ranger mit dem maskierten Ranger, Tonto und Silber gegen Butch Cavendish's Gang im Wilden Westen. Perfekt für Western-Fans!";
de.themes.descriptions["Western"] = "LEGO® Western (1996-2002) Cowboys gegen Banditen im Wilden Westen! Fort Legoredo, Sheriffs, Outlaws und Goldgräber mit Saloons und Eisenbahnen. Perfekt für Wild West-Fans!";
de.themes.descriptions["Adventurers"] = "LEGO® Adventurers: Johnny Thunder und Team auf Schatzsuche! Egypt (1998), Dino Island (2000), Orient Expedition (2003). Mumien, Dinosaurier und Drachen. Perfekt für Abenteurer!";
de.themes.descriptions["Orient Expedition"] = "LEGO® Orient Expedition (2003): Johnny Thunder in China und Indien! Terrakotta-Krieger, mystische Drachen und der böse Lord Sam Sinister. Perfekt für Asien-Abenteurer!";
de.themes.descriptions["Studios"] = "LEGO® Studios: Machen Sie Ihre eigenen Filme mit Steven Spielberg! Film-Sets, Kameras, Regisseure und Action-Szenen. Dinosaurier, Aliens und Stunts. Perfekt für Filmemacher!";
de.themes.descriptions["NBA"] = "LEGO® NBA Basketball mit echten NBA-Spielern als Minifiguren! Courts, Arenas und Basketball-Action. Offizielle NBA-Lizenz (2002-2004). Perfekt für Basketball-Fans!";
de.themes.descriptions["NFL"] = "LEGO® NFL Football mit echten NFL-Teams und Spielern! Stadien, Spielfeldern und Football-Action. Offizielle NFL-Lizenz (2002). Perfekt für Football-Fans!";
de.themes.descriptions["FIFA"] = "LEGO® FIFA Fußball mit Spielern, Stadien und Pokalsieger-Szenen! Offizielle FIFA World Cup-Sets. Perfekt für Fußball-Fans weltweit!";
de.themes.descriptions["Racers"] = "LEGO® Racers: High-Speed Rennwagen, Motorräder und Stunt-Fahrzeuge! Ferrari, Williams F1 und Desert-Racers. Speed und Action seit 2001. Perfekt für Speed-Fans!";
de.themes.descriptions["World Racers"] = "LEGO® World Racers (2010): Renn-Teams reisen um die Welt! Wüsten, Dschungel, Arktis und Großstädte. Team Backyard vs Team Xtreme. Perfekt für Weltrennen-Fans!";
de.themes.descriptions["Dino Island"] = "LEGO® Dino Island (2000): Johnny Thunder auf Dinosaurier-Insel! T-Rex, Velociraptoren und Baby-Dinos. Teil der Adventurers-Serie. Perfekt für Dino-Abenteurer!";
de.themes.descriptions["Rock Raiders"] = "LEGO® Rock Raiders (1999-2000): Bergleute gestrandet auf fremdem Planeten sammeln Energiekristalle! Bohrfahrzeuge, Monster und unterirdische Höhlen. Perfekt für Sci-Fi-Bergbau-Fans!";
de.themes.descriptions["Aquazone"] = "LEGO® Aquazone (1995-1998): Unterwasser-Fraktionen kämpfen um Kristalle! Aquanauts, Aquasharks, Aquaraiders und Hydronauts mit U-Booten und Meeresbewohnern. Perfekt für Unterwasser-Action!";
de.themes.descriptions["Time Cruisers"] = "LEGO® Time Cruisers (1996-1997): Zeitreisende in fliegenden Fahrzeugen! Besuchen Sie Piraten, Ritter und Weltraum-Epochen. Professor Millennium und Timmy. Perfekt für Zeitreise-Fans!";
de.themes.descriptions["M:Tron"] = "LEGO® M:Tron (1990-1991): Magnetische Weltraumbergleute in rot/weiß! Magnetkrane, Bergbau-Fahrzeuge und Kristall-Sammler. Teil der Space-Serie. Perfekt für Magnet-Action!";
de.themes.descriptions["Blacktron"] = "LEGO® Blacktron (1987-1991): Böse Weltraum-Piraten in schwarz/gelb (Blacktron I) und schwarz/weiß (Blacktron II)! Gegner der Classic Space. Perfekt für Space-Schurken!";
de.themes.descriptions["Ice Planet 2002"] = "LEGO® Ice Planet 2002 (1993-1994): Arktis-Weltraum-Pioniere in orange/blau mit Kettensägen! Transparente orange Kettensägen sind ikonisch. Perfekt für Eis-Planeten-Fans!";
de.themes.descriptions["Futuron"] = "LEGO® Futuron (1987-1990): Futuristische Weltraum-Forscher in schwarz/gelb/transparent! Monorails, Roboter und High-Tech Basen. Teil der Classic Space-Ära. Perfekt für Retro-Futuristen!";

// French
fr.themes.descriptions["Indiana Jones"] = "Ça a sa place dans un musée! LEGO® Indiana Jones avec Indy, Marion, Short Round chassant des artefacts. Combattez nazis et Temple of Doom. Parfait pour les aventuriers!";
fr.themes.descriptions["Prince of Persia"] = "LEGO® Prince of Persia du film. Dastan, Princesse Tamina et la Dague du Temps dans palais persans. Parfait pour les fans d'action!";
fr.themes.descriptions["Lone Ranger"] = "Hi-Yo Silver! LEGO® Lone Ranger avec le ranger masqué, Tonto et Silver contre le gang de Butch. Parfait pour les fans de western!";
fr.themes.descriptions["Western"] = "LEGO® Western (1996-2002) Cowboys vs bandits au Far West! Fort Legoredo, shérifs, hors-la-loi avec saloons. Parfait pour les fans du Far West!";
fr.themes.descriptions["Adventurers"] = "LEGO® Adventurers: Johnny Thunder chasse aux trésors! Egypt, Dino Island, Orient Expedition. Momies, dinosaures, dragons. Parfait pour les aventuriers!";
fr.themes.descriptions["Orient Expedition"] = "LEGO® Orient Expedition (2003): Johnny Thunder en Chine et Inde! Guerriers terre cuite, dragons mystiques et Lord Sam Sinister. Parfait pour l'aventure asiatique!";
fr.themes.descriptions["Studios"] = "LEGO® Studios: Créez vos films avec Steven Spielberg! Plateaux de tournage, caméras, réalisateurs. Dinosaures, aliens, cascades. Parfait pour les cinéastes!";
fr.themes.descriptions["NBA"] = "LEGO® NBA Basketball avec vrais joueurs NBA! Terrains, arènes et action basket. Licence NBA officielle (2002-2004). Parfait pour les fans!";
fr.themes.descriptions["NFL"] = "LEGO® NFL Football avec vraies équipes NFL! Stades, terrains et action football. Licence NFL officielle (2002). Parfait pour les fans!";
fr.themes.descriptions["FIFA"] = "LEGO® FIFA Football avec joueurs, stades et scènes de coupe! Sets officiels FIFA World Cup. Parfait pour les fans de foot mondiaux!";
fr.themes.descriptions["Racers"] = "LEGO® Racers: Voitures de course haute vitesse, motos et véhicules de cascade! Ferrari, F1 Williams et Desert Racers. Parfait pour la vitesse!";
fr.themes.descriptions["World Racers"] = "LEGO® World Racers (2010): Équipes de course autour du monde! Déserts, jungles, Arctique. Team Backyard vs Team Xtreme. Parfait pour les courses mondiales!";
fr.themes.descriptions["Dino Island"] = "LEGO® Dino Island (2000): Johnny Thunder sur l'île aux dinosaures! T-Rex, Velociraptors et bébés dinos. Série Adventurers. Parfait pour l'aventure dino!";
fr.themes.descriptions["Rock Raiders"] = "LEGO® Rock Raiders (1999-2000): Mineurs bloqués sur planète alien collectent cristaux! Véhicules de forage, monstres. Parfait pour le minage sci-fi!";
fr.themes.descriptions["Aquazone"] = "LEGO® Aquazone (1995-1998): Factions sous-marines pour cristaux! Aquanauts, Aquasharks, Aquaraiders avec sous-marins. Parfait pour l'action sous-marine!";
fr.themes.descriptions["Time Cruisers"] = "LEGO® Time Cruisers (1996-1997): Voyageurs temporels dans véhicules volants! Visitez pirates, chevaliers, espace. Professeur Millennium. Parfait pour le voyage temporel!";
fr.themes.descriptions["M:Tron"] = "LEGO® M:Tron (1990-1991): Mineurs spatiaux magnétiques en rouge/blanc! Grues magnétiques, véhicules miniers. Série Space. Parfait pour l'action magnétique!";
fr.themes.descriptions["Blacktron"] = "LEGO® Blacktron (1987-1991): Pirates spatiaux méchants en noir/jaune (I) et noir/blanc (II)! Ennemis de Classic Space. Parfait pour les méchants spatiaux!";
fr.themes.descriptions["Ice Planet 2002"] = "LEGO® Ice Planet 2002 (1993-1994): Pionniers spatiaux arctiques en orange/bleu avec tronçonneuses! Tronçonneuses orange transparentes iconiques. Parfait pour les fans!";
fr.themes.descriptions["Futuron"] = "LEGO® Futuron (1987-1990): Explorateurs spatiaux futuristes en noir/jaune/transparent! Monorails, robots et bases high-tech. Ère Classic Space. Parfait pour rétro-futuristes!";

// Spanish
es.themes.descriptions["Indiana Jones"] = "¡Pertenece a un museo! LEGO® Indiana Jones con Indy, Marion, Short Round cazando artefactos. Lucha contra nazis y Templo de la Perdición. ¡Perfecto para aventureros!";
es.themes.descriptions["Prince of Persia"] = "LEGO® Prince of Persia de la película. Dastan, Princesa Tamina y la Daga del Tiempo en palacios persas. ¡Perfecto para fans de acción!";
es.themes.descriptions["Lone Ranger"] = "¡Hi-Yo Silver! LEGO® Lone Ranger con el ranger enmascarado, Tonto y Silver contra la banda de Butch. ¡Perfecto para fans del western!";
es.themes.descriptions["Western"] = "LEGO® Western (1996-2002) ¡Cowboys vs bandidos en el Salvaje Oeste! Fort Legoredo, sheriffs, forajidos con saloons. ¡Perfecto para fans del Far West!";
es.themes.descriptions["Adventurers"] = "LEGO® Adventurers: ¡Johnny Thunder caza tesoros! Egypt, Dino Island, Orient Expedition. Momias, dinosaurios, dragones. ¡Perfecto para aventureros!";
es.themes.descriptions["Orient Expedition"] = "LEGO® Orient Expedition (2003): ¡Johnny Thunder en China e India! Guerreros de terracota, dragones místicos y Lord Sam Sinister. ¡Perfecto para aventura asiática!";
es.themes.descriptions["Studios"] = "LEGO® Studios: ¡Crea tus películas con Steven Spielberg! Platós de filmación, cámaras, directores. Dinosaurios, aliens, acrobacias. ¡Perfecto para cineastas!";
es.themes.descriptions["NBA"] = "LEGO® NBA Basketball con jugadores NBA reales! Canchas, arenas y acción basket. Licencia NBA oficial (2002-2004). ¡Perfecto para fans!";
es.themes.descriptions["NFL"] = "LEGO® NFL Football con equipos NFL reales! Estadios, campos y acción football. Licencia NFL oficial (2002). ¡Perfecto para fans!";
es.themes.descriptions["FIFA"] = "LEGO® FIFA Fútbol con jugadores, estadios y escenas de copa! Sets oficiales FIFA World Cup. ¡Perfecto para fans de fútbol mundiales!";
es.themes.descriptions["Racers"] = "LEGO® Racers: Autos de carrera de alta velocidad, motos y vehículos de acrobacia! Ferrari, F1 Williams y Desert Racers. ¡Perfecto para la velocidad!";
es.themes.descriptions["World Racers"] = "LEGO® World Racers (2010): ¡Equipos de carreras alrededor del mundo! Desiertos, junglas, Ártico. Team Backyard vs Team Xtreme. ¡Perfecto para carreras mundiales!";
es.themes.descriptions["Dino Island"] = "LEGO® Dino Island (2000): ¡Johnny Thunder en isla de dinosaurios! T-Rex, Velociraptors y bebés dinos. Serie Adventurers. ¡Perfecto para aventura dino!";
es.themes.descriptions["Rock Raiders"] = "LEGO® Rock Raiders (1999-2000): ¡Mineros atrapados en planeta alien recolectan cristales! Vehículos de perforación, monstruos. ¡Perfecto para minería sci-fi!";
es.themes.descriptions["Aquazone"] = "LEGO® Aquazone (1995-1998): ¡Facciones submarinas por cristales! Aquanauts, Aquasharks, Aquaraiders con submarinos. ¡Perfecto para acción submarina!";
es.themes.descriptions["Time Cruisers"] = "LEGO® Time Cruisers (1996-1997): ¡Viajeros del tiempo en vehículos voladores! Visita piratas, caballeros, espacio. Profesor Millennium. ¡Perfecto para viaje temporal!";
es.themes.descriptions["M:Tron"] = "LEGO® M:Tron (1990-1991): ¡Mineros espaciales magnéticos en rojo/blanco! Grúas magnéticas, vehículos mineros. Serie Space. ¡Perfecto para acción magnética!";
es.themes.descriptions["Blacktron"] = "LEGO® Blacktron (1987-1991): ¡Piratas espaciales malvados en negro/amarillo (I) y negro/blanco (II)! Enemigos de Classic Space. ¡Perfecto para villanos espaciales!";
es.themes.descriptions["Ice Planet 2002"] = "LEGO® Ice Planet 2002 (1993-1994): ¡Pioneros espaciales árticos en naranja/azul con motosierras! Motosierras naranjas transparentes icónicas. ¡Perfecto para fans!";
es.themes.descriptions["Futuron"] = "LEGO® Futuron (1987-1990): ¡Exploradores espaciales futuristas en negro/amarillo/transparente! Monorrieles, robots y bases high-tech. Era Classic Space. ¡Perfecto para retro-futuristas!";

fs.writeFileSync(path.join(__dirname, '../locales/de.json'), JSON.stringify(de, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../locales/fr.json'), JSON.stringify(fr, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, '../locales/es.json'), JSON.stringify(es, null, 2), 'utf8');

console.log('✅ Batch 6 complete: 20 themes');
console.log('📊 Progress: 88/179 themes = 49% complete');
console.log('⏭️  Next: 91 themes remaining - halfway there!');
