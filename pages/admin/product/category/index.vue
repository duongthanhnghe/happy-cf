<script lang="ts" setup>
import { onBeforeUnmount} from 'vue'
import { useCategoryManageStore } from '@/stores/admin/product/useCategoryManageStore'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { FOLDER_UPLOAD } from '@/shared/constants/folder-upload';
import { ROUTES } from '@/shared/constants/routes';
import { useFileManageWatchers } from '@/composables/shared/file-manage/useFileManageWatchers';
import { ROUTE_HELPERS } from '@/shared/constants/routes-helpers';

definePageMeta({
  layout: ROUTES.ADMIN.PRODUCT.children?.CATEGORY.layout,
  middleware: ROUTES.ADMIN.PRODUCT.children?.CATEGORY.middleware,
})

const store = useCategoryManageStore();
const storeFileManage = useFileManageFolderStore();
const folderName = FOLDER_UPLOAD.CATEGORY_PRODUCT

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
    <Button label="Thêm mới" color="primary" :shadow="true" @click="store.handleTogglePopupAdd(true)" />
  </template>
</HeaderAdmin>

<CreateCategoryProduct />
<UpdateCategoryProduct />
<PopupFileManageImage :folderName="folderName" :chooseImage="true" column="col-6 col-md-4"/>

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
      <v-img :src="item.image" max-height="60" max-width="60" cover class="rounded" />
    </template>

    <template #item.banner="{ item }">
      <v-img v-if="item.banner" :src="item.banner" max-height="60" class="rounded" />
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
