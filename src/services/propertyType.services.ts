import prisma from '@/database'
import { PropertyTypeBodyType } from '@/schemaValidations/propertyType.schema'
import { SelectObject } from '@/utils/utils'

class PropertyTypeService {
  async createNewPropertyType(payload: PropertyTypeBodyType) {
    const response = await prisma.propertyType.create({
      data: payload
    })
    return response
  }

  async getAllPropertyType({
    selectOptions,
    query,
    orderBy
  }: {
    selectOptions?: SelectObject
    query: any
    orderBy?: any
  }) {
    console.log('🐻 ~ PropertyTypeService ~ orderBy:', orderBy)
    console.log('🐻 ~ PropertyTypeService ~ selectOptions:', selectOptions)
    const data = await prisma.propertyType.findMany({
      where: query,
      select: selectOptions,
      orderBy
    })
    return data
  }

  async getOnePropertyType() {}

  async updatePropertyType(id: string, data: any) {
    await prisma.propertyType.update({
      where: {
        id
      },
      data
    })
  }

  async deletePropertyType(id: string) {
    await prisma.propertyType.delete({
      where: {
        id
      }
    })
  }

  async deleteAllPropertyType() {
    await prisma.propertyType.deleteMany({})
  }
}

const propertyTypeService = new PropertyTypeService()

export default propertyTypeService
