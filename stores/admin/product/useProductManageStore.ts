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
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useCategoryManageStore } from '@/stores/admin/product/useCategoryManageStore'
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { nullRules, nullAndSpecialRules } from '@/utils/validation'
import { useSeoWatchers } from "@/utils/seoHandle";

export const useProductManageStore = defineStore("ProductManage", () => {

const { getListProductAll, fetchListProductAll } = useProductAll()
const { getListCategoryAll, fetchCategoryList } = useProductCategory()
const { getDetailProduct, fetchDetailProduct } = useProductDetail()
const storeFileManage = useFileManageFolderStore();
const storeCategory = useCategoryManageStore();

//state global  
const validOptions = ref(false)

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

const defaultForm: CreateProductDTO = {
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
  isActive: false,
  // SEO
  titleSEO: '',
  descriptionSEO: '',
  slug: '',
  keywords: []
};

const formProductItem = reactive<CreateProductDTO>({ ...defaultForm })

const updateProductItem = reactive<UpdateProductDTO>({ ...defaultForm, id: ''})

//state list
const dataList = ref<ProductDTO[]|null>(null);
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
  const name = ref<string>('')
  const search = ref<string>('')
  const categorySelectedFilter = ref<string>()
  const currentTableOptions = ref<TableOpt>({
  page: 1,
  itemsPerPage: 20,
  sortBy: [],
})
const isTogglePopupUpdate = ref<boolean>(false);
const detailData = ref<ProductDTO|null>(null);
const isTogglePopupAdd = ref<boolean>(false);
const isTogglePopupAddVariant = ref<boolean>(false);
const checkSelectImage = ref<boolean>(true)

  const getListAllProduct = async () => {
    await fetchListProductAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage)
   
    if(!getListProductAll.value) return
    dataList.value = getListProductAll.value.data
    totalItems.value = getListProductAll.value.pagination.total
    currentTableOptions.value.page = getListProductAll.value.pagination.page
    currentTableOptions.value.itemsPerPage = getListProductAll.value.pagination.limit
  }

  const ListDataApi = {
    async fetch({ items, sortBy, search, filterCategory }: {
      items: ProductDTO[],
      sortBy: TableOpt["sortBy"],
      search: { productName: string },
      filterCategory?: string
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()

          if (search.productName) {
            filtered = filtered.filter(item =>
              item.productName.toLowerCase().includes(search.productName.toLowerCase())
            )
          }
          if (filterCategory) {
            filtered = filtered.filter(item => item.categoryId === filterCategory)
          }

          resolve({ items: filtered })
        }, 200)
      })
    },
  }

  async function loadItems(opt: TableOpt) {
    loadingTable.value = true

    await getListAllProduct()

    const { items } = await ListDataApi.fetch({
      items: dataList.value || [],
      sortBy: opt.sortBy,
      search: { productName: name.value },
      filterCategory: categorySelectedFilter.value
    }) as { items: ProductDTO[] }

    serverItems.value = items
    if(getListProductAll.value) totalItems.value = getListProductAll.value.pagination.total

    loadingTable.value = false
  }

  watch([name,categorySelectedFilter], () => {
    loadItems(currentTableOptions.value);
  })

  watch(() => [currentTableOptions.value.page,currentTableOptions.value.itemsPerPage], () => {
    loadItems(currentTableOptions.value);
  })

  const handleTogglePopupAdd = (value: boolean) => {
    updateProductItem.id = ''
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value: boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const getCategoryName = (id: string) => {
    if (!getListCategoryAll.value) return;
    return getListCategoryAll.value.find(item => item.id === id)
  }

  const handleReset = () => {
    Object.assign(formProductItem, defaultForm)
    Object.assign(updateProductItem, defaultForm)
  }

  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
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
        ...formProductItem,
        price: Number(formProductItem.price),
        priceDiscounts: Number(formProductItem.priceDiscounts),
        options: parseNumberOption
      }

      const data = await productsAPI.create(newProduct)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupAdd.value = false;
        handleReset()
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
    Object.assign(updateProductItem, detailData.value);
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
        handleReset()
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
        if(dataList.value){
          dataList.value = dataList.value.filter(item => 
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

  // SEO
  useSeoWatchers(formProductItem, { sourceKey: 'productName', autoSlug: true, autoTitleSEO: true })
  useSeoWatchers(updateProductItem, { sourceKey: 'productName', autoSlug: true, autoTitleSEO: true })

  watch(() => getListCategoryAll.value, async (newValue) => {
    if(newValue.length === 0) await fetchCategoryList()
  }, { immediate: true })


  //getters
  const getItemsCategory = computed(() => getListCategoryAll.value);
  const getListImageAdd = computed(() => formProductItem.listImage);

  return {
    nullRules,
    nullAndSpecialRules,
    validOptions,
    dataList,
    isTogglePopupAdd,
    isTogglePopupAddVariant,
    isTogglePopupUpdate,
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
    headers,
    currentTableOptions,
    categorySelectedFilter,
    // actions
    handleTogglePopupAdd,
    handleTogglePopupAddVariant,
    handleTogglePopupUpdate,
    handleEditProduct,
    handleDeleteProduct,
    getListAllProduct,
    loadItems,
    submitCreate,
    submitUpdate,
    handleReload,
    handleReset,
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
