<script lang="ts" setup>
import {
  useCartStore
} from '@/stores/client/product/useCartOrderStore'
import '@/styles/molecules/order/payment-item-template1.scss'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  nameRadio: {
    type: String,
    default: '',
  }
})

const store = useCartStore();
const isSelected = (id: string) => {
  if(!id) return
  return store.getPaymentSelected === id;
}
</script>
<template>
  <div :class="['payment-template1-item', isSelected(props.item.id) ? 'checked' : '']">
       <v-radio :label="props.item.name" :value="props.item.id" :name="nameRadio"></v-radio>
      <div class="payment-template1-info">
        <img class="payment-template1-image" :src="props.item.image" :alt="props.item.name" />
      </div>
  </div>
</template>