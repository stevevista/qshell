import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Layout, Menu, Badge, Icon } from 'antd'
import { injectIntl } from 'react-intl'
import IconFont from '../iconfont'
import store from '../../store'
import { registerDevicesEvents, unregisterDevicesEvents } from '../devices'
import { registerXttEvents, unregisterXttEvents } from '../qspr'

import menusItems from './items'
import antdItems from './antd'

const { Content, Sider } = Layout

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false
    }
  }

  toggle = (key) => {
    if (this.props.selectedPage === key) {
      this.setState({
        collapsed: !this.state.collapsed
      })
    }
  }

  onMenuSelect = ({key}) => {
    store.dispatch({type: 'app/switchPage', page: key})
  }

  selectMenu = (key) => {
    this.onMenuSelect({key})
  }

  componentDidMount () {
    registerXttEvents()
    registerDevicesEvents(this.props.intl)
  }

  componentWillUnmount () {
    unregisterXttEvents()
    unregisterDevicesEvents()
  }

  renderMenuItem (item) {
    const Tag = item.icon
    const key = item.path
    if (item.path === 'devices') {
      const count = this.props.deviceList.length
      if (count > 0) {
        return (
          <Menu.Item key={key} onClick={() => this.toggle(key)}>
            <Badge count={count} offset={[0, 8]} style={{ minWidth: 10, fontSize: 10 }} className="anticon">
              <Tag type={item.iconType}/>
            </Badge>
            <span>{item.messageId ? this.props.intl.formatMessage({id: item.messageId}) : item.label}</span>
          </Menu.Item>
        )
      }
    }
    return (
      <Menu.Item key={key} onClick={() => this.toggle(key)}>
        <Tag type={item.iconType}/>
        <span>{item.messageId ? this.props.intl.formatMessage({id: item.messageId}) : item.label}</span>
      </Menu.Item>
    )
  }

  render () {
    return (
      <Layout style={{height: '100%'}}>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <Menu theme="dark" defaultSelectedKeys={[menusItems[0].path]} selectedKeys={[this.props.selectedPage]} mode="inline" onSelect={this.onMenuSelect}>
            {menusItems.map(item => this.renderMenuItem(item))}

            <Menu.SubMenu key="antd" title={<span><Icon type="ant-design" /><span>ANTD</span></span>}>
              {
                antdItems.map(item => (
                  <Menu.Item key={item.path} onClick={() => this.toggle(item.path)}>
                    <IconFont type="videocam"/>
                    <span>{item.label}</span>
                  </Menu.Item>
                ))
              }
            </Menu.SubMenu>
          </Menu>
        </Sider>
        <Content>
          {
            menusItems.filter(item => item.path === this.props.selectedPage)
              .map(item =>
                <item.component key={item.path}/>
              )
          }
          {
            antdItems.filter(item => item.path === this.props.selectedPage)
              .map(item =>
                <item.component key={item.path}/>)
          }
        </Content>
      </Layout>
    )
  }
}

App.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  setBarTitle: PropTypes.func,
  deviceList: PropTypes.array,
  intl: PropTypes.object,
  selectedPage: PropTypes.string
}

function mapStates (state) {
  return {
    deviceList: state.devices.deviceList,
    selectedPage: state.app.selectedPage
  }
}

function mapDispatchs (dispatch) {
  return {
    setBarTitle: (title) => dispatch({type: 'windowsBar/setTitle', title})
  }
}

export default injectIntl(connect(mapStates, mapDispatchs)(App), {
  withRef: true
})
