import en from './en.yaml'
import zhCN from './zh-cn.yaml'
import cnAppLocaleData from 'react-intl/locale-data/zh'
import enAppLocaleData from 'react-intl/locale-data/en'
import antdEn from 'antd/lib/locale-provider/en_US'
import { addLocaleData } from 'react-intl'
import 'moment/locale/zh-cn'

export function detectLocale () {
  let locale = (navigator.language || navigator.browserLangugae).toLowerCase()
  switch (true) {
    case /^en.*/i.test(locale):
      locale = 'en'
      break
    case /^it.*/i.test(locale):
      locale = 'it'
      break
    case /^fr.*/i.test(locale):
      locale = 'fr'
      break
    case /^pt.*/i.test(locale):
      locale = 'pt'
      break
    case /^pt-BR.*/i.test(locale):
      locale = 'pt-br'
      break
    case /^ja.*/i.test(locale):
      locale = 'ja'
      break
    case /^zh-CN/i.test(locale):
      locale = 'zh-cn'
      break
    case /^zh-TW/i.test(locale):
      locale = 'zh-tw'
      break
    case /^zh.*/i.test(locale):
      locale = 'zh-cn'
      break
    case /^es.*/i.test(locale):
      locale = 'es'
      break
    case /^de.*/i.test(locale):
      locale = 'de'
      break
    case /^ru.*/i.test(locale):
      locale = 'ru'
      break
    case /^pl.*/i.test(locale):
      locale = 'pl'
      break
    default:
      locale = 'en'
  }

  return locale
}

export const locales = {
  'zh-cn': {
    title: '中文',
    messages: {
      ...zhCN
    },
    antd: null,
    data: cnAppLocaleData
  },
  'en': {
    title: 'English',
    messages: {
      ...en
    },
    antd: antdEn,
    data: enAppLocaleData
  }
}

addLocaleData(cnAppLocaleData)
addLocaleData(enAppLocaleData)
