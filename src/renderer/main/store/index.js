import { combineReducers, createStore } from 'redux'

const files = require.context('.', false, /\.js$/)
const reducers = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  // wrap reducers
  const mod = files(key).default
  const namespace = key.replace(/(\.\/|\.js)/g, '')

  const reducer = (state = mod.state, action) => {
    if (action.type.indexOf(namespace + '/') === 0) {
      const funcname = action.type.slice(namespace.length + 1)
      return mod.reducers[funcname](state, action)
    }
    return state
  }

  reducers[namespace] = reducer
})

const reducer = combineReducers(reducers)

const store = createStore(reducer)

export default store
