<script lang="ts" setup>
import { useTranslationManageStore } from '@/stores/admin/itranslation/useTranslationManageStore'
import { ref } from 'vue';
import { useValidate } from '@/composables/validate/useValidate'
import { showWarning } from '@/utils/toast'
import { createTranslationSchema } from '@/shared/validate/schemas/itranslation.schema';

const store = useTranslationManageStore();
const { validate, formErrors } = useValidate(createTranslationSchema)
const editorRef = ref()
const editorRefEn = ref()

const handleSubmitCreate = async () => {
  
  if (!validate(store.formItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }

  if(!store.formItem.translations.vi || !store.formItem.translations.en) {
    showWarning('Vui long nhap noi dung')
    return
  }

  if(store.formItem.type === 'html') {
    try {
      const editorComponent: any = editorRef.value
      const editorComponentEn: any = editorRefEn.value

      if (editorComponent?.uploadAllImages) {
        const uploadSuccess = await editorComponent.uploadAllImages()
        const uploadSuccessEn = await editorComponentEn.uploadAllImages()

        if (!uploadSuccess || !uploadSuccessEn) {
          showWarning('Có lỗi khi upload hình ảnh. Vui lòng thử lại.')
          return
        }
        return await store.submitCreate()
      }
    } catch (error) {
      showWarning('Có lỗi khi lưu bài viết. Vui lòng thử lại.')
    }
  }

  return await store.submitCreate()
};
</script>

<template>
  <Popup
    v-model="store.isTogglePopupAdd"
    popupHeading="Tạo biến"
    align="right"
    footerFixed
  >
    <template #body>
      <v-form @submit.prevent="handleSubmitCreate">

        <!-- Key -->
        <LabelInput label="Key" required />
        <v-text-field
          v-model="store.formItem.key"
          label="Nhập key"
          variant="outlined"
          required
          :error="!!formErrors.key"
          :error-messages="formErrors.key"
        />

        <!-- Type -->
        <LabelInput label="Loại dữ liệu" required />
        <v-select
          v-model="store.formItem.type"
          :items="[
            { title: 'Text', value: 'text' },
            { title: 'HTML', value: 'html' }
          ]"
          variant="outlined"
          :error="!!formErrors.type"
          :error-messages="formErrors.type"
        />

        <!-- Tiếng Việt -->
        <LabelInput label="Nội dung tiếng Việt" required />
        <v-textarea
          v-if="store.formItem.type === 'text'"
          v-model="store.formItem.translations.vi"
          label="Nhập nội dung tiếng Việt"
          variant="outlined"
          :error="!!formErrors['translations.vi']"
          :error-messages="formErrors['translations.vi']"
        />
        <client-only v-else>
          <CKEditorCDN
            ref="editorRef"
            v-model="store.formItem.translations.vi"
            :uploadUrl="store.folderName"
          />
        </client-only>

        <!-- Tiếng Anh -->
        <LabelInput label="Nội dung tiếng Anh" required />
        <v-textarea
          v-if="store.formItem.type === 'text'"
          v-model="store.formItem.translations.en"
          label="Nhập nội dung tiếng Anh"
          variant="outlined"
          :error="!!formErrors['translations.en']"
          :error-messages="formErrors['translations.en']"
        />
        <client-only v-else>
          <CKEditorCDN
            ref="editorRefEn"
            v-model="store.formItem.translations.en"
            :uploadUrl="store.folderName"
          />
        </client-only>

        
      </v-form>
    </template>
    <template #footer>
      <Button
        @click="handleSubmitCreate"
        color="primary"
        label="Lưu mới"
        class="w-full"
      />
    </template>
  </Popup>
</template>
