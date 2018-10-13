import pkg from '@/../../package.json'
const version = process.env.NODE_ENV === 'production' ? pkg.version : 'Dev'

export default {
  state: {
    title: `Bella - ${version}`
  },
  reducers: {
    setTitle (state, action) {
      return {...state, title: action.title}
    }
  }
}
