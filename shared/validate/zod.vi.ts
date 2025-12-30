import { z } from 'zod'

z.setErrorMap((issue, ctx) => {
  switch (issue.code) {
    case 'invalid_type':
      if (issue.expected === 'number') return { message: 'Giá trị phải là số' }
      if (issue.expected === 'string') return { message: 'Giá trị phải là chuỗi' }
      if (issue.expected === 'boolean') return { message: 'Giá trị phải là true / false' }
      return { message: ctx?.defaultError ?? 'Sai kiểu dữ liệu' }

    case 'too_small':
      if (issue.type === 'string') return { message: `Phải có ít nhất ${issue.minimum} ký tự` }
      if (issue.type === 'number') return { message: `Phải ≥ ${issue.minimum}` }
      return { message: ctx?.defaultError ?? 'Quá nhỏ' }

    case 'too_big':
      if (issue.type === 'string') return { message: `Không được vượt quá ${issue.maximum} ký tự` }
      if (issue.type === 'number') return { message: `Phải ≤ ${issue.maximum}` }
      return { message: ctx?.defaultError ?? 'Quá lớn' }

    case 'invalid_string':
      if (issue.validation === 'url') return { message: 'URL không hợp lệ' }
      if (issue.validation === 'regex') return { message: 'Định dạng không hợp lệ' }
      return { message: 'Chuỗi không hợp lệ' }

    case 'invalid_enum_value':
      return { message: 'Giá trị không hợp lệ' }

    case 'custom':
      return { message: issue.message ?? ctx?.defaultError ?? 'Dữ liệu không hợp lệ' }

    default:
      return { message: ctx?.defaultError ?? 'Lỗi không xác định' }
  }
})
