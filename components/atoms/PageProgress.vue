<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false,
  speed: 700,
  trickleSpeed: 200,
})

const router = useRouter()

onMounted(() => {
  router.beforeEach((_to, _from, next) => {
    NProgress.start()
    next()
  })

  router.afterEach(() => {
    NProgress.done()
  })
})

onUnmounted(() => {
  NProgress.remove()
})
</script>

<style lang="scss">
@use "@/assets/_variables.scss" as *;

#nprogress .bar {
  background: $cl-black !important;
  height: 4px !important;
  opacity: 0.3;
}
</style>
