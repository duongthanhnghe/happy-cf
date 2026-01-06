<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from "vue";
import { formatDateTime } from '@/utils/global'
import { useUserManageStore } from '@/stores/admin/users/useUserManageStore'
import { ROUTES } from '@/shared/constants/routes';
import { useUserHelpers } from "@/utils/userHelpers";
import { useAdminUserDetailStore } from "@/stores/admin/users/useUserDetailStore";
import { useMembershipStore } from "@/stores/admin/users/useAdminMembershipStore";

definePageMeta({
  layout: ROUTES.ADMIN.USER.children?.CUSTOMER.layout,
  middleware: ROUTES.ADMIN.USER.children?.CUSTOMER.middleware,
})

const store = useUserManageStore();
const storeMembership = useMembershipStore()
const storeDetailUser = useAdminUserDetailStore();

const { colorType } = useUserHelpers()

onMounted( async () => {
 if(storeMembership.getListData.length === 0) await storeMembership.fetchMembershipStore()
})

onBeforeUnmount(() => {
  store.resetFilter()
})
</script>
<template>

<HeaderAdmin>
  <template #left>
    <v-text-field v-model="store.search" density="compact" placeholder="Tìm kiếm tên, email..." variant="outlined" hide-details></v-text-field>
    <v-select v-model="store.filterTypeMember" variant="outlined" :items="[{ id: null, name: null, text: 'Tất cả' }, ...storeMembership.getListData ?? []]" :item-title="item => item.name ?? item.text" item-value="name" hide-details />
    <Button v-if="store.hasFilter" color="black" size="md" icon="filter_alt_off" @click="store.resetFilter()" />
  </template>
</HeaderAdmin>

<DetailAccount />

<v-container>
  <v-data-table-server class="category-table elevation-0"
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

    <template #item.image="{ item }">
      <v-img :src="item.avatar" max-height="60" max-width="60" cover class="rounded" />
    </template>

    <template #item.membership="{ item }">
      <div class="flex gap-xs">
        <v-chip :color="colorType(item.membership.level)" >{{item.membership.level}}</v-chip>
        <v-chip color="blue">{{item.membership.point}} điểm</v-chip>
      </div>
    </template>

    <template #item.active="{ item }">
      <v-chip label :color="`${item.active === true ? 'green' : 'red'}`" v-tooltip.right="'Đổi trạng thái'" @click="store.toggleActive(item.id)">
        {{ item.active === true ? 'Kích hoạt' : 'Tắt kích hoạt' }}
      </v-chip>
    </template>

    <template #item.birthday="{ item }">
      {{formatDateTime(item.birthday,'vi-VN', false)}}
    </template>

    <template #item.createdAt="{ item }">
      {{formatDateTime(item.createdAt,'vi-VN', false)}}
    </template>
    
    <template #item.actions="{ item }">
      <div class="flex gap-sm justify-end">
      <Button color="gray" size="sm" icon="visibility" @click="storeDetailUser.handleTogglePopup(true,item.id)" />
      <Button color="gray" size="sm" icon="delete" @click="store.handleDelete(item.id)" />
      </div>
    </template>
  </v-data-table-server>
</v-container>
</template>