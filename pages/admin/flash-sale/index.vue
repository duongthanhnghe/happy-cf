<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useFlashSaleManageStore } from "@/stores/admin/flash-sale/useFlashSaleManageStore";
import { ROUTES } from "@/shared/constants/routes";
import { formatDateTime } from "@/utils/global";
import { useFileManageFolderStore } from "@/stores/admin/file-manage/useFileManageStore";

definePageMeta({
  layout: ROUTES.ADMIN.FLASH_SALE.children?.LIST.layout,
  middleware: ROUTES.ADMIN.FLASH_SALE.children?.LIST.middleware,
});

const store = useFlashSaleManageStore();
const storeFileManage = useFileManageFolderStore();
 
onBeforeUnmount(() => {
  store.resetFilter();
  store.resetState();
  storeFileManage.resetState();
});
</script>

<template>
  <HeaderAdmin>
    <template #left>
      <v-text-field
        v-model="store.searchInput"
        placeholder="Tìm flash sale..."
        variant="outlined"
        hide-details
        clearable
        @keyup.enter="store.handleSearch"
        @click:clear="store.handleSearch(false)"
      />

      <DateFilter
        v-model:fromDay="store.fromDay"
        v-model:toDay="store.toDay"
      />

      <Button
        v-if="store.hasFilter"
        color="black"
        size="md"
        icon="filter_alt_off"
        @click="store.resetFilter()"
      />
    </template>

    <template #right>
      <Button
        color="primary"
        label="Thêm"
        :shadow="true"
        @click="store.handleTogglePopupAdd(true)"
      />
    </template>
  </HeaderAdmin>


  <CreateFlashSale />
  <UpdateFlashSale />
  <PopupFileManageImage :folderName="store.folderName" :children="false" :chooseImage="true" column="col-6 col-md-4"/>

  <v-container>
    <v-data-table-server
      class="elevation-0 white-space"
      v-model:items-per-page="store.itemsPerPage"
      :headers="store.headers"
      :items="store.serverItems"
      :items-length="store.totalItems"
      :loading="store.loadingTable"
      :search="store.search"
      item-value="id"
      @update:options="opt => (store.currentTableOptions = opt)"
    >
      <template #item.index="{ index }">
        {{ index + 1 }}
      </template>

      <template #item.dateRange="{ item }">
        <div class="flex justify-between align-center gap-sm">
          <div>
            {{ formatDateTime(item.startDate) }} →
            {{ formatDateTime(item.endDate) }}
          </div>
          <div>
            <v-chip
              v-if="new Date() < new Date(item.startDate)"
              color="blue"
              small
              >Chưa diễn ra</v-chip
            >
            <v-chip
              v-else-if="new Date() > new Date(item.endDate)"
              color="red"
              small
              >Đã kết thúc</v-chip
            >
            <v-chip v-else color="green" small>Đang diễn ra</v-chip>
          </div>
        </div>
      </template>

      <template #item.createdAt="{ item }">
        {{ formatDateTime(item.createdAt) }}
      </template>

      <template #item.items="{ item }">
        <div class="flex gap-xs position-relative white-space">
          <template v-for="(itemImage, index) in item.items" :key="index" >
            <Image 
              v-if="index < 3 && typeof itemImage.productId === 'object' && itemImage.productId.image"
              v-tooltip="itemImage.productId.productName + ' - ' +  (itemImage.variantSku ?? '')"
              :src="itemImage.productId.image" :alt="itemImage.productId.productName"
              :width="50"
              :height="50"
              preset="avatar"
              class="rd-lg bg-gray6"
            />
            <span v-tooltip.html="store.remainingProductNames(item.items)" v-else-if="index < 4" class="width-50 align-center flex justify-center bg-gray rd-lg">+{{ item.items.length - 3 }}</span>
            <template v-else />
          </template>
        </div>
      </template>

      <template #item.stackable="{ item }">
        <div class="flex gap-xs">
          <v-chip
            small
            :color="item.stackableWithVoucher ? 'green' : 'gray'"
          >
            Voucher
          </v-chip>
          <v-chip
            small
            :color="item.stackableWithPromotionGift ? 'green' : 'gray'"
          >
            Quà tặng
          </v-chip>
        </div>
      </template>

      <template #item.badgeImage="{ item }">
        <Image 
          v-if="item.badgeImage"
          :src="item.badgeImage"
          :alt="item.badgeImage"
          :height="50"
          class="rd-lg bg-gray6"
        />
      </template>

      <template #item.banners="{ item }">
        <div v-if="item.banners.length > 0" class="flex gap-xs">
          <Image 
            v-for="banner in item.banners.slice(0,1)"
            :alt="banner.src"
            :src="banner.src"
            :height="50"
            class="rd-lg bg-gray6 max-width-200"
          />
          <span v-if="item.banners.length > 2" class="width-50 min-width-50 flex-1 align-center flex justify-center bg-gray rd-lg">+{{ item.banners.length - 1 }}</span>
        </div>
      </template>

      <template #item.isActive="{ item }">
        <v-chip
          label
          small
          :color="item.isActive ? 'green' : 'red'"
          v-tooltip.right="'Đổi trạng thái'"
          @click="store.toggleActive(item.id)"
        >
          {{ item.isActive ? "Kích hoạt" : "Tắt" }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="flex gap-sm justify-end">
          <Button
            icon="edit"
            :border="false"
            size="sm"
            color="secondary"
            @click="store.handleEdit(item.id)"
          />
          <Button
            icon="delete"
            :border="false"
            size="sm"
            color="secondary"
            @click="store.handleDelete(item.id)"
          />
        </div>
      </template>
    </v-data-table-server>
  </v-container>
</template>