import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Timeline, Tabs, Icon, Button, Badge, Progress, Tag } from 'antd'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import electron, { remote } from 'electron'
import store from '../store'

const { dialog } = remote

const TabPane = Tabs.TabPane

let parsedTree = {}

class TreeNode extends React.PureComponent {
  click = () => {
    if (this.props.item.children) {
      this.props.item.Collapsed = this.props.expanded
      updateNode(this.props.item)
      store.dispatch({type: 'qspr/updateTestTree', tree: parsedTree})
    }
  }

  render () {
    let titleClass = 'test-item-prop test-name'
    let icon
    if (this.props.item.children) {
      icon = this.props.expanded ? 'folder-open' : 'folder'
    }
    if (this.props.status === 'Failed') {
      titleClass += ' test-error'
      if (!icon) icon = 'warning'
    } else if (this.props.status === 'Passed') {
      titleClass += ' test-success'
      if (!icon) icon = 'check-circle'
    } else if (this.props.status === 'Running') {
      titleClass += ' test-running'
      if (!icon) icon = 'loading'
    } else {
      if (!icon) icon = 'info-circle'
    }

    return (
      <div className={titleClass} onClick={this.click}>
        <Icon type={icon}/> {this.props.item.TestName}
        {this.props.runs > 1 ? <Badge count={this.props.runs}/> : ''}
      </div>
    )
  }
}

TreeNode.propTypes = {
  item: PropTypes.object,
  status: PropTypes.string,
  expanded: PropTypes.bool,
  runs: PropTypes.number
}

class TestTree extends React.PureComponent {
  render () {
    if (this.props.item.children && this.props.expanded) {
      return (
        <div>
          <div className="testcase-box">
            <div style={{width: this.props.indent * 50}}/>
            <TreeNode item={this.props.item} status={this.props.item.Status} expanded={this.props.expanded} runs={this.props.item.runs}/>
          </div>
          {this.props.item.children.map(subitem => <TestTree key={subitem.TestIndex} updates={subitem.updates} indent={this.props.indent + 1} item={subitem} expanded={!subitem.Collapsed}/>)}
        </div>
      )
    } else {
      return (
        <div className="testcase-box">
          <div style={{width: this.props.indent * 50}}/>
          <TreeNode item={this.props.item} status={this.props.item.Status} expanded={this.props.expanded} runs={this.props.item.runs}/>
        </div>
      )
    }
  }
}

TestTree.propTypes = {
  item: PropTypes.object,
  indent: PropTypes.number,
  expanded: PropTypes.bool,
  updates: PropTypes.number
}

class TestTimeline extends React.PureComponent {
  render () {
    const items = []

    const walkTree = (item) => {
      if (item.Unchecked) return
      if (!item.children) {
        let color = 'gray'
        if (item.Status === 'Failed') {
          color = 'red'
        } else if (item.Status === 'Passed') {
          color = 'green'
        } else if (item.Status === 'Running') {
          color = 'yellow'
        }
        let text = [<span key="first"><b>{item.TestName}</b>   </span>]
        if (item.Duration) {
          text.push(<Tag color="#2db7f5">{item.Duration.slice(0, 8)}</Tag>)
        }
        if (item.outputs) {
          text = text.concat(item.outputs.map((a, i) => (<Tag key={i} color="#2db7f5">{a.name} : {a.value}</Tag>)))
        }

        if (item.runs > 1) {
          items.push(
            <Timeline.Item key={item.TestIndex} dot={<Badge count={item.runs} style={{backgroundColor: color}}/>}>
              {text}
            </Timeline.Item>
          )
        } else {
          items.push(
            <Timeline.Item key={item.TestIndex} color={color}>
              {text}
            </Timeline.Item>
          )
        }
      } else {
        item.children.forEach(subitem => walkTree(subitem))
      }
    }

    if (this.props.testTree.children) {
      walkTree(this.props.testTree)
    }

    return (
      <Timeline style={{marginLeft: 20}}>
        <Timeline.Item dot={<Icon type='check-circle' style={{color: 'green'}}/>}>
          <Tag color="#87d068">{this.props.caseRuns} / {this.props.caseCount}</Tag>
        </Timeline.Item>
        {items}
      </Timeline>
    )
  }
}

TestTimeline.propTypes = {
  testTree: PropTypes.object,
  updates: PropTypes.number,
  caseRuns: PropTypes.number,
  caseCount: PropTypes.number,
  progressStatus: PropTypes.string
}

class QSPR extends React.Component {
  executeXTT = () => {
    if (this.props.isExecuting) {
      electron.ipcRenderer.send('stopXTT', this.props.executeOptions)
    } else {
      dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{name: 'XTT file', extensions: ['xtt']}]
      }, filePaths => {
        if (!filePaths) {
          return
        }
        electron.ipcRenderer.send('executeXTT', filePaths[0], this.props.runnCount)
      })
    }
  }

  renderExtra () {
    return (
      <div>
        <Button type="primary" shape="circle" icon={this.props.isExecuting ? 'pause' : 'folder-open'} style={{marginRight: 20}} onClick={this.executeXTT}/>
      </div>
    )
  }

  render () {
    return (
      <div>
        <Tabs
          defaultActiveKey="list"
          activeKey={this.props.viewType}
          tabBarExtraContent={this.renderExtra()}
          onChange={this.props.setViewType}>
          <TabPane tab={<Icon type="branches"/>} key="tree">
            <TestTree indent={0} updates={this.props.testTree.updates} item={this.props.testTree} expanded={!this.props.testTree.Collapsed}/>
          </TabPane>
          <TabPane tab={<Icon type="bars" />} key="list">
            <this.renderTimeline/>
          </TabPane>
          <TabPane tab={<Icon type="pie-chart" />} key="progress">
            <this.renderProgress/>
          </TabPane>
        </Tabs>
      </div>
    )
  }

  renderTimeline = () => {
    return (
      <TestTimeline 
        testTree={this.props.testTree} 
        updates={this.props.testTree.updates}
        progressStatus={this.props.progressStatus[0]} 
        caseRuns={this.props.runners[0].caseRuns}
        caseCount={this.props.runners[0].caseCount}/>
    )
  }

  renderProgress = () => {
    const mutiRunns = []
    for (let i = 1; i < this.props.runnCount && i < this.props.runners.length; i++) {
      mutiRunns.push(
        <Row key={i}>
          <Col span={3}/>
          <Col span={21}>
            <Progress percent={this.props.progressPercent[i]} status={this.props.progressStatus[i]} strokeWidth={20}/>
          </Col>
        </Row>
      )
    }
    return (
      <div>
        <Progress type="circle" percent={this.props.progressPercent[0]} status={this.props.progressStatus[0]} format={percent => `${this.props.runners[0].caseRuns}/${this.props.runners[0].caseCount}`} />
        {this.props.runners[0].statusText}
        <Row style={{marginTop: 20}}>
          <Col span={3}>
            <Button disabled={this.props.isExecuting} type="primary" shape="circle" icon="plus" size="small" style={{marginLeft: 5}} onClick={() => store.dispatch({type: 'qspr/increaseRunCount'})}/>
            <Button disabled={this.props.isExecuting} type="primary" shape="circle" icon="minus" size="small" style={{marginLeft: 5}} onClick={() => store.dispatch({type: 'qspr/decreaseRunCount'})}/>
          </Col>
          <Col span={21}>
            <Progress percent={this.props.progressPercent[0]} status={this.props.progressStatus[0]} strokeWidth={20}/>
          </Col>
        </Row>
        {mutiRunns}
      </div>
    )
  }
}

QSPR.propTypes = {
  executeOptions: PropTypes.array,
  setExecuteOptions: PropTypes.func,
  setViewType: PropTypes.func,
  runners: PropTypes.array,
  testTree: PropTypes.object,
  isExecuting: PropTypes.bool,
  viewType: PropTypes.string,
  intl: PropTypes.object,
  progressStatus: PropTypes.array,
  progressPercent: PropTypes.array,
  runnCount: PropTypes.number
}

function mapStates (state) {
  return {
    executeOptions: state.qspr.executeOptions,
    testTree: state.qspr.testTree,
    runners: state.qspr.runners,
    runnCount: state.qspr.runnCount,
    isExecuting: (() => {
      for (const k in state.qspr.runners) {
        if (state.qspr.runners[k].isExecuting) return true
      }
      return false
    })(),
    viewType: state.qspr.viewType,
    progressStatus: state.qspr.runners.map(r => {
      if (r.result === 'Passed') return 'success'
      else if (r.result === 'Failed') return 'exception'
      else return 'active'
    }),
    progressPercent: state.qspr.runners.map(r => {
      if (r.caseCount === 0) return 0
      return Math.floor((r.caseRuns * 100) / r.caseCount)
    })
  }
}

function mapDispatchs (dispatch) {
  return {
    setExecuteOptions: (value) => dispatch({type: 'qspr/setExecuteOptions', value}),
    setViewType: (value) => dispatch({type: 'qspr/setViewType', value})
  }
}

export default injectIntl(connect(mapStates, mapDispatchs)(QSPR), {
  withRef: true
})

// local state
let parserTickCount = 0
let parseStack = []

function updateNode (node) {
  node.updates++
  if (node._parent) {
    updateNode(node._parent)
  }
}

export function registerXttEvents () {
  electron.ipcRenderer.on('xttRunError', (evt, msg) => {
    alert('QIA component not installed')
  })

  electron.ipcRenderer.on('xttParseStart', (evt, path) => {
    parserTickCount = 0
    store.dispatch({type: 'qspr/resetTestCases', path})
    parsedTree = {}
    parseStack = []
  })

  electron.ipcRenderer.on('xttParseFolder', (evt, props) => {
    props.children = []
    props.updates = 0
    if (parseStack.length === 0) {
      props.Collapsed = false
      parsedTree = props
    } else {
      const parent = parseStack[parseStack.length - 1]
      props._parent = parent
      parent.children.push(props)
      updateNode(parent)
    }
    parseStack.push(props)

    parserTickCount++
    if (parserTickCount > 100) {
      parserTickCount = 0
      store.dispatch({type: 'qspr/updateTestTree', tree: parsedTree})
    }
  })

  electron.ipcRenderer.on('xttParseFolderClose', (evt) => {
    parseStack.pop()
  })

  electron.ipcRenderer.on('xttParseTest', (evt, props) => {
    if (parseStack.length > 0) {
      const parent = parseStack[parseStack.length - 1]
      props.runs = 0
      props._parent = parent
      props.updates = 0
      parent.children.push(props)
      updateNode(parent)
    }

    parserTickCount++
    if (parserTickCount > 100) {
      parserTickCount = 0
      store.dispatch({type: 'qspr/updateTestTree', tree: parsedTree})
    }
  })

  electron.ipcRenderer.on('xttParseRootName', (evt, name) => {
    parsedTree.TestName = name
    updateNode(parsedTree)
    store.dispatch({type: 'qspr/updateTestTree', tree: parsedTree})
  })

  electron.ipcRenderer.on('xttRunMsg', (evt, id, type, msg) => {
    onXTTMessage({state: store.getState().qspr, dispatch: store.dispatch}, id, type, msg)
  })
}

export function unregisterXttEvents () {
  electron.ipcRenderer.removeAllListeners('xttRunError')
  electron.ipcRenderer.removeAllListeners('xttParseStart')
  electron.ipcRenderer.removeAllListeners('xttParseFolder')
  electron.ipcRenderer.removeAllListeners('xttParseFolderClose')
  electron.ipcRenderer.removeAllListeners('xttParseTest')
  electron.ipcRenderer.removeAllListeners('xttParseRootName')
  electron.ipcRenderer.removeAllListeners('xttRunMsg')
}

let followStack = []

const onXTTMessage = ({ state, dispatch }, id, type, msg) => {
  const runner = state.runners[id]

  if (type === 'unit_end') {
    runner.result = msg.TestResult
    runner.isExecuting = false
  } else if (type === 'unit_start') {
    runner.isExecuting = true
    runner.caseRuns = 0
    runner.caseCount = msg.TestCount
    runner.result = ''

    if (id === 0) {
      if (state.xttPath === msg.xttPath) {
        // reset tree
        const reset = (node) => {
          node.Status = ''
          if (node.children) {
            node.children.forEach(subnode => reset(subnode))
          } else {
            node.runs = 0
            node.TestResult = ''
          }
        }

        reset(parsedTree)
      } else {
        parsedTree = {}
      }

      followStack = []
    }
  } else if (type === 'folder_start') {
    if (id === 0) {
      let existNode

      if (followStack.length === 0) {
        if (parsedTree.TestName === msg.TestName) {
          existNode = parsedTree
          if (!existNode.children) {
            existNode.children = []
          }
        }
      } else {
        const [parent, markpos] = followStack[followStack.length - 1]
        for (let i = markpos; i < parent.children.length; i++) {
          const node = parent.children[i]
          if (node.TestName === msg.TestName && node.children) {
            existNode = node
            followStack[followStack.length - 1][1] = i + 1
            break
          }
        }
      }

      if (!existNode) {
        existNode = msg
        msg.children = []
        msg.updates = 0
        if (followStack.length === 0) {
          msg.Collapsed = false
          parsedTree = msg
        } else {
          const [parent] = followStack[followStack.length - 1]
          msg._parent = parent
          if (!msg.TestIndex) {
            msg.TestIndex = Date.now() + msg.TestName
          }
          parent.children.push(msg)
        }
      } else {
        Object.assign(existNode, msg)
      }

      followStack.push([existNode, 0])

      existNode.Status = 'Running'
      updateNode(existNode)
    }
  } else if (type === 'folder_end') {
    if (id === 0) {
      const [node] = followStack.pop()
      node.runs++
      node.Status = msg.Status
      updateNode(node)
    }
    runner.statusText = msg.TestName
  } else if (type === 'test_start') {
    if (id === 0) {
      if (followStack.length > 0) {
        let existNode
        const [parent, markpos] = followStack[followStack.length - 1]
        for (let i = markpos; i < parent.children.length; i++) {
          const node = parent.children[i]
          if (node.TestName === msg.TestName && !node.children) {
            existNode = node
            break
          }
        }

        if (!existNode) {
          existNode = msg
          msg.runs = 0
          msg._parent = parent
          msg.updates = 0
          parent.children.push(msg)
        }

        existNode.Status = 'Running'
        updateNode(existNode)
      }
    }
  } else if (type === 'test_result') {
    runner.caseRuns++
    runner.statusText = msg.TestName

    if (id === 0) {
      if (followStack.length > 0) {
        let existNode
        const [parent, markpos] = followStack[followStack.length - 1]
        for (let i = markpos; i < parent.children.length; i++) {
          const node = parent.children[i]
          if (node.TestName === msg.TestName && !node.children) {
            existNode = node
            break
          }
        }

        if (existNode) {
          Object.assign(existNode, msg)

          let outputs = []
          for (const k in msg) {
            if (k.indexOf('OutputParam_') === 0) {
              const vname = k.slice(12)
              outputs.push({name: vname, value: msg[k]})
            }
          }
          existNode.outputs = outputs
          existNode.runs++
          updateNode(existNode)
        }
      }
    }
  }

  if (id === 0) {
    dispatch({type: 'qspr/updateTestTree', tree: parsedTree})
  }
  dispatch({type: 'qspr/updateRunner', id: id, runner})
}
