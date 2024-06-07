import { phoneRegex } from '@/constants/regex'
import z from 'zod'

export const UpdateProfileBody = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Tên phải lớn hơn hoặc bằng 2 ký tự')
    .max(255, 'Tên phải nhỏ hơn hoặc bằng 255 ký tự')
    .optional(),
  email: z.string().trim().email('Email không hợp lệ').optional(),
  phone: z
    .string()
    .trim()
    .refine((phone) => {
      return phoneRegex.test(phone)
    }, 'Số điện thoại phải đủ 10 ký tự và bắt đầu bằng số 0')
    .optional(),
  address: z
    .string()
    .trim()
    .min(5, 'Địa chỉ phải lớn hơn hoặc bằng 5 ký tự')
    .max(500, 'Địa chỉ phải nhỏ hơn hoặc bằng 500 ký tự')
    .optional(),
  avatar: z.string().url().optional(),
  date_of_birth: z.string().optional()
})

export type UpdateProfileBodyType = z.TypeOf<typeof UpdateProfileBody>
