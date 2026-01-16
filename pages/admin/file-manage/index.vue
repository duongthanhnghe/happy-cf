<script lang="ts" setup>
import "./index.scss"
import { onMounted, onBeforeUnmount } from "vue";
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { copyText } from '@/utils/global'
import { ROUTES } from '@/shared/constants/routes';
import { useDisplayStore } from "@/stores/shared/useDisplayStore";

definePageMeta({
  layout: ROUTES.ADMIN.FILE_MANAGE.layout,
  middleware: ROUTES.ADMIN.FILE_MANAGE.middleware,
})

const storeFileManage = useFileManageFolderStore()
const storeDisplay = useDisplayStore()

onMounted(() => {
  if(process.client && storeDisplay.isLaptop){
    storeFileManage.getApiListFolder()
    storeFileManage.getApiList('Default')
    storeFileManage.breadcrumb = ['Default']
  }
})

onBeforeUnmount(() => {
  storeFileManage.resetState()
})
</script>
<template>
  <HeaderAdmin headerRightClass="flex-1" headerLeftClass="flex-none">
    <template #left>
      <template v-if="storeFileManage.getBreadcrumb">
        <template v-for="(item, index) in storeFileManage.getBreadcrumb" :key="index">
          <div class="file-manage-breadcrumb-item flex gap-sm align-center">
            <Text size="lg" weight="medium" :text="item" />
            <MaterialIcon class="text-color-gray4" name="keyboard_arrow_right" />
          </div>
        </template>
      </template>
    </template>

    <template #right>
      <Button
        v-if="storeFileManage.selectedIdsDelete.length > 0"
        color="secondary"
        icon="delete"
        v-tooltip="'Xóa ảnh đã chọn'"
        @click="storeFileManage.deleteImages()"
      />

      <div
        class="flex flex-1 gap-sm align-center"
        v-if="storeFileManage.getSelectImage"
      >
        <v-text-field
          v-model="storeFileManage.getSelectImage"
          hide-details
          variant="outlined"
          disabled
          class="file-manage-url-detail"
        />
        <Button
          v-tooltip="'Sao chép URL'"
          class="file-image-item-btn"
          color="secondary"
          icon="link"
          @click="copyText(storeFileManage.getSelectImage)"
        />
      </div>
    </template>
  </HeaderAdmin>

  <v-container>
    <div class="v-table" v-if="storeDisplay.isLaptop">
      <div class="flex">
        <div class="file-manage-left">
          <LoadingData
            v-if="storeFileManage.loadingFolder"
            class="pt-ms"
          />
          <FileManageFolder v-else />
        </div>

        <div class="file-manage-right scroll-hide">
          <FileManageImage folderName="Default" :isAdmin="true" />
        </div>
      </div>
    </div>
    <NoData text="Vui lòng xem nội dung trên Máy tính!"/>
  </v-container>
</template>