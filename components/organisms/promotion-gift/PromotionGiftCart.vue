<script lang="ts" setup>
import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import { GIFT_CART } from '@/shared/constants/breakpoints'
import type { AvailablePromotionGiftDTO } from '@/server/types/dto/v1/promotion-gift.dto'
import { usePromotionGiftCart } from '@/composables/promotion-gift/usePromotionGiftCart'
import { toRef } from 'vue'

const props = defineProps<{ items: AvailablePromotionGiftDTO[] }>()

const {
  giftPromotions,
  isLockedPromo,
  isSelectedPromo,
  handleGiftVariantChange,
  handleSelectGift,
} = usePromotionGiftCart(toRef(props, 'items'))

</script>
<template>
  <Card v-if="giftPromotions.length" bg="gradient-3" class="rd-xl mt-md">
    <div class="mb-sm position-relative">
      <Text text="Quà tặng đi kèm" size="md" weight="semibold" />
      <button class="gift-prev swiper-button-prev top-0 mt-0 mr-xs left-auto right-lg"></button>
      <button class="gift-next swiper-button-next top-0 mt-0 right-0"></button>
    </div>

    <swiper
      :modules="[Navigation]"
      :allow-touch-move="false"
      :breakpoints="GIFT_CART"
      :navigation="{
        prevEl: '.gift-prev',
        nextEl: '.gift-next'
      }"
    >
      <swiper-slide v-for="(promo, index) in giftPromotions" :key="index">
        <Card v-if="promo" size="sm" class="flex flex-direction-column gap-sm rd-lg">
          <Text v-if="promo.locked" :text="promo.message" color="danger" class="text-italic" />
          <div v-else>
            <Button
              size="sm"
              :color="isLockedPromo(promo.id) ? 'gray':'black'"
              :label="isSelectedPromo(promo.id) ? 'Đã chọn':'Lấy ngay'"
              :disabled="isLockedPromo(promo.id)"
              @click.prevent="handleSelectGift(promo.id, promo.gifts)"
            />
          </div>
          <ProductItemGiftTemplate2
            v-for="gift in promo.gifts"
            :key="gift.product.id"
            :item="gift.product"
            :quantity="gift.quantity"
            :disabled="isLockedPromo(promo.id)"
            @variant-change="handleGiftVariantChange"
          />
        </Card>
      </swiper-slide>
    </swiper>
  </Card>
</template>
