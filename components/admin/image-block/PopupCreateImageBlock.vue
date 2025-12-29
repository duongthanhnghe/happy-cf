<script lang="ts" setup>
import { useImageBlockManageStore } from '@/stores/admin/image-block/useImageBlockManageStore';
import type { SubmitEventPromise } from 'vuetify'
import { IMAGE_BLOCK_PAGE_OPTIONS, IMAGE_BLOCK_POSITION_OPTIONS } from '@/shared/constants/image-block';

const store = useImageBlockManageStore();

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const results = await event
  if (!results.valid) return
  await store.submitCreate();
}

</script>
<template>
<Popup v-model="store.isTogglePopupAdd" popupHeading="Them anh" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
        <LabelInput label="Tieu de"/>
        <v-text-field v-model="store.formItem.title" :counter="100" label="Nhap tieu de" variant="outlined"></v-text-field>
        <LabelInput label="Noi dung"/>
        <v-textarea v-model="store.formItem.description" :counter="200" label="Nhap noi dung" variant="outlined"></v-textarea>

        <LabelInput label="Text tren nut" />
        <v-text-field v-model="store.formItem.textButton" :counter="100" label="Nhap text" variant="outlined"></v-text-field>

        <LabelInput label="Link dieu huong" />
        <v-text-field v-model="store.formItem.linkRedirect" label="Nhap link dieu huong" variant="outlined"></v-text-field>

        <LabelInput label="Trang hiển thị" required/>
        <v-select
          label="Trang hiển thị"
          v-model="store.formItem.page"
          :items="IMAGE_BLOCK_PAGE_OPTIONS"
          item-title="title"
          item-value="value"
          variant="outlined"
          :rules="store.nullRules"
          required
        />

        <LabelInput label="Vị trí" required/>
        <v-select
          label="Vị trí hiển thị"
          v-model="store.formItem.position"
          :items="IMAGE_BLOCK_POSITION_OPTIONS"
          item-title="title"
          item-value="value"
          variant="outlined"
          :rules="store.nullRules"
          required
        />

        <LabelInput label="Hinh anh" required/>
        <v-img v-if="store.formItem.image" :src="store.formItem.image" class="mb-sm" alt="Hinh anh" required/>
        <div class="flex gap-sm">
          <v-text-field v-model="store.formItem.image" label="Duong dan anh..." :rules="store.nullRules" variant="outlined" required></v-text-field>
          <Button color="black" :label="store.formItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>
        <v-switch :label="`Tinh trang: ${store.formItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.formItem.isActive" inset
        ></v-switch>

        <Button type="submit" color="primary" label="Luu" class="w-full" />
    </v-form>
  </template>
</Popup>
</template>
