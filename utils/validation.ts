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

export const nullRules = [requiredRule]
export const nullAndSpecialRules = [requiredRule, noSpecialCharRule]
export const phoneRules = [requiredRule, phoneRule]