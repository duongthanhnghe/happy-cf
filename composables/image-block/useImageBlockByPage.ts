import { computed, ref } from 'vue'
import { useState } from 'nuxt/app'
import type {
  ImageBlockPage,
  ImageBlockPosition
} from '@/server/shared/constants/image-block'
import { imageBlocksAPI } from '@/services/v1/image-block.service'
import type { ImageBlockDTO } from '@/server/types/dto/v1/image-block.dto'

export const useImageBlockByPage = () => {
  const dataImageBlock = useState<
    Partial<
      Record<
        ImageBlockPage,
        Partial<Record<ImageBlockPosition, ImageBlockDTO[]>>
      >
    >
  >('image-block', () => ({}))

  const loading = ref(false)

  const fetchImageBlock = async (
    page: ImageBlockPage,
    positionLimits?: Partial<Record<ImageBlockPosition, number>>
  ) => {
    if (dataImageBlock.value[page]) return

    loading.value = true
    try {
      const res = await imageBlocksAPI.getByPage(page, positionLimits)
      if (res.code === 0) {
        dataImageBlock.value[page] = res.data
      }
    } finally {
      loading.value = false
    }
  }

  const getByPosition = (
    page: ImageBlockPage,
    position: ImageBlockPosition
  ) =>
    computed(() => dataImageBlock.value?.[page]?.[position] ?? [])

  return {
    fetchImageBlock,
    getByPosition,
    dataImageBlock,
    loading,
  }
}
