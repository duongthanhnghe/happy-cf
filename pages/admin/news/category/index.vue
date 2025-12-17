<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import { useCategoryManageStore } from '@/stores/admin/news/useCategoryManageStore'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { FOLDER_UPLOAD } from '@/shared/constants/folder-upload';
import { ROUTES } from '@/shared/constants/routes';
import { useFileManageWatchers } from '@/composables/shared/file-manage/useFileManageWatchers';

definePageMeta({
  layout: ROUTES.ADMIN.NEWS.children?.CATEGORY.layout,
  middleware: ROUTES.ADMIN.NEWS.children?.CATEGORY.middleware,
})

const storeFileManage = useFileManageFolderStore();
const store = useCategoryManageStore();
const folderName = FOLDER_UPLOAD.CATEGORY_NEWS

useFileManageWatchers(storeFileManage, folderName);

onBeforeUnmount(() => {
  storeFileManage.items = null
})
</script>
<template>

<HeaderAdmin>
  <template #left>
    <v-text-field 
      v-model="store.search" 
      placeholder="Tìm kiếm tên..." 
      variant="outlined" 
      hide-details
      clearable
      @update:modelValue="value => store.search = value ?? ''"
      ></v-text-field>
  </template>

  <template #right>
    <Button color="primary" label="Them moi" :shadow="true" @click="store.handleTogglePopupAdd(true)" />
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
      <SelectOrder :order="item.order" :listOrder="store.getListOrder" @update:modelValue="(newOrder: number) => store.handleChangeOrder(item.id,newOrder)"/>
    </template>

    <template #item.image="{ item }">
      <v-img :src="item.image" max-height="60" max-width="60" cover class="rounded" />
    </template>

    <template #item.isActive="{ item }">
      <v-chip label :color="`${item.isActive === true ? 'green' : 'red'}`" v-tooltip.right="'Đổi trạng thái'"  @click="store.toggleActive(item.id)">
        {{ item.isActive === true ? 'Kích hoạt' : 'Tắt kích hoạt' }}
      </v-chip>
    </template>

    <template #item.actions="{ item }">
      <div class="flex gap-sm justify-end">
      <NuxtLink :to="`${ROUTES.PUBLIC.NEWS.children?.CATEGORY.path}/${item.slug}`" target="_blank">
        <Button color="gray" size="sm" icon="visibility" />
      </NuxtLink>
      <Button color="gray" size="sm" icon="edit" @click="store.handleEdit(item.id)" />
      <Button color="gray" size="sm" icon="delete" @click="store.handleDelete(item.id)" />
      </div>
    </template>
  </v-data-table-server>
</v-container>
</template>