<script lang="ts" setup>
import { ref } from 'vue'
import { usePostManageStore } from '@/stores/admin/news/usePostManageStore'
import { showWarning } from '@/utils/toast';
import { useValidate } from '@/composables/validate/useValidate';
import { createPostNewsSchema } from '@/shared/validate/schemas/news.schema';

const store = usePostManageStore()
const editorRef = ref()
const { validate, formErrors } = useValidate(createPostNewsSchema)

const handleSubmitCreate = async () => {

  if (!validate(store.formPostItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }

  if(!store.formPostItem.description) {
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
      await store.submitCreate()
    }
  } catch (error) {
    showWarning('Có lỗi khi lưu bài viết. Vui lòng thử lại.')
  }
}

</script>
<template>
<Popup v-model="store.isTogglePopupAdd" footerFixed popupHeading="Thêm bài viết" align="right">
  <template #body>
    <v-form @submit.prevent="handleSubmitCreate">
      
        <LabelInput label="Tên bài viết" required/>
        <v-text-field 
        v-model="store.formPostItem.title" 
        :counter="200" 
        :error="!!formErrors.title"
        :error-messages="formErrors.title" 
        label="Nhập tên bài viết" 
        variant="outlined" 
        required>
        </v-text-field>
        
        <LabelInput label="Mô tả"/>
        <v-textarea 
        v-model="store.formPostItem.summaryContent" 
        :error="!!formErrors.summaryContent"
        :error-messages="formErrors.summaryContent" 
        :counter="500" 
        label="Nhập mô tả" 
        variant="outlined">
        </v-textarea>
        
        <LabelInput label="Nội dung bài viết" required/>
        <div v-if="formErrors.description" class="text-error text-size-xs mb-xs">
          {{ formErrors.description }}
        </div>
        <client-only>
        <CKEditorCDN
          ref="editorRef"
          v-model="store.formPostItem.description"
          :uploadUrl="store.folderName"
        />
        </client-only>

        <LabelInput label="Danh mục bài viết" required/>
        <v-select 
          v-if="store.getListCategory"
          label="Chọn danh mục"
          v-model="store.formPostItem.categoryId"
          variant="solo"
          :items="store.getListCategory"
          item-title="categoryName"
          item-value="id"
          :error="!!formErrors.categoryId"
          :error-messages="formErrors.categoryId"
        />

        <LabelInput label="Hình đại diện" required/>
        <v-img v-if="store.formPostItem.image" :src="store.formPostItem.image" class="mb-sm" alt="Hinh anh" />
        <div class="flex gap-sm">
          <v-text-field 
          v-model="store.formPostItem.image" 
          label="Đường dẫn ảnh..." 
          variant="outlined" 
          :error="!!formErrors.image"
          :error-messages="formErrors.image" 
          required 
          >
          </v-text-field>
          <Button color="black" :label="store.formPostItem.image ? 'Đổi ảnh' : 'Chọn ảnh'" @click.prevent="store.handleAddImage()"/>
        </div>

        <v-switch :label="`Tinh trang: ${store.formPostItem.isActive ? 'Bật' : 'Tắt'} kích hoạt`" v-model="store.formPostItem.isActive" inset
        ></v-switch>

        <LabelInput label="SEO Title" />
        <v-text-field
          v-model="store.formPostItem.titleSEO"
          label="SEO Title"
          variant="outlined"
        />

        <LabelInput label="SEO Description" />
        <v-textarea
          v-model="store.formPostItem.descriptionSEO"
          :counter="160"
          label="SEO Description"
          variant="outlined"
        />

        <LabelInput label="Slug (URL)" required/>
        <v-text-field
          v-model="store.formPostItem.slug"
          label="Slug"
          variant="outlined"
          :error="!!formErrors.slug"
          :error-messages="formErrors.slug"
          required
        />

        <LabelInput label="Keywords (phân cách bằng dấu ,)" />
        <v-text-field
          v-model="store.formPostItem.keywords"
          label="Keywords"
          variant="outlined"
          :error="!!formErrors.keywords"
          :error-messages="formErrors.keywords"
        />
      
    </v-form>
  </template>
  <template #footer>
    <Button @click="handleSubmitCreate()" type="submit" color="primary" :shadow="true" label="Lưu bài viết" class="w-full" />
  </template>
</Popup>
</template>
