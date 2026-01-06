<script lang="ts" setup>
import { useFileManageClientStore } from '@/stores/client/file-manage/useFileManageStore';

const store = useFileManageClientStore()

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
  <Popup :children="true" v-model="store.isTogglePopup" bodyClass="pt-0" popupHeading="Thư viện ảnh" align="right">
    <template #body>
      <ClientFileManage :folderName="props.folderName" :chooseImage="props.chooseImage" :column="props.column"/>
    </template>
  </Popup>
</template>
