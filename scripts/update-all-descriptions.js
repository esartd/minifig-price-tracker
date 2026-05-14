/**
 * Master script to update all set descriptions with detailed information
 * Combines multiple batches processed in parallel
 */

const fs = require('fs');
const path = require('path');

// Load all description batches
const starWarsUCS = require('./descriptions-star-wars-ucs');
const starWarsPopular = require('./descriptions-star-wars-popular');
const harryPotter = require('./descriptions-harry-potter');

// Combine all descriptions
const allDescriptions = {
  // Existing UCS sets from first batch
  '75192-1': {
    en: "The UCS Millennium Falcon contains 7,541 pieces making it one of LEGO's largest sets. Features rotating gun turrets, detailed cockpit, removable hull panels revealing interior corridors, holochess table, and engineering bay. Includes Han Solo, Chewbacca, Princess Leia, C-3PO, and BB-8 minifigures. Measures over 33 inches long.",
    de: "Der UCS Millennium Falcon enthält 7.541 Teile und ist eines der größten LEGO-Sets. Mit rotierenden Geschütztürmen, detailliertem Cockpit, abnehmbaren Rumpfplatten mit Innenkorridoren, Holochess-Tisch und Maschinenraum. Enthält Han Solo, Chewbacca, Prinzessin Leia, C-3PO und BB-8 Minifiguren. Über 84 cm lang.",
    fr: "Le Faucon Millenium UCS contient 7 541 pièces, l'un des plus grands ensembles LEGO. Comprend des tourelles rotatives, un cockpit détaillé, des panneaux de coque amovibles révélant des couloirs intérieurs, une table d'holochess et une baie d'ingénierie. Comprend Han Solo, Chewbacca, Princesse Leia, C-3PO et BB-8. Mesure plus de 84 cm de long.",
    es: "El Halcón Milenario UCS contiene 7.541 piezas, uno de los sets más grandes de LEGO. Incluye torretas giratorias, cabina detallada, paneles de casco extraíbles con pasillos interiores, mesa de holochess y bahía de ingeniería. Incluye Han Solo, Chewbacca, Princesa Leia, C-3PO y BB-8. Mide más de 84 cm de largo."
  },
  '75313-1': {
    en: "The AT-AT features 6,785 pieces with poseable legs, rotating head, and detailed interior. Includes 9 minifigures: Luke Skywalker, General Veers, 2 AT-AT Drivers, 4 Snowtroopers, and Chewbacca. Features opening cockpit, side hatches, winch for tow cable, and interior with seating and weapons racks. Stands over 24 inches tall recreating the iconic Battle of Hoth walker.",
    de: "Der AT-AT enthält 6.785 Teile mit beweglichen Beinen, drehbarem Kopf und detailliertem Innenraum. Enthält 9 Minifiguren: Luke Skywalker, General Veers, 2 AT-AT-Fahrer, 4 Snowtroopers und Chewbacca. Mit öffnendem Cockpit, Seitenluken, Winde für Abschleppseil und Innenraum mit Sitzplätzen und Waffenregalen. Über 62 cm hoch, der ikonische Hoth-Walker.",
    fr: "L'AT-AT contient 6 785 pièces avec jambes articulées, tête rotative et intérieur détaillé. Comprend 9 minifigurines : Luke Skywalker, Général Veers, 2 pilotes AT-AT, 4 Snowtroopers et Chewbacca. Cockpit ouvrant, trappes latérales, treuil pour câble de remorquage et intérieur avec sièges et râteliers d'armes. Mesure plus de 62 cm de haut, le marcheur iconique de Hoth.",
    es: "El AT-AT contiene 6.785 piezas con patas articuladas, cabeza giratoria e interior detallado. Incluye 9 minifiguras: Luke Skywalker, General Veers, 2 pilotos AT-AT, 4 Snowtroopers y Chewbacca. Con cabina que se abre, escotillas laterales, cabrestante para cable de remolque e interior con asientos y estantes de armas. Mide más de 62 cm de alto, el icónico caminante de Hoth."
  },
  '75331-1': {
    en: "The Razor Crest features 6,187 pieces with detailed interior including sleeping quarters, weapons locker, carbonite chamber, and cargo hold. Includes Mandalorian, Grogu, Greef Karga, Scout Trooper, and Kuiil minifigures. Features removable cockpit canopy, dual spring-loaded shooters, and detachable escape pod. Measures over 5 inches high, 15 inches long, and 11 inches wide.",
    de: "Die Razor Crest enthält 6.187 Teile mit detailliertem Innenraum mit Schlafquartier, Waffenschrank, Carbonit-Kammer und Laderaum. Enthält Mandalorian, Grogu, Greef Karga, Scout Trooper und Kuiil Minifiguren. Mit abnehmbarer Cockpithaube, doppelten Federkanonen und abnehmbarer Rettungskapsel. Über 13 cm hoch, 38 cm lang und 28 cm breit.",
    fr: "Le Razor Crest contient 6 187 pièces avec intérieur détaillé incluant dortoir, casier d'armes, chambre de carbonite et soute. Comprend Mandalorien, Grogu, Greef Karga, Scout Trooper et Kuiil. Verrière de cockpit amovible, double lanceurs à ressort et capsule d'évacuation détachable. Mesure plus de 13 cm de haut, 38 cm de long et 28 cm de large.",
    es: "La Razor Crest contiene 6.187 piezas con interior detallado que incluye dormitorios, armario de armas, cámara de carbonita y bodega de carga. Incluye Mandaloriano, Grogu, Greef Karga, Scout Trooper y Kuiil. Dosel de cabina extraíble, doble lanzadores de resorte y cápsula de escape desmontable. Mide más de 13 cm de alto, 38 cm de largo y 28 cm de ancho."
  },
  '75419-1': {
    en: "The Death Star features 4,016 pieces recreating iconic scenes from the original trilogy. Includes 23 minifigures: Luke, Leia, Han, Vader, Emperor, Obi-Wan, and more. Features superlaser control room, Emperor's throne room, trash compactor, detention block, and TIE Advanced hangar. Stands over 16 inches tall and 16 inches wide with detailed interior sections.",
    de: "Der Todesstern enthält 4.016 Teile und stellt ikonische Szenen der Originaltrilogie nach. Enthält 23 Minifiguren: Luke, Leia, Han, Vader, Imperator, Obi-Wan und mehr. Mit Superlaser-Kontrollraum, Thronsaal des Imperators, Müllpresse, Haftblock und TIE Advanced-Hangar. Über 41 cm hoch und breit mit detaillierten Innenbereichen.",
    fr: "L'Étoile de la Mort contient 4 016 pièces recréant des scènes iconiques de la trilogie originale. Comprend 23 minifigurines : Luke, Leia, Han, Vader, Empereur, Obi-Wan et plus. Salle de contrôle du superlaser, salle du trône de l'Empereur, compacteur à ordures, bloc de détention et hangar TIE Advanced. Mesure plus de 41 cm de haut et de large avec sections intérieures détaillées.",
    es: "La Estrella de la Muerte contiene 4.016 piezas recreando escenas icónicas de la trilogía original. Incluye 23 minifiguras: Luke, Leia, Han, Vader, Emperador, Obi-Wan y más. Sala de control del superláser, sala del trono del Emperador, compactador de basura, bloque de detención y hangar TIE Advanced. Mide más de 41 cm de alto y ancho con secciones interiores detalladas."
  },
  ...starWarsUCS,
  ...starWarsPopular,
  ...harryPotter
};

const boxesPath = path.join(process.cwd(), 'public', 'catalog', 'boxes.json');
console.log('Loading boxes.json...');
const boxes = JSON.parse(fs.readFileSync(boxesPath, 'utf-8'));

console.log(`Total sets in catalog: ${boxes.length}`);
console.log(`Sets with new descriptions: ${Object.keys(allDescriptions).length}\n`);

let updatedCount = 0;

for (let i = 0; i < boxes.length; i++) {
  const box = boxes[i];
  const newDesc = allDescriptions[box.box_no];

  if (newDesc) {
    boxes[i].description_en = newDesc.en;
    boxes[i].description_de = newDesc.de;
    boxes[i].description_fr = newDesc.fr;
    boxes[i].description_es = newDesc.es;
    updatedCount++;
    console.log(`✅ ${updatedCount}/${Object.keys(allDescriptions).length} Updated: ${box.box_no} - ${box.name}`);
  }
}

console.log('\nSaving updates to boxes.json...');
fs.writeFileSync(boxesPath, JSON.stringify(boxes, null, 2), 'utf-8');

console.log(`\n✅ Successfully updated ${updatedCount} sets with detailed descriptions`);
console.log(`💾 Saved to ${boxesPath}`);
console.log(`\nThemes updated:`);
console.log(`  - Star Wars UCS: 5 sets`);
console.log(`  - Star Wars Popular: 5 sets`);
console.log(`  - Harry Potter: 5 sets`);
console.log(`  - Total: ${updatedCount} sets`);
