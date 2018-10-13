import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { remote } from 'electron'
const { BrowserWindow } = remote

const minimizeWindow = () => {
  const window = BrowserWindow.getFocusedWindow()
  window.minimize()
}

const closeWindow = () => {
  const window = BrowserWindow.getFocusedWindow()
  window.close()
}

function Buttons (props) {
  if (process.platform !== 'darwin') {
    const buttonStyle = {
      WebkitAppRegion: 'no-drag',
      fontSize: props.height * 0.55,
      cursor: 'pointer',
      marginLeft: 2
    }
    return (
      <div>
        <i className="iconfont icon-minus-circled" style={buttonStyle} onClick={minimizeWindow}></i>
        <i className="iconfont icon-closecircled" style={buttonStyle} onClick={closeWindow}></i>
      </div>
    )
  } else {
    return (<div></div>)
  }
}

function WindowsBar (props) {
  return (
    <div style={{
      WebkitAppRegion: 'drag',
      display: 'flex',
      height: props.height,
      zIndex: 100,
      verticalAlign: 'center'
    }} id="windows-bar">
      <span style={{
        fontSize: props.height * 0.45,
        textAlign: 'center',
        width: '100%',
        verticalAlign: 'center',
        marginTop: 3
      }}>
        {props.title || 'Bella'}
      </span>
      <div style={{float: 'right', marginRight: 10, marginTop: 3}}>
        <Buttons height={props.height}/>
      </div>
    </div>
  )
}

function mapStates (state) {
  return {
    title: state.windowsBar.title
  }
}

WindowsBar.propTypes = {
  height: PropTypes.number,
  title: PropTypes.string
}

WindowsBar.defaultProps = {
  height: 30
}

export default connect(mapStates)(WindowsBar)
