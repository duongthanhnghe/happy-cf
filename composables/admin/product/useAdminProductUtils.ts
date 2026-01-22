import type { CategoryProductDTO, CreateProductDTO, ProductDTO, UpdateProductDTO } from '@/server/types/dto/v1/product.dto';
import { unref, type Ref } from 'vue';
type MaybeRef<T> = T | Ref<T>;

export const useAdminProductUtils = (
  defaultForm: object,
  formProductItem: MaybeRef<CreateProductDTO>,
  updateProductItem: MaybeRef<UpdateProductDTO>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  isTogglePopupAddVariant: Ref<boolean>,
  selectedCategory: Ref<CategoryProductDTO[]>,
  selectedCategoryName: Ref<string[]>,
  fetchCategoryListTree: () => void,
) => {
  
  const handleTogglePopupAdd = (value: boolean) => {
    handleReset()
    const realUpdateItem = unref(updateProductItem);
    realUpdateItem.id = ''
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value: boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const handleReset = () => {
    Object.assign(formProductItem, defaultForm)
    Object.assign(updateProductItem, defaultForm)

    selectedCategory.value = []
    selectedCategoryName.value = []
    fetchCategoryListTree()
  }

  const handleTogglePopupAddVariant = (value: boolean) => {
    isTogglePopupAddVariant.value = value;
  };

  const getTotalVariantStock = (item: ProductDTO) => {
    if (item.variantCombinations.length === 0) return item.amount

    return item.variantCombinations.reduce(
      (sum: number, vc: any) => sum + (vc.stock || 0),
      0
    )
  }

  return {
    handleTogglePopupAdd,
    handleTogglePopupAddVariant,
    handleTogglePopupUpdate,
    handleReset,
    getTotalVariantStock,
  };
};