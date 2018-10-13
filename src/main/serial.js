import serial from 'serialport'

function startSerialsDetector (options) {
  setInterval(() => {
    serial.list()
      .then(ports => {
        options.onListPorts(ports)
      })
  }, 500)
}

export {
  startSerialsDetector
}
