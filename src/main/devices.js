import { ipcMain } from 'electron'
import { startAdbService } from './adb'
import { startSerialsDetector } from './serial'
import { addEventHook } from './handlers'
import db from '../db'
import log from 'electron-log'

const manufacturerFeature = db.read().get('manufacturerFeature').value()
const groupBySerial = db.read().get('groupBySerial').value()

let devices = {}
let deviceIndex = 0
let totalCounts = 0

function cleanupDevices () {
  for (let k in devices) {
    if (!devicePresent(devices[k])) {
      delete devices[k]
      totalCounts--
    }
  }
}

function devicePresent (dev) {
  return dev.type === 'device' || Object.keys(dev.serials).length > 0
}

function getOrCreateDevice (id) {
  if (!(id in devices)) {
    devices[id] = {
      id,
      type: null,
      serials: {},
      devIndex: deviceIndex
    }
    deviceIndex++
    totalCounts++

    if (totalCounts > 1000) {
      cleanupDevices()
    }
  }

  return devices[id]
}

function updateDeviceProps (id, props) {
  let dev = getOrCreateDevice(id)

  for (let k in props) {
    dev[k] = props[k]
  }

  notify(dev, {
    updateProperty: true
  })
}

function changeAdbStatus (id, status) {
  let dev = getOrCreateDevice(id)
  const oldStatus = dev.type
  dev.type = status

  let opt = {}
  if (oldStatus === 'device' && dev.type !== 'device') {
    opt.disappearAdb = id
  }
  if (oldStatus !== 'device' && dev.type === 'device') {
    opt.populateAdb = id
  }

  notify(dev, opt)
}

function populateComPort (obj) {
  const id = obj.serialNumber || obj.comName
  let dev = getOrCreateDevice(id)
  dev.serials[obj.comName] = obj

  notify(dev, {
    populateCOM: obj.comName
  })
}

function removeComPort (id, comName) {
  let dev = devices[id]
  if (!dev || !(comName in dev.serials)) {
    return
  }
  delete dev.serials[comName]

  notify(dev, {
    disappearCOM: comName
  })
}

// sync with window
let wndTarget

function notify (dev, opt) {
  if (wndTarget) {
    let options = opt || {}
    options.disappear = !devicePresent(dev)
    wndTarget.send('deviceChange', dev, options)
  }
}

addEventHook((evt) => {
  evt.$getDevice = (id) => devices[id]
  evt.$notifyDevice = notify
})

// sync on window up
ipcMain.on('syncDevices', (evt) => {
  wndTarget = evt.sender
  for (let k in devices) {
    notify(devices[k])
  }
})

function startService () {
  startAdbService({
    onAdbDeviceAdd,
    onAdbDeviceRemove,
    onAdbDeviceChange,
    onDevicePropChange
  })
  startSerialsDetector({
    onListPorts
  })
}

function onAdbDeviceAdd (device) {
  log.info(device)
  changeAdbStatus(device.id, device.type)
}

function onAdbDeviceRemove (device) {
  changeAdbStatus(device.id, null)
  log.info('Device %s was unplugged', device.id)
}

function onAdbDeviceChange (device) {
  changeAdbStatus(device.id, device.type)
  log.info('Device %s change', device.id)
}

function onDevicePropChange (id, props) {
  updateDeviceProps(id, props)
}

function parseUsbPortNumber (loc) {
  let parts = loc.split('.')
  if (parts.length === 2 && parts[0].indexOf('Port_#') === 0) {
    // Port_#0006.Hub_#0003
    return parseInt(parts[0].slice(6))
  }
  if (parts.length === 9) {
    // 0000.001a.0000.001.006.000.000.000.000
    return parseInt(parts[4])
  }
  return 0
}

function onListPorts (ports) {
  // register previous serials
  let serialStatus = {}
  for (let id in devices) {
    const serials = devices[id].serials
    for (let comName in serials) {
      serialStatus[comName] = id
    }
  }

  for (let port of ports) {
    if (port.manufacturer &&
            port.manufacturer.indexOf(manufacturerFeature) >= 0) {
      if (port.comName in serialStatus) {
        // already exists
        delete serialStatus[port.comName]
      } else {
        // new one
        if (!groupBySerial) {
          port.serialNumber = null
        }
        if (port.productId && port.productId === '9008') {
          port.edl = true
        }
        port.usbPortNumber = parseUsbPortNumber(port.locationId)
        populateComPort(port)
        log.info(port)
      }
    }
  }

  // detect unpluged
  for (let comName in serialStatus) {
    let id = serialStatus[comName]
    removeComPort(id, comName)
    log.info(`${comName} lost`)
  }
}

export {
  startService
}
