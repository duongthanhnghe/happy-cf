<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { formatCurrency } from '@/utils/global'
import type { CartDTO } from '@/server/types/dto/v1/product.dto';
import { computed } from 'vue';
import { useCartItemHelpers } from '@/utils/cartItemHelpers';

const props = defineProps<{
  item: CartDTO
}>()

const storeCart = useCartStore();
const {
  getFlashAppliedQty,
  getNormalQty,
  getFlashUnitPrice,
  getOriginalUnitPrice,
  getNormalUnitPrice
} = useCartItemHelpers()

const flashAppliedQty = computed(() =>
  getFlashAppliedQty(props.item)
)

const normalQty = computed(() =>
  getNormalQty(props.item)
)

const flashItem = computed(() => {
  if (!props.item.isFlashSale) return null

  const sku = props.item.variantCombination?.sku ?? null

  return (
    props.item.flashSale?.items?.find(
      fs => fs.variantSku === sku
    ) || null
  )
})

</script>
<template>
  <div class="bg-white border-default pd-xs flex rd-xl">
    <div class="width-100 rd-lg bg-gray6 flex">
      <Image 
        v-if="item.image"
        :src="item.image"
        :alt="item.productName"
        :width="100"
        class="rd-lg object-fit-contain"
        preset="avatar"
      />
    </div>
    <div class="flex justify-between flex-direction-column position-relative flex-1 pd-xs pl-sm">
      <div>
        <TagFlashSale v-if="item.isFlashSale && (item.variantCombination ? flashItem : item)" class="mb-xs"/>
        <Text :text="item.productName" color="black" limit="2" class="mb-sm pr-xl" />
        <div class="mb-xs" v-if="item.variantCombination?.variants">
          <Text
            v-for="optionItem in item.variantCombination.variants"
            :text="optionItem.groupName+': '+optionItem.variantName"
            color="gray5" size="xs"
          />
          <Text color="gray5" size="xs" :text="item.note" />
        </div>
      </div>
      <div class="flex justify-between align-end">
        <div class="flex bg-gray6 pd-xs rd-lg flex" v-if="item.id">
          <Button color="secondary" size="xs" icon="check_indeterminate_small" @click.prevent="storeCart.updateQuantity(item.productKey ? item.productKey : item.id,false)" />
          <Button disabled :border="false" size="xs" class="bg-transparent min-width-40 pd-0" :label="item.quantity" />
          <Button color="black" size="xs" icon="add" @click.prevent="storeCart.updateQuantity(item.productKey ? item.productKey : item.id,true)" />
        </div>
       
        <div class="flex gap-xs flex-direction-column align-end">
          <!-- FLASH SALE -->
          <template v-if="item.isFlashSale && flashItem">
            <!-- Giá flash sale -->
            <div class="flex gap-xs" v-if="flashAppliedQty">
              <Button
                tag="span"
                size="xs"
                color="secondary"
                class="text-size-xs"
                :label="`x${flashAppliedQty}`"
              />
              <Text color="gray4" text="-" />
              <Text
                color="danger"
                :text="formatCurrency(
                  getFlashUnitPrice(item, flashItem)
                )"
              />
              <Text
                color="gray5"
                class="text-line-through"
                :text="formatCurrency(
                  getOriginalUnitPrice(item, flashItem)
                )"
              />
            </div>

            <!-- Giá thường còn lại -->
            <div class="flex gap-xs" v-if="normalQty">
              <Button
                tag="span"
                size="xs"
                color="secondary"
                class="text-size-xs"
                :label="`x${normalQty}`"
              />
              <Text color="gray4" text="-" />
              <Text
                color="danger"
                :text="formatCurrency(
                  getNormalUnitPrice(item)
                )"
              />
              <Text
                v-if="getNormalUnitPrice(item) !== getOriginalUnitPrice(item)"
                color="gray5"
                class="text-line-through"
                :text="formatCurrency(
                  getOriginalUnitPrice(item)
                )"
              />
            </div>
          </template>
          <!-- KHÔNG FLASH SALE -->
          <template v-else>
            <div
              v-if="item.priceDiscounts && !item.variantCombination?.priceModifier"
              class="flex gap-xs"
            >
              <Text
                color="danger"
                :text="formatCurrency(
                  getNormalUnitPrice(item)
                )"
              />
              <Text
                v-if="getNormalUnitPrice(item) !== getOriginalUnitPrice(item)"
                color="gray5"
                class="text-line-through"
                :text="formatCurrency(
                  getOriginalUnitPrice(item)
                )"
              />
            </div>

            <template v-else>
              <Text
                color="danger"
                :text="formatCurrency(
                  getNormalUnitPrice(item)
                )"
              />
            </template>
          </template>
        </div>

      </div>
      <div class="position-absolute right-0 top-0 flex" v-if="item.id">
        <Button color="secondary" :border="false" weightIcon="light" size="sm" icon="edit" @click.prevent="storeCart.getProductDetailEdit(item.productKey ? item.productKey : item.id)" />
        <Button color="secondary" :border="false" weightIcon="light" size="sm" icon="delete" @click.prevent="storeCart.deleteCart(item.productKey ? item.productKey : item.id)" />
      </div>
    </div>
  </div>
</template>
