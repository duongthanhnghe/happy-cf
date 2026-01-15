<script lang="ts" setup>
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';

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
  },
  children: {
    type: Boolean,
    default: true,
  }
})

</script>
<template>
<Popup important :children="props.children" v-model="store.isTogglePopup" bodyClass="pt-0" popupHeading="Thư viện ảnh" align="right">
  <template #body>
    <FileManageImage :folderName="props.folderName" :chooseImage="props.chooseImage" :column="props.column"/>
  </template>
</Popup>
</template>
