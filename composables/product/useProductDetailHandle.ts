import { computed, nextTick, watch } from "vue";
import type { Ref } from "vue";
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';
import type { ProductReviewPaginationDTO } from '@/server/types/dto/v1/product-review.dto';
import type { Swiper as SwiperClass } from 'swiper';
import { useWishlistStore } from '@/stores/client/users/useWishlistStore';

export const useProductDetailHandle = (
  detailData: Ref<ProductDTO | null>,
  listReview: Ref<ProductReviewPaginationDTO | null>,
  toggleDescription: Ref<boolean>,
  mainSwiper: Ref<SwiperClass | null>,
  thumbsSwiper: Ref<SwiperClass | null>,
  isTogglePopupNote: Ref<boolean>,
  isDetailInfoActive: Ref<boolean>,
  elScrollInfo: string,
) => {

  const storeWishlist = useWishlistStore()

  const percentDiscount = computed(() => {
    if (!detailData.value || !detailData.value.price || detailData.value.price <= 0) return "0%";
    return Math.round(((detailData.value.price - (detailData.value.priceDiscounts ?? 0)) / detailData.value.price) * 100) + "%";
  });

  const getSummaryReview = computed(() => listReview.value?.summary);

  const isFavorite = computed(() =>
    storeWishlist.isInWishlist(detailData.value?.id || '')
  )

  const toggleLike = (id: string) => {
    if (storeWishlist.isInWishlist(id)) {
      storeWishlist.handleDeleteWishlist(id)
    } else {
      storeWishlist.handleAddWishlist(id)
    }
  }

  const handleToggleDescription = () => {
    toggleDescription.value = !toggleDescription.value
  }

  const onMainSwiper = async (swiper: SwiperClass) => {
    mainSwiper.value = swiper
  }

  const onThumbSwiper = (swiper: SwiperClass) => {
    thumbsSwiper.value = swiper
  }

  watch([mainSwiper, thumbsSwiper], async ([main, thumb]) => {
    if (!main || !thumb) return

    await nextTick()

    if (main.thumbs) {
      main.thumbs.swiper = thumb
      main.thumbs.init()
      main.thumbs.update(true)
    }
  })

  const handleTogglePopupNote = (value: boolean) => {
    isTogglePopupNote.value = value
  }

  const onScroll = () => {
    const el = document.getElementById(elScrollInfo)
    if (!el) return

    const rect = el.getBoundingClientRect()

    if (rect.bottom > 70) {
      isDetailInfoActive.value = true
    } else {
      isDetailInfoActive.value = false
    }
  }

  return {
    percentDiscount,
    getSummaryReview,
    isFavorite,
    toggleLike,
    handleToggleDescription,
    onMainSwiper,
    onThumbSwiper,
    handleTogglePopupNote,
    onScroll,
  }
}
