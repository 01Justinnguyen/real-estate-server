import asyncHandler from 'express-async-handler'
import { Response, Request, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import propertyTypeService from '@/services/propertyType.services'
import { MessageResType } from '@/schemaValidations/common.schema'
import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import { PropertyTypeBodyType } from '@/schemaValidations/propertyType.schema'
import { SuccessResponseApi } from '@/interfaces/utils.interfaces'
import { buildSelectObject, SelectObject } from '@/utils/utils'
import prisma from '@/database'
import { clientRedis } from '@/database/redis.config'

export const getPropertyTypesController = async (req: Request, res: Response, next: NextFunction) => {
  const { limit, page, fields, name, sortBy, ...query } = req.query
  // Limit field get query
  let selectOptions = null
  let orderBy
  if (fields) selectOptions = buildSelectObject(fields as string)

  // Filter by client queries
  if (name) {
    query.name = {
      contains: name
    }
  }

  // Sorting
  if (sortBy) {
    const order = (sortBy as string).split(',').map((el) => {
      if (el.startsWith('-')) {
        return { [el.replace('-', '')]: 'desc' }
      } else {
        return { [el]: 'asc' }
      }
    })
    orderBy = order
  }

  if (!limit) {
    const alreadyGetAll = await clientRedis.get('property-type')
    if (alreadyGetAll) {
      return res.json({
        message: CLIENT_MESSAGE.GET_PROPERTY_TYPES_SUCCESS,
        data: JSON.parse(alreadyGetAll)
      })
    }
    const data = await propertyTypeService.getAllPropertyType({
      selectOptions: selectOptions as SelectObject,
      query,
      orderBy
    })

    clientRedis.set('property-type', JSON.stringify(data))

    return res.json({
      message: data.length > 0 ? CLIENT_MESSAGE.GET_PROPERTY_TYPES_SUCCESS : 'Cannot get propertyTypes',
      data
    })
  }

  // ** Pagination **
  // Chuyển đổi limit và page thành số nguyên
  let limitInt = parseInt(limit as string)
  let pageInt = parseInt(page as string)

  // Kiểm tra nếu limit hoặc page không hợp lệ, gán giá trị mặc định
  if (isNaN(limitInt) || limitInt <= 0) {
    limitInt = 2
  }
  if (isNaN(pageInt) || pageInt <= 0) {
    pageInt = 1
  }
  // Tính toán offset
  const offset = (pageInt - 1) * limitInt

  const [records, totalRecords] = await Promise.all([
    prisma.propertyType.findMany({
      skip: offset,
      take: limitInt,
      where: query,
      select: selectOptions,
      orderBy: orderBy as any
    }),
    prisma.propertyType.count({
      where: query
    })
  ])

  // Tính tổng số trang
  const totalPages = Math.ceil(totalRecords / limitInt)

  return res.json({
    message: records.length > 0 ? CLIENT_MESSAGE.GET_PROPERTY_TYPES_SUCCESS : 'Cannot get propertyTypes',
    totalPages,
    data: records
  })

  // ** Pagination **
}

export const createNewPropertyTypeController = asyncHandler(
  async (
    req: Request<ParamsDictionary, any, PropertyTypeBodyType>,
    res: Response<MessageResType>,
    next: NextFunction
  ) => {
    await propertyTypeService.createNewPropertyType(req.body)
    res.json({
      message: CLIENT_MESSAGE.CREATE_PROPERTY_TYPE_SUCCESS
    })
  }
)

export const updatePropertyTypeController = asyncHandler(
  async (req: Request<ParamsDictionary, any, any>, res: Response<MessageResType>, next: NextFunction) => {
    const { id } = req.params

    const propertyType = prisma.propertyType.findUnique({
      where: {
        id
      }
    })
    if (!propertyType) {
      res.status(404).json({ message: 'Product not found' })
    }
    await propertyTypeService.updatePropertyType(id, req.body)

    res.json({
      message: CLIENT_MESSAGE.UPDATE_PROPERTY_TYPE_SUCCESS
    })
  }
)

export const deletePropertyTypeController = asyncHandler(
  async (req: Request, res: Response<MessageResType>, next: NextFunction) => {
    const { id } = req.params

    await propertyTypeService.deletePropertyType(id)
    res.json({
      message: CLIENT_MESSAGE.DELETE_PROPERTY_TYPE_SUCCESS
    })
  }
)

export const deleteAllPropertyTypeController = asyncHandler(
  async (req: Request, res: Response<MessageResType>, next: NextFunction) => {
    await propertyTypeService.deleteAllPropertyType()
    res.json({
      message: CLIENT_MESSAGE.DELETE_ALL_PROPERTY_TYPE_SUCCESS
    })
  }
)
