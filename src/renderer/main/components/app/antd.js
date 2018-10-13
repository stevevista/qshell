import React from 'react'
import { Steps, Icon } from 'antd'

const Step = Steps.Step

/* eslint react/display-name: 0 */
export default [
  {
    path: 'antd-steps',
    component: () => (
      <Steps>
        <Step status="finish" title="Login" icon={<Icon type="user" />} />
        <Step status="finish" title="Verification" icon={<Icon type="solution" />} />
        <Step status="process" title="Unlock" icon={<Icon type="loading" />} />
        <Step status="wait" title="Done" icon={<Icon type="smile-o" />} />
      </Steps>
    ),
    label: 'Steps'
  }
]
