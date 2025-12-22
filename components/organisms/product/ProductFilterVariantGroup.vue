<script lang="ts" setup>
import type { VariantGroupDTO } from '@/server/types/dto/v1/product.dto'
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'

const storeCategoryMain = useCategoryMainStore()
const props = defineProps<{
  variantGroups: VariantGroupDTO[]
}>()
</script>

<template>
  <div v-if="props.variantGroups.length">
    <div v-for="group in props.variantGroups" :key="group.id" class="mb-md">
      <Text :text="group.groupName" color="black" size="normal" weight="semibold" class="mb-sm" />
      <div class="flex flex-wrap gap-xs">
        <VCheckbox
          v-for="variant in group.variants"
          :key="variant.id"
          v-model="storeCategoryMain.selectedVariants"
          :label="variant.name"
          :value="variant.id"
          hide-details
          class="button-control-checkbox"
        >
          <template #label>
            <Button tag="span" color="secondary" class="cursor-pointer weight-normal pl-ms pr-ms" :label="variant.name" />
          </template>
        </VCheckbox>
      </div>
    </div>
  </div>
</template>
