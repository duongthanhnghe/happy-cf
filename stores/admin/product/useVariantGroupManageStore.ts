import { ref, reactive, watch } from "vue";
import { defineStore } from "pinia";
import type { VariantGroupDTO, CreateVariantGroupDTO, UpdateVariantGroupDTO } from '@/server/types/dto/v1/product.dto'
import { variantGroupAPI } from "@/services/v1/admin/variant-group.service";
import { showSuccess, showWarning, showConfirm } from "@/utils/toast";
import { Loading } from '@/utils/global'
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";

export const useVariantGroupStore = defineStore("VariantGroupManage", () => {

  const dataList = ref<VariantGroupDTO[] | null>(null);
  const serverItems = ref<VariantGroupDTO[]>([])
  const totalItems = ref<number>(0)
  const loadingTable = ref<boolean>(true)

  const defaultForm: CreateVariantGroupDTO = {
    groupName: "",
    groupType: "",
    description: "",
    icon: "",
    isActive: true,
    hasImage: false,
    variants: []
  };

  const formItem = reactive<CreateVariantGroupDTO>({ ...defaultForm })
  const updateItem = reactive<UpdateVariantGroupDTO>({ ...defaultForm, id: '' })

  const detailData = ref<VariantGroupDTO | null>(null);
  const isTogglePopupAdd = ref<boolean>(false);
  const isTogglePopupUpdate = ref<boolean>(false);

  const itemsPerPage = 10;
  const search = ref<string>("");
  const name = ref<string>("");
  const headers = ref([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Tên nhóm biến thể', key: 'groupName', sortable: false },
    { title: 'Loại', key: 'groupType', sortable: false },
    { title: 'Icon hiển thị', key: 'icon', sortable: false },
    { title: 'Mô tả', key: 'description', sortable: false },
    { title: 'Biến thể', key: 'variants', sortable: false },
    { title: 'Ảnh biến thể', key: 'hasImage', sortable: false },
    { title: 'Trạng thái', key: 'isActive', sortable: false },
    { title: '', key: 'actions', sortable: false },
  ])

  const currentTableOptions = ref({
    page: 1,
    itemsPerPage: itemsPerPage,
    sortBy: [],
  })

  const handleTogglePopupAdd = (value: boolean) => {
    handleResetFormItem()
    updateItem.id = ''
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value: boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const handleResetFormItem = () => {
    Object.assign(formItem, defaultForm)
    Object.assign(updateItem, defaultForm)
  }

  const handleReload = async () => {
    await loadItemsVariant(currentTableOptions.value);
  }

  const getListAllVariantGroup = async () => {
    const res = await variantGroupAPI.getAll()
    if (res.code === 0) dataList.value = res.data
  }

  const ListAllVariantApi = {
    async fetch ({ page, itemsPerPage, sortBy, search }: any) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          let items = dataList.value?.slice()

          if (search.name) {
            items = items?.filter(item =>
              item.groupName.toLowerCase().includes(search.name.toLowerCase())
            )
          }

          const paginated = items?.slice(start, end)
          resolve({ items: paginated, total: items?.length })
        }, 400)
      })
    },
  }

  async function loadItemsVariant(opt: any) {
    loadingTable.value = true;

    await getListAllVariantGroup();

    const {items, total} = await ListAllVariantApi.fetch({
      page: opt.page,
      itemsPerPage: opt.itemsPerPage,
      sortBy: opt.sortBy,
      search: { name: name.value }
    }) as { items: VariantGroupDTO[], total: number }

    serverItems.value = items;
    totalItems.value = total;
    loadingTable.value = false;
  }

  watch(name, () => {
    search.value = String(Date.now())
  })

  async function submitCreate() {
    Loading(true);
    try {
      const newItem = { ...formItem }
      const data = await variantGroupAPI.create(newItem)
      if(data.code === 0) {
        showSuccess(data.message ?? '')
        isTogglePopupAdd.value = false;
        handleResetFormItem()
        handleReload()
      } else showWarning(data.message ?? '')
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleEditVariant = async (id: string) => {
    if(!id) return

    const res = await variantGroupAPI.getById(id)
    if (res.code === 0) detailData.value = res.data
    else return

    handleTogglePopupUpdate(true);

    Object.assign(updateItem, detailData.value);
  }

  async function submitUpdate() {
    Loading(true);
    try {
      const newItem = { ...updateItem }

      const data = await variantGroupAPI.update(newItem.id, newItem)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupUpdate.value = false;
        handleResetFormItem()
        handleReload()
      } else showWarning(data.message ?? '')
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleDeleteVariant = async (id: string) => {
    const confirmed = await showConfirm('Bạn có chắc xoá nhóm này?')
    if (!confirmed) return

    Loading(true);
    try {
      const data = await variantGroupAPI.delete(id)
      if(data.code === 1) showWarning(data.message ?? '')
      else {
        if(dataList.value){
          dataList.value = dataList.value.filter(item => 
            item.id !== id
          )
        }
        handleResetFormItem()
        handleReload()
        showSuccess(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const addVariant = (target: 'form' | 'update' = 'form') => {
    const variant = {
      id: crypto.randomUUID(),
      name: '',
      isActive: true
    };

    if (target === 'form') formItem.variants.push(variant);
    else if (target === 'update') updateItem.variants?.push(variant);
  }

  const removeVariant = (index: number, target: 'form' | 'update' = 'form') => {
    if (target === 'form') formItem.variants.splice(index, 1);
    else if (target === 'update') updateItem.variants?.splice(index, 1);
  }

  const { toggleActive } = useToggleActiveStatus(variantGroupAPI.toggleActive, serverItems );

  return {
    dataList,
    serverItems,
    loadingTable,
    totalItems,
    name,
    search,
    itemsPerPage,
    headers,
    currentTableOptions,

    formItem,
    updateItem,
    detailData,

    isTogglePopupAdd,
    isTogglePopupUpdate,

    handleTogglePopupAdd,
    handleTogglePopupUpdate,
    handleEditVariant,
    handleDeleteVariant,
    loadItemsVariant,
    submitCreate,
    submitUpdate,
    handleReload,
    handleResetFormItem,
    toggleActive,
    getListAllVariantGroup,
    addVariant,
    removeVariant,
  };
});
