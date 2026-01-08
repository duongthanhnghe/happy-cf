<script lang="ts" setup>
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
  <template v-if="props.loading"></template>
  <div v-else>
    <template v-for="category, in props.items" >
      <div v-if="useHandle.elActive.value === category.id" class="text-center cursor-pointer pt-ms pb-ms pl-xs pr-xs shadow-2'" @click="useHandle.handleItemClickScroll(category.id)" :id="`scroll-${category.id}`">
        <Image 
          :src="category.image"
          :alt="category.categoryName"
          class="rd-xl shadow-1"
          :width="60"
        />
        <Text :text="category.categoryName" size="xs" weight="semibold" limit="2" class="mt-xs max-width-70"/>
      </div>
      <div v-else class="text-center cursor-pointer pt-ms pb-ms pl-xs pr-xs" @click="useHandle.handleItemClickScroll(category.id)" :id="`scroll-${category.id}`">
        <Text :text="category.categoryName" size="xs" limit="2" class="max-width-70" />
      </div>
    </template>
  </div>
</template>