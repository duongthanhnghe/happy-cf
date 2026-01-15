<script lang="ts" setup>
import { onMounted, onBeforeUnmount} from 'vue'
import { useMembershipStore } from '@/stores/admin/users/useMembershipStore'
import { ROUTES } from '@/shared/constants/routes';
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { FOLDER_UPLOAD } from '@/shared/constants/folder-upload';
import { useFileManageWatchers } from '@/composables/admin/file-manage/useFileManageWatchers';

definePageMeta({
  layout: ROUTES.ADMIN.USER.children?.MEMBERSHIP_LEVEL.layout,
  middleware: ROUTES.ADMIN.USER.children?.MEMBERSHIP_LEVEL.middleware,
})

const store = useMembershipStore();
const storeFileManage = useFileManageFolderStore();
const folderName = FOLDER_UPLOAD.CONFIG

useFileManageWatchers(storeFileManage, folderName);

onMounted( async () => {
  if(store.dataList.length === 0) await store.loadItems()
})

onBeforeUnmount(() => {
  storeFileManage.resetState()
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
        <img :src="item.image" width="80" :alt="item.name" />
      </template>

      <template #item.actions="{ item }">
        <div class="flex justify-end">
          <Button :border="false" color="secondary" size="sm" icon="edit" @click="store.handleEdit(item.id)" />
        </div>
      </template>

      <template #bottom />
    </v-data-table-server>
  </v-container>
</template>