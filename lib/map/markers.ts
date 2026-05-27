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

function hexChannelPairToLinear(channel: string) {
  const normalized = parseInt(channel, 16) / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string) {
  const sanitized = hex.replace('#', '');
  const red = hexChannelPairToLinear(sanitized.slice(0, 2));
  const green = hexChannelPairToLinear(sanitized.slice(2, 4));
  const blue = hexChannelPairToLinear(sanitized.slice(4, 6));

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(luminanceA: number, luminanceB: number) {
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

export function textColorForCommodity(commodity: string) {
  const backgroundLuminance = relativeLuminance(colorForCommodity(commodity));
  const lightText = '#ffffff';
  const darkText = '#0f172a';
  const lightContrast = contrastRatio(backgroundLuminance, relativeLuminance(lightText));
  const darkContrast = contrastRatio(backgroundLuminance, relativeLuminance(darkText));

  return darkContrast > lightContrast ? darkText : lightText;
}

export function primaryCommodityColor(commodities: string[]) {
  if (commodities.length === 0) {
    return commodityColors.Other;
  }

  return colorForCommodity(commodities[0]);
}