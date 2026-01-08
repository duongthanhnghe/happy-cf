<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import { useDisplayStore } from '@/stores/shared/useDisplayStore'

const storeDisplay = useDisplayStore()
const NuxtLinkComp = resolveComponent('NuxtLink')

interface Props {
  image: string
  title?: string
  description?: string
  textButton?: string
  linkRedirect?: string
  showContent?: boolean
  width?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  textButton: '',
  linkRedirect: '',
  showContent: true
})

const wrapperComponent = computed(() =>
  props.linkRedirect && props.showContent ? NuxtLinkComp : 'div'
)

const wrapperProps = computed(() =>
  props.linkRedirect ? { to: props.linkRedirect } : {}
)
</script>

<template>
  <div
    :class="[
      storeDisplay.isMobileTable ? 'rd-lg' : 'rd-xl',
      'overflow-hidden position-relative flex-1'
    ]"
  >
    <component
      :is="wrapperComponent"
      v-bind="wrapperProps"
      class="block"
    >
      <Image 
        :src="props.image"
        :alt="props.title || 'image-block'"
        class="w-full"
        :width="props.width"
      />

      <div
        v-if="props.showContent"
        :class="[
          storeDisplay.isMobileTable ? 'pd-ms' : 'pd-lg',
          'bg-gradient-2 el-absolute flex align-end left-0 bottom-0 w-full'
        ]"
      >
        <div>
          <Text
            v-if="props.title"
            :text="props.title"
            color="white"
            size="lg-2"
            weight="semibold"
            class="text-uppercase"
          />

          <Text
            v-if="props.description"
            :text="props.description"
            color="white"
          />

          <Button
            v-if="props.textButton && props.linkRedirect"
            tag="span"
            color="secondary"
            :border="false"
            :label="props.textButton"
            class="mt-sm"
          />
        </div>
      </div>
    </component>
  </div>
</template>
