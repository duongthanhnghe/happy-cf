import { watch } from 'vue';

export const useFileManageWatchers = (
  storeFileManage: any,
  folderName: string,
) => {

  watch(() => storeFileManage.isTogglePopup, async (newValue) => {
    if(newValue){
      storeFileManage.resetState()
      await storeFileManage.getApiList(folderName)
    } 
  }, { immediate: true })

  return {
   
  };
};