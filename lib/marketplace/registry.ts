/**
 * The list of marketplaces the export tool supports.
 *
 * Adding a marketplace means writing an adapter and adding it here — nothing
 * in the pipeline, the API routes, or the UI needs to know its name.
 */

import type { MarketplaceAdapter } from './types';
import { whatnotAdapter } from './adapters/whatnot';
import { bricklinkAdapter } from './adapters/bricklink';
import { ebayAdapter } from './adapters/ebay';

export const ADAPTERS: ReadonlyArray<MarketplaceAdapter<any, any>> = [
  whatnotAdapter,
  bricklinkAdapter,
  ebayAdapter,
];

export const MARKETPLACE_IDS = ADAPTERS.map((a) => a.id);

export function getAdapter(id: string): MarketplaceAdapter<any, any> | null {
  return ADAPTERS.find((a) => a.id === id) ?? null;
}

/** Lightweight descriptor for the client, so the UI doesn't import adapter internals. */
export interface MarketplaceInfo {
  id: string;
  label: string;
  fileExtension: string;
  needsImages: boolean;
}

export const MARKETPLACES: ReadonlyArray<MarketplaceInfo> = ADAPTERS.map((a) => ({
  id: a.id,
  label: a.label,
  fileExtension: a.fileExtension,
  needsImages: a.needsImages,
}));
