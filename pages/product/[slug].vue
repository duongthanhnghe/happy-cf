<script lang="ts" setup>
import { ref, watch } from "vue"
import { ROUTES } from '@/shared/constants/routes'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { formatCurrency } from '@/utils/global';
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.DETAIL.middleware ?? { middleware: ['product-detail'] },
})

const store = useProductDetailStore()
const storeCart = useCartStore();
const valueChangePage = ref<boolean|null>(null)

watch(valueChangePage, (newVal) => {
  if(newVal !== null) store.handleChangePage(newVal)
  valueChangePage.value = null
})
</script>

<template>
  <div>
    <div class="container pt-section pb-section" v-if="store.getDetail">
      percentDiscount: {{ store.percentDiscount }}
      getTotalReview: {{ store.getSummaryReview?.averageRating }}
      totalReviews: {{ store.getSummaryReview?.totalReviews }}
      <div>
        price: {{ store.getDetail.price }}
        priceDiscounts: {{ store.getDetail.priceDiscounts }}
      </div>
      <Button :color="`${store.isFavorite ? 'black' : 'secondary'}`" icon="favorite" @click.prevent="store.toggleLike(store.getDetail.id)"/>


      <template v-if="store.getDetail?.options.length > 0">
        <v-radio-group hide-details v-model="storeCart.selectedOptionsData[item.id]" :name="`radio-group-${item.id}`" :key="item.id" v-for="item in store.getDetail?.options" class="mt-sm mb-sm popup-detail-product-card">
          <Heading tag="div" size="md" weight="semibold" class="black pt-sm pl-ms pr-ms">
            {{ item.name }}
          </Heading>
          <v-radio v-for="variant in item.variants" class="popup-detail-product-variant" rel="js-popup-detail-variant-item" :value="variant.id">
            <template #label>
              <div class="flex justify-between w-full">
                {{ variant.name }}
                <span v-if="variant.priceModifier !== 0">+{{ formatCurrency(variant.priceModifier) }}</span>
                <span v-else>0</span>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </template>

      <div class="popup-detail-product-card pb-md">
        <Heading tag="div" size="md" weight="semibold" class="black mb-sm">
          Them luu y cho quan
        </Heading>
        <v-textarea class="mb-0" :rows="5" v-model="store.note"/>
        <div class="flex justify-center">
          <Button color="gray" icon="check_indeterminate_small" @click="store.inDecrement(false)" />
          <Button :disabled="true" :border="false" color="secondary" class="popup-detail-product-quantity pd-0 text-size-large weight-medium">{{ store.quantity }}</Button>
          <Button color="gray" icon="add" @click="store.inDecrement(true)" />
        </div>
      </div>

      <Button
        :label="'Đặt hàng - ' + formatCurrency(store.priceTotal)"
        class="w-full"
        color="primary"
        @handleOnClick="store.handleAddToCart()"
      />
      <!-- <div>
      {{ store.getDetail.productName }}
      </div>
      <p>{{ store.getDetail.summaryContent }}</p>
      <template v-if="store.getListItems">
        <div v-for="item in store.getListItems" :key="item.id">
          <div class="mt-md">
            {{ item.productName }}
          </div>
        </div>
      </template> -->

      <!-- <template v-if="store.getListReviewProduct">
        <div v-for="item in store.getListReviewProduct" :key="item.id">
          <div class="mt-md">
            {{ item.comment }}
          </div>
        </div>
        <template v-if="store.getTotalPages && store.getTotalPages.length > 1">
          <div class="flex gap-sm justify-end">
            <Pagination :totalPages="store.getTotalPages" v-model:page="store.pageReview" v-model:valueChangePage="valueChangePage" />
          </div>
        </template>
      </template> -->
    </div>
    <div v-else>
      <p>Đang tải dữ liệu...</p>
    </div>
  </div>
</template>