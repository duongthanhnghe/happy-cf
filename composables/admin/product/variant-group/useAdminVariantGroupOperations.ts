import { showWarning, showConfirm, showSuccess } from "@/utils/toast";
import type { CreateVariantGroupDTO, UpdateVariantGroupDTO, VariantGroupDTO } from '@/server/types/dto/v1/product.dto';
import { unref, type Ref } from 'vue';
import type { TableOpt } from "@/server/types";
import { Loading } from "@/utils/global";
import { variantGroupAPI } from "@/services/v1/admin/variant-group.service";
import { useTableUtils } from "@/composables/utils/useTableSearch";
type MaybeRef<T> = T | Ref<T>;

export const useAdminVariantGroupOperations = (
  defaultForm: CreateVariantGroupDTO,
  formItem: MaybeRef<CreateVariantGroupDTO>,
  updateItem: MaybeRef<UpdateVariantGroupDTO>,
  dataList: Ref<VariantGroupDTO[] | null>,
  serverItems: Ref<VariantGroupDTO[]>,
  loadingTable: Ref<Boolean>,
  totalItems: Ref<Number>,
  search: Ref<string>,
  searchInput: Ref<string>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  currentTableOptions: Ref<TableOpt>,
  detailData: Ref<VariantGroupDTO|null>,
) => {

const handleTogglePopupAdd = (value: boolean) => {
    handleResetFormItem()
    unref(updateItem).id = ''
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

          if (search) {
            items = items?.filter(item =>
              item.groupName.toLowerCase().includes(search.toLowerCase())
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
      search: search.value
    }) as { items: VariantGroupDTO[], total: number }

    serverItems.value = items;
    totalItems.value = total;
    loadingTable.value = false;
  }

  async function submitCreate() {
    Loading(true);
    try {
      const newItem = unref(formItem);

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
      const newItem = unref(updateItem);

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

  const { handleSearch } = useTableUtils(search, searchInput );

  const addVariant = (target: 'form' | 'update' = 'form') => {
    const variant = {
      id: crypto.randomUUID(),
      name: '',
      isActive: true
    };

    if (target === 'form') unref(formItem).variants.push(variant);
    else if (target === 'update') unref(updateItem).variants?.push(variant);
  }

  const removeVariant = (index: number, target: 'form' | 'update' = 'form') => {
    if (target === 'form') unref(formItem).variants.splice(index, 1);
    else if (target === 'update') unref(updateItem).variants?.splice(index, 1);
  }

  return {
    handleTogglePopupAdd,
    handleTogglePopupUpdate,
    handleEditVariant,
    handleDeleteVariant,
    loadItemsVariant,
    submitCreate,
    submitUpdate,
    handleReload,
    handleResetFormItem,
    getListAllVariantGroup,
    addVariant,
    removeVariant,
    handleSearch,
  };
};