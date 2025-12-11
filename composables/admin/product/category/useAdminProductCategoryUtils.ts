import type { CategoryProductDTO, CreateCategoryProductDTO, UpdateCategoryProductDTO } from '@/server/types/dto/v1/product.dto';
import { unref, type Ref } from 'vue';
type MaybeRef<T> = T | Ref<T>;

export const useAdminProductCategoryUtils = (
  defaultForm: object,
  formCategoryItem: MaybeRef<CreateCategoryProductDTO>,
  updateCategoryItem: MaybeRef<UpdateCategoryProductDTO>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  selectedCategory: Ref<CategoryProductDTO[]>,
  selectedCategoryName: Ref<string[]>,
  fetchCategoryListTree: () => void,
) => {
  
  const handleTogglePopupAdd = (value: boolean) => {
    handleResetFormCategoryItem()
    const realUpdateItem = unref(updateCategoryItem);
    realUpdateItem.id = ''
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value: boolean) => {
    handleResetFormCategoryItem()
    isTogglePopupUpdate.value = value;
  };

  const handleResetFormCategoryItem = () => {
    Object.assign(formCategoryItem, defaultForm)
    Object.assign(updateCategoryItem, defaultForm)

    selectedCategory.value = []
    selectedCategoryName.value = []
    fetchCategoryListTree()
  }

  return {
   handleTogglePopupAdd,
   handleTogglePopupUpdate,
   handleResetFormCategoryItem,
  };
};