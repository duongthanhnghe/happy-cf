<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { getCookie, setCookie } from '@/utils/global'
import { useTopPriority } from '@/composables/product/flash-sale/useTopPriority';
import { useTopFlashSaleProducts } from '@/composables/product/flash-sale/useTopFlashSaleProducts';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const storeDisplay = useDisplayStore()
const { fetchTopPriority, getTopPriority } = useTopPriority()
const { fetchTopFlashSaleProducts, getTopFlashSaleProducts, loadingData } = useTopFlashSaleProducts()

const SHOW_DELAY = 10_000 // 10s
const COOKIE_NAME = 'popup_top_flash_sale'

const topFlashSaleProductsLimited = computed(() =>
  getTopFlashSaleProducts.value.slice(0, 4)
)

const showPopup = ref(false)

let timer: ReturnType<typeof setTimeout> | null = null

const openPopup = () => {
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
  setCookie(COOKIE_NAME, true, 1 / 24) // 1h
}

onMounted(async () => {
  const cookieChecked = getCookie(COOKIE_NAME)

  if (cookieChecked === true) return

  if (getTopFlashSaleProducts.value.length === 0) await fetchTopFlashSaleProducts()
  if (!getTopPriority.value && getTopFlashSaleProducts.value.length > 0) await fetchTopPriority()

  timer = setTimeout(openPopup, SHOW_DELAY)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})

</script>

<template>
  <client-only>
    <div 
      v-if="showPopup && getTopPriority && getTopFlashSaleProducts.length > 0" 
      class="rd-xl overflow-hidden bg-four-60 blur-10 position-fixed z-index-13 "
      :class="!storeDisplay.isMobile ? 'left-1 bottom-1 max-width-400':'left-0 bottom-0 rd-null-bottom-left rd-null-bottom-right'"
    >
      <div class="pd-ms">
        <FlashSaleCount 
          :startDate="getTopPriority.startDate" 
          :endDate="getTopPriority.endDate" 
          :color="getTopPriority.theme.textColor"
          flex
          class="mb-sm"
        />
        <SectionProductListColumn
          :items="topFlashSaleProductsLimited"
          :loading="loadingData"
          fullScreen
          variantItem="card"
          listView
          column="col-12"
        />
        <div class="flex justify-between align-center">
          <Text @click.prevent="closePopup" text="Tắt popup" color="gray2" class="text-underline cursor-pointer" />
          <NuxtLink :to="ROUTES.PUBLIC.FLASH_SALE.path" @click.native="closePopup">
            <Button color="third" size="sm" label="Xem thêm" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </client-only>
</template>