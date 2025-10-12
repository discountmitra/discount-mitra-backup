// Central assets index file for managing all image references
// This makes it easy to swap images or update paths in the future

export const Assets = {
  // Default images
  default: require('../assets/default.png'),
  
  // VIP and promotional images
  vipBanner: require('../assets/vip-banner.png'),
  deal: require('../assets/deal.png'),
  
  // Illustrations
  noData: require('../assets/no-data.svg'),
  soon: require('../assets/soon.svg'),
  
  // App icons and branding
  logo: require('../assets/logo.png'),
  
  // Sample images (if any)
  c1: require('../assets/c1.png'),
  c2: require('../assets/c2.jpg'),
  c3: require('../assets/c3.jpg'),
} as const;

// Type for asset keys
export type AssetKey = keyof typeof Assets;

// Helper function to get asset by key
export const getAsset = (key: AssetKey) => Assets[key];

// Helper function to check if asset exists
export const hasAsset = (key: string): key is AssetKey => key in Assets;

// Individual exports for convenience
export const defaultImage = Assets.default;
export const vipBannerImage = Assets.vipBanner;
export const logoImage = Assets.logo;
