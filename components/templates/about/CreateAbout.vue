<script lang="ts" setup>
import { ref } from 'vue'
import { useAboutManageStore } from '@/stores/about/useAboutManageStore'
import type { SubmitEventPromise } from 'vuetify'
import { showWarning } from '@/utils/toast';

const store = useAboutManageStore();
const editorRef = ref()

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const results = await event
  if (!results.valid) return

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
<Popup popupId="popup-create-about" v-model="store.isTogglePopupAdd" popupHeading="Them bai viet" align="right">
  <template #body>
    <v-form v-model="store.valid" validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Luu" class="w-full" />
      </div>
        <LabelInput label="Tieu de" required/>
        <v-text-field v-model="store.formItem.title" :counter="200" :rules="store.titleRules" label="Nhap tieu de" variant="outlined" required></v-text-field>
        <LabelInput label="Mo ta"/>
        <v-textarea v-model="store.formItem.summaryContent" label="Nhap mo ta" variant="outlined"></v-textarea>
        <LabelInput label="Noi dung"/>
        <client-only>
        <CKEditorCDN
          ref="editorRef"
          v-model="store.formItem.description"
          :uploadUrl="store.folderName"
        />
        </client-only>

        <LabelInput label="Anh dai dien" required/>
        <v-img v-if="store.formItem.image" :src="store.formItem.image" class="mb-sm" alt="Hinh anh" />
        <div class="flex gap-sm">
          <v-text-field v-model="store.formItem.image" label="Duong dan anh..." variant="outlined" disabled></v-text-field>
          <Button color="black" :label="store.formItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>

        <LabelInput label="Anh lien quan" />
        <div class="row row-sm" v-if="store.formItem.listImage && store.formItem.listImage.length > 0">
          <div class="col-6 col-md-4" v-for="item in store.formItem.listImage" :key="item.id">
            <ControlImage :src="item.src" :label="item.src" className="mb-sm">
              <template #action>
                <Button
                  v-tooltip="'Xoa anh'"
                  color="secondary"
                  icon="delete"
                  size="sm"
                  @click="store.handleDeleteListImage(item.id)"
                />
              </template>
            </ControlImage>
          </div>
        </div>
        <Button class="w-full" :border="false" color="gray" label="Them anh" @click.prevent="store.handleAddListImage()"/>
        <v-switch :label="`Tinh trang: ${store.formItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.formItem.isActive" inset
        ></v-switch>
    </v-form>
  </template>
</Popup>
</template>
