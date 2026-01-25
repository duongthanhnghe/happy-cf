<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import { computed, toRef } from 'vue'
import type { PromotionGiftItemDTO, AvailablePromotionGiftDTO } from '@/server/types/dto/v1/promotion-gift.dto'
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'
import { usePromotionGiftCart } from '@/composables/promotion-gift/usePromotionGiftCart'

const props = defineProps<{
  items: AvailablePromotionGiftDTO[]
}>()

const {
  giftPromotions,
} = usePromotionGiftCart(toRef(props, 'items'))
</script>

<template>
  <Card v-if="giftPromotions && giftPromotions.length > 0" bg="gradient-3" class="rd-xl mt-md">
    <div class="flex gap-xs">
      <MaterialIcon name="featured_seasonal_and_gifts" weight="light" size="normal"/>
      <Text text="Quà tặng đi kèm" color="black" weight="semibold" size="normal" class="line-height-1 mb-sm" />
    </div>
    <swiper
      v-if="giftPromotions.length"
      :modules="[Pagination]"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
    >
      <swiper-slide v-for="(promo, index) in giftPromotions" :key="index">
        <Card v-if="promo" size="sm" class="flex flex-direction-column gap-sm rd-lg">
          <Text v-if="promo.locked" :text="promo.message" color="danger" class="text-italic" />

          <ProductItemGiftTemplate1
            v-for="gift in promo.gifts"
            :key="gift.product.id"
            :item="gift.product"
            :quantity="gift.quantity"
          />
        </Card>
      </swiper-slide>
    </swiper>
  </Card>
</template>