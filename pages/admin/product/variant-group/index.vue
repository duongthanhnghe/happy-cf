<script lang="ts" setup>
import { useVariantGroupStore } from '@/stores/admin/product/useVariantGroupManageStore'; 
import { ROUTES } from '@/shared/constants/routes'

definePageMeta({
  layout: ROUTES.ADMIN.PRODUCT.children?.VARIANT_GROUP.layout,
  middleware: ROUTES.ADMIN.PRODUCT.children?.VARIANT_GROUP.middleware,
})

const store = useVariantGroupStore();
</script>


<template>
<HeaderAdmin>
  <template #left>
    <v-text-field
      v-model="store.name"
      placeholder="Tìm theo tên nhóm..."
      variant="outlined"
      hide-details
    ></v-text-field>
  </template>

  <template #right>
    <Button 
      label="Thêm mới"
      color="primary"
      :shadow="true"
      @click="store.handleTogglePopupAdd(true)" 
    />
  </template>
</HeaderAdmin>

<CreateVariantGroup />
<UpdateVariantGroup />

<v-container>
  <v-data-table-server
    v-model:items-per-page="store.itemsPerPage"
    :headers="store.headers"
    :items="store.serverItems"
    :items-length="store.totalItems"
    :loading="store.loadingTable"
    :search="store.search"
    item-value="groupName"
    @update:options="options => {
      store.currentTableOptions = options
      store.loadItemsVariant(options)
    }"
  >

    <template #item.index="{ item, index }">
      {{ index + 1 }}
    </template>

    <template #item.groupName="{ item }">
      <strong>{{ item.groupName }}</strong>
    </template>

    <template #item.groupType="{ item }">
      <v-chip color="blue" label>
        {{ item.groupType }}
      </v-chip>
    </template>

    <template #item.description="{ item }">
      {{ item.description }}
    </template>

    <template #item.variants="{ item }">
      <div v-if="item.variants">
        <div v-for="variant in item.variants" :key="variant.id">
        <v-chip label class="mb-sm">
          {{variant.name}}
        </v-chip>
        </div>
      </div>
    </template>

    <template #item.hasImage="{ item }">
      <v-chip 
        label 
        :color="`${item.hasImage === true ? 'green' : 'orange'}`"
      >
        {{ item.hasImage === true ? 'Có' : 'Không' }}
      </v-chip>
    </template>

    <template #item.isActive="{ item }">
      <v-chip 
        label 
        :color="`${item.isActive === true ? 'green' : 'red'}`"
        v-tooltip.right="'Đổi trạng thái'" 
        @click="store.toggleActive(item.id)"
      >
        {{ item.isActive === true ? 'Kích hoạt' : 'Tắt' }}
      </v-chip>
    </template>

    <template #item.actions="{ item }">
      <div class="flex gap-sm justify-end">
        <Button 
          :border="false" 
          color="secondary" 
          size="sm" 
          icon="edit" 
          @click="store.handleEditVariant(item.id.toString())" 
        />
        <Button 
          :border="false" 
          color="secondary" 
          size="sm" 
          icon="delete" 
          @click="store.handleDeleteVariant(item.id.toString())" 
        />
      </div>
    </template>

  </v-data-table-server>
</v-container>
</template>
