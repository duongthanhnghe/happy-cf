<script lang="ts" setup>
import '@/styles/molecules/file-manage/file-image-item.scss'
import { copyText, formatBytes, downloadImage} from '@/utils/global'
import { useFileManageClientStore } from '@/stores/client/file-manage/useFileManageStore';

const store = useFileManageClientStore()
const props = defineProps({
  item: {
    type: Object,
  },
  chooseImage: {
    type: Boolean,
    default: false,
  },
})

</script>
<template>
  <template v-if="props.item">
    <div class="file-image-item">
      <div class="file-image-overlay">
        <div
          class="file-image-src"
          :class="{ 'cursor-pointer': props.chooseImage }"
          @click="props.chooseImage && store.selectImage(props.item.url)"
        >
          <Image 
            :src="props.item.url"
            :alt="props.item.public_id"
            :width="200"
            class="cursor-pointer"
          />
        </div>

        <div class="file-image-content text-right">
          {{ formatBytes(props.item.bytes) }}
        </div>

        <div class="file-image-actions flex gap-xs">
          <Button
            v-tooltip="props.chooseImage ? 'Chọn ảnh này' : 'Xem URL'"
            class="file-image-item-btn"
            color="black"
            :icon="props.chooseImage ? 'left_click' : 'visibility'"
            size="sm"
            @click="store.selectImage(props.item.url)"
          />

          <Button
            v-tooltip="'Sao chép URL'"
            class="file-image-item-btn"
            color="secondary"
            icon="link"
            size="sm"
            @click="copyText(props.item.url)"
          />

          <Button
            v-tooltip="'Tải ảnh'"
            class="file-image-item-btn"
            color="secondary"
            icon="download"
            size="sm"
            @click.prevent="downloadImage(props.item.url)"
          />

          <Button
            v-tooltip="'Xóa ảnh'"
            class="file-image-item-btn"
            color="secondary"
            icon="delete"
            size="sm"
            @click="store.deleteImage(props.item.public_id)"
          />
        </div>
      </div>

      <div class="text-color-black text-limit text-size-xs mt-xs">
        {{ props.item.public_id }}
      </div>

      <div class="text-color-gray5 text-size-xs">
        {{ props.item.width }} x {{ props.item.height }}
      </div>
    </div>
  </template>
</template>