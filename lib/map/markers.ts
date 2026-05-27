export type CommodityKey = 'Nickel' | 'Copper' | 'PGE' | 'Gold' | 'Graphite' | 'Lithium' | 'Other';

const commodityColors: Record<CommodityKey, string> = {
  Nickel: '#1d4ed8',
  Copper: '#ea580c',
  PGE: '#7c3aed',
  Gold: '#ca8a04',
  Graphite: '#374151',
  Lithium: '#059669',
  Other: '#6b7280',
};

export function colorForCommodity(commodity: string) {
  return commodityColors[commodity as CommodityKey] ?? commodityColors.Other;
}

export function primaryCommodityColor(commodities: string[]) {
  if (commodities.length === 0) {
    return commodityColors.Other;
  }

  return colorForCommodity(commodities[0]);
}