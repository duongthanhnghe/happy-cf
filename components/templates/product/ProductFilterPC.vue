<script lang="ts" setup>
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import type { CategoryProductDTO, VariantGroupDTO } from '@/server/types/dto/v1/product.dto';

const { t } = useITranslations()

const props = defineProps<{
  categoryName: string
  variantGroups: VariantGroupDTO[]
  hasFilter: boolean
  listCategory: CategoryProductDTO[]
  onResetFilter: () => void

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
  <div class="sticky sticky-cover-header min-width-300 max-width-300 overflow-auto max-height-cover-header pt-section">
    <Button v-if="props.hasFilter" color="black" class="w-full mb-md" :label="t('product.category.text8').text" icon="filter_alt_off" @click.prevent="props.onResetFilter()" />
    <Text :text="t('product.category.text3')" color="black" size="normal" weight="semibold" class="mb-sm" />
    <ProductFilterDefault />

    <template v-if="listCategory.length > 0">
      <Text :text="t('product.category.text4')" color="black" size="normal" weight="semibold" class="mt-md mb-xs" />
      <ProductFilterCategory :categoryName="props.categoryName" :list="listCategory"/>
    </template>

    <div v-if="props.variantGroups.length > 0" class="mt-ms">
      <ProductFilterVariantGroup
        :variant-groups="variantGroups"
        :selected-variants="selectedVariants"
        :on-toggle-variant="onToggleVariant"
      />
    </div> 

    <Text :text="t('product.category.text5')" color="black" size="normal" weight="semibold" class="mt-md mb-xs" />
    <ProductFilterPrice
      :price-ranges="priceRanges"
      :selected-price-ranges="selectedPriceRanges"
      :on-toggle-price="onTogglePrice"
    />
  </div>
</template>