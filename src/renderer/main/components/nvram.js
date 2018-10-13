import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tag, Icon, InputNumber } from 'antd'
import { connect } from 'react-redux'
import electron from 'electron'
import colorList from './utils/colors'
import {pickPortFromDevices} from './utils/utils'

class Nvram extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      items: [
        {id: 453},
        {id: 550, desc: 'IMEI', type: 'hex', size: 9},
        {id: 3252, desc: 'SPC Unlock count', size: 16},
        {id: 85, desc: 'SPC Code', type: 'hex', size: 6}
      ],
      customId: 0,
      customValue: null
    }
  }

  render () {
    if (!this.props.port) {
      return <div>No device connected</div>
    }

    return (
      <div style={{margin: 20}}>
        <div className="view-title">
          {this.props.port.comName} - {this.props.port.manufacturer} - {this.props.port.productId} {this.props.port.edl ? '(EDL)' : '' }
        </div>
        {
          this.state.items.map((item, i) =>
            <Row key={i} style={{margin: 7}}>
              <Col span={8}>
                <Tag color={colorList[i % colorList.length]}>{item.id}</Tag>
                {item.desc && <Tag color={colorList[i % colorList.length]}>{item.desc}</Tag>}
              </Col>
              <Col>
                {
                  item.value === undefined ? (
                    <Icon type="eye" onClick={() => { this.getNvValue(item) }}/>) : (
                    <span>{item.value}</span>)
                }
              </Col>
            </Row>
          )
        }
        <Row style={{margin: 7}}>
          <Col span={8}>
            <InputNumber size="small" min={0} max={100000} defaultValue={this.state.customId} onChange={this.onChange} />
          </Col>
          <Col>
            {
              this.state.customValue === null ? (
                <Icon type="eye" onClick={() => { this.getNvValue({id: this.state.customId, type: 'hex', size: 32}) }}/>) : (
                <span>{this.state.customValue}</span>)
            }
          </Col>
        </Row>
      </div>
    )
  }

  componentDidMount () {
    electron.ipcRenderer.on('queryNvitemAck', (evt, rsp) => {
      if (rsp.id === this.state.customId) {
        this.setState({
          customValue: rsp.value
        })
        return
      }

      const items = this.state.items
      for (const item of items) {
        if (item.id === rsp.id) {
          item.value = rsp.value
          this.setState({items})
          break
        }
      }
    })
  }

  componentWillUnmount () {
    electron.ipcRenderer.removeAllListeners('queryNvitemAck')
  }

  getNvValue = (item) => {
    electron.ipcRenderer.send('queryNvitem', this.props.port.comName, item)
  }

  onChange = (value) => {
    this.setState({
      customId: value,
      customValue: null
    })
  }
}

Nvram.propTypes = {
  port: PropTypes.object
}

function mapStates (state) {
  return {
    port: pickPortFromDevices(state)
  }
}

export default connect(mapStates)(Nvram)
