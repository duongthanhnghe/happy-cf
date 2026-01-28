<script lang="ts" setup>
import { useTranslationManageStore } from '@/stores/admin/itranslation/useTranslationManageStore'
import { ROUTES } from '@/shared/constants/routes'
import { useFileManageWatchers } from '@/composables/admin/file-manage/useFileManageWatchers';
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import { useAccountAdminStore } from '@/stores/admin/account/useAccountAdminStore';
import { ACCOUNT_ROLE } from '@/shared/constants/account-role';
import { copyText } from '@/utils/global';
import { onBeforeUnmount } from 'vue';

definePageMeta({
  layout: ROUTES.ADMIN.ITRANSLATION.layout,
  middleware: ROUTES.ADMIN.ITRANSLATION.middleware,
})

const store = useTranslationManageStore()
const storeFileManage = useFileManageFolderStore();
const storeAccount = useAccountAdminStore()

useFileManageWatchers(storeFileManage, store.folderName);

onBeforeUnmount(() => {
  storeFileManage.resetState()
})
</script>

<template>
  <HeaderAdmin>
    <template #left>
      <v-text-field
        v-model="store.searchInput"
        placeholder="Tìm kiếm..."
        variant="outlined"
        hide-details
        clearable
        @keyup.enter="store.handleSearch"
        @click:clear="store.handleSearch(false)"
      />
    </template>

    <template #right>
      <client-only>
        <Button v-if="storeAccount.getDetailAccount?.role === ACCOUNT_ROLE.superadmin.value" label="Thêm mới" color="primary" :shadow="true" @click="store.handleTogglePopupAdd(true)" />
      </client-only>
    </template>
  </HeaderAdmin>
  <PopupFileManageImage :folderName="store.folderName" :chooseImage="true" column="col-6 col-md-4"/>

  <CreateITranslation />
  <client-only>
    <UpdateITranslation :isAdmin="storeAccount.getDetailAccount?.role === ACCOUNT_ROLE.superadmin.value" />
  </client-only>

  <v-container>
    <v-data-table-server 
      v-model:page="store.currentTableOptions.page"
      v-model:items-per-page="store.currentTableOptions.itemsPerPage"
      :headers="store.headers"
      :items="store.serverItems"
      :items-length="store.totalItems"
      :loading="store.loadingTable"
      @update:options="options => {
        store.currentTableOptions = options
      }">
      <template #item.translations="{ item }">
        <div class="flex gap-md">
        <Text limit="1" class="width-300">
          <div v-html="item.translations?.vi">
          </div>
        </Text>
        <Text limit="1" class="width-300">
          <div v-html="item.translations?.en">
          </div>
        </Text>
        </div>
      </template>

      <template #item.key="{ item }">
        <div class="flex align-center gap-sm">
          {{ item.key }}
          <Button :border="false" size="sm" color="gray" icon="content_copy" @click="copyText(`t('${item.key}')`)"/>
        </div>
      </template>

      <template #item.type="{ item }">
        <v-chip label>{{ item.type }}</v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="flex gap-sm justify-end">
          <Button :border="false" color="secondary" size="sm" icon="edit" @click="store.handleEdit(item.id)" />
          <Button :border="false" color="secondary" size="sm" icon="delete" @click="store.handleDelete(item.id)" />
        </div>
      </template>
    </v-data-table-server>
  </v-container>
</template>
