import { ref, reactive, computed, watch, watchEffect } from "vue";
import { defineStore } from "pinia";
import { productsAPI } from "@/services/product.service";
import { Loading } from '@/utils/global'
import type { ProductDTO, CategoryProductDTO, CreateProductDTO, UpdateProductDTO, OptionDTO } from '@/server/types/dto/product.dto'
import type { TableOpt, TableHeaders } from '@/server/types/dto/table-vuetify.dto'
import { useProductAll } from '@/composables/product/useProductAll'
import { useProductCategory } from '@/composables/product/useProductCategory'
import { useProductDetail } from '@/composables/product/useProductDetail'
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import { useFileManageFolderStore } from '@/stores/file-manage/useFileManageStore'
import { useCategoryManageStore } from '@/stores/product/useCategoryManageStore'
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";

export const useProductManageStore = defineStore("ProductManage", () => {

const { getListProductAll, fetchListProductAll } = useProductAll()
const { getListCategoryAll, fetchCategoryList } = useProductCategory()
const { getDetailProduct, fetchDetailProduct } = useProductDetail()
const storeFileManage = useFileManageFolderStore();
const storeCategory = useCategoryManageStore();

//state global  
const valid = ref(false)
const validOptions = ref(false)
const itemsCategory = ref<CategoryProductDTO[]|null>([]);
const productNameRules = [
  (value:string) => {
    if (value) return true
    return 'Ten khong duoc trong'
  },
  (value:string) => {
    if (value?.length <= 100) return true
    return 'Ten khong duoc qua 100 ky tu'
  },
  (value:string) => {
    const regex = /^[\p{L}0-9\s]+$/u
    if (regex.test(value)) return true
    return 'Ten khong duoc chua ky tu dac biet'
  }
]

const productNumberRules = [
  (value: number) => {
    if (value) return true
    return 'Noi dung khong duoc trong'
  },
]

const productPriceDiscountRules = [
  (value: number) => {
    if (value) return true
    return 'Gia khuyen mai khong duoc trong'
  },
  (value: number) => {
    const discount = Number(value)
    const price = Number(formProductItem.price)
    if (discount <= price) return true
    return 'Gia khuyen mai khong duoc lon hon gia goc'
  },
]

const productPriceDiscountUpdateRules = [
  (value: number) => {
    if (value) return true
    return 'Gia khuyen mai khong duoc trong'
  },
  (value: number) => {
    const discount = Number(value)
    const price = Number(updateProductItem.price)
    if (discount <= price) return true
    return 'Gia khuyen mai khong duoc lon hon gia goc'
  },
]

const optionNameRules = [
  (value: string) => {
    if (value) return true
    return 'Ten nhom bien the khong duoc trong'
  },
]

const variantNameRules = [
  (value: string) => {
    if (value) return true
    return 'Ten bien the khong duoc trong'
  },
]

const priceModifierRules = [
  (value: number) => {
    if (value) return true
    return 'Gia khong duoc trong'
  },
]

const formProductItem = reactive<CreateProductDTO>({
  productName: '',
  description: '',
  summaryContent: '',
  price: 0,
  priceDiscounts: 0,
  amount: 0,
  image: '',
  listImage: [],
  options: [],
  categoryId: '',
  isActive: false
});

const updateProductItem = reactive<UpdateProductDTO>({
  id: '',
  productName: '',
  description: '',
  summaryContent: '',
  price: 0,
  priceDiscounts: 0,
  amount: 0,
  amountOrder: 0,
  image: '',
  listImage: [],
  options: [],
  categoryId: '',
  isActive: false
});

//state list
const dataListProduct = ref<ProductDTO[]|null>(null);
const itemsPerPage = 10
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Hinh anh', key: 'image', sortable: false, },
    { title: 'Ten san pham', key: 'productName', sortable: false, },
    { title: 'Gia goc', key: 'price', sortable: false, },
    { title: 'Gia khuyen mai', key: 'priceDiscounts', sortable: false, },
    { title: 'So luong', key: 'amount', sortable: false, },
    { title: 'Bien the', key: 'options', sortable: false, },
    {
      title: 'Danh muc',
      sortable: false,
      key: 'categoryId',
    },
    { title: 'Tinh trang', key: 'isActive', sortable: false, },
    { title: '', key: 'actions', sortable: false },
  ])
  const serverItems = ref<ProductDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const name = ref<string|null>('')
  const search = ref<string>('')
  const categorySelectedFilter = ref<string|null>('')
  const currentTableOptions = ref<TableOpt>({
  page: 1,
  itemsPerPage: itemsPerPage,
  sortBy: [],
})
const isTogglePopupUpdate = ref<boolean>(false);
const detailData = ref<ProductDTO|null>(null);
const isTogglePopupAdd = ref<boolean>(false);
const isTogglePopupAddVariant = ref<boolean>(false);
const checkSelectImage = ref<boolean>(true)

const getListAllProduct = async () => {
  await fetchListProductAll()
  if(getListProductAll.value) dataListProduct.value = getListProductAll.value
}

const ListAllProductApi = {
  async fetch ({ page, itemsPerPage, sortBy, search, filterCategory }: { page: number, itemsPerPage: number, sortBy: TableOpt['sortBy'], search: { productName: string|null }, filterCategory: string|null }) {
    return new Promise(resolve => {

      setTimeout(() => {
        const start = (page - 1) * itemsPerPage
        const end = start + itemsPerPage
        const items = dataListProduct.value?.slice().filter(item => {
          if (search.productName && !item.productName.toLowerCase().includes(search.productName.toLowerCase())) {
            return false
          } 
          if (filterCategory && item.categoryId?.toString() !== filterCategory ) {
            return false
          }
          else {
            return true
          }
        })
        if (sortBy.length) {
          const sortKey = sortBy[0].key
          const sortOrder = sortBy[0].order
          items?.sort((a:any, b:any) => {
            const aValue = a[sortKey]
            const bValue = b[sortKey]
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
          })
        }
        const paginated = items?.slice(start, end === -1 ? undefined : end)
        resolve({ items: paginated, total: items?.length })
      }, 500)
    })
  },
}
  
async function loadItemsProduct(opt: TableOpt ) {
  loadingTable.value = true;

  await getListAllProduct();

  const { items, total } = await ListAllProductApi.fetch({ page: opt.page, itemsPerPage: opt.itemsPerPage, sortBy: opt.sortBy, search: { productName: name.value }, filterCategory: categorySelectedFilter.value }) as { items: ProductDTO[], total: number };
    serverItems.value = items;
    totalItems.value = total;
    loadingTable.value = false;
  }

  watch(name, () => {
    search.value = String(Date.now())
  })

  watch(categorySelectedFilter, () => {
    loadItemsProduct(currentTableOptions.value);
  })

  watch(dataListProduct, (newVal) => {
    dataListProduct.value = newVal;
  })

  const handleTogglePopupAdd = (value: boolean) => {
    updateProductItem.id = ''
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value: boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const getCategoryName = (id: string) => {
    if (!itemsCategory.value) return;
    return itemsCategory.value.find(item => item.id === id)
  }

  const handleResetFormProductItem = () => {
    formProductItem.productName = '',
    formProductItem.description = '',
    formProductItem.summaryContent = '',
    formProductItem.price = 0,
    formProductItem.priceDiscounts = 0,
    formProductItem.amount = 0,
    formProductItem.image = '',
    formProductItem.listImage = [],
    formProductItem.options = [],
    formProductItem.categoryId = ''
    formProductItem.isActive = false
  }

  const handleReload = async () => {
    await loadItemsProduct(currentTableOptions.value);
  }

  // actions add
  async function submitCreate() {
    Loading(true);
    try {

      const parseNumberOption = formProductItem.options.map(items => ({
        ...items,
        variants: items.variants.map(variantItem => ({
          ...variantItem,
          priceModifier: Number(variantItem.priceModifier)
        }))
      }));

      const newProduct = {
        productName: formProductItem.productName,
        description: formProductItem.description,
        summaryContent: formProductItem.summaryContent,
        price: Number(formProductItem.price),
        priceDiscounts: Number(formProductItem.priceDiscounts),
        amount: Number(formProductItem.amount),
        image: formProductItem.image,
        listImage: formProductItem.listImage,
        options: parseNumberOption,
        isActive: formProductItem.isActive,
        categoryId: formProductItem.categoryId
      }

      const data = await productsAPI.create(newProduct)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupAdd.value = false;
        handleResetFormProductItem()
        handleReload()
      } else showWarning(data.message ?? '')
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

    const handleEditProduct = async (productId: string) => {
      if(!productId) return
      await fetchDetailProduct(productId)
      if(getDetailProduct.value) detailData.value = getDetailProduct.value
      if(!detailData.value) return
      handleTogglePopupUpdate(true)

      const {
        id,
        productName,
        description,
        summaryContent,
        price,
        priceDiscounts,
        amount,
        amountOrder,
        image,
        listImage,
        options,
        isActive,
        categoryId
      } = detailData.value

      Object.assign(updateProductItem, {
        id,
        productName,
        description,
        summaryContent,
        price,
        priceDiscounts,
        amount,
        amountOrder,
        image,
        listImage,
        options,
        isActive,
        categoryId
      })
    }

  async function submitUpdate() {
    Loading(true);
    try {
      if(updateProductItem.options != null){
        updateProductItem.options = updateProductItem.options.map(items => ({
          ...items,
          variants: items.variants.map(variantItem => ({
            ...variantItem,
            priceModifier: Number(variantItem.priceModifier)
          }))
        }));
      }

      const newProduct = {...updateProductItem}

      if(updateProductItem.id == '' && !updateProductItem.id) return

      const data = await productsAPI.update(updateProductItem.id, newProduct)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupUpdate.value = false;
        handleResetFormProductItem()
        handleReload()
      } else showWarning(data.message ?? '')
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return

    Loading(true);
    try {
      const data = await productsAPI.delete(productId)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        if(dataListProduct.value){
          dataListProduct.value = dataListProduct.value.filter(item => 
            item.id !== productId
          )
        }
        handleReload()
      } else showWarning(data.message ?? '')
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  // doi kich hoat
  const { toggleActive } = useToggleActiveStatus(productsAPI.toggleActive, serverItems );

  const handleAddImage = () => {
    storeFileManage.handleTogglePopup(true)
  }

  const handleDeleteListImage = (id: string, formAdd: boolean) => {
    if (formAdd) {
      formProductItem.listImage = formProductItem.listImage?.filter(item => item.id !== id)
    } else {
      updateProductItem.listImage = updateProductItem.listImage?.filter(item => item.id !== id)
    }
  }

  const handleAddListImage = () => {
    checkSelectImage.value = false
    storeFileManage.handleTogglePopup(true)
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return

    const target = updateProductItem.id ? updateProductItem : formProductItem

    if (checkSelectImage.value) {
      target.image = newValue.url
    } else {
      target.listImage?.push({ id: newValue.id, src: newValue.url })
      checkSelectImage.value = true
    }
  })

  //action options
  const handleTogglePopupAddVariant = (value: boolean) => {
    isTogglePopupAddVariant.value = value;
  };

  const handleAddOptionGroup = () => {
    let formItemType : OptionDTO[] = formProductItem.options
    if(updateProductItem.id != '' && updateProductItem.options) formItemType = updateProductItem.options

    const groupId = `GROUP${formItemType.length + 1}`
    formItemType.push({
      id: groupId,
      name: '',
      required: true,
      variants: [
        {
          id: `${groupId}VARIANT1`,
          name: '',
          priceModifier: 0,
          inStock: true
          }
          ]
    })
  }

  const handleAddVariant = (index: number) => {
    let formItemType: OptionDTO[] = formProductItem.options
    if(updateProductItem.id != '' && updateProductItem.options) formItemType = updateProductItem.options

    const groupId = `${formItemType[index].id}`
    const itemId = `VARIANT${formItemType[index].variants.length + 1}`
    formItemType[index].variants.push({
      id: `${groupId}${itemId}`,
      name: '',
      priceModifier: 0,
      inStock: true
    })
  }

  const handleRemoveOptionGroup = (index: number) => {
    let formItemType: OptionDTO[] = formProductItem.options
    if(updateProductItem.id != '' && updateProductItem.options) formItemType = updateProductItem.options

    formItemType.splice(index, 1)
  }

  const handleRemoveVariant = (groupId: string,itemId: string) => {
    let formItemType: OptionDTO[] = formProductItem.options
    if(updateProductItem.id != '' && updateProductItem.options) formItemType = updateProductItem.options

    const index = formItemType.find(option =>
    option.id === groupId
    )
    if(index){
      const variantItem = index.variants.findIndex(item =>
      item.id === itemId
      )
      index.variants.splice(variantItem, 1)
    } else {
      console.log('khong ton tai index nhom bien the');
    }
  }

  const handleSubmitCreateOption = async () => {
    isTogglePopupAddVariant.value = false;
  }

  const openPopupAddCategory = () => {
    storeCategory.handleResetFormCategoryItem()
    storeCategory.handleTogglePopupAdd(true)
  }

  watchEffect( async () => {
    if (itemsCategory.value && itemsCategory.value.length === 0) {
      await fetchCategoryList()
      if(getListCategoryAll.value) itemsCategory.value = getListCategoryAll.value
    }
  })

  //getters
  const getItemsCategory = computed(() => itemsCategory.value);
  const getListImageAdd = computed(() => formProductItem.listImage);

  return {
    // state
    valid,
    validOptions,
    dataListProduct,
    itemsCategory,
    isTogglePopupAdd,
    isTogglePopupAddVariant,
    isTogglePopupUpdate,
    productNameRules,
    productNumberRules,
    productPriceDiscountRules,
    productPriceDiscountUpdateRules,
    detailData,
    formProductItem,
    updateProductItem,
    serverItems,
    loadingTable,
    totalItems,
    name,
    search,
    itemsPerPage,
    headers,
    currentTableOptions,
    optionNameRules,
    variantNameRules,
    priceModifierRules,
    categorySelectedFilter,
    // actions
    handleTogglePopupAdd,
    handleTogglePopupAddVariant,
    handleTogglePopupUpdate,
    handleEditProduct,
    handleDeleteProduct,
    getListAllProduct,
    loadItemsProduct,
    submitCreate,
    submitUpdate,
    handleReload,
    handleResetFormProductItem,
    handleAddOptionGroup,
    handleAddVariant,
    handleRemoveOptionGroup,
    handleRemoveVariant,
    handleSubmitCreateOption,
    getCategoryName,
    handleDeleteListImage,
    handleAddListImage,
    openPopupAddCategory,
    handleAddImage,
    toggleActive,
    //getters
    getItemsCategory,
    getListImageAdd,
  };
});
