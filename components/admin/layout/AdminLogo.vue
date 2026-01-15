<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { computed } from 'vue'
import { NuxtLink } from '#components'
import { useBaseInformationStore } from '@/stores/admin/setting/useBaseInformationStore';

type LogoSize = '100' | '70' | 'xl'

const storeSetting = useBaseInformationStore();

const props = withDefaults(defineProps<{
  logo?: string
  alt?: string
  maxHeight?: LogoSize
  filter?: boolean
  link?: boolean
}>(), {
  logo: '',
  alt: '',
  maxHeight: 'xl',
  filter: false,
  link: true
})
const logoClass = computed(() => [
  'object-fit-contain',
  `max-height-${props.maxHeight}`,
  { 'filter-brightness': props.filter }
])

const logoSrc = computed(() => {
  return props.logo || storeSetting.getBaseInformation?.logoUrl || ''
})

const logoAlt = computed(() => {
  return props.alt || storeSetting.getBaseInformation?.name || 'logo'
})
</script>

<template>
  <component
    :is="props.link ? NuxtLink : 'div'"
    :to="props.link ? ROUTES.PUBLIC.HOME.path : undefined"
  >
    <img
      v-if="logoSrc"
      :class="logoClass"
      :src="logoSrc"
      :alt="logoAlt"
    />
  </component>
</template>
