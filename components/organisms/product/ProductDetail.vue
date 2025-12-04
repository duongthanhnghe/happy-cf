<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue';
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { formatCurrency } from '@/utils/global';
import { useAccountStore } from "@/stores/client/users/useAccountStore";
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import type { ProductDTO } from "@/server/types/dto/v1/product.dto";
import { useWishlistStore } from '@/stores/client/users/useWishlistStore';

const store = useProductDetailStore();
const storeWishlist = useWishlistStore();
const storeAccount = useAccountStore();
const storeDisplay = useDisplayStore();
const detail: ProductDTO | null = store.getDetailProduct

onMounted(async() => {
  if (storeAccount.getUserId) {
    await storeWishlist.fetchWishlist(storeAccount.getUserId);
  }
  window.addEventListener('scroll', store.onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', store.onScroll);
});
</script>

<template>
  <div class="product-detail" v-if="detail">
    <div id="product-detail-info" :class="storeDisplay.isLaptop ? 'container pb-3xl':'overflow-hidden pb-section'">
      <div class="row">
        <div class="col-12 col-lg-6">
            <template v-if="detail.listImage.length > 0">
              <client-only>
                <ProductDetailGallerySwiper :detail="detail" />
              </client-only>
            </template>
            <div v-else class="product-detail-gallery bg-gray6">
              <img :src="detail.image" :alt="detail.productName" />
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
            <div class="flex gap-sm align-center mt-xs">
              <Text :text="formatCurrency(detail.priceDiscounts)" size="md" weight="semibold" color="black" />
              <template v-if="detail.priceDiscounts !== detail.price">
                <Text :text="formatCurrency(detail.price)" size="md" color="gray5" class="text-line-through" />
                <span class="product-detail-percent">{{ store.percentDiscount }}</span>
              </template>
            </div>

            <ListVoucherByProduct :items="store.getVoucherProduct" :loading="store.loadingListVoucher" v-if="store.getVoucherProduct.length > 0" class="mt-ms" />
            <client-only>
            <CartPointInfoLabel :getTotalPoint="store.getTotalPoint" v-if="detail.priceDiscounts !== 0 && storeAccount.getUserId"/>
            </client-only>
            <ProductDetailOptions v-if="detail.variantGroups.length > 0" :variantGroups="detail.variantGroups" />
            <div class="mt-md">
              <ProductDetailButtonOrder v-if="detail.amount !== 0" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ProductDetailDescription v-if="detail.description" :description="detail.description" />
    <ProductDetailFixedMobile v-if="storeDisplay.isMobileTable" :detail="detail" :class="{ hide: store.isDetailInfoActive }" />
    <ProductDetailFixedPC v-else :detail="detail" :class="{ hide: store.isDetailInfoActive }" />
  </div>

  <PopupProductDetailNote />
</template>