import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import electron from 'electron'
import path from 'path'
import filesize from 'filesize'
import moment from 'moment'
import { Breadcrumb, Tooltip } from 'antd'
import IconFont from './iconfont'
import store from '../store'

function base64 (name) {
  return window.btoa(unescape(encodeURIComponent(name)))
}

const Action = (props) => {
  return (
    <Tooltip placement="bottom" title={props.title}>
      <button className={`action${props.selected ? ' selected' : ''}`} aria-label={props.title} onClick={props.onClick}>
        <IconFont type={props.icon}/>
        <span>{props.title}</span>
      </button>
    </Tooltip>
  )
}

Action.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func
}

class FileItem extends React.PureComponent {
  render () {
    let icon
    const {path: url, isDir, name, isSelected, type, size, mtime} = this.props
    const extension = path.extname(url).toLowerCase()
    const isImage = ['.png', '.jpg', '.gif'].includes(extension)

    if (isDir) icon = 'folder'
    else if (extension === '.pdf') icon = 'pdf'
    else if (extension === '.gif') icon = 'icon-gif'
    else if (isImage) icon = 'icon-insertphoto'
    else if (type === 'audio') icon = 'icon-audiotrack'
    else if (type === 'video') icon = 'icon-videocam'
    else icon = 'insertdrivefile'

    return (
      <div className="item"
        role="button"
        tabIndex={0}
        data-dir={isDir}
        aria-label={name}
        aria-selected={isSelected}
        onClick={this.props.onClick}
        onDoubleClick={this.props.onDbClick}>
        <div>
          <IconFont type={icon}/>
        </div>
        <div>
          <p className="name">{name}</p>
          {isDir ? <p className="size" data-order="-1">&mdash;</p> : <p className="size" data-order={filesize(size)}>{filesize(size)}</p>}
          <p className="modified">
            <time dateTime={mtime}>{moment(mtime).fromNow()}</time>
          </p>
        </div>
      </div>
    )
  }
}

FileItem.propTypes = {
  isDir: PropTypes.bool,
  isLink: PropTypes.bool,
  isSelected: PropTypes.bool,
  name: PropTypes.string,
  path: PropTypes.string,
  index: PropTypes.number,
  type: PropTypes.string,
  size: PropTypes.number,
  mtime: PropTypes.any,
  onClick: PropTypes.func,
  onDbClick: PropTypes.func
}

class PreviewLayout extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      uri: '',
      encoding: null
    }

    const {path: url} = this.props.req.preview
    this.extension = path.extname(url).toLowerCase()
    this.isImage = ['.png', '.jpg', '.gif'].includes(this.extension)
  }

  render () {
    return (
      <div id="previewer">
        <div className="bar">
          <button onClick={this.props.onClose} className="action" title={this.props.intl.formatMessage({id: 'fs.closePreview'})} aria-label={this.props.intl.formatMessage({id: 'fs.closePreview'})} id="close">
            <i className="iconfont icon-close"></i>
          </button>
        </div>

        <div className="preview">
          {this.isImage && <img src={this.state.uri}/>}
          {this.extension === '.pdf' && <iframe className="pdf" type="application/pdf" src={this.state.uri}/>}
          {!(this.isImage) && <pre>{this.props.req.content}</pre>}
        </div>
      </div>
    )
  }

  componentDidMount () {
    electron.ipcRenderer.on('previewUri', (evt, uri) => {
      this.setState({uri})
    })

    electron.ipcRenderer.on('readContentData', (evt, chunk) => {
      let content = this.props.req.content
      if (!this.state.encoding) {
        this.setState({encoding: 'ascii'})
        for (let i = 0; i < 100; i++) {
          if (i >= chunk.length) {
            break
          }
          if (chunk[i] === 0) {
            this.setState({encoding: 'hex'})
            break
          }
        }
      }

      if (this.state.encoding === 'hex') content += chunk.toString('hex')
      else content += chunk.toString()

      this.props.updateReq({
        content
      })
    })

    if (this.isImage || this.extension === '.pdf') {
      electron.ipcRenderer.send('downloadToUri', this.props.req.system, this.props.req.device, this.props.req.preview)
    } else {
      electron.ipcRenderer.send('readContent', this.props.req.system, this.props.req.device, this.props.req.preview)
    }
  }

  componentWillUnmount () {
    electron.ipcRenderer.removeAllListeners('previewUri')
  }
}

PreviewLayout.propTypes = {
  onClose: PropTypes.func,
  updateReq: PropTypes.func,
  intl: PropTypes.object,
  req: PropTypes.object
}

function mapPreivewDispatchs (dispatch) {
  return {
    updateReq: (req) => dispatch({type: 'fs/updateReq', req})
  }
}

const Preview = injectIntl(connect(null, mapPreivewDispatchs)(PreviewLayout), {
  withRef: true
})

class FileBrowser extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchActive: false,
      searchOnGoing: false,
      isLoading: false,
      items: []
    }

    moment.locale(store.getState().app.locale)
  }
  renderSearch = () => {
    const cls = []
    if (this.state.searchActive) cls.push('active')
    if (this.state.searchOnGoing) cls.push('ongoing')
    return (
      <div id="search" click="open" className={cls.join(' ')}>
      </div>
    )
  }

  renderMain = () => {
    const Loading = (<h2 className="message"><span>{this.props.intl.formatMessage({id: 'fs.loading'})}</span></h2>)
    const NoFiles = (
      <h2 className="message">
        <i className="iconfont icon-notinterested"></i>
        <span>{this.props.intl.formatMessage({id: 'fs.nofile'})}</span>
      </h2>
    )
    const Browser = this.state.items.length === 0 ? NoFiles : this.renderBrowser()
    return (
      <div id="fileblock">
        {this.state.isLoading ? Loading : Browser}
      </div>
    )
  }

  renderBrowser = () => {
    const dirs = []
    const files = []

    this.state.items.forEach((item, index) => {
      item.index = index

      if (item.isDir) {
        dirs.push(item)
      } else {
        files.push(item)
      }
    })

    let cls = this.props.viewMode
    if (this.props.multiple) {
      cls += ' multiple'
    }
    return (
      <div id="listing" className={cls}>
        {dirs.length > 0 && <h2>{this.props.intl.formatMessage({id: 'fs.folders'})}</h2>}
        <div>
          {dirs.map(item =>
            <FileItem
              key={base64(item.name)}
              isDir={item.isDir}
              isLink={item.isLink}
              name={item.name}
              index={item.index}
              path={item.path}
              type={item.type}
              size={item.size}
              mtime={item.mtime}
              isSelected={this.props.selected.indexOf(item.index) !== -1}
              onClick={(e) => this.click(e, item)}
              onDbClick={() => this.open(item)}/>)}
        </div>
        {files.length > 0 && <h2>{this.props.intl.formatMessage({id: 'fs.files'})}</h2>}
        <div>
          {files.map((item, index) =>
            <FileItem
              key={base64(item.name)}
              isDir={item.isDir}
              isLink={item.isLink}
              name={item.name}
              index={item.index}
              path={item.path}
              type={item.type}
              size={item.size}
              mtime={item.mtime}
              isSelected={this.props.selected.indexOf(item.index) !== -1}
              onClick={(e) => this.click(e, item)}
              onDbClick={() => this.open(item)}/>)}
        </div>
      </div>
    )
  }

  renderBreadcrumbs = () => {
    let parts = this.props.req.path.split('/')

    if (parts[0] === '') {
      parts.shift()
    }

    if (parts[parts.length - 1] === '') {
      parts.pop()
    }

    let parents = []
    let current = ''

    for (let i = 0; i < parts.length - 1; i++) {
      if (i === 0) {
        parents.push({ name: parts[i], url: '/' + parts[i] })
      } else {
        parents.push({ name: parts[i], url: parents[i - 1].url + '/' + parts[i] })
      }
    }

    if (parts.length > 0) {
      current = parts[parts.length - 1]
    }

    return (
      <div style={{display: 'flex'}}>
        <Breadcrumb>
          <Breadcrumb.Item href={null} onClick={() => store.dispatch({type: 'app/switchPage', page: 'devices'})}>
            <IconFont type="mobile"/>{this.props.req.device}
          </Breadcrumb.Item>
          <Breadcrumb.Item href={null} onClick={() => this.request({path: '/'})}>
            <IconFont type="sd"/>
          </Breadcrumb.Item>
          {parents.map(({name, url}, i) => (
            <Breadcrumb.Item key={i} onClick={() => this.request({path: url})} href={null}>
              <span>{name}</span>
            </Breadcrumb.Item>
          ))}
          <Breadcrumb.Item>
            {current}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  }

  renderAction = () => {
    return (
      <header>
        <this.renderSearch/>
        <div>
          {!this.state.isLoading && [
            <Action key="viewMode"
              title={this.props.intl.formatMessage({id: 'fs.switchView'})}
              icon={this.props.viewMode === 'mosaic' ? 'viewlist' : 'viewmodule'}
              onClick={this.toggleViewMode}/>,
            <Action key="multiple"
              title={this.props.intl.formatMessage({id: this.props.multiple ? 'fs.cancel-multiple' : 'fs.set-multiple'})}
              icon="checkcircle" selected={this.props.multiple} onClick={this.openSelect}/>
          ]}
        </div>
      </header>
    )
  }
  render () {
    return (
      <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
        <this.renderAction/>
        <this.renderBreadcrumbs/>
        <div style={{height: '100%', flex: 1, overflowY: 'auto', overflowX: 'hidden'}}>
          <this.renderMain/>
        </div>
        {this.props.req.preview && <Preview req={this.props.req} onClose={() => this.props.updateReq({preview: null})}/>}
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.reloads > this.props.reloads) {
      this.request()
    }
    return true
  }

  componentDidMount () {
    electron.ipcRenderer.on('readDirRsp', (evt, files) => {
      this.setState({
        items: files,
        isLoading: false
      })
    })

    this.request()
  }

  componentWillUnmount () {
    electron.ipcRenderer.removeAllListeners('readDirRsp')
  }

  request (req) {
    const reqs = {...this.props.req, ...req, preview: null}
    electron.ipcRenderer.send('readDir', reqs.path, reqs.system, reqs.device)
    this.setState({
      isLoading: true
    })
    if (req) {
      this.props.updateReq(reqs)
    }
  }

  toggleViewMode = () => {
    this.props.setViewMode(this.props.viewMode === 'mosaic' ? 'list' : 'mosaic')
  }

  openSelect = () => {
    this.props.setMultiple(!this.props.multiple)
  }

  open = (item) => {
    if (item.isDir || item.isLink) {
      this.request({path: item.path})
    } else if (item.type === 'file') {
      this.props.updateReq({
        preview: {
          path: item.path,
          name: item.name,
          size: item.size,
          mtime: item.mtime
        },
        content: ''
      })
    }
  }

  click = (event, item) => {
    const {selected, multiple} = this.props
    if (selected.length !== 0) event.preventDefault()
    if (selected.indexOf(item.index) !== -1) {
      this.props.removeSelected(item.index)
      return
    }

    if (event.shiftKey && selected.length === 1) {
      let fi = 0
      let la = 0

      if (item.index > selected[0]) {
        fi = selected[0] + 1
        la = item.index
      } else {
        fi = item.index
        la = selected[0] - 1
      }

      for (; fi <= la; fi++) {
        this.props.addSelected(fi)
      }

      return
    }

    if (!event.ctrlKey && !multiple) this.props.resetSelected()
    this.props.addSelected(item.index)
  }
}

FileBrowser.propTypes = {
  intl: PropTypes.object,
  req: PropTypes.object,
  multiple: PropTypes.bool,
  updateReq: PropTypes.func,
  setViewMode: PropTypes.func,
  setMultiple: PropTypes.func,
  viewMode: PropTypes.string,
  reloads: PropTypes.number,
  selected: PropTypes.array,
  removeSelected: PropTypes.func,
  addSelected: PropTypes.func,
  resetSelected: PropTypes.func
}

function mapStates (state) {
  return {
    req: state.fs.req,
    multiple: state.fs.multiple,
    selected: state.fs.selected,
    viewMode: state.fs.viewMode,
    reloads: state.fs.reloads
  }
}

function mapDispatchs (dispatch) {
  return {
    updateReq: (req) => dispatch({type: 'fs/updateReq', req}),
    setViewMode: (value) => dispatch({type: 'fs/setViewMode', value}),
    setMultiple: (value) => dispatch({type: 'fs/setMultiple', value}),
    removeSelected: (value) => dispatch({type: 'fs/removeSelected', value}),
    addSelected: (value) => dispatch({type: 'fs/addSelected', value}),
    resetSelected: () => dispatch({type: 'fs/resetSelected'})
  }
}

export default injectIntl(connect(mapStates, mapDispatchs)(FileBrowser), {
  withRef: true
})
