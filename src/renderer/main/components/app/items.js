import IconFont from '../iconfont'
import {Icon} from 'antd'

export default [
  {
    icon: IconFont,
    iconType: 'mobile',
    messageId: 'sidebar.devices',
    path: 'devices',
    component: require('../devices').default
  },
  {
    icon: IconFont,
    iconType: 'huodongmulupeizhi',
    messageId: 'sidebar.diagTest',
    path: 'qlib',
    component: require('../qlib').default
  },
  {
    icon: IconFont,
    iconType: 'fast',
    messageId: 'sidebar.qspr',
    path: 'qspr',
    component: require('../qspr').default
  },
  {
    icon: IconFont,
    iconType: 'chip',
    messageId: 'sidebar.nvram',
    path: 'nvram',
    component: require('../nvram').default
  },
  {
    icon: IconFont,
    iconType: 'folder',
    messageId: 'sidebar.fs',
    path: 'fs',
    component: require('../fs').default
  },
  {
    icon: IconFont,
    iconType: 'setting',
    messageId: 'sidebar.setting',
    path: 'test',
    component: require('../settings').default
  },
  {
    icon: Icon,
    iconType: 'link',
    label: 'Demo',
    path: 'demo',
    component: require('../presentation').default
  }
]
