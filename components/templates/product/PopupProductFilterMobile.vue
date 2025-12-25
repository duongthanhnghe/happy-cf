<script lang="ts" setup>
import type { CategoryProductDTO, VariantGroupDTO } from '@/server/types/dto/v1/product.dto';
const props = defineProps<{
  categoryName: string;
  variantGroups: VariantGroupDTO[];
  hasFilter: boolean;
  listCategory: CategoryProductDTO[];
  onResetFilter: () => void;
  isTogglePopupFilter: boolean;
  onHandleTogglePopupFilter: (value: boolean) => void;

  priceRanges: {
    key: string
    label: string
  }[]
  selectedPriceRanges: string[]
  onTogglePrice: (key: string) => void

  selectedVariants: string[]
  onToggleVariant: (variantId: string) => void
}>();
</script>

<template>
  <Popup 
    :model-value="props.isTogglePopupFilter"
    @update:modelValue="props.onHandleTogglePopupFilter"
    popupHeading="Bộ lọc" 
    bodyClass="bg-gray6" 
    footerFixed 
    align="right">
    <template #header >
      <Button v-if="props.hasFilter" icon="filter_alt_off" color="secondary" @click.prevent="props.onResetFilter()" />
    </template>
    <template #body>
      <div v-if="listCategory.length > 0" class="mb-sm">
        <Text text="Danh mục" color="black" size="normal" weight="semibold" class="mt-sm mb-sm" />
        <ProductFilterCategory :categoryName="props.categoryName" :list="listCategory"/>
      </div>

      <div v-if="props.variantGroups.length > 0" >
        <ProductFilterVariantGroup
          :variant-groups="variantGroups"
          :selected-variants="selectedVariants"
          :on-toggle-variant="onToggleVariant"
        />
      </div>

      <Text text="Giá" color="black" size="normal" weight="semibold" class="mt-md mb-xs" />
      <ProductFilterPrice
        :price-ranges="priceRanges"
        :selected-price-ranges="selectedPriceRanges"
        :on-toggle-price="onTogglePrice"
      />
    </template>
    <template #footer>
    <div class="text-center flex gap-xs justify-center">
      <Button color="black" :class="{'flex-1': props.hasFilter}" label="Tiếp tục xem" @click.prevent="props.onHandleTogglePopupFilter(false)"/>
      <Button v-if="props.hasFilter" color="secondary" class="flex-1" label="Xoá bộ lọc" @click.prevent="props.onResetFilter()" />
    </div>
  </template>
  </Popup>
</template>