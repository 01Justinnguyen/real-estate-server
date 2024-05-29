import prisma from '@/database'

class ClientService {
  async getMeProfile(user_id: string) {
    const data = await prisma.user.findUnique({
      where: {
        id: user_id
      }
    })
    return data
  }
}

const clientService = new ClientService()

export default clientService
