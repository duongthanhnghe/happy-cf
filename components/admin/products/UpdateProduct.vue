<script lang="ts" setup>
import { useValidate } from '@/composables/validate/useValidate';
import { updateProductSchema } from '@/shared/validate/schemas/product.schema';
import { useProductManageStore } from '@/stores/admin/product/useProductManageStore'
import { showWarning } from '@/utils/toast';

const store = useProductManageStore();
const { formErrors, validate } = useValidate(updateProductSchema)

const handleSubmitUpdate = async () => {
  if (!validate(store.updateProductItem) || store.selectedCategoryName.length === 0){
    showWarning('Vui lòng nhập đầy đủ thông tin');
    return;
  } 

  store.submitUpdate()
}

</script>

<template>
<Popup v-model="store.isTogglePopupUpdate" footerFixed popupHeading="Sửa sản phẩm" align="right">
  <template #body>
    <v-form @submit.prevent="handleSubmitUpdate">

      <LabelInput label="Tên sản phẩm" required/>
      <v-text-field
        v-model="store.updateProductItem.productName"
        :counter="100"
        :error="!!formErrors.productName"
        :error-messages="formErrors.productName"
        label="Tên sản phẩm"
        variant="outlined"
        required
      ></v-text-field>

      <div class="row">
        <div class="col-6">
          <LabelInput label="Giá gốc" required/>
          <v-text-field
            v-model="store.updateProductItem.price"
            :error="!!formErrors.price"
            :error-messages="formErrors.price"
            type="number"
            label="Giá gốc"
            variant="outlined"
            required
          ></v-text-field>
        </div>

        <div class="col-6">
          <LabelInput label="Giá khuyến mãi" required/>
          <v-text-field
            v-model="store.updateProductItem.priceDiscounts"
            :error="!!formErrors.priceDiscounts"
            :error-messages="formErrors.priceDiscounts"
            type="number"
            label="Giá khuyến mãi"
            variant="outlined"
            required
          ></v-text-field>
        </div>

        <div class="col-6">
          <LabelInput label="Số lượng" required/>
          <v-text-field
            v-model="store.updateProductItem.amount"
            :error="!!formErrors.amount"
            :error-messages="formErrors.amount"
            type="number"
            label="Số lượng"
            variant="outlined"
            required
          ></v-text-field>
        </div>

        <div class="col-6">
          <LabelInput label="Cân nặng (gram)" required/>
          <v-text-field
            v-model="store.updateProductItem.weight"
            :error="!!formErrors.weight"
            :error-messages="formErrors.weight"
            type="number"
            label="Cân nặng"
            variant="outlined"
            required
          ></v-text-field>
        </div>

        <div class="col-12">
          <LabelInput label="SKU"/>
          <v-text-field
            v-model="store.updateProductItem.sku"
            :error="!!formErrors.sku"
            :error-messages="formErrors.sku"
            type="text"
            label="SKU"
            variant="outlined"
          ></v-text-field>
        </div>

        <div class="col-12 flex gap-sm align-anchor">
          <div class="flex-1">
            <LabelInput label="Danh mục sản phẩm" required/>
            {{ store.selectedCategory }}
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

      <LabelInput label="Nội dung"/>
      <v-textarea
        v-model="store.updateProductItem.description"
        :counter="5000"
        :error="!!formErrors.description"
        :error-messages="formErrors.description"
        label="Nội dung"
        variant="outlined"
      ></v-textarea>

      <LabelInput label="Mô tả"/>
      <v-textarea
        v-model="store.updateProductItem.summaryContent"
        :counter="500"
        :error="!!formErrors.summaryContent"
        :error-messages="formErrors.summaryContent"
        label="Mô tả"
        variant="outlined"
      ></v-textarea>

      <LabelInput label="Ảnh đại diện" required/>
      <v-img
        v-if="store.updateProductItem.image"
        :src="store.updateProductItem.image"
        class="mb-sm"
        alt="Hình ảnh"
        :error="!!formErrors.image"
        :error-messages="formErrors.image"
        required
      />
      <div class="flex gap-sm">
        <v-text-field
          v-model="store.updateProductItem.image"
          :error="!!formErrors.image"
          :error-messages="formErrors.image"
          label="Đường dẫn ảnh..."
          variant="outlined"
        />
        <Button
          color="black"
          :label="store.updateProductItem.image ? 'Đổi ảnh':'Chọn ảnh'"
          @click.prevent="store.handleAddImage()"
        />
      </div>

      <LabelInput label="Ảnh liên quan"/>
      <div class="row row-xs" v-if="store.updateProductItem.listImage?.length">
        <div class="col-6 col-md-4" v-for="item in store.updateProductItem.listImage" :key="item.id">
          <ControlImage :src="item.src" :label="item.src" class="mb-sm">
            <template #action>
              <Button
                v-tooltip="'Xóa ảnh'"
                color="secondary"
                icon="delete"
                size="sm"
                @click="store.handleDeleteListImage(item.id, false)"
              />
            </template>
          </ControlImage>
        </div>
      </div>
      <Button class="w-full" :border="false" color="gray" label="Thêm ảnh" @click.prevent="store.handleAddListImage()"/>

      <v-switch
        :label="`Tình trạng: ${store.updateProductItem.isActive ? 'Bật':'Tắt'} kích hoạt`"
        v-model="store.updateProductItem.isActive"
        inset
      ></v-switch>

      <LabelInput label="SEO Title"/>
      <v-text-field
        v-model="store.updateProductItem.titleSEO"
        :error="!!formErrors.titleSEO"
        :error-messages="formErrors.titleSEO"
        label="SEO Title"
        variant="outlined"
      />

      <LabelInput label="SEO Description"/>
      <v-textarea
        v-model="store.updateProductItem.descriptionSEO"
        :counter="160"
        :error="!!formErrors.descriptionSEO"
        :error-messages="formErrors.descriptionSEO"
        label="SEO Description"
        variant="outlined"
      />

      <LabelInput label="Slug (URL)" required/>
      <v-text-field
        v-model="store.updateProductItem.slug"
        :error="!!formErrors.slug"
        :error-messages="formErrors.slug"
        label="Slug"
        variant="outlined"
        required
      />

      <LabelInput label="Keywords (phân cách bằng dấu ,)"/>
      <v-text-field
        v-model="store.updateProductItem.keywords"
        :error="!!formErrors.keywords"
        :error-messages="formErrors.keywords"
        label="Keywords"
        variant="outlined"
      />

    </v-form>
  </template>

  <template #footer>
    <div class="flex gap-sm">
      <Button
        v-if="store.updateProductItem?.variantCombinations"
        color="gray"
        :label="`${store.updateProductItem?.variantCombinations.length ? 'Sửa biến thể':'Thêm biến thể'}`"
        class="w-full"
        @click.prevent="store.handleTogglePopupAddVariant(true)"
      />
      <Button @click="handleSubmitUpdate" color="primary" label="Cập nhật" class="w-full"/>
    </div>
  </template>
</Popup>

<!-- <Popup v-model="store.isTogglePopupUpdate" footerFixed popupHeading="Sua san pham" align="right">
  <template #body>
    <v-form @submit.prevent="handleSubmitUpdate">

        <LabelInput label="Ten san pham" required/>
        <v-text-field v-model="store.updateProductItem.productName" :counter="100" :error="!!formErrors.productName"
        :error-messages="formErrors.productName" label="Ten san pham" variant="outlined" required></v-text-field>
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
      <Button v-if="store.updateProductItem?.variantCombinations" color="gray" :label="`${store.updateProductItem?.variantCombinations.length ? 'Sua bien the':'Them bien the'}`" class="w-full" @click.prevent="store.handleTogglePopupAddVariant(true)" />
      <Button @click="handleSubmitUpdate" color="primary" label="Cap nhat" class="w-full" />
    </div>
  </template>
</Popup> -->
</template>
