
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
  <Card size="sm" bg="white" :class="[storeDisplay.isMobileTable ? 'rd-lg':'rd-xl' ,'shadow-1']">
    <div class="mb-md flex">
      <div class="align-content-center text-center bg-gray2 rd-full height-70 width-70 object-fit-cover overflow-hidden">
        <img :src="item.image" :alt="item.categoryName" width="70" />
      </div>
    </div>
    <div class="flex justify-between align-end">
      <div>
        <Text :text="item.categoryName" :size="storeDisplay.isMobileTable ? 'base':'normal'" color="black" weight="medium" limit="1" class="mb-xs line-height-1"/>
        <NuxtLink :to="`${ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.path}/${item.slug}`">
          <Text text="Xem thêm" :size="storeDisplay.isMobileTable ? 'xs':'base'" color="gray5" hover="primary" />
        </NuxtLink>
      </div>
      <NuxtLink :to="`${ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.path}/${item.slug}`">
        <Button tag="span" size="sm" icon="keyboard_arrow_right" color="secondary" class="rd-full" />
      </NuxtLink>
    </div>
  </Card>
</template>

