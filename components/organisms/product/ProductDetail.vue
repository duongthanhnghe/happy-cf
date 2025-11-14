<script lang="ts" setup>
import { ref, watch } from "vue"
import { ROUTES } from '@/shared/constants/routes'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { formatCurrency } from '@/utils/global';
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import type { ProductDTO } from "@/server/types/dto/v1/product.dto";

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.DETAIL.middleware ?? { middleware: ['product-detail'] },
})

const store = useProductDetailStore()
const storeCart = useCartStore()
const valueChangePage = ref<boolean|null>(null)
const detail: ProductDTO | null = store.getDetailProduct

watch(valueChangePage, (newVal) => {
  if(newVal !== null) store.handleChangePage(newVal)
  valueChangePage.value = null
})

</script>

<template>
  <template v-if="detail">

    <div class="container pt-section pb-section" >
      percentDiscount: {{ store.percentDiscount }}
      getTotalReview: {{ store.getSummaryReview?.averageRating }}
      totalReviews: {{ store.getSummaryReview?.totalReviews }}
      <div>
        price: {{ detail.price }}
        priceDiscounts: {{ detail.priceDiscounts }}
      </div>
      <Button :color="`${store.isFavorite ? 'black' : 'secondary'}`" icon="favorite" @click.prevent="store.toggleLike(detail.id)"/>

      <template v-if="detail.options.length > 0">
        <v-radio-group hide-details v-model="storeCart.selectedOptionsData[item.id as any]" :name="`radio-group-${item.id}`" :key="item.id" v-for="item in detail.options" class="mt-sm mb-sm popup-detail-product-card">
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
        <v-textarea class="mb-0" :rows="5" v-model="storeCart.note"/>
        <div class="flex justify-center">
          <Button color="gray" icon="check_indeterminate_small" @click="storeCart.inDecrement(false)" />
          <Button :disabled="true" :border="false" color="secondary" class="popup-detail-product-quantity pd-0 text-size-large weight-medium">{{ storeCart.quantity }}</Button>
          <Button color="gray" icon="add" @click="storeCart.inDecrement(true)" />
        </div>
      </div>

      <Button
        :label="'Đặt hàng - ' + formatCurrency(storeCart.priceTotal)"
        class="w-full"
        color="primary"
        @handleOnClick="store.handleAddToCart()"
      />
      <div>
      {{ detail.productName }}
      </div>
      <p>{{ detail.summaryContent }}</p>

    </div>
  </template>
</template>