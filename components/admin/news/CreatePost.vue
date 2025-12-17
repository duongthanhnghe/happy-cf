<script lang="ts" setup>
import { ref } from 'vue'
import { usePostManageStore } from '@/stores/admin/news/usePostManageStore'
import type { SubmitEventPromise } from 'vuetify'
import { showWarning } from '@/utils/toast';

const store = usePostManageStore()
const editorRef = ref()

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid) return
  
  if(!store.formPostItem.description) {
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
      await store.submitCreate()
    }
  } catch (error) {
    showWarning('Có lỗi khi lưu bài viết. Vui lòng thử lại.')
  }

}

</script>
<template>
<Popup popupId="popup-create-post" v-model="store.isTogglePopupAdd" popupHeading="Them bai viet" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" :shadow="true" label="Luu bai viet" class="w-full" />
      </div>
        <LabelInput label="Ten bai viet" required/>
        <v-text-field v-model="store.formPostItem.title" :counter="200" :rules="store.nullRules" label="Nhap ten bai viet" variant="outlined" required></v-text-field>
        
        <LabelInput label="Mo ta bai viet"/>
        <v-textarea v-model="store.formPostItem.summaryContent" :counter="500" label="Nhap mo ta" variant="outlined"></v-textarea>
        
        <LabelInput label="Noi dung bai viet" required/>
        <client-only>
        <CKEditorCDN
          ref="editorRef"
          v-model="store.formPostItem.description"
          :uploadUrl="store.folderName"
        />
        </client-only>

        <LabelInput label="Danh muc bai viet" required/>
        <v-select 
          v-if="store.getListCategory"
          label="Chon danh muc"
          v-model="store.formPostItem.categoryId"
          variant="solo"
          :items="store.getListCategory"
          item-title="categoryName"
          item-value="id"
          :rules="store.nullRules"
        />
        <LabelInput label="Hinh dai dien" required/>
        <v-img v-if="store.formPostItem.image" :src="store.formPostItem.image" class="mb-sm" alt="Hinh anh" />
        <div class="flex gap-sm">
          <v-text-field v-model="store.formPostItem.image" label="Duong dan anh..." variant="outlined" :rules="store.nullRules" required disabled></v-text-field>
          <Button color="black" :label="store.formPostItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>
        <v-switch :label="`Tinh trang: ${store.formPostItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.formPostItem.isActive" inset
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
          :rules="store.nullRules"
          required
        />

        <LabelInput label="Keywords (phân cách bằng dấu ,)" />
        <v-text-field
          v-model="store.formPostItem.keywords"
          label="Keywords"
          variant="outlined"
        />
      
    </v-form>
  </template>
</Popup>
</template>
