<script lang="ts" setup>
import './index.scss';
import { watch } from 'vue';
import { useProductCategory } from '@/composables/product/useProductCategory';
import { useProductCategoryMenu } from './useProductCategoryMenu';

const useHandle = useProductCategoryMenu();
const { getListCategory, fetchCategoryList } = useProductCategory();

watch(() => getListCategory.value, (newValue) => {
  if(!newValue) {
    fetchCategoryList()
  } else useHandle.handleItemClickScroll(newValue[0].id)
}, { immediate: true })

</script>

<template>
<div class="category-menu">
<template v-if="getListCategory && getListCategory.length > 0">
  <template v-for="category, in getListCategory" >
    <div :class="['category-item', { active: useHandle.elActive.value === category.id }]" @click="useHandle.handleItemClickScroll(category.id)" :id="`scroll-${category.id}`">
      <img class="category-item-src" :src="category.image" :alt="category.categoryName" />
      <div class="category-item-title" :class="['category-item-title', { active: useHandle.elActive.value === category.id }]">{{ category.categoryName }}</div>
    </div>
  </template>
  </template>
</div>
</template>