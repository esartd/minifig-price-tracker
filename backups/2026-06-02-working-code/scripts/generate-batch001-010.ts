import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'mysql://u493602047_figtracker_use:Legocatelogstuff12345!@srv1777.hstgr.io:3306/u493602047_figtracker'
});

const batch = [
  {
    no: 'sw0002',
    name: 'Boba Fett - Classic Grays',
    en: 'Boba Fett in Classic Grays represents one of the earliest LEGO minifigure versions of the legendary bounty hunter, featuring the original gray and dark gray color scheme before later updates to more screen-accurate greens. This LEGO minifigure captures Boba Fett with gray helmet and armor pieces, blaster rifle accessory, and the iconic T-visor design that made him instantly recognizable. Released in 2000 as part of the original Slave I set 7144, this version represents LEGO\'s first attempt at creating the most popular bounty hunter in Star Wars. The classic gray color scheme and status as an early Boba Fett variant make this minifigure highly valuable for collectors seeking vintage Star Wars LEGO figures and tracking the evolution of character designs.',
    de: 'Boba Fett in Classic Grays repräsentiert eine der frühesten LEGO Minifigur-Versionen des legendären Kopfgeldjägers mit dem ursprünglichen grau-dunkelgrauen Farbschema vor späteren Updates zu bildschirmgenaueren Grüntönen. Diese LEGO Minifigur zeigt Boba Fett mit grauem Helm und Rüstungsteilen, Blastergewehr-Zubehör und dem ikonischen T-Visier-Design, das ihn sofort erkennbar machte. Veröffentlicht 2000 als Teil des ursprünglichen Slave I Sets 7144, repräsentiert diese Version LEGOs ersten Versuch, den beliebtesten Kopfgeldjäger in Star Wars zu erschaffen. Das klassische graue Farbschema und Status als frühe Boba Fett-Variante machen diese Minifigur sehr wertvoll für Sammler, die Vintage-Star Wars-LEGO-Figuren suchen und die Evolution von Charakter-Designs verfolgen.',
    fr: 'Boba Fett en Gris Classiques représente l\'une des premières versions de minifigurine LEGO du légendaire chasseur de primes, présentant le schéma de couleurs gris et gris foncé original avant les mises à jour ultérieures vers des verts plus fidèles à l\'écran. Cette minifigurine LEGO capture Boba Fett avec casque et pièces d\'armure grises, accessoire de fusil blaster et le design emblématique de visière en T qui le rendait instantanément reconnaissable. Sortie en 2000 dans le cadre du set Slave I original 7144, cette version représente la première tentative de LEGO de créer le chasseur de primes le plus populaire de Star Wars. Le schéma de couleurs grises classique et le statut de variante précoce de Boba Fett rendent cette minifigurine très précieuse pour les collectionneurs recherchant des figurines LEGO Star Wars vintage et suivant l\'évolution des designs de personnages.',
    es: 'Boba Fett en Grises Clásicos representa una de las primeras versiones de minifigura LEGO del legendario cazarrecompensas, presentando el esquema de color gris y gris oscuro original antes de actualizaciones posteriores a verdes más precisos a pantalla. Esta minifigura LEGO captura a Boba Fett con casco y piezas de armadura grises, accesorio de rifle bláster y el icónico diseño de visor en T que lo hizo instantáneamente reconocible. Lanzada en 2000 como parte del set Slave I original 7144, esta versión representa el primer intento de LEGO de crear el cazarrecompensas más popular de Star Wars. El esquema de color gris clásico y estatus como variante temprana de Boba Fett hacen de esta minifigura muy valiosa para coleccionistas buscando figuras LEGO Star Wars vintage y rastreando la evolución de diseños de personajes.'
  },
  {
    no: 'sw0003',
    name: 'Darth Maul - Hood and Cape, Sash without Pouch',
    en: 'Darth Maul with Hood and Cape represents the fearsome Sith apprentice in his ceremonial robes, featuring the distinctive black hooded cape and sash without pouch detail. This LEGO minifigure captures Darth Maul\'s menacing appearance with red and black Zabrak facial tattoos, yellow Sith eyes, black robes, and double-bladed lightsaber accessory. Released in 2000 with The Phantom Menace sets, this version shows Darth Maul in his dramatic appearance from key moments of the film. The hooded cape and specific sash variant make this minifigure notable for collectors building complete Darth Maul collections and distinguishing between the various early releases of this iconic villain.',
    de: 'Darth Maul mit Kapuze und Umhang repräsentiert den furchterregenden Sith-Schüler in seinen zeremoniellen Roben mit dem charakteristischen schwarzen Kapuzenumhang und Schärpen-Detail ohne Tasche. Diese LEGO Minifigur fängt Darth Mauls bedrohliches Aussehen mit rot-schwarzen Zabrak-Gesichtstätowierungen, gelben Sith-Augen, schwarzen Roben und doppelschneidigem Lichtschwert-Zubehör ein. Veröffentlicht 2000 mit Die-dunkle-Bedrohung-Sets, zeigt diese Version Darth Maul in seinem dramatischen Aussehen aus Schlüsselmomenten des Films. Der Kapuzenumhang und die spezifische Schärpen-Variante machen diese Minifigur bemerkenswert für Sammler, die vollständige Darth Maul-Sammlungen aufbauen und zwischen den verschiedenen frühen Veröffentlichungen dieses ikonischen Bösewichts unterscheiden.',
    fr: 'Dark Maul avec Capuche et Cape représente l\'apprenti Sith redoutable dans ses robes cérémonielles, présentant la cape à capuche noire distinctive et le détail de ceinture sans poche. Cette minifigurine LEGO capture l\'apparence menaçante de Dark Maul avec tatouages faciaux Zabrak rouges et noirs, yeux Sith jaunes, robes noires et accessoire de sabre laser à double lame. Sortie en 2000 avec les sets La Menace Fantôme, cette version montre Dark Maul dans son apparence dramatique des moments clés du film. La cape à capuche et la variante de ceinture spécifique rendent cette minifigurine notable pour les collectionneurs construisant des collections complètes de Dark Maul et distinguant entre les diverses sorties précoces de ce méchant iconique.',
    es: 'Darth Maul con Capucha y Capa representa al temible aprendiz Sith en sus túnicas ceremoniales, presentando la distintiva capa con capucha negra y detalle de fajín sin bolsa. Esta minifigura LEGO captura la apariencia amenazante de Darth Maul con tatuajes faciales Zabrak rojos y negros, ojos Sith amarillos, túnicas negras y accesorio de sable de luz de doble hoja. Lanzada en 2000 con los sets de La Amenaza Fantasma, esta versión muestra a Darth Maul en su apariencia dramática de momentos clave de la película. La capa con capucha y variante específica de fajín hacen de esta minifigura notable para coleccionistas construyendo colecciones completas de Darth Maul y distinguiendo entre los diversos lanzamientos tempranos de este icónico villano.'
  }
];

async function saveBatch() {
  console.log('💾 Saving batch 001-010 (sw0002-sw0011) - First 2 minifigs for testing...\n');

  for (const m of batch) {
    await prisma.minifigCatalog.update({
      where: { minifigure_no: m.no },
      data: {
        description_en: m.en,
        description_de: m.de,
        description_fr: m.fr,
        description_es: m.es,
        description_generated_at: new Date(),
        description_status: 'generated'
      }
    });
    console.log(`  ✅ ${m.no}: ${m.name}`);
  }

  console.log('\n✨ Batch complete: 2 minifigs (8 descriptions)');
  await prisma.$disconnect();
}

saveBatch().catch(console.error);
