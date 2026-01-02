import { z } from 'zod'

export const translationKeySchema = z
  .string()
  .min(1, 'Key không được để trống')
  .max(150, 'Key không được vượt quá 150 ký tự')
  .regex(/^[a-zA-Z0-9_.-]+$/, 'Key chỉ được chứa chữ, số, dấu chấm, gạch ngang')
export const baseTranslationObjectSchema = z.object({
  key: translationKeySchema,

  type: z.enum(['text', 'html'], {
    required_error: 'Vui lòng chọn loại dữ liệu',
  }),

  translations: z.object({
    vi: z.string().optional(),
    en: z.string().optional(),
  }),
})

const validateTranslation = (
  data: any,
  ctx: z.RefinementCtx
) => {
  const { translations, type } = data

  if (!translations?.vi || translations.vi.trim() === '') {
    ctx.addIssue({
      path: ['translations', 'vi'],
      message: 'Vui lòng nhập nội dung tiếng Việt',
      code: z.ZodIssueCode.custom,
    })
  }

  if (!translations?.en || translations.en.trim() === '') {
    ctx.addIssue({
      path: ['translations', 'en'],
      message: 'Vui lòng nhập nội dung tiếng Anh',
      code: z.ZodIssueCode.custom,
    })
  }

  if (type === 'html') {
    if (translations?.vi && translations.vi.length < 5) {
      ctx.addIssue({
        path: ['translations', 'vi'],
        message: 'Nội dung HTML tiếng Việt quá ngắn',
        code: z.ZodIssueCode.custom,
      })
    }

    if (translations?.en && translations.en.length < 5) {
      ctx.addIssue({
        path: ['translations', 'en'],
        message: 'Nội dung HTML tiếng Anh quá ngắn',
        code: z.ZodIssueCode.custom,
      })
    }
  }
}

export const createTranslationSchema =
  baseTranslationObjectSchema.superRefine(validateTranslation)

export const updateTranslationSchema =
  baseTranslationObjectSchema
    .partial({
      key: true,
      type: true,
      translations: true,
    })
    .superRefine(validateTranslation)

export const translationIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID bản dịch không hợp lệ'),
})
