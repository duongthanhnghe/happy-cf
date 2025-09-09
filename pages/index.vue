<script lang="ts" setup>
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { ROUTES } from '@/shared/constants/routes';

definePageMeta({
  headerTypeLeft: ROUTES.PUBLIC.HOME.headerTypeLeft,
})

const storeDisplay = useDisplayStore()
</script>

<template>
  <SectionAccount />
  <SectionBanner />

  <div class="pt-section pb-section">
    <div :class="['container', storeDisplay.isMobileTable ? 'pr-0' : '']">
      <SectionProductSales headingText="Khuyến mãi" :viewMore="true" />
    </div>
  </div>

  <div class="pb-section">
    <div :class="['container', storeDisplay.isMobileTable ? 'pr-0' : '']">
      <SectionProductMostOrder headingText="Gợi ý cho bạn" :viewMore="true" />
    </div>
  </div>

  <div class="pb-section">
    <SectionNewsLatest headingText="Tin mới nhất" />
  </div>

  <client-only><Footer /></client-only>
</template>
