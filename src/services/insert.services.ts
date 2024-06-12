import prisma from '@/database'
import { RoleBodyType } from '@/schemaValidations/client.schema'

class InsertService {
  async initRoles(roles: RoleBodyType[]) {
    const response = await prisma.role.createMany({
      data: roles
    })

    return response
  }
}

const insertService = new InsertService()

export default insertService
