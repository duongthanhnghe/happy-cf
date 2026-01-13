<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import { useAboutManageStore } from '@/stores/admin/about/useAboutManageStore'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { ROUTES } from '@/shared/constants/routes';

definePageMeta({
  layout: ROUTES.ADMIN.ABOUT.layout,
  middleware: ROUTES.ADMIN.ABOUT.middleware,
})

const store = useAboutManageStore();
const storeFileManage = useFileManageFolderStore();

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

<CreateAbout />
<UpdateAbout />
<PopupFileManageImage :folderName="store.folderName" :chooseImage="true" column="col-6 col-md-4"/>

<v-container>
  <v-data-table-server 
    class="v-data-table-no-footer"
    v-model:items-per-page="store.itemsPerPage" 
    :headers="store.headers" :items="store.serverItems" 
    :items-length="store.totalItems" 
    :loading="store.loadingTable" 
    @update:options="options => {
      store.currentTableOptions = options
    }">
    <template #item.index="{ item }">
      <SelectOrder :order="item.order" :listOrder="store.getListOrder" @update:modelValue="(newOrder: number) => store.handleChangeOrder(item.id,newOrder)"/>
    </template>

    <template #item.image="{ item }">
      <Image 
        :src="item.image"
        :alt="item.image"
        :width="50"
        :height="50"
        preset="avatar"
        class="rd-lg bg-gray6"
      />
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
</v-container>
</template>
