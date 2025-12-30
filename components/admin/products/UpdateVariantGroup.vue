<script lang="ts" setup>
import { useVariantGroupStore } from '@/stores/admin/product/useVariantGroupManageStore'; 
import { nullRules, nullAndSpecialRules } from '@/utils/validation';
import { showWarning } from '@/utils/toast'
import { useValidate } from '@/composables/validate/useValidate';
import { updateVariantGroupSchema } from '@/shared/validate/schemas/variant-group.schema';
const store = useVariantGroupStore();
const { formErrors, validate } = useValidate(updateVariantGroupSchema)

const handleSubmitUpdate = async () => {
  if (!validate(store.updateItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }

  await store.submitUpdate();
}
</script>

<template>
  <Popup
    v-model="store.isTogglePopupUpdate"
    footerFixed
    popupHeading="Cập nhật nhóm biến thể"
    align="right"
  >
    <template #body>
      <v-form @submit.prevent="handleSubmitUpdate">

        <!-- Tên nhóm -->
        <LabelInput label="Tên nhóm biến thể" required/>
        <v-text-field
          v-model="store.updateItem.groupName"
          variant="outlined"
          :error="!!formErrors.groupName"
          :error-messages="formErrors.groupName"
          required
        />

        <!-- Loại nhóm -->
        <LabelInput label="Loại nhóm" required/>
        <v-text-field
          v-model="store.updateItem.groupType"
          variant="outlined"
          placeholder="Ví dụ: size, color, addon, option"
          :error="!!formErrors.groupType"
          :error-messages="formErrors.groupType"
          required
        />

        <!-- Mô tả -->
        <LabelInput label="Mô tả"/>
        <v-textarea
          v-model="store.updateItem.description"
          variant="outlined"
          :error="!!formErrors.description"
          :error-messages="formErrors.description"
        />

        <!-- Icon -->
        <LabelInput label="Icon hiển thị"/>
        <v-text-field
          v-model="store.updateItem.icon"
          variant="outlined"
          :error="!!formErrors.icon"
          :error-messages="formErrors.icon"
        />

        <!-- Danh sách biến thể -->
        <LabelInput label="Danh sách biến thể" required/>
        <Card size="sm" bg="gray2" border class="rd-lg pb-0">

          <NoData
            v-if="store.updateItem.variants?.length === 0"
            :text="formErrors.variants || 'Vui lòng nhập biến thể'"
            class="pb-ms"
          />

          <template v-else>
            <div
              v-for="(v, idx) in store.updateItem.variants"
              :key="v.id"
              class="flex flex-direction-column"
            >
              <div class="flex gap-ms">
                <div class="flex-1">
                  <LabelInput
                    :label="`${idx + 1}. ${v.name || 'Tên biến thể'}`"
                    class="weight-semibold"
                  />
                  <v-text-field
                    v-model="v.name"
                    variant="outlined"
                    placeholder="Ví dụ: Size M"
                    :error="!!formErrors[`variants.${idx}.name`]"
                    :error-messages="formErrors[`variants.${idx}.name`]"
                    required
                  />
                </div>

                <div>
                  <LabelInput :label="v.isActive ? 'Hiển thị' : 'Ẩn đi'"/>
                  <v-switch v-model="v.isActive" inset/>
                </div>

                <div>
                  <LabelInput label="action" class="opacity-0"/>
                  <Button
                    color="secondary"
                    icon="delete"
                    @click.prevent="store.removeVariant(idx, 'update')"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>

        <Button
          color="black"
          icon="add"
          label="Thêm biến thể"
          class="mt-sm"
          @click.prevent="store.addVariant('update')"
        />

        <!-- Trạng thái -->
        <v-switch
          :label="`Tình trạng: ${store.updateItem.isActive ? 'Kích hoạt' : 'Tắt'}`"
          v-model="store.updateItem.isActive"
          hide-details
          inset
        />

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
<!-- <Popup v-model="store.isTogglePopupUpdate" footerFixed popupHeading="Cập nhật nhóm biến thể" align="right">
  <template #body>
    <v-form @submit.prevent="handleSubmitUpdate">
      <LabelInput label="Tên nhóm biến thể" required/>
      <v-text-field 
        v-model="store.updateItem.groupName" 
        variant="outlined" 
        required
        :rules="nullRules"
      />

      <LabelInput label="Loại nhóm" required/>
      <v-text-field 
        v-model="store.updateItem.groupType" 
        :rules="nullAndSpecialRules"
        variant="outlined" 
        placeholder="Ví dụ: size, color, addon, option"
        required
      />

      <LabelInput label="Mô tả"/>
      <v-textarea 
        v-model="store.updateItem.description" 
        variant="outlined"
      />

      <LabelInput label="Icon hiển thị"/>
      <v-text-field  
        v-model="store.updateItem.icon" 
        variant="outlined"
      />

      <LabelInput label="Danh sách biến thể" required/>
      <Card v-if="store.updateItem.variants" size="sm" bg="gray2" border class="rd-lg pb-0">
        <NoData v-if="store.updateItem.variants?.length === 0" text="Vui lòng nhập biến thể" class="pb-ms"/>
        <template v-else>
          <div v-for="(v, idx) in store.updateItem.variants" :key="v.id" class="flex flex-direction-column">
            <div class="flex gap-ms">
              <div class="flex-1">
                <LabelInput :label="`${idx + 1}. ${v.name ? v.name : 'Tên biến thể'}`" class="weight-semibold" />
                <v-text-field 
                  v-model="v.name"
                  variant="outlined"
                  placeholder="Ví dụ: Size M"
                  :rules="nullRules"
                  required
                />
              </div>
              <div>
                <LabelInput :label="`${v.isActive ? 'Hiển thị' : 'Ẩn đi'}`"/>
                <v-switch v-model="v.isActive" inset/>
              </div>
              <div>
                <LabelInput label="action" class="opacity-0"/>
                <Button
                  color="secondary"
                  icon="delete"
                  @click.prevent="store.removeVariant(idx,'update')"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>
    
      <Button 
        color="black" 
        icon="add" 
        label="Thêm biến thể"
        class="mt-sm"
        @click.prevent="store.addVariant('update')"
      />

      <!-- <v-switch
        :label="`Ảnh đại diện biến thể: ${store.updateItem.hasImage ? 'Có' : 'Không'}`"
        v-model="store.updateItem.hasImage"
        hide-details
        inset
      />

      <v-switch
        :label="`Tình trạng: ${store.updateItem.isActive ? 'Kích hoạt' : 'Tắt'}`"
        v-model="store.updateItem.isActive"
        hide-details
        inset
      />

    </v-form>
  </template>
  <template #footer>
    <Button @click="handleSubmitUpdate" color="primary" label="Cập nhật" class="w-full" />
  </template>
</Popup> -->
</template>
