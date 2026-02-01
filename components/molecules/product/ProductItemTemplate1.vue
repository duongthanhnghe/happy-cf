
<script lang="ts" setup>
import '@/styles/molecules/product/product-item-template1.scss'
import {
  formatCurrency
} from '@/utils/global'
import {
  computed,
  ref,
} from 'vue'
import {
  useCartStore
} from '@/stores/client/product/useCartOrderStore'
import {
  useProductDetailStore
} from '@/stores/client/product/useProductDetailStore'
import {
  useWishlistStore
} from '@/stores/client/users/useWishlistStore';
import {
  useAccountStore
} from '@/stores/client/users/useAccountStore';
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';
import { ROUTE_HELPERS } from '@/shared/constants/routes-helpers';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';

const props = defineProps<{
  product: ProductDTO
  listView?: Boolean
  background?: 'bg-white' | 'bg-gray7' | ''
  variant?: 'card'
  deleteFavorite?: Boolean
}>()

const { t } = useITranslations()
const storeCart = useCartStore()
const storeDisplay = useDisplayStore()
const storeProduct = useProductDetailStore()
const storeWishlist = useWishlistStore();
const storeAccount = useAccountStore();

const toggleAction = ref(false);

function handleShowAction () {
  toggleAction.value = !toggleAction.value;
};

const bestFlashSaleItem = computed(() => {
  if (!props.product?.flashSale?.items?.length) return null

  return props.product.flashSale.items.reduce((max, cur) =>
    cur.percentDiscount > max.percentDiscount ? cur : max
  )
})

const displayPrice = computed(() => {
  if (bestFlashSaleItem.value) {
    return bestFlashSaleItem.value.salePrice
  }
  return props.product.priceDiscounts
})

const displayOriginalPrice = computed(() => {
  if (bestFlashSaleItem.value) {
    return bestFlashSaleItem.value.originalPrice
  }
  return props.product.price
})

const displayPercentDiscount = computed(() => {
  if (bestFlashSaleItem.value) {
    return bestFlashSaleItem.value.percentDiscount
  }
  return props.product.percentDiscount
})

const flashSalePercent = computed(() => {
  const info = props.product.flashSaleInfo
  if (!info || info.totalQuantity <= 0) return 0

  return Math.min(
    100,
    Math.round((info.totalSold / info.totalQuantity) * 100)
  )
})

</script>

<template>
  <div 
    v-if="product && product.isActive" 
    :class="['product-template1-item position-relative overflow-hidden hover-visible-overlay', {'rd-lg pd-05 bg-white cl-shadow-1': props.variant === 'card'}, background ,listView ? 'product-template1-listView' : '']"
    >
    <div class="product-template1-image bg-gray6 position-relative rd-lg text-center overflow-hidden">
      <NuxtLink v-if="product.slug" :to="ROUTE_HELPERS.productDetail(product.slug)">
        <Image 
          :src="product.image" 
          :alt="product.productName"
          preset="thumbnail"
          :width="400"
          :height="400"
        />
        <Image 
          v-if="product.listImage.length > 0"
          :src="product.listImage[0].src"
          :alt="product.productName"
          class="el-absolute left-0 top-0 hover-visible-overlay-el object-fit-cover bg-gray6"
          preset="thumbnail"
          :width="400"
          :height="400"
        />
      </NuxtLink>
      <client-only>
        <template v-if="!props.listView">
          <Button v-if="storeAccount.getUserId && !props.deleteFavorite" 
            :class="[{'hover-visible-overlay-el': !storeWishlist.isInWishlist(product.id)}, storeDisplay.isLaptop ? 'right-sm top-sm':'right-xs top-xs','position-absolute z-index-1']" 
            :color="storeWishlist.isInWishlist(product.id) ? 'black' : 'secondary'" 
            size="xs" 
            icon="favorite" 
            @click="storeProduct.toggleLike(product.id)"
          />
          <Button 
            v-else-if="storeAccount.getUserId && props.deleteFavorite" 
            v-tooltip.left="'Xoá yêu thích'"
            :class="[storeDisplay.isLaptop ? 'right-sm top-sm':'right-xs top-xs','position-absolute z-index-2']" 
            color="secondary" 
            size="sm" 
            icon="delete" 
            @click="storeWishlist.handleDeleteWishlist(product.id)"
          />
          <template v-else />
        </template>
      </client-only>
        
      <div :class="[storeDisplay.isLaptop ? 'left-sm top-sm':'left-xs top-xs','position-absolute z-index-1']" >
        <template v-if="product.amount === 0 && !product.variantCombinations.length">
          <!-- tag het hang -->
          <Button v-if="!listView"
            class="weight-medium text-size-xs" 
            color="black" 
            size="xs" 
            :label="t('product.detail.text2').text" 
            tag="span"
          />
        </template>
        <template v-else>
          <!-- tag flash sale -->
          <TagFlashSale v-if="product.isFlashSale" />
        </template>
      </div>

      <div class="el-absolute left-0 bottom-0 height-auto">
        <!-- add cart -->
        <div class="justify-end flex position-relative z-index-2" :class="[storeDisplay.isLaptop ? 'mr-sm bottom-sm':'mr-xs mb-xs']" >
          <Button 
            v-if="storeCart.getTemplate1Amount(product.id) < 1"
            color="primary" 
            class="button-no-text" 
            size="xs" 
            icon="add"
            @click="() => { product.variantCombinations.length > 0 ? storeCart.getProductDetailApi(product.id) : storeCart.addProductToCart(product, 1, '')}"
          />
          <Button 
            v-else
            class="button-no-text" 
            color="secondary"
            size="xs"
            @click="() => { product.variantCombinations.length > 0 ? storeCart.getProductDetailApi(product.id) : handleShowAction()}"
            :label="storeCart.getTemplate1Amount(product.id)"
          />
        </div>

        <!-- Badge Image voucher-->
        <Image 
          v-if="product.vouchers?.image"
          :alt="product.productName" 
          :src="product.vouchers.image"
          class="width-full height-auto"
          :width="400"
        />
        <!-- Badge Image flash sale-->
        <Image 
          v-if="!product.vouchers?.image && product.flashSale?.badgeImage"
          :alt="product.productName" 
          :src="product.flashSale?.badgeImage"
          class="width-full height-auto"
          :width="400"
        />
      </div>
    </div>
    <div v-if="storeCart.getTemplate1Amount(product.id) > 0" :class="['product-template1-action el-absolute left-0 top-0 flex justify-center align-center z-index-2',toggleAction ? 'hover-visible-overlay-el active transform-scale-1' : 'transform-scale-0']">
      <div class="product-template1-action-before el-absolute left-0 top-0 bg-white-70" @click="handleShowAction()"></div>
      <div class="product-template1-input z-index-2 bg-white rd-xl flex align-center pd-xs position-relative shadow-1">
        <Button 
          v-if="storeCart.getTemplate1Amount(product.id) == 1" 
          icon="delete" 
          color="secondary" 
          :border="false"
          size="sm"
          class="product-template1-delete position-absolute z-index-2" 
          @click="storeCart.deleteCart(product.id)"
        />
        <Button 
          class="product-template1-input-btn" 
          color="secondary" 
          icon="add" 
          :border="false"
          size="sm"
          @click.prevent="storeCart.updateQuantity(product.id,false)"
        />
        <Button
          class="product-template1-input-btn pl-0 pr-0 text-size-md weight-medium" 
          tag="span"
          color="secondary" 
          :label="storeCart.getTemplate1Amount(product.id)" 
          :border="false"
          size="sm"
          disabled
          @click.prevent="storeCart.updateQuantity(product.id,true)" 
        />
        <Button
          class="product-template1-input-btn" 
          color="secondary" 
          icon="add" 
          :border="false"
          size="sm"
          @click.prevent="storeCart.updateQuantity(product.id,true)" 
        />
      </div>
    </div>
    <div :class="[{'pd-05': props.variant === 'card'},storeDisplay.isLaptop ? 'pt-ms':'pt-sm','product-template1-content']">
      <NuxtLink 
        v-if="product.slug" 
        :to="ROUTE_HELPERS.productDetail(product.slug)"
      >
        <Text :text="product.productName" limit="2" :class="[storeDisplay.isLaptop ? 'mb-sm':'mb-05','line-height-1d4']" />
      </NuxtLink>

      <!-- price -->
      <div class="product-template1-price flex gap-xs align-center">
        <Text
          class="line-height-1"
          weight="semibold"
          :size="storeDisplay.isLaptop ? 'base':'xs'"
        >
          {{ formatCurrency(displayPrice) }}
        </Text>

        <template v-if="displayPercentDiscount && displayPercentDiscount > 0">
          <Text
            color="gray5"
            size="xs"
            class="line-height-1 text-line-through"
          >
            {{ formatCurrency(displayOriginalPrice) }}
          </Text>

          <Button
            tag="div"
            color="primary"
            size="xs"
            :label="`-${displayPercentDiscount}%`"
            :class="[
              { 'text-size-xs': !storeDisplay.isLaptop },
              'pl-xs pr-xs rd-lg height-auto line-height-1d2'
            ]"
          />
        </template>
      </div>

      <!-- flash sale info -->
      <div v-if="product.flashSaleInfo" class="position-relative overflow-hidden bg-gray2 rd-xl mt-sm pl-sm pr-sm text-color-white flex align-center gap-xs" style="height:20px">
        <div
          class="position-absolute left-0 top-0 height-full bg-four min-width-120 rd-xl"
          :style="{ width: flashSalePercent + '%' }"
        />
        <MaterialIcon name="electric_bolt" weight="light" size="base" class="position-relative" />
        <Text :text="`Đã bán ${ product.flashSaleInfo.totalSold }/${ product.flashSaleInfo.totalQuantity }`" weight="medium" size="xs" class="position-relative line-height-1" limit="1" />
      </div>

    </div>
  </div>
</template>

