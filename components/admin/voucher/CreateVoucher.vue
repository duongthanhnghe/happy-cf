<script lang="ts" setup>
import { useVoucherManageStore } from '@/stores/admin/voucher/useVoucherManageStore'
import type { SubmitEventPromise } from 'vuetify'
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';
import { useVoucherForm } from '@/composables/admin/voucher/useVoucherForm'

const store = useVoucherManageStore()
const { type, showValue, showMaxDiscount, showMaxShippingDiscount, showProduct, validateVoucher } = useVoucherForm(store.formItem)

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return

  if (validateVoucher() !== true) return

  await store.submitCreate()
}

</script>

<template>
  <Popup
    v-model="store.isTogglePopupAdd"
    popupHeading="Thêm voucher"
    align="right"
  >
    <template #body>
      <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
        <div class="portal-popup-footer">
          <Button type="submit" color="primary" label="Lưu voucher" class="w-full" />
        </div>

        <!-- Mã voucher -->
        <LabelInput label="Mã voucher" required />
        <v-text-field
          v-model="store.formItem.code"
          :rules="store.nullAndSpecialRules"
          label="Nhập mã voucher"
          variant="outlined"
          required
        />

        <!-- Tên -->
        <LabelInput label="Tên voucher" required />
        <v-text-field
          v-model="store.formItem.name"
          :rules="store.nullRules"
          label="Tên voucher"
          variant="outlined"
          required
        />

        <!-- Mô tả -->
        <LabelInput label="Mô tả" />
        <v-textarea
          v-model="store.formItem.description"
          :counter="300"
          label="Mô tả voucher"
          variant="outlined"
        />

        <template v-if="store.formItem.type === VOUCHER_TYPE.product.type || store.formItem.type === VOUCHER_TYPE.percentage.type || store.formItem.type === VOUCHER_TYPE.fixed.type ">
          <LabelInput label="Anh dai dien" required/>
          <v-img v-if="store.formItem.image" :src="store.formItem.image" class="mb-sm" alt="Hinh anh" :rules="store.nullRules" required />
          <div class="flex gap-sm">
            <v-text-field v-model="store.formItem.image" label="Duong dan anh..." variant="outlined" disabled></v-text-field>
            <Button color="black" :label="store.formItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
          </div>
        </template>

        <!-- Ngày bắt đầu/kết thúc -->
        <div class="flex gap-sm">
          <div class="flex-1">
          <LabelInput label="Ngày bắt đầu" required />
          <v-text-field
            v-model="store.formItem.startDate"
            type="date"
            label="Ngày bắt đầu"
            variant="outlined"
            required
          />
          </div>
          <div class="flex-1">
          <LabelInput label="Ngày kết thúc" required />
          <v-text-field
            v-model="store.formItem.endDate"
            type="date"
            label="Ngày kết thúc"
            variant="outlined"
            required
          />
          </div>
        </div>

        <div class="flex gap-sm">
          <div class="flex-1">
          
        <!-- Lượt sử dụng -->
        <LabelInput label="Số lượng / Lượt dùng tối đa" required/>
        <v-text-field
          v-model.number="store.formItem.usageLimit"
          type="number"
          label="Số lượt sử dụng tối đa"
          variant="outlined"
          required
        />
          </div>
          <div class="flex-1">

        <!-- Giới hạn mỗi người -->
        <LabelInput label="Giới hạn mỗi người dùng" required/>
        <v-text-field
          v-model.number="store.formItem.limitPerUser"
          type="number"
          label="Giới hạn mỗi user"
          variant="outlined"
          required
        />
          </div>
        </div>

        <!-- Trạng thái -->
        <v-switch
          v-model="store.formItem.isActive"
          class="mt-0"
          :label="`Trạng thái: ${store.formItem.isActive ? 'Kích hoạt' : 'Tạm dừng'}`"
          inset
        />

        <!-- Loại voucher -->
        <LabelInput label="Loại voucher" required />
        <v-select
          v-model="store.formItem.type"
          :items="Object.entries(VOUCHER_TYPE).map(([key, val]) => ({
            title: val.name,
            value: val.type,
          }))"
          item-title="title"
          item-value="value"
          label="Chọn loại voucher"
          variant="outlined"
          required
        />

        <div class="card card-sm bg-gray2 pb-0 mb-md">
          <!-- Giá trị giảm -->
          <div :class="{ _hidden: !showValue }">
            <LabelInput
              :label="store.isDiscountVoucherType(type) ? 'Giá trị giảm (%)' : 'Giá trị giảm (VNĐ)'"
            />

            <v-text-field
              v-model.number="store.formItem.value"
              type="number"
              :label="store.isDiscountVoucherType(type) ? 'Nhập phần trăm giảm (VD: 10 = 10%)' : 'Nhập số tiền giảm (VD: 50000 = 50.000đ)'"
              :suffix="store.isDiscountVoucherType(type) ? '%' : '₫'"
              variant="outlined"
              min="0"
            />
          </div>

          <!-- Giảm tối đa nếu phần trăm -->
          <div :class="{ _hidden: !showMaxDiscount }">
            <LabelInput label="Giảm tối đa (nếu phần trăm)" />
            <v-text-field
              v-model.number="store.formItem.maxDiscount"
              type="number"
              label="Giảm tối đa"
              variant="outlined"
            />
          </div>

          <!-- Đơn hàng tối thiểu -->
            <LabelInput label="Đơn hàng tối thiểu" />
            <v-text-field
              v-model.number="store.formItem.minOrderValue"
              type="number"
              label="Đơn hàng tối thiểu"
              variant="outlined"
            />

          <!-- Giảm phí vận chuyển tối đa -->
          <div :class="{ _hidden: !showMaxShippingDiscount }">
            <LabelInput label="Giảm phí vận chuyển tối đa (nếu freeship)" />
            <v-text-field
              v-model.number="store.formItem.maxShippingDiscount"
              type="number"
              label="Tối đa phí vận chuyển giảm"
              variant="outlined"
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
                >
                </v-treeview>
              </VTreeChoose>
            </div>
          </div>

          </div>

        </div>

      </v-form>
    </template>
  </Popup>
</template>