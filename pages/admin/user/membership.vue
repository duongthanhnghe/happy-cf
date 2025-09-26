<script lang="ts" setup>
import { watch, onBeforeUnmount} from 'vue'
import {
  useMembershipStore
} from '@/stores/admin/users/useMembershipStore'
import { ROUTES } from '@/shared/constants/routes';
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { FOLDER_UPLOAD } from '@/shared/constants/folder-upload';

definePageMeta({
  layout: ROUTES.ADMIN.USER.children?.MEMBERSHIP_LEVEL.layout,
  middleware: ROUTES.ADMIN.USER.children?.MEMBERSHIP_LEVEL.middleware,
})

const store = useMembershipStore();
const storeFileManage = useFileManageFolderStore();
const folderName = FOLDER_UPLOAD.CONFIG

watch(() => storeFileManage.isTogglePopup, (newValue) => {
  if(newValue && !storeFileManage.getItems) storeFileManage.getApiList(folderName)
}, { immediate: true })

onBeforeUnmount(() => {
  storeFileManage.items = null
})
</script>
<template>

  <HeaderAdmin />
  <UpdateMembership />
  <PopupFileManageImage :folderName="folderName" :chooseImage="true" column="col-6 col-md-4"/>


  <v-container>
    <v-data-table-server 
      class="v-data-table-no-footer"
      v-model:page="store.page"
      v-model:items-per-page="store.itemsPerPage"
      :headers="store.headers"
      :items="store.serverItems"
      :items-length="store.totalItems"
      :loading="store.loadingTable"
      >

      <template #item.benefits="{ item }">
        <div class="flex flex-direction-column gap-xs">
          <v-chip v-for="items in item.benefits">
            {{ items.name }}
          </v-chip>
        </div>
      </template>

      <template #item.image="{ item }">
        <v-img :src="item.image" max-height="60" max-width="60" cover class="rounded" />
      </template>

      <template #item.actions="{ item }">
        <div class="flex justify-end">
          <Button color="gray" size="sm" icon="edit" @click="store.handleEdit(item.id)" />
        </div>
      </template>

      <template #bottom />
    </v-data-table-server>
  </v-container>
</template>