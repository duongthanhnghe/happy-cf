<script lang="ts" setup>
import { formatCurrency } from '@/utils/global'
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'
import { computed, ref, watch } from 'vue'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'

const props = defineProps<{
  item: ProductDTO
  quantity: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  (
    e: 'variant-change',
    payload: {
      productId: string
      combinationId?: string
    }
  ): void
}>()

const cartStore = useCartStore()

const giftSelectedVariants = ref<Record<string, string>>({})

const variantGroupsFiltered = computed(() =>
  cartStore
    .variantGroupsUI(props.item.variantCombinations)
    .map(group => ({
      ...group,
      variants: group.variants.filter(v =>
        v.hasStock === true
      ),
    }))
    .filter(group => group.variants.length > 0)
)

const giftCombinationId = computed(() => {
  const combos = props.item.variantCombinations
  if (!combos?.length) return undefined

  return combos.find(combo =>
    combo.variants.every(
      v => giftSelectedVariants.value[v.groupId] === v.variantId
    )
  )?.id
})

watch(giftCombinationId, (val) => {
  emit('variant-change', {
    productId: props.item.id,
    combinationId: val,
  })
})
</script>

<template>
  <div
    class="flex bg-white rd-xl flex-1"
    :class="{ 'pointer-events disable': disabled }"
  >
    <div class="width-100">
      <Image
        v-if="item.image"
        :src="item.image"
        :alt="item.productName"
        class="rd-lg"
        preset="avatar"
      />
    </div>

    <div class="flex-1 pd-xs pl-sm">
      <Text size="sm" weight="semibold" limit="1" class="mb-xs" :text="item.productName" />

      <div class="flex justify-between mt-xs">
        <div class="flex gap-xs align-center">
          <Text weight="semibold">{{ formatCurrency(0) }}</Text>
          <Text v-if="item.price" color="gray5" class="text-line-through">
            {{ formatCurrency(item.price) }}
          </Text>
        </div>
        <Button tag="span" size="xs" color="secondary" :label="`x${quantity}`" />
      </div>

      <div v-if="variantGroupsFiltered.length" class="flex gap-sm mt-sm">
        <div
          v-for="group in variantGroupsFiltered"
          :key="group.groupId"
          class="width-full max-width-150"
        >
          <Text size="xs" class="mb-xs">{{ group.groupName }}</Text>
          <v-select
            v-model="giftSelectedVariants[group.groupId]"
            :items="group.variants"
            item-title="variantName"
            item-value="variantId"
            density="compact"
            variant="outlined"
            hide-details
          />
        </div>
      </div>
    </div>
  </div>
</template>
