import '../../assets/fonts/iconfont'
import React from 'react'
import PropTypes from 'prop-types'

function IconFont (props) {
  return (
    <i className="anticon">
      <svg className="icon" aria-hidden="true">
        <use xlinkHref={`#icon-${props.type}`}></use>
      </svg>
    </i>
  )
}

IconFont.propTypes = {
  type: PropTypes.string.isRequired
}

export default IconFont
