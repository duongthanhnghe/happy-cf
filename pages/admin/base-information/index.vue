<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useBaseInformationUpdateStore } from '@/stores/admin/setting/useBaseInformationUpdateStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { showWarning } from '@/utils/toast';
import { ROUTES } from '@/shared/constants/routes';
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { useLocationWatchers } from '@/composables/shared/location/useLocationWatchers';
import { useValidate } from '@/composables/validate/useValidate'
import { updateBaseInformationSchema } from '@/shared/validate/schemas/base-information.schema';

definePageMeta({
  layout: ROUTES.ADMIN.BASE_INFORMATION.layout,
  middleware: ROUTES.ADMIN.BASE_INFORMATION.middleware,
})

const storeSettingUpdate = useBaseInformationUpdateStore();
const storeLocation = useLocationStore();
const storeDisplay = useDisplayStore()
const { validate, formErrors } = useValidate(updateBaseInformationSchema)

const handleSubmitCreate = async () => {

  if (!validate(storeSettingUpdate.formItem)) {
    showWarning('Vui lòng kiểm tra lại thông tin')
    return
  }

  await storeSettingUpdate.update()
}

useLocationWatchers(storeLocation);

onMounted(async () => {
  await storeLocation.fetchProvincesStore()
  const { provinceCode, districtCode, wardCode } = storeSettingUpdate.formItem

  if (provinceCode) {
    storeLocation.selectedProvince = provinceCode
    await storeLocation.fetchDistrictsStore(provinceCode)
  }

  if (districtCode) {
    storeLocation.selectedDistrict = districtCode
    await storeLocation.fetchWardsStore(districtCode)
  }

  if (wardCode) {
    storeLocation.selectedWard = wardCode
  }
})

onBeforeUnmount(() => {
  storeLocation.resetLocation
})

</script>
<template>

<HeaderAdmin label="Cài đặt thông tin" />

<v-container>
  <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">

      <Card class="rd-lg" size="sm">
        <Text
          size="md"
          weight="semibold"
          class="mb-sm"
          text="Thông tin cơ bản"
        />

        <div class="row row-xs">
          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Logo công ty" required />
            <v-text-field
              v-model="storeSettingUpdate.formItem.logoUrl"
              :error="!!formErrors.logoUrl"
              :error-messages="formErrors.logoUrl"
              label="Nhập logo công ty"
              variant="outlined"
              required
            />
          </div>

          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Tên công ty" required />
            <v-text-field
              v-model="storeSettingUpdate.formItem.name"
              :error="!!formErrors.name"
              :error-messages="formErrors.name"
              label="Nhập tên công ty"
              variant="outlined"
              required
            />
          </div>

          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Số điện thoại" required />
            <v-text-field
              v-model="storeSettingUpdate.formItem.phone"
              :error="!!formErrors.phone"
              :error-messages="formErrors.phone"
              type="number"
              label="Nhập số điện thoại"
              variant="outlined"
              required
            />
          </div>

          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Email" required />
            <v-text-field
              v-model="storeSettingUpdate.formItem.email"
              :error="!!formErrors.email"
              :error-messages="formErrors.email"
              label="Nhập email"
              variant="outlined"
              required
            />
          </div>

          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Địa chỉ" required />
            <v-text-field
              v-model="storeSettingUpdate.formItem.address"
              label="Nhập địa chỉ"
              variant="outlined"
              required
            />
          </div>

          <div class="col-12 col-md-6 col-xxl-4">
            <LabelInput label="Thời gian mở cửa" />
            <v-text-field
              v-model="storeSettingUpdate.formItem.openingHours"
              label="Ví dụ: 7:00 - 21:00"
              variant="outlined"
            />
          </div>

          <div class="col-12">
            <LabelInput label="Mô tả" />
            <v-textarea
              v-model="storeSettingUpdate.formItem.description"
              label="Nhập mô tả ngắn"
              variant="outlined"
            />
          </div>
        </div>
      </Card>

      <Card class="rd-lg mt-md" size="sm">
        <Text size="md" weight="semibold" class="mb-sm" text="Mạng xã hội" />

        <div class="row row-xs">
          <div v-if="storeSettingUpdate.formItem.socialLinks" v-for="(item, index) in storeSettingUpdate.formItem.socialLinks" :key="item.name" class="col-12 col-md-6 col-xxl-4">
            <LabelInput :label="item.name"/>
            <v-text-field v-model="storeSettingUpdate.formItem.socialLinks[index].src" :label="`Nhập đường dẫn `+item.name" variant="outlined" :error="!!formErrors[`socialLinks.${index}.src`]"
  :error-messages="formErrors[`socialLinks.${index}.src`]"></v-text-field> 
          </div>
        </div>
      </Card>

      <Card class="rd-lg mt-md" size="sm">
        <Text size="md" weight="semibold" class="mb-sm" text="Kho hàng" />

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
          <LabelInput label="Quận huyện" required/>
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
          <LabelInput label="Phường xã" required/>
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
      </Card>

      <div class="flex justify-end mt-md">
        <Button type="submit" color="primary" :shadow="true" label="Lưu cài đặt" :class="storeDisplay.isMobileTable ? 'w-full':''" />
      </div>
    </v-form>
</v-container>
</template>
