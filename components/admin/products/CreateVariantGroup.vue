<script lang="ts" setup>
import { useValidate } from '@/composables/validate/useValidate';
import { createVariantGroupSchema } from '@/shared/validate/schemas/variant-group.schema';
import { useVariantGroupStore } from '@/stores/admin/product/useVariantGroupManageStore'; 
import { showWarning } from '@/utils/toast';
const { formErrors, validate } = useValidate(createVariantGroupSchema);

const store = useVariantGroupStore();

const handleSubmitCreate = async () => {
 if (!validate(store.formItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }

  await store.submitCreate();
}
</script>

<template>
<Popup v-model="store.isTogglePopupAdd" footerFixed popupHeading="Thêm nhóm biến thể" align="right">
  <template #body>
    <v-form @submit.prevent="handleSubmitCreate">

      <LabelInput label="Tên nhóm biến thể" required/>
      <v-text-field 
        v-model="store.formItem.groupName" 
        variant="outlined" 
        :error="!!formErrors.groupName"
        :error-messages="formErrors.groupName"
        required
      />

      <LabelInput label="Loại nhóm" required/>
      <v-text-field 
        v-model="store.formItem.groupType" 
        :error="!!formErrors.groupType"
        :error-messages="formErrors.groupType"
        variant="outlined" 
        placeholder="Ví dụ: size, color, addon, option"
        required
      />

      <LabelInput label="Mô tả"/>
      <v-textarea 
        v-model="store.formItem.description" 
        variant="outlined"
        :error="!!formErrors.description"
        :error-messages="formErrors.description"
      />

      <LabelInput label="Icon hiển thị"/>
      <v-text-field  
        v-model="store.formItem.icon" 
        :error="!!formErrors.icon"
        :error-messages="formErrors.icon"
        variant="outlined"
      />

      <LabelInput label="Danh sách biến thể" required/>
      <Card size="sm" bg="gray2" border class="rd-lg pb-0">
        <NoData v-if="store.formItem.variants.length === 0" :text="formErrors.variants || 'Vui lòng nhập biến thể'" class="pb-ms"/>
        <template v-else>
          <div v-for="(v, idx) in store.formItem.variants" :key="v.id" class="flex flex-direction-column">
            <div class="flex gap-ms">
              <div class="flex-1">
                <LabelInput :label="`${idx + 1}. ${v.name ? v.name : 'Tên biến thể'}`" class="weight-semibold" />
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
                <LabelInput :label="`${v.isActive ? 'Hiển thị' : 'Ẩn đi'}`"/>
                <v-switch v-model="v.isActive" inset/>
              </div>
              <div>
                <LabelInput label="action" class="opacity-0"/>
                <Button
                  color="secondary"
                  icon="delete"
                  @click.prevent="store.removeVariant(idx,'form')"
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
        @click.prevent="store.addVariant('form')"
      />

      <!-- <v-switch
        :label="`Ảnh đại diện biến thể: ${store.formItem.hasImage ? 'Có' : 'Không'}`"
        v-model="store.formItem.hasImage"
        hide-details
        inset
      /> -->

      <v-switch
        :label="`Tình trạng: ${store.formItem.isActive ? 'Kích hoạt' : 'Tắt'}`"
        v-model="store.formItem.isActive"
        hide-details
        inset
      />

    </v-form>
  </template>
  <template #footer>
    <Button @click="handleSubmitCreate" color="primary" label="Lưu" class="w-full" />
  </template>
</Popup>
</template>
