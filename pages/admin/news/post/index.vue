<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { usePostManageStore } from '@/stores/admin/news/usePostManageStore';
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { ROUTES } from '@/shared/constants/routes';
import { useFileManageWatchers } from '@/composables/admin/file-manage/useFileManageWatchers';
import { ROUTE_HELPERS } from "@/shared/constants/routes-helpers";

definePageMeta({
  layout: ROUTES.ADMIN.NEWS.children?.POST.layout,
  middleware: ROUTES.ADMIN.NEWS.children?.POST.middleware,
})

const store = usePostManageStore();
const storeFileManage = useFileManageFolderStore();

useFileManageWatchers(storeFileManage, store.folderName);

onBeforeUnmount(() => {
  store.resetFilter()
  storeFileManage.resetState()
})
</script>
<template>

<HeaderAdmin>
  <template #left>
    <v-text-field 
      v-model="store.searchInput" 
      placeholder="Tìm kiếm tên..." 
      variant="outlined"
      hide-details
      clearable
      @keyup.enter="store.handleSearch"
      @click:clear="store.handleSearch(false)"
      ></v-text-field>
    <v-select v-if="store.getListCategory" label="Chon danh muc" v-model="store.filterCategory" :items="[{ id: '', categoryName: 'Tất cả' }, ...store.getListCategory]" item-title="categoryName" item-value="id" variant="outlined" hide-details />
    <Button v-if="store.hasFilter" color="black" size="md" icon="filter_alt_off" @click="store.resetFilter()" />
  </template>

  <template #right>
    <Button label="Thêm mới" color="primary" :shadow="true" @click="store.handleTogglePopupAdd(true)" />
  </template>
</HeaderAdmin>

<CreatePost />
<UpdatePost />
<PopupFileManageImage :folderName="store.folderName" :children="false" :chooseImage="true" column="col-6 col-md-4"/>

<v-container>
  <v-data-table-server
    v-model:page="store.currentTableOptions.page"
    v-model:items-per-page="store.currentTableOptions.itemsPerPage"
    :headers="store.headers"
    :items="store.serverItems"
    :items-length="store.totalItems"
    :loading="store.loadingTable"
    :search="store.search"
    item-value="name"
    :items-per-page-options="[10, 20, 50, 100, 200, { title: 'Tất cả', value: -1 }]"
    @update:options="options => {
      store.currentTableOptions = options
    }">
    <template #item.index="{ index }">
      {{ (store.currentTableOptions.page - 1) * store.currentTableOptions.itemsPerPage + index + 1 }}
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
    
    <template #item.categoryName="{ item }">
      <v-chip v-if="item.categoryName" label>
        {{ item.categoryName }}
      </v-chip>
    </template>

    <template #item.isActive="{ item }">
      <v-chip label :color="`${item.isActive === true ? 'green' : 'red'}`" v-tooltip.right="'Đổi trạng thái'" @click="store.toggleActive(item.id)">
        {{ item.isActive === true ? 'Kích hoạt' : 'Tắt kích hoạt' }}
      </v-chip>
    </template>

    <template #item.description="{ item }">
      <div v-html="item.description"></div>
    </template>

    <template #item.actions="{ item }">
      <div class="flex gap-sm justify-end">
        <NuxtLink :to="ROUTE_HELPERS.newsDetail(item.slug)" target="_blank">
          <Button tag="div" color="gray" size="sm" icon="visibility" />
        </NuxtLink>
        <Button color="gray" size="sm" icon="edit" @click="store.handleEdit(item.id)" />
        <Button color="gray" size="sm" icon="delete" @click="store.handleDelete(item.id)" />
      </div>
    </template>
  </v-data-table-server>
</v-container>
</template>