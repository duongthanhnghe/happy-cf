<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/client/layout/useUserLayoutStore'
import type { HeaderTypeLeft } from '@/stores/client/layout/useUserLayoutStore'
import { useDisplayStore } from '@/stores/shared/useDisplayStore'

const storeLayout = useLayoutStore()
const storeDisplay = useDisplayStore()
const route = useRoute()

const showBreadcrumb = computed(() => route.meta?.showBreadcrumb ?? false)
const showFooter = computed(() => route.meta?.showFooter ?? true)
const showMenuBottom = computed(() => route.meta?.showMenuBottom ?? true)
const containerClass = computed(() => route.meta?.containerClass ?? '')

watch(() => route.fullPath, () => {
  const meta = route.meta

  storeLayout.setHeaderTypeLeft('logo')

  if (meta?.headerTypeLeft) {
    storeLayout.setHeaderTypeLeft(meta.headerTypeLeft as HeaderTypeLeft)
  }
}, { immediate: true })

</script>

<template>
  <div>
    <Header :typeLeft="storeLayout.headerTypeLeft"/>
    <div v-if="showBreadcrumb" class="container container-xxl">
      <BreadcrumbDefault />
    </div>
    <div :class="containerClass">
      <slot />
    </div>
    <Footer v-if="showFooter" />
    <MenuBottom v-if="storeDisplay.isMobileTable && showMenuBottom" />
  </div>
</template>
