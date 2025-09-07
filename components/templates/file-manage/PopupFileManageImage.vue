<script lang="ts" setup>
import { useFileManageFolderStore } from '@/stores/file-manage/useFileManageStore';

const store = useFileManageFolderStore()

const props = defineProps({
  folderName: {
    type: String,
    default: '',
  },
  chooseImage: {
    type: Boolean,
    default: false,
  },
  column: {
    type: String,
  }
})

</script>
<template>
<Popup :children="true" popupId="popup-file-manage-folder" v-model="store.isTogglePopup" bodyClass="pt-0" popupHeading="Thu vien anh" align="right">
  <template #body>
    <FileManageImage :folderName="props.folderName" :chooseImage="props.chooseImage" :column="props.column"/>
  </template>
</Popup>
</template>
