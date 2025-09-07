<script lang="ts" setup>
import { watch, onBeforeUnmount } from "vue";
import { usePostManageStore } from '@/stores/news/usePostManageStore';
import { useFileManageFolderStore } from '@/stores/file-manage/useFileManageStore';

definePageMeta({
  layout: 'admin-layout',
  middleware: 'admin-role',
})

const store = usePostManageStore();
const storeFileManage = useFileManageFolderStore();

const openPopupAdd = () => {
  store.handleResetForm()
  store.handleTogglePopupAdd(true)
}

watch(() => storeFileManage.isTogglePopup, (newValue) => {
  if(newValue && !storeFileManage.getItems && store.folderName) storeFileManage.getApiList(store.folderName)
}, { immediate: true })

onBeforeUnmount(() => {
  storeFileManage.items = null
})
</script>
<template>

<HeaderAdmin>
  <template #left>
    <v-text-field v-model="store.name" density="compact" placeholder="Tìm kiếm tên..."  hide-details></v-text-field>
    <v-select label="Chon danh muc" v-model="store.filterCategory" :items="[{ id: null, categoryName: 'Tất cả' }, ...store.getListCategory]" item-title="categoryName" item-value="id" hide-details />
  </template>

  <template #right>
    <Button label="Them moi" color="primary" :shadow="true" @click="openPopupAdd()" />
  </template>
</HeaderAdmin>

<CreatePost />
<UpdatePost />
<PopupFileManageImage :folderName="store.folderName" :chooseImage="true" column="col-6 col-md-4"/>

<v-container>
  <v-data-table-server v-model:items-per-page="store.itemsPerPage" :headers="store.headers" :items="store.serverItems" :items-length="store.totalItems" :loading="store.loadingTable" :search="store.search" item-value="name" @update:options="options => {
        store.currentTableOptions = options
        store.loadItems(options)
    }">
    <template #item.index="{ index }">
      {{ (store.currentTableOptions.page - 1) * store.itemsPerPage + index + 1 }}
    </template>

    <template #item.image="{ item }">
      <v-img :src="item.image" max-height="60" max-width="60" cover class="rounded" />
    </template>
    
    <template #item.categoryId="{ item }">
      <v-chip v-if="item.categoryId" label>
        {{ store.getCategoryName(item.categoryId)?.categoryName }}
      </v-chip>
    </template>

    <template #item.isActive="{ item }">
      <v-chip label :color="`${item.isActive === true ? 'green' : 'red'}`" @click="store.toggleActive(item.id)">
        {{ item.isActive === true ? 'Kich hoat' : 'Tat kich hoat' }}
      </v-chip>
    </template>

    <template #item.description="{ item }">
      <div v-html="item.description"></div>
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