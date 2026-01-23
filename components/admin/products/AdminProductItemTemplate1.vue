<script lang="ts" setup>
import { formatCurrency } from '@/utils/global'
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';
import { useAdminProductHelpers } from '@/composables/admin/product/useAdminProductHelpers';

const { getTotalVariantStock } = useAdminProductHelpers();
const props = defineProps<{
  item: ProductDTO
}>()

</script>
<template>
  <div class="flex bg-white pd-xs border-default rd-xl flex-1">
    <div class="width-100">
      <Image 
        v-if="props.item.image"
        :src="props.item.image" 
        :alt="props.item.productName"
        class="rd-lg bg-gray2"
        preset="thumbnail"
      />
    </div>
    <div class="flex-1 pd-xs pl-sm">
      <Text size="sm" weight="medium" limit="1" class="mb-xs pr-0" :text="props.item.productName" />
      <div class="text-color-gray5 text-size-xs">
        SKU: {{ props.item.sku }}
      </div>

      <div v-if="item.variantGroups" class="flex gap-xs mt-xs">
        <div v-for="optionItem in item.variantGroups" :key="optionItem.groupId">
          <v-chip label class="mb-xs" size="small">
            {{optionItem.groupName}}
          </v-chip>
        </div>
      </div>
     
      <div class="flex flex-wrap justify-between align-end mt-xs">
        <div class="flex gap-xs">
          <Button tag="span" size="xs" color="secondary" class="text-size-xs" :label="`Tồn kho: ${getTotalVariantStock(props.item)}`"/>
        </div>
        <Text v-if="item.price && props.item.variantCombinations.length === 0" :text="`${formatCurrency(item.price)}`" color="gray5" />
      </div>
    </div>
  </div>
</template>