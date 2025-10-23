<script lang="ts" setup>
import { useVoucherManageStore } from '@/stores/admin/voucher/useVoucherManageStore';
import { ROUTES } from '@/shared/constants/routes';
import { formatDateTime, formatCurrency } from '@/utils/global';
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';

definePageMeta({
  layout: ROUTES.ADMIN.VOUCHER.layout,
  middleware: ROUTES.ADMIN.VOUCHER.middleware,
});

const store = useVoucherManageStore();

const openPopupAdd = () => {
  store.handleResetForm();
  store.handleTogglePopupAdd(true);
};
</script>

<template>
  <HeaderAdmin>
    <template #left>
      <v-text-field v-model="store.code" density="compact" placeholder="Tìm mã..." variant="outlined" hide-details></v-text-field>
      <v-select
        v-model="store.filterType"
        label="Loại voucher"
        density="compact"
        :items="[
          { type: null, name: 'Tất cả', color: 'grey' },
          ...Object.values(VOUCHER_TYPE)
        ]"
        :item-title="item => item.name"
        item-value="type"
        variant="outlined"
        hide-details
      />
    </template>

    <template #right>
      <Button color="primary" label="Thêm mới" :shadow="true" @click="openPopupAdd()" />
    </template>
  </HeaderAdmin>

  <CreateVoucher />
  <UpdateVoucher />

  <v-container>
    <v-data-table-server class="voucher-table elevation-0"
      v-model:items-per-page="store.itemsPerPage"
      :headers="store.headers"
      :items="store.serverItems"
      :items-length="store.totalItems"
      :loading="store.loadingTable"
      :search="store.search"
      item-value="code"
      @update:options="options => {
        store.currentTableOptions = options;
        store.loadItems(options);
      }">

      <template #item.index="{ index }">
        {{ index + 1 }}
      </template>

      <template #item.type="{ item }">
        <v-chip :color="VOUCHER_TYPE[item.type]?.color || 'grey'" label>
          {{ VOUCHER_TYPE[item.type]?.name || item.type }}
        </v-chip>
      </template>

      <template #item.dateRange="{ item }">
        <div class="flex align-center justify-between gap-sm">
          <div>
            {{ formatDateTime(item.startDate,'vi-VN', false) }} → {{ formatDateTime(item.endDate,'vi-VN', false) }}
          </div>
          <div>
            <template v-if="new Date() < new Date(item.startDate)">
              <v-chip label color="blue" small>Chưa diễn ra</v-chip>
            </template>
            <template v-else-if="new Date() > new Date(item.endDate)">
              <v-chip label color="red" small>Đã kết thúc</v-chip>
            </template>
            <template v-else>
              <v-chip label color="green" small>Đang diễn ra</v-chip>
            </template>
          </div>
        </div>
      </template>

      <template #item.isActive="{ item }">
        <v-chip label :color="item.isActive ? 'green' : 'red'" v-tooltip.right="'Đổi trạng thái'" small @click="store.toggleActive(item.id)">
          {{ item.isActive ? 'Kích hoạt' : 'Tắt' }}
        </v-chip>
      </template>

      <template #item.maxShippingDiscount="{ item }">
        <template v-if="item.type === 'freeship'">
          {{ formatCurrency(item.maxShippingDiscount ? item.maxShippingDiscount : '-') }}
        </template>
      </template>

      <!-- Giá trị giảm (value) -->
    <template #item.value="{ item }">
      <template v-if="item.type !== 'freeship'"> <!-- Hiển thị nếu không phải freeship -->
        <template v-if="item.type === 'percentage'">
          <v-chip label color="gray" small>{{ item.value }}%</v-chip>
        </template>
        <template v-else>
          {{ item.value ? formatCurrency(item.value) : '-' }}
        </template>
      </template>
    </template>

      <!-- Giảm tối đa (maxDiscount) -->
      <template #item.maxDiscount="{ item }">
        <template v-if="item.type === 'percentage'"> <!-- Chỉ hiển thị nếu là percentage -->
          {{ item.maxDiscount ? formatCurrency(item.maxDiscount) : '-' }}
        </template>
      </template>

      <!-- Đơn hàng tối thiểu (minOrderValue) -->
      <template #item.minOrderValue="{ item }">
          {{ item.minOrderValue ? formatCurrency(item.minOrderValue) : '-' }}
      </template>

      <template #item.createdAt="{ item }">
            {{ formatDateTime(item.createdAt,'vi-VN', false) }}
      </template>

      <template #item.actions="{ item }">
        <div class="flex gap-sm justify-end">
          <Button :border="false" color="secondary" size="sm" icon="edit" @click="store.handleEdit(item.id)" />
          <span v-tooltip.right="item.usedCount > 0 || new Date(item.startDate) <= new Date() ? 'Voucher đã được sử dụng hoặc đang diễn ra' : ''">
          <Button 
            :disabled="item.usedCount > 0 || new Date(item.startDate) <= new Date()"
            :border="false" color="secondary" size="sm" icon="delete" @click="store.handleDelete(item.id)"
          />
          </span>
        </div>
      </template>
    </v-data-table-server>
  </v-container>
</template>
