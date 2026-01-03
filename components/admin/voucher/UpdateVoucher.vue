<script lang="ts" setup>
import { useVoucherManageStore } from '@/stores/admin/voucher/useVoucherManageStore'
import type { SubmitEventPromise } from 'vuetify'
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';
import { useVoucherForm } from '@/composables/admin/voucher/useVoucherForm'

const store = useVoucherManageStore()
const { type, showValue, showMaxDiscount, showMaxShippingDiscount, showProduct, validateVoucher } = useVoucherForm(store.updateItem)

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return

  if (validateVoucher() !== true) return

  await store.submitUpdate()
}

</script>

<template>
  <Popup
    v-model="store.isTogglePopupUpdate"
    popupHeading="Sửa voucher"
    align="right"
  >
    <template #body>
      <v-form validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">

        <!-- Mã voucher -->
        <LabelInput label="Mã voucher" required />
        <v-text-field
          v-model="store.updateItem.code"
          :rules="store.nullAndSpecialRules"
          label="Nhập mã voucher"
          variant="outlined"
          :disabled="!store.checkEdit"
          required
        />

        <!-- Tên -->
        <LabelInput label="Tên voucher" required />
        <v-text-field
          v-model="store.updateItem.name"
          :rules="store.nullRules"
          label="Tên voucher"
          variant="outlined"
          required
        />

        <!-- Mô tả -->
        <LabelInput label="Mô tả" />
        <v-textarea
          v-model="store.updateItem.description"
          :counter="300"
          label="Mô tả voucher"
          variant="outlined"
        />

        <template v-if="store.typeHasImage">
        <LabelInput label="Ảnh đại diện" />
        <v-img v-if="store.updateItem.image" :src="store.updateItem.image" class="mb-sm" alt="Ảnh đại diện" />
        <div class="flex gap-sm">
          <v-text-field v-model="store.updateItem.image" label="Đường dẫn ảnh.." variant="outlined" ></v-text-field>
          <Button color="black" :label="store.updateItem.image ? 'Đổi ảnh' : 'Chọn ảnh'" @click.prevent="store.handleAddImage()"/>
        </div>
        </template>

        <!-- Ngày bắt đầu/kết thúc -->
        <div class="flex gap-sm">
          <div class="flex-1">
          <LabelInput label="Ngày bắt đầu" required />
          <v-text-field
            v-model="store.updateItem.startDate"
            type="date"
            label="Ngày bắt đầu"
            variant="outlined"
            :disabled="!store.checkEdit"
            required
          />
          </div>
          <div class="flex-1">
          <LabelInput label="Ngày kết thúc" required />
          <v-text-field
            v-model="store.updateItem.endDate"
            type="date"
            label="Ngày kết thúc"
            variant="outlined"
            :disabled="!store.checkEdit"
            required
          />
          </div>
        </div>

        <div class="flex gap-sm">
          <div class="flex-1">
          
        <!-- Lượt sử dụng -->
        <LabelInput label="Số lượng / Lượt dùng tối đa" required/>
        <v-text-field
          v-model.number="store.updateItem.usageLimit"
          type="number"
          label="Số lượt sử dụng tối đa"
          variant="outlined"
          required
          :disabled="!store.checkEdit"
        />
          </div>
          <div class="flex-1">

        <!-- Giới hạn mỗi người -->
        <LabelInput label="Giới hạn mỗi người dùng" required/>
        <v-text-field
          v-model.number="store.updateItem.limitPerUser"
          type="number"
          label="Giới hạn mỗi user"
          variant="outlined"
          required
          :disabled="!store.checkEdit"
        />
          </div>
        </div>

        <!-- Trạng thái -->
        <v-switch
          v-model="store.updateItem.isActive"
          class="mt-0"
          :label="`Trạng thái: ${store.updateItem.isActive ? 'Kích hoạt' : 'Tạm dừng'}`"
          inset
        />

        <!-- Loại voucher -->
        <LabelInput label="Loại voucher" required />
        <v-select
          v-model="store.updateItem.type"
          :items="Object.entries(VOUCHER_TYPE).map(([key, val]) => ({
            title: val.name,
            value: val.type,
          }))"
          item-title="title"
          item-value="value"
          label="Chọn loại voucher"
          variant="outlined"
          :disabled="!store.checkEdit"
          required
        />

        <div class="rd-lg pd-ms bg-gray2 pb-0 mb-md">

          <!-- Giá trị giảm -->
          <div :class="{ _hidden: !showValue }">
            <LabelInput
              :label="store.isDiscountVoucherType(type) ? 'Giá trị giảm (%)' : 'Giá trị giảm (VNĐ)'"
              :disabled="!store.checkEdit"
            />

            <v-text-field
              v-model.number="store.updateItem.value"
              type="number"
              :label="store.isDiscountVoucherType(type) ? 'Nhập phần trăm giảm (VD: 10 = 10%)' : 'Nhập số tiền giảm (VD: 50000 = 50.000đ)'"
              :suffix="store.isDiscountVoucherType(type) ? '%' : '₫'"
              variant="outlined"
              min="0"
              :disabled="!store.checkEdit"
            />
          </div>

          <!-- Giảm tối đa nếu phần trăm -->
          <div :class="{ _hidden: !showMaxDiscount }">
            <LabelInput label="Giảm tối đa (nếu phần trăm)" />
            <v-text-field
              v-model.number="store.updateItem.maxDiscount"
              type="number"
              label="Giảm tối đa"
              variant="outlined"
              :disabled="!store.checkEdit"
            />
          </div>

          <!-- Đơn hàng tối thiểu -->
            <LabelInput label="Đơn hàng tối thiểu" />
            <v-text-field
              v-model.number="store.updateItem.minOrderValue"
              type="number"
              label="Đơn hàng tối thiểu"
              variant="outlined"
              :disabled="!store.checkEdit"
            />

          <!-- Giảm phí vận chuyển tối đa -->
          <div :class="{ _hidden: !showMaxShippingDiscount }">
            <LabelInput label="Giảm phí vận chuyển tối đa (nếu freeship)" />
            <v-text-field
              v-model.number="store.updateItem.maxShippingDiscount"
              type="number"
              label="Tối đa phí vận chuyển giảm"
              variant="outlined"
              :disabled="!store.checkEdit"
            />
          </div>

          <!-- Sản phẩm / danh mục áp dụng -->
          <div :class="{ _hidden: !showProduct }">
            <div class="flex gap-sm align-anchor">
            <div class="flex-1">
              <LabelInput label="Danh mục áp dụng (IDs)" />
              <VTreeChoose :label="store.selectedCategoryName">
                <v-treeview
                  :items="store.treeItems"
                  item-value="id"
                  item-title="categoryName"
                  selectable
                  return-object
                  select-strategy="leaf"
                  v-model:selected="store.selectedCategory"
                  open-all
                  density="compact"
                  :disabled="!store.checkEdit"
                >
                </v-treeview>
              </VTreeChoose>
            </div>
          </div>
          </div>
        </div>
        
        <Button type="submit" color="primary" label="Lưu voucher" class="w-full" />
      </v-form>
    </template>
  </Popup>
</template>