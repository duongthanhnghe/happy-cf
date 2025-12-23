
<script lang="ts" setup>
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto';
import { ROUTES } from '@/shared/constants/routes';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const storeDisplay = useDisplayStore()
const props = defineProps<{
  item: CategoryProductDTO
}>()

</script>

<template>
  <Card :size="storeDisplay.isMobileTable ? 'xs':'sm'" :bg="storeDisplay.isMobileTable ? 'transparent':'gray6'" class="rd-lg text-center">
    <NuxtLink :to="`${ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.path}/${item.slug}`">
    <div class="mb-sm">
      <img v-if=item.image :src="item.image" :alt="item.categoryName" width="65" class="bg-white rd-xxl shadow-1"/>
    </div>
      <Text :text="item.categoryName" :size="storeDisplay.isMobileTable ? 'base':'normal'" color="black" limit="1" />
    </NuxtLink>
  </Card>
</template>

