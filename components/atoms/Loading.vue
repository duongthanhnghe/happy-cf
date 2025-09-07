<template>
    <div
      id="loader"
      :class="[
        'loader',
        type ? 'active' : '',
      ]"
    >
        <div class="loader-icon"></div>
    </div>
</template>

<script setup>
const props = defineProps({
  icon: String,
  type: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.loader {
  position: fixed;
    text-align: center;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    left: 0;
    opacity: 0;
    visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
    transition: 1.5s all;
    z-index: 9999999;
}
.loader.active {
  opacity: 0.7;
    visibility: visible;
  transition: 1.5s all;
}
.loader-icon {
  height: 80px;
  aspect-ratio: 1;
  padding: 8px;
  border-radius: 50%;
  box-sizing: border-box;
  position: relative;
  mask: conic-gradient(#000 0 0) content-box exclude,conic-gradient(#000 0 0);
  filter: blur(12px);
}
.loader-icon:before {
  content: "";
  position: absolute;
  inset: 0;
  background: conic-gradient(#0000 35%,#ffffff,#0000 85%);
  animation: l1 1.2s linear infinite;
}
@keyframes l1 {
  to {rotate: 1turn}
}
</style>
