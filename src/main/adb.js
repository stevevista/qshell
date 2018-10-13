import adb from 'adbkit'
import { app, Notification } from 'electron'
import { addEventHook } from './handlers'
import log from 'electron-log'
import fs from 'fs'

let client
let devTracker
let triedStartingServer = false

function unpackItem (src, dst) {
  if (fs.existsSync(dst)) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(src)
    const ws = fs.createWriteStream(dst)
    rs.pipe(ws)

    rs.on('error', err => reject(err))
    ws.on('error', err => reject(err))

    ws.on('close', () => {
      resolve()
    })
  })
}

const adbBinaries = [
  'adb.exe',
  'AdbWinApi.dll',
  'AdbWinUsbApi.dll'
]

function unpackAdb (dstPath) {
  return Promise.all(adbBinaries.map(name => unpackItem(`${__static}/bin/${name}`, `${dstPath}/${name}`)))
}

async function startAdbService (options) {
  const dstPath = app.getPath('userData')
  try {
    await unpackAdb(dstPath)
  } catch (e) {
    log.error(e)
  }

  client = adb.createClient({
    bin: `${dstPath}/adb`
  })

  client.connection()
    .then(async (conn) => {
      triedStartingServer = conn.triedStarting
      await conn.end()
      runServiceProc(options)
    })
    .catch(function (err) {
      log.error('adb:', err.stack)
      const notification = new Notification({
        title: 'ADB Error',
        body: `ADB Error`
      })
      notification.show()
    })
}

const adbQuit = async () => {
  if (devTracker) await devTracker.end()
  if (triedStartingServer) {
    log.verbose('killing adb-server ...')
    await client.kill()
  }
}

function runServiceProc (options) {
  client.trackDevices()
    .then(tracker => {
      devTracker = tracker

      tracker.on('add', device => {
        options.onAdbDeviceAdd(device)
        if (device.type === 'device') {
          adbQueryDeviceInfo(device.id, options)
        }
      })
      tracker.on('remove', (device) => {
        options.onAdbDeviceRemove(device)
      })
      tracker.on('change', (device) => {
        options.onAdbDeviceChange(device)
        if (device.type === 'device') {
          adbQueryDeviceInfo(device.id, options)
        }
      })
      tracker.on('end', function () {
        devTracker = null
        log.silly('Tracking stopped')
      })
    })
    .catch(function (err) {
      log.error('Something went wrong:', err.stack)
    })
}

function adbQueryDeviceInfo (id, options) {
  queryImei(id)
    .then(imei => {
      options.onDevicePropChange(id, {imei})
    })
  queryLockStatus(id)
    .then(locked => {
      options.onDevicePropChange(id, {locked})
    })
  client.getFeatures(id).then((features) => {
    // console.log(features)
  })
    .catch(function (err) {
      log.error(err)
    })
}

function queryImei (devid) {
  return new Promise((resolve, reject) => {
    resolve('11223344')
  })
}

function queryLockStatus (devid) {
  return new Promise((resolve, reject) => {
    resolve(true)
  })
}

addEventHook((evt) => {
  evt.$adb = client
})

export {
  startAdbService,
  adbQuit
}
