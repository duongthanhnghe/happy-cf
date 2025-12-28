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
      <Heading tag="h2" text="Mô tả sản phẩm" align="center" />
      <template v-if="props.description">
        <div class="mt-sm product-detail-description" :class="{active: store.toggleDescription}" :ref="el => store.descRef = el">
          {{ props.description }}
        </div>
        <div v-if="store.isLongDescription" class="text-center">
          <Button color="secondary" :label="store.toggleDescription ? 'Thu gọn':'Xem thêm'" class="weight-medium bg-transparent" @click="store.handleToggleDescription()" />
        </div>
      </template>
      <NoData v-else text="Nội dung đang được cập nhật!" class="mt-ms"/>
    </div>
  </div>
</template>