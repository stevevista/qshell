function connectForTest (evt, comName, body) {
  return evt.$Q.connectionContext(comName, body)
    .catch(err => {
      evt.sender.send('testResult', err.message)
    })
}

function phoneConnectedForTest (evt, comName, body) {
  return evt.$Q.phoneConnectedContext(comName, body)
    .catch(err => {
      evt.sender.send('testResult', err.message)
    })
}

const testVersionInfo = (evt, comName) => {
  let msg = evt.$Q.getLibraryVersion()

  phoneConnectedForTest(evt, comName, (connected, h) => {
    msg += '\r\n'
    msg += 'Connected: ' + connected
    return evt.$Q.diagVersion(h)
  })
    .then(obj => {
      msg += '\r\n'
      for (let k in obj) {
        msg += `${k}: ${obj[k]}\r\n`
      }
      evt.sender.send('testResult', msg)
    })
}

const testDaigKeyPress = (evt, comName) => {
  connectForTest(evt, comName, (h) => {
    return evt.$Q.DIAG_HS_KEY_F(h, '1', 0)
  })
    .then((res) => {
      evt.sender.send('testResult', 'PASS')
    })
}

const testSendSync = (evt, comName) => {
  connectForTest(evt, comName, async (h) => {
    let buf = Buffer.alloc(3)
    buf[0] = 32
    buf[1] = 0
    buf[2] = 109
    // buf[3] = 0x02
    await evt.$Q.send(h, buf, 1000)
    evt.sender.send('testResult', 'PASS')
  })
}

const testIsFTMMode = (evt, comName) => {
  connectForTest(evt, comName, async (h) => {
    let buf = Buffer.alloc(3)
    buf[0] = 32
    buf[1] = 0
    buf[2] = 109
    // buf[3] = 0x02
    const ret = await evt.$Q.isFTMMode(h)
    evt.sender.send('testResult', ret ? 'YES' : 'NO')
  })
}

const testEnterFTM = (evt, comName) => {
  connectForTest(evt, comName, (h) => {
    return evt.$Q.DIAG_CONTROL_F(h, 3)
      .then(() => {
        evt.sender.send('testResult', 'OK')
      })
  })
}

const testReportPhoneState = (evt, comName) => {
  connectForTest(evt, comName, async (h) => {
    const opMode = await evt.$Q.getPhoneOperatingMode(h)
    const ret = await evt.$Q.getPhoneCallState(h)
    evt.sender.send('testResult', `OperatingMode: ${opMode}\nCall State: ${ret[0]}, Sys Mode: ${ret[1]}`)
  })
}

const testAT = (evt, comName) => {
  connectForTest(evt, comName, async (h) => {
    await evt.$Q.setPacketMode(h, 0)
    const rsp = await evt.$Q.sendAT(h, 'AT+CBC?', 20000)
    console.log(rsp.slice(1).toString())
    evt.sender.send('testResult', rsp.toString())
  })
}

const testDownload = async (evt, comName) => {
  const iComPort = evt.$Q.parseComPort(comName)
  const callback = evt.$Q.createSWDLCallback((handle, msg) => {
    console.log('handle:', handle)
    console.log('msg:', msg)
  })

  try {
    const [h] = await evt.$Q.connectServerSahara(iComPort, false, 5000, null)
    await evt.$Q.QPHONEMS_SaharaConfigureCallback(h, callback)
    await evt.$Q.flashProgrammer(h, 'd:\\dev\\images\\prog_emmc_firehose_8909_ddr.mbn')
    evt.$Q.disconnectSahara(h)
  } catch (err) {
    evt.sender.send('testResult', err.message)
  }

  try {
    const h = await evt.$Q.connectFireHose(iComPort, 5000)
    await evt.$Q.QPHONEMS_FireHoseConfigureCallback(h, callback)
    await evt.$Q.backupNVFromMobileToQCN(h, 'd:\\dev\\qcn.txt')
    evt.$Q.disconnectFireHose(h)
  } catch (err) {
    evt.sender.send('testResult', err.message)
  }

  evt.sender.send('testResult', 'end')
}

const readICCID = (evt, comName) => {
  connectForTest(evt, comName, async (h) => {
    let buf = Buffer.alloc(8)
    buf[0] = 0x80
    buf[1] = 0X21
    buf[2] = 0x00
    buf[3] = 0xFA
    buf[4] = 0x0A
    buf[5] = 0x00
    buf[6] = 0x00
    buf[7] = 0x00
    const rsp = await evt.$Q.send(h, buf, 1000)
    console.log(rsp.length, rsp)

    const r = await evt.$Q.MMGSDI_CLIENT_ID_AND_EVT_REG_CMD(h)
    console.log(r)
    // evt.sender.send('testResult', ret ? 'YES' : 'NO')
  })
}

export default {
  testVersionInfo,
  testDaigKeyPress,
  testSendSync,
  testIsFTMMode,
  testEnterFTM,
  testReportPhoneState,
  testAT,
  testDownload,
  readICCID
}
