<script lang="ts" setup>
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'
const storeCategoryMain = useCategoryMainStore()
const props = defineProps<{
  categoryName: string;
}>();
</script>
<template>
<v-radio-group v-if="storeCategoryMain.getListCategoryChildren.length > 1" v-model="storeCategoryMain.filterCategory">
  <v-radio
    v-for="item in [{ id: '', categoryName: props.categoryName }, ...storeCategoryMain.getListCategoryChildren]"
    :key="item.id"
    :label="item.categoryName"
    :value="item.id"
  />
</v-radio-group>
</template>