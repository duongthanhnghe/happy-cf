<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplayStore } from '@/stores/shared/useDisplayStore'

const storeDisplay = useDisplayStore()
const route = useRoute()

const showBreadcrumb = computed(() => route.meta?.showBreadcrumb ?? false)
const showFooter = computed(() => route.meta?.showFooter ?? true)
const showMenuBottom = computed(() => route.meta?.showMenuBottom ?? true)
const containerClass = computed(() => route.meta?.containerClass ?? '')

</script>

<template>
  <div>
    <Header />
    <div :class="containerClass">
      <div v-if="showBreadcrumb" class="container container-xxl">
        <BreadcrumbDefault />
      </div>
      <div>
        <slot />
      </div>
    </div>
    <Footer v-if="showFooter" />
    <MenuBottom v-if="storeDisplay.isMobileTable && showMenuBottom" />
  </div>
</template>
