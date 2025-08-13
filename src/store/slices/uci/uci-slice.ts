import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { isEqual } from 'lodash'

type UciState = {
  reset: Record<string, any>
  unsaveChangesList: string[]
} & Record<string, any>

const initialState: UciState = {
  reset: {},
  unsaveChangesList: [],
}

const uciSlice = createSlice({
  name: 'uci',
  initialState,
  reducers: {
    addTopic(
      state,
      action: PayloadAction<{
        fileName: string
        sectionName: string
        uuid: string
        message: any
      }>,
    ) {
      const { fileName, sectionName, uuid, message } = action.payload
      if (!state[fileName]) {
        state[fileName] = {}
        state.reset[fileName] = {}
      }
      if (!state[fileName][sectionName]) {
        state[fileName][sectionName] = {}
        state.reset[fileName][sectionName] = {}
      }

      state[fileName][sectionName][uuid] = {
        ...state[fileName][sectionName][uuid],
        ...message,
      }
      state.reset[fileName][sectionName][uuid] = message
      state.unsaveChangesList = state.unsaveChangesList.filter(
        (i) => !i.includes(`${fileName}-${sectionName}-${uuid}`),
      )
    },
    // deleteTopic
    deleteTopic(
      state,
      action: PayloadAction<{
        fileName: string
        sectionName: string
        uuid: string
        hasOrder?: boolean
      }>,
    ) {
      const { fileName, sectionName, uuid, hasOrder } = action.payload
      delete state[fileName][sectionName][uuid]
      if (state.reset[fileName][sectionName][uuid])
        delete state.reset[fileName][sectionName][uuid]

      state.unsaveChangesList = state.unsaveChangesList.filter(
        (i) => !i.includes(`${fileName}-${sectionName}-${uuid}`),
      )
    },
    // editTopic
    editTopic(
      state,
      action: PayloadAction<{
        fileName: string
        sectionName: string
        uuid: string
        data: any
        key?: string
      }>,
    ) {
      const { fileName, sectionName, uuid, data, key } = action.payload
      const currentState = current(state) // read Proxy object
      state[fileName][sectionName][uuid] = data

      if (key) {
        /*
          this case happens when current value is {undefined} which is falsy.
          and user change checkbox to false - "0" or change textFiled to empty string - ""
          they are actual not changing result for UI and UCI config.
          so in this if statement, it compares bool for current value and edited value to verify if it actually changed.
        */
        const isNumber = !isNaN(data[key])
        const isSameBool =
          (isNumber ? !!+data[key] : !!data[key]) ===
          !!currentState.reset[fileName][sectionName][uuid][key]
        if (isSameBool) {
          state.unsaveChangesList = state.unsaveChangesList.filter(
            (i) => i !== `${fileName}-${sectionName}-${uuid}-${key}`,
          )
          return state
        } else {
          state.unsaveChangesList = [
            ...new Set([
              ...state.unsaveChangesList,
              `${fileName}-${sectionName}-${uuid}-${key}`,
            ]),
          ]
          return state
        }
      }

      if (isEqual(data, currentState.reset[fileName][sectionName][uuid])) {
        state.unsaveChangesList = state.unsaveChangesList.filter(
          (i) => i !== `${fileName}-${sectionName}-${uuid}`,
        )
      } else {
        state.unsaveChangesList = [
          ...new Set([
            ...state.unsaveChangesList,
            `${fileName}-${sectionName}-${uuid}`,
          ]),
        ]
      }
    },
    addPendingTopic(
      state,
      action: PayloadAction<{
        fileName: string
        sectionName: string
        data: any
        hasOrder?: boolean
      }>,
    ) {
      const { fileName, sectionName, data, hasOrder } = action.payload
      if (!state[fileName]) {
        state[fileName] = {}
        state.reset[fileName] = {}
      }
      if (!state[fileName][sectionName]) {
        state[fileName][sectionName] = {}
        state.reset[fileName][sectionName] = {}
      }
      let maxNewAddedUUIDIndex = 0
      Object.keys(state[fileName][sectionName])
        .filter((uuid) => uuid.includes('pending'))
        .forEach((pendingKey) => {
          let number = +pendingKey.split('pending-')[1]
          if (number > maxNewAddedUUIDIndex) maxNewAddedUUIDIndex = number
        })
      state[fileName][sectionName][`pending-${maxNewAddedUUIDIndex + 1}`] = {
        ...data,
        pendingId: maxNewAddedUUIDIndex + 1,
      }
      state.unsaveChangesList = [
        ...new Set([
          ...state.unsaveChangesList,
          `${fileName}-${sectionName}-${`pending-${maxNewAddedUUIDIndex + 1}`}`,
        ]),
      ]
      if (hasOrder) {
        let orderName = `${sectionName}` + 'Order'
        if (sectionName === 'redirect') {
          orderName = data.target === 'DNAT' ? 'dnatOrder' : 'snatOrder'
        }
        if (!state[orderName]) state[orderName] = []
        state[orderName] = [
          ...state[orderName],
          `pending-${maxNewAddedUUIDIndex + 1}`,
        ]
      }
    },
    // resetTopic
    resetTopic(
      state,
      action: PayloadAction<{
        fileName: string
        sectionName: string
        hasOrder?: boolean
      }>,
    ) {
      // need file name/ section name
      const { fileName, sectionName, hasOrder } = action.payload
      state[fileName][sectionName] = state.reset[fileName]?.[sectionName]
      if (hasOrder) {
        let orderName = `${sectionName}` + 'Order'
        state[orderName] = state.reset[orderName]
        state.unsaveChangesList = state.unsaveChangesList.filter(
          (i) => i !== `${orderName}`,
        )
      }
      state.unsaveChangesList = state.unsaveChangesList.filter(
        (i) => !i.includes(`${fileName}-${sectionName}`),
      )
    },
    resetAllUciTopic(state, action: PayloadAction<void>) {
      return { ...state.reset, reset: state.reset, unsaveChangesList: [] }
    },
    resetTopicByUUID(
      state,
      action: PayloadAction<{
        fileName: string
        sectionName: string
        uuid: string
      }>,
    ) {
      // need file name/ section name
      const { fileName, sectionName, uuid } = action.payload
      state[fileName][sectionName][uuid] =
        state.reset[fileName][sectionName][uuid]
      state.unsaveChangesList = state.unsaveChangesList.filter(
        (i) => !i.includes(`${fileName}-${sectionName}-${uuid}`),
      )
    },
    setUnsaveChangesList(
      state,
      action: PayloadAction<{
        curVal: any
        fileName: string
        sectionName: string
        uuid: string
        key: string
      }>,
    ) {
      const { curVal, fileName, sectionName, uuid, key } = action.payload
      if (curVal !== state.reset[fileName][sectionName][uuid][key]) {
        state.unsaveChangesList = [
          ...new Set([
            ...state.unsaveChangesList,
            `${fileName}-${sectionName}-${uuid}-${key}`,
          ]),
        ]
      } else {
        state.unsaveChangesList = state.unsaveChangesList.filter(
          (i) => i !== `${fileName}-${sectionName}-${uuid}-${key}`,
        )
      }
    },
    emptyUnsaveChangesList(state, action: PayloadAction<void>) {
      state.unsaveChangesList = []
    },
    editOrderList(
      state,
      action: PayloadAction<{ orderName: string; data: any }>,
    ) {
      const { orderName, data } = action.payload
      const currentState = current(state)
      state[orderName] = data
      if (isEqual(data, currentState.reset[orderName])) {
        state.unsaveChangesList = state.unsaveChangesList.filter(
          (i) => i !== `${orderName}`,
        )
      } else {
        state.unsaveChangesList = [
          ...new Set([...state.unsaveChangesList, `${orderName}`]),
        ]
      }
    },
    emptyOrderList(state, action: PayloadAction<{ orderName: string }>) {
      const { orderName } = action.payload
      state[orderName] = []
      state.unsaveChangesList = state.unsaveChangesList.filter(
        (i) => i !== orderName,
      )
    },
  },
})

export const {
  addTopic,
  deleteTopic,
  editTopic,
  resetTopic,
  addPendingTopic,
  resetAllUciTopic,
  resetTopicByUUID,
  setUnsaveChangesList,
  emptyUnsaveChangesList,
  editOrderList,
  emptyOrderList,
} = uciSlice.actions
export default uciSlice.reducer
