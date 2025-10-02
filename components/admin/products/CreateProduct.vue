<script lang="ts" setup>
import { useProductManageStore } from '@/stores/admin/product/useProductManageStore'
import { showWarning } from '@/utils/toast';
import type { SubmitEventPromise } from 'vuetify';
const store = useProductManageStore();

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const result = await event
  if (!result.valid || store.selectedCategoryName.length === 0) {
    showWarning('Vui long nhap day du thong tin!')
    return
  }
  store.submitCreate()
}

</script>
<template>

<Popup popupId="popup-create-product" v-model="store.isTogglePopupAdd" popupHeading="Them san pham" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Luu moi" class="w-full" />
      </div>
        <LabelInput label="Ten san pham" required/>
        <v-text-field v-model="store.formProductItem.productName" :counter="100" :rules="store.nullAndSpecialRules" label="Nhap ten san pham" variant="outlined" required></v-text-field>
        <div class="row">
          <div class="col-4">
            <LabelInput label="Gia goc" required/>
            <v-text-field v-model="store.formProductItem.price" :rules="store.nullRules" type="number" label="0" variant="outlined"></v-text-field>
          </div>
          <div class="col-4">
            <LabelInput label="Gia khuyen mai" required/>
            <v-text-field v-model="store.formProductItem.priceDiscounts" :rules="store.productPriceDiscountRules" type="number" label="0" variant="outlined"></v-text-field>
          </div>
          <div class="col-4">
            <LabelInput label="So luong" required/>
            <v-text-field v-model="store.formProductItem.amount" :rules="store.nullRules" type="number" label="Nhap so luong" variant="outlined"></v-text-field>
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
        <v-textarea v-model="store.formProductItem.description" :counter="5000" label="Nhap noi dung" variant="outlined"></v-textarea>
        <LabelInput label="Mo ta"/>
        <v-textarea v-model="store.formProductItem.summaryContent" :counter="500" label="Nhap mo ta" variant="outlined"></v-textarea>
        <LabelInput label="Anh dai dien" required/>
        <v-img v-if="store.formProductItem.image" :src="store.formProductItem.image" :rules="store.nullRules" class="mb-sm" alt="Hinh anh" required/>
        <div class="flex gap-sm">
          <v-text-field v-model="store.formProductItem.image" label="Duong dan anh..." variant="outlined" disabled></v-text-field>
          <Button color="black" :label="store.formProductItem.image ? 'Doi anh':'Chon anh'" @click.prevent="store.handleAddImage()"/>
        </div>

        <LabelInput label="Anh lien quan" />

        <div class="row row-xs" v-if="store.formProductItem.listImage && store.formProductItem.listImage.length > 0">
          <div class="col-6 col-md-4" v-for="item in store.formProductItem.listImage" :key="item.id">
            <ControlImage :src="item.src" :label="item.src" className="mb-sm">
              <template #action>
                <Button
                  v-tooltip="'Xoa anh'"
                  color="secondary"
                  icon="delete"
                  size="sm"
                  @click="store.handleDeleteListImage(item.id, true)"
                />
              </template>
            </ControlImage>
          </div>
        </div>

        <Button class="w-full" :border="false" color="gray" label="Them anh" @click.prevent="store.handleAddListImage()"/>

        <v-switch :label="`Tinh trang: ${store.formProductItem.isActive ? 'Bat':'Tat'} kich hoat`" v-model="store.formProductItem.isActive" inset
        ></v-switch>

        <LabelInput label="SEO Title" />
        <v-text-field
          v-model="store.formProductItem.titleSEO"
          label="SEO Title"
          variant="outlined"
        />

        <LabelInput label="SEO Description" />
        <v-textarea
          v-model="store.formProductItem.descriptionSEO"
          :counter="160"
          label="SEO Description"
          variant="outlined"
        />

        <LabelInput label="Slug (URL)" required/>
        <v-text-field
          v-model="store.formProductItem.slug"
          label="Slug"
          variant="outlined"
          :rules="store.nullRules"
          required
        />

        <LabelInput label="Keywords (phân cách bằng dấu ,)" />
        <v-text-field
          v-model="store.formProductItem.keywords"
          label="Keywords"
          variant="outlined"
        />

    </v-form>
    <Button type="submit" label="Them bien the" class="w-full" @click.prevent="store.handleTogglePopupAddVariant" />
  </template>
</Popup>
</template>
