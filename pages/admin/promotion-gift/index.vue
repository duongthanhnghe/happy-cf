<script lang="ts" setup>
import { usePromotionGiftManageStore } from '@/stores/admin/promotion-gift/usePromotionGiftManageStore'
import { ROUTES } from '@/shared/constants/routes'
import { formatCurrency, formatDateTime } from '@/utils/global';
import { onBeforeUnmount } from 'vue';

definePageMeta({
  layout: ROUTES.ADMIN.PROMOTION_GIFT.children?.LIST.layout,
  middleware: ROUTES.ADMIN.PROMOTION_GIFT.children?.LIST.middleware,
})

const store = usePromotionGiftManageStore()

onBeforeUnmount(() => {
  store.resetFilter()
  store.resetState()
})
</script>

<template>
  <HeaderAdmin>
    <template #left>
      <v-text-field 
        v-model="store.searchInput" 
        placeholder="Tìm tên..." 
        variant="outlined" 
        hide-details clearable
        @keyup.enter="store.handleSearch"
        @click:clear="store.handleSearch(false)"
        ></v-text-field>
      <DateFilter v-model:fromDay="store.fromDay" v-model:toDay="store.toDay" />
      <Button v-if="store.hasFilter" color="black" size="md" icon="filter_alt_off" @click="store.resetFilter()" />
    </template>
    <template #right>
      <Button
        label="Thêm"
        color="primary"
        :shadow="true"
        @click="store.handleTogglePopupAdd(true)"
      />
    </template>
  </HeaderAdmin>

  <CreatePromotionGift />
  <UpdatePromotionGift />
  <v-container>
    <v-data-table-server
      v-model:items-per-page="store.itemsPerPage"
      :headers="store.headers"
      :items="store.serverItems"
      :items-length="store.totalItems"
      :loading="store.loadingTable"
      :search="store.search"
      item-value="name"
      @update:options="options => {
        store.currentTableOptions = options;
      }"
    >
      <template #item.index="{ index }">
        {{ index + 1 }}
      </template>

      <template #item.name="{ item }">
        <Text :text="item.name" color="black" weight="medium" />
        <Text :text="'ID: '+item.id" color="gray5" class="white-space"/>
      </template>

      <template #item.minOrderValue="{ item }">
        {{ item.minOrderValue ? formatCurrency(item.minOrderValue) : '-' }}
      </template>

      <template #item.gifts="{ item }">
        <div class="flex flex-col gap-xs">
          <div
            v-for="(gift, idx) in item.gifts"
            :key="idx"
            class="position-relative min-width-50"
            v-tooltip.bottom="gift.productName"
          >
            <Image 
              :src="gift.image"
              :alt="gift.productName"
              :width="50"
              :height="50"
              preset="avatar"
              class="rd-lg bg-gray6 min-width-50"
            />
            <div class="el-absolute bg-black-20 rd-lg top-0 left-0 text-color-white flex justify-center align-center">
            × {{ gift.quantity }}
            </div>
          </div>
        </div>
      </template>

      <template #item.requiredCategories="{ item }">
        <div class="flex gap-xs flex-wrap">
          <v-chip
            v-for="cat in item.requiredCategories"
            :key="typeof cat === 'string' ? cat : cat.id"
            label
          >
            {{ typeof cat === 'string' ? cat : cat.categoryName }}
          </v-chip>
        </div>
      </template>

      <template #item.dateRange="{ item }">
        <div class="flex align-center gap-xs white-space">
          <div>
            {{ formatDateTime(item.startDate,'vi-VN', false) }}
            →
            {{ formatDateTime(item.endDate,'vi-VN', false) }}
          </div>
          <div>
            <v-chip
              v-if="new Date() < new Date(item.startDate)"
              label
              color="blue"
              size="small"
            >
              Chưa diễn ra
            </v-chip>

            <v-chip
              v-else-if="new Date() > new Date(item.endDate)"
              label
              color="red"
              size="small"
            >
              Đã kết thúc
            </v-chip>

            <v-chip
              v-else
              label
              color="green"
              size="small"
            >
              Đang diễn ra
            </v-chip>
          </div>
        </div>
      </template>

      <template #item.isActive="{ item }">
        <v-chip
          label
          :color="item.isActive ? 'green' : 'red'"
          v-tooltip.right="'Đổi trạng thái'" @click="store.toggleActive(item.id)"
        >
          {{ item.isActive ? 'Đang áp dụng' : 'Tắt' }}
        </v-chip>
      </template>

      <template #item.stackable="{ item }">
        <v-chip
          label
          :color="item.stackable ? 'blue' : 'gray'"
        >
          {{ item.stackable ? 'Có' : 'Không' }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="flex gap-sm justify-end">
          <Button
            :border="false"
            color="secondary"
            size="sm"
            icon="edit"
            @click="store.handleEdit(item.id)"
          />
          <Button
            :border="false"
            color="secondary"
            size="sm"
            icon="delete"
            @click="store.handleDelete(item.id)"
          />
        </div>
      </template>

    </v-data-table-server>
  </v-container>
</template>
