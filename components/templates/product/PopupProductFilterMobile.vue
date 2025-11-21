<script lang="ts" setup>
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'
const storeCategoryMain = useCategoryMainStore()
const props = defineProps<{
  categoryName: string;
}>();
</script>

<template>
  <Popup v-model="storeCategoryMain.isTogglePopupFilter" popupHeading="Bo loc" bodyClass="bg-gray6" footerFixed align="right">
    <template #header >
      <Button v-if="storeCategoryMain.hasFilter" icon="filter_alt_off" color="secondary" @click.prevent="storeCategoryMain.resetFilter()" />
    </template>
    <template #body>
      <template v-if="storeCategoryMain.getListCategoryChildren.length > 0">
        <Text text="Danh muc" color="black" size="normal" weight="semibold" class="mt-sm mb-sm" />
        <ProductFilterCategory :categoryName="props.categoryName" :list="storeCategoryMain.getListCategoryChildren"/>
      </template>

      <Text text="Khoang gia" color="black" size="normal" weight="semibold" class="mt-md mb-md" />
      <ProductFilterPrice />
    </template>
    <template #footer>
    <div class="text-center flex gap-xs justify-center">
      <Button color="black" :class="{'flex-1': storeCategoryMain.hasFilter }" label="Tiep tuc xem" @click.prevent="storeCategoryMain.handleTogglePopupFilter(false)"/>
      <Button v-if="storeCategoryMain.hasFilter" color="secondary" class="flex-1" label="Xoa bo loc" @click.prevent="storeCategoryMain.resetFilter()"/>
    </div>
  </template>
  </Popup>
</template>