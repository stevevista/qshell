import log from 'electron-log'
import {shell} from 'electron'

const listDir = (evt, path) => {
  console.log(path)
  evt.sender.send('response', 'OK' + evt.message)
}

const rebootEDL = (evt, id) => {
  evt.$adb.shell(id, 'reboot edl')
}

const unlockDevice = (evt, id) => {
  let dev = evt.$getDevice(id)
  if (dev) {
    setTimeout(() => {
      dev.locked = false
      evt.$notifyDevice(dev)
    }, 3000)
  }
}

const openLogLocation = (evt) => {
  const pathname = log.transports.file.file || log.transports.file.findLogPath(log.transports.file.appName)
  shell.showItemInFolder(pathname)
}

const switchLogLevel = (evt, lvl) => {
  log.transports.file.level = lvl
}

export default {
  listDir,
  rebootEDL,
  unlockDevice,
  openLogLocation,
  switchLogLevel
}
