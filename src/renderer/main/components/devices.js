import React from 'react'
import PropTypes from 'prop-types'
import { message, Progress, Tooltip, Icon } from 'antd'
import electron, { remote } from 'electron'
import IconFont from './iconfont'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import store from '../store'

const { dialog } = remote

const colorList = [
  '#006064',
  '#00838f',
  '#0097a7',
  '#00acc1',
  '#00bcd4',
  '#1b5e20',
  '#2e7d32',
  '#388e3c'
]

class ItemLabel extends React.PureComponent {
  render () {
    return (
      <div className="device-label" style={{...this.props.style}}>
        <div className={this.props.hover ? 'card-item device-prop-hoveable' : 'card-item'}>
          <div className="device-prop-i-normal"><IconFont type={this.props.icon}/></div>
          {this.props.hover && <div className="device-prop-i-hover"><IconFont type={this.props.hover}/></div>}
          {this.props.children}
        </div>
      </div>
    )
  }
}

ItemLabel.propTypes = {
  children: PropTypes.any,
  hover: PropTypes.string,
  icon: PropTypes.string,
  style: PropTypes.object
}

class DeviceCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      unlocking: false
    }
  }

  render () {
    return (
      <div className="card-box" style={{backgroundColor: colorList[this.props.dev.devIndex % colorList.length]}}>
        {
          this.props.dev.edl &&
            <div className="device-prop" style={{width: 150}}>
              <Progress percent={30} strokeWidth={40}/>
            </div>
        }
        {this.props.dev.vendor && <ItemLabel icon="shopping"> {this.props.dev.vendor}</ItemLabel>}
        {this.props.dev.version && <ItemLabel icon="info"> {this.props.dev.version}</ItemLabel>}
        {this.props.dev.imei && <ItemLabel icon="imei"> {this.props.dev.imei}</ItemLabel>}

        {
          Object.keys(this.props.dev.serials).map(com =>
            this.props.dev.serials[com].edl ? (
              <ItemLabel key={com} icon="msnui-usb-bold"> {com}</ItemLabel>) : (
              <Tooltip key={com} title="explore EFS" placement="bottom"><div onClick={() => this.exploreEFS(com)}>
                <ItemLabel icon="msnui-usb-bold" hover="folder"> {com}</ItemLabel></div>
              </Tooltip>)
          )
        }

        {
          this.props.dev.type === 'device' &&
            <Tooltip title="explore AP" placement="bottom">
              <div onClick={this.exploreAP}>
                <ItemLabel icon="android" hover="folder"/>
              </div>
            </Tooltip>
        }

        {
          this.props.dev.type === 'offline' &&
            <ItemLabel icon="android" style={{color: 'grey', borderColor: 'grey'}}/>
        }

        {
          this.props.dev.type === 'unauthorized' &&
            <ItemLabel icon="android" style={{color: 'red', borderColor: 'red'}}/>
        }

        {
          this.state.unlocking && this.props.dev.locked &&
            <div className="device-label">
              <div className="card-item">
                <div className="device-prop-i-normal"><Icon type="sync" spin/></div>
              </div>
            </div>
        }

        {
          this.props.dev.locked && !this.state.unlocking &&
            <Tooltip title="unlock this device" placement="bottom">
              <div onClick={this.unlock}>
                <ItemLabel icon="locked" hover="unlocked"/>
              </div>
            </Tooltip>
        }

        {
          !this.props.dev.locked &&
            <ItemLabel icon="unlocked"/>
        }
      </div>
    )
  }

  exploreEFS = (com) => {
    const req = store.getState().fs.req
    req.preview = null

    if (req.device !== com || req.system !== 'efs') {
      req.device = com
      req.path = '/'
      req.system = 'efs'
    }
    store.dispatch({type: 'fs/updateReq', req})
    store.dispatch({type: 'app/switchPage', page: 'fs'})
  }

  exploreAP = () => {
    const req = store.getState().fs.req
    req.preview = null

    if (req.device !== this.props.dev.id || req.system !== 'adb') {
      req.device = this.props.dev.id
      req.path = '/'
      req.system = 'adb'
    }
    store.dispatch({type: 'fs/updateReq', req})
    store.dispatch({type: 'app/switchPage', page: 'fs'})
  }

  unlock = () => {
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm',
      message: '解锁手机?'
    }, (response) => {
      if (response === 0) { // Runs the following if 'Yes' is clicked
        this.setState({unlocking: true})
        electron.ipcRenderer.send('unlockDevice', this.props.dev.id)
      }
    })
  }
}

DeviceCard.propTypes = {
  dev: PropTypes.object
}

class Devices extends React.Component {
  render () {
    return (
      <div className="dev-list">
        {
          this.props.devices.map(dev => (
            <DeviceCard key={dev.devIndex} dev={dev}/>
          ))
        }
      </div>
    )
  }
}

Devices.propTypes = {
  devices: PropTypes.array
}

function mapStates (state) {
  return {
    devices: state.devices.deviceList
  }
}

export default injectIntl(connect(mapStates)(Devices), {
  withRef: true
})

export function registerDevicesEvents (intl) {
  // sync devices
  electron.ipcRenderer.send('syncDevices')

  electron.ipcRenderer.on('deviceChange', (evt, popdev, options) => {
    let handled = false
    let devices = []
    const state = store.getState().devices

    for (const dev of state.deviceList) {
      if (!handled && popdev.id === dev.id) {
        handled = true

        if (options.disappear) {
          // skip this device
          continue
        }

        // update the device
        for (let k in dev) {
          if (!(k in popdev)) {
            popdev[k] = dev[k]
          }
        }
        devices.push(popdev)
      } else {
        devices.push(dev)
      }
    }

    // let newPopong = false
    if (!handled && !options.disappear) {
      devices.push(popdev)
      // newPopong = true
      message.success(intl.formatMessage({id: 'devices.new-device'}))
    }

    store.dispatch({type: 'devices/updateDevices', devices})

    // update file system
    const req = store.getState().fs.req
    if (req.system === 'adb') {
      if (req.device === options.disappearAdb || req.device === options.populateAdb) {
        store.dispatch({type: 'fs/increaseReloads'})
      }
    } else if (req.system === 'efs') {
      if (req.device === options.disappearCOM || req.device === options.populateCOM) {
        store.dispatch({type: 'fs/increaseReloads'})
      }
    }
  })
}

export function unregisterDevicesEvents () {
  electron.ipcRenderer.removeAllListeners('deviceChange')
}
