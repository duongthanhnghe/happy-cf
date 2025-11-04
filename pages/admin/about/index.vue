<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import { useAboutManageStore } from '@/stores/admin/about/useAboutManageStore'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { ROUTES } from '@/shared/constants/routes';
import { useFileManageWatchers } from '@/composables/shared/file-manage/useFileManageWatchers';

definePageMeta({
  layout: ROUTES.ADMIN.ABOUT.layout,
  middleware: ROUTES.ADMIN.ABOUT.middleware,
})

const store = useAboutManageStore();
const storeFileManage = useFileManageFolderStore();

useFileManageWatchers(storeFileManage, store.folderName);

onBeforeUnmount(() => {
  storeFileManage.items = null
})
</script>
<template>

<HeaderAdmin>
  <template #left>
    <v-text-field v-model="store.name" density="compact" placeholder="Tìm kiếm tên..." hide-details></v-text-field>
  </template>

  <template #right>
    <Button label="Them moi" color="primary" :shadow="true" @click="store.handleTogglePopupAdd(true)" />
  </template>
</HeaderAdmin>

<CreateAbout />
<UpdateAbout />
<PopupFileManageImage :folderName="store.folderName" :chooseImage="true" column="col-6 col-md-4"/>

<v-container>
  <v-data-table-server v-model:items-per-page="store.itemsPerPage" :headers="store.headers" :items="store.serverItems" :items-length="store.totalItems" :loading="store.loadingTable" :search="store.search" item-value="name"
        @update:options="options => {
        store.currentTableOptions = options
        store.loadItems(options)
    }">
    <template #item.index="{ item }">
      <SelectOrder :order="item.order" :listOrder="store.getListOrder" @update:modelValue="(newOrder: number) => store.handleChangeOrder(item.id,newOrder)"/>
    </template>

    <template #item.image="{ item }">
      <v-img :src="item.image" max-height="60" max-width="60" cover class="rounded" />
    </template>

    <template #item.isActive="{ item }">
      <v-chip label :color="`${item.isActive === true ? 'green' : 'red'}`" v-tooltip.right="'Doi trang thai'" @click="store.toggleActive(item.id)">
        {{ item.isActive === true ? 'Kich hoat' : 'Tat kich hoat' }}
      </v-chip>
    </template>

    <template #item.actions="{ item }">
      <div class="flex gap-sm justify-end">
        <Button color="gray" size="sm" icon="edit" @click="store.handleEdit(item.id)" />
        <Button color="gray" size="sm" icon="delete" @click="store.handleDelete(item.id)" />
      </div>
    </template>
  </v-data-table-server>
</v-container>
</template>
