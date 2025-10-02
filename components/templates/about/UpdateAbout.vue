<script lang="ts" setup>
import { ref } from 'vue'
import { useAboutManageStore } from '@/stores/admin/about/useAboutManageStore'
import type { SubmitEventPromise } from 'vuetify'
import { showWarning } from '@/utils/toast'

const store = useAboutManageStore()
const editorRef = ref()

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
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
      await store.submitUpdate()
    }
  } catch (error) {
    showWarning('Có lỗi khi lưu bài viết. Vui lòng thử lại.')
  }
}
</script>

<template>
  <Popup
    popupId="popup-update-about"
    v-model="store.isTogglePopupUpdate"
    popupHeading="Sửa bài viết"
    align="right"
  >
    <template #body>
      <v-form
        v-model="store.valid"
        validate-on="submit lazy"
        @submit.prevent="handleSubmitUpdate"
      >
        <div class="portal-popup-footer">
          <Button type="submit" color="primary" label="Cập nhật" class="w-full" />
        </div>

        <LabelInput label="Tiêu đề" required />
        <v-text-field
          v-model="store.formItem.title"
          :counter="200"
          :rules="store.titleRules"
          label="Tiêu đề banner"
          variant="outlined"
          required
        />

        <LabelInput label="Mô tả" />
        <v-textarea
          v-model="store.formItem.summaryContent"
          label="Nhập mô tả"
          variant="outlined"
        />

        <LabelInput label="Nội dung" />
        <client-only>
        <CKEditorCDN
          ref="editorRef"
          v-model="store.formItem.description"
          :uploadUrl="store.folderName"
        />
        </client-only>

        <LabelInput label="Ảnh đại diện" required />
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
          />
          <Button
            color="black"
            :label="store.formItem.image ? 'Đổi ảnh' : 'Chọn ảnh'"
            @click.prevent="store.handleAddImage()"
          />
        </div>

        <LabelInput label="Ảnh liên quan" />
        <div
          class="row row-xs"
          v-if="store.formItem.listImage && store.formItem.listImage.length > 0"
        >
          <div
            class="col-6 col-md-4"
            v-for="item in store.formItem.listImage"
            :key="item.id"
          >
            <ControlImage :src="item.src" :label="item.src" className="mb-sm">
              <template #action>
                <Button
                  v-tooltip="'Xóa ảnh'"
                  color="secondary"
                  icon="delete"
                  size="sm"
                  @click="store.handleDeleteListImage(item.id)"
                />
              </template>
            </ControlImage>
          </div>
        </div>

        <Button
          class="w-full"
          :border="false"
          color="gray"
          label="Thêm ảnh"
          @click.prevent="store.handleAddListImage()"
        />

        <v-switch
          :label="`Tình trạng: ${store.formItem.isActive ? 'Bật' : 'Tắt'} kích hoạt`"
          v-model="store.formItem.isActive"
          inset
        />
      </v-form>
    </template>
  </Popup>
</template>
