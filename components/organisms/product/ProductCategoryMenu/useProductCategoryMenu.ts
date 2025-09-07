import { ref, onBeforeUnmount } from 'vue';

export const useProductCategoryMenu = () => {
  
  const elActive = ref('')
  const isScrollingLocked = ref(false)

  const handleItemClickScroll = (itemId: string) => {
    isScrollingLocked.value = true
    scrollIntoView(`product-category-scroll${itemId}`)
    elActive.value = itemId

    setTimeout(() => {
      isScrollingLocked.value = false
    }, 2000)
  }

  const scrollIntoView = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const tabMenuScroll = () => {
    const onScroll = () => {
      if (isScrollingLocked.value) return

      const sections = document.querySelectorAll('[rel="js-section-scroll"]');
      let foundActiveId = '';

      sections.forEach((x) => {
        const dataId = x.getAttribute("data-id");
        const top = x.getBoundingClientRect().top;
        const height = x.getBoundingClientRect().height;

        if (top < 0 && top > -height) {
          foundActiveId = dataId?.replace('scroll-','') || '';
        }
      });

      if (foundActiveId) {
        elActive.value = foundActiveId;
      }
    };

    window.addEventListener('scroll', onScroll);

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', onScroll);
    });
  };

  return {
    elActive,
    isScrollingLocked,
    handleItemClickScroll,
    scrollIntoView,
    tabMenuScroll
  }
}