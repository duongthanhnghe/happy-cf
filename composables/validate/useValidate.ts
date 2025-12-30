import { reactive } from 'vue'
import type { ZodSchema, ZodError } from 'zod'

type FormErrors = Record<string, string>

function zodToErrors(error: ZodError): FormErrors {
  const errors: FormErrors = {}

  error.issues.forEach(err => {
    const path = err.path.join('.')
    if (!errors[path]) {
      errors[path] = err.message
    }
  })

  return errors
}

export function useValidate<T>(schema: ZodSchema<T>) {
  const formErrors = reactive<FormErrors>({})

  const resetErrors = () => {
    Object.keys(formErrors).forEach(key => delete formErrors[key])
  }

  const validate = (data: unknown): data is T => {
    resetErrors()

    const result = schema.safeParse(data)

    if (!result.success) {
      Object.assign(formErrors, zodToErrors(result.error))
      return false
    }

    return true
  }

  return {
    formErrors,
    validate,
    resetErrors,
  }
}
