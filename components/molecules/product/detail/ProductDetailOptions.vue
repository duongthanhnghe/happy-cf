<script lang="ts" setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import type { ProductVariantCombinationDTO } from '@/server/types/dto/v1/product.dto' 
import { useITranslations } from '@/composables/shared/itranslation/useITranslations'

const storeCart = useCartStore()
const { t } = useITranslations()

const props = defineProps<{
  variantCombinations: ProductVariantCombinationDTO[]
  showHeading?: boolean
  showStock?: boolean
  classCustom?: string
  sizeButton?: string
}>()

const variantGroupsUI = computed(() =>
  storeCart.variantGroupsUI(props.variantCombinations)
)

const getSelectedVariantName = (
  groupId: string
) =>
  storeCart.getSelectedVariantName(
    groupId,
    props.variantCombinations
  )

const selectedStock = computed(() =>
  storeCart.getSelectedVariantStock(props.variantCombinations)
)
</script>

<template>
  <client-only>
  <div v-if="props.variantCombinations" v-for="group in variantGroupsUI" :key="group.groupId">
    <v-radio-group
      v-model="storeCart.tempSelected[group.groupId]"
      hide-details
      class="button-control-radiobox button-control-variant"
    >
      <Text v-if="showHeading" :text="group.groupName+':'" class="mb-sm" size="base">
        <Text tag="span" :text="getSelectedVariantName(group.groupId)" weight="semibold" color="black" />
      </Text>
    
      <div :class="['flex flex-wrap gap-xs', classCustom]">
        <v-radio
          v-for="variant in group.variants"
          :key="variant.variantId"
          :value="variant.variantId"
          :disabled="!variant.hasStock"
          class="flex-none"
          @update:modelValue="(val: any) => {
            storeCart.handleSelectVariant(
              group.groupId,
              val,
              group.groupName,
              variant.variantName,
              0
            )
          }"
        >
          <template #label>
            <Button 
              :size="props.sizeButton ? props.sizeButton : 'md'"
              :label="variant.variantName" 
              :border="false" color="gray" 
              class="pl-ms pr-ms weight-normal" />
          </template>
        </v-radio>
      </div>

    </v-radio-group>
  </div>
  <Text v-if="showStock" :text="t('product.detail.text8')" size="base">
    <Text tag="span" :text="selectedStock" weight="semibold" color="green" />
  </Text>
  </client-only>
</template>
