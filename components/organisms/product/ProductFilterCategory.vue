<script lang="ts" setup>
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto';
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'
const storeCategoryMain = useCategoryMainStore()
const props = defineProps<{
  categoryName: string;
  list: CategoryProductDTO[];
}>();
</script>
<template>
<v-radio-group v-if="props.list" v-model="storeCategoryMain.filterCategory" hide-details>
  <v-radio
    v-for="item in [{ id: '', categoryName: props.categoryName }, ...props.list]"
    :key="item.id"
    :label="item.categoryName"
    :value="item.id"
  />
</v-radio-group>
</template>