<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/client/layout/useUserLayoutStore'
import type { HeaderTypeLeft } from '@/stores/client/layout/useUserLayoutStore'

const storeLayout = useLayoutStore()
const route = useRoute()

watch(() => route.meta, (meta) => {
  if (meta?.headerTypeLeft) {
    storeLayout.setHeaderTypeLeft(meta.headerTypeLeft as HeaderTypeLeft)
  }
}, { immediate: true })
</script>

<template>
  <Header :type-left="storeLayout.headerTypeLeft"/>
  <div class="account-bg bg-gray2 pb-section">
    <SectionAccount :showBarcode="false"/>
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-3">
          <MenuAccount />
        </div>
        <div class="col-12 col-lg-9">
          <slot />
        </div>
      </div>
    </div>
  </div>
  <MenuBottom />
</template>
