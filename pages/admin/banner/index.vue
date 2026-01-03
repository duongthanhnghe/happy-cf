<script lang="ts" setup>
import { onBeforeUnmount} from 'vue'
import { useBannerManageStore } from '@/stores/admin/banner/useBannerManageStore'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { FOLDER_UPLOAD } from '@/shared/constants/folder-upload';
import { ROUTES } from '@/shared/constants/routes';
import { useFileManageWatchers } from '@/composables/shared/file-manage/useFileManageWatchers';

definePageMeta({
  layout: ROUTES.ADMIN.BANNER.layout,
  middleware: ROUTES.ADMIN.BANNER.middleware,
})

const store = useBannerManageStore();
const storeFileManage = useFileManageFolderStore();
const folderName = FOLDER_UPLOAD.BANNER

useFileManageWatchers(storeFileManage, folderName);

onBeforeUnmount(() => {
  storeFileManage.resetState()
})
</script>
<template>

<HeaderAdmin>
  <template #right>
    <Button label="Thêm mới" color="primary" :shadow="true" @click="store.handleTogglePopupAdd(true)" />
  </template>
</HeaderAdmin>

<CreateBanner />
<UpdateBanner />
<PopupFileManageImage :folderName="folderName" :chooseImage="true" column="col-6 col-md-4"/>

<v-container>
  <client-only>
    <v-data-table-server 
      class="v-data-table-no-footer"
      :headers="store.headers" 
      :items="store.serverItems" 
      :items-length="store.serverItems.length" 
      :loading="store.loadingTable" 
      @update:options="store.loadItems"
      >
      <template #item.index="{ item }">
        <SelectOrder :order="item.order" :listOrder="store.getListOrder" @update:modelValue="(newOrder: number) => store.handleChangeOrder(item.id,newOrder)"/>
      </template>

      <template #item.image="{ item }">
        <v-img :src="item.image" max-height="60" max-width="60" cover class="rounded" />
      </template>

      <template #item.isActive="{ item }">
        <v-chip label :color="`${item.isActive === true ? 'green' : 'red'}`" v-tooltip.right="'Đổi trạng thái'" @click="store.toggleActive(item.id)">
          {{ item.isActive === true ? 'Kích hoạt' : 'Tắt kích hoạt' }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="flex gap-sm justify-end">
          <Button color="gray" size="sm" icon="edit" @click="store.handleEdit(item.id)" />
          <Button color="gray" size="sm" icon="delete" @click="store.handleDelete(item.id)" />
        </div>
      </template>

      <template #bottom />
    </v-data-table-server>
  </client-only>
</v-container>
</template>
