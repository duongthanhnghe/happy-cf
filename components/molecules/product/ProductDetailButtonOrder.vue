<script lang="ts" setup>
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'

const store = useProductDetailStore()
const storeCart = useCartStore()

</script>

<template>
  <div class="flex gap-sm">
    <div class="product-detail-button-order flex-1">
      <div v-if="store.getCheckButtonOrder" class="product-detail-button-order-action bg-white-20 rd-lg flex justify-center">
        <Button color="transparent" icon="check_indeterminate_small" @click="storeCart.inDecrement(false)" />
        <Button :disabled="true" :border="false" color="transparent" class="pd-0 text-size-normal opacity-1 weight-normal">{{ storeCart.quantity }}</Button>
        <Button color="transparent" icon="add" @click="storeCart.inDecrement(true)" />
      </div>
      <Button
        :label="store.getCheckButtonOrder ? 'Thêm vào giỏ hàng' : 'Tạm hết hàng'"
        :disabled="!store.getCheckButtonOrder"
        :class="[{'product-detail-button-order-add': store.getCheckButtonOrder}, 'w-full']"
        color="primary"
        @handleOnClick="store.handleAddToCart()"
      />
    </div>
    <Button
      v-if="store.getCheckButtonOrder"
      icon="edit"
      color="secondary"
      @click.prevent="store.handleTogglePopupNote(true)"
    />
  </div>
</template>