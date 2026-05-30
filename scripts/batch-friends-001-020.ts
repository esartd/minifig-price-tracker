import { PrismaClient } from '@prisma/client-hostinger';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

const batch = [
  {
    no: 'frnd0001',
    name: 'Friends Emma - Magenta Layered Skirt, Lavender Top',
    en: 'This LEGO Friends Emma minifigure features a vibrant magenta layered skirt paired with a lavender top, representing one of the core characters from the original 2012 Friends collection. Emma is known for her creative personality and love of arts and design. This minifigure showcases the distinctive LEGO Friends styling with detailed clothing prints and the unique mini-doll body format that made the Friends line instantly recognizable. As one of the first Emma variants released, this figure is valuable for collectors building complete Friends character collections and those interested in the evolution of LEGO Friends designs.',
  },
  {
    no: 'frnd0002',
    name: 'Friends Stephanie - Medium Lavender Skirt, White Top',
    en: 'This LEGO Friends Stephanie minifigure features a medium lavender skirt with a white top, showcasing the sporty and adventurous main character from the Friends series. Stephanie is characterized by her athletic abilities and competitive spirit in the Heartlake City storyline. Released in 2012 as part of the original Friends wave, this minifigure represents the unique mini-doll design that introduced a new building experience for LEGO fans. The lavender and white color scheme reflects Stephanie\'s energetic personality, making this figure essential for Friends collectors and fans of the beloved character.',
  },
  {
    no: 'frnd0003',
    name: 'Friends Stephanie - Bright Pink Skirt, Light Aqua Long Sleeve Top',
    en: 'This LEGO Friends Stephanie variant features a bright pink skirt paired with a light aqua long sleeve top, offering a different outfit for the sporty main character. This colorful combination reflects the vibrant aesthetic of the Friends theme and Stephanie\'s dynamic personality. The long sleeve design adds versatility to play scenarios, perfect for different weather and activity themes in Heartlake City. Released in 2012, this minifigure represents an alternate outfit for collectors who want to display multiple versions of Stephanie in various settings and adventures throughout the Friends universe.',
  },
  {
    no: 'frnd0004',
    name: 'Friends Andrea - White Cropped Trousers, Lime Halter Neck Top',
    en: 'This LEGO Friends Andrea minifigure showcases white cropped trousers with a lime halter neck top, capturing the musical and artistic character\'s stylish personality. Andrea is known for her passion for music and performance in the Friends storyline. The trendy outfit with cropped trousers and halter design reflects modern fashion elements that made the Friends line appealing to builders interested in contemporary styling. Released in 2012 as part of the original Friends collection, this minifigure is valuable for those collecting all five main Friends characters and building complete Heartlake City displays.',
  },
  {
    no: 'frnd0005',
    name: 'Friends Mia - Dark Blue Layered Skirt, Light Aqua Halter Neck Top',
    en: 'This LEGO Friends Mia minifigure features a dark blue layered skirt with light aqua halter neck top, representing the nature-loving and adventurous character from Heartlake City. Mia is characterized by her love of animals and outdoor activities in the Friends universe. The practical yet stylish outfit combination reflects her active lifestyle and connection to nature. As one of the original 2012 Friends releases, this minifigure captures the essence of Mia\'s personality through the detailed clothing design and color choices that distinguish each Friends character\'s unique style.',
  },
  {
    no: 'frnd0006',
    name: 'Friends Olivia (Light Nougat) - Lime Cropped Trousers, Orange Top',
    en: 'This LEGO Friends Olivia minifigure in light nougat skin tone features lime cropped trousers and an orange top, showcasing the intelligent and science-minded character. Olivia is known for her love of inventing, robotics, and problem-solving in the Friends storyline. The bright, energetic color palette reflects her innovative and curious personality. Released in 2012 as one of the five original Friends characters, this minifigure represents LEGO\'s introduction of the mini-doll format and is essential for collectors building complete Friends sets or displaying all main characters from the beloved Heartlake City theme.',
  },
  {
    no: 'frnd0007',
    name: 'Friends Emma - Dark Blue Layered Skirt, Medium Lavender Top, White Boots',
    en: 'This LEGO Friends Emma variant features a dark blue layered skirt paired with a medium lavender top and white boots, offering a stylish outfit combination for the creative character. The addition of white boots adds a fashionable element perfect for various play scenarios in Heartlake City. Emma\'s artistic personality shines through in the carefully coordinated color scheme that balances cool blues and purples. This 2012 release provides collectors with another Emma outfit option, allowing for diverse display possibilities and storytelling scenarios featuring the popular Friends character in different activities and settings.',
  },
  {
    no: 'frnd0008',
    name: 'Friends Stephanie - Magenta Layered Skirt, White Halter Top with Circles and Stars',
    en: 'This LEGO Friends Stephanie minifigure showcases a magenta layered skirt with a decorated white halter top featuring circles and stars print, reflecting her sporty yet fashionable personality. The playful print design adds visual interest and character detail that makes each Friends minifigure unique and collectible. Stephanie\'s athletic nature is balanced with stylish outfit choices that appeal to fans of both sports and fashion themes. Released in 2012, this variant offers collectors another distinctive look for Stephanie, perfect for creating varied scenes and adventures in the diverse world of Heartlake City.',
  },
  {
    no: 'frnd0009',
    name: 'Friends Mia - Medium Blue Top with 2 Butterflies, Medium Lavender Skirt',
    en: 'This LEGO Friends Mia minifigure features a medium blue top decorated with two butterflies paired with a medium lavender skirt, perfectly capturing her love of nature and animals. The butterfly print is a distinctive element that immediately identifies Mia\'s character and her connection to wildlife and outdoor adventures. The soft color palette of blues and lavenders reflects her gentle, caring personality. Released in 2012 as part of the original Friends wave, this minifigure is essential for collectors who want to represent Mia\'s character accurately and complete their Heartlake City animal and nature-themed sets.',
  },
  {
    no: 'frnd0010',
    name: 'Friends Olivia (Light Nougat) - Dark Blue Layered Skirt, Dark Pink Top with Hearts',
    en: 'This LEGO Friends Olivia variant in light nougat skin tone features a dark blue layered skirt and dark pink top decorated with hearts, combining her intellectual personality with a touch of whimsy. While Olivia is primarily known for her scientific interests, this outfit shows her softer side and versatility as a character. The heart print adds a playful element to the practical color scheme, making this minifigure appealing for various storytelling scenarios. From the 2012 Friends collection, this figure allows collectors to display Olivia in different contexts beyond her typical inventor and robotics activities.',
  },
  {
    no: 'frnd0011',
    name: 'Friends Emma - Dark Blue Layered Skirt, Lavender Top',
    en: 'This LEGO Friends Emma variant features a dark blue layered skirt with a lavender top, offering a classic color combination that reflects her creative and artistic personality. The coordinated blue and purple palette creates an elegant look suitable for various Heartlake City scenarios from art classes to cafe visits. Emma\'s character is defined by her love of design, fashion, and creativity, elements reflected in her thoughtfully styled outfits. This 2012 release provides another wardrobe option for Emma collectors and fans who enjoy creating detailed displays featuring the popular Friends character in different settings.',
  },
  {
    no: 'frnd0012',
    name: 'Friends Sarah - Light Aqua Layered Skirt, White Top',
    en: 'This LEGO Friends Sarah minifigure features a light aqua layered skirt paired with a white top, introducing a supporting character from the Heartlake City universe. Sarah represents the extended cast of Friends characters that populated the various sets and locations. The fresh, clean color combination of aqua and white creates a summery, cheerful appearance perfect for beach, pool, or outdoor activity sets. Released in 2012 as part of the Friends expansion characters, Sarah adds diversity to collections and allows builders to create more populated and realistic Heartlake City scenes with multiple characters.',
  },
  {
    no: 'frnd0013',
    name: 'Friends Marie - Bright Pink Skirt, Bright Pink Sleeveless Blouse Top',
    en: 'This LEGO Friends Marie minifigure showcases a monochromatic bright pink outfit with a skirt and sleeveless blouse top, creating a bold and eye-catching appearance. Marie is a supporting character in the Friends universe who helps populate the various Heartlake City locations and sets. The all-pink ensemble reflects a fun, feminine aesthetic that fits perfectly within the vibrant Friends color palette. Released in 2012, Marie adds variety to Friends collections and allows builders to create diverse group scenes with multiple characters interacting in the shops, cafes, and homes of Heartlake City.',
  },
  {
    no: 'frnd0014',
    name: 'Friends Andrea - Light Aqua Layered Skirt, Bright Light Orange Top with Music Notes',
    en: 'This LEGO Friends Andrea variant features a light aqua layered skirt paired with a bright light orange top decorated with music notes, perfectly capturing her musical talents and artistic personality. The music note print is a distinctive element that immediately identifies Andrea\'s passion for performance and singing. The vibrant color combination reflects her energetic stage presence and creative spirit. Released in 2012, this minifigure is essential for collectors building music and performance-themed Friends sets, offering a specifically designed outfit that works perfectly with recording studio, concert, and talent show scenarios.',
  },
  {
    no: 'frnd0015',
    name: 'Friends Sophie - Bright Pink Layered Skirt, Light Aqua Long Sleeve Blouse Top',
    en: 'This LEGO Friends Sophie minifigure features a bright pink layered skirt with a light aqua long sleeve blouse top, introducing another supporting character to the Heartlake City community. Sophie adds diversity to the Friends character roster with her distinctive pink and aqua color scheme. The long sleeve design offers versatility for various play scenarios and seasonal settings. Released in 2012 as part of the expanding Friends line, Sophie helps builders create more populated and realistic scenes throughout Heartlake City\'s various locations, from schools and shops to recreational areas and community events.',
  },
  {
    no: 'frnd0016',
    name: 'Friends Mia - Medium Blue Top with 2 Butterflies, Lime Cropped Trousers',
    en: 'This LEGO Friends Mia variant pairs her signature medium blue top with two butterflies with lime cropped trousers, creating a practical outfit perfect for her outdoor adventures and animal care activities. The butterfly motif remains a constant identifier of Mia\'s love for nature and wildlife. The cropped trousers offer a more active, sporty look suitable for her hands-on approach to caring for animals in Heartlake City. This 2012 release gives collectors another Mia outfit option, ideal for displaying her in various nature-themed settings from stables to veterinary clinics.',
  },
  {
    no: 'frnd0017',
    name: 'Friends Olivia (Light Nougat) - Medium Lavender Skirt, Dark Pink Top',
    en: 'This LEGO Friends Olivia minifigure in light nougat skin tone features a medium lavender skirt with a dark pink top, offering a softer color palette than some of her other variants. While Olivia is known for her scientific mind and love of invention, this outfit shows her versatility and range as a character beyond the laboratory. The purple and pink combination creates a balanced, appealing look suitable for various Heartlake City activities. From the 2012 Friends collection, this variant allows fans to display Olivia in social settings alongside her typical science and robotics focused appearances.',
  },
  {
    no: 'frnd0018',
    name: 'Friends Anna - Red Long Skirt, Dark Blue Sleeveless Blouse Top',
    en: 'This LEGO Friends Anna minifigure features an elegant red long skirt paired with a dark blue sleeveless blouse top, creating a sophisticated appearance among Friends characters. Anna represents a more formal style compared to many Friends minifigures, with her long skirt design offering a distinctive silhouette. The rich red and blue color combination suggests refinement and maturity. Released in 2012, Anna adds variety to Friends collections and works particularly well in formal settings like restaurants, theaters, or special event scenarios where a more dressed-up character appearance enhances the storytelling possibilities.',
  },
  {
    no: 'frnd0019',
    name: 'Friends Peter - Dark Blue Trousers, White Shirt and Red Tie, Dark Tan Shoes',
    en: 'This LEGO Friends Peter minifigure features dark blue trousers, white shirt with red tie, and dark tan shoes, representing one of the male characters in the Friends universe. Peter\'s formal attire suggests a professional role in Heartlake City, possibly working in an office, store, or service position. The classic business-casual outfit provides gender diversity to the Friends line and allows for more realistic community scenarios. Released in 2012, Peter is valuable for collectors creating complete Heartlake City displays with varied characters representing different roles and professions throughout the community.',
  },
  {
    no: 'frnd0020',
    name: 'Friends Katharina - Black Riding Jacket, Black Riding Helmet',
    en: 'This LEGO Friends Katharina minifigure features a black riding jacket and black riding helmet, representing the equestrian activities popular in the Friends theme. Katharina\'s specialized riding outfit makes her essential for horse and stable-related Friends sets. The professional riding gear reflects the detailed activity-specific designs that made Friends sets appealing to fans interested in particular hobbies and sports. Released in 2012, this minifigure works perfectly with the various horse and stable sets in the Friends line, allowing builders to create authentic riding and animal care scenarios in Heartlake City.',
  }
];

async function saveBatch() {
  console.log('💾 Saving Friends batch 001-020 (frnd0001-frnd0020)...\n');

  let saved = 0;
  for (const m of batch) {
    try {
      await prisma.minifigCatalog.update({
        where: { minifigure_no: m.no },
        data: {
          description_en: m.en,
          description_generated_at: new Date(),
          description_status: 'completed'
        }
      });
      console.log(`  ✅ ${m.no}: ${m.name}`);
      saved++;
    } catch (err) {
      console.error(`  ❌ ${m.no}: Failed -`, err);
    }
  }

  console.log(`\n✨ Batch complete: ${saved}/${batch.length} descriptions saved`);
  await prisma.$disconnect();
}

saveBatch().catch(console.error);
