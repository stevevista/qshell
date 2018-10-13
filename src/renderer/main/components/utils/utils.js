export function pickPortFromDevices (state) {
  let selectPort
  for (let dev of state.devices.deviceList) {
    for (let comName in dev.serials) {
      let port = dev.serials[comName]
      if (!selectPort || !port.edl) {
        selectPort = port
      }
      if (selectPort && !selectPort.edl) {
        break
      }
    }

    if (selectPort && !selectPort.edl) {
      break
    }
  }
  return selectPort
}
