import { ref, onMounted, onBeforeUnmount } from 'vue'

export const useStickyObserver = (idTarget: string) => {
  const isStuck = ref(false)

  const onScroll = () => {
    const el = document.getElementById(idTarget)
    if (!el) return

    const rect = el.getBoundingClientRect()
    isStuck.value = rect.top <= 0
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { isStuck }
}
