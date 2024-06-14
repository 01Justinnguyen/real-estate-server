export type SelectObject = {
  [key: string]: boolean
}

export function buildSelectObject(fields: string): SelectObject {
  const fieldsArray = fields.split(',')
  const selectObject: SelectObject = {}
  fieldsArray.forEach((field) => {
    selectObject[field] = true
  })
  return selectObject
}

export function exclude<ObjData extends object, K extends keyof ObjData>(
  objData: ObjData,
  keys: K[]
): Omit<ObjData, K> {
  const entries = Object.entries(objData).filter(([key]) => !keys.includes(key as K))
  return Object.fromEntries(entries) as Omit<ObjData, K>
}
