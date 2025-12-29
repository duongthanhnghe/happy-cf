<script lang="ts" setup>
import { useImageBlockManageStore } from '@/stores/admin/image-block/useImageBlockManageStore';
import type { SubmitEventPromise } from 'vuetify'
import { IMAGE_BLOCK_PAGE_OPTIONS, IMAGE_BLOCK_POSITION_OPTIONS } from '@/shared/constants/image-block';

const store = useImageBlockManageStore();

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const results = await event
  if (!results.valid) return
  await store.submitUpdate();
}

</script>
<template>
<Popup v-model="store.isTogglePopupUpdate" popupHeading="Them anh" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
        <LabelInput label="Tieu de" required/>
        <v-text-field v-model="store.formUpdate.title" :counter="200" :rules="store.nullRules" label="Nhap tieu de" variant="outlined" required></v-text-field>
        <LabelInput label="Noi dung"/>
        <v-textarea v-model="store.formUpdate.description" label="Nhap noi dung" variant="outlined"></v-textarea>

        <LabelInput label="Text tren nut" required/>
        <v-text-field v-model="store.formUpdate.textButton" :counter="100" label="Nhap text" variant="outlined"></v-text-field>

        <LabelInput label="Link dieu huong" required/>
        <v-text-field v-model="store.formUpdate.linkRedirect" label="Nhap link dieu huong" variant="outlined"></v-text-field>

        <LabelInput label="Trang hiển thị" required/>
        <v-select
          label="Trang hiển thị"
          v-model="store.formUpdate.page"
          :items="IMAGE_BLOCK_PAGE_OPTIONS"
          item-title="title"
          item-value="value"
          variant="outlined"
          disabled
        />

        <LabelInput label="Vị trí" required/>
        <v-select
          label="Vị trí hiển thị"
          v-model="store.formUpdate.position"
          :items="IMAGE_BLOCK_POSITION_OPTIONS"
          item-title="title"
          item-value="value"
          variant="outlined"
          disabled
        />

        <LabelInput label="Hinh anh" required/>
        <v-img v-if="store.formUpdate.image" :src="store.formUpdate.image" class="mb-sm" alt="Hinh anh" />
        <div class="flex gap-sm">
          <v-text-field v-model="store.formUpdate.image" label="Duong dan anh..." variant="outlined" ></v-text-field>
          <Button color="black" :label="store.formUpdate.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>
        <v-switch :label="`Tinh trang: ${store.formUpdate.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.formUpdate.isActive" inset
        ></v-switch>

        <Button type="submit" color="primary" label="Luu" class="w-full" />
    </v-form>
  </template>
</Popup>
</template>
