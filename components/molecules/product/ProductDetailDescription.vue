<script lang="ts" setup>
import { nextTick, onMounted } from 'vue';
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'

const store = useProductDetailStore()
const props = defineProps<{
  description: string | number | null
}>()

onMounted(async () => {
  await nextTick()
  const el = store.descRef?.value;
  if (el) {
    store.isLongDescription.value = el.scrollHeight > 299;
  }
})
</script>

<template>
  <div class="bg-gray6">
    <div class="container pt-section pb-section">
      <Text text="Mo ta san pham" size="md" weight="semibold" align="center" color="black" />
      <div class="mt-sm product-detail-description" :class="{active: store.toggleDescription}" :ref="el => store.descRef = el">
        {{ props.description }}
      </div>
      <div v-if="store.isLongDescription" class="text-center">
        <Button color="secondary" :label="store.toggleDescription ? 'Thu gon':'Xem them'" class="weight-medium bg-transparent" @click="store.handleToggleDescription()" />
      </div>
    </div>
  </div>
</template>