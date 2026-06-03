// Guest Collection Storage Utilities
// Manages temporary collection in localStorage for unauthenticated users

export interface GuestCollectionItem {
  id: string; // unique ID for localStorage
  itemNo: string; // minifig_no or box_no
  itemType: 'minifig' | 'set';
  name: string;
  imageUrl: string;
  price: number;
  condition: 'new' | 'used';
  quantity: number;
  action: 'sell' | 'keep'; // Whether they want to sell it or keep it
  addedAt: number; // timestamp
}

const STORAGE_KEY = 'figtracker_guest_collection';
const MAX_ITEMS = 100; // Prevent abuse

export function getGuestCollection(): GuestCollectionItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const items = JSON.parse(stored) as GuestCollectionItem[];
    return items;
  } catch (error) {
    console.error('Error reading guest collection:', error);
    return [];
  }
}

export function addToGuestCollection(item: Omit<GuestCollectionItem, 'id' | 'addedAt'>): GuestCollectionItem | null {
  if (typeof window === 'undefined') return null;

  try {
    const items = getGuestCollection();

    // Check if already exists
    const existingIndex = items.findIndex(
      i => i.itemNo === item.itemNo && i.condition === item.condition && i.action === item.action
    );

    if (existingIndex >= 0) {
      // Update quantity
      items[existingIndex].quantity += item.quantity;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return items[existingIndex];
    }

    // Check max items
    if (items.length >= MAX_ITEMS) {
      console.warn('Guest collection limit reached');
      return null;
    }

    // Add new item
    const newItem: GuestCollectionItem = {
      ...item,
      id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      addedAt: Date.now()
    };

    items.push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return newItem;
  } catch (error) {
    console.error('Error adding to guest collection:', error);
    return null;
  }
}

export function removeFromGuestCollection(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    const items = getGuestCollection();
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from guest collection:', error);
  }
}

export function clearGuestCollection(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing guest collection:', error);
  }
}

export function getGuestCollectionTotal(): number {
  const items = getGuestCollection();
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function getGuestCollectionCount(): number {
  const items = getGuestCollection();
  return items.length;
}

export function hasGuestCollection(): boolean {
  return getGuestCollectionCount() > 0;
}
