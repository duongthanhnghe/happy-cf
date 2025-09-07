<script lang="ts" setup>
import { ref } from 'vue'
import { usePostManageStore } from '@/stores/news/usePostManageStore'
import type { SubmitEventPromise } from 'vuetify';
import { showWarning } from '@/utils/toast';

const store = usePostManageStore();
const editorRef = ref()

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return

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
<Popup popupId="popup-update-post" v-model="store.isTogglePopupUpdate" popupHeading="Sua bai viet" align="right">
  <template #body>
    <v-form v-model="store.valid" validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Cap nhat" class="w-full" />
      </div>
        <LabelInput label="Ten bai viet" required/>
        <v-text-field v-model="store.updatePostItem.title" :counter="200" :rules="store.titleRules" label="Ten bai viet" variant="outlined" required></v-text-field>
        <LabelInput label="Mo ta bai viet"/>
        <v-textarea v-model="store.updatePostItem.summaryContent" :counter="500" label="Mo ta" variant="outlined"></v-textarea>
        <LabelInput label="Noi dung bai viet"/>
        <client-only>
        <CKEditorCDN
          ref="editorRef"
          v-model="store.updatePostItem.description"
          :uploadUrl="store.folderName"
        />
        </client-only>
       
        <LabelInput label="Danh muc bai viet" required/>
        <v-select label="Chon danh muc"
          v-model="store.updatePostItem.categoryId"
          variant="solo"
          :items="store.getListCategory"
          item-title="categoryName"
          item-value="id"
          :rules="store.catalogRules"
          />
        
        <LabelInput label="Hinh dai dien" required/>
        <v-img v-if="store.updatePostItem.image" :src="store.updatePostItem.image" class="mb-sm" alt="Hinh anh" />
        <div class="flex gap-sm">
          <v-text-field v-model="store.updatePostItem.image" label="Duong dan anh..." variant="outlined" disabled></v-text-field>
          <Button color="black" :label="store.updatePostItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>
        <v-switch :label="`Tinh trang: ${store.updatePostItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.updatePostItem.isActive" inset
        ></v-switch>
    </v-form>
  </template>
</Popup>
</template>
