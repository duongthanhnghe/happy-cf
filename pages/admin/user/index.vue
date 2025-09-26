<script lang="ts" setup>
import { watch } from "vue";
import { formatDateTime } from '@/utils/global'
import {
  useUserManageStore
} from '@/stores/admin/users/useUserManageStore'
import { useMembershipList } from '@/composables/user/useMembershipList'
import { ROUTES } from '@/shared/constants/routes';

definePageMeta({
  layout: ROUTES.ADMIN.USER.children?.CUSTOMER.layout,
  middleware: ROUTES.ADMIN.USER.children?.CUSTOMER.middleware,
})

const store = useUserManageStore();
const { getMembershipList, fetchMembershipList } = useMembershipList()

const colorType = (color: string) => {
  if (!color) return
  switch (color) {
    case 'Gold':
      return 'yellow';
    case 'Silver':
      return 'grey';
    case 'Bronze':
      return 'brown';
    default:
      return 'primary';
  }
}

watch(() => getMembershipList.value, async (newValue) => {
 if(newValue.length === 0) await fetchMembershipList()
}, { immediate: true })

</script>
<template>

<HeaderAdmin>
  <template #left>
    <v-text-field v-model="store.name" density="compact" placeholder="Tìm kiếm tên..." hide-details></v-text-field>
    <v-text-field v-model="store.phone" density="compact" placeholder="Tìm kiếm sdt..." hide-details></v-text-field>
    <v-text-field v-model="store.email" density="compact" placeholder="Tìm kiếm email..." hide-details></v-text-field>
    <v-select label="Loai member" v-model="store.filterTypeMember" :items="[{ id: null, name: null, text: 'Tat ca' }, ...getMembershipList ?? []]" :item-title="item => item.name ?? item.text" item-value="name" hide-details />
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
        <v-chip color="blue">{{item.membership.point}}</v-chip>
      </div>
    </template>

    <template #item.active="{ item }">
      <v-chip label :color="`${item.active === true ? 'green' : 'red'}`" v-tooltip.right="'Doi trang thai'" @click="store.toggleActive(item.id)">
        {{ item.active === true ? 'Kich hoat' : 'Tat kich hoat' }}
      </v-chip>
    </template>

    <template #item.birthday="{ item }">
      {{formatDateTime(item.birthday)}}
    </template>

    <template #item.createdAt="{ item }">
      {{formatDateTime(item.createdAt)}}
    </template>
    
    <template #item.actions="{ item }">
      <div class="flex gap-sm justify-end">
      <Button color="gray" size="sm" icon="visibility" @click="store.handleEdit(item.id)" />
      <Button color="gray" size="sm" icon="delete" @click="store.handleDelete(item.id)" />
      </div>
    </template>
  </v-data-table-server>
</v-container>
</template>