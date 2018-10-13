import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col, Radio, Switch, Button} from 'antd'
import { injectIntl } from 'react-intl'
import pkg from '@/../../package.json'
import { connect } from 'react-redux'
import {locales} from '../locales'
import db from '@/../db'
import electron from 'electron'

class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      adb: db.get('adb').value() || false,
      serial: db.get('groupBySerial').value() || false,
      qpst: db.get('useQPST').value() || false,
      log: db.get('logLevel').value() || 'warn'
    }
  }
  render () {
    const titleStyle = {float: 'right', marginRight: 10}
    const rowStyle = {marginBottom: 15}

    return (
      <div style={{margin: 10}}>
        <Row style={rowStyle}>
          <Col span={8}>
            <span style={titleStyle}>{this.props.intl.formatMessage({id: 'settings.about'})}</span>
          </Col>
          <Col span={15}>
            Bella {pkg.version} - JLQ, authed by R.J. Powered by Electron + React
          </Col>
        </Row>

        <Row style={rowStyle}>
          <Col span={8}>
            <span style={titleStyle}>{this.props.intl.formatMessage({id: 'settings.language'})}</span>
          </Col>
          <Col span={15}>
            <Radio.Group defaultValue={this.props.locale} buttonStyle="solid" size="small" onChange={this.changeLocale}>
              {
                Object.keys(locales).map(key =>
                  <Radio.Button key={key} value={key}>{locales[key].title}</Radio.Button>
                )
              }
            </Radio.Group>
          </Col>
        </Row>

        <Row style={rowStyle}>
          <Col span={8}>
            <span style={titleStyle}>{this.props.intl.formatMessage({id: 'settings.adb'})}</span>
          </Col>
          <Col span={15}>
            <Switch checked={this.state.adb} onChange={this.handleAdbSwitch}/>
          </Col>
        </Row>

        <Row style={rowStyle}>
          <Col span={8}>
            <span style={titleStyle}>{this.props.intl.formatMessage({id: 'settings.devSerial'})}</span>
          </Col>
          <Col span={15}>
            <Switch checked={this.state.serial} onChange={this.handleDevSerialSwitch}/>
          </Col>
        </Row>

        <Row style={rowStyle}>
          <Col span={8}>
            <span style={titleStyle}>{this.props.intl.formatMessage({id: 'settings.useQpst'})}</span>
          </Col>
          <Col span={15}>
            <Switch checked={this.state.qpst} onChange={this.handleQPSTSwitch}/>
          </Col>
        </Row>

        <Row style={rowStyle}>
          <Col span={8}>
            <span style={titleStyle}>{this.props.intl.formatMessage({id: 'settings.logLevel'})}</span>
          </Col>
          <Col span={15}>
            <Radio.Group defaultValue={this.state.log} buttonStyle="solid" size="small" onChange={this.handleLogLevelChange}>
              <Radio.Button value="error">Error</Radio.Button>
              <Radio.Button value="warn">Warning</Radio.Button>
              <Radio.Button value="info">Info</Radio.Button>
              <Radio.Button value="verbose">Verbose</Radio.Button>
              <Radio.Button value="debug">Debug</Radio.Button>
              <Radio.Button value="silly">Silly</Radio.Button>
            </Radio.Group>
            <Button type="primary" shape="circle" icon="folder-open" style={{marginLeft: 20}} size="small" onClick={this.openLogLcation}/>
          </Col>
        </Row>

      </div>
    )
  }

  changeLocale = (e) => {
    const localeValue = e.target.value
    this.props.setLocale(localeValue)
  }

  handleAdbSwitch = (adb) => {
    db.read().set('adb', adb).write()
    this.setState({adb})
  }

  handleDevSerialSwitch = (serial) => {
    db.read().set('groupBySerial', serial).write()
    this.setState({serial})
  }

  handleQPSTSwitch = (qpst) => {
    db.read().set('useQPST', qpst).write()
    this.setState({qpst})
    electron.ipcRenderer.send('switchQPST', qpst)
  }

  handleLogLevelChange = (e) => {
    const log = e.target.value
    db.read().set('logLevel', log).write()
    this.setState({log})
    electron.ipcRenderer.send('switchLogLevel', log)
  }

  openLogLcation = () => {
    electron.ipcRenderer.send('openLogLocation')
  }
}

Settings.propTypes = {
  locale: PropTypes.string,
  intl: PropTypes.object,
  setLocale: PropTypes.func
}

function mapStates (state) {
  return {
    locale: state.app.locale
  }
}

function mapDispatchs (dispatch) {
  return {
    setLocale: (locale) => dispatch({type: 'app/setLocale', locale})
  }
}

export default injectIntl(connect(mapStates, mapDispatchs)(Settings), {
  withRef: true
})
