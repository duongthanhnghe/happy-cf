<script lang="ts" setup>
import { ref } from 'vue'
import { usePostManageStore } from '@/stores/admin/news/usePostManageStore'
import { showWarning } from '@/utils/toast';
import { useValidate } from '@/composables/validate/useValidate'
import { updatePostNewsSchema } from '@/shared/validate/schemas/news.schema'

const store = usePostManageStore();
const editorRef = ref()
const { validate, formErrors } = useValidate(updatePostNewsSchema)

const handleSubmitUpdate = async () => {
  if (!validate(store.updatePostItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }

  if(!store.updatePostItem.description) {
    showWarning('Vui lòng nhập nội dung bài viết')
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
    popupHeading="Cập nhật bài viết"
    align="right"
    variant="modal-full-screen" bodyClass="bg-gray2"
    footerFixed
  >
    <template #body>
      <v-form @submit.prevent="handleSubmitUpdate">
          <div class="row row-sm">
          <div class="col-12 col-lg-8 mb-ms">
            <Card class="rd-lg">

            <!-- Tên bài viết -->
            <LabelInput label="Tên bài viết" required />
            <v-text-field
              v-model="store.updatePostItem.title"
              :counter="200"
              label="Nhập tên bài viết"
              variant="outlined"
              :error="!!formErrors.title"
              :error-messages="formErrors.title"
              required
            />

            <!-- Danh mục -->
            <LabelInput label="Danh mục bài viết" required />
            <v-select
              v-if="store.getListCategory"
              label="Chọn danh mục"
              v-model="store.updatePostItem.categoryId"
              variant="solo"
              :items="store.getListCategory"
              item-title="categoryName"
              item-value="id"
              :error="!!formErrors.categoryId"
              :error-messages="formErrors.categoryId"
            />

            <!-- Mô tả -->
            <LabelInput label="Mô tả bài viết" />
            <v-textarea
              v-model="store.updatePostItem.summaryContent"
              :counter="500"
              label="Nhập mô tả"
              variant="outlined"
              :error="!!formErrors.summaryContent"
              :error-messages="formErrors.summaryContent"
            />

            <!-- Nội dung -->
            <LabelInput label="Nội dung bài viết" required />
            <div v-if="formErrors.description" class="text-error text-size-xs mb-xs">
              {{ formErrors.description }}
            </div>
            <client-only>
              <CKEditorCDN
                ref="editorRef"
                v-model="store.updatePostItem.description"
                :uploadUrl="store.folderName"
              />
            </client-only>

            <!-- Trạng thái -->
            <v-switch
              v-model="store.updatePostItem.isActive"
              :label="`Tình trạng: ${store.updatePostItem.isActive ? 'Bật' : 'Tắt'} kích hoạt`"
              inset
            />

            <!-- SEO -->
            <LabelInput label="SEO Title" />
            <v-text-field
              v-model="store.updatePostItem.titleSEO"
              label="SEO Title"
              variant="outlined"
            />

            <LabelInput label="SEO Description" />
            <v-textarea
              v-model="store.updatePostItem.descriptionSEO"
              :counter="160"
              label="SEO Description"
              variant="outlined"
            />

            <!-- Slug -->
            <LabelInput label="Slug (URL)" required />
            <v-text-field
              v-model="store.updatePostItem.slug"
              label="Slug"
              variant="outlined"
              :error="!!formErrors.slug"
              :error-messages="formErrors.slug"
              required
            />

            <!-- Keywords -->
            <LabelInput label="Từ khóa (phân cách bằng dấu ,)" />
            <v-text-field
              v-model="store.updatePostItem.keywords"
              label="Từ khóa"
              variant="outlined"
              :error="!!formErrors.keywords"
              :error-messages="formErrors.keywords"
            />
            </Card>
          </div>   
          <div class="col-12 col-lg-4">
            <Card class="rd-lg">
                <!-- Ảnh đại diện -->
                <LabelInput label="Hình đại diện" required />
                <v-img
                  v-if="store.updatePostItem.image"
                  :src="store.updatePostItem.image"
                  class="mb-sm"
                  alt="Hình ảnh"
                />
                <div class="flex gap-sm">
                  <v-text-field
                    v-model="store.updatePostItem.image"
                    label="Đường dẫn ảnh..."
                    variant="outlined"
                    disabled
                    :error="!!formErrors.image"
                    :error-messages="formErrors.image"
                    required
                  />
                  <Button
                    color="black"
                    :label="store.updatePostItem.image ? 'Đổi ảnh' : 'Chọn ảnh'"
                    @click.prevent="store.handleAddImage()"
                  />
                </div>
            </Card>
          </div>
        </div>
      </v-form>
    </template>

    <template #footer>
      <Button
        @click="handleSubmitUpdate"
        type="submit"
        color="primary"
        label="Cập nhật bài viết"
        class="w-full"
      />
    </template>
  </Popup>
</template>
