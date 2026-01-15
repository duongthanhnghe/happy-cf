import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useSidebarStore = defineStore("AdminSidebarStore", () => {

  const toggleSidebar = ref<boolean>(true)

  const handleToggleSidebar = () => {
    toggleSidebar.value = !toggleSidebar.value
  };

  const getToggleSidebar = computed(() => toggleSidebar.value)

  return {
    toggleSidebar,
    getToggleSidebar,
    handleToggleSidebar,
  };
});
