import { computed } from 'vue'
import type { Ref } from 'vue'

function requiredRule(value: string | number) {
  const isEmpty =
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "");

  return !isEmpty || "Nội dung không được trống";
}

function noSpecialCharRule(value: string) {
  const regex = /^[\p{L}0-9\s]+$/u
  return regex.test(value) || 'Nội dung không được chứa ký tự đặc biệt'
}

function phoneRule(value: string) {
  if (!value) return requiredRule(value)
  const regex = /^[0-9]{10,}$/
  return regex.test(value) || 'Số điện thoại phải có ít nhất 10 số'
}

function emailRequiredRule(value: string) {
  return !!value || 'Email không được để trống'
}

function emailFormatRule(value: string) {
  if (!value) return true
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(value) || 'Email không hợp lệ'
}

const basePasswordRules = [
  (value: string) => !!value || 'Mật khẩu không được để trống',
  (value: string) => value.length >= 8 || 'Mật khẩu phải có ít nhất 8 ký tự',
  (value: string) => /[A-Z]/.test(value) || 'Phải có ít nhất 1 chữ in hoa',
  (value: string) => /[a-z]/.test(value) || 'Phải có ít nhất 1 chữ thường',
  (value: string) => /[0-9]/.test(value) || 'Phải có ít nhất 1 số',
  (value: string) => /[^A-Za-z0-9]/.test(value) || 'Phải có ít nhất 1 ký tự đặc biệt',
]

export const createNewPasswordRules = (newPasswordConfirm: Ref<string> | string) => {
  return [
    ...basePasswordRules,
    (value: string) => {
      const confirmValue = typeof newPasswordConfirm === 'string'
        ? newPasswordConfirm
        : newPasswordConfirm.value
      return value === confirmValue || 'Mật khẩu không giống nhau'
    },
  ]
}

export const useNewPasswordRules = (newPasswordConfirm: Ref<string>) => {
  return computed(() => createNewPasswordRules(newPasswordConfirm))
}

export const nullRules = [requiredRule]
export const nullAndSpecialRules = [requiredRule, noSpecialCharRule]
export const phoneRules = [requiredRule, phoneRule]
export const emailRules = [emailRequiredRule, emailFormatRule]
export const strongPasswordRules = basePasswordRules