<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { computed } from 'vue'
import { NuxtLink } from '#components'

type LogoSize = '100' | '70' | 'xl'

const props = withDefaults(defineProps<{
  logo: string
  alt?: string
  maxHeight?: LogoSize
  filter?: boolean
  link?: boolean
}>(), {
  maxHeight: 'xl',
  filter: false,
  link: true
})

const logoClass = computed(() => [
  'object-fit-contain',
  `max-height-${props.maxHeight}`,
  { 'filter-brightness': props.filter }
])
</script>

<template>
  <component
    :is="props.link ? NuxtLink : 'div'"
    :to="props.link ? ROUTES.PUBLIC.HOME.path : undefined"
  >
    <img
      v-if="props.logo"
      :class="logoClass"
      :src="props.logo"
      :alt="props.alt || 'logo'"
    />
  </component>
</template>
