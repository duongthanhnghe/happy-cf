<script lang="ts" setup>
import { usePromotionGiftManageStore } from '@/stores/admin/promotion-gift/usePromotionGiftManageStore'
import { showWarning } from '@/utils/toast'
import { useValidate } from '@/composables/validate/useValidate'
import { updatePromotionGiftSchema } from '@/shared/validate/schemas/promotion.schema'

const store = usePromotionGiftManageStore()

const { validate, formErrors } = useValidate(updatePromotionGiftSchema)

const handleSubmitUpdate = async () => {
  if (!validate(store.updateItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }

  await store.submitUpdate()
}
</script>

<template>
  <Popup
    v-model="store.isTogglePopupUpdate"
    popupHeading="Cập nhật CTKM"
    footerFixed
    variant="modal-full-screen"
    bodyClass="bg-gray2"
    align="right"
  >
    <template #body>
      <v-form @submit.prevent="handleSubmitUpdate">
        <div class="row row-sm">
          <div class="col-12 col-lg-8 mb-ms">
            <Card class="rd-lg">
              <!-- Tên CTKM -->
              <LabelInput label="Tên chương trình" required/>
              <v-text-field
                v-model="store.updateItem.name"
                variant="outlined"
                required
                :error="!!formErrors.name"
                :error-messages="formErrors.name"
              />

              <!-- Mô tả -->
              <LabelInput label="Mô tả" />
              <v-textarea
                v-model="store.updateItem.description"
                variant="outlined"
                rows="3"
              />

              <!-- Thời gian -->
              <LabelInput label="Thời gian" required/>
              <div class="flex gap-sm">
                <v-text-field
                  v-model="store.updateItem.startDate"
                  type="date"
                  variant="outlined"
                  required
                  :error="!!formErrors.startDate"
                  :error-messages="formErrors.startDate"
                />

                <v-text-field
                  v-model="store.updateItem.endDate"
                  type="date"
                  variant="outlined"
                  required
                  :error="!!formErrors.endDate"
                  :error-messages="formErrors.endDate"
                />
              </div>

              <!-- Điều kiện -->
              <LabelInput label="Đơn hàng tối thiểu" required/>
              <v-text-field
                v-model.number="store.updateItem.minOrderValue"
                type="number"
                variant="outlined"
                required
                :error="!!formErrors.minOrderValue"
                :error-messages="formErrors.minOrderValue"
              />

              <!-- Giới hạn -->
              <LabelInput label="Giới hạn lượt dùng" required/>
              <v-text-field
                v-model.number="store.updateItem.usageLimit"
                type="number"
                variant="outlined"
                required
                :error="!!formErrors.usageLimit"
                :error-messages="formErrors.usageLimit"
              />

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
                  density="compact"
                >
                </v-treeview>
              </VTreeChoose>

              <div v-if="formErrors.requiredCategories" class="text-error text-size-xs mb-xs">
                {{ formErrors.requiredCategories }}
              </div>

              <v-switch
                v-model="store.updateItem.stackable"
                inset
                :label="`Cộng dồn CTKM khác: ${store.updateItem.stackable ? 'Có' : 'Không'}`"
              />

              <v-switch
                v-model="store.updateItem.isActive"
                inset
                :label="`Trạng thái: ${store.updateItem.isActive ? 'Kích hoạt' : 'Tắt'}`"
              />
            </Card>
          </div>

          <div class="col-12 col-lg-4">
            <LabelInput label="Danh sách quà tặng" />
            <div
              v-for="(gift, index) in store.updateItem.gifts"
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
                  :error="!!formErrors[`gifts.${index}.productId`]"
                  :error-messages="formErrors[`gifts.${index}.productId`]"
                />

                <v-text-field
                  v-model.number="gift.quantity"
                  type="number"
                  min="1"
                  label="Số lượng"
                  variant="outlined"
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
            <div v-if="formErrors.gifts" class="text-error text-size-xs mb-sm">
              {{ formErrors.gifts }}
            </div>
            <Button color="black" icon="add" label="Thêm quà" @click.prevent="store.addGiftItem" />
          </div>
        </div>
      </v-form>
    </template>

    <template #footer>
      <Button
        color="primary"
        label="Cập nhật"
        class="w-full"
        @click="handleSubmitUpdate"
      />
    </template>
  </Popup>
</template>