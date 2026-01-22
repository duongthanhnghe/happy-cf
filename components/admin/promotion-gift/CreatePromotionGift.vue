<script lang="ts" setup>
import { usePromotionGiftManageStore } from '@/stores/admin/promotion-gift/usePromotionGiftManageStore'
import { showWarning } from '@/utils/toast'
import { useValidate } from '@/composables/validate/useValidate'
import { createPromotionGiftSchema } from '@/shared/validate/schemas/promotion.schema'

const store = usePromotionGiftManageStore()

const { validate, formErrors } = useValidate(createPromotionGiftSchema)

const handleSubmitCreate = async () => {
  if (!validate(store.formItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }

  await store.submitCreate()
}
</script>

<template>
  <Popup
    v-model="store.isTogglePopupAdd"
    popupHeading="Thêm CTKM"
    footerFixed
    variant="modal-full-screen"
    bodyClass="bg-gray2"
    align="right"
  >
    <template #body>
      <v-form @submit.prevent="handleSubmitCreate">
        <div class="row row-sm">
          <div class="col-12 col-lg-8 mb-ms">
            <Card class="rd-lg">
              <!-- Tên CTKM -->
              <LabelInput label="Tên chương trình" required />
              <v-text-field
                v-model="store.formItem.name"
                label="Tên CTKM"
                variant="outlined"
                required
                :error="!!formErrors.name"
                :error-messages="formErrors.name"
              />

              <!-- Mô tả -->
              <LabelInput label="Mô tả" />
              <v-textarea
                v-model="store.formItem.description"
                label="Mô tả CTKM"
                variant="outlined"
                rows="3"
              />

              <!-- Thời gian -->
              <LabelInput label="Thời gian" required/>
              <div class="flex gap-sm">
                <v-text-field
                  v-model="store.formItem.startDate"
                  type="date"
                  variant="outlined"
                  required
                  :error="!!formErrors.startDate"
                  :error-messages="formErrors.startDate"
                />

                <v-text-field
                  v-model="store.formItem.endDate"
                  type="date"
                  variant="outlined"
                  required
                  :error="!!formErrors.endDate"
                  :error-messages="formErrors.endDate"
                />
              </div>

                <LabelInput label="Đơn hàng tối thiểu" required/>
                <v-text-field
                  v-model.number="store.formItem.minOrderValue"
                  type="number"
                  label="Giá trị đơn tối thiểu"
                  variant="outlined"
                  required
                  :error="!!formErrors.minOrderValue"
                  :error-messages="formErrors.minOrderValue"
                />

                <!-- Giới hạn -->
              <div class="flex gap-sm">
                <div class="flex-1">
                  <LabelInput label="Giới hạn lượt dùng" required/>
                  <v-text-field
                    v-model.number="store.formItem.usageLimit"
                    type="number"
                    label="0 = không giới hạn"
                    variant="outlined"
                    required
                    :error="!!formErrors.usageLimit"
                    :error-messages="formErrors.usageLimit"
                  />
                </div>
              </div>

                <!-- Danh mục bắt buộc -->
                <LabelInput label="Danh mục bắt buộc" required/>
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
                    required
                    density="compact"
                  />
                </VTreeChoose>
                <div v-if="formErrors.requiredCategories" class="text-error text-size-xs mb-xs">
                {{ formErrors.requiredCategories }}
              </div>
              

              

              <!-- Tuỳ chọn -->
              <v-switch
                v-model="store.formItem.stackable"
                inset
                :label="`Cộng dồn CTKM khác: ${store.formItem.stackable ? 'Có' : 'Không'}`"
              />

              <v-switch
                v-model="store.formItem.isActive"
                inset
                :label="`Trạng thái: ${store.formItem.isActive ? 'Kích hoạt' : 'Tắt'}`"
              />
            </Card>
          </div>

          <!-- Quà tặng -->
          <div class="col-12 col-lg-4">
            <LabelInput label="Danh sách quà tặng" />
            
              <div
                v-for="(gift, index) in store.formItem.gifts"
                :key="index"
                class="mb-md border-bottom-default border-color-gray"
              >
                <AdminProductItemTemplate1 v-if="gift.productId && store.getProductDetail((gift.productId))" :item="store.getProductDetail((gift.productId))" class="mb-sm"/>

                <div class="flex gap-xs">
                  <v-text-field
                    v-model="gift.productId"
                    label="Product ID"
                    variant="outlined"
                    class="flex-1 width-full"
                    required
                    :error="!!formErrors[`gifts.${index}.productId`]"
                    :error-messages="formErrors[`gifts.${index}.productId`]"
                  />

                  <v-text-field
                    v-model.number="gift.quantity"
                    type="number"
                    label="Số lượng"
                    variant="outlined"
                    min="1"
                    required
                    :error="!!formErrors[`gifts.${index}.quantity`]"
                    :error-messages="formErrors[`gifts.${index}.quantity`]"
                  />

                  <Button
                    icon="delete"
                    color="secondary"
                    @click.prevent="store.removeGiftItem(index)"
                  />
                </div>
              </div>

              <div v-if="!store.formItem.gifts.length" class="text-sm text-gray">
                Chưa có quà tặng nào
              </div>


              <div v-if="formErrors.gifts" class="text-error text-size-xs mb-sm">
                {{ formErrors.gifts }}
              </div>
              <Button icon="add" color="black" label="Thêm quà" @click.prevent="store.addGiftItem" />
            </div>

        </div>
      </v-form>
    </template>
    <template #footer>
      <Button @click="handleSubmitCreate()" color="primary" label="Lưu CTKM" class="w-full" />
    </template>
  </Popup>
</template>
