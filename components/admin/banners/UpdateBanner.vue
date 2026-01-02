<script lang="ts" setup>
import { useBannerManageStore } from '@/stores/admin/banner/useBannerManageStore'
import { useValidate } from '@/composables/validate/useValidate'
import { showWarning } from '@/utils/toast'
import { updateBannerSchema } from '@/shared/validate/schemas/banner.schema'

const store = useBannerManageStore()

const { validate, formErrors } = useValidate(updateBannerSchema)

const handleSubmitUpdate = async () => {
  if (!validate(store.formBannerItem)) {
    showWarning('Vui lòng kiểm tra lại thông tin banner')
    return
  }

  await store.submitUpdate();
}
</script>
<template>
  <Popup
    v-model="store.isTogglePopupUpdate"
    popupHeading="Sửa banner"
    footerFixed
    align="right"
  >
    <template #body>
      <v-form @submit.prevent="handleSubmitUpdate">

        <!-- Tiêu đề -->
        <LabelInput label="Tiêu đề" required />
        <v-text-field
          v-model="store.formBannerItem.title"
          label="Tiêu đề banner"
          variant="outlined"
          :counter="200"
          :error="!!formErrors.title"
          :error-messages="formErrors.title"
          required
        />

        <!-- Nội dung -->
        <LabelInput label="Nội dung" />
        <v-textarea
          v-model="store.formBannerItem.description"
          label="Nhập nội dung"
          variant="outlined"
          :error="!!formErrors.description"
          :error-messages="formErrors.description"
        />

        <!-- Ảnh đại diện -->
        <LabelInput label="Ảnh đại diện" required />
        <v-img
          v-if="store.formBannerItem.image"
          :src="store.formBannerItem.image"
          class="mb-sm"
          alt="Ảnh banner"
        />

        <div class="flex gap-sm">
          <v-text-field
            v-model="store.formBannerItem.image"
            label="Đường dẫn ảnh..."
            variant="outlined"
            :error="!!formErrors.image"
            :error-messages="formErrors.image"
          />
          <Button
            color="black"
            :label="store.formBannerItem.image ? 'Đổi ảnh' : 'Chọn ảnh'"
            @click.prevent="store.handleAddImage()"
          />
        </div>

        <!-- Trạng thái -->
        <v-switch
          v-model="store.formBannerItem.isActive"
          :label="`Trạng thái: ${
            store.formBannerItem.isActive ? 'Bật' : 'Tắt'
          } kích hoạt`"
          inset
        />

      </v-form>
    </template>

    <template #footer>
      <Button
        @click="handleSubmitUpdate"
        color="primary"
        label="Cập nhật banner"
        class="w-full"
      />
    </template>
  </Popup>
</template>
