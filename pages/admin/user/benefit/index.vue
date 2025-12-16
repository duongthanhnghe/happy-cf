<script lang="ts" setup>
import { useBenefitStore } from '@/stores/admin/users/useBenefitStore'
import { ROUTES } from '@/shared/constants/routes';
import { formatDateTime } from '@/utils/global'
import { onMounted } from 'vue';

definePageMeta({
  layout: ROUTES.ADMIN.USER.children?.MEMBERSHIP_LEVEL.layout,
  middleware: ROUTES.ADMIN.USER.children?.MEMBERSHIP_LEVEL.middleware,
})

const store = useBenefitStore();

onMounted( async () => {
  if(store.dataList.length === 0) await store.loadItems()
})
</script>
<template>

  <HeaderAdmin>
    <template #right>
      <Button label="Them moi" color="primary" :shadow="true" @click="store.handleTogglePopupAdd()" />
    </template>
  </HeaderAdmin>
  <CreateMembershipBenefit />
  <UpdateMembershipBenefit />

  <v-container>
    <v-data-table-server 
      class="v-data-table-no-footer"
      v-model:page="store.page"
      v-model:items-per-page="store.itemsPerPage"
      :headers="store.headers"
      :items="store.serverItems"
      :items-length="store.totalItems"
      :loading="store.loadingTable"
      >

      <template #item.icon="{ item }">
        <div class="flex gap-sm align-center">
          <MaterialIcon :name="item.icon"/> {{ item.icon }}
        </div>
      </template>

      <template #item.createdAt="{ item }">
        {{formatDateTime(item.createdAt)}}
      </template>

      <template #item.actions="{ item }">
        <div class="flex gap-sm justify-end">
          <Button :border="false" color="secondary" size="sm" icon="edit" @click="store.handleEdit(item.id)" />
          <Button :border="false" color="secondary" size="sm" icon="delete" @click="store.handleDelete(item.id)" />
        </div>
      </template>

      <template #bottom />
    </v-data-table-server>
  </v-container>
</template>