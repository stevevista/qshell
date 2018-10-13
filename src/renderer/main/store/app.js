import {detectLocale} from '../locales'

export default {
  state: {
    selectedPage: 'devices',
    locale: detectLocale()
  },
  reducers: {
    switchPage (state, action) {
      return {...state, selectedPage: action.page}
    },
    setLocale (state, action) {
      return {...state, locale: action.locale}
    }
  }
}
