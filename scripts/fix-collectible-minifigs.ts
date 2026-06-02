import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

const minifigsPath = path.join(process.cwd(), 'public/catalog/minifigs.json');
const minifigs = JSON.parse(fs.readFileSync(minifigsPath, 'utf-8'));

// Get character name before the comma (for collectible minifigs)
function getCharacterName(fullName: string): string {
  // For "Neville Longbottom, Harry Potter, Series 1..." -> "Neville Longbottom"
  return fullName.split(',')[0].trim();
}

function generateHarryPotterDescription(minifig: any): any {
  // Get ACTUAL character name (before comma)
  const characterName = getCharacterName(minifig.name);
  const lower = characterName.toLowerCase();

  const series = minifig.category_name.split('/').pop()?.trim() || 'Harry Potter';

  // Check for specific characters using ONLY the character name
  if (lower.includes('harry potter') || lower === 'harry potter') {
    const variant = minifig.name.includes('Pajamas') ? 'pajamas' :
                   minifig.name.includes('School Robes') ? 'school robes' :
                   minifig.name.includes('Infant') ? 'infant form' : 'outfit';

    return {
      description_en: `Harry Potter the Boy Who Lived appeared in ${variant} from ${series}. This LEGO minifigure featured distinctive lightning bolt scar and authentic costume details. The Chosen One's bravery and magical abilities defined his journey at Hogwarts. This collectible captured Harry's iconic appearance with character-specific printing and accessories.`,

      description_de: `Harry Potter der Junge der überlebte erschien in ${variant} aus ${series}. Diese LEGO-Minifigur zeigte charakteristische Blitznarbe und authentische Kostüm-Details. Die Tapferkeit und magischen Fähigkeiten des Auserwählten definierten seine Reise in Hogwarts. Diese Sammlerfigur erfasste Harrys ikonisches Erscheinungsbild mit charakterspezifischem Druck und Zubehör.`,

      description_fr: `Harry Potter le Survivant apparaissait en ${variant} de ${series}. Cette minifigurine LEGO présentait une cicatrice en éclair distinctive et des détails de costume authentiques. Le courage et les capacités magiques de l'Élu définissaient son voyage à Poudlard. Cette collection capturait l'apparence emblématique d'Harry avec impression et accessoires spécifiques au personnage.`,

      description_es: `Harry Potter el Niño que Sobrevivió aparecía en ${variant} de ${series}. Esta minifigura LEGO presentaba distintiva cicatriz de rayo y detalles de traje auténticos. La valentía y habilidades mágicas del Elegido definían su viaje en Hogwarts. Esta colección capturaba la apariencia icónica de Harry con impresión y accesorios específicos del personaje.`,
    };
  }

  if (lower.includes('hermione')) {
    const variant = minifig.name.includes('School Robes') ? 'school robes' : 'outfit';
    return {
      description_en: `Hermione Granger the brightest witch of her age appeared in ${variant} from ${series}. This LEGO minifigure featured bushy hair and detailed Gryffindor costume. Her intelligence and loyalty made her Harry's most valuable friend. This collectible captured Hermione's studious character with authentic accessories and design.`,

      description_de: `Hermione Granger die klügste Hexe ihres Jahrgangs erschien in ${variant} aus ${series}. Diese LEGO-Minifigur zeigte buschiges Haar und detailliertes Gryffindor-Kostüm. Ihre Intelligenz und Loyalität machten sie zu Harrys wertvollster Freundin. Diese Sammlerfigur erfasste Hermiones gelehrten Charakter mit authentischem Zubehör und Design.`,

      description_fr: `Hermione Granger la sorcière la plus brillante de son âge apparaissait en ${variant} de ${series}. Cette minifigurine LEGO présentait des cheveux touffus et un costume Gryffondor détaillé. Son intelligence et sa loyauté en faisaient l'amie la plus précieuse d'Harry. Cette collection capturait le caractère studieux d'Hermione avec accessoires et design authentiques.`,

      description_es: `Hermione Granger la bruja más brillante de su edad aparecía en ${variant} de ${series}. Esta minifigura LEGO presentaba cabello tupido y traje Gryffindor detallado. Su inteligencia y lealtad la convertían en la amiga más valiosa de Harry. Esta colección capturaba el carácter estudioso de Hermione con accesorios y diseño auténticos.`,
    };
  }

  if (lower.includes('ron weasley') || lower.includes('ron')) {
    const variant = minifig.name.includes('School Robes') ? 'school robes' : 'outfit';
    return {
      description_en: `Ron Weasley Harry's loyal best friend appeared in ${variant} from ${series}. This LEGO minifigure featured red Weasley hair and Gryffindor colors. His bravery and humor made him essential to the trio. This collectible captured Ron's character with authentic details and accessories.`,

      description_de: `Ron Weasley Harrys treuer bester Freund erschien in ${variant} aus ${series}. Diese LEGO-Minifigur zeigte rotes Weasley-Haar und Gryffindor-Farben. Seine Tapferkeit und sein Humor machten ihn unverzichtbar für das Trio. Diese Sammlerfigur erfasste Rons Charakter mit authentischen Details und Zubehör.`,

      description_fr: `Ron Weasley le meilleur ami loyal d'Harry apparaissait en ${variant} de ${series}. Cette minifigurine LEGO présentait des cheveux roux Weasley et des couleurs Gryffondor. Son courage et son humour le rendaient essentiel au trio. Cette collection capturait le caractère de Ron avec détails et accessoires authentiques.`,

      description_es: `Ron Weasley el leal mejor amigo de Harry aparecía en ${variant} de ${series}. Esta minifigura LEGO presentaba cabello rojo Weasley y colores Gryffindor. Su valentía y humor lo hacían esencial para el trío. Esta colección capturaba el carácter de Ron con detalles y accesorios auténticos.`,
    };
  }

  if (lower.includes('dumbledore')) {
    return {
      description_en: `${characterName} the wise Headmaster of Hogwarts appeared from ${series}. This LEGO minifigure featured long silver beard and distinctive robes. His wisdom and magical power protected Hogwarts and guided Harry. This collectible captured Dumbledore's legendary appearance with detailed printing.`,

      description_de: `${characterName} der weise Schulleiter von Hogwarts erschien aus ${series}. Diese LEGO-Minifigur zeigte langen silbernen Bart und charakteristische Roben. Seine Weisheit und magische Kraft schützten Hogwarts und leiteten Harry. Diese Sammlerfigur erfasste Dumbledores legendäres Erscheinungsbild mit detailliertem Druck.`,

      description_fr: `${characterName} le sage directeur de Poudlard apparaissait de ${series}. Cette minifigurine LEGO présentait une longue barbe argentée et des robes distinctives. Sa sagesse et son pouvoir magique protégeaient Poudlard et guidaient Harry. Cette collection capturait l'apparence légendaire de Dumbledore avec impression détaillée.`,

      description_es: `${characterName} el sabio director de Hogwarts aparecía de ${series}. Esta minifigura LEGO presentaba larga barba plateada y túnicas distintivas. Su sabiduría y poder mágico protegían Hogwarts y guiaban a Harry. Esta colección capturaba la apariencia legendaria de Dumbledore con impresión detallada.`,
    };
  }

  if (lower.includes('voldemort')) {
    return {
      description_en: `Lord Voldemort the Dark Lord threatened the wizarding world from ${series}. This LEGO minifigure featured pale skin and distinctive dark robes. His quest for immortality and power made him Harry's greatest enemy. This collectible captured the terrifying villain with authentic dark wizard design.`,

      description_de: `Lord Voldemort der Dunkle Lord bedrohte die Zauberwelt aus ${series}. Diese LEGO-Minifigur zeigte blasse Haut und charakteristische dunkle Roben. Seine Suche nach Unsterblichkeit und Macht machte ihn zu Harrys größtem Feind. Diese Sammlerfigur erfasste den furchterregenden Schurken mit authentischem dunklem Zauberer-Design.`,

      description_fr: `Lord Voldemort le Seigneur des Ténèbres menaçait le monde des sorciers de ${series}. Cette minifigurine LEGO présentait une peau pâle et des robes sombres distinctives. Sa quête d'immortalité et de pouvoir en faisait le plus grand ennemi d'Harry. Cette collection capturait le méchant terrifiant avec design authentique de sorcier noir.`,

      description_es: `Lord Voldemort el Señor Oscuro amenazaba el mundo mágico de ${series}. Esta minifigura LEGO presentaba piel pálida y túnicas oscuras distintivas. Su búsqueda de inmortalidad y poder lo convertía en el mayor enemigo de Harry. Esta colección capturaba al villano aterrador con diseño auténtico de mago oscuro.`,
    };
  }

  if (lower.includes('neville')) {
    return {
      description_en: `Neville Longbottom the brave Gryffindor student appeared from ${series}. This LEGO minifigure featured determined expression and Gryffindor robes. His courage grew from shy student to hero who destroyed Horcruxes. This collectible captured Neville's transformation with authentic character details.`,

      description_de: `Neville Longbottom der tapfere Gryffindor-Schüler erschien aus ${series}. Diese LEGO-Minifigur zeigte entschlossenen Ausdruck und Gryffindor-Roben. Sein Mut wuchs vom schüchternen Schüler zum Helden, der Horkruxe zerstörte. Diese Sammlerfigur erfasste Nevilles Transformation mit authentischen Charakter-Details.`,

      description_fr: `Neville Londubat le courageux étudiant Gryffondor apparaissait de ${series}. Cette minifigurine LEGO présentait une expression déterminée et des robes Gryffondor. Son courage grandit d'étudiant timide à héros qui détruisit des Horcruxes. Cette collection capturait la transformation de Neville avec détails authentiques du personnage.`,

      description_es: `Neville Longbottom el valiente estudiante Gryffindor aparecía de ${series}. Esta minifigura LEGO presentaba expresión determinada y túnicas Gryffindor. Su coraje creció de estudiante tímido a héroe que destruyó Horrocruxes. Esta colección capturaba la transformación de Neville con detalles auténticos del personaje.`,
    };
  }

  if (lower.includes('luna')) {
    return {
      description_en: `Luna Lovegood the dreamy Ravenclaw student appeared from ${series}. This LEGO minifigure featured distinctive blonde hair and unique accessories. Her ability to see truth others missed made her invaluable. This collectible captured Luna's whimsical character with authentic quirky design.`,

      description_de: `Luna Lovegood die verträumte Ravenclaw-Schülerin erschien aus ${series}. Diese LEGO-Minifigur zeigte charakteristisches blondes Haar und einzigartiges Zubehör. Ihre Fähigkeit, Wahrheit zu sehen, die andere übersahen, machte sie unersetzlich. Diese Sammlerfigur erfasste Lunas skurrilen Charakter mit authentischem schrägem Design.`,

      description_fr: `Luna Lovegood l'étudiante Serdaigle rêveuse apparaissait de ${series}. Cette minifigurine LEGO présentait des cheveux blonds distinctifs et des accessoires uniques. Sa capacité à voir la vérité que d'autres manquaient la rendait inestimable. Cette collection capturait le caractère fantasque de Luna avec design authentique excentrique.`,

      description_es: `Luna Lovegood la soñadora estudiante Ravenclaw aparecía de ${series}. Esta minifigura LEGO presentaba distintivo cabello rubio y accesorios únicos. Su capacidad de ver verdad que otros perdían la hacía invaluable. Esta colección capturaba el carácter caprichoso de Luna con diseño auténtico peculiar.`,
    };
  }

  // Generic character with house detection
  const houseMatch = minifig.name.match(/Gryffindor|Slytherin|Ravenclaw|Hufflepuff/i);
  const house = houseMatch ? houseMatch[0] : null;
  const houseDesc = house ? ` of ${house} house` : '';

  return {
    description_en: `${characterName}${houseDesc} brought magical character to ${series}. This LEGO minifigure featured detailed robe printing and authentic Hogwarts accessories. The character played an important role in the wizarding world. This collectible captured the essence of Harry Potter storytelling with character-specific design.`,

    description_de: `${characterName}${houseDesc} brachte magischen Charakter zu ${series}. Diese LEGO-Minifigur zeigte detaillierten Robe-Druck und authentisches Hogwarts-Zubehör. Der Charakter spielte eine wichtige Rolle in der Zauberwelt. Diese Sammlerfigur erfasste die Essenz des Harry-Potter-Storytellings mit charakterspezifischem Design.`,

    description_fr: `${characterName}${houseDesc} apportait du caractère magique à ${series}. Cette minifigurine LEGO présentait une impression de robe détaillée et des accessoires Poudlard authentiques. Le personnage jouait un rôle important dans le monde des sorciers. Cette collection capturait l'essence de la narration Harry Potter avec design spécifique au personnage.`,

    description_es: `${characterName}${houseDesc} aportaba carácter mágico a ${series}. Esta minifigura LEGO presentaba impresión de túnica detallada y accesorios de Hogwarts auténticos. El personaje jugaba un papel importante en el mundo mágico. Esta colección capturaba la esencia de la narrativa de Harry Potter con diseño específico del personaje.`,
  };
}

async function fixCollectibles() {
  console.log('🔧 Fixing Harry Potter Collectible Minifigures descriptions...\n');

  // Get all collectible Harry Potter minifigs
  const collectibles = minifigs.filter((m: any) =>
    m.minifigure_no.startsWith('colhp') &&
    m.category_name.includes('Harry Potter')
  );

  console.log(`Found ${collectibles.length} collectible minifigs to fix\n`);

  let fixed = 0;

  for (const minifig of collectibles) {
    const characterName = getCharacterName(minifig.name);
    const descriptions = generateHarryPotterDescription(minifig);

    try {
      await prisma.minifigCatalog.update({
        where: { minifigure_no: minifig.minifigure_no },
        data: descriptions,
      });

      fixed++;
      console.log(`✅ ${minifig.minifigure_no} - ${characterName}`);
    } catch (error: any) {
      console.error(`❌ ${minifig.minifigure_no}:`, error.message);
    }
  }

  console.log(`\n✅ Fixed ${fixed}/${collectibles.length} collectible minifigures!`);

  await prisma.$disconnect();
}

fixCollectibles().catch(console.error);
