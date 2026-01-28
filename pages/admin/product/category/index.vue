<script lang="ts" setup>
import { onBeforeUnmount} from 'vue'
import { useCategoryManageStore } from '@/stores/admin/product/useCategoryManageStore'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { ROUTES } from '@/shared/constants/routes';
import { ROUTE_HELPERS } from '@/shared/constants/routes-helpers';
import { BANNER_LAZY } from '@/const/image';

definePageMeta({
  layout: ROUTES.ADMIN.PRODUCT.children?.CATEGORY.layout,
  middleware: ROUTES.ADMIN.PRODUCT.children?.CATEGORY.middleware,
})

const store = useCategoryManageStore();
const storeFileManage = useFileManageFolderStore();

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
    <Button v-if="store.hasFilter" color="black" size="md" icon="filter_alt_off" @click="store.resetFilter()" />
  </template>

  <template #right>
    <Button label="Thêm mới" color="primary" :shadow="true" @click="store.handleTogglePopupAdd(true)" />
  </template>
</HeaderAdmin>

<CreateCategoryProduct />
<UpdateCategoryProduct />
<PopupFileManageImage :folderName="store.folderName" :chooseImage="true" column="col-6 col-md-4"/>

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

    <template #item.banner="{ item }">
      <Image 
        :src="item.banner"
        :alt="item.banner"
        :width="100"
        :height="50"
        preset="avatar"
        :placeholder="BANNER_LAZY"
        class="rd-lg bg-gray6"
      />
    </template>

    <template #item.parent="{ item }">
      <v-chip label v-if="item.parent">
        {{ item.parent.categoryName }}
      </v-chip>
    </template>

    <template #item.isActive="{ item }">
      <v-chip label :color="`${item.isActive === true ? 'green' : 'red'}`" v-tooltip.right="'Đổi trạng thái'" @click="store.toggleActive(item.id)">
        {{ item.isActive === true ? 'Kích hoạt' : 'Tắt kích hoạt' }}
      </v-chip>
    </template>

    <template #item.actions="{ item }">
      <div class="flex gap-sm justify-end">
        <NuxtLink :to="ROUTE_HELPERS.productCategory(item.slug)" target="_blank">
          <Button :border="false" color="secondary" size="sm" icon="visibility" />
        </NuxtLink>
        <Button :border="false" color="secondary" size="sm" icon="edit" @click="store.handleEditCategory(item.id.toString())" />
        <Button :border="false" color="secondary" size="sm" icon="delete" @click="store.handleDeleteCategory(item.id.toString())" />
      </div>
    </template>
  </v-data-table-server>
</v-container>
</template>
