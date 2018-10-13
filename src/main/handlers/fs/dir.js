import readdir from '../../fs/readdir'
import pull from '../../fs/pull'

const readDir = (evt, path, system, id) => {
  readdir(path, { system, id, adb: evt.$adb, Q: evt.$Q })
    .then(files => {
      evt.sender.send('readDirRsp', files)
    })
    .catch(err => {
      console.log(err)
      evt.sender.send('readDirRsp', [])
    })
}

const readContent = async (evt, system, id, item) => {
  let transfer = await pull(item.path, { system, id, adb: evt.$adb, Q: evt.$Q })

  if (!transfer.on) {
    evt.sender.send('readContentData', transfer)
  } else {
    transfer.on('data', chunk => {
      evt.sender.send('readContentData', chunk)
    })
  }

  /*
  pull(item.path, {
    system,
    id,
    adb: evt.$adb,
    data: chunk => {
      evt.sender.send('readContentData', chunk)
    }
  })
    .catch(err => {
      console.log(err)
      evt.sender.send('readContentError', err)
    })
    */
}

export default {
  readDir,
  readContent
}
