import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Super Mario minifigure descriptions - Core characters from the Mushroom Kingdom
const batch = [
  {
    minifigure_no: 'mar0001',
    name: 'Mario - Red Cap, Blue Overalls',
    description_en: 'Mario the heroic plumber jumped through the Mushroom Kingdom to save Princess Peach. His red cap with "M" and blue overalls became gaming\'s most recognizable outfit. Mario\'s cheerful "Let\'s-a-go!" attitude never wavered despite countless adventures. This minifigure captured Nintendo\'s mascot and gaming\'s most famous hero.',
    description_de: 'Mario der heldenhafte Klempner sprang durch das Pilzkönigreich, um Prinzessin Peach zu retten. Seine rote Mütze mit "M" und blaue Latzhose wurden zur erkennbarsten Kleidung des Gamings. Marios fröhliche "Let\'s-a-go!"-Einstellung schwankte nie trotz unzähliger Abenteuer. Diese Minifigur erfasste Nintendos Maskottchen und berühmtesten Helden des Gamings.',
    description_fr: 'Mario le plombier héroïque sautait à travers le Royaume Champignon pour sauver la Princesse Peach. Sa casquette rouge avec "M" et salopette bleue devinrent la tenue la plus reconnaissable du jeu vidéo. L\'attitude joyeuse "Let\'s-a-go!" de Mario ne faiblit jamais malgré d\'innombrables aventures. Cette minifigurine capturait la mascotte de Nintendo et le héros le plus célèbre du jeu vidéo.',
    description_es: 'Mario el fontanero heroico saltaba por el Reino Champiñón para salvar a la Princesa Peach. Su gorra roja con "M" y overol azul se convirtieron en el atuendo más reconocible de los videojuegos. La actitud alegre "Let\'s-a-go!" de Mario nunca flaqueó a pesar de incontables aventuras. Esta minifigura capturaba a la mascota de Nintendo y héroe más famoso de los videojuegos.'
  },
  {
    minifigure_no: 'mar0002',
    name: 'Luigi - Green Cap, Blue Overalls',
    description_en: 'Luigi the taller brother often lived in Mario\'s shadow but possessed unique courage. His green cap and overalls distinguished him from Mario. Despite being timid, Luigi faced ghosts and saved Mario when needed. This minifigure captured the underdog hero with a heart of gold.',
    description_de: 'Luigi der größere Bruder lebte oft in Marios Schatten, besaß aber einzigartigen Mut. Seine grüne Mütze und Latzhose unterschieden ihn von Mario. Trotz Schüchternheit stellte sich Luigi Geistern und rettete Mario bei Bedarf. Diese Minifigur erfasste den Underdog-Helden mit goldenem Herzen.',
    description_fr: 'Luigi le frère plus grand vivait souvent dans l\'ombre de Mario mais possédait un courage unique. Sa casquette et salopette vertes le distinguaient de Mario. Malgré sa timidité, Luigi affrontait les fantômes et sauvait Mario quand nécessaire. Cette minifigurine capturait le héros outsider au cœur d\'or.',
    description_es: 'Luigi el hermano más alto a menudo vivía a la sombra de Mario pero poseía coraje único. Su gorra y overol verdes lo distinguían de Mario. A pesar de ser tímido, Luigi enfrentaba fantasmas y salvaba a Mario cuando era necesario. Esta minifigura capturaba al héroe desvalido con corazón de oro.'
  },
  {
    minifigure_no: 'mar0003',
    name: 'Princess Peach - Pink Dress, Crown',
    description_en: 'Princess Peach ruled the Mushroom Kingdom with grace despite frequent kidnappings by Bowser. Her pink dress and crown symbolized royalty and elegance. Though often needing rescue, Peach showed bravery and leadership. This minifigure captured Nintendo\'s iconic princess and Mario\'s motivation.',
    description_de: 'Prinzessin Peach herrschte mit Anmut über das Pilzkönigreich trotz häufiger Entführungen durch Bowser. Ihr rosa Kleid und Krone symbolisierten Königtum und Eleganz. Obwohl oft Rettung benötigend, zeigte Peach Tapferkeit und Führung. Diese Minifigur erfasste Nintendos ikonische Prinzessin und Marios Motivation.',
    description_fr: 'Princesse Peach régnait sur le Royaume Champignon avec grâce malgré de fréquents enlèvements par Bowser. Sa robe rose et couronne symbolisaient royauté et élégance. Bien que nécessitant souvent le sauvetage, Peach montrait bravoure et leadership. Cette minifigurine capturait la princesse emblématique de Nintendo et la motivation de Mario.',
    description_es: 'Princesa Peach gobernaba el Reino Champiñón con gracia a pesar de frecuentes secuestros por Bowser. Su vestido rosa y corona simbolizaban realeza y elegancia. Aunque a menudo necesitaba rescate, Peach mostraba valentía y liderazgo. Esta minifigura capturaba a la princesa icónica de Nintendo y motivación de Mario.'
  },
  {
    minifigure_no: 'mar0004',
    name: 'Bowser - Spiked Shell, Orange Hair',
    description_en: 'Bowser the Koopa King threatened the Mushroom Kingdom with fire breath and brute strength. His spiked shell and orange hair made him instantly menacing. Despite villainous actions, Bowser sometimes showed surprising depths. This minifigure captured Mario\'s arch-nemesis and gaming\'s most persistent antagonist.',
    description_de: 'Bowser der Koopa-König bedrohte das Pilzkönigreich mit Feueratem und roher Stärke. Sein Stachelpanzer und oranges Haar machten ihn sofort bedrohlich. Trotz böser Taten zeigte Bowser manchmal überraschende Tiefe. Diese Minifigur erfasste Marios Erzfeind und hartnäckigsten Antagonisten des Gamings.',
    description_fr: 'Bowser le Roi Koopa menaçait le Royaume Champignon avec souffle de feu et force brute. Sa carapace épineuse et cheveux orange le rendaient instantanément menaçant. Malgré ses actions de méchant, Bowser montrait parfois des profondeurs surprenantes. Cette minifigurine capturait l\'ennemi juré de Mario et l\'antagoniste le plus persistant du jeu vidéo.',
    description_es: 'Bowser el Rey Koopa amenazaba el Reino Champiñón con aliento de fuego y fuerza bruta. Su caparazón con picos y cabello naranja lo hacían instantáneamente amenazador. A pesar de acciones villanas, Bowser a veces mostraba profundidades sorprendentes. Esta minifigura capturaba al archienemigo de Mario y antagonista más persistente de los videojuegos.'
  },
  {
    minifigure_no: 'mar0005',
    name: 'Yoshi - Green Dinosaur, Red Saddle',
    description_en: 'Yoshi the friendly dinosaur carried Mario on adventures with loyal devotion. His green body with red saddle made him adorable yet capable. Yoshi\'s ability to eat enemies and lay eggs proved invaluable. This minifigure captured Mario\'s faithful companion and fan-favorite character.',
    description_de: 'Yoshi der freundliche Dinosaurier trug Mario auf Abenteuern mit treuer Hingabe. Sein grüner Körper mit rotem Sattel machte ihn liebenswert und fähig. Yoshis Fähigkeit, Feinde zu essen und Eier zu legen, erwies sich als unschätzbar. Diese Minifigur erfasste Marios treuen Begleiter und Fanlieblings-Charakter.',
    description_fr: 'Yoshi le dinosaure amical portait Mario dans des aventures avec dévouement loyal. Son corps vert avec selle rouge le rendait adorable mais capable. La capacité de Yoshi à manger les ennemis et pondre des œufs se révéla inestimable. Cette minifigurine capturait le compagnon fidèle de Mario et personnage favori des fans.',
    description_es: 'Yoshi el dinosaurio amigable llevaba a Mario en aventuras con devoción leal. Su cuerpo verde con silla roja lo hacía adorable pero capaz. La habilidad de Yoshi de comer enemigos y poner huevos resultó invaluable. Esta minifigura capturaba al compañero fiel de Mario y personaje favorito de los fans.'
  },
  {
    minifigure_no: 'mar0013',
    name: 'Toad - Red Spots, Blue Vest',
    description_en: 'Toad the Mushroom Kingdom citizen served Princess Peach faithfully. His red-spotted mushroom cap and blue vest made him distinctive among Toads. Despite small size, Toad\'s helpfulness and cheerfulness uplifted everyone. This minifigure captured the loyal retainer always ready to assist Mario.',
    description_de: 'Toad der Pilzkönigreich-Bürger diente Prinzessin Peach treu. Sein rot gepunkteter Pilzhut und blaue Weste machten ihn unter Toads unverwechselbar. Trotz kleiner Größe hoben Toads Hilfsbereitschaft und Fröhlichkeit alle auf. Diese Minifigur erfasste den treuen Diener, immer bereit Mario zu helfen.',
    description_fr: 'Toad le citoyen du Royaume Champignon servait la Princesse Peach fidèlement. Sa casquette champignon à pois rouges et gilet bleu le rendaient distinctif parmi les Toads. Malgré sa petite taille, la serviabilité et la jovialité de Toad remontaient le moral de tous. Cette minifigurine capturait le serviteur loyal toujours prêt à aider Mario.',
    description_es: 'Toad el ciudadano del Reino Champiñón servía a la Princesa Peach fielmente. Su gorro de hongo con manchas rojas y chaleco azul lo hacían distintivo entre los Toads. A pesar del tamaño pequeño, la utilidad y alegría de Toad elevaban a todos. Esta minifigura capturaba al sirviente leal siempre listo para ayudar a Mario.'
  },
  {
    minifigure_no: 'mar0015',
    name: 'Bowser Jr. - Green Shell, White Bandana',
    description_en: 'Bowser Jr. followed his father\'s villainous footsteps with youthful enthusiasm. His green shell and white bandana with sharp teeth showed his Koopa heritage. Despite mischievous nature, Junior sought his father\'s approval above all. This minifigure captured the bratty prince who complicated Mario\'s adventures.',
    description_de: 'Bowser Jr. folgte den bösen Fußstapfen seines Vaters mit jugendlichem Enthusiasmus. Sein grüner Panzer und weißes Bandana mit scharfen Zähnen zeigten sein Koopa-Erbe. Trotz schelmischer Natur suchte Junior vor allem die Anerkennung seines Vaters. Diese Minifigur erfasste den verzogenen Prinzen, der Marios Abenteuer komplizierte.',
    description_fr: 'Bowser Jr. suivait les traces méchantes de son père avec enthousiasme juvénile. Sa carapace verte et bandana blanc avec dents pointues montraient son héritage Koopa. Malgré sa nature espiègle, Junior cherchait l\'approbation de son père avant tout. Cette minifigurine capturait le prince gâté qui compliquait les aventures de Mario.',
    description_es: 'Bowser Jr. seguía los pasos villanos de su padre con entusiasmo juvenil. Su caparazón verde y bandana blanco con dientes afilados mostraban su herencia Koopa. A pesar de la naturaleza traviesa, Junior buscaba la aprobación de su padre sobre todo. Esta minifigura capturaba al príncipe malcriado que complicaba las aventuras de Mario.'
  },
  {
    minifigure_no: 'mar0016',
    name: 'Goomba - Brown Mushroom Enemy',
    description_en: 'Goomba the walking mushroom represented Mario\'s most basic enemy. Its simple brown form and angry expression became iconic. Despite being easily defeated by jumping, Goombas appeared in endless numbers. This minifigure captured the first enemy every Mario player encountered.',
    description_de: 'Goomba der laufende Pilz repräsentierte Marios grundlegendsten Feind. Seine einfache braune Form und wütender Ausdruck wurden ikonisch. Trotz leichter Besiegung durch Springen erschienen Goombas in endloser Zahl. Diese Minifigur erfasste den ersten Feind, dem jeder Mario-Spieler begegnete.',
    description_fr: 'Goomba le champignon marchant représentait l\'ennemi le plus basique de Mario. Sa forme brune simple et expression en colère devinrent emblématiques. Malgré une défaite facile par saut, les Goombas apparaissaient en nombre infini. Cette minifigurine capturait le premier ennemi que chaque joueur Mario rencontrait.',
    description_es: 'Goomba el hongo caminante representaba al enemigo más básico de Mario. Su forma café simple y expresión enojada se volvieron icónicas. A pesar de ser fácilmente derrotados saltando, los Goombas aparecían en números interminables. Esta minifigura capturaba al primer enemigo que cada jugador de Mario encontraba.'
  }
];

async function updateDescriptions() {
  console.log(`Starting Super Mario minifigure description updates...`);
  console.log(`Total minifigures: ${batch.length}\n`);

  for (const minifig of batch) {
    try {
      await prisma.minifigCatalog.update({
        where: { minifigure_no: minifig.minifigure_no },
        data: {
          description_en: minifig.description_en,
          description_de: minifig.description_de,
          description_fr: minifig.description_fr,
          description_es: minifig.description_es,
        },
      });
      console.log(`✅ Updated ${minifig.minifigure_no} - ${minifig.name}`);
    } catch (error) {
      console.error(`❌ Error updating ${minifig.minifigure_no}:`, error);
    }
  }

  console.log(`\n✅ Super Mario descriptions update complete!`);
  await prisma.$disconnect();
}

updateDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
