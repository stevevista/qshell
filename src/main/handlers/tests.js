import { Notification } from 'electron'
import { startProcess } from '../processes'

const openNotify = (evt) => {
  const notification = new Notification({
    title: 'Message from APP',
    body: 'Got good news'
  })
  notification.show()
}

const testProcess = (evt) => {
  const ls = startProcess('test', 'abc')
  ls.on('message', (data) => {
    console.log(`stdout: ${data}`)
    evt.sender.send('testProcess', data)
  })
}

export default {
  openNotify,
  testProcess
}
