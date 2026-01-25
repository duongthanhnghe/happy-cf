import type { SwiperOptions } from "swiper/types";

export const PRODUCT_CATEGORY: SwiperOptions['breakpoints'] = {
  320: { slidesPerView: 2.2, spaceBetween: 10 },
  640: { slidesPerView: 3, spaceBetween: 10 },
  1024: { slidesPerView: 3.5, spaceBetween: 10 },
  1200: { slidesPerView: 4, spaceBetween: 16 },
  1400: { slidesPerView: 5, spaceBetween: 16 },
  1920: { slidesPerView: 6, spaceBetween: 16 },
} as const;

export const POPUP_HEADER_SEARCH: SwiperOptions['breakpoints'] = {
  320: { slidesPerView: 2.2, spaceBetween: 10 },
  640: { slidesPerView: 3, spaceBetween: 10 },
} as const;

export const PRODUCT_CATEGORY_ALL: SwiperOptions['breakpoints'] = {
  320: { 
    slidesPerView: 4, 
    spaceBetween: 8,
    grid: {
      rows: 2,
      fill: 'row'
    }
  },
  480: { 
    slidesPerView: 5, 
    spaceBetween: 8,
    grid: {
      rows: 2,
      fill: 'row'
    }
  },
  640: { 
    slidesPerView: 3, 
    spaceBetween: 10,
    grid: {
      rows: 2,
      fill: 'row'
    }
  },
  1024: {
    slidesPerView: 6,
    spaceBetween: 16,
    grid: {
      rows: 2,
      fill: 'row'
    },
  },
  1400: {
    slidesPerView: 6,
    spaceBetween: 16,
    grid: {
      rows: 2,
      fill: 'row'
    },
  },
}

export const PRODUCT_LIST_SWIPER_DEFAULT: SwiperOptions['breakpoints'] = {
  320: { slidesPerView: 2.2, spaceBetween: 10 },
  640: { slidesPerView: 3, spaceBetween: 10 },
  1024: { slidesPerView: 3, spaceBetween: 10 },
  1200: { slidesPerView: 4, spaceBetween: 16 },
  1400: { slidesPerView: 5, spaceBetween: 16 },
  1920: { slidesPerView: 6, spaceBetween: 16 },
}

export const NEWS_LIST_SWIPER_DEFAULT: SwiperOptions['breakpoints'] = {
  320: { slidesPerView: 1, spaceBetween: 0 },
  640: { slidesPerView: 2, spaceBetween: 10 },
  1024: { slidesPerView: 3, spaceBetween: 10 },
  1200: { slidesPerView: 3, spaceBetween: 16 },
  1920: { slidesPerView: 4, spaceBetween: 16 },
}

export const GIFT_CART: SwiperOptions['breakpoints'] = {
  320: { slidesPerView: 1, spaceBetween: 0 },
  640: { slidesPerView: 2, spaceBetween: 12 },
} as const;