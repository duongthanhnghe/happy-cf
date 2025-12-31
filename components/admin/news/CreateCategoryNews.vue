<script lang="ts" setup>
import { useCategoryManageStore } from '@/stores/admin/news/useCategoryManageStore'
import { useValidate } from '@/composables/validate/useValidate'
import { createCategoryNewsSchema } from '@/shared/validate/schemas/category-news.schema'
import { showWarning } from '@/utils/toast';

const store = useCategoryManageStore();
const { validate, formErrors } = useValidate(createCategoryNewsSchema)

const handleSubmitCreate = async () => {
  if (!validate(store.formItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }
  await store.submitCreate();
}

</script>
<template>
<Popup
    v-model="store.isTogglePopupAdd"
    footerFixed
    popupHeading="Thêm danh mục"
    align="right"
  >
    <template #body>
      <v-form @submit.prevent="handleSubmitCreate">

        <!-- Tên danh mục -->
        <LabelInput label="Tên danh mục" required />
        <v-text-field
          v-model="store.formItem.categoryName"
          label="Nhập tên danh mục"
          variant="outlined"
          required
          :error="!!formErrors.categoryName"
          :error-messages="formErrors.categoryName"
        />

        <!-- Mô tả ngắn -->
        <LabelInput label="Mô tả ngắn" />
        <v-textarea
          v-model="store.formItem.summaryContent"
          label="Nhập mô tả ngắn"
          variant="outlined"
          :counter="500"
          :error="!!formErrors.summaryContent"
          :error-messages="formErrors.summaryContent"
        />

        <!-- Nội dung -->
        <LabelInput label="Nội dung" />
        <v-textarea
          v-model="store.formItem.description"
          label="Nhập nội dung"
          variant="outlined"
          :error="!!formErrors.description"
          :error-messages="formErrors.description"
        />

        <!-- Ảnh đại diện -->
        <LabelInput label="Ảnh đại diện" />
        <v-img
          v-if="store.formItem.image"
          :src="store.formItem.image"
          class="mb-sm"
          alt="Hình ảnh"
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

        <!-- Trạng thái -->
        <v-switch
          :label="`Trạng thái: ${store.formItem.isActive ? 'Bật' : 'Tắt'} kích hoạt`"
          v-model="store.formItem.isActive"
          inset
        />

        <!-- SEO Title -->
        <LabelInput label="SEO Title" />
        <v-text-field
          v-model="store.formItem.titleSEO"
          label="SEO Title"
          variant="outlined"
          :error="!!formErrors.titleSEO"
          :error-messages="formErrors.titleSEO"
        />

        <!-- SEO Description -->
        <LabelInput label="SEO Description" />
        <v-textarea
          v-model="store.formItem.descriptionSEO"
          label="SEO Description"
          variant="outlined"
          :counter="160"
          :error="!!formErrors.descriptionSEO"
          :error-messages="formErrors.descriptionSEO"
        />

        <!-- Slug -->
        <LabelInput label="Slug (URL)" required />
        <v-text-field
          v-model="store.formItem.slug"
          label="Slug"
          variant="outlined"
          required
          :error="!!formErrors.slug"
          :error-messages="formErrors.slug"
        />

        <!-- Keywords -->
        <LabelInput label="Keywords (phân cách bằng dấu ,)" />
        <v-text-field
          v-model="store.formItem.keywords"
          label="Keywords"
          variant="outlined"
          :error="!!formErrors.keywords"
          :error-messages="formErrors.keywords"
        />
      </v-form>
    </template>

    <template #footer>
      <Button
        @click="handleSubmitCreate"
        color="primary"
        label="Lưu danh mục"
        class="w-full"
      />
    </template>
  </Popup>
</template>
