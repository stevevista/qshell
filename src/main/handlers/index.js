import { ipcMain } from 'electron'

const files = require.context('.', true, /\.js$/)

let hooks = []

function addEventHook (hook) {
  hooks.push(hook)
}

function hookEvent (evt) {
  for (let hook of hooks) {
    hook(evt)
  }
}

files.keys().forEach(key => {
  if (key === './index.js') return
  const handlers = files(key).default
  for (let evtname in handlers) {
    ipcMain.on(evtname, (evt, ...args) => {
      hookEvent(evt)
      handlers[evtname](evt, ...args)
    })
  }
})

export {
  addEventHook
}
