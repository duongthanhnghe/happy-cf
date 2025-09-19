<script lang="ts" setup>
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { ref, watch, shallowRef } from 'vue'
import type { FileManageFolder } from "@/server/types/dto/file-manage.dto"

  const storeFileManage = useFileManageFolderStore()

  const separateRoots = shallowRef(true)
  const actionIcons = shallowRef(false)
  const indentLines = shallowRef(true)
  const items1 = ref<FileManageFolder[]|null>(null);

  const mapFoldersToTreeItems = (newValue: FileManageFolder[]) => {
    items1.value = newValue.map(folder => ({
      id: folder.id,
      title: folder.title,
      path: folder.path,
      segments: folder.segments,
      children: folder.children ? folder.children : []
    }))
  }

  watch(
    () => storeFileManage.getListFolder,
    (newValue) => {
      if (!newValue) return
      mapFoldersToTreeItems(newValue)
    },
    { immediate: true }
  )
</script>
<template>
  <template v-if="items1">
    <v-treeview
      :hide-actions="!actionIcons"
      :indent-lines="indentLines"
      :items="items1"
      :separate-roots="separateRoots"
      density="compact"
      item-value="id"
      item-title="title"
      max-width="400"
      open-on-click
      activatable
    >
      <template v-slot:title="{ item }">
        <v-list-item-title @click.activate="storeFileManage.handleItemClick(item)" v-if="item" class="flex align-center">
          <Button
            icon="folder"
            :border="false"
            color="secondary"
            size="sm"
            class="mr-xs"
          />
          {{ item.title }}
        </v-list-item-title>
      </template>
      <template v-slot:append="{ item }">
        <template v-if="item?.children && item.children.length > 0">
        <Button
            icon="keyboard_arrow_right"
            :border="false"
            color="secondary"
            size="sm"
            class="file-manage-button-angle"
          />
        </template>
      </template>
    </v-treeview>
  </template>
</template>