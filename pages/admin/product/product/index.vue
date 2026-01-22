<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useProductManageStore } from '@/stores/admin/product/useProductManageStore'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { formatCurrency } from '@/utils/global'
import { ROUTES } from '@/shared/constants/routes';
import { ROUTE_HELPERS } from '@/shared/constants/routes-helpers';
import { useAdminProductCategory } from '@/composables/admin/product/category/useAdminProductCategory';

definePageMeta({
  layout: ROUTES.ADMIN.PRODUCT.children?.LIST.layout,
  middleware: ROUTES.ADMIN.PRODUCT.children?.LIST.middleware,
})

const store = useProductManageStore();
const storeFileManage = useFileManageFolderStore();
const { getListCategoryAll, fetchCategoryList } = useAdminProductCategory()

onMounted(async () => {
  if(!getListCategoryAll.value || getListCategoryAll.value.data.length === 0) await fetchCategoryList(1,9999,'')
})

onBeforeUnmount(() => {
  store.resetFilter()
  store.resetState()
  storeFileManage.resetState()
})
</script>
<template>

<HeaderAdmin>
  <template #left>
    <v-text-field v-model="store.search" placeholder="Tìm kiếm tên, sku..." variant="outlined" clearable hide-details @update:modelValue="value => store.search = value ?? ''"></v-text-field>
    <v-autocomplete
      v-if="getListCategoryAll"
      v-model="store.categorySelectedFilter"
      :items="[{ id: '', categoryName: 'Danh mục SP' }, ...getListCategoryAll.data]"
      item-title="categoryName"
      item-value="id"
      hide-details
      clearable
      autocomplete="off" 
      variant="outlined"
      @update:modelValue="value => store.categorySelectedFilter = value ?? ''"
    />
    <Button v-if="store.hasFilter" color="black" size="md" icon="filter_alt_off" @click="store.resetFilter()" />
  </template>

  <template #right>
    <Button
      v-if="store.selectedIdsDelete.length > 0"
      color="secondary"
      icon="delete"
      @click="store.handleDeleteManyProducts()"
    />
    <div>
      <v-menu transition="slide-x-transition">
        <template v-slot:activator="{ props }">
          <Button
            v-bind="props"
            tag="span"
            color="secondary"
            label="Chỉnh sửa"
          />
        </template>
        <v-list class="mt-sm">
          <v-list-item
            v-for="(item, i) in store.menuActions"
            :key="i"
            @click="item.action"
          >
            <v-list-item-title>
              <div class="flex align-center gap-sm weight-medium cursor-pointer">
                <MaterialIcon :name="item.icon" />
                {{ item.label }}
              </div>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </template>
</HeaderAdmin>

<CreateProduct />
<UpdateProduct />
<CreateVariantProduct />
<ImportProduct />
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
    :items-per-page-options="[50, 100, 200, { title: 'Tất cả', value: -1 }]"
    @update:options="options => {
        store.currentTableOptions = options
    }">
    <template #item.index="{ item,index }">
      <div class="flex align-center">
        <VCheckbox
          :key="item.id"
          v-model="store.selectedIdsDelete"
          :value="item.id"
          hide-details
        />
        {{ (store.currentTableOptions.page - 1) * store.currentTableOptions.itemsPerPage + index + 1 }}
      </div>
    </template>

    <template #item.image="{ item }">
      <div class="flex gap-xs position-relative white-space justify-between">
        <Image 
          :src="item.image"
          :alt="item.productName"
          :width="50"
          :height="50"
          preset="avatar"
          class="rd-lg bg-gray6"
        />
        <template v-if="item.listImage.length > 0" v-for="(itemImage, index) in item.listImage" :key="index" >
          <Image 
            v-if="index < 2 && itemImage"
            :src="itemImage.src" :alt="item.productName"
            :width="50"
            :height="50"
            preset="avatar"
            class="rd-lg bg-gray6"
          />
          <span v-else-if="index < 3" class="el-absolute max-width-50 right-0 align-center flex justify-center bg-black-40 text-color-white rd-lg">+{{ item.listImage.length - 2 }}</span>
          <template v-else />
        </template>
      </div>
    </template>

    <template #item.category="{ item }">
      <v-chip label color="blue">
        {{ item.category?.categoryName }}
      </v-chip>
    </template>

    <template #item.price="{ item }">
      {{ formatCurrency(item.price) }}
    </template>

    <template #item.priceDiscounts="{ item }">
      <div class="white-space">
      {{ formatCurrency(item.priceDiscounts) }}
      <v-chip label color="red" class="ml-xs" v-if="item.priceDiscounts !== item.price">
        {{ Math.round(((item.price - (item.priceDiscounts ?? 0)) / item.price) * 100) + "%" }}
      </v-chip>
      </div>
    </template>

    <template #item.variantGroups="{ item }">
      <div v-if="item.variantGroups">
        <div v-for="optionItem in item.variantGroups" :key="optionItem.groupId">
        <v-chip label class="mb-sm">
          {{optionItem.groupName}}
        </v-chip>
        </div>
      </div>
    </template>

    <template #item.amount="{ item }">
      {{ store.getTotalVariantStock(item) }}
    </template>

    <template #item.isActive="{ item }">
      <v-chip label :color="`${item.isActive === true ? 'green' : 'red'}`" v-tooltip.right="'Đổi trạng thái'" @click="store.toggleActive(item.id)">
        {{ item.isActive === true ? 'Kich hoat' : 'Tắt kích hoạt' }}
      </v-chip>
    </template>

    <template #item.actions="{ item }">
      <div class="flex gap-sm justify-end">
        <NuxtLink :to="ROUTE_HELPERS.productDetail(item.slug)" target="_blank">
          <Button tag="div" :border="false" color="secondary" size="sm" icon="visibility" />
        </NuxtLink>
        <Button :border="false" color="secondary" size="sm" icon="edit" @click="store.handleEditProduct(item.id)" />
        <Button :border="false" color="secondary" size="sm" icon="delete" @click="store.handleDeleteProduct(item.id)" />
      </div>
    </template>
  </v-data-table-server>
</v-container>
</template>
