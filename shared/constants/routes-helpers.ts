export const ROUTE_HELPERS = {
  productDetail: (slug: string) => `/product/${slug}`,
  productCategory: (categorySlug: string) => `/product-category/${categorySlug}`,
  newsCategory: (categorySlug: string) => `/blog-category/${categorySlug}`,
  newsDetail: (slug: string) => `/blog/${slug}`,
  flashSaleDetail: (slug: string) => `/flash-sale/${slug}`,
}