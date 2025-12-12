import { showSuccess, showWarning } from "@/utils/toast";
import type { ProductImportDTO, ProductImportItemDTO, ProductImportTableItem } from '@/server/types/dto/v1/product.dto';
import { watch, type Ref } from 'vue';
import { productsAPI } from "@/services/v1/admin/product.service";
import { showError } from "nuxt/app";
import type { TableOpt } from "@/server/types";
import { Loading } from "@/utils/global";

export const useAdminProductImport = (
  selectedImportFile: Ref<File|null>,
  loadingTableImport: Ref<Boolean>,
  dataImport: Ref<ProductImportDTO | null>,
  serverItemsImport: Ref<ProductImportTableItem[]>,
  totalItemsImport: Ref<Number>,
  isTogglePopupImport: Ref<Boolean>,
  currentTableOptions: Ref<TableOpt>,
  currentTypeImport: Ref<String>,
  loadItems: (opt: TableOpt) => Promise<void>,
) => {

  const formatImportResults = (results: ProductImportItemDTO[]) => {
    return results.map((item) => ({
      rowIndex: item.rowIndex,
      productName: item.row.productName,
      image: item.row.image,
      categoryId: item.row.categoryId,
      price: item.row.price,
      priceDiscounts: item.row.priceDiscounts,
      amount: item.row.amount,
      description: item.row.description,
      summaryContent: item.row.summaryContent,
      isActive: item.row.isActive,
      weight: item.row.weight,
      sku: item.row.sku,
      status: item.status,
      message: item.message ?? "Thành công",
    }));
  };

  const setImportFile = (files: File | File[] | null) => {
    if (!files) {
      selectedImportFile.value = null;
      return;
    }

    selectedImportFile.value = Array.isArray(files) ? files[0] : files;
  };

  const handleImport = async () => {
    if (!selectedImportFile.value) {
      showWarning("Vui lòng chọn file trước khi import");
      return;
    }

    loadingTableImport.value = true;

    let res;

    if (currentTypeImport.value === "import") {
      res = await productsAPI.importProducts(selectedImportFile.value);
    } else if (currentTypeImport.value === "updateImport") {
      res = await productsAPI.updateImportProducts(selectedImportFile.value);
    } else {
      return
    }
    
    loadingTableImport.value = false;

    if (res.code !== 0) {
      showError(res.message || "Import lỗi");
      return;
    }

    dataImport.value = res
    serverItemsImport.value = formatImportResults(res.data);
    totalItemsImport.value = res.data.length;
    await loadItems(currentTableOptions.value);
  };

  const resetImport = () => {
    selectedImportFile.value = null;
    dataImport.value = null;

    serverItemsImport.value = [];
    totalItemsImport.value = 0;

    loadingTableImport.value = false;
  };

  const handleTogglePopupImport = (value: boolean, typeImport: 'import'|'updateImport') => {
    isTogglePopupImport.value = value;
    currentTypeImport.value = typeImport;
    if(!value) resetImport()
  };

  watch(isTogglePopupImport, (newValue) => {
    if(!newValue && selectedImportFile.value !== null && dataImport.value !== null) resetImport()
  })

  const handleExport = async () => {
    Loading(true)
    const res = await productsAPI.exportProducts();
    Loading(false)
    if(res.code) showSuccess(res.message ?? 'Export thành công')
  };

  return {
    handleImport,
    setImportFile,
    handleTogglePopupImport,
    handleExport,
  };
};