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

  // Fetch similar set minifigs (same category and year)
  const themeMinifigs = await prisma.minifigCatalog.findMany({
    where: {
      AND: [
        { minifigure_no: { not: itemNo } },
        { category_id: minifig.category_id },
        { year_released: minifig.year_released || undefined }
      ]
    },
    orderBy: { minifigure_no: 'asc' },
    take: 8
  });

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
