export default {
  state: {
    req: {
      path: '/',
      system: '',
      device: '',
      size: 0
    },
    viewMode: 'mosaic',
    loading: false,
    reloads: 0,
    multiple: false,
    selected: [],
    show: null,
    allowedCommands: [ 'ls', 'cd' ]
  },
  reducers: {
    updateReq (state, action) {
      return {...state, req: {...state.req, ...action.req}}
    },
    setViewMode (state, action) {
      return {...state, viewMode: action.value}
    },
    increaseReloads (state, action) {
      return {...state, reloads: state.reloads + 1}
    },
    removeSelected: (state, action) => {
      let i = state.selected.indexOf(action.value)
      if (i === -1) return
      const selected = [...state.selected]
      selected.splice(i, 1)
      return {...state, selected}
    },
    addSelected: (state, action) => {
      const selected = [...state.selected, action.value]
      return {...state, selected}
    },
    resetSelected: (state) => {
      return {...state, selected: []}
    },
    setMultiple: (state, action) => {
      return {...state, multiple: action.value}
    }
  }
}
