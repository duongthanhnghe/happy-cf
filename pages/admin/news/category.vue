<script lang="ts" setup>
import { watch, onBeforeUnmount } from 'vue'
import {
  useCategoryManageStore
} from '@/stores/news/useCategoryManageStore'
import { useFileManageFolderStore } from '@/stores/file-manage/useFileManageStore';
import { FOLDER_UPLOAD } from '@/shared/constants/folder-upload';

definePageMeta({
  layout: 'admin-layout',
  middleware: 'admin-role',
})

const storeFileManage = useFileManageFolderStore();
const store = useCategoryManageStore();
const folderName = FOLDER_UPLOAD.CATEGORY_NEWS

const openPopupAdd = () => {
  store.handleResetForm()
  store.handleTogglePopupAdd(true)
}

watch(() => storeFileManage.isTogglePopup, (newValue) => {
  if(newValue && !storeFileManage.getItems) storeFileManage.getApiList(folderName)
}, { immediate: true })

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
    <Button color="primary" label="Them moi" :shadow="true" @click="openPopupAdd()" />
  </template>
</HeaderAdmin>

<CreateCategoryNews />
<UpdateCategoryNews />
<PopupFileManageImage :folderName="folderName" :chooseImage="true" column="col-6 col-md-4"/>

<v-container>
  <v-data-table-server class="category-table elevation-0"
    v-model:items-per-page="store.itemsPerPage"
    :headers="store.headers"
    :items="store.serverItems"
    :items-length="store.totalItems"
    :loading="store.loadingTable"
    :search="store.search"
    item-value="name"
    @update:options="options => {
      store.currentTableOptions = options
      store.loadItems(options)
    }">
    
    <template #item.index="{ item }">
    123
      <v-select
        :items="store.getListOrder"
        v-model="item.order"
        variant="outlined"
        hide-details
        class="v-select-order"
        @update:modelValue="(newOrder: number) => store.handleChangeOrder(item.id,newOrder)"
      ></v-select>
    </template>

    <template #item.image="{ item }">
      <v-img :src="item.image" max-height="60" max-width="60" cover class="rounded" />
    </template>

    <template #item.isActive="{ item }">
      <v-chip label :color="`${item.isActive === true ? 'green' : 'red'}`" @click="store.toggleActive(item.id)">
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