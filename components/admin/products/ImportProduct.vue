<script lang="ts" setup>
import { useProductManageStore } from '@/stores/admin/product/useProductManageStore';
import { ref } from 'vue';
import type { VForm } from 'vuetify/components'
import { formatCurrency } from '@/utils/global'

const store = useProductManageStore();
const formRef = ref<VForm | null>(null);

const handleSubmit = async () => {
  if (!formRef.value) return;
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  await store.handleImport()
}
</script>

<template>
<Popup 
  v-model="store.isTogglePopupImport" 
  popupHeading="Import sản phẩm" 
  align="right"
  variant="modal-full-screen"
  bodyClass="bg-gray2"
  >
  <template #body>
    <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="handleSubmit">

    <template v-if="!store.dataImport && !store.loadingTableImport">
      <div class="max-width-600 m-auto">

        <div class="flex gap-sm">
          <Button
            tag="span"
            :border="false"
            :color="store.currentTypeImport === 'import' ? 'black' : 'gray'"
            label="Import mới"
            class="flex-1 cursor-pointer"
            @click="store.currentTypeImport = 'import'"
          />

          <Button
            tag="span"
            :border="false"
            :color="store.currentTypeImport === 'updateImport' ? 'black' : 'gray'"
            label="Import chỉnh sửa"
            class="flex-1 cursor-pointer"
            @click="store.currentTypeImport = 'updateImport'"
          />
        </div>

        <div class="flex justify-between mt-sm mt-md">
          <LabelInput label="File import sản phẩm" required/>
          <a v-if="store.currentTypeImport === 'import'" href="/assets/files/mau-products-import.xlsx" download>
            <Text text="Tải file mẫu Import" color="primary" class="text-underline" />
          </a>
        </div>

        <v-file-input 
          accept=".xlsx,.xls"
          variant="outlined"
          label="Chọn file Import"
          :multiple="false"
          :rules="store.nullRules"
          @update:model-value="store.setImportFile"
        />
        <Button :disabled="!store.selectedImportFile" type="submit" color="primary" label="Import" class="w-full" />
      </div>
    </template>  
    <LoadingData v-else-if="store.loadingTableImport" text="Dữ liệu đang được import, vui lòng chờ trong giây lát! Không được thoát khỏi màn hình chờ!" />
    <template v-else>
      <Card v-if="store.dataImport" size="md" class="rd-xl" border :heading="store.dataImport.summary?.report">
        <div class="flex gap-sm flex-wrap justify-evenly">
          <div class="flex gap-sm align-center">
            <Text text="Tổng cộng:" color="gray5"/>
            <Text :text="store.dataImport.summary?.total" size="xl" weight="semibold" color="black" class="line-height-1"/>
          </div>
          <div class="flex gap-sm align-center">
            <Text text="Thành công:" color="gray5"/>
            <Text :text="store.dataImport.summary?.success" size="xl" weight="semibold" color="black" class="line-height-1"/>
          </div>
          <div class="flex gap-sm align-center">
            <Text text="Thất bại:" color="gray5"/>
            <Text :text="store.dataImport.summary?.fail" size="xl" weight="semibold" color="black" class="line-height-1"/>
          </div>
        </div>
      </Card>
      <v-data-table-server
        hide-default-footer
        :headers="store.headersImport"
        :items="store.serverItemsImport"
        :items-length="store.totalItemsImport"
        :loading="store.loadingTableImport"
        item-value="rowIndex"
      >
        <template #item.status="{ value }">
          <v-chip
            :color="value === 'success' ? 'green' : 'red'"
            size="small"
            class="text-white"
          >
            {{ value === 'success' ? 'Thành công' : 'Thất bại' }}
          </v-chip>
        </template>

        <template #item.message="{ value }">
          <span :class="value.includes('tồn tại') ? 'text-red' : ''">
            {{ value }}
          </span>
        </template>

        <template #item.image="{ item }">
          <Image 
            v-if="item.image"
            :src="item.image"
            :alt="item.productName"
            :width="50"
            :height="50"
            preset="avatar"
            class="rd-lg bg-gray6"
          />
        </template>

        <template #item.price="{ item }">
          <template v-if="item.price">
            {{ formatCurrency(item.price) }}
          </template>
        </template>

        <template #item.priceDiscounts="{ item }">
          <template v-if="item.price && item.priceDiscounts">
            {{ formatCurrency(item.priceDiscounts) }}
            <v-chip label color="red" class="ml-xs" v-if="item.priceDiscounts !== item.price">
              {{ Math.round(((item.price - (item.priceDiscounts ?? 0)) / item.price) * 100) + "%" }}
            </v-chip>
          </template>
        </template>

        <template #item.isActive="{ item }">
          <v-chip label :color="`${item.isActive === true ? 'green' : 'red'}`" v-tooltip.right="'Đổi trạng thái'" @click="store.toggleActive(item.id)">
            {{ item.isActive === true ? 'Kich hoat' : 'Tắt kích hoạt' }}
          </v-chip>
        </template>

        </v-data-table-server>
      </template>  
    </v-form>
  </template>
</Popup>
</template>
