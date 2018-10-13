import { remote } from 'electron'
import _ from 'lodash'
import pages from './pages'
import './style.css'
const { Menu, getCurrentWindow } = remote

// set menus
const menu = Menu.buildFromTemplate([
  {
    label: 'D3',
    submenu: [].concat(
      pages.map(page => ({ 
        id: page,
        type: 'radio',
        label: _.startCase(page),
        click: () => selectPage(page)
      })),
      [
        { type: 'separator' },
        { label: 'Exit', click () { getCurrentWindow().close() }, accelerator: 'X' }
      ]
    )
  }
])

getCurrentWindow().setMenu(menu)


document.body.setAttribute('style', 'overflow: hidden')

const div = document.createElement('div')
div.setAttribute('style', 'height: 100vh; overflow-y: hidden')
document.getElementById('app').appendChild(div)

const div1 = document.createElement('div')
div1.setAttribute('class', 'svg-container')
div.appendChild(div1)

let selectedPage

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey) {
    if (event.keyCode === 37 || event.keyCode === 38) {
      
      let index = 0
      for (let i = 0; i < pages.length; i++) {
        if (pages[i] === selectedPage) {
          index = i
          break
        }
      }
      index--
      if (index < 0) index = pages.length - 1
      selectPage(pages[index])

    } else if (event.keyCode === 39 || event.keyCode === 40) {

      let index = 0
      for (let i = 0; i < pages.length; i++) {
        if (pages[i] === selectedPage) {
          index = i
          break
        }
      }
      index++
      if (index >= pages.length) index = 0
      selectPage(pages[index])
      
    }
  }
})

function clean () {
  while (div1.firstChild) {
    div1.removeChild(div1.firstChild)
  }
}

function selectPage (page) {
  const Page = require('./pages/' + page).default
  clean()
  Page(div1)
  document.title = _.startCase(page)
  menu.getMenuItemById(page).checked = true
  selectedPage = page
}

selectPage(pages[0])
