import { watch } from 'vue';

export const useFileManageWatchers = (
  storeFileManage: any,
  folderName: string,
) => {

  watch(() => storeFileManage.isTogglePopup, (newValue) => {
    if(newValue && !storeFileManage.getItems) storeFileManage.getApiList(folderName)
  }, { immediate: true })

  return {
   
  };
};