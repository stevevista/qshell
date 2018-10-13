import { dialog, app } from 'electron'
import fs from 'fs'
import pull from '../../fs/pull'
import path from 'path'

function fileUrl (str) {
  let pathName = path.resolve(str).replace(/\\/g, '/')

  // Windows drive letter must be prefixed with a slash
  if (pathName[0] !== '/') {
    pathName = '/' + pathName
  }

  return encodeURI('file://' + pathName)
}

const downloadFiles = (evt, items, system, devid) => {
  if (items.length === 1 && items[0].type === 'file') {
    dialog.showSaveDialog({
      defaultPath: items[0].name
    }, (filename) => {
      if (filename) {
        downloadTo(evt, items, system, devid, filename, false)
      }
    })
  } else {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, (filePaths) => {
      if (filePaths) {
        downloadTo(evt, items, system, devid, filePaths[0], true)
      }
    })
  }
}
/*
// if item is a directory, then create it
function locateTarget (item, dest, destIsDir) {
  return new Promise((resolve, reject) => {
    if (!destIsDir) {
      resolve(dest)
    } else {
      const pathname = path.join(dest, item.name)
      if (item.isDir) {
        fs.mkdir(pathname, err => {
          if (err) reject(err)
          else resolve(pathname)
        })
      } else {
        resolve(pathname)
      }
    }
  })
}

function copyItem (item, dest, destIsDir) {
  return locateTarget(item, dest, destIsDir)
    .then(pathname => {
    })
}
*/
async function downloadTo (evt, items, system, devid, dest, destIsDir) {
  for (let item of items) {
    if (!item.isDir && item.type === 'file') {
      let dst = dest
      let srcpath = item.path
      if (destIsDir) {
        dst = path.join(dest, item.name)
      }
      await copyLocal(evt, srcpath, dst, system, devid)
    }
  }
}

async function copyLocal (evt, src, dst, system, id) {
  let rs = await pull(src, { system, id, adb: evt.$adb })

  await new Promise((resolve, reject) => {
    let ws = fs.createWriteStream(dst)

    ws.on('error', err => { reject(err) })

    rs.on('data', chunk => {
      if (ws.write(chunk) === false) {
        rs.pause()
      }
    })

    ws.on('drain', () => {
      rs.resume()
    })

    rs.on('end', () => {
      ws.end()
      resolve()
    })

    rs.on('error', err => { reject(err) })
  })
}

const downloadToUri = async (evt, system, id, item) => {
  const dst = path.join(app.getPath('temp'), item.name)
  const uri = fileUrl(dst)
  await copyLocal(evt, item.path, dst, system, id)
  evt.sender.send('previewUri', uri)
}

export default {
  downloadFiles,
  downloadToUri
}
