<script lang="ts" setup>
import "./index.scss"
import { onMounted, onBeforeUnmount } from "vue";
import { useFileManageFolderStore } from '@/stores/file-manage/useFileManageStore';
import {
  copyText
} from '@/utils/global'
import { ROUTES } from '@/shared/constants/routes';

definePageMeta({
  layout: ROUTES.ADMIN.FILE_MANAGE.layout,
  middleware: ROUTES.ADMIN.FILE_MANAGE.middleware,
})

const storeFileManage = useFileManageFolderStore()

onMounted(() => {
  if(process.client){
    storeFileManage.getApiListFolder()
    storeFileManage.getApiList('Default')
    storeFileManage.breadcrumb = ['Default']
  }
})

onBeforeUnmount(() => {
  storeFileManage.items = null
})
</script>
<template>
  <HeaderAdmin>
    <template #left >
      <template v-if="storeFileManage.getBreadcrumb">
        <template v-for="(item,index) in storeFileManage.getBreadcrumb" :key="index">
          <div class="file-manage-breadcrumb-item flex gap-sm align-center">
            <Heading tag="div" size="lg" weight="medium">
              {{ item }}
            </Heading>
            <MaterialIcon class="text-color-gray4" name="keyboard_arrow_right"/>
          </div>
        </template>
      </template>
    </template>
    <template #right >
      <div class="flex flex-1 gap-sm align-center mr-md" v-if="storeFileManage.getSelectImage">
        <v-text-field v-model="storeFileManage.getSelectImage" hide-details disabled class="file-manage-url-detail"></v-text-field>
        <Button
          v-tooltip="'Copy URL'"
          class="file-image-item-btn"
          color="secondary"
          icon="link"
          @click="copyText(storeFileManage.getSelectImage)"
        />
      </div>
    </template>
  </HeaderAdmin>
  <v-container>
    <div class="v-table">
      <div class="flex">
        <div class="file-manage-left">
          <FileManageFolder />
        </div>
        <div class="file-manage-right scroll-hide">
          <FileManageImage folderName="PostsNews" />
        </div>
      </div>
    </div>
  </v-container>
</template>
