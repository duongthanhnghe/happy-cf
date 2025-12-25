<script setup lang="ts">
import type { VariantGroupDTO } from '@/server/types/dto/v1/product.dto'

withDefaults(
  defineProps<{
    variantGroups: VariantGroupDTO[]
    selectedVariants?: string[]
    onToggleVariant: (variantId: string) => void
  }>(),
  {
    selectedVariants: () => []
  }
)
</script>

<template>
  <div v-if="variantGroups.length">
    <div v-for="group in variantGroups" :key="group.id" class="mb-md">
      <Text
        :text="group.groupName"
        color="black"
        size="normal"
        weight="semibold"
        class="mb-sm"
      />

      <div class="flex flex-wrap gap-xs">
        <VCheckbox
          v-for="variant in group.variants"
          :key="variant.id"
          :model-value="selectedVariants.includes(variant.id)"
          hide-details
          class="button-control-checkbox"
          @click="onToggleVariant(variant.id)"
        >
          <template #label>
            <Button
              tag="span"
              color="secondary"
              class="cursor-pointer weight-normal pl-ms pr-ms"
              :label="variant.name"
            />
          </template>
        </VCheckbox>
      </div>
    </div>
  </div>
</template>
