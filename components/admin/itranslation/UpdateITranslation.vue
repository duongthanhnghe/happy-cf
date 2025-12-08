<script lang="ts" setup>
import { useTranslationManageStore } from '@/stores/admin/itranslation/useTranslationManageStore'
import type { SubmitEventPromise } from 'vuetify';
import { showWarning } from '@/utils/toast';
import { ref } from 'vue';

const props = defineProps({
  isAdmin: {
    type: Boolean,
  },
})

const store = useTranslationManageStore();
const editorRef = ref()
const editorRefEn = ref()

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return
  
  if(!store.updateItem.translations.vi || !store.updateItem.translations.en) {
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
    :popupHeading="`Cập nhật: ${store.updateItem.key}`"
    align="right"
  >
    <template #body >
      <v-form validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">

        <template v-if="props.isAdmin">
        <LabelInput label="Loại dữ liệu" required />
        <v-select
          v-model="store.updateItem.type"
          :items="[
            { title: 'Text', value: 'text' },
            { title: 'HTML', value: 'html' }
          ]"
          variant="outlined"
          required
        />
        </template>

        <LabelInput label="Tiếng Việt" />
        <v-textarea
          v-model="store.updateItem.translations.vi"
          label="Nhập nội dung VI"
          variant="outlined"
          v-if="store.updateItem.type === 'text'"
        />
        <client-only v-else>
          <CKEditorCDN
            ref="editorRef"
            v-model="store.updateItem.translations.vi"
            :uploadUrl="store.folderName"
          />
        </client-only>

        <LabelInput label="Tiếng Anh" />
        <v-textarea
          v-model="store.updateItem.translations.en"
          label="Nhập nội dung EN"
          variant="outlined"
          v-if="store.updateItem.type === 'text'"
        />
        <client-only v-else>
          <CKEditorCDN
            ref="editorRefEn"
            v-model="store.updateItem.translations.en"
            :uploadUrl="store.folderName"
          />
        </client-only>

        <div class="portal-popup-footer mt-4">
          <Button type="submit" color="primary" label="Cập nhật" class="w-full" />
        </div>

      </v-form>
    </template>
  </Popup>
</template>
