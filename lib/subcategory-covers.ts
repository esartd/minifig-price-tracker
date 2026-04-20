// Subcategory cover images configuration
// Maps subcategory names to their hero minifigure image

export const SUBCATEGORY_COVERS: Record<string, string> = {
  // Castle
  'Castle / Black Knights': 'cas235', // Scale Mail - Red with Black Arms, Light Gray Legs with Black Hips, Dark Gray Chin-Guard, Quiver
};

export function getSubcategoryCover(themeName: string, subcategoryName: string): string | null {
  const fullCategory = subcategoryName === 'Uncategorized'
    ? themeName
    : `${themeName} / ${subcategoryName}`;

  const minifigNo = SUBCATEGORY_COVERS[fullCategory];
  if (!minifigNo) return null;

  return `https://img.bricklink.com/ItemImage/MN/0/${minifigNo}.png`;
}
