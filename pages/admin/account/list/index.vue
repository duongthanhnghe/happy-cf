<script lang="ts" setup>
import { formatDateTime } from '@/utils/global'
import { useAccountListStore } from '@/stores/admin/account/useAccountListStore'
import { ROUTES } from '@/shared/constants/routes';
import { ACCOUNT_ROLE } from '@/shared/constants/account-role'

definePageMeta({
  layout: ROUTES.ADMIN.USER.children?.CUSTOMER.layout,
  middleware: ROUTES.ADMIN.USER.children?.CUSTOMER.middleware,
})

const store = useAccountListStore();

</script>
<template>

<HeaderAdmin>
  <template #left>
    <v-text-field v-model="store.name" density="compact" placeholder="Tìm kiếm tên..." variant="outlined" clearable hide-details></v-text-field>
    <v-select label="Loai member" v-model="store.filterTypeMember" :items="[{ value: null, label: 'Tat ca' }, ...Object.values(ACCOUNT_ROLE) ?? []]" item-title="label" item-value="value" variant="outlined" hide-details />
  </template>
  <template #right>
    <Button label="Tao tai khoan" color="primary" @click="store.handleCreate()" />
  </template>
</HeaderAdmin>

<PopupAccountCreate />

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
    :items-per-page-options="[20, 50, 100, 200, { title: 'Tất cả', value: -1 }]"
    @update:options="options => {
        store.currentTableOptions = options
    }">
    
    <template #item.index="{ index }">
      {{ (store.currentTableOptions.page - 1) * store.currentTableOptions.itemsPerPage + index + 1 }}
    </template>

    <template #item.avatar="{ item }">
      <v-img :src="item.avatar" max-height="50" max-width="50" cover class="rd-full" />
    </template>

     <template #item.role="{ item }">
        <v-chip>{{ Object.values(ACCOUNT_ROLE).find(r => r.value === item.role)?.label || item.role }}</v-chip>
    </template>

    <template #item.active="{ item }">
      <v-chip label :color="`${item.active === true ? 'green' : 'red'}`" v-tooltip.right="'Doi trang thai'" @click="store.toggleActive(item.id)">
        {{ item.active === true ? 'Kich hoat' : 'Tat kich hoat' }}
      </v-chip>
    </template>

    <template #item.lastLogin="{ item }">
      {{formatDateTime(item.lastLogin)}}
    </template>

    <template #item.createdAt="{ item }">
      {{formatDateTime(item.createdAt)}}
    </template>

    <template #item.updatedAt="{ item }">
      {{formatDateTime(item.updatedAt)}}
    </template>
    
    <template #item.actions="{ item }">
      <div class="flex gap-sm justify-end">
      <Button color="gray" size="sm" icon="lock_reset" v-tooltip.left="'Reset Password'" @click="store.handleResetPassword(item.email)" />
      <Button color="gray" size="sm" icon="delete" @click="store.handleDelete(item.id)" />
      </div>
    </template>
  </v-data-table-server>
</v-container>
</template>