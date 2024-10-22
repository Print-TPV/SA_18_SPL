import React from 'react'
import { observer } from 'mobx-react-lite'
import { Icon } from '$core-components'
import './InfoMessage.scss'

const InfoMessage = ({ type, messages }) => messages?.map?.(({ message }) => (
  <div className="cart-item-message">
    <Icon name={`${type}.svg`} width="12px" height="12px"/>
    <p className={type}>{message}</p>
  </div>
))

export default observer(InfoMessage)
