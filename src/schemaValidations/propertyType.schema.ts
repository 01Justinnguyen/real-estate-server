import z from 'zod'
export const PropertyTypeBody = z.object({
  name: z.string().trim().min(2, 'Tên phải lớn hơn hoặc bằng 2 ký tự').max(255, 'Tên phải nhỏ hơn hoặc bằng 255 ký tự'),
  description: z
    .string()
    .trim()
    .min(2, 'Mô tả phải lớn hơn hoặc bằng 2 ký tự')
    .max(500, 'Mô tả phải nhỏ hơn hoặc bằng 500 ký tự'),
  image: z.string().trim()
})

export type PropertyTypeBodyType = z.TypeOf<typeof PropertyTypeBody>
