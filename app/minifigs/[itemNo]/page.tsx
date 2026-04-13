import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import MinifigDetailClient from '@/components/minifig-detail-client';

// Generate static params for all minifigures (SSG for SEO)
export async function generateStaticParams() {
  // Get first 1000 most popular minifigures for initial build
  // Others will be generated on-demand (ISR)
  const minifigs = await prisma.minifigCatalog.findMany({
    select: { minifigure_no: true },
    orderBy: { updated_at: 'desc' },
    take: 1000
  });

  return minifigs.map((m) => ({
    itemNo: m.minifigure_no
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ itemNo: string }>
}): Promise<Metadata> {
  const { itemNo } = await params;

  const minifig = await prisma.minifigCatalog.findUnique({
    where: { minifigure_no: itemNo }
  });

  if (!minifig) {
    return {
      title: 'Minifigure Not Found',
    };
  }

  const cleanName = minifig.name
    .replace(/^[^-]+-\s*/, '') // Remove theme prefix
    .trim();

  return {
    title: `${cleanName} (${minifig.minifigure_no}) - LEGO Minifigure Price Guide`,
    description: `${minifig.category_name} - ${cleanName}. View current prices, historical trends, and add to your inventory. Released ${minifig.year_released || 'date unknown'}.`,
    openGraph: {
      title: `${cleanName} - ${minifig.category_name}`,
      description: `LEGO Minifigure ${minifig.minifigure_no} - Price tracking and inventory management`,
      images: [`https://img.bricklink.com/ItemImage/MN/0/${minifig.minifigure_no}.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cleanName}`,
      description: `${minifig.category_name} minifigure price guide`,
      images: [`https://img.bricklink.com/ItemImage/MN/0/${minifig.minifigure_no}.png`],
    },
  };
}

export const revalidate = 86400; // Revalidate every 24 hours

export default async function MinifigPage({
  params
}: {
  params: Promise<{ itemNo: string }>
}) {
  const { itemNo } = await params;

  // Fetch minifig from database (not API)
  const minifig = await prisma.minifigCatalog.findUnique({
    where: { minifigure_no: itemNo }
  });

  if (!minifig) {
    notFound();
  }

  // Transform to expected format
  const minifigData = {
    no: minifig.minifigure_no,
    name: minifig.name,
    category_id: minifig.category_id,
    category_name: minifig.category_name,
    year_released: minifig.year_released,
    image_url: `https://img.bricklink.com/ItemImage/MN/0/${minifig.minifigure_no}.png`,
    weight_grams: minifig.weight_grams
  };

  // Fetch character variants (same character, different variations)
  // Extract character name: take everything before first dash, comma, or opening parenthesis
  // e.g., "Darth Maul - Printed Legs..." → "Darth Maul"
  // e.g., "Luke Skywalker, Jedi Knight" → "Luke Skywalker"
  // e.g., "Luke Skywalker (Tatooine)" → "Luke Skywalker"
  const characterName = minifig.name.split(/\s*[-,(]\s*/)[0].trim();

  const characterVariants = await prisma.minifigCatalog.findMany({
    where: {
      AND: [
        { minifigure_no: { not: itemNo } },
        { search_name: { contains: characterName.toLowerCase() } },
        { category_id: minifig.category_id }
      ]
    },
    orderBy: { year_released: 'desc' }
  });

  // Fetch similar set minifigs (nearby item numbers: 4 before, 4 after)
  // Extract prefix and number from item (e.g., "sw1507" → prefix="sw", num=1507)
  const match = itemNo.match(/^([a-z]+)(\d+)([a-z])?$/i);
  let themeMinifigs: any[] = [];

  if (match) {
    const prefix = match[1];
    const currentNum = parseInt(match[2]);

    // Try to get 4 before and 4 after
    const minNum = Math.max(1, currentNum - 4);
    const maxNum = currentNum + 4;

    // Generate possible item numbers
    const targetNumbers: string[] = [];
    for (let i = minNum; i <= maxNum; i++) {
      if (i !== currentNum) {
        targetNumbers.push(`${prefix}${i.toString().padStart(match[2].length, '0')}`);
      }
    }

    // Query for these specific item numbers
    const foundMinifigs = await prisma.minifigCatalog.findMany({
      where: {
        minifigure_no: { in: targetNumbers },
        category_id: minifig.category_id
      },
      orderBy: { minifigure_no: 'asc' }
    });

    // If we didn't find 8, expand the range to get more
    if (foundMinifigs.length < 8) {
      const needed = 8 - foundMinifigs.length;
      const expandedMin = Math.max(1, minNum - needed);
      const expandedMax = maxNum + needed;

      const expandedNumbers: string[] = [];
      for (let i = expandedMin; i < minNum; i++) {
        expandedNumbers.push(`${prefix}${i.toString().padStart(match[2].length, '0')}`);
      }
      for (let i = maxNum + 1; i <= expandedMax; i++) {
        expandedNumbers.push(`${prefix}${i.toString().padStart(match[2].length, '0')}`);
      }

      const additionalMinifigs = await prisma.minifigCatalog.findMany({
        where: {
          minifigure_no: { in: expandedNumbers },
          category_id: minifig.category_id
        },
        orderBy: { minifigure_no: 'asc' }
      });

      themeMinifigs = [...foundMinifigs, ...additionalMinifigs].slice(0, 8);
    } else {
      themeMinifigs = foundMinifigs.slice(0, 8);
    }
  }

  const variantsData = characterVariants.map(m => ({
    no: m.minifigure_no,
    name: m.name,
    image_url: `https://img.bricklink.com/ItemImage/MN/0/${m.minifigure_no}.png`
  }));

  const similarSetsData = themeMinifigs.map(m => ({
    no: m.minifigure_no,
    name: m.name,
    image_url: `https://img.bricklink.com/ItemImage/MN/0/${m.minifigure_no}.png`
  }));

  return <MinifigDetailClient minifig={minifigData} variants={variantsData} similarSets={similarSetsData} />;
}
