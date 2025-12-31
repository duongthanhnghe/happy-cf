<script lang="ts" setup>
import { useCategoryManageStore } from '@/stores/admin/news/useCategoryManageStore'
import { showWarning } from '@/utils/toast'
import { useValidate } from '@/composables/validate/useValidate'
import { updateCategoryNewsSchema } from '@/shared/validate/schemas/category-news.schema'
const store = useCategoryManageStore();
const { validate, formErrors } = useValidate(updateCategoryNewsSchema)

const handleSubmitUpdate = async () => {
  if (!validate(store.updateItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }

  await store.submitUpdate();
}

</script>
<template>
<Popup
    v-model="store.isTogglePopupUpdate"
    footerFixed
    popupHeading="Sửa danh mục"
    align="right"
  >
    <template #body>
      <v-form @submit.prevent="handleSubmitUpdate">

        <!-- Tên danh mục -->
        <LabelInput label="Tên danh mục" required />
        <v-text-field
          v-model="store.updateItem.categoryName"
          label="Nhập tên danh mục"
          variant="outlined"
          :counter="200"
          :error="!!formErrors.categoryName"
          :error-messages="formErrors.categoryName"
        />

        <!-- Mô tả ngắn -->
        <LabelInput label="Mô tả ngắn" />
        <v-textarea
          v-model="store.updateItem.summaryContent"
          label="Nhập mô tả"
          variant="outlined"
          :counter="500"
          :error="!!formErrors.summaryContent"
          :error-messages="formErrors.summaryContent"
        />

        <!-- Nội dung -->
        <LabelInput label="Nội dung" />
        <v-textarea
          v-model="store.updateItem.description"
          label="Nhập nội dung"
          variant="outlined"
          :error="!!formErrors.description"
          :error-messages="formErrors.description"
        />

        <!-- Ảnh đại diện -->
        <LabelInput label="Ảnh đại diện" />
        <v-img
          v-if="store.updateItem.image"
          :src="store.updateItem.image"
          class="mb-sm"
          alt="Hình ảnh"
        />
        <div class="flex gap-sm">
          <v-text-field
            v-model="store.updateItem.image"
            label="Đường dẫn ảnh..."
            variant="outlined"
            disabled
            :error="!!formErrors.image"
            :error-messages="formErrors.image"
          />
          <Button
            color="black"
            :label="store.updateItem.image ? 'Đổi ảnh' : 'Chọn ảnh'"
            @click.prevent="store.handleAddImage()"
          />
        </div>

        <!-- Trạng thái -->
        <v-switch
          :label="`Trạng thái: ${store.updateItem.isActive ? 'Bật' : 'Tắt'} kích hoạt`"
          v-model="store.updateItem.isActive"
          inset
        />

        <!-- SEO -->
        <LabelInput label="SEO Title" />
        <v-text-field
          v-model="store.updateItem.titleSEO"
          label="SEO Title"
          variant="outlined"
          :error="!!formErrors.titleSEO"
          :error-messages="formErrors.titleSEO"
        />

        <LabelInput label="SEO Description" />
        <v-textarea
          v-model="store.updateItem.descriptionSEO"
          label="SEO Description"
          variant="outlined"
          :counter="160"
          :error="!!formErrors.descriptionSEO"
          :error-messages="formErrors.descriptionSEO"
        />

        <!-- Slug -->
        <LabelInput label="Slug (URL)" required />
        <v-text-field
          v-model="store.updateItem.slug"
          label="Slug"
          variant="outlined"
          :error="!!formErrors.slug"
          :error-messages="formErrors.slug"
        />

        <!-- Keywords -->
        <LabelInput label="Keywords (phân cách bằng dấu ,)" />
        <v-text-field
          v-model="store.updateItem.keywords"
          label="Keywords"
          variant="outlined"
          :error="!!formErrors.keywords"
          :error-messages="formErrors.keywords"
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
