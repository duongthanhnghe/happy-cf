<template>
  <div>
    <input v-model="email" placeholder="Nhập email admin" />
    <input v-model="newPassword" placeholder="Nhập mật khẩu mới" type="password" />
    <button @click="handleReset">Đặt lại mật khẩu</button>
  </div>
</template>

<script setup lang="ts">
import {ref } from 'vue'
import { adminAuthAPI } from "@/services/v1/admin/adminAuth.service";
import { showSuccess } from '@/utils/toast';

const email = ref('');
const newPassword = ref('');

const handleReset = async () => {
  try {
    const res = await adminAuthAPI.resetPassword(email.value, newPassword.value);
    showSuccess(res.message);
  } catch (err: any) {
    // showError(err.message);
  }
};
</script>
