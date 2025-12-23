<script lang="ts" setup>
import { useCategoryManageStore } from '@/stores/admin/product/useCategoryManageStore'
import type { VForm } from 'vuetify/components'
import { ref } from 'vue';
import { copyText } from '@/utils/global';

const store = useCategoryManageStore();
const formRef = ref<VForm | null>(null);

const handleSubmitUpdate = async () => {
  if (!formRef.value) return;
  const {valid} = await formRef.value.validate();
  if (!valid) {
    return;
  }

  await store.submitUpdate();
}

</script>
<template>
<Popup v-model="store.isTogglePopupUpdate" footerFixed popupHeading="Sua danh muc" align="right">
  <template #body>
    <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">
      <LabelInput label="Thuoc danh muc"/>
      <VTreeChoose :label="store.selectedCategoryName">
        <v-treeview
          :items="store.treeItemsForEdit"
          item-value="id"
          item-title="categoryName"
          :item-props="(item: any) => ({disabled: item.id === store.updateCategoryItem.id})"
          selectable
          return-object
          select-strategy="single-independent"
          v-model:selected="store.selectedCategory"
          open-all
          density="compact"
        >
        </v-treeview>
      </VTreeChoose>

      <div class="flex justify-between mb-xs">
        <LabelInput label="Ten danh muc" required/>
        <v-chip label @click="copyText(`t('${store.updateCategoryItem.id}')`)">
          ID: {{ store.updateCategoryItem.id }}
          <MaterialIcon name="content_copy" class="ml-xs" />
        </v-chip>
      </div>
      <v-text-field v-model="store.updateCategoryItem.categoryName" :counter="50" :rules="store.nullAndSpecialRules" label="Nhap ten danh muc" variant="outlined" required></v-text-field>
      <LabelInput label="Mo ta"/>
      <v-textarea v-model="store.updateCategoryItem.description" :counter="500" label="Nhap mo ta" variant="outlined"></v-textarea>
      
      <LabelInput label="Anh dai dien" required/>
      <v-img v-if="store.updateCategoryItem.image" :src="store.updateCategoryItem.image" class="mb-sm" alt="Hinh anh" :rules="store.nullRules" required />
      <div class="flex gap-sm">
        <v-text-field v-model="store.updateCategoryItem.image" label="Duong dan anh..." variant="outlined" ></v-text-field>
        <Button color="black" :label="store.updateCategoryItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage('image')"/>
      </div>

      <LabelInput label="Banner" required/>
      <v-img v-if="store.updateCategoryItem.banner" :src="store.updateCategoryItem.banner" class="mb-sm" alt="Banner" />
      <div class="flex gap-sm">
        <v-text-field v-model="store.updateCategoryItem.banner" label="Duong dan anh..." variant="outlined" ></v-text-field>
        <Button color="black" :label="store.updateCategoryItem.banner ? 'Doi banner':'Chon banner'" @click.prevent="store.handleAddImage('banner')"/>
      </div>

      <v-switch :label="`Tinh trang: ${store.updateCategoryItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.updateCategoryItem.isActive" inset
      ></v-switch>

      <LabelInput label="SEO Title" />
      <v-text-field
        v-model="store.updateCategoryItem.titleSEO"
        label="SEO Title"
        variant="outlined"
      />

      <LabelInput label="SEO Description" />
      <v-textarea
        v-model="store.updateCategoryItem.descriptionSEO"
        :counter="160"
        label="SEO Description"
        variant="outlined"
      />

      <LabelInput label="Slug (URL)" required/>
      <v-text-field
        v-model="store.updateCategoryItem.slug"
        label="Slug"
        variant="outlined"
        :rules="store.nullRules"
        required
      />

      <LabelInput label="Keywords (phân cách bằng dấu ,)" />
      <v-text-field
        v-model="store.updateCategoryItem.keywords"
        label="Keywords"
        variant="outlined"
      />
    </v-form>
  </template>
  <template #footer>
    <Button @click="handleSubmitUpdate" color="primary" label="Cập nhật" class="w-full" />
  </template>
</Popup>
</template>
