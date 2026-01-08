<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { getCookie, setCookie } from '@/utils/global'
import { useImageBlockByPage } from '@/composables/image-block/useImageBlockByPage'
import { IMAGE_BLOCK_PAGES, IMAGE_BLOCK_POSITIONS } from '@/shared/constants/image-block';

const { fetchImageBlock, dataImageBlock } = useImageBlockByPage()

const SHOW_DELAY = 10_000 // 10s
const COOKIE_NAME = 'image_adv_fixed'

const showPopup = ref(false)

const banner = computed(() => {
  const pageData = dataImageBlock.value?.[IMAGE_BLOCK_PAGES.HOME]
  if (!pageData) return null

  const list = pageData[IMAGE_BLOCK_POSITIONS.FIXED]
  return Array.isArray(list) ? list[0] : null
})

let timer: ReturnType<typeof setTimeout> | null = null

const openPopup = () => {
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
  setCookie(COOKIE_NAME, true, 2) // 2 ngày
}

onMounted(async () => {
  const cookieChecked = getCookie(COOKIE_NAME)

  if (cookieChecked === true) return

  await fetchImageBlock(IMAGE_BLOCK_PAGES.HOME, {
    [IMAGE_BLOCK_POSITIONS.FIXED]: 1,
  })

  timer = setTimeout(openPopup, SHOW_DELAY)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})

</script>

<template>
  <client-only>
    <div v-if="showPopup && banner">
      <div class="position-fixed top-0 left-0 height-dvh width-dvw pl-ms pr-ms flex align-center justify-center z-index-13">
        <div class="width-full height-full bg-black-40 position-absolute top-0 left-0"></div>
        <div class="position-relative">
          <ImageBlock
            v-bind="banner"
            classContent="opacity-0"
            :width="600"
          />
          <Button color="blur" size="sm" icon="close" @click="closePopup" class="position-absolute top-05 right-05 z-index-1 bg-black-40" />
        </div>
      </div>
    </div>
  </client-only>
</template>
