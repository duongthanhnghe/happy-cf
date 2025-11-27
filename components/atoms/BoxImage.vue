<script setup>
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const storeDisplay = useDisplayStore()

const props = defineProps({
  heading: {
    type: String,
  },
  text: {
    type: String,
  },
  textBtn: {
    type: String,
  },
  image: {
    type: String,
  },
  linkHref: {
    type: String,
    default: '/',
  }
})
</script>

<template>
  <div :class="[storeDisplay.isMobileTable ? 'rd-lg':'rd-xl' ,'overflow-hidden position-relative']">
    <NuxtLink :to="props.linkHref">
      <img v-if="props.image" :src="props.image" :alt="props.heading" />
      <div :class="[storeDisplay.isMobileTable ? 'pd-ms':'pd-lg' ,'bg-gradient-2 el-absolute flex align-end left-0 bottom-0']">
        <div>
          <Text v-if="props.heading" :text="props.heading" color="white" size="lg-2" weight="semibold" class="text-uppercase" />
          <Text v-if="props.text" :text="props.text" color="white" />
          <Button v-if="props.textBtn" tag="span" color="secondary" :border="false" :label="props.textBtn" class="mt-sm"/>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
