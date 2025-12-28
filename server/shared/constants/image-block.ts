export const IMAGE_BLOCK_PAGES = {
  HOME: 'home',
  CATEGORY: 'category',
  PRODUCT: 'product',
} as const

export type ImageBlockPage =
  typeof IMAGE_BLOCK_PAGES[keyof typeof IMAGE_BLOCK_PAGES]

export const IMAGE_BLOCK_POSITIONS = {
  HERO: 'hero',
  FEATURED: 'featured',
  SIDEBAR: 'sidebar',
  BOTTOM: 'bottom',
} as const

export type ImageBlockPosition =
  typeof IMAGE_BLOCK_POSITIONS[keyof typeof IMAGE_BLOCK_POSITIONS]
