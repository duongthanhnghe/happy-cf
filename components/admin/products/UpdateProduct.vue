<script lang="ts" setup>
import { useProductManageStore } from '@/stores/admin/product/useProductManageStore'
import { showWarning } from '@/utils/toast';
import { ref } from 'vue';
import type { VForm } from 'vuetify/components'

const store = useProductManageStore();
const formRef = ref<VForm | null>(null);

const handleSubmitUpdate = async () => {
  if (!formRef.value) return;

  const {valid} = await formRef.value.validate();
  if (!valid || store.selectedCategoryName.length === 0) {
    showWarning('Vui lòng nhập đầy đủ thông tin');
    return;
  }
  
  store.submitUpdate()
}

</script>
<template>
<Popup v-model="store.isTogglePopupUpdate" footerFixed popupHeading="Sua san pham" align="right">
  <template #body>
    <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="handleSubmitUpdate">

        <LabelInput label="Ten san pham" required/>
        <v-text-field v-model="store.updateProductItem.productName" :counter="100" :rules="store.nullAndSpecialRules" label="Ten san pham" variant="outlined" required></v-text-field>
        <div class="row">
          <div class="col-6">
        <LabelInput label="Gia goc" required/>
        <v-text-field v-model="store.updateProductItem.price" :rules="store.nullRules" type="number" label="Gia goc" variant="outlined"></v-text-field>
          
          </div>
          <div class="col-6">
        <LabelInput label="Gia khuyen mai" required/>
        <v-text-field v-model="store.updateProductItem.priceDiscounts" :rules="store.productPriceDiscountUpdateRules" type="number" label="Gia khuyen mai" variant="outlined"></v-text-field>
          
          </div>
          <div class="col-6">
            <LabelInput label="So luong" required/>
            <v-text-field v-model="store.updateProductItem.amount" :rules="store.nullRules" type="number" label="So luong" variant="outlined"></v-text-field>
          </div>

          <div class="col-6">
            <LabelInput label="Can nang (gram)" required/>
            <v-text-field v-model="store.updateProductItem.weight" :rules="store.nullRules" type="number" label="Nhap can nang" variant="outlined"></v-text-field>
          </div>
          
          <div class="col-12">
            <LabelInput label="SKU" />
            <v-text-field v-model="store.updateProductItem.sku" type="text" label="Sku" variant="outlined"></v-text-field>
          </div>

          <div class="col-12 flex gap-sm align-anchor">
            <div class="flex-1">
              <LabelInput label="Danh muc san pham" required/>
              <VTreeChoose :label="store.selectedCategoryName">
                <v-treeview
                  :items="store.treeItems"
                  item-value="id"
                  item-title="categoryName"
                  selectable
                  return-object
                  select-strategy="single-independent"
                  v-model:selected="store.selectedCategory"
                  open-all
                  density="compact"
                >
                </v-treeview>
              </VTreeChoose>
              </div>
          </div>
        </div>
        <LabelInput label="Noi dung"/>
        <v-textarea v-model="store.updateProductItem.description" :counter="5000" label="Noi dung" variant="outlined"></v-textarea>
        <LabelInput label="Mo ta"/>
        <v-textarea v-model="store.updateProductItem.summaryContent" :counter="500" label="Mo ta" variant="outlined"></v-textarea>
        <LabelInput label="Anh dai dien" required/>
        <v-img v-if="store.updateProductItem.image" :src="store.updateProductItem.image" class="mb-sm" alt="Hinh anh" :rules="store.nullRules" required/>
        <div class="flex gap-sm">
          <v-text-field v-model="store.updateProductItem.image" label="Duong dan anh..." variant="outlined" ></v-text-field>
          <Button color="black" :label="store.updateProductItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>

        <LabelInput label="Anh lien quan" />

        <div class="row row-xs" v-if="store.updateProductItem.listImage && store.updateProductItem.listImage.length > 0">
          <div class="col-6 col-md-4" v-for="item in store.updateProductItem.listImage" :key="item.id">
            <ControlImage :src="item.src" :label="item.src" className="mb-sm">
              <template #action>
                <Button
                  v-tooltip="'Xoa anh'"
                  color="secondary"
                  icon="delete"
                  size="sm"
                  @click="store.handleDeleteListImage(item.id, false)"
                />
              </template>
            </ControlImage>
          </div>
        </div>

        <Button class="w-full" :border="false" color="gray" label="Them anh" @click.prevent="store.handleAddListImage()"/>

        <v-switch :label="`Tinh trang: ${store.updateProductItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.updateProductItem.isActive" inset
        ></v-switch>

        <LabelInput label="SEO Title" />
        <v-text-field
          v-model="store.updateProductItem.titleSEO"
          label="SEO Title"
          variant="outlined"
        />

        <LabelInput label="SEO Description" />
        <v-textarea
          v-model="store.updateProductItem.descriptionSEO"
          :counter="160"
          label="SEO Description"
          variant="outlined"
        />

        <LabelInput label="Slug (URL)" required/>
        <v-text-field
          v-model="store.updateProductItem.slug"
          label="Slug"
          variant="outlined"
          :rules="store.nullRules"
          required
        />

        <LabelInput label="Keywords (phân cách bằng dấu ,)" />
        <v-text-field
          v-model="store.updateProductItem.keywords"
          label="Keywords"
          variant="outlined"
        />

    </v-form>
  </template>
  <template #footer>
    <div class="flex gap-sm">
      <Button v-if="store.updateProductItem?.variantGroups" color="gray" :label="`${store.updateProductItem?.variantGroups.length > 0 ? 'Sua bien the':'Them bien the'}`" class="w-full" @click.prevent="store.handleTogglePopupAddVariant(true)" />
      <Button @click="handleSubmitUpdate" color="primary" label="Cap nhat" class="w-full" />
    </div>
  </template>
</Popup>
</template>
