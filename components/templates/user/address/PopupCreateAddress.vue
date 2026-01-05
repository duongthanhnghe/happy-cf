<script lang="ts" setup>
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore'
import { ADDRESS_TAG } from "@/shared/constants/address-tag";
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { showWarning } from '@/utils/toast';
import { useValidate } from '@/composables/validate/useValidate';
import { createAddressSchema } from '@/shared/validate/schemas/address.schema';

const store = useAddressesManageStore();
const storeLocation = useLocationStore();
const { validate, formErrors } = useValidate(createAddressSchema)

const handleSubmitCreate = async () => {
  if (!validate(store.formDataItem)) {
    showWarning('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }

  try {
    await store.submitCreate()
  } catch (error) {
    showWarning('Có lỗi khi lưu địa chỉ. Vui lòng thử lại.')
  }

}
</script>
<template>
<Popup 
  v-model="store.isTogglePopupAdd" 
  popupHeading="Thêm địa chỉ" 
  footerFixed
  align="right">
  <template #body>
    <v-form @submit.prevent="handleSubmitCreate">
      
        <LabelInput label="Tên người nhận" required/>
        <v-text-field v-model="store.formDataItem.fullname" :error="!!formErrors.fullname"
          :error-messages="formErrors.fullname" label="Nhập họ và tên" variant="outlined" required></v-text-field>

        <LabelInput label="Số điện thoại" required/>
        <v-text-field type="tel" v-model="store.formDataItem.phone" :error="!!formErrors.phone"
          :error-messages="formErrors.phone" label="Nhập số điện thoại" variant="outlined" required></v-text-field>

        <LabelInput label="Địa chỉ" required/>
        <v-text-field v-model="store.formDataItem.address" :error="!!formErrors.address"
          :error-messages="formErrors.address" label="Nhập địa chỉ" variant="outlined" required></v-text-field>

        <div class="flex gap-sm">
          <div class="flex-1">
          <LabelInput label="Thành phố" required/>
          <v-autocomplete
            v-model="storeLocation.selectedProvince"
              :items="storeLocation.getListProvinces ?? []"
              item-title="PROVINCE_NAME"
              item-value="PROVINCE_ID"
              variant="outlined"
              :error="!!formErrors.provinceCode"
              :error-messages="formErrors.provinceCode"
            />
          </div>
          <div class="flex-1">
          <LabelInput label="Quận/Huyện" required/>
            <v-autocomplete
            v-model="storeLocation.selectedDistrict"
              :items="storeLocation.getListDistricts ?? []"
              item-title="DISTRICT_NAME"
              item-value="DISTRICT_ID"
              variant="outlined"
              :error="!!formErrors.districtCode"
              :error-messages="formErrors.districtCode"
            />
          </div>
          <div class="flex-1">
          <LabelInput label="Phường/Xã" required/>
          <v-autocomplete
            v-model="storeLocation.selectedWard"
              :items="storeLocation.getListWards ?? []"
              item-title="WARDS_NAME"
              item-value="WARDS_ID"
              variant="outlined"
              :error="!!formErrors.wardCode"
              :error-messages="formErrors.wardCode"
            />
          </div>
        </div>

        <LabelInput label="Ghi chú"/>
        <v-text-field v-model="store.formDataItem.note" label="Nhập ghi chú" variant="outlined"></v-text-field>
   
        <LabelInput label="Nhãn" required/>
        <v-radio-group inline v-model="store.formDataItem.tag" :error="!!formErrors.tag" :error-messages="formErrors.tag">
          <v-radio :label="ADDRESS_TAG.HOME" :value="ADDRESS_TAG.HOME" class="mr-sm"></v-radio>
          <v-radio :label="ADDRESS_TAG.OFFICE" :value="ADDRESS_TAG.OFFICE" class="mr-sm"></v-radio>
          <v-radio :label="ADDRESS_TAG.SCHOOL" :value="ADDRESS_TAG.SCHOOL" class="mr-sm"></v-radio>
          <v-radio :label="ADDRESS_TAG.OTHER" :value="ADDRESS_TAG.OTHER"></v-radio>
        </v-radio-group>
    </v-form>
  </template>
  <template #footer>
    <Button @click="handleSubmitCreate" color="primary" label="Lưu địa chỉ" class="w-full" />
  </template>
</Popup>
</template>
