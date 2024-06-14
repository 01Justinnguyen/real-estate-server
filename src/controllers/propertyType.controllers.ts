import asyncHandler from 'express-async-handler'
import { Response, Request, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import propertyTypeService from '@/services/propertyType.services'
import { MessageResType } from '@/schemaValidations/common.schema'
import { CLIENT_MESSAGE } from '@/constants/clientMessages'
import { PropertyTypeBodyType } from '@/schemaValidations/propertyType.schema'
import { SuccessResponseApi } from '@/interfaces/utils.interfaces'
import { buildSelectObject, exclude, SelectObject } from '@/utils/utils'

export const getPropertyTypesController = asyncHandler(
  async (req: Request, res: Response<SuccessResponseApi<PropertyTypeBodyType[]>>, next: NextFunction) => {
    const { limit, page, fields, type, name, ...query } = req.query
    if (type === 'ALL') {
      // Limit field get query
      let selectOptions = null
      if (fields) selectOptions = buildSelectObject(fields as string)

      // Filter by client queries
      if (name)
        query.name = {
          contains: name
        }

      const data = await propertyTypeService.getAllPropertyType({
        selectOptions: selectOptions as SelectObject,
        query
      })

      const a = {
        id: 1,
        name: '123',
        description: '123',
        image: 'alo123',
        created_at: 'Fri Jun 14 2024 22:29:02 GMT+0700',
        updated_at: 'Fri Jun 14 2024 22:29:02 GMT+0700'
      }

      const b = exclude(a, ['updated_at', 'created_at', 'id'])
      console.log('🐻 ~ b:', b)

      res.json({
        message: CLIENT_MESSAGE.GET_PROPERTY_TYPES_SUCCESS,
        data
      })
    } else {
      // res.json({})
    }
  }
)

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
