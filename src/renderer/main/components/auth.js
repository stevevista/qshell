import React from 'react'
import PropTypes from 'prop-types'
import { Tabs, message } from 'antd'
import electron from 'electron'
const TabPane = Tabs.TabPane

export default class Settings extends React.Component {
  render () {
    return (
      <div style={{overflowY: 'auto'}}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
            <p>aaa</p>
            <p>aaa</p>
            <p>aaa</p>
            <p>aaa</p>
            <p>aaa</p>
            <p>aaa</p>
            <p>aaa</p>
            <p>aaa</p>
          </TabPane>
          <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
        </Tabs>
      </div>
    )
  }

  componentDidMount () {
    electron.ipcRenderer.on('userAuthResult', (evt, res) => {
      if (res.success) {
        this.props.onAuthed()
      } else {
        if (res.message) {
          message.error(res.message)
        }
      }
    })

    electron.ipcRenderer.send('checkUserAuth')
  }

  componentWillUnmount () {
    electron.ipcRenderer.removeAllListeners('userAuthResult')
  }
}

Settings.propTypes = {
  onAuthed: PropTypes.func
}
