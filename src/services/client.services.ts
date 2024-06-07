import prisma from '@/database'
import { UpdateProfileBodyType } from '@/schemaValidations/client.schema'

class ClientService {
  async getMeProfile(user_id: string) {
    const data = await prisma.user.findUnique({
      where: {
        id: user_id
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        avatar: true,
        date_of_birth: true,
        email_verify: true,
        phone_verify: true,
        created_at: true
      }
    })
    return data
  }

  async updateMeProfile({ user_id, data }: { user_id: string; data: UpdateProfileBodyType }) {
    const response = await prisma.user.update({
      where: {
        id: user_id
      },
      data
    })

    return response
  }
}

const clientService = new ClientService()

export default clientService
