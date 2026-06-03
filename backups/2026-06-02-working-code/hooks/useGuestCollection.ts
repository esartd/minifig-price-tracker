import { useState, useEffect, useCallback } from 'react';
import {
  GuestCollectionItem,
  getGuestCollection,
  addToGuestCollection,
  removeFromGuestCollection,
  clearGuestCollection,
  getGuestCollectionTotal,
  getGuestCollectionCount,
} from '@/lib/guestCollectionStorage';

export function useGuestCollection() {
  const [items, setItems] = useState<GuestCollectionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  // Load items from localStorage on mount
  useEffect(() => {
    refreshItems();
  }, []);

  const refreshItems = useCallback(() => {
    const loadedItems = getGuestCollection();
    const loadedTotal = getGuestCollectionTotal();
    const loadedCount = getGuestCollectionCount();

    setItems(loadedItems);
    setTotal(loadedTotal);
    setCount(loadedCount);
  }, []);

  const addItem = useCallback((item: Omit<GuestCollectionItem, 'id' | 'addedAt'>) => {
    const added = addToGuestCollection(item);
    if (added) {
      refreshItems();
      return true;
    }
    return false;
  }, [refreshItems]);

  const removeItem = useCallback((id: string) => {
    removeFromGuestCollection(id);
    refreshItems();
  }, [refreshItems]);

  const clearAll = useCallback(() => {
    clearGuestCollection();
    refreshItems();
  }, [refreshItems]);

  return {
    items,
    total,
    count,
    addItem,
    removeItem,
    clearAll,
    refreshItems,
  };
}
