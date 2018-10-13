export default {
  state: {
    viewType: 'list',
    executeOptions: [],
    xttPath: '',
    testTree: {},
    runnCount: 1,
    runners: [
      {
        isExecuting: false,
        statusText: '',
        result: '',
        caseCount: 0,
        caseRuns: 0
      },
      {
        isExecuting: false,
        statusText: '',
        result: '',
        caseCount: 0,
        caseRuns: 0
      },
      {
        isExecuting: false,
        statusText: '',
        result: '',
        caseCount: 0,
        caseRuns: 0
      },
      {
        isExecuting: false,
        statusText: '',
        result: '',
        caseCount: 0,
        caseRuns: 0
      }
    ]
  },
  reducers: {
    increaseRunCount (state, action) {
      let count = state.runnCount
      if (count < state.runners.length) {
        return {...state, runnCount: count + 1}
      } else {
        return state
      }
    },
    decreaseRunCount (state, action) {
      let count = state.runnCount
      if (count > 1) {
        return {...state, runnCount: count - 1}
      } else {
        return state
      }
    },
    setExecuteOptions (state, action) {
      return {...state, executeOptions: action.value}
    },
    setViewType (state, action) {
      return {...state, viewType: action.value}
    },
    resetTestCases (state, action) {
      return {...state, testTree: {}, xttPath: action.path}
    },
    updateRunner (state, action) {
      const runners = state.runners
      runners[action.id] = action.runner
      return {...state, runners}
    },
    updateTestTree (state, action) {
      return {...state, testTree: action.tree}
    }
  }
}
