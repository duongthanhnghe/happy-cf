<script lang="ts" setup>
import { ref } from 'vue'
import { usePostManageStore } from '@/stores/admin/news/usePostManageStore'
import type { SubmitEventPromise } from 'vuetify';
import { showWarning } from '@/utils/toast';

const store = usePostManageStore();
const editorRef = ref()

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return

  if(!store.updatePostItem.description) {
    showWarning('Vui long nhap noi dung bai viet')
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
<Popup popupId="popup-update-post" v-model="store.isTogglePopupUpdate" popupHeading="Sua bai viet" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Cap nhat" class="w-full" />
      </div>
        <LabelInput label="Ten bai viet" required/>
        <v-text-field v-model="store.updatePostItem.title" :counter="200" :rules="store.nullRules" label="Ten bai viet" variant="outlined" required></v-text-field>
        <LabelInput label="Mo ta bai viet"/>
        <v-textarea v-model="store.updatePostItem.summaryContent" :counter="500" label="Mo ta" variant="outlined"></v-textarea>
        <LabelInput label="Noi dung bai viet" required/>
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
          :rules="store.nullRules"
          />
        
        <LabelInput label="Hinh dai dien" required/>
        <v-img v-if="store.updatePostItem.image" :src="store.updatePostItem.image" class="mb-sm" alt="Hinh anh" />
        <div class="flex gap-sm">
          <v-text-field v-model="store.updatePostItem.image" label="Duong dan anh..." variant="outlined" :rules="store.nullRules" required disabled></v-text-field>
          <Button color="black" :label="store.updatePostItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>
        <v-switch :label="`Tinh trang: ${store.updatePostItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.updatePostItem.isActive" inset
        ></v-switch>

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

        <LabelInput label="Slug (URL)" required/>
        <v-text-field
          v-model="store.updatePostItem.slug"
          label="Slug"
          variant="outlined"
          :rules="store.nullRules"
          required
        />

        <LabelInput label="Keywords (phân cách bằng dấu ,)" />
        <v-text-field
          v-model="store.updatePostItem.keywords"
          label="Keywords"
          variant="outlined"
        />
        
    </v-form>
  </template>
</Popup>
</template>
