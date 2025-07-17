/**
 *  based on the string path to get value from object  /globl/users/*
 * @param obj the object need to get data from
 * @param path path tring e.g state/greeting/*
 * @returns return the value that find
 */
export const getValueByPath = (obj: Object, path: String): unknown => {
  if (!obj || typeof path !== 'string') return undefined
  const parts = path.split('/')
  let currentValue: any = obj
  for (const part of parts) {
    if (
      currentValue &&
      typeof currentValue === 'object' &&
      part in currentValue
    ) {
      currentValue = currentValue[part]
    } else {
      console.error(`Error: Invalid path "${path}" at part "${part}"`)
      return undefined
    }
  }
  return currentValue
}

