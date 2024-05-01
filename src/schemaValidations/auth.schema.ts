import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import { passwordRegex, phoneRegex } from '@/constants/regex'
import z from 'zod'

/** Register */

export const RegisterBody = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Tên phải lớn hơn hoặc bằng 2 ký tự')
      .max(255, 'Tên phải nhỏ hơn hoặc bằng 255 ký tự'),
    email: z.string().trim().email('Email không hợp lệ'),
    role: z.enum(['USER', 'AGENT']),
    phone: z
      .string()
      .trim()
      .refine((phone) => {
        return phoneRegex.test(phone)
      }, 'Số điện thoại phải đủ 10 ký tự và bắt đầu bằng số 0'),
    password: z.string().refine((password) => {
      return passwordRegex.test(password)
    }, 'Password phải chứa ít nhất 1 ký tự đặc biệt, 1 chữ cái viết thường, 1 chữ cái viết hoa, 1 số, không có dấu và có độ dài từ 8 đến 255 ký tự'),
    confirmPassword: z.string().refine((password) => {
      return passwordRegex.test(password)
    }, 'Confirm password phải chứa ít nhất 1 ký tự đặc biệt, 1 chữ cái viết thường, 1 chữ cái viết hoa, 1 số, không có dấu và có độ dài từ 8 đến 255 ký tự')
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
    access_token: z.string(),
    access_token_expiresAt: z.date(),
    refresh_token: z.string(),
    refresh_token_expiresAt: z.date()
  })
})

export type RegisterResType = z.TypeOf<typeof RegisterRes>

/** Register */

/** Login */

export const LoginBody = z
  .object({
    phone: z
      .string()
      .trim()
      .refine((phone) => {
        return phoneRegex.test(phone)
      }, 'Số điện thoại phải đủ 10 ký tự và bắt đầu bằng số 0'),
    password: z.string().refine((password) => {
      return passwordRegex.test(password)
    }, 'Password phải chứa ít nhất 1 ký tự đặc biệt, 1 chữ cái viết thường, 1 chữ cái viết hoa, 1 số, không có dấu và có độ dài từ 8 đến 255 ký tự')
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const LoginRes = z.object({
  message: z.string(),
  data: z.object({
    access_token: z.string(),
    access_token_expiresAt: z.date(),
    refresh_token: z.string(),
    refresh_token_expiresAt: z.date()
  })
})

export type LoginResType = z.TypeOf<typeof LoginRes>

/** Login */

/** Refresh Token */
export const RefreshTokenBody = z
  .object({
    refresh_token: z.string().trim()
  })
  .strict()

export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>

export const RefreshTokenRes = z.object({
  message: z.string(),
  data: z.object({
    new_access_token: z.string(),
    access_token_expiresAt: z.date(),
    new_refresh_token: z.string(),
    refresh_token_expiresAt: z.date()
  })
})

export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>

/** Refresh Token */
