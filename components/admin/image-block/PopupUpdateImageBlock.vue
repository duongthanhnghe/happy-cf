<script lang="ts" setup>
import { useImageBlockManageStore } from '@/stores/admin/image-block/useImageBlockManageStore'
import { IMAGE_BLOCK_PAGE_OPTIONS, IMAGE_BLOCK_POSITION_OPTIONS } from '@/shared/constants/image-block'
import { useValidate } from '@/composables/validate/useValidate'
import { updateImageBlockSchema } from '@/shared/validate/schemas/image-block.schema'
import { showWarning } from '@/utils/toast'

const store = useImageBlockManageStore()

const { validate, formErrors } = useValidate(updateImageBlockSchema)

const handleSubmitUpdate = async () => {
  if (!validate(store.formUpdate)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }

  try {
    await store.submitUpdate()
  } catch (error) {
    showWarning('Có lỗi khi cập nhật khối hình ảnh. Vui lòng thử lại.')
  }
}
</script>

<template>
  <Popup
    v-model="store.isTogglePopupUpdate"
    popupHeading="Cập nhật"
    footerFixed
    align="right"
  >
    <template #body>
      <v-form @submit.prevent="handleSubmitUpdate">
        <!-- Tiêu đề -->
        <LabelInput label="Tiêu đề" />
        <v-text-field
          v-model="store.formUpdate.title"
          :counter="100"
          label="Nhập tiêu đề"
          variant="outlined"
          :error="!!formErrors.title"
          :error-messages="formErrors.title"
        />

        <!-- Nội dung -->
        <LabelInput label="Mô tả" />
        <v-textarea
          v-model="store.formUpdate.description"
          :counter="200"
          label="Nhập mô tả"
          variant="outlined"
          :error="!!formErrors.description"
          :error-messages="formErrors.description"
        />

        <!-- Text nút -->
        <LabelInput label="Text trên nút" />
        <v-text-field
          v-model="store.formUpdate.textButton"
          :counter="100"
          label="Nhập text nút"
          variant="outlined"
          :error="!!formErrors.textButton"
          :error-messages="formErrors.textButton"
        />

        <!-- Link -->
        <LabelInput label="Link điều hướng" />
        <v-text-field
          v-model="store.formUpdate.linkRedirect"
          label="Nhập link điều hướng"
          variant="outlined"
          :error="!!formErrors.linkRedirect"
          :error-messages="formErrors.linkRedirect"
        />

        <!-- Trang -->
        <LabelInput label="Trang hiển thị" required />
        <v-select
          v-model="store.formUpdate.page"
          :items="IMAGE_BLOCK_PAGE_OPTIONS"
          item-title="title"
          item-value="value"
          label="Chọn trang hiển thị"
          variant="outlined"
          :error="!!formErrors.page"
          :error-messages="formErrors.page"
          required
        />

        <!-- Vị trí -->
        <LabelInput label="Vị trí hiển thị" required />
        <v-select
          v-model="store.formUpdate.position"
          :items="IMAGE_BLOCK_POSITION_OPTIONS"
          item-title="title"
          item-value="value"
          label="Chọn vị trí hiển thị"
          variant="outlined"
          :error="!!formErrors.position"
          :error-messages="formErrors.position"
          required
        />

        <!-- Hình ảnh -->
        <LabelInput label="Hình ảnh" required />
        <v-img
          v-if="store.formUpdate.image"
          :src="store.formUpdate.image"
          class="mb-sm"
          alt="Hình ảnh"
        />
        <div class="flex gap-sm">
          <v-text-field
            v-model="store.formUpdate.image"
            label="Đường dẫn hình ảnh..."
            variant="outlined"
            :error="!!formErrors.image"
            :error-messages="formErrors.image"
            required
          />
          <Button
            color="black"
            :label="store.formUpdate.image ? 'Đổi ảnh' : 'Chọn ảnh'"
            @click.prevent="store.handleAddImage()"
          />
        </div>

        <!-- Trạng thái -->
        <v-switch
          :label="`Trạng thái: ${store.formUpdate.isActive ? 'Bật' : 'Tắt'} hiển thị`"
          v-model="store.formUpdate.isActive"
          inset
        />

        
      </v-form>
    </template>
    <template #footer>
      <Button
        @click="handleSubmitUpdate"
        color="primary"
        label="Cập nhật"
        class="w-full"
      />
    </template>
  </Popup>
</template>
