import { ref } from "vue";
import type { Swiper as SwiperClass } from 'swiper';

export const useProductDetailState = () => {
  const limitRelated = 12
  const limitReview = 3
  const pageReview = ref('1')
  const popups = ref({
    order: false,
    edit: false,
  });
  const toggleDescription = ref(false)
  const mainSwiper = ref<SwiperClass | null>(null)
  const thumbsSwiper = ref<SwiperClass | null>(null)
  const breakpoints = {
    320: { slidesPerView: 2.3, spaceBetween: 10 },
    640: { slidesPerView: 3, spaceBetween: 10 },
    1024: { slidesPerView: 3, spaceBetween: 10 },
    1200: { slidesPerView: 4, spaceBetween: 24 }
  }
  const descRef = ref<HTMLElement | null>(null)
  const isLongDescription = ref(false)
  const isTogglePopupNote = ref(false)
  const isDetailInfoActive = ref(true)
  const elScrollInfo = 'product-detail-info'

  return {
    limitRelated,
    limitReview,
    pageReview,
    popups,
    toggleDescription,
    mainSwiper,
    thumbsSwiper,
    breakpoints,
    descRef,
    isLongDescription,
    isTogglePopupNote,
    isDetailInfoActive,
    elScrollInfo,
  };
};