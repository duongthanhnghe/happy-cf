import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

type ValidateTarget = 'body' | 'query' | 'params'

export const validate =
  (schema: ZodSchema, target: ValidateTarget = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const data = req[target]

    const result = schema.safeParse(data)

    if (!result.success) {
      return res.status(400).json({
        code: 1,
        message: 'Dữ liệu không hợp lệ',
        errors: result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      })
    }

    req[target] = result.data
    next()
  }
