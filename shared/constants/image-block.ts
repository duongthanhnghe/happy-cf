export const IMAGE_BLOCK_PAGES = {
  HOME: 'home',
  CATEGORY: 'category',
  PRODUCT: 'product',
} as const

export const IMAGE_BLOCK_PAGE_OPTIONS = [
  { title: 'Trang chủ', value: IMAGE_BLOCK_PAGES.HOME },
  { title: 'Danh mục', value: IMAGE_BLOCK_PAGES.CATEGORY },
  { title: 'Chi tiết sản phẩm', value: IMAGE_BLOCK_PAGES.PRODUCT },
]

export type ImageBlockPage =
  typeof IMAGE_BLOCK_PAGES[keyof typeof IMAGE_BLOCK_PAGES]

export const IMAGE_BLOCK_POSITIONS = {
  HERO: 'hero',
  FEATURED: 'featured',
  SIDEBAR: 'sidebar',
  BOTTOM: 'bottom',
} as const

export const IMAGE_BLOCK_POSITION_OPTIONS = [
  { title: 'Hero', value: IMAGE_BLOCK_POSITIONS.HERO },
  { title: 'Nổi bật', value: IMAGE_BLOCK_POSITIONS.FEATURED },
  { title: 'Sidebar', value: IMAGE_BLOCK_POSITIONS.SIDEBAR },
  { title: 'Cuối trang', value: IMAGE_BLOCK_POSITIONS.BOTTOM },
]

export type ImageBlockPosition =
  typeof IMAGE_BLOCK_POSITIONS[keyof typeof IMAGE_BLOCK_POSITIONS]
