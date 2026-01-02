<script lang="ts" setup>
import { ref } from 'vue'
import { useAboutManageStore } from '@/stores/admin/about/useAboutManageStore'
import { showWarning } from '@/utils/toast'
import { useValidate } from '@/composables/validate/useValidate'
import { updateAboutSchema } from '@/shared/validate/schemas/about.schema'

const store = useAboutManageStore()
const editorRef = ref()

const { validate, formErrors } = useValidate(updateAboutSchema)

const handleSubmitUpdate = async () => {
  if (!validate(store.formItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }

  try {
    const editorComponent: any = editorRef.value
    if (editorComponent?.uploadAllImages) {
      const uploadSuccess = await editorComponent.uploadAllImages()
      if (!uploadSuccess) {
        showWarning('Có lỗi khi upload hình ảnh. Vui lòng thử lại.')
        return
      }
      await store.submitUpdate()
    }
  } catch (error) {
    showWarning('Có lỗi khi lưu bài viết. Vui lòng thử lại.')
  }
}
</script>

<template>
  <Popup
    v-model="store.isTogglePopupUpdate"
    popupHeading="Sửa bài viết"
    footerFixed
    align="right"
  >
    <template #body>
      <v-form @submit.prevent="handleSubmitUpdate">

        <!-- Tiêu đề -->
        <LabelInput label="Tiêu đề" required />
        <v-text-field
          v-model="store.formItem.title"
          :counter="200"
          label="Nhập tiêu đề"
          variant="outlined"
          required
          :error="!!formErrors.title"
          :error-messages="formErrors.title"
        />

        <!-- Mô tả ngắn -->
        <LabelInput label="Mô tả ngắn" />
        <v-textarea
          v-model="store.formItem.summaryContent"
          label="Nhập mô tả ngắn"
          variant="outlined"
          :error="!!formErrors.summaryContent"
          :error-messages="formErrors.summaryContent"
        />

        <!-- Nội dung -->
        <LabelInput label="Nội dung chi tiết" />
        <div v-if="formErrors.description" class="text-error text-size-xs mb-xs">
          {{ formErrors.description }}
        </div>
        <client-only>
          <CKEditorCDN
            ref="editorRef"
            v-model="store.formItem.description"
            :uploadUrl="store.folderName"
          />
        </client-only>

        <!-- Ảnh đại diện -->
        <LabelInput label="Ảnh đại diện" required />
        <v-img
          v-if="store.formItem.image"
          :src="store.formItem.image"
          class="mb-sm"
          alt="Ảnh đại diện"
        />
        <div class="flex gap-sm">
          <v-text-field
            v-model="store.formItem.image"
            label="Đường dẫn ảnh..."
            variant="outlined"
            disabled
            :error="!!formErrors.image"
            :error-messages="formErrors.image"
          />
          <Button
            color="black"
            :label="store.formItem.image ? 'Đổi ảnh' : 'Chọn ảnh'"
            @click.prevent="store.handleAddImage()"
          />
        </div>

        <!-- Ảnh liên quan -->
        <LabelInput label="Ảnh liên quan" />
        <div
          class="row row-xs"
          v-if="store.formItem.listImage && store.formItem.listImage.length > 0"
        >
          <div
            class="col-6 col-md-4"
            v-for="item in store.formItem.listImage"
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

        <!-- Trạng thái -->
        <v-switch
          :label="`Trạng thái: ${store.formItem.isActive ? 'Bật' : 'Tắt'} kích hoạt`"
          v-model="store.formItem.isActive"
          inset
        />
      </v-form>
    </template>
    <template #footer>
      <Button @click="handleSubmitUpdate" color="primary" label="Cập nhật" class="w-full" />
    </template>
  </Popup>
</template>