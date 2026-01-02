<script lang="ts" setup>
import { useTranslationManageStore } from '@/stores/admin/itranslation/useTranslationManageStore'
import { showWarning } from '@/utils/toast';
import { ref } from 'vue';
import { useValidate } from '@/composables/validate/useValidate';
import { updateTranslationSchema } from '@/shared/validate/schemas/itranslation.schema';

const props = defineProps({
  isAdmin: {
    type: Boolean,
  },
})

const store = useTranslationManageStore();
const { validate, formErrors } = useValidate(updateTranslationSchema)
const editorRef = ref()
const editorRefEn = ref()

const handleSubmitUpdate = async () => {
  if (!validate(store.updateItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }
  
  if(!store.updateItem.translations.vi || !store.updateItem.translations.en) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
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
        return await store.submitUpdate()
      }
    } catch (error) {
      showWarning('Có lỗi khi lưu bài viết. Vui lòng thử lại.')
    }
  }

  return await store.submitUpdate()
};
</script>
<template>
  <Popup
    v-model="store.isTogglePopupUpdate"
    popupHeading="Cập nhật biến"
    align="right"
    footerFixed
  >
    <template #body>
      <v-form @submit.prevent="handleSubmitUpdate">

        <!-- Chỉ admin mới được đổi type -->
        <template v-if="props.isAdmin">
          <LabelInput label="Loại dữ liệu" required />
          <v-select
            v-model="store.updateItem.type"
            :items="[
              { title: 'Text', value: 'text' },
              { title: 'HTML', value: 'html' }
            ]"
            variant="outlined"
            :error="!!formErrors.type"
            :error-messages="formErrors.type"
          />
        </template>

        <!-- Tiếng Việt -->
        <LabelInput label="Nội dung tiếng Việt" required />
        <v-textarea
          v-if="store.updateItem.type === 'text'"
          v-model="store.updateItem.translations.vi"
          label="Nhập nội dung tiếng Việt"
          variant="outlined"
          :error="!!formErrors['translations.vi']"
          :error-messages="formErrors['translations.vi']"
        />
        <client-only v-else>
          <CKEditorCDN
            ref="editorRef"
            v-model="store.updateItem.translations.vi"
            :uploadUrl="store.folderName"
          />
        </client-only>

        <!-- Tiếng Anh -->
        <LabelInput label="Nội dung tiếng Anh" required />
        <v-textarea
          v-if="store.updateItem.type === 'text'"
          v-model="store.updateItem.translations.en"
          label="Nhập nội dung tiếng Anh"
          variant="outlined"
          :error="!!formErrors['translations.en']"
          :error-messages="formErrors['translations.en']"
        />
        <client-only v-else>
          <CKEditorCDN
            ref="editorRefEn"
            v-model="store.updateItem.translations.en"
            :uploadUrl="store.folderName"
          />
        </client-only>

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
