import type { CategoryProductDTO, CreateProductDTO, ProductDTO, ProductImportDTO, ProductImportItemDTO, ProductImportTableItem, UpdateProductDTO } from '@/server/types/dto/v1/product.dto';
import { reactive, ref } from 'vue';
import type { TableHeaders, TableOpt } from "@/server/types";

export const useAdminProductState = () => {

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
    variantGroups: [],
    variantCombinations: [],
    categoryId: '',
    weight: 0,
    sku: '',
    isActive: false,
    // SEO
    titleSEO: '',
    descriptionSEO: '',
    slug: '',
    keywords: []
  };
  const formProductItem = reactive<CreateProductDTO>({ ...defaultForm })
  const updateProductItem = reactive<UpdateProductDTO>({ ...defaultForm, id: ''})
  const selectedIdsDelete = ref<string[]>([])
  const selectedCategory = ref<CategoryProductDTO[]>([])
  const selectedCategoryName = ref<string[]>([])
  const dataList = ref<ProductDTO[]|null>(null);
  const headers = ref<TableHeaders[]>([
      { title: 'STT', key: 'index', sortable: false, headerProps: { class: 'white-space min-width-100' }, cellProps: { class: 'white-space min-width-100' }},
      { title: 'Hình ảnh', key: 'image', sortable: false, headerProps: { class: 'white-space min-width-200' }, cellProps: { class: 'white-space min-width-200' }},
      { title: 'Tên sản phẩm', key: 'productName', sortable: false, },
      { title: 'Giá gốc', key: 'price', sortable: false, },
      { title: 'Giá khuyến mãi', key: 'priceDiscounts', sortable: false, },
      { title: 'Tồn kho', key: 'amount', sortable: false, },
      { title: 'Lượt bán', key: 'amountOrder', sortable: false, },
      { title: 'Biến thể', key: 'variantGroups', sortable: false, },
      {
        title: 'Danh mục',
        sortable: false,
        key: 'category',
      },
      { title: 'Tình trạng', key: 'isActive', sortable: false, },
      { title: 'SKU', key: 'sku', sortable: false, },
      { title: '', key: 'actions', sortable: false , headerProps: { class: 'v-data-table-sticky-cl-right' },
      cellProps: { class: 'v-data-table-sticky-cl-right' }},
    ])
  const serverItems = ref<ProductDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const search = ref<string>('')
  const searchInput = ref<string>('')
  const categorySelectedFilter = ref<string>('')
  const itemsPerPage = 50
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

  //for import
  const isTogglePopupImport = ref<boolean>(false);
  const headersImport = [
    { title: "STT", key: "rowIndex",sortable: false,},
    { title: "Trạng thái", key: "status",sortable: false,},
    { title: 'Hình ảnh', key: 'image',sortable: false,},
    { title: "Tên sản phẩm", key: "productName",sortable: false,},
    { title: 'Giá gốc', key: 'price',sortable: false, },
    { title: 'Giá khuyến mãi', key: 'priceDiscounts',sortable: false, },
    { title: 'Tồn kho', key: 'amount', sortable: false, },
    { title: "Category ID", key: "categoryId"},
    { title: 'SKU', key: 'sku', sortable: false, },
    { title: 'Tình trạng', key: 'isActive', sortable: false, },
    { title: 'Cân nặng', key: 'weight', sortable: false, },
    { title: "Ghi chú", key: "message"},
  ];
  const serverItemsImport = ref<ProductImportTableItem[]>([])
  const totalItemsImport = ref<number>(0)
  const loadingTableImport = ref<boolean>(false)
  const selectedImportFile = ref<File | null>(null);
  const dataImport = ref<ProductImportDTO|null>(null)
  const currentTypeImport = ref<'import' | 'updateImport'>('import')
  
  return {
    defaultForm,
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
    search,
    headers,
    currentTableOptions,
    categorySelectedFilter,
    selectedCategoryName,
    selectedCategory,
    checkSelectImage,
    headersImport,
    serverItemsImport,
    totalItemsImport,
    loadingTableImport,
    isTogglePopupImport,
    selectedImportFile,
    dataImport,
    currentTypeImport,
    selectedIdsDelete,
    itemsPerPage,
    searchInput,
  };
};