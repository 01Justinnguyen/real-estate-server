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

  async getAllPropertyType({ selectOptions, query }: { selectOptions?: SelectObject; query: any }) {
    const data = await prisma.propertyType.findMany({
      where: query,
      select: selectOptions
    })
    return data
  }

  async getOnePropertyType() {}
}

const propertyTypeService = new PropertyTypeService()

export default propertyTypeService
