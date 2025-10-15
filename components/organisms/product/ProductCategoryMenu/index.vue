<script lang="ts" setup>
import './index.scss';
import { watch } from 'vue'
import { useProductCategoryMenu } from './useProductCategoryMenu';
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto'

const useHandle = useProductCategoryMenu();

const props = withDefaults(defineProps<{
  items?: CategoryProductDTO[]
  loading?: boolean
}>(), {
  items: () => [],
  loading: false,
})

watch(() => props.items, (newValue) => {
  if(newValue.length > 0) useHandle.handleItemClickScroll(newValue[0].id)
}, { immediate: true })

</script>

<template>
  <div v-if="props.loading">Đang tải dữ liệu...</div>
  <div v-else class="category-menu">
    <template v-for="category, in props.items" >
      <div :class="['category-item', { active: useHandle.elActive.value === category.id }]" @click="useHandle.handleItemClickScroll(category.id)" :id="`scroll-${category.id}`">
        <img class="category-item-src" :src="category.image" :alt="category.categoryName" />
        <div class="category-item-title" :class="['category-item-title', { active: useHandle.elActive.value === category.id }]">{{ category.categoryName }}</div>
      </div>
    </template>
  </div>
</template>