<script lang="ts" setup>
import { useMembershipStore } from '@/stores/admin/users/useMembershipStore'
import type { SubmitEventPromise } from 'vuetify'
import { nullRules } from '@/utils/validation'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { watch } from 'vue'

const store = useMembershipStore()
const storeFileManage = useFileManageFolderStore()

const handleSubmitUpdate = async (event: SubmitEventPromise) => {
  const results = await event
  if (!results.valid) return
  await store.submitUpdate()
}

watch(() => storeFileManage.getSelectImage, (newValue) => {
  if (!newValue) return
  const target = store.formItem
  target.image = newValue.url
})
</script>

<template>
  <Popup
    v-model="store.isTogglePopupUpdate"
    popupHeading="Sửa cấp độ"
    align="right"
  >
    <template #body>
      <v-form validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">

        <LabelInput label="Lợi ích thành viên" />
        <v-select
          v-model="store.selectedArray"
          :items="store.getMembershipBenefitList"
          item-title="name"
          item-value="id"
          multiple
          variant="outlined"
        >
          <template v-slot:prepend-item>
            <v-list-item
              title="Chọn tất cả"
              @click="store.toggleSelectAll"
            >
              <template v-slot:prepend>
                <v-checkbox-btn
                  :color="store.likesSomeSelect ? 'indigo-darken-4' : undefined"
                  :indeterminate="store.likesSomeSelect && !store.likesAllArray"
                  :model-value="store.likesAllArray"
                />
              </template>
            </v-list-item>
          </template>
        </v-select>

        <LabelInput label="Tiêu đề" required />
        <v-text-field
          v-model="store.formItem.name"
          :counter="200"
          :rules="nullRules"
          label="Tên"
          variant="outlined"
          required
        />

        <LabelInput label="Điểm tối thiểu" required />
        <v-text-field
          v-model="store.formItem.minPoint"
          type="number"
          :rules="nullRules"
          label="Điểm"
          variant="outlined"
          required
        />

        <LabelInput label="Biểu tượng (Icon)" required />
        <v-text-field
          v-model="store.formItem.icon"
          :rules="nullRules"
          label="Icon"
          variant="outlined"
          required
        />

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
            @click.prevent="storeFileManage.handleTogglePopup(true)"
          />
        </div>

        <Button
          type="submit"
          color="primary"
          label="Cập nhật"
          class="w-full"
        />
      </v-form>
    </template>
  </Popup>
</template>
