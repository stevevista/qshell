import React from 'react'
import electron from 'electron'
import { Button } from 'antd'
import IconFont from './iconfont'

export default class Settings extends React.Component {
  render () {
    return (
      <div>
        <div style={{margin: 10}}>
          <Button shape='circle' type='primary' icon='fire'
            onClick={ () => { electron.ipcRenderer.send('open-d3-window') } }/>
        </div>
        <div style={{margin: 10}}>
          <Button shape='circle' type='primary' icon='ant-design'/>
        </div>
        <div style={{margin: 10}}>
          <Button shape='circle' type='primary'
            onClick={ () => { electron.ipcRenderer.send('open-vue-window') } }>
            <IconFont type='vue'/>
          </Button>
        </div>
      </div>
    )
  }
}
