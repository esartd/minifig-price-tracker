import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

const minifigsPath = path.join(process.cwd(), 'public/catalog/minifigs.json');
const minifigs = JSON.parse(fs.readFileSync(minifigsPath, 'utf-8'));

// Theme-specific context
const ninjagoContext = {
  ninjas: {
    'kai': { element: 'Fire', color: 'red', trait: 'hothead with fierce determination', weapon: 'sword' },
    'jay': { element: 'Lightning', color: 'blue', trait: 'quick-witted joker with electric speed', weapon: 'nunchucks' },
    'cole': { element: 'Earth', color: 'black', trait: 'strong and dependable leader', weapon: 'scythe' },
    'zane': { element: 'Ice', color: 'white', trait: 'logical nindroid with cold precision', weapon: 'shurikens' },
    'nya': { element: 'Water', color: 'red/blue', trait: 'fierce warrior and master of the seas', weapon: 'spear' },
    'lloyd': { element: 'Energy/Green', color: 'green', trait: 'destined Green Ninja and chosen one', weapon: 'katana' },
  },
  villains: ['skeleton', 'serpentine', 'stone', 'ghost', 'sky pirate', 'oni', 'dragon'],
};

const harryPotterContext = {
  houses: {
    'gryffindor': { color: 'red and gold', traits: 'courage, bravery, and determination' },
    'slytherin': { color: 'green and silver', traits: 'ambition, cunning, and resourcefulness' },
    'ravenclaw': { color: 'blue and bronze', traits: 'intelligence, wisdom, and wit' },
    'hufflepuff': { color: 'yellow and black', traits: 'loyalty, hard work, and fairness' },
  },
  characters: ['harry', 'hermione', 'ron', 'dumbledore', 'snape', 'hagrid', 'voldemort', 'draco', 'luna', 'neville'],
};

function parseCharacterName(name: string): { character: string, variant: string, details: string[] } {
  const lower = name.toLowerCase();
  const parts = name.split('-').map(p => p.trim());

  return {
    character: parts[0] || name,
    variant: parts.slice(1).join(' '),
    details: parts.slice(1),
  };
}

function generateNinjagoDescription(minifig: any): any {
  const { character, variant, details } = parseCharacterName(minifig.name);
  const lower = minifig.name.toLowerCase();

  // Determine ninja or villain
  let isNinja = false;
  let ninjaData: any = null;

  for (const [name, data] of Object.entries(ninjagoContext.ninjas)) {
    if (lower.includes(name)) {
      isNinja = true;
      ninjaData = { name: name.charAt(0).toUpperCase() + name.slice(1), ...data };
      break;
    }
  }

  if (isNinja && ninjaData) {
    // Ninja description
    const variantDesc = variant ? ` in ${variant} form` : '';
    const elementPower = ninjaData.element ? ` wielding ${ninjaData.element} elemental power` : '';

    return {
      description_en: `${ninjaData.name} the ${ninjaData.element} ninja${variantDesc} brought ${ninjaData.trait} to the team${elementPower}. This LEGO minifigure featured distinctive ${ninjaData.color} ninja suit with detailed printing and authentic accessories. As master of ${ninjaData.element}, ${ninjaData.name} protected Ninjago from evil forces. This collectible captured the legendary ninja warrior from the ${minifig.category_name.split('/').pop()?.trim() || 'Ninjago'} saga.`,

      description_de: `${ninjaData.name} der ${ninjaData.element}-Ninja${variantDesc} brachte ${ninjaData.trait} zum Team${elementPower}. Diese LEGO-Minifigur zeigte charakteristischen ${ninjaData.color} Ninja-Anzug mit detailliertem Druck und authentischem Zubehör. Als Meister des ${ninjaData.element}-Elements schützte ${ninjaData.name} Ninjago vor bösen Mächten. Diese Sammlerfigur erfasste den legendären Ninja-Krieger aus der ${minifig.category_name.split('/').pop()?.trim() || 'Ninjago'}-Saga.`,

      description_fr: `${ninjaData.name} le ninja ${ninjaData.element}${variantDesc} apportait ${ninjaData.trait} à l'équipe${elementPower}. Cette minifigurine LEGO présentait une combinaison ninja ${ninjaData.color} distinctive avec impression détaillée et accessoires authentiques. En tant que maître de ${ninjaData.element}, ${ninjaData.name} protégeait Ninjago des forces du mal. Cette collection capturait le légendaire guerrier ninja de la saga ${minifig.category_name.split('/').pop()?.trim() || 'Ninjago'}.`,

      description_es: `${ninjaData.name} el ninja ${ninjaData.element}${variantDesc} aportaba ${ninjaData.trait} al equipo${elementPower}. Esta minifigura LEGO presentaba distintivo traje ninja ${ninjaData.color} con impresión detallada y accesorios auténticos. Como maestro de ${ninjaData.element}, ${ninjaData.name} protegía Ninjago de fuerzas malvadas. Esta colección capturaba al legendario guerrero ninja de la saga ${minifig.category_name.split('/').pop()?.trim() || 'Ninjago'}.`,
    };
  }

  // Villain or other character
  const series = minifig.category_name.split('/').pop()?.trim() || 'Ninjago';
  return {
    description_en: `${character} from ${series} brought unique design and character to the Ninjago universe. This LEGO minifigure featured detailed costume printing and distinctive accessories. The figure represented an important character in the battle for Ninjago. This collectible captured the essence of ${series} storytelling with authentic design elements.`,

    description_de: `${character} aus ${series} brachte einzigartiges Design und Charakter ins Ninjago-Universum. Diese LEGO-Minifigur zeigte detaillierten Kostüm-Druck und charakteristisches Zubehör. Die Figur repräsentierte einen wichtigen Charakter im Kampf um Ninjago. Diese Sammlerfigur erfasste die Essenz des ${series}-Storytellings mit authentischen Design-Elementen.`,

    description_fr: `${character} de ${series} apportait un design unique et du caractère à l'univers Ninjago. Cette minifigurine LEGO présentait une impression de costume détaillée et des accessoires distinctifs. La figurine représentait un personnage important dans la bataille pour Ninjago. Cette collection capturait l'essence de la narration ${series} avec des éléments de design authentiques.`,

    description_es: `${character} de ${series} aportaba diseño único y carácter al universo Ninjago. Esta minifigura LEGO presentaba impresión de traje detallada y accesorios distintivos. La figura representaba un personaje importante en la batalla por Ninjago. Esta colección capturaba la esencia de la narrativa ${series} con elementos de diseño auténticos.`,
  };
}

function generateHarryPotterDescription(minifig: any): any {
  const { character } = parseCharacterName(minifig.name);
  const lower = minifig.name.toLowerCase();

  // Determine house
  let house: any = null;
  let houseData: any = null;

  for (const [houseName, data] of Object.entries(harryPotterContext.houses)) {
    if (lower.includes(houseName)) {
      house = houseName.charAt(0).toUpperCase() + houseName.slice(1);
      houseData = data;
      break;
    }
  }

  // Parse specific characters
  const isHarry = lower.includes('harry');
  const isHermione = lower.includes('hermione');
  const isRon = lower.includes('ron');
  const isDumbledore = lower.includes('dumbledore');
  const isSnape = lower.includes('snape');
  const isVoldemort = lower.includes('voldemort');

  const series = minifig.category_name.split('/').pop()?.trim() || 'Harry Potter';
  const outfit = minifig.name.split('-').slice(1).join(' ').trim() || 'classic outfit';

  if (isHarry) {
    return {
      description_en: `Harry Potter the Boy Who Lived wore ${outfit} in this variant from ${series}. This LEGO minifigure featured distinctive lightning bolt scar and authentic costume details. The Chosen One's bravery and magical abilities defined his journey at Hogwarts. This collectible captured Harry's iconic appearance with character-specific printing and accessories.`,

      description_de: `Harry Potter der Junge der überlebte trug ${outfit} in dieser Variante aus ${series}. Diese LEGO-Minifigur zeigte charakteristische Blitznarbe und authentische Kostüm-Details. Die Tapferkeit und magischen Fähigkeiten des Auserwählten definierten seine Reise in Hogwarts. Diese Sammlerfigur erfasste Harrys ikonisches Erscheinungsbild mit charakterspezifischem Druck und Zubehör.`,

      description_fr: `Harry Potter le Survivant portait ${outfit} dans cette variante de ${series}. Cette minifigurine LEGO présentait une cicatrice en éclair distinctive et des détails de costume authentiques. Le courage et les capacités magiques de l'Élu définissaient son voyage à Poudlard. Cette collection capturait l'apparence emblématique d'Harry avec impression et accessoires spécifiques au personnage.`,

      description_es: `Harry Potter el Niño que Sobrevivió llevaba ${outfit} en esta variante de ${series}. Esta minifigura LEGO presentaba distintiva cicatriz de rayo y detalles de traje auténticos. La valentía y habilidades mágicas del Elegido definían su viaje en Hogwarts. Esta colección capturaba la apariencia icónica de Harry con impresión y accesorios específicos del personaje.`,
    };
  }

  if (isHermione) {
    return {
      description_en: `Hermione Granger the brightest witch of her age appeared in ${outfit} from ${series}. This LEGO minifigure featured bushy hair and detailed Gryffindor costume printing. Her intelligence and loyalty made her Harry's most valuable friend. This collectible captured Hermione's studious character with authentic accessories and design.`,

      description_de: `Hermione Granger die klügste Hexe ihres Jahrgangs erschien in ${outfit} aus ${series}. Diese LEGO-Minifigur zeigte buschiges Haar und detaillierten Gryffindor-Kostüm-Druck. Ihre Intelligenz und Loyalität machten sie zu Harrys wertvollster Freundin. Diese Sammlerfigur erfasste Hermiones gelehrten Charakter mit authentischem Zubehör und Design.`,

      description_fr: `Hermione Granger la sorcière la plus brillante de son âge apparaissait dans ${outfit} de ${series}. Cette minifigurine LEGO présentait des cheveux touffus et une impression de costume Gryffondor détaillée. Son intelligence et sa loyauté en faisaient l'amie la plus précieuse d'Harry. Cette collection capturait le caractère studieux d'Hermione avec accessoires et design authentiques.`,

      description_es: `Hermione Granger la bruja más brillante de su edad aparecía en ${outfit} de ${series}. Esta minifigura LEGO presentaba cabello tupido e impresión de traje Gryffindor detallada. Su inteligencia y lealtad la convertían en la amiga más valiosa de Harry. Esta colección capturaba el carácter estudioso de Hermione con accesorios y diseño auténticos.`,
    };
  }

  // Generic Harry Potter character
  const houseDesc = house ? ` representing ${house} house with its ${houseData.traits}` : '';

  return {
    description_en: `${character} from ${series} brought magical character to the wizarding world${houseDesc}. This LEGO minifigure featured detailed robe printing and authentic Hogwarts accessories. The character played an important role in the Harry Potter saga. This collectible captured the essence of ${series} with character-specific design elements.`,

    description_de: `${character} aus ${series} brachte magischen Charakter in die Zauberwelt${houseDesc}. Diese LEGO-Minifigur zeigte detaillierten Robe-Druck und authentisches Hogwarts-Zubehör. Der Charakter spielte eine wichtige Rolle in der Harry-Potter-Saga. Diese Sammlerfigur erfasste die Essenz von ${series} mit charakterspezifischen Design-Elementen.`,

    description_fr: `${character} de ${series} apportait du caractère magique au monde des sorciers${houseDesc}. Cette minifigurine LEGO présentait une impression de robe détaillée et des accessoires Poudlard authentiques. Le personnage jouait un rôle important dans la saga Harry Potter. Cette collection capturait l'essence de ${series} avec des éléments de design spécifiques au personnage.`,

    description_es: `${character} de ${series} aportaba carácter mágico al mundo mágico${houseDesc}. Esta minifigura LEGO presentaba impresión de túnica detallada y accesorios de Hogwarts auténticos. El personaje jugaba un papel importante en la saga de Harry Potter. Esta colección capturaba la esencia de ${series} con elementos de diseño específicos del personaje.`,
  };
}

function generateSuperHeroDescription(minifig: any): any {
  const { character, variant } = parseCharacterName(minifig.name);
  const lower = minifig.name.toLowerCase();

  // Parse character type
  const isBatman = lower.includes('batman');
  const isSpiderMan = lower.includes('spider');
  const isIronMan = lower.includes('iron man');

  const series = minifig.category_name.split('/').pop()?.trim() || 'Super Heroes';
  const suitDesc = variant || 'specialized suit';

  if (isBatman) {
    return {
      description_en: `Batman in ${suitDesc} variant protected Gotham City with tactical expertise. This LEGO minifigure featured distinctive cowl design and detailed suit printing. Bruce Wayne's dedication to justice made him the Dark Knight. This collectible from ${series} captured Batman's legendary appearance with authentic accessories.`,

      description_de: `Batman in ${suitDesc}-Variante beschützte Gotham City mit taktischer Expertise. Diese LEGO-Minifigur zeigte charakteristisches Cowl-Design und detaillierten Anzug-Druck. Bruce Waynes Hingabe zur Gerechtigkeit machte ihn zum Dunklen Ritter. Diese Sammlerfigur aus ${series} erfasste Batmans legendäres Erscheinungsbild mit authentischem Zubehör.`,

      description_fr: `Batman dans la variante ${suitDesc} protégeait Gotham City avec expertise tactique. Cette minifigurine LEGO présentait un design de capuche distinctif et une impression de costume détaillée. Le dévouement de Bruce Wayne à la justice en faisait le Chevalier Noir. Cette collection de ${series} capturait l'apparence légendaire de Batman avec accessoires authentiques.`,

      description_es: `Batman en variante ${suitDesc} protegía Gotham City con experiencia táctica. Esta minifigura LEGO presentaba diseño de capucha distintivo e impresión de traje detallada. La dedicación de Bruce Wayne a la justicia lo convertía en el Caballero Oscuro. Esta colección de ${series} capturaba la apariencia legendaria de Batman con accesorios auténticos.`,
    };
  }

  if (isSpiderMan) {
    return {
      description_en: `Spider-Man in ${suitDesc} variant swung through New York with web-slinging abilities. This LEGO minifigure featured detailed web pattern printing and character-specific design. Peter Parker's heroism and spider-sense made him a beloved protector. This collectible from ${series} captured Spider-Man's iconic appearance.`,

      description_de: `Spider-Man in ${suitDesc}-Variante schwang durch New York mit Netzschleuderfähigkeiten. Diese LEGO-Minifigur zeigte detaillierten Netz-Muster-Druck und charakterspezifisches Design. Peter Parkers Heldentum und Spinnen-Sinn machten ihn zu einem geliebten Beschützer. Diese Sammlerfigur aus ${series} erfasste Spider-Mans ikonisches Erscheinungsbild.`,

      description_fr: `Spider-Man dans la variante ${suitDesc} se balançait à travers New York avec des capacités de lancement de toiles. Cette minifigurine LEGO présentait une impression de motif de toile détaillée et un design spécifique au personnage. L'héroïsme et le sens d'araignée de Peter Parker en faisaient un protecteur adoré. Cette collection de ${series} capturait l'apparence emblématique de Spider-Man.`,

      description_es: `Spider-Man en variante ${suitDesc} se balanceaba por Nueva York con habilidades de lanzamiento de telarañas. Esta minifigura LEGO presentaba impresión de patrón de telaraña detallada y diseño específico del personaje. El heroísmo y sentido arácnido de Peter Parker lo convertían en un protector querido. Esta colección de ${series} capturaba la apariencia icónica de Spider-Man.`,
    };
  }

  // Generic superhero
  return {
    description_en: `${character} with ${suitDesc} brought heroic action to ${series}. This LEGO minifigure featured detailed costume printing and character-specific accessories. The hero's unique abilities and dedication protected the innocent. This collectible captured the essence of superhero storytelling with authentic design.`,

    description_de: `${character} mit ${suitDesc} brachte heroische Action zu ${series}. Diese LEGO-Minifigur zeigte detaillierten Kostüm-Druck und charakterspezifisches Zubehör. Die einzigartigen Fähigkeiten und Hingabe des Helden schützten die Unschuldigen. Diese Sammlerfigur erfasste die Essenz des Superhelden-Storytellings mit authentischem Design.`,

    description_fr: `${character} avec ${suitDesc} apportait de l'action héroïque à ${series}. Cette minifigurine LEGO présentait une impression de costume détaillée et des accessoires spécifiques au personnage. Les capacités uniques et le dévouement du héros protégeaient les innocents. Cette collection capturait l'essence de la narration de super-héros avec un design authentique.`,

    description_es: `${character} con ${suitDesc} aportaba acción heroica a ${series}. Esta minifigura LEGO presentaba impresión de traje detallada y accesorios específicos del personaje. Las habilidades únicas y dedicación del héroe protegían a los inocentes. Esta colección capturaba la esencia de la narrativa de superhéroes con diseño auténtico.`,
  };
}

async function improveDescriptions() {
  console.log('🚀 Improving theme descriptions (2,046 minifigs)...\n');

  // Get minifigs that need improvement
  const superHeroes = minifigs.filter((m: any) => m.category_name.includes('Super Heroes'));
  const ninjago = minifigs.filter((m: any) => m.category_name.includes('NINJAGO') || m.category_name.includes('Ninjago'));
  const harryPotter = minifigs.filter((m: any) => m.category_name.includes('Harry Potter'));

  const themes = [
    { name: 'Super Heroes', minifigs: superHeroes, generator: generateSuperHeroDescription },
    { name: 'Ninjago', minifigs: ninjago, generator: generateNinjagoDescription },
    { name: 'Harry Potter', minifigs: harryPotter, generator: generateHarryPotterDescription },
  ];

  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const theme of themes) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${theme.name}: ${theme.minifigs.length} minifigs`);
    console.log(`${'='.repeat(60)}\n`);

    const ids = theme.minifigs.map((f: any) => f.minifigure_no);

    // Get existing descriptions
    const existing = await prisma.minifigCatalog.findMany({
      where: { minifigure_no: { in: ids } },
      select: {
        minifigure_no: true,
        description_en: true,
      }
    });

    const existingMap = new Map(existing.map(e => [e.minifigure_no, e.description_en]));

    let updated = 0;
    let skipped = 0;

    for (const minifig of theme.minifigs) {
      const existingDesc = existingMap.get(minifig.minifigure_no) || '';

      // Check if generic
      const isGeneric = existingDesc.includes('This LEGO') &&
                       existingDesc.includes('This collectible LEGO minifigure features detailed printing') &&
                       existingDesc.includes('Perfect for collectors building themed displays');

      if (!isGeneric && existingDesc.length > 200) {
        // Already has good description, skip
        skipped++;
        if (skipped % 100 === 0) {
          console.log(`  ⏭️  Skipped ${skipped} (already good)`);
        }
        continue;
      }

      // Generate new description
      const descriptions = theme.generator(minifig);

      try {
        await prisma.minifigCatalog.update({
          where: { minifigure_no: minifig.minifigure_no },
          data: descriptions,
        });

        updated++;
        if (updated % 50 === 0) {
          console.log(`  ✅ Updated ${updated}/${theme.minifigs.length - skipped}`);
        }
      } catch (error: any) {
        console.error(`  ❌ Error updating ${minifig.minifigure_no}:`, error.message);
      }

      // Small delay to avoid overwhelming database
      if (updated % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`\n${theme.name} complete:`);
    console.log(`  ✅ Updated: ${updated}`);
    console.log(`  ⏭️  Skipped (already good): ${skipped}`);

    totalUpdated += updated;
    totalSkipped += skipped;
  }

  console.log(`\n\n${'='.repeat(60)}`);
  console.log(`FINAL SUMMARY`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total updated: ${totalUpdated}`);
  console.log(`Total skipped (already good): ${totalSkipped}`);
  console.log(`Total processed: ${totalUpdated + totalSkipped}`);

  await prisma.$disconnect();
}

improveDescriptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
