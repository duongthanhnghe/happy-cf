<script lang="ts" setup>
import { useFlashSaleManageStore } from '@/stores/admin/flash-sale/useFlashSaleManageStore'
import { showWarning } from '@/utils/toast'
import { useValidate } from '@/composables/validate/useValidate'
import { updateFlashSaleSchema } from '@/shared/validate/schemas/flash-sale.schema'

const store = useFlashSaleManageStore()
const { validate, formErrors } = useValidate(updateFlashSaleSchema)

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
    popupHeading="Cập nhật Flash Sale"
    footerFixed
    variant="modal-full-screen"
    bodyClass="bg-gray2"
    align="right"
  >
    <template #body>
      <v-form @submit.prevent="handleSubmitUpdate">
        <!-- TOP -->
          <Text text="Thông tin" weight="semibold" size="normal" class="mb-sm" />

          <div class="mb-md">
            <Card class="rd-lg">
              <div class="row row-xs">
              <!-- Tên -->
              <div class="col-12 col-lg-6">
              <LabelInput label="Tên Flash Sale" required />
              <v-text-field
                v-model="store.updateItem.name"
                variant="outlined"
                :error="!!formErrors.name"
                :error-messages="formErrors.name"
              />
              </div>

              <div class="col-12 col-lg-6">
              <!-- Slug -->
              <LabelInput label="Slug" required />
              <v-text-field
                v-model="store.updateItem.slug"
                variant="outlined"
                :error="!!formErrors.slug"
                :error-messages="formErrors.slug"
              />
              </div>

              <div class="col-12">
              <!-- Mô tả -->
              <LabelInput label="Mô tả" />
              <v-textarea
                v-model="store.updateItem.description"
                variant="outlined"
                rows="3"
              />
              </div>

              <div class="col-12 col-lg-8">
              <!-- Thời gian -->
              <LabelInput label="Thời gian" required />
              <div class="flex gap-sm">
                <v-text-field
                  v-model="store.updateItem.startDate"
                  type="datetime-local"
                  variant="outlined"
                  :error="!!formErrors.startDate"
                  :error-messages="formErrors.startDate"
                  :disabled="store.isRunningOrEnded"
                  required
                />
                <v-text-field
                  v-model="store.updateItem.endDate"
                  type="datetime-local"
                  variant="outlined"
                  :error="!!formErrors.endDate"
                  :error-messages="formErrors.endDate"
                  :disabled="store.isRunningOrEnded"
                  required
                />
              </div>
              </div>

              <div class="col-12 col-lg-4">
              <!-- Priority -->
              <LabelInput label="Ưu tiên" />
              <v-text-field
                v-model.number="store.updateItem.priority"
                type="number"
                variant="outlined"
              />
              </div>

              <div class="col-12 flex flex-wrap gap-md">
                <!-- Switch -->
                <v-switch
                  v-model="store.updateItem.stackableWithVoucher"
                  inset
                  label="Cộng dồn Voucher"
                />
                <v-switch
                  v-model="store.updateItem.stackableWithPromotionGift"
                  inset
                  label="Cộng dồn Quà tặng"
                />
                <v-switch
                  v-model="store.updateItem.isActive"
                  inset
                  :label="`Trạng thái: ${store.updateItem.isActive ? 'Kích hoạt' : 'Tắt'}`"
                />
              </div>
              </div>
            </Card>
          </div>

          <!-- CENTER -->
          <div class="mb-md">
            <Text text="Sản phẩm" weight="semibold" size="normal" class="mb-sm" />

            <Card
              v-for="(item, index) in store.updateItem.items"
              :key="index"
              class="rd-lg mb-ms"
            >
              <div class="row row-xs">
                <div class="col-12 col-lg-4">
                  <!-- Preview sản phẩm -->
                  <AdminProductItemTemplate1
                    v-if="typeof item.productId === 'string' && item.productId && store.getProductDetail(item.productId)"
                    :item="store.getProductDetail(item.productId)"
                    class="mb-sm"
                  />
                </div>

                <div class="col-12 col-lg-8">
                  <div class="row row-xs">
                    <div class="col-12 col-lg-6">
                    <!-- Product ID -->
                    <LabelInput label="Product ID" required />
                    <v-text-field
                      v-model="item.productId"
                      :disabled="!item.__isNew && store.isRunningOrEnded"
                      label="Product ID"
                      variant="outlined"
                      :error="!!formErrors[`items.${index}.productId`]"
                      :error-messages="formErrors[`items.${index}.productId`]"
                    />
                    </div>

                    <div class="col-12 col-lg-6">
                    <!-- Variant selector -->
                      <template v-if="typeof item.productId === 'string' && store.getProductDetail(item.productId)?.variantCombinations?.length">
                        <LabelInput label="Biến thể" required />
                        <v-select
                          :items="store.getAvailableVariants(item)"
                          item-title="sku"
                          item-value="sku"
                          label="Chọn biến thể (SKU)"
                          v-model="item.variantSku"
                          variant="outlined"
                          :disabled="!item.__isNew && store.isRunningOrEnded"
                          :error="!!formErrors[`items.${index}.variantSku`]"
                          :error-messages="formErrors[`items.${index}.variantSku`]"
                          required
                        />
                      </template>
                      <LabelInput v-else label="Không có biến thể" />
                    </div>

                    <div class="col-12 col-lg-4">
                    <!-- Giá gốc (readonly, auto) -->
                    <LabelInput label="Giá gốc" required />
                    <v-text-field
                      :model-value="item.originalPrice"
                      label="Giá gốc"
                      variant="outlined"
                      readonly
                      disabled
                    />
                    </div>

                    <div class="col-12 col-lg-4">
                    <!-- Giá sale -->
                    <LabelInput label="Giá sale" required />
                    <v-text-field
                      v-model.number="item.salePrice"
                      type="number"
                      label="Giá sale"
                      variant="outlined"
                      :hint="'Phải nhỏ hơn giá gốc'"
                      :disabled="!item.__isNew && store.isRunningOrEnded"
                      :error="!!formErrors[`items.${index}.salePrice`]"
                      :error-messages="formErrors[`items.${index}.salePrice`]"
                      required
                      persistent-hint
                    />
                    </div>

                    <div class="col-12 col-lg-4">
                    <!-- Số lượng -->
                    <LabelInput label="Số lượng bán" required />
                    <v-text-field
                      v-model.number="item.quantity"
                      type="number"
                      label="Số lượng bán"
                      :disabled="!item.__isNew && store.isRunningOrEnded"
                      variant="outlined"
                      :max="store.getMaxStock(item)"
                      :error="!!formErrors[`items.${index}.quantity`]"
                      :error-messages="formErrors[`items.${index}.quantity`]"
                      required
                      persistent-hint
                    />
                    </div>

                    <div class="col-12 flex gap-sm align-center justify-between">
                      <div class="flex gap-sm align-center">
                        <Button
                          icon="delete"
                          color="secondary"
                          :disabled="!item.__isNew && store.isRunningOrEnded"
                          @click.prevent="store.removeItem(index)"
                        />
                        <Text :text="'Tồn kho: '+ store.getMaxStock(item)" color="black" weight="semibold" size="normal" />
                      </div>
                      <Text :text="'Đã bán: '+ item.sold" color="black" weight="semibold" size="normal" />
                    </div>
                    </div>
                  </div>
              </div>
            </Card>

            <Button
              icon="add"
              color="black"
              label="Thêm sản phẩm"
              :disabled="store.isEnded"
              @click.prevent="store.addItem"
            />
          </div>

          <!-- BOTTOM -->
          <div>
            <Text text="Cấu hình thêm" weight="semibold" size="normal" class="mb-sm" />
            <Card class="rd-lg">
              <div class="row row-xs">

                <div class="col-12 col-lg-4">
                <!-- Ảnh Badge -->
                <LabelInput label="Ảnh Badge" />
                <Image
                  v-if="store.updateItem.badgeImage"
                  :src="store.updateItem.badgeImage"
                  class="mb-sm max-width-300 rd-lg"
                  alt="Ảnh Badge"
                />
                <div class="flex gap-sm">
                  <v-text-field
                    v-model="store.updateItem.badgeImage"
                    label="Đường dẫn ảnh..."
                    variant="outlined"
                    disabled
                    :error="!!formErrors.image"
                    :error-messages="formErrors.image"
                  />
                  <Button
                    color="black"
                    :label="store.updateItem.badgeImage ? 'Đổi ảnh' : 'Chọn ảnh'"
                    @click.prevent="store.handleAddImage()"
                  />
                </div>
                </div>

                <div class="col-12 col-lg-8 mb-md">
                  <!-- Ảnh Banner -->
                  <LabelInput label="Banners" />
                  <div
                    class="row row-xs"
                    v-if="store.updateItem.banners && store.updateItem.banners.length > 0"
                  >
                    <div
                      class="col-6 col-md-4 col-xl-3"
                      v-for="item in store.updateItem.banners"
                      :key="item.id"
                    >
                      <ControlImage :src="item.src" :label="item.src" className="mb-sm">
                        <template #action>
                          <Button
                            v-tooltip="'Xóa ảnh'"
                            color="secondary"
                            icon="delete"
                            size="sm"
                            @click="store.handleDeleteListImage(item.id)"
                          />
                        </template>
                      </ControlImage>
                    </div>
                  </div>
                  <Button
                    class="w-full"
                    :border="false"
                    color="gray"
                    label="Thêm ảnh"
                    @click.prevent="store.handleAddListImage()"
                  />
                </div>

                <!-- primaryColor -->
                <div class="col-12 col-lg-4">
                  <LabelInput label="Màu chính" />
                  <div class="position-relative">
                    <div v-if="store.updateItem.theme.primaryColor" class="position-absolute top-xs right-sm z-index-1">
                      <v-chip size="small" class="width-50" variant="flat" :color="store.updateItem.theme.primaryColor"></v-chip>
                    </div>
                    <v-text-field
                      v-model="store.updateItem.theme.primaryColor"
                      variant="outlined"
                    />
                  </div>
                </div>

                <!-- backgroundColor -->
                <div class="col-12 col-lg-4">
                  <LabelInput label="Màu nền" />
                  <div class="position-relative">
                    <div v-if="store.updateItem.theme.backgroundColor" class="position-absolute top-xs right-sm z-index-1">
                      <v-chip size="small" class="width-50" variant="flat" :color="store.updateItem.theme.backgroundColor"></v-chip>
                    </div>
                    <v-text-field
                      v-model="store.updateItem.theme.backgroundColor"
                      variant="outlined"
                    />
                  </div>
                </div>

                <!-- textColor -->
                <div class="col-12 col-lg-4">
                  <LabelInput label="Màu chữ" />
                  <div class="position-relative">
                    <div v-if="store.updateItem.theme.textColor" class="position-absolute top-xs right-sm z-index-1">
                      <v-chip size="small" class="width-50" variant="flat" :color="store.updateItem.theme.textColor"></v-chip>
                    </div>
                    <v-text-field
                      v-model="store.updateItem.theme.textColor"
                      variant="outlined"
                    />
                  </div>
                </div>

                <div class="col-12">
                  <LabelInput label="Tiêu đề SEO" />
                  <v-text-field
                    v-model="store.updateItem.titleSEO"
                    variant="outlined"
                  />
                </div>

                <div class="col-12">
                  <LabelInput label="Mô tả SEO" />
                  <v-text-field
                    v-model="store.updateItem.descriptionSEO"
                    variant="outlined"
                  />
                </div>

              </div>
              </Card>
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