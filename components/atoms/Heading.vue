<template>
  <div v-if="props.text" :class="[props.marginBottom
        ? (computedSize === 'xxl' ? 'mb-ms' : 'mb-sm')
        : '', {'flex flex-wrap gap-sm justify-between': props.slug || hasContent }]">
    <Text :tag="props.tag" :text="props.text" :weight="props.weight" :size="computedSize" :color="props.color" :align="props.align" :slug="props.headingSlug" :style="props.style" />
    <NuxtLink v-if="props.slug" :to="{ path: props.slug }">
      <Button tag="span" color="secondary" size="sm" icon="keyboard_arrow_right" class="rd-full" />
    </NuxtLink>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { computed, useSlots } from 'vue'

type HeadingSize = 'base' | 'normal' | 'lg' | 'xl' | 'xxl'

const slots = useSlots()
const storeDisplay = useDisplayStore();

const props = withDefaults(defineProps<{
  text: string | number | object
  tag?: 'h1' | 'h2' | 'h3' | 'div'
  color?: 'white' | 'black' | 'primary'
  size?: HeadingSize
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  align?: 'left' | 'center' | 'right'
  slug?: string
  headingSlug?: string
  marginBottom?: boolean
  style?: any
}>(), {
  tag: 'div',
  color: 'black',
  size: 'lg',
  weight: 'semibold',
  align: 'left',
  slug: '',
  headingSlug: '',
  marginBottom: true
})

const SIZE_MAP: Record<HeadingSize, { desktop: HeadingSize; mobile: HeadingSize }> = {
  xxl: { desktop: 'xxl', mobile: 'xl' },
  xl:  { desktop: 'xl',  mobile: 'lg' },
  lg:  { desktop: 'lg',  mobile: 'lg' },
  normal:  { desktop: 'lg',  mobile: 'normal' },
  base:  { desktop: 'base',  mobile: 'base' },
}

const computedSize = computed<HeadingSize>(() => {
  const device = storeDisplay.isLaptop ? 'desktop' : 'mobile'
  return SIZE_MAP[props.size ?? 'lg'][device]
})

const hasContent = computed(() => {
  return Boolean(
    slots.default
  )
})
</script>