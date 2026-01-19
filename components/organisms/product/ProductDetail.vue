<script lang="ts" setup>
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { formatCurrency, scrollIntoView } from '@/utils/global';
import { useAccountStore } from "@/stores/client/users/useAccountStore";
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import type { ProductDTO } from "@/server/types/dto/v1/product.dto";
import { useWishlistStore } from '@/stores/client/users/useWishlistStore';
import { useCartStore } from '@/stores/client/product/useCartOrderStore';
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { useBaseInformationStore } from '@/stores/client/base-information/useBaseInformationStore';

const { t } = useITranslations()
const store = useProductDetailStore();
const storeCart = useCartStore();
const storeWishlist = useWishlistStore();
const storeAccount = useAccountStore();
const storeDisplay = useDisplayStore();
const storeSetting = useBaseInformationStore();
const detail: ProductDTO | null = store.getDetailProduct

onMounted(async() => {
  await storeSetting.fetchSystemConfig()
  if (storeAccount.getUserId) {
    await storeWishlist.fetchWishlist(storeAccount.getUserId);
  }

  window.addEventListener('scroll', store.onScroll);
});

// auto select variant lan dau vao trang
watch(
  () => store.getVariantGroupsUI,
  (groups) => {
    if (!groups?.length) return
    if (Object.keys(storeCart.tempSelected).length > 0) return

    storeCart.autoSelectFirstVariants(groups)
  },
  { immediate: true }
)

// auto select variant sau khi submit button order
// watch(
//   () => storeCart.needAutoSelect,
//   () => {
//     const groups = store.getVariantGroupsUI
//     if (!groups?.length) return

//     storeCart.autoSelectFirstVariants(groups)
//   }
// )

watch(
  () => storeCart.getPopupState('edit'),
  (isOpen) => {
    if (!isOpen) {
      storeCart.clearTempSelected()

      const groups = store.getVariantGroupsUI
      if (!groups?.length) return

      if (Object.keys(storeCart.tempSelected).length === 0) {
        storeCart.autoSelectFirstVariants(groups)
      }
    }
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('scroll', store.onScroll);
  storeCart.clearTempSelected()
  store.isDetailInfoActive = true
});

</script>

<template>
  <div class="product-detail" v-if="detail">
    <div id="product-detail-info" :class="storeDisplay.isLaptop ? 'container pb-3xl':'overflow-hidden pb-section'">
      <div class="row">
        <div class="col-12 col-lg-6">
          <template v-if="store.galleryImages.length > 1">
            <client-only>
              <ProductDetailGallerySwiper :detail="detail" />
            </client-only>
          </template>
          <div v-else class="product-detail-gallery bg-gray6">
            <div>
              <Image 
                :src="detail.image" 
                :alt="detail.productName"
                :width="700"
              />
            </div>
            <div v-if="detail.vouchers?.image" class="w-full">
              <Image 
                :src="detail.vouchers?.image"
                :alt="detail.productName"
                :width="700"
              />
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div :class="storeDisplay.isMobileTable ? 'container':''" >
            <div :class="['flex justify-between', storeDisplay.isMobileTable ? 'mt-ms' : '']">
              <Text :text="detail.productName" :size="storeDisplay.isMobileTable ? 'lg':'xl'" weight="semibold" color="black" class="line-height-1d4" />
              <client-only>
                <Button v-if="storeWishlist.loaded" :color="store.isFavorite ? 'black' : 'secondary'" size="sm" icon="favorite" :border="false" @click.prevent="store.toggleLike(detail.id)"/>
              </client-only>
            </div>

            <div v-if="store.getSummaryReview?.averageRating !== 0" class="flex align-end gap-xs mb-sm mt-sm pb-sm border-bottom-default border-color-gray2">
              <v-rating
                readonly
                :model-value="store.getSummaryReview?.averageRating"
                :size="20"
                active-color="orange"
              >
              </v-rating>
              <Text :text="`(${store.getSummaryReview?.averageRating})`" color="gray5" class="line-height-1d2"/>
              <Text @click="scrollIntoView('list-review-by-product')" :text="t('product.detail.text7')" color="gray5" class="cursor-pointer line-height-1d2 text-underline ml-xs"/>
            </div>

            <div class="flex align-end gap-sm align-center justify-between mt-xs">
              <template v-if="!detail.variantCombinations.length">
                <div class="flex align-end gap-sm align-center">
                  <Text :text="formatCurrency(detail.priceDiscounts)" size="lg" weight="semibold" color="black" />
                  <template v-if="detail.priceDiscounts !== detail.price">
                    <Text :text="formatCurrency(detail.price)" size="lg" color="gray5" class="text-line-through" />
                    <Button tag="span" color="primary" size="sm" :label="store.percentDiscount" class="pl-sm pr-sm" />
                  </template>
                </div>
                <client-only>
                  <template v-if="detail.priceDiscounts && storeSetting.getConfigShipping?.enabled">
                    <v-chip v-tooltip.left="storeSetting.getShippingTooltip" v-if="storeSetting.calcFreeship(detail.priceDiscounts)" label color="blue">
                      Freeship
                    </v-chip>
                  </template>
                </client-only>
              </template>
              <template v-else>
                <Text :text="formatCurrency(store.variantPrice)" size="md" weight="semibold" color="black" />
                <client-only>
                  <template v-if="store.variantPrice && storeSetting.getConfigShipping?.enabled">
                    <v-chip v-tooltip.left="storeSetting.getShippingTooltip" v-if="storeSetting.calcFreeship(store.variantPrice)" label color="blue">
                      Freeship
                    </v-chip>
                  </template>
                </client-only>
              </template>
            </div>

            <ListVoucherByProduct :items="store.getVoucherProduct" :loading="store.loadingListVoucher" v-if="store.getVoucherProduct.length > 0" class="mt-ms" />
            <client-only>
            <CartPointInfoLabel v-if="detail.priceDiscounts !== 0" :getTotalPoint="store.getTotalPoint" :userId="storeAccount.getUserId" />
            </client-only>

            <div class="flex flex-direction-column gap-ms mt-ms" v-if="detail.variantCombinations.length">
              <ProductDetailOptions :variantCombinations="detail.variantCombinations" showHeading showStock />
            </div>
           
            <div class="mt-md">
              <ProductDetailButtonOrder classButton="text-size-normal" />
            </div>
            <ProductDetailPolicy />
          </div>
        </div>
      </div>
    </div>

    <ProductDetailDescription :description="detail.description" />
    <ProductDetailFixedMobile v-if="storeDisplay.isMobileTable" :detail="detail" :class="{'opacity-0 visibility-hidden': store.isDetailInfoActive }" />
    <ProductDetailFixedPC v-else :detail="detail" :variantPrice="store.variantPrice" :class="{'opacity-0 visibility-hidden': store.isDetailInfoActive }" />
  </div>

  <PopupProductDetailNote />
</template>