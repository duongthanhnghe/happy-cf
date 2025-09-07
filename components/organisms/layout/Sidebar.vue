<script lang="ts" setup>
import '@/styles/organisms/layout/sidebar.scss';
import { useRoute } from 'vue-router'

const route = useRoute()
const taskbarListAdmin = [
  { path: '/', label: 'Trang chủ', icon:'home' },
  { path: '/admin/about', label: 'Giới Thiệu', icon:'store' },
  { path: '/admin/product/product', label: 'QL Sản phẩm', icon:'inventory_2' },
  { path: '/admin/product/category', label: 'QL Danh mục SP', icon:'category' },
  { path: '/admin/order', label: 'QL Đơn hàng', icon:'assignment' },
  { path: '/admin/news/category', label: 'QL Danh mục Tin', icon:'view_list' },
  { path: '/admin/news/post', label: 'QL Tin tức', icon:'article' },
  { path: '/admin/banner', label: 'QL Banner', icon:'image' },
  { path: '/admin/user', label: 'QL Khach hang', icon:'person' },
  { path: '/admin/file-manage', label: 'Thu vien anh', icon:'image' },
  { path: '/admin/setting', label: 'Cai dat', icon:'settings' },
]

</script>

<template>
  <div class="taskbar">
    <div class="taskbar-content">
      <NuxtLink
        v-for="item in taskbarListAdmin"
        :key="item.path"
        :to="{ path: item.path }"
        class="taskbar-href"
      >
        <Button
          :icon="item.icon"
          class="taskbar-icon"
          :border="false"
          color="secondary"
          size="sm"
          :class="{ active: route.fullPath === item.path }"
        />
        <Button
          color="secondary"
          class="taskbar-text"
          :label="item.label"
          :border="false"
          :class="{ active: route.fullPath === item.path }"
        />
      </NuxtLink>
    </div>
  </div>
</template>