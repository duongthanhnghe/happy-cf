function requiredRule(value: string) {
  return !!value || 'Nội dung không được trống'
}

function noSpecialCharRule(value: string) {
  const regex = /^[\p{L}0-9\s]+$/u
  return regex.test(value) || 'Nội dung không được chứa ký tự đặc biệt'
}

export const nullRules = [requiredRule]
export const nullAndSpecialRules = [requiredRule, noSpecialCharRule]
