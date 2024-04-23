import prisma from '@/database'
import { Response, Request } from 'express'

export const testController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get success'
  })
}
