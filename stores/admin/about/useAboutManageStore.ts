import { ref, reactive, computed, watch } from "vue";
import { defineStore } from "pinia";
import { aboutAPI } from "@/services/v1/admin/about.service";
import {
  Loading
} from '@/utils/global'
import type { AboutDTO, CreateAboutBody } from '@/server/types/dto/v1/about.dto'
import type { TableOpt, TableHeaders } from '@/server/types/dto/v1/table-vuetify.dto'
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useFileSelectContextStore } from "@/stores/admin/file-manage/useFileSelectContextStore"
import { FOLDER_UPLOAD } from '@/shared/constants/folder-upload';
import { useChangeOrder } from "@/composables/utils/useChangeOrder";
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";


export const useAboutManageStore = defineStore("AboutManage", () => {
const storeFileManage = useFileManageFolderStore()
const contextStore = useFileSelectContextStore()

const folderName = FOLDER_UPLOAD.ABOUT
const valid = ref<boolean>(false)
const titleRules = [
  (v: string) => !!v || 'Tieu de khong duoc trong',
  (v: string) => v.length <= 200 || 'Tieu de khong duoc qua 200 ky tu',
  (v: string) => /^[\p{L}0-9\s]+$/u.test(v) || 'Tieu de khong duoc chua ky tu dac biet',
]

const formItem = reactive<CreateAboutBody>({
  title: '', description: '', summaryContent: '', image: '', isActive: false, listImage: [],
})

//state list
const dataListCategory = ref<AboutDTO[] | null>(null)
const maxOrder = ref<number>(0)
const itemsPerPage = 10
const headers = ref<TableHeaders[]>([
  { title: 'STT',        key: 'index',       sortable: false },
  { title: 'Hinh anh',   key: 'image',       sortable: false },
  { title: 'Tieu de',    key: 'title',       sortable: false },
  { title: 'Mo ta',   key: 'summaryContent', sortable: false },
  { title: 'Kich hoat',  key: 'isActive',    sortable: false },
  { title: '',           key: 'actions',     sortable: false },
])
const serverItems = ref<AboutDTO[]>([])
const loadingTable = ref<boolean>(true)
const totalItems = ref<number>(0)
const name = ref<string>('')
const search = ref<string>('')

const currentTableOptions = reactive<TableOpt>({
  page: 1, itemsPerPage: itemsPerPage, sortBy: [],
})

const isTogglePopupUpdate = ref<boolean>(false)
const detailData = ref<{ data: AboutDTO } | null>(null)
const isTogglePopupAdd = ref<boolean>(false)
const checkSelectImage = ref<boolean>(true)

//actions list
  const getListData = async () => {
    const data = await aboutAPI.getAll()
    if(data.code === 0) dataListCategory.value = data.data
  }

  const ListAllCategoryApi = {
    async fetch ({
      page, itemsPerPage, sortBy,
      search,
    }: { page: number; itemsPerPage: number; sortBy: any[]; search: { title: string } })
    : Promise<{ items: AboutDTO[]; total: number }> {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end   = start + itemsPerPage
          const items = (dataListCategory.value ?? []).slice().filter(item => {
            if (search.title && !item.title.toLowerCase().includes(search.title.toLowerCase()))
              return false
            return true
          })
          if (sortBy.length) {
            const { key, order } = sortBy[0]
            items.sort((a: any, b: any) =>
              order === 'desc' ? b[key] - a[key] : a[key] - b[key])
          }
          const paginated = items.slice(start, end === -1 ? undefined : end)
          resolve({ items: paginated, total: items.length })
        }, 500)
      })
    },
  }
  
  async function loadItems (opt: TableOpt) {
    loadingTable.value = true
    await getListData()
    const { items, total } = await ListAllCategoryApi.fetch({
      page: opt.page,
      itemsPerPage: opt.itemsPerPage,
      sortBy: opt.sortBy,
      search: { title: name.value },
    })
    serverItems.value = items
    totalItems.value  = total
    loadingTable.value= false
  }

  watch(name, () => {
    search.value = String(Date.now())
  })

  watch(dataListCategory, (newVal) => {
    dataListCategory.value = newVal;

    // tinh max order
    if(newVal && newVal.length > 0) {
      maxOrder.value = Math.max(...newVal.map(item => item.order))
    } else {
      maxOrder.value = 0
    }
  })

  //actions global
  const handleTogglePopupAdd = (value:boolean) => {
    handleResetForm()
    if(detailData.value) detailData.value.data.id = ''
    isTogglePopupAdd.value = value;
  };

  const handleTogglePopupUpdate = (value:boolean) => {
    isTogglePopupUpdate.value = value;
  };

  const handleResetForm = () => {
    formItem.title = ''
    formItem.description = ''
    formItem.summaryContent = ''
    formItem.isActive = false
    formItem.image = ''
    formItem.listImage = []
  }
  const handleReload = async () => {
    await loadItems(currentTableOptions);
  }

  //actions add
  async function submitCreate () {
    Loading(true);

    try {
      const newCategory = {...formItem}

      const data = await aboutAPI.create(newCategory)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupAdd.value = false;
        handleResetForm()
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
    }
    Loading(false);
  }

  //actions edit
  const handleEdit = async (id: string) => {
    detailData.value = await aboutAPI.getDetail(id)
    if(!detailData.value) return
    handleTogglePopupUpdate(true);
    const { title, description, summaryContent, isActive, image, listImage } = detailData.value.data;
    Object.assign(formItem, { title, description, summaryContent, isActive, image, listImage });
  }

  async function submitUpdate() {
    if(!detailData.value) return
    const id = detailData.value.data?.id
    if (!id) return
    Loading(true);
    try {
      const newCategory = {...formItem}

      const data = await aboutAPI.update(id, newCategory)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupUpdate.value = false;
        handleResetForm()
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  //actions delete
  const handleDelete = async (id: string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return

    Loading(true);
    try {
      const data = await aboutAPI.delete(id)
      if(data.code === 0){
        showSuccess(data.message)
        if(dataListCategory.value){
          dataListCategory.value = dataListCategory.value.filter(item => 
            item.id !== id
          )
        }
        handleReload()
      } else {
        showWarning(data.message)
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }
  
  // doi kich hoat
  const { toggleActive } = useToggleActiveStatus(aboutAPI.toggleActive, serverItems );

  // change order
  const { handleChangeOrder } = useChangeOrder(aboutAPI.updateOrder, () => loadItems(currentTableOptions));

  const handleAddImage = () => {
    contextStore.setContext("about")
    storeFileManage.handleTogglePopup(true)
  }

  const handleDeleteListImage = (id: string) => {
    formItem.listImage = formItem.listImage?.filter(item => item.id !== id)
  }

  const handleAddListImage = () => {
    contextStore.setContext("about")
    checkSelectImage.value = false
    storeFileManage.handleTogglePopup(true)
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return

    const target = formItem
    if (contextStore.context?.includes("about")) {
      if (checkSelectImage.value) {
        target.image = newValue.url
      } else {
        target.listImage?.push({ id: newValue.id, src: newValue.url })
        checkSelectImage.value = true
      }
      contextStore.setContext(null)
    }
  })

  //getters
  const getListAbout = computed(() => dataListCategory.value);
  const getListOrder = computed(() => {
    return Array.from({ length: maxOrder.value }, (_, i) => i + 1)
  })
  
  return {
    // state
    valid,
    dataListCategory,
    isTogglePopupAdd,
    isTogglePopupUpdate,
    titleRules,
    detailData,
    formItem,
    serverItems,
    loadingTable,
    totalItems,
    name,
    search,
    itemsPerPage,
    headers,
    currentTableOptions,
    folderName,
    // actions
    handleTogglePopupAdd,
    handleTogglePopupUpdate,
    handleEdit,
    handleDelete,
    getListData,
    loadItems,
    submitCreate,
    submitUpdate,
    handleReload,
    handleResetForm,
    handleAddImage,
    handleDeleteListImage,
    handleAddListImage,
    handleChangeOrder,
    toggleActive,
    //getters
    getListAbout,
    getListOrder,
  };
});
