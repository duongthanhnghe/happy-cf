<script lang="ts" setup>
import { useTranslationManageStore } from '@/stores/admin/itranslation/useTranslationManageStore'
import { showWarning } from '@/utils/toast';
import { ref } from 'vue';
import type { SubmitEventPromise } from 'vuetify';

const store = useTranslationManageStore();
const editorRef = ref()
const editorRefEn = ref()

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return
  
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
    popupHeading="Tao bien"
    align="right"
  >
    <template #body>
      <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">

        <LabelInput label="Key" required />
        <v-text-field
          v-model="store.formItem.key"
          label="Nhập key"
          variant="outlined"
          :rules="[v => !!v || 'Không được bỏ trống']"
          required
        />

        <LabelInput label="Loại dữ liệu" required />
        <v-select
          v-model="store.formItem.type"
          :items="[
            { title: 'Text', value: 'text' },
            { title: 'HTML', value: 'html' }
          ]"
          variant="outlined"
        />

        <LabelInput label="Tiếng Việt" />
        <v-textarea
          v-model="store.formItem.translations.vi"
          label="Nhập nội dung"
          variant="outlined"
          v-if="store.formItem.type === 'text'"
        />
        <template v-else>
          <client-only >
            <CKEditorCDN
              ref="editorRef"
              v-model="store.formItem.translations.vi"
              :uploadUrl="store.folderName"
            />
          </client-only>
        </template>

        <LabelInput label="Tiếng Anh" />
        <v-textarea
          v-model="store.formItem.translations.en"
          label="Nhập nội dung"
          variant="outlined"
          v-if="store.formItem.type === 'text'"
        />
         <template v-else>
          <client-only>
            <CKEditorCDN
              ref="editorRefEn"
              v-model="store.formItem.translations.en"
              :uploadUrl="store.folderName"
            />
          </client-only>
        </template>
        <Button type="submit" color="primary" label="Lưu mới" class="w-full" />
      </v-form>
    </template>
  </Popup>
</template>
