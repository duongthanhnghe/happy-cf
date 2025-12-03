<script lang="ts" setup>
import '@/styles/molecules/file-manage/file-image-item.scss'
import { copyText, formatBytes, downloadImage} from '@/utils/global'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';

const store = useFileManageFolderStore()
const props = defineProps({
  item: {
    type: Object,
  },
  chooseImage: {
    type: Boolean,
    default: false,
  }
})

</script>
<template>
  <template v-if="props.item">
    <div class="file-image-item">
      <div class="file-image-overlay">
        <div class="file-image-src cursor-pointer" @click="store.selectImage(props.item.url)">
          <img class="cursor-pointer" :src="props.item.url" :alt="props.item.public_id" />
        </div>
        <div class="file-image-content text-right">
          {{formatBytes(props.item.bytes)}}
        </div>
        <div class="file-image-actions flex gap-xs">
          <Button
            v-tooltip="props.chooseImage ? 'Chon anh nay':'Xem url'"
            class="file-image-item-btn"
            color="black"
            :icon="props.chooseImage ? 'left_click':'visibility'"
            size="sm"
            @click="store.selectImage(props.item.url)"
          />
          <Button
            v-tooltip="'Copy URL'"
            class="file-image-item-btn"
            color="secondary"
            icon="link"
            size="sm"
            @click="copyText(props.item.url)"
          />
          <Button
            v-tooltip="'Tai anh'"
            class="file-image-item-btn"
            color="secondary"
            icon="download"
            size="sm"
            @click.prevent="downloadImage(props.item.url)"
          />
          <Button
            v-tooltip="'Xoa anh'"
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