import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import z from 'zod'

export const RegisterBody = z
  .object({
    name: z.string().trim().min(2).max(255),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: CLIENT_MESSAGE.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD,
        path: ['confirmPassword']
      })
    }
  })

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const RegisterRes = z.object({
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string()
  })
})

export type RegisterResType = z.TypeOf<typeof RegisterRes>
