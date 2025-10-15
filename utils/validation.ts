function requiredRule(value: string) {
  return !!value || 'Nội dung không được trống'
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

export const nullRules = [requiredRule]
export const nullAndSpecialRules = [requiredRule, noSpecialCharRule]
export const phoneRules = [requiredRule, phoneRule]
export const emailRules = [emailRequiredRule, emailFormatRule]