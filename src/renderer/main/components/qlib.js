import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Spin } from 'antd'
import electron from 'electron'
import QMSLTest from './qmslTest'
import colorList from './utils/colors'
import {pickPortFromDevices} from './utils/utils'

class QLib extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isExecuting: false
    }
  }
  render () {
    if (!this.props.port) {
      return <div>No device connected</div>
    }

    return (
      <div>
        <Spin spinning={this.state.isExecuting}>
          <div className="view-title">
            {this.props.port.comName} - {this.props.port.manufacturer} - {this.props.port.productId} {this.props.port.edl ? '(EDL)' : '' }
          </div>
          {
            QMSLTest.map((mod, index) => (
              <div key={index} className="card-box" style={{backgroundColor: colorList[index % colorList.length]}}>
                <div className="card-item test-item-prop prop-title"><i className="iconfont icon-info"> {mod.name} </i></div>
                {
                  mod.tests.map((t, i) => (
                    <Button key = {i} type="primary" size="small" style={{marginLeft: 10}} onClick={() => this.runTest(t.cmd)}>
                      {t.name}
                    </Button>
                  ))
                }
              </div>
            ))
          }
        </Spin>
      </div>
    )
  }

  runTest = (cmd) => {
    this.setState({
      isExecuting: true
    })
    electron.ipcRenderer.send(cmd, this.props.port.comName)
  }

  componentDidMount () {
    electron.ipcRenderer.on('testResult', (evt, msg) => {
      this.setState({
        isExecuting: false
      })
      alert(msg)
    })
  }

  componentWillUnmount () {
    electron.ipcRenderer.removeAllListeners('testResult')
  }
}

QLib.propTypes = {
  port: PropTypes.object
}

function mapStates (state) {
  return {
    port: pickPortFromDevices(state)
  }
}

export default connect(mapStates)(QLib)
