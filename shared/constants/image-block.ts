export const IMAGE_BLOCK_PAGES = {
  HOME: 'home',
  CATEGORY: 'category',
  PRODUCT: 'product',
  PRODUCT_NEW: 'product-new',
  PRODUCT_SELLER: 'product-seller',
  PRODUCT_SALE: 'product-sale',
} as const

export const IMAGE_BLOCK_PAGE_OPTIONS = [
  { title: 'Trang chủ', value: IMAGE_BLOCK_PAGES.HOME },
  { title: 'Danh mục', value: IMAGE_BLOCK_PAGES.CATEGORY },
  { title: 'Chi tiết sản phẩm', value: IMAGE_BLOCK_PAGES.PRODUCT },
  { title: 'Trang SP mới nhất', value: IMAGE_BLOCK_PAGES.PRODUCT_NEW },
  { title: 'Trang SP bán chạy', value: IMAGE_BLOCK_PAGES.PRODUCT_SELLER },
  { title: 'Trang SP khuyến mãi', value: IMAGE_BLOCK_PAGES.PRODUCT_SALE },
]

export const IMAGE_BLOCK_POSITIONS = {
  HERO: 'hero',
  FEATURED: 'featured',
  SIDEBAR: 'sidebar',
  BOTTOM: 'bottom',
  FIXED: 'fixed',
} as const

export const IMAGE_BLOCK_POSITION_OPTIONS = [
  { title: 'Hero', value: IMAGE_BLOCK_POSITIONS.HERO },
  { title: 'Nổi bật', value: IMAGE_BLOCK_POSITIONS.FEATURED },
  { title: 'Sidebar', value: IMAGE_BLOCK_POSITIONS.SIDEBAR },
  { title: 'Cuối trang', value: IMAGE_BLOCK_POSITIONS.BOTTOM },
  { title: 'Giữa màn hình', value: IMAGE_BLOCK_POSITIONS.FIXED },
]
